/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as WebBrowser from 'expo-web-browser';

import Colors from '../../constants/Colors';
import { openBrowser } from '../WebBrowser';

jest.mock('expo-web-browser');

describe('WebBrowser', () => {
	describe('openBrowser()', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should call WebBrowser.openBrowserAsync with default options', async () => {
			WebBrowser.openBrowserAsync.mockResolvedValue('success');

			await openBrowser('http://foobar');

			expect(WebBrowser.openBrowserAsync.mock.calls).toHaveLength(1);
			expect(WebBrowser.openBrowserAsync.mock.calls[0][0]).toBe('http://foobar');
			expect(WebBrowser.openBrowserAsync.mock.calls[0][1].toolbarColor).toBe(Colors.blackish);
			expect(WebBrowser.openBrowserAsync.mock.calls[0][1].controlsColor).toBe(Colors.blue);
		});

		it('should call dismiss reopen when already presented', async () => {
			WebBrowser.dismissBrowser.mockResolvedValue('success');
			WebBrowser.openBrowserAsync.mockRejectedValueOnce(new Error('Another WebBrowser is already being presented.'));
			WebBrowser.openBrowserAsync.mockResolvedValue('success');

			await openBrowser('http://foobar');

			expect(WebBrowser.dismissBrowser.mock.calls).toHaveLength(1);
			expect(WebBrowser.openBrowserAsync.mock.calls).toHaveLength(2);
		});

		it('should catch errors dismissing the browser', async () => {
			WebBrowser.dismissBrowser.mockRejectedValue('fail');
			WebBrowser.openBrowserAsync.mockRejectedValue(new Error('Another WebBrowser is already being presented.'));

			await openBrowser('http://foobar');

			expect(WebBrowser.dismissBrowser.mock.calls).toHaveLength(1);
			expect(WebBrowser.openBrowserAsync.mock.calls).toHaveLength(1);
		});

		it('should not retry on other errors', async () => {
			WebBrowser.openBrowserAsync.mockRejectedValue('fail');

			await openBrowser('http://foobar');

			expect(WebBrowser.openBrowserAsync.mock.calls).toHaveLength(1);
		});
	});
});
