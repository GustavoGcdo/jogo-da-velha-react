import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GameSymbol } from './game';

type Props = {
  symbol: GameSymbol;
  position: {
    row: number;
    collumn: number;
  };
};

const PlayerSymbol = ({ symbol, position }: Props) => {
  const { row, collumn } = position;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `symbol-${row}-${collumn}`,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div className={`flex items-center justify-center w-[100px] h-[100px] text-3xl`}>
        {symbol}
      </div>
    </div>
  );
};

export default PlayerSymbol;
