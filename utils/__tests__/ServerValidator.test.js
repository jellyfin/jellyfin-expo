/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Url from 'url';

import { getServerUrl, parseUrl, validateServer } from '../ServerValidator';

describe('ServerValidator', () => {
	describe('parseUrl()', () => {
		it('should throw an error if called without host', () => {
			expect(parseUrl).toThrow('host cannot be blank');
		});

		it('should throw an error if hostname is invalid', () => {
			expect(() => parseUrl(' ')).toThrow('Could not parse hostname for http:// ');
		});

		it('should default to http protocol if not specified', () => {
			const url = parseUrl('foobar');
			expect(url.protocol).toBe('http:');
			expect(url.hostname).toBe('foobar');
		});

		it('should override port if specified', () => {
			const url = parseUrl('foobar', 8096);
			expect(url.protocol).toBe('http:');
			expect(url.hostname).toBe('foobar');
			expect(url.port).toBe(8096);
		});

		it('should use https protocol if specified', () => {
			const url = parseUrl('https://foobar');
			expect(url.protocol).toBe('https:');
			expect(url.hostname).toBe('foobar');
		});
	});

	describe('fetchServerInfo()', () => {
		//TODO: Add tests
	});

	describe('getServerUrl()', () => {
		it('should throw an error if called without server', () => {
			expect(getServerUrl).toThrow('Cannot get server url for invalid server');
		});

		it('should strip search part from the server url', () => {
			const server = { url: Url.parse('https://foobar/?search') };
			expect(getServerUrl(server)).toBe('https://foobar/');
		});

		it('should strip hash part from the server url', () => {
			const server = { url: Url.parse('https://foobar/#hash') };
			expect(getServerUrl(server)).toBe('https://foobar/');
		});

		it('should append a trailing slash to the server url', () => {
			const server = { url: { href: 'https://foobar' } };
			expect(getServerUrl(server)).toBe('https://foobar/');
		});

		it('should return the url if called with a valid server object', () => {
			const server = { url: Url.parse('https://foobar/') };
			expect(getServerUrl(server)).toBe('https://foobar/');
		});
	});

	describe('validateServer()', () => {
		it('should return invalid message when called without server', async () => {
			const result = await validateServer();
			expect(result.isValid).toBe(false);
			expect(result.message).toBe('invalid');
		});

		// TODO: Add tests
	});
});
