import {
  FORM_INITIALISATION,
  RESET_FORM,
  SET_FORM_SUBMITTING,
  UPDATE_FORM,
} from '../constants/Form';
import {
  CHANGE_FIELD_VALUE,
  CHANGE_FIELDS_VALUES,
  SET_FIELD_ERRORS,
  SET_FIELDS_ERRORS,
  SET_FIELD_DISABLED,
  SET_FIELDS_DISABLED,
  RESET_FIELD,
  RESET_FIELDS,
} from '../constants/Field';
import { getReduxConst, cloneDeep } from '../utils/common';
import type { State, Action } from '../types/formReducer';
import type {
  FieldData,
  FieldsData,
  ChangeFieldsValues,
  ChangeFieldValue,
  SetFieldsDisabled,
  SetFieldDisabled,
  SetFieldErrors,
  SetFieldsErrors,
  ResetField,
  FieldsValues,
  ResetFields,
} from '../types/Field';
import type { FormInitialisation, SetFormSubmitting, UpdateForm } from '../types/Form';

const initialState: State = {
  valid: true,
  submitted: false,
  submitting: false,
  fields: {},
};
let initialFormState: State = { ...initialState };

const reducers: {
  [reducerName: string]: Function,
} = {
  [getReduxConst(RESET_FORM)]: (): State => cloneDeep(initialFormState),
  [getReduxConst(RESET_FIELD)]: (state: State, action: ResetField): State => {
    const newState = { ...state };

    if (newState.fields[action.fieldName]) {
      newState.fields[action.fieldName] = cloneDeep(initialFormState.fields[action.fieldName]);
    }

    return newState;
  },
  [getReduxConst(RESET_FIELDS)]: (state: State, action: ResetFields): State => {
    const newState = { ...state };

    action.fieldsNames.forEach(fieldName => {
      if (newState.fields[fieldName]) {
        newState.fields[fieldName] = cloneDeep(initialFormState.fields[fieldName]);
      }
    });

    return newState;
  },
  [getReduxConst(CHANGE_FIELDS_VALUES)]: (state: State, action: ChangeFieldsValues): State => {
    const newState: State = { ...state };
    const fieldsValues: FieldsValues = action.fieldsValues;

    Object.keys(fieldsValues).forEach((fieldKey: string) => {
      newState.fields[fieldKey].value = fieldsValues[fieldKey];
    });

    return newState;
  },
  [getReduxConst(SET_FORM_SUBMITTING)]: (state: State, action: SetFormSubmitting): State => {
    const newState: State = { ...state };

    if (!action.submitting) newState.submitted = true;
    newState.submitting = action.submitting;

    return newState;
  },
  [getReduxConst(FORM_INITIALISATION)]: (state: State, action: FormInitialisation): State => {
    initialFormState = cloneDeep({
      ...state,
      fields: action.fields,
      valid: true,
    });

    return cloneDeep(initialFormState);
  },
  [getReduxConst(UPDATE_FORM)]: (state: State, action: UpdateForm): State => {
    const newState: State = cloneDeep(state);
    Object.keys(action.fields).forEach(fieldKey => {
      if (!newState.fields[fieldKey]) {
        newState.fields[fieldKey] = action.fields[fieldKey];
      }
    });

    Object.keys(newState.fields).forEach(fieldKey => {
      if (!action.fields[fieldKey]) {
        delete newState.fields[fieldKey];
      }
    });

    return newState;
  },
  [getReduxConst(CHANGE_FIELD_VALUE)]: (state: State, action: ChangeFieldValue): State => {
    const newState = { ...state };
    newState.fields[action.fieldName].value = action.fieldValue;

    return newState;
  },
  [getReduxConst(SET_FIELDS_DISABLED)]: (state: State, action: SetFieldsDisabled): State => {
    const newStateFieldsDisabled = { ...state };

    Object.keys(action.disabledFields).forEach(disabledField => {
      newStateFieldsDisabled.fields[disabledField].disabled = action.disabledFields[disabledField];
    });

    return newStateFieldsDisabled;
  },
  [getReduxConst(SET_FIELD_DISABLED)]: (state: State, action: SetFieldDisabled): State => {
    const newStateFieldDisabled = { ...state };
    newStateFieldDisabled.fields[action.fieldName].disabled = action.disabled;

    return newStateFieldDisabled;
  },
  [getReduxConst(SET_FIELD_ERRORS)]: (state: State, action: SetFieldErrors): State => {
    const stateWithErrors: Object = { ...state };
    const fieldWithErrors: FieldData = stateWithErrors.fields[action.fieldName];
    fieldWithErrors.errors = action.errors;

    if (fieldWithErrors.errors.length) {
      fieldWithErrors.valid = false;
      stateWithErrors.valid = false;
    } else {
      fieldWithErrors.valid = true;

      let formValid: boolean = true;
      Object.keys(stateWithErrors.fields).forEach(fieldKey => {
        if (!stateWithErrors.fields[fieldKey].valid) {
          formValid = false;
        }
      });

      stateWithErrors.valid = formValid;
    }

    return stateWithErrors;
  },
  [getReduxConst(SET_FIELDS_ERRORS)]: (state: State, action: SetFieldsErrors): State => {
    const stateWithFieldsErrors: State = { ...state };
    const fieldsErrors: { [fieldName: string]: Array<string> } = action.fieldsErrors;

    Object.keys(fieldsErrors).forEach((fieldKey: string) => {
      const fieldErrors: Array<string> = fieldsErrors[fieldKey];
      let field: FieldData = stateWithFieldsErrors.fields[fieldKey];
      field.errors = fieldErrors;

      if (fieldErrors.length) {
        field.valid = false;
      } else {
        field.valid = true;
      }
    });

    // Check that form is valid or not

    const stateFields: FieldsData = stateWithFieldsErrors.fields;
    let formValid: boolean = true;
    Object.keys(stateFields).forEach((fieldKey: string) => {
      if (!stateFields[fieldKey].valid) {
        formValid = false;
      }
    });

    stateWithFieldsErrors.valid = formValid;

    return stateWithFieldsErrors;
  },
};

export default function reducerCreator(formName: string) {
  return (state: State = initialState, action: Action): State => {
    if (action.formName !== formName) return state;

    const reducer = reducers[action.type];
    return reducer ? reducer(state, action) : state;
  };
}
