/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('staticjs');

defaultConfig.server.rewriteRequestUrl = (url) => {
	if (!url.endsWith('.bundle')) {
		return url;
	}
	// https://github.com/facebook/react-native/issues/36794
	// JavaScriptCore strips query strings, so try to re-add them with a best guess.
	return url + '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true';
};

module.exports = defaultConfig;
