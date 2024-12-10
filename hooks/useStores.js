/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useDownloadStore } from '../stores/DownloadStore';
import { useRootStore } from '../stores/RootStore';

// Compatibility for zustand conversion
export const useStores = () => ({ 
  rootStore: useRootStore(),
  downloadStore: useDownloadStore()
})
