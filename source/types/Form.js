// @flow

import type { Element } from 'react';
import type { FieldsData, FieldValidateProp, FieldsCount } from './Field';

export type MiniReduxForm = {
  _reformRedux: {
    form: {
      name: string,
      path: string,
      registerField: Function,
      fieldsCount: FieldsCount,
      unregisterField: Function,
      resetForm: Function,
      updateForm: Function,
    },
    field: {
      changeFieldValue: (fieldName: string, fieldValue: string) => Function,
      changeFieldsValues: (fieldsValues: { [fieldName: string]: any }) => Function,
      setFieldErrors: (fieldName: string, errors: Array<string>) => Function,
      setFieldsErrors: (
        fieldName: string,
        fieldsErrors: { [fieldName: string]: Array<string> },
      ) => Function,
      setFieldDisabled: (fieldName: string, disabled: boolean) => Function,
      setFieldsDisabled: (
        fieldName: string,
        disabledFields: { [fieldName: string]: boolean },
      ) => Function,
      resetField: (fieldName: string) => Function,
      resetFields: (fieldsNames: Array<string>) => Function,
    },
  },
};

export type ComponentState = {
  submitted: boolean,
};

export type ComponentProps = {
  children: Element<*>,
  path: string,
  onSubmitFailed?: (errorFields: FieldsData, fields: FieldsData, event: Event) => any,
  onSubmit?: (fields: FieldsData, event: Event) => any,
};

export type FieldsValidate = {
  [fieldName: string]: FieldValidateProp,
};

// Actions

export type FormInitialisation = {
  type: string,
  formName: string,
  fields: FieldsData,
};

export type UpdateForm = {
  type: string,
  formName: string,
  fields: FieldsData,
};

export type SetFormSubmitting = {
  type: string,
  formName: string,
  submitting: boolean,
};

export type ResetForm = {
  type: string,
  formName: string,
};
