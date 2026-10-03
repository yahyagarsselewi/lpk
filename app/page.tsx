'use client'

import { ChangeEvent, useEffect, useMemo, useState } from 'react'

const resources = [
  { type: 'SÉRIE', subject: 'Mathématiques', title: 'Série — Continuité.pdf', className: '4ème Math 1', teacher: 'Mme. Ben Salah', date: '24 sept. 2026' },
  { type: 'SÉRIE', subject: 'Physique', title: 'Cinématique — Exercices.pdf', className: '3ème Sciences Expérimentales 1', teacher: 'M. Gharbi', date: '23 sept. 2026' },
  { type: 'DEVOIR', subject: 'Anglais', title: 'Progress Check 01.pdf', className: '2ème Sciences 3', teacher: 'Mme. Trabelsi', date: '22 sept. 2026' },
]

type Post = { id: string; title: string; body: string; kind: 'announcement' | 'schedule' | 'photo' | 'series'; image?: string; author?: string; className?: string; subject?: string; level?: string; teacher?: string; ownerKey?: string }

const classGroups = [
  { level: '1ère année', label: '1S', description: 'Sciences', classes: Array.from({ length: 10 }, (_, index) => `1S${index + 1}`) },
  { level: '2ème année', label: '2S', description: 'Sciences', classes: Array.from({ length: 9 }, (_, index) => `2S${index + 1}`) },
  { level: '3ème année', label: '3S', description: 'Sciences expérimentales', classes: ['3S1', '3S2', '3S3', '3S4', '3M1', '3M2', '3T1', '3T2', '3I1'] },
  { level: '4ème année', label: 'BAC', description: 'Sections du baccalauréat', classes: ['BACS1', 'BACS2', 'BACS3', 'BACS4', 'BACS5', 'BACI1', 'BACT1', 'BACT2', 'BACM1', 'BACM2', 'BACM3'] },
]

