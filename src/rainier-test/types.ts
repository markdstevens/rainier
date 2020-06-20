import type { FC } from 'react';
import type { Store } from 'rainier-store/types';

interface StoreProviderBuilder {
  /**
   * This function adds the result of "initStore" to the stores that should be
   * provided and consumable via the useStore hook.
   *
   * @param StoreConstructor The store class you want to be available via useStore
   * @param initialData The initial data you want to populate the store with
   *
   * @returns An instance of itself to you can chain together multiple ".with" calls.
   */
  with<T>(initStore: () => Store, initialData?: Partial<T>): StoreProviderBuilder;
  /**
   * Should be called after all ".with" calls. This function will actually render
   * out the store providers and return a new component to the test.
   *
   * @example
   *
   * class MyCustomStore extends Store {
   *   static getDefaultState() {
   *      return {
   *        message: "Hello, World!",
   *      };
   *    }
   * }
   *
   * it('should render message from my store', () => {
   *   const MyComponent = () => {
   *     const myFirstStore = useStore(MyCustomStore);
   *
   *     return (
   *       <div>{myFirstStore.state.message}</div>
   *     );
   *   };
   *
   *   const MyComponentWithStores = setupStores(MyComponent)
   *     .with(MyCustomStore, { message: 'Hello, World!' })
   *     .provide();
   *
   *   const { queryByText } = render(<MyComponentWithStores />);
   *
   *   expect(queryByText('Hello, World!')).not.toBeNull();
   * });
   *
   */
  provide(): FC;
}

export type { StoreProviderBuilder };
