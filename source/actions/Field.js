import {
  CHANGE_FIELD_VALUE,
  SET_FIELD_ERRORS,
  SET_FIELDS_ERRORS,
  SET_FIELD_DISABLED,
  SET_FIELDS_DISABLED,
  CHANGE_FIELDS_VALUES,
  RESET_FIELD,
  RESET_FIELDS,
  REMOVE_FIELD,
  SET_FIELD_TOUCHED,
  SET_FIELDS_TOUCHED,
  SET_FIELDS_HIDDEN,
  SET_FIELD_CHANGED,
  SET_FIELDS_CHANGED,
  SET_FIELD_HIDDEN,
} from '../constants/Field';
import type {
  ChangeFieldValue,
  SetFieldErrors,
  SetFieldsErrors,
  SetFieldsDisabled,
  SetFieldDisabled,
  ChangeFieldsValues,
  ResetField,
  ResetFields,
  FieldValue,
  FieldName,
  RemoveField,
  SetFieldTouched,
  SetFieldsTouched,
  SetFieldChanged,
  SetFieldsChanged,
  SetFieldHidden,
  SetFieldsHidden,
} from '../types/Field';
import type { ResetState } from '../types/formReducer';
import { getReduxConst } from '../utils/common';

export const setFieldTouched = (
  formName: string,
  fieldName: FieldName,
  fieldTouched: boolean,
): SetFieldTouched => ({
  type: getReduxConst(SET_FIELD_TOUCHED),
  formName,
  fieldName,
  fieldTouched,
});

export const setFieldsHidden = (
  formName: string,
  hiddenFields: { [fieldName: FieldName]: boolean },
): SetFieldsHidden => ({
  type: getReduxConst(SET_FIELDS_HIDDEN),
  formName,
  hiddenFields,
});

export const setFieldHidden = (
  formName: string,
  fieldName: FieldName,
  fieldHidden: boolean,
): SetFieldHidden => ({
  type: getReduxConst(SET_FIELD_HIDDEN),
  formName,
  fieldName,
  fieldHidden,
});

export const setFieldsTouched = (
  formName: string,
  touchedFields: { [fieldName: FieldName]: boolean },
): SetFieldsTouched => ({
  type: getReduxConst(SET_FIELDS_TOUCHED),
  formName,
  touchedFields,
});

export const setFieldChanged = (
  formName: string,
  fieldName: FieldName,
  fieldChanged: boolean,
): SetFieldChanged => ({
  type: getReduxConst(SET_FIELD_CHANGED),
  formName,
  fieldName,
  fieldChanged,
});

export const setFieldsChanged = (
  formName: string,
  changedFields: { [fieldName: FieldName]: boolean },
): SetFieldsChanged => ({
  type: getReduxConst(SET_FIELDS_CHANGED),
  formName,
  changedFields,
});

export const removeField = (formName: string, fieldName: FieldName): RemoveField => ({
  type: getReduxConst(REMOVE_FIELD),
  formName,
  fieldName,
});

export const resetField = (
  formName: string,
  fieldName: FieldName,
  state?: ResetState,
): ResetField => ({
  type: getReduxConst(RESET_FIELD),
  formName,
  fieldName,
  // $FlowFixMe
  state,
});

export const resetFields = (
  formName: string,
  fieldsNames: Array<FieldName>,
  state?: ResetState,
): ResetFields => ({
  type: getReduxConst(RESET_FIELDS),
  formName,
  fieldsNames,
  // $FlowFixMe
  state,
});

export const setFieldDisabled = (
  formName: string,
  fieldName: FieldName,
  disabled: boolean = true,
): SetFieldDisabled => ({
  type: getReduxConst(SET_FIELD_DISABLED),
  formName,
  fieldName,
  disabled,
});

export const setFieldsDisabled = (
  formName: string,
  disabledFields: { [fieldName: FieldName]: boolean },
): SetFieldsDisabled => ({
  type: getReduxConst(SET_FIELDS_DISABLED),
  formName,
  disabledFields,
});

export const changeFieldValue = (
  formName: string,
  fieldName: FieldName,
  fieldValue: FieldValue,
): ChangeFieldValue => ({
  type: getReduxConst(CHANGE_FIELD_VALUE),
  formName,
  fieldName,
  fieldValue,
});

export const changeFieldsValues = (
  formName: string,
  fieldsValues: { [fieldName: FieldName]: FieldValue },
): ChangeFieldsValues => ({
  type: getReduxConst(CHANGE_FIELDS_VALUES),
  formName,
  fieldsValues,
});

export const setFieldErrors = (
  formName: string,
  fieldName: FieldName,
  errors: Array<string>,
): SetFieldErrors => ({
  type: getReduxConst(SET_FIELD_ERRORS),
  formName,
  fieldName,
  errors,
});

export const setFieldsErrors = (
  formName: string,
  fieldsErrors: { [fieldName: FieldName]: Array<string> },
): SetFieldsErrors => ({
  type: getReduxConst(SET_FIELDS_ERRORS),
  formName,
  fieldsErrors,
});
