import plain from './utils/plainFunctions';
import { createFormReducer } from './reducers/formReducer';
import { createFormComponent } from './components/Form';
import { createFieldComponent } from './components/Field';
import { createButtonComponent } from './components/Button';
import type { DataFunctions } from './types/dataFunctions';

const dataFunctions: DataFunctions = plain();

// Reducer

const formReducerCreator: Function = createFormReducer(dataFunctions);
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

const Form = createFormComponent(dataFunctions);
const Field = createFieldComponent(dataFunctions);
const Button = createButtonComponent(dataFunctions);

export { Form, Field, Button };

// Containers

export { default as selectFormData } from './containers/selectFormData';
