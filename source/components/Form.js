import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { formInitialisation, resetForm, setFormSubmitting, updateForm } from '../actions/Form';
import {
  changeFieldValue,
  setFieldErrors,
  setFieldsErrors,
  changeFieldsValues,
  setFieldDisabled,
  setFieldsDisabled,
  resetField,
  resetFields,
} from '../actions/Field';
import { asyncForEach, get } from '../utils/common';
import { validateField, getValidateFunctionsArray } from '../utils/Field';
import { debounce } from '../utils/common';
import type { Element } from 'react';
import type { MiniReduxForm, ComponentProps, FieldsValidate, ComponentState } from '../types/Form';
import type { FieldData, FieldsData, FieldValidateProp, FieldsCount } from '../types/Field';
import type { Store } from 'redux';
import type { State } from '../types/formReducer';

class Form extends Component<ComponentProps, ComponentState> {
  formName: string;

  static contextTypes = {
    store: PropTypes.object,
  };

  static childContextTypes = {
    _reformRedux: PropTypes.object,
  };

  static defaultProps: {
    onSubmit: $PropertyType<ComponentProps, 'onSubmit'>,
    onSubmitFailed: $PropertyType<ComponentProps, 'onSubmitFailed'>,
  } = {
    onSubmit: () => {},
    onSubmitFailed: () => {},
  };

  fieldsStack: {
    [formName: string]: FieldsData,
  } = {};
  fieldsCount: {
    [formName: string]: FieldsCount,
  } = {};
  fieldsValidateStack: {
    [formName: string]: FieldsValidate,
  } = {};

  constructor(props: ComponentProps) {
    super(props);

    if (!props.path) {
      throw new Error('The `path` prop is required.');
    }

    this.formName = props.path.split('.').splice(-1)[0];

    if (!this.fieldsStack[this.formName]) this.fieldsStack[this.formName] = {};
    if (!this.fieldsCount[this.formName]) this.fieldsCount[this.formName] = {};
    if (!this.fieldsValidateStack[this.formName]) this.fieldsValidateStack[this.formName] = {};
  }

  getChildContext(): MiniReduxForm {
    const store: Store<State, *, *> = this.context.store;

    return {
      _reformRedux: {
        form: {
          name: this.formName,
          path: this.props.path,
          fieldsCount: this.fieldsCount[this.formName],
          registerField: this.registerField,
          unregisterField: this.unregisterField,
          resetForm: (): Function => store.dispatch(resetForm(this.formName)),
          updateForm: debounce(
            (): Function =>
              store.dispatch(updateForm(this.formName, this.fieldsStack[this.formName])),
            250,
          ),
        },
        field: {
          changeFieldsValues: (fieldsValues: { [fieldName: string]: any }): Function =>
            store.dispatch(changeFieldsValues(this.formName, fieldsValues)),
          changeFieldValue: (fieldName: string, fieldValue: any): Function =>
            store.dispatch(changeFieldValue(this.formName, fieldName, fieldValue)),
          setFieldErrors: (fieldName: string, errors: Array<string>): Function =>
            store.dispatch(setFieldErrors(this.formName, fieldName, errors)),
          setFieldsErrors: (
            fieldName: string,
            fieldsErrors: { [fieldName: string]: Array<string> },
          ): Function => store.dispatch(setFieldsErrors(this.formName, fieldsErrors)),
          setFieldDisabled: (fieldName: string, disabled: boolean = true): Function =>
            store.dispatch(setFieldDisabled(this.formName, fieldName, disabled)),
          setFieldsDisabled: (
            fieldName: string,
            disabledFields: { [fieldName: string]: boolean },
          ): Function => store.dispatch(setFieldsDisabled(this.formName, disabledFields)),
          resetField: (fieldName: string): Function =>
            store.dispatch(resetField(this.formName, fieldName)),
          resetFields: (fieldsNames: Array<string>): Function =>
            store.dispatch(resetFields(this.formName, fieldsNames)),
        },
      },
    };
  }

  increaseFieldCount = (fieldName: string) => {
    if (this.fieldsCount[this.formName][fieldName])
      return (this.fieldsCount[this.formName][fieldName] += 1);

    return (this.fieldsCount[this.formName][fieldName] = 1);
  };

  decreaseFieldCount = (fieldName: string) => {
    if (this.fieldsCount[this.formName][fieldName])
      return (this.fieldsCount[this.formName][fieldName] -= 1);

    return (this.fieldsCount[this.formName][fieldName] = 0);
  };

