/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NavigationContainer } from '@react-navigation/native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { parseUrl, validateServer } from '../../utils/ServerValidator';
import ServerInput from '../ServerInput';

import '../../i18n';

jest.mock('../../utils/ServerValidator');
parseUrl.mockImplementation(url => url);
validateServer.mockResolvedValue({ isValid: true });

describe('ServerInput', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	it('should render correctly', async () => {
		const { toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput />
			</NavigationContainer>
		);

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});

	it('should show error when input is blank', async () => {
		const onError = jest.fn();
		const onSuccess = jest.fn();
		const { getByTestId, toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput
					onError={onError}
					onSuccess={onSuccess}
				/>
			</NavigationContainer>
		);
		const input = getByTestId('server-input');

		fireEvent(input, 'onSubmitEditing');

		await waitFor(() => expect(onError).toHaveBeenCalled());
		expect(onSuccess).not.toHaveBeenCalled();
		expect(parseUrl).not.toHaveBeenCalled();
		expect(validateServer).not.toHaveBeenCalled();

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});

	it('should show error when url is undefined', async () => {
		const onError = jest.fn();
		const onSuccess = jest.fn();
		const { getByTestId, toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput
					onError={onError}
					onSuccess={onSuccess}
				/>
			</NavigationContainer>
		);
		const input = getByTestId('server-input');

		fireEvent(input, 'onChangeText', undefined);
		fireEvent(input, 'onSubmitEditing');

		await waitFor(() => expect(onError).toHaveBeenCalled());
		expect(onSuccess).not.toHaveBeenCalled();
		expect(parseUrl).not.toHaveBeenCalled();
		expect(validateServer).not.toHaveBeenCalled();

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});

	it('should show error when url is whitespace', async () => {
		const onError = jest.fn();
		const onSuccess = jest.fn();
		const { getByTestId, toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput
					onError={onError}
					onSuccess={onSuccess}
				/>
			</NavigationContainer>
		);
		const input = getByTestId('server-input');

		fireEvent(input, 'onChangeText', '   	');
		fireEvent(input, 'onSubmitEditing');

		await waitFor(() => expect(onError).toHaveBeenCalled());
		expect(onSuccess).not.toHaveBeenCalled();
		expect(parseUrl).not.toHaveBeenCalled();
		expect(validateServer).not.toHaveBeenCalled();

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});

	it('should succeed for valid urls', async () => {
		const onError = jest.fn();
		const onSuccess = jest.fn();
		const { getByTestId, toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput
					onError={onError}
					onSuccess={onSuccess}
				/>
			</NavigationContainer>
		);
		const input = getByTestId('server-input');
		fireEvent(input, 'onChangeText', 'test');
		fireEvent(input, 'onSubmitEditing');

		await waitFor(() => expect(onSuccess).toHaveBeenCalled());
		expect(onError).not.toHaveBeenCalled();
		expect(parseUrl).toHaveBeenCalled();
		expect(validateServer).toHaveBeenCalled();

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});

	it('should show error if parseUrl throws', async () => {
		const onError = jest.fn();
		const onSuccess = jest.fn();
		const { getByTestId, toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput
					onError={onError}
					onSuccess={onSuccess}
				/>
			</NavigationContainer>
		);

		parseUrl.mockImplementationOnce(() => {
			throw new Error('test error');
		});

		const input = getByTestId('server-input');
		fireEvent(input, 'onChangeText', 'test');
		fireEvent(input, 'onSubmitEditing');

		await waitFor(() => expect(onError).toHaveBeenCalled());
		expect(onSuccess).not.toHaveBeenCalled();
		expect(parseUrl).toHaveBeenCalled();
		expect(validateServer).not.toHaveBeenCalled();

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});

	it('should show error if url is invalid', async () => {
		const onError = jest.fn();
		const onSuccess = jest.fn();
		const { getByTestId, toJSON, unmount } = render(
			<NavigationContainer>
				<ServerInput
					onError={onError}
					onSuccess={onSuccess}
				/>
			</NavigationContainer>
		);

		validateServer.mockResolvedValueOnce({ isValid: false });

		const input = getByTestId('server-input');
		fireEvent(input, 'onChangeText', 'test');
		fireEvent(input, 'onSubmitEditing');

		await waitFor(() => expect(onError).toHaveBeenCalled());
		expect(onSuccess).not.toHaveBeenCalled();
		expect(parseUrl).toHaveBeenCalled();
		expect(validateServer).toHaveBeenCalled();

		expect(toJSON()).toMatchSnapshot();
		act(unmount);
	});
});
