/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, observable } from 'mobx';

/**
 * Data store for application settings
 */
export default class SettingStore {
  /**
   * The id of the currently selected server
   */
  @observable
  activeServer = 0

  /**
   * Is device rotation enabled
   */
  @observable
  isRotationEnabled

  /**
   * Is screen lock active when media is playing
   */
  @observable
  isScreenLockEnabled = true

  @action
  reset() {
    this.activeServer = 0;
    this.isRotationEnabled = null;
    this.isScreenLockEnabled = true;
  }
}
