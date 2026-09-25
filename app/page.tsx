'use client'

import { ChangeEvent, useMemo, useState } from 'react'

const resources = [
  { type: 'SÉRIE', subject: 'Mathématiques', title: 'Série — Continuité.pdf', className: '4ème Math 1', teacher: 'Mme. Ben Salah', date: '24 sept. 2026' },
  { type: 'SÉRIE', subject: 'Physique', title: 'Cinématique — Exercices.pdf', className: '3ème Sciences Expérimentales 1', teacher: 'M. Gharbi', date: '23 sept. 2026' },
  { type: 'DEVOIR', subject: 'Anglais', title: 'Progress Check 01.pdf', className: '2ème Sciences 3', teacher: 'Mme. Trabelsi', date: '22 sept. 2026' },
]

type Post = { title: string; body: string; kind: 'announcement' | 'schedule' | 'photo'; image?: string; author?: string }

export default function Page() {
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'home' | 'classes'>('home')
  const [directorOpen, setDirectorOpen] = useState(false)
  const [publisherRole, setPublisherRole] = useState<'student' | 'teacher' | 'director'>('director')
  const [authenticated, setAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [postKind, setPostKind] = useState<Post['kind']>('announcement')
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState({ title: '', body: '' })
  const [image, setImage] = useState('')

  const filtered = useMemo(() => resources.filter((item) => {
    const matchesFilter = filter === 'Tous' || item.className.toLowerCase().includes(filter.toLowerCase().replace(' année', '').replace(' (bac)', ''))
    return matchesFilter && `${item.subject} ${item.title} ${item.className} ${item.teacher}`.toLowerCase().includes(query.toLowerCase())
  }), [filter, query])

  function openPublisher(role: 'student' | 'teacher' | 'director') {
    setPublisherRole(role); setDirectorOpen(true); setAuthenticated(role !== 'director'); setPostKind('photo'); setCode('')
  }
  function unlock() { if (code === '5436') setAuthenticated(true) }
  function pickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) setImage(URL.createObjectURL(file))
  }
  function publish() {
    if (!draft.title.trim() || !draft.body.trim() || (postKind === 'photo' && !image)) return
    setPosts((current) => [{ ...draft, kind: postKind, image, author: publisherRole === 'teacher' ? 'Enseignant' : publisherRole === 'student' ? 'Élève' : 'Direction' }, ...current])
    setDraft({ title: '', body: '' }); setImage(''); setDirectorOpen(false)
  }

  return <div className="site-shell">
    <header className="topbar"><div className="topbar-inner"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">⌑</span><span><strong>LPK Kairouan</strong><small>LYCÉE PILOTE</small></span></a><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enseignant, matière ou niveau..." aria-label="Rechercher" /></label><div className="language"><button>AR</button><button className="active">FR</button><button>EN</button></div><div className="header-actions"><button aria-label="Accès directeur" onClick={() => openPublisher('director')}>♧</button></div></div></header>
    <nav className="main-nav"><div className="nav-inner"><button className={view === 'home' ? 'selected' : ''} onClick={() => setView('home')}>Accueil &amp; Ressources</button><button className={view === 'classes' ? 'selected' : ''} onClick={() => setView('classes')}>Classes &amp; Emplois du Temps</button></div></nav>
    <main id="top">
      {view === 'home' ? <>
        <section className="notice-section"><div className="content-width"><p className="eyebrow">AFFICHE DE LA SEMAINE</p><h1>Information de la <em>Direction</em></h1><div className="notice-card"><div className="megaphone">⚑</div>{posts.filter((post) => post.kind === 'announcement').length ? posts.filter((post) => post.kind === 'announcement').map((post) => <div key={post.title}><h3>{post.title}</h3><p>{post.body}</p></div>) : <><p>لا يوجد شيء هنا</p><small>AUCUNE ANNONCE CETTE SEMAINE</small></>}</div></div></section>
        <div className="content-width"><div className="ad-space">ADVERTISEMENT SPACE</div></div>
        <section className="resources content-width" id="resources"><div className="section-heading"><div><p className="eyebrow">RESSOURCES PÉDAGOGIQUES</p><h2>Séries <em>&amp; Devoirs</em></h2></div></div><div className="filters">{['Tous', '1ère année', '2ème année', '3ème année', '4ème année (Bac)'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="resource-layout"><div className="resource-list">{filtered.map((item) => <article className="resource-card" key={item.title}><div className="file-icon">▤</div><div className="resource-info"><div className="resource-meta"><span className="tag">{item.type}</span><span className="subject">{item.subject}</span></div><h3>{item.title}</h3><div className="details"><span>◫ {item.className}</span><span>{item.teacher}</span><span>▣ {item.date}</span></div></div><button className="download" aria-label={`Télécharger ${item.title}`}>⇩</button></article>)}</div><aside className="side-ad">ADVERTISEMENT SPACE</aside></div></section>
      </> : <section className="classes-page content-width"><p className="eyebrow">ESPACE CLASSES</p><h1>Classes &amp; <em>Emplois du temps</em></h1><p className="intro">Retrouvez les informations de votre classe et partagez les moments forts de la vie scolaire.</p><div className="class-grid">{['1ère année — Sciences', '2ème année — Sciences', '3ème année — Sciences Expérimentales', '4ème année — Mathématiques'].map((name, index) => <article className="class-card" key={name}><span className="class-number">0{index + 1}</span><h2>{name}</h2><p>Emploi du temps, séries et photos de classe.</p><button className="glass-button">Voir la classe <span>↗</span></button></article>)}</div></section>}
      <section className="school-life content-width" id="school-life"><div className="section-heading"><div><p className="eyebrow">VIE SCOLAIRE</p><h2>Photos <em>&amp; Publications</em></h2></div></div><div className="post-grid">{posts.filter((post) => post.kind !== 'announcement').map((post) => <article className="published-card" key={`${post.title}-${post.body}`}>{post.image && <img src={post.image} alt={post.title} />}{!post.image && <div className="post-icon">▧</div>}<div><span className="tag">{post.kind === 'photo' ? 'PHOTO DE CLASSE' : 'EMPLOI DU TEMPS'}</span><h3>{post.title}</h3><p>{post.body}</p><small>Publié par {post.author}</small></div></article>)}{!posts.some((post) => post.kind !== 'announcement') && <div className="empty">Les photos et publications de la communauté apparaîtront ici.</div>}</div></section>
    </main>
    <footer><strong>LPK Kairouan</strong><span>Created by Yahya Gharsellaoui</span></footer>
    <div className="community-bar"><span>Partager avec la communauté</span><button className="glass-button" onClick={() => openPublisher('student')}>Élève · Publier une photo</button><button className="glass-button" onClick={() => openPublisher('teacher')}>Enseignant · Publier</button></div>
    {directorOpen && <div className="modal-backdrop" onClick={() => setDirectorOpen(false)}><section className="director-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDirectorOpen(false)} aria-label="Fermer">×</button>{!authenticated ? <><p className="eyebrow">ESPACE DIRECTION</p><h2>Accès directeur</h2><p>Entrez le code pour publier sur le site.</p><input className="director-code" type="password" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code directeur" /><button className="publish primary" onClick={unlock}>Ouvrir l&apos;espace</button></> : <><p className="eyebrow">PUBLICATION · {publisherRole === 'student' ? 'ÉLÈVE' : publisherRole === 'teacher' ? 'ENSEIGNANT' : 'DIRECTION'}</p><h2>Nouvelle publication</h2><div className="publish-tabs">{[['announcement','Annonce'],['schedule','Emploi'],['photo','Photo de classe']].map(([value, label]) => <button key={value} className={postKind === value ? 'active' : ''} onClick={() => setPostKind(value as Post['kind'])}>{label}</button>)}</div><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre" /><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder={postKind === 'photo' ? 'Description de la photo' : 'Contenu de la publication'} rows={4} />{postKind === 'photo' && <label className="image-upload">Choisir une photo<input type="file" accept="image/*" onChange={pickImage} /></label>}{image && <img className="image-preview" src={image} alt="Aperçu de la photo" />}<button className="publish primary" onClick={publish}>Publier maintenant</button></>}</section></div>}
  </div>
}

