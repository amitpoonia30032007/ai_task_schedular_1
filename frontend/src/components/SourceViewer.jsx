import React from 'react';
import { Code, FileText } from 'lucide-react';

export default function SourceViewer() {
  const pythonCode = `# backend/engine.py - Full-Stack CSP Architecture Core
class TimetableEngine:
    def __init__(self, dataset):
        self.dataset = dataset
        self.variables = []
        # CSP Variable definitions are handled here...`;

  const latexCode = `\\section{Problem Formulation}
The university lecture scheduling matrix task is modeled as a standard Constraint Satisfaction Problem (CSP) tuple $(V, D, C)$...`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 mb-3">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Active Python Architecture Component (`engine.py`)</span>
        </h3>
        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-48 border border-slate-800">
          {pythonCode}
        </pre>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 mb-3">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Project Report Academic Latex Schema Blueprint (`report.tex`)</span>
        </h3>
        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-purple-300/80 overflow-x-auto max-h-48 border border-slate-800">
          {latexCode}
        </pre>
      </div>
    </div>
  );
}
