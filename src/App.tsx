import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import GameSpace from './GameSpace';
import PlayerSymbol from './PlayerSymbol';
import { Game, Position } from './game';

const game = new Game();

export const ItemTypes = {
  PLAYER_SYMBOL: 'playerSymbol',
};

function App() {
  const [gameSpaces, setGameSpaces] = useState(game.gameSpaces);
  const [finishGame, setFinishGame] = useState(false);
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (game.hasFinish()) {
      setFinishGame(true);
    }
  }, [gameSpaces]);

  const mark = (row: number, collumn: number) => {
    game.mark([row, collumn]);
    setGameSpaces([...game.gameSpaces]);
  };

  const move = (oldPosition: Position, newPosition: Position) => {
    console.log(oldPosition);
    console.log(newPosition);

    game.move(oldPosition, newPosition);
    setGameSpaces([...game.gameSpaces]);
  };

  const resetGame = () => {
    game.reset();
    setGameSpaces([...game.gameSpaces]);
    setFinishGame(false);
  };

  const getFinishMessage = () => {
    const winner = game.getWinner();
    if (winner) return  <span>Jogador <span className='font-bold'>{winner}</span> Ganhou!!</span>;
    return `Empate!!`;
  };

  return (
    <div className="bg-stone-100 py-4 px-3 w-screen h-screen">
      <div className="mx-auto w-fit my-4">
        <h2 className="text-2xl font-mono uppercase">
          Jogo da velha 3
          <span className="ml-2 text-sm align-text-top bg-black text-white rounded px-1">beta</span>
        </h2>
      </div>
      {finishGame && (
        <div
          className={`${
            finishGame ? 'cursor-not-allowed' : ''
          } w-screen h-screen bg-black/60 absolute top-0 bottom-0 right-0`}
        >
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center bg-white p-10 rounded">
              <span className="text-xl mx-auto">Fim de jogo!</span>
              <span className='text-2xl my-6'>{getFinishMessage()} </span>
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

      <div className="flex w-full items-center justify-center">
        <div className={`grid-tabuleiro gap-1 w-full items-center flex-col max-w-lg`}>
          <DndContext
            sensors={sensors}
            onDragEnd={(event) => {
              const [rowTo, collumnTo] = (event.over?.id as string).split('-').map(Number).slice(2);
              const [row, collumn] = (event.active?.id as string).split('-').map(Number).slice(1);
              move({ row, collumn }, { row: rowTo, collumn: collumnTo });
            }}
          >
            {gameSpaces.map((line, row) => (
              // <div key={`row-${row}`} className="grid grid-cols-3 w-full h-full divide-x">
              <>
                {line.map((symbol, collumn) => (
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
                ))}
              </>
              // </div>
            ))}
          </DndContext>
        </div>
      </div>
      <div className="w-fit mx-auto mt-10">
        <h1 className="text-2xl">
          {' '}
          Vez de: <span className="font-bold">{game.currentPlayer}</span>
        </h1>
      </div>
    </div>
  );
}

export default App;
