"use client";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileNav({ open, onClose, children }: MobileNavProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/45 md:hidden">
      <button className="absolute inset-0" aria-label="Close menu" onClick={onClose} />
      <div className="relative h-full w-72">{children}</div>
    </div>
  );
}
