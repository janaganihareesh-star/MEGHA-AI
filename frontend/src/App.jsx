import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useTheme from './hooks/useTheme';
import SplashScreen from './components/SplashScreen';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Onboarding Pages
import GenderSelectionPage from './pages/GenderSelectionPage';
import RelationshipSelectionPage from './pages/RelationshipSelectionPage';
import AINameSelectionPage from './pages/AINameSelectionPage';

// Main App Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import VoicePage from './pages/VoicePage';
import MemoryVaultPage from './pages/MemoryVaultPage';
import DreamBoardPage from './pages/DreamBoardPage';
import GoalsPage from './pages/GoalsPage';
import AchievementsPage from './pages/AchievementsPage';
import LearningPage from './pages/LearningPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import MockInterviewPage from './pages/MockInterviewPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import TimelinePage from './pages/TimelinePage';
import WeeklyReflectionPage from './pages/WeeklyReflectionPage';
import SummaryPage from './pages/SummaryPage';
import PersonaPage from './pages/PersonaPage';

// NEW: Sections 107-110
import CareerHubPage from './pages/CareerHubPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import CoverLetterPage from './pages/CoverLetterPage';
import SalaryEnginePage from './pages/SalaryEnginePage';
import ProjectBuilderPage from './pages/ProjectBuilderPage';
import HabitTrackerPage from './pages/HabitTrackerPage';
import SearchPage from './pages/SearchPage';

// Engines 35-46
import ToolsHubPage from './pages/ToolsHubPage';
import DocumentGeneratorPage from './pages/DocumentGeneratorPage';
import DocumentAIPage from './pages/DocumentAIPage';
import CodeEnginePage from './pages/CodeEnginePage';
import TranslatorPage from './pages/TranslatorPage';
import PromptEngineerPage from './pages/PromptEngineerPage';
import DataAnalysisPage from './pages/DataAnalysisPage';
import ContentCreatorPage from './pages/ContentCreatorPage';
import AcademicPage from './pages/AcademicPage';
import CalculatorPage from './pages/CalculatorPage';
import OfficialDraftsPage from './pages/OfficialDraftsPage';
import BusinessPage from './pages/BusinessPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  // Initialize theme properly
  useTheme();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="mesh-bg min-h-screen text-text transition-colors duration-500">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Onboarding steps */}
        <Route path="/onboarding/gender" element={<GenderSelectionPage />} />
        <Route path="/onboarding/name" element={<AINameSelectionPage />} />
        <Route path="/onboarding/relationship" element={<RelationshipSelectionPage />} />

        {/* Core application sections */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/voice" element={<VoicePage />} />
        <Route path="/memory-vault" element={<MemoryVaultPage />} />
        <Route path="/dreamboard" element={<DreamBoardPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/weekly-reflection" element={<WeeklyReflectionPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/persona" element={<PersonaPage />} />

        {/* Section 107-110: Career Hub, Project Builder, Productivity, Search */}
        <Route path="/career" element={<CareerHubPage />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/cover-letter" element={<CoverLetterPage />} />
        <Route path="/salary-engine" element={<SalaryEnginePage />} />
        <Route path="/project-builder" element={<ProjectBuilderPage />} />
        <Route path="/habits" element={<HabitTrackerPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Engines 35-46 & Tools Hub */}
        <Route path="/tools" element={<ToolsHubPage />} />
        <Route path="/tools/document-generator" element={<DocumentGeneratorPage />} />
        <Route path="/tools/document-ai" element={<DocumentAIPage />} />
        <Route path="/tools/code-engine" element={<CodeEnginePage />} />
        <Route path="/tools/translator" element={<TranslatorPage />} />
        <Route path="/tools/prompt-engineer" element={<PromptEngineerPage />} />
        <Route path="/tools/data-analysis" element={<DataAnalysisPage />} />
        <Route path="/tools/content-creator" element={<ContentCreatorPage />} />
        <Route path="/tools/academic" element={<AcademicPage />} />
        <Route path="/tools/calculator" element={<CalculatorPage />} />
        <Route path="/tools/official-drafts" element={<OfficialDraftsPage />} />
        <Route path="/tools/business" element={<BusinessPage />} />
      </Routes>
    </div>
  );
}