import { useDroppable } from '@dnd-kit/core';

type Props = {
  child?: React.ReactNode;
  onClick?: () => void;
  position: {
    row: number;
    collumn: number;
  };
};

const GameSpace = ({ child, onClick, position }: Props) => {
  const { setNodeRef } = useDroppable({
    id: `game-space-${position.row}-${position.collumn}`,
  });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`flex items-center justify-center w-[200px] h-[200px] hover:bg-black/5 cursor-pointer`}
    >
      {child}
    </div>
  );
};

export default GameSpace;
