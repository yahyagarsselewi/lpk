'use client'

import { ChangeEvent, useMemo, useState } from 'react'

const resources = [
  { type: 'SÉRIE', subject: 'Mathématiques', title: 'Série — Continuité.pdf', className: '4ème Math 1', teacher: 'Mme. Ben Salah', date: '24 sept. 2026' },
  { type: 'SÉRIE', subject: 'Physique', title: 'Cinématique — Exercices.pdf', className: '3ème Sciences Expérimentales 1', teacher: 'M. Gharbi', date: '23 sept. 2026' },
  { type: 'DEVOIR', subject: 'Anglais', title: 'Progress Check 01.pdf', className: '2ème Sciences 3', teacher: 'Mme. Trabelsi', date: '22 sept. 2026' },
]

type Post = { title: string; body: string; kind: 'announcement' | 'schedule' | 'photo'; image?: string; author?: string; className?: string }

const classGroups = [
  { level: '1ère année', label: '1S', description: 'Sciences', count: 10 },
  { level: '2ème année', label: '2S', description: 'Sciences', count: 10 },
  { level: '3ème année', label: '3S', description: 'Sciences expérimentales', count: 10 },
  { level: '4ème année — Bac', label: 'BAC', description: 'Sections du baccalauréat', count: 10 },
]

const classSchedule = ['08:00 — Mathématiques', '10:00 — Physique', '13:30 — Langues', '15:30 — Sciences']

export default function Page() {
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'home' | 'classes'>('home')
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [directorOpen, setDirectorOpen] = useState(false)
  const [publisherRole, setPublisherRole] = useState<'student' | 'teacher' | 'director'>('director')
  const [authenticated, setAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [postKind, setPostKind] = useState<Post['kind']>('announcement')
  const [publishClass, setPublishClass] = useState('1S1')
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
    if (!draft.title.trim() || !draft.body.trim() || ((postKind === 'photo' || postKind === 'schedule') && !image)) return
    setPosts((current) => [{ ...draft, kind: postKind, image, className: publishClass, author: publisherRole === 'teacher' ? 'Enseignant' : publisherRole === 'student' ? 'Élève' : 'Direction' }, ...current])
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
      </> : <section className="classes-page content-width"><p className="eyebrow">ESPACE CLASSES</p><h1>Classes &amp; <em>Emplois du temps</em></h1><p className="intro">Retrouvez l&apos;emploi du temps et les photos publiées par la direction pour chaque classe.</p>{selectedClass ? <div className="class-detail"><button className="back-button" onClick={() => setSelectedClass(null)}>← Toutes les classes</button><div className="detail-heading"><div><p className="eyebrow">CLASSE {selectedClass}</p><h2>{selectedClass}</h2></div><span className="live-pill">Mis à jour</span></div><div className="detail-columns"><div className="schedule-panel"><p className="eyebrow">EMPLOI DU TEMPS</p><h3>Cette semaine</h3>{posts.filter((post) => post.kind === 'schedule' && post.className === selectedClass && post.image).map((post) => <figure className="schedule-image-card" key={`${post.title}-${post.body}`}><img src={post.image} alt={`Emploi du temps ${selectedClass}`} /><figcaption><strong>{post.title}</strong><span>{post.body}</span></figcaption></figure>)}{!posts.some((post) => post.kind === 'schedule' && post.className === selectedClass && post.image) && classSchedule.map((item) => <div className="schedule-row" key={item}><span>{item.split(' — ')[0]}</span><strong>{item.split(' — ')[1]}</strong></div>)}</div><div className="class-photos"><p className="eyebrow">PHOTOS DE CLASSE</p><h3>Moments partagés</h3><div className="class-photo-grid">{posts.filter((post) => post.kind === 'photo' && post.className === selectedClass).map((post) => <article key={`${post.title}-${post.body}`}>{post.image && <img src={post.image} alt={post.title} />}<strong>{post.title}</strong></article>)}{!posts.some((post) => post.kind === 'photo' && post.className === selectedClass) && <div className="empty">Les photos publiées par la direction apparaîtront ici.</div>}</div></div></div></div> : <div className="class-grid">{classGroups.map((group, index) => <article className="class-card" key={group.label}><span className="class-number">0{index + 1}</span><p className="eyebrow">{group.level}</p><h2>{group.label}<span> — {group.description}</span></h2><p>{group.count} classes disponibles · emploi du temps et photos.</p><button className="glass-button" onClick={() => setSelectedClass(`${group.label}1`)}>Voir la classe <span>↗</span></button></article>)}</div>}</section>}
      <section className="school-life content-width" id="school-life"><div className="section-heading"><div><p className="eyebrow">VIE SCOLAIRE</p><h2>Photos <em>&amp; Publications</em></h2></div></div><div className="post-grid">{posts.filter((post) => post.kind !== 'announcement').map((post) => <article className="published-card" key={`${post.title}-${post.body}`}>{post.image && <img src={post.image} alt={post.title} />}{!post.image && <div className="post-icon">▧</div>}<div><span className="tag">{post.kind === 'photo' ? 'PHOTO DE CLASSE' : 'EMPLOI DU TEMPS'}</span><h3>{post.title}</h3><p>{post.body}</p><small>Publié par {post.author}</small></div></article>)}{!posts.some((post) => post.kind !== 'announcement') && <div className="empty">Les photos et publications de la communauté apparaîtront ici.</div>}</div></section>
    </main>
    <footer><strong>LPK Kairouan</strong><span>Created by Yahya Gharsellaoui</span></footer>
    <div className="community-bar"><span>Partager avec la communauté</span><button className="glass-button" onClick={() => openPublisher('student')}>Élève · Publier une photo</button><button className="glass-button" onClick={() => openPublisher('teacher')}>Enseignant · Publier une photo</button></div>
    {directorOpen && <div className="modal-backdrop" onClick={() => setDirectorOpen(false)}><section className="director-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDirectorOpen(false)} aria-label="Fermer">×</button>{!authenticated ? <><p className="eyebrow">ESPACE DIRECTION</p><h2>Accès directeur</h2><p>Entrez le code pour publier sur le site.</p><input className="director-code" type="password" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code directeur" /><button className="publish primary" onClick={unlock}>Ouvrir l&apos;espace</button></> : <><p className="eyebrow">PUBLICATION · {publisherRole === 'student' ? 'ÉLÈVE' : publisherRole === 'teacher' ? 'ENSEIGNANT' : 'DIRECTION'}</p><h2>Nouvelle publication</h2>{publisherRole === 'director' && <div className="publish-tabs">{[['announcement','Annonce'],['schedule','Emploi'],['photo','Photo de classe']].map(([value, label]) => <button key={value} className={postKind === value ? 'active' : ''} onClick={() => setPostKind(value as Post['kind'])}>{label}</button>)}</div>}<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre" /><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder={postKind === 'photo' ? 'Description de la photo' : 'Contenu de la publication'} rows={4} />{(postKind === 'photo' || postKind === 'schedule') && <><label className="field-label" htmlFor="publish-class">Classe concernée</label><select id="publish-class" value={publishClass} onChange={(e) => setPublishClass(e.target.value)}>{classGroups.flatMap((group) => Array.from({ length: group.count }, (_, index) => `${group.label}${index + 1}`)).map((className) => <option key={className}>{className}</option>)}</select><label className="image-upload">Choisir une photo<input type="file" accept="image/*" onChange={pickImage} /></label></>}{image && <img className="image-preview" src={image} alt="Aperçu de la photo" />}<button className="publish primary" onClick={publish}>Publier maintenant</button></>}</section></div>}
  </div>
}

