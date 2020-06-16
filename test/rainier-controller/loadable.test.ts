import loadable from '@loadable/component';
import { loadable as codeSplit } from 'rainier-controller/loadable';

jest.mock('@loadable/component');
afterAll(() => jest.unmock('@loadable/component'));

describe('loadable', () => {
  it('returns the loadable function from the loadable component lib', () => {
    expect(loadable).toBe(codeSplit);
  });
});
