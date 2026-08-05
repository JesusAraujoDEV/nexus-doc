interface Item {
  name: string;
  count: number;
}

export function TopRankingList({ title, items }: { title: string; items: Item[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="medical-card p-4">
      <h3 className="text-sm font-bold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-foreground font-medium truncate">{item.name}</span>
                <span className="text-muted-foreground shrink-0 ml-2">{item.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground">Sin datos suficientes.</p>}
      </div>
    </div>
  );
}
