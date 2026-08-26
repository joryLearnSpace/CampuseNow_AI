interface LoadingStateProps {
  message?: string;
  inline?: boolean;
}

export default function LoadingState({ message = "Loading...", inline = false }: LoadingStateProps) {
  if (inline) {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
        {message}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
