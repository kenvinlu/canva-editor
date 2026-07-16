export function SiteGoodbye() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mx-auto max-w-xl space-y-6">
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Canva Clone
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Goodbye
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          This site will no longer be available. Thank you for being part of the
          journey — we appreciate everyone who used, shared, and supported the
          project.
        </p>
        <p className="text-sm text-muted-foreground">
          &mdash; The Canva Clone Team
        </p>
      </div>
    </div>
  );
}
