/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ignore } from 'mobx-sync';

import ServerStore from "./ServerStore";
import SettingStore from "./SettingStore";

export default class RootStore {
  @ignore
  storeLoaded = false

  serverStore = new ServerStore()
  settingStore = new SettingStore()

  reset() {
    this.serverStore.reset();
    this.settingStore.reset();
  }
}
