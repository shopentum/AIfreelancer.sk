import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Filter, 
  Inbox, 
  Briefcase, 
  Brain, 
  Wallet, 
  User, 
  ChevronRight, 
  MoreHorizontal, 
  X, 
  CheckCircle2, 
  ArrowRight,
  History,
  FileText,
  Timer,
  Layout,
  Moon,
  Sun,
  Archive,
  ChevronDown
} from 'lucide-react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd';
import { format, differenceInSeconds } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type ProjectType = 'Inbox' | 'Shopentum' | 'NMH' | 'AIWORKS' | 'Finance' | 'Personal';

type TaskStatus = 'Ready' | 'In Progress' | 'Ready to Review' | 'Done';

interface ActivityLog {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

interface Task {
  id: string;
  title: string;
  summary: string;
  project: ProjectType;
  status: TaskStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  totalTrackedSeconds: number;
  timerStartedAt: Date | null;
  isTimerRunning: boolean;
  isArchived: boolean;
  activityLog: ActivityLog[];
}

const PROJECTS: ProjectType[] = ['Inbox', 'Shopentum', 'NMH', 'AIWORKS', 'Finance', 'Personal'];
const COLUMNS: TaskStatus[] = ['Ready', 'In Progress', 'Ready to Review', 'Done'];

// --- Helpers ---

const formatSeconds = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getProjectIcon = (project: ProjectType) => {
  switch (project) {
    case 'Inbox': return <Inbox size={14} />;
    case 'Shopentum': return <Layout size={14} />;
    case 'NMH': return <Briefcase size={14} />;
    case 'AIWORKS': return <Brain size={14} />;
    case 'Finance': return <Wallet size={14} />;
    case 'Personal': return <User size={14} />;
  }
};

const getProjectColor = (project: ProjectType) => {
  switch (project) {
    case 'Inbox': return 'bg-slate-100 text-slate-600 border-slate-200';
    case 'Shopentum': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    case 'NMH': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'AIWORKS': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'Finance': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'Personal': return 'bg-amber-50 text-amber-600 border-amber-200';
  }
};

// --- Main Component ---

const PersonalKanban: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'Board' | 'Archive'>('Board');
  const [brainDumpProject, setBrainDumpProject] = useState<ProjectType>('Inbox');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Zoptimalizovať SQL query pre dashboard analytics',
      summary: 'Dashboard SQL Opt',
      project: 'Shopentum',
      status: 'In Progress',
      notes: 'Sústrediť sa na indexovanie pre časové rady.',
      createdAt: new Date(Date.now() - 3600000 * 24),
      updatedAt: new Date(),
      totalTrackedSeconds: 3600 + 450,
      timerStartedAt: new Date(Date.now() - 300000),
      isTimerRunning: true,
      isArchived: false,
      activityLog: [
        { id: 'l1', type: 'EVENT', message: 'Task created', timestamp: new Date(Date.now() - 3600000 * 24) },
        { id: 'l2', type: 'EVENT', message: 'Moved to In Progress', timestamp: new Date(Date.now() - 3600000 * 2) },
      ]
    },
    {
      id: 'task-2',
      title: 'Review novej branding stratégie pre ProfiCrafts',
      summary: 'Branding Review',
      project: 'AIWORKS',
      status: 'Ready to Review',
      notes: 'Pripomienkovať hlavne farebnú paletu.',
      createdAt: new Date(Date.now() - 3600000 * 5),
      updatedAt: new Date(),
      totalTrackedSeconds: 7200,
      timerStartedAt: null,
      isTimerRunning: false,
      isArchived: false,
      activityLog: [
        { id: 'l3', type: 'EVENT', message: 'Task created', timestamp: new Date(Date.now() - 3600000 * 5) },
      ]
    },
    {
      id: 'task-3',
      title: 'Uhradiť faktúry za hosting a doménu',
      summary: 'Hostina & Domain FA',
      project: 'Finance',
      status: 'Ready',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalTrackedSeconds: 0,
      timerStartedAt: null,
      isTimerRunning: false,
      isArchived: false,
      activityLog: []
    }
  ]);
  const [activeProject, setActiveProject] = useState<ProjectType | 'All'>('All');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [brainDumpText, setBrainDumpText] = useState('');

  // Sync Brain Dump Project with Active Project
  useEffect(() => {
    if (activeProject !== 'All') {
      setBrainDumpProject(activeProject);
    }
  }, [activeProject]);
  
  // Timer Update Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.isTimerRunning && task.timerStartedAt) {
            const now = new Date();
            const elapsed = differenceInSeconds(now, task.timerStartedAt);
            return {
              ...task,
              // We don't update totalTrackedSeconds here to avoid excessive state churn
              // Instead, we calculate live display time
            };
          }
          return task;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addActivity = (task: Task, message: string): ActivityLog => ({
    id: Math.random().toString(36).substr(2, 9),
    type: 'EVENT',
    message,
    timestamp: new Date()
  });

  const handleCreateTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brainDumpText.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: brainDumpText,
      summary: brainDumpText.length > 40 ? brainDumpText.substring(0, 40) + '...' : brainDumpText,
      project: brainDumpProject,
      status: 'Ready',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      totalTrackedSeconds: 0,
      timerStartedAt: null,
      isTimerRunning: false,
      isArchived: false,
      activityLog: [{
        id: 'msg-1',
        type: 'SYSTEM',
        message: 'Task created via Terminal',
        timestamp: new Date()
      }]
    };

    setTasks([newTask, ...tasks]);
    setBrainDumpText('');
  };

  const toggleTimer = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isStopping = t.isTimerRunning;
        let newTotal = t.totalTrackedSeconds;
        
        if (isStopping && t.timerStartedAt) {
          newTotal += differenceInSeconds(new Date(), t.timerStartedAt);
        }

        return {
          ...t,
          isTimerRunning: !isStopping,
          timerStartedAt: !isStopping ? new Date() : null,
          totalTrackedSeconds: newTotal,
          activityLog: [...t.activityLog, addActivity(t, isStopping ? 'Timer stopped' : 'Timer started')]
        };
      }
      return t;
    }));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    
    setTasks(prev => prev.map(t => {
      if (t.id === draggableId) {
        let updatedTask = { ...t, status: newStatus, updatedAt: new Date() };
        let logMessage = `Moved to ${newStatus}`;

        // Timer Logic Transitions
        if (newStatus === 'In Progress' && !t.isTimerRunning) {
          // Could ask user, but for MVP we'll just log it or provide easy start
        }

        if (newStatus === 'Ready to Review' && t.isTimerRunning) {
          const elapsed = t.timerStartedAt ? differenceInSeconds(new Date(), t.timerStartedAt) : 0;
          updatedTask.isTimerRunning = false;
          updatedTask.totalTrackedSeconds += elapsed;
          updatedTask.timerStartedAt = null;
          logMessage += ' (Timer paused automatically)';
        }

        if (newStatus === 'Done' && t.isTimerRunning) {
          const elapsed = t.timerStartedAt ? differenceInSeconds(new Date(), t.timerStartedAt) : 0;
          updatedTask.isTimerRunning = false;
          updatedTask.totalTrackedSeconds += elapsed;
          updatedTask.timerStartedAt = null;
          logMessage += ' (Timer stopped automatically)';
        }

        updatedTask.activityLog = [...updatedTask.activityLog, addActivity(t, logMessage)];
        return updatedTask;
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesProject = activeProject === 'All' || t.project === activeProject;
    const matchesView = currentView === 'Board' ? !t.isArchived : t.isArchived;
    return matchesProject && matchesView;
  });

  const displayColumns = currentView === 'Board' 
    ? COLUMNS 
    : ['Done'] as TaskStatus[];

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-inter ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* HEADERBAR */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-8 py-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'}`}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Execution Layer</h1>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Personal Productivity Terminal</p>
            </div>
          </div>

          {/* BRAIN DUMP INPUT */}
          <div className="flex-1 max-w-2xl px-4">
            <form onSubmit={handleCreateTask} className="relative group flex items-center">
              <div className="relative">
                <select 
                  value={brainDumpProject}
                  onChange={(e) => setBrainDumpProject(e.target.value as ProjectType)}
                  className={`appearance-none pl-4 pr-10 py-4 text-xs font-bold rounded-l-2xl border-r transition-all outline-none cursor-pointer ${
                    isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-400 focus:text-indigo-400 group-focus-within:border-indigo-500/50' 
                    : 'bg-slate-100 border-slate-200 text-slate-500 focus:text-slate-900 group-focus-within:border-slate-300'
                  }`}
                >
                  {PROJECTS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
                </div>
              </div>
              <input 
                type="text"
                value={brainDumpText}
                onChange={(e) => setBrainDumpText(e.target.value)}
                placeholder="Brain dump: Capture everything here... (Enter to add)"
                className={`flex-1 border-none rounded-r-2xl px-6 py-4 text-sm transition-all outline-none focus:ring-2 ${
                  isDarkMode 
                  ? 'bg-slate-900 focus:ring-indigo-500 text-white placeholder-slate-600' 
                  : 'bg-slate-100 focus:ring-slate-900 text-slate-900 placeholder-slate-400'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <span className={`hidden group-focus-within:block text-[10px] font-bold px-2 py-1 rounded-lg border ${
                  isDarkMode ? 'text-slate-500 bg-slate-800 border-slate-700' : 'text-slate-400 bg-white border-slate-200'
                }`}>ENTER</span>
                <button type="submit" className={`p-2 rounded-xl shadow-lg transition-all ${
                  isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-500/20'
                }`}>
                  <Plus size={18} />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <Clock size={16} className={isDarkMode ? 'text-slate-600' : 'text-slate-400'} />
              <span className="text-xs font-bold">Session: {format(new Date(), 'HH:mm')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* PROJECT FILTER BAR w/ DARK TOGGLE */}
      <div className={`border-b transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-[1800px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar no-scrollbar">
            <button 
              onClick={() => setActiveProject('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeProject === 'All' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-white shadow-lg') 
                : (isDarkMode ? 'text-slate-500 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50')
              }`}
            >
              All Projects
            </button>
            <div className={`h-4 w-px mx-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            {PROJECTS.map((p) => (
              <button 
                key={p}
                onClick={() => setActiveProject(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                  activeProject === p 
                  ? (isDarkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-900 text-white shadow-lg') 
                  : (isDarkMode ? 'text-slate-500 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50')
                }`}
              >
                <span className="opacity-60">{getProjectIcon(p)}</span>
                <span>{p}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* View Switcher: Board / Archive */}
            <div className={`flex items-center p-1 rounded-xl border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button 
                onClick={() => setCurrentView('Board')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentView === 'Board' 
                  ? (isDarkMode ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-slate-200') 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Layout size={12} />
                <span>Board</span>
              </button>
              <button 
                onClick={() => setCurrentView('Archive')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentView === 'Archive' 
                  ? (isDarkMode ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-slate-200') 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Archive size={12} />
                <span>Archive</span>
              </button>
            </div>

            <div className={`h-8 w-px mx-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <main className="max-w-[1800px] mx-auto p-8 overflow-hidden h-[calc(100vh-140px)]">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-8 overflow-x-auto pb-4 custom-scrollbar">
            {displayColumns.map((col) => (
              <div key={col} className="flex-1 min-w-[320px] flex flex-col space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-3">
                    <h3 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{col}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border transition-colors ${
                      isDarkMode ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {filteredTasks.filter(t => t.status === col).length}
                    </span>
                  </div>
                  <button className={`transition-colors ${isDarkMode ? 'text-slate-700 hover:text-slate-400' : 'text-slate-300 hover:text-slate-600'}`}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <Droppable droppableId={col}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar transition-colors rounded-2xl p-2 ${
                        snapshot.isDraggingOver ? (isDarkMode ? 'bg-white/5' : 'bg-slate-100') : ''
                      }`}
                    >
                      {filteredTasks.filter(t => t.status === col).map((task, index) => {
                        const DraggableComp = Draggable as any;
                        return (
                          <DraggableComp draggableId={task.id} index={index} key={task.id}>
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTaskId(task.id)}
                              className={`group p-5 rounded-[1.5rem] border shadow-sm transition-all cursor-pointer relative overflow-hidden select-none ${
                                isDarkMode 
                                ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-100 shadow-slate-950/20' 
                                : 'bg-white border-slate-200 hover:shadow-xl hover:translate-y-[-2px] text-slate-900'
                              } ${
                                snapshot.isDragging 
                                ? (isDarkMode ? 'shadow-2xl scale-[1.02] border-indigo-500/50 bg-slate-800/90' : 'shadow-2xl scale-[1.02] border-slate-900 bg-white/95') 
                                : ''
                              }`}
                            >
                              {/* Background Pattern for specific projects */}
                              <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                                {getProjectIcon(task.project)}
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.15em] ${getProjectColor(task.project)}`}>
                                    {task.project}
                                  </div>
                                  
                                  {/* Live Timer Badge */}
                                  <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border transition-colors ${
                                    task.isTimerRunning ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-100'
                                  }`}>
                                    <Timer size={10} className={task.isTimerRunning ? 'animate-pulse' : ''} />
                                    <span className="text-[10px] font-mono font-bold">
                                      {formatSeconds(task.totalTrackedSeconds + (task.isTimerRunning && task.timerStartedAt ? differenceInSeconds(new Date(), task.timerStartedAt) : 0))}
                                    </span>
                                  </div>
                                </div>

                                <h4 className={`text-sm font-bold leading-snug line-clamp-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{task.summary || task.title}</h4>
                                
                                <div className={`flex items-center justify-between pt-2 border-t transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                                  <div className={`flex items-center space-x-2 text-[10px] font-medium italic transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    <Clock size={12} />
                                    <span>{format(task.createdAt, 'd. MMM')}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); toggleTimer(task.id); }}
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                        task.isTimerRunning 
                                        ? (isDarkMode ? 'bg-amber-600/20 text-amber-500 hover:bg-amber-600/30' : 'bg-amber-100 text-amber-600 hover:bg-amber-200') 
                                        : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                                      }`}
                                    >
                                      {task.isTimerRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DraggableComp>
                      );})}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>

      {/* TASK DETAIL DRAWER */}
      <AnimatePresence>
        {selectedTaskId && selectedTask && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTaskId(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className={`fixed top-0 right-0 h-full w-full max-w-[60%] shadow-[-40px_0_80px_rgba(0,0,0,0.3)] z-50 flex flex-col font-inter transition-colors duration-500 ${
                isDarkMode ? 'bg-slate-900 border-l border-slate-800' : 'bg-white'
              }`}
            >
              {/* Drawer Header */}
              <div className={`px-12 py-8 border-b flex items-center justify-between transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest transition-colors ${
                    isDarkMode && selectedTask.project === 'Inbox' ? 'bg-slate-800 border-slate-700 text-slate-400' : getProjectColor(selectedTask.project)
                  }`}>
                    {selectedTask.project}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTaskId(null)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-16 py-12 space-y-12 custom-scrollbar">
                
                {/* Title & Summary Section */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Názov</p>
                    <textarea 
                      value={selectedTask.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, title: val, updatedAt: new Date() } : t));
                      }}
                      className={`w-full text-4xl font-black tracking-tighter border-none resize-none focus:ring-0 p-0 leading-[1.1] bg-transparent transition-colors ${
                        isDarkMode ? 'text-white placeholder-slate-700' : 'text-slate-900 placeholder-slate-400'
                      }`}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Summary (kanban)</p>
                    <input 
                      type="text"
                      value={selectedTask.summary}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, summary: val } : t));
                      }}
                      className={`w-full text-lg font-bold border-none focus:ring-0 p-0 bg-transparent transition-colors ${
                        isDarkMode ? 'text-slate-200 placeholder-slate-800' : 'text-slate-700 placeholder-slate-300'
                      }`}
                      placeholder="Short summary for the board..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                   {/* Project Selector */}
                   <div className="space-y-4">
                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Projekt</p>
                      <select 
                        value={selectedTask.project}
                        onChange={(e) => {
                          const val = e.target.value as ProjectType;
                          setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, project: val, updatedAt: new Date() } : t));
                        }}
                        className={`w-full p-4 rounded-2xl border text-sm font-bold appearance-none transition-all outline-none ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-slate-300'
                        }`}
                      >
                        {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                   </div>

                   {/* Status Selector */}
                   <div className="space-y-4">
                      <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Stav</p>
                      <select 
                        value={selectedTask.status}
                        onChange={(e) => {
                          const val = e.target.value as TaskStatus;
                          setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: val, updatedAt: new Date() } : t));
                        }}
                        className={`w-full p-4 rounded-2xl border text-sm font-bold appearance-none transition-all outline-none ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-slate-300'
                        }`}
                      >
                        {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Poznámky</p>
                    <span className="text-[10px] font-bold text-slate-500 italic">Markdown supported</span>
                  </div>
                  <textarea 
                    value={selectedTask.notes}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, notes: val } : t));
                    }}
                    placeholder="Jot down details, links, or context-switching notes..."
                    className={`w-full border rounded-[2rem] p-8 text-sm transition-all min-h-[200px] outline-none leading-relaxed ${
                        isDarkMode 
                        ? 'bg-slate-800/30 border-slate-800 text-slate-300 placeholder-slate-700 focus:bg-slate-800/50 focus:border-indigo-500/30' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-200'
                    }`}
                  />
                </div>

                {/* Timer Section - REFACTORED COMPACT */}
                <div className="space-y-6">
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Časovač</p>
                  
                  <div className={`p-8 rounded-[2.5rem] border flex items-center justify-between transition-all ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="space-y-1">
                      <div className={`text-4xl font-mono font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {formatSeconds(selectedTask.totalTrackedSeconds + (selectedTask.isTimerRunning && selectedTask.timerStartedAt ? differenceInSeconds(new Date(), selectedTask.timerStartedAt) : 0))}
                      </div>
                      <div className="flex items-center space-x-2">
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedTask.isTimerRunning ? 'text-emerald-500' : 'text-slate-400'}`}>
                           Stav: {selectedTask.isTimerRunning ? 'spustený' : 'zastavený'}
                         </span>
                         {selectedTask.isTimerRunning && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleTimer(selectedTask.id)}
                        className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center space-x-2 ${
                          selectedTask.isTimerRunning 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {selectedTask.isTimerRunning ? <><Pause size={14} fill="currentColor" /> <span>Pause</span></> : <><Play size={14} fill="currentColor" /> <span>Start</span></>}
                      </button>
                      <button 
                        onClick={() => { if (selectedTask.isTimerRunning) toggleTimer(selectedTask.id); }}
                        className={`w-10 h-10 border rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                          isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-600 hover:text-red-400' : 'bg-white border-slate-200 text-slate-300 hover:text-red-500'
                        }`}
                      >
                        <Square size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-8 pb-12">
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>História úlohy</p>
                  
                  <div className="relative space-y-8">
                    <div className={`absolute left-5 top-2 bottom-2 w-px transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                    {selectedTask.activityLog.slice().reverse().map((log, i) => (
                      <div key={log.id} className="relative pl-14 group">
                        <div className={`absolute left-0 top-1.5 w-10 h-10 rounded-full flex items-center justify-center shadow-sm z-10 transition-all ${
                            isDarkMode 
                            ? (i === 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800') 
                            : (i === 0 ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100')
                          } border`}>
                          <Clock size={14} />
                        </div>
                        <div className="space-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {format(log.timestamp, 'd. M. yyyy • HH:mm')}
                          </p>
                          <p className={`text-sm font-bold tracking-tight leading-none transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className={`px-12 py-8 border-t flex items-center justify-between transition-colors ${
                isDarkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <button 
                  onClick={() => {
                    setTasks(tasks.filter(t => t.id !== selectedTaskId));
                    setSelectedTaskId(null);
                  }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                    isDarkMode ? 'text-red-400/80 hover:text-red-400 hover:bg-red-400/10' : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Archive size={14} />
                  <span>Delete Task</span>
                </button>
                
                <div className="flex items-center space-x-6">
                   <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>Task GUID: {selectedTask.id.toUpperCase()}</span>
                    {selectedTask.status === 'Done' && (
                      <button 
                        onClick={() => {
                          setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, isArchived: !t.isArchived } : t));
                          setSelectedTaskId(null);
                        }}
                        className={`flex items-center space-x-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
                          selectedTask.isArchived 
                          ? (isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                          : (isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20')
                        }`}
                      >
                        <Archive size={14} />
                        <span>{selectedTask.isArchived ? 'Restore to Board' : 'Archive Task'}</span>
                      </button>
                    )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalKanban;
