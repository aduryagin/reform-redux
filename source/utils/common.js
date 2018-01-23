// @flow

import { LIBRARY_NAME } from '../constants/common';

export const debounce = (func: Function, wait: number, immediate?: boolean) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index: number = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const getReduxConst = (constName: string): string => `${LIBRARY_NAME}/${constName}`;

export const get = (obj: Object, path: string, def: any) => {
  const fullPath = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
    .filter(Boolean);

  function everyFunc(step) {
    return !(step && (obj = obj[step]) === undefined);
  }

  return fullPath.every(everyFunc) ? obj : def;
};

export function cloneDeep<Input>(o: Input): Input {
  var copy = o,
    k;

  if (o && typeof o === 'object') {
    copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
    for (k in o) {
      // $FlowFixMe
      copy[k] = cloneDeep(o[k]);
    }
  }
  // $FlowFixMe
  return copy;
}

export function isEqual(x: any, y: any) {
  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  if (x instanceof Function) {
    return x === y;
  }
  if (x instanceof RegExp) {
    return x === y;
  }
  if (x === y || x.valueOf() === y.valueOf()) {
    return true;
  }
  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  }
  if (x instanceof Date) {
    return false;
  }
  if (!(x instanceof Object)) {
    return false;
  }
  if (!(y instanceof Object)) {
    return false;
  }

  const p = Object.keys(x);
  return Object.keys(y).every(i => p.indexOf(i) !== -1) && p.every(i => isEqual(x[i], y[i]));
}
