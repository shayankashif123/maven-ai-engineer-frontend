"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { uploadDocument, chatWithDocument } from "../../../lib/api";

export default function Assignment2() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error'

    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! Upload a document to start chatting about it.' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);

        try {
            await uploadDocument(file);
            setUploadStatus('success');
            setMessages(prev => [...prev, { role: 'assistant', content: `I've processed ${file.name}. What would you like to know?` }]);
        } catch (error) {
            console.error("Upload failed", error);
            setUploadStatus('error');
        } finally {
            setUploading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            // Optimistic update or wait for response
            const response = await chatWithDocument(userMessage);
            // Assuming response structure { answer: "...", context: "..." } based on RAG pattern
            // If the API returns just a string or different shape, adjust here.
            const answer = response.answer || response.message || JSON.stringify(response);

            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (error) {
            console.error("Chat failed", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error responding to that." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar / Upload Section */}
            <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Knowledge Base</h1>
                    <p className="text-sm text-slate-500">Upload documents to feed the RAG system.</p>
                </div>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center transition-colors hover:border-blue-400">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".txt,.pdf,.md"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Upload size={24} />
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                            {file ? file.name : "Click to upload document"}
                        </span>
                        <span className="text-xs text-slate-400">TXT, PDF, MD supported</span>
                    </label>
                </div>

                {file && (
                    <button
                        onClick={handleUpload}
                        disabled={uploading || uploadStatus === 'success'}
                        className={`mt-4 w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
              ${uploadStatus === 'success'
                                ? "bg-green-100 text-green-700 cursor-default"
                                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                            </>
                        ) : uploadStatus === 'success' ? (
                            "Indexed Successfully"
                        ) : (
                            "Process Document"
                        )}
                    </button>
                )}

                {uploadStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} />
                        Failed to process file.
                    </div>
                )}
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-screen max-h-screen">
                <header className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900">Gemini RAG Assistant</h2>
                            <p className="text-xs text-slate-500">Powered by ChromaDB & LlamaIndex</p>
                        </div>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'}`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-1">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="max-w-3xl mx-auto relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question about your documents..."
                            disabled={loading}
                            className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-3">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </main>
        </div>
    );
}
