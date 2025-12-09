"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigreeFunction: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [invalidFields, setInvalidFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setInvalidFields((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const validateForm = () => {
    const newInvalidFields = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value === "" || isNaN(value) || Number(value) < 0) {
        newInvalidFields[key] = true;
        isValid = false;
      }
    });

    setInvalidFields(newInvalidFields);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!validateForm()) {
      setError("Please fill in all fields with valid numeric values.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setError("API URL missing — check NEXT_PUBLIC_API_URL in Vercel.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Pregnancies: Number(formData.pregnancies),
          Glucose: Number(formData.glucose),
          BloodPressure: Number(formData.bloodPressure),
          SkinThickness: Number(formData.skinThickness),
          Insulin: Number(formData.insulin),
          BMI: Number(formData.bmi),
          DiabetesPedigreeFunction: Number(formData.diabetesPedigreeFunction),
          Age: Number(formData.age),
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      setResult({
        prediction: data.prediction === 1 ? "Diabetic" : "Not Diabetic",
        probability: Math.round(data.probability * 100),
      });
    } catch (err) {
      console.error(err);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10 animate-fade-in">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 text-balance">
              Diabetes Prediction
            </h1>
            <p className="text-lg text-blue-100">
              Enter your health metrics to predict diabetes risk with advanced ML
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl backdrop-blur-sm animate-fade-in">
              <p className="text-red-100 text-sm font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div
              className={`mb-6 p-6 rounded-xl border backdrop-blur-sm animate-fade-in ${
                result.prediction === "Diabetic"
                  ? "bg-orange-500/10 border-orange-400/30"
                  : "bg-green-500/10 border-green-400/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    result.prediction === "Diabetic"
                      ? "bg-orange-400"
                      : "bg-green-400"
                  }`}
                ></div>
                <div>
                  <p
                    className={`text-lg font-bold ${
                      result.prediction === "Diabetic"
                        ? "text-orange-100"
                        : "text-green-100"
                    }`}
                  >
                    Prediction: {result.prediction}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      result.prediction === "Diabetic"
                        ? "text-orange-200"
                        : "text-green-200"
                    }`}
                  >
                    Probability: {result.probability}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Pregnancies", name: "pregnancies" },
                { label: "Glucose (mg/dL)", name: "glucose" },
                { label: "Blood Pressure (mmHg)", name: "bloodPressure" },
                { label: "Skin Thickness (mm)", name: "skinThickness" },
                { label: "Insulin (IU/mL)", name: "insulin" },
                { label: "BMI (kg/m²)", name: "bmi" },
                { label: "Diabetes Pedigree", name: "diabetesPedigreeFunction" },
                { label: "Age (years)", name: "age" },
              ].map((field) => (
                <div key={field.name} className="group">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-semibold text-blue-100 mb-2 transition-colors group-focus-within:text-white"
                  >
                    {field.label}
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder="Enter value"
                    step="0.01"
                    className={`w-full px-5 py-3 text-base font-medium rounded-xl backdrop-blur-sm transition-all duration-300 outline-none ${
                      invalidFields[field.name]
                        ? "bg-red-500/20 border-2 border-red-400/50 text-red-100 placeholder-red-300/50"
                        : "bg-white/10 border-2 border-white/20 text-white placeholder-white/40 hover:bg-white/20 focus:bg-white/30 focus:border-blue-300/50 focus:shadow-lg focus:shadow-blue-500/20"
                    }`}
                  />
                  {invalidFields[field.name] && (
                    <p className="text-red-300 text-xs mt-2 font-medium">
                      Please enter a valid number
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:scale-100 hover:shadow-xl hover:shadow-blue-500/50 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                  <span>Predicting...</span>
                </>
              ) : (
                <span>Get Prediction</span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-center text-sm text-blue-100/80 font-medium">
              ⚕️ Always consult a healthcare professional for medical advice.
              This is a prediction tool only.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
