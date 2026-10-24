import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function BenchmarkSuite({ benchmarkResults }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          <span>Experimental Benchmarking Suite (Section 6 Matrix)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-left">
            <thead>
              <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                <th className="p-3">Dataset</th>
                <th className="p-3">Algorithm Variant</th>
                <th className="p-3">Runtime Speed</th>
                <th className="p-3">Nodes / Iterations</th>
                <th className="p-3">Hard Violations</th>
                <th className="p-3">Soft Penalty</th>
                <th className="p-3">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkResults.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-slate-500">
                    No empirical metrics captured yet. Run optimization configurations under the Engine tab.
                  </td>
                </tr>
              ) : (
                benchmarkResults.map((res, i) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-300 uppercase">{res.dataset}</td>
                    <td className="p-3 font-bold text-indigo-400">{res.algorithm}</td>
                    <td className="p-3 text-slate-300">{res.timeTaken}</td>
                    <td className="p-3 text-slate-300">{res.nodesExpanded}</td>
                    <td className={`p-3 font-bold ${res.hardViolations === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {res.hardViolations}
                    </td>
                    <td className="p-3 text-amber-400">{res.softPenalty}</td>
                    <td className="p-3 text-emerald-400 font-semibold">{res.successRate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Algorithmic Performance Analysis</h3>
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            <strong className="text-indigo-400">1. Systematic vs. Local Search:</strong> Systematic backtracking guarantees completeness but triggers exponential domain growth. Local repair methods (Min-Conflicts) discover valid schedules faster on dense, scalable layouts.
          </p>
          <p>
            <strong className="text-purple-400">2. Metaheuristic Quality Polishing:</strong> Integrating Simulated Annealing as a post-processing step reduces distribution gaps (S1-S2) by escaping local minima without affecting hard constraints.
          </p>
        </div>
      </div>
    </div>
  );
}
