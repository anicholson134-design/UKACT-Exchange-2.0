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
].map(name => ({ name }))

export const DEFAULT_ABOUT_TIMELINE = [
  { year: '2019', title: 'UKACT Founded', desc: 'What began as a Facebook group for staff caring for animals in education settings grows into a community for the emerging animal care technician sector.' },
  { year: '2021', title: 'First CPD Conference', desc: 'UKACT holds its first Continuing Professional Development conference at Halesowen College, bringing the community together in person for the first time.' },
  { year: '2022', title: '1,000 Members', desc: 'The community passes 1,000 members, demonstrating the appetite for shared best practice across UK animal care education.' },
  { year: '2023', title: 'Becomes a Professional Association', desc: 'A team of five Unit Managers sets out to develop the group into a formal, professional membership association: UK Animal Care Technicians.' },
  { year: '2025', title: 'National Network', desc: 'UKACT now connects staff across 120+ animal management colleges and 130+ farm schools nationwide, in partnership with BIAZA.' },
]

export const DEFAULT_ABOUT_VALUES = [
  { emoji: '🐾', title: 'Animal Welfare First', desc: 'Every decision is guided by what is best for the animals in our members’ care.' },
  { emoji: '🤝', title: 'Community', desc: 'We are stronger together. UKACT thrives on shared knowledge and mutual support between institutions.' },
  { emoji: '📚', title: 'Lifelong Learning', desc: 'Growth never stops. We champion curiosity and continuous professional development for every member of staff.' },
  { emoji: '🎓', title: 'Student Experience', desc: 'Better trained staff means a better learning experience for the students who go on to work in animal care.' },
  { emoji: '✅', title: 'Integrity', desc: 'Honesty and trust underpin everything we do, from husbandry advice to member support.' },
  { emoji: '🔓', title: 'Access', desc: 'Professional development should be open to every institution, whatever its size.' },
]

export const DEFAULT_ABOUT_STATS = [
  { number: '1,000+', label: 'Members' },
  { number: '120+', label: 'Animal Colleges' },
  { number: '130+', label: 'Farm Schools' },
  { number: '2019', label: 'Founded' },
]

export const DEFAULT_TEAM_MEMBERS = [
  { name: 'Alice', role: 'Chair', bio: 'Alice chairs UKACT’s council, setting the strategic direction for the association and representing UKACT across the wider animal care sector, including our partnership with BIAZA.', image_url: '/KEEP-Alice-2-768x1032.avif' },
  { name: 'Dan', role: 'Treasurer & CTO', bio: 'Dan oversees UKACT’s finances and digital infrastructure, keeping the membership platform running smoothly for staff and institutions across the network.', image_url: '/KEEP-Dan-2-768x576.avif' },
  { name: 'James', role: 'Communications Officer', bio: 'James manages UKACT’s communications, sharing the stories of the technicians and institutions doing brilliant work in animal care education every day.', image_url: '/KEEP-James-1-768x768.avif' },
  { name: 'Kim', role: 'Membership Officer', bio: 'Kim coordinates UKACT’s membership and events, including our annual CPD conference, helping members get the most out of the network.', image_url: '/KEEP-Kim-768x768.avif' },
]

export const DEFAULT_SPONSOR_TIERS = [
  { tier: 'Sponsors', sponsors: [{ name: 'Safe4' }, { name: 'Kiezebrink' }, { name: 'Waterhouse Speciality Feeds' }, { name: 'Hose2Habitat' }, { name: 'Zoo Fab' }, { name: 'Xanthos Digital' }] },
]

