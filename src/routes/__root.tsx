import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Link } from '@tanstack/react-router'

import Header from '../components/Header'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Divine Tours & Safari' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-cream text-dark font-sans">
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function Footer() {
  return (
    <footer className="bg-dark text-cream/70 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="font-display text-2xl text-cream font-semibold">Divine Tours & Safari</p>
          <p className="text-sm mt-1 font-light tracking-wide">Namibia's Premier Safari Specialists</p>
        </div>
        <nav className="flex gap-8 text-sm font-medium tracking-wide">
          <Link to="/" className="hover:text-cream transition-colors">Home</Link>
          <Link to="/tours" className="hover:text-cream transition-colors">Tours</Link>
          <Link to="/about" className="hover:text-cream transition-colors">About</Link>
          <Link to="/contact" className="hover:text-cream transition-colors">Contact</Link>
        </nav>
        <p className="text-xs font-light">
          © {new Date().getFullYear()} Divine Tours & Safari.<br />All rights reserved.
        </p>
      </div>
    </footer>
  )
}
