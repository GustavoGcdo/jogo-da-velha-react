'use client';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { Game, Position } from '../core/game';
import GameSpace from './GameSpace';
import PlayerSymbol from './PlayerSymbol';

const game = new Game();

export const ItemTypes = {
  PLAYER_SYMBOL: 'playerSymbol',
};

const OnlineGame = () => {
  const [gameSpaces, setGameSpaces] = useState(game.gameSpaces);
  const [finishGame, setFinishGame] = useState(false);
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY || '', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('game-changes');

    channel.bind('game-move', (data: Game) => {
      console.log('eventdata', data);

      game.currentPlayer = data.currentPlayer;
      game.gameSpaces = data.gameSpaces;
      game.quantityX = data.quantityX;
      game.quantityO = data.quantityO;
      setGameSpaces(data.gameSpaces);
    });

    return () => {
      pusher.unsubscribe('game-move');
    };
  }, []);

  useEffect(() => {
    if (game.hasFinish()) {
      setFinishGame(true);
    }
  }, [gameSpaces]);

  const mark = async (row: number, collumn: number) => {
    const hasMarked = game.mark([row, collumn]);
    if (!hasMarked) return;

    await axios.post('/api/pusher', {
      currentPlayer: game.currentPlayer,
      quantityX: game.quantityX,
      quantityO: game.quantityO,
      gameSpaces: game.gameSpaces,
    });
  };

  const move = async (oldPosition: Position, newPosition: Position) => {
    const hasMoved = game.move(oldPosition, newPosition);
    if (!hasMoved) return;

    await axios.post('/api/pusher', {
      currentPlayer: game.currentPlayer,
      quantityX: game.quantityX,
      quantityO: game.quantityO,
      gameSpaces: game.gameSpaces,
    });
  };

  const resetGame = () => {
    game.reset();
    setGameSpaces([...game.gameSpaces]);
    setFinishGame(false);
  };

  const getFinishMessage = () => {
    const winner = game.getWinner();
    if (winner)
      return (
        <span>
          Jogador <span className="font-bold">{winner}</span> Ganhou!!
        </span>
      );

    const explicitWinner = game.explicitWinner;
    if (explicitWinner) {
      return (
        <span>
          <span className="font-bold">{explicitWinner}</span> Ganhou! Pois o tempo da jogada de
          <span className="font-semibold ml-2">{explicitWinner == 'X' ? 'O' : 'X'}</span> acabou e
          ele não jogou.
        </span>
      );
    }

    return `Empate!!`;
  };

  return (
    <div className="bg-stone-100 py-4 px-3 w-screen h-screen text-center">
      <div className="mx-auto w-fit my-4">
        <h2 className="text-2xl font-mono uppercase">
          Jogo da velha 3
          <span className="ml-2 text-sm align-text-top bg-black text-white rounded px-1">
            3.0 beta
          </span>
        </h2>
      </div>
      <div className="max-w-lg text-center bg-yellow-400 text-stone-700 p-3 py-4 my-4 mx-auto rounded">
        <h1 className="text-xl font-bold">Modo Online</h1>
        <span className="text-lg block">Jogue com seus amigos de qualquer lugar.</span>
      </div>

      {finishGame && (
        <div className={`w-screen h-screen bg-black/60 absolute top-0 bottom-0 right-0 z-10`}>
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center bg-white p-10 m-4 rounded">
              <span className="text-2xl font-bold mx-auto">Fim de jogo!</span>
              <span className="text-xl my-6">{getFinishMessage()} </span>
              <button
                onClick={resetGame}
                className="bg-orange-400 text-white font-semibold w-fit p-2 px-6 rounded-lg text-lg block text-center mx-auto"
              >
                Jogar de novo!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full max-w-[516px] mx-auto items-center justify-center relative">
        <div className={`grid-tabuleiro gap-1 w-full items-center flex-col max-w-lg`}>
          <DndContext
            sensors={sensors}
            onDragEnd={(event) => {
              const [rowTo, collumnTo] = (event.over?.id as string).split('-').map(Number).slice(2);
              const [row, collumn] = (event.active?.id as string).split('-').map(Number).slice(1);
              move({ row, collumn }, { row: rowTo, collumn: collumnTo });
            }}
          >
            {gameSpaces.map((line, row) =>
              line.map((symbol, collumn) => (
                <GameSpace
                  key={`key-${row}-${collumn}`}
                  position={{ row, collumn }}
                  child={
                    symbol ? (
                      <PlayerSymbol symbol={symbol} position={{ row, collumn }} />
                    ) : undefined
                  }
                  onClick={() => mark(row, collumn)}
                />
              )),
            )}
          </DndContext>
        </div>
      </div>
      <div className="w-fit mx-auto mt-6">
        <h3 className="text-2xl">
          Vez de: <span className="font-bold">{game.currentPlayer}</span>
        </h3>
      </div>
    </div>
  );
};

export default OnlineGame;
