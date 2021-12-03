import { DndContext, DragOverlay } from '@dnd-kit/core';
import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';

import { DroppableRow } from './components/DroppableRow';
import { Item } from './components/Item';
import { initialRows, DroppableRowContentType, DroppablesMap, GRID_COLUMNS_COUNT } from './constants';
import { useDragAndDropGrid } from './hooks';

const AppContainer = styled.div`
  margin: 0 auto;

  * {
    box-sizing: border-box;
  }
`;

const Wrapper = styled.div`
  width: 70%;
  margin: 0 auto;
`;

const getUnusedItems = (rows: DroppableRowContentType[][]) => {
  const map = { ...DroppablesMap };

  rows.forEach((row) => {
    row.forEach((item) => {
      if (item !== null) {
        delete map[item];
      }
    });
  });

  return Object.keys(map) as DroppableRowContentType[];
}

const AddingRow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 230px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  background: silver;
  padding: 10px;
  min-height: 53px;

  box-sizing: border-box;

  &:empty {
    visibility: hidden;
    pointer-events: none;
  }
`;

const AddItemButton = styled.button`
  margin-top: 24px;

  border-radius: 12px;
  border: 1px solid black;

  padding: 8px;

  cursor: pointer;
`;

function App() {
  const {
    activeItem,
    dataRows,
    handleDelete,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    addItem,
  } = useDragAndDropGrid(initialRows, GRID_COLUMNS_COUNT);

  return (
    <>
      <AddingRow>
        {getUnusedItems(dataRows).map((key) => (
          <AddItemButton onClick={() => addItem(key, DroppablesMap[key!].columns)}>+ {DroppablesMap[key!].content}: {DroppablesMap[key!].columns}</AddItemButton>
        ))}
      </AddingRow>
      <AppContainer className="App">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Wrapper>
            {dataRows.map((rowItems, rowIndex) => <GridRow onDelete={handleDelete} rowItems={rowItems} rowIndex={rowIndex} />)}
          </Wrapper>
          {createPortal(
            <DragOverlay
              adjustScale={false}
            >
              {activeItem ? (
                <Item columns={DroppablesMap[activeItem].columns} dragOverlay>{DroppablesMap[activeItem].content}</Item>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </AppContainer>
    </>
  );
}

export default App;

export const GridRow = ({ rowItems, rowIndex, onDelete }: { rowItems: DroppableRowContentType[], rowIndex: number, onDelete?: (rowIndex: number, index: number, columns: number) => void }) => {
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
        onDelete={onDelete}
      >
        <Item isEmpty={!itemKey} columns={itemKey ? DroppablesMap[itemKey].columns : 1}>{itemKey ? DroppablesMap[itemKey].content : 'EMPTY'}</Item>
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
