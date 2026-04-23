import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

type ListingPageChangeLoaderProps = {
	ariaLabel: string;
};

export function ListingPageChangeLoader({
	ariaLabel,
}: ListingPageChangeLoaderProps) {
	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{
				minHeight: 280,
				py: 6,
			}}
			aria-busy
			aria-label={ariaLabel}>
			<CircularProgress
				size={44}
				thickness={4}
				sx={{ color: "#0f766e" }}
			/>
		</Stack>
	);
}
