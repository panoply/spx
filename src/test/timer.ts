/**
 * Mark entries
 */
export const marks: { [id: string]: number } = {};

/**
 * Start timing
 */
export const start = (id: string) => {
  return Object.assign(marks, { [id]: Date.now() })[id];
};

/**
 * Clear all
 */
export const clear = () => {
  for (const id in marks) delete marks[id];
};

/**
 * Stop timing and return formatted elapsed time
 */
export const stop = (id: string) => {
  const ms = Date.now() - marks[id];
  delete marks[id];
  return console.log(ms > 1000
    ? `${(ms / 1000).toFixed(0)}s ${+ms.toFixed(0).slice(1)}ms`
    : `${ms.toFixed(0)}ms`);
};
