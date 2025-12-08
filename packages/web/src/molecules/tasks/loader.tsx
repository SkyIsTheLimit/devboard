export function Loader({ text }: { text?: string }) {
  return (
    <div className="flex justify-start gap-4 items-center">
      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
      {text && text}
    </div>
  );
}
