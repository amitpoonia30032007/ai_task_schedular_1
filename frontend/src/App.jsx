import React, { useState, useEffect } from 'react';
import { Layers, Zap, Calendar, Shuffle, BarChart2, Code } from 'lucide-react';
import { SAMPLE_DATASETS } from './constants/datasets';
import { useSolverEngine } from './hooks/useSolverEngine';

// All View Imports
import DataManagement from './components/DataManagement';
import SolverEngine from './components/SolverEngine';
import TimetableGrid from './components/TimetableGrid';
import InteractiveEditor from './components/InteractiveEditor';
import BenchmarkSuite from './components/BenchmarkSuite';
import SourceViewer from './components/SourceViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('small');
  const [dataset, setDataset] = useState(SAMPLE_DATASETS.small);
  const [schedule, setSchedule] = useState([]);
  const [validationResult, setValidationResult] = useState({ valid: true, messages: ["Dataset Synced Cleanly with Backend Engine"] });

  const { selectedAlgorithm, setSelectedAlgorithm, isSolving, solverStats, benchmarkResults, runSolver } = useSolverEngine(dataset, selectedDatasetKey, setSchedule);

  const navItems = [
    { id: 'editor', label: '1. Data Management', icon: Layers },
    { id: 'solver', label: '2. AI Solver Engine', icon: Zap },
    { id: 'viewer', label: '3. Timetable Grid', icon: Calendar },
    { id: 'manual', label: '4. Interactive Editor', icon: Shuffle },
    { id: 'benchmark', label: '5. Experiments', icon: BarChart2 },
    { id: 'code', label: '6. Reference Code', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Timetable Scheduler</h1>
        <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button onClick={() => { setSelectedDatasetKey('small'); setDataset(SAMPLE_DATASETS.small); setSchedule([]); }} className={`px-3 py-1.5 text-xs font-medium rounded-md ${selectedDatasetKey === 'small' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Small Dataset</button>
        </div>
      </header>

      <nav className="border-b border-slate-800 bg-slate-900/40 px-6 flex space-x-8 text-sm">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 py-3.5 border-b-2 font-medium ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'editor' && <DataManagement dataset={dataset} setDataset={setDataset} validationResult={validationResult} />}
        {activeTab === 'solver' && <SolverEngine selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm} isSolving={isSolving} solverStats={solverStats} runSolver={runSolver} scheduleHasData={schedule.length > 0} />}
        {activeTab === 'viewer' && <TimetableGrid schedule={schedule} dataset={dataset} setActiveTab={setActiveTab} />}
        {activeTab === 'manual' && <InteractiveEditor schedule={schedule} setSchedule={setSchedule} dataset={dataset} />}
        {activeTab === 'benchmark' && <BenchmarkSuite benchmarkResults={benchmarkResults} />}
        {activeTab === 'code' && <SourceViewer />}
      </main>
    </div>
  );
}
