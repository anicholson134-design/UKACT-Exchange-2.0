import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { BlockRenderer } from '@/components/cms/BlockRenderer'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const admin = createAdminClient()
  const { data } = await admin
    .from('cms_pages')
    .select('title, meta_description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return {
    title: data?.title,
    description: data?.meta_description ?? undefined,
  }
}

export default async function CmsPublicPage({ params }: Props) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: page } = await admin
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!page) notFound()

  const supabase = await createClient()
  const settings = await getSiteSettings()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} logoUrl={settings['branding.logo_url']} />
      <main className="flex-1">
        {/* Hero */}
        {(page.hero_title || page.hero_image) && (
          <section className="relative pt-32 pb-20 overflow-hidden bg-forest">
            {page.hero_image && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${page.hero_image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/40 to-forest/20" />
              </>
            )}
            <div className="relative z-10 container-keep">
              <h1 className="display-lg text-cream mb-4 max-w-2xl">
                {page.hero_title ?? page.title}
              </h1>
              {page.hero_subtitle && (
                <p className="text-cream/70 text-xl max-w-xl leading-relaxed">{page.hero_subtitle}</p>
              )}
            </div>
          </section>
        )}

        {/* No hero — just title */}
        {!page.hero_title && !page.hero_image && (
          <section className="pt-32 pb-12 bg-mist border-b border-stone/20">
            <div className="container-keep">
              <h1 className="display-md text-forest">{page.title}</h1>
            </div>
          </section>
        )}

        {/* Content blocks */}
        {page.content && (page.content as any[]).length > 0 && (
          <section className="section-padding bg-cream">
            <div className="container-keep max-w-4xl">
              <BlockRenderer blocks={page.content as any} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
