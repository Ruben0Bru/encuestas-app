"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
  Check,
  Circle,
  Menu,
  X as CloseIcon,
} from "lucide-react";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

export default function PEAISurveyResponse() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Preguntas simuladas
  const questions: Question[] = [
    {
      id: 1,
      text: "¿Cuál es la capital de Colombia?",
      options: [
        { id: 1, text: "Bogotá" },
        { id: 2, text: "Medellín" },
        { id: 3, text: "Cali" },
        { id: 4, text: "Cartagena" },
      ],
    },
    {
      id: 2,
      text: "¿En qué año se independizó Colombia?",
      options: [
        { id: 5, text: "1810" },
        { id: 6, text: "1819" },
        { id: 7, text: "1830" },
        { id: 8, text: "1850" },
      ],
    },
    {
      id: 3,
      text: "¿Quién escribió Cien Años de Soledad?",
      options: [
        { id: 9, text: "Gabriel García Márquez" },
        { id: 10, text: "Jorge Luis Borges" },
        { id: 11, text: "Pablo Neruda" },
        { id: 12, text: "Julio Cortázar" },
      ],
    },
    {
      id: 4,
      text: "¿Cuál es el río más largo de Colombia?",
      options: [
        { id: 13, text: "Río Magdalena" },
        { id: 14, text: "Río Cauca" },
        { id: 15, text: "Río Amazonas" },
        { id: 16, text: "Río Atrato" },
      ],
    },
    {
      id: 5,
      text: "¿Cuántos departamentos tiene Colombia?",
      options: [
        { id: 17, text: "32" },
        { id: 18, text: "28" },
        { id: 19, text: "30" },
        { id: 20, text: "35" },
      ],
    },
    {
      id: 6,
      text: "¿Cuál es la moneda oficial de Colombia?",
      options: [
        { id: 21, text: "Peso colombiano" },
        { id: 22, text: "Dólar" },
        { id: 23, text: "Euro" },
        { id: 24, text: "Bolívar" },
      ],
    },
    {
      id: 7,
      text: "¿Qué océanos rodean a Colombia?",
      options: [
        { id: 25, text: "Pacífico y Atlántico" },
        { id: 26, text: "Solo Pacífico" },
        { id: 27, text: "Solo Atlántico" },
        { id: 28, text: "Índico y Pacífico" },
      ],
    },
    {
      id: 8,
      text: "¿Cuál es el plato típico colombiano?",
      options: [
        { id: 29, text: "Bandeja paisa" },
        { id: 30, text: "Tacos" },
        { id: 31, text: "Ceviche" },
        { id: 32, text: "Empanadas argentinas" },
      ],
    },
    {
      id: 9,
      text: "¿Cuál es el pico más alto de Colombia?",
      options: [
        { id: 33, text: "Pico Cristóbal Colón" },
        { id: 34, text: "Nevado del Ruiz" },
        { id: 35, text: "Cerro de Monserrate" },
        { id: 36, text: "Nevado del Tolima" },
      ],
    },
    {
      id: 10,
      text: "¿En qué continente se encuentra Colombia?",
      options: [
        { id: 37, text: "América del Sur" },
        { id: 38, text: "América del Norte" },
        { id: 39, text: "América Central" },
        { id: 40, text: "Europa" },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const handleSelectAnswer = (optionId: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    // Verificar que todas las preguntas estén respondidas
    if (answeredCount < totalQuestions) {
      showNotification(
        "error",
        `Faltan ${totalQuestions - answeredCount} pregunta(s) por responder`
      );
      return;
    }

    // Simular envío exitoso
    setTimeout(() => {
      showNotification("success", "¡Respuestas enviadas exitosamente!");
    }, 500);
  };

  const getQuestionStatus = (questionId: number) => {
    return answers[questionId] !== undefined;
  };

  return (
    <div className="max-h-screen bg-gray-50 flex">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg transition-all ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Left Sidebar - Questions List */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Evaluación Clase 1
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Progreso: {answeredCount} de {totalQuestions}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-sm text-blue-600 font-semibold mt-1">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                currentQuestionIndex === index
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  getQuestionStatus(question.id)
                    ? "bg-green-500 text-white"
                    : currentQuestionIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {getQuestionStatus(question.id) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium line-clamp-2">
                  Pregunta {index + 1}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {getQuestionStatus(question.id) ? "Respondida" : "Pendiente"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        {answeredCount === totalQuestions && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-5 h-5" />
            Enviar Respuestas
          </button>
        )}
      </div>

      {/* Main Content - Question Display */}
      <div className="flex-1 flex flex-col">
        {/* Header with Progress */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </h3>
              <span className="text-2xl font-bold text-pink-500">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-pink-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-12">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    answers[currentQuestion.id] === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl font-medium text-gray-800">
                    {String.fromCharCode(65 + index)}) {option.text}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg border-2 font-semibold transition-colors ${
                  currentQuestionIndex === 0
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-colors ${
                  currentQuestionIndex === totalQuestions - 1
                    ? "border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
