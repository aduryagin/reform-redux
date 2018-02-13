import { getValidateFunctionsArray, validateField } from '../Field';
import plain from '../plainFunctions';

describe('utils/Field', () => {
  it('getValidateFunctionsArray', () => {
    expect.assertions(4);

    expect(getValidateFunctionsArray(plain())(null)).toEqual([]);
    expect(getValidateFunctionsArray(plain())([])).toEqual([]);
    expect(getValidateFunctionsArray(plain())('test')).toEqual(['test']);
    expect(getValidateFunctionsArray(plain())(['test'])).toEqual(['test']);
  });

  it('validateField', async () => {
    expect.assertions(4);
    jest.useFakeTimers();

    expect(await validateField('test', [], plain())).toEqual([]);
    expect(
      await validateField('test', [() => 'first error', () => 'second error'], plain()),
    ).toEqual(['first error', 'second error']);
    await validateField('test', [''], plain()).catch(error =>
      expect(error.message).toBe('"validate" prop must be Array<Function> or Function'),
    );
    expect(
      await validateField(
        'test',
        [
          () =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve('error');
              }, 1000);
              jest.runAllTimers();
            }),
        ],
        plain(),
      ),
    ).toEqual(['error']);
  });
});
