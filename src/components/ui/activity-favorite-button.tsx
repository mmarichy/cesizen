"use client";

import ButtonBase from "@mui/material/ButtonBase";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { activityFavoritePillButtonSx } from "@/lib/activity-favorite-ui";

type Props = {
	activityId: string;
	initialFavorite?: boolean;
};

export function ActivityFavoriteButton({
	activityId,
	initialFavorite = false,
}: Props) {
	const { status } = useSession();
	const router = useRouter();
	const [isFavorite, setIsFavorite] = useState(initialFavorite);
	const [pending, setPending] = useState(false);
	const [heartMotion, setHeartMotion] = useState<
		null | "pop" | "release"
	>(null);

	const authenticated = status === "authenticated";
	const sessionLoading = status === "loading";

	useEffect(() => {
		setIsFavorite(initialFavorite);
	}, [initialFavorite]);

	const toggle = useCallback(async () => {
		if (sessionLoading) {
			return;
		}
		if (!authenticated) {
			const path =
				typeof window !== "undefined"
					? `${window.location.pathname}${window.location.search}`
					: `/activites/${activityId}`;
			router.push(
				`/auth/login?callbackUrl=${encodeURIComponent(path)}`,
			);
			return;
		}
		if (pending) {
			return;
		}
		const next = !isFavorite;
		setPending(true);
		try {
			const response = next
				? await fetch("/api/account/activity-favorites", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ activityId }),
					})
				: await fetch(
						`/api/account/activity-favorites?activityId=${encodeURIComponent(activityId)}`,
						{ method: "DELETE" },
					);
			if (response.ok) {
				setIsFavorite(next);
				setHeartMotion(next ? "pop" : "release");
			}
		} finally {
			setPending(false);
		}
	}, [
		activityId,
		authenticated,
		isFavorite,
		pending,
		router,
		sessionLoading,
	]);

	const busy = sessionLoading || (authenticated && pending);

	return (
		<ButtonBase
			component="button"
			type="button"
			focusRipple
			disabled={busy}
			onClick={() => void toggle()}
			aria-busy={busy}
			aria-pressed={isFavorite}
			aria-label={
				!authenticated
					? "Se connecter pour gérer les favoris"
					: isFavorite
						? "Retirer cette activité des favoris"
						: "Ajouter cette activité aux favoris"
			}
			sx={activityFavoritePillButtonSx(isFavorite)}
			className="group">
			<span
				className={
					heartMotion === "pop"
						? "animate-favorite-heart-pop inline-flex"
						: heartMotion === "release"
							? "animate-favorite-heart-release inline-flex"
							: "inline-flex"
				}
				onAnimationEnd={() => {
					setHeartMotion(null);
				}}>
				<span className="inline-flex origin-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-95">
					<Heart
						size={18}
						className="shrink-0 transition-[fill,stroke,color] duration-300"
						aria-hidden
						fill={isFavorite ? "currentColor" : "none"}
						strokeWidth={2.25}
					/>
				</span>
			</span>
			{isFavorite ? "Retirer des favoris" : "Favori"}
		</ButtonBase>
	);
}
