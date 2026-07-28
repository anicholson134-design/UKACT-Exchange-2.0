  import type { LucideIcon } from 'lucide-react'

export interface SectorConfig {
  id: string
  slug: string
  name: string
  shortName: string
  tagline: string
  subtitle: string
  heroPoster: string
  videoSrc?: string
  accentClass: string
  benefits: { icon: string; title: string; desc: string }[]
  mission: { headline: string; body: string; image: string }
  caseStudy: {
    label: string
    title: string
    body: string
    image: string
    stat: string
    statLabel: string
    quote: string
    quoteAuthor: string
  }
  sectorTag: string
  partners: { name: string }[]
  testimonials: { quote: string; name: string; role: string; image: string }[]
  cta: { headline: string; body: string; href: string; label: string }
}

export const sectors: SectorConfig[] = [
  {
    id: 'conservation',
    slug: '/sectors/conservation',
    name: 'KEEP Conservation',
    shortName: 'Conservation',
    tagline: 'Protecting Wildlife Through Knowledge',
    subtitle: 'Connecting conservation professionals with field-leading organisations across the globe.',
    heroPoster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=90',
    videoSrc: '/e-x-t-e-r-n-a-l_-i-m-a-g-e_-t-o_-v-i-d-e-o-a8cee263-2145-4489-8700-735fbb55a034.mp4-20260628-1100-20260628-1100.mp4',
    accentClass: 'text-sage',
    benefits: [
      { icon: 'Globe', title: 'Field Experience', desc: 'Gain hands-on experience in real-world in-situ and ex-situ conservation settings.' },
      { icon: 'Shield', title: 'Species Expertise', desc: 'Develop specialist knowledge across threatened, endangered and critically endangered species.' },
      { icon: 'Users', title: 'Global Network', desc: 'Build relationships with conservation professionals across 24 countries and growing.' },
      { icon: 'TrendingUp', title: 'Career Growth', desc: 'Accelerate your path with recognised conservation credentials and project experience.' },
    ],
    mission: {
      headline: 'Conservation is more than care. It is commitment.',
      body: 'KEEP Conservation connects field-ready professionals with the organisations making the greatest impact on wildlife survival. Through structured exchanges, shared research and mentorship, we are building the next generation of conservation leaders — the people who will shape the future of wild species on this planet.',
      image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Leopard Husbandry Exchange · Kenya & UK',
      body: 'A three-week exchange between a UK zoo keeper and a Kenyan field conservation team transformed how both institutions approach leopard habituation protocols. The UK keeper returned with field-validated enrichment techniques that improved welfare outcomes. The Kenyan team gained structured record-keeping practices from captive settings — knowledge they had never had access to before.',
      image: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=1200&q=85',
      stat: '40%',
      statLabel: 'Improvement in behavioural welfare indicators',
      quote: 'This exchange genuinely changed the way our entire conservation team thinks about animal behaviour.',
      quoteAuthor: 'Field Conservation Director, Maasai Mara',
    },
    sectorTag: 'Conservation',
    partners: [
      { name: 'Durrell Wildlife Conservation Trust' },
      { name: 'WWF' },
      { name: 'African Wildlife Foundation' },
      { name: 'Fauna & Flora International' },
      { name: 'Wildlife Conservation Society' },
      { name: 'IUCN' },
      { name: 'Born Free Foundation' },
      { name: 'Chester Zoo Conservation' },
    ],
    testimonials: [
      { quote: 'My KEEP conservation exchange gave me direct field exposure I simply could not have got any other way. It changed my career trajectory completely.', name: 'Sarah Mitchell', role: 'Conservation Keeper · Chester Zoo', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
      { quote: 'The connections I made through KEEP led directly to me leading our first in-situ conservation project. The value is immeasurable.', name: 'James Hartley', role: 'Conservation Officer · ZSL', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { quote: 'Three weeks in the field taught me more about species behaviour than five years in a captive setting alone could have.', name: 'Emma Clarke', role: 'Senior Keeper · Longleat', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    ],
    cta: {
      headline: 'Ready to make a real difference?',
      body: 'Join KEEP Conservation and connect with organisations at the forefront of protecting the world\'s most vulnerable species.',
      href: '/register/candidate',
      label: 'Join KEEP Conservation',
    },
  },

  {
    id: 'zoos-aquariums',
    slug: '/sectors/zoos-aquariums',
    name: 'KEEP Zoos & Aquariums',
    shortName: 'Zoos & Aquariums',
    tagline: 'Excellence in Animal Care',
    subtitle: 'Raising the standard of husbandry and animal welfare across UK and international collections.',
    heroPoster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1920&q=90',
    accentClass: 'text-blue-300',
    benefits: [
      { icon: 'Heart', title: 'Husbandry Skills', desc: 'Master advanced techniques across diverse taxa in world-class collection environments.' },
      { icon: 'Layers', title: 'Species Diversity', desc: 'Work with species you would never encounter at your home institution.' },
      { icon: 'Network', title: 'Keeper Community', desc: 'Become part of the most connected keeper network in the UK.' },
      { icon: 'Award', title: 'Professional Recognition', desc: 'Build a portfolio of verified exchange experience that stands out to employers.' },
    ],
    mission: {
      headline: 'Better keepers. Better welfare. Better outcomes.',
      body: 'KEEP Zoos & Aquariums was built on a belief that the best animal care comes from keepers who have been exposed to the widest possible range of species, techniques and professional perspectives. Through structured placements at partner collections, we are raising the bar for what excellent keeping looks like.',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Marine Mammal Exchange · Brighton & Edinburgh',
      body: 'A keeper specialising in seals at SeaLife Brighton completed a two-week exchange at Edinburgh Zoo\'s penguin and marine bird team. The cross-species techniques she brought back — particularly around operant conditioning and voluntary health checks — transformed the daily care routine for the whole team, significantly reducing stress indicators at feeding time.',
      image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&q=85',
      stat: '60%',
      statLabel: 'Reduction in stress indicators during health checks',
      quote: 'I had never worked with penguins before. Now our whole team uses techniques I learned in Edinburgh every single day.',
      quoteAuthor: 'Marine Keeper, SeaLife Brighton',
    },
    sectorTag: 'Zoos',
    partners: [
      { name: 'Chester Zoo' }, { name: 'ZSL London Zoo' }, { name: 'Edinburgh Zoo' },
      { name: 'Longleat Safari Park' }, { name: 'SeaLife Brighton' }, { name: 'Twycross Zoo' },
      { name: 'Colchester Zoo' }, { name: 'Bristol Zoo Project' },
    ],
    testimonials: [
      { quote: 'Working at Chester Zoo for three weeks opened my eyes to animal management at a completely different scale. I came back a better keeper.', name: 'Tom Ellis', role: 'Keeper · Paignton Zoo', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
      { quote: 'KEEP gave me the confidence and skills to apply for a senior keeper position I would never have gone for before the exchange.', name: 'Priya Sharma', role: 'Senior Keeper · Flamingo Land', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
      { quote: 'The knowledge I gained about diet preparation from my exchange is something I use every single day. It was genuinely career-defining.', name: 'Chris Webb', role: 'Keeper · Whipsnade Zoo', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
    ],
    cta: {
      headline: 'Take your keeping to the next level',
      body: 'Apply for a KEEP Zoos & Aquariums exchange and experience animal care at some of the UK\'s most respected collections.',
      href: '/register/candidate',
      label: 'Join KEEP Zoos & Aquariums',
    },
  },

  {
    id: 'education',
    slug: '/sectors/education',
    name: 'KEEP Education',
    shortName: 'Education',
    tagline: 'Inspiring the Next Generation',
    subtitle: 'Empowering educators and interpreters to connect the public with the natural world.',
    heroPoster: 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1920&q=90',
    accentClass: 'text-yellow-300',
    benefits: [
      { icon: 'BookOpen', title: 'Teaching Techniques', desc: 'Develop engaging education methods that resonate with audiences of all ages.' },
      { icon: 'Lightbulb', title: 'Programme Design', desc: 'Learn to create curriculum-aligned content that delivers lasting conservation impact.' },
      { icon: 'Megaphone', title: 'Public Engagement', desc: 'Master the art of communicating conservation stories to diverse public audiences.' },
      { icon: 'Monitor', title: 'Digital Resources', desc: 'Access and develop digital tools and resources for modern conservation education.' },
    ],
    mission: {
      headline: 'Education is the most powerful conservation tool we have.',
      body: 'KEEP Education supports the professionals who inspire the public — from school group presenters and education officers to interpretive designers and outreach co-ordinators. By sharing best practice between institutions, we ensure that every visitor encounter leaves a lasting impression that extends beyond the zoo gates.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Education Programme Exchange · Bristol & Paignton',
      body: 'Bristol Zoo\'s education officer spent two weeks with Paignton Zoo\'s interpretation team, co-developing a new hands-on conservation curriculum for school groups aged 7–14. The resulting programme — now running at both institutions — reached over 4,000 children in its first year and won a regional education award.',
      image: 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1200&q=85',
      stat: '4,000+',
      statLabel: 'Children reached in year one',
      quote: 'The collaboration produced something neither of our teams could have created alone. That is the power of KEEP.',
      quoteAuthor: 'Education Manager, Bristol Zoo Project',
    },
    sectorTag: 'Education',
    partners: [
      { name: 'Natural History Museum' }, { name: 'BIAZA' }, { name: 'AZA' },
      { name: 'WWF Education' }, { name: 'National Geographic' }, { name: 'David Attenborough Foundation' },
      { name: 'Wildlife Trusts' }, { name: 'RSPB' },
    ],
    testimonials: [
      { quote: 'The education techniques I learned during my KEEP exchange completely transformed how I present to school groups. Children are so much more engaged now.', name: 'Laura Green', role: 'Education Officer · Chester Zoo', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
      { quote: 'Spending time at a different institution reminded me why I got into conservation education in the first place. It reignited my passion.', name: 'Mark Davies', role: 'Interpretation Officer · Longleat', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
      { quote: 'KEEP Education gave me the professional development I had been looking for for years. It is exactly what this sector needs.', name: 'Anya Singh', role: 'Head of Education · Twycross Zoo', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    ],
    cta: {
      headline: 'Inspire more. Teach better. Reach further.',
      body: 'Join KEEP Education and connect with the educators and communicators driving conservation literacy across the UK and beyond.',
      href: '/register/candidate',
      label: 'Join KEEP Education',
    },
  },

  {
    id: 'researchers',
    slug: '/sectors/researchers',
    name: 'KEEP Researchers',
    shortName: 'Researchers',
    tagline: 'Science That Drives Conservation Forward',
    subtitle: 'Facilitating collaborative research between zoological collections and academic institutions worldwide.',
    heroPoster: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1920&q=90',
    accentClass: 'text-purple-300',
    benefits: [
      { icon: 'Microscope', title: 'Research Access', desc: 'Gain access to animal collections, datasets and facilities not available elsewhere.' },
      { icon: 'Database', title: 'Data Collaboration', desc: 'Share and combine datasets across institutions to drive more meaningful scientific conclusions.' },
      { icon: 'FileText', title: 'Publication Support', desc: 'Co-author papers with partner institutions and boost your research impact.' },
      { icon: 'Globe', title: 'Academic Network', desc: 'Build relationships with leading researchers across zoology, ecology and conservation science.' },
    ],
    mission: {
      headline: 'Research without boundaries.',
      body: 'KEEP Researchers was created to remove the barriers between academic science and practical conservation. By facilitating placements between researchers and zoological collections, we ensure that critical conservation science is grounded in the realities of animal care — and that practical keepers have access to the very latest research insights.',
      image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Behavioural Research Exchange · Oxford & Edinburgh Zoo',
      body: 'A University of Oxford PhD researcher specialising in primate cognition completed a six-week placement at Edinburgh Zoo, working alongside keepers on a long-term behavioural enrichment study. The result was a peer-reviewed paper co-authored with three zoo keepers — the first time any of them had appeared in academic literature — and a practical enrichment protocol now adopted across five partner collections.',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=85',
      stat: '5',
      statLabel: 'Collections now using the research-derived protocol',
      quote: 'Working alongside keepers daily gave my research a practical grounding that would never have been possible from a university alone.',
      quoteAuthor: 'PhD Researcher, University of Oxford',
    },
    sectorTag: 'Research',
    partners: [
      { name: 'University of Oxford' }, { name: 'University of Cambridge' }, { name: 'University of Edinburgh' },
      { name: 'ZSL Institute of Zoology' }, { name: 'Durrell Institute' }, { name: 'RZSS' },
      { name: 'University of Exeter' }, { name: 'Manchester Metropolitan University' },
    ],
    testimonials: [
      { quote: 'KEEP gave me the bridge between academic theory and real-world conservation practice that I had been searching for throughout my entire PhD.', name: 'Dr. Rachel Moore', role: 'Conservation Researcher · Oxford', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
      { quote: 'Co-authoring a paper with zoo keepers was one of the most rewarding experiences of my academic career. KEEP made it possible.', name: 'Prof. Daniel Wright', role: 'Senior Lecturer · University of Exeter', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { quote: 'The data I collected during my KEEP exchange formed the core of my dissertation. The access was invaluable and the team were exceptional.', name: 'Niamh Casey', role: 'MSc Conservation Biology', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    ],
    cta: {
      headline: 'Where research meets real-world impact',
      body: 'Join KEEP Researchers and access animal collections, field data and collaborative opportunities that will take your science further.',
      href: '/register/candidate',
      label: 'Join KEEP Researchers',
    },
  },
]

export function getSector(id: string, settings?: Record<string, string>): SectorConfig | undefined {
  const base = sectors.find(s => s.id === id)
  if (!base || !settings) return base

  const prefix = `sector.${id}.`
  const get = (key: string) => settings[`${prefix}${key}`]
  const parseArr = <T>(key: string, fallback: T[]): T[] => {
    const v = get(key)
    if (!v) return fallback
    try { return JSON.parse(v) as T[] } catch { return fallback }
  }

  return {
    ...base,
    name: get('name') ?? base.name,
    tagline: get('tagline') ?? base.tagline,
    subtitle: get('subtitle') ?? base.subtitle,
    heroPoster: get('hero_image') ?? base.heroPoster,
    mission: {
      headline: get('mission_headline') ?? base.mission.headline,
      body: get('mission_body') ?? base.mission.body,
      image: get('mission_image') ?? base.mission.image,
    },
    cta: {
      ...base.cta,
      headline: get('cta_headline') ?? base.cta.headline,
      body: get('cta_body') ?? base.cta.body,
    },
    benefits: parseArr('benefits', base.benefits),
    partners: parseArr('partners', base.partners),
    testimonials: parseArr('testimonials', base.testimonials),
    caseStudy: {
      ...base.caseStudy,
      title: get('case_title') ?? base.caseStudy.title,
      body: get('case_body') ?? base.caseStudy.body,
      stat: get('case_stat') ?? base.caseStudy.stat,
      statLabel: get('case_stat_label') ?? base.caseStudy.statLabel,
      quote: get('case_quote') ?? base.caseStudy.quote,
      quoteAuthor: get('case_quote_author') ?? base.caseStudy.quoteAuthor,
    },
  }
}
