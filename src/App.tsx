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
import SEO from './components/SEO';

type Page = 'home' | 'gallery' | 'fabric' | 'oil' | 'handcraft' | 'skin-care' | 'about' | 'contact' | 'cart' | 'wishlist' | 'profile' | 'login' | 'artwork' | 'checkout' | 'admin' | 'privacy' | 'terms' | 'cookies' | 'shipping' | 'returns' | 'size-guide' | 'care-instructions' | 'faq' | 'track-order' | 'database-test' | 'services' | 'custom-order';

const pageToPath: Record<Page, string> = {
  home: '/',
  gallery: '/gallery',
  fabric: '/gallery/fabric',
  oil: '/gallery/oil',
  handcraft: '/gallery/handcraft',
  'skin-care': '/gallery/skin-care',
  about: '/about',
  contact: '/contact',
  cart: '/cart',
  wishlist: '/wishlist',
  profile: '/profile',
  login: '/login',
  artwork: '/artwork',
  checkout: '/checkout',
  admin: '/admin',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  shipping: '/shipping',
  returns: '/returns',
  'size-guide': '/size-guide',
  'care-instructions': '/care-instructions',
  faq: '/faq',
  'track-order': '/track-order',
  'database-test': '/database-test',
  services: '/services',
  'custom-order': '/custom-order',
};

function parseLocation(pathname: string): { page: Page; id?: string } {
  if (pathname.startsWith('/artwork/')) {
    const id = pathname.replace('/artwork/', '').split('/')[0];
    return { page: 'artwork', id };
  }
  const match = Object.entries(pageToPath).find(([, p]) => p === pathname) as [Page, string] | undefined;
  if (match) return { page: match[0] };
  return { page: 'home' };
}

function AppContent() {
  const { user, loading: authLoading } = useSupabase();
  const { dispatch } = useApp();
  const { artworks, loading: artworksLoading, error: artworksError } = useArtworks();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize from URL and handle back/forward navigation
  useEffect(() => {
    const { page, id } = parseLocation(window.location.pathname);
    setCurrentPage(page);
    setSelectedArtworkId(id || null);

    const onPopState = () => {
      const { page: p, id: artId } = parseLocation(window.location.pathname);
      setCurrentPage(p);
      setSelectedArtworkId(artId || null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

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

  const navigateTo = (page: Page, id?: string) => {
    const path = page === 'artwork' && id ? `/artwork/${id}` : pageToPath[page];
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPage(page);
  };

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'login') {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    
    if (page === 'artwork' && id) {
      setSelectedArtworkId(id);
      navigateTo('artwork', id);
      return;
    }
    
    navigateTo(page as Page);
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
      navigateTo('home'); // Redirect to home after login
    }, 500);
  };

  const handleLogout = () => {
    signOut();
    navigateTo('home'); // Redirect to home after logout
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

  const seoForPage = (): { title?: string; description?: string; path?: string; image?: string; type?: 'website' | 'article' | 'product' } => {
    switch (currentPage) {
      case 'home':
        return { title: 'Home', description: 'Discover hand-painted fabrics, oil paintings, and handcrafts.', path: '/' };
      case 'gallery':
        return { title: 'Gallery', description: 'Browse all artworks across categories.', path: '/gallery' };
      case 'fabric':
        return { title: 'Fabric Painting Gallery', description: 'Hand-painted fabrics: dupattas, sarees, suits and more.', path: '/gallery/fabric' };
      case 'oil':
        return { title: 'Oil Paintings', description: 'Original oil paintings for your home and office.', path: '/gallery/oil' };
      case 'handcraft':
        return { title: 'Handcraft', description: 'Unique handcrafted items made with love.', path: '/gallery/handcraft' };
      case 'skin-care':
        return { title: 'Skin Care', description: 'Natural skincare and oils available in the shop.', path: '/gallery/skin-care' };
      case 'services':
        return { title: 'Services', description: 'Custom fabric painting with optional professional stitching.', path: '/services' };
      case 'custom-order':
        return { title: 'Custom Order', description: 'Start your custom fabric painting order with Brush n Blends.', path: '/custom-order' };
      case 'about':
        return { title: 'About', description: 'Learn about Brush n Blends and our mission.', path: '/about' };
      case 'contact':
        return { title: 'Contact', description: 'Get in touch for commissions and inquiries.', path: '/contact' };
      case 'privacy':
        return { title: 'Privacy Policy', description: 'How we handle your data and privacy.', path: '/privacy' };
      case 'terms':
        return { title: 'Terms of Service', description: 'The rules and terms for using our site.', path: '/terms' };
      case 'cookies':
        return { title: 'Cookie Policy', description: 'Information about cookies used on our site.', path: '/cookies' };
      case 'shipping':
        return { title: 'Shipping Info', description: 'Shipping timelines, carriers, and charges.', path: '/shipping' };
      case 'returns':
        return { title: 'Returns & Exchanges', description: 'Our return and exchange policy.', path: '/returns' };
      case 'size-guide':
        return { title: 'Size Guide', description: 'Measurement and sizing guide for tailored outfits.', path: '/size-guide' };
      case 'care-instructions':
        return { title: 'Care Instructions', description: 'How to care for hand-painted fabrics and art.', path: '/care-instructions' };
      case 'faq':
        return { title: 'FAQ', description: 'Frequently asked questions about orders and products.', path: '/faq' };
      case 'track-order':
        return { title: 'Track Order', description: 'Track the status of your order.', path: '/track-order' };
      case 'cart':
        return { title: 'Your Cart', description: 'Review items in your shopping cart.', path: '/cart' };
      case 'checkout':
        return { title: 'Checkout', description: 'Secure checkout for your purchase.', path: '/checkout' };
      case 'artwork': {
        const art = artworks.find(a => a.id === selectedArtworkId);
        return {
          title: art ? art.title : 'Artwork',
          description: art?.description || 'View artwork details and purchase options.',
          path: art ? `/artwork/${art.id}` : '/artwork',
          image: art?.images?.[0],
          type: 'product'
        };
      }
      default:
        return { title: 'Brush n Blends', description: 'Handcrafted Indian art, fabric painting, oil paintings, and more.', path: '/' };
    }
  };

  const { title, description, path, image, type } = seoForPage();

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
      <SEO title={title} description={description} path={path} image={image} type={type} />
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