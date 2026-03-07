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

          <div className="text-xs text-muted">
            &copy; {new Date().getFullYear()} YevanUpdates
          </div>

          <div className="text-xs text-muted">
            Made with love by{" "}
            <a
              href="https://www.linkedin.com/in/rasaljayasinghe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary transition-colors"
            >
              Rasal Jayasinghe
            </a>
          </div>
        </div>

        {/* Right: disclaimers */}
        <div className="max-w-md flex flex-col gap-4 text-center text-xs leading-relaxed text-muted lg:text-right">
          <p>
            This site is unofficial and is not associated with the FIA, Formula 1,
            Formula 2, or Formula 3 companies. All trademarks are the property of
            their respective owners. Data sourced from publicly available APIs for
            educational and non-commercial purposes.
          </p>
          <p>
            All images and photographs featured on this site are sourced from
            publicly available platforms including the official Instagram of{" "}
            <a
              href="https://www.instagram.com/yevandavid/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors"
            >
              Yevan David
            </a>{" "}
            and{" "}
            <a
              href="https://www.instagram.com/aixracing/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors"
            >
              AIX Racing
            </a>
            . All image rights belong to their respective owners and
            photographers. No copyright infringement is intended.
          </p>
        </div>
      </div>
    </footer>
  );
}
