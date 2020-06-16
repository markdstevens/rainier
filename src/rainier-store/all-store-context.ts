import { createContext } from 'react';
import type { Stores } from './types';

/**
 * This provides an easy hook into retrieving all the stores
 * in the application. To retrieve the stores, use React's
 * useContext hook like this:
 *
 *   const { stores, get } = React.useContext(AllStoreContext);
 */
export const AllStoreContext = createContext<Stores>({} as Stores);
