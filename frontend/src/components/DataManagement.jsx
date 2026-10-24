import React, { useRef, useState } from 'react';
import { Home, User, BookOpen, CheckCircle, AlertTriangle, Upload } from 'lucide-react';

export default function DataManagement({ dataset, setDataset, validationResult }) {
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState(null);

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.config || !parsed.classes || !parsed.teachers || !parsed.subjects || !parsed.rooms) {
          throw new Error("Missing required fields.");
        }
        setUploadError(null);
        setDataset(parsed);
      } catch (err) {
        setUploadError(`Invalid JSON Structure: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
        <h3 className="font-bold text-sm text-slate-200 mb-2 flex items-center space-x-2">
          <Upload className="w-4 h-4 text-indigo-400" />
          <span>Import Custom Institutional Matrix Dataset</span>
        </h3>
        <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 cursor-pointer">Choose JSON File</button>
        <input type="file" ref={fileInputRef} onChange={handleJsonUpload} accept=".json" className="hidden" />
        {uploadError && <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-300">{uploadError}</div>}
      </div>

      <div className={`p-4 rounded-xl border flex items-start space-x-3 ${validationResult.valid ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' : 'bg-rose-950/30 border-rose-800/50 text-rose-300'}`}>
        {validationResult.valid ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
        <div>
          <h3 className="font-semibold text-sm">Dataset Feasibility Status</h3>
          <ul className="text-xs space-y-1 mt-1 opacity-90">{validationResult.messages.map((m, i) => <li key={i}>• {m}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
