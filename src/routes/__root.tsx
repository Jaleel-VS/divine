import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Link } from "@tanstack/react-router";

import Header from "../components/Header";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Divine Tours & Safaris" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Lato:wght@300;400&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
});

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
          config={{ position: "bottom-right" }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-cream/70 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-dark text-sm font-bold shrink-0">
            D
          </div>
          <div className="font-display text-2xl text-cream font-semibold">
            <span className="block text-center">Divine</span>
            <span className="block">Tours & Safaris</span>
          </div>
        </div>
        <nav className="flex gap-8 text-sm font-medium tracking-wide">
          <Link to="/about" className="hover:text-cream transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-cream transition-colors">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-cream transition-colors">
            Terms & Conditions
          </Link>
        </nav>
        <p className="text-xs font-light">
          © {new Date().getFullYear()} Divine Tours & Safari.
          <br />
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
