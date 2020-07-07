/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { action, autorun, computed, observable } from 'mobx';
import { ignore } from 'mobx-sync';
import { task } from 'mobx-task';

import JellyfinValidator from '../utils/JellyfinValidator';

export default class ServerModel {
  @observable
  id

  @observable
  url

  @ignore
  @observable
  online = false

  @observable
  info

  constructor(id, url, info) {
    this.id = id;
    this.url = url;
    this.info = info;

    autorun(() => {
      this.urlString = this.parseUrlString;
    });
  }

  @computed
  get parseUrlString() {
    try {
      return JellyfinValidator.getServerUrl(this);
    } catch (ex) {
      return '';
    }
  }

  @task
  async fetchInfo() {
    return await JellyfinValidator.fetchServerInfo(this)
      .then(action(info => {
        this.online = true;
        this.info = info;
      }));
  }
}
