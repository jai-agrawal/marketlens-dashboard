export function Calendar({ selected, onSelect }: { selected?: Date; onSelect?: (date: Date) => void }) {
  return <input type="date" value={selected?.toISOString().split('T')[0]} onChange={e => onSelect?.(new Date(e.target.value))} />
}