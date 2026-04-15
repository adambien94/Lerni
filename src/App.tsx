import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

function App() {
  const notebooks = [
    {
      id: '1',
      title: '52 Essential JavaScript Frontend Interview Questions',
      meta: '20 paź 2025 · 6 źródeł',
      bgClass: 'from-zinc-800/80 to-zinc-700/50',
    },
    {
      id: '2',
      title: 'React Server Components',
      meta: '8 kwi 2026 · 18 źródeł',
      bgClass: 'from-violet-900/40 to-zinc-800/80',
    },
    {
      id: '3',
      title: 'The Singleton Design Pattern Explained',
      meta: '31 paź 2025 · 7 źródeł',
      bgClass: 'from-emerald-900/35 to-zinc-800/80',
    },
  ]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Moje notatniki
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Wybierz notatnik, aby przejść do jego widoku roboczego.
        </p>
      </header>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-dashed bg-card/40 transition-colors hover:bg-card/60">
            <CardContent className="flex min-h-[180px] flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-foreground">Utwórz nowy notatnik</p>
            </CardContent>
          </Card>

          {notebooks.map((notebook) => (
            <Link key={notebook.id} to={`/notebook/${notebook.id}`} className="group">
              <Card
                className={`border-border/70 bg-linear-to-br ${notebook.bgClass} transition-transform duration-200 group-hover:-translate-y-0.5`}
              >
                <CardContent className="flex min-h-[180px] flex-col justify-end p-5">
                  <h2 className="line-clamp-2 text-xl font-medium text-foreground">{notebook.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{notebook.meta}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
