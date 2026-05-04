/**
 * Palette unique pour les contrôles « favori » activité (fiche + cartes).
 * Équivalent Tailwind : red-200/50/100/300/700/800 et slate-200/50/100/300/700/900.
 */
export const ACTIVITY_FAVORITE_PALETTE = {
	favorited: {
		border: "#fecaca",
		background: "#fef2f2",
		foreground: "#b91c1c",
		borderHover: "#fca5a5",
		backgroundHover: "#fee2e2",
		foregroundHover: "#991b1b",
		ring: "rgba(248, 113, 113, 0.5)",
	},
	unfavorited: {
		border: "#e2e8f0",
		background: "#f8fafc",
		foreground: "#334155",
		borderHover: "#cbd5e1",
		backgroundHover: "#f1f5f9",
		foregroundHover: "#0f172a",
		ring: "rgba(148, 163, 184, 0.45)",
	},
} as const;

/** Bouton pilule « Favori » (fiche) — aligné sur l’IconButton carte + ripple MUI. */
export function activityFavoritePillButtonSx(favorited: boolean) {
	const p = favorited
		? ACTIVITY_FAVORITE_PALETTE.favorited
		: ACTIVITY_FAVORITE_PALETTE.unfavorited;
	return {
		position: "relative",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "8px",
		flexShrink: 0,
		borderRadius: "9999px",
		padding: "8px 16px",
		fontSize: "0.875rem",
		fontWeight: 600,
		fontFamily: "inherit",
		textTransform: "none" as const,
		lineHeight: 1.5,
		border: "1px solid",
		borderColor: p.border,
		backgroundColor: p.background,
		color: p.foreground,
		boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
		transition:
			"background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, transform 0.2s ease",
		"&:hover:not(.Mui-disabled)": {
			backgroundColor: p.backgroundHover,
			borderColor: p.borderHover,
			color: p.foregroundHover,
			boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
		},
		"&:active:not(.Mui-disabled)": {
			transform: "scale(0.97)",
		},
		"&.Mui-focusVisible": {
			outline: "2px solid transparent",
			boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${p.ring}, 0 1px 2px rgba(15, 23, 42, 0.06)`,
		},
		"&.Mui-focusVisible:hover:not(.Mui-disabled)": {
			boxShadow: `0 0 0 2px #fff, 0 0 0 4px ${p.ring}, 0 4px 12px rgba(15, 23, 42, 0.12)`,
		},
		"&.Mui-disabled": {
			opacity: 0.6,
			cursor: "wait",
		},
		"& .MuiTouchRipple-root": {
			color: p.foreground,
		},
	};
}

/** Styles MUI IconButton (carte liste / profil) — mêmes couleurs que la fiche. */
export function activityFavoriteIconButtonSx(favorited: boolean) {
	const p = favorited
		? ACTIVITY_FAVORITE_PALETTE.favorited
		: ACTIVITY_FAVORITE_PALETTE.unfavorited;
	return {
		border: "1px solid",
		borderColor: p.border,
		backgroundColor: p.background,
		color: p.foreground,
		boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
		transition:
			"background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease, transform 0.2s ease",
		"&:hover": {
			backgroundColor: p.backgroundHover,
			borderColor: p.borderHover,
			color: p.foregroundHover,
			boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
		},
		"&:active": {
			transform: "scale(0.97)",
		},
		"&.Mui-focusVisible": {
			outline: "2px solid",
			outlineColor: p.ring,
			outlineOffset: 2,
		},
	};
}
