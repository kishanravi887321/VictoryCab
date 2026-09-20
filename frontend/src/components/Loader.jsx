export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-[color:var(--color-muted)]">
      <div className="w-6 h-6 rounded-full border-2 border-[color:var(--color-terra)] border-t-transparent animate-spin" />
      <div className="text-sm">{label}</div>
    </div>
  );
}

export function Spinner() {
  return <div className="w-4 h-4 inline-block rounded-full border-2 border-current border-t-transparent animate-spin" />;
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="card p-8 text-center">
      <div className="font-display text-xl font-semibold mb-2">{title}</div>
      {body && <div className="text-sm text-[color:var(--color-muted)] mb-4 max-w-md mx-auto">{body}</div>}
      {action}
    </div>
  );
}
