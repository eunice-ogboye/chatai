"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [summary, setSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en"); // Default to English

  // Handle sending text
  const handleSend = async () => {
    if (!inputText.trim()) return;

    setOutputText(inputText);

    // Detect language using Chrome AI API
    const language = await detectLanguage(inputText);
    setDetectedLanguage(language);

    setInputText(""); // Clear input
  };

  // Handle summarization
  const handleSummarize = async () => {
    if (outputText.length > 150 && detectedLanguage === "en") {
      const summaryText = await summarizeText(outputText);
      setSummary(summaryText);
    } else {
      alert("Summarization is only available for English text longer than 150 characters.");
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    if (outputText) {
      const translatedText = await translateText(outputText, targetLanguage);
      setTranslation(translatedText);
    }
  };

  // Language detection using Chrome's AI API
  const detectLanguage = async (text) => {
    try {
      const processor = new TextProcessor();
      const detection = await processor.detectLanguage(text);
      return detection.language;
    } catch (error) {
      console.error("Language detection error:", error);
      alert("Failed to detect language.");
      return "";
    }
  };

  // Summarization using Chrome's AI API
  const summarizeText = async (text) => {
    try {
      const processor = new TextProcessor();
      const summary = await processor.summarize(text);
      return summary.summary;
    } catch (error) {
      console.error("Summarization error:", error);
      alert("Failed to summarize text.");
      return "";
    }
  };

  // Translation using Chrome's AI API
  const translateText = async (text, targetLanguage) => {
    try {
      const processor = new TextProcessor();
      const translation = await processor.translate(text, targetLanguage);
      return translation.text;
    } catch (error) {
      console.error("Translation error:", error);
      alert("Failed to translate text.");
      return "";
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* Output Area */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white border rounded shadow">
        <p className="text-gray-800">{outputText}</p>
        {detectedLanguage && (
          <p className="text-sm text-gray-500 mt-2">Detected Language: {detectedLanguage}</p>
        )}
        {summary && (
          <div className="mt-4">
            <p className="font-semibold text-gray-800">Summary:</p>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
        {translation && (
          <div className="mt-4">
            <p className="font-semibold text-gray-800">Translation:</p>
            <p className="text-gray-700">{translation}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste text here"
          className="flex-1 p-2 border rounded resize-none"
          rows={3}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label="Send message"
        >
          Send
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        {outputText.length > 150 && detectedLanguage === "en" && (
          <button
            onClick={handleSummarize}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Summarize
          </button>
        )}
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="en">English</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
          <option value="ru">Russian</option>
          <option value="tr">Turkish</option>
          <option value="fr">French</option>
        </select>
        <button
          onClick={handleTranslate}
          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Translate
        </button>
      </div>
    </div>
  );
}
