import { getSiteSettings } from '@/lib/getSiteSettings'
import { BrandingForm } from './BrandingForm'

export default async function BrandingPage() {
  const s = await getSiteSettings()
  return <BrandingForm initial={{ logo_url: s['branding.logo_url'], site_name: s['branding.site_name'] }} />
}
