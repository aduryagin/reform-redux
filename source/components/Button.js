import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { resetForm } from '../actions/Form';
import { get } from '../utils/common';
import type { Element } from 'react';
import type { State } from '../types/formReducer';
import type { MiniReduxForm } from '../types/Form';
import type { ComponentProps, ComponentState } from '../types/Button';

class Button extends Component<ComponentProps, ComponentState> {
  unsubscribeFromStore: Function = () => {};

  state = {
    submitting: false,
  };

  static contextTypes = {
    _reformRedux: PropTypes.object,
    store: PropTypes.object,
  };

  constructor(props: ComponentProps, context: MiniReduxForm) {
    super(props, context);

    if (!context._reformRedux) {
      throw new Error('Component `Button` must be in `Form` component.');
    }
  }

  componentWillMount() {
    this.unsubscribeFromStore = this.context.store.subscribe(() => {
      const state: State = this.context.store.getState();
      const currentFormData = get(state, this.context._reformRedux.form.path);

      if (this.state.submitting !== currentFormData.submitting) {
        this.setState({
          submitting: currentFormData.submitting,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromStore();
  }

  onClickHandler = (event: Event) => {
    const { type, onClick } = this.props;
    const { store, _reformRedux } = this.context;

    if (type === 'reset') store.dispatch(resetForm(_reformRedux.form.name));

    if (onClick) onClick(event);
  };

  render(): Element<'button'> {
    return createElement('button', {
      ...this.props,
      disabled: this.props.disabled || this.state.submitting,
      onClick: this.onClickHandler,
    });
  }
}

export default Button;
