import React from 'react';
import { Zap, Play, RefreshCw, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SolverEngine({ 
  selectedAlgorithm, 
  setSelectedAlgorithm, 
  isSolving, 
  solverStats, 
  runSolver,
  scheduleHasData 
}) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <span>Select Scheduling Algorithm</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 'plain_backtracking', name: 'Plain Backtracking', badge: 'Baseline', desc: 'Standard systematic search without heuristics.' },
            { id: 'heuristics', name: 'Backtracking + Heuristics', badge: 'Recommended', desc: 'MRV + Degree + LCV + Forward Checking.' },
            { id: 'min_conflicts', name: 'Min-Conflicts Search', badge: 'Local Search', desc: 'Iterative repair with random walk plateau escape.' },
            { id: 'sa', name: 'Simulated Annealing', badge: 'Metaheuristic', desc: 'Probabilistic hill climbing with cooling schedule.' },
            { id: 'hybrid', name: 'Hybrid CSP + SA', badge: 'Advanced Solution', desc: 'Backtracking for hard constraints + SA for soft tuning.' },
          ].map((algo) => (
            <div
              key={algo.id}
              onClick={() => setSelectedAlgorithm(algo.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedAlgorithm === algo.id
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-300 px-2 py-0.5 bg-indigo-500/20 rounded-full">
                  {algo.badge}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-slate-100">{algo.name}</h3>
              <p className="text-xs text-slate-400 mt-2">{algo.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
          <div className="text-xs text-slate-400">
            Target Cost Function: <span className="font-mono text-indigo-300">Cost = 1000 × Hard Violations + Soft Penalty</span>
          </div>
          <button
            onClick={runSolver}
            disabled={isSolving}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {isSolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isSolving ? 'Running Algorithm Search...' : 'Run Selected Algorithm'}</span>
          </button>
        </div>
      </div>

      {scheduleHasData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Time Taken</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{solverStats.timeTaken}s</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Nodes / Iterations</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{solverStats.nodesExpanded}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Hard Violations</div>
            <div className={`text-2xl font-bold mt-1 ${solverStats.hardViolations === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {solverStats.hardViolations}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">Soft Penalty Score</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{solverStats.softPenalty}</div>
          </div>
        </div>
      )}

      {solverStats.iterationsHistory && solverStats.iterationsHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Cost Function vs. Iterations Curve</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={solverStats.iterationsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="iter" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="cost" stroke="#818cf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
