import { createAdminClient } from '@/lib/supabase/admin'

export function parseSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

// ─── Default data ────────────────────────────────────────────────────────────

export const DEFAULT_STATS = [
  { value: 50, suffix: '+', label: 'Keepers Placed', desc: 'Professional exchanges completed' },
  { value: 26, suffix: '+', label: 'Collections', desc: 'Partner zoos and aquariums' },
  { value: 9, suffix: '', label: 'Countries', desc: 'Global reach and growing' },
  { value: 4, suffix: 'yrs', label: 'Established', desc: 'Pioneering keeper development' },
]

export const DEFAULT_HOWITWORKS_STEPS = [
  { title: 'Register', desc: 'Create your KEEP profile as a keeper or a collection. Tell us about your species expertise and what you want to learn.' },
  { title: 'Get Matched', desc: 'Browse available placements or post an opportunity. Our team helps facilitate the right connections.' },
  { title: 'Exchange', desc: 'Complete your placement at a partner collection. Immerse yourself in new species, techniques and perspectives.' },
  { title: 'Grow', desc: "Return with new skills, a broader network and a deeper commitment to conservation. Share what you've learned." },
]

export const DEFAULT_TESTIMONIALS = [
  { quote: "My KEEP exchange at Twycross Zoo completely transformed how I approach primate enrichment. I came back to my home collection with techniques I'd never have discovered otherwise.", name: 'Sarah Mitchell', role: 'Senior Keeper', collection: 'Chester Zoo', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80' },
  { quote: "As a collection, hosting KEEP exchanges has been one of the best decisions we've made. The fresh perspectives our visitors bring energise the whole team and improve our practices.", name: 'James Hartley', role: 'Head of Animals', collection: 'Longleat Safari Park', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80' },
  { quote: "I spent three weeks with the marine mammal team at a partner collection. Those three weeks were worth more to my career than any training course I'd ever attended.", name: 'Emma Clarke', role: 'Marine Mammal Keeper', collection: 'SeaLife Brighton', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
]

export const DEFAULT_HOME_PARTNERS = [
  'Chester Zoo','Longleat Safari Park','SeaLife Brighton','Twycross Zoo',
  'Colchester Zoo','Whipsnade Zoo','Edinburgh Zoo','Bristol Zoo','Paignton Zoo','Flamingo Land',
].map(name => ({ name }))

export const DEFAULT_ABOUT_TIMELINE = [
  { year: '2014', title: 'KEEP Founded', desc: 'The Keeper Exchange and Education Programme is established in Cambridge, pioneering the first formal keeper exchange scheme in the UK.' },
  { year: '2016', title: 'First 100 Keepers', desc: 'KEEP reaches a milestone of 100 registered keepers, demonstrating the appetite for professional exchange across UK collections.' },
  { year: '2018', title: 'International Expansion', desc: 'KEEP facilitates its first international exchanges, connecting UK keepers with collections in Europe and beyond.' },
  { year: '2020', title: 'Digital Platform Launch', desc: 'A new digital infrastructure allows KEEP to scale its matching and placement process, streamlining the experience for keepers and collections.' },
  { year: '2024', title: 'Global Network', desc: 'KEEP now spans 24 countries, with 1,200+ keepers placed and 80+ partner collections across the world.' },
]

export const DEFAULT_ABOUT_VALUES = [
  { emoji: '🌿', title: 'Conservation First', desc: 'Every decision is guided by what is best for wildlife and the planet.' },
  { emoji: '🤝', title: 'Community', desc: 'We are stronger together. KEEP thrives on shared knowledge and mutual support.' },
  { emoji: '📚', title: 'Lifelong Learning', desc: 'Growth never stops. We champion curiosity and continuous professional development.' },
  { emoji: '🌍', title: 'Global Impact', desc: 'Local action, worldwide reach. KEEP connects keepers across continents.' },
  { emoji: '✅', title: 'Integrity', desc: 'Honesty and trust underpin everything we do, from keeper matching to reporting outcomes.' },
  { emoji: '🔓', title: 'Access', desc: 'Professional development should be open to all keepers, regardless of institution size.' },
]

export const DEFAULT_ABOUT_STATS = [
  { number: '1,200+', label: 'Keepers Placed' },
  { number: '80+', label: 'Partner Collections' },
  { number: '24', label: 'Countries' },
  { number: '10yrs', label: 'Established' },
]

export const DEFAULT_TEAM_MEMBERS = [
  { name: 'Alice', role: 'Director', bio: 'Alice founded KEEP with a vision of creating a truly connected keeper community. With over 15 years in zoological management, she leads the strategic direction of the programme.', image_url: '/KEEP-Alice-2-768x1032.avif' },
  { name: 'Dan', role: 'Treasurer & CTO', bio: 'Dan oversees KEEP\'s financial stewardship and digital infrastructure, ensuring the platform runs smoothly for keepers and collections alike.', image_url: '/KEEP-Dan-2-768x576.avif' },
  { name: 'James', role: 'Social Media Officer & CSO', bio: 'James manages KEEP\'s communications and social presence, telling the stories of keepers and the incredible work they do every day.', image_url: '/KEEP-James-1-768x768.avif' },
  { name: 'Kim', role: 'Merchandising Officer', bio: 'Kim coordinates KEEP\'s merchandise and supporter engagement, helping to raise funds that support the programme\'s growth.', image_url: '/KEEP-Kim-768x768.avif' },
]

export const DEFAULT_SPONSOR_TIERS = [
  { tier: 'Platinum', sponsors: [{ name: 'Chester Zoo Foundation' }, { name: 'ZSL – Zoological Society of London' }] },
  { tier: 'Gold', sponsors: [{ name: 'Wildfowl & Wetlands Trust' }, { name: 'British and Irish Association of Zoos and Aquariums' }, { name: 'Durrell Wildlife Conservation Trust' }] },
  { tier: 'Silver', sponsors: [{ name: 'Twycross Zoo' }, { name: 'Paradise Wildlife Park' }, { name: 'Colchester Zoo' }, { name: 'Flamingo Land' }] },
]

export const DEFAULT_PARTNERS_LIST = [
  { name: 'Chester Zoo', location: 'Chester, UK', specialisms: ['Primates', 'Large Mammals', 'Herpetology'] },
  { name: 'Longleat Safari Park', location: 'Wiltshire, UK', specialisms: ['Large Carnivores', 'Ungulates', 'Primates'] },
  { name: 'Twycross Zoo', location: 'Leicestershire, UK', specialisms: ['Primates', 'Giraffes', 'Penguins'] },
  { name: 'SeaLife Brighton', location: 'Brighton, UK', specialisms: ['Marine', 'Aquatics', 'Sharks'] },
  { name: 'Edinburgh Zoo', location: 'Edinburgh, UK', specialisms: ['Pandas', 'Penguins', 'Primates'] },
  { name: 'Whipsnade Zoo', location: 'Bedfordshire, UK', specialisms: ['Large Mammals', 'Birds', 'Ungulates'] },
  { name: 'Bristol Zoo Project', location: 'Bristol, UK', specialisms: ['Reptiles', 'Small Mammals', 'Invertebrates'] },
  { name: 'Colchester Zoo', location: 'Essex, UK', specialisms: ['Big Cats', 'Giraffes', 'Rhinos'] },
  { name: 'Flamingo Land', location: 'North Yorkshire, UK', specialisms: ['Primates', 'Carnivores', 'Birds'] },
  { name: 'Paignton Zoo', location: 'Devon, UK', specialisms: ['Primates', 'Reptiles', 'Ungulates'] },
  { name: 'Paradise Wildlife Park', location: 'Hertfordshire, UK', specialisms: ['Big Cats', 'Primates', 'Bears'] },
  { name: 'Durrell Wildlife Park', location: 'Jersey, UK', specialisms: ['Endangered Species', 'Amphibians', 'Lemurs'] },
]

export const DEFAULT_KEEPER_BENEFITS = [
  'Access to placements at 80+ partner collections',
  'Structured learning with experienced keepers',
  'Expand your species and husbandry expertise',
  'Build a genuine professional network',
  'Enhance your CV and career prospects',
  'Be part of a global conservation community',
]

export const DEFAULT_COLLECTION_BENEFITS = [
  'Host motivated keepers from across the UK',
  'Share your expertise and best practices',
  'Receive fresh perspectives and new ideas',
  'Strengthen inter-collection relationships',
  'Post placements to a vetted keeper audience',
  'Contribute to raising conservation standards',
]

export const DEFAULT_JOINING_STEPS = [
  { title: 'Register', desc: 'Create your profile as a keeper or collection. Takes less than 10 minutes.' },
  { title: 'Get Verified', desc: 'Our team reviews your application and verifies your eligibility.' },
  { title: 'Get Matched', desc: 'Browse and apply to placements, or post your own opportunities.' },
  { title: 'Exchange & Grow', desc: "Complete your placement, share what you've learned and build your network." },
]

export const DEFAULT_FAQS = [
  { q: 'Who can apply as a keeper?', a: 'Any professional keeper with at least one year of paid experience in a zoological collection is eligible to register with KEEP. We welcome keepers at all career stages.' },
  { q: 'How long do placements typically last?', a: 'Placements range from one week to three months, depending on the agreement between the keeper and the host collection. The average KEEP exchange lasts two to three weeks.' },
  { q: 'Is there a cost to join KEEP?', a: 'Registration is completely free for individual keepers. Collections pay an annual membership fee that helps sustain the programme and support KEEP\'s operational costs.' },
  { q: 'Are international placements available?', a: 'Yes. While KEEP started as a UK programme, we now facilitate exchanges across 24 countries. International placements are available to registered keepers and collections.' },
  { q: 'Can I apply if I\'m based outside the UK?', a: 'Currently full KEEP membership is open to UK-based keepers and collections, but we are actively expanding internationally. International partners can join our waiting list.' },
]

// ─── Flat DB defaults (all string values) ────────────────────────────────────

export const SETTING_DEFAULTS: Record<string, string> = {
  'branding.logo_url': '/keep-logo.webp',
  'branding.site_name': 'KEEP',

  'home.hero_eyebrow': "UK's First Zookeeper Exchange Programme",
  'home.hero_headline': 'Where Keepers Come to Grow.',
  'home.hero_subtitle': 'KEEP connects passionate keepers with world-class collections to develop skills, deepen expertise and strengthen conservation globally.',
  'home.hero_bg_image': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80',

  'home.mission_quote': '"KEEP exists to raise the standard of animal care worldwide — one keeper at a time."',
  'home.mission_body_1': "Since 2014, the Keeper Exchange and Education Programme has been facilitating professional development exchanges between UK zoological collections — giving keepers hands-on experience with species and husbandry techniques they'd never encounter at their home institution.",
  'home.mission_body_2': 'The result is a stronger, more connected conservation community — and animals that benefit from keepers who are constantly learning.',
  'home.mission_image': '/alicephoto-768x1032.jpg',
  'home.mission_stat_number': '10+',
  'home.mission_stat_label': 'Years connecting keepers',

  'home.stats': JSON.stringify(DEFAULT_STATS),
  'home.howitworks_eyebrow': 'The Process',
  'home.howitworks_heading': 'How KEEP Works',
  'home.howitworks_steps': JSON.stringify(DEFAULT_HOWITWORKS_STEPS),
  'home.testimonials_eyebrow': 'Keeper Stories',
  'home.testimonials_heading': 'Voices from the Field',
  'home.testimonials': JSON.stringify(DEFAULT_TESTIMONIALS),
  'home.partners_eyebrow': 'Our Network',
  'home.partners_heading': 'Trusted by Leading Collections',
  'home.partners': JSON.stringify(DEFAULT_HOME_PARTNERS),
  'home.donate_heading': 'Help us support the next generation of keepers',
  'home.donate_body': 'Every £5 donated helps KEEP facilitate more exchanges, develop more keepers, and ultimately improve the lives of animals in collections worldwide.',
  'home.donate_bg_image': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1600&q=80',

  'about.hero_title': 'Our Story',
  'about.hero_subtitle': 'A decade of connecting keepers, strengthening collections and advancing conservation worldwide.',
  'about.hero_image': 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1920&q=80',
  'about.intro_eyebrow': 'Who We Are',
  'about.intro_heading': "The UK's first official Zookeeper Exchange Programme",
  'about.intro_body_1': 'KEEP was founded in 2014 by a small group of keepers who believed that professional development in the zoo world was too siloed. By facilitating structured exchanges between collections, we have helped thousands of keepers grow beyond the boundaries of their home institution.',
  'about.intro_body_2': 'Today KEEP is the UK\'s leading keeper exchange programme, with a network spanning 24 countries and partnerships with more than 80 collections worldwide.',
  'about.timeline': JSON.stringify(DEFAULT_ABOUT_TIMELINE),
  'about.stats': JSON.stringify(DEFAULT_ABOUT_STATS),
  'about.values': JSON.stringify(DEFAULT_ABOUT_VALUES),

  'team.hero_title': 'Meet the Team',
  'team.hero_subtitle': 'Passionate people dedicated to advancing keeper development and conservation worldwide.',
  'team.hero_image': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
  'team.members': JSON.stringify(DEFAULT_TEAM_MEMBERS),
  'team.cta_heading': 'Want to get involved?',
  'team.cta_body': 'KEEP is always looking for passionate volunteers and ambassadors within the keeper community.',

  'sponsors.hero_title': 'Our Sponsors',
  'sponsors.hero_subtitle': 'KEEP would not be possible without the generous support of our sponsors and funding partners.',
  'sponsors.hero_image': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80',
  'sponsors.body': 'Our sponsors share our belief that investing in keeper development is one of the most effective ways to improve animal welfare and conservation outcomes globally.',
  'sponsors.tiers': JSON.stringify(DEFAULT_SPONSOR_TIERS),
  'sponsors.cta_heading': 'Become a Sponsor',
  'sponsors.cta_body': 'Sponsoring KEEP puts your organisation at the heart of the professional keeper community. Join us in building the next generation of world-class conservationists.',

  'partners.hero_title': 'Partner Collections',
  'partners.hero_subtitle': "KEEP's network spans leading zoos, aquariums and wildlife parks across the UK and beyond.",
  'partners.hero_image': 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=1920&q=80',
  'partners.list': JSON.stringify(DEFAULT_PARTNERS_LIST),
  'partners.cta_heading': 'Join the network',
  'partners.cta_body': 'Is your collection interested in hosting KEEP exchanges or sending keepers to partner collections?',

  'joining.hero_title': 'Become Part of the Network',
  'joining.hero_subtitle': "Whether you're a keeper ready to grow or a collection ready to share — KEEP is for you.",
  'joining.hero_image': 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1920&q=80',
  'joining.keeper_benefits': JSON.stringify(DEFAULT_KEEPER_BENEFITS),
  'joining.collection_benefits': JSON.stringify(DEFAULT_COLLECTION_BENEFITS),
  'joining.steps': JSON.stringify(DEFAULT_JOINING_STEPS),
  'joining.faqs': JSON.stringify(DEFAULT_FAQS),

  'contact.hero_heading': "We'd love to hear from you",
  'contact.hero_body': 'Whether you have a question about joining KEEP, hosting an exchange or supporting our work — our team is here to help.',
  'contact.email': 'info@keeperexchange.org',
  'contact.location': 'Cambridge, CB24, United Kingdom',
  'contact.response_time': 'Usually within 2–3 working days',

  'nav.items': JSON.stringify([
    { label: 'About', href: '/about', visible: true },
    { label: 'Sectors', href: '/sectors/conservation', visible: true },
    { label: 'Listings', href: '/listings', visible: true },
    { label: 'Joining KEEP', href: '/joining-keep', visible: true },
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
