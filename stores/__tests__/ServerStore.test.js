/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Url from 'url';

import ServerStore from '../ServerStore';

const mockFetchInfo = jest.fn();
jest.mock('../../models/ServerModel', () => {
	return class {
		id
		url
		fetchInfo = mockFetchInfo

		constructor(id, url) {
			this.id = id;
			this.url = url;
		}
	};
});

describe('ServerStore', () => {
	const store = new ServerStore();

	it('should initialize with an empty array', () => {
		expect(store.servers).toHaveLength(0);
	});

	it('should allow servers to be added', () => {
		store.addServer({ url: Url.parse('https://foobar') });
		expect(store.servers).toHaveLength(1);
		expect(store.servers[0].id).toBe(0);
		expect(store.servers[0].url.host).toBe('foobar');

		store.addServer({ url: Url.parse('https://baz') });
		expect(store.servers).toHaveLength(2);
	});

	it('should remove servers by index', () => {
		store.removeServer(0);

		expect(store.servers).toHaveLength(1);
		expect(store.servers[0].id).toBe(1);
		expect(store.servers[0].url.host).toBe('baz');
	});

	it('should reset to an empty array', () => {
		store.reset();

		expect(store.servers).toHaveLength(0);
	});

	it('should call fetchInfo for each server', () => {
		store.addServer({ url: Url.parse('https://foobar') });
		store.addServer({ url: Url.parse('https://baz') });
		store.fetchInfo();

		expect(mockFetchInfo).toHaveBeenCalledTimes(2);
	});
});
