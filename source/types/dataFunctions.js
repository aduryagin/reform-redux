import type { HasIn, SetIn, GetIn, Merge, DeleteIn, Keys } from './common';

export type CloneDeep = <Input>(value: Input) => Input;

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
