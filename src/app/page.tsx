"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Circle, Clock, GraduationCap, 
  Plus, Trash2, Edit3, X, School, Award, Briefcase,
  Quote, CheckSquare, BarChart3, ChevronDown, 
  ChevronRight, Moon, Sun, PartyPopper, Archive, 
  Trophy, LayoutGrid, CircleDollarSign, Flame
} from 'lucide-react';

// --- Types ---
type AppType = 'School' | 'Scholarship' | 'Assistantship';
type DegreeType = 'Bachelors' | 'Masters' | 'PhD' | 'Diploma' | 'Certification';
type AppStatus = 'In Progress' | 'Submitted' | 'Pending' | 'Waitlisted' | 'Accepted';
type Priority = 'High' | 'Medium' | 'Low';

interface Todo { id: string; text: string; completed: boolean; date: string; priority: Priority; }
interface Application {
  id: string; name: string; type: AppType; degree: DegreeType;
  programName: string; deadline: string; status: AppStatus; 
  fee: string; priority: Priority;
  docs: { id: string; label: string; done: boolean }[];
}

const PRESET_DOCS = ["CV / Resume", "Statement of Purpose", "Transcripts", "Letters of Rec", "Passport", "GRE Scores"];
const QUOTES = [
  "The future is as bright as your aura today.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Your growth is the best return on investment.",
  "Success is the sum of small efforts, repeated day in and day out."
];

// Inline-style helper so priority borders always render regardless of
// Tailwind build/purge/dark-mode config quirks.
function getPriorityBorderStyle(priority: Priority, width: number, isDarkMode: boolean): React.CSSProperties {
  if (priority === 'High') return { borderLeftWidth: width, borderLeftStyle: 'solid' as const, borderLeftColor: '#b69121' };
  if (priority === 'Medium') return { borderLeftWidth: width, borderLeftStyle: 'solid' as const, borderLeftColor: isDarkMode ? '#34d399' : '#064e3b' };
  return { borderLeftWidth: width, borderLeftStyle: 'solid' as const, borderLeftColor: 'transparent' };
}

