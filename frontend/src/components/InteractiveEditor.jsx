import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export default function InteractiveEditor({ schedule, setSchedule, dataset }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [violations, setViolations] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (schedule.length > 0) {
      const validateScheduleWithBackend = async () => {
        setIsValidating(true);
        try {
          const response = await fetch("http://127.0.0", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schedule, dataset })
          });
          const data = await response.json();
          setViolations(data.violationList || []);
        } catch (err) {
          console.error("Validation error:", err);
        } finally {
          setIsValidating(false);
        }
      };

      const delayDebounce = setTimeout(() => {
        validateScheduleWithBackend();
      }, 400); // Debounce network traffic safely

      return () => clearTimeout(delayDebounce);
    }
  }, [schedule, dataset]);

  const moveSessionSlot = (sessionId, targetDay, targetPeriod) => {
    setSchedule(prev => prev.map(item => {
      if (item.id === sessionId) {
        return { ...item, day: targetDay, period: targetPeriod };
      }
      return item;
    }));
    if (selectedSession && selectedSession.id === sessionId) {
      setSelectedSession(prev => ({ ...prev, day: targetDay, period: targetPeriod }));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
        <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Real-Time Python Hard Constraint Violations Detector ({violations.length})</span>
          </div>
          {isValidating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />}
        </h3>
        {violations.length === 0 ? (
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 rounded-lg text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Valid Schedule! Zero hard constraint violations detected by server.</span>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {violations.map((conf, idx) => (
              <div key={idx} className="p-2 bg-rose-950/30 border border-rose-800/50 text-rose-300 rounded text-xs">• {conf}</div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3">1. Select Session to Relocate</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {schedule.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedSession(item)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedSession?.id === item.id 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">{item.classId} - {item.subjectCode}</div>
                <div className="text-[10px] opacity-80 mt-1">
                  Currently: {item.day} | Period {item.period + 1} | Room {item.roomId}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3">2. Target Slot Grid (Click to Shift)</h4>
          {selectedSession ? (
            <div className="grid grid-cols-5 gap-2">
              {dataset.config.days.map((day) => (
                <div key={day} className="space-y-2">
                  <div className="text-center font-bold text-xs text-indigo-400 py-1 bg-slate-800 rounded">{day}</div>
                  {Array.from({ length: dataset.config.periodsPerDay }).map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => moveSessionSlot(selectedSession.id, day, pIdx)}
                      className="w-full p-2 bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 rounded text-[11px] text-slate-300 hover:border-indigo-500 transition-all text-center"
                    >
                      Period {pIdx + 1}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Please select a session from the left column to view valid move slots.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
