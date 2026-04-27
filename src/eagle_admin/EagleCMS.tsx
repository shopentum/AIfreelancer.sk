"use client";

import React, {
  useCallback,
  useEffect,
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
  ArrowLeft,
  Lock,
  Download,
} from "lucide-react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  fixClaimWithAI,
  type Claim,
  type ArticleAudit,
  type SeoAuditKey,
  type LinkSuggestion,
  type TagSuggestion,
} from "@/eagle_admin/geminiService";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared typography for mirror + textarea (pixel alignment).
 * Do not put min-h-full here — textarea must use min-h-0 in grid so it fills the cell;
 * mirror inner uses min-h-full so tall content scrolls in sync.
 */
const EAGLE_EDITOR_TYPO_CLASS =
  "box-border w-full p-8 text-sm font-medium leading-relaxed tracking-normal subpixel-antialiased [font-kerning:normal] [font-feature-settings:'kern'_1] [tab-size:8] whitespace-pre-wrap break-words [overflow-wrap:anywhere]";

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

const RISK_ORDER: Record<Claim["risk"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function sortClaimsByRisk(a: Claim, b: Claim) {
  return RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
}

/** +2 alebo +3 body na Readiness po vyriešení nálezu (prototyp). */
function nextReadinessBump(score: number): number {
  const delta = 2 + Math.floor(Math.random() * 2);
  return Math.min(100, score + delta);
}

const SEO_FIELD_LABEL: Record<SeoAuditKey, string> = {
  title: "Titulok",
  seoTitle: "SEO titulok",
  url: "Titulok pre URL",
  perex: "Perex",
};

/** Správa po použití AI návrhu v SEO (redakčný tón). */
const SEO_APPLIED_MESSAGE =
  "Tip z kontroly sme prepísali do formulára. Skontrolujte ešte raz znenie, či sedí tón a zodpovedá zvyklostiam Nového Času.";

/** Prototyp: v produkcii = prihlásený používateľ (Supabase Auth / SSO). */
const PROTOTYPE_SESSION_USER = {
  displayName: "Lukáš Sághy",
  email: "Lukas.Saghy@newsandmedia.sk",
} as const;

/**
 * Simulácia: druhý editor drží zámok (read-only). Pre NMH „Časť C“ / schválený obsah:
 * v produkcii zámok + kolízie typicky cez optimistic locking (verzia dokumentu, If-Match)
 * alebo real-time presence (WebSocket).
 */
const PROTOTYPE_COLLAB_LOCK_HOLDER = "Jana Kováčová";

function formatAuditTimestamp(ts: number): string {
  try {
    return new Intl.DateTimeFormat("sk-SK", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toISOString();
  }
}

/** Relatívny čas pre pätičky kariet („pred 2 min.“). */
function formatRelativeAudit(ts: number): string {
  const diffMin = Math.floor((Date.now() - ts) / 60_000);
  if (diffMin < 1) return "pred chvíľou";
  if (diffMin < 60) return `pred ${diffMin} min.`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `pred ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `pred ${diffD} d`;
  return formatAuditTimestamp(ts);
}

/** Snapshot článku pred AI zásahom (frontend-only undo; produkcia: + audit verzie). */
type ArticleSnapshot = {
  content: string;
  title: string;
  seoTitle: string;
  urlTitle: string;
  perex: string;
};

type ArticleFieldKey = keyof ArticleSnapshot;

const MAX_ARTICLE_HISTORY = 5;

type StudyExportEvent =
  | { type: "audit_completed"; at: number; readinessScore: number }
  | { type: "audit_failed_unavailable"; at: number; reason: "simulated_api_failure" }
  | {
      type: "ai_fix_applied";
      claimId: string;
      tab: "trust" | "linguistic";
      timeToFixMs: number;
      timeToFixUnder5s: boolean;
      appliedAt: number;
      claimReason: string;
    }
  | {
      type: "seo_suggestion_applied";
      key: SeoAuditKey;
      appliedAt: number;
      timeSinceAuditMs: number | null;
    }
  | {
      type: "tags_committed";
      at: number;
      tags: { id: string; label: string; url: string }[];
      removedCount: number;
      suggestion_source: "ai";
    }
  | {
      type: "tag_removed";
      at: number;
      tagId: string;
      label: string;
      suggestion_source: "ai";
    }
  | {
      type: "link_suggestion_accepted";
      at: number;
      suggestion_id: string;
      suggestion_type: "internal_link";
      anchor_text: string;
      target_id: string;
      context_snippet: string;
      suggestion_source: "ai";
    }
  | {
      type: "link_suggestion_rejected";
      at: number;
      suggestion_id: string;
      suggestion_type: "internal_link";
      anchor_text: string;
      target_id: string;
      suggestion_source: "ai";
    };

function downloadJsonFile(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

type SeoChangeEntry = {
  key: SeoAuditKey;
  before: string;
  after: string;
  appliedAt: number;
  actorName: string;
};

type ResolvedClaimRecord = {
  claim: Claim;
  tab: "trust" | "linguistic";
  beforeText: string;
  afterText: string;
  resolvedAt: number;
  actorName: string;
  resolutionType: "ai_fix" | "manual" | "ignored";
};

/** Ukážkový text článku (~2× pôvodná dĺžka) pre realistický scroll a highlight. */
const EAGLE_DEMO_ARTICLE = [
  "Podľa najnovších štúdií publikovaných v prestížnom vedeckom časopise Nature, by kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení. Tento doplnok, ktorý si väčšina ľudí spája s nárastom svalovej hmoty a kulturistikou, teraz šokuje vedecký svet svojimi účinkami na mozog. Populárny prášok z fitness centier sa totiž dostáva do centra pozornosti neurovedcov ako možná podpora v boji proti Alzheimerovej chorobe.",
  "Neurofyziologička Louisa Nichola v nedávnom podcaste The Diary of a CEO prezradila, že túto dostupnú zložku považuje za mimoriadne prospešnú pre zdravie mozgu. „Kreatín nie je len pre svaly. Esenciálny hráč v energetickom metabolizme mozgu,“ vysvetľuje odborníčka. Podľa jej slov ho dokonca podáva aj svojim 71-ročným rodičom ako preventívne opatrenie.",
  "Vedecký tím z University of Sydney pod vedením doktorky Caroline Rae už v minulosti preukázal, že suplementácia kreatínom môže viesť k výraznému zlepšeniu pracovnej pamäte a inteligencie u zdravých jedincov. Mechanizmus účinku spočíva v tom, že kreatín zvyšuje dostupnosť ATP (adenozíntrifosfátu) v neurónoch, čo umožňuje mozgu pracovať efektívnejšie pri náročných kognitívnych úlohách.",
  "Pre milióny rodín, ktoré denne zápasia s demenciou, to znie ako veľká nádej. Je však dôležité poznamenať, že hoci sú doterajšie výsledky sľubné, kreatín nie je zázračným liekom. Odborníci varujú pred nekontrolovaným užívaním vysokých dávok bez konzultácie s lekárom, najmä u pacientov s existujúcimi ochoreniami obličiek. Napriek tomu, vzhľadom na nízku cenu a vysoký bezpečnostný profil, sa kreatín javí ako jeden z najzaujímavejších kandidátov na poli neuroprotektívnych látok súčasnosti. V titulkoch sa často objaví, že doplnok „stojí pár eur“ — to je presne typ vágnosti, ktorú kontrola označuje pri cenových tvrdeniach.",
  "Európsky úrad pre bezpečnosť potravín (EFSA) v minulosti posúdil kreatín ako zložku s dobre zdokumentovaným bezpečnostným profilom pri odporúčaných dávkach. Aj preto sa nachádza v mnohých doplnkoch výživy, ktoré sú voľne predajné. Rozdiel je však v tom, či ide o krátkodobé užívanie športovcami, alebo o dlhodobé podávanie starším ľuďom s rôznymi diagnózami — tam chýbajú veľké randomizované štúdie.",
  "Na Slovensku zatiaľ neexistuje oficiálna kampaň, ktorá by rodinám Alzheimerovej choroby vysvetľovala riziká a prínosy doplnkov. Neurológovia v súkromných ambulanciách často počujú otázky typu: „Môže to aspoň trochu spomaliť zhoršovanie?“ Odpoveď znie opatrne: skoré štúdie sú sľubné, no neznamenajú to isté ako odporúčanie v praxi.",
  "Časť výskumu sa uberá aj smerom k tomu, či kreatín pomáha pri spánkovom deficite a únave mozgu, čo sú faktory, ktoré demenciu zhoršujú. Ak by sa potvrdil aj tento efekt, išlo by o ďalší argument pre starších ľudí, ktorí z rôznych dôvodov nespia dostatočne — no znovu platí, že samoliečba bez dohľadu lekára je riziková.",
  "Farmaceutické firmy zatiaľ nehlásia pripravovaný liek na báze kreatínu špecificky proti Alzheimerovej chorobe. Dôvod je prozaický: patentová ochrana a marža sú pri doplnkoch výrazne iné ako pri liečivých registráciách. Pre bežného čitateľa to znamená, že to, čo kúpi v lekárni alebo online, nie je to isté, čo prechádza klinickými fázami ako liečivo.",
  "Rodiny, ktoré sa o tému zaujímajú, by si mali poznamenať tri veci: vždy čítať zloženie a dávkovanie, nekombinovať doplnky „naslepo“ a pri prvých známkach zhoršovania pamäti vyhľadať odborníka namiesto spoliehania sa na internetové rady. Kreatín môže byť zaujímavou kapitolou vo výskume — no príbeh pacienta a jeho lekára má vždy prednosť pred titulkom.",
].join("\n\n");

const EagleCMS_Split: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Interný');
  const [mediaTab, setMediaTab] = useState('Obrázok');
  const [title, setTitle] = useState('O krok bližšie k liečbe Alzheimera? Vedci odhalili dostupný zázrak v prášku. Stojí pár eur');
  const [seoTitle, setSeoTitle] = useState('O krok bližšie k liečbe Alzheimera? Stojí pár eur!');
  const [urlTitle, setUrlTitle] = useState('o-krok-blizsie-k-liecbe-alzheimera-vedci-odhalili-dostupny-zazrak-v-prasku-stoji-par-eur');
  const [perex, setPerex] = useState('Doplnok, ktorý si väčšina ľudí spája s kulturistikou, teraz šokuje vedecký svet. Populárny prášok z fitness centier sa totiž dostáva do centra pozornosti neurovedcov ako možná podpora v boji proti rozšírenej chorobe.');
  const [content, setContent] = useState(EAGLE_DEMO_ARTICLE);
  const [brand, setBrand] = useState('Nový Čas');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const fadeClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoFlashClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Telemetria pre export (testy / Time-to-Fix). */
  const studyLogRef = useRef<StudyExportEvent[]>([]);
  /** Prvý moment, keď redaktor otvoril nález (klik na kartu). */
  const claimFirstSeenRef = useRef<Record<string, number>>({});
  /** Čas dokončenia poslednej úspešnej validácie (fallback pre Time-to-Fix). */
  const auditCompletedAtRef = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  /** Po AI úprave: rozsah znakov v `content` pre zelený fade v editore. */
  const [fadeRange, setFadeRange] = useState<{
    start: number;
    end: number;
  } | null>(null);

  // Validation States
  const [isValidating, setIsValidating] = useState(false);
  const [audit, setAudit] = useState<ArticleAudit | null>(null);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [activeAuditTab, setActiveAuditTab] = useState<'trust' | 'linguistic' | 'seo'>('trust');
  const [auditError, setAuditError] = useState<string | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<'settings' | 'ai'>('settings');
  const [seoChangeLog, setSeoChangeLog] = useState<SeoChangeEntry[]>([]);
  const [resolvedClaims, setResolvedClaims] = useState<ResolvedClaimRecord[]>([]);
  /** Prototyp: simuluje druhého editora v článku → read-only pre AI a telo textu. */
  const [collaborationLockDemo, setCollaborationLockDemo] = useState(false);
  /** Simulácia výpadku Intelligence API (resilience / happy path). */
  const [simulateIntelligenceApiFailure, setSimulateIntelligenceApiFailure] =
    useState(false);
  /** Správa v pravom paneli pri nedostupnosti AI. */
  const [sidebarAiBanner, setSidebarAiBanner] = useState<string | null>(null);
  /**
   * Posledných max. 5 stavov pred AI fixom / SEO návrhom (Omega: safety net).
   * Produkcia: optimistic locking alebo presence (WebSocket) + serverové verzie.
   */
  const [articleHistory, setArticleHistory] = useState<ArticleSnapshot[]>([]);
  /** Po Unde: ktoré polia vizuálne „zablikajú“ (1 s, fialová). */
  const [undoFlash, setUndoFlash] = useState<{
    keys: ArticleFieldKey[];
    nonce: number;
  } | null>(null);
  /** Nález čakajúci na potvrdenie ručnej úpravy. */
  const [pendingManualEdit, setPendingManualEdit] = useState<string | null>(null);
  /** SEO kľúče, ktoré redaktor vedome ignoroval (namiesto aplikovania návrhu). */
  const [ignoredSeoKeys, setIgnoredSeoKeys] = useState<Set<string>>(new Set());

  /** Animovaný counter pre Readiness Score — beží od 0 po reálnu hodnotu pri validácii,
   *  plynule inkrementuje pri každom ďalšom vyriešení nálezu. */
  const [displayedScore, setDisplayedScore] = useState(0);
  const prevScoreRef = useRef(0);
  useEffect(() => {
    const target = audit?.readinessScore ?? 0;
    const start = prevScoreRef.current;
    if (start === target) return;
    const steps = Math.abs(target - start);
    const stepMs = Math.max(Math.round(1100 / steps), 12);
    let current = start;
    const timer = setInterval(() => {
      current = current < target ? current + 1 : current - 1;
      setDisplayedScore(current);
      if (current === target) {
        clearInterval(timer);
        prevScoreRef.current = target;
      }
    }, stepMs);
    return () => clearInterval(timer);
  }, [audit?.readinessScore]);

  /** Akcie redaktora na návrhy interných linkov: accepted | rejected. */
  const [linkActions, setLinkActions] = useState<Map<string, 'accepted' | 'rejected'>>(new Map());

  /** Tagy odstraňuje redaktor ×; zostatok = schválený set. null = set zatiaľ nepridaný. */
  const [removedTagIds, setRemovedTagIds] = useState<Set<string>>(new Set());
  const [tagsCommitted, setTagsCommitted] = useState(false);

  const pushArticleSnapshot = useCallback(() => {
    setArticleHistory((h) => {
      const snap: ArticleSnapshot = {
        content,
        title,
        seoTitle,
        urlTitle,
        perex,
      };
      const next = [...h, snap];
      return next.length > MAX_ARTICLE_HISTORY
        ? next.slice(-MAX_ARTICLE_HISTORY)
        : next;
    });
  }, [content, perex, seoTitle, title, urlTitle]);

  const undoLastArticleSnapshot = useCallback(() => {
    if (collaborationLockDemo) return;
    let flashKeys: ArticleFieldKey[] = [];
    flushSync(() => {
      setArticleHistory((h) => {
        if (h.length === 0) return h;
        const snap = h[h.length - 1];
        flashKeys = [];
        if (content !== snap.content) flashKeys.push("content");
        if (title !== snap.title) flashKeys.push("title");
        if (seoTitle !== snap.seoTitle) flashKeys.push("seoTitle");
        if (urlTitle !== snap.urlTitle) flashKeys.push("urlTitle");
        if (perex !== snap.perex) flashKeys.push("perex");
        setContent(snap.content);
        setTitle(snap.title);
        setSeoTitle(snap.seoTitle);
        setUrlTitle(snap.urlTitle);
        setPerex(snap.perex);
        setFadeRange(null);
        return h.slice(0, -1);
      });
    });
    if (undoFlashClearRef.current !== null) {
      clearTimeout(undoFlashClearRef.current);
      undoFlashClearRef.current = null;
    }
    if (flashKeys.length > 0) {
      setUndoFlash({ keys: flashKeys, nonce: Date.now() });
      undoFlashClearRef.current = setTimeout(() => {
        setUndoFlash(null);
        undoFlashClearRef.current = null;
      }, 1000);
    } else {
      setUndoFlash(null);
    }
  }, [
    collaborationLockDemo,
    content,
    perex,
    seoTitle,
    title,
    urlTitle,
  ]);

  const exportStudyLog = useCallback(() => {
    const events = [...studyLogRef.current];
    const aiFixes = events.filter(
      (e): e is Extract<StudyExportEvent, { type: "ai_fix_applied" }> =>
        e.type === "ai_fix_applied",
    );
    const under5 = aiFixes.filter((f) => f.timeToFixUnder5s).length;
    const avgMs =
      aiFixes.length > 0
        ? Math.round(
            aiFixes.reduce((acc, f) => acc + f.timeToFixMs, 0) / aiFixes.length,
          )
        : null;
    const linksAccepted = events.filter(e => e.type === "link_suggestion_accepted").length;
    const linksRejected = events.filter(e => e.type === "link_suggestion_rejected").length;
    const tagsCommittedEvent = events.find(e => e.type === "tags_committed") as
      | Extract<StudyExportEvent, { type: "tags_committed" }>
      | undefined;
    const tagsRemovedCount = events.filter(e => e.type === "tag_removed").length;
    downloadJsonFile(`eagle-test-log-${Date.now()}.json`, {
      exportVersion: 2,
      exportedAt: new Date().toISOString(),
      prototype: "EAGLE_ADMIN",
      session: {
        displayName: PROTOTYPE_SESSION_USER.displayName,
        email: PROTOTYPE_SESSION_USER.email,
        article_type: "spravodajstvo",
        site_id: "novycas",
      },
      metrics: {
        aiFixCount: aiFixes.length,
        timeToFixMsAvg: avgMs,
        timeToFixUnder5SecondsCount: under5,
        timeToFixUnder5SecondsRate:
          aiFixes.length > 0 ? under5 / aiFixes.length : null,
        timeToFixDefinition:
          "Milliseconds from first claim card open (or audit completion if never opened) until click on AI fix.",
        linkSuggestions: {
          accepted: linksAccepted,
          rejected: linksRejected,
          total: linksAccepted + linksRejected,
          acceptanceRate: (linksAccepted + linksRejected) > 0
            ? Math.round(linksAccepted / (linksAccepted + linksRejected) * 100) / 100
            : null,
        },
        tagSuggestions: {
          committed: tagsCommittedEvent ? tagsCommittedEvent.tags.length : 0,
          removed: tagsRemovedCount,
          committedLabels: tagsCommittedEvent?.tags.map(t => t.label) ?? [],
        },
      },
      events,
      resolvedClaims,
      seoChangeLog,
    });
  }, [resolvedClaims, seoChangeLog]);

  const handleValidate = async () => {
    if (collaborationLockDemo) return;
    setIsValidating(true);
    setRightPanelMode('ai');
    setAuditError(null);
    setSidebarAiBanner(null);

    // Simulate API delay for "Intelligence Engine" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (simulateIntelligenceApiFailure) {
      setAudit(null);
      setSeoChangeLog([]);
      setResolvedClaims([]);
      setArticleHistory([]);
      if (undoFlashClearRef.current !== null) {
        clearTimeout(undoFlashClearRef.current);
        undoFlashClearRef.current = null;
      }
      setUndoFlash(null);
      setSidebarAiBanner(
        "AI Validácia je dočasne nedostupná. Môžete pokračovať v manuálnej editácii.",
      );
      studyLogRef.current.push({
        type: "audit_failed_unavailable",
        at: Date.now(),
        reason: "simulated_api_failure",
      });
      setIsValidating(false);
      return;
    }

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
      linkSuggestions: [
        {
          id: 'link-1',
          anchor: 'kreatín monohydrát',
          target: 'Kreatín',
          targetUrl: '/tag/kreatin',
          context: '…výskumníci zistili, že kreatín monohydrát mohol predstavovať prelom v liečbe…',
        },
        {
          id: 'link-2',
          anchor: 'Alzheimerova choroba',
          target: 'Alzheimerova choroba',
          targetUrl: '/tag/alzheimerova-choroba',
          context: '…nová štúdia sa zameriava na spojitosť medzi Alzheimerovou chorobou a mozgovým metabolizmom…',
        },
        {
          id: 'link-3',
          anchor: 'neurodegeneratívnych ochorení',
          target: 'Neurodegeneratívne ochorenia',
          targetUrl: '/tag/neurodegenerativne-ochorenia',
          context: '…jednou z najnáročnejších skupín neurodegeneratívnych ochorení zostáva demencia…',
        },
      ],
      tagSuggestions: [
        { id: 'tag-1', label: 'Kreatín', url: '/tag/kreatin' },
        { id: 'tag-2', label: 'Alzheimerova choroba', url: '/tag/alzheimerova-choroba' },
        { id: 'tag-3', label: 'Neurodegeneratívne ochorenia', url: '/tag/neurodegenerativne-ochorenia' },
        { id: 'tag-4', label: 'Výskum', url: '/tag/vyskum' },
        { id: 'tag-5', label: 'Zdravie', url: '/tag/zdravie' },
        { id: 'tag-6', label: 'Mozog', url: '/tag/mozog' },
      ],
      claims: [
        {
          id: 'claim-1',
          text: 'kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení',
          risk: 'high',
          reason: 'Tvrdenie je príliš silné',
          explanation: 'Slovo "prelom" v kontexte liečby Alzheimera môže byť vnímané ako zavádzajúce, pokiaľ nie je podložené finálnymi klinickými štúdiami na ľuďoch.',
          whyFlagged:
            "Systém nenašiel v texte konkrétny zdroj (citáciu alebo odkaz na štúdiu), ktorý by podložil toto medicínske tvrdenie ako hotovú istotu.",
          recommendedAction: 'Zmiernite tón tvrdenia na "potenciálny prínos" alebo "predmet skúmania".',
          startIndex: 0,
          endIndex: 0
        },
        {
          id: 'claim-2',
          text: 'stojí pár eur',
          risk: 'medium',
          reason: 'Chýba konkrétna cena',
          explanation: 'Výraz "pár eur" je subjektívny. Pre niekoho to môže byť 2€, pre iného 20€.',
          whyFlagged:
            "Pri cenovom tvrdení v článku chýba konkrétna suma, rozpätie alebo porovnanie s overiteľným referenčným zdrojom.",
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
          whyFlagged:
            "Tvrdenie je priradené k citovanému názoru, no model stále hládi riziko zovšeobecnenia bez kontextu dávkovania a indikácie.",
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
          reason: 'Text je príliš odborný',
          explanation: 'Tento odsek začína veľmi technicky. Čitatelia Nového Času preferujú priamejší a akčnejší štart.',
          whyFlagged:
            "Systém vyhodnotil úvod ako veľmi hustý odborný blok bez postupného vysvetlenia pre bežného čitateľa.",
          recommendedAction: 'Preformulujte úvod na niečo údernejšie, napríklad: "Zabudnite na svaly! Populárny fitness prášok môže zachrániť váš mozog."',
          startIndex: 0,
          endIndex: 0
        },
        {
          id: 'ling-2',
          text: 'Mechanizmus účinku spočíva v tom, že kreatín zvyšuje dostupnosť ATP (adenozíntrifosfátu) v neurónoch, čo umožňuje mozgu pracovať efektívnejšie pri náročných kognitívnych úlohách.',
          risk: 'high',
          reason: 'Odborný výraz bez vysvetlenia',
          explanation: 'Použitie odborných termínov ako "adenozíntrifosfát" v texte pre širokú verejnosť pôsobí odradzujúco.',
          whyFlagged:
            "V tomto odseku chýba laický „mostík“ medzi odborným termínom a jeho významom v bežnom jazyku.",
          recommendedAction: 'Nahraďte odborné termíny jednoduchším vysvetlením: "Kreatín funguje ako turbo palivo pre mozgové bunky."',
          startIndex: 0,
          endIndex: 0
        }
      ]
    };

    claimFirstSeenRef.current = {};
    auditCompletedAtRef.current = Date.now();
    studyLogRef.current.push({
      type: "audit_completed",
      at: auditCompletedAtRef.current,
      readinessScore: mockAudit.readinessScore,
    });

    setAudit(mockAudit);
    setSeoChangeLog([]);
    setResolvedClaims([]);
    setArticleHistory([]);
    setIgnoredSeoKeys(new Set());
    setLinkActions(new Map());
    setRemovedTagIds(new Set());
    setTagsCommitted(false);
    if (undoFlashClearRef.current !== null) {
      clearTimeout(undoFlashClearRef.current);
      undoFlashClearRef.current = null;
    }
    setUndoFlash(null);
    setSidebarAiBanner(null);
    setIsValidating(false);
  };

  /** Vráti nález s najvyšším rizikom, ktorého text pokrýva pozíciu `pos` v obsahu.
   *  Ak na danom mieste nie je žiadny nález, vráti null. */
  const getClaimAtPosition = useCallback(
    (pos: number): Claim | null => {
      if (!audit) return null;
      const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      const allClaims = [
        ...(audit.claims ?? []),
        ...(audit.linguisticClaims ?? []),
      ];
      const matching = allClaims
        .map((c) => {
          const idx = content.indexOf(c.text);
          if (idx === -1) return null;
          if (pos >= idx && pos <= idx + c.text.length) return c;
          return null;
        })
        .filter((c): c is Claim => c !== null)
        .sort((a, b) => (riskOrder[a.risk] ?? 2) - (riskOrder[b.risk] ?? 2));
      return matching[0] ?? null;
    },
    [audit, content],
  );

  /** Click na textarea — ak kurzor pristál na zvýraznenom texte, otvorí zodpovedajúci
   *  detail nálezu v pravom paneli a prepne na správnu záložku. */
  const handleEditorClick = useCallback(() => {
    const ta = editorRef.current;
    if (!ta || !audit) return;
    const claim = getClaimAtPosition(ta.selectionStart);
    if (!claim) return;
    const isLinguistic = (audit.linguisticClaims ?? []).some(
      (c) => c.id === claim.id,
    );
    setRightPanelMode("ai");
    setActiveAuditTab(isLinguistic ? "linguistic" : "trust");
    setSelectedClaimId(claim.id);
    if (!claimFirstSeenRef.current[claim.id]) {
      claimFirstSeenRef.current[claim.id] = Date.now();
    }
  }, [audit, getClaimAtPosition]);

  const handleClaimClick = (claim: Claim) => {
    setSelectedClaimId(claim.id);
    if (!claimFirstSeenRef.current[claim.id]) {
      claimFirstSeenRef.current[claim.id] = Date.now();
    }
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

  const handleResolvedCardClick = (r: ResolvedClaimRecord) => {
    setSelectedClaimId(r.claim.id);
    const ta = editorRef.current;
    if (!ta) return;
    const index = content.indexOf(r.afterText);
    if (index === -1) return;
    ta.focus();
    ta.setSelectionRange(
      index,
      Math.min(index + r.afterText.length, content.length),
    );
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
      if (fadeClearRef.current !== null) {
        clearTimeout(fadeClearRef.current);
      }
      if (undoFlashClearRef.current !== null) {
        clearTimeout(undoFlashClearRef.current);
      }
    };
  }, []);

  const handleFixWithAI = async (claim: Claim) => {
    if (collaborationLockDemo) return;
    if (simulateIntelligenceApiFailure) {
      setSidebarAiBanner(
        "AI funkcie sú dočasne nedostupné. Môžete pokračovať v manuálnej editácii článku v editore.",
      );
      return;
    }
    const idx = content.indexOf(claim.text);
    if (idx === -1) return;
    const fixClickAt = Date.now();
    const seenAt =
      claimFirstSeenRef.current[claim.id] ??
      auditCompletedAtRef.current ??
      fixClickAt;
    const timeToFixMs = fixClickAt - seenAt;
    const fixedText = await fixClaimWithAI(claim.text, content);
    if (collaborationLockDemo) return;
    if (simulateIntelligenceApiFailure) return;
    pushArticleSnapshot();
    const newContent =
      content.slice(0, idx) + fixedText + content.slice(idx + claim.text.length);
    setContent(newContent);

    const fadeEnd = idx + fixedText.length;
    setFadeRange({ start: idx, end: fadeEnd });
    if (fadeClearRef.current !== null) clearTimeout(fadeClearRef.current);
    fadeClearRef.current = setTimeout(() => {
      setFadeRange(null);
      fadeClearRef.current = null;
    }, 2800);

    const tab: "trust" | "linguistic" = (audit?.linguisticClaims ?? []).some(
      (c) => c.id === claim.id,
    )
      ? "linguistic"
      : "trust";

    studyLogRef.current.push({
      type: "ai_fix_applied",
      claimId: claim.id,
      tab,
      timeToFixMs,
      timeToFixUnder5s: timeToFixMs < 5000,
      appliedAt: Date.now(),
      claimReason: claim.reason,
    });

    setResolvedClaims((prev) => [
      ...prev,
      {
        claim,
        tab,
        beforeText: claim.text,
        afterText: fixedText,
        resolvedAt: Date.now(),
        actorName: PROTOTYPE_SESSION_USER.displayName,
        resolutionType: "ai_fix",
      },
    ]);

    if (audit) {
      setAudit({
        ...audit,
        readinessScore: nextReadinessBump(audit.readinessScore),
        claims: audit.claims.filter((c) => c.id !== claim.id),
        linguisticClaims: audit.linguisticClaims?.filter((c) => c.id !== claim.id),
      });
    }
    if (selectedClaimId === claim.id) setSelectedClaimId(null);
  };

  const handleIgnoreClaim = useCallback(
    (claim: Claim) => {
      if (collaborationLockDemo) return;
      const tab: "trust" | "linguistic" = (audit?.linguisticClaims ?? []).some(
        (c) => c.id === claim.id,
      )
        ? "linguistic"
        : "trust";
      setResolvedClaims((prev) => [
        ...prev,
        {
          claim,
          tab,
          beforeText: claim.text,
          afterText: claim.text,
          resolvedAt: Date.now(),
          actorName: PROTOTYPE_SESSION_USER.displayName,
          resolutionType: "ignored",
        },
      ]);
      if (audit) {
        setAudit({
          ...audit,
          readinessScore: nextReadinessBump(audit.readinessScore),
          claims: audit.claims.filter((c) => c.id !== claim.id),
          linguisticClaims: audit.linguisticClaims?.filter(
            (c) => c.id !== claim.id,
          ),
        });
      }
      setPendingManualEdit(null);
      if (selectedClaimId === claim.id) setSelectedClaimId(null);
    },
    [audit, collaborationLockDemo, selectedClaimId],
  );

  const handleConfirmManualEdit = useCallback(
    (claim: Claim) => {
      if (collaborationLockDemo) return;
      const tab: "trust" | "linguistic" = (audit?.linguisticClaims ?? []).some(
        (c) => c.id === claim.id,
      )
        ? "linguistic"
        : "trust";
      const currentText = content.includes(claim.text) ? claim.text : claim.text;
      setResolvedClaims((prev) => [
        ...prev,
        {
          claim,
          tab,
          beforeText: claim.text,
          afterText: currentText,
          resolvedAt: Date.now(),
          actorName: PROTOTYPE_SESSION_USER.displayName,
          resolutionType: "manual",
        },
      ]);
      if (audit) {
        setAudit({
          ...audit,
          readinessScore: nextReadinessBump(audit.readinessScore),
          claims: audit.claims.filter((c) => c.id !== claim.id),
          linguisticClaims: audit.linguisticClaims?.filter(
            (c) => c.id !== claim.id,
          ),
        });
      }
      setPendingManualEdit(null);
      if (selectedClaimId === claim.id) setSelectedClaimId(null);
    },
    [audit, collaborationLockDemo, content, selectedClaimId],
  );

  const handleIgnoreSeoSuggestion = useCallback(
    (key: string) => {
      if (collaborationLockDemo) return;
      setIgnoredSeoKeys((prev) => new Set([...prev, key]));
      if (audit) {
        setAudit({ ...audit, readinessScore: nextReadinessBump(audit.readinessScore) });
      }
      if (selectedClaimId === key) setSelectedClaimId(null);
    },
    [audit, collaborationLockDemo, selectedClaimId],
  );

  const handleTagSetCommit = useCallback(() => {
    if (!audit) return;
    const remaining = (audit.tagSuggestions ?? []).filter(t => !removedTagIds.has(t.id));
    setTagsCommitted(true);
    setAudit({ ...audit, readinessScore: nextReadinessBump(audit.readinessScore) });
    studyLogRef.current.push({
      type: "tags_committed",
      at: Date.now(),
      tags: remaining.map(t => ({ id: t.id, label: t.label, url: t.url })),
      removedCount: (audit.tagSuggestions ?? []).length - remaining.length,
      suggestion_source: "ai",
    });
  }, [audit, removedTagIds]);

  const handleTagRemove = useCallback((tag: TagSuggestion) => {
    setRemovedTagIds(prev => new Set(prev).add(tag.id));
    studyLogRef.current.push({
      type: "tag_removed",
      at: Date.now(),
      tagId: tag.id,
      label: tag.label,
      suggestion_source: "ai",
    });
  }, []);

  const handleLinkAccept = useCallback((s: LinkSuggestion) => {
    if (!audit) return;
    setLinkActions(prev => new Map(prev).set(s.id, 'accepted'));
    setAudit({ ...audit, readinessScore: nextReadinessBump(audit.readinessScore) });
    studyLogRef.current.push({
      type: "link_suggestion_accepted",
      at: Date.now(),
      suggestion_id: s.id,
      suggestion_type: "internal_link",
      anchor_text: s.anchor,
      target_id: s.target,
      context_snippet: s.context,
      suggestion_source: "ai",
    });
  }, [audit]);

  const handleLinkReject = useCallback((s: LinkSuggestion) => {
    setLinkActions(prev => new Map(prev).set(s.id, 'rejected'));
    studyLogRef.current.push({
      type: "link_suggestion_rejected",
      at: Date.now(),
      suggestion_id: s.id,
      suggestion_type: "internal_link",
      anchor_text: s.anchor,
      target_id: s.target,
      suggestion_source: "ai",
    });
  }, []);

  const applySeoSuggestion = useCallback(
    (key: SeoAuditKey) => {
      if (collaborationLockDemo) return;
      if (simulateIntelligenceApiFailure) {
        setSidebarAiBanner(
          "AI návrhy sú dočasne nedostupné. Polia môžete vyplniť ručne.",
        );
        return;
      }
      if (!audit) return;
      const item = audit.seoAudit[key];
      const raw = item.suggestion?.trim();
      if (!raw) return;

      const stripTitle = (s: string) =>
        s
          .replace(/^(Skráťte titulok na:|Skráťte na:)\s*/i, "")
          .replace(/^["']|["']$/g, "")
          .trim();

      const beforeVal =
        key === "title"
          ? title
          : key === "seoTitle"
            ? seoTitle
            : key === "url"
              ? urlTitle
              : perex;

      let afterVal = beforeVal;
      pushArticleSnapshot();
      if (key === "title") {
        afterVal = stripTitle(raw);
        setTitle(afterVal);
      } else if (key === "seoTitle") {
        afterVal = raw;
        setSeoTitle(afterVal);
      } else if (key === "url") {
        afterVal = slugifyForUrl(raw);
        setUrlTitle(afterVal);
      } else if (key === "perex") {
        afterVal = raw;
        setPerex(afterVal);
      }

      const appliedSeoAt = Date.now();
      setSeoChangeLog((log) => [
        ...log,
        {
          key,
          before: beforeVal,
          after: afterVal,
          appliedAt: appliedSeoAt,
          actorName: PROTOTYPE_SESSION_USER.displayName,
        },
      ]);

      studyLogRef.current.push({
        type: "seo_suggestion_applied",
        key,
        appliedAt: appliedSeoAt,
        timeSinceAuditMs:
          auditCompletedAtRef.current != null
            ? appliedSeoAt - auditCompletedAtRef.current
            : null,
      });

      setAudit((prev) => {
        if (!prev) return prev;
        const prevItem = prev.seoAudit[key];
        return {
          ...prev,
          readinessScore: nextReadinessBump(prev.readinessScore),
          seoAudit: {
            ...prev.seoAudit,
            [key]: {
              ...prevItem,
              status: "pass",
              message: SEO_APPLIED_MESSAGE,
              suggestion: undefined,
            },
          },
        };
      });
      setSelectedClaimId(null);
    },
    [
      audit,
      collaborationLockDemo,
      perex,
      pushArticleSnapshot,
      seoTitle,
      simulateIntelligenceApiFailure,
      title,
      urlTitle,
    ],
  );

  const highlightNodes = useMemo(() => {
    const claims = [
      ...(audit?.claims ?? []),
      ...(audit?.linguisticClaims ?? []),
    ];
    let pos = 0;
    const parts = content.split(/(\s+)/);
    return parts.map((part, i) => {
      const partStart = pos;
      pos += part.length;
      const partEnd = pos;
      const inFade =
        fadeRange !== null &&
        partStart < fadeRange.end &&
        partEnd > fadeRange.start;

      if (inFade) {
        return (
          <span key={`f-${partStart}-${i}`} className="eagle-editor-fade-fix rounded-sm">
            {part}
          </span>
        );
      }

      const trimmed = part.trim();
      if (trimmed.length < 3) return <span key={`t-${partStart}-${i}`}>{part}</span>;
      const claim = claims.find((c) => c.text.includes(trimmed));
      if (claim) {
        return (
          <span
            key={`c-${partStart}-${i}`}
            className={cn(
              "rounded-sm ring-1 transition-colors duration-300",
              selectedClaimId === claim.id
                ? "bg-violet-100/85 ring-violet-400/70"
                : claim.risk === "high"
                  ? "bg-rose-100/55 ring-rose-200/60"
                  : claim.risk === "medium"
                    ? "bg-amber-50/80 ring-amber-200/50"
                    : "bg-emerald-50/70 ring-emerald-200/45",
            )}
          >
            {part}
          </span>
        );
      }
      return <span key={`n-${partStart}-${i}`}>{part}</span>;
    });
  }, [audit?.claims, audit?.linguisticClaims, content, fadeRange, selectedClaimId]);

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
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-semibold">{PROTOTYPE_SESSION_USER.email}</p>
                <p className="text-[10px] text-gray-500">{PROTOTYPE_SESSION_USER.displayName}</p>
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
              displayedScore > 80 ? "bg-[#48BB78] text-white hover:bg-[#38A169]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
        <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-[#F8FAFC] px-6 py-2 shadow-inner relative z-40">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
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
                  <span>{displayedScore}%</span>
                </div>
                <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${displayedScore}%` }}
                    className={cn(
                      "h-full transition-colors",
                      displayedScore > 80 ? "bg-emerald-500" : 
                      displayedScore > 50 ? "bg-yellow-500" : "bg-red-500"
                    )}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleValidate}
                  disabled={isValidating || collaborationLockDemo}
                  title={
                    collaborationLockDemo
                      ? "Článok upravuje iný editor — validáciu spustíte po uvoľnení zámku."
                      : undefined
                  }
                  className={cn(
                    "flex items-center rounded-xl px-4 py-2 text-xs font-bold transition-all",
                    isValidating || collaborationLockDemo
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-purple-600 text-white shadow-lg shadow-purple-100 hover:bg-purple-700 active:scale-95",
                  )}
                >
                  {isValidating ? (
                    <RefreshCw size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Sparkles size={14} className="mr-2" />
                  )}
                  {isValidating ? "Audit v procese..." : "Validovať článok"}
                </button>
                <button
                  type="button"
                  onClick={undoLastArticleSnapshot}
                  disabled={articleHistory.length === 0 || collaborationLockDemo}
                  title={
                    collaborationLockDemo
                      ? "Článok upravuje iný editor — vrátenie stavu až po uvoľnení zámku."
                      : articleHistory.length === 0
                        ? "Nie je čo vrátiť — zatiaľ ste nepoužili AI opravu nálezu ani SEO návrh."
                        : `Späť (${articleHistory.length}) — obnoví posledný stav pred AI úpravou (prototyp, max. 5 krokov).`
                  }
                  aria-label={
                    collaborationLockDemo
                      ? "Späť — nedostupné, článok upravuje iný editor"
                      : articleHistory.length === 0
                        ? "Späť — nie je čo vrátiť"
                        : `Späť (${articleHistory.length}) — vrátiť poslednú AI úpravu`
                  }
                  className={cn(
                    "flex h-9 shrink-0 items-center justify-center gap-1 rounded-xl border text-gray-700 transition-all",
                    articleHistory.length > 0 && !collaborationLockDemo
                      ? "min-w-14 px-2"
                      : "w-9 px-0",
                    articleHistory.length === 0 || collaborationLockDemo
                      ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
                      : "border-gray-200 bg-white shadow-sm hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 active:scale-95",
                  )}
                >
                  <History size={16} aria-hidden />
                  {articleHistory.length > 0 && !collaborationLockDemo ? (
                    <span className="text-[10px] font-black tabular-nums text-purple-900/90">
                      ({articleHistory.length})
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={exportStudyLog}
                  title="Stiahnuť JSON (udalosti, Time-to-Fix, SEO log) pre testy a grafy"
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 text-[11px] font-bold text-gray-700 shadow-sm transition-all hover:border-purple-200 hover:bg-purple-50 hover:text-purple-800 active:scale-95"
                >
                  <Download size={15} aria-hidden />
                  <span className="hidden sm:inline">Export logu</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex max-w-full flex-col gap-2 sm:items-end">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] text-gray-600 shadow-sm select-none">
              <input
                type="checkbox"
                checked={collaborationLockDemo}
                onChange={(e) => setCollaborationLockDemo(e.target.checked)}
                className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-purple-600"
              />
              <span className="font-medium">
                Prototyp: druhý editor v článku (read-only pre AI a text)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-[11px] text-amber-950 shadow-sm select-none">
              <input
                type="checkbox"
                checked={simulateIntelligenceApiFailure}
                onChange={(e) => {
                  const on = e.target.checked;
                  setSimulateIntelligenceApiFailure(on);
                  if (!on) setSidebarAiBanner(null);
                }}
                className="h-3.5 w-3.5 shrink-0 rounded border-amber-400 text-amber-600"
              />
              <span className="font-medium">
                Simulácia: výpadok Intelligence API (validácia / AI návrhy zlyhajú)
              </span>
            </label>
          </div>
        </div>

        {collaborationLockDemo ? (
          <div className="flex shrink-0 items-center gap-2 border-b border-amber-200 bg-amber-50 px-6 py-2 text-xs text-amber-950">
            <Lock className="shrink-0 text-amber-700" size={14} aria-hidden />
            <span>
              <span className="font-bold">Aktuálne upravuje:</span>{" "}
              {PROTOTYPE_COLLAB_LOCK_HOLDER}. Vy ste v režime čítania — AI
              validáciu a úpravy textu môžete spustiť až po uvoľnení zámku (odškrtnite
              simuláciu vyššie).
            </span>
          </div>
        ) : null}

        {/* Editor Area: scroll na main — ľavý stĺpec prirodzene vysoký; pravý sticky v rámci main. */}
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-6">
          <div className="mx-auto grid w-full max-w-[1800px] grid-cols-12 items-start gap-6">
            {/* Left Column: Content */}
            <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
              
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
                    <div className="relative">
                      {undoFlash?.keys.includes("title") ? (
                        <div
                          key={`title-${undoFlash.nonce}`}
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-[1] rounded-md eagle-editor-fade-undo"
                        />
                      ) : null}
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="relative z-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-medium outline-none focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]"
                      />
                    </div>
                  </div>

                  {/* SEO Titulok */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-600 flex items-center">
                        <Globe size={12} className="mr-1 text-gray-400" /> SEO titulok <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{seoTitle.length}</span>
                    </div>
                    <div className="relative">
                      {undoFlash?.keys.includes("seoTitle") ? (
                        <div
                          key={`seoTitle-${undoFlash.nonce}`}
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-[1] rounded-md eagle-editor-fade-undo"
                        />
                      ) : null}
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="relative z-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-7 space-y-6">
                      {/* Titulok pre URL */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-gray-600">Titulok pre URL <span className="text-red-500">*</span></label>
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{urlTitle.length}</span>
                        </div>
                        <div className="relative">
                          {undoFlash?.keys.includes("urlTitle") ? (
                            <div
                              key={`urlTitle-${undoFlash.nonce}`}
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-[1] rounded-md eagle-editor-fade-undo"
                            />
                          ) : null}
                          <input
                            type="text"
                            value={urlTitle}
                            onChange={(e) => setUrlTitle(e.target.value)}
                            className="relative z-0 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-500 outline-none focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]"
                          />
                        </div>
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
                        <div className="relative">
                          {undoFlash?.keys.includes("perex") ? (
                            <div
                              key={`perex-${undoFlash.nonce}`}
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-[1] rounded-md eagle-editor-fade-undo"
                            />
                          ) : null}
                          <textarea
                            value={perex}
                            onChange={(e) => setPerex(e.target.value)}
                            rows={4}
                            className="relative z-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-relaxed outline-none focus:border-[#3182CE] focus:ring-1 focus:ring-[#3182CE]"
                          />
                        </div>
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

                    {/* Grid: obe vrstvy majú presne rovnakú bunku (žiadne absolute + zlá výška textarea). */}
                    <div className="relative isolate grid min-h-[22rem] h-[clamp(22rem,55vh,42rem)] shrink-0 grid-cols-1 grid-rows-1 overflow-hidden">
                      <div className="pointer-events-none col-span-full row-span-full z-0 min-h-0 min-w-0 overflow-hidden">
                        <div
                          className={cn(
                            EAGLE_EDITOR_TYPO_CLASS,
                            "min-h-full text-transparent caret-transparent [text-shadow:none]",
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
                        readOnly={collaborationLockDemo}
                        spellCheck={false}
                        onScroll={onEditorScroll}
                        onChange={(e) => setContent(e.target.value)}
                        onClick={handleEditorClick}
                        className={cn(
                          EAGLE_EDITOR_TYPO_CLASS,
                          "col-span-full row-span-full z-10 block size-full min-h-0 resize-none overflow-y-auto border-0 text-[#1f2937] outline-none [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-gray-400 [&::-webkit-scrollbar]:hidden",
                          collaborationLockDemo
                            ? "cursor-not-allowed bg-gray-100/40 text-gray-600"
                            : "bg-transparent",
                        )}
                        placeholder="Začnite písať váš článok..."
                      />
                      {undoFlash?.keys.includes("content") ? (
                        <div
                          key={`content-${undoFlash.nonce}`}
                          aria-hidden
                          className="pointer-events-none col-span-full row-span-full z-[15] block size-full min-h-0 rounded-md eagle-editor-fade-undo"
                        />
                      ) : null}
                    </div>
                  </div>
              </div>
            </div>

            {/* Right Column: sticky v scrollporte main; max-height len na LG kvôli vnútornému scrollu auditu. */}
            <div className="col-span-12 flex min-h-0 flex-col gap-4 lg:sticky lg:top-3 lg:z-20 lg:col-span-4 lg:max-h-[min(calc(100dvh-7.5rem),920px)] lg:overflow-hidden lg:self-start">
              
              {/* Toggle Header */}
              <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setRightPanelMode("settings")}
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-bold transition-all",
                    rightPanelMode === "settings"
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50",
                  )}
                >
                  <Settings size={14} className="mr-2" /> Nastavenia
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRightPanelMode("ai");
                    if (!audit && !isValidating && !collaborationLockDemo) {
                      handleValidate();
                    }
                  }}
                  className={cn(
                    "relative flex flex-1 items-center justify-center rounded-lg py-2 text-xs font-bold transition-all",
                    rightPanelMode === "ai"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50",
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
                            displayedScore > 80 ? "text-emerald-600" : 
                            displayedScore > 50 ? "text-yellow-600" : "text-red-600"
                          )}>{displayedScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${displayedScore}%` }}
                            className={cn(
                              "h-full transition-all duration-1000",
                              displayedScore > 80 ? "bg-emerald-500" : 
                              displayedScore > 50 ? "bg-yellow-500" : "bg-red-500"
                            )}
                          />
                        </div>
                      </div>

                      {/* AI Content Area */}
                      <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {sidebarAiBanner ? (
                          <div className="mb-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-snug text-amber-950">
                            <AlertTriangle
                              className="mt-0.5 shrink-0 text-amber-600"
                              size={16}
                              aria-hidden
                            />
                            <p>{sidebarAiBanner}</p>
                          </div>
                        ) : null}
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
                                const resolved = resolvedClaims.find(
                                  (r) => r.claim.id === selectedClaimId,
                                );
                                if (resolved) {
                                  return (
                                    <div className="space-y-6">
                                      <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                                        <CheckCircle2
                                          className="mt-0.5 shrink-0 text-emerald-600"
                                          size={20}
                                        />
                                        <div>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                                            Vyriešené
                                          </p>
                                          <p className="text-sm font-semibold text-emerald-950">
                                            {resolved.tab === "trust"
                                              ? "Dôvera — úprava v článku"
                                              : "Štýl — úprava v článku"}
                                          </p>
                                          <p className="mt-1 text-xs text-emerald-900/80">
                                            {resolved.claim.reason}
                                          </p>
                                          <p className="mt-2 text-[11px] font-medium text-emerald-900/90">
                                            Opravil(a) {resolved.actorName} ·{" "}
                                            {formatRelativeAudit(resolved.resolvedAt)}
                                          </p>
                                          <p className="text-[10px] text-emerald-900/60">
                                            {formatAuditTimestamp(resolved.resolvedAt)}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="grid gap-4 md:grid-cols-2">
                                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                                          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Pred úpravou
                                          </p>
                                          <p className="text-sm leading-relaxed text-gray-800">
                                            {resolved.beforeText}
                                          </p>
                                        </div>
                                        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-3">
                                          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                                            Po úprave
                                          </p>
                                          <p className="text-sm leading-relaxed text-gray-900">
                                            {resolved.afterText}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                const claim =
                                  audit?.claims.find((c) => c.id === selectedClaimId) ||
                                  audit?.linguisticClaims?.find(
                                    (c) => c.id === selectedClaimId,
                                  );
                                const seoKey = isSeoAuditKey(selectedClaimId)
                                  ? selectedClaimId
                                  : null;
                                const seoItem =
                                  audit && seoKey
                                    ? audit.seoAudit[seoKey]
                                    : undefined;

                                if (claim) {
                                  return (
                                    <div className="space-y-5">
                                      {/* TL;DR */}
                                      {claim.whyFlagged ? (
                                        <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2.5">
                                          <p className="text-[9px] font-black uppercase tracking-widest text-blue-500 mb-1">TL;DR</p>
                                          <p className="text-xs font-medium leading-relaxed text-blue-950/90">
                                            {claim.whyFlagged}
                                          </p>
                                        </div>
                                      ) : null}
                                      {/* Citácia */}
                                      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
                                        <p className="text-sm font-semibold leading-relaxed text-gray-900">
                                          {"\u201E"}{claim.text}{"\u201C"}
                                        </p>
                                      </div>
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                          Dôvod nálezu
                                        </p>
                                        <p className="text-sm font-bold text-gray-800">{claim.reason}</p>
                                        <p className="text-xs leading-relaxed text-gray-600">{claim.explanation}</p>
                                      </div>
                                      <div className="space-y-3 border-t border-gray-100 pt-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                          Odporúčaná akcia
                                        </p>
                                        <p className="text-sm font-medium leading-snug text-gray-700">
                                          {claim.recommendedAction}
                                        </p>
                                        <div className="grid grid-cols-1 gap-2 pt-2">
                                          <button
                                            type="button"
                                            disabled={collaborationLockDemo}
                                            onClick={() => handleFixWithAI(claim)}
                                            className={cn(
                                              "flex w-full items-center justify-center rounded-xl py-3 text-xs font-bold shadow-lg transition-all",
                                              collaborationLockDemo
                                                ? "cursor-not-allowed bg-gray-200 text-gray-500 shadow-none"
                                                : "bg-purple-600 text-white shadow-purple-100 hover:bg-purple-700",
                                            )}
                                          >
                                            <Sparkles size={14} className="mr-2" />
                                            Opraviť pomocou AI
                                          </button>
                                          {pendingManualEdit === claim.id ? (
                                            <button
                                              type="button"
                                              onClick={() => handleConfirmManualEdit(claim)}
                                              className="flex w-full items-center justify-center rounded-xl border border-emerald-400 bg-emerald-50 py-3 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-100"
                                            >
                                              <CheckCircle2 size={14} className="mr-2" /> Potvrdiť opravu
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setPendingManualEdit(claim.id);
                                                handleClaimClick(claim);
                                                editorRef.current?.focus();
                                              }}
                                              className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50"
                                            >
                                              <Edit3 size={14} className="mr-2" /> Upraviť ručne
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            disabled={collaborationLockDemo}
                                            onClick={() => handleIgnoreClaim(claim)}
                                            className={cn(
                                              "flex w-full items-center justify-center rounded-xl border py-2.5 text-xs font-bold transition-all",
                                              collaborationLockDemo
                                                ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                                                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                            )}
                                          >
                                            <X size={13} className="mr-2" /> Ignorovať
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                                                if (seoItem && seoKey) {
                                  const logEntry = [...seoChangeLog]
                                    .reverse()
                                    .find((e) => e.key === seoKey);
                                  const showDiff =
                                    seoItem.status === "pass" && Boolean(logEntry);

                                  return (
                                    <div className="space-y-6">
                                      <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
                                        <p className="text-sm font-semibold text-gray-900">
                                          {seoItem.message}
                                        </p>
                                      </div>
                                      {showDiff && logEntry && (
                                        <div className="space-y-3">
                                          <p className="text-[11px] font-medium text-gray-600">
                                            Upravil(a) {logEntry.actorName} ·{" "}
                                            {formatRelativeAudit(logEntry.appliedAt)}
                                          </p>
                                          <p className="text-[10px] text-gray-500">
                                            {formatAuditTimestamp(logEntry.appliedAt)}
                                          </p>
                                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Čo sa zmenilo ({SEO_FIELD_LABEL[seoKey]})
                                          </p>
                                          <div className="grid gap-4 md:grid-cols-2">
                                            <div className="rounded-xl border border-gray-200 bg-white p-3">
                                              <p className="mb-2 text-[10px] font-black uppercase text-gray-500">
                                                Predtým
                                              </p>
                                              <p className="text-sm leading-relaxed text-gray-800">
                                                {logEntry.before}
                                              </p>
                                            </div>
                                            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/25 p-3">
                                              <p className="mb-2 text-[10px] font-black uppercase text-emerald-800">
                                                Teraz
                                              </p>
                                              <p className="text-sm leading-relaxed text-gray-900">
                                                {logEntry.after}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      {seoItem.suggestion ? (
                                        <div className="space-y-3">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            AI návrh
                                          </p>
                                          <div className="rounded-2xl border border-gray-200 bg-purple-50/60 p-4">
                                            <p className="text-sm font-medium leading-relaxed text-gray-900">
                                              {seoItem.suggestion}
                                            </p>
                                            <button
                                              type="button"
                                              disabled={collaborationLockDemo}
                                              className={cn(
                                                "mt-4 w-full rounded-lg py-2 text-xs font-bold transition-all",
                                                collaborationLockDemo
                                                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                                  : "bg-purple-600 text-white hover:bg-purple-700",
                                              )}
                                              onClick={() => {
                                                applySeoSuggestion(seoKey);
                                              }}
                                            >
                                              Použiť návrh
                                            </button>
                                          </div>
                                        </div>
                                      ) : null}
                                      {!ignoredSeoKeys.has(seoKey) && !seoChangeLog.some((e) => e.key === seoKey) && (
                                        <button
                                          type="button"
                                          disabled={collaborationLockDemo}
                                          onClick={() => handleIgnoreSeoSuggestion(seoKey)}
                                          className={cn(
                                            "flex w-full items-center justify-center rounded-xl border py-2.5 text-xs font-bold transition-all",
                                            collaborationLockDemo
                                              ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                                              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                          )}
                                        >
                                          <X size={13} className="mr-2" /> Ignorovať
                                        </button>
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
                                  {[...(audit?.claims ?? [])]
                                    .sort(sortClaimsByRisk)
                                    .map((claim) => (
                                      <div
                                        key={claim.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleClaimClick(claim)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleClaimClick(claim);
                                          }
                                        }}
                                        className={cn(
                                          "group cursor-pointer rounded-xl border border-gray-200 p-3 shadow-sm transition-all",
                                          claim.risk === "high"
                                            ? "border-l-[3px] border-l-rose-400 bg-rose-50/40"
                                            : claim.risk === "medium"
                                              ? "border-l-[3px] border-l-amber-400 bg-amber-50/35"
                                              : "border-l-[3px] border-l-emerald-400 bg-emerald-50/35",
                                          selectedClaimId === claim.id
                                            ? "ring-1 ring-purple-300/90 ring-offset-2 ring-offset-[#F0F2F5]"
                                            : "hover:border-gray-300 hover:shadow",
                                        )}
                                      >
                                        <p className="mb-1 text-[10px] font-black uppercase text-gray-500">
                                          {claim.reason}
                                        </p>
                                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900">
                                          „{claim.text}“
                                        </p>
                                      </div>
                                    ))}
                                  {resolvedClaims.filter((r) => r.tab === "trust").length > 0 && (
                                    <p className="pt-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                      Vyriešené
                                    </p>
                                  )}
                                  {resolvedClaims
                                    .filter((r) => r.tab === "trust")
                                    .map((r) => (
                                      <div
                                        key={`done-trust-${r.claim.id}-${r.resolvedAt}`}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleResolvedCardClick(r)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleResolvedCardClick(r);
                                          }
                                        }}
                                        className={cn(
                                          "group cursor-pointer rounded-xl border border-gray-200 border-l-[3px] border-l-emerald-500 bg-emerald-50/40 p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow",
                                          selectedClaimId === r.claim.id
                                            ? "ring-1 ring-purple-300/90 ring-offset-2 ring-offset-[#F0F2F5]"
                                            : "",
                                        )}
                                      >
                                        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-800">
                                          <CheckCircle2 size={12} className="shrink-0" />
                                          {r.resolutionType === "ai_fix" ? "Opravené AI" : r.resolutionType === "manual" ? "Upravené ručne" : "Ignorované"}
                                        </p>
                                        <p className="mb-1 text-[10px] text-gray-500">
                                          Opravil(a) {r.actorName} ·{" "}
                                          {formatRelativeAudit(r.resolvedAt)}
                                        </p>
                                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-800">
                                          „{r.afterText.length > 120 ? `${r.afterText.slice(0, 120)}…` : r.afterText}“
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              )}
                              {activeAuditTab === 'linguistic' && (
                                <div className="space-y-3">
                                  <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 shadow-sm">
                                    <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                      Celkový tón
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">{audit?.editorialAudit.tone}</p>
                                  </div>
                                  {[...(audit?.linguisticClaims ?? [])]
                                    .sort(sortClaimsByRisk)
                                    .map((claim) => (
                                      <div
                                        key={claim.id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleClaimClick(claim)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleClaimClick(claim);
                                          }
                                        }}
                                        className={cn(
                                          "group cursor-pointer rounded-xl border border-gray-200 p-3 shadow-sm transition-all",
                                          claim.risk === "high"
                                            ? "border-l-[3px] border-l-rose-400 bg-rose-50/40"
                                            : "border-l-[3px] border-l-amber-400 bg-amber-50/35",
                                          selectedClaimId === claim.id
                                            ? "ring-1 ring-purple-300/90 ring-offset-2 ring-offset-[#F0F2F5]"
                                            : "hover:border-gray-300 hover:shadow",
                                        )}
                                      >
                                        <p className="mb-1 text-[10px] font-black uppercase text-gray-500">
                                          {claim.reason}
                                        </p>
                                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900">
                                          „{claim.text}“
                                        </p>
                                      </div>
                                    ))}
                                  {resolvedClaims.filter((r) => r.tab === "linguistic").length >
                                    0 && (
                                    <p className="pt-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                      Vyriešené
                                    </p>
                                  )}
                                  {resolvedClaims
                                    .filter((r) => r.tab === "linguistic")
                                    .map((r) => (
                                      <div
                                        key={`done-ling-${r.claim.id}-${r.resolvedAt}`}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => handleResolvedCardClick(r)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleResolvedCardClick(r);
                                          }
                                        }}
                                        className={cn(
                                          "group cursor-pointer rounded-xl border border-gray-200 border-l-[3px] border-l-emerald-500 bg-emerald-50/40 p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow",
                                          selectedClaimId === r.claim.id
                                            ? "ring-1 ring-purple-300/90 ring-offset-2 ring-offset-[#F0F2F5]"
                                            : "",
                                        )}
                                      >
                                        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-800">
                                          <CheckCircle2 size={12} className="shrink-0" />
                                          {r.resolutionType === "ai_fix" ? "Opravené AI" : r.resolutionType === "manual" ? "Upravené ručne" : "Ignorované"}
                                        </p>
                                        <p className="mb-1 text-[10px] text-gray-500">
                                          Opravil(a) {r.actorName} ·{" "}
                                          {formatRelativeAudit(r.resolvedAt)}
                                        </p>
                                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-800">
                                          „{r.afterText.length > 120 ? `${r.afterText.slice(0, 120)}…` : r.afterText}“
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              )}
                              {activeAuditTab === 'seo' && (
                                <div className="space-y-3">
                                  {Object.entries(audit?.seoAudit || {})
                                    .sort(([keyA, a], [keyB, b]) => {
                                      const order = {
                                        fail: 0,
                                        warning: 1,
                                        pass: 2,
                                      } as const;
                                      const sa = (a as { status: string })
                                        .status as keyof typeof order;
                                      const sb = (b as { status: string })
                                        .status as keyof typeof order;
                                      if (order[sa] !== order[sb])
                                        return order[sa] - order[sb];
                                      if (sa === "pass" && sb === "pass") {
                                        const appliedA = seoChangeLog.some(
                                          (e) => e.key === keyA,
                                        )
                                          ? 1
                                          : 0;
                                        const appliedB = seoChangeLog.some(
                                          (e) => e.key === keyB,
                                        )
                                          ? 1
                                          : 0;
                                        return appliedA - appliedB;
                                      }
                                      return 0;
                                    })
                                    .map(([key, res]) => {
                                      const item = res as { status: string; message: string; suggestion?: string };
                                      const isApplied = seoChangeLog.some((e) => e.key === key);
                                      const isIgnored = ignoredSeoKeys.has(key);
                                      const isResolved = isApplied || isIgnored;
                                      return (
                                        <div
                                          key={key}
                                          onClick={() => !isResolved && setSelectedClaimId(key)}
                                          className={cn(
                                            "rounded-xl border border-gray-200 p-3 shadow-sm transition-all",
                                            isResolved
                                              ? "border-l-[3px] border-l-emerald-400 bg-emerald-50/35 opacity-70"
                                              : cn(
                                                  "cursor-pointer hover:border-gray-300 hover:shadow",
                                                  item.status === "fail"
                                                    ? "border-l-[3px] border-l-rose-400 bg-rose-50/40"
                                                    : item.status === "warning"
                                                      ? "border-l-[3px] border-l-amber-400 bg-amber-50/35"
                                                      : "border-l-[3px] border-l-emerald-400 bg-emerald-50/35",
                                                ),
                                          )}
                                        >
                                          <div className="mb-1 flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase text-gray-500">{key}</p>
                                            {isResolved ? (
                                              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700">
                                                <CheckCircle2 size={11} />
                                                {isApplied ? "Použité" : "Ignorované"}
                                              </span>
                                            ) : (
                                              <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                item.status === "fail" ? "bg-rose-500" : item.status === "warning" ? "bg-amber-500" : "bg-emerald-500",
                                              )} />
                                            )}
                                          </div>
                                          <p className={cn("text-[13px] font-semibold leading-snug", isResolved ? "text-gray-500" : "text-gray-900")}>
                                            {item.message}
                                          </p>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                              {/* Navrhované tagy — chip set */}
                              {activeAuditTab === 'seo' && audit?.tagSuggestions && audit.tagSuggestions.length > 0 && (
                                <div className="mt-4">
                                  <div className="flex items-center justify-between pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Navrhované tagy</span>
                                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                                        {audit.tagSuggestions.filter(t => !removedTagIds.has(t.id)).length} tagov
                                      </span>
                                    </div>
                                    {!tagsCommitted && audit.tagSuggestions.some(t => !removedTagIds.has(t.id)) && (
                                      <button
                                        type="button"
                                        onClick={handleTagSetCommit}
                                        className="rounded-lg border border-violet-300 bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-800 transition-all hover:bg-violet-100"
                                      >
                                        Pridať set
                                      </button>
                                    )}
                                    {tagsCommitted && (
                                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700">
                                        <CheckCircle2 size={11} /> Pridané
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {audit.tagSuggestions.map((tag) => {
                                      const removed = removedTagIds.has(tag.id);
                                      if (removed) return null;
                                      return (
                                        <div
                                          key={tag.id}
                                          className={cn(
                                            "group flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-semibold transition-all",
                                            tagsCommitted
                                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                              : "border-violet-200 bg-violet-50 text-violet-800 hover:border-violet-300",
                                          )}
                                        >
                                          <a
                                            href={tag.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                            title={tag.url}
                                          >
                                            {tag.label}
                                          </a>
                                          {!tagsCommitted && (
                                            <button
                                              type="button"
                                              onClick={() => handleTagRemove(tag)}
                                              className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-violet-400 opacity-60 transition-opacity hover:bg-violet-200 hover:opacity-100"
                                              title="Odstrániť tag"
                                            >
                                              ×
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {audit.tagSuggestions.every(t => removedTagIds.has(t.id)) && (
                                    <p className="mt-2 text-[11px] text-gray-400 italic">Všetky tagy boli odstránené.</p>
                                  )}
                                </div>
                              )}
                              {/* Tagy & Interné linky — SEO Copilot MVP1 */}
                              {activeAuditTab === 'seo' && audit?.linkSuggestions && audit.linkSuggestions.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <div className="flex items-center gap-2 pb-1">
                                    <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Tagy & Interné linky</span>
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                      {audit.linkSuggestions.filter(s => !linkActions.has(s.id)).length} nových
                                    </span>
                                  </div>
                                  {audit.linkSuggestions.map((s) => {
                                    const action = linkActions.get(s.id);
                                    return (
                                      <div
                                        key={s.id}
                                        className={cn(
                                          "rounded-xl border p-3 shadow-sm transition-all",
                                          action === 'accepted'
                                            ? "border-l-[3px] border-l-emerald-400 border-gray-200 bg-emerald-50/35 opacity-70"
                                            : action === 'rejected'
                                              ? "border-l-[3px] border-l-gray-300 border-gray-200 bg-gray-50/50 opacity-60"
                                              : "border-l-[3px] border-l-blue-400 border-gray-200 bg-blue-50/30 hover:border-gray-300 hover:shadow",
                                        )}
                                      >
                                        <div className="mb-1 flex items-center justify-between">
                                          <p className="text-[10px] font-black uppercase text-gray-500">Interný link</p>
                                          {action ? (
                                            <span className={cn(
                                              "flex items-center gap-1 text-[10px] font-black uppercase",
                                              action === 'accepted' ? "text-emerald-700" : "text-gray-500",
                                            )}>
                                              <CheckCircle2 size={11} />
                                              {action === 'accepted' ? 'Pridané' : 'Odmietnuté'}
                                            </span>
                                          ) : (
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                          )}
                                        </div>
                                        <p className="text-[13px] font-semibold text-gray-900">
                                          <span className="rounded bg-blue-100/70 px-1 text-blue-800">{s.anchor}</span>
                                          <span className="mx-1.5 text-gray-400">→</span>
                                          <span className="text-blue-700">{s.target}</span>
                                        </p>
                                        <p className="mt-1 text-[11px] leading-snug text-gray-500 italic">{s.context}</p>
                                        {!action && (
                                          <div className="mt-2.5 flex gap-2">
                                            <button
                                              type="button"
                                              onClick={() => handleLinkAccept(s)}
                                              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 py-1.5 text-[11px] font-bold text-emerald-800 transition-all hover:bg-emerald-100"
                                            >
                                              <CheckCircle2 size={12} /> Pridať link
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleLinkReject(s)}
                                              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-50 py-1.5 text-[11px] font-bold text-gray-600 transition-all hover:bg-gray-100"
                                            >
                                              Odmietnuť
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {!audit && !isValidating && (
                                sidebarAiBanner ? (
                                  <div className="space-y-3 py-12 text-center">
                                    <p className="text-sm font-semibold text-gray-800">
                                      Formulár a text článku môžete upravovať ďalej.
                                    </p>
                                    <p className="mx-auto max-w-xs text-xs text-gray-600">
                                      Po obnove služby znova spustite validáciu alebo vypnite simuláciu výpadku v hornom
                                      paneli.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-4 py-20 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                                      <Sparkles size={32} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400">Spustite audit pre analýzu</p>
                                  </div>
                                )
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
