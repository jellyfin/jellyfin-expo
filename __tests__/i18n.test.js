/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import i18next, { resources } from '../i18n';

describe('i18n', () => {
	it('should initialize i18next', () => {
		for (const lng of Object.keys(resources)) {
			expect(i18next.hasResourceBundle(lng, 'translation')).toBe(true);
		}
	});
});
