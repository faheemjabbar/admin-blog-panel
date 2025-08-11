import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// Inline SVG icons to avoid external library dependencies like lucide-react
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.2l-5.3-5.3a2.25 2.25 0 0 0-4.5 0v5.3c-.8.5-1.3 1.2-1.5 2.2A4 4 0 0 0 1 18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2 4 4 0 0 0-4-4Z"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );

// A custom modal component to avoid using window.alert or window.prompt
const MessageModal = ({ message, onClose }) => {
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <XIcon />
          </button>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Notification</h3>
            <p className="text-gray-700 dark:text-gray-300">{message}</p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

// The main SEO Tools component
export default function App() {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [keywordResult, setKeywordResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metaDescription, setMetaDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');

  // Define the API key for the Gemini API. This will be provided by the Canvas environment.
  const apiKey = "AIzaSyDWGM4YaH0WxZHdND8PgvCI7ZCAcco4SIU";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  // Function to handle keyword analysis using the Gemini API
  const handleKeywordSearch = async () => {
    if (!keyword.trim()) {
      setMessage('Please enter a keyword to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setKeywordResult(null);
    setMessage('');

    try {
      const prompt = `Act as a senior SEO specialist. Analyze the keyword "${keyword}" and provide a qualitative assessment of its search volume and difficulty, along with a list of 5 related long-tail keywords. The search volume should be categorized as either 'Low', 'Medium', or 'High'. The difficulty should be categorized as 'Easy', 'Moderate', or 'Hard'. The response MUST be a JSON object with keys "volume", "difficulty", and "relatedKeywords".`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "volume": { "type": "STRING" },
              "difficulty": { "type": "STRING" },
              "relatedKeywords": { "type": "ARRAY", "items": { "type": "STRING" } }
            },
            "propertyOrdering": ["volume", "difficulty", "relatedKeywords"]
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to analyze keyword.');
      }

      const result = await response.json();
      const jsonText = result.candidates[0].content.parts[0].text;
      const parsedJson = JSON.parse(jsonText);
      setKeywordResult(parsedJson);

    } catch (err) {
      console.error('API Error:', err);
      setMessage(`Could not analyze keyword: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to handle meta description generation using the Gemini API
  const handleGenerateMetaDescription = async () => {
    if (!title.trim() && !body.trim()) {
      setMessage('Please provide a title or body text to generate a meta description.');
      return;
    }

    setIsGenerating(true);
    setMetaDescription('');
    setMessage('');

    try {
      const prompt = `Act as a copywriter for a website. Generate a concise, compelling meta description for a webpage. The description should be between 150-160 characters and include the main ideas from the following content:
      Title: "${title}"
      Body: "${body}"`;

      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate meta description.');
      }

      const result = await response.json();
      const description = result.candidates[0].content.parts[0].text;
      setMetaDescription(description);

    } catch (err) {
      console.error('API Error:', err);
      setMessage(`Could not generate meta description: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">SEO Toolkit</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Harness the power of AI to optimize your content.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Keyword Analyzer Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
            <SearchIcon /> AI Keyword Analyzer
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enter a keyword and get a qualitative analysis of its potential and related terms.
          </p>
          <div className="flex gap-4 mb-6">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., responsive design"
              disabled={isAnalyzing}
            />
            <button
              onClick={handleKeywordSearch}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? <LoaderIcon className="animate-spin" /> : <SearchIcon />}
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {keywordResult && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-300">
              <p className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-2">Analysis Results:</p>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Search Volume: <span className="font-normal">{keywordResult.volume}</span>
              </p>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Difficulty: <span className="font-normal">{keywordResult.difficulty}</span>
              </p>
              <p className="font-semibold text-gray-700 dark:text-gray-300 mt-4">Related Keywords:</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 pl-4">
                {keywordResult.relatedKeywords.map((r, i) => (
                  <li key={i} className="mb-1">{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Meta Description Generator Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-indigo-700 dark:text-indigo-300">
            <LightbulbIcon /> AI Meta Description Generator
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Provide a title and some text, and the AI will create a compelling meta description.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., A Guide to Modern Web Development"
              disabled={isGenerating}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body Content (optional)</label>
            <textarea
              rows="5"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste some of your page content here for a more specific description."
              disabled={isGenerating}
            />
          </div>
          <div className="mb-6">
            <textarea
              rows="3"
              value={metaDescription || (isGenerating ? 'Generating...' : '')}
              readOnly
              className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none text-sm"
              placeholder="Your generated meta description will appear here."
            />
          </div>
          <button
            onClick={handleGenerateMetaDescription}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? <LoaderIcon className="animate-spin" /> : <LightbulbIcon />}
            {isGenerating ? 'Generating...' : 'Generate Description'}
          </button>
        </div>

      </div>

      {/* Global Message Display */}
      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </div>
  );
}
