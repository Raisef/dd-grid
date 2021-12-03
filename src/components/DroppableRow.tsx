import React from 'react';
import styled from 'styled-components/macro';

import { DROPPABLE_AREA_PADDING, SIDE_AREA_SIZE } from '../constants';
import { createCompositeComponent } from '../utils';
import { useDndContext } from '@dnd-kit/core';
import { Droppable } from './DroppableSide';
import { DroppableRowContext } from './DroppableRowContext';
import { DroppableRowSlot } from './DroppableRowSlot';

const HorizontalDroppableContainer = styled.div<{ columns: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  grid-column-gap: ${SIDE_AREA_SIZE}px;
  height: ${SIDE_AREA_SIZE}px;
  padding: ${DROPPABLE_AREA_PADDING}px ${SIDE_AREA_SIZE}px;
  position: relative;
  box-sizing: border-box;
`

const DroppableContainer = styled.div<{ columns: number }>`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  grid-column-gap: ${SIDE_AREA_SIZE}px;
  padding: 0 ${SIDE_AREA_SIZE}px;
  position: relative;
  min-height: 150px;
  box-sizing: border-box;
`

type RowProps = {
  columns: number;
  index: number;
  emptyIndexes: number[];
};


const WideDroppableColumn = styled.div<{ columns: number }>`
  ${({ columns }) => `grid-column-start: span ${columns};`}
`

const HorizontalAreas = ({ columns, rowIndex, side }: { columns: number, rowIndex: number, side: 'top' | 'bottom' }) => {
  const { active } = useDndContext();

  const isActiveWide = active?.data?.current?.columns === columns;
  const areas: React.ReactNode[] = [];

  if (isActiveWide) {
    const prevActive = active?.data.current?.rowIndex === rowIndex - 1;
    const nextActive = active?.data.current?.rowIndex === rowIndex + 1;
    const isActive = active?.data.current?.rowIndex === rowIndex;

    const canDrop = !isActive && ((side === 'bottom' && !nextActive) || (side === 'top' && !prevActive));
  
    const wideId = `${rowIndex},0,${side},wide`;

    areas.push((
      <WideDroppableColumn columns={columns}>
        <Droppable canDrop={canDrop} key={wideId} zoneId={wideId} data={{ rowIndex, side }} />
      </WideDroppableColumn>
    ));
  } else {
    for (let i = 0; i < columns; i++) {
      const id = `${rowIndex},${i},${side}`;
      areas.push(<Droppable key={id} zoneId={id} data={{ rowIndex, index: i, side }} />);
    }
  }

  return <HorizontalDroppableContainer columns={columns}>{areas}</HorizontalDroppableContainer>;
};

const DroppableRowComponent = ({ columns, index, emptyIndexes, children }: React.PropsWithChildren<RowProps>) => {
  return (
    <DroppableRowContext.Provider value={{ rowIndex: index, rowColumns: columns, emptyIndexes }}>
      {index === 0 && (
        <HorizontalAreas columns={columns} rowIndex={index} side="top" />
      )}

      <DroppableContainer columns={columns}>
        {children}
      </DroppableContainer>

      <HorizontalAreas columns={columns} rowIndex={index} side="bottom" />
    </DroppableRowContext.Provider>
  );
};


export const DroppableRow = createCompositeComponent({
  component: DroppableRowComponent,
  nestedComponents: {
    Slot: {
      component: DroppableRowSlot,
    },
  },
});
