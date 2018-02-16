import { fromJS, Map as map, getIn, deleteIn, List as list, is, isImmutable } from 'immutable';
import type { SearchKeyPath } from '../types/common';

export default function immutable() {
  return {
    fromJS,
    map,
    getIn,
    deleteIn,
    list,
    is,
    hasIn: (collection: any, path: SearchKeyPath): any => collection.hasIn(path),
    setIn: <Input: any>(collection: Input, path: SearchKeyPath, value: any): Input =>
      collection.setIn(path, value),
    merge: (firstCollection: any, secondCollection: any): any =>
      firstCollection.merge(secondCollection),
    keys: (collection: any): any => collection.keySeq(),
    isList: (input: any): boolean => list.isList(input),
    listIncludes: (list: any, item: any): boolean => list.includes(item),
    listSize: (list: any): number => list.size,
    isImmutable: (input: any): boolean => isImmutable(input),
    toJS: (input: any): any => (isImmutable(input) ? input.toJS() : input),
  };
}
