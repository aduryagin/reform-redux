import { fromJS, Map as map, getIn, deleteIn } from 'immutable';
import type { DataFunctions } from '../types/dataFunctions';

export default function immutable(): DataFunctions {
  return {
    fromJS,
    map,
    hasIn: (collection: any, path: Array<string>): any => collection.hasIn(path),
    setIn: (collection: any, path: Array<string>, value: any): any => collection.setIn(path, value),
    getIn,
    merge: (firstCollection: any, secondCollection: any): any =>
      firstCollection.merge(secondCollection),
    deleteIn,
    keys: (collection: any): any => collection.keySeq(),
  };
}
