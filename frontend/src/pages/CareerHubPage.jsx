import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Award, Linkedin, MessageSquare,
  DollarSign, Building2, Zap, ArrowRight
} from 'lucide-react';

const tools = [
  {
    icon: <FileText size={28} />,
    title: 'Resume Builder',
    subtitle: 'ATS-Optimized from Scratch',
    desc: 'AI builds your complete resume with action verbs, quantified achievements & ATS keywords.',
    badge: 'ATS Score',
    color: 'from-violet-500 to-purple-600',
    path: '/resume-builder'
  },
  {
    icon: <Award size={28} />,
    title: 'ATS Analyzer',
    subtitle: 'Keyword Gap Finder',
    desc: 'Paste any job description and see exactly which keywords you\'re missing.',
    badge: 'Score: 0-100',
    color: 'from-rose-500 to-pink-600',
    path: '/resume-analyzer'
  },
  {
    icon: <MessageSquare size={28} />,
    title: 'Cover Letter',
    subtitle: '3 Tone Variants',
    desc: 'AI writes a human-sounding cover letter that doesn\'t start with "I am writing to apply".',
    badge: 'Pro / Friendly / Bold',
    color: 'from-sky-500 to-blue-600',
    path: '/cover-letter'
  },
  {
    icon: <Linkedin size={28} />,
    title: 'LinkedIn Optimizer',
    subtitle: 'All Sections Optimized',
    desc: 'Headline, About, Experience, Skills — all with SEO keywords recruiters search for.',
    badge: 'SEO Keywords',
    color: 'from-cyan-500 to-teal-600',
    path: '/linkedin-optimizer'
  },
  {
    icon: <Zap size={28} />,
    title: 'Interview Prep',
    subtitle: 'HR + Technical + System Design',
    desc: 'Company-specific questions, STAR answers, coding challenges with AI evaluation.',
    badge: 'Mock Ready',
    color: 'from-amber-500 to-orange-500',
    path: '/mock-interview'
  },
  {
    icon: <DollarSign size={28} />,
    title: 'Salary Engine',
    subtitle: 'Research + Negotiation Script',
    desc: 'Market salary ranges + 3 scripts: email counter, phone talking points, counter-counter.',
    badge: 'Market Data',
    color: 'from-emerald-500 to-green-600',
    path: '/salary-engine'
  },
  {
    icon: <Building2 size={28} />,
    title: 'Company Prep',
    subtitle: 'TCS to Google — All Tiers',
    desc: 'Company-specific guides: test patterns, round-wise Qs, dress code, compensation.',
    badge: 'TCS / Google / Amazon',
    color: 'from-indigo-500 to-blue-600',
    path: '/company-prep'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

export default function CareerHubPage() {
  const navigate = useNavigate();

  return (
    <div className="career-hub-page">
      <div className="career-hub-header">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="career-hub-badge">🚀 Career Hub</div>
          <h1 className="career-hub-title">Land Your Dream Job</h1>
          <p className="career-hub-subtitle">
            7 AI-powered tools — from zero resume to offer letter negotiation
          </p>
        </motion.div>
      </div>

      <motion.div className="career-tools-grid" variants={container} initial="hidden" animate="show">
        {tools.map((tool) => (
          <motion.div
            key={tool.title}
            className="career-tool-card"
            variants={cardAnim}
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(tool.path)}
          >
            <div className={`career-tool-icon bg-gradient-to-br ${tool.color}`}>
              {tool.icon}
            </div>
            <div className="career-tool-content">
              <div className="career-tool-badge">{tool.badge}</div>
              <h3 className="career-tool-title">{tool.title}</h3>
              <p className="career-tool-subtitle">{tool.subtitle}</p>
              <p className="career-tool-desc">{tool.desc}</p>
            </div>
            <div className="career-tool-arrow">
              <ArrowRight size={18} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        .career-hub-page { padding: 32px 24px; max-width: 1100px; margin: 0 auto; }
        .career-hub-header { text-align: center; margin-bottom: 48px; }
        .career-hub-badge {
          display: inline-block; background: rgba(139,92,246,0.15); color: #a78bfa;
          border: 1px solid rgba(139,92,246,0.3); border-radius: 20px;
          padding: 6px 16px; font-size: 13px; font-weight: 600; margin-bottom: 16px;
        }
        .career-hub-title {
          font-size: clamp(28px, 5vw, 42px); font-weight: 800;
          background: linear-gradient(135deg, #e0c3fc, #8ec5fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin: 0 0 12px;
        }
        .career-hub-subtitle { color: var(--text-secondary, #94a3b8); font-size: 16px; }
        .career-tools-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .career-tool-card {
          background: var(--card-bg, rgba(255,255,255,0.04));
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          border-radius: 16px; padding: 24px;
          cursor: pointer; display: flex; gap: 16px; align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .career-tool-card:hover {
          border-color: rgba(139,92,246,0.4);
          box-shadow: 0 8px 32px rgba(139,92,246,0.15);
        }
        .career-tool-icon {
          width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; color: white;
        }
        .career-tool-content { flex: 1; }
        .career-tool-badge {
          font-size: 11px; font-weight: 600; color: #a78bfa;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
        }
        .career-tool-title { font-size: 17px; font-weight: 700; margin: 0 0 2px; }
        .career-tool-subtitle { font-size: 13px; color: var(--text-secondary, #94a3b8); margin: 0 0 8px; }
        .career-tool-desc { font-size: 13px; color: var(--text-tertiary, #64748b); line-height: 1.5; margin: 0; }
        .career-tool-arrow { color: var(--text-secondary, #94a3b8); margin-top: 4px; }
      `}</style>
    </div>
  );
}
