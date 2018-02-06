import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { formReducerCreator, Form } from '../source';
import {
  Form as ImmutableForm,
  formReducerCreator as immutableFormCreator,
} from '../source/immutable';

// Enzyme configuring

configure({ adapter: new Adapter() });

class Provider extends Component {
  static childContextTypes = {
    store: PropTypes.object,
  };

  getChildContext() {
    return {
      store: this.props === 'immutable' ? global.immutableStore : global.store,
    };
  }

  render() {
    return createElement(
      this.props === 'immutable' ? ImmutableForm : Form,
      { path: 'form' },
      this.props.children,
    );
  }
}

global.Provider = Provider;

beforeEach(() => {
  global.store = createStore(
    combineReducers({
      form: formReducerCreator('form'),
    }),
  );

  global.immutableStore = createStore(
    combineReducers({
      form: immutableFormCreator('form'),
    }),
  );

  global.context = {
    store: global.store,
    _reformRedux: { form: { path: ['form'], registerField: () => {}, updateForm: () => {} } },
  };
});
