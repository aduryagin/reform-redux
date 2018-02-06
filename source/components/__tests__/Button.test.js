import { createElement } from 'react';
import { shallow, mount } from 'enzyme';
import { Button } from '../../index';
import { formInitialisation, setFormSubmitting } from '../../actions/Form';
import { changeFieldValue } from '../../actions/Field';

describe('components / Button', () => {
  it('snapshot', () => {
    const snapshot = shallow(createElement(global.Provider, {}, createElement(Button)));
    expect(snapshot).toMatchSnapshot();
  });

  it('if component is not in Form component then throw error', () => {
    expect(() => shallow(createElement(Button))).toThrow(
      'Component `Button` must be in `Form` component.',
    );
  });

  it('component with type=reset will reset form on onClick', () => {
    const component = mount(
      createElement(global.Provider, {}, createElement(Button, { type: 'reset' })),
    );

    global.store.dispatch(
      formInitialisation('form', {
        field: {
          value: '',
          errors: [],
          valid: true,
          disabled: false,
        },
      }),
    );

    global.store.dispatch(changeFieldValue('form', 'field', 'test'));
    component.find('button').simulate('click');

    expect(global.store.getState().form.fields.field.value).toBe('');
  });

  it('component with type=submit will just trigger onClick', () => {
    expect.assertions(2);

    const onClick = jest.fn();
    const component = mount(
      createElement(global.Provider, {}, createElement(Button, { type: 'submit', onClick })),
    );

    global.store.dispatch(
      formInitialisation('form', {
        field: {
          value: '',
          errors: [],
          valid: true,
          disabled: false,
        },
      }),
    );

    global.store.dispatch(changeFieldValue('form', 'field', 'test'));

    component.find('button').simulate('click');

    expect(global.store.getState().form.fields.field.value).not.toBe('');
    expect(onClick).toBeCalledWith(expect.anything());
  });

  it('disabled property', () => {
    const component = mount(
      createElement(global.Provider, {}, createElement(Button, { disabled: true })),
    );
    expect(component.find('button').props().disabled).toBeTruthy();
  });

  it('after change form property "submitting", component property "disabled" and state "submitting" will the same', () => {
    expect.assertions(2);

    const component = mount(createElement(global.Provider, {}, createElement(Button)));
    let buttonComponent = component.find('Button').instance();
    let button = component.find('button');

    expect(button.prop('disabled') && buttonComponent.state.submitting).toBeFalsy();

    global.store.dispatch(setFormSubmitting('form', true));
    component.update();
    buttonComponent = component.find('Button').instance();
    button = component.find('button');

    expect(button.prop('disabled') && buttonComponent.state.submitting).toBeTruthy();
  });

  it('if component was unmounted then after change form property "submitting", component property "disabled" and state "submitting" will not the same', () => {
    const component = mount(createElement(Button), {
      context: global.context,
    });
    component.unmount();

    global.store.dispatch(setFormSubmitting('form', true));

    component.mount();

    expect(component.prop('disabled') && component.state('submitting')).toBeFalsy();
  });
});
