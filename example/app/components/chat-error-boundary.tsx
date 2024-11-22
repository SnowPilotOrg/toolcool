type ChatErrorBoundaryProps = {
	error: string | null;
};

export const ChatErrorBoundary = ({ error }: ChatErrorBoundaryProps) => {
	if (!error) return null;

	return (
		<div className="whitespace-pre-wrap rounded-lg border border-danger-200 bg-danger-100 p-3 text-danger-700 text-sm">
			❌ {error}
		</div>
	);
};
