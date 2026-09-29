'use client'

import { ChangeEvent, useMemo, useState } from 'react'

const resources = [
  { type: 'SÉRIE', subject: 'Mathématiques', title: 'Série — Continuité.pdf', className: '4ème Math 1', teacher: 'Mme. Ben Salah', date: '24 sept. 2026' },
  { type: 'SÉRIE', subject: 'Physique', title: 'Cinématique — Exercices.pdf', className: '3ème Sciences Expérimentales 1', teacher: 'M. Gharbi', date: '23 sept. 2026' },
  { type: 'DEVOIR', subject: 'Anglais', title: 'Progress Check 01.pdf', className: '2ème Sciences 3', teacher: 'Mme. Trabelsi', date: '22 sept. 2026' },
]

type Post = { title: string; body: string; kind: 'announcement' | 'schedule' | 'photo'; image?: string; author?: string; className?: string }

const classGroups = [
  { level: '1ère année', label: '1S', description: 'Sciences', classes: Array.from({ length: 10 }, (_, index) => `1S${index + 1}`) },
  { level: '2ème année', label: '2S', description: 'Sciences', classes: Array.from({ length: 9 }, (_, index) => `2S${index + 1}`) },
  { level: '3ème année', label: '3S', description: 'Sciences expérimentales', classes: ['3S1', '3S2', '3S3', '3S4', '3M1', '3M2', '3T1', '3T2', '3I1'] },
  { level: '4ème année — Bac', label: 'BAC', description: 'Sections du baccalauréat', classes: ['BACS1', 'BACS2', 'BACS3', 'BACS4', 'BACS5', 'BACI1', 'BACT1', 'BACT2', 'BACM1', 'BACM2', 'BACM3'] },
]

const classSchedule = ['08:00 — Mathématiques', '10:00 — Physique', '13:30 — Langues', '15:30 — Sciences']

