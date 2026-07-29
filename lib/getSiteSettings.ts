import { createAdminClient } from '@/lib/supabase/admin'

export function parseSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

// ─── Default data ────────────────────────────────────────────────────────────

export const DEFAULT_STATS = [
  { value: 1000, suffix: '+', label: 'Members', desc: 'Animal care staff across the UK' },
  { value: 120, suffix: '+', label: 'Colleges', desc: 'Animal management colleges connected' },
  { value: 130, suffix: '+', label: 'Farm Schools', desc: 'Further education farm schools connected' },
  { value: 6, suffix: 'yrs', label: 'Established', desc: 'Raising husbandry standards since 2019' },
]

export const DEFAULT_HOWITWORKS_STEPS = [
  { title: 'Register', desc: 'Create your UKACT profile as a member of staff or an institution. Tell us about your setting and what you want to share or learn.' },
  { title: 'Get Connected', desc: 'Browse CPD opportunities, placements and resources, or post an opportunity for others in the network.' },
  { title: 'Exchange', desc: 'Take part in a placement, workshop or resource exchange with another animal care setting.' },
  { title: 'Grow', desc: "Return with new skills, a wider network and a deeper commitment to animal welfare. Share what you've learned." },
]

export const DEFAULT_TESTIMONIALS = [
  { quote: "Being part of UKACT connected me with technicians facing exactly the same challenges as me. The knowledge-sharing has completely changed how our department runs.", name: 'Sarah Mitchell', role: 'Animal Unit Manager', collection: 'Further Education College', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' },
  { quote: "As a small farm school, joining UKACT gave our team a support network we never had before. Sharing best practice with other institutions has raised our standards across the board.", name: 'James Hartley', role: 'Head of Animal Care', collection: 'Agricultural Farm School', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80' },
  { quote: "The CPD conference alone was worth joining for. I came back with new husbandry techniques and a network of contacts I still use today.", name: 'Emma Clarke', role: 'Animal Care Technician', collection: 'Animal Management College', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
]

export const DEFAULT_HOME_PARTNERS = [
  'BIAZA', 'ABMA', 'IRKA', 'Small Zoo Network', 'Safe4',
  'Kiezebrink', 'Waterhouse Speciality Feeds', 'Hose2Habitat', 'Zoo Fab', 'Birdworld',
].map(name => ({ name, logo: '' }))

export const DEFAULT_KEEPER_BENEFITS = [
  'Access to CPD conferences, workshops and training opportunities',
  'Structured knowledge-sharing with technicians at other institutions',
  'Expand your husbandry and welfare expertise across species',
  'Build a genuine professional network across the UK',
  'Enhance your CV and career prospects in animal care',
  'Be part of a growing national community raising welfare standards',
]

export const DEFAULT_COLLECTION_BENEFITS = [
  'Connect your team with 1,000+ animal care staff nationwide',
  'Share your expertise and best practice with the wider sector',
  'Receive fresh perspectives and new husbandry techniques',
  'Strengthen relationships with other colleges and farm schools',
  'Access discounted CPD, resources and partner benefits (incl. BIAZA)',
  'Contribute to raising animal welfare and student experience standards',
]

export const DEFAULT_JOINING_STEPS = [
  { title: 'Register', desc: 'Create your profile as a member of staff or an institution. Takes less than 10 minutes.' },
  { title: 'Get Verified', desc: 'Our team confirms your role at an animal-based education setting.' },
  { title: 'Get Connected', desc: 'Browse CPD, placements and resources, or post your own opportunity.' },
  { title: 'Exchange & Grow', desc: "Take part, share what you've learned and build your network." },
]

export const DEFAULT_FAQS = [
  { q: 'Who can join UKACT?', a: 'Any member of staff working with animals in a UK education setting — animal management colleges, farm schools and agricultural colleges — is welcome to join. We support technicians at every career stage.' },
  { q: 'Is there a cost to join?', a: 'Individual membership is free. Institutions can also become members to support the wider network and access additional benefits.' },
  { q: 'What does membership include?', a: 'Access to our annual CPD conference, a national network of animal care technicians, shared resources and best practice, and partner benefits including discounted access to BIAZA workshops and resources.' },
  { q: 'Do I need to work at a zoo to join?', a: 'No. UKACT was built for staff working with animal collections in education settings — including further education colleges, land-based colleges and farm schools — not solely zoos and aquariums.' },
  { q: 'How did UKACT start?', a: 'UKACT began life as a Facebook group in 2019, created to help staff caring for animals in education settings connect and share knowledge. In 2023, a team of five Unit Managers formalised it into a professional membership association.' },
]

export const DEFAULT_HOME_BLOCKS = ['hero', 'mission', 'stats', 'how_it_works', 'featured_listings', 'testimonials', 'partners']
export const DEFAULT_JOINING_BLOCKS = ['hero', 'benefits', 'steps', 'faqs']
export const DEFAULT_CONTACT_BLOCKS = ['hero', 'details_form']

// ─── Flat DB defaults (all string values) ────────────────────────────────────

export const SETTING_DEFAULTS: Record<string, string> = {
  'branding.logo_url': '/UKACT-1536x730.jpg',
  'branding.site_name': 'UKACT Exchange',

  'home.hero_eyebrow': "The National Network for Animal Care Education",
  'home.hero_headline': 'Where Animal Care Careers Begin.',
  'home.hero_subtitle': 'UKACT connects staff across animal management colleges and farm schools to share best practice, raise husbandry standards and grow careers in animal care.',
  'home.hero_bg_image': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80',

  'home.mission_quote': '"UKACT exists to connect staff across animal care education — sharing knowledge to raise welfare standards, one institution at a time."',
  'home.mission_body_1': "What began as a Facebook group in 2019 has grown into the UK's leading network for animal care technicians — connecting staff across animal management colleges and farm schools who care for animal collections in education settings.",
  'home.mission_body_2': 'The result is a stronger, better-connected sector — and students and animals who benefit from staff who are constantly learning.',
  'home.mission_image': '/alicephoto-768x1032.jpg',
  'home.mission_stat_number': '1,000+',
  'home.mission_stat_label': 'Members across the UK',

  'home.stats': JSON.stringify(DEFAULT_STATS),
  'home.howitworks_eyebrow': 'The Process',
  'home.howitworks_heading': 'How UKACT Works',
  'home.howitworks_steps': JSON.stringify(DEFAULT_HOWITWORKS_STEPS),
  'home.testimonials_eyebrow': 'Member Stories',
  'home.testimonials_heading': 'Voices from the Sector',
  'home.testimonials': JSON.stringify(DEFAULT_TESTIMONIALS),
  'home.partners_eyebrow': 'Our Network',
  'home.partners_heading': 'Trusted by Leading Organisations',
  'home.partners': JSON.stringify(DEFAULT_HOME_PARTNERS),
  'home.blocks': JSON.stringify(DEFAULT_HOME_BLOCKS),

  'joining.hero_title': 'Become Part of the Network',
  'joining.hero_subtitle': "Whether you're a member of staff ready to grow or an institution ready to share — UKACT is for you.",
  'joining.hero_image': 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1920&q=80',
  'joining.keeper_benefits': JSON.stringify(DEFAULT_KEEPER_BENEFITS),
  'joining.collection_benefits': JSON.stringify(DEFAULT_COLLECTION_BENEFITS),
  'joining.steps': JSON.stringify(DEFAULT_JOINING_STEPS),
  'joining.faqs': JSON.stringify(DEFAULT_FAQS),
  'joining.blocks': JSON.stringify(DEFAULT_JOINING_BLOCKS),

  'contact.hero_heading': "We'd love to hear from you",
  'contact.hero_body': 'Whether you have a question about joining UKACT, hosting a CPD event or supporting our work — our team is here to help.',
  'contact.email': 'info@ukact.keeperexchange.org',
  'contact.location': 'United Kingdom',
  'contact.response_time': 'Usually within 2–3 working days',
  'contact.blocks': JSON.stringify(DEFAULT_CONTACT_BLOCKS),

  'auth.login_image': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&q=85',
  'auth.login_quote': 'Every exchange is a lesson that stays with you for the rest of your career.',
  'auth.login_quote_author': 'Sarah Mitchell, Animal Unit Manager, Further Education College',

  'auth.candidate_image': 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1200&q=85',
  'auth.candidate_quote': 'Joining UKACT was the single best thing I did for my career in animal care.',
  'auth.candidate_quote_author': 'James Hartley, Head of Animal Care, Agricultural College',

  'auth.employer_image': 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1200&q=85',
  'auth.employer_quote': 'Hosting UKACT exchanges has energised our entire team. The fresh perspectives are invaluable.',
  'auth.employer_quote_author': 'Head of Animal Care, Partner Institution',

  'nav.items': JSON.stringify([
    { label: 'Listings', href: '/listings', visible: true },
    { label: 'Join UKACT', href: '/joining-ukact', visible: true },
    { label: 'Contact', href: 'https://www.ukact.org/contact-8', visible: true },
  ]),
  'nav.custom': JSON.stringify([]),
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('site_settings').select('key, value')
    const merged: Record<string, string> = { ...SETTING_DEFAULTS }
    for (const row of data ?? []) {
      merged[row.key] = row.value
    }
    return merged
  } catch {
    return { ...SETTING_DEFAULTS }
  }
}
