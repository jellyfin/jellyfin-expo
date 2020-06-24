/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { createContext, useContext } from 'react';

import ServerStore from '../stores/ServerStore';
import SettingStore from '../stores/SettingStore';

export const storesContext = createContext({
  serverStore: new ServerStore(),
  settingStore: new SettingStore()
});

export const useStores = () => useContext(storesContext);
