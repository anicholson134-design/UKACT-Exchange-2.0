import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.RESEND_FROM_EMAIL || 'UKACT Exchange <notifications@ukact.keeperexchange.org>'
export const ADMIN_EMAIL = 'info@keeperexchange.org'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ukact.keeperexchange.org'

/**
 * Sends via Resend when RESEND_API_KEY is configured; otherwise logs and no-ops.
 * Never throws — a notification failure should never break the request that triggered it.
 */
export async function sendEmail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${Array.isArray(to) ? to.join(', ') : to}`)
    return
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('[email] send failed:', err)
  }
}

function layout(title: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#EAF4F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#EAF4F8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E0E9EC;">
            <tr>
              <td style="background:#0B3B54;padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.02em;">UKACT Exchange</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;color:#0B3B54;font-size:20px;font-weight:600;">${title}</h1>
                <div style="color:#334;font-size:14px;line-height:1.6;">${bodyHtml}</div>
                ${ctaLabel && ctaUrl ? `
                <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:10px;background:#0C7FA6;">
                      <a href="${ctaUrl}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${ctaLabel}</a>
                    </td>
                  </tr>
                </table>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background:#F7FBFD;border-top:1px solid #E0E9EC;">
                <span style="color:#8899a0;font-size:12px;">UKACT Exchange — UK Animal Care Technicians</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

// ── 1. New signup awaiting approval (to admin) ─────────────────────────────
export function newSignupAdminEmail(opts: {
  role: 'candidate' | 'employer'
  name: string
  email: string
  companyName?: string
  reviewUrl: string
}) {
  const entity = opts.role === 'employer' ? 'collection' : 'member'
  const subject = `New ${entity} awaiting approval: ${opts.role === 'employer' ? opts.companyName : opts.name}`
  const html = layout(
    `New ${entity} awaiting approval`,
    `
      <p style="margin:0 0 12px;">A new ${entity} account has just registered on UKACT Exchange and needs review before they can use the site.</p>
      <p style="margin:0;"><strong>Name:</strong> ${opts.name}<br/>
      ${opts.companyName ? `<strong>Collection:</strong> ${opts.companyName}<br/>` : ''}
      <strong>Email:</strong> ${opts.email}</p>
    `,
    'Review & approve',
    opts.reviewUrl,
  )
  return { subject, html }
}

// ── 2. Admin decision on a signup (to the applicant) ───────────────────────
export function accountDecisionEmail(opts: {
  approved: boolean
  role: 'candidate' | 'employer'
  name: string
  rejectionReason?: string
}) {
  const entity = opts.role === 'employer' ? 'collection' : 'member'
  const subject = opts.approved ? 'Your UKACT Exchange account has been approved' : 'Your UKACT Exchange application'
  const html = layout(
    opts.approved ? "You're approved!" : 'Update on your application',
    opts.approved
      ? `<p style="margin:0;">Hi ${opts.name}, good news — your ${entity} account has been approved. You can now sign in and get started.</p>`
      : `<p style="margin:0 0 12px;">Hi ${opts.name}, thanks for applying to join UKACT Exchange. Unfortunately we're not able to approve your ${entity} account at this time.</p>
         ${opts.rejectionReason ? `<p style="margin:0;"><strong>Reason:</strong> ${opts.rejectionReason}</p>` : ''}`,
    opts.approved ? 'Log in' : undefined,
    opts.approved ? `${SITE_URL}/login` : undefined,
  )
  return { subject, html }
}

// ── 3. New job posted (to admin) ───────────────────────────────────────────
export function newJobAdminEmail(opts: { title: string; companyName: string; description: string; reviewUrl: string }) {
  const snippet = opts.description.length > 240 ? opts.description.slice(0, 240) + '…' : opts.description
  const subject = `New placement for review: ${opts.title}`
  const html = layout(
    'New placement awaiting review',
    `
      <p style="margin:0 0 12px;"><strong>${opts.title}</strong> — posted by ${opts.companyName}</p>
      <p style="margin:0;color:#556;">${snippet}</p>
    `,
    'Review & approve',
    opts.reviewUrl,
  )
  return { subject, html }
}

// ── 4. Job approved/rejected (to the collection) ───────────────────────────
export function jobDecisionEmail(opts: { approved: boolean; title: string; liveUrl?: string }) {
  const subject = opts.approved ? `Your placement is now live: ${opts.title}` : `Your placement was not approved: ${opts.title}`
  const html = layout(
    opts.approved ? 'Placement approved' : 'Placement not approved',
    opts.approved
      ? `<p style="margin:0;">Great news — <strong>${opts.title}</strong> has been approved and is now live on UKACT Exchange.</p>`
      : `<p style="margin:0;">Your placement <strong>${opts.title}</strong> was not approved for publication. You can edit and resubmit it from your dashboard.</p>`,
    opts.approved ? 'View live listing' : 'Edit listing',
    opts.approved ? opts.liveUrl : `${SITE_URL}/employer/jobs`,
  )
  return { subject, html }
}

// ── 5. New application (to the collection) ─────────────────────────────────
export function newApplicationEmail(opts: { jobTitle: string; candidateName: string; reviewUrl: string }) {
  const subject = `New application for ${opts.jobTitle}`
  const html = layout(
    'New application received',
    `<p style="margin:0;"><strong>${opts.candidateName}</strong> has applied for <strong>${opts.jobTitle}</strong>.</p>`,
    'Review application',
    opts.reviewUrl,
  )
  return { subject, html }
}

// ── 6. Application status change (to the candidate) ────────────────────────
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted',
  reviewing: 'Under review',
  shortlisted: 'Shortlisted',
  rejected: 'Not successful',
  hired: 'Accepted',
}

export function applicationStatusEmail(opts: { jobTitle: string; companyName: string; status: string }) {
  const label = STATUS_LABEL[opts.status] ?? opts.status
  const subject = `Update on your application: ${opts.jobTitle}`
  const html = layout(
    'Your application status has changed',
    `<p style="margin:0;">Your application for <strong>${opts.jobTitle}</strong> at ${opts.companyName} is now: <strong>${label}</strong>.</p>`,
    'View your applications',
    `${SITE_URL}/candidate/applications`,
  )
  return { subject, html }
}

// ── 7. New message on an application (to the other participant) ───────────
export function newMessageEmail(opts: { senderName: string; jobTitle: string; preview: string; threadUrl: string }) {
  const snippet = opts.preview.length > 200 ? opts.preview.slice(0, 200) + '…' : opts.preview
  const subject = `New message from ${opts.senderName}: ${opts.jobTitle}`
  const html = layout(
    'New message',
    `
      <p style="margin:0 0 12px;"><strong>${opts.senderName}</strong> sent you a message about <strong>${opts.jobTitle}</strong>:</p>
      <p style="margin:0;padding:12px 16px;background:#F7FBFD;border-radius:10px;color:#556;font-style:italic;">"${snippet}"</p>
    `,
    'Reply',
    opts.threadUrl,
  )
  return { subject, html }
}
