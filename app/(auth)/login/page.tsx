import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0d1a0f] flex items-center justify-center px-4">
      {/* Glow ambiental */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#1a2e1c] opacity-60 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-sm w-full">
        {/* Logo / título */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-serif text-5xl font-bold tracking-tight text-[#f5f0e8]">
            LevelUp
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#9aab8a]">
            Visor Académico · ECEA 2026
          </span>
        </div>

        {/* Card login */}
        <div className="w-full bg-[#1a2e1c]/60 backdrop-blur-md border border-[#1e3320] rounded-xl p-8 flex flex-col gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl text-[#f5f0e8]">Ingresar al Visor</h2>
            <p className="text-xs text-[#9aab8a] leading-relaxed">
              Usá tu cuenta institucional Google para acceder a tu progreso académico.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-[#c9a227] hover:bg-[#b8911f] text-[#0d1a0f] font-semibold text-sm py-3.5 px-6 rounded-lg transition-colors shadow-[0_0_20px_rgba(201,162,39,0.25)]"
            >
              {/* Google icon SVG */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#0d1a0f" fillOpacity=".7"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#0d1a0f" fillOpacity=".7"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#0d1a0f" fillOpacity=".7"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#0d1a0f" fillOpacity=".7"/>
              </svg>
              Continuar con Google
            </button>
          </form>

          <p className="text-[10px] text-[#9aab8a]/50 leading-relaxed">
            Solo cuentas <span className="text-[#9aab8a]">@fecea.edu.ar</span> tienen acceso al visor.
          </p>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-[#9aab8a]/40 uppercase tracking-widest">
          Tecnología de la Representación · 2026
        </p>
      </div>
    </main>
  );
}
