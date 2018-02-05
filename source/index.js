import plain from './utils/plainFunctions';
import { createFormReducer } from './reducers/formReducer';

const dataFunctions = plain();

// Reducer

const formReducerCreator = createFormReducer(dataFunctions);
export { formReducerCreator };

// Actions

export {
  changeFieldsValues,
  changeFieldValue,
  setFieldErrors,
  setFieldsErrors,
  setFieldDisabled,
  setFieldsDisabled,
  resetField,
  resetFields,
} from './actions/Field';
export { resetForm } from './actions/Form';

// Components

export { default as Form } from './components/Form';
export { default as Field } from './components/Field';
export { default as Button } from './components/Button';

// Containers

export { default as selectFormData } from './containers/selectFormData';
