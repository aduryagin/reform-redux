import type { HasIn, SetIn, GetIn, Merge, DeleteIn, Keys, CloneDeep } from './common';

export type DataFunctions = {|
  fromJS: CloneDeep,
  map: CloneDeep,
  hasIn: HasIn,
  setIn: SetIn,
  getIn: GetIn,
  merge: Merge,
  deleteIn: DeleteIn,
  keys: Keys,
|};
