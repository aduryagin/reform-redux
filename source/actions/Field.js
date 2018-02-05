import {
  CHANGE_FIELD_VALUE,
  SET_FIELD_ERRORS,
  SET_FIELDS_ERRORS,
  SET_FIELD_DISABLED,
  SET_FIELDS_DISABLED,
  CHANGE_FIELDS_VALUES,
  RESET_FIELD,
  RESET_FIELDS,
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
} from '../types/Field';
import { getReduxConst } from '../utils/common';

export const resetField: Function = (formName: string, fieldName: FieldName): ResetField => ({
  type: getReduxConst(RESET_FIELD),
  formName,
  fieldName,
});

export const resetFields: Function = (
  formName: string,
  fieldsNames: Array<FieldName>,
): ResetFields => ({
  type: getReduxConst(RESET_FIELDS),
  formName,
  fieldsNames,
});

export const setFieldDisabled: Function = (
  formName: string,
  fieldName: FieldName,
  disabled: boolean = true,
): SetFieldDisabled => ({
  type: getReduxConst(SET_FIELD_DISABLED),
  formName,
  fieldName,
  disabled,
});

export const setFieldsDisabled: Function = (
  formName: string,
  disabledFields: { [fieldName: FieldName]: boolean },
): SetFieldsDisabled => ({
  type: getReduxConst(SET_FIELDS_DISABLED),
  formName,
  disabledFields,
});

export const changeFieldValue: Function = (
  formName: string,
  fieldName: FieldName,
  fieldValue: FieldValue,
): ChangeFieldValue => ({
  type: getReduxConst(CHANGE_FIELD_VALUE),
  formName,
  fieldName,
  fieldValue,
});

export const changeFieldsValues: Function = (
  formName: string,
  fieldsValues: { [fieldName: FieldName]: FieldValue },
): ChangeFieldsValues => ({
  type: getReduxConst(CHANGE_FIELDS_VALUES),
  formName,
  fieldsValues,
});

export const setFieldErrors: Function = (
  formName: string,
  fieldName: FieldName,
  errors: Array<string>,
): SetFieldErrors => ({
  type: getReduxConst(SET_FIELD_ERRORS),
  formName,
  fieldName,
  errors,
});

export const setFieldsErrors: Function = (
  formName: string,
  fieldsErrors: { [fieldName: FieldName]: Array<string> },
): SetFieldsErrors => ({
  type: getReduxConst(SET_FIELDS_ERRORS),
  formName,
  fieldsErrors,
});