const classSchedule = ['08:00 — Mathématiques', '10:00 — Physique', '13:30 — Langues', '15:30 — Sciences']
const homeworkSubjects = ['Langue arabe', 'Langue française', 'Langue anglaise', 'Histoire', 'Géographie', 'Philosophie', 'Pensée islamique', 'Mathématiques', 'Sciences physiques', 'Sciences de la Vie et de la Terre', 'Technologie / Sciences techniques', 'Informatique', 'Éducation physique et sportive', 'Italien', 'Espagnol', 'Allemand']
const lpkLogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lpk_1740416414236-buTLyXW8vNCPQQdeSWV5JenmJxdt6b.png'
const postsEndpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/published_posts`
const postsHeaders = { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '', 'Content-Type': 'application/json' }
function getOwnerKey() {
  const existing = document.cookie.split('; ').find((item) => item.startsWith('lpk_owner='))?.split('=')[1]
  if (existing) return existing
  const created = crypto.randomUUID()
  document.cookie = `lpk_owner=${created}; max-age=31536000; path=/; samesite=lax`
  return created
}

export default function Page() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.spotlight-card')
    const move = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
      card.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
    }
    cards.forEach((card) => card.addEventListener('pointermove', move))
    return () => cards.forEach((card) => card.removeEventListener('pointermove', move))
  })

  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState<'ar' | 'fr' | 'en'>('fr')
  const copy = {
    fr: { home: 'Accueil & Ressources', classes: 'Classes & Emplois du Temps', news: 'Actualités des enseignants', search: 'Enseignant, matière ou niveau...', resources: 'Séries & Devoirs', schoolLife: 'Photos & Publications', welcome: 'Bienvenue dans la communauté.' },
    ar: { home: 'الرئيسية والموارد', classes: 'الأقسام وجداول الأوقات', news: 'أخبار الأساتذة', search: 'أستاذ، مادة أو مستوى...', resources: 'السلاسل والواجبات', schoolLife: 'الصور والمنشورات', welcome: 'مرحبا بكم في مجتمعنا.' },
    en: { home: 'Home & Resources', classes: 'Classes & Timetables', news: 'Teacher News', search: 'Teacher, subject or level...', resources: 'Series & Homework', schoolLife: 'Photos & Publications', welcome: 'Welcome to our community.' },
  }[language]
  const [profileReady, setProfileReady] = useState(false)
  const [onboarding, setOnboarding] = useState({ fullName: '', role: 'student' as 'student' | 'teacher' | 'director', className: '1S1', code: '' })
  const [onboardingError, setOnboardingError] = useState('')
  const [view, setView] = useState<'home' | 'classes' | 'teacher-news' | 'homework'>('home')
  const [homework, setHomework] = useState<{ subject: string; date: string; time: string; className: string; teacher: string; ownerKey: string }[]>([])
  const [homeworkDraft, setHomeworkDraft] = useState({ subject: 'Mathématiques', date: '', time: '', className: '1S1' })
  const [profile, setProfile] = useState({ role: 'student', className: '1S1' })
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [directorOpen, setDirectorOpen] = useState(false)
  const [publisherRole, setPublisherRole] = useState<'student' | 'teacher' | 'director'>('director')
  const [authenticated, setAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [postKind, setPostKind] = useState<Post['kind']>('announcement')
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [publishClass, setPublishClass] = useState('1S1')
  const [publishLevel, setPublishLevel] = useState('1ère année')
  const [publishSubject, setPublishSubject] = useState('Mathématiques')
  const [publishTeacher, setPublishTeacher] = useState('Mme. Ben Salah')
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState({ title: '', body: '' })
  const [image, setImage] = useState('')
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)
  const [ownerKey, setOwnerKey] = useState('')
  const seriesPosts = useMemo(() => posts.filter((post) => {
    if (post.kind !== 'series') return false
    if (filter === 'Tous') return true
    const normalized = filter === '4ème année' ? 'BAC' : filter.replace('ère année', '').replace('ème année', '')
    return (post.level ?? '').includes(filter) || (post.className ?? '').toUpperCase().startsWith(normalized.toUpperCase())
  }), [posts, filter])

  useEffect(() => {
    setOwnerKey(getOwnerKey())
  }, [])

  useEffect(() => {
    fetch(`${postsEndpoint}?select=*&order=created_at.desc`, { headers: postsHeaders })
      .then((response) => response.ok ? response.json() : [])
      .then((data: Array<Post & { class_name?: string }>) => setPosts(data.map((post) => ({ ...post, className: post.className ?? post.class_name, ownerKey: post.ownerKey ?? (post as Post & { owner_key?: string }).owner_key }))))
      .catch(() => undefined)
  }, [])

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return [
      ...resources.map((item) => ({ type: item.type, title: item.title, detail: `${item.subject} · ${item.className} · ${item.teacher}`, target: 'resources' })),
      ...classGroups.flatMap((group) => group.classes.map((className) => ({ type: group.level, title: className, detail: `${group.description} · Emploi du temps et photos de classe`, target: 'classes' }))),
      ...posts.map((post) => ({ type: post.kind === 'photo' ? 'PHOTO' : post.kind === 'schedule' ? 'EMPLOI' : 'ANNONCE', title: post.title, detail: `${post.className ?? 'Vie scolaire'} · ${post.teacher ?? post.author ?? 'LPK Kairouan'} · ${post.subject ?? ''}`, target: 'school-life' })),
    ].filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(term)).slice(0, 8)
  }, [query, posts])

  const filtered = useMemo(() => resources.filter((item) => {
    const matchesFilter = filter === 'Tous' || item.className.toLowerCase().includes(filter.toLowerCase().replace(' année', '').replace(' (bac)', ''))
    return matchesFilter && `${item.subject} ${item.title} ${item.className} ${item.teacher}`.toLowerCase().includes(query.toLowerCase())
  }), [filter, query])

  function completeOnboarding() {
    setOnboardingError('')
    if (onboarding.role === 'teacher' && onboarding.code !== '5456') return setOnboardingError('Le code enseignant est incorrect.')
    if (onboarding.role === 'director' && onboarding.code !== '5436') return setOnboardingError('Le code directeur est incorrect.')
    setProfile({ role: onboarding.role, className: onboarding.className })
    setPublisherRole(onboarding.role === 'director' ? 'director' : onboarding.role)
    setProfileReady(true)
  }

  function openPublisher(role: 'student' | 'teacher' | 'director') {
    setPublisherRole(role); setDirectorOpen(true); setAuthenticated(role !== 'director'); setPostKind(role === 'director' ? 'announcement' : 'series'); setCode('')
  }
  function unlock() { if (code === '5436') setAuthenticated(true) }
  function editPost(post: Post) {
    if (post.ownerKey !== ownerKey) return
    setEditingPostId(post.id); setPostKind(post.kind); setPublishClass(post.className ?? '1S1'); setDraft({ title: post.title, body: post.body }); setImage(post.image ?? ''); setPublisherRole(profile.role as 'student' | 'teacher' | 'director'); setAuthenticated(true); setDirectorOpen(true)
  }
  async function deletePost(post: Post) {
    if (post.ownerKey !== ownerKey) return
    const response = await fetch(`${postsEndpoint}?id=eq.${encodeURIComponent(post.id)}&owner_key=eq.${encodeURIComponent(ownerKey)}`, { method: 'DELETE', headers: postsHeaders })
    if (response.ok) setPosts((current) => current.filter((item) => item.id !== post.id))
  }
  function publishHomework() {
    if (profile.role !== 'teacher' || !homeworkDraft.date || !homeworkDraft.time || !publishTeacher.trim()) return
    setHomework((current) => [{ ...homeworkDraft, teacher: publishTeacher.trim(), ownerKey }, ...current])
    setHomeworkDraft({ ...homeworkDraft, date: '', time: '' })
  }
  function pickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }
  async function publish() {
    if ((postKind === 'photo' || postKind === 'series' || postKind === 'schedule') && !image) return
    if (postKind === 'announcement' && (!draft.title.trim() || !draft.body.trim() || (publisherRole === 'teacher' && !publishTeacher.trim()))) return
    const title = draft.title.trim() || (postKind === 'series' ? `Série de ${publishClass} · ${publishSubject}` : postKind === 'photo' ? `Photo de ${publishClass}` : `Emploi du temps — ${publishClass}`)
    const body = draft.body.trim() || 'Publication partagée avec la communauté scolaire.'
    const post = { id: editingPostId ?? crypto.randomUUID(), title, body, kind: postKind, image, className: publishClass, author: publisherRole === 'teacher' ? publishTeacher.trim() || 'Enseignant' : publisherRole === 'student' ? 'Élève' : 'Directeur', subject: publishSubject, level: publishLevel, teacher: publishTeacher.trim(), ownerKey } satisfies Post
    const payload = { title: post.title, body: post.body, kind: post.kind, image: post.image, author: post.author, class_name: post.className, subject: post.subject, level: post.level, teacher: post.teacher, owner_key: ownerKey }
    const response = await fetch(editingPostId ? `${postsEndpoint}?id=eq.${encodeURIComponent(editingPostId)}&owner_key=eq.${encodeURIComponent(ownerKey)}` : postsEndpoint, { method: editingPostId ? 'PATCH' : 'POST', headers: { ...postsHeaders, Prefer: 'return=representation' }, body: JSON.stringify(payload) })
    if (!response.ok) return
    const [savedPostRaw] = await response.json() as Array<Post & { class_name?: string; owner_key?: string }>
    const savedPost = { ...savedPostRaw, className: savedPostRaw.className ?? savedPostRaw.class_name, ownerKey: savedPostRaw.ownerKey ?? savedPostRaw.owner_key ?? ownerKey }
    setPosts((current) => editingPostId ? current.map((item) => item.id === editingPostId ? savedPost : item) : [savedPost, ...current])
    setDraft({ title: '', body: '' }); setImage(''); setEditingPostId(null); setDirectorOpen(false)
  }

  if (!profileReady) return <main className="auth-page"><section className="auth-card"><div className="welcome-language" aria-label="Choisir la langue">{(['ar', 'fr', 'en'] as const).map((item) => <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}</div><img className="welcome-logo" src={lpkLogo} alt="Logo LPK Kairouan" /><p className="eyebrow">LPK KAIROUAN · ESPACE MEMBRE</p><h1>{copy.welcome}</h1><p className="auth-lead">Présentez-vous pour accéder aux ressources et aux espaces de publication.</p><label>Votre profil<select value={onboarding.role} onChange={(e) => setOnboarding({ ...onboarding, role: e.target.value as typeof onboarding.role })}><option value="student">Élève</option><option value="teacher">Enseignant</option><option value="director">Directeur</option></select></label>{onboarding.role === 'student' && <label>Votre classe<select value={onboarding.className} onChange={(e) => setOnboarding({ ...onboarding, className: e.target.value })}>{classGroups.flatMap((group) => group.classes).map((className) => <option key={className}>{className}</option>)}</select></label>}{onboarding.role !== 'student' && <label>Code d&apos;accès<input type="password" inputMode="numeric" maxLength={4} value={onboarding.code} onChange={(e) => setOnboarding({ ...onboarding, code: e.target.value })} placeholder={onboarding.role === 'teacher' ? 'Code enseignant' : 'Code directeur'} /></label>}{onboardingError && <p className="auth-error">{onboardingError}</p>}<button className="publish primary shimmer-cta" onClick={completeOnboarding}>Entrer sur le site</button></section></main>

  return <div className="site-shell">
    <header className="topbar"><div className="topbar-inner"><a className="brand" href="#top"><img className="brand-logo" src={lpkLogo} alt="Logo LPK Kairouan" /><span><strong>LPK Kairouan</strong><small>LYCÉE PILOTE</small></span></a><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.search} aria-label="Rechercher" /></label><div className="language" aria-label="Choisir la langue">{(['ar', 'fr', 'en'] as const).map((item) => <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}</div><div className="header-actions"><button aria-label="Accès directeur" onClick={() => openPublisher('director')}>♧</button></div></div></header>
    <nav className="main-nav"><div className="nav-inner"><button className={view === 'home' ? 'selected' : ''} onClick={() => setView('home')}>{copy.home}</button><button className={view === 'classes' ? 'selected' : ''} onClick={() => setView('classes')}>{copy.classes}</button><button className={view === 'teacher-news' ? 'selected' : ''} onClick={() => setView('teacher-news')}>{copy.news}</button><button className={view === 'homework' ? 'selected' : ''} onClick={() => setView('homework')}>Devoirs</button></div></nav>
  <main id="top">
  {query.trim() && <section className="search-results content-width" aria-live="polite"><div className="section-heading"><div><p className="eyebrow">RECHERCHE DU PORTAIL</p><h2>Résultats pour <em>« {query} »</em></h2></div><span className="result-count">{searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}</span></div>{searchResults.length ? <div className="search-result-grid">{searchResults.map((result, index) => <button className="search-result-card" key={`${result.title}-${index}`} onClick={() => { setQuery(''); if (result.target === 'classes') setView('classes'); else document.getElementById(result.target)?.scrollIntoView({ behavior: 'smooth' }) }}><span className="tag">{result.type}</span><strong>{result.title}</strong><small>{result.detail}</small><span className="result-arrow" aria-hidden="true">↗</span></button>)}</div> : <div className="empty">Aucun résultat. Essayez un nom d&apos;enseignant, une matière ou une classe.</div>}</section>}
  {view === 'teacher-news' ? <section className="teacher-news-page content-width"><p className="eyebrow">ESPACE ENSEIGNANTS</p><h1>Actualités des <em>enseignants</em></h1><p className="intro">Les enseignants partagent ici leurs annonces et informations pédagogiques.</p><div className="news-grid">{posts.filter((post) => post.kind === 'announcement' && post.author !== 'Directeur').map((post) => <article className="news-card spotlight-card" key={post.id}><span className="tag">ACTUALITÉ</span><h2>{post.title}</h2><p>{post.body}</p><small>Publié par {post.author}</small>{post.ownerKey === ownerKey && <button className="resource-delete" onClick={() => deletePost(post)}>Supprimer</button>}</article>)}{!posts.some((post) => post.kind === 'announcement' && post.author !== 'Directeur') && <div className="empty">Aucune actualité enseignante pour le moment.</div>}</div></section> : view === 'homework' ? <section className="homework-page content-width"><p className="eyebrow">ESPACE DEVOIRS</p><h1>Devoirs &amp; <em>échéances</em></h1><p className="intro">Les enseignants ajoutent les devoirs avec la matière, la classe, la date et l&apos;heure. Tous les élèves peuvent les consulter.</p><div className="homework-class-sections">{classGroups.map((group) => <section className="homework-class-group" key={group.level}><div><span className="eyebrow">{group.level}</span><h2>{group.description}</h2></div><div className="homework-class-list">{group.classes.map((className) => <button key={className} className={homeworkDraft.className === className ? 'active' : ''} onClick={() => { setHomeworkDraft({ ...homeworkDraft, className }); setSelectedClass(className) }}>{className}</button>)}</div></section>)}</div>{profile.role === 'teacher' ? <div className="homework-form spotlight-card"><label>Nom de l&apos;enseignant<input value={publishTeacher} onChange={(e) => setPublishTeacher(e.target.value)} placeholder="Écrivez votre nom" /></label><label>Matière<select value={homeworkDraft.subject} onChange={(e) => setHomeworkDraft({ ...homeworkDraft, subject: e.target.value })}>{homeworkSubjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label><label>Classe<select value={homeworkDraft.className} onChange={(e) => setHomeworkDraft({ ...homeworkDraft, className: e.target.value })}>{classGroups.flatMap((group) => group.classes).map((className) => <option key={className}>{className}</option>)}</select></label><label>Date<input type="date" value={homeworkDraft.date} onChange={(e) => setHomeworkDraft({ ...homeworkDraft, date: e.target.value })} /></label><label>Heure<input type="time" value={homeworkDraft.time} onChange={(e) => setHomeworkDraft({ ...homeworkDraft, time: e.target.value })} /></label><button className="publish primary shimmer-cta" onClick={publishHomework}>Publier le devoir</button></div> : <p className="publisher-lock">Seuls les enseignants peuvent publier un devoir.</p>}{selectedClass && <div className="class-detail homework-class-dashboard"><button className="back-button" onClick={() => setSelectedClass(null)}>← Toutes les classes</button><div className="detail-heading"><div><p className="eyebrow">TABLEAU DE BORD</p><h2>{selectedClass}</h2></div><span className="live-pill">Devoirs publiés</span></div></div>}<div className="homework-grid">{homework.filter((item) => !selectedClass || item.className === selectedClass).map((item, index) => <article className="homework-card spotlight-card" key={`${item.subject}-${item.className}-${index}`}><span className="tag">DEVOIR</span><h2>{item.subject}</h2><div><strong>{item.className}</strong><span>{item.date}</span><span>{item.time}</span><span>{item.teacher}</span></div>{item.ownerKey === ownerKey && profile.role === 'teacher' && <button className="resource-delete" onClick={() => setHomework((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Supprimer</button>}</article>)}{!homework.length && <div className="empty">Aucun devoir publié pour le moment.</div>}</div></section> : view === 'teacher-news' ? <section className="teacher-news-page content-width"><p className="eyebrow">ESPACE ENSEIGNANTS</p><h1>Actualités des <em>enseignants</em></h1><p className="intro">Les enseignants partagent ici leurs informations. Les élèves peuvent les consulter librement.</p><div className="news-grid">{posts.filter((post) => post.kind === 'announcement' && post.author === 'Enseignant').map((post) => <article className="news-card spotlight-card" key={`${post.title}-${post.body}`}><span className="tag">ENSEIGNANT</span><h2>{post.title}</h2><p>{post.body}</p><small>{post.className ?? 'LPK Kairouan'}</small></article>)}{!posts.some((post) => post.kind === 'announcement' && post.author === 'Enseignant') && <div className="empty">Les actualités des enseignants apparaîtront ici.</div>}</div></section> : view === 'home' ? <>
        <section className="notice-section"><div className="content-width"><p className="eyebrow">AFFICHE DE LA SEMAINE</p><h1>Informations du <em>Directeur</em></h1><div className="notice-card"><div className="megaphone">⚑</div>{posts.filter((post) => post.kind === 'announcement' && post.author === 'Directeur').length ? posts.filter((post) => post.kind === 'announcement' && post.author === 'Directeur').map((post) => <div key={post.title}><h3>{post.title}</h3><p>{post.body}</p></div>) : <><p>لا يوجد شيء هنا</p><small>AUCUNE ANNONCE CETTE SEMAINE</small></>}</div></div></section>
        <div className="content-width"><div className="ad-space">ADVERTISEMENT SPACE</div></div>
        <section className="resources content-width" id="resources"><div className="section-heading"><div><p className="eyebrow">RESSOURCES PÉDAGOGIQUES</p><h2>{copy.resources}</h2></div></div><div className="filters">{['Tous', '1ère année', '2ème année', '3ème année', '4ème année'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="resource-layout"><div className="resource-list">{seriesPosts.map((post) => <article className="resource-card series-photo-card" key={post.id}>{post.image && <button className="series-photo-open" onClick={() => setLightboxImage({ src: post.image!, alt: post.title })} aria-label={`Ouvrir ${post.title}`}><img src={post.image} alt={post.title} /></button>}<div className="resource-info"><div className="resource-meta"><span className="tag">SÉRIE</span><span className="subject">{post.subject}</span></div><h3>{post.title}</h3><div className="details"><span>◫ {post.className}</span><span>{post.level}</span><span>{post.teacher}</span></div></div>{post.ownerKey === ownerKey && <><button className="resource-action" onClick={() => editPost(post)}>Remplacer</button><button className="resource-delete" onClick={() => deletePost(post)} aria-label={`Supprimer ${post.title}`}>×</button></>}</article>)}{filtered.map((item) => <article className="resource-card spotlight-card" key={item.title}><div className="file-icon">▤</div><div className="resource-info"><div className="resource-meta"><span className="tag">{item.type}</span><span className="subject">{item.subject}</span></div><h3>{item.title}</h3><div className="details"><span>◫ {item.className}</span><span>{item.teacher}</span><span>▣ {item.date}</span></div></div><button className="download" aria-label={`Télécharger ${item.title}`}>⇩</button></article>)}</div><aside className="side-ad">ADVERTISEMENT SPACE</aside></div></section>
      </> : <section className="classes-page content-width"><p className="eyebrow">ESPACE CLASSES</p><h1>Classes &amp; <em>Emplois du temps</em></h1><p className="intro">Retrouvez l&apos;emploi du temps et les photos publiées par la direction pour chaque classe.</p>{selectedClass ? <div className="class-detail"><button className="back-button" onClick={() => setSelectedClass(null)}>← Toutes les classes</button><div className="detail-heading"><div><p className="eyebrow">CLASSE {selectedClass}</p><h2>{selectedClass}</h2></div><span className="live-pill">Mis à jour</span></div><div className="detail-columns"><div className="schedule-panel"><p className="eyebrow">EMPLOI DU TEMPS</p><h3>Cette semaine</h3>{posts.filter((post) => post.kind === 'schedule' && post.className === selectedClass && post.image).map((post) => <figure className="schedule-image-card" key={`${post.title}-${post.body}`}><img src={post.image} alt={`Emploi du temps ${selectedClass}`} /><figcaption><strong>{post.title}</strong><span>{post.body}</span></figcaption></figure>)}{!posts.some((post) => post.kind === 'schedule' && post.className === selectedClass && post.image) && <div className="empty">L&apos;emploi du temps sera publié ici par le directeur.</div>}</div><div className="class-photos"><p className="eyebrow">LISTE DES ÉLÈVES</p><h3>Moments partagés</h3><div className="class-photo-grid">{posts.filter((post) => post.kind === 'photo' && post.className === selectedClass).map((post) => <article key={`${post.title}-${post.body}`}><button className="photo-open" onClick={() => post.image && setLightboxImage({ src: post.image, alt: post.title })} aria-label={`Ouvrir ${post.title}`}>{post.image && <img src={post.image} alt={post.title} />}<strong>{post.title}</strong></button></article>)}{!posts.some((post) => post.kind === 'photo' && post.className === selectedClass) && <div className="empty">Les photos publiées par la direction apparaîtront ici.</div>}</div></div></div></div> : <div className="class-grid">{classGroups.map((group, index) => <article className="class-card" key={group.label}><span className="class-number">0{index + 1}</span><p className="eyebrow">{group.level}</p><h2>{group.label}<span> — {group.description}</span></h2><p>{group.count} classes disponibles · emploi du temps et photos.</p><div className="class-options" aria-label={`Classes de ${group.level}`}>{group.classes.map((className) => <button className="class-option" key={className} onClick={() => setSelectedClass(className)}>{className}<span aria-hidden="true">↗</span></button>)}</div></article>)}</div>}</section>}
      <section className="school-life content-width" id="school-life"><div className="section-heading"><div><p className="eyebrow">VIE SCOLAIRE</p><h2>{copy.schoolLife}</h2></div></div><div className="post-grid">{posts.filter((post) => post.kind === 'photo' && post.author === 'Directeur').map((post) => <article className="published-card spotlight-card" key={`${post.title}-${post.body}`}>{post.image && <button className="photo-open" onClick={() => setLightboxImage({ src: post.image!, alt: post.title })} aria-label={`Ouvrir ${post.title}`}><img src={post.image} alt={post.title} /></button>}{!post.image && <div className="post-icon">▧</div>}<div><span className="tag">{post.kind === 'photo' ? 'LISTE DES ÉLÈVES' : 'EMPLOI DU TEMPS'}</span><h3>{post.title}</h3><p>{post.body}</p><small>Publié par {post.author}</small>{post.ownerKey === ownerKey && <div className="post-actions"><button onClick={() => editPost(post)}>Remplacer</button><button onClick={() => deletePost(post)}>Supprimer</button></div>}</div></article>)}{!posts.some((post) => post.kind === 'photo' && post.author === 'Directeur') && <div className="empty">Les annonces et photos publiées par la direction apparaîtront ici.</div>}</div></section>
    </main>
    <footer><strong>LPK Kairouan</strong><span className="creator-credit">Created by Yahya Gharsellaoui</span><a className="whatsapp-link" href="https://wa.me/21696736260" target="_blank" rel="noreferrer">WhatsApp · +216 96 736 260</a></footer>
    <div className="community-bar"><span>Partager avec la communauté</span><button className="glass-button" onClick={() => openPublisher(profile.role as 'student' | 'teacher')}>Publier une photo</button><button className="glass-button" onClick={() => setView('teacher-news')}>Actualités enseignants</button></div>
    {directorOpen && <div className="modal-backdrop" onClick={() => setDirectorOpen(false)}><section className="director-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDirectorOpen(false)} aria-label="Fermer">×</button>{!authenticated ? <><p className="eyebrow">ESPACE DIRECTION</p><h2>Accès directeur</h2><p>Entrez le code pour publier sur le site.</p><input className="director-code" type="password" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code directeur" /><button className="publish primary shimmer-cta" onClick={unlock}>Ouvrir l&apos;espace</button></> : <><p className="eyebrow">PUBLICATION · {publisherRole === 'student' ? 'ÉLÈVE' : publisherRole === 'teacher' ? 'ENSEIGNANT' : 'DIRECTION'}</p><h2>Nouvelle publication</h2><p className="publisher-lock">Profil vérifié : <strong>{publisherRole === 'student' ? 'Élève' : publisherRole === 'teacher' ? 'Enseignant' : 'Directeur'}</strong></p>{(publisherRole === 'director' || publisherRole === 'teacher') && <div className="publish-tabs">{(publisherRole === 'director' ? [['announcement','Annonce'],['schedule','Emploi'],['photo','Liste des élèves'],['series','Photo de série']] : [['announcement','Actualité'],['series','Série & devoir']]).map(([value, label]) => <button key={value} className={postKind === value ? 'active' : ''} onClick={() => setPostKind(value as Post['kind'])}>{label}</button>)}</div>}{postKind !== 'photo' && <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre" />}{postKind !== 'photo' && <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Contenu de la publication" rows={4} />}{(postKind === 'photo' || postKind === 'series' || postKind === 'schedule') && <><label className="field-label" htmlFor="publish-level">Niveau</label><select id="publish-level" value={publishLevel} onChange={(e) => setPublishLevel(e.target.value)}><option>1ère année</option><option>2ème année</option><option>3ème année</option><option>4ème année</option></select><label className="field-label" htmlFor="publish-class">Classe concernée</label><select id="publish-class" value={publishClass} onChange={(e) => setPublishClass(e.target.value)}>{classGroups.flatMap((group) => group.classes).map((className) => <option key={className}>{className}</option>)}</select>{(postKind === 'photo' || postKind === 'series') && <><label className="field-label" htmlFor="publish-subject">Matière</label><select id="publish-subject" value={publishSubject} onChange={(e) => setPublishSubject(e.target.value)}><option>Mathématiques</option><option>Physique</option><option>Sciences</option><option>Français</option><option>Anglais</option></select><label className="field-label" htmlFor="publish-teacher">Nom de l&apos;enseignant</label><input id="publish-teacher" value={publishTeacher} onChange={(e) => setPublishTeacher(e.target.value)} placeholder="Écrire le nom de l&apos;enseignant" /></>}<label className="image-upload">Choisir une photo<input type="file" accept="image/*" onChange={pickImage} /></label></>}{image && <img className="image-preview" src={image} alt="Aperçu de la photo" />}<button className="publish primary shimmer-cta" onClick={publish}>Publier maintenant</button></>}</section></div>}
    {lightboxImage && <div className="lightbox-backdrop" onClick={() => setLightboxImage(null)}><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setLightboxImage(null)} aria-label="Fermer la photo">×</button><img src={lightboxImage.src} alt={lightboxImage.alt} /><p>{lightboxImage.alt}</p></div></div>}
  </div>
}

