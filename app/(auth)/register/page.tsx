'use client'

import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useActionState } from 'react'
import { ArrowRight, Zap } from 'lucide-react'

export default function RegisterPage() {
  const [state, dispatch, isPending] = useActionState(signup, undefined)

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Decorative */}
      <div className="hidden w-1/2 bg-slate-50 lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2EFB87]/20 rounded-full blur-3xl animate-float opacity-70"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-[#FBE02E]/10 rounded-full blur-3xl animate-float [animation-delay:2s] opacity-60"></div>
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-[#2E9FFB]/10 rounded-full blur-3xl animate-float [animation-delay:4s] opacity-50"></div>
        
        <div className="relative z-10 p-12 text-center max-w-lg">
            <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-white shadow-xl shadow-slate-200/50">
                <Zap className="w-8 h-8 text-[#FB2E80]" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                Únete a la <span className="text-[#FB2E80]">comunidad</span>
            </h2>
            <p className="text-lg text-slate-600">
                Crea tu cuenta hoy y comienza a transformar la manera en que enseñas y aprendes.
            </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Crear cuenta
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Completa tus datos para registrarte
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
                <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="block w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#FB2E80] focus:ring-[#FB2E80] sm:text-sm transition-all shadow-sm hover:border-[#FB2E80]/50"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#FB2E80] focus:ring-[#FB2E80] sm:text-sm transition-all shadow-sm hover:border-[#FB2E80]/50"
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
                  minLength={6}
                  className="block w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#FB2E80] focus:ring-[#FB2E80] sm:text-sm transition-all shadow-sm hover:border-[#FB2E80]/50"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <span className="block text-sm font-medium text-slate-700 mb-3">Soy:</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      id="role-student"
                      name="role"
                      type="radio"
                      value="student"
                      defaultChecked
                      className="peer sr-only"
                    />
                    <label 
                        htmlFor="role-student" 
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 p-4 cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-[#FB2E80] peer-checked:bg-[#FB2E80]/5 peer-checked:text-[#FB2E80]"
                    >
                        <span className="text-sm font-bold">Estudiante</span>
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="role-teacher"
                      name="role"
                      type="radio"
                      value="teacher"
                      className="peer sr-only"
                    />
                    <label 
                        htmlFor="role-teacher" 
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 p-4 cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-[#2E9FFB] peer-checked:bg-[#2E9FFB]/5 peer-checked:text-[#2E9FFB]"
                    >
                        <span className="text-sm font-bold">Docente</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-xl bg-[#FB2E80] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#FB2E80]/30 transition-all hover:bg-[#FB2E80]/90 hover:shadow-[#FB2E80]/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FB2E80] focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            >
              {isPending ? 'Registrando...' : 'Registrarse'}
              {!isPending && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>

            <div className="text-center text-sm">
              <span className="text-slate-500">¿Ya tienes cuenta? </span>
              <Link href="/login" className="font-bold text-[#FB2E80] hover:text-[#FB2E80]/80 transition-colors">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}