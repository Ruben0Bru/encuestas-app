import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-white shadow-md shadow-yellow-400/30">
            <span className="text-lg font-bold">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PEAI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition hover:text-yellow-400"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="hidden rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-white shadow-md shadow-yellow-400/20 transition hover:bg-yellow-400/90 hover:shadow-lg hover:shadow-yellow-400/50 sm:block"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}
