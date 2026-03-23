"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Phone, User, Send, Linkedin } from "lucide-react";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const Contact: React.FC = () => {
  const tContact = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey?.trim()) {
      setSubmitError(tContact("error_missing_key"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `${tContact("subject_prefix")} — ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          message: formData.message,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.message || tContact("error_submit_failed"));
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : tContact("error_unexpected"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-indigo-500/30 overflow-x-hidden">
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Left Side: Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">{tContact("eyebrow")}</p>
                <h1 className="text-5xl md:text-7xl font-sora font-black tracking-tighter leading-tight">
                  {tContact("title")}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                  {tContact("lead")}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{tContact("labels.name")}</p>
                    <p className="text-xl font-bold">{tContact("identity_name")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{tContact("labels.email")}</p>
                    <a href="mailto:daniel.budzinak@gmail.com" className="text-xl font-bold hover:text-indigo-400 transition-colors">daniel.budzinak@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{tContact("labels.phone")}</p>
                    <a href="tel:+421911694025" className="text-xl font-bold hover:text-indigo-400 transition-colors">+421 911 694 025</a>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center space-x-6">
                <a href="https://www.linkedin.com/in/daniel-budzi%C5%88%C3%A1k-505532378/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{tContact("location")}</span>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                {submitted ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                      <Send size={32} />
                    </div>
                    <h3 className="text-3xl font-sora font-black tracking-tighter">{tContact("success_title")}</h3>
                    <p className="text-slate-400">{tContact("status_success")}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSubmitError(null);
                      }}
                      className="text-indigo-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                    >
                      {tContact("send_another")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <p
                        className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                        role="alert"
                      >
                        {submitError}
                      </p>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tContact("form.name_label")}</label>
                      <input 
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={tContact("placeholder_name")}
                        className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tContact("form.email_label")}</label>
                        <input 
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={tContact("form.email_placeholder")}
                          className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tContact("form.phone_label")}</label>
                        <input 
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={tContact("form.phone_placeholder")}
                          className="w-full px-6 py-4 bg-transparent border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tContact("form.message_label")}</label>
                      <textarea 
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder={tContact("placeholder_message")}
                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-slate-600 resize-none"
                      />
                    </div>

                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-3">
                        <span>{isSubmitting ? tContact("status_sending") : tContact("cta")}</span>
                        {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

const ArrowRight: React.FC<{ size?: number, className?: string }> = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default Contact;
