"use client";

import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "@/i18n/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Home, 
  Image as ImageIcon, 
  Video, 
  Layers, 
  CheckSquare, 
  Tag, 
  Printer, 
  BarChart3, 
  Star, 
  Settings, 
  Globe, 
  PlayCircle,
  Save,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Search,
  Calendar,
  Clock,
  Info,
  Sparkles,
  Eye,
  History,
  ExternalLink,
  Bold,
  Italic,
  List,
  Quote,
  Code,
  Type,
  MoreHorizontal,
  User,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  ShieldAlert,
  MousePointer2,
  Edit3,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  fixClaimWithAI,
  type Claim,
  type ArticleAudit,
  type SeoAuditKey,
} from "@/eagle_admin/geminiService";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared by mirror + textarea so line boxes match (reduces highlight ghosting). */
const EAGLE_EDITOR_SURFACE_CLASS =
  "box-border w-full min-h-full p-8 text-sm font-medium leading-relaxed tracking-normal text-[#1f2937] subpixel-antialiased [font-kerning:normal] [font-feature-settings:'kern'_1] [tab-size:8] whitespace-pre-wrap break-words [overflow-wrap:anywhere]";

function isSeoAuditKey(id: string | null): id is SeoAuditKey {
  return (
    id === "title" ||
    id === "seoTitle" ||
    id === "url" ||
    id === "perex"
  );
}

