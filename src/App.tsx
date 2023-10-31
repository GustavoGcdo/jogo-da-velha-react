import { DndContext } from '@dnd-kit/core';
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
    if (game.hasWinner()) return `Jogador "${game.currentPlayer}" Ganhou!!`;
    return `Empate!!`;
  };

  return (
    <div>
      <div className={`flex items-center flex-col divide-y`}>
        {finishGame && (
          <div
            className={`${
              finishGame ? 'cursor-not-allowed' : ''
            } w-full h-full bg-black/60 absolute top-0 bottom-0 right-0`}
          >
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col gap-2 items-center bg-white p-10 rounded">
                <span className="mt-6 text-2xl mx-auto">Fim de jogo!</span>
                <span>{getFinishMessage()} </span>
                <button
                  onClick={resetGame}
                  className="bg-gray-500 text-white font-semibold w-fit p-2 px-6 rounded-lg text-lg block text-center mx-auto"
                >
                  Jogar de novo!
                </button>
              </div>
            </div>
          </div>
        )}

        <DndContext
          onDragEnd={(event) => {
            const [rowTo, collumnTo] = (event.over?.id as string).split('-').map(Number).slice(2);
            const [row, collumn] = (event.active?.id as string).split('-').map(Number).slice(1);
            move({ row, collumn }, { row: rowTo, collumn: collumnTo });
          }}
        >
          {gameSpaces.map((line, row) => (
            <div key={`row-${row}`} className="flex flex-row divide-x">
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
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default App;
