/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, decorate, observable } from 'mobx';

/**
 * Data store for application settings
 */
export default class SettingStore {
  /**
   * The id of the currently selected server
   */
  activeServer = 0

  /**
   * Is device rotation enabled
   */
  isRotationEnabled

  /**
   * Is screen lock active when media is playing
   */
  isScreenLockEnabled = true

  reset() {
    this.activeServer = 0;
    this.isRotationEnabled = null;
    this.isScreenLockEnabled = true;
  }
}

decorate(SettingStore, {
  activeServer: observable,
  isRotationEnabled: observable,
  isScreenLockEnabled: observable,
  reset: action
});
