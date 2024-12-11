/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import { URL } from 'url';

import ServerModel from '../../models/ServerModel';

import ServerStore, { deserializer, DESERIALIZER, useServerStore } from '../ServerStore';
import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react-native';

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
	it('should initialize with an empty array', () => {
		const store = renderHook(() => useServerStore())
		expect(store.result.current.servers).toHaveLength(0);
	});

	it('should allow servers to be added', () => {
		const store = renderHook(() => useServerStore())
		act(() => {
			store.result.current.reset()
			store.result.current.addServer({ url: new URL('https://foobar') });
		})
		expect(store.result.current.servers).toHaveLength(1);
		expect(store.result.current.servers[0].id).toBeDefined();
		expect(store.result.current.servers[0].url.host).toBe('foobar');

		act(() => { store.result.current.addServer({ url: new URL('https://baz') }) })
		expect(store.result.current.servers).toHaveLength(2);
	});

	it('should remove servers by index', () => {
		const store = renderHook(() => useServerStore())
		act(() => {
			store.result.current.reset()
			store.result.current.addServer({ url: new URL('https://foobar') });
			store.result.current.addServer({ url: new URL('https://baz') });
		})

		expect(store.result.current.servers).toHaveLength(2);

		act(() => {
			store.result.current.removeServer(0)
		})

		expect(store.result.current.servers).toHaveLength(1);
		expect(store.result.current.servers[0].id).toBeDefined();
		expect(store.result.current.servers[0].url.host).toBe('baz');
	});

	it('should reset to an empty array', () => {
		const store = renderHook(() => useServerStore())
		act(() => {
			store.result.current.reset()
			store.result.current.addServer({ url: new URL('https://foobar') });
		})
		expect(store.result.current.servers).toHaveLength(1);

		act(() => { store.result.current.reset() })

		expect(store.result.current.servers).toHaveLength(0);
	});

	it('should call fetchInfo for each server', () => {
		const store = renderHook(() => useServerStore())
		act(() => {
			store.result.current.addServer({ url: new URL('https://foobar') });
			store.result.current.addServer({ url: new URL('https://baz') });
			store.result.current.fetchInfo();
		})

		expect(mockFetchInfo).toHaveBeenCalledTimes(2);
	});
});

describe('DESERIALIZER', () => {
	it('should deserialize to a list of ServerModels', () => {
		const serialized = {
			state: {
				servers: [
					{
						id: 'TEST1',
						url: { href: 'https://1.example.com' },
						info: null
					}, {
						id: 'TEST2',
						url: 'https://2.example.com/',
						info: null
					}
				]
			}
		};

		const deserialized = deserializer(JSON.stringify(serialized)).state.servers

		expect(deserialized).toHaveLength(2);

		expect(deserialized[0]).toBeInstanceOf(ServerModel);
		expect(deserialized[0].id).toBe(serialized.state.servers[0].id);
		// expect(deserialized[0].url).toBeInstanceOf(URL); // URL != URL Jest (?)
		expect(deserialized[0].url.href).toBe('https://1.example.com/');

		expect(deserialized[1]).toBeInstanceOf(ServerModel);
		expect(deserialized[1].id).toBe(serialized.state.servers[1].id);
		// expect(deserialized[1].url).toBeInstanceOf(URL); // URL != URL Jest (?)
		expect(deserialized[1].url.href).toBe('https://2.example.com/');
	});
});
