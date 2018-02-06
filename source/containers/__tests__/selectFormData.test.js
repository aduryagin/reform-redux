import { createElement, Component } from 'react';
import { shallow, mount } from 'enzyme';
import { Field } from '../../index';
import selectFormData from '../selectFormData';

describe('containers/selectFormData', () => {
  it('if container is not in Form component then throw error', () => {
    expect(() => shallow(createElement(selectFormData()('')))).toThrow(
      'Container `selectFormData` must be in `Form` component.',
    );
  });

  it('container behavior', () => {
    expect.assertions(2);

    class CustomElement extends Component {
      componentDidUpdate() {
        expect(this.props.field1.value).toBe('test');
        expect(this.props.field2.value).toBe('test2');
      }

      render() {
        return '';
      }
    }

    mount(
      createElement(
        global.Provider,
        {},
        createElement(Field, {
          name: 'field1',
          value: 'test',
          component: 'input',
        }),
        createElement(Field, {
          name: 'field2',
          value: 'test2',
          component: 'input',
        }),
        createElement(selectFormData(['field1', 'field2'])(CustomElement)),
      ),
    );
  });
});
