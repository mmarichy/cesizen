"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/lib/activities";

export function useActivitiesFromApi(
	initialActivities: Activity[],
) {
	const [activities, setActivities] = useState<
		Activity[]
	>(initialActivities);
	const [isLoading, setIsLoading] = useState(
		initialActivities.length === 0,
	);

	useEffect(() => {
		let cancelled = false;

		const fetchActivities = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					"/api/activities",
					{
						method: "GET",
						cache: "no-store",
					},
				);
				if (!response.ok) {
					throw new Error(
						"Échec de récupération des activités",
					);
				}
				const data =
					(await response.json()) as Activity[];
				if (!cancelled) {
					setActivities(data);
				}
			} catch (error) {
				console.error(error);
				if (!cancelled) {
					setActivities([]);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		void fetchActivities();

		return () => {
			cancelled = true;
		};
	}, []);

	return { activities, isLoading };
}
