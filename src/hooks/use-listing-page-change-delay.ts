"use client";

import {
	useEffect,
	useState,
} from "react";
import { LISTING_PAGE_CHANGE_DELAY_MS } from "@/constants/listing-per-page";

export function useListingPageChangeDelay(
	page: number,
	filterEpochKey: string,
): { isPageChangePending: boolean } {
	const [stableDisplayPage, setStableDisplayPage] =
		useState(page);
	const [syncedEpoch, setSyncedEpoch] =
		useState(filterEpochKey);

	if (filterEpochKey !== syncedEpoch) {
		setSyncedEpoch(filterEpochKey);
		setStableDisplayPage(page);
	}

	useEffect(() => {
		if (page === stableDisplayPage) {
			return;
		}
		const id = window.setTimeout(() => {
			setStableDisplayPage(page);
		}, LISTING_PAGE_CHANGE_DELAY_MS);
		return () => window.clearTimeout(id);
	}, [page, stableDisplayPage]);

	const isPageChangePending = page !== stableDisplayPage;

	return { isPageChangePending };
}
