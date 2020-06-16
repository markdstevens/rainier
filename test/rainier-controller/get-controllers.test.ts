import { getControllers } from 'rainier-controller/get-controllers';

jest.doMock(__CONTROLLERS_MANIFEST__, () => ({
  default: [],
}));

afterAll(() => jest.unmock(__CONTROLLERS_MANIFEST__));

describe('getControllers', () => {
  it('returns the user-defined controllers', () => {
    expect(getControllers()).toStrictEqual([]);
  });
});
