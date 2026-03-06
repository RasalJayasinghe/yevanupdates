export default function Footer() {
  return (
    <footer className="border-t-3 border-white bg-secondary px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <div className="font-heading text-3xl tracking-wider text-white">
          YEVAN DAVID
        </div>
        <div className="text-sm font-medium tracking-widest text-accent uppercase">
          AIX Racing &middot; FIA Formula 3 Championship 2026
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-muted">
          <a
            href="https://www.fiaformula3.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            FIA F3
          </a>
          <span>&middot;</span>
          <a
            href="https://www.fiaformula3.com/Standings/Driver"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Standings
          </a>
          <span>&middot;</span>
          <a
            href="https://www.fiaformula3.com/livetiming"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Live Timing
          </a>
        </div>

        <div className="mt-4 max-w-md px-2 text-xs leading-relaxed text-muted/60">
          This site is unofficial and is not associated with the FIA, Formula 1,
          Formula 2, or Formula 3 companies. All trademarks are the property of
          their respective owners. Data sourced from publicly available APIs for
          educational and non-commercial purposes.
        </div>

        <div className="text-xs text-muted/40">
          &copy; {new Date().getFullYear()} YevanUpdates
        </div>
      </div>
    </footer>
  );
}
