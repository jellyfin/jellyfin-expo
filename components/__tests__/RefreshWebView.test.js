/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import RefreshWebView from '../RefreshWebView';

// NOTE: This test just verifies the component renders, because the
// functionality would be very difficult to test properly
describe('RefreshWebView', () => {
	it('should render', () => {
		const { toJSON } = render(
			<RefreshWebView
				isRefreshing={false}
			/>
		);

		expect(toJSON()).toMatchSnapshot();
	});
});
