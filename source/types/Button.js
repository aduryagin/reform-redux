export type ComponentProps = {
  type: string,
  reactReduxContext: any,
  reformReduxContext: any,
  disabled: boolean,
  children: any,
  onClick?: Function,
};

export type ComponentState = {
  submitting: boolean,
};
