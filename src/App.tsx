import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

function App() {
  const { sourceUrl, setSourceUrl, addSource, clearSources, sources } = useAppStore()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Lerni MVP</h1>
        <p className="text-muted-foreground">
          React + Zustand + shadcn + Tailwind + Supabase starter.
        </p>
      </header>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-medium">Dodaj zrodlo artykulu</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="https://example.com/artykul"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
          />
          <Button onClick={addSource}>Dodaj</Button>
          <Button variant="secondary" onClick={clearSources}>
            Wyczysc
          </Button>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-medium">Zrodla ({sources.length})</h2>
        <ul className="mt-4 space-y-2">
          {sources.length === 0 ? (
            <li className="text-sm text-muted-foreground">
              Brak zrodel. Dodaj pierwszy link.
            </li>
          ) : (
            sources.map((source) => (
              <li key={source.id} className="rounded-md border p-3 text-sm">
                {source.url}
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  )
}

export default App
