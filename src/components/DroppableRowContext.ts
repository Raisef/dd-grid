import React from "react";

type RowContextType = { rowIndex: number; rowColumns: number; emptyIndexes: number[]; };

export const DroppableRowContext = React.createContext<RowContextType>({ rowIndex: -1, rowColumns: 0, emptyIndexes: [] });
