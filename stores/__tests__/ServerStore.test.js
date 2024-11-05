/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { URL } from 'url';

import ServerModel from '../../models/ServerModel';

import ServerStore, { DESERIALIZER } from '../ServerStore';

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
		store.addServer({ url: new URL('https://foobar') });
		expect(store.servers).toHaveLength(1);
		expect(store.servers[0].id).toBeDefined();
		expect(store.servers[0].url.host).toBe('foobar');

		store.addServer({ url: new URL('https://baz') });
		expect(store.servers).toHaveLength(2);
	});

	it('should remove servers by index', () => {
		store.removeServer(0);

		expect(store.servers).toHaveLength(1);
		expect(store.servers[0].id).toBeDefined();
		expect(store.servers[0].url.host).toBe('baz');
	});

	it('should reset to an empty array', () => {
		store.reset();

		expect(store.servers).toHaveLength(0);
	});

	it('should call fetchInfo for each server', () => {
		store.addServer({ url: new URL('https://foobar') });
		store.addServer({ url: new URL('https://baz') });
		store.fetchInfo();

		expect(mockFetchInfo).toHaveBeenCalledTimes(2);
	});
});

describe('DESERIALIZER', () => {
	it('should deserialize to a list of ServerModels', () => {
		const serialized = [
			{
				id: 'TEST1',
				url: { href: 'https://1.example.com' },
				info: null
			},
			{
				id: 'TEST2',
				url: 'https://2.example.com/',
				info: null
			}
		];

		const deserialized = DESERIALIZER(serialized);

		expect(deserialized).toHaveLength(2);

		expect(deserialized[0]).toBeInstanceOf(ServerModel);
		expect(deserialized[0].id).toBe(serialized[0].id);
		// expect(deserialized[0].url).toBeInstanceOf(URL);
		expect(deserialized[0].url.href).toBe('https://1.example.com/');

		expect(deserialized[1]).toBeInstanceOf(ServerModel);
		expect(deserialized[1].id).toBe(serialized[1].id);
		// expect(deserialized[1].url).toBeInstanceOf(URL);
		expect(deserialized[1].url.href).toBe('https://2.example.com/');
	});
});
