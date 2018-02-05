export type SearchKeyPath = Array<string | number>;
export type Where = {
  [key: string | number]: any,
};
export type Keys = (input: Object) => Array<string>;
export type HasIn = (where: Where, searchKeyPath: SearchKeyPath) => boolean;
export type SetIn = <Input: Where>(where: Input, searchKeyPath: SearchKeyPath, value: any) => Input;
export type GetIn = <Input>(where: Where, searchKeyPath: SearchKeyPath) => Input;
export type Merge = <Input: Where>(target: Input, source: Input) => Input;
export type DeleteIn = <Input: Where>(where: Input, searchKeyPath: SearchKeyPath) => Input;