export default function AuraScholarFinal() {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingApp, setEditingApp] = useState<Partial<Application> | null>(null);
  const [celebration, setCelebration] = useState<{show: boolean, msg: string}>({show: false, msg: ""});
  const [randomQuote, setRandomQuote] = useState("");
  const [sections, setSections] = useState({ portfolio: true, archive: false, winners: true });
  const [customDocText, setCustomDocText] = useState("");

  useEffect(() => {
    const savedApps = localStorage.getItem('aura-v11-apps');
    const savedTodos = localStorage.getItem('aura-v11-todos');
    const savedTheme = localStorage.getItem('aura-v11-theme');
    if (savedApps) setApps(JSON.parse(savedApps));
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('aura-v11-apps', JSON.stringify(apps));
      localStorage.setItem('aura-v11-todos', JSON.stringify(todos));
      localStorage.setItem('aura-v11-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [apps, todos, isDarkMode, mounted]);

  const addCustomDoc = () => {
    const label = customDocText.trim();
    if (!editingApp || !label) return;
    if (editingApp.docs?.some((d: any) => d.label.toLowerCase() === label.toLowerCase())) { setCustomDocText(""); return; }
    setEditingApp({ ...editingApp, docs: [...(editingApp.docs || []), { id: Math.random().toString(), label, done: false }] });
    setCustomDocText("");
  };

  const saveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    const finalApp = { ...editingApp, id: editingApp.id || Date.now().toString(), docs: editingApp.docs || [], fee: editingApp.fee || "", priority: editingApp.priority || "Medium" } as Application;
    setApps(prev => {
      const exists = prev.find(a => a.id === finalApp.id);
      if (exists) return prev.map(a => a.id === finalApp.id ? finalApp : a);
      return [finalApp, ...prev];
    });
    setEditingApp(null);
    setCustomDocText("");
  };

  const updateAppStatus = (id: string, status: AppStatus) => {
    if (['Submitted', 'Accepted'].includes(status)) {
      setCelebration({ show: true, msg: status === 'Accepted' ? "CONGRATULATIONS! SUCCESS ACHIEVED!" : "SUBMITTED! AURA INCREASED." });
      setTimeout(() => setCelebration({show: false, msg: ""}), 4000);
    }
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const detailedAnalytics = useMemo(() => {
    const total = apps.length;
    const completed = apps.filter(a => ['Submitted', 'Accepted'].includes(a.status)).length;
    const counts = apps.reduce((acc: any, app) => {
      acc[app.degree] = (acc[app.degree] || 0) + 1;
      acc[app.type] = (acc[app.type] || 0) + 1;
      return acc;
    }, {});
    return { total, percent: total ? Math.round((completed/total)*100) : 0, counts };
  }, [apps]);

  const activeApps = apps.filter(a => !['Submitted', 'Accepted'].includes(a.status));
  const submittedApps = apps.filter(a => a.status === 'Submitted');
  const acceptedApps = apps.filter(a => a.status === 'Accepted');

  const groupedTodos = useMemo(() => {
    const groups: Record<string, Record<string, Record<string, Todo[]>>> = {};
    [...todos].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(todo => {
      const d = new Date(todo.date);
      const month = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      const week = `Week ${Math.ceil(d.getDate() / 7)}`;
      const day = d.toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'short' });
      if (!groups[month]) groups[month] = {};
      if (!groups[month][week]) groups[month][week] = {};
      if (!groups[month][week][day]) groups[month][week][day] = [];
      groups[month][week][day].push(todo);
    });
    return groups;
  }, [todos]);

  if (!mounted) return null;

  return (
    <div className={`${isDarkMode ? 'dark bg-[#080b14] text-slate-100' : 'bg-[#e2e5e3] text-slate-950'} min-h-screen transition-all duration-700 pb-20 overflow-x-hidden text-left`}>
      
      {/* CELEBRATION MESSAGE */}
      {celebration.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] bg-[#b2a4d4] text-white px-8 py-4 rounded-full shadow-2xl font-black tracking-widest animate-bounce border-4 border-white flex items-center gap-3">
          <PartyPopper size={20} /> {celebration.msg}
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-[#0a4d3c]/40' : 'bg-[#9fb7a9]/50'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-[#401a66]/40' : 'bg-[#bbaed6]/50'}`} />
        {isDarkMode && <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[130px] bg-amber-600/10 opacity-60" />}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#89b4b0] to-[#b2a4d4] rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold dark:text-white leading-none mb-2">Aura Scholar</h1>
              <p className="text-[#3a5a57] dark:text-[#89b4b0] text-[10px] font-black tracking-[0.3em] uppercase opacity-90 leading-none">Curating your academic journey</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-lg">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-full hover:bg-white/40 dark:text-white transition-all outline-none">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20} className="text-slate-950"/>}
            </button>
            <div className="h-6 w-[1px] bg-slate-400/40" />
            <button onClick={() => setIsAdmin(!isAdmin)} className={`px-6 py-2 rounded-2xl text-[10px] font-black transition-all outline-none ${isAdmin ? 'bg-[#89b4b0] text-white shadow-md' : 'text-slate-950 dark:text-slate-400'}`}>
              {isAdmin ? 'ADMIN MODE' : 'GUEST MODE'}
            </button>
          </div>
        </header>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-[3rem] md:rounded-[4rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl">
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
              <svg viewBox="0 0 192 192" className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-300 dark:text-slate-800" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="14" fill="transparent" 
                  strokeDasharray={552} strokeDashoffset={552 - (552 * detailedAnalytics.percent) / 100}
                  className="text-[#89b4b0] transition-all duration-1000 stroke-round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black dark:text-white">{detailedAnalytics.percent}%</span>
                <span className="text-[10px] font-bold text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest">Strength</span>
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3a5a57] dark:text-[#89b4b0] mb-6 flex items-center gap-2 font-mono"><BarChart3 size={16}/> Detailed Portfolio Intelligence</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(detailedAnalytics.counts).map(([k, v]) => (
                  <div key={k} className="p-4 bg-white/70 dark:bg-white/10 rounded-3xl border border-white/20 shadow-sm">
                    <span className="block text-[9px] font-black text-slate-700 dark:text-slate-500 uppercase mb-1">{k}</span>
                    <span className="text-xl font-bold dark:text-white text-slate-900">{v as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#89b4b0]/20 to-amber-500/20 p-10 rounded-[3rem] md:rounded-[4rem] border border-white/40 dark:border-white/10 flex flex-col justify-center items-center text-center shadow-lg">
            <Quote className="text-[#89b4b0] mb-6 opacity-60" size={40} />
            <p className="text-2xl font-serif italic dark:text-slate-200 text-slate-800 leading-tight">"{randomQuote}"</p>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3a5a57] dark:text-[#89b4b0] mt-4">Aura Scholar Wisdom</span>
          </div>
        </div>

        {/* Daily Momentum */}
        <section className="mb-20 px-2 text-left">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-[#4c3e7a] dark:text-[#b2a4d4] flex items-center gap-2 font-mono italic">
              <CheckSquare size={18}/> temporal intention flow
            </h2>
            {isAdmin && (
              <button onClick={() => setTodos([{id: Date.now().toString(), text: '', completed: false, date: new Date().toISOString().split('T')[0], priority: 'Low'}, ...todos])} 
                className="bg-[#b2a4d4] text-white p-2.5 md:p-3 rounded-full shadow-2xl hover:scale-110 transition-all outline-none"><Plus size={24}/></button>
            )}
          </div>

      <div className="space-y-6">
        {Object.entries(groupedTodos).map(([month, weeks]) => (
          <details key={month} className="group/month overflow-hidden bg-white/40 dark:bg-white/5 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/30 dark:border-white/5 shadow-sm" open>
          <summary className="flex items-center justify-between p-8 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-all select-none outline-none">
            <span className="text-2xl font-serif font-bold text-[#4c3e7a] dark:text-white leading-none">{month}</span>
            <ChevronDown className="group-open/month:rotate-180 transition-transform text-slate-400" />
          </summary>
          <div className="px-5 md:px-8 pb-8 space-y-8">
            {Object.entries(weeks).map(([week, days]) => (
              <details key={week} className="group/week" open>
                <summary className="flex items-center gap-2 text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-[0.4em] mb-4 cursor-pointer outline-none select-none">
                    <ChevronRight className="group-open/week:rotate-90 transition-transform" size={14}/> {week} Summary
                </summary>
                <div className="space-y-6 pl-5 md:pl-6 border-l-2 border-[#89b4b0]/20 ml-2">
          {Object.entries(days).map(([day, items]) => (
            <details key={day} className="group/day" open>
              <summary className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-3 cursor-pointer flex items-center gap-2 outline-none select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#b2a4d4]/40" /> {day}
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {items.map(todo => (
                  <div key={todo.id} className="flex items-center gap-4 bg-white/60 dark:bg-white/10 p-4 rounded-3xl border border-white dark:border-white/5 group/task transition-all shadow-sm" style={getPriorityBorderStyle(todo.priority, 6, isDarkMode)}>
                    <button onClick={() => isAdmin && setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))} className="outline-none shrink-0">
                      {todo.completed ? <CheckCircle2 size={22} className="text-[#89b4b0]" /> : <Circle size={22} className="text-slate-400 dark:text-slate-800" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <input type="date" value={todo.date} disabled={!isAdmin} onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, date: e.target.value} : t))} className="bg-transparent border-none p-0 text-[8px] font-black text-[#3a5a57] dark:text-slate-500 w-24 focus:ring-0 cursor-pointer mb-1 outline-none opacity-60" />
                        {isAdmin && (
                          <select value={todo.priority} onChange={e => setTodos(todos.map(t => t.id === todo.id ? {...t, priority: e.target.value as Priority} : t))} 
                            className={`bg-transparent border-none text-[8px] font-black uppercase focus:ring-0 p-0 appearance-none ${todo.priority === 'High' ? 'text-[#b69121]' : todo.priority === 'Medium' ? (isDarkMode ? 'text-emerald-400' : 'text-[#064e3b]') : 'text-slate-400'}`}>
                            <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                          </select>
                        )}
                      </div>
                      <input value={todo.text} disabled={!isAdmin} placeholder="Task name..." onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, text: e.target.value} : t))} 
                        className={`bg-transparent border-none p-0 text-sm font-bold outline-none w-full border-b-2 border-transparent focus:border-b-[#89b4b0]/50 transition-all ${todo.completed ? 'line-through opacity-30' : ''}`}
                        style={{ color: todo.completed ? undefined : (isDarkMode ? (todo.priority === 'Medium' ? '#34d399' : '#f1f5f9') : '#020617') }}
                      />
                    </div>
                    <button onClick={() => isAdmin && setTodos(todos.filter(t => t.id !== todo.id))} className="text-rose-500 transition-opacity p-1"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </details>
          ))}
          </div>
          </details>
          ))}
          </div>
          </details>
          ))}
          </div>
          </section>

        {/* Portfolio Architecture */}
        <div className="space-y-12">
          <section className="space-y-8">
            <div className="flex justify-between items-center cursor-pointer px-4 group" onClick={() => setSections({ ...sections, portfolio: !sections.portfolio })}>
              <div className="text-left flex items-center gap-4"><LayoutGrid size={24} className="text-[#3a5a57] dark:text-[#89b4b0]" /><div><h2 className="text-3xl md:text-4xl font-serif font-bold dark:text-white tracking-tight leading-none">Active Portfolio</h2><p className="text-[#3a5a57] dark:text-[#89b4b0] text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 italic leading-none">Strategic Academic Opportunities</p></div></div>
              <ChevronDown className={`transition-transform duration-500 text-slate-400 ${sections.portfolio ? 'rotate-180' : ''}`} size={28} />
            </div>
            {sections.portfolio && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                {isAdmin && (
                  <button onClick={() => setEditingApp({ name: "", programName: "", type: "School", degree: "Masters", deadline: new Date().toISOString().split('T')[0], status: "In Progress", fee: "", priority: "Medium", docs: [] })}
                    className="mb-10 bg-[#89b4b0] text-white px-10 py-4 rounded-[2rem] shadow-2xl hover:scale-[1.03] transition-all font-bold text-xs tracking-widest outline-none w-full md:w-auto uppercase">
                    ADD NEW OPPORTUNITY
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {activeApps.map(app => (
                    <ApplicationCard key={app.id} app={app} isAdmin={isAdmin} isDarkMode={isDarkMode} onUpdateStatus={updateAppStatus} onToggleDoc={(appId: string, docId: string) => setApps(apps.map(a => a.id !== appId ? a : {...a, docs: a.docs.map(d => d.id === docId ? {...d, done: !d.done} : d)}))} onEdit={() => setEditingApp(app)} onDelete={(id: string) => confirm("Delete entry?") && setApps(apps.filter(a => a.id !== id))} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="flex justify-between items-center cursor-pointer px-4 group opacity-70" onClick={() => setSections({ ...sections, archive: !sections.archive })}>
              <div className="text-left flex items-center gap-4 text-slate-500"><Archive size={24} /><div><h2 className="text-2xl md:text-3xl font-serif font-bold dark:text-white tracking-tight leading-none text-slate-900">Submission Archive</h2><p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 leading-none">Dispatched Applications Registry</p></div></div>
              <ChevronDown className={`transition-transform duration-500 text-slate-400 ${sections.archive ? 'rotate-180' : ''}`} size={28} />
            </div>
            {sections.archive && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {submittedApps.map(app => (
                  <ApplicationCard key={app.id} app={app} isAdmin={isAdmin} isDarkMode={isDarkMode} onUpdateStatus={updateAppStatus} onToggleDoc={()=>{}} onEdit={() => setEditingApp(app)} onDelete={(id: string) => setApps(apps.filter(a => a.id !== id))} isSubmitted />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="flex justify-between items-center cursor-pointer px-4 group" onClick={() => setSections({ ...sections, winners: !sections.winners })}>
              <div className="text-left flex items-center gap-4 text-amber-600"><Trophy size={28} /><div><h2 className="text-3xl md:text-4xl font-serif font-bold dark:text-amber-500 tracking-tight text-amber-600 leading-none">Success Gallery</h2><p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-70 leading-none font-mono">Admission Secured</p></div></div>
              <ChevronDown className={`transition-transform duration-500 text-amber-500/40 ${sections.winners ? 'rotate-180' : ''}`} size={32} />
            </div>
            {sections.winners && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {acceptedApps.map(app => (
                  <div key={app.id} className="relative group">
                     <div className="absolute -inset-1 bg-amber-500/20 rounded-[4rem] blur opacity-10 group-hover:opacity-30 transition duration-1000" />
                     <ApplicationCard app={app} isAdmin={isAdmin} isDarkMode={isDarkMode} onUpdateStatus={updateAppStatus} onToggleDoc={()=>{}} onEdit={() => setEditingApp(app)} onDelete={(id: string) => setApps(apps.filter(a => a.id !== id))} isWinner />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* COMMAND MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 md:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-[#1a2421] dark:bg-[#0a0f1a] rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-md p-6 md:p-8 shadow-2xl border border-white/10 relative max-h-[92vh] flex flex-col mx-auto">
            <div className="overflow-y-auto pr-1 custom-sleek-scroll flex-1">
              <div className="flex justify-between items-center mb-8 text-white"><h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Strategy Entry</h2><button onClick={() => { setEditingApp(null); setCustomDocText(""); }} className="p-2 bg-white/5 text-[#89b4b0] rounded-full hover:rotate-90 transition-all outline-none"><X size={24}/></button></div>
              <form onSubmit={saveApplication} className="space-y-6 text-left">
                <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Institution Name</label><input required value={editingApp.name} onChange={e => setEditingApp({...editingApp, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-[#89b4b0]/40 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Type</label><select value={editingApp.type} onChange={e => setEditingApp({...editingApp, type: e.target.value as AppType})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white font-bold appearance-none outline-none"><option value="School" className="bg-[#1a2421]">University</option><option value="Scholarship" className="bg-[#1a2421]">Scholarship</option><option value="Assistantship" className="bg-[#1a2421]">Assistantship</option></select></div>
                  <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Level</label><select value={editingApp.degree} onChange={e => setEditingApp({...editingApp, degree: e.target.value as DegreeType})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white font-bold appearance-none outline-none">{['Bachelors', 'Masters', 'PhD', 'Diploma', 'Certification'].map(d => <option key={d} value={d} className="bg-[#1a2421]">{d}</option>)}</select></div>
                </div>
                <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Major / Specific Area</label><input required value={editingApp.programName} onChange={e => setEditingApp({...editingApp, programName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Application Fee</label><input value={editingApp.fee} placeholder="e.g. £50" onChange={e => setEditingApp({...editingApp, fee: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none" /></div>
                  <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Priority</label><select value={editingApp.priority} onChange={e => setEditingApp({...editingApp, priority: e.target.value as Priority})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] md:text-xs text-white font-bold outline-none appearance-none"><option value="High" className="bg-[#1a2421]">High</option><option value="Medium" className="bg-[#1a2421]">Medium</option><option value="Low" className="bg-[#1a2421]">Low</option></select></div>
                </div>
                <div><label className="text-[10px] font-black text-[#89b4b0] uppercase tracking-widest mb-3 block">Target Deadline</label><input type="date" required value={editingApp.deadline} onChange={e => setEditingApp({...editingApp, deadline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:ring-2 focus:ring-[#89b4b0]/40 outline-none" /></div>
                <div className="bg-black/20 p-6 md:p-8 rounded-[3rem] border border-white/5">
                  <label className="text-[10px] font-black text-[#b2a4d4] uppercase tracking-[0.3em] mb-8 block">Strategic Requirements</label>
                  <div className="flex flex-wrap gap-2.5 mb-8">{PRESET_DOCS.map(doc => (<button type="button" key={doc} onClick={() => { const exists = editingApp.docs?.find((d: any) => d.label === doc); if (exists) setEditingApp({ ...editingApp, docs: editingApp.docs?.filter((d: any) => d.label !== doc) }); else setEditingApp({ ...editingApp, docs: [...(editingApp.docs || []), { id: Math.random().toString(), label: doc, done: false }] }); }} className={`px-4 py-2.5 rounded-xl text-[9px] font-black border transition-all ${editingApp.docs?.some((d: any) => d.label === doc) ? 'bg-[#89b4b0] border-[#89b4b0] text-white' : 'bg-white/5 text-slate-400 border-white/10'}`}>{doc}</button>))}</div>

                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Add Custom Requirement</label>
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={customDocText}
                      onChange={e => setCustomDocText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomDoc(); } }}
                      placeholder="e.g. Portfolio, Writing Sample..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white font-bold outline-none placeholder:text-slate-600"
                    />
                    <button type="button" onClick={addCustomDoc} className="bg-[#89b4b0] text-[#0a0f1a] px-5 rounded-xl font-black outline-none hover:scale-105 transition-all shrink-0">
                      <Plus size={16} />
                    </button>
                  </div>

                  {editingApp.docs && editingApp.docs.filter((d: any) => !PRESET_DOCS.includes(d.label)).length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {editingApp.docs.filter((d: any) => !PRESET_DOCS.includes(d.label)).map((doc: any) => (
                        <div key={doc.id} className="flex items-center gap-2 pl-4 pr-2.5 py-2.5 rounded-xl text-[9px] font-black bg-[#89b4b0] border border-[#89b4b0] text-white">
                          {doc.label}
                          <button type="button" onClick={() => setEditingApp({ ...editingApp, docs: editingApp.docs?.filter((d: any) => d.id !== doc.id) })} className="hover:opacity-70 outline-none">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className="w-full bg-[#89b4b0] text-[#0a0f1a] py-6 rounded-full font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:translate-y-[-2px] transition-all active:scale-95 outline-none mb-6">COMMIT TO STRATEGY</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-sleek-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sleek-scroll::-webkit-scrollbar-thumb { background: rgba(137, 180, 176, 0.2); border-radius: 20px; }
      `}</style>
    </div>
  );
}

// --- Component ---

function ApplicationCard({ app, isAdmin, onUpdateStatus, onToggleDoc, onEdit, onDelete, isWinner, isDarkMode, isSubmitted }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const doneCount = app.docs.filter((d: any) => d.done).length;
  const progressPercent = app.docs.length > 0 ? Math.round((doneCount / app.docs.length) * 100) : 0;
  const TypeIcon = app.type === 'School' ? School : app.type === 'Scholarship' ? Award : Briefcase;
  
  const countdown = useMemo(() => {
    const diff = new Date(app.deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? "Expired" : days === 0 ? "Due Today" : `${days}d Left`;
  }, [app.deadline]);

  // Sidebar colors Logic — inline style so it can't be silently overridden
  const priorityBorderStyle = getPriorityBorderStyle(app.priority, app.priority === 'High' ? 8 : 6, isDarkMode);
  const labelText = app.priority === 'High' ? 'Priority Focus' : app.priority === 'Medium' ? 'Focus' : '';
  const labelColor = app.priority === 'High' ? 'text-[#b69121]' : app.priority === 'Medium' ? (isDarkMode ? 'text-emerald-400' : 'text-[#064e3b]') : 'text-slate-400';

  // Section styling — background/border driven by isDarkMode via inline style
  const cardBgClass = isWinner
    ? 'shadow-xl border'
    : isSubmitted
    ? 'shadow-xl border'
    : 'bg-emerald-500/5 backdrop-blur-3xl border border-white dark:border-white/10';
  const cardBgStyle = isWinner
    ? { backgroundColor: isDarkMode ? '#5b4614' : 'rgba(234,179,8,0.2)', borderTopColor: isDarkMode ? 'rgba(245,158,11,0.4)' : 'rgba(217,119,6,0.4)', borderRightColor: isDarkMode ? 'rgba(245,158,11,0.4)' : 'rgba(217,119,6,0.4)', borderBottomColor: isDarkMode ? 'rgba(245,158,11,0.4)' : 'rgba(217,119,6,0.4)', ...priorityBorderStyle }
    : isSubmitted
    ? { backgroundColor: isDarkMode ? '#0d2622' : 'rgba(137,180,176,0.15)', borderTopColor: isDarkMode ? 'rgba(137,180,176,0.3)' : 'rgba(137,180,176,0.4)', borderRightColor: isDarkMode ? 'rgba(137,180,176,0.3)' : 'rgba(137,180,176,0.4)', borderBottomColor: isDarkMode ? 'rgba(137,180,176,0.3)' : 'rgba(137,180,176,0.4)', ...priorityBorderStyle }
    : priorityBorderStyle;

  return (
    <div className={`group/card ${cardBgClass} p-8 rounded-[3rem] shadow-xl relative transition-all duration-500 hover:translate-y-[-8px] text-left cursor-pointer overflow-hidden`} style={cardBgStyle} onClick={() => setIsOpen(!isOpen)}>
      {isWinner && <div className="absolute top-0 right-0 p-8 text-amber-900/15 pointer-events-none rotate-12 transition-transform duration-700 group-hover/card:scale-110"><Trophy size={150} /></div>}
      {isSubmitted && <div className="absolute top-0 right-0 p-8 pointer-events-none rotate-12 transition-transform duration-700 group-hover/card:scale-110" style={{ color: isDarkMode ? 'rgba(137,180,176,0.15)' : 'rgba(58,90,87,0.1)' }}><CheckCircle2 size={150} /></div>}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex flex-col gap-1.5">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isWinner ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#89b4b0]/15 text-[#3a5a57] dark:text-[#89b4b0] border-[#89b4b0]/30'}`}>
            <TypeIcon size={14} /> {app.type}
          </div>
          {labelText && <div className={`text-[12px] font-black uppercase tracking-widest px-1 ${labelColor}`}>{labelText}</div>}
        </div>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
           <button onClick={onEdit} className="p-3 bg-white/40 dark:bg-white/5 rounded-2xl text-[#89b4b0] shadow-sm hover:scale-110 transition-all outline-none"><Edit3 size={18}/></button>
           <button onClick={() => onDelete(app.id)} className="p-3 bg-white/40 dark:bg-white/5 rounded-2xl text-rose-400 shadow-sm hover:scale-110 transition-all outline-none"><Trash2 size={18}/></button>
        </div>
      </div>
      <div className="mb-8 relative z-10">
        <h3 className={`text-2xl md:text-3xl font-bold dark:text-white leading-tight mb-2 tracking-tight ${isWinner ? 'text-amber-950 dark:text-amber-400' : 'text-slate-950'}`}>{app.name || "Untitled"}</h3>
        <p className={`text-[12px] font-black uppercase tracking-widest leading-none ${isWinner ? 'text-amber-800' : 'text-[#3a5a57] dark:text-[#89b4b0]'}`}>{app.degree} • {app.programName || "Undecided"}</p>
        <p className="mt-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1"><CircleDollarSign size={13}/> Application Fee: {app.fee || "0"}</p>
      </div>
      <div className="mb-10 relative z-10 text-left">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400 mb-3 font-mono"><span>Readiness Flow</span><span className="text-[#89b4b0] font-bold">{progressPercent}%</span></div>
        <div className="h-2 w-full bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
           <div className="h-full bg-gradient-to-r from-[#89b4b0] to-[#b2a4d4] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className={`space-y-4 transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[500px] mb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200/50 dark:border-white/10 pb-2">Document Checklist</p>
        <div className="custom-sleek-scroll space-y-4 max-h-[300px] overflow-y-auto pr-2">{app.docs.map((doc: any) => (<button key={doc.id} disabled={!isAdmin} onClick={(e) => { e.stopPropagation(); onToggleDoc(app.id, doc.id); }} className="flex items-center gap-4 w-full text-left group/item outline-none shrink-0">{doc.done ? <CheckCircle2 size={22} className="text-[#89b4b0]" /> : <Circle size={22} className="text-slate-500 dark:text-slate-800" />}<span className={`text-sm transition-all font-bold ${doc.done ? 'line-through' : ''}`} style={{ color: isDarkMode ? (doc.done ? '#64748b' : '#e2e8f0') : '#000000' }}>{doc.label}</span></button>))}</div>
      </div>
      <div className="pt-8 border-t border-slate-300/40 dark:border-white/5 flex items-center justify-between relative z-10" onClick={e => e.stopPropagation()}>
        <select disabled={!isAdmin} value={app.status} onChange={(e) => onUpdateStatus(app.id, e.target.value as AppStatus)} className={`bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 p-0 cursor-pointer appearance-none outline-none leading-none text-[#b2a4d4]`}>{['In Progress', 'Submitted', 'Pending', 'Waitlisted', 'Accepted'].map(s => <option key={s} value={s} className="text-slate-900 bg-white dark:bg-[#0a0b14] dark:text-white">{s}</option>)}</select>
        <div className="flex flex-col items-end gap-1"><div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Clock size={14} /> <span className="text-[10px] font-black tracking-widest uppercase leading-none">{app.deadline}</span></div><span className={`text-[10px] font-black uppercase tracking-widest ${countdown === 'Expired' ? 'text-rose-500' : 'text-[#89b4b0]'}`}>{countdown}</span></div>
      </div>
      {!isOpen && <div className="text-[8px] font-black text-center mt-6 uppercase tracking-[0.4em] opacity-30">Unlock Checklist</div>}
    </div>
  );
}
