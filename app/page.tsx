import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-vibrant-mustard selection:text-slate-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/80 px-4 py-1.5 text-sm font-bold text-slate-900 mb-8 animate-slide-up shadow-sm">
                <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="tracking-wide uppercase">
                  Plataforma Educativa Interactiva
                </span>
              </div>
              
              <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8 animate-slide-up [animation-delay:100ms] leading-tight">
                Dale vida a tus clases con
                <span className="relative whitespace-nowrap px-4">
                  <span className="relative z-10 text-yellow-400">encuestas dinámicas</span>
                  <span className="absolute bottom-2 left-0 -z-10 h-4 w-full -rotate-1 bg-vibrant-mustard/40"></span>
                </span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 mb-10 animate-slide-up [animation-delay:200ms] leading-relaxed">
                Conecta con tus estudiantes en tiempo real. Una experiencia visual vibrante diseñada para hacer del aprendizaje algo emocionante y medible.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:300ms]">
                <Link
                  href="/register"
                  className="group relative flex items-center justify-center gap-2 rounded-full bg-yellow-400/80 px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-yellow-400/50 hover:-translate-y-1"
                >
                  Comenzar gratis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="group relative flex items-center justify-center gap-2 rounded-full bg-red-500/80 px-8 py-4 text-lg font-bold text-white transition-all hover:shadow-lg hover:shadow-red-500/50 hover:-translate-y-1"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative floating blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            {/* Yellow Blob */}
            <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-vibrant-mustard/20 rounded-full blur-3xl animate-float opacity-70"></div>
            
            {/* Blue Blob */}
            <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-float [animation-delay:2s] opacity-60"></div>
            
            {/* Red Blob */}
            <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-vibrant-red/10 rounded-full blur-3xl animate-float [animation-delay:4s] opacity-50"></div>
            
            {/* Green Blob */}
            <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-vibrant-green/10 rounded-full blur-3xl animate-float [animation-delay:1s] opacity-40"></div>
          </div>
        </section>

        {/* Functionalities Section */}
        <section className="py-24 relative bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-vibrant-red font-bold tracking-wide uppercase text-sm mb-3">Características</h2>
              <p className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                Potencia tu aula
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Professor Card */}
              <div className="group relative rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-600/30 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/20 to-transparent rounded-bl-[100px] rounded-tr-[2.5rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Para Docentes</h3>
                      <p className="text-slate-500 font-medium">Control total y análisis</p>
                    </div>
                  </div>

                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Cursos y Temas</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">Organiza tu contenido en cursos ilimitados y estructuras temáticas claras.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Asignación Inteligente</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">Distribuye encuestas a grupos específicos con un solo clic.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Dashboard en Vivo</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">Gráficos coloridos e interactivos para entender el progreso al instante.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Student Card */}
              <div className="group relative rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-red-500/30 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-[100px] rounded-tr-[2.5rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-500">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Para Estudiantes</h3>
                      <p className="text-slate-500 font-medium">Aprendizaje gamificado</p>
                    </div>
                  </div>

                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-vibrant-red">
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Experiencia Fluida</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">Únete a clases y responde encuestas con una interfaz amigable y rápida.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-vibrant-red">
                        <Clock className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Historial Personal</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">Revisa tus respuestas anteriores y mantén un registro de tu aprendizaje.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-vibrant-red">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">Logros Visuales</h4>
                        <p className="text-slate-600 mt-1 leading-relaxed">Visualiza tu avance con indicadores de progreso motivadores.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <div className="flex flex-col items-center p-8 rounded-3xl bg-green-50/50 hover:bg-green-50 transition-colors">
                <dt className="order-2 mt-2 text-lg font-bold text-slate-600">Estudiantes Activos</dt>
                <dd className="order-1 text-5xl font-extrabold text-green-500">2k+</dd>
              </div>
              <div className="flex flex-col items-center p-8 rounded-3xl bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
                <dt className="order-2 mt-2 text-lg font-bold text-slate-600">Encuestas Creadas</dt>
                <dd className="order-1 text-5xl font-extrabold text-yellow-500">500+</dd>
              </div>
              <div className="flex flex-col items-center p-8 rounded-3xl bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <dt className="order-2 mt-2 text-lg font-bold text-slate-600">Instituciones</dt>
                <dd className="order-1 text-5xl font-extrabold text-blue-600">50+</dd>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
