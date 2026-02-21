import { Link, useRouterState } from '@tanstack/react-router'
import { useLayoutEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/tours', label: 'Tours', exact: false },
  { to: '/about', label: 'About', exact: true },
  { to: '/contact', label: 'Contact', exact: true },
] as const

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  useLayoutEffect(() => {
    if (!navRef.current) return
    const active = navRef.current.querySelector<HTMLElement>('[data-active="true"]')
    if (active) {
      setPill({ left: active.offsetLeft, width: active.offsetWidth, ready: true })
    }
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-mist">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl font-semibold text-dark tracking-wide hover:text-rust transition-colors"
        >
          Divine Tours & Safari
        </Link>

        <div ref={navRef} className="relative flex items-center gap-1 p-1">
          {pill.ready && (
            <div
              className="absolute inset-y-1 rounded-full bg-dark pointer-events-none"
              style={{
                left: pill.left,
                width: pill.width,
                transition:
                  'left 320ms cubic-bezier(0.4, 0, 0.2, 1), width 320ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}

          {NAV_LINKS.map(({ to, label, exact }) => {
            const isActive = exact
              ? pathname === to
              : pathname === to || pathname.startsWith(to + '/')

            return (
              <Link
                key={to}
                to={to}
                data-active={isActive}
                className={`relative z-10 px-4 py-1.5 text-sm font-medium tracking-wide rounded-full transition-colors duration-200 ${
                  isActive ? 'text-cream' : 'text-taupe hover:text-dark'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
