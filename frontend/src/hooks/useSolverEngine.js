import { useState } from 'react';

export const useSolverEngine = (dataset, selectedDatasetKey, setSchedule) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('heuristics');
  const [isSolving, setIsSolving] = useState(false);
  const [solverStats, setSolverStats] = useState({
    timeTaken: 0, nodesExpanded: 0, hardViolations: 0, softPenalty: 0, totalCost: 0, iterationsHistory: []
  });
  const [benchmarkResults, setBenchmarkResults] = useState([]);

  const runSolver = async () => {
    setIsSolving(true);
    try {
      const response = await fetch("http://localhost:8000/api/solve", { // http://127.0.0.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithm: selectedAlgorithm, datasetKey: selectedDatasetKey, dataset })
      });
      if (!response.ok) throw new Error("Backend fault");
      const data = await response.json();
      setSchedule(data.schedule);
      setSolverStats(data.stats);

      setBenchmarkResults(prev => [
        ...prev.filter(b => b.algorithm !== selectedAlgorithm || b.dataset !== selectedDatasetKey),
        {
          algorithm: selectedAlgorithm, dataset: selectedDatasetKey, timeTaken: `${data.stats.timeTaken}s`,
          nodesExpanded: data.stats.nodesExpanded, hardViolations: data.stats.hardViolations,
          softPenalty: data.stats.softPenalty, successRate: data.stats.hardViolations === 0 ? '100%' : '0%'
        }
      ]);
    } catch (err) {
      alert("Failed connecting with active local Python Core server process.");
    } finally {
      setIsSolving(false);
    }
  };

  return { selectedAlgorithm, setSelectedAlgorithm, isSolving, solverStats, benchmarkResults, runSolver };
};
