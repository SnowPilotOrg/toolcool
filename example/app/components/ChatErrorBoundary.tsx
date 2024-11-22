type ChatErrorBoundaryProps = {
  error: string | null;
};

export const ChatErrorBoundary = ({ error }: ChatErrorBoundaryProps) => {
  if (!error) return null;

  return (
    <div className="whitespace-pre-wrap rounded-lg bg-danger-100 p-3 text-sm text-danger-700 border border-danger-200">
      ❌ {error}
    </div>
  );
}; 