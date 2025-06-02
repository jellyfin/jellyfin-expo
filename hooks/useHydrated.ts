/**
 * Copyright (c) 2025 Jellyfin Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';

import { useDownloadStore } from '../stores/DownloadStore';
import { useRootStore } from '../stores/RootStore';
import { useServerStore } from '../stores/ServerStore';
import { useSettingStore } from '../stores/SettingStore';

export const useIsHydrated = () => {
	const [ isHydrated, setIsHydrated ] = useState(false);
	const [ isRootStoreHydrated, setIsRootStoreHydrated ] = useState(false);
	const [ isDownloadStoreHydrated, setIsDownloadStoreHydrated ] = useState(false);
	const [ isServerStoreHydrated, setIsServerStoreHydrated ] = useState(false);
	const [ isSettingStoreHydrated, setIsSettingStoreHydrated ] = useState(false);

	useEffect(() => {
		// Root Store
		const unsubRootFinishHydration = useRootStore.persist.onFinishHydration(() => setIsRootStoreHydrated(true));
		setIsRootStoreHydrated(useRootStore.persist.hasHydrated());
		// Download Store
		const unsubDownloadFinishHydration = useDownloadStore.persist.onFinishHydration(() => setIsDownloadStoreHydrated(true));
		setIsDownloadStoreHydrated(useDownloadStore.persist.hasHydrated());
		// Server Store
		const unsubServerFinishHydration = useServerStore.persist.onFinishHydration(() => setIsServerStoreHydrated(true));
		setIsServerStoreHydrated(useServerStore.persist.hasHydrated());
		// Settings Store
		const unsubSettingFinishHydration = useSettingStore.persist.onFinishHydration(() => setIsSettingStoreHydrated(true));
		setIsSettingStoreHydrated(useSettingStore.persist.hasHydrated());

		return () => {
			unsubRootFinishHydration();
			unsubDownloadFinishHydration();
			unsubServerFinishHydration();
			unsubSettingFinishHydration();
		};
	}, []);

	useEffect(() => {
		console.debug('Hydration state', isRootStoreHydrated, isDownloadStoreHydrated, isServerStoreHydrated, isSettingStoreHydrated);
		if (isRootStoreHydrated && isDownloadStoreHydrated && isServerStoreHydrated && isSettingStoreHydrated) {
			setIsHydrated(true);
		}
	}, [ isDownloadStoreHydrated, isRootStoreHydrated, isServerStoreHydrated, isSettingStoreHydrated ]);

	return isHydrated;
};
