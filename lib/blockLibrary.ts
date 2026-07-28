import {
  Image as ImageIcon, Sparkles, BarChart3, ListOrdered, Briefcase,
  MessageSquare, Users, HelpCircle, type LucideIcon,
} from 'lucide-react'
import {
  parseSetting, DEFAULT_STATS, DEFAULT_HOWITWORKS_STEPS, DEFAULT_TESTIMONIALS,
  DEFAULT_HOME_PARTNERS, DEFAULT_KEEPER_BENEFITS, DEFAULT_COLLECTION_BENEFITS,
  DEFAULT_JOINING_STEPS, DEFAULT_FAQS,
} from '@/lib/getSiteSettings'

export interface BlockTypeDef {
  type: string
  label: string
  desc: string
  icon: LucideIcon
}

/** Every section available across the whole site, addable to any page. */
export const BLOCK_CATALOG: BlockTypeDef[] = [
  { type: 'home_hero', label: 'Hero (Home)', desc: 'Full-screen video/image intro', icon: ImageIcon },
  { type: 'mission', label: 'Mission', desc: 'Pull quote + body copy', icon: Sparkles },
  { type: 'stats', label: 'Stats Bar', desc: 'Row of key numbers', icon: BarChart3 },
  { type: 'how_it_works', label: 'How UKACT Works', desc: 'Numbered process steps', icon: ListOrdered },
  { type: 'featured_listings', label: 'Featured Listings', desc: 'Latest active placements (live data)', icon: Briefcase },
  { type: 'testimonials', label: 'Testimonials', desc: 'Member quote carousel', icon: MessageSquare },
  { type: 'partners', label: 'Partners Marquee', desc: 'Scrolling partner name strip', icon: Users },
  { type: 'joining_hero', label: 'Hero (Join UKACT)', desc: 'Page hero with title, subtitle, image', icon: ImageIcon },
  { type: 'benefits', label: "Who It's For", desc: 'Staff & institution benefit cards', icon: Users },
  { type: 'joining_steps', label: 'Process Steps', desc: 'Numbered how-to-join steps', icon: ListOrdered },
  { type: 'faqs', label: 'FAQs', desc: 'Expandable question list', icon: HelpCircle },
  { type: 'contact_hero', label: 'Hero (Contact)', desc: 'Dark hero with heading & body', icon: ImageIcon },
  { type: 'contact_details_form', label: 'Contact Details & Form', desc: 'Contact info and enquiry form', icon: MessageSquare },
]

/** Maps a page's legacy pre-library block type ("hero") to its namespaced library type. */
export function migrateLegacyBlockType(type: string, page: 'home' | 'joining' | 'contact'): string {
  if (type !== 'hero') return type
  return { home: 'home_hero', joining: 'joining_hero', contact: 'contact_hero' }[page]
}

// Index signatures let these plug directly into the generic ObjectArrayField/StringArrayField admin controls.
export interface StatItem { value: string; suffix: string; label: string; desc: string; [key: string]: string }
export interface StepItem { title: string; desc: string; [key: string]: string }
export interface TestimonialItem { quote: string; name: string; role: string; collection: string; avatar: string; [key: string]: string }
export interface PartnerItem { name: string; [key: string]: string }
export interface FaqItem { q: string; a: string; [key: string]: string }

export interface BlockData {
  home_hero_eyebrow: string; home_hero_headline: string; home_hero_subtitle: string; home_hero_bg_image: string
  mission_quote: string; mission_body_1: string; mission_body_2: string; mission_image: string
  mission_stat_number: string; mission_stat_label: string
  stats: StatItem[]
  howitworks_eyebrow: string; howitworks_heading: string; howitworks_steps: StepItem[]
  testimonials_eyebrow: string; testimonials_heading: string; testimonials: TestimonialItem[]
  partners_eyebrow: string; partners_heading: string; partners: PartnerItem[]
  joining_hero_title: string; joining_hero_subtitle: string; joining_hero_image: string
  keeper_benefits: string[]; collection_benefits: string[]
  joining_steps: StepItem[]
  faqs: FaqItem[]
  contact_hero_heading: string; contact_hero_body: string
  contact_email: string; contact_location: string; contact_response_time: string
}

