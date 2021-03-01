/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { msToTicks, ticksToMs } from '../Time';

describe('Time', () => {
	describe('ticksToMs()', () => {
		it('should return 0 by default', () => {
			expect(ticksToMs()).toBe(0);
		});

		it('should convert from ticks to milliseconds', () => {
			expect(ticksToMs(73498419200)).toBe(7349841.92);
		});
	});

	describe('msToTicks()', () => {
		it('should return 0 by default', () => {
			expect(msToTicks()).toBe(0);
		});

		it('should convert from milliseconds to ticks', () => {
			expect(msToTicks(7349841.92)).toBe(73498419200);
		});
	});
});
