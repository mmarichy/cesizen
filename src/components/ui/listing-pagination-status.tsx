import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type ListingPaginationStatusProps = {
	showPagination: boolean;
	showAllLoadedHint: boolean;
	page: number;
	totalPages: number;
	onPaginationChange: (nextPage: number) => void;
	paginationAriaLabel: string;
	allLoadedText: string;
};

export function ListingPaginationStatus({
	showPagination,
	showAllLoadedHint,
	page,
	totalPages,
	onPaginationChange,
	paginationAriaLabel,
	allLoadedText,
}: ListingPaginationStatusProps) {
	if (showPagination) {
		return (
			<Stack
				alignItems="center"
				sx={{ mt: 4 }}>
				<Pagination
					count={totalPages}
					page={page}
					onChange={(_, value) => {
						onPaginationChange(value);
					}}
					color="primary"
					shape="rounded"
					size="large"
					showFirstButton={totalPages > 5}
					showLastButton={totalPages > 5}
					sx={{
						"& .MuiPaginationItem-root": {
							fontWeight: 600,
						},
					}}
					aria-label={paginationAriaLabel}
				/>
			</Stack>
		);
	}

	if (showAllLoadedHint) {
		return (
			<Typography
				variant="body2"
				textAlign="center"
				sx={{
					mt: 3,
					color: "#64748b",
				}}>
				{allLoadedText}
			</Typography>
		);
	}

	return null;
}
