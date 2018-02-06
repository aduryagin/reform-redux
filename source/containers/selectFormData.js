import PropTypes from 'prop-types';
import { createElement, Component } from 'react';
import { isEqual, cloneDeep } from '../utils/common';
import type { ComponentType, Element } from 'react';
import type { State } from '../types/formReducer';
import type { FieldsData, FieldName } from '../types/Field';
import type { DataFunctions } from '../types/dataFunctions';

export const createSelectFormData: Function = (dataFunctions: DataFunctions) => {
  const { getIn }: DataFunctions = dataFunctions;

  const selectFormData = (fieldNames: Array<FieldName>, formPath?: string): Function => {
    return (ConnectedComponent: ComponentType<*>): ComponentType<*> => {
      class SelectFormData extends Component<*, FieldsData> {
        static contextTypes = {
          _reformRedux: PropTypes.object,
          store: PropTypes.object,
        };
        unsubscribeFromStore: Function = () => {};
        state: FieldsData;

        constructor(props, context) {
          super(props, context);

          if (!context._reformRedux) {
            throw new Error('Container `selectFormData` must be in `Form` component.');
          }

          const componentState: FieldsData = {};
          const state: State = context.store.getState();
          const currentFormData: State = getIn(state, context._reformRedux.form.path);

          fieldNames.forEach(fieldName => {
            componentState[fieldName] = getIn(currentFormData, ['fields', fieldName]) || {
              value: '',
              errors: [],
              valid: true,
              disabled: false,
            };
          });

          this.state = componentState;
        }

        shouldComponentUpdate() {
          return Boolean(Object.keys(this.state).length);
        }

        componentWillMount() {
          this.unsubscribeFromStore = this.context.store.subscribe(() => {
            const contextFormPath: Array<string> =
              (formPath && formPath.split('.')) || this.context._reformRedux.form.path;
            const state: State = this.context.store.getState();
            const fieldsData: FieldsData = {};

            fieldNames.forEach((fieldName: string) => {
              fieldsData[fieldName] = getIn(state, [...contextFormPath, 'fields', fieldName]);
            });

            if (!isEqual(this.state, fieldsData)) {
              this.setState(cloneDeep(fieldsData));
            }
          });
        }

        componentWillUnmount() {
          this.unsubscribeFromStore();
        }

        render(): Element<*> {
          const state = cloneDeep(this.state);
          return createElement(ConnectedComponent, {
            ...this.props,
            ...state,
          });
        }
      }

      return SelectFormData;
    };
  };

  return selectFormData;
};
