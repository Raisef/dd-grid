/**
 * Возращает массив индексов слотов со значением `null`.
 * @param row исходный массив
 * @returns number[]
 */
export const getEmptyIndexes = (row: unknown[]) => row.reduce<number[]>((arr, item, index) => {
  if (item === null) {
    arr.push(index);
  }

  return arr;
}, []);

/**
 * Меняет порядок элементов в рамках одной строки. Возвращает новый массив.
 * @param row исходный массив
 * @param from индекс элемента, который нужно переместить
 * @param to индекс позиции на которую нужно переместить элемент
 * @param columns размер элемента
 * @returns T[]
 */
export const changeOrder = <T>(row: T[], from: number, to: number, columns: number) => {
  const newRow = row.slice();

  newRow.splice(to, 0, ...newRow.splice(from, columns));

  return newRow;
}

/**
 * Заменяет значения в строке на новое. Возвращает новый массив
 * @param row исходный массив
 * @param newValue новое значение
 * @param index Стартовый индекс, начиная с которого заменяются значения
 * @param columns Количество колонок для замены
 * @returns T[]
 */
export const changeValue = <T>(row: T[], newValue: T, index: number, columns: number) => {
  let newRow = row.slice();

  const endIndex = index + columns - 1;

  if (endIndex + 1 > row.length) {
    throw new Error('New row length exceeds max length');
  }
  
  for (let i = index; i <= endIndex; i++) {
    newRow[i] = newValue;
  }

  return newRow;
}

/**
 * Добавляет значение в строчку на заданный index.
 * При необходимости `null` в исходной строке будет удалён.
 * Если после добавления длина строки становится больше максимальной, лишние элементы возвращаются отдельно в свойстве `extraItems`.
 * @param row исходный массив
 * @param newValue новое значение
 * @param index Стартовый индекс
 * @param columns Количество колонок
 * @returns Объект с полями `row` и `extraItems`
 */
export const addValue = <T>(row: T[], newValue: T, columns: number, index: number) => {
  const newItem = Array(columns).fill(newValue);

  const newRow = addValues(row, newItem, index);

  return {
    row: newRow,
    extraItems: newRow.splice(row.length),
  };
};

/**
 * Добавляет несколько значений в строчку на заданный index.
 * При необходимости `null` в исходной строке будет удалён.
 * Возвращает новый массив
 * @param row исходный массив
 * @param newValues массив новых значений
 * @param index стартовый индекс
 * @returns новый массив
 */
export const addValues = <T>(row: T[], newValues: T[], index: number) => {
  let newRow = row.slice();

  newRow.splice(index, 0, ...newValues);

  let removedEmptyCount = 0;

  newRow = newRow.reduceRight<T[]>((arr, item) => {
    if (item === null && removedEmptyCount < newValues.length) {
      removedEmptyCount++;
      return arr;
    }

    arr.unshift(item);

    return arr;
  }, []);

  return newRow;
};
