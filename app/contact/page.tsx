import Link from 'next/link'

export const metadata = {
  title: 'Contact | tykoonConnect',
  description: 'Get in touch with the tykoonConnect team.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Need help or want to report an issue? Reach out and we’ll get back to you as soon as possible.
      </p>

      <div className="mt-8 rounded-lg border border-slate-200 p-6 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
        <a href="mailto:support@tykoonconnect.com" className="text-lg font-medium underline underline-offset-4">
          support@tykoonconnect.com
        </a>
      </div>

      <div className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        {' · '}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>
      </div>
    </main>
  )
}
