export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-400 text-white shadow-sm">
              <span className="text-xs font-bold">P</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PEAI. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-yellow-400 transition-colors">
              Términos
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-yellow-400 transition-colors">
              Privacidad
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-yellow-400 transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
