import immutable from './utils/immutableFunctions';
import { createFormReducer } from './reducers/formReducer';

const dataFunctions = immutable();

// Reducer

const formReducerCreator = createFormReducer(dataFunctions);
export { formReducerCreator };
