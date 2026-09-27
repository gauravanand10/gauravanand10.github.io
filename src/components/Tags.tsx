export default function Tags({ items, max, className = '' }: { items: string[]; max?: number; className?: string }) {
  const shown = max ? items.slice(0, max) : items;
  const rest = max ? items.length - shown.length : 0;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Technologies">
      {shown.map((t) => (
        <li key={t} className="chip">{t}</li>
      ))}
      {rest > 0 && <li className="chip text-mute">+{rest}</li>}
    </ul>
  );
}
