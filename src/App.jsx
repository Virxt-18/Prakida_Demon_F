import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NoiseOverlay from './components/ui/NoiseOverlay';
import ScrollToTop from './components/ui/ScrollToTop';
import AshOverlay from './components/ui/AshOverlay';
import PageTransition from './components/ui/PageTransition';

import ScrollPath from './components/ui/ScrollPath';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Merchandise = lazy(() => import('./pages/Merchandise'));
const Sports = lazy(() => import('./pages/Sports'));
const Contact = lazy(() => import('./pages/Contact'));
const RegisterSection = lazy(() => import('./pages/RegisterSection'));
const Alumni = lazy(() => import('./pages/Alumni'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Separate component to use hook inside Router
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-prakida-flame font-display text-2xl tracking-widest">LOADING...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
          <Route path="/merchandise" element={<PageTransition><Merchandise /></PageTransition>} />
          <Route path="/sports" element={<PageTransition><Sports /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/register" element={<PageTransition><RegisterSection /></PageTransition>} />
          <Route path="/alumni" element={<PageTransition><Alumni /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ScrollPath />
        <div className="bg-prakida-bg min-h-screen text-white overflow-x-hidden selection:bg-prakida-flame selection:text-white">
          <NoiseOverlay />
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
