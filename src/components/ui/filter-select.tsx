"use client";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import type { FormControlProps } from "@mui/material/FormControl";
import type { SelectProps } from "@mui/material/Select";
import type { SxProps, Theme } from "@mui/material/styles";

const menuPaperSx: SxProps<Theme> = {
	borderRadius: "14px",
	marginTop: "8px",
	overflow: "hidden",
	boxShadow:
		"0 16px 48px rgba(15, 23, 42, 0.12), 0 6px 16px rgba(15, 23, 42, 0.08)",
	border: "1px solid rgba(203, 213, 225, 0.95)",
	backgroundColor: "#fff",
	maxHeight: 320,
	"& .MuiList-root": {
		padding: "6px",
	},
	"& .MuiMenuItem-root": {
		borderRadius: "10px",
		marginY: "2px",
		paddingY: 1.1,
		paddingX: 1.5,
		fontSize: "0.9375rem",
		color: "#0f172a",
		transition:
			"background-color 0.15s ease, color 0.15s ease",
	},
	"& .MuiMenuItem-root:hover": {
		backgroundColor: "rgba(241, 245, 249, 0.95)",
	},
	"& .MuiMenuItem-root.Mui-selected": {
		backgroundColor: "rgba(13, 148, 136, 0.14)",
		color: "#0f766e",
		fontWeight: 600,
		"&:hover": {
			backgroundColor: "rgba(13, 148, 136, 0.2)",
		},
	},
};

export type FilterSelectProps = Omit<
	SelectProps<string | number>,
	| "variant"
	| "labelId"
	| "id"
	| "label"
	| "size"
> & {
	/** Identifiant stable (préfixe des id d’accessibilité). */
	fieldId: string;
	/** Libellé flottant du champ. */
	label: string;
	/** Styles du conteneur FormControl. */
	formSx?: SxProps<Theme>;
	/** Taille du champ. Défaut : `small`. */
	size?: FormControlProps["size"];
};

/**
 * Menu déroulant MUI cohérent avec le reste de l’UI (ombres, arrondis, liste soignée).
 */
export function FilterSelect({
	fieldId,
	label,
	children,
	formSx,
	fullWidth = true,
	disabled,
	size = "small",
	sx: selectSx,
	MenuProps,
	slotProps,
	...selectRest
}: FilterSelectProps) {
	const labelId = `${fieldId}-label`;

	return (
		<FormControl
			fullWidth={fullWidth}
			size={size}
			disabled={disabled}
			sx={[
				{
					"& .MuiInputLabel-root": {
						fontWeight: 600,
						color: "#475569",
						"&.Mui-focused": {
							color: "#0f766e",
						},
					},
				},
				...(formSx
					? Array.isArray(formSx)
						? formSx
						: [formSx]
					: []),
			]}>
			<InputLabel id={labelId} shrink>
				{label}
			</InputLabel>
			<Select
				{...selectRest}
				displayEmpty
				labelId={labelId}
				id={fieldId}
				label={label}
				variant="outlined"
				disabled={disabled}
				IconComponent={
					KeyboardArrowDownRoundedIcon
				}
				MenuProps={{
					anchorOrigin: { vertical: "bottom", horizontal: "left" },
					transformOrigin: {
						vertical: "top",
						horizontal: "left",
					},
					slotProps: {
						paper: {
							elevation: 0,
							sx: menuPaperSx,
						},
					},
					...MenuProps,
				}}
				slotProps={slotProps}
				sx={[
					{
						borderRadius: 9999,
						backgroundColor: "#fff",
						fontWeight: 500,
						color: "#0f172a",
						transition:
							"box-shadow 0.2s ease, border-color 0.2s ease",
						boxShadow:
							"0 1px 2px rgba(15, 23, 42, 0.06), 0 2px 10px rgba(15, 23, 42, 0.06)",
						"&:hover": {
							boxShadow:
								"0 2px 8px rgba(15, 23, 42, 0.1), 0 4px 14px rgba(15, 23, 42, 0.06)",
						},
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor:
								"rgba(148, 163, 184, 0.85)",
							borderWidth: "1px",
						},
						"&:hover .MuiOutlinedInput-notchedOutline":
							{
								borderColor:
									"rgba(100, 116, 139, 1)",
							},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline":
							{
								borderWidth: "2px",
								borderColor: "#0f766e",
							},
						"& .MuiSelect-icon": {
							color: "#64748b",
							right: 10,
							transition:
								"transform 0.2s ease, color 0.2s ease",
						},
						"&.Mui-focused .MuiSelect-icon": {
							color: "#0f766e",
						},
					},
					...(selectSx
						? Array.isArray(selectSx)
							? selectSx
							: [selectSx]
						: []),
				]}
			>
				{children}
			</Select>
		</FormControl>
	);
}
