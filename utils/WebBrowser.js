/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as WebBrowser from "expo-web-browser";

import Colors from '../constants/Colors';

export async function openBrowser(url, options) {
  const finalOptions = Object.assign({
    toolbarColor: Colors.backgroundColor,
    controlsColor: Colors.tintColor
  }, options);

  try {
    await WebBrowser.openBrowserAsync(url, finalOptions);
  } catch (err) {
    // Workaround issue where swiping browser closed does not dismiss it.
    // https://github.com/expo/expo/issues/6918
    if (err.message === 'Another WebBrowser is already being presented.') {
      try {
        await WebBrowser.dismissBrowser();
        return WebBrowser.openBrowserAsync(url, finalOptions);
      } catch (retryErr) {
        console.warn('Could not dismiss and reopen browser', retryErr);
      }
    } else {
      console.warn('Could not open browser', err);
    }
  }
}
