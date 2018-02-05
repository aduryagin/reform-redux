import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Form from '../source/components/Form';
import { formReducerCreator } from '../source';

// Enzyme configuring

configure({ adapter: new Adapter() });

class Provider extends Component {
  static childContextTypes = {
    store: PropTypes.object,
  };

  getChildContext() {
    return {
      store: global.store,
    };
  }

  render() {
    return createElement(Form, { path: 'form' }, this.props.children);
  }
}

global.Provider = Provider;

beforeEach(() => {
  global.store = createStore(
    combineReducers({
      form: formReducerCreator('form'),
    }),
  );

  global.context = {
    store: global.store,
    _reformRedux: { form: { path: 'form', registerField: () => {}, updateForm: () => {} } },
  };
});
