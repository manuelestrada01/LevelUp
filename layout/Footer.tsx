export default function Footer() {
  return (
    <footer className="border-t border-[#1e3320] bg-[#0a1a0c] px-8 py-4 flex items-center justify-between shrink-0">
      <p className="text-[11px] uppercase tracking-widest text-[#9aab8a]/60">
        Visor Académico · ECEA 2026
      </p>
      <a
        href="https://m-estrada.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 text-sm text-[#9aab8a] hover:text-[#f5f0e8] transition-colors"
      >
        <span>Diseñado y desarrollado por</span>
        <span className="font-semibold text-[#c9a227] group-hover:text-[#e0b93a] transition-colors underline underline-offset-2 decoration-[#c9a227]/40 group-hover:decoration-[#e0b93a]">
          Manuel Estrada
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#c9a227]/60 group-hover:text-[#e0b93a] transition-colors"
        >
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      </a>
    </footer>
  );
}
