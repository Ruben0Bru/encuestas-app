'use client'

import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [state, dispatch, isPending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Decorative */}
      <div className="hidden w-1/2 bg-slate-50 lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#FBE02E]/20 rounded-full blur-3xl animate-float opacity-70"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-[#2E9FFB]/10 rounded-full blur-3xl animate-float [animation-delay:2s] opacity-60"></div>
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-[#FB2E80]/10 rounded-full blur-3xl animate-float [animation-delay:4s] opacity-50"></div>
        
        <div className="relative z-10 p-12 text-center max-w-lg">
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white shadow-xl shadow-slate-200/50">
                <Sparkles className="w-8 h-8 text-[#FBE02E]" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                Bienvenido a <span className="text-[#FBE02E]">PEAI</span>
            </h2>
            <p className="text-lg text-slate-600">
                Tu plataforma educativa para gestionar, aprender y crecer.
            </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ingresa a tu cuenta para continuar
            </p>
          </div>
          
          {state?.error && (
              <div className="bg-red-50 border-l-4 border-[#FB2E80] p-4 rounded-r-md">
                  <div className="flex">
                      <div className="ml-3">
                          <p className="text-sm text-red-700">{state.error}</p>
                      </div>
                  </div>
              </div>
          )}

          <form action={dispatch} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#FBE02E] focus:ring-[#FBE02E] sm:text-sm transition-all shadow-sm hover:border-[#FBE02E]/50"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#FBE02E] focus:ring-[#FBE02E] sm:text-sm transition-all shadow-sm hover:border-[#FBE02E]/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-xl bg-[#FBE02E] px-4 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-[#FBE02E]/30 transition-all hover:bg-[#FBE02E]/90 hover:shadow-[#FBE02E]/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FBE02E] focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            >
              {isPending ? 'Ingresando...' : 'Ingresar'}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>

            <div className="text-center text-sm">
              <span className="text-slate-500">¿No tienes cuenta? </span>
              <Link href="/register" className="font-bold text-[#FBE02E] hover:text-[#FBE02E]/80 transition-colors">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}