'use client'

import { useMemo, useState } from 'react'

type Resource = {
  type: 'SÉRIE' | 'DEVOIR'
  subject: string
  title: string
  className: string
  teacher: string
  date: string
}

const resources: Resource[] = [
  { type: 'SÉRIE', subject: 'Mathématiques', title: 'Série — Continuité.pdf', className: '4ème Math 1', teacher: 'Mme. Ben Salah', date: '24 sept. 2026' },
  { type: 'SÉRIE', subject: 'Physique', title: 'Cinématique — Exercices.pdf', className: '3ème Sciences Expérimentales 1', teacher: 'M. Gharbi', date: '23 sept. 2026' },
  { type: 'DEVOIR', subject: 'Anglais', title: 'Progress Check 01.pdf', className: '2ème Sciences 3', teacher: 'Mme. Trabelsi', date: '22 sept. 2026' },
  { type: 'SÉRIE', subject: 'Informatique', title: 'Algorithmes — Série 02.pdf', className: '4ème Informatique', teacher: 'M. Jlassi', date: '21 sept. 2026' },
]

export default function Page() {
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => resources.filter((item) => {
    const matchesFilter = filter === 'Tous' || item.className.toLowerCase().includes(filter.toLowerCase().replace(' année', '').replace(' (bac)', ''))
    const matchesQuery = `${item.subject} ${item.title} ${item.className} ${item.teacher}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  }), [filter, query])

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top" aria-label="LPK Kairouan — Accueil">
            <span className="brand-mark" aria-hidden="true">⌑</span>
            <span><strong>LPK Kairouan</strong><small>LYCÉE PILOTE</small></span>
          </a>
          <label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enseignant, matière ou niveau..." aria-label="Rechercher" /></label>
          <div className="language" aria-label="Langue"><button>AR</button><button className="active">FR</button><button>EN</button></div>
          <div className="header-actions"><button aria-label="S'identifier">♙</button><button aria-label="Accès directeur">♧</button></div>
        </div>
      </header>

      <nav className="main-nav" aria-label="Navigation principale"><div className="nav-inner"><a className="selected" href="#resources">Séries &amp; Devoirs</a><a href="#schedule">Emplois du Temps &amp; Photos de Classes</a></div></nav>

      <main id="top">
        <section className="notice-section"><div className="content-width"><p className="eyebrow">AFFICHE DE LA SEMAINE</p><h1>Information de la <em>Direction</em></h1><div className="notice-card"><div className="megaphone" aria-hidden="true">⚑</div><p>لا يوجد شيء هنا</p><small>AUCUNE ANNONCE CETTE SEMAINE</small></div></div></section>
        <div className="content-width"><div className="ad-space">ADVERTISEMENT SPACE</div></div>
        <section className="resources content-width" id="resources"><div className="section-heading"><div><p className="eyebrow">RESSOURCES PÉDAGOGIQUES</p><h2>Séries <em>&amp; Devoirs</em></h2></div><button className="publish" onClick={() => alert('La publication sera bientôt disponible.')}>＋ Publier une série</button></div>
          <div className="filters">{['Tous', '1ère année', '2ème année', '3ème année', '4ème année (Bac)'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div>
          <div className="resource-layout"><div className="resource-list">{filtered.map((item) => <article className="resource-card" key={item.title}><div className="file-icon" aria-hidden="true">▤</div><div className="resource-info"><div className="resource-meta"><span className="tag">{item.type}</span><span className="subject">{item.subject}</span></div><h3>{item.title}</h3><div className="details"><span>◫ {item.className}</span><span> {item.teacher}</span><span>▣ {item.date}</span></div></div><button className="download" aria-label={`Télécharger ${item.title}`} onClick={() => alert(`Téléchargement de ${item.title}`)}>⇩</button></article>)}{filtered.length === 0 && <div className="empty">Aucune ressource trouvée.</div>}</div><aside className="side-ad">ADVERTISEMENT SPACE</aside></div>
          <div className="tip"><strong>CONSEIL</strong><span>Utilisez votre nom et votre classe pour retrouver plus rapidement les ressources qui vous concernent.</span></div>
        </section>
      </main>
      <footer><strong>LPK Kairouan</strong><span>Created by Yahya Gharsellaoui</span></footer>
    </div>
  )
}

