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
import { getReduxConst } from '../utils/common';
import type { State, Action } from '../types/formReducer';
import type {
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
  FieldName,
} from '../types/Field';
import type { FormInitialisation, SetFormSubmitting, UpdateForm } from '../types/Form';
import type { DataFunctions } from '../types/dataFunctions';

export const createFormReducer: Function = (dataFunctions: DataFunctions) => {
  const { fromJS, map, hasIn, setIn, getIn, merge, deleteIn }: DataFunctions = dataFunctions;
  const initialState: State = fromJS({
    valid: true,
    submitted: false,
    submitting: false,
    fields: {},
  });
  let initialFormState: State = map(initialState);

  const reducers: {
    [reducerName: string]: (state: State, action?: Action) => State,
  } = {
    [getReduxConst(RESET_FORM)]: (): State => map(initialFormState),
    [getReduxConst(RESET_FIELD)]: (state: State, action: ResetField): State => {
      const newState: State = map(state);

      if (hasIn(newState, ['fields', action.fieldName])) {
        return setIn(
          newState,
          ['fields', action.fieldName],
          getIn(initialFormState, ['fields', action.fieldName]),
        );
      }

      return newState;
    },
    [getReduxConst(RESET_FIELDS)]: (state: State, action: ResetFields): State => {
      let newState = map(state);

      action.fieldsNames.forEach((fieldName: FieldName) => {
        if (hasIn(newState, ['fields', fieldName])) {
          newState = setIn(
            newState,
            ['fields', fieldName],
            getIn(initialFormState, ['fields', fieldName]),
          );
        }
      });

      return newState;
    },
    [getReduxConst(CHANGE_FIELDS_VALUES)]: (state: State, action: ChangeFieldsValues): State => {
      let newState: State = map(state);
      const fieldsValues: FieldsValues = action.fieldsValues;

      Object.keys(fieldsValues).forEach((fieldKey: string) => {
        newState = setIn(newState, ['fields', fieldKey, 'value'], fieldsValues[fieldKey]);
      });

      return newState;
    },
    [getReduxConst(SET_FORM_SUBMITTING)]: (state: State, action: SetFormSubmitting): State => {
      let newState: State = map(state);

      if (!action.submitting) newState = setIn(newState, ['submitted'], true);
      newState = setIn(newState, ['submitting'], action.submitting);

      return newState;
    },
    [getReduxConst(FORM_INITIALISATION)]: (state: State, action: FormInitialisation): State => {
      initialFormState = merge(state, {
        fields: action.fields,
        valid: true,
      });

      return map(initialFormState);
    },
    [getReduxConst(UPDATE_FORM)]: (state: State, action: UpdateForm): State => {
      let newState: State = map(state);

      Object.keys(action.fields).forEach((fieldKey: string) => {
        if (!hasIn(newState, ['fields', fieldKey])) {
          newState = setIn(newState, ['fields', fieldKey], action.fields[fieldKey]);
        }
      });

      Object.keys(getIn(newState, ['fields'])).forEach((fieldKey: string) => {
        if (!action.fields[fieldKey]) {
          newState = deleteIn(newState, ['fields', fieldKey]);
        }
      });

      return newState;
    },
    [getReduxConst(CHANGE_FIELD_VALUE)]: (state: State, action: ChangeFieldValue): State => {
      if (hasIn(state, ['fields', action.fieldName])) {
        return setIn(state, ['fields', action.fieldName, 'value'], action.fieldValue);
      }

      return state;
    },
    [getReduxConst(SET_FIELDS_DISABLED)]: (state: State, action: SetFieldsDisabled): State => {
      let newState: State = map(state);

      Object.keys(action.disabledFields).forEach((disabledField: string) => {
        newState = setIn(
          newState,
          ['fields', disabledField, 'disabled'],
          action.disabledFields[disabledField],
        );
      });

      return newState;
    },
    [getReduxConst(SET_FIELD_DISABLED)]: (state: State, action: SetFieldDisabled): State => {
      if (hasIn(state, ['fields', action.fieldName])) {
        return setIn(state, ['fields', action.fieldName, 'disabled'], action.disabled);
      }

      return state;
    },
    [getReduxConst(SET_FIELD_ERRORS)]: (state: State, action: SetFieldErrors): State => {
      let newState: State = map(state);
      const fieldPath: Array<string | number> = ['fields', action.fieldName];
      newState = setIn(newState, [...fieldPath, 'errors'], action.errors);

      if (action.errors.length) {
        newState = setIn(newState, [...fieldPath, 'valid'], false);
        newState = setIn(newState, ['valid'], false);
      } else {
        newState = setIn(newState, [...fieldPath, 'valid'], true);

        let formValid: boolean = true;
        Object.keys(getIn(newState, ['fields'])).forEach(fieldKey => {
          if (!getIn(newState, ['fields', fieldKey, 'valid'])) {
            formValid = false;
          }
        });

        newState = setIn(newState, ['valid'], formValid);
      }

      return newState;
    },
    [getReduxConst(SET_FIELDS_ERRORS)]: (state: State, action: SetFieldsErrors): State => {
      let newState: State = map(state);
      const fieldsErrors: { [fieldName: FieldName]: Array<string> } = action.fieldsErrors;

      Object.keys(fieldsErrors).forEach((fieldKey: string) => {
        const fieldErrors: Array<string> = fieldsErrors[fieldKey];
        const fieldPath: Array<string | number> = ['fields', fieldKey];
        newState = setIn(newState, [...fieldPath, 'errors'], fieldErrors);

        if (fieldErrors.length) {
          newState = setIn(newState, [...fieldPath, 'valid'], false);
        } else {
          newState = setIn(newState, [...fieldPath, 'valid'], true);
        }
      });

      // Check that form is valid or not

      const stateFields: FieldsData = getIn(newState, ['fields']);
      let formValid: boolean = true;
      Object.keys(stateFields).forEach((fieldKey: string) => {
        if (!getIn(stateFields, [fieldKey, 'valid'])) {
          formValid = false;
        }
      });

      newState = setIn(newState, ['valid'], formValid);

      return newState;
    },
  };

  return (formName: string): Function => {
    return (state: State = initialState, action: Action): State => {
      if (action.formName !== formName) return state;

      const reducer = reducers[action.type];
      return reducer ? reducer(state, action) : state;
    };
  };
};