export const DEFAULT_PARTNERS_LIST = [
  { name: 'BIAZA', location: 'UK & Ireland', specialisms: ['Zoos & Aquariums', 'Accreditation', 'Advocacy'] },
  { name: 'The Animal Behavior Management Alliance', location: 'International', specialisms: ['Animal Training', 'Behaviour Management', 'Enrichment'] },
  { name: 'International Rhino Keeper Association', location: 'International', specialisms: ['Rhino Husbandry', 'Conservation', 'Global Network'] },
  { name: 'Small Zoo Network', location: 'UK', specialisms: ['Small Collections', 'Peer Support', 'Best Practice'] },
  { name: 'Birdworld', location: 'Farnham, UK', specialisms: ['Aviculture', 'Bird Husbandry', 'Education'] },
]

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
  'home.donate_heading': 'Help us support the next generation of animal care technicians',
  'home.donate_body': 'Every £5 donated helps UKACT run CPD events, develop resources, and ultimately improve animal welfare and student experience across the UK.',
  'home.donate_bg_image': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1600&q=80',

  'about.hero_title': 'Our Story',
  'about.hero_subtitle': 'From a Facebook group to a national network — connecting staff across UK animal care education.',
  'about.hero_image': 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1920&q=80',
  'about.intro_eyebrow': 'Who We Are',
  'about.intro_heading': "The UK's professional network for animal care technicians",
  'about.intro_body_1': 'UKACT started life in 2019 as a Facebook group, created to help staff caring for animals in education settings connect and share knowledge. By 2023, a team of five Unit Managers set out to develop that community into a formal, professional membership association.',
  'about.intro_body_2': 'Today UKACT connects over 1,000 members across 120+ animal management colleges and 130+ farm schools, working in partnership with BIAZA to raise husbandry standards, share best practice and improve student experience nationwide.',
  'about.timeline': JSON.stringify(DEFAULT_ABOUT_TIMELINE),
  'about.stats': JSON.stringify(DEFAULT_ABOUT_STATS),
  'about.values': JSON.stringify(DEFAULT_ABOUT_VALUES),

  'team.hero_title': 'Meet the Team',
  'team.hero_subtitle': 'The volunteers behind UKACT, dedicated to raising standards across animal care education.',
  'team.hero_image': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  'team.members': JSON.stringify(DEFAULT_TEAM_MEMBERS),
  'team.cta_heading': 'Want to get involved?',
  'team.cta_body': 'UKACT is run by volunteers and is always looking for passionate Unit Managers and ambassadors within the animal care education community.',

  'sponsors.hero_title': 'Our Sponsors',
  'sponsors.hero_subtitle': 'UKACT would not be possible without the generous support of our sponsors and funding partners.',
  'sponsors.hero_image': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  'sponsors.body': 'Our sponsors share our belief that investing in staff development is one of the most effective ways to improve animal welfare and student experience across the sector.',
  'sponsors.tiers': JSON.stringify(DEFAULT_SPONSOR_TIERS),
  'sponsors.cta_heading': 'Become a Sponsor',
  'sponsors.cta_body': 'Sponsoring UKACT puts your organisation at the heart of the animal care education community. Join us in supporting the next generation of animal care professionals.',

  'partners.hero_title': 'Partner Organisations',
  'partners.hero_subtitle': "UKACT works alongside leading professional bodies and associations across the animal care sector.",
  'partners.hero_image': 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1920&q=80',
  'partners.list': JSON.stringify(DEFAULT_PARTNERS_LIST),
  'partners.cta_heading': 'Join the network',
  'partners.cta_body': 'Is your organisation interested in partnering with UKACT to support animal care education across the UK?',

  'joining.hero_title': 'Become Part of the Network',
  'joining.hero_subtitle': "Whether you're a member of staff ready to grow or an institution ready to share — UKACT is for you.",
  'joining.hero_image': 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1920&q=80',
  'joining.keeper_benefits': JSON.stringify(DEFAULT_KEEPER_BENEFITS),
  'joining.collection_benefits': JSON.stringify(DEFAULT_COLLECTION_BENEFITS),
  'joining.steps': JSON.stringify(DEFAULT_JOINING_STEPS),
  'joining.faqs': JSON.stringify(DEFAULT_FAQS),

  'contact.hero_heading': "We'd love to hear from you",
  'contact.hero_body': 'Whether you have a question about joining UKACT, hosting a CPD event or supporting our work — our team is here to help.',
  'contact.email': 'info@ukact.keeperexchange.org',
  'contact.location': 'United Kingdom',
  'contact.response_time': 'Usually within 2–3 working days',

  'nav.items': JSON.stringify([
    { label: 'About', href: '/about', visible: true },
    { label: 'Sectors', href: '/sectors/conservation', visible: true },
    { label: 'Listings', href: '/listings', visible: true },
    { label: 'Join UKACT', href: '/joining-ukact', visible: true },
    { label: 'Contact', href: '/contact', visible: true },
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
