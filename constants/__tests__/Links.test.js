/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { QuickStartUrl } from '../Links';

// I don't understand why jest thinks this needs test coverage, but it does =/
describe('Links', () => {
	it('should return the right url', () => {
		expect(QuickStartUrl).toBe('https://jellyfin.org/docs/general/quick-start');
	});
});
