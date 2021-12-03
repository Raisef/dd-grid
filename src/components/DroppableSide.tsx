import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styled from 'styled-components/macro';


const getAreaColor = ({ isOver }: { isOver?: boolean }) => isOver && `
  background: yellow;
  box-shadow: 0px 0px 3px 3px #e0e310;
`;

const DropableArea = styled.div<{ isOver?: boolean; }>`
  width: 100%;
  height: 100%;
  ${getAreaColor};
`;


type Props = {
  zoneId: string;
  canDrop?: boolean;
  className?: string;
  data?: Record<string, unknown>;
};

export const Droppable = ({ zoneId, canDrop = true, className, data }: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: zoneId,
    disabled: !canDrop,
    data: { ...data, zoneId },
  });

  return (
    <DropableArea className={className} ref={setNodeRef} isOver={isOver} id={zoneId} />
  );
}
