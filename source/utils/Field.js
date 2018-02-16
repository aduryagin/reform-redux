import { asyncForEach } from '../utils/common';
import type { FieldValue } from '../types/Field';
import type { DataFunctions } from '../types/dataFunctions';

export const getValidateFunctionsArray: Function = (dataFunctions: DataFunctions) => (
  validateProp: any,
): Array<Function> => {
  const { listSize, list, isList }: DataFunctions = dataFunctions;

  if (!validateProp || (isList(validateProp) && !listSize(validateProp))) return list([]);
  const validate: any = !isList(validateProp) ? list([validateProp]) : validateProp;

  return validate;
};

export const validateField: Function = async (
  value: FieldValue,
  validateFunctions: Array<Function>,
  dataFunctions: DataFunctions,
): Promise<Array<string>> => {
  const { list, listSize, setIn }: DataFunctions = dataFunctions;
  let errorsStack: Array<string> = list([]);

  if (!listSize(validateFunctions)) return errorsStack;

  await asyncForEach(
    validateFunctions,
    async (errorChecker: Function) => {
      if (typeof errorChecker !== 'function')
        throw new Error('"validate" prop must be Array<Function> or Function');

      const checkerResult: string = await errorChecker(value);

      if (checkerResult && typeof checkerResult === 'string') {
        errorsStack = setIn(errorsStack, [listSize(errorsStack)], checkerResult);
      }
    },
    dataFunctions,
  );

  return errorsStack;
};
