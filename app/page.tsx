'use client'

import { ChangeEvent, useMemo, useState } from 'react'

const resources = [
  { type: 'SÉRIE', subject: 'Mathématiques', title: 'Série — Continuité.pdf', className: '4ème Math 1', teacher: 'Mme. Ben Salah', date: '24 sept. 2026' },
  { type: 'SÉRIE', subject: 'Physique', title: 'Cinématique — Exercices.pdf', className: '3ème Sciences Expérimentales 1', teacher: 'M. Gharbi', date: '23 sept. 2026' },
  { type: 'DEVOIR', subject: 'Anglais', title: 'Progress Check 01.pdf', className: '2ème Sciences 3', teacher: 'Mme. Trabelsi', date: '22 sept. 2026' },
]

type Post = { title: string; body: string; kind: 'announcement' | 'schedule' | 'photo'; image?: string }

export default function Page() {
  const [filter, setFilter] = useState('Tous')
  const [query, setQuery] = useState('')
  const [directorOpen, setDirectorOpen] = useState(false)
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

  function unlock() { if (code === '5436') setAuthenticated(true) }
  function pickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) setImage(URL.createObjectURL(file))
  }
  function publish() {
    if (!draft.title.trim() || !draft.body.trim()) return
    setPosts((current) => [{ ...draft, kind: postKind, image }, ...current])
    setDraft({ title: '', body: '' }); setImage(''); setDirectorOpen(false)
  }

  return <div className="site-shell">
    <header className="topbar"><div className="topbar-inner"><a className="brand" href="#top"><span className="brand-mark" aria-hidden="true">⌑</span><span><strong>LPK Kairouan</strong><small>LYCÉE PILOTE</small></span></a><label className="search"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enseignant, matière ou niveau..." aria-label="Rechercher" /></label><div className="language"><button>AR</button><button className="active">FR</button><button>EN</button></div><div className="header-actions"><button aria-label="Accès directeur" onClick={() => setDirectorOpen(true)}>♧</button></div></div></header>
    <nav className="main-nav"><div className="nav-inner"><a className="selected" href="#resources">Séries &amp; Devoirs</a><a href="#school-life">Emplois du Temps &amp; Photos de Classes</a></div></nav>
    <main id="top">
      <section className="notice-section"><div className="content-width"><p className="eyebrow">AFFICHE DE LA SEMAINE</p><h1>Information de la <em>Direction</em></h1><div className="notice-card"><div className="megaphone">⚑</div>{posts.filter((post) => post.kind === 'announcement').length ? posts.filter((post) => post.kind === 'announcement').map((post) => <div key={post.title}><h3>{post.title}</h3><p>{post.body}</p></div>) : <><p>لا يوجد شيء هنا</p><small>AUCUNE ANNONCE CETTE SEMAINE</small></>}</div></div></section>
      <div className="content-width"><div className="ad-space">ADVERTISEMENT SPACE</div></div>
      <section className="resources content-width" id="resources"><div className="section-heading"><div><p className="eyebrow">RESSOURCES PÉDAGOGIQUES</p><h2>Séries <em>&amp; Devoirs</em></h2></div></div><div className="filters">{['Tous', '1ère année', '2ème année', '3ème année', '4ème année (Bac)'].map((item) => <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="resource-layout"><div className="resource-list">{filtered.map((item) => <article className="resource-card" key={item.title}><div className="file-icon">▤</div><div className="resource-info"><div className="resource-meta"><span className="tag">{item.type}</span><span className="subject">{item.subject}</span></div><h3>{item.title}</h3><div className="details"><span>◫ {item.className}</span><span>{item.teacher}</span><span>▣ {item.date}</span></div></div><button className="download" aria-label={`Télécharger ${item.title}`}>⇩</button></article>)}</div><aside className="side-ad">ADVERTISEMENT SPACE</aside></div></section>
      <section className="school-life content-width" id="school-life"><div className="section-heading"><div><p className="eyebrow">VIE SCOLAIRE</p><h2>Emplois <em>&amp; Photos</em></h2></div></div><div className="post-grid">{posts.filter((post) => post.kind !== 'announcement').map((post) => <article className="published-card" key={`${post.title}-${post.body}`}>{post.image && <img src={post.image} alt={post.title} />}{!post.image && <div className="post-icon">{post.kind === 'photo' ? '▧' : '▤'}</div>}<div><span className="tag">{post.kind === 'photo' ? 'PHOTO DE CLASSE' : 'EMPLOI DU TEMPS'}</span><h3>{post.title}</h3><p>{post.body}</p></div></article>)}{!posts.some((post) => post.kind !== 'announcement') && <div className="empty">Les publications de la direction apparaîtront ici.</div>}</div></section>
    </main><footer><strong>LPK Kairouan</strong><span>Created by Yahya Gharsellaoui</span></footer>
    {directorOpen && <div className="modal-backdrop" onClick={() => setDirectorOpen(false)}><section className="director-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDirectorOpen(false)} aria-label="Fermer">×</button>{!authenticated ? <><p className="eyebrow">ESPACE DIRECTION</p><h2>Accès directeur</h2><p>Entrez le code pour publier sur le site.</p><input className="director-code" type="password" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code directeur" /><button className="publish primary" onClick={unlock}>Ouvrir l&apos;espace</button></> : <><p className="eyebrow">PUBLICATION</p><h2>Nouvelle publication</h2><div className="publish-tabs">{[['announcement','Annonce'],['schedule','Emploi'],['photo','Photo de classe']].map(([value, label]) => <button key={value} className={postKind === value ? 'active' : ''} onClick={() => setPostKind(value as Post['kind'])}>{label}</button>)}</div><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre" /><textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder={postKind === 'photo' ? 'Description de la photo' : 'Contenu de la publication'} rows={4} />{postKind === 'photo' && <label className="image-upload">Choisir une photo<input type="file" accept="image/*" onChange={pickImage} /></label>}{image && <img className="image-preview" src={image} alt="Aperçu de la photo" />}<button className="publish primary" onClick={publish}>Publier maintenant</button></>}</section></div>}
  </div>
}
