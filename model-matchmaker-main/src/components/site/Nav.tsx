import { useState, useEffect } from "react";
import { Search, Menu, X, Sparkles } from "lucide-react";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = ["Scan", "Models", "Migrate", "Pricing", "Docs", "Support"];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || searchOpen || menuOpen
            ? "bg-background/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-11 max-w-[1024px] items-center justify-between px-5 text-foreground">
          <a href="#" aria-label="Home" className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            <span className="text-[13px] font-semibold tracking-tight">portus</span>
          </a>

          <ul className="hidden md:flex items-center gap-7">
            {items.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[12px] font-normal opacity-80 hover:opacity-100 transition-opacity"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden opacity-80 hover:opacity-100 transition-opacity"
            >
              {menuOpen ? <X className="h-4 w-4" strokeWidth={1.5} /> : <Menu className="h-4 w-4" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>

        {/* Search flyout */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="mx-auto max-w-[1024px] px-5 py-6">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Search className="h-5 w-5 opacity-60" strokeWidth={1.5} />
              <input
                autoFocus={searchOpen}
                placeholder="Search models, providers, docs"
                className="w-full bg-transparent text-2xl font-light tracking-tight outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-in */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-6 px-6 pt-24">
          {items.map((item) => (
            <li key={item}>
              <a href="#" className="text-3xl font-semibold tracking-tight">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
