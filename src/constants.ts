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
    content: 'КАРУСЕЛЬ',
    columns: 2,
  },
  'droppable-1': {
    content: 'КУРС ВАЛЮТ',
    columns: 1,
  },
  'droppable-2': {
    content: 'ВРЕМЯ',
    columns: 1,
  },
  'droppable-3': {
    content: 'КАРТА *9123',
    columns: 1,
  },
  'droppable-4': {
    content: 'ИЗБРАННОЕ',
    columns: 2,
  },
  'droppable-5': {
    content: 'АВТОКРЕДИТ *1231',
    columns: 1,
  },
  'droppable-6': {
    content: 'ТРОЙКА',
    columns: 1,
  },
  'droppable-7': {
    content: 'ИСТОРИЯ ОПЕРАЦИЙ',
    columns: 2,
  },
  'droppable-8': {
    content: 'БРОКЕРСКИЙ СЧЁТ *4928',
    columns: 1,
  },
  'droppable-9': {
    content: 'ВИДЖЕТ',
    columns: 1,
  },
} as const;

export type DroppableType = keyof typeof DroppablesMap;

export type DroppableRowContentType = DroppableType | null;

export const GRID_COLUMNS_COUNT = 2;

export const initialRows: Array<Array<DroppableRowContentType>> = [
  ['droppable-0', 'droppable-0'],
  ['droppable-1', 'droppable-2'],
  ['droppable-3', null         ],
  ['droppable-4', 'droppable-4'],
  ['droppable-5', 'droppable-6'],
  ['droppable-7', 'droppable-7'],
  ['droppable-8', 'droppable-9'],
];
