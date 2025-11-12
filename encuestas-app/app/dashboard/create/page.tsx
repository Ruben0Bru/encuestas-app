"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  Play,
  Trash2,
  Check,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function PEAIEditor() {
  const [surveyTitle, setSurveyTitle] = useState("Evaluación Clase 1");
  const [surveyDescription, setSurveyDescription] = useState(
    "Breve descripción de la encuesta"
  );
  const [questionType, setQuestionType] = useState("multiple");
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "¿Cuál es la capital de Colombia?",
      type: "multiple",
      options: [
        { id: 1, text: "Bogotá", isCorrect: true },
        { id: 2, text: "Medellín", isCorrect: false },
        { id: 3, text: "Cali", isCorrect: false },
        { id: 4, text: "Cartagena", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "¿En qué año se independizó Colombia?",
      type: "multiple",
      options: [
        { id: 5, text: "1810", isCorrect: true },
        { id: 6, text: "1819", isCorrect: false },
        { id: 7, text: "1830", isCorrect: false },
        { id: 8, text: "1850", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "¿Quién escribió Cien Años de Soledad?",
      type: "multiple",
      options: [
        { id: 9, text: "Gabriel García Márquez", isCorrect: true },
        { id: 10, text: "Jorge Luis Borges", isCorrect: false },
        { id: 11, text: "Pablo Neruda", isCorrect: false },
        { id: 12, text: "Julio Cortázar", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "¿Cuál es el río más largo de Colombia?",
      type: "multiple",
      options: [
        { id: 13, text: "Río Magdalena", isCorrect: true },
        { id: 14, text: "Río Cauca", isCorrect: false },
        { id: 15, text: "Río Amazonas", isCorrect: false },
        { id: 16, text: "Río Atrato", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "¿Cuántos departamentos tiene Colombia?",
      type: "multiple",
      options: [
        { id: 17, text: "32", isCorrect: true },
        { id: 18, text: "28", isCorrect: false },
        { id: 19, text: "30", isCorrect: false },
        { id: 20, text: "35", isCorrect: false },
      ],
    },
  ]);

  const [nextOptionId, setNextOptionId] = useState(21);
  const [nextQuestionId, setNextQuestionId] = useState(6);

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  const currentOptions = currentQuestion?.options || [];

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

  const updateCurrentQuestionText = (text: string) => {
    setQuestions(
      questions.map((q) => (q.id === currentQuestionId ? { ...q, text } : q))
    );
  };

  const addOption = () => {
    const newOption = {
      id: nextOptionId,
      text: "",
      isCorrect: false,
    };
    setQuestions(
      questions.map((q) =>
        q.id === currentQuestionId
          ? { ...q, options: [...q.options, newOption] }
          : q
      )
    );
    setNextOptionId(nextOptionId + 1);
  };

  const updateOption = (id: number, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === currentQuestionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === id ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  const toggleCorrect = (id: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === currentQuestionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
              ),
            }
          : q
      )
    );
  };

  const deleteOption = (id: number) => {
    if (currentOptions.length <= 2) {
      showNotification("error", "Debe haber al menos 2 opciones");
      return;
    }
    setQuestions(
      questions.map((q) =>
        q.id === currentQuestionId
          ? { ...q, options: q.options.filter((opt) => opt.id !== id) }
          : q
      )
    );
  };

  const addQuestion = () => {
    const newQuestion = {
      id: nextQuestionId,
      text: "Nueva pregunta",
      type: questionType,
      options: [
        { id: nextOptionId, text: "Opción 1", isCorrect: true },
        { id: nextOptionId + 1, text: "Opción 2", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setNextQuestionId(nextQuestionId + 1);
    setNextOptionId(nextOptionId + 2);
    setCurrentQuestionId(nextQuestionId);
    showNotification("success", "Pregunta agregada correctamente");
  };

  const selectQuestion = (id: number) => {
    setCurrentQuestionId(id);
  };

  const handleSaveDraft = () => {
    // Validar que todas las preguntas tengan texto
    const emptyQuestions = questions.filter((q) => !q.text.trim());
    if (emptyQuestions.length > 0) {
      showNotification("error", "Hay preguntas sin texto");
      return;
    }

    // Validar que el título no esté vacío
    if (!surveyTitle.trim()) {
      showNotification("error", "El título de la encuesta es requerido");
      return;
    }

    // Simular guardado
    setTimeout(() => {
      showNotification("success", "Borrador guardado correctamente");
    }, 500);
  };

  const handleActivate = () => {
    // Validar que todas las preguntas tengan texto
    const emptyQuestions = questions.filter((q) => !q.text.trim());
    if (emptyQuestions.length > 0) {
      showNotification("error", "Hay preguntas sin texto");
      return;
    }

    // Validar que cada pregunta tenga al menos una respuesta correcta
    const questionsWithoutCorrect = questions.filter(
      (q) => !q.options.some((opt) => opt.isCorrect)
    );
    if (questionsWithoutCorrect.length > 0) {
      showNotification(
        "error",
        "Todas las preguntas deben tener al menos una respuesta correcta"
      );
      return;
    }

    // Validar que el título no esté vacío
    if (!surveyTitle.trim()) {
      showNotification("error", "El título de la encuesta es requerido");
      return;
    }

    // Simular activación
    setTimeout(() => {
      showNotification("success", "¡Encuesta activada! Código: ABC123");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 py-6 px-8 shadow-lg">
        <h1 className="text-white text-2xl font-bold">Editor de Encuestas</h1>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Sidebar - Configuration */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Configuración
          </h2>

          {/* Survey Title */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Título de encuesta
            </label>
            <input
              type="text"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Ej: Evaluación Clase 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Survey Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              placeholder="Breve descripción de la encuesta"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Question Type */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tipo de pregunta
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="multiple">Opción Múltiple</option>
              <option value="trueFalse">Verdadero/Falso</option>
              <option value="short">Respuesta Corta</option>
              <option value="essay">Ensayo</option>
            </select>
          </div>

          {/* Add Question Button */}
          <button
            onClick={addQuestion}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Pregunta
          </button>
        </div>

        {/* Center - Question Editor */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Pregunta{" "}
                {questions.findIndex((q) => q.id === currentQuestionId) + 1}
              </h3>

              {/* Question Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Escribe tu pregunta aquí
                </label>
                <input
                  type="text"
                  value={currentQuestion?.text || ""}
                  onChange={(e) => updateCurrentQuestionText(e.target.value)}
                  placeholder="¿Cuál es la capital de Colombia?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Answer Options */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-3">
                  Opciones de respuesta
                </label>
                <div className="space-y-3">
                  {currentOptions.map((option) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCorrect(option.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          option.isCorrect
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {option.isCorrect && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <span className="text-sm text-gray-600 w-20">
                        {option.isCorrect ? "Correcta" : "Correcta"}
                      </span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) =>
                          updateOption(option.id, e.target.value)
                        }
                        placeholder="Escribe una opción"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => deleteOption(option.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOption}
                  className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Agregar opción
                </button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Vista Previa
              </h3>
              <p className="text-gray-800 font-medium mb-4">
                {currentQuestion?.text || "Pregunta vacía"}
              </p>
              <div className="space-y-2">
                {currentOptions.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className="text-gray-700">
                      {option.text || "Opción vacía"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Questions List */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Lista de preguntas
            </h3>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  onClick={() => selectQuestion(question.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentQuestionId === question.id
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      currentQuestionId === question.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-white"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium">
                      {index + 1}. {question.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleSaveDraft}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Guardar Borrador
              </button>
              <button
                onClick={handleActivate}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5" />
                Activar Encuesta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
