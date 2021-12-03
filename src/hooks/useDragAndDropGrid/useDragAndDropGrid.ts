import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { DroppableRowContentType } from "../../constants";
import { addValue, addValues, changeOrder, changeValue, getEmptyIndexes } from "./utils";

export const useDragAndDropGrid = (initialRows: DroppableRowContentType[][], columnsCount: number) => {
  const [dataRows, setDataRows] = useState<Array<Array<DroppableRowContentType>>>(initialRows);
  const [activeIndexes, setActiveIndexes] = useState<{ rowIndex: number, index: number } | null>(null);

  const activeItem = activeIndexes ? dataRows[activeIndexes.rowIndex][activeIndexes.index] : null;

  const getNewRow = (key: DroppableRowContentType = null, columns: number = 1, index = 0) => {
    const newRow: DroppableRowContentType[] = [];
    let slots = 0;

    for (let i = 0; i < columnsCount; i++) {
      if (i >= index && slots < columns) {
        newRow.push(key);
        slots++;
      } else {
        newRow.push(null);
      }
    }

    return newRow;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active?.data.current?.rowIndex == null  || active?.data.current?.index == null) {
      return;
    }

    setActiveIndexes({ rowIndex: active.data.current.rowIndex, index: active.data.current.index });
  };

  const handleDragCancel = () => {
    setActiveIndexes(null);
  };

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    const { rowIndex: activeRowIndex, index: activeIndex } = activeIndexes || {};
 
    setActiveIndexes(null);

    if (!over || activeRowIndex == null || activeIndex == null || activeItem == null) {
      return;
    }

    const activeColumns = active.data.current?.columns;
    const overSide = over.data.current?.side;

    const { rowIndex, index } = over.data.current || {};
    const sameRow = rowIndex === activeRowIndex;
    const newRows = dataRows.slice();

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
      // Перенос внутри строки
      if (sameRow && (overSide === 'right' || overSide === 'left')) {
        newRows[rowIndex] = changeOrder(newRows[rowIndex], activeIndex, index, activeColumns);

      // Перенос в пространство между строк
      } else if (overSide.includes('top') || overSide.includes('bottom')) {
          const targetRowIndex = overSide.includes('top') ? rowIndex : rowIndex + 1;
          const newRow = getNewRow(activeItem, activeColumns, index);

          // Очищаем значение в строке, из которой перенесён элемент
          newRows[activeRowIndex] = changeValue(newRows[activeRowIndex], null, activeIndex, activeColumns);

          // Добавляем новую строчку
          newRows.splice(targetRowIndex, 0, newRow);

      //Перенос из одной строки в другую
      } else {
        const targetIndex = overSide === 'right' ? index + 1 : index;
        const { row, extraItems } = addValue(newRows[rowIndex], activeItem, activeColumns, targetIndex);

        newRows[rowIndex] = row;

        // Очищаем значение в строке, из которой перенесён элемент
        newRows[activeRowIndex] = changeValue(newRows[activeRowIndex], null, activeIndex, activeColumns);

        if (extraItems.length) {
          // Добавление не уместившихся элементов
          let nextRow = newRows[rowIndex + 1] ? newRows[rowIndex + 1] : getNewRow();
          const emptySlots = getEmptyIndexes(nextRow).length;

          // Если в следующей строке достаточно пустых мест, добавляем в неё
          if (emptySlots >= extraItems.length) {
            newRows[rowIndex + 1] = addValues(nextRow, extraItems, 0);
          } else {
            // Иначе дополняем элементы пустыми слотами и вставляем под целевую строку
            for (let i = 0; i < columnsCount - extraItems.length; i++) {
              extraItems.push(null);
            }

            newRows.splice(rowIndex + 1, 0, extraItems);
          }
        }
      }
    }

    setDataRows(newRows.filter((row) => row.some((item) => item !== null)));
  };

  const handleDelete = (rowIndex: number, index: number, columns: number) => {
    const newRows = dataRows.slice();
    
    if (columns === columnsCount) {
      newRows.splice(rowIndex, 1);
    } else {
      newRows[rowIndex] = changeValue(newRows[rowIndex], null, index, columns);;
    }

    setDataRows(newRows.filter((row) => row.some((item) => item !== null)));
  };

  // just for demo
  const addItem = (key: DroppableRowContentType, columns: number) => {
    const newRows = dataRows.slice();
    
    if (columns === 2 || !newRows.length) {
      const newRow = getNewRow(key, columns);
      newRows.unshift(newRow);
    } else {
      const newItem = Array(columns).fill(key);
      const targetRow = newRows[0].slice();

      targetRow.splice(2, 0, ...newItem);

      let removedEmptyCount = 0;

      const newTargetRow = targetRow.reduceRight<DroppableRowContentType[]>((row, item) => {
        if (item === null && removedEmptyCount < columns) {
          removedEmptyCount++;
          return row;
        }

        row.unshift(item);

        return row;
      }, [])

      const extraItems = newTargetRow.splice(columnsCount);
      newRows[0] = newTargetRow;

      if (extraItems.length) {
        let newRow = getNewRow();
        const emptySlots = newRow.reduce((count, item) => item === null ? count + 1 : count, 0);

        if (emptySlots >= extraItems.length) {
          newRow.unshift(...extraItems);
          let slotsToRemove = extraItems.length;

          newRow = newRow.filter((item) => {
            if (item === null && slotsToRemove) {
              slotsToRemove--;
              return false;
            }
            
            return true;
          });

          newRows.splice(0, 0, newRow);
        }
      }
    }

    setDataRows(newRows.filter((row) => row.some((item) => item !== null)));
  }

  return {
    dataRows,
    activeIndexes,
    activeItem,
    handleDragStart,
    handleDragEnd,
    handleDelete,
    handleDragCancel,
    addItem,
  };
};
