import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SourcesSection } from '@/components/notebook/SourcesSection'
import { StudioSection } from '@/components/notebook/StudioSection'
import { SummarySection } from '@/components/notebook/SummarySection'

export default function Notebook() {
  const { id } = useParams<{ id: string }>()
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false)
  const [studioCollapsed, setStudioCollapsed] = useState(false)

  const desktopGridClass = sourcesCollapsed
    ? studioCollapsed
      ? 'xl:grid-cols-[72px_minmax(0,1fr)_72px]'
      : 'xl:grid-cols-[72px_minmax(0,1fr)_260px]'
    : studioCollapsed
      ? 'xl:grid-cols-[320px_minmax(0,1fr)_72px]'
      : 'xl:grid-cols-[320px_minmax(0,1fr)_260px]'

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1380px] flex-col px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="inline-flex rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            Notatnik #{id}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Widok roboczy notatnika</h1>
        </div>
        <Link to="/">
          <Button variant="ghost" className="text-sm">
            ← Wróć do listy notatników
          </Button>
        </Link>
      </div>

      <section className={`grid flex-1 grid-cols-1 gap-4 ${desktopGridClass}`}>
        <SourcesSection
          collapsed={sourcesCollapsed}
          onToggleCollapse={() => setSourcesCollapsed((current) => !current)}
        />
        <SummarySection />
        <StudioSection
          collapsed={studioCollapsed}
          onToggleCollapse={() => setStudioCollapsed((current) => !current)}
        />
      </section>
    </main>
  )
}
