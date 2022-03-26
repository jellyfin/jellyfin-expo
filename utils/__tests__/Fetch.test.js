/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { fetchWithTimeout } from '../Fetch';

describe('Fetch', () => {
	beforeEach(() => {
		fetch.resetMocks();
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('fetchWithTimeout()', () => {
		it('should throw an error when duration passes', async () => {
			jest.useFakeTimers();
			fetch.mockResponse(() => {
				jest.runAllTimers();
				return Promise.resolve('');
			});

			await expect(fetchWithTimeout('http://example.com', 100))
				.rejects
				.toThrow('The operation was aborted. ');
		});
	});
});
