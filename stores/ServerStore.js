/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';

export default class ServerStore {
  @persist('list')
  @observable
  servers = []

  @action
  addServer(server) {
    this.servers.push(server);
  }

  @action
  removeServer(index) {
    this.servers.splice(index, 1);
  }
}
