/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import ButtonListItem from '../ButtonListItem';

describe('ButtonListItem', () => {
	it('should render correctly and handle presses', () => {
		const onPress = jest.fn();

		const { getByTestId } = render(
			<ButtonListItem
				index={0}
				item={{
					title: 'Test Button',
					onPress
				}}
			/>
		);

		const button = getByTestId('button');
		expect(button).toHaveTextContent('Test Button');

		expect(onPress).not.toHaveBeenCalled();
		fireEvent.press(button);
		expect(onPress).toHaveBeenCalled();
	});
});
