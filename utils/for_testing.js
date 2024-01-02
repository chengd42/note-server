export const reverse = (string) => string.split('').reverse().join('');

export const average = (array) =>
  array.reduce((sum, item) => sum + item, 0) / array.length;