export default function Page() {
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'home' | 'classes' | 'teacher-news'>('home')
  const [profile, setProfile] = useState({ role: 'student', className: '1S1' })
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [directorOpen, setDirectorOpen] = useState(false)
  const [publisherRole, setPublisherRole] = useState<'student' | 'teacher' | 'director'>('director')
  const [authenticated, setAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [postKind, setPostKind] = useState<Post['kind']>('announcement')
  const [publishClass, setPublishClass] = useState('1S1')
  const [publishSubject, setPublishSubject] = useState('Mathématiques')
  const [publishTeacher, setPublishTeacher] = useState('Mme. Ben Salah')
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState({ title: '', body: '' })
  const [image, setImage] = useState('')
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return [
      ...resources.map((item) => ({ type: item.type, title: item.title, detail: `${item.subject} · ${item.className} · ${item.teacher}`, target: 'resources' })),
      ...classGroups.flatMap((group) => group.classes.map((className) => ({ type: group.level, title: className, detail: `${group.description} · Emploi du temps et photos de classe`, target: 'classes' }))),
      ...posts.map((post) => ({ type: post.kind === 'photo' ? 'PHOTO' : post.kind === 'schedule' ? 'EMPLOI' : 'ANNONCE', title: post.title, detail: `${post.className ?? 'Vie scolaire'} · ${post.author ?? 'LPK Kairouan'}`, target: 'school-life' })),
    ].filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(term)).slice(0, 8)
  }, [query, posts])

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
    if ((postKind === 'photo' || postKind === 'schedule') && !image) return
    if (postKind === 'announcement' && (!draft.title.trim() || !draft.body.trim())) return
    const title = draft.title.trim() || (postKind === 'photo' ? `Photo de ${publishClass} · ${publishSubject}` : `Emploi du temps — ${publishClass}`)
    const body = draft.body.trim() || 'Publication partagée avec la communauté scolaire.'
    setPosts((current) => [{ title, body, kind: postKind, image, className: publishClass, author: publisherRole === 'teacher' ? 'Enseignant' : publisherRole === 'student' ? 'Élève' : 'Directeur' }, ...current])
    setDraft({ title: '', body: '' }); setImage(''); setDirectorOpen(false)
  }

  return <div className="site-shell">
    <header className="topbar"><div className="topbar-inner"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">⌑</span><span><strong>LPK Kairouan</strong><small>LYCÉE PILOTE</small></span></a><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enseignant, matière ou niveau..." aria-label="Rechercher" /></label><div className="language"><button>AR</button><button className="active">FR</button><button>EN</button></div><div className="header-actions"><button aria-label="Accès directeur" onClick={() => openPublisher('director')}>♧</button></div></div></header>
    <nav className="main-nav"><div className="nav-inner"><button className={view === 'home' ? 'selected' : ''} onClick={() => setView('home')}>Accueil &amp; Ressources</button><button className={view === 'classes' ? 'selected' : ''} onClick={() => setView('classes')}>Classes &amp; Emplois du Temps</button><button className={view === 'teacher-news' ? 'selected' : ''} onClick={() => setView('teacher-news')}>Actualités des enseignants</button></div></nav>
  <main id="top">
  {query.trim() && <section className="search-results content-width" aria-live="polite"><div className="section-heading"><div><p className="eyebrow">RECHERCHE DU PORTAIL</p><h2>Résultats pour <em>« {query} »</em></h2></div><span className="result-count">{searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}</span></div>{searchResults.length ? <div className="search-result-grid">{searchResults.map((result, index) => <button className="search-result-card" key={`${result.title}-${index}`} onClick={() => { setQuery(''); if (result.target === 'classes') setView('classes'); else document.getElementById(result.target)?.scrollIntoView({ behavior: 'smooth' }) }}><span className="tag">{result.type}</span><strong>{result.title}</strong><small>{result.detail}</small><span className="result-arrow" aria-hidden="true">↗</span></button>)}</div> : <div className="empty">Aucun résultat. Essayez un nom d&apos;enseignant, une matière ou une classe.</div>}</section>}
  {view === 'teacher-news' ? <section className="teacher-news-page content-width"><p className="eyebrow">ESPACE ENSEIGNANTS</p><h1>Actualités des <em>enseignants</em></h1><p className="intro">Les enseignants partagent ici leurs informations. Les élèves peuvent les consulter librement.</p><div className="news-grid">{posts.filter((post) => post.kind === 'announcement' && post.author === 'Enseignant').map((post) => <article className="news-card" key={`${post.title}-${post.body}`}><span className="tag">ENSEIGNANT</span><h2>{post.title}</h2><p>{post.body}</p><small>{post.className ?? 'LPK Kairouan'}</small></article>)}{!posts.some((post) => post.kind === 'announcement' && post.author === 'Enseignant') && <div className="empty">Les actualités des enseignants apparaîtront ici.</div>}</div></section> : view === 'home' ? <>
        <section className="notice-section"><div className="content-width"><p className="eyebrow">AFFICHE DE LA SEMAINE</p><h1>Information de la <em>Directeur</em></h1><div className="notice-card"><div className="megaphone">⚑</div>{posts.filter((post) => post.kind === 'announcement').length ? posts.filter((post) => post.kind === 'announcement').map((post) => <div key={post.title}><h3>{post.title}</h3><p>{post.body}</p></div>) : <><p>لا يوجد شيء هنا</p><small>AUCUNE ANNONCE CETTE SEMAINE</small></>}</div></div></section>
        <div className="content-width"><div className="ad-space">ADVERTISEMENT SPACE</div></div>
        <section className="resources content-width" id="resources"><div className="section-heading"><div><p className="eyebrow">RESSOURCES PÉDAGOGIQUES</p><h2>Séries <em>&amp; Devoirs</em></h2></div></div><div className="filters">{['Tous', '1ère année', '2ème année', '3ème année', '4ème année (Bac)'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="resource-layout"><div className="resource-list">{filtered.map((item) => <article className="resource-card" key={item.title}><div className="file-icon">▤</div><div className="resource-info"><div className="resource-meta"><span className="tag">{item.type}</span><span className="subject">{item.subject}</span></div><h3>{item.title}</h3><div className="details"><span>◫ {item.className}</span><span>{item.teacher}</span><span>▣ {item.date}</span></div></div><button className="download" aria-label={`Télécharger ${item.title}`}>⇩</button></article>)}</div><aside className="side-ad">ADVERTISEMENT SPACE</aside></div></section>
      </> : <section className="classes-page content-width"><p className="eyebrow">ESPACE CLASSES</p><h1>Classes &amp; <em>Emplois du temps</em></h1><p className="intro">Retrouvez l&apos;emploi du temps et les photos publiées par la direction pour chaque classe.</p>{selectedClass ? <div className="class-detail"><button className="back-button" onClick={() => setSelectedClass(null)}>← Toutes les classes</button><div className="detail-heading"><div><p className="eyebrow">CLASSE {selectedClass}</p><h2>{selectedClass}</h2></div><span className="live-pill">Mis à jour</span></div><div className="detail-columns"><div className="schedule-panel"><p className="eyebrow">EMPLOI DU TEMPS</p><h3>Cette semaine</h3>{posts.filter((post) => post.kind === 'schedule' && post.className === selectedClass && post.image).map((post) => <figure className="schedule-image-card" key={`${post.title}-${post.body}`}><img src={post.image} alt={`Emploi du temps ${selectedClass}`} /><figcaption><strong>{post.title}</strong><span>{post.body}</span></figcaption></figure>)}{!posts.some((post) => post.kind === 'schedule' && post.className === selectedClass && post.image) && <div className="empty">L&apos;emploi du temps sera publié ici par le directeur.</div>}</div><div className="class-photos"><p className="eyebrow">PHOTOS DE CLASSE</p><h3>Moments partagés</h3><div className="class-photo-grid">{posts.filter((post) => post.kind === 'photo' && post.className === selectedClass).map((post) => <article key={`${post.title}-${post.body}`}><button className="photo-open" onClick={() => post.image && setLightboxImage({ src: post.image, alt: post.title })} aria-label={`Ouvrir ${post.title}`}>{post.image && <img src={post.image} alt={post.title} />}<strong>{post.title}</strong></button></article>)}{!posts.some((post) => post.kind === 'photo' && post.className === selectedClass) && <div className="empty">Les photos publiées par la direction apparaîtront ici.</div>}</div></div></div></div> : <div className="class-grid">{classGroups.map((group, index) => <article className="class-card" key={group.label}><span className="class-number">0{index + 1}</span><p className="eyebrow">{group.level}</p><h2>{group.label}<span> — {group.description}</span></h2><p>{group.count} classes disponibles · emploi du temps et photos.</p><div className="class-options" aria-label={`Classes de ${group.level}`}>{group.classes.map((className) => <button className="class-option" key={className} onClick={() => setSelectedClass(className)}>{className}<span aria-hidden="true">↗</span></button>)}</div></article>)}</div>}</section>}
      <section className="school-life content-width" id="school-life"><div className="section-heading"><div><p className="eyebrow">VIE SCOLAIRE</p><h2>Photos <em>&amp; Publications</em></h2></div></div><div className="post-grid">{posts.filter((post) => post.kind !== 'announcement').map((post) => <article className="published-card" key={`${post.title}-${post.body}`}>{post.image && <button className="photo-open" onClick={() => setLightboxImage({ src: post.image!, alt: post.title })} aria-label={`Ouvrir ${post.title}`}><img src={post.image} alt={post.title} /></button>}{!post.image && <div className="post-icon">▧</div>}<div><span className="tag">{post.kind === 'photo' ? 'PHOTO DE CLASSE' : 'EMPLOI DU TEMPS'}</span><h3>{post.title}</h3><p>{post.body}</p><small>Publié par {post.author}</small></div></article>)}{!posts.some((post) => post.kind !== 'announcement') && <div className="empty">Les photos et publications de la communauté apparaîtront ici.</div>}</div></section>
    </main>
    <footer><strong>LPK Kairouan</strong><span>Created by Yahya Gharsellaoui</span></footer>
    <div className="community-bar"><span>Partager avec la communauté</span><button className="glass-button" onClick={() => openPublisher(profile.role as 'student' | 'teacher')}>Publier une photo</button><button className="glass-button" onClick={() => setView('teacher-news')}>Actualités enseignants</button></div>
    {directorOpen && <div className="modal-backdrop" onClick={() => setDirectorOpen(false)}><section className="director-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDirectorOpen(false)} aria-label="Fermer">×</button>{!authenticated ? <><p className="eyebrow">ESPACE DIRECTION</p><h2>Accès directeur</h2><p>Entrez le code pour publier sur le site.</p><input className="director-code" type="password" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code directeur" /><button className="publish primary" onClick={unlock}>Ouvrir l&apos;espace</button></> : <><p className="eyebrow">PUBLICATION · {publisherRole === 'student' ? 'ÉLÈVE' : publisherRole === 'teacher' ? 'ENSEIGNANT' : 'DIRECTION'}</p><h2>Nouvelle publication</h2>{publisherRole !== 'director' && <><label className="field-label" htmlFor="profile-role">Profil</label><select id="profile-role" value={profile.role} onChange={(e) => { const role = e.target.value as 'student' | 'teacher'; setProfile({ ...profile, role }); setPublisherRole(role) }}><option value="student">Élève</option><option value="teacher">Enseignant</option></select></>}{publisherRole === 'director' && <div className="publish-tabs">{[['announcement','Annonce'],['schedule','Emploi'],['photo','Photo de classe']].map(([value, label]) => <button key={value} className={postKind === value ? 'active' : ''} onClick={() => setPostKind(value as Post['kind'])}>{label}</button>)}</div>}{postKind !== 'photo' && <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre" />}{postKind !== 'photo' && <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Contenu de la publication" rows={4} />}{(postKind === 'photo' || postKind === 'schedule') && <><label className="field-label" htmlFor="publish-class">Classe concernée</label><select id="publish-class" value={publishClass} onChange={(e) => setPublishClass(e.target.value)}>{classGroups.flatMap((group) => group.classes).map((className) => <option key={className}>{className}</option>)}</select>{postKind === 'photo' && <><label className="field-label" htmlFor="publish-subject">Matière</label><select id="publish-subject" value={publishSubject} onChange={(e) => setPublishSubject(e.target.value)}><option>Mathématiques</option><option>Physique</option><option>Sciences</option><option>Français</option><option>Anglais</option></select><label className="field-label" htmlFor="publish-teacher">Enseignant</label><select id="publish-teacher" value={publishTeacher} onChange={(e) => setPublishTeacher(e.target.value)}><option>Mme. Ben Salah</option><option>M. Gharbi</option><option>Mme. Trabelsi</option></select></>}<label className="image-upload">Choisir une photo<input type="file" accept="image/*" onChange={pickImage} /></label></>}{image && <img className="image-preview" src={image} alt="Aperçu de la photo" />}<button className="publish primary" onClick={publish}>Publier maintenant</button></>}</section></div>}
    {lightboxImage && <div className="lightbox-backdrop" onClick={() => setLightboxImage(null)}><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setLightboxImage(null)} aria-label="Fermer la photo">×</button><img src={lightboxImage.src} alt={lightboxImage.alt} /><p>{lightboxImage.alt}</p></div></div>}
  </div>
}

