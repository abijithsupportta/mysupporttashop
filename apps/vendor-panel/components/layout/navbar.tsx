"use client";

interface NavbarProps {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

export function Navbar({ title, subtitle, leading, trailing }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-white/80 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {leading}
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {trailing}
      </div>
    </header>
  );
}
