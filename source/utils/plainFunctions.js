import {
  cloneDeep,
  hasIn,
  setIn,
  getIn,
  keys,
  merge,
  deleteIn,
  isList,
  listIncludes,
  is,
  listSize,
  isImmutable,
  toJS,
} from './common';
import type { DataFunctions } from '../types/dataFunctions';

export default function plain(): DataFunctions {
  return {
    fromJS: cloneDeep,
    map: cloneDeep,
    list: cloneDeep,
    hasIn,
    setIn,
    getIn,
    merge,
    deleteIn,
    is,
    keys,
    isList,
    listIncludes,
    listSize,
    isImmutable,
    toJS,
  };
}
