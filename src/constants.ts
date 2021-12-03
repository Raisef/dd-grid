export const SIDE_AREA_SIZE = 32;
export const DROPPABLE_AREA_SIZE = 9;
export const DROPPABLE_AREA_PADDING = (SIDE_AREA_SIZE - DROPPABLE_AREA_SIZE) / 2;

type MockItem = {
  id: string;
  columns: number;
  fake?: boolean;
};

export type MockData = MockItem[];

export const DroppablesMap = {
  'droppable-0': {
    content: 'droppable-0',
    columns: 2,
  },
  'droppable-1': {
    content: 'droppable-1',
    columns: 1,
  },
  'droppable-2': {
    content: 'droppable-2',
    columns: 1,
  },
  'droppable-3': {
    content: 'droppable-3',
    columns: 1,
  },
  'droppable-4': {
    content: 'droppable-4',
    columns: 2,
  },
  'droppable-5': {
    content: 'droppable-5',
    columns: 1,
  },
  'droppable-6': {
    content: 'droppable-6',
    columns: 1,
  },
  'droppable-7': {
    content: 'droppable-7',
    columns: 2,
  },
  'droppable-8': {
    content: 'droppable-8',
    columns: 1,
  },
  'droppable-9': {
    content: 'droppable-9',
    columns: 1,
  },
} as const;

export type DroppableType = keyof typeof DroppablesMap;

export type DroppableRowContentType = DroppableType | null;

export const GRID_COLUMNS_COUNT = 2;

export const dataRows: Array<Array<DroppableRowContentType>> = [
  ['droppable-0', 'droppable-0'],
  ['droppable-1', 'droppable-2'],
  ['droppable-3', null         ],
  ['droppable-4', 'droppable-4'],
  ['droppable-5', 'droppable-6'],
  ['droppable-7', 'droppable-7'],
  ['droppable-8', 'droppable-9'],
];