  unregisterField = (fieldName: string) => {
    this.decreaseFieldCount(fieldName);
  };

  registerField = (
    fieldName: string,
    fieldData: FieldData,
    fieldValidate: FieldValidateProp,
    fieldAdditionalData: {
      type: string,
      checked: boolean,
      multiple: boolean,
      component: string,
    },
  ) => {
    this.increaseFieldCount(fieldName);

    if (fieldAdditionalData.type && this.fieldsCount[this.formName][fieldName] > 1) {
      if (fieldAdditionalData.type === 'radio' && !fieldAdditionalData.checked) {
        return;
      }

      if (fieldAdditionalData.type === 'checkbox' || fieldAdditionalData.type === 'radio') {
        // TODO: throw error if value isn't simple data like number or string

        if (fieldAdditionalData.checked) {
          if (fieldAdditionalData.type === 'checkbox') {
            if (!Array.isArray(this.fieldsStack[this.formName][fieldName].value)) {
              let fieldValue: any = [fieldData.value];

              if (this.fieldsStack[this.formName][fieldName].value) {
                fieldValue = [this.fieldsStack[this.formName][fieldName].value, fieldData.value];
              }

              return (this.fieldsStack[this.formName][fieldName].value = fieldValue);
            }

            return this.fieldsStack[this.formName][fieldName].value.push(fieldData.value);
          }

          return (this.fieldsStack[this.formName][fieldName].value = fieldData.value);
        }

        if (
          !Array.isArray(this.fieldsStack[this.formName][fieldName].value) &&
          fieldAdditionalData.type === 'checkbox'
        ) {
          let fieldValue: any = [];

          if (this.fieldsStack[this.formName][fieldName].value) {
            fieldValue = [this.fieldsStack[this.formName][fieldName].value];
          }

          return (this.fieldsStack[this.formName][fieldName].value = fieldValue);
        }

        return;
      }
    }

    // Set empty array as default value for multiple select

    if (
      fieldAdditionalData.component === 'select' &&
      fieldAdditionalData.multiple &&
      !fieldData.value
    ) {
      fieldData.value = [];
    }

    this.fieldsStack[this.formName][fieldName] = fieldData;
    this.fieldsValidateStack[this.formName][fieldName] = fieldValidate;
  };

  componentDidMount() {
    const state: State = this.context.store.getState();
    const currentFormData = get(state, this.props.path);

    if (!Object.keys(currentFormData.fields).length) {
      this.context.store.dispatch(
        formInitialisation(this.formName, this.fieldsStack[this.formName]),
      );
    }
  }

  handleSubmit = async (event: Event) => {
    event.preventDefault();

    const store: Store<State, *, *> = this.context.store;
    store.dispatch(setFormSubmitting(this.formName, true));

    const { onSubmit, onSubmitFailed } = this.props;

    // Validate all fields

    const state: State = store.getState();
    const fields: FieldsData = get(state, `${this.props.path}.fields`);
    const fieldsErrors: { [fieldName: string]: Array<string> } = {};
    const fieldsWithErrors: { [fieldName: string]: FieldData } = {};
    let errorsExists: boolean = false;

    await asyncForEach(Object.keys(fields), async (fieldKey: string) => {
      const validateFunctions = getValidateFunctionsArray(
        this.fieldsValidateStack[this.formName][fieldKey],
      );
      let errors = fields[fieldKey].errors;

      if (!errors.length) {
        errors = await validateField(fields[fieldKey].value, validateFunctions);
      }

      fieldsErrors[fieldKey] = errors;

      if (errors.length) {
        fieldsWithErrors[fieldKey] = fields[fieldKey];
        errorsExists = true;
      }
    });

    if (errorsExists) {
      store.dispatch(setFieldsErrors(this.formName, fieldsErrors));

      if (onSubmitFailed) {
        onSubmitFailed(fieldsWithErrors, fields, event);
        store.dispatch(setFormSubmitting(this.formName, false));
      }
    } else if (onSubmit) {
      Promise.resolve(onSubmit(fields, event)).then(() => {
        store.dispatch(setFormSubmitting(this.formName, false));
      });
    }
  };

  render(): Element<'form'> {
    const { children } = this.props;

    return createElement('form', {
      onSubmit: this.handleSubmit,
      children,
    });
  }
}

export default Form;
