import { cloneDeep, hasIn, setIn, getIn, keys, merge, deleteIn } from './common';
import type { DataFunctions } from '../types/dataFunctions';

export default function plain(): DataFunctions {
  return {
    fromJS: cloneDeep,
    map: cloneDeep,
    hasIn,
    setIn,
    getIn,
    merge,
    deleteIn,
    keys,
  };
}
