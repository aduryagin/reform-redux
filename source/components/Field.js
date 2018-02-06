import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEqual } from '../utils/common';
import { getValidateFunctionsArray, validateField } from '../utils/Field';
import type { MiniReduxForm } from '../types/Form';
import type { FieldData, FieldsData, ComponentProps, ComponentState } from '../types/Field';
import type { State } from '../types/formReducer';
import type { DataFunctions } from '../types/dataFunctions';
import type { ComponentCreator } from '../types/common';

export const createFieldComponent: ComponentCreator = (dataFunctions: DataFunctions) => {
  const { getIn }: DataFunctions = dataFunctions;

  class Field extends Component<ComponentProps, ComponentState> {
    initialFieldData: FieldData;
    fieldWasTouched: boolean = false;
    unsubscribeFromStore: Function = () => {};
    reduxRenderCount: number = 0;

    static defaultProps: {
      disabled: $PropertyType<ComponentProps, 'disabled'>,
      value: $PropertyType<ComponentProps, 'value'>,
    } = {
      value: '',
      disabled: false,
    };

    static contextTypes = {
      _reformRedux: PropTypes.object,
      store: PropTypes.object,
    };

    constructor(props: ComponentProps, context: MiniReduxForm) {
      super(props, context);

      if (!context._reformRedux) {
        throw new Error('Component `Field` must be in `Form` component.');
      }

      if (!props.name) {
        throw new Error('The `name` prop is required.');
      }

      if (props.normalize && typeof props.normalize !== 'function') {
        throw new Error('The `normalize` prop must be a function.');
      }

      if (!props.component) {
        throw new Error('The `component` prop is required.');
      }

      if (
        props.multiple &&
        props.component === 'select' &&
        props.value &&
        !Array.isArray(props.value)
      ) {
        throw new Error(
          'The `value` prop supplied to Field with type "select" must be an array if `multiple` is true.',
        );
      }

      // Normalize value on component onInit

      const value = props.normalize
        ? props.normalize(props.value, '', {}, 'onInit')
        : props.value || '';

      this.initialFieldData = {
        value,
        errors: [],
        valid: true,
        disabled: props.disabled || false,
      };

      if (['radio', 'checkbox'].indexOf(props.type) > -1 && !props.checked) {
        this.initialFieldData.value = '';
      }

      // Get default value from store if it exists

      const state: State = this.context.store.getState();
      const currentFormData: State = getIn(state, this.context._reformRedux.form.path);
      const initialFieldData: FieldData = getIn(currentFormData, ['fields', props.name]);

      if (initialFieldData) {
        this.initialFieldData = initialFieldData;
      }

      // Write initial data to store

      this.state = {
        field: cloneDeep(this.initialFieldData),
      };
    }

    shouldComponentUpdate() {
      return Boolean(this.reduxRenderCount > 1);
    }

    componentWillMount() {
      this.unsubscribeFromStore = this.context.store.subscribe(() => {
        const state: State = this.context.store.getState();
        const currentFormData: State = getIn(state, this.context._reformRedux.form.path);
        const currentFieldData: FieldData = this.state.field;
        const nextFieldData: { field: FieldData } = {
          field: getIn(
            state,
            [...this.context._reformRedux.form.path, 'fields', this.props.name],
            this.state.field,
          ),
        };

        if (currentFormData.submitted) {
          this.fieldWasTouched = true;
        }

        this.reduxRenderCount += 1;

        if (!isEqual(currentFieldData, nextFieldData.field)) {
          this.setState({
            field: cloneDeep(nextFieldData.field),
          });
        }
      });

      const initialFieldData = cloneDeep(this.initialFieldData);
      const { type, checked, multiple, component } = this.props;

      const validate = getValidateFunctionsArray(this.props.validate || []);
      const state: State = this.context.store.getState();
      const currentFormData = getIn(state, this.context._reformRedux.form.path);

      this.context._reformRedux.form.registerField(this.props.name, initialFieldData, validate, {
        type,
        checked,
        multiple,
        component,
      });

      if (Object.keys(getIn(currentFormData, ['fields'])).length) {
        this.context._reformRedux.form.updateForm();
      }
    }

    componentWillUnmount() {
      this.unsubscribeFromStore();
      this.context._reformRedux.form.unregisterField(this.props.name);
    }

    componentWillReceiveProps(nextProps: ComponentProps) {
      if (nextProps.value !== undefined && !isEqual(this.props.value, nextProps.value)) {
        this.changeFieldValue(nextProps.value);
      }
    }

    setFieldErrors = (errors: Array<string>) => {
      if (!isEqual(this.state.field.errors, errors)) {
        this.context._reformRedux.field.setFieldErrors(this.props.name, errors);
      }
    };

    changeFieldValue = async (value: any) => {
      this.context._reformRedux.field.changeFieldValue(this.props.name, value);

      if (this.fieldWasTouched && this.props.validate) {
        const validate: Array<Function> = getValidateFunctionsArray(this.props.validate);
        const errors: Array<string> = await validateField(value, validate);
        this.setFieldErrors(errors);
      }
    };

    getFieldValue = (data: any): any => {
      if (data.nativeEvent && data.nativeEvent instanceof Event) {
        if (this.isRadio()) {
          return data.target.checked ? this.props.value : '';
        }

        if (this.isCheckbox()) {
          if (this.context._reformRedux.form.fieldsCount[this.props.name] > 1) {
            return data.target.checked
              ? [...this.state.field.value, this.props.value]
              : this.state.field.value.filter(value => value !== this.props.value);
          }

          return data.target.checked ? this.props.value : '';
        }

        if (this.props.component === 'select' && this.props.multiple) {
          return [].slice.call(data.target.selectedOptions).map(option => {
            return option.value;
          });
        }

        return data.target.value;
      }

      return data;
    };

    changeFieldValueHandler = (data: any, normalizeWhen: string = 'onChange') => {
      let value: any = this.getFieldValue(data);
      const { normalize } = this.props;

      if (normalize) {
        const state: State = this.context.store.getState();
        const currentFormData: State = getIn(state, this.context._reformRedux.form.path);
        const fields: FieldsData = getIn(currentFormData, ['fields']);

        value = normalize(value, this.state.field.value, fields, normalizeWhen);
      }

      this.changeFieldValue(value);

      if (this.props.onChange) {
        this.props.onChange(data, value);
      }
    };

    onBlurFieldHandler = async (event: Event) => {
      if (this.props.onBlur) {
        const fieldData: FieldData = this.state.field;
        this.props.onBlur(event, fieldData);
      }

      if (this.props.normalize) {
        this.changeFieldValueHandler(this.state.field.value, 'onBlur');
      }

      // If the field was touched don't validate him.

      if (this.fieldWasTouched) return;
      this.fieldWasTouched = true;

      if (this.props.validate) {
        const validate = getValidateFunctionsArray(this.props.validate || []);
        const errors = await validateField(this.state.field.value, validate);
        this.setFieldErrors(errors);
      }
    };

    onFocusFieldHandler = (event: Event) => {
      if (this.props.normalize) {
        this.changeFieldValueHandler(this.state.field.value, 'onFocus');
      }

      if (this.props.onFocus) {
        const fieldData: FieldData = this.state.field;
        this.props.onFocus(event, fieldData);
      }
    };

    isRadioOrCheckbox = () => {
      return this.isRadio() || this.isCheckbox();
    };

    isCheckbox = () => {
      const { type } = this.props;
      return type && type === 'checkbox';
    };

    isRadio = () => {
      const { type } = this.props;
      return type && type === 'radio';
    };

    render() {
      // eslint-disable-next-line no-unused-vars
      const { normalize, component, name, validate, disabled, ...restProps } = this.props;
      let fieldProps: {
        onChange: Function,
        onBlur: Function,
        onFocus: Function,
        value: any,
        disabled: boolean,
      } = {
        ...restProps,
        onChange: this.changeFieldValueHandler,
        onBlur: this.onBlurFieldHandler,
        onFocus: this.onFocusFieldHandler,
        value: this.state.field.value,
        disabled: this.state.field.disabled,
      };

      if (this.isRadioOrCheckbox()) {
        fieldProps = {
          ...fieldProps,
          checked: restProps.value === this.state.field.value,
          value: restProps.value,
        };
      }

      if (this.isCheckbox() && Array.isArray(this.state.field.value)) {
        fieldProps = {
          ...fieldProps,
          checked: this.state.field.value.indexOf(restProps.value) !== -1,
        };
      }

      if (typeof component !== 'string') {
        fieldProps = {
          ...fieldProps,
          formName: this.context._reformRedux.form.name,
          errors: this.state.field.errors,
        };
      }

      if (component === 'select' && restProps.multiple && !this.state.field.value) {
        fieldProps = {
          ...fieldProps,
          value: [],
        };
      }

      return createElement(this.props.component, fieldProps);
    }
  }

  return Field;
};
