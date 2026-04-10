import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivitesClient } from "./activites-client";

export const metadata: Metadata = {
	title: "Activités de détente | Cesizen",
	description:
		"Méditation, respiration, musique et exercices pour vous détendre au quotidien.",
};

export default function ActivitesPage() {
	return (
		<div className="min-h-screen bg-linear-to-br from-white via-slate-50/90 to-teal-50/40 pb-28 md:pb-16">
			<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
				<Suspense
					fallback={
						<p className="py-12 text-center text-slate-600">
							Chargement…
						</p>
					}>
					<ActivitesClient />
				</Suspense>
			</div>
		</div>
	);
}
