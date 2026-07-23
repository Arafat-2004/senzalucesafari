import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { AdminPageHeader } from '../components'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react'

const categories = [
  { title:'Core Operations', purpose:'The daily workspace for serving travellers and progressing requests.', pages:[
    ['Dashboard','/admin','Start here. Review booking, customer, inquiry, review, and activity summaries. Retry only refreshes dashboard data; it never creates or changes records.'],
    ['Customers','/admin/customers','A customer is derived from booking and inquiry history. Search by name or email, then review their activity before contacting them.'],
    ['Analytics','/admin/analytics','Use trends to understand demand and content performance. Compare consistent date periods; do not treat low-volume percentages as guaranteed forecasts.'],
    ['Bookings','/admin/bookings','Create and maintain the booking record after agreeing details with the traveller. Status describes trip progress. Payment is recorded only as information after it is handled outside this website.'],
    ['Inquiries','/admin/inquiries','Open unread requests, review travel context, reply through the approved communication channel, and record internal follow-up notes. Never place private notes in customer-facing messages.'],
  ]},
  { title:'Inventory & Assets', purpose:'The reusable products, places, properties, and fleet used to build trips.', pages:[
    ['Tours','/admin/tours','Save a complete draft, review itinerary and inclusions, publish it, then optionally feature it. A featured tour must remain published. The displayed price is a starting estimate.'],
    ['Destinations','/admin/destinations','Maintain location facts, wildlife, seasons, travel advice, images, and SEO. Drafts are private; publishing makes the destination public.'],
    ['Accommodations','/admin/accommodations','Maintain property type, location, indicative pricing, amenities, contacts, and images. Confirm rates externally because the website does not book or charge the property.'],
    ['Vehicles','/admin/vehicles','Maintain fleet specifications, capacity, safety equipment, and photographs. Available vehicles can be selected for operational requests; unavailable vehicles are retained but cannot be newly assigned.'],
    ['Transfers','/admin/transfers','This is operational request management rather than inventory. Confirm or cancel only after checking vehicle and schedule availability. The customer is emailed; no payment is processed.'],
  ]},
  { title:'Marketing & Content', purpose:'Customer-facing stories, social proof, help content, and subscriber consent.', pages:[
    ['Blog Posts','/admin/blog','Create a draft, write structured content, add media and SEO, review, then publish. Saving a live article updates it without changing its publication state.'],
    ['Reviews','/admin/reviews','Review authenticity and consent, approve suitable feedback, verify evidence when available, and feature only the strongest approved reviews.'],
    ['Newsletters','/admin/newsletters','Manage subscription consent and export contacts. Unsubscribed people must not receive campaigns. Campaign sending occurs through the external email service.'],
    ['FAQs','/admin/faqs','Write one direct question and plain-language answer, assign a category and priority, save as draft, then publish after review.'],
    ['Guides','/admin/guides','Maintain private contact details and professional qualifications. Available means selectable for booking assignments; it does not publish a profile on the website.'],
  ]},
  { title:'System Admin', purpose:'Restricted tools for access, security, configuration, monitoring, and support.', pages:[
    ['Admin Users','/admin/users','Create a named administrator with the least-privileged role they need. Deactivate access when temporarily unavailable; delete only when retention policy permits. The final super administrator cannot be removed.'],
    ['Notifications','/admin/notifications','An operational inbox for bookings, inquiries, reviews, and system events. Search and filter, open the related record, then mark handled alerts read. Browser alerts are enabled per device in Settings.'],
    ['Audit Logs','/admin/audit-logs','Use filters to answer who changed what and when. Audit history is evidence and should not be edited. Sensitive credentials and customer secrets must never be stored in descriptions.'],
    ['Pricing Tool','/admin/pricing','Choose a tour, travellers, and accommodation level to prepare an estimate. It does not save a quote, alter catalogue pricing, take payment, or guarantee supplier availability.'],
    ['MFA Setup','/admin/mfa','Scan the QR code with an authenticator, verify the six-digit code, and store backup codes securely. Each administrator enables MFA for their own account.'],
    ['Settings','/admin/settings','General controls branding and locale; Security controls authentication; Environment limits deployment context; Integrations connects external services; Features controls modules; Notifications controls browser alerts; Governance controls retention; Roles controls least-privilege access; Audit shows configuration changes.'],
  ]},
]

export default async function HelpPage(){await requireAdmin('tours','VIEW');return <div className="space-y-8"><AdminPageHeader title="User Manual & Help" description="Practical instructions for operating every part of the Senza Luce Safaris dashboard."/><div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><BookOpen className="h-5 w-5 text-primary"/><CardTitle className="text-base">Start with the record</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Open the customer, booking, or content record before taking action. Confirm names, dates, status, and context.</CardContent></Card><Card><CardHeader><CheckCircle2 className="h-5 w-5 admin-text-success"/><CardTitle className="text-base">Save, review, then publish</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Draft-first sections protect customers from incomplete information and accidental publication.</CardContent></Card><Card><CardHeader><AlertTriangle className="h-5 w-5 admin-text-warning"/><CardTitle className="text-base">Payments stay external</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">The dashboard records agreed booking/payment information but never collects or processes money.</CardContent></Card></div>{categories.map(category=><section key={category.title} className="space-y-4"><div><Badge variant="outline">{category.title}</Badge><h2 className="mt-2 text-xl font-semibold">{category.title}</h2><p className="text-sm text-muted-foreground">{category.purpose}</p></div><div className="grid gap-3 lg:grid-cols-2">{category.pages.map(([name,href,description])=><Card key={name}><CardHeader className="pb-3"><CardTitle className="text-base">{name}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent><Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Open {name}<ArrowRight className="h-4 w-4"/></Link></CardContent></Card>)}</div></section>)}</div>}
