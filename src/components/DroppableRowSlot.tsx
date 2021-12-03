import { useDndContext } from '@dnd-kit/core';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { DROPPABLE_AREA_PADDING, SIDE_AREA_SIZE } from '../constants';
import { Draggable } from './Draggable';
import { DroppableRowContext } from './DroppableRowContext';
import { Droppable } from './DroppableSide';

export type VerticalPosition = 'right' | 'left';

const getVerticalPosition = ({ side }: { side: VerticalPosition; }) => `
  box-sizing: border-box;
  padding: ${DROPPABLE_AREA_PADDING}px;
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${SIDE_AREA_SIZE}px;
  ${side}: -${SIDE_AREA_SIZE}px;
`;

const DroppablePosition = styled.div<{ side: VerticalPosition; }>`
  ${getVerticalPosition};
`;

const DroppableSlotContainer = styled.div<{ columns: number; }>`
  ${({ columns }) => columns > 1 && `grid-column-start: span ${columns};`}
  position: relative;
  height: 150px;
`

type SlotProps = {
  id: string;
  columns: number;
  index: number;
  isEmpty?: boolean;
  onDelete?: (rowIndex: number, index: number, columns: number) => void;
};

export const DroppableRowSlot = ({ id, columns, index, isEmpty, onDelete, children }: React.PropsWithChildren<SlotProps>) => {
  const { active } = useDndContext();
  const { rowIndex, rowColumns, emptyIndexes } = useContext(DroppableRowContext);

  const activeColumns = active?.data?.current?.columns;
  const isActiveWide = activeColumns === rowColumns;
  const isWide = columns === rowColumns;
  const isFirst = index === 0;
  const isLast = index + 1 === rowColumns;

  const { rowIndex: activeRowIndex, index: activeIndex } = active?.data.current || {};
  const isSameRow = activeRowIndex === rowIndex;
  const isSameIndex = activeIndex === index;
  const isSamePosition = isSameRow && isSameIndex;

  const isLeftSideEmpty = isLast && isEmpty;
  const isRightSideEmpty = isFirst && isEmpty;

  const canDropBase = !(isWide || isActiveWide || isSamePosition);
  const isPrevEmpty = emptyIndexes.includes(index - 1);

  const canDropLeft = canDropBase && !isLeftSideEmpty && (!isSameRow || index !== activeIndex + 1) && !isPrevEmpty;
  const canDropRight = canDropBase && !isRightSideEmpty && isLast && (isSameRow || emptyIndexes.length >= activeColumns);

  return (
    <DroppableSlotContainer columns={columns}>
      <DroppablePosition side="left">
        <Droppable zoneId={`${id}-left`} canDrop={canDropLeft} data={{ rowIndex: rowIndex, index, side: 'left' }} />
      </DroppablePosition>
      
      <Draggable data={{ rowIndex, index }} id={id} columns={columns}>
        {children}
      </Draggable>
      
      <DroppablePosition side="right">
        <Droppable zoneId={`${id}-right`} canDrop={canDropRight} data={{ rowIndex: rowIndex, index, side: 'right' }} />
      </DroppablePosition>
    </DroppableSlotContainer>
  );
}