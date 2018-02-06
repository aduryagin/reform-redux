import { LIBRARY_NAME } from '../../constants/common';
import { debounce, asyncForEach, getReduxConst, cloneDeep, isEqual } from '../common';

describe('utils/common', () => {
  it('debounce', () => {
    jest.useFakeTimers();

    const mockFunction = jest.fn();
    const debounced = debounce(mockFunction, 100);

    debounced();
    debounced();
    debounced();

    jest.runAllTimers();

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('asyncForEach', async () => {
    jest.useFakeTimers();

    const myArray = [];
    await asyncForEach([1, 2], async item => {
      await new Promise(resolve => {
        setTimeout(() => {
          myArray.push(item);
          resolve();
        }, 100);
        jest.runAllTimers();
      });
    });

    expect(myArray).toEqual([1, 2]);
  });

  it('getReduxConst', () => {
    expect(getReduxConst('test')).toBe(`${LIBRARY_NAME}/test`);
  });

  it('cloneDeep', () => {
    const object = { a: { q: [{ z: 1 }] } };
    const clonedObject = cloneDeep(object);
    expect(Object.is(object.a.q, clonedObject.a.q)).toBe(false);
  });

  it('isEqual', () => {
    expect.assertions(2);

    const object = { a: { q: [{ z: 1 }] } };
    const clonedObject = cloneDeep(object);
    expect(isEqual(object, clonedObject)).toBe(true);
    expect(isEqual([1], [2])).toBe(false);
  });
});
