import { asyncForEach } from '../utils/common';
import type { FieldValidateProp, FieldValue } from '../types/Field';

export const getValidateFunctionsArray: Function = (
  validateProp: FieldValidateProp,
): Array<Function> => {
  if (!validateProp || !validateProp.length) return [];
  const validate: Array<Function> = !Array.isArray(validateProp) ? [validateProp] : validateProp;

  return validate;
};

export const validateField: Function = async (
  value: FieldValue,
  validateFunctions: Array<Function>,
): Promise<Array<string>> => {
  const errorsStack: Array<string> = [];
  if (!validateFunctions.length) return errorsStack;

  await asyncForEach(validateFunctions, async (errorChecker: Function) => {
    if (typeof errorChecker !== 'function')
      throw new Error('"validate" prop must be Array<Function> or Function');

    const checkerResult: string = await errorChecker(value);

    if (checkerResult && typeof checkerResult === 'string') {
      errorsStack.push(checkerResult);
    }
  });

  return errorsStack;
};
