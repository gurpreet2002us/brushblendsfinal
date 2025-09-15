import React, { useState, useEffect } from 'react';
import { useSupabase, getUserProfile, signOut } from './hooks/useSupabase';
import { useArtworks } from './hooks/useArtworks';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Gallery from './components/Gallery';
import ArtworkDetail from './components/ArtworkDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import CookiePolicyPage from './components/CookiePolicyPage';
import ShippingInfoPage from './components/ShippingInfoPage';
import ReturnsExchangesPage from './components/ReturnsExchangesPage';
import SizeGuidePage from './components/SizeGuidePage';
import CareInstructionsPage from './components/CareInstructionsPage';
import FAQPage from './components/FAQPage';
import TrackOrderPage from './components/TrackOrderPage';
import DatabaseTest from './components/DatabaseTest';
import ServicesPage from './components/ServicesPage';
import CustomOrderForm from './components/CustomOrderForm';

type Page = 'home' | 'gallery' | 'fabric' | 'oil' | 'handcraft' | 'skin-care' | 'about' | 'contact' | 'cart' | 'wishlist' | 'profile' | 'login' | 'artwork' | 'checkout' | 'admin' | 'privacy' | 'terms' | 'cookies' | 'shipping' | 'returns' | 'size-guide' | 'care-instructions' | 'faq' | 'track-order' | 'database-test' | 'services' | 'custom-order';

function AppContent() {
  const { user, loading: authLoading } = useSupabase();
  const { dispatch } = useApp();
  const { artworks, loading: artworksLoading, error: artworksError } = useArtworks();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync supabase user with app context and fetch profile
  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then(({ data: profileData }) => {
        if (profileData) {
          const combinedUser = {
            ...user,
            ...profileData
          };
          dispatch({ type: 'SET_USER', payload: combinedUser });
          setUserProfile(profileData);
        } else {
          // If profile doesn't exist, use Supabase user but add default fields
          const defaultUser = {
            ...user,
            name: user.email?.split('@')[0] || 'New User', // A sensible default
            isAdmin: false
          };
          dispatch({ type: 'SET_USER', payload: defaultUser });
          setUserProfile(null);
        }
      });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
      setUserProfile(null);
    }
  }, [user, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'login') {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    
    if (page === 'artwork' && id) {
      setSelectedArtworkId(id);
      setCurrentPage('artwork');
      return;
    }
    
    setCurrentPage(page as Page);
    if (page !== 'artwork') {
      setSelectedArtworkId(null);
    }
  };

  const handleShowAuthModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setTimeout(() => {
      setCurrentPage('home'); // Redirect to home after login
    }, 500);
  };

  const handleLogout = () => {
    signOut();
    setCurrentPage('home'); // Redirect to home after logout
  };

  if (authLoading || artworksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          {artworksError && (
            <p className="text-red-600 mt-2">Error loading artworks: {artworksError}</p>
          )}
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onShowAuthModal={handleShowAuthModal} />;
      case 'gallery':
        return <Gallery onNavigate={handleNavigate} onShowAuthModal={handleShowAuthModal} />;
      case 'fabric':
        return <Gallery onNavigate={handleNavigate} category="Fabric Painting" onShowAuthModal={handleShowAuthModal} />;
      case 'oil':
        return <Gallery onNavigate={handleNavigate} category="Oil Painting" onShowAuthModal={handleShowAuthModal} />;
      case 'handcraft':
        return <Gallery onNavigate={handleNavigate} category="Handcraft" onShowAuthModal={handleShowAuthModal} />;
      case 'skin-care':
        return <Gallery onNavigate={handleNavigate} category="Skin Care" onShowAuthModal={handleShowAuthModal} />;
      case 'artwork':
        return selectedArtworkId ? (
          <ArtworkDetail artworkId={selectedArtworkId} onNavigate={handleNavigate} artworks={artworks} />
        ) : (
          <HomePage onNavigate={handleNavigate} onShowAuthModal={handleShowAuthModal} />
        );
      case 'cart':
        return <Cart onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'custom-order':
        return <CustomOrderForm onNavigate={handleNavigate} />;
      case 'profile':
        return <UserDashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicyPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsOfServicePage onNavigate={handleNavigate} />;
      case 'cookies':
        return <CookiePolicyPage onNavigate={handleNavigate} />;
      case 'shipping':
        return <ShippingInfoPage onNavigate={handleNavigate} />;
      case 'returns':
        return <ReturnsExchangesPage onNavigate={handleNavigate} />;
      case 'size-guide':
        return <SizeGuidePage onNavigate={handleNavigate} />;
      case 'care-instructions':
        return <CareInstructionsPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'track-order':
        return <TrackOrderPage onNavigate={handleNavigate} />;
      case 'database-test':
        return <DatabaseTest />;
      default:
        return <HomePage onNavigate={handleNavigate} onShowAuthModal={handleShowAuthModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        user={user}
        userProfile={userProfile}
      />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;