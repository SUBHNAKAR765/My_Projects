import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DailyPage from './pages/DailyPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import DSAProgressDashboard from './pages/DSAProgressDashboard';
import CalendarHeatmap from './pages/CalendarHeatmap';
import FitnessCategoryPage from './pages/FitnessCategoryPage';
import FitnessModulePage from './pages/FitnessModulePage';
import MathsCategoryPage from './pages/MathsCategoryPage';
import MathsSubtopicsPage from './pages/MathsSubtopicsPage';
import MathsProblemsPage from './pages/MathsProblemsPage';
import MathsQuizPage from './pages/MathsQuizPage';
import LanguageCategoryPage from './pages/LanguageCategoryPage';
import LanguageListPage from './pages/LanguageListPage';
import LanguageDetailPage from './pages/LanguageDetailPage';
import CookingCategoryPage from './pages/CookingCategoryPage';
import CookingDetailPage from './pages/CookingDetailPage';
import Toast from './components/Toast';
import { api } from './utils/api';

const SETTINGS_KEY = 'skillbite_settings';

function getSettings() {
  try {
    return { sound: true, reminder: true, reducedMotion: false, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  } catch {
    return { sound: true, reminder: true, reducedMotion: false };
  }
}

function getSavedUser() {
  try { return JSON.parse(localStorage.getItem('skillbite_user') || 'null') } catch { return null }
}

function pageToPath(page) {
  if (page === 'daily') return '/daily';
  if (page === 'leaderboard') return '/leaderboard';
  if (page === 'profile') return '/profile';
  if (page === 'analytics') return '/analytics';
  if (page === 'dsa') return '/dsa';
  if (page === 'roadmap') return '/roadmap';
  if (page === 'maths') return '/daily/maths';
  if (page === 'maths_subtopics') return '/daily/maths/subtopics';
  if (page === 'maths_problems') return '/daily/maths/problems';
  if (page === 'maths_quiz') return '/daily/maths/quiz';
  if (page === 'language') return '/daily/language';
  if (page === 'language_list') return '/daily/language/list';
  if (page === 'language_detail') return '/daily/language/detail';
  if (page === 'fitness') return '/daily/fitness';
  if (page === 'fitness_module') return '/daily/fitness/module';
  if (page === 'cooking_list') return '/daily/cooking';
  if (page === 'cooking_detail') return '/daily/cooking/detail';
  return '/';
}

function pathToPage(pathname) {
  if (pathname.startsWith('/leaderboard')) return 'leaderboard';
  if (pathname.startsWith('/profile')) return 'profile';
  if (pathname.startsWith('/analytics')) return 'analytics';
  if (pathname.startsWith('/dsa')) return 'dsa';
  if (pathname.startsWith('/roadmap')) return 'roadmap';
  
  if (pathname.startsWith('/daily/language/detail')) return 'language_detail';
  if (pathname.startsWith('/daily/language/list')) return 'language_list';
  if (pathname.startsWith('/daily/language')) return 'language';
  if (pathname.startsWith('/daily/cooking/detail')) return 'cooking_detail';
  if (pathname.startsWith('/daily/cooking')) return 'cooking_list';
  if (pathname.startsWith('/daily/fitness/module')) return 'fitness_module';
  if (pathname.startsWith('/daily/fitness')) return 'fitness';
  if (pathname.startsWith('/daily/maths/subtopics')) return 'maths_subtopics';
  if (pathname.startsWith('/daily/maths/problems')) return 'maths_problems';
  if (pathname.startsWith('/daily/maths/quiz')) return 'maths_quiz';
  if (pathname.startsWith('/daily/maths')) return 'maths';
  if (pathname.startsWith('/daily')) return 'daily';
  return 'dashboard';
}

export default function App() {
  const [user, setUser] = useState(getSavedUser);
  const [page, setPage] = useState(() => pathToPage(window.location.pathname));
  const [records, setRecords] = useState([]);
  const [settings, _setSettings] = useState(getSettings);

  const navigatePage = useCallback((nextPage) => {
    const targetPath = pageToPath(nextPage);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setPage(nextPage);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('reduce-motion', !!settings.reducedMotion);
  }, [settings.reducedMotion]);

  useEffect(() => {
    const onPopState = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [user]);

  useEffect(() => {
    if (!user) { setRecords([]); return; }
    api.getAnswers().then(data => setRecords(Array.isArray(data) ? data : [])).catch(() => setRecords([]));
  }, [user]);

  const handleAuth = useCallback((userData) => {
    localStorage.setItem('skillbite_user', JSON.stringify(userData));
    setUser(userData);
    navigatePage('dashboard');
  }, [navigatePage]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('skillbite_token');
    localStorage.removeItem('skillbite_user');
    setUser(null);
    setRecords([]);
    navigatePage('dashboard');
  }, [navigatePage]);

  const handleSaveAnswer = useCallback(async (data) => {
    try {
      const saved = await api.saveAnswer({
        ...data,
        completedAt: new Date().toISOString(),
      });
      setRecords(prev => [...prev, { ...saved, id: saved.id || Date.now() }]);
    } catch { /* silent */ }
  }, []);

  return (
    <>
      <Toast />
      <div className="animated-bg" />
      <div className="hero-overlay" />
      
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
           {/* We will let AuthPage handle the styling context seamlessly in the dark theme */}
          <AuthPage onAuth={handleAuth} />
        </div>
      ) : (
        <Layout activePage={page} onNavigate={navigatePage} user={user} onLogout={handleLogout}>
          {page === 'dashboard'   && <DashboardPage records={records} user={user} onNavigate={navigatePage} />}
          {page === 'analytics'   && <AnalyticsPage records={records} user={user} />}
          {page === 'daily'       && <DailyPage onSaveAnswer={handleSaveAnswer} onNavigate={navigatePage} />}
          {page === 'leaderboard' && <LeaderboardPage records={records} user={user} />}
          {page === 'profile'     && <ProfilePage records={records} user={user} onLogout={handleLogout} />}
          {page === 'dsa'         && <DSAProgressDashboard />}
          {page === 'roadmap'     && <CalendarHeatmap />}
          {page === 'fitness'     && <FitnessCategoryPage onNavigate={navigatePage} />}
          {page === 'fitness_module' && <FitnessModulePage onNavigate={navigatePage} />}
          {page === 'maths'       && <MathsCategoryPage onNavigate={navigatePage} />}
          {page === 'maths_subtopics' && <MathsSubtopicsPage onNavigate={navigatePage} />}
          {page === 'maths_problems' && <MathsProblemsPage onNavigate={navigatePage} />}
          {page === 'maths_quiz' && <MathsQuizPage onNavigate={navigatePage} />}
          {page === 'language'    && <LanguageCategoryPage onNavigate={navigatePage} />}
          {page === 'language_list' && <LanguageListPage onNavigate={navigatePage} />}
          {page === 'language_detail' && <LanguageDetailPage onNavigate={navigatePage} />}
          {page === 'cooking_list' && <CookingCategoryPage onNavigate={navigatePage} />}
          {page === 'cooking_detail' && <CookingDetailPage onNavigate={navigatePage} />}
        </Layout>
      )}
    </>
  );
}
