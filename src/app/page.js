"use client";

import { useState } from "react";

export default function TextProcessor() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [showSummarizeButton, setShowSummarizeButton] = useState(false);
  const [showTranslateButton, setShowTranslateButton] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleSend = async () => {
    if (!text.trim()) return;

    const newMessages = [...messages, { sender: "You", text }];
    setMessages(newMessages);
    setText("");

    const language = await detectLanguage(text);
    setDetectedLanguage(language);
    newMessages.push({ sender: "AI", text: `Detected Language: ${language}` });

    if (language === "en" && text.length > 150) {
      setShowSummarizeButton(true);
    } else {
      setShowSummarizeButton(false);
    }

    setShowTranslateButton(true);
    setMessages([...newMessages]);
  };

  const handleSummarize = async () => {
    if (!messages.length) return;
    const lastUserMessage = messages.findLast(msg => msg.sender === "You");
    if (!lastUserMessage) return;
    
    const summary = summarizeText(lastUserMessage.text);
    setMessages([...messages, { sender: "AI", text: `Summary: ${summary}` }]);
  };

  const handleTranslate = async () => {
    if (!messages.length) return;
    const lastUserMessage = messages.findLast(msg => msg.sender === "You");
    if (!lastUserMessage) return;
    
    const translatedText = await getTranslation(lastUserMessage.text, selectedLanguage);
    setMessages([...messages, { sender: "AI", text: `Translated: ${translatedText}` }]);
  };

  async function detectLanguage(inputText) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(inputText)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data[2] || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  }

  async function getTranslation(text, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data[0].map((item) => item[0]).join(" ") || "Translation unavailable.";
    } catch (error) {
      return "Translation unavailable.";
    }
  }

  function summarizeText(inputText, numSentences = 3) {
    const sentences = inputText.split(". ");
    if (sentences.length <= numSentences) return inputText;

    const wordCounts = {};
    inputText
      .toLowerCase()
      .match(/\b(\w+)\b/g)
      .forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });

    const scoredSentences = sentences.map((sentence) => {
      const words = sentence.toLowerCase().match(/\b(\w+)\b/g) || [];
      return {
        sentence,
        score: words.reduce((sum, word) => sum + (wordCounts[word] || 0), 0),
      };
    });

    return (
      scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, numSentences)
        .map((s) => s.sentence)
        .join(". ") + "."
    );
  }

  return (
    <div className="p-4">
       <div class="bg-gray-500 p-4 text-white text-center font-bold text-lg">
        AI Text Processor
      </div>
      <div className="border p-4 h-64 sm:h-96 overflow-auto mb-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-1/2 p-2 border rounded"
        placeholder="Enter text..."
      ></textarea>
      <button onClick={handleSend} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
      {showSummarizeButton && (
        <button onClick={handleSummarize} className="mt-2 ml-2 px-4 py-2 bg-purple-500 text-white rounded">
          Summarize
        </button>
      )}
      {showTranslateButton && (
        <div className="mt-2 flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded-md border border-gray-300"
          >
            {["en", "pt", "es", "ru", "tr", "fr"].map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
          <button onClick={handleTranslate} className="px-4 py-2 bg-yellow-500 text-white rounded">
            Translate
          </button>
        </div>
      )}
    </div>
  );
}
