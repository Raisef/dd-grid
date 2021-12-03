import React, { useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { useDraggable } from '@dnd-kit/core';

const DraggableContainer = styled.div<{ isDragging?: boolean; }>`
  width: 100%;
  height: 100%;
  cursor: grab;
  box-sizing: border-box;

  ${({ isDragging }) => {
    if (isDragging) {
      return css`
        opacity: 0.7;
      `;
    }

    return '';
  }}
`;

type ItemProps = {
  id: string;
  disabled?: boolean;
  columns: number;
  data?: Record<string, unknown>;
};

export const Draggable = ({ id, disabled, columns, data, children }: React.PropsWithChildren<ItemProps>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
  } = useDraggable({
    id,
    disabled,
    data: { ...data, id, columns }
  });

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    document.body.style.cursor = 'grabbing';

    return () => {
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <DraggableContainer
      ref={setNodeRef}
      isDragging={isDragging}
      {...listeners}
      {...attributes}
    >
      {children}
    </DraggableContainer>
  );
};
