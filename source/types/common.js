import type { ComponentType } from 'react';
import type { DataFunctions } from './dataFunctions';

export type CloneDeep = <Input>(value: Input) => Input;
export type SearchKeyPath = Array<string>;
export type Where = {
  [key: string]: any,
};
export type Keys = (input: Object) => Array<string>;
export type HasIn = (where: Where, searchKeyPath: SearchKeyPath) => boolean;
export type SetIn = <Input: Where>(where: Input, searchKeyPath: SearchKeyPath, value: any) => Input;
export type GetIn = <Input>(where: Where, searchKeyPath: SearchKeyPath, def?: Input) => Input;
export type Merge = <Input: Where>(target: Input, source: Input) => Input;
export type DeleteIn = <Input: Where>(where: Input, searchKeyPath: SearchKeyPath) => Input;
export type ComponentCreator = (dataFunctions: DataFunctions) => ComponentType<*>;
