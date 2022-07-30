/**
 * Higher-order function for async/await error handling
 * @param {function} fn an asnc function
 * @returns {function}
 */

export const catchErrors = (fn) => {
  return function (...args) {
    return fn(...args).catch((err) => {
      console.log(err);
    });
  };
};
