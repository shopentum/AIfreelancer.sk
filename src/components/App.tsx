
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import BlueprintOrchestrator from './BlueprintOrchestrator';
import Dashboard from './components/Dashboard';
import DashboardV1 from './components/DashboardV1';
import MarketingOverview from './components/MarketingOverview';
import MarketingCenter from './components/MarketingCenter';
import ChannelDetail from './components/ChannelDetail';
import LandingPage from './components/LandingPage';
import AuditResult from './components/AuditResult';
import FullAudit from './components/FullAudit';
import AIStudio from './components/AIStudio';
import Agency from './components/Agency';
import ShopentumUseCase from './components/ShopentumUseCase';
import { AboutMe } from './components/AboutMe';
import Contact from './components/Contact';
import Cookies from './components/Cookies';
import GDPR from './components/GDPR';
import { SEOOptimizationBlueprint } from './blueprints/shopentum-seo-optimization';
import { AuditTruthV2Blueprint } from './blueprints/audit-truth-v2';
import { AuditMixedV3Blueprint } from './blueprints/audit-mixed-v3';
import { AuditLightV4Blueprint } from './blueprints/audit-light-v4';
import { AIFreelancerLogo } from './components/AIFreelancerLogo';
import { PageTransition } from './components/PageTransition';
import { Navbar } from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { LayoutGrid, BarChart3, Globe, BrainCircuit, ChevronDown, Zap, TrendingUp, ShieldCheck, Layers, Search, User, Mail } from 'lucide-react';

const DeviceRedirector: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '') {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        navigate('/audit-pravdy-v2', { replace: true });
      } else {
        navigate('/ai-studio', { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  return null;
};

// SEO Page Wrapper to keep the Sidebar but use Orchestrator for content
const SEOPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#E2E8F0] flex font-inter overflow-hidden text-left text-slate-900">
      <aside className="w-[280px] bg-[#0F172A] flex flex-col border-r border-white/5 h-screen sticky top-0 shrink-0">
        <div className="p-8 border-b border-white/5 text-left"><AIFreelancerLogo size={24} variant="light" /></div>
        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-10 custom-scrollbar text-left">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-left">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 text-left">PROJEKT</p>
            <div className="flex items-center justify-between text-left"><span className="text-sm font-bold text-white tracking-tight text-left text-left">aifreelancer.sk</span><ChevronDown size={14} className="text-slate-500 text-left" /></div>
          </div>
            <div className="space-y-1 text-left">
            <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-left">CENTRÁLA</p>
            <button onClick={() => navigate('/dashboard-v1')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><LayoutGrid size={18} /><span className="text-sm font-bold">Dashboard</span></button>
            <button onClick={() => navigate('/landing-page')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><Zap size={18} /><span className="text-sm font-bold">Analýza trhu</span></button>
            <button onClick={() => navigate('/audit-vysledok')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><TrendingUp size={18} /><span className="text-sm font-bold">Výsledok auditu</span></button>
            <button onClick={() => navigate('/full-audit')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><ShieldCheck size={18} /><span className="text-sm font-bold">Kompletný Audit</span></button>
            <button onClick={() => navigate('/marketing-overview')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><BarChart3 size={18} /><span className="text-sm font-bold">Marketingový prehľad</span></button>
            <button onClick={() => navigate('/seo-optimization')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#32317D] text-white shadow-lg transition-all text-left text-left"><Globe size={18} /><span className="text-sm font-bold">SEO optimalizácia</span></button>
            <button onClick={() => navigate('/ai-studio')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><BrainCircuit size={18} /><span className="text-sm font-bold">AI Studio</span></button>
            <button onClick={() => navigate('/agency')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><Layers size={18} /><span className="text-sm font-bold">AI Agency</span></button>
            <button onClick={() => navigate('/use-case/shopentum')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><Search size={18} /><span className="text-sm font-bold">Case Study</span></button>
            <button onClick={() => navigate('/o-mne')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><User size={18} /><span className="text-sm font-bold">O mne</span></button>
            <button onClick={() => navigate('/kontakt')} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"><Mail size={18} /><span className="text-sm font-bold">Kontakt</span></button>
          </div>
        </div>
      </aside>
      <main className="flex-1 h-screen overflow-y-auto bg-[#E2E8F0] custom-scrollbar p-12 text-left text-left">
        <BlueprintOrchestrator blueprint={SEOOptimizationBlueprint} />
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = ['/ai-studio', '/agency', '/use-case/shopentum', '/o-mne', '/kontakt', '/cookies', '/gdpr'].includes(location.pathname);

  return (
    <div className="min-h-screen">
      <DeviceRedirector />
      {showNavbar && <Navbar />}
      <PageTransition>
        <Routes>
          <Route path="/dashboard-v1" element={<DashboardV1 />} />
          <Route path="/marketing-overview" element={<MarketingOverview />} />
          <Route path="/marketing-center" element={<MarketingCenter />} />
          <Route path="/channel-detail" element={<ChannelDetail />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/audit-vysledok" element={<AuditResult />} />
          <Route path="/full-audit" element={<FullAudit />} />
          <Route path="/ai-studio" element={<AIStudio />} />
          <Route path="/agency" element={<Agency />} />
          <Route path="/use-case/shopentum" element={<ShopentumUseCase />} />
          <Route path="/o-mne" element={<AboutMe />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/seo-optimization" element={<SEOPageWrapper />} />
          <Route path="/audit-pravdy-v2" element={<><Dashboard /><div className="pt-14"><BlueprintOrchestrator blueprint={AuditTruthV2Blueprint} /></div></>} />
          <Route path="/audit-pravdy-v3" element={<><Dashboard /><div className="pt-14"><BlueprintOrchestrator blueprint={AuditMixedV3Blueprint} /></div></>} />
          <Route path="/" element={<div className="min-h-screen bg-[#030315]" />} />
          <Route path="*" element={<Navigate to="/dashboard-v1" replace />} />
        </Routes>
      </PageTransition>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppContent />
    </HashRouter>
  );
};

export default App;
