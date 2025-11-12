"use client";
import { useState } from "react";
import { Plus, FolderOpen, Eye, Download, MoreVertical } from "lucide-react";

export default function PEAIDashboard() {
  const [surveys] = useState([
    {
      id: 1,
      name: "Evaluación Clase 1",
      date: "2025-10-28",
      participants: 45,
      status: "Activa",
    },
    {
      id: 2,
      name: "Quiz Matemáticas",
      date: "2025-10-27",
      participants: 38,
      status: "Activa",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 py-8 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              Dashboard Docente
            </h1>
            <p className="text-white text-sm opacity-90">
              Gestiona tus encuestas y resultados
            </p>
          </div>
          <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            Crear Nueva Encuesta
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Encuestas Activas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-700 font-semibold text-lg">
                Encuestas Activas
              </h3>
              <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                3
              </span>
            </div>
            <p className="text-gray-500 text-sm">En este momento</p>
          </div>

          {/* Participantes Hoy */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-700 font-semibold text-lg">
                Participantes Hoy
              </h3>
              <span className="text-blue-600 text-xl font-bold">156</span>
            </div>
            <p className="text-gray-500 text-sm">Últimas 24 horas</p>
          </div>

          {/* Total Encuestas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-700 font-semibold text-lg">
                Total Encuestas
              </h3>
              <span className="text-pink-500 text-xl font-bold">28</span>
            </div>
            <p className="text-gray-500 text-sm">Todas las encuestas</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Crear Nueva Encuesta
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md border border-gray-300">
            <FolderOpen className="w-5 h-5" />
            Activar Encuesta Existente
          </button>
        </div>

        {/* Recent Surveys Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Encuestas Recientes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Participantes
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey) => (
                  <tr
                    key={survey.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {survey.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{survey.date}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {survey.participants}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {survey.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-blue-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-blue-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-blue-600 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
