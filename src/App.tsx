import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';

import { DroppableRow } from './components/DroppableRow';
import { Item } from './components/Item';
import { dataRows, DroppableRowContentType, DroppablesMap, GRID_COLUMNS_COUNT } from './constants';

const AppContainer = styled.div`
  margin: 0 auto;

  box-sizing: border-box;
`;

const Wrapper = styled.div`
  width: 70%;
`;

const getNewRow = (key: DroppableRowContentType = null, columns: number = 1, index = 0) => {
  const newRow: DroppableRowContentType[] = [];
  let slots = 0;
  for (let i = 0; i < GRID_COLUMNS_COUNT; i++) {
    if (i >= index && slots < columns) {
      newRow.push(key);
      slots++;
    } else {
      newRow.push(null);
    }
  }

  return newRow;
};

function App() {
  const [rows, setDataRows] = useState<Array<Array<DroppableRowContentType>>>(dataRows);
  const [activeIndexes, setActiveIndexes] = useState<{ rowIndex: number, index: number } | null>(null);

  const activeItemKey = activeIndexes ? rows[activeIndexes.rowIndex][activeIndexes.index] : null;

  const onDragStart = ({ active }: DragStartEvent) => {
    if (active?.data.current?.rowIndex == null  || active?.data.current?.index == null) {
      return;
    }

    setActiveIndexes({ rowIndex: active.data.current.rowIndex, index: active.data.current.index });
  };

  const onDragEnd = ({ over, active }: DragEndEvent) => {
    const { rowIndex: activeRowIndex, index: activeIndex } = activeIndexes || {};
 
    setActiveIndexes(null);

    if (!over || activeRowIndex == null || activeIndex == null || activeItemKey == null) {
      return;
    }

    const activeColumns = active.data.current?.columns;
    const overSide = over.data.current?.side;

    const { rowIndex, index } = over.data.current || {};
    const sameRow = rowIndex === activeRowIndex;
    const newRows = rows.slice();

    if (rowIndex == null || (index == null && sameRow) || (sameRow && activeIndex === index && (overSide === 'left' || overSide === 'right'))) {
      return;
    }

    if (index == null && !sameRow) {
      let targetIndex = rowIndex;

      if (overSide === 'bottom') {
        const k = activeRowIndex < rowIndex ? 0 : 1;
        
        targetIndex = rowIndex + k;
      }

      newRows.splice(targetIndex, 0, newRows.splice(activeRowIndex, 1)[0]);
    }
    
    if (index != null) {
      if (sameRow && (overSide === 'right' || overSide === 'left')) {
        const newRow = newRows[rowIndex].slice();

        newRow.splice(index, 0, newRow.splice(activeIndex, 1)[0]);

        newRows[rowIndex] = newRow;
      } else if (overSide.includes('top') || overSide.includes('bottom')) {
          const targetRowIndex = overSide.includes('top') ? rowIndex : rowIndex + 1;
          const newRow = getNewRow(activeItemKey, activeColumns, index);
          let newParentRow = newRows[activeRowIndex];

          if (activeColumns > 1) {
            newParentRow = newParentRow.fill(null, activeIndex, activeIndex + activeColumns - 1);
          } else {
            newParentRow[activeIndex] = null;
          }

          newRows[activeRowIndex] = newParentRow;
          newRows.splice(targetRowIndex, 0, newRow);
      } else {
        let targetRow = newRows[rowIndex].slice();
        const newItem = Array(activeColumns).fill(activeItemKey);
        targetRow.splice(overSide === 'right' ? index + 1 : index, 0, ...newItem);

        let removedEmptyCount = 0;

        const newTargetRow = targetRow.reduceRight<DroppableRowContentType[]>((row, item) => {
          if (item === null && removedEmptyCount < activeColumns) {
            removedEmptyCount++;
            return row;
          }

          row.unshift(item);

          return row;
        }, [])

        const extraItems = newTargetRow.splice(GRID_COLUMNS_COUNT);
        newRows[rowIndex] = newTargetRow;

        let newParentRow = newRows[activeRowIndex];
        if (activeColumns > 1) {
          newParentRow = newParentRow.fill(null, activeIndex, activeIndex + activeColumns - 1);
        } else {
          newParentRow[activeIndex] = null;
        }

        newRows[activeRowIndex] = newParentRow;

        if (extraItems.length) {
          let nextRow = newRows[rowIndex + 1] ? newRows[rowIndex + 1].slice() : getNewRow();
          const emptySlots = nextRow.reduce((count, item) => item === null ? count + 1 : count, 0);

          if (emptySlots >= extraItems.length) {
            nextRow.unshift(...extraItems);
            let slotsToRemove = extraItems.length;

            nextRow = nextRow.filter((item) => {
              if (item === null && slotsToRemove) {
                slotsToRemove--;
                return false;
              }
              
              return true;
            });

            newRows[rowIndex + 1] = nextRow;
          } else {
            for (let i = 0; i < GRID_COLUMNS_COUNT - extraItems.length; i++) {
              extraItems.push(null);
            }

            newRows.splice(rowIndex + 1, 0, extraItems);
          }
        }
      }
    }

    setDataRows(newRows.filter((row) => row.some((item) => item !== null)));
  };

  return (
    <AppContainer className="App">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveIndexes(null)}
      >
        <Wrapper>
          {rows.map((rowItems, rowIndex) => <GridRow rowItems={rowItems} rowIndex={rowIndex} />)}
        </Wrapper>
        {createPortal(
          <DragOverlay
            adjustScale={false}
          >
            {activeItemKey ? (
              <Item columns={DroppablesMap[activeItemKey].columns} dragOverlay>{DroppablesMap[activeItemKey].content}</Item>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </AppContainer>
  );
}

export default App;

export const GridRow = ({ rowItems, rowIndex}: { rowItems: DroppableRowContentType[], rowIndex: number }) => {
  const rowContent: React.ReactNode[] = [];

  for (let i = 0; i < rowItems.length; i++) {
    const itemKey = rowItems[i];
    const size = itemKey ? DroppablesMap[itemKey].columns : 1;

    rowContent.push(
      <DroppableRow.Slot
        columns={itemKey ? DroppablesMap[itemKey].columns : 1}
        id={itemKey || `${rowIndex}-${i}-empty`}
        key={`${rowIndex}-${i}-${itemKey}`}
        isEmpty={!itemKey}
        index={i}
      >
        <Item fake={!itemKey} columns={itemKey ? DroppablesMap[itemKey].columns : 1}>{itemKey ? DroppablesMap[itemKey].content : 'EMPTY'}</Item>
      </DroppableRow.Slot>
    );

    if (size > 1) {
      // Каждый шаг это один слот, добавляем недостающие слоты.
      i += size - 1;
    }
  }

  return (
    <DroppableRow
      key={rowIndex}
      columns={GRID_COLUMNS_COUNT}
      emptyIndexes={rowItems.reduce<number[]>((arr, item, index) => {
        if (item === null) {
          arr.push(index);
        }

        return arr;
      }, [])}
      index={rowIndex}
    >
      {rowContent}
    </DroppableRow>
  );
}
