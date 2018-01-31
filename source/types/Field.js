import type { ComponentType } from 'react';

// Additional Types

export type FieldData = {
  value: any,
  errors: Array<string>,
  valid: boolean,
  disabled: boolean,
};

export type FieldsCount = { [fieldName: string]: number };

export type FieldsData = {
  [fieldName: string]: FieldData,
};

export type FormProp = {
  name: string,
};

export type FieldValue = any;

export type FieldProp = {
  onChange: Function,
  onBlur: Function,
  value: string,
  disabled: boolean,
  errors: Array<string>,
};

export type FieldProps = FormProp & FieldProp;

export type FieldValidateProp = Array<Function> | Function;

// Component

export type ComponentProps = {
  name: string,
  component: ComponentType<*>,
  normalize?: (value: any, previousValue: any, allFields: FieldsData, when: string) => any,
  type?: string,
  multiple?: boolean,
  checked?: boolean,
  value?: string,
  validate?: FieldValidateProp,
  disabled?: boolean,
  onChange?: Function,
  onBlur?: (event: Event, fieldData: FieldData) => any,
  onFocus?: (event: Event, fieldData: FieldData) => any,
};

export type ComponentState = {
  field: FieldData,
};

// Actions

export type SetFieldDisabled = {
  type: string,
  formName: string,
  fieldName: string,
  disabled: boolean,
};

export type SetFieldsDisabled = {
  type: string,
  formName: string,
  disabledFields: { [fieldName: string]: boolean },
};

export type ResetField = {
  type: string,
  formName: string,
  fieldName: string,
};

export type ResetFields = {
  type: string,
  formName: string,
  fieldsNames: Array<string>,
};

export type FieldsValues = {
  [fieldName: string]: FieldValue,
};

export type ChangeFieldsValues = {
  type: string,
  formName: string,
  fieldsValues: FieldsValues,
};

export type ChangeFieldValue = {
  type: string,
  formName: string,
  fieldName: string,
  fieldValue: string,
};

export type SetFieldErrors = {
  type: string,
  formName: string,
  fieldName: string,
  errors: Array<string>,
};

export type SetFieldsErrors = {
  type: string,
  formName: string,
  fieldsErrors: { [fieldName: string]: Array<string> },
};
