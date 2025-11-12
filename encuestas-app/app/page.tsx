"use client";

import React, { useState } from "react";
import { GraduationCap } from "lucide-react";

export default function PEAILogin() {
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [studentCode, setStudentCode] = useState("");

  const handleTeacherLogin = () => {
    console.log("Teacher login:", { teacherEmail, teacherPassword });
  };

  const handleStudentJoin = () => {
    console.log("Student join:", { studentCode });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-400 py-6 px-8 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white text-3xl font-bold">PEAI</h1>
            <p className="text-white text-sm opacity-90">
              Encuestas Académicas en Tiempo Real
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Teacher Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso Docente
            </h2>
            <p className="text-gray-600 mb-6">
              Inicia sesión para crear y gestionar encuestas
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="docente@universidad.edu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleTeacherLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md"
              >
                Iniciar Sesión
              </button>

              <p className="text-center text-gray-600">
                ¿No tienes cuenta?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  Registrarse
                </button>
              </p>
            </div>
          </div>

          {/* Student Access Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Acceso Estudiante
            </h2>
            <p className="text-gray-600 mb-6">
              Únete a una sesión en vivo con el código
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Código de Sesión
                </label>
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Ingresa el código de 6 dígitos proporcionado por tu docente
                </p>
              </div>

              <button
                onClick={handleStudentJoin}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md mt-8"
              >
                Unirse a Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
