import React, { useState } from 'react';
import { queryAI } from '../services/api';
import { Sparkles, Send, Bot, User, Database, RefreshCw } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  "Which brand has the highest average discount?",
  "Which brand has the largest Share of Shelf?",
  "Compare Intel and AMD pricing and compliance.",
  "Which brand has the best retail listing compliance score?",
  "Which brand leads homepage banner share?"
];

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Retail Competitive Intelligence AI Assistant powered by Gemini. Ask me any analytical question about brand pricing, discounts, Share of Shelf, compliance, or visibility across Intel, AMD, Qualcomm, and Apple.',
      contextMetric: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (qText) => {
    const textToQuery = qText || question;
    if (!textToQuery.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: textToQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await queryAI(textToQuery);
      const aiMsg = {
        sender: 'ai',
        text: res.data.answer,
        contextMetric: res.data.contextMetric,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        sender: 'ai',
        text: 'Sorry, I encountered an error while querying database analytics or Gemini API.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-extrabold text-slate-900">Gemini AI Intelligence Assistant</h2>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Ask plain-language questions. Backend aggregates real MongoDB analytics and feeds structured metric context to Gemini.
        </p>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-purple-300 font-medium transition shadow-sm"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`p-2 rounded-lg text-white shrink-0 ${
                  msg.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl p-4 rounded-xl text-xs space-y-1.5 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75 font-semibold">
                  <span>{msg.sender === 'user' ? 'You' : 'Gemini AI Assistant'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>

                {msg.contextMetric && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center space-x-1.5 text-[10px] text-purple-700 font-bold">
                    <Database className="w-3.5 h-3.5" />
                    <span>MongoDB Query Metric: {msg.contextMetric}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-purple-600 text-white shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                <span>Aggregating MongoDB data & querying Gemini AI...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask a question (e.g. Which brand has the highest average discount?)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-bold flex items-center space-x-2 transition shadow-md"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
