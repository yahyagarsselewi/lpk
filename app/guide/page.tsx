import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guide du portail | LPK Kairouan',
  description: 'Découvrez comment trouver une classe, consulter les emplois du temps, rechercher une matière et partager les photos de la vie scolaire du Lycée Pilote de Kairouan.',
  keywords: ['guide LPK Kairouan', 'classes lycée pilote', 'emplois du temps Kairouan', 'photos de classe Tunisie'],
  openGraph: { title: 'Guide du portail LPK Kairouan', description: 'Toutes les ressources du portail scolaire réunies dans un espace simple et accessible.', type: 'website', locale: 'fr_TN' },
}

export default function GuidePage() {
  return <main className="guide-page"><div className="guide-inner"><p className="eyebrow">LPK KAIRouAN · GUIDE</p><h1>Tout le portail, <em>en un regard.</em></h1><p className="guide-lead">Retrouvez rapidement les ressources pédagogiques, les classes, les emplois du temps et les photos partagées par la communauté scolaire.</p><div className="guide-grid"><article><span>01</span><h2>Rechercher</h2><p>Saisissez le nom d&apos;un enseignant, une matière ou une classe dans la barre de recherche pour obtenir des résultats instantanés.</p></article><article><span>02</span><h2>Choisir une classe</h2><p>Ouvrez « Classes &amp; Emplois du Temps », choisissez votre niveau puis la classe exacte pour consulter ses contenus.</p></article><article><span>03</span><h2>Partager</h2><p>Les élèves et enseignants peuvent publier des photos de série. Les annonces et emplois du temps sont réservés au directeur.</p></article></div><a className="glass-button guide-link" href="/">Retourner à l&apos;accueil ↗</a></div></main>
}
