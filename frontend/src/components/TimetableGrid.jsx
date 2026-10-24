import React, { useState, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';

export default function TimetableGrid({ schedule, dataset, setActiveTab }) {
  const [viewType, setViewType] = useState('class');
  const [selectedEntityId, setSelectedEntityId] = useState('');

  // Handle setting initial selected entity when view mode toggles
  useEffect(() => {
    if (viewType === 'class' && dataset?.classes?.length > 0) {
      setSelectedEntityId(dataset.classes[0].id);
    } else if (viewType === 'teacher' && dataset?.teachers?.length > 0) {
      setSelectedEntityId(dataset.teachers[0].id);
    } else if (viewType === 'room' && dataset?.rooms?.length > 0) {
      setSelectedEntityId(dataset.rooms[0].id);
    }
  }, [viewType, dataset]);

  const handleCsvExport = async () => {
    try {
      const response = await fetch("http://127.0.0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule)
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'timetable_schedule_report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Export pipeline interrupted.");
    }
  };

  if (!schedule || schedule.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl max-w-7xl mx-auto">
        <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">No Generated Timetable Available</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Please run an AI algorithm from the Solver tab first.</p>
        <button onClick={() => setActiveTab('solver')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">Go to Solver Engine</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-200">
      {/* Filters Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold text-slate-400">View By:</span>
          <div className="flex bg-slate-800 p-1 rounded-lg">
            {['class', 'teacher', 'room'].map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-all capitalize ${viewType === type ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select 
            value={selectedEntityId} 
            onChange={(e) => setSelectedEntityId(e.target.value)} 
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {viewType === 'class' && dataset.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            {viewType === 'teacher' && dataset.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            {viewType === 'room' && dataset.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          
          <button onClick={handleCsvExport} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center space-x-2 transition-all cursor-pointer shadow-md">
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV Sheet</span>
          </button>
        </div>
      </div>

      {/* Grid Calendar Layout Rendering Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
        <table className="w-full border-collapse text-xs text-left">
          <thead>
            <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
              <th className="p-3 border-r border-slate-700 w-24 text-center font-bold">Day / Period</th>
              {Array.from({ length: dataset.config.periodsPerDay }).map((_, pIdx) => (
                <th key={pIdx} className="p-3 border-r border-slate-700 text-center font-semibold">
                  Period {pIdx + 1}
                  {pIdx === dataset.config.lunchPeriod && <span className="block text-[10px] text-amber-400 font-normal">(Lunch Break)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataset.config.days.map((day) => (
              <tr key={day} className="border-b border-slate-800/60 hover:bg-slate-800/20">
                <td className="p-3 font-bold text-slate-300 bg-slate-800/40 border-r border-slate-700 text-center">
                  {day}
                </td>
                {Array.from({ length: dataset.config.periodsPerDay }).map((_, pIdx) => {
                  const isLunch = pIdx === dataset.config.lunchPeriod;

                  if (isLunch && viewType === 'class') {
                    return (
                      <td key={pIdx} className="p-2 border-r border-slate-800 bg-amber-950/20 text-center align-middle">
                        <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-wider">Lunch Break</span>
                      </td>
                    );
                  }

                  // Scan the schedule array matching filter criteria
                  const slotSession = schedule.find(s => {
                    if (s.day !== day || s.period !== pIdx) return false;
                    if (viewType === 'class') return s.classId === selectedEntityId;
                    if (viewType === 'teacher') return s.teacherId === selectedEntityId;
                    if (viewType === 'room') return s.roomId === selectedEntityId;
                    return false;
                  });

                  const subject = slotSession ? dataset.subjects.find(sub => sub.code === slotSession.subjectCode) : null;
                  const room = slotSession ? dataset.rooms.find(r => r.id === slotSession.roomId) : null;
                  const teacher = slotSession ? dataset.teachers.find(t => t.id === slotSession.teacherId) : null;
                  const cls = slotSession ? dataset.classes.find(c => c.id === slotSession.classId) : null;

                  return (
                    <td key={pIdx} className="p-2 border-r border-slate-800 min-w-[140px] h-24 align-top">
                      {slotSession ? (
                        <div className={`h-full p-2 rounded-lg border flex flex-col justify-between ${
                          subject?.type === 'lab' 
                            ? 'bg-purple-950/50 border-purple-800/80 text-purple-200 shadow-sm' 
                            : 'bg-indigo-950/50 border-indigo-800/80 text-indigo-200 shadow-sm'
                        }`}>
                          <div className="font-bold flex justify-between items-start">
                            <span className="truncate max-w-[80px]">{slotSession.subjectCode}</span>
                            <span className="text-[8px] px-1 py-0.2 rounded bg-slate-800 text-slate-300 uppercase scale-90">
                              {subject?.type || "theory"}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                            {viewType !== 'class' && <div className="truncate">Cls: <span className="text-slate-200 font-medium">{cls?.name || slotSession.classId}</span></div>}
                            {viewType !== 'teacher' && <div className="truncate">Tchr: <span className="text-slate-200 font-medium">{teacher?.name || slotSession.teacherId}</span></div>}
                            {viewType !== 'room' && <div className="truncate">Room: <span className="text-slate-200 font-medium">{room?.name || slotSession.roomId}</span></div>}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full border border-dashed border-slate-800/60 rounded-lg flex items-center justify-center text-slate-600 text-[10px] bg-slate-950/30">
                          Free
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
