import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/store/useAppStore'

function App() {
  const { sourceUrl, setSourceUrl, addSource, clearSources, sources } = useAppStore()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="space-y-3">
        <div className="inline-flex rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          Lerni · Notebook Workspace
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Moje notatniki</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Dark UI inspirowane NotebookLM. Spójny zestaw reużywalnych komponentów do formularzy i akcji.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Dodaj źródło artykułu</CardTitle>
          <CardDescription>Wklej link do artykułu i dodaj go do notatnika.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Label htmlFor="source-url">Adres URL</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="source-url"
                placeholder="https://example.com/artykul"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
              />
              <Button onClick={addSource}>Dodaj</Button>
              <Button variant="secondary" onClick={clearSources}>
                Wyczyść
              </Button>
              <Button variant="ghost">Ustawienia</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-foreground/95">Źródła ({sources.length})</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sources.length === 0 ? (
            <Card className="col-span-full border-dashed bg-card/60">
              <CardContent className="flex min-h-[180px] items-center justify-center p-5 text-sm text-muted-foreground">
                Brak źródeł. Dodaj pierwszy link, aby rozpocząć budowę notatnika.
              </CardContent>
            </Card>
          ) : (
            sources.map((source) => (
              <Card
                key={source.id}
                className="group border-border/80 bg-card/70 transition-colors hover:bg-card"
              >
                <CardContent className="p-4">
                  <p className="break-all text-sm leading-6 text-card-foreground">{source.url}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Nowe źródło</span>
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                      Otwórz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <Card className="bg-card/70 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Komponenty UI
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Przycisk ikonowy">
            +
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
