"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Circle, Clock, GraduationCap, 
  Plus, Trash2, Edit3, X, School, Award, Briefcase,
  Quote, CheckSquare, BarChart3, 
  ChevronDown, ChevronRight, Moon, Sun, PartyPopper
} from 'lucide-react';

// --- Types ---
type AppType = 'School' | 'Scholarship' | 'Assistantship';
type DegreeType = 'Bachelors' | 'Masters' | 'PhD' | 'Diploma' | 'Certification';
type AppStatus = 'In Progress' | 'Submitted' | 'Pending' | 'Waitlisted' | 'Accepted';

interface Todo { id: string; text: string; completed: boolean; date: string; }
interface Application {
  id: string; name: string; type: AppType; degree: DegreeType;
  programName: string; deadline: string; status: AppStatus; 
  docs: { id: string; label: string; done: boolean }[];
}

const PRESET_DOCS = ["CV / Resume", "Statement of Purpose", "Transcripts", "Letters of Rec", "Passport", "GRE Scores"];

const QUOTES = [
  "The future is as bright as your aura today.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Your growth is the best return on investment.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "Your academic journey is a marathon, not a sprint."
];

export default function AuraScholarFinal() {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [apps, setApps] = useState<Application[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingApp, setEditingApp] = useState<Partial<Application> | null>(null);
  const [celebration, setCelebration] = useState<{show: boolean, msg: string}>({show: false, msg: ""});
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const savedApps = localStorage.getItem('aura-v6-apps');
    const savedTodos = localStorage.getItem('aura-v6-todos');
    const savedTheme = localStorage.getItem('aura-v6-theme');
    if (savedApps) setApps(JSON.parse(savedApps));
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    
    // Pick a random quote only once on mount
    setRandomQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('aura-v6-apps', JSON.stringify(apps));
      localStorage.setItem('aura-v6-todos', JSON.stringify(todos));
      localStorage.setItem('aura-v6-theme', isDarkMode ? 'dark' : 'light');
    }
  }, [apps, todos, isDarkMode, mounted]);

  const saveApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;
    const finalApp = { ...editingApp, id: editingApp.id || Date.now().toString(), docs: editingApp.docs || [] } as Application;
    setApps(prev => {
      const exists = prev.find(a => a.id === finalApp.id);
      if (exists) return prev.map(a => a.id === finalApp.id ? finalApp : a);
      return [finalApp, ...prev];
    });
    setEditingApp(null);
  };

  const updateAppStatus = (id: string, status: AppStatus) => {
    if (['Submitted', 'Accepted'].includes(status)) {
      setCelebration({ 
        show: true, 
        msg: status === 'Accepted' ? "CONGRATULATIONS! SUCCESS ACHIEVED!" : "SUBMITTED! AURA INCREASED." 
      });
      setTimeout(() => setCelebration({show: false, msg: ""}), 4000);
    }
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const detailedAnalytics = useMemo(() => {
    const total = apps.length;
    const completed = apps.filter(a => ['Submitted', 'Accepted'].includes(a.status)).length;
    const degreeCounts = apps.reduce((acc: any, app) => { acc[app.degree] = (acc[app.degree] || 0) + 1; return acc; }, {});
    const typeCounts = apps.reduce((acc: any, app) => { acc[app.type] = (acc[app.type] || 0) + 1; return acc; }, {});
    return { total, percent: total ? Math.round((completed/total)*100) : 0, degreeCounts, typeCounts };
  }, [apps]);

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
    <div className={`${isDarkMode ? 'dark bg-[#080b14] text-slate-100' : 'bg-[#f0f3f1] text-slate-950'} min-h-screen transition-all duration-700 pb-20 overflow-x-hidden`}>
      
      {/* Dynamic Watercolor Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[110px] saturate-200 transition-all duration-1000 ${isDarkMode ? 'bg-[#0a4d3c]/40' : 'bg-[#96bcaf]/50'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[110px] saturate-200 transition-all duration-1000 ${isDarkMode ? 'bg-[#401a66]/40' : 'bg-[#b8a9db]/50'}`} />
      </div>

      {/* Sleek Celebration Popup */}
      {celebration.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-md p-6">
          <div className="bg-white/90 dark:bg-[#0a0f1a]/90 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] text-center shadow-2xl border border-[#89b4b0]/40 max-w-sm w-full animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-[#89b4b0] to-[#b2a4d4] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#89b4b0]/20">
              <PartyPopper className="text-white w-10 h-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-950 dark:text-white leading-tight uppercase tracking-tight">{celebration.msg}</h2>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#89b4b0] to-[#b2a4d4] rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-3">
              <GraduationCap className="text-white w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold dark:text-white leading-none mb-2">Aura Scholar</h1>
              <p className="text-[#3a5a57] dark:text-[#89b4b0] text-[10px] font-black tracking-[0.3em] uppercase opacity-90">Curating your academic journey</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/40 dark:bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-lg">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-2xl hover:bg-white/40 dark:text-white transition-all outline-none">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20} className="text-slate-950"/>}
            </button>
            <div className="h-6 w-[1px] bg-slate-400/40" />
            <button onClick={() => setIsAdmin(!isAdmin)} className={`px-6 py-2 rounded-2xl text-[10px] font-black transition-all outline-none ${isAdmin ? 'bg-[#89b4b0] text-white shadow-md' : 'text-slate-950 dark:text-slate-400'}`}>
              {isAdmin ? 'ADMIN MODE' : 'GUEST MODE'}
            </button>
          </div>
        </header>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white/50 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-[3rem] md:rounded-[4rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-xl">
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-300 dark:text-slate-800" />
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="14" fill="transparent" 
                  strokeDasharray="264" strokeDashoffset={264 - (264 * detailedAnalytics.percent) / 100}
                  className="text-[#89b4b0] transition-all duration-1000 stroke-round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl md:text-5xl font-black dark:text-white">{detailedAnalytics.percent}%</span>
                <span className="text-[10px] font-bold text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest">Aura</span>
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3a5a57] dark:text-[#89b4b0] mb-6 flex items-center gap-2 font-mono"><BarChart3 size={16}/> Portfolio Intelligence</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Object.entries(detailedAnalytics.degreeCounts), ...Object.entries(detailedAnalytics.typeCounts)].map(([k, v]) => (
                  <div key={k} className="p-4 bg-white/70 dark:bg-white/5 rounded-3xl border border-white/20">
                    <span className="block text-[9px] font-black text-slate-700 dark:text-slate-500 uppercase mb-1">{k}</span>
                    <span className="text-xl font-bold dark:text-white text-slate-950">{v as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#89b4b0]/20 to-[#b2a4d4]/20 p-10 rounded-[3rem] md:rounded-[4rem] border border-white/40 dark:border-white/10 flex flex-col justify-center items-center text-center shadow-lg">
            <Quote className="text-[#89b4b0] mb-6 opacity-60" size={40} />
            <p className="text-xl md:text-2xl font-serif italic dark:text-slate-200 mb-4 leading-tight text-slate-800">
              "{randomQuote}"
            </p>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3a5a57] dark:text-[#89b4b0]">Aura Scholar Wisdom</span>
          </div>
        </div>

        {/* Planner Section */}
        <section className="mb-20 px-2 text-left">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#8e7db9] dark:text-[#b2a4d4] flex items-center gap-2 font-mono"><CheckSquare size={18}/> temporal intention flow</h2>
            {isAdmin && (
              <button onClick={() => setTodos([{id: Date.now().toString(), text: '', completed: false, date: new Date().toISOString().split('T')[0]}, ...todos])} 
                className="bg-[#b2a4d4] text-white p-2.5 md:p-3 rounded-full shadow-2xl hover:scale-110 transition-all outline-none"><Plus size={24}/></button>
            )}
          </div>

          <div className="space-y-6">
            {Object.entries(groupedTodos).map(([month, weeks]) => (
              <details key={month} className="group overflow-hidden bg-white/40 dark:bg-white/5 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 dark:border-white/5 shadow-sm" open>
                <summary className="flex items-center justify-between p-8 cursor-pointer hover:bg-white/60 dark:hover:bg-white/10 transition-all select-none outline-none">
                  <span className="text-2xl font-serif font-bold dark:text-white leading-none">{month}</span>
                  <ChevronDown className="group-open:rotate-180 transition-transform text-slate-400" />
                </summary>
                <div className="px-5 md:px-8 pb-8 space-y-8">
                  {Object.entries(weeks).map(([week, days]) => (
                    <div key={week}>
                      <h4 className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-[0.4em] mb-4 flex items-center gap-2 font-mono"><ChevronRight size={14}/> {week} Summary</h4>
                      <div className="space-y-6 pl-5 md:pl-6 border-l-2 border-[#89b4b0]/20">
                        {Object.entries(days).map(([day, items]) => (
                          <div key={day}>
                            <h5 className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-3">{day}</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {items.map(todo => (
                                <div key={todo.id} className="flex items-center gap-4 bg-white/60 dark:bg-white/10 p-4 rounded-3xl border border-white dark:border-white/5 group/task transition-all">
                                  <button onClick={() => isAdmin && setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))} className="outline-none">
                                    {todo.completed ? <CheckCircle2 size={22} className="text-[#89b4b0]" /> : <Circle size={22} className="text-slate-400 dark:text-slate-800" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <input 
                                      type="date" value={todo.date} disabled={!isAdmin}
                                      onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, date: e.target.value} : t))}
                                      className="bg-transparent border-none p-0 text-[10px] font-bold text-[#3a5a57] dark:text-slate-500 w-24 focus:ring-0 cursor-pointer mb-1 outline-none"
                                    />
                                    <input 
                                      value={todo.text} disabled={!isAdmin} placeholder="What needs to be done?"
                                      onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, text: e.target.value} : t))}
                                      className={`bg-transparent border-none p-0 text-sm font-bold dark:text-white outline-none w-full transition-all focus:ring-2 focus:ring-[#89b4b0]/30 rounded px-1 ${todo.completed ? 'line-through opacity-30 text-slate-400' : 'text-slate-950'}`}
                                    />
                                  </div>
                                  {isAdmin && <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} className="opacity-0 group-hover/task:opacity-100 text-rose-500 transition-opacity"><Trash2 size={16}/></button>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Active Portfolio Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 px-4">
          <div className="text-left">
            <h2 className="text-4xl font-serif font-bold dark:text-white tracking-tight">Active Portfolio</h2>
            <p className="text-[#3a5a57] dark:text-[#89b4b0] text-[10px] font-black uppercase tracking-widest mt-2">Strategic Academic Opportunities</p>
          </div>
          {isAdmin && (
            <button onClick={() => setEditingApp({ name: "", programName: "", type: "School", degree: "Masters", deadline: new Date().toISOString().split('T')[0], status: "In Progress", docs: [] })}
              className="bg-[#89b4b0] text-white px-10 py-4 rounded-[2rem] shadow-2xl shadow-[#89b4b0]/20 hover:scale-[1.03] transition-all font-bold text-xs tracking-widest outline-none w-full md:w-auto">
              ADD NEW OPPORTUNITY
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {apps.map(app => (
            <ApplicationCard 
              key={app.id} app={app} isAdmin={isAdmin} 
              onUpdateStatus={updateAppStatus}
              onToggleDoc={(appId: string, docId: string) => setApps(apps.map(a => a.id !== appId ? a : {...a, docs: a.docs.map(d => d.id === docId ? {...d, done: !d.done} : d)}))}
              onEdit={() => setEditingApp(app)}
              onDelete={(id: string) => confirm("Delete entry?") && setApps(apps.filter(a => a.id !== id))}
            />
          ))}
        </div>
      </div>

      {editingApp && (
        <AppModal 
          app={editingApp} onClose={() => setEditingApp(null)} 
          onSave={saveApplication} setApp={setEditingApp} 
        />
      )}
    </div>
  );
}

// --- Card Component ---

function ApplicationCard({ app, isAdmin, onUpdateStatus, onToggleDoc, onEdit, onDelete }: any) {
  const doneCount = app.docs.filter((d: any) => d.done).length;
  const progressPercent = app.docs.length > 0 ? Math.round((doneCount / app.docs.length) * 100) : 0;

  const TypeIcon = app.type === 'School' ? School : app.type === 'Scholarship' ? Award : Briefcase;

  return (
    <div className="group bg-white/70 dark:bg-white/5 backdrop-blur-3xl border border-white dark:border-white/10 p-8 md:p-10 rounded-[3rem] md:rounded-[4rem] shadow-xl relative transition-all duration-500 hover:translate-y-[-10px] text-left">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#89b4b0]/15 text-[#3a5a57] dark:text-[#89b4b0] text-[10px] font-black uppercase tracking-widest border border-[#89b4b0]/30">
          <TypeIcon size={14} />
          {app.type}
        </div>
        {isAdmin && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={onEdit} className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-[#89b4b0] shadow-sm hover:scale-110 transition-transform"><Edit3 size={18}/></button>
            <button onClick={() => onDelete(app.id)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-rose-400 shadow-sm hover:scale-110 transition-transform"><Trash2 size={18}/></button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold dark:text-white leading-tight mb-2 tracking-tight">{app.name || "Untitled"}</h3>
        <p className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest">{app.degree} • {app.programName || "Undecided"}</p>
      </div>

      <div className="mb-10 text-left">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-400 mb-3 font-mono">
          <span>Readiness Flow</span>
          <span className="text-[#89b4b0] font-bold">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-[#89b4b0] to-[#b2a4d4] transition-all duration-700" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="space-y-4 mb-10 h-44 overflow-y-auto custom-scrollbar pr-2">
        {app.docs.map((doc: any) => (
          <button key={doc.id} disabled={!isAdmin} onClick={() => onToggleDoc(app.id, doc.id)} className="flex items-center gap-4 w-full text-left group/item outline-none">
            {doc.done ? <CheckCircle2 size={22} className="text-[#89b4b0]" /> : <Circle size={22} className="text-slate-400 dark:text-slate-800" />}
            <span className={`text-sm transition-all font-bold ${doc.done ? 'text-slate-500 dark:text-slate-600 line-through' : 'text-slate-950 dark:text-slate-200'}`}>{doc.label}</span>
          </button>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-300/40 dark:border-white/5 flex items-center justify-between">
        <select 
          disabled={!isAdmin} value={app.status} onChange={(e) => onUpdateStatus(app.id, e.target.value)}
          className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-[#6b5999] dark:text-[#b2a4d4] focus:ring-0 p-0 cursor-pointer appearance-none outline-none leading-none"
        >
          {['In Progress', 'Submitted', 'Pending', 'Waitlisted', 'Accepted'].map(s => <option key={s} value={s} className="text-slate-900 bg-white dark:bg-slate-900">{s}</option>)}
        </select>
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={14} />
          <span className="text-[10px] font-black tracking-widest uppercase">{app.deadline}</span>
        </div>
      </div>
    </div>
  );
}

// --- Modal Component ---

function AppModal({ app, onClose, onSave, setApp }: any) {
  const [otherDoc, setOtherDoc] = useState("");

  const toggleDoc = (label: string) => {
    const exists = app.docs.find((d: any) => d.label === label);
    if (exists) setApp({ ...app, docs: app.docs.filter((d: any) => d.label !== label) });
    else setApp({ ...app, docs: [...(app.docs || []), { id: Math.random().toString(), label, done: false }] });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-[#f2f4f2] dark:bg-[#0a0f1a] rounded-[3rem] md:rounded-[4rem] w-full max-w-2xl lg:max-w-3xl p-6 md:p-12 shadow-2xl my-auto border border-white/20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-4xl font-serif font-bold dark:text-white leading-none">Application Strategy</h2>
          <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 text-slate-950 dark:text-white rounded-full shadow-lg hover:rotate-90 transition-transform outline-none"><X size={24}/></button>
        </div>

        <form onSubmit={onSave} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 text-left">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest mb-3 block">Institution / Entity Name</label>
            <input required value={app.name} onChange={e => setApp({...app, name: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-5 text-sm md:text-base text-slate-950 dark:text-white font-bold focus:ring-4 focus:ring-[#89b4b0]/20 outline-none transition-all shadow-sm" />
          </div>

          <div className="col-span-1">
            <label className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest mb-3 block">Opportunity Type</label>
            <select value={app.type} onChange={e => setApp({...app, type: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-5 text-xs md:text-sm text-slate-950 dark:text-white font-bold focus:ring-4 focus:ring-[#89b4b0]/20 outline-none cursor-pointer appearance-none">
              <option value="School">University</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Assistantship">Assistantship</option>
            </select>
          </div>

          <div className="col-span-1">
            <label className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest mb-3 block">Academic Level</label>
            <select value={app.degree} onChange={e => setApp({...app, degree: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-5 text-xs md:text-sm text-slate-950 dark:text-white font-bold focus:ring-4 focus:ring-[#89b4b0]/20 outline-none appearance-none">
              {['Bachelors', 'Masters', 'PhD', 'Diploma', 'Certification'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest mb-3 block">Major / Specific Area</label>
            <input required value={app.programName} onChange={e => setApp({...app, programName: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-5 text-slate-950 dark:text-white font-bold focus:ring-4 focus:ring-[#89b4b0]/20 outline-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest mb-3 block">Target Deadline</label>
            <input type="date" required value={app.deadline} onChange={e => setApp({...app, deadline: e.target.value})} className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-5 text-slate-950 dark:text-white font-bold focus:ring-4 focus:ring-[#89b4b0]/20 outline-none" />
          </div>

          <div className="sm:col-span-2 bg-white/40 dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-white/20">
            <label className="text-[10px] font-black text-[#b2a4d4] uppercase tracking-[0.3em] mb-8 block">Strategic Requirements</label>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {PRESET_DOCS.map(doc => {
                const active = app.docs?.some((d: any) => d.label === doc);
                return (
                  <button type="button" key={doc} onClick={() => toggleDoc(doc)} className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all border ${active ? 'bg-[#89b4b0] border-[#89b4b0] text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-950 dark:text-slate-400 border-slate-200 hover:border-[#89b4b0]'}`}>{doc}</button>
                );
              })}
            </div>
            <div className="flex gap-3 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-inner border border-slate-300/30 dark:border-white/10">
              <input value={otherDoc} onChange={e => setOtherDoc(e.target.value)} placeholder="Custom requirement..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 font-bold text-slate-950 dark:text-white outline-none w-full" />
              <button type="button" onClick={() => { if(otherDoc) { toggleDoc(otherDoc); setOtherDoc(""); } }} className="bg-[#89b4b0] text-white p-3 rounded-xl hover:rotate-90 transition-all shrink-0"><Plus size={22}/></button>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {app.docs?.map((d: any) => (
                <div key={d.id} className="flex items-center gap-2 px-4 py-2 bg-[#89b4b0]/15 text-[#3a5a57] dark:text-[#89b4b0] rounded-xl text-[10px] font-black uppercase border border-[#89b4b0]/20 shadow-sm">
                  {d.label}
                  <button type="button" onClick={() => setApp({...app, docs: app.docs.filter((i:any)=>i.id !== d.id)})} className="text-rose-500 hover:scale-125 transition-transform"><X size={12}/></button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="sm:col-span-2 bg-slate-950 dark:bg-[#89b4b0] text-white py-6 rounded-[3rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:translate-y-[-2px] transition-all active:scale-95 outline-none">
            UPDATE AURA PORTFOLIO
          </button>
        </form>
      </div>
    </div>
  );
}