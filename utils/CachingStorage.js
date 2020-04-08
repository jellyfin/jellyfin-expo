/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { AsyncStorage } from 'react-native';

export default class CachingStorage {
  static instance = null;

  cache = new Map();

  static getInstance() {
      if (this.instance === null) {
          console.debug('CachingStorage: Initializing new instance');
          this.instance = new CachingStorage();
      } else {
          console.debug('CachingStorage: Using existing instance');
      }
      return this.instance;
  }

  async getItem(key) {
      // Throw an error if no key is provided
      if (!key) {
          throw new Error('No key specified for `getItem()`');
      }

      // Return cached value if present
      if (this.cache.has(key)) {
          console.debug(`CachingStorage: Returning value from cache for ${key}`);
          return this.cache.get(key);
      }

      // Get the item from device storage
      console.debug(`CachingStorage: Loading value from device storage for ${key}`);
      let item = await AsyncStorage.getItem(key);
      if (item !== null) {
          item = JSON.parse(item);
          this.cache.set(key, item);
      }
      return item;
  }

  async setItem(key, item = '') {
      // Throw an error if no key is provided
      if (!key) {
          throw new Error('No key specified for `setItem()`');
      }

      console.debug(`CachingStorage: Saving value to device storage for ${key}`);
      await AsyncStorage.setItem(key, JSON.stringify(item));
      this.cache.set(key, item);
  }
}
