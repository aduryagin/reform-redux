// @flow

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
} from '../types/Field';
import { getReduxConst } from '../utils/common';

export const resetField = (formName: string, fieldName: string): ResetField => ({
  type: getReduxConst(RESET_FIELD),
  formName,
  fieldName,
});

export const resetFields = (formName: string, fieldsNames: Array<string>): ResetFields => ({
  type: getReduxConst(RESET_FIELDS),
  formName,
  fieldsNames,
});

export const setFieldDisabled = (
  formName: string,
  fieldName: string,
  disabled: boolean = true,
): SetFieldDisabled => ({
  type: getReduxConst(SET_FIELD_DISABLED),
  formName,
  fieldName,
  disabled,
});

export const setFieldsDisabled = (
  formName: string,
  disabledFields: { [fieldName: string]: boolean },
): SetFieldsDisabled => ({
  type: getReduxConst(SET_FIELDS_DISABLED),
  formName,
  disabledFields,
});

export const changeFieldValue = (
  formName: string,
  fieldName: string,
  fieldValue: any,
): ChangeFieldValue => ({
  type: getReduxConst(CHANGE_FIELD_VALUE),
  formName,
  fieldName,
  fieldValue,
});

export const changeFieldsValues = (
  formName: string,
  fieldsValues: { [fieldName: string]: any },
): ChangeFieldsValues => ({
  type: getReduxConst(CHANGE_FIELDS_VALUES),
  formName,
  fieldsValues,
});

export const setFieldErrors = (
  formName: string,
  fieldName: string,
  errors: Array<string>,
): SetFieldErrors => ({
  type: getReduxConst(SET_FIELD_ERRORS),
  formName,
  fieldName,
  errors,
});

export const setFieldsErrors = (
  formName: string,
  fieldsErrors: { [fieldName: string]: Array<string> },
): SetFieldsErrors => ({
  type: getReduxConst(SET_FIELDS_ERRORS),
  formName,
  fieldsErrors,
});
