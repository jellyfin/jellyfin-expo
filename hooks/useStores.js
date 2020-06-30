/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createContext, useContext } from 'react';

import RootStore from '../stores/RootStore';

export const storesContext = createContext({
  rootStore: new RootStore()
});

export const useStores = () => useContext(storesContext);