/** Parses the flat site_settings map into the unified shape every block editor/renderer works with. */
export function getBlockData(s: Record<string, string>): BlockData {
  return {
    home_hero_eyebrow: s['home.hero_eyebrow'], home_hero_headline: s['home.hero_headline'],
    home_hero_subtitle: s['home.hero_subtitle'], home_hero_bg_image: s['home.hero_bg_image'],
    mission_quote: s['home.mission_quote'], mission_body_1: s['home.mission_body_1'],
    mission_body_2: s['home.mission_body_2'], mission_image: s['home.mission_image'],
    mission_stat_number: s['home.mission_stat_number'], mission_stat_label: s['home.mission_stat_label'],
    stats: parseSetting(s['home.stats'], DEFAULT_STATS).map(st => ({
      value: String(st.value), suffix: st.suffix, label: st.label, desc: st.desc,
    })),
    howitworks_eyebrow: s['home.howitworks_eyebrow'], howitworks_heading: s['home.howitworks_heading'],
    howitworks_steps: parseSetting(s['home.howitworks_steps'], DEFAULT_HOWITWORKS_STEPS),
    testimonials_eyebrow: s['home.testimonials_eyebrow'], testimonials_heading: s['home.testimonials_heading'],
    testimonials: parseSetting(s['home.testimonials'], DEFAULT_TESTIMONIALS),
    partners_eyebrow: s['home.partners_eyebrow'], partners_heading: s['home.partners_heading'],
    partners: parseSetting(s['home.partners'], DEFAULT_HOME_PARTNERS),
    joining_hero_title: s['joining.hero_title'], joining_hero_subtitle: s['joining.hero_subtitle'],
    joining_hero_image: s['joining.hero_image'],
    keeper_benefits: parseSetting(s['joining.keeper_benefits'], DEFAULT_KEEPER_BENEFITS),
    collection_benefits: parseSetting(s['joining.collection_benefits'], DEFAULT_COLLECTION_BENEFITS),
    joining_steps: parseSetting(s['joining.steps'], DEFAULT_JOINING_STEPS),
    faqs: parseSetting(s['joining.faqs'], DEFAULT_FAQS),
    contact_hero_heading: s['contact.hero_heading'], contact_hero_body: s['contact.hero_body'],
    contact_email: s['contact.email'], contact_location: s['contact.location'],
    contact_response_time: s['contact.response_time'],
  }
}

/** Inverse of getBlockData — flattens edited block content back into site_settings keys for saving. */
export function blockDataToSettings(d: BlockData): Record<string, string> {
  return {
    'home.hero_eyebrow': d.home_hero_eyebrow, 'home.hero_headline': d.home_hero_headline,
    'home.hero_subtitle': d.home_hero_subtitle, 'home.hero_bg_image': d.home_hero_bg_image,
    'home.mission_quote': d.mission_quote, 'home.mission_body_1': d.mission_body_1,
    'home.mission_body_2': d.mission_body_2, 'home.mission_image': d.mission_image,
    'home.mission_stat_number': d.mission_stat_number, 'home.mission_stat_label': d.mission_stat_label,
    'home.stats': JSON.stringify(d.stats),
    'home.howitworks_eyebrow': d.howitworks_eyebrow, 'home.howitworks_heading': d.howitworks_heading,
    'home.howitworks_steps': JSON.stringify(d.howitworks_steps),
    'home.testimonials_eyebrow': d.testimonials_eyebrow, 'home.testimonials_heading': d.testimonials_heading,
    'home.testimonials': JSON.stringify(d.testimonials),
    'home.partners_eyebrow': d.partners_eyebrow, 'home.partners_heading': d.partners_heading,
    'home.partners': JSON.stringify(d.partners),
    'joining.hero_title': d.joining_hero_title, 'joining.hero_subtitle': d.joining_hero_subtitle,
    'joining.hero_image': d.joining_hero_image,
    'joining.keeper_benefits': JSON.stringify(d.keeper_benefits),
    'joining.collection_benefits': JSON.stringify(d.collection_benefits),
    'joining.steps': JSON.stringify(d.joining_steps),
    'joining.faqs': JSON.stringify(d.faqs),
    'contact.hero_heading': d.contact_hero_heading, 'contact.hero_body': d.contact_hero_body,
    'contact.email': d.contact_email, 'contact.location': d.contact_location,
    'contact.response_time': d.contact_response_time,
  }
}
