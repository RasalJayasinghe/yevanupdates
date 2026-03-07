export default function Footer() {
  return (
    <footer className="relative border-t-3 border-white bg-secondary px-4 py-8 sm:px-6 sm:py-12 overflow-hidden">
      {/* Diagonal top edge echoing racing stripe */}
      <div
        className="absolute top-0 left-0 w-full h-12 sm:h-16 bg-background pointer-events-none"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:text-left">
        {/* Left: brand, links, made with love */}
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div className="font-heading text-3xl tracking-wider text-white">
            YEVAN DAVID
          </div>
          <div className="text-sm font-medium tracking-widest text-accent uppercase">
            AIX Racing &middot; FIA Formula 3 Championship 2026
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-muted lg:justify-start">
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

          <div className="text-xs text-muted/40">
            &copy; {new Date().getFullYear()} YevanUpdates
          </div>

          <div className="text-xs text-muted/40">
            Made with love by{" "}
            <a
              href="https://www.linkedin.com/in/rasaljayasinghe/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              Rasal Jayasinghe
            </a>
          </div>
        </div>

        {/* Right: disclaimer */}
        <div className="max-w-md text-center text-xs leading-relaxed text-muted/60 lg:text-right">
          This site is unofficial and is not associated with the FIA, Formula 1,
          Formula 2, or Formula 3 companies. All trademarks are the property of
          their respective owners. Data sourced from publicly available APIs for
          educational and non-commercial purposes.
        </div>
      </div>
    </footer>
  );
}
