/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import AbortController from 'node-abort-controller';
global.AbortController = AbortController;

import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
