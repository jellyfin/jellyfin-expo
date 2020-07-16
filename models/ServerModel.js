/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, autorun, computed, decorate, observable } from 'mobx';
import { ignore } from 'mobx-sync';
import { task } from 'mobx-task';

import JellyfinValidator from '../utils/JellyfinValidator';

export default class ServerModel {
  id

  url

  online = false

  info

  constructor(id, url, info) {
    this.id = id;
    this.url = url;
    this.info = info;

    autorun(() => {
      this.urlString = this.parseUrlString;
    });
  }

  get parseUrlString() {
    try {
      return JellyfinValidator.getServerUrl(this);
    } catch (ex) {
      return '';
    }
  }

  fetchInfo = task(async () => {
    return await JellyfinValidator.fetchServerInfo(this)
      .then(action(info => {
        this.online = true;
        this.info = info;
      }));
  })
}

decorate(ServerModel, {
  id: observable,
  url: observable,
  online: [
    ignore,
    observable
  ],
  info: observable,
  parseUrlString: computed
});
