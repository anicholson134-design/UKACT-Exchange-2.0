import { getSiteSettings } from '@/lib/getSiteSettings'
import { AuthPanelForm } from './AuthPanelForm'

export default async function AuthSettingsPage() {
  const s = await getSiteSettings()
  return (
    <AuthPanelForm
      initial={{
        login_image: s['auth.login_image'],
        login_quote: s['auth.login_quote'],
        login_quote_author: s['auth.login_quote_author'],
        candidate_image: s['auth.candidate_image'],
        candidate_quote: s['auth.candidate_quote'],
        candidate_quote_author: s['auth.candidate_quote_author'],
        employer_image: s['auth.employer_image'],
        employer_quote: s['auth.employer_quote'],
        employer_quote_author: s['auth.employer_quote_author'],
      }}
    />
  )
}