function slugifyForUrl(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

const EagleCMS_Split: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Interný');
  const [mediaTab, setMediaTab] = useState('Obrázok');
  const [title, setTitle] = useState('O krok bližšie k liečbe Alzheimera? Vedci odhalili dostupný zázrak v prášku. Stojí pár eur');
  const [seoTitle, setSeoTitle] = useState('O krok bližšie k liečbe Alzheimera? Stojí pár eur!');
  const [urlTitle, setUrlTitle] = useState('o-krok-blizsie-k-liecbe-alzheimera-vedci-odhalili-dostupny-zazrak-v-prasku-stoji-par-eur');
  const [perex, setPerex] = useState('Doplnok, ktorý si väčšina ľudí spája s kulturistikou, teraz šokuje vedecký svet. Populárny prášok z fitness centier sa totiž dostáva do centra pozornosti neurovedcov ako možná podpora v boji proti rozšírenej chorobe.');
  const [content, setContent] = useState('Podľa najnovších štúdií publikovaných v prestížnom vedeckom časopise Nature, by kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení. Tento doplnok, ktorý si väčšina ľudí spája s nárastom svalovej hmoty a kulturistikou, teraz šokuje vedecký svet svojimi účinkami na mozog. Populárny prášok z fitness centier sa totiž dostáva do centra pozornosti neurovedcov ako možná podpora v boji proti Alzheimerovej chorobe.\n\nNeurofyziologička Louisa Nichola v nedávnom podcaste The Diary of a CEO prezradila, že túto dostupnú zložku považuje za mimoriadne prospešnú pre zdravie mozgu. "Kreatín nie je len pre svaly. Esenciálny hráč v energetickom metabolizme mozgu," vysvetľuje odborníčka. Podľa jej slov ho dokonca podáva aj svojim 71-ročným rodičom ako preventívne opatrenie.\n\nVedecký tím z University of Sydney pod vedením doktorky Caroline Rae už v minulosti preukázal, že suplementácia kreatínom môže viesť k výraznému zlepšeniu pracovnej pamäte a inteligencie u zdravých jedincov. Mechanizmus účinku spočíva v tom, že kreatín zvyšuje dostupnosť ATP (adenozíntrifosfátu) v neurónoch, čo umožňuje mozgu pracovať efektívnejšie pri náročných kognitívnych úlohách.\n\nPre milióny rodín, ktoré denne zápasia s demenciou, to znie ako veľká nádej. Je však dôležité poznamenať, že hoci sú doterajšie výsledky sľubné, kreatín nie je zázračným liekom. Odborníci varujú pred nekontrolovaným užívaním vysokých dávok bez konzultácie s lekárom, najmä u pacientov s existujúcimi ochoreniami obličiek. Napriek tomu, vzhľadom na nízku cenu a vysoký bezpečnostný profil, sa kreatín javí ako jeden z najzaujímavejších kandidátov na poli neuroprotektívnych látok súčasnosti.');
  const [brand, setBrand] = useState('Nový Čas');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Validation States
  const [isValidating, setIsValidating] = useState(false);
  const [audit, setAudit] = useState<ArticleAudit | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<'trust' | 'linguistic' | 'seo'>('trust');
  const [auditError, setAuditError] = useState<string | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<'settings' | 'ai'>('settings');

  const handleValidate = async () => {
    setIsValidating(true);
    setRightPanelMode('ai');
    setAuditError(null);
    
    // Simulate API delay for "Intelligence Engine" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockAudit: ArticleAudit = {
      readinessScore: 84,
      seoAudit: {
        title: { status: 'fail', message: 'Titulok je príliš dlhý (92 znakov). Odporúčané maximum je 70.', suggestion: 'Skráťte titulok na: O krok bližšie k liečbe Alzheimera? Vedci odhalili zázrak v prášku' },
        seoTitle: {
          status: "warning",
          message: "SEO Titulok by mohol byť údernejší.",
          suggestion:
            "EXKLUZÍVNE: O krok bližšie k liečbe Alzheimera? Stojí pár eur!",
        },
        url: {
          status: "warning",
          message: "Slug je dlhý; kratší URL môže zlepšiť zdieľanie.",
          suggestion: "alzheimer-kreatin-doplnok-studia",
        },
        perex: {
          status: "warning",
          message: "Perex môže byť konkrétnejší v prvej vete.",
          suggestion:
            "Kreatín z fitiek mieri do výskumu Alzheimerovej choroby. Čo zatiaľ ukazujú dáta a čo odborníci odporúčajú?",
        },
      },
      editorialAudit: {
        tone: 'Informatívny / Bulvárny (vhodný pre Nový Čas)',
        brandAlignment: { status: 'pass', message: 'Obsah plne rešpektuje redakčné smernice Nového Času.' },
        clickbaitScore: 6,
        suggestions: ['Zvážte pridanie viac citácií', 'Zvýšte počet interných prelinkov']
      },
      claims: [
        {
          id: 'claim-1',
          text: 'kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení',
          risk: 'high',
          reason: 'Príliš silné medicínske tvrdenie',
          explanation: 'Slovo "prelom" v kontexte liečby Alzheimera môže byť vnímané ako zavádzajúce, pokiaľ nie je podložené finálnymi klinickými štúdiami na ľuďoch.',
          recommendedAction: 'Zmiernite tón tvrdenia na "potenciálny prínos" alebo "predmet skúmania".',
          startIndex: 0,
          endIndex: 0
        },
        {
          id: 'claim-2',
          text: 'stojí pár eur',
          risk: 'medium',
          reason: 'Vágne cenové tvrdenie',
          explanation: 'Výraz "pár eur" je subjektívny. Pre niekoho to môže byť 2€, pre iného 20€.',
          recommendedAction: 'Uveďte približnú cenovú reláciu alebo porovnanie s inými doplnkami.',
          startIndex: 0,
          endIndex: 0
        },
        {
          id: 'claim-3',
          text: 'dostupnú zložku považuje za mimoriadne prospešnú pre zdravie mozgu',
          risk: 'low',
          reason: 'Názor expertky',
          explanation: 'Tvrdenie je pripísané konkrétnej osobe, čo znižuje riziko, ale stále ide o silné vyjadrenie.',
          recommendedAction: 'Ponechať, ale uistiť sa, že meno expertky je správne uvedené.',
          startIndex: 0,
          endIndex: 0
        }
      ],
      linguisticClaims: [
        {
          id: 'ling-1',
          text: 'Podľa najnovších štúdií publikovaných v prestížnom vedeckom časopise Nature, by kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení.',
          risk: 'medium',
          reason: 'Príliš odborný úvod',
          explanation: 'Tento odsek začína veľmi technicky. Čitatelia Nového Času preferujú priamejší a akčnejší štart.',
          recommendedAction: 'Preformulujte úvod na niečo údernejšie, napríklad: "Zabudnite na svaly! Populárny fitness prášok môže zachrániť váš mozog."',
          startIndex: 0,
          endIndex: 0
        },
        {
          id: 'ling-2',
          text: 'Mechanizmus účinku spočíva v tom, že kreatín zvyšuje dostupnosť ATP (adenozíntrifosfátu) v neurónoch, čo umožňuje mozgu pracovať efektívnejšie pri náročných kognitívnych úlohách.',
          risk: 'high',
          reason: 'Vysoká kognitívna záťaž',
          explanation: 'Použitie odborných termínov ako "adenozíntrifosfát" v texte pre širokú verejnosť pôsobí odradzujúco.',
          recommendedAction: 'Nahraďte odborné termíny jednoduchším vysvetlením: "Kreatín funguje ako turbo palivo pre mozgové bunky."',
          startIndex: 0,
          endIndex: 0
        }
      ]
    };

    setAudit(mockAudit);
    setIsValidating(false);
  };

  const handleClaimClick = (claim: Claim) => {
    setSelectedClaimId(claim.id);
    const ta = editorRef.current;
    if (!ta) return;
    const index = content.indexOf(claim.text);
    if (index === -1) return;
    ta.focus();
    ta.setSelectionRange(index, index + claim.text.length);
    const lh = parseFloat(getComputedStyle(ta).lineHeight);
    const lineHeight = Number.isFinite(lh) && lh > 0 ? lh : 26;
    let line = 0;
    for (let i = 0; i < index; i++) {
      if (content[i] === "\n") line++;
    }
    ta.scrollTop = Math.max(0, line * lineHeight - ta.clientHeight * 0.2);
    setScrollTop(ta.scrollTop);
  };

  const onEditorScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    const next = e.currentTarget.scrollTop;
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
    }
    scrollRafRef.current = requestAnimationFrame(() => {
      setScrollTop(next);
      scrollRafRef.current = null;
    });
  }, []);

  useLayoutEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const handleFixWithAI = async (claim: Claim) => {
    const fixedText = await fixClaimWithAI(claim.text, content);
    const newContent = content.replace(claim.text, fixedText);
    setContent(newContent);
    
    // Update claims locally
    if (audit) {
      setAudit({
        ...audit,
        claims: audit.claims.filter(c => c.id !== claim.id),
        linguisticClaims: audit.linguisticClaims?.filter(c => c.id !== claim.id)
      });
    }
    if (selectedClaimId === claim.id) setSelectedClaimId(null);
  };

  const applySeoSuggestion = useCallback(
    (key: SeoAuditKey) => {
      if (!audit) return;
      const item = audit.seoAudit[key];
      const raw = item.suggestion?.trim();
      if (!raw) return;

      const stripTitle = (s: string) =>
        s
          .replace(/^(Skráťte titulok na:|Skráťte na:)\s*/i, "")
          .replace(/^["']|["']$/g, "")
          .trim();

      if (key === "title") setTitle(stripTitle(raw));
      else if (key === "seoTitle") setSeoTitle(raw);
      else if (key === "url") setUrlTitle(slugifyForUrl(raw));
      else if (key === "perex") setPerex(raw);

      setAudit((prev) => {
        if (!prev) return prev;
        const prevItem = prev.seoAudit[key];
        return {
          ...prev,
          seoAudit: {
            ...prev.seoAudit,
            [key]: {
              ...prevItem,
              status: "pass",
              message: "Úprava bola použitá z AI návrhu.",
              suggestion: undefined,
            },
          },
        };
      });
      setSelectedClaimId(null);
    },
    [audit],
  );

  const highlightNodes = useMemo(() => {
    const claims = [
      ...(audit?.claims ?? []),
      ...(audit?.linguisticClaims ?? []),
    ];
    return content.split(/(\s+)/).map((part, i) => {
      const trimmed = part.trim();
      if (trimmed.length < 3) return <span key={i}>{part}</span>;
      const claim = claims.find((c) => c.text.includes(trimmed));
      if (claim) {
        return (
          <span
            key={i}
            className={cn(
              "rounded-sm transition-all duration-300",
              selectedClaimId === claim.id
                ? "bg-yellow-200/80 ring-2 ring-yellow-400"
                : claim.risk === "high"
                  ? "bg-red-100/50"
                  : claim.risk === "medium"
                    ? "bg-yellow-100/50"
                    : "bg-green-100/50",
            )}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }, [audit?.claims, audit?.linguisticClaims, content, selectedClaimId]);

  const sidebarItems = [
    { icon: BarChart3, label: 'Realtime štatistiky' },
    { icon: FileText, label: 'Zoznam článkov', active: true, subItems: true },
    { icon: Home, label: 'Homepage' },
    { icon: ImageIcon, label: 'DAM', subItems: true },
    { icon: Video, label: 'Video', subItems: true },
    { icon: Layers, label: 'Moduly', subItems: true },
    { icon: CheckSquare, label: 'Testy', subItems: true },
    { icon: Tag, label: 'Ponuky článkov', subItems: true },
    { icon: Printer, label: 'Print', subItems: true },
    { icon: BarChart3, label: 'Editor výkonnosti', subItems: true },
    { icon: Star, label: 'Sponzorované články', subItems: true },
    { icon: Settings, label: 'Systém', subItems: true },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#333] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-[#2C5282] font-bold text-xl tracking-tight">EAGLE <span className="font-normal text-gray-500">Admin</span></h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {sidebarItems.map((item, idx) => (
            <div key={idx}>
              <button className={cn(
                "w-full flex items-center px-4 py-2.5 text-sm transition-colors",
                item.active ? "bg-[#EBF4FF] text-[#2C5282] font-semibold border-r-4 border-[#2C5282]" : "text-gray-600 hover:bg-gray-50"
              )}>
                <item.icon size={18} className="mr-3 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.subItems && <ChevronDown size={14} className={cn("ml-2 opacity-50", item.active ? "rotate-0" : "-rotate-90")} />}
              </button>
              {item.active && (
                <div className="bg-gray-50 py-1">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full text-left px-12 py-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Archív (Modal)
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/eagle-admin")}
                    className="w-full text-left px-12 py-2 text-xs text-[#2C5282] font-semibold"
                  >
                    AI Split View
                  </button>
                  <button className="w-full text-left px-12 py-2 text-xs text-gray-500 hover:text-gray-700">Všetky články</button>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">Editácia článku</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center text-xs text-[#2C5282] font-medium hover:underline">
              <ExternalLink size={14} className="mr-1" /> Nový článok
            </button>
            <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
              <div className="text-right">
                <p className="text-xs font-semibold">Lukas.Saghy@newsandmedia.sk</p>
                <p className="text-[10px] text-gray-500">Lukas.Saghy@newsandmedia.sk</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User size={18} />
              </div>
              <button className="text-gray-400 hover:text-red-500">
                <PlayCircle size={20} className="rotate-90" />
              </button>
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button className={cn(
              "px-3 py-1.5 rounded text-xs font-bold flex items-center transition-all",
              (audit?.readinessScore || 0) > 80 ? "bg-[#48BB78] text-white hover:bg-[#38A169]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}>
              <Upload size={14} className="mr-1.5" /> Publikovať
            </button>
            <button className="bg-[#3182CE] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-[#2B6CB0]">
              <CheckSquare size={14} className="mr-1.5" /> Na kontrolu
            </button>
            <button className="bg-[#ED8936] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-[#DD6B20]">
              Exportovať do Woodwing
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-[11px] text-gray-500 italic">
              upravil: <span className="font-semibold not-italic">Lucia Džurná</span>, 12.02.2026 21:01
            </div>
            <button className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center">
              <History size={14} className="mr-1.5" /> Verzovanie
            </button>
            <div className="flex items-center space-x-1">
              <button className="bg-[#3182CE] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-[#2B6CB0]">
                <Save size={14} className="mr-1.5" /> Uložiť
              </button>
              <button className="bg-[#E53E3E] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-[#C53030]">
                <Trash2 size={14} className="mr-1.5" /> Vymazať
              </button>
              <button className="bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center hover:bg-gray-800">
                <X size={14} className="mr-1.5" /> Zatvoriť
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Bar */}
        <div className="h-16 bg-[#F8FAFC] border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-inner relative z-40">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-900 shadow-sm">
                <ShieldAlert size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Intelligence Engine</p>
                <p className="text-xs font-bold text-gray-700">Trust & Governance Layer</p>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200"></div>

            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase">
                  <span>Readiness Score</span>
                  <span>{audit?.readinessScore || 0}%</span>
                </div>
                <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${audit?.readinessScore || 0}%` }}
                    className={cn(
                      "h-full transition-colors",
                      (audit?.readinessScore || 0) > 80 ? "bg-emerald-500" : 
                      (audit?.readinessScore || 0) > 50 ? "bg-yellow-500" : "bg-red-500"
                    )}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleValidate}
                disabled={isValidating}
                className={cn(
                  "flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  isValidating 
                    ? "bg-gray-100 text-gray-400" 
                    : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 active:scale-95"
                )}
              >
                {isValidating ? <RefreshCw size={14} className="mr-2 animate-spin" /> : <Sparkles size={14} className="mr-2" />}
                {isValidating ? 'Audit v procese...' : 'Validovať článok'}
              </button>
            </div>
          </div>
        </div>

        {/* Editor Area: main nesmie mať overflow-y-auto, inak sticky pravého panelu zlyhá. */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
          <div className="mx-auto grid min-h-0 flex-1 grid-cols-12 gap-6 max-w-[1800px]">
            {/* Left Column: Content */}
            <div className="col-span-12 flex max-h-[min(calc(100vh-9.5rem),1080px)] min-h-0 flex-col gap-6 overflow-y-auto pr-1 lg:col-span-8">
              
              {/* Hlavný obsah Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Hlavný obsah</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase mr-2">Typ článku</span>
                    {['Interný', 'Externý', 'Video', 'Kvíz', 'Fotostory'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-3 py-1 text-[11px] font-bold rounded transition-colors",
                          activeTab === tab ? "bg-[#2D3748] text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Titulok */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-600">Titulok <span className="text-red-500">*</span></label>
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{title.length}</span>
                    </div>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] outline-none text-sm font-medium"
                    />
                  </div>

                  {/* SEO Titulok */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-600 flex items-center">
                        <Globe size={12} className="mr-1 text-gray-400" /> SEO titulok <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{seoTitle.length}</span>
                    </div>
                    <input 
                      type="text" 
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-7 space-y-6">
                      {/* Titulok pre URL */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-gray-600">Titulok pre URL <span className="text-red-500">*</span></label>
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{urlTitle.length}</span>
                        </div>
                        <input 
                          type="text" 
                          value={urlTitle}
                          onChange={(e) => setUrlTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] outline-none text-xs text-gray-500 bg-gray-50"
                        />
                      </div>

                      {/* Perex */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-gray-600 flex items-center">
                            <Globe size={12} className="mr-1 text-gray-400" /> Perex <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center space-x-2">
                            <button className="bg-[#48BB78] text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center hover:bg-[#38A169]">
                              <Sparkles size={10} className="mr-1" /> Generovať
                            </button>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{perex.length}</span>
                          </div>
                        </div>
                        <textarea 
                          value={perex}
                          onChange={(e) => setPerex(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] outline-none text-sm leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-col space-y-3">
                        <label className="flex items-center text-xs text-gray-600 cursor-pointer group">
                          <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#3182CE] focus:ring-[#3182CE]" />
                          <span className="group-hover:text-gray-900 transition-colors">Iný perex na HP / v rubrike</span>
                        </label>
                        <label className="flex items-center text-xs text-gray-600 cursor-pointer group">
                          <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#3182CE] focus:ring-[#3182CE]" />
                          <span className="group-hover:text-gray-900 transition-colors">A/B/C Testing</span>
                          <Info size={12} className="ml-1.5 text-gray-400" />
                        </label>
                      </div>
                    </div>

                    {/* Media Column */}
                    <div className="col-span-5 space-y-3">
                      <div className="flex border border-gray-200 rounded overflow-hidden">
                        <button 
                          onClick={() => setMediaTab('Obrázok')}
                          className={cn(
                            "flex-1 py-1.5 text-[10px] font-bold uppercase flex items-center justify-center transition-colors",
                            mediaTab === 'Obrázok' ? "bg-[#2D3748] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          <ImageIcon size={12} className="mr-1.5" /> Hlavný obrázok
                        </button>
                        <button 
                          onClick={() => setMediaTab('Video')}
                          className={cn(
                            "flex-1 py-1.5 text-[10px] font-bold uppercase flex items-center justify-center transition-colors",
                            mediaTab === 'Video' ? "bg-[#2D3748] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                          )}
                        >
                          <Video size={12} className="mr-1.5" /> Hlavné video
                        </button>
                      </div>
                      
                      <div className="aspect-video bg-gray-100 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 group hover:border-[#3182CE] hover:bg-gray-50 transition-all cursor-pointer relative">
                        <ImageIcon size={48} strokeWidth={1} className="mb-2 group-hover:text-[#3182CE] transition-colors" />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">
                            <LinkIcon size={10} />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button className="flex-1 bg-[#3182CE] text-white py-1.5 rounded text-[10px] font-bold flex items-center justify-center hover:bg-[#2B6CB0]">
                          Vybrať
                        </button>
                        <button className="flex-1 bg-[#3182CE] text-white py-1.5 rounded text-[10px] font-bold flex items-center justify-center hover:bg-[#2B6CB0]">
                          <Upload size={12} className="mr-1" /> Nahrať
                        </button>
                        <button className="flex-1 bg-[#3182CE] text-white py-1.5 rounded text-[10px] font-bold flex items-center justify-center hover:bg-[#2B6CB0]">
                          <LinkIcon size={12} className="mr-1" /> URL
                        </button>
                      </div>
                      <label className="flex items-center text-[11px] text-gray-500 cursor-pointer">
                        <input type="checkbox" className="mr-2 w-3.5 h-3.5 rounded border-gray-300 text-[#3182CE]" />
                        Iný obrázok na HP / v rubrike
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text článku Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Text článku <span className="text-red-500">*</span></h3>
                </div>
                
                  <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-0">
                    {/* Toolbar */}
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center flex-wrap gap-1 bg-gray-50/30 shrink-0">
                      {[
                        { icon: Type, label: 'H' },
                        { icon: Bold, label: 'B' },
                        { icon: Italic, label: 'I' },
                        { icon: List, label: 'UL' },
                        { icon: List, label: 'OL' },
                        { icon: Quote, label: 'Q' },
                        { icon: Code, label: 'C' },
                        { icon: LinkIcon, label: 'L' },
                        { icon: ImageIcon, label: 'IMG' },
                        { icon: Video, label: 'VID' },
                        { icon: Info, label: 'INF' },
                      ].map((tool, i) => (
                        <button key={i} className="p-1.5 text-gray-500 hover:bg-white hover:text-[#3182CE] hover:shadow-sm rounded transition-all border border-transparent hover:border-gray-200">
                          <tool.icon size={16} />
                        </button>
                      ))}
                      <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>
                      <div className="flex items-center space-x-2 px-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Brand:</p>
                        <select 
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="text-[10px] font-bold text-gray-700 bg-white border border-gray-200 rounded px-2 py-1 outline-none"
                        >
                          <option>Nový Čas</option>
                          <option>Aktuality</option>
                          <option>Život</option>
                          <option>Eva</option>
                        </select>
                      </div>
                      <div className="flex-1"></div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1.5 text-white bg-[#3182CE] rounded hover:bg-[#2B6CB0]"><Save size={16} /></button>
                        <button className="p-1.5 text-white bg-red-500 rounded hover:bg-red-600"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <div className="relative min-h-[22rem] h-[clamp(22rem,52vh,36rem)] shrink-0 overflow-hidden">
                      {/* Mirror: rovnaká typografia ako textarea; scrollbar skrytý = rovnaká šírka textu. */}
                      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                        <div
                          className={cn(
                            EAGLE_EDITOR_SURFACE_CLASS,
                            "text-transparent caret-transparent [text-shadow:none]",
                          )}
                          style={{
                            transform: `translate3d(0, ${-scrollTop}px, 0)`,
                            willChange: "transform",
                          }}
                        >
                          {highlightNodes}
                        </div>
                      </div>
                      <textarea
                        ref={editorRef}
                        value={content}
                        spellCheck={false}
                        onScroll={onEditorScroll}
                        onChange={(e) => setContent(e.target.value)}
                        className={cn(
                          EAGLE_EDITOR_SURFACE_CLASS,
                          "absolute inset-0 z-10 h-full resize-none overflow-y-auto border-0 bg-transparent text-[#1f2937] outline-none [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-gray-400 [&::-webkit-scrollbar]:hidden",
                        )}
                        placeholder="Začnite písať váš článok..."
                      />
                    </div>
                  </div>
              </div>
            </div>

            {/* Right Column: Split Intelligence / Settings */}
            <div className="col-span-12 flex min-h-0 max-h-[min(calc(100vh-9.5rem),1080px)] flex-col gap-4 overflow-hidden lg:sticky lg:top-4 lg:col-span-4 lg:self-start">
              
              {/* Toggle Header */}
              <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm shrink-0">
                <button 
                  onClick={() => setRightPanelMode('settings')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                    rightPanelMode === 'settings' ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <Settings size={14} className="mr-2" /> Nastavenia
                </button>
                <button 
                  onClick={() => {
                    setRightPanelMode('ai');
                    if (!audit && !isValidating) {
                      handleValidate();
                    }
                  }}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all relative",
                    rightPanelMode === 'ai' ? "bg-purple-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <Sparkles size={14} className="mr-2" /> Validovať článok
                  {audit && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white border-2 border-white">!</div>}
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                  {rightPanelMode === 'settings' ? (
                    <motion.div 
                      key="settings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full min-h-0 flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar"
                    >
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Hlavné nastavenia</h3>
                        </div>
                        <div className="p-6 space-y-6">
                          {/* Stránka */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600">Stránka <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:ring-1 focus:ring-[#3182CE] outline-none text-sm">
                                <option>Nový Čas</option>
                                <option>Aktuality</option>
                                <option>Šport.sk</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Hlavná rubrika */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600">Hlavná rubrika <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select className="w-full px-3 py-2 border border-gray-300 rounded appearance-none focus:ring-1 focus:ring-[#3182CE] outline-none text-sm">
                                <option>Správy</option>
                                <option>Zahraničie</option>
                                <option>Krimi</option>
                              </select>
                              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Rubriky */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600">Rubriky</label>
                            <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded min-h-[42px]">
                              <div className="bg-[#3182CE] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center">
                                NovyCas / Správy - Zahraničné správy <X size={10} className="ml-1.5 cursor-pointer" />
                              </div>
                              <div className="bg-[#3182CE] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center">
                                NovyCas / Správy <X size={10} className="ml-1.5 cursor-pointer" />
                              </div>
                              <div className="flex-1 min-w-[50px]">
                                <input type="text" className="w-full border-none outline-none text-xs py-1" placeholder="..." />
                              </div>
                              <ChevronDown size={14} className="text-gray-400" />
                            </div>
                          </div>

                          {/* Dátum publikovania */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600">Dátum publikovania na webe</label>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 relative">
                                <input type="text" value="01.01.2040 00:00" readOnly className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#3182CE] outline-none text-sm bg-gray-50" />
                                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3182CE]" />
                              </div>
                              <button className="text-[10px] font-bold text-[#3182CE] hover:underline whitespace-nowrap">Nastav na teraz</button>
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <label className="flex items-center text-xs text-gray-600 cursor-pointer group">
                              <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#3182CE]" />
                              Nastaviť vypnutie z webu
                            </label>
                            <label className="flex items-center text-xs text-gray-600 cursor-pointer group">
                              <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#3182CE]" />
                              Odložiť zmenu zverejnenia na webe
                            </label>
                            <label className="flex items-center text-xs text-gray-600 cursor-pointer group">
                              <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-[#3182CE]" />
                              Umiestniť na Homepage
                            </label>
                          </div>

                          {/* Autori */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-600">Autori zobrazení na webe <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 rounded min-h-[42px]">
                              <div className="bg-[#3182CE] text-white px-2 py-1 rounded text-[10px] font-bold flex items-center">
                                Redakcia Nový Čas <X size={10} className="ml-1.5 cursor-pointer" />
                              </div>
                              <ChevronDown size={14} className="ml-auto text-gray-400" />
                            </div>
                          </div>

                          {/* Téma (brand safety) */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">Téma (brand safety) <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-1.5">
                              {['korektný obsah', 'krimi/násilie', 'katastrofy', 'politika', 'nahota/sex', 'náboženstvo'].map((tag) => (
                                <button 
                                  key={tag}
                                  className={cn(
                                    "px-2.5 py-1.5 text-[10px] font-bold rounded border transition-all",
                                    tag === 'korektný obsah' ? "bg-[#2D3748] text-white border-[#2D3748]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                  )}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Povaha článku */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">Povaha článku <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-1.5">
                              {['Redakčný článok', 'Natívny článok', 'PR článok'].map((tag) => (
                                <button 
                                  key={tag}
                                  className={cn(
                                    "px-2.5 py-1.5 text-[10px] font-bold rounded border transition-all",
                                    tag === 'Redakčný článok' ? "bg-[#2D3748] text-white border-[#2D3748]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                  )}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Zdroj článku */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-600">Zdroj článku <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-1.5">
                              {['Interný autor pre web', 'Agentúrny', 'Preklopené z printu', 'Externý autor pre web', 'Prebratý článok'].map((tag) => (
                                <button 
                                  key={tag}
                                  className={cn(
                                    "px-2.5 py-1.5 text-[10px] font-bold rounded border transition-all",
                                    tag === 'Interný autor pre web' ? "bg-[#2D3748] text-white border-[#2D3748]" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                  )}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* S asistenciou AI */}
                          <div className="space-y-3 pt-2">
                            <label className="text-xs font-bold text-gray-600 flex items-center">
                              <Sparkles size={14} className="mr-1.5 text-purple-500" /> S asistenciou AI <Info size={12} className="ml-1.5 text-gray-400" />
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['ChatGPT', 'Perplexity', 'Midjourney', 'DeepL'].map((ai) => (
                                <label key={ai} className="flex items-center text-xs text-gray-500 cursor-pointer group">
                                  <input type="checkbox" className="mr-2 w-3.5 h-3.5 rounded border-gray-300 text-[#3182CE]" />
                                  <span className="group-hover:text-gray-700">{ai}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="ai"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      {/* AI Tabs */}
                      <div className="flex border-b border-gray-100 shrink-0">
                        {[
                          { id: 'trust', label: 'Dôvera', icon: ShieldAlert, count: audit?.claims.length || 0 },
                          { id: 'linguistic', label: 'Štýl', icon: MousePointer2, count: audit?.linguisticClaims?.length || 0 },
                          { id: 'seo', label: 'SEO', icon: Globe, count: Object.values(audit?.seoAudit || {}).filter(v => (v as { status: string }).status !== 'pass').length }
                        ].map((tab) => (
                          <button 
                            key={tab.id}
                            onClick={() => {
                              setActiveAuditTab(
                                tab.id as "trust" | "linguistic" | "seo",
                              );
                              setSelectedClaimId(null);
                            }}
                            className={cn(
                              "flex-1 py-4 flex flex-col items-center justify-center space-y-1 transition-all relative",
                              activeAuditTab === tab.id ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            <tab.icon size={20} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                            {tab.count > 0 && (
                              <span className="absolute top-2 right-4 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                {tab.count}
                              </span>
                            )}
                            {activeAuditTab === tab.id && (
                              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Readiness Score Progress Bar */}
                      <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 shrink-0">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Readiness Score</span>
                          <span className={cn(
                            "text-xs font-black",
                            (audit?.readinessScore || 0) > 80 ? "text-emerald-600" : 
                            (audit?.readinessScore || 0) > 50 ? "text-yellow-600" : "text-red-600"
                          )}>{audit?.readinessScore || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${audit?.readinessScore || 0}%` }}
                            className={cn(
                              "h-full transition-all duration-1000",
                              (audit?.readinessScore || 0) > 80 ? "bg-emerald-500" : 
                              (audit?.readinessScore || 0) > 50 ? "bg-yellow-500" : "bg-red-500"
                            )}
                          />
                        </div>
                      </div>

                      {/* AI Content Area */}
                      <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <AnimatePresence mode="wait">
                          {isValidating ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
                              <RefreshCw className="animate-spin text-purple-600" size={32} />
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analyzujem...</p>
                            </div>
                          ) : selectedClaimId ? (
                            <motion.div 
                              key="detail"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-6"
                            >
                              <button 
                                onClick={() => setSelectedClaimId(null)}
                                className="flex items-center text-[10px] font-black text-gray-400 uppercase hover:text-purple-600 transition-colors"
                              >
                                <ArrowLeft size={12} className="mr-1" /> Späť na zoznam
                              </button>
                              
                              {(() => {
                                const claim = audit?.claims.find(c => c.id === selectedClaimId) || 
                                              audit?.linguisticClaims?.find(c => c.id === selectedClaimId);
                                const seoItem = audit?.seoAudit[selectedClaimId as keyof typeof audit.seoAudit] as { status: string; message: string; suggestion?: string } | undefined;
                                
                                if (claim) {
                                  return (
                                    <div className="space-y-6">
                                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-800 italic leading-relaxed">"{claim.text}"</p>
                                      </div>
                                      <div className="space-y-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dôvod nálezu</p>
                                        <p className="text-xs font-bold text-gray-700">{claim.reason}</p>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{claim.explanation}</p>
                                      </div>
                                      <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Odporúčaná akcia</p>
                                        <p className="text-sm font-bold text-gray-900">{claim.recommendedAction}</p>
                                        <div className="grid grid-cols-1 gap-2 pt-2">
                                          <button 
                                            onClick={() => handleFixWithAI(claim)}
                                            className="w-full bg-purple-600 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
                                          >
                                            <Sparkles size={14} className="mr-2" /> 
                                            {activeAuditTab === 'trust' ? 'Opraviť pomocou AI' : 'Upraviť na štýl Nového Času'}
                                          </button>
                                          <button 
                                            onClick={() => {
                                              handleClaimClick(claim);
                                              editorRef.current?.focus();
                                            }}
                                            className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-gray-50 transition-all"
                                          >
                                            <Edit3 size={14} className="mr-2" /> Upraviť ručne
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                if (seoItem) {
                                  return (
                                    <div className="space-y-6">
                                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-800">{seoItem.message}</p>
                                      </div>
                                      {seoItem.suggestion && (
                                        <div className="space-y-3">
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI Návrh</p>
                                          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                                            <p className="text-xs font-medium text-gray-900 leading-relaxed">{seoItem.suggestion}</p>
                                            <button
                                              type="button"
                                              className="mt-4 w-full rounded-lg bg-purple-600 py-2 text-xs font-bold text-white transition-all hover:bg-purple-700"
                                              onClick={() => {
                                                if (
                                                  isSeoAuditKey(selectedClaimId)
                                                ) {
                                                  applySeoSuggestion(
                                                    selectedClaimId,
                                                  );
                                                }
                                              }}
                                            >
                                              Použiť návrh
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="list"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-4"
                            >
                              {activeAuditTab === 'trust' && (
                                <div className="space-y-3">
                                  {audit?.claims.map(claim => (
                                    <div 
                                      key={claim.id}
                                      onClick={() => handleClaimClick(claim)}
                                      className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer group",
                                        claim.risk === 'high' ? "border-l-4 border-l-red-500 bg-red-50/30" : 
                                        claim.risk === 'medium' ? "border-l-4 border-l-yellow-500 bg-yellow-50/30" : 
                                        "border-l-4 border-l-emerald-500 bg-emerald-50/30",
                                        selectedClaimId === claim.id ? "ring-2 ring-purple-500" : "hover:shadow-sm"
                                      )}
                                    >
                                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{claim.reason}</p>
                                      <p className="text-[11px] font-bold text-gray-800 line-clamp-2 italic">"{claim.text}"</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {activeAuditTab === 'linguistic' && (
                                <div className="space-y-3">
                                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Celkový tón</p>
                                    <p className="text-xs font-bold text-gray-800">{audit?.editorialAudit.tone}</p>
                                  </div>
                                  {audit?.linguisticClaims?.map(claim => (
                                    <div 
                                      key={claim.id}
                                      onClick={() => handleClaimClick(claim)}
                                      className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer group",
                                        claim.risk === 'high' ? "border-l-4 border-l-red-500 bg-red-50/30" : "border-l-4 border-l-yellow-500 bg-yellow-50/30",
                                        selectedClaimId === claim.id ? "ring-2 ring-purple-500" : "hover:shadow-sm"
                                      )}
                                    >
                                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{claim.reason}</p>
                                      <p className="text-[11px] font-bold text-gray-800 line-clamp-2 italic">"{claim.text}"</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {activeAuditTab === 'seo' && (
                                <div className="space-y-3">
                                  {Object.entries(audit?.seoAudit || {})
                                    .sort(([, a], [, b]) => {
                                      const order = { fail: 0, warning: 1, pass: 2 };
                                      const statusA = (a as { status: string }).status as keyof typeof order;
                                      const statusB = (b as { status: string }).status as keyof typeof order;
                                      return order[statusA] - order[statusB];
                                    })
                                    .map(([key, res]) => {
                                      const item = res as { status: string; message: string; suggestion?: string };
                                      return (
                                        <div 
                                          key={key}
                                          onClick={() => setSelectedClaimId(key)}
                                          className={cn(
                                            "p-3 rounded-xl border transition-all cursor-pointer",
                                            item.status === 'fail' ? "border-l-4 border-l-red-500 bg-red-50/30" : 
                                            item.status === 'warning' ? "border-l-4 border-l-yellow-500 bg-yellow-50/30" : 
                                            "border-l-4 border-l-emerald-500 bg-emerald-50/30"
                                          )}
                                        >
                                          <div className="flex justify-between items-center mb-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase">{key}</p>
                                            <div className={cn(
                                              "w-2 h-2 rounded-full",
                                              item.status === 'fail' ? "bg-red-500" : item.status === 'warning' ? "bg-yellow-500" : "bg-emerald-500"
                                            )}></div>
                                          </div>
                                          <p className="text-[11px] font-bold text-gray-800">{item.message}</p>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                              {!audit && !isValidating && (
                                <div className="py-20 text-center space-y-4">
                                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                    <Sparkles size={32} />
                                  </div>
                                  <p className="text-xs font-bold text-gray-400">Spustite audit pre analýzu</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EagleCMS_Split;
