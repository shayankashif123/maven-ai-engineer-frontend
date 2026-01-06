import React from 'react';
import { LayoutGrid, ArrowRight, BookOpen, GraduationCap, Code2 } from 'lucide-react';

export default function AssignmentHub() {
  // Generate 12 assignments
  const assignments = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return {
      id,
      // Special name for Assignment 2, generic for others
      id,
      // Generic name for all assignments
      title: `Assignment ${id}`,
      description: id === 2
        ? "Knowledge retrieval system using FastAPI & Gemini 2.0"
        : "Next module in the AI Engineering track.",
      // Path to the specific directory
      path: `/assignments/assignment-${id}`,
      isCompleted: true
    };
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-20">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 text-white">
              <GraduationCap size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Maven AI Engineering
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Course Portfolio & Assignment Repository
          </p>
        </div>
      </header>

      {/* Main Grid Section */}
      <main className="max-w-6xl mx-auto mt-12 px-6">
        <div className="flex items-center gap-2 mb-8 text-slate-400 font-semibold uppercase tracking-widest text-xs">
          <LayoutGrid size={16} />
          <span>Assignment Timeline</span>
        </div>

        {/* 3x4 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={`group block p-8 rounded-3xl transition-all duration-300 border-2 ${item.isCompleted
                ? "bg-white border-blue-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100"
                : "bg-slate-50 border-slate-100 opacity-60 grayscale hover:grayscale-0 cursor-not-allowed"
                }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${item.isCompleted ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-400"}`}>
                  {item.id === 2 ? <Code2 size={24} /> : <BookOpen size={24} />}
                </div>
                <span className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">
                  {item.id.toString().padStart(2, '0')}
                </span>
              </div>

              <h3 className={`text-xl font-bold mb-2 ${item.isCompleted ? "text-slate-800" : "text-slate-500"}`}>
                {item.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {item.description}
              </p>

              {item.isCompleted && (
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  Launch App <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </a>
          ))}
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-20 text-center">
        <div className="inline-block px-6 py-2 bg-slate-200/50 rounded-full text-slate-500 text-xs font-medium">
          Total Modules: 12 | Status: 1/12 Active
        </div>
      </footer>
    </div>
  );
}