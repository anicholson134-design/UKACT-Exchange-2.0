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
    name: 'UKACT Conservation & Welfare',
    shortName: 'Conservation & Welfare',
    tagline: 'Protecting Animal Welfare Through Knowledge',
    subtitle: 'Connecting animal care educators with the best practice and welfare science shaping the sector.',
    heroPoster: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=90',
    videoSrc: '/e-x-t-e-r-n-a-l_-i-m-a-g-e_-t-o_-v-i-d-e-o-a8cee263-2145-4489-8700-735fbb55a034.mp4-20260628-1100-20260628-1100.mp4',
    accentClass: 'text-sage',
    benefits: [
      { icon: 'Globe', title: 'Sector-Wide Perspective', desc: 'Learn from welfare and husbandry practice across colleges, farm schools and zoological collections alike.' },
      { icon: 'Shield', title: 'Welfare Expertise', desc: 'Develop specialist knowledge in animal welfare science, husbandry standards and biosecurity.' },
      { icon: 'Users', title: 'National Network', desc: 'Build relationships with animal care educators across 120+ colleges and 130+ farm schools.' },
      { icon: 'TrendingUp', title: 'Career Growth', desc: 'Accelerate your career with recognised CPD and shared best practice from across the network.' },
    ],
    mission: {
      headline: 'Welfare is more than care. It is commitment.',
      body: 'UKACT connects staff who care for animal collections in education settings with the practice and knowledge making the greatest impact on animal welfare. Through shared CPD, resources and mentorship, we are raising the standard of animal care across every college and farm school in our network.',
      image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Husbandry Knowledge Exchange · Midlands Colleges',
      body: 'Staff from two neighbouring animal management colleges spent a term sharing enrichment and record-keeping practice through the UKACT network. The smaller college adopted structured husbandry logs used at the larger institution, while the larger college picked up new low-cost enrichment ideas better suited to a teaching setting.',
      image: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=1200&q=85',
      stat: '40%',
      statLabel: 'Improvement in husbandry record consistency',
      quote: 'This exchange genuinely changed the way our whole department documents animal care.',
      quoteAuthor: 'Animal Unit Manager, Further Education College',
    },
    sectorTag: 'Conservation & Welfare',
    partners: [
      { name: 'BIAZA' },
      { name: 'Small Zoo Network' },
      { name: 'IRKA' },
      { name: 'ABMA' },
      { name: 'Hose2Habitat' },
      { name: 'Safe4' },
    ],
    testimonials: [
      { quote: 'Sharing welfare practice through UKACT gave me direct exposure to techniques I simply would not have found any other way.', name: 'Sarah Mitchell', role: 'Animal Unit Manager · Further Education College', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
      { quote: 'The connections I made through UKACT led directly to us overhauling our biosecurity protocols. The value is immeasurable.', name: 'James Hartley', role: 'Head of Animal Care · Agricultural College', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { quote: 'A term working alongside another institution taught me more about welfare practice than any course alone could have.', name: 'Emma Clarke', role: 'Animal Care Technician', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    ],
    cta: {
      headline: 'Ready to raise the bar on welfare?',
      body: 'Join UKACT and connect with the network raising animal welfare standards across UK education.',
      href: '/register/candidate',
      label: 'Join UKACT',
    },
  },

  {
    id: 'zoos-aquariums',
    slug: '/sectors/zoos-aquariums',
    name: 'UKACT Animal Care Colleges',
    shortName: 'Animal Care Colleges',
    tagline: 'Excellence in Animal Care Education',
    subtitle: 'Raising the standard of husbandry and welfare teaching across UK animal management colleges.',
    heroPoster: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1920&q=90',
    accentClass: 'text-blue-300',
    benefits: [
      { icon: 'Heart', title: 'Husbandry Skills', desc: 'Master advanced husbandry and welfare techniques across the diverse species held in college collections.' },
      { icon: 'Layers', title: 'Species Diversity', desc: 'Learn from staff working with species you would never encounter at your own institution.' },
      { icon: 'Network', title: 'Technician Community', desc: 'Become part of the most connected animal care technician network in the UK.' },
      { icon: 'Award', title: 'Professional Recognition', desc: 'Build a portfolio of CPD and shared practice that stands out to employers.' },
    ],
    mission: {
      headline: 'Better trained staff. Better welfare. Better student outcomes.',
      body: 'UKACT was built on the belief that the best animal care education comes from staff who have been exposed to the widest possible range of species, techniques and professional perspectives. Through shared CPD and peer exchange between member colleges, we are raising the bar for what excellent animal care teaching looks like.',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Cross-College Enrichment Exchange',
      body: 'An animal unit manager specialising in exotics at one college completed a short placement observing the large-animal team at a neighbouring land-based college. The operant conditioning techniques she brought back transformed daily handling routines for the whole department, significantly reducing stress during husbandry checks.',
      image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&q=85',
      stat: '60%',
      statLabel: 'Reduction in stress indicators during handling',
      quote: 'I had never worked with large livestock before. Now our whole team uses techniques I learned on that placement every single day.',
      quoteAuthor: 'Animal Care Technician',
    },
    sectorTag: 'Animal Care Colleges',
    partners: [
      { name: 'BIAZA' },
      { name: 'Safe4' },
      { name: 'Kiezebrink' },
      { name: 'Waterhouse Speciality Feeds' },
      { name: 'Small Zoo Network' },
      { name: 'Zoo Fab' },
    ],
    testimonials: [
      { quote: 'Working alongside another college for a few weeks opened my eyes to animal management at a completely different scale. I came back a better technician.', name: 'Tom Ellis', role: 'Animal Care Technician', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
      { quote: 'UKACT gave me the confidence and skills to apply for a senior technician role I would never have gone for before.', name: 'Priya Sharma', role: 'Senior Animal Care Technician', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
      { quote: 'The knowledge I gained about diet preparation from a UKACT exchange is something I use every single day. It was genuinely career-defining.', name: 'Chris Webb', role: 'Animal Care Technician', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
    ],
    cta: {
      headline: 'Take your practice to the next level',
      body: 'Join UKACT and experience animal care education at some of the UK\'s leading colleges and farm schools.',
      href: '/register/candidate',
      label: 'Join UKACT',
    },
  },

  {
    id: 'education',
    slug: '/sectors/education',
    name: 'UKACT Education',
    shortName: 'Education',
    tagline: 'Inspiring the Next Generation',
    subtitle: "Supporting the lecturers and tutors who train the UK's future animal care technicians.",
    heroPoster: 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1920&q=90',
    accentClass: 'text-yellow-300',
    benefits: [
      { icon: 'BookOpen', title: 'Teaching Techniques', desc: 'Develop engaging teaching methods that resonate with students of all levels.' },
      { icon: 'Lightbulb', title: 'Curriculum Design', desc: 'Learn to create course content that delivers real husbandry and welfare competence.' },
      { icon: 'Megaphone', title: 'Student Engagement', desc: 'Master the art of preparing students for real careers in animal care.' },
      { icon: 'Monitor', title: 'Digital Resources', desc: 'Access and develop digital tools and resources for modern animal care education.' },
    ],
    mission: {
      headline: 'Education is the foundation of good animal care.',
      body: 'UKACT Education supports the lecturers, tutors and unit managers who train the next generation of animal care technicians — from further education colleges to land-based universities. By sharing best practice between institutions, we ensure every student leaves with the skills the sector actually needs.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Curriculum Exchange · Two FE Colleges',
      body: "An animal management lecturer spent two weeks with a neighbouring college's curriculum team, co-developing a new hands-on husbandry module for Level 3 students. The resulting course — now running at both institutions — improved practical assessment pass rates in its first year.",
      image: 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1200&q=85',
      stat: '4,000+',
      statLabel: 'Students reached across the network',
      quote: 'The collaboration produced something neither of our teams could have created alone. That is the power of UKACT.',
      quoteAuthor: 'Curriculum Lead, Animal Management',
    },
    sectorTag: 'Education',
    partners: [
      { name: 'BIAZA' },
      { name: 'Small Zoo Network' },
      { name: 'ABMA' },
      { name: 'Birdworld' },
      { name: 'IRKA' },
    ],
    testimonials: [
      { quote: 'The teaching techniques I picked up through UKACT completely transformed how I run practical sessions. Students are so much more engaged now.', name: 'Laura Green', role: 'Animal Management Lecturer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
      { quote: 'Spending time with another institution reminded me why I got into animal care education in the first place. It reignited my passion.', name: 'Mark Davies', role: 'Curriculum Tutor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
      { quote: 'UKACT gave me the professional development I had been looking for for years. It is exactly what this sector needs.', name: 'Anya Singh', role: 'Head of Animal Management', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    ],
    cta: {
      headline: 'Inspire more. Teach better. Reach further.',
      body: 'Join UKACT Education and connect with the lecturers and tutors driving standards across UK animal care education.',
      href: '/register/candidate',
      label: 'Join UKACT',
    },
  },

  {
    id: 'researchers',
    slug: '/sectors/researchers',
    name: 'UKACT Researchers',
    shortName: 'Researchers',
    tagline: 'Science That Drives Standards Forward',
    subtitle: 'Facilitating collaborative research between animal care educators and academic institutions.',
    heroPoster: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1920&q=90',
    accentClass: 'text-purple-300',
    benefits: [
      { icon: 'Microscope', title: 'Research Access', desc: 'Gain access to animal collections, datasets and facilities not available elsewhere.' },
      { icon: 'Database', title: 'Data Collaboration', desc: 'Share and combine datasets across institutions to drive more meaningful welfare research.' },
      { icon: 'FileText', title: 'Publication Support', desc: 'Co-author papers with partner institutions and boost your research impact.' },
      { icon: 'Globe', title: 'Academic Network', desc: 'Build relationships with researchers across animal welfare, husbandry and education science.' },
    ],
    mission: {
      headline: 'Research without boundaries.',
      body: 'UKACT Researchers exists to remove the barriers between academic study and day-to-day animal care practice. By connecting researchers with colleges and farm schools, we ensure welfare science is grounded in the realities of animal care education — and that technicians have access to the latest research insights.',
      image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1200&q=85',
    },
    caseStudy: {
      label: 'Case Study',
      title: 'Welfare Research Collaboration',
      body: "A university researcher specialising in animal welfare science partnered with a UKACT member college on a term-long behavioural monitoring study. The result was a practical welfare-assessment protocol now used across several member colleges — and a paper co-authored with the college's animal unit manager.",
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1200&q=85',
      stat: '5',
      statLabel: 'Colleges now using the research-derived protocol',
      quote: 'Working alongside technicians daily gave my research a practical grounding a university setting alone could never provide.',
      quoteAuthor: 'Animal Welfare Researcher',
    },
    sectorTag: 'Research',
    partners: [
      { name: 'BIAZA' },
      { name: 'ABMA' },
      { name: 'IRKA' },
      { name: 'Small Zoo Network' },
    ],
    testimonials: [
      { quote: 'UKACT gave me the bridge between academic theory and real-world animal care practice that I had been searching for throughout my research.', name: 'Dr. Rachel Moore', role: 'Animal Welfare Researcher', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
      { quote: 'Co-authoring a paper with a college animal unit manager was one of the most rewarding experiences of my academic career. UKACT made it possible.', name: 'Prof. Daniel Wright', role: 'Senior Lecturer, Animal Science', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { quote: 'The data I collected through a UKACT partnership formed the core of my dissertation. The access was invaluable and the team were exceptional.', name: 'Niamh Casey', role: 'MSc Animal Welfare', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
    ],
    cta: {
      headline: 'Where research meets real-world impact',
      body: 'Join UKACT Researchers and access animal collections, field data and collaborative opportunities that will take your science further.',
      href: '/register/candidate',
      label: 'Join UKACT',
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
