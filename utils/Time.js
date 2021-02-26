/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const TICKS_PER_MS = 10000;

export const ticksToMs = (ticks = 0) => ticks / TICKS_PER_MS;

export const msToTicks = (ms = 0) => ms * TICKS_PER_MS;
