import { Map, getIn } from 'immutable';
import { formReducerCreator as immutableReducer } from '../../immutable';
import { getReduxConst } from '../../utils/common';
import {
  FORM_INITIALISATION,
  RESET_FORM,
  UPDATE_FORM,
  SET_FORM_SUBMITTING,
} from '../../constants/Form';
import {
  CHANGE_FIELD_VALUE,
  RESET_FIELD,
  SET_FIELDS_ERRORS,
  SET_FIELD_DISABLED,
  SET_FIELDS_DISABLED,
  SET_FIELD_ERRORS,
  RESET_FIELDS,
  CHANGE_FIELDS_VALUES,
} from '../../constants/Field';

describe('reducers/formReducer.immutable', () => {
  const state = Map({
    valid: true,
    submitted: false,
    submitting: false,
    fields: {
      field: {
        disabled: false,
        value: '',
        valid: true,
        errors: [],
      },
    },
  });

  it('if pass undefined formName then reducer just return not modified state', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      formName: 'form1',
    });

    expect(newState.toJS()).toEqual(state.toJS());
  });

  it('if pass undefined action type then reducer just return not modified state', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      formName: 'form',
      type: 'test',
    });

    expect(newState.toJS()).toEqual(state.toJS());
  });

  it('SET_FIELDS_ERRORS', () => {
    expect.assertions(4);

    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(SET_FIELDS_ERRORS),
      formName: 'form',
      fieldsErrors: {
        field: ['first error'],
      },
    });

    expect(getIn(newState, ['fields', 'field', 'errors'])).toEqual(['first error']);
    expect(getIn(newState, ['valid'])).toBeFalsy();

    const newState2 = action(newState, {
      type: getReduxConst(SET_FIELDS_ERRORS),
      formName: 'form',
      fieldsErrors: {
        field: [],
      },
    });

    expect(getIn(newState2, ['fields', 'field', 'errors'])).toEqual([]);
    expect(getIn(newState2, ['valid'])).toBeTruthy();
  });

  it('SET_FIELD_ERRORS', () => {
    expect.assertions(4);

    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(SET_FIELD_ERRORS),
      formName: 'form',
      fieldName: 'field',
      errors: ['first error'],
    });

    expect(getIn(newState, ['fields', 'field', 'errors'])).toEqual(['first error']);
    expect(getIn(newState, ['valid'])).toBeFalsy();

    const newState2 = action(newState, {
      type: getReduxConst(SET_FIELD_ERRORS),
      formName: 'form',
      fieldName: 'field',
      errors: [],
    });

    expect(getIn(newState2, ['fields', 'field', 'errors'])).toEqual([]);
    expect(getIn(newState2, ['valid'])).toBeTruthy();
  });

  it('SET_FIELD_DISABLED', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(SET_FIELD_DISABLED),
      formName: 'form',
      fieldName: 'field',
      disabled: true,
    });

    expect(getIn(newState, ['fields', 'field', 'disabled'])).toBeTruthy();
  });

  it('SET_FIELDS_DISABLED', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(SET_FIELDS_DISABLED),
      formName: 'form',
      disabledFields: {
        field: true,
      },
    });

    expect(getIn(newState, ['fields', 'field', 'disabled'])).toBeTruthy();
  });

  it('CHANGE_FIELD_VALUE', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(CHANGE_FIELD_VALUE),
      formName: 'form',
      fieldName: 'field',
      fieldValue: 'test',
    });

    expect(getIn(newState, ['fields', 'field', 'value'])).toBe('test');
  });

  it('UPDATE_FORM', () => {
    expect.assertions(2);

    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(UPDATE_FORM),
      formName: 'form',
      fields: {
        field: 'new field',
        field1: 'test',
      },
    });

    expect(Object.keys(getIn(newState, ['fields']))).toEqual(['field', 'field1']);
    expect(getIn(newState, ['fields', 'field'])).not.toBe('new field');
  });

  it('FORM_INITIALISATION', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(FORM_INITIALISATION),
      formName: 'form',
      fields: {
        field1: 'test',
      },
    });

    expect(Object.keys(getIn(newState, ['fields']))).toEqual(['field1']);
  });

  it('SET_FORM_SUBMITTING', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(SET_FORM_SUBMITTING),
      formName: 'form',
      submitting: true,
    });

    expect(getIn(newState, ['submitting'])).toBeTruthy();
  });

  it('CHANGE_FIELDS_VALUES', () => {
    const action = immutableReducer('form');
    const newState = action(state, {
      type: getReduxConst(CHANGE_FIELDS_VALUES),
      formName: 'form',
      fieldsValues: {
        field: 'test',
      },
    });

    expect(getIn(newState, ['fields', 'field', 'value'])).toBe('test');
  });

  it('RESET_FIELDS', () => {
    const action = immutableReducer('form');
    let newState = action(state, {
      type: getReduxConst(FORM_INITIALISATION),
      formName: 'form',
      fields: {
        field: {
          disabled: false,
          value: 'initial',
          valid: true,
          errors: [],
        },
      },
    });

    newState = action(newState, {
      type: getReduxConst(CHANGE_FIELD_VALUE),
      formName: 'form',
      fieldName: 'field',
      fieldValue: 'changed',
    });

    newState = action(newState, {
      type: getReduxConst(RESET_FIELDS),
      formName: 'form',
      fieldsNames: ['field'],
    });

    expect(getIn(newState, ['fields', 'field', 'value'])).toBe('initial');
  });

  it('RESET_FIELD', () => {
    const action = immutableReducer('form');
    let newState = action(state, {
      type: getReduxConst(FORM_INITIALISATION),
      formName: 'form',
      fields: {
        field: {
          disabled: false,
          value: 'initial',
          valid: true,
          errors: [],
        },
      },
    });

    newState = action(newState, {
      type: getReduxConst(CHANGE_FIELD_VALUE),
      formName: 'form',
      fieldName: 'field',
      fieldValue: 'changed',
    });

    newState = action(newState, {
      type: getReduxConst(RESET_FIELD),
      formName: 'form',
      fieldName: 'field',
    });

    expect(getIn(newState, ['fields', 'field', 'value'])).toBe('initial');
  });

  it('RESET_FORM', () => {
    const action = immutableReducer('form');
    let newState = action(state, {
      type: getReduxConst(FORM_INITIALISATION),
      formName: 'form',
      fields: {
        field: {
          disabled: false,
          value: 'initial',
          valid: true,
          errors: [],
        },
      },
    });

    newState = action(newState, {
      type: getReduxConst(CHANGE_FIELD_VALUE),
      formName: 'form',
      fieldName: 'field',
      fieldValue: 'changed',
    });

    newState = action(newState, {
      type: getReduxConst(RESET_FORM),
      formName: 'form',
    });

    expect(getIn(newState, ['fields', 'field', 'value'])).toBe('initial');
  });
});
