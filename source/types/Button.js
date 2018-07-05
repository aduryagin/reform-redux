export type ComponentProps = {
  type: string,
  children: Element<*>,
  onClick?: Function,
};

export type ComponentState = {
  submitting: boolean,
};
