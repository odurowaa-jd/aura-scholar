"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, Circle, Clock, GraduationCap, 
  Plus, Trash2, Edit3, X, School, Award, Briefcase,
  Quote, CheckSquare, BarChart3, 
  ChevronDown, ChevronRight, Moon, Sun, PartyPopper,
  Archive, Trophy, LayoutGrid
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

const PRESET_DOCS = ["CV / Resume", "Statement of Purpose", "Transcripts", "Letters of Recommendation", "Passport", "GRE Scores", "TOEFL / IELTS Scores", "Portfolio", "Financial Documents", "Application Fee Payment"];

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
  
  const [sections, setSections] = useState({ portfolio: true, archive: false, winners: true });

  useEffect(() => {
    const savedApps = localStorage.getItem('aura-v6-apps');
    const savedTodos = localStorage.getItem('aura-v6-todos');
    const savedTheme = localStorage.getItem('aura-v6-theme');
    if (savedApps) setApps(JSON.parse(savedApps));
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
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
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-[#0a4d3c]/40' : 'bg-[#9fb7a9]/50'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] transition-all duration-1000 ${isDarkMode ? 'bg-[#401a66]/40' : 'bg-[#bbaed6]/50'}`} />
        {isDarkMode && <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[130px] bg-amber-600/10 opacity-60" />}
      </div>

      {celebration.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 text-center">
          <div className="bg-[#1a2421] text-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl border-2 border-[#89b4b0]/40 max-w-xs md:max-w-sm w-full animate-in zoom-in duration-300">
            <PartyPopper className="text-white w-10 h-10 mx-auto mb-4" />
            <h2 className="text-lg md:text-xl font-serif font-bold uppercase leading-tight">{celebration.msg}</h2>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#89b4b0] to-[#b2a4d4] rounded-2xl flex items-center justify-center shadow-xl rotate-3">
              <GraduationCap className="text-white w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-serif font-bold dark:text-white leading-none mb-1">Aura Scholar</h1>
              <p className="text-[#3a5a57] dark:text-[#89b4b0] text-[9px] font-black tracking-[0.3em] uppercase opacity-90">Curating your academic journey</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-lg">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full hover:bg-white/40 dark:text-white transition-all outline-none">
              {isDarkMode ? <Sun size={18}/> : <Moon size={18} className="text-slate-950"/>}
            </button>
            <div className="h-6 w-[1px] bg-slate-400/40" />
            <button onClick={() => setIsAdmin(!isAdmin)} className={`px-5 py-2 rounded-2xl text-[9px] font-black transition-all outline-none ${isAdmin ? 'bg-[#89b4b0] text-white shadow-md' : 'text-slate-950 dark:text-slate-400'}`}>
              {isAdmin ? 'ADMIN MODE' : 'GUEST MODE'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-400/10">
            <div className="relative w-32 h-32 md:w-36 md:h-36 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-300 dark:text-slate-800" />
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray="264" strokeDashoffset={264 - (264 * detailedAnalytics.percent) / 100}
                  className="text-[#89b4b0] transition-all duration-1000 stroke-round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black dark:text-white">{detailedAnalytics.percent}%</span>
                <span className="text-[8px] font-bold text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest leading-none">Strength</span>
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3a5a57] dark:text-[#89b4b0] mb-4 flex items-center gap-2 font-mono"><BarChart3 size={14}/> Detailed Portfolio Intelligence</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(detailedAnalytics.counts).map(([k, v]) => (
                  <div key={k} className="p-2.5 bg-white/70 dark:bg-white/10 rounded-xl border border-white/20 shadow-sm">
                    <span className="block text-[8px] font-black text-slate-700 dark:text-slate-500 uppercase mb-0.5">{k}</span>
                    <span className="text-lg font-bold dark:text-white text-slate-900">{v as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#89b4b0]/20 to-amber-500/20 p-8 rounded-[2.5rem] border border-white/40 dark:border-white/10 flex flex-col justify-center items-center text-center shadow-lg">
            <Quote className="text-[#89b4b0] mb-4 opacity-60" size={32} />
            <p className="text-lg md:text-xl font-serif italic dark:text-slate-200 leading-tight text-slate-800 font-medium italic">
              "{randomQuote}"
            </p>
            <span className="text-[8px] font-black uppercase tracking-widest text-[#3a5a57] dark:text-[#89b4b0] mt-4">Aura Scholar Wisdom</span>
          </div>
        </div>

        <section className="mb-20 px-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-[0.15em] text-[#4c3e7a] dark:text-[#b2a4d4] flex items-center gap-3 font-mono italic">
              <CheckSquare size={22}/> Daily Momentum & Action Stream
            </h2>
            {isAdmin && (
              <button onClick={() => setTodos([{id: Date.now().toString(), text: '', completed: false, date: new Date().toISOString().split('T')[0]}, ...todos])} 
                className="bg-[#b2a4d4] text-white p-2 md:p-2.5 rounded-full shadow-xl hover:scale-110 transition-all outline-none"><Plus size={22}/></button>
            )}
          </div>

    <div className="space-y-6">
    {Object.entries(groupedTodos).map(([month, weeks]) => (
    <details key={month} className="group/month overflow-hidden bg-white/40 dark:bg-white/5 rounded-3xl border border-white/30 dark:border-white/5 shadow-sm" open>
  <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-900/10 transition-all select-none outline-none">
    <span className="text-xl font-serif font-bold text-[#4c3e7a] dark:text-white leading-none">{month}</span>
    <ChevronDown className="group-open/month:rotate-180 transition-transform text-slate-400" />
  </summary>
  <div className="px-5 md:px-8 pb-8 space-y-6">
    {Object.entries(weeks).map(([week, days]) => (
      <details key={week} className="group/week" open>
        <summary className="flex items-center gap-2 text-[10px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-[0.4em] mb-4 cursor-pointer outline-none select-none">
            <ChevronRight className="group-open/week:rotate-90 transition-transform" size={12}/> {week} Summary
        </summary>
        <div className="space-y-6 pl-5 md:pl-6 border-l border-[#89b4b0]/20 ml-2">
          {Object.entries(days).map(([day, items]) => (
            <details key={day} className="group/day" open>
              <summary className="text-[10px] font-bold text-slate-700 dark:text-slate-500 uppercase tracking-widest mb-3 cursor-pointer outline-none select-none flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#b2a4d4]/40" /> {day}
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-2">
                {items.map(todo => (
                  <div key={todo.id} className="flex items-center gap-4 bg-white/60 dark:bg-white/10 p-3.5 rounded-2xl border border-white dark:border-white/5 group/task transition-all shadow-sm">
                    <button onClick={() => isAdmin && setTodos(todos.map(t => t.id === todo.id ? {...t, completed: !t.completed} : t))} className="outline-none shrink-0">
                      {todo.completed ? <CheckCircle2 size={22} className="text-[#89b4b0]" /> : <Circle size={22} className="text-slate-400 dark:text-slate-800" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <input type="date" value={todo.date} disabled={!isAdmin} onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, date: e.target.value} : t))} className="bg-transparent border-none p-0 text-[8px] font-black text-[#3a5a57] dark:text-slate-500 w-22 focus:ring-0 cursor-pointer mb-0.5 outline-none opacity-60" />
                      <input value={todo.text} disabled={!isAdmin} placeholder="Task..." onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? {...t, text: e.target.value} : t))} className={`bg-transparent border-none p-0 text-sm font-bold text-[#3a5a57] dark:text-white outline-none w-full border-b-2 border-transparent focus:border-b-[#89b4b0]/50 transition-all ${todo.completed ? 'line-through opacity-30' : ''}`} />
                    </div>
                    {isAdmin && <button onClick={() => setTodos(todos.filter(t => t.id !== todo.id))} className="opacity-0 group-hover/task:opacity-100 text-rose-500 transition-opacity"><Trash2 size={14}/></button>}
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

        <div className="space-y-12">
          <section className="space-y-8">
            <div className="flex justify-between items-center cursor-pointer px-4 group" onClick={() => setSections({ ...sections, portfolio: !sections.portfolio })}>
              <div className="text-left flex items-center gap-4"><LayoutGrid size={22} className="text-[#3a5a57] dark:text-[#89b4b0]" /><div><h2 className="text-2xl md:text-3xl font-serif font-bold dark:text-white tracking-tight leading-none">Active Portfolio</h2><p className="text-[#3a5a57] dark:text-[#89b4b0] text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 italic">Strategic Academic Opportunities</p></div></div>
              <ChevronDown className={`transition-transform duration-500 text-slate-400 ${sections.portfolio ? 'rotate-180' : ''}`} size={28} />
            </div>
            {sections.portfolio && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                {isAdmin && (
                  <button onClick={() => setEditingApp({ name: "", programName: "", type: "School", degree: "Masters", deadline: new Date().toISOString().split('T')[0], status: "In Progress", docs: [] })} className="mb-8 bg-[#89b4b0] text-white px-8 py-3 rounded-full shadow-2xl hover:scale-[1.02] transition-all font-bold text-[10px] tracking-widest outline-none w-full md:w-auto uppercase">ADD OPPORTUNITY</button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeApps.map(app => (
                    <ApplicationCard key={app.id} app={app} isAdmin={isAdmin} isDarkMode={isDarkMode} onUpdateStatus={updateAppStatus} onToggleDoc={(appId: string, docId: string) => setApps(apps.map(a => a.id !== appId ? a : {...a, docs: a.docs.map(d => d.id === docId ? {...d, done: !d.done} : d)}))} onEdit={() => setEditingApp(app)} onDelete={(id: string) => confirm("Delete entry?") && setApps(apps.filter(a => a.id !== id))} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="flex justify-between items-center cursor-pointer px-4 group opacity-70" onClick={() => setSections({ ...sections, archive: !sections.archive })}>
              <div className="text-left flex items-center gap-4 text-slate-500"><Archive size={22} /><div><h2 className="text-2xl md:text-3xl font-serif font-bold dark:text-white tracking-tight leading-none text-slate-800">Submission Archive</h2><p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 leading-none">Dispatched Registries</p></div></div>
              <ChevronDown className={`transition-transform duration-500 text-slate-400 ${sections.archive ? 'rotate-180' : ''}`} size={24} />
            </div>
            {sections.archive && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {submittedApps.map(app => (
                  <ApplicationCard key={app.id} app={app} isAdmin={isAdmin} isDarkMode={isDarkMode} onUpdateStatus={updateAppStatus} onToggleDoc={()=>{}} onEdit={() => setEditingApp(app)} onDelete={(id: string) => setApps(apps.filter(a => a.id !== id))} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="flex justify-between items-center cursor-pointer px-4 group" onClick={() => setSections({ ...sections, winners: !sections.winners })}>
              <div className="text-left flex items-center gap-4 text-amber-600"><Trophy size={24} /><div><h2 className="text-2xl md:text-3xl font-serif font-bold dark:text-amber-500 tracking-tight leading-none">Success Gallery</h2><p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 leading-none font-mono">Admission Secured</p></div></div>
              <ChevronDown className={`transition-transform duration-500 text-amber-500/40 ${sections.winners ? 'rotate-180' : ''}`} size={28} />
            </div>
            {sections.winners && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {acceptedApps.map(app => (
                  <div key={app.id} className="relative group"><div className="absolute -inset-1 bg-amber-500/10 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000" /><ApplicationCard app={app} isAdmin={isAdmin} isDarkMode={isDarkMode} onUpdateStatus={updateAppStatus} onToggleDoc={()=>{}} onEdit={() => setEditingApp(app)} onDelete={(id: string) => setApps(apps.filter(a => a.id !== id))} isWinner /></div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {editingApp && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-[#1a2421] dark:bg-[#0a0f1a] rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-xl p-8 md:p-10 shadow-2xl border border-white/10 relative max-h-[90vh] flex flex-col">
            <div className="overflow-y-auto pr-2 custom-sleek-scroll flex-1">
              <div className="flex justify-between items-center mb-8 text-white"><h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Strategy Input</h2><button onClick={() => setEditingApp(null)} className="p-2.5 bg-white/5 text-[#89b4b0] rounded-full hover:bg-white/10 outline-none"><X size={22}/></button></div>
              <form onSubmit={saveApplication} className="space-y-6 text-left">
                <div><label className="text-[9px] font-black text-[#89b4b0] uppercase tracking-widest mb-2 block">Institution Name</label><input required value={editingApp.name} onChange={e => setEditingApp({...editingApp, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:ring-1 focus:ring-[#89b4b0]" /></div>
                <div className="grid grid-cols-2 gap-4"><div className="col-span-1"><label className="text-[9px] font-black text-[#89b4b0] uppercase tracking-widest mb-2 block">Type</label><select value={editingApp.type} onChange={e => setEditingApp({...editingApp, type: e.target.value as AppType})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white font-bold appearance-none outline-none"><option value="School" className="bg-[#1a2421]">University</option><option value="Scholarship" className="bg-[#1a2421]">Scholarship</option><option value="Assistantship" className="bg-[#1a2421]">Assistantship</option></select></div><div className="col-span-1"><label className="text-[9px] font-black text-[#89b4b0] uppercase tracking-widest mb-2 block">Level</label><select value={editingApp.degree} onChange={e => setEditingApp({...editingApp, degree: e.target.value as DegreeType})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-xs text-white font-bold appearance-none outline-none">{['Bachelors', 'Masters', 'PhD', 'Diploma', 'Certification'].map(d => <option key={d} value={d} className="bg-[#1a2421]">{d}</option>)}</select></div></div>
                <div><label className="text-[9px] font-black text-[#89b4b0] uppercase tracking-widest mb-2 block">Major / Program</label><input required value={editingApp.programName} onChange={e => setEditingApp({...editingApp, programName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none" /></div>
                {/* RESTORED DATE PART */}
                <div><label className="text-[9px] font-black text-[#89b4b0] uppercase tracking-widest mb-2 block">Target Deadline</label><input type="date" required value={editingApp.deadline} onChange={e => setEditingApp({...editingApp, deadline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:ring-1 focus:ring-[#89b4b0]" /></div>
                <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5">
                  <label className="text-[10px] font-black text-[#b2a4d4] uppercase tracking-[0.2em] mb-4 block">Strategic Requirements</label>
                  <div className="flex flex-wrap gap-2 mb-6">{PRESET_DOCS.map(doc => (<button type="button" key={doc} onClick={() => { const exists = editingApp.docs?.find((d: any) => d.label === doc); if (exists) setEditingApp({ ...editingApp, docs: editingApp.docs?.filter((d: any) => d.label !== doc) }); else setEditingApp({ ...editingApp, docs: [...(editingApp.docs || []), { id: Math.random().toString(), label: doc, done: false }] }); }} className={`px-3 py-1.5 rounded-lg text-[8px] font-black border transition-all ${editingApp.docs?.some((d: any) => d.label === doc) ? 'bg-[#89b4b0] border-[#89b4b0] text-white shadow-lg' : 'bg-white/5 text-slate-400 border-white/10'}`}>{doc}</button>))}</div>
                  <div className="flex gap-2 p-2 bg-black/20 rounded-xl border border-white/10"><input id="custom-req" placeholder="Custom item..." className="flex-1 bg-transparent border-none text-xs px-3 font-bold text-white outline-none w-full" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const val = (e.target as HTMLInputElement).value; if (val) { setEditingApp({...editingApp, docs: [...(editingApp.docs || []), {id: Math.random().toString(), label: val, done: false}]}); (e.target as HTMLInputElement).value = ''; } } }} /><button type="button" className="bg-[#89b4b0] text-white p-2 rounded-lg"><Plus size={18}/></button></div>
                </div>
                <button type="submit" className="w-full bg-[#89b4b0] text-[#0a0f1a] py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all">COMMIT TO STRATEGY</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-sleek-scroll::-webkit-scrollbar { width: 3px; }
        .custom-sleek-scroll::-webkit-scrollbar-thumb { background: rgba(137, 180, 176, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
}

function ApplicationCard({ app, isAdmin, onUpdateStatus, onToggleDoc, onEdit, onDelete, isWinner, isDarkMode }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const doneCount = app.docs.filter((d: any) => d.done).length;
  const progressPercent = app.docs.length > 0 ? Math.round((doneCount / app.docs.length) * 100) : 0;
  const TypeIcon = app.type === 'School' ? School : app.type === 'Scholarship' ? Award : Briefcase;
  const countdown = useMemo(() => {
    const diff = new Date(app.deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days < 0 ? "Expired" : days === 0 ? "Due Today" : `${days}d Left`;
  }, [app.deadline]);

  return (
    <div className={`group/card ${isWinner ? 'bg-amber-50/10 border-amber-500/20' : 'bg-white/70 dark:bg-white/5'} backdrop-blur-3xl border border-white dark:border-white/10 p-7 rounded-[2.5rem] md:rounded-[3rem] shadow-lg relative transition-all duration-500 hover:translate-y-[-6px] text-left cursor-pointer overflow-hidden`} onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-start mb-6 relative z-10"><div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#89b4b0]/15 text-[#3a5a57] dark:text-[#89b4b0] text-[9px] font-black uppercase tracking-widest border border-[#89b4b0]/30"><TypeIcon size={12} /> {app.type}</div>{isAdmin && (<div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-all" onClick={e => e.stopPropagation()}><button onClick={onEdit} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-[#89b4b0] shadow-sm hover:scale-110 outline-none"><Edit3 size={16}/></button><button onClick={() => onDelete(app.id)} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-rose-400 shadow-sm hover:scale-110 outline-none"><Trash2 size={16}/></button></div>)}</div>
      <div className="mb-6 relative z-10"><h3 className={`text-xl md:text-2xl font-bold dark:text-white leading-tight mb-1.5 tracking-tight ${isWinner ? 'text-amber-800' : 'text-slate-950'}`}>{app.name || "Untitled"}</h3><p className="text-[9px] font-black text-[#3a5a57] dark:text-[#89b4b0] uppercase tracking-widest leading-none">{app.degree} • {app.programName || "Major TBD"}</p></div>
      <div className="mb-8 relative z-10"><div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-400 mb-2 font-mono"><span>Readiness Flow</span><span className="text-[#89b4b0] font-bold">{progressPercent}%</span></div><div className="h-1.5 w-full bg-slate-400/20 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#89b4b0] to-[#b2a4d4] transition-all duration-700 shadow-lg" style={{ width: `${progressPercent}%` }} /></div></div>
      <div className={`space-y-3 transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[500px] mb-8 opacity-100' : 'max-h-0 opacity-0'}`}><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 border-b border-slate-200/50 dark:border-white/10 pb-1.5 uppercase">Document Checklist</p><div className="custom-sleek-scroll space-y-3 max-h-[250px] overflow-y-auto pr-2 text-left">{app.docs.map((doc: any) => (<button key={doc.id} disabled={!isAdmin} onClick={(e) => { e.stopPropagation(); onToggleDoc(app.id, doc.id); }} className="flex items-center gap-3 w-full group/item outline-none">{doc.done ? <CheckCircle2 size={18} className="text-[#89b4b0]" /> : <Circle size={18} className="text-[#89b4b0]/40 dark:text-[#89b4b0]/20" />}<span className={`text-[11px] transition-all font-bold ${doc.done ? 'text-white line-through opacity-60' : isDarkMode ? 'text-[#89b4b0]' : 'text-slate-950'}`}>{doc.label}</span></button>))}</div></div>
      <div className="pt-6 border-t border-slate-300/40 dark:border-white/5 flex items-center justify-between relative z-10" onClick={e => e.stopPropagation()}><select disabled={!isAdmin} value={app.status} onChange={(e) => onUpdateStatus(app.id, e.target.value as AppStatus)} className={`bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 p-0 cursor-pointer appearance-none outline-none leading-none ${isDarkMode ? 'text-[#b2a4d4]' : 'text-[#7a6a9b]'}`}>{['In Progress', 'Submitted', 'Pending', 'Waitlisted', 'Accepted'].map(s => <option key={s} value={s} className="text-slate-900 bg-white dark:bg-[#0a0b14] dark:text-white">{s}</option>)}</select><div className="flex flex-col items-end gap-0.5"><div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Clock size={12} /><span className="text-[9px] font-black tracking-widest uppercase">{app.deadline}</span></div><span className={`text-[9px] font-black uppercase tracking-widest ${countdown === 'Expired' ? 'text-rose-500' : 'text-[#89b4b0]'}`}>{countdown}</span></div></div>
      {!isOpen && <div className="text-[7px] font-black text-center mt-5 uppercase tracking-[0.4em] opacity-30 uppercase">Unlock Checklist</div>}
    </div>
  );
}