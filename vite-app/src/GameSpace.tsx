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
      className={`flex items-center justify-center w-full h-full bg-orange-400 rounded cursor-pointer`}
    >
      {child}
    </div>
  );
};

export default GameSpace;
