import { getControllers } from 'rainier-controller/get-controllers';

jest.doMock(__CONTROLLERS__, () => ({
  default: [],
}));

afterAll(() => jest.unmock(__CONTROLLERS__));

describe('getControllers', () => {
  it('returns the user-defined controllers', () => {
    expect(getControllers()).toStrictEqual([]);
  });
});
