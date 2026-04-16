import React, { Suspense, lazy, useState, useContext, useEffect, useRef, useMemo } from 'react';
import { 
  Eye, EyeOff, Check, User, Mail, Phone, Lock, ArrowRight, Diamond, 
  ArrowLeft, ShieldCheck, KeyRound, Key, Search, Heart, ShoppingBag, 
  Monitor, Shirt, Armchair, Sparkles, Dumbbell, BookOpen, Gamepad2, 
  ShoppingBasket, Zap, Star, Apple, Play, Plus, Menu, X, ChevronRight, ChevronLeft, Minus, Truck, Share2, Bookmark, Trash2,
  LayoutGrid, DollarSign, Award, Package, RotateCcw, List, CreditCard, Smartphone, Building2, Wallet, Banknote,
  CheckCircle2, Copy, MapPin, Activity, Download, Headphones, Route, ExternalLink, PhoneCall, MessageSquare, Clock, Map,
  Filter, ChevronDown, Box, History, RefreshCw, Layers, Bell, Shield, HelpCircle, Fingerprint, Camera, Home,
  LayoutDashboard, Users, BarChart3, Ticket, TrendingUp, TrendingDown, UserPlus, MoreVertical, Settings,
  SignalHigh, Trash, Edit, Edit2, Globe, Watch, LogOut, BellOff,
  CreditCard as CreditCardIcon, Star as StarIcon, Package as PackageIcon, Search as SearchIcon, Truck as TruckIcon, Eye as EyeIcon, Award as AwardIcon, LayoutGrid as LayoutGridIcon, DollarSign as DollarSignIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToNewsletter } from './services/newsletter';
import BrandMark from './components/BrandMark';
import { authApi, addressApi, cartApi, orderApi, paymentMethodApi, notificationApi, productApi } from './lib/api';
import { useGoogleLogin } from '@react-oauth/google';

type InfoView =
  | 'private-suite'
  | 'authenticity-guarantee'
  | 'boutique-locations'
  | 'client-care'
  | 'shipping-etiquette'
  | 'terms-of-service'
  | 'curator-concierge';

type View = 'login' | 'register' | 'forgot-password' | 'verify-otp' | 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout-address' | 'checkout-payment' | 'checkout-review' | 'checkout-success' | 'order-tracking' | 'order-detail' | 'my-orders' | 'profile' | 'wishlist' | 'category-timepieces' | 'category-jewelry' | 'category-leather' | 'category-fashion' | 'category-home' | 'category-beauty' | 'category-sports' | 'category-books' | 'category-toys' | 'profile-addresses' | 'profile-payments' | 'profile-notifications' | 'profile-security' | 'profile-help' | 'admin-dashboard' | 'admin-products' | 'admin-orders' | 'admin-customers' | 'admin-customer-profile' | 'admin-coupons' | InfoView;

type InfoPageSection = {
  heading: string;
  body: string;
};

type InfoPageCopy = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: InfoPageSection[];
};

const infoPageViews: InfoView[] = [
  'private-suite',
  'authenticity-guarantee',
  'boutique-locations',
  'client-care',
  'shipping-etiquette',
  'terms-of-service',
  'curator-concierge'
];

const infoPageContent: Record<InfoView, InfoPageCopy> = {
  'private-suite': {
    eyebrow: 'The Experience',
    title: 'Private Suite',
    summary: 'A curated members-only lounge where early access drops, private pricing windows, and editorial buying notes are shared first.',
    sections: [
      {
        heading: 'Access Policy',
        body: 'Access is invitation-based. Qualified clients receive a secure invite link after their first verified order or by concierge recommendation.'
      },
      {
        heading: 'Suite Benefits',
        body: 'Members receive early access to capsule releases, pre-order reservation windows, and monthly private curation bundles.'
      },
      {
        heading: 'Support Hours',
        body: 'The suite desk is staffed Monday to Saturday, 08:00 to 20:00 UTC, with urgent fulfillment support available at all times.'
      }
    ]
  },
  'authenticity-guarantee': {
    eyebrow: 'The Experience',
    title: 'Authenticity Guarantee',
    summary: 'Every listed object is checked against sourcing records and condition audits before it is made available for acquisition.',
    sections: [
      {
        heading: 'Verification',
        body: 'Items are reviewed through provenance records, serial checks, and material inspection before publication.'
      },
      {
        heading: 'Guarantee Window',
        body: 'You have 30 days from delivery to report a mismatch with listing claims for immediate remediation.'
      },
      {
        heading: 'Remediation',
        body: 'If authenticity criteria are not met, we provide a full refund and managed return shipping at no cost.'
      }
    ]
  },
  'boutique-locations': {
    eyebrow: 'The Experience',
    title: 'Boutique Locations',
    summary: 'Visit our appointment-only boutiques for private fitting, inspection, and white-glove pickup.',
    sections: [
      {
        heading: 'New York',
        body: 'Hudson Yards Private Floor, Tue-Sat, 10:00-19:00. Walk-ins are not available.'
      },
      {
        heading: 'London',
        body: 'Mayfair Salon, Mon-Sat, 09:00-18:00. Priority slots are reserved for Suite members.'
      },
      {
        heading: 'Tokyo',
        body: 'Ginza Viewing Rooms, Wed-Mon, 11:00-20:00. Language support available in English and Japanese.'
      }
    ]
  },
  'client-care': {
    eyebrow: 'Client Care',
    title: 'Client Care',
    summary: 'Dedicated assistance for order updates, delivery coordination, billing support, and post-purchase care.',
    sections: [
      {
        heading: 'Live Support',
        body: 'Chat and email support respond within one business hour for active order inquiries.'
      },
      {
        heading: 'Priority Requests',
        body: 'Urgent delivery or gift protocol requests can be escalated through Curator Concierge.'
      },
      {
        heading: 'Aftercare',
        body: 'We provide post-delivery assistance including exchanges, repair coordination, and warranty guidance.'
      }
    ]
  },
  'shipping-etiquette': {
    eyebrow: 'Client Care',
    title: 'Shipping Etiquette',
    summary: 'Our fulfillment protocol is designed for discretion, reliability, and presentation quality.',
    sections: [
      {
        heading: 'Processing',
        body: 'Standard processing takes 1-2 business days after payment confirmation and verification.'
      },
      {
        heading: 'Packaging',
        body: 'All orders are packed in tamper-evident layers with discreet external labeling and branded interior presentation.'
      },
      {
        heading: 'Delivery',
        body: 'Signature confirmation is required for high-value orders. Courier windows are shared after dispatch.'
      }
    ]
  },
  'terms-of-service': {
    eyebrow: 'Client Care',
    title: 'Terms of Service',
    summary: 'This demo page contains placeholder legal copy and should be replaced with your final legal document.',
    sections: [
      {
        heading: 'Use of Service',
        body: 'By using this service, clients agree to provide accurate account information and comply with all applicable laws.'
      },
      {
        heading: 'Orders and Payments',
        body: 'All orders are subject to availability, verification, and fraud controls. Payments must be authorized before fulfillment.'
      },
      {
        heading: 'Returns and Liability',
        body: 'Return policies and warranty terms vary by category. Liability is limited as permitted by applicable law.'
      }
    ]
  },
  'curator-concierge': {
    eyebrow: 'Client Care',
    title: 'Curator Concierge',
    summary: 'A personal sourcing and support channel for rare requests, event curation, and white-glove coordination.',
    sections: [
      {
        heading: 'Personal Sourcing',
        body: 'Share your preferred makers, era, or target budget and our team will source options with verification notes.'
      },
      {
        heading: 'Event Curation',
        body: 'Concierge can curate private capsules for gifting, brand events, and executive hospitality.'
      },
      {
        heading: 'Contact Route',
        body: 'For this demo, email concierge@obsidiancurator.example and include order number when applicable.'
      }
    ]
  }
};

const isInfoView = (value: View): value is InfoView =>
  infoPageViews.includes(value as InfoView);

/* FIX: category images mapping */
const shopCategoryOptions = [
  { id: 'timepieces', view: 'category-timepieces', icon: Watch, label: 'Timepieces', count: '42 ITEMS', image: '/images/local/asset-0001.png' },
  { id: 'fashion', view: 'category-fashion', icon: Shirt, label: 'Fashion', count: '842 ITEMS', image: '/images/local/asset-0002.png' },
  { id: 'leather', view: 'category-leather', icon: ShoppingBasket, label: 'Leather', count: '88 ITEMS', image: '/images/local/asset-0003.png' },
  { id: 'home', view: 'category-home', icon: Armchair, label: 'Home', count: '450 ITEMS', image: '/images/local/asset-0004.png' },
  { id: 'beauty', view: 'category-beauty', icon: Sparkles, label: 'Beauty', count: '312 ITEMS', image: '/images/local/asset-0005.png' },
  { id: 'sports', view: 'category-sports', icon: Dumbbell, label: 'Sports', count: '210 ITEMS', image: '/images/local/asset-0006.png' },
  { id: 'books', view: 'category-books', icon: BookOpen, label: 'Books', count: '1,029 ITEMS', image: '/images/local/asset-0007.png' },
  { id: 'toys', view: 'category-toys', icon: Gamepad2, label: 'Toys', count: '560 ITEMS', image: '/images/local/asset-0008.png' },
  { id: 'jewelry', view: 'category-jewelry', icon: Diamond, label: 'Jewelry', count: '150 ITEMS', image: '/images/local/asset-0009.png' },
] as const;

type ShopCategory = typeof shopCategoryOptions[number]['id'];
type ShopCategoryFilter = 'all' | ShopCategory;
type ShopSortBy = 'relevance' | 'low-to-high' | 'high-to-low' | 'top-rated' | 'newest' | 'most-popular';
type ShopMaxPrice = 'all' | '5000' | '10000' | '20000';
type ShopMinRating = 0 | 4 | 5;

const IMAGE_FALLBACK_URL = '/images/local/asset-0010.png';
const SHOP_PAGE_SIZE = 9;

const AdminLayout = lazy(() => import('./views/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./views/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./views/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./views/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./views/admin/AdminCustomers'));
const AdminCustomerProfile = lazy(() => import('./views/admin/AdminCustomerProfile'));
const AdminCoupons = lazy(() => import('./views/admin/AdminCoupons'));

type SearchContextValue = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const SearchContext = React.createContext<SearchContextValue>({
  searchTerm: '',
  setSearchTerm: () => {}
});

const toNumericPrice = (value: string) => Number(value.replace(/[$,]/g, ''));

const getShopCategoryLabel = (category: ShopCategoryFilter) => {
  if (category === 'all') return 'All Categories';
  return shopCategoryOptions.find((item) => item.id === category)?.label || 'All Categories';
};

const getShopPriceLabel = (maxPrice: ShopMaxPrice) => {
  if (maxPrice === '5000') return 'Under $5K';
  if (maxPrice === '10000') return 'Under $10K';
  if (maxPrice === '20000') return 'Under $20K';
  return 'All Prices';
};

const getShopSortLabel = (sortBy: ShopSortBy) => {
  if (sortBy === 'low-to-high') return 'Price: Low to High';
  if (sortBy === 'high-to-low') return 'Price: High to Low';
  if (sortBy === 'top-rated') return 'Top Rated';
  if (sortBy === 'newest') return 'Newest';
  if (sortBy === 'most-popular') return 'Most Popular';
  return 'Relevance';
};

const renderHighlightedText = (text: string, query: string) => {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'ig');
  const parts = text.split(regex);
  const lower = query.toLowerCase();
  return parts.map((part, index) =>
    part.toLowerCase() === lower
      ? <mark key={`${part}-${index}`} className="bg-primary/20 text-primary px-0.5 rounded">{part}</mark>
      : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  );
};

/* FIX: back navigation */
const BackButton = ({ onBack }: { onBack: () => void }) => {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
      title="Go back"
      aria-label="Go back"
    >
      <ArrowLeft size={18} />
      <span className="text-[10px] uppercase tracking-widest font-bold">Back</span>
    </button>
  );
};

const getShopCategoryForBrand = (brand?: string): ShopCategoryFilter => {
  const brandName = (brand || '').toLowerCase();
  if (/vacheron|audemars|patek|richard|omega|cartier|chronos|aurelian|techne|aurel/.test(brandName)) return 'timepieces';
  if (/chopard|graff|piaget|tiffany|bvlgari|harry winston|van cleef/.test(brandName)) return 'jewelry';
  if (/hermès|hermes|louis vuitton|bottega|prada|fendi|dior|gucci|mara|celine/.test(brandName)) return 'leather';
  if (/saint laurent|chanel|savile|valeria/.test(brandName)) return 'fashion';
  if (/baccarat|medusa|heritage design|restoration hardware/.test(brandName)) return 'home';
  if (/creed|heeley|penhaligons|acqua di parma|essence/.test(brandName)) return 'beauty';
  if (/callaway|wilson|bauer|specialized/.test(brandName)) return 'sports';
  if (/first edition|antiquarian|vintage press|collector editions/.test(brandName)) return 'books';
  if (/steiff|lego|scalextric|hot wheels/.test(brandName)) return 'toys';
  return 'all';
};

const TopNavBar = ({ 
  view, 
  setView, 
  onBack,
  onOpenMobileMenu,
  cartCount, 
  showProfileDropdown, 
  setShowProfileDropdown,
  onLogout 
}: { 
  view: View, 
  setView: (v: View) => void, 
  onBack?: () => void,
  onOpenMobileMenu?: () => void,
  cartCount: number,
  showProfileDropdown: boolean,
  setShowProfileDropdown: (b: boolean) => void,
  onLogout?: () => void
}) => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const showBackButton = !['home', 'login', 'register', 'forgot-password', 'verify-otp', 'reset-password', 'checkout-address', 'checkout-payment', 'checkout-review', 'checkout-success', 'product-detail'].includes(view);
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 md:px-12 py-4">
      <div className="max-w-480 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* FIX: back navigation */}
          {showBackButton && (
            <BackButton
              onBack={() => {
                if (onBack) {
                  onBack();
                  return;
                }
                if (window.history.length > 1) {
                  window.history.back();
                  return;
                }
                setView('home');
              }}
            />
          )}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(230,195,100,0.3)] group-hover:scale-110 transition-transform">
              <BrandMark className="w-full h-full rounded-xl" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tighter text-on-surface hidden md:block">The Obsidian Curator</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-surface-container-highest/30 rounded-full px-4 py-2 border border-outline-variant/10 focus-within:border-primary/30 transition-all">
            <Search size={14} className="text-on-surface-variant/40" />
            <input 
              type="text" 
              placeholder="Search collections..." 
              className="bg-transparent border-none outline-none text-xs px-3 w-40 focus:w-60 transition-all text-on-surface"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setView('shop');
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            {/* FIX: mobile navigation (side menu trigger) */}
            {onOpenMobileMenu && (
              <button
                type="button"
                aria-label="Open menu"
                onClick={onOpenMobileMenu}
                className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <button 
              onClick={() => setView('cart')}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-on-primary text-[8px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`p-2 rounded-full transition-all ${
                  showProfileDropdown ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <User size={20} />
              </button>
              
              <AnimatePresence>
                {showProfileDropdown && (
                  <ProfileDropdown 
                    setView={(v) => {
                      setView(v);
                      setShowProfileDropdown(false);
                    }} 
                    onClose={() => setShowProfileDropdown(false)}
                    onLogout={onLogout}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const CategoryBar = ({ 
  view, 
  setView,
  activeCategory = 'all',
  onCategorySelect
}: { 
  view: View, 
  setView: (v: View) => void,
  activeCategory?: ShopCategoryFilter,
  onCategorySelect?: (category: ShopCategory) => void
}) => {
  return (
    <div className="hidden lg:block w-full bg-background border-b border-outline-variant/10 sticky top-20 z-40">
      <div className="max-w-480 mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4">
          {shopCategoryOptions.map((cat) => {
            const isActive = activeCategory === cat.id || view === cat.view;

            return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect ? onCategorySelect(cat.id) : setView(cat.view as View)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-surface-container-highest/20 border border-outline-variant/10'
              }`}
            >
              {/* FIX: home category strip uses icon-only cards */}
              {view !== 'home' && (
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-14 h-10 rounded object-cover border border-outline-variant/20"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                />
              )}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-surface-container-highest text-on-surface-variant group-hover:text-primary'
              }`}>
                <cat.icon size={24} />
              </div>
              <div className="text-center">
                <p className={`font-headline text-sm font-semibold ${
                  isActive ? 'text-on-surface' : 'text-on-surface-variant'
                }`}>
                  {cat.label}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mt-1">
                  {cat.count}
                </p>
              </div>
            </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProfileViewLayout = ({ 
  view, 
  setView, 
  cartItems, 
  showProfileDropdown, 
  setShowProfileDropdown,
  title,
  description,
  children,
  onLogout
}: {
  view: View,
  setView: (v: View) => void,
  cartItems: any[],
  showProfileDropdown: boolean,
  setShowProfileDropdown: (b: boolean) => void,
  title: string,
  description: string,
  children: React.ReactNode,
  onLogout?: () => void
}) => {
  return (
    <motion.div
      key={view}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-background"
    >
      <TopNavBar 
        view={view} 
        setView={setView} 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        onLogout={onLogout}
      />

      <div className="flex max-w-480 mx-auto min-h-screen w-full">
        <ProfileSidebar currentView={view} setView={setView} onLogout={onLogout} />
        <section className="flex-1 p-8 md:p-16 lg:p-20 overflow-y-auto">
          <header className="mb-16">
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter mb-4">{title}</h1>
            <p className="text-on-surface-variant max-w-xl font-light leading-relaxed">{description}</p>
          </header>
          {children}
        </section>
      </div>
    </motion.div>
  );
};

const ProfileSidebar = ({ currentView, setView, onLogout }: { currentView: View, setView: (v: View) => void, onLogout?: () => void }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'profile-addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile-payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile-notifications', label: 'Notifications', icon: Bell },
    { id: 'profile-security', label: 'Security', icon: Shield },
    { id: 'profile-help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:flex flex-col p-6 gap-8 w-80 bg-background border-r border-outline-variant/10 pt-24 sticky top-0 h-screen overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-primary font-black font-headline text-sm uppercase tracking-widest">Personal Vault</h2>
        <p className="text-on-surface-variant/40 text-[10px] uppercase tracking-widest mt-1">Refine your selection</p>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <a 
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg font-headline text-sm uppercase tracking-widest hover:translate-x-1 transition-transform duration-200 cursor-pointer ${
              currentView === item.id ? 'text-primary bg-surface-container-highest/30' : 'text-on-surface-variant/40 hover:text-on-surface'
            }`}
          >
            <item.icon size={18} fill={currentView === item.id ? "currentColor" : "none"} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t border-outline-variant/5 space-y-2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onLogout?.();
          }}
          className="flex w-full items-center gap-4 px-4 py-3 text-error hover:bg-error/5 rounded-lg font-headline text-sm uppercase tracking-widest hover:translate-x-1 transition-transform duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
        <button className="flex w-full items-center gap-4 px-4 py-3 text-on-surface-variant/40 hover:text-on-surface font-headline text-sm uppercase tracking-widest hover:translate-x-1 transition-transform duration-200">
          <RotateCcw size={18} />
          <span>Clear All</span>
        </button>
      </div>
    </aside>
  );
};

const Footer = ({ onNavigate }: { onNavigate?: (view: View) => void }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterStatus('Please enter a valid email address.');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const normalizedEmail = newsletterEmail.trim().toLowerCase();
    const result = await subscribeToNewsletter(normalizedEmail);
    setNewsletterStatus(result.message);
    if (result.ok) {
      setNewsletterEmail('');
    }
    setIsSubmitting(false);
  };

  return (
    <footer className="w-full mt-20 bg-surface-container-lowest border-t border-outline-variant/5 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="text-lg font-bold text-primary mb-4 font-headline tracking-tight">The Obsidian Curator</div>
          <p className="text-on-surface-variant/40 font-headline text-xs leading-relaxed max-w-xs">An exclusive sanctuary for the world's most distinguished collectors and curators of fine luxury goods.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Concierge</h4>
          <button type="button" onClick={() => onNavigate?.('private-suite')} className="text-left text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Private Suite</button>
          <button type="button" onClick={() => onNavigate?.('shipping-etiquette')} className="text-left text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Shipping Etiquette</button>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Legal</h4>
          <button type="button" onClick={() => onNavigate?.('terms-of-service')} className="text-left text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Terms of Service</button>
          <button type="button" onClick={() => onNavigate?.('authenticity-guarantee')} className="text-left text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Authenticity Guarantee</button>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">The Newsletter</h4>
          <form className="relative" onSubmit={submitNewsletter}>
            <input
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary transition-colors py-2 text-xs text-on-surface outline-none"
              placeholder="Email Address"
              type="email"
              value={newsletterEmail}
              disabled={isSubmitting}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" disabled={isSubmitting} className="absolute right-0 bottom-2 text-primary disabled:opacity-60">
              <ArrowRight size={16} />
            </button>
          </form>
          {newsletterStatus && <p className="text-[10px] text-primary/80">{newsletterStatus}</p>}
          {isSubmitting && <p className="text-[10px] text-primary/70">Submitting...</p>}
          <p className="text-[10px] text-on-surface-variant/50">© 2024 The Obsidian Curator. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const InfoPageLayout = ({
  view,
  setView,
  cartItems,
  showProfileDropdown,
  setShowProfileDropdown,
  onLogout,
  content
}: {
  view: View;
  setView: (v: View) => void;
  cartItems: any[];
  showProfileDropdown: boolean;
  setShowProfileDropdown: (b: boolean) => void;
  onLogout?: () => void;
  content: InfoPageCopy;
}) => {
  return (
    <motion.div
      key={view}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-background"
    >
      <TopNavBar
        view={view}
        setView={setView}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        onLogout={onLogout}
      />

      <main className="grow max-w-7xl mx-auto w-full px-6 md:px-12 py-16 md:py-24">
        <button
          type="button"
          onClick={() => {
            if (window.location.pathname !== '/') {
              window.history.pushState({}, '', '/');
            }
            setView('home');
          }}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary mb-10"
        >
          <ArrowLeft size={14} />
          Back To Home
        </button>

        <header className="mb-12 md:mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-4 font-bold">{content.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-on-surface mb-6">{content.title}</h1>
          <p className="text-on-surface-variant max-w-3xl leading-relaxed text-base md:text-lg">{content.summary}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {content.sections.map((section) => (
            <article key={section.heading} className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 md:p-8">
              <h2 className="text-primary text-xs uppercase tracking-widest font-bold mb-4">{section.heading}</h2>
              <p className="text-on-surface-variant leading-relaxed text-sm">{section.body}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="border-t border-outline-variant/10 py-10 px-6 md:px-12 text-on-surface-variant/40 text-xs uppercase tracking-widest">
        © 2026 The Obsidian Curator. Placeholder informational copy for staging.
      </footer>
    </motion.div>
  );
};

const timepieceProducts = [
  { id: 1, brand: 'Vacheron Heritage', name: 'Patrimony Moon Phase', price: '$38,500', img: '/images/local/asset-0011.png' },
  { id: 2, brand: 'Audemars Piguet', name: 'Royal Oak Offshore', price: '$54,200', img: '/images/local/asset-0012.jpg' },
  { id: 3, brand: 'Patek Philippe', name: 'Nautilus Skeleton', price: '$120,000', img: '/images/local/asset-0013.jpg' },
  { id: 4, brand: 'Richard Mille', name: 'RM 011 Felipe Massa', price: '$185,000', img: '/images/local/asset-0014.png' },
  { id: 5, brand: 'Cartier', name: 'Tank Louis Cartier', price: '$14,800', img: '/images/local/asset-0015.png' },
  { id: 6, brand: 'Omega', name: 'Speedmaster Moonphase', price: '$12,400', img: '/images/local/asset-0016.png' }
];

const jewelryProducts = [
  { id: 7, brand: 'Cartier', name: 'Love Bracelet Diamond-Paved', price: '$42,100', img: '/images/local/asset-0012.jpg' },
  { id: 8, brand: 'Tiffany & Co.', name: 'HardWear Graduated Link', price: '$18,500', img: '/images/local/asset-0017.png' },
  { id: 11, brand: 'Van Cleef & Arpels', name: 'Alhambra Necklace Gold', price: '$28,500', img: '/images/local/asset-0012.jpg' },
  { id: 12, brand: 'Bvlgari', name: 'Serpenti Viper Ring', price: '$15,800', img: '/images/local/asset-0018.png' },
  { id: 13, brand: 'Chopard', name: 'Happy Diamonds Moving', price: '$22,900', img: '/images/local/asset-0017.png' },
  { id: 14, brand: 'Graff Diamonds', name: 'Infinity Diamond Earrings', price: '$65,000', img: '/images/local/asset-0012.jpg' },
  { id: 15, brand: 'Piaget', name: 'Possession Bracelet', price: '$34,500', img: '/images/local/asset-0017.png' },
  { id: 16, brand: 'Harry Winston', name: 'Emerald Cluster Pendant', price: '$78,500', img: '/images/local/asset-0018.png' }
];

const leatherProducts = [
  { id: 9, brand: 'Hermès', name: 'Birkin 35 Togo', price: '$24,500', img: '/images/local/asset-0019.jpg' },
  { id: 10, brand: 'Louis Vuitton', name: 'Keepall Bandoulière 50', price: '$3,200', img: '/images/local/asset-0020.jpg' },
  { id: 17, brand: 'Bottega Veneta', name: 'Intrecciato Woven Tote', price: '$5,900', img: '/images/local/asset-0021.png' },
  { id: 18, brand: 'Prada', name: 'Saffiano Leather Briefcase', price: '$4,200', img: '/images/local/asset-0019.jpg' },
  { id: 19, brand: 'Gucci', name: 'Marmont Leather Shoulder Bag', price: '$2,650', img: '/images/local/asset-0020.jpg' },
  { id: 20, brand: 'Celine', name: 'Classic Box Leather Bag', price: '$3,850', img: '/images/local/asset-0021.png' },
  { id: 21, brand: 'Fendi', name: 'Baguette Leather Crossbody', price: '$2,200', img: '/images/local/asset-0019.jpg' },
  { id: 22, brand: 'Dior', name: 'Book Tote Embroidered Bag', price: '$3,600', img: '/images/local/asset-0020.jpg' }
];

const fashionProducts = [
  { id: 23, brand: 'Gucci', name: 'Silk Double Breasted Blazer', price: '$4,200', img: '/images/local/asset-0022.jpg' },
  { id: 24, brand: 'Saint Laurent', name: 'Le Smoking Tuxedo', price: '$5,800', img: '/images/local/asset-0023.png' },
  { id: 25, brand: 'Hermès', name: 'Trench Coat Cashmere', price: '$6,500', img: '/images/local/asset-0024.png' },
  { id: 26, brand: 'Chanel', name: 'Tweed Jacket', price: '$7,200', img: '/images/local/asset-0022.jpg' },
];

const homeProducts = [
  { id: 27, brand: 'Baccarat', name: 'Empire Chandelier Gold', price: '$8,500', img: '/images/local/asset-0025.png' },
  { id: 28, brand: 'Medusa Art', name: 'Marble Sculpture', price: '$12,000', img: '/images/local/asset-0026.png' },
  { id: 29, brand: 'Heritage Design', name: 'Persian Rug 4x6', price: '$18,900', img: '/images/local/asset-0026.png' },
  { id: 30, brand: 'Restoration Hardware', name: 'Victorian Settee', price: '$9,800', img: '/images/local/asset-0027.jpg' },
];

const beautyProducts = [
  { id: 31, brand: 'Creed', name: 'Royal Oud Parfum', price: '$620', img: '/images/local/asset-0028.png' },
  { id: 32, brand: 'Heeley', name: 'Rose Helena Perfume', price: '$480', img: '/images/local/asset-0029.png' },
  { id: 33, brand: 'Penhaligons', name: 'Heritage Collection Set', price: '$850', img: '/images/local/asset-0028.png' },
  { id: 34, brand: 'Acqua di Parma', name: 'Blu Mediterraneo', price: '$220', img: '/images/local/asset-0029.png' },
];

const sportsProducts = [
  { id: 35, brand: 'Callaway', name: 'Golf Club Set Carbon', price: '$2,850', img: '/images/local/asset-0030.png' },
  { id: 36, brand: 'Wilson', name: 'Pro Tennis Racket', price: '$680', img: '/images/local/asset-0031.png' },
  { id: 37, brand: 'Bauer', name: 'Ice Hockey Equipment', price: '$1,200', img: '/images/local/asset-0030.png' },
  { id: 38, brand: 'Specialized', name: 'Carbon Mountain Bike', price: '$4,500', img: '/images/local/asset-0032.jpg' },
];

const booksProducts = [
  { id: 39, brand: 'First Edition', name: 'Signed Hemingway Collection', price: '$4,200', img: '/images/local/asset-0033.jpg' },
  { id: 40, brand: 'Antiquarian', name: 'Leather Bound Shakespeare', price: '$3,100', img: '/images/local/asset-0034.png' },
  { id: 41, brand: 'Vintage Press', name: 'Limited Edition Art Book', price: '$1,850', img: '/images/local/asset-0033.jpg' },
  { id: 42, brand: 'Collector Editions', name: 'Signed Philosophy Set', price: '$2,600', img: '/images/local/asset-0034.png' },
];

const toysProducts = [
  { id: 43, brand: 'Steiff', name: 'Limited Edition Teddy Bear', price: '$1,200', img: '/images/local/asset-0035.png' },
  { id: 44, brand: 'Lego', name: 'Platinum Set Collectible', price: '$890', img: '/images/local/asset-0036.png' },
  { id: 45, brand: 'Scalextric', name: 'Vintage Track Set', price: '$1,450', img: '/images/local/asset-0036.png' },
  { id: 46, brand: 'Hot Wheels', name: 'Rare 1968 Custom', price: '$2,800', img: '/images/local/asset-0036.png' },
];

const CategoryLayout = ({ 
  view, 
  setView, 
  cartItems, 
  showProfileDropdown, 
  setShowProfileDropdown,
  onLogout,
  onOpenMobileMenu,
  activeCategory = 'all',
  onCategorySelect,
  onProductSelect,
  title,
  subtitle,
  heroImg,
  products,
  setCartItems
}: {
  view: View,
  setView: (v: View) => void,
  cartItems: any[],
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>,
  showProfileDropdown: boolean,
  setShowProfileDropdown: (b: boolean) => void,
  onOpenMobileMenu?: () => void,
  activeCategory?: ShopCategoryFilter,
  onCategorySelect?: (category: ShopCategory) => void,
  onProductSelect?: (product: any) => void,
  title: string,
  subtitle: string,
  heroImg: string,
  onLogout?: () => void,
  products: any[]
}) => {
  const { searchTerm } = useContext(SearchContext);
  const [sortBy, setSortBy] = useState<'newest' | 'high-to-low' | 'low-to-high'>('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState<'all' | '5000' | '20000'>('all');

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const maxPrice = maxPriceFilter === 'all' ? Number.POSITIVE_INFINITY : Number(maxPriceFilter);
      return matchesSearch && toNumericPrice(product.price) <= maxPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'high-to-low') return toNumericPrice(b.price) - toNumericPrice(a.price);
      if (sortBy === 'low-to-high') return toNumericPrice(a.price) - toNumericPrice(b.price);
      return b.id - a.id;
    });

  const handleProductSelect = (product: any) => {
    const productWithCategory = activeCategory === 'all' ? product : { ...product, category: activeCategory };
    if (onProductSelect) {
      onProductSelect(productWithCategory);
    } else {
      setView('product-detail');
    }
  };

  return (
    <motion.div
      key={view}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-background text-on-surface font-body"
    >
      <TopNavBar 
        view={view} 
        setView={setView} 
        onOpenMobileMenu={onOpenMobileMenu}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        onLogout={onLogout}
      />

      <CategoryBar 
        view={view} 
        setView={setView} 
        activeCategory={activeCategory}
        onCategorySelect={onCategorySelect}
      />

      <main className="flex flex-col">
        {/* FIX: hero mobile responsiveness */}
        <section className="relative h-svh md:h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src={heroImg} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-50"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 text-center space-y-6 px-6">
            <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold">{subtitle}</span>
            <h1 className="font-headline font-bold text-on-surface tracking-tighter text-[clamp(1.5rem,5vw,3.5rem)] md:text-8xl">{title}</h1>
          </div>
        </section>

        <div className="max-w-480 mx-auto w-full px-6 md:px-12 py-20">
          <div className="mb-8">
            <BackButton onBack={() => setView('shop')} />
          </div>
          {/* Breadcrumbs & Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary mb-4 font-body">
              <span className="cursor-pointer hover:underline" onClick={() => setView('home')}>Maison</span>
              <ChevronRight size={12} />
              <span className="text-on-surface-variant/40">Collections</span>
              <ChevronRight size={12} />
              <span className="text-on-surface">{title}</span>
            </nav>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">
                <span>Sort By:</span>
                <select
                  className="bg-transparent border-none outline-none text-primary cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'high-to-low' | 'low-to-high')}
                >
                  <option value="newest">Newest First</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="low-to-high">Price: Low to High</option>
                </select>
              </div>
              <select
                className="px-6 py-3 bg-surface-container-highest/30 border border-outline-variant/10 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-primary/10 transition-colors outline-none"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(e.target.value as 'all' | '5000' | '20000')}
              >
                <option value="all">All Prices</option>
                <option value="5000">Under $5,000</option>
                <option value="20000">Under $20,000</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest/30 border border-outline-variant/10 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-primary/10 transition-colors">
                <Filter size={14} />
                {filteredProducts.length} Results
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group flex flex-col gap-6">
                <div className="aspect-3/4 overflow-hidden bg-surface-container-lowest relative rounded-sm">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      className="w-12 h-12 rounded-full bg-on-surface text-background flex items-center justify-center hover:bg-primary transition-colors"
                      onClick={() => {
                        const newItem = {
                          id: Date.now(),
                          productId: product.id,
                          name: product.name,
                          price: parseInt(product.price.replace(/[^0-9]/g, '')),
                          quantity: 1,
                          img: product.img,
                          variant: 'Default Selection',
                          outOfStock: false
                        };
                        setCartItems(prev => [...prev, newItem]);
                        // Optional: Show a quick notification or just switch to cart
                        setView('cart');
                        window.scrollTo(0, 0);
                      }}
                    >
                      <ShoppingBag size={18} />
                    </button>
                    <button 
                      className="px-6 py-3 bg-background/80 backdrop-blur text-[10px] uppercase tracking-widest font-bold text-on-surface hover:bg-on-surface hover:text-background transition-all"
                      onClick={() => handleProductSelect(product)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mb-1">{product.brand}</p>
                    <h3 
                      className="text-xl font-headline text-on-surface group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-lg font-mono text-primary">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer onNavigate={setView} />
    </motion.div>
  );
};

const ProfileDropdown = ({ setView, onClose, onLogout }: { setView: (v: View) => void, onClose: () => void, onLogout?: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-4 w-64 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl z-100 overflow-hidden"
    >
      <div className="p-4 border-b border-outline-variant/10 bg-surface-container-highest/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-headline font-bold text-on-surface">Client Profile</p>
            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">Elite Collector</p>
          </div>
        </div>
      </div>
      <div className="p-2">
        <button 
          onClick={() => { setView('profile'); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
        >
          <User size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-headline tracking-tight">Personal Vault</span>
        </button>
        <button 
          onClick={() => { setView('my-orders'); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
        >
          <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-headline tracking-tight">My Acquisitions</span>
        </button>
        <button 
          onClick={() => { setView('wishlist'); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all group"
        >
          <Heart size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-headline tracking-tight">Wishlist</span>
        </button>
        <div className="my-2 border-t border-outline-variant/10"></div>
        <button 
          onClick={() => { onLogout?.(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/5 rounded-lg transition-all group"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-headline tracking-tight">Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('login');
  const isPopNavigationRef = useRef(false);

  React.useEffect(() => {
    (window as any).__setView = setView;
    const handlePath = () => {
      let path = window.location.pathname.replace('/', '');
      if ([
        'admin-dashboard',
        'admin-products',
        'admin-orders',
        'admin-customers',
        'admin-customer-profile',
        'admin-coupons',
        'private-suite',
        'authenticity-guarantee',
        'boutique-locations',
        'client-care',
        'shipping-etiquette',
        'terms-of-service',
        'curator-concierge'
      ].includes(path)) {
        setView(path as any);
      } else if (path === '') {
        // Default
      }
    };
    window.addEventListener('popstate', handlePath);
    handlePath();
    return () => window.removeEventListener('popstate', handlePath);
  }, []);

  const resolveViewFromPath = (pathName: string): View => {
    const normalized = pathName.replace(/^\//, '');
    const allViews: View[] = [
      'login', 'register', 'forgot-password', 'home', 'shop', 'product-detail', 'cart', 'checkout-address',
      'checkout-payment', 'checkout-review', 'checkout-success', 'order-tracking', 'order-detail', 'my-orders', 'profile',
      'wishlist', 'category-timepieces', 'category-jewelry', 'category-leather', 'category-fashion',
      'category-home', 'category-beauty', 'category-sports', 'category-books', 'category-toys',
      'profile-addresses', 'profile-payments', 'profile-notifications', 'profile-security', 'profile-help',
      'admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers', 'admin-customer-profile', 'admin-coupons'
    ];

    if (!normalized) return 'login';
    return allViews.includes(normalized as View) ? (normalized as View) : 'login';
  };

  const viewToPath = (nextView: View) => (nextView === 'login' ? '/' : `/${nextView}`);


  

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isShopLoading, setIsShopLoading] = useState(false);
  const [shopPage, setShopPage] = useState(1);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Obsidian Chronograph MK II',
      price: 14500,
      variant: 'Midnight Gold / Sapphire Glass',
      quantity: 1,
      img: '/images/local/asset-0037.png',
      outOfStock: false
    },
    {
      id: 2,
      name: 'The Archon Lounge Chair',
      price: 3200,
      variant: 'Hand-Carved Ebony / Gold Leaf',
      quantity: 0,
      img: '/images/local/asset-0038.png',
      outOfStock: true
    },
    {
      id: 3,
      name: 'Essence of Void (Limited Edition)',
      price: 850,
      variant: '100ml Parfum / Collector Case',
      quantity: 2,
      img: '/images/local/asset-0039.png',
      outOfStock: false
    }
  ]);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 101,
      name: 'Noir Architect Bag',
      price: 4250,
      sku: 'OBS-7721',
      img: '/images/local/asset-0040.png'
    },
    {
      id: 102,
      name: 'Ethereal Chrono',
      price: 12800,
      sku: 'OBS-1099',
      img: '/images/local/asset-0041.png'
    },
    {
      id: 103,
      name: 'Imperial Silk Drape',
      price: 890,
      sku: 'OBS-0045',
      img: '/images/local/asset-0042.png'
    },
    {
      id: 104,
      name: 'Aurelian Stilettos',
      price: 1100,
      sku: 'OBS-3382',
      img: '/images/local/asset-0043.png'
    }
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({ cardHolderName: '', cardNumber: '', expiryDate: '', cvv: '', isDefault: false });
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('Weak');
  const [selectedProductColor, setSelectedProductColor] = useState('Obsidian Black');
  const [selectedProductSize, setSelectedProductSize] = useState('40MM');
  const [productQuantity, setProductQuantity] = useState(1);
  const [activeProductTab, setActiveProductTab] = useState('Detailed Narrative');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [shopSortBy, setShopSortBy] = useState<ShopSortBy>('relevance');
  const [shopMaxPrice, setShopMaxPrice] = useState<ShopMaxPrice>('all');
  const [shopMinRating, setShopMinRating] = useState<ShopMinRating>(0);
  const [selectedShopCategory, setSelectedShopCategory] = useState<ShopCategoryFilter>('all');
  const [selectedShopCategories, setSelectedShopCategories] = useState<ShopCategory[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [otpError, setOtpError] = useState('');
  const [authError, setAuthError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({ fullName: '', phone: '', pincode: '', addressType: 'HOME', street: '', city: '', state: '' });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState('');
  const [profileFormData, setProfileFormData] = useState({
    name: '', email: '', phone: '', dob: '', gender: 'Prefer not to state',
    twoFactorEnabled: false, avatarUrl: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [securityFormData, setSecurityFormData] = useState({ currentPassword: '', newPassword: '' });
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [notifications, setNotifications] = useState({
    orderUpdates: true, newCollections: true, securityAlerts: true, newsletter: true
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const fetchAddresses = async () => {
    try {
      const data = await addressApi.getAll();
      setAddresses(data);
      if (data.length > 0 && !data.some((addr: any) => addr.id === selectedAddress)) {
        const defaultAddress = data.find((addr: any) => addr.isDefault);
        setSelectedAddress((defaultAddress || data[0]).id);
      } else if (data.length === 0) {
        setSelectedAddress('');
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      fetchAddresses();
      fetchProfileData();
    }
  }, []);

  /* FIX: search debounce */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordStrengthLabel('Very Weak');
      return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    
    setPasswordStrength(score);
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    setPasswordStrengthLabel(labels[score]);
  }, [password]);

  /* FIX: category image fallback */
  useEffect(() => {
    const handleImageError = (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (!target || target.tagName !== 'IMG') return;
      if (target.src === IMAGE_FALLBACK_URL) return;
      target.src = IMAGE_FALLBACK_URL;
    };

    document.addEventListener('error', handleImageError, true);
    return () => document.removeEventListener('error', handleImageError, true);
  }, []);

  /* FIX: history + URL state */
  useEffect(() => {
    (window as any).__setView = setView;

    const applyUrlState = () => {
      const nextView = resolveViewFromPath(window.location.pathname);
      const hasToken = typeof localStorage !== 'undefined' && !!localStorage.getItem('accessToken');
      const publicViews: View[] = ['login', 'register', 'forgot-password'];
      const resolvedView = !hasToken && !publicViews.includes(nextView) ? 'login' : nextView;

      setView(resolvedView);

      if (resolvedView !== nextView) {
        window.history.replaceState({ view: resolvedView }, '', viewToPath(resolvedView));
      }

      if (resolvedView !== 'shop') return;

      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      const categoriesParam = params.get('categories');
      const brandParam = params.get('brands');
      const minParam = Number(params.get('min') || 0);
      const maxParam = Number(params.get('max') || 20000);
      const ratingParam = Number(params.get('rating') || 0);
      const inStockParam = params.get('inStock') === '1';
      const sortParam = params.get('sort') as ShopSortBy | null;

      setSearchTerm(q);
      setDebouncedSearchTerm(q.toLowerCase());

      const parsedCategories = categoriesParam
        ? categoriesParam.split(',').filter((item): item is ShopCategory => shopCategoryOptions.some((cat) => cat.id === item))
        : [];
      setSelectedShopCategories(parsedCategories);
      setSelectedShopCategory(parsedCategories[0] || 'all');

      setSelectedBrands(brandParam ? brandParam.split(',').filter(Boolean) : []);
      setPriceRange({ min: Number.isFinite(minParam) ? minParam : 0, max: Number.isFinite(maxParam) ? maxParam : 20000 });
      setShopMinRating(ratingParam >= 5 ? 5 : ratingParam >= 4 ? 4 : 0);
      setInStockOnly(inStockParam);
      if (sortParam && ['relevance', 'low-to-high', 'high-to-low', 'top-rated', 'newest', 'most-popular'].includes(sortParam)) {
        setShopSortBy(sortParam);
      }
    };

    const handlePopState = () => {
      isPopNavigationRef.current = true;
      applyUrlState();
    };

    window.addEventListener('popstate', handlePopState);
    applyUrlState();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isPopNavigationRef.current) {
      isPopNavigationRef.current = false;
      return;
    }
    const nextPath = viewToPath(view);
    window.history.pushState({ view }, '', nextPath + window.location.search);
  }, [view]);

  useEffect(() => {
    if (view !== 'shop') return;

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (selectedShopCategories.length) params.set('categories', selectedShopCategories.join(','));
    if (selectedBrands.length) params.set('brands', selectedBrands.join(','));
    if (priceRange.min > 0) params.set('min', String(priceRange.min));
    if (priceRange.max < 20000) params.set('max', String(priceRange.max));
    if (shopMinRating > 0) params.set('rating', String(shopMinRating));
    if (inStockOnly) params.set('inStock', '1');
    if (shopSortBy !== 'relevance') params.set('sort', shopSortBy);

    const nextUrl = `${viewToPath('shop')}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({ view: 'shop' }, '', nextUrl);
  }, [
    view,
    searchTerm,
    selectedShopCategories,
    selectedBrands,
    priceRange.min,
    priceRange.max,
    shopMinRating,
    inStockOnly,
    shopSortBy
  ]);

  // Forgot Password states
  const [forgotStep, setForgotStep] = useState(1); // 1: Identify, 2: Verify, 3: Restore, 4: Success
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpType, setOtpType] = useState<'REGISTER' | 'FORGOT_PASSWORD'>('REGISTER');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const openProductDetail = (product: any) => {
    setSelectedProduct(product);
    setSelectedImage(0);
    setSelectedProductColor('Obsidian Black');
    setSelectedProductSize('40MM');
    setProductQuantity(1);
    setActiveProductTab('Detailed Narrative');
    setView('product-detail');
    window.scrollTo(0, 0);
  };



  const fetchMyOrders = async (status: string = 'ALL') => {
    setIsLoading(true);
    try {
      const data = await orderApi.myOrders(status === 'ALL' ? undefined : status);
      setMyOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractOrderId = (order: any): string | undefined => order?.orderId || order?.id;

  const syncBackendCartFromLocal = async () => {
    const normalizedLocalItems = cartItems
      .filter((item) => !item.outOfStock && item.quantity > 0)
      .map((item) => ({
        ...item,
        normalizedName: item.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      }));

    if (normalizedLocalItems.length === 0) {
      throw new Error('Cart is empty. Add at least one item before checkout.');
    }

    const productsResponse = await productApi.getAll({ page: 1, limit: 200, available: true, sort: 'relevance' });
    const products = Array.isArray(productsResponse)
      ? productsResponse
      : Array.isArray(productsResponse?.items)
        ? productsResponse.items
        : [];

    if (products.length === 0) {
      throw new Error('No purchasable products available in backend catalog.');
    }

    await cartApi.clear();

    const unresolvedItems: string[] = [];

    for (const localItem of normalizedLocalItems) {
      const matchedProduct = products.find((product: any) => {
        const normalizedProductName = String(product?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedProductName === localItem.normalizedName
          || normalizedProductName.includes(localItem.normalizedName)
          || localItem.normalizedName.includes(normalizedProductName);
      });

      if (!matchedProduct?.id) {
        unresolvedItems.push(localItem.name);
        continue;
      }

      await cartApi.addItem({
        productId: matchedProduct.id,
        quantity: localItem.quantity,
      });
    }

    if (unresolvedItems.length > 0) {
      throw new Error(`Unable to map these cart items to backend products: ${unresolvedItems.join(', ')}`);
    }
  };

  const handleDownloadInvoice = async () => {
    setIsDownloadingInvoice(true);
    setInvoiceError('');
    try {
      let orderId = extractOrderId(selectedOrder);

      if (!orderId) {
        const orders = await orderApi.myOrders();
        if (orders.length > 0) {
          const latestOrder = [...orders].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0];
          setSelectedOrder(latestOrder);
          orderId = extractOrderId(latestOrder);
        }
      }

      if (!orderId) {
        throw new Error('No confirmed order found for invoice download.');
      }

      const pdfBlob = await orderApi.invoice(orderId);
      const objectUrl = window.URL.createObjectURL(pdfBlob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error: any) {
      setInvoiceError(error?.message || 'Unable to download invoice.');
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const handleFinalizeAcquisition = async () => {
    if (!agreeTerms) {
      setCheckoutError('Please accept terms before finalizing your acquisition.');
      return;
    }
    if (!selectedAddress) {
      setCheckoutError('Please select a delivery address.');
      setView('checkout-address');
      return;
    }
    if (paymentMethod === 'wallet' && !selectedPayment) {
      setCheckoutError('Please select a payment instrument before finalizing.');
      setView('checkout-payment');
      return;
    }

    const paymentMethodMap: Record<string, 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' | 'COD'> = {
      card: 'CARD',
      upi: 'UPI',
      netbanking: 'NETBANKING',
      wallet: 'WALLET',
      cod: 'COD',
    };

    setIsLoading(true);
    setCheckoutError('');
    try {
      await syncBackendCartFromLocal();

      const createdOrder = await orderApi.create({
        addressId: selectedAddress,
        paymentMethod: paymentMethodMap[paymentMethod] || 'CARD',
      });

      const orderId = extractOrderId(createdOrder);
      if (orderId) {
        const fullOrder = await orderApi.byId(orderId);
        setSelectedOrder(fullOrder);
      }

      setCartItems([]);
      setView('checkout-success');
      window.scrollTo(0, 0);
    } catch (error: any) {
      setCheckoutError(error?.message || 'Unable to finalize order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'my-orders' || view === 'profile') {
      fetchMyOrders(orderStatusFilter);
    }
    if (view === 'profile-addresses' || view === 'checkout-address') {
      fetchAddresses();
    }
    if (view === 'profile-payments' || view === 'checkout-payment') {
      fetchPaymentMethods();
    }
    if (view === 'profile-notifications') {
      fetchNotifications();
    }
  }, [view, orderStatusFilter]);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const data = await paymentMethodApi.getAll();
      setPaymentMethods(data);
      if (data.length > 0 && !data.some((pm: any) => pm.id === selectedPayment)) {
        const defaultPayment = data.find((pm: any) => pm.isDefault);
        setSelectedPayment((defaultPayment || data[0]).id);
      } else if (data.length === 0) {
        setSelectedPayment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getAll();
      setUserNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openShopCategory = (category: ShopCategoryFilter) => {
    /* FIX: category filter state + sidebar active sync */
    setSelectedShopCategory(category);
    setSelectedShopCategories(category === 'all' ? [] : [category]);
    setView('shop');
    setIsCategoryMenuOpen(false);
    setShopPage(1);
    window.scrollTo(0, 0);
  };

  const openSelectedProductCollection = () => {
    openShopCategory(selectedProduct?.category || getShopCategoryForBrand(selectedProduct?.brand));
  };

  const openInfoPage = (target: InfoView) => {
    const targetPath = `/${target}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setView(target);
    window.scrollTo(0, 0);
  };

  const addToWishlist = (product: any) => {
    if (!wishlistItems.find(item => item.id === product.id)) {
      setWishlistItems([...wishlistItems, product]);
    }
  };



  const clearShopFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedShopCategory('all');
    setSelectedShopCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 20000 });
    setShopMinRating(0);
    setInStockOnly(false);
    setShopPage(1);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      const response = await authApi.login({ email, password, rememberMe });
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        fetchAddresses();
        fetchProfileData();
        setView('home');
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      if (error.message && (error.message.toLowerCase().includes('verify') || error.message.toLowerCase().includes('otp'))) {
        setForgotStep(2);
        setOtpType('REGISTER');
        setView('verify-otp');
      } else {
        setAuthError(error.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setAuthError('');
      try {
        // The tokenResponse from implicit flow has `access_token`
        const response = await authApi.googleLogin(tokenResponse.access_token);
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          fetchAddresses();
          fetchProfileData();
          setView('home');
          window.scrollTo(0, 0);
        }
      } catch (error: any) {
        setAuthError(error.message || 'Google Login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setAuthError('Google authentication failed. Please try again.');
    }
  });

  const handleLogout = async () => {
    try {
      await authApi.login({ email: '', password: '', rememberMe: false }); // dummy if needed, but we mostly just clear local
      localStorage.removeItem('accessToken');
      setCartItems([]);
      setWishlistItems([]);
      setAddresses([]);
      setView('login');
      window.scrollTo(0, 0);
    } catch (err) {
      localStorage.removeItem('accessToken');
      setView('login');
    }
  };


  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    setProfileError('');
    try {
      const data = await authApi.uploadAvatar(file);
      setProfileFormData(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
    } catch (err: any) {
      setProfileError(err.message || 'Avatar upload failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const created = await paymentMethodApi.create(paymentFormData);
      await fetchPaymentMethods();
      if (created?.id) {
        setSelectedPayment(created.id);
      }
      setShowPaymentForm(false);
      setPaymentFormData({ cardHolderName: '', cardNumber: '', expiryDate: '', cvv: '', isDefault: false });
    } catch (err: any) {
      alert(err.message || 'Payment method failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAddressError('');
    try {
      let savedAddress: any;
      if (isEditingAddress && editingAddressId) {
        savedAddress = await addressApi.update(editingAddressId, addressFormData);
      } else {
        savedAddress = await addressApi.create(addressFormData);
      }
      if (savedAddress?.id) {
        setSelectedAddress(savedAddress.id);
      }
      await fetchAddresses();
      setShowAddressForm(false);
      setIsEditingAddress(false);
      setEditingAddressId(null);
      setAddressFormData({ fullName: '', phone: '', pincode: '', addressType: 'HOME', street: '', city: '', state: '' });
    } catch(err: any) {
      console.error(err);
      setAddressError(err.message || 'Failed to save address. Please check all fields.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      setAuthError("You must agree to the terms");
      return;
    }
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await authApi.register({ name, email, phone, password, confirmPassword, agreeTerms });
      setOtpType('REGISTER');
      setForgotStep(2);
      // Auto-fill OTP if returned by backend (dev mode)
      const msg = res?.message || '';
      if (msg.startsWith('OTP_CODE:')) {
        const code = msg.replace('OTP_CODE:', '');
        setOtp(code.split('').slice(0, 6));
      }
      setView('verify-otp');
      window.scrollTo(0, 0);
    } catch (error: any) {
      setAuthError(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await authApi.forgotPassword(email);
      setOtpType('FORGOT_PASSWORD');
      // Auto-fill OTP if returned by backend (dev mode)
      const msg = res?.message || '';
      if (msg.startsWith('OTP_CODE:')) {
        const code = msg.replace('OTP_CODE:', '');
        setOtp(code.split('').slice(0, 6));
      }
      setForgotStep(2);
    } catch (error: any) {
      setAuthError(error.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const data = await authApi.me();
      if (data) {
        setProfileFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: data.dob || '',
          gender: data.gender || 'Prefer not to state',
          twoFactorEnabled: data.twoFactorEnabled ?? false,
          avatarUrl: data.avatarUrl || ''
        });
        setNotifications({
          orderUpdates: data.orderUpdates ?? true,
          newCollections: data.newCollections ?? true,
          securityAlerts: data.securityAlerts ?? true,
          newsletter: data.newsletter ?? true,
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      await authApi.updateMe({
        name: profileFormData.name,
        phone: profileFormData.phone,
        dob: profileFormData.dob,
        gender: profileFormData.gender,
      });
      setProfileSuccess('Personal manifest updated successfully.');
      await fetchProfileData();
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSecurityError('');
    setSecuritySuccess('');
    try {
      await authApi.changePassword({
        currentPassword: securityFormData.currentPassword,
        newPassword: securityFormData.newPassword,
        confirmPassword: securityFormData.newPassword, // simplify for UI
      });
      setSecuritySuccess('Curatorial credentials updated successfully.');
      setSecurityFormData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setSecurityError(err.message || 'Failed to update credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      await authApi.toggle2fa(enabled);
      await fetchProfileData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = async (key: keyof typeof notifications, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    try {
      await authApi.updateMe(updated);
    } catch (err: any) {
      console.error('Failed to sync notification', err);
      // Rollback on failure
      setNotifications(notifications);
    }
  };

  const handleEditAddress = (addr: any) => {
    setAddressFormData({
      fullName: addr.fullName,
      phone: addr.phone,
      pincode: addr.pincode,
      addressType: addr.addressType,
      street: addr.street,
      city: addr.city,
      state: addr.state
    });
    setEditingAddressId(addr.id);
    setIsEditingAddress(true);
    setShowAddressForm(true);
    window.scrollTo(0, 500); // approximate form position
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you certain you wish to remove this shipping residence?')) return;
    setIsLoading(true);
    try {
      await addressApi.delete(id);
      await fetchAddresses();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (!/^\d{6}$/.test(enteredOtp)) {
      setOtpError('Enter a valid 6-digit code to continue.');
      return;
    }

    setOtpError('');
    setIsLoading(true);
    try {
      if (otpType === 'FORGOT_PASSWORD') {
        const response = await authApi.verifyForgotOtp(email, enteredOtp);
        setResetToken(response.resetToken);
        setForgotStep(3);
      } else {
        const response = await authApi.verifyOtp({ email, otp: enteredOtp, type: 'REGISTER' });
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          await fetchAddresses();
          await fetchProfileData();
          setView('home');
        }
      }
    } catch (error: any) {
      setOtpError(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setAuthError('');
    try {
      await authApi.resetPassword({ resetToken, newPassword: password, confirmPassword });
      setForgotStep(4);
    } catch (error: any) {
      setAuthError(error.message || 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1 || (value && !/^[0-9]$/.test(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterMessage('Please enter your email address.');
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail);
    if (!isValidEmail) {
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }

    if (isSubmittingNewsletter) {
      return;
    }

    setIsSubmittingNewsletter(true);
    const normalizedEmail = newsletterEmail.trim().toLowerCase();
    const result = await subscribeToNewsletter(normalizedEmail);
    setNewsletterMessage(result.message);
    if (result.ok) {
      setNewsletterEmail('');
    }
    setIsSubmittingNewsletter(false);
  };

  const withShopMeta = (products: any[], category: ShopCategory, ratingBase: number) =>
    products.map((product, index) => ({
      ...product,
      category,
      description: `${product.brand} ${product.name} crafted for modern collectors.`,
      inStock: index % 5 !== 0,
      popularity: 100 - index,
      createdAt: Date.now() - index * 86400000,
      rating: Math.min(5, Number((ratingBase + (index % 4) * 0.1).toFixed(1))),
      reviews: 24 + index * 11
    }));

  const shopProducts = [
    ...withShopMeta(timepieceProducts, 'timepieces', 4.6),
    ...withShopMeta(jewelryProducts, 'jewelry', 4.7),
    ...withShopMeta(leatherProducts, 'leather', 4.5),
    ...withShopMeta(fashionProducts, 'fashion', 4.6),
    ...withShopMeta(homeProducts, 'home', 4.4),
    ...withShopMeta(beautyProducts, 'beauty', 4.7),
    ...withShopMeta(sportsProducts, 'sports', 4.3),
    ...withShopMeta(booksProducts, 'books', 4.8),
    ...withShopMeta(toysProducts, 'toys', 4.5)
  ];

  const availableBrands = useMemo(() => Array.from(new Set(shopProducts.map((item) => item.brand))).sort(), [shopProducts]);

  const activeFilterCount = [
    selectedShopCategories.length > 0,
    selectedBrands.length > 0,
    priceRange.min > 0 || priceRange.max < 20000,
    shopMinRating > 0,
    inStockOnly,
    shopSortBy !== 'relevance',
    !!debouncedSearchTerm
  ].filter(Boolean).length;

  const filteredShopProducts = useMemo(() => {
    return shopProducts
      .filter((product) => {
        const activeCategories = selectedShopCategories.length ? selectedShopCategories : (selectedShopCategory === 'all' ? [] : [selectedShopCategory]);
        const matchesCategory = !activeCategories.length || activeCategories.includes(product.category);
        const matchesSearch = !debouncedSearchTerm ||
          product.name.toLowerCase().includes(debouncedSearchTerm) ||
          product.brand.toLowerCase().includes(debouncedSearchTerm) ||
          product.category.toLowerCase().includes(debouncedSearchTerm) ||
          (product.description || '').toLowerCase().includes(debouncedSearchTerm);
        const numericPrice = toNumericPrice(product.price);
        const softMaxPrice = shopMaxPrice === 'all' ? Number.POSITIVE_INFINITY : Number(shopMaxPrice);
        const matchesPrice = numericPrice >= priceRange.min && numericPrice <= Math.min(priceRange.max, softMaxPrice);
        const matchesRating = product.rating >= shopMinRating;
        const matchesBrand = !selectedBrands.length || selectedBrands.includes(product.brand);
        const matchesStock = !inStockOnly || product.inStock;
        return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesBrand && matchesStock;
      })
      .sort((a, b) => {
        if (shopSortBy === 'low-to-high') return toNumericPrice(a.price) - toNumericPrice(b.price);
        if (shopSortBy === 'high-to-low') return toNumericPrice(b.price) - toNumericPrice(a.price);
        if (shopSortBy === 'top-rated') return b.rating - a.rating;
        if (shopSortBy === 'most-popular' || shopSortBy === 'relevance') return b.popularity - a.popularity;
        return b.createdAt - a.createdAt;
      });
  }, [
    shopProducts,
    selectedShopCategories,
    selectedShopCategory,
    debouncedSearchTerm,
    shopMaxPrice,
    priceRange.min,
    priceRange.max,
    shopMinRating,
    selectedBrands,
    inStockOnly,
    shopSortBy
  ]);

  const showMainPagination = selectedShopCategory === 'all' && selectedShopCategories.length === 0;
  const totalShopPages = Math.max(1, Math.ceil(filteredShopProducts.length / SHOP_PAGE_SIZE));
  const paginatedShopProducts = showMainPagination
    ? filteredShopProducts.slice((shopPage - 1) * SHOP_PAGE_SIZE, shopPage * SHOP_PAGE_SIZE)
    : filteredShopProducts;

  useEffect(() => {
    if (!showMainPagination) return;
    if (shopPage > totalShopPages) {
      setShopPage(totalShopPages);
    }
  }, [shopPage, totalShopPages, showMainPagination]);

  const toggleBrand = (brand: string) => {
    setShopPage(1);
    setSelectedBrands((current) => current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]);
  };

  const toggleShopCategoryFilter = (category: ShopCategory) => {
    setShopPage(1);
    setSelectedShopCategories((current) => {
      const updated = current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category];
      setSelectedShopCategory(updated[0] || 'all');
      return updated;
    });
  };

  useEffect(() => {
    if (view !== 'shop') return;
    setIsShopLoading(true);
    const timer = window.setTimeout(() => setIsShopLoading(false), 220);
    return () => window.clearTimeout(timer);
  }, [
    view,
    debouncedSearchTerm,
    selectedShopCategory,
    selectedShopCategories,
    selectedBrands,
    shopMinRating,
    priceRange.min,
    priceRange.max,
    inStockOnly,
    shopSortBy
  ]);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const moveToCart = (item: any) => {
    const existingItem = cartItems.find(ci => ci.id === item.id);
    if (existingItem) {
      setCartItems(prev => prev.map(ci => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      setCartItems(prev => [...prev, { ...item, quantity: 1, variant: 'Standard Edition' }]);
    }
    removeFromWishlist(item.id);
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary/30 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      {/* FIX: mobile navigation (global categories side menu) */}
      <AnimatePresence>
        {isCategoryMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryMenuOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-full sm:w-105 bg-surface-container-lowest border-r border-outline-variant/20 z-50 lg:hidden overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
                <h2 className="font-headline text-2xl text-primary">Browse Categories</h2>
                <button type="button" onClick={() => setIsCategoryMenuOpen(false)} className="p-2 rounded-lg hover:bg-surface-container-highest/40 text-on-surface-variant">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-3">
                {shopCategoryOptions.map((cat) => {
                  const isActive = selectedShopCategories.includes(cat.id) || selectedShopCategory === cat.id;
                  return (
                    <button
                      type="button"
                      key={`global-drawer-${cat.id}`}
                      onClick={() => openShopCategory(cat.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/20 hover:border-primary/40 text-on-surface'}`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                      />
                      <span className="font-label text-xs uppercase tracking-widest font-bold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {['admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers', 'admin-customer-profile', 'admin-coupons'].includes(view) && (
          <motion.div key="admin-layout" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full relative z-50">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-on-surface-variant">Loading admin workspace...</div>}>
              <AdminLayout activeView={view} setView={setView}>
                {view === 'admin-dashboard' && <AdminDashboard setView={setView} />}
                {view === 'admin-products' && <AdminProducts setView={setView} />}
                {view === 'admin-orders' && <AdminOrders setView={setView} />}
                {view === 'admin-customers' && <AdminCustomers setView={setView} />}
                {view === 'admin-customer-profile' && <AdminCustomerProfile setView={setView} />}
                {view === 'admin-coupons' && <AdminCoupons setView={setView} />}
              </AdminLayout>
            </Suspense>
          </motion.div>
        )}
        {view === 'cart' && (
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* TopNavBar */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-480 mx-auto px-8 md:px-12 py-16 grow">
              <header className="mb-16">
                <h1 className="font-headline text-5xl md:text-6xl text-on-background tracking-tight mb-4">Your Selection</h1>
                <p className="text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">
                  Refined acquisitions awaiting your final confirmation. Curated items are held for a limited period in our digital vault.
                </p>
              </header>

              <div className="flex flex-col lg:flex-row gap-16 items-start">
                {/* Left (65%): Cart items list */}
                <section className="w-full lg:w-[65%] space-y-12">
                  {cartItems.map((item) => (
                    <article 
                      key={item.id} 
                      className={`group flex flex-col md:flex-row gap-8 pb-12 border-b border-outline-variant/20 transition-all ${item.outOfStock ? 'opacity-60' : ''}`}
                    >
                      <div className="relative w-full md:w-48 h-64 overflow-hidden rounded-lg bg-surface-container-low">
                        {item.outOfStock && (
                          <div className="absolute inset-0 bg-background/60 z-10 flex items-center justify-center p-4 text-center">
                            <span className="text-error font-headline text-lg italic">Reserve Unavailable</span>
                          </div>
                        )}
                        <img 
                          loading="lazy"
                          className={`w-full h-full object-cover transition-transform duration-700 ${!item.outOfStock ? 'grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105' : 'grayscale'}`} 
                          src={item.img} 
                          alt={item.name}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-headline text-2xl tracking-tight ${item.outOfStock ? 'text-on-surface-variant' : 'text-primary'}`}>
                              {item.name}
                            </h3>
                            <span className={`font-mono text-lg ${item.outOfStock ? 'text-on-surface-variant' : 'text-on-background'}`}>
                              ${item.price.toLocaleString()}.00
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-sm uppercase tracking-widest mb-4">{item.variant}</p>
                          
                          {item.outOfStock ? (
                            <div className="inline-flex items-center gap-2 bg-error-container/20 text-error px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-error/20">
                              <ShieldCheck size={14} />
                              Current Stock Depleted
                            </div>
                          ) : (
                            <div className="flex items-center gap-6 mt-6">
                              <div className="flex items-center bg-surface-container-highest rounded-full px-4 py-1.5 border border-outline-variant/10">
                                <button 
                                  className="text-on-surface hover:text-primary transition-colors px-2"
                                  onClick={() => {
                                    setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
                                  }}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="font-mono px-6 text-on-background">{item.quantity.toString().padStart(2, '0')}</span>
                                <button 
                                  className="text-on-surface hover:text-primary transition-colors px-2"
                                  onClick={() => {
                                    setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                                  }}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button className="text-on-surface-variant hover:text-on-surface text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                                <Bookmark size={18} />
                                Save for later
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-end mt-8">
                          <button 
                            className="text-error/60 hover:text-error transition-colors flex items-center gap-2 group/remove"
                            onClick={() => {
                              setCartItems(prev => prev.filter(i => i.id !== item.id));
                            }}
                          >
                            <Trash2 size={20} />
                            <span className="text-xs uppercase tracking-widest opacity-0 group-hover/remove:opacity-100 transition-opacity">Remove from collection</span>
                          </button>
                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant block mb-1">Line Total</span>
                            <span className={`font-mono text-xl ${item.outOfStock ? 'text-on-surface-variant' : 'text-on-background'}`}>
                              ${(item.outOfStock ? 0 : item.price * item.quantity).toLocaleString()}.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>

                {/* Right (35%): Order Summary card (sticky) */}
                <aside className="w-full lg:w-[35%] lg:sticky lg:top-32">
                  <div className="bg-surface-container-highest/20 backdrop-blur-xl p-10 rounded-xl border border-outline-variant/10 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
                    <h2 className="font-headline text-3xl mb-8 tracking-tight border-b border-outline-variant/10 pb-6">Summary</h2>
                    <div className="space-y-6 mb-10">
                      <div className="flex justify-between text-on-surface-variant font-light">
                        <span>Subtotal</span>
                        <span className="font-mono">${cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0).toLocaleString()}.00</span>
                      </div>
                      <div className="flex justify-between text-primary font-light">
                        <span>Discount</span>
                        <span className="font-mono">-$200.00</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-light">
                        <span>Vault Shipping</span>
                        <span className="font-mono">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-light">
                        <span>Estimated Tax</span>
                        <span className="font-mono">${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 0.08).toLocaleString()}.00</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 mb-10">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Promotional Code</label>
                      <div className="flex gap-2">
                        <input 
                          className="bg-surface-container-lowest border-b border-outline-variant/40 focus:border-primary focus:ring-0 transition-all w-full text-sm font-mono tracking-widest uppercase py-3 placeholder:opacity-30 outline-none" 
                          placeholder="ENTROPY-2024" 
                          type="text"
                        />
                        <button className="px-6 py-3 bg-surface-container-highest text-primary text-xs uppercase tracking-widest hover:bg-surface-container-high transition-all font-bold">Apply</button>
                      </div>
                    </div>
                    <div className="border-t border-outline-variant/10 pt-8 mb-10">
                      <div className="flex justify-between items-end">
                        <span className="font-headline text-xl">Grand Total</span>
                        <span className="font-mono text-3xl text-primary">
                          ${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 1.08 - 200).toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                    <button 
                      className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-5 rounded-lg text-sm uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-[0_8px_24px_rgba(230,195,100,0.2)]"
                      onClick={() => {
                        setView('checkout-address');
                        window.scrollTo(0, 0);
                      }}
                    >
                      Proceed to Checkout
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                      <span className="flex items-center gap-1.5">
                        <Lock size={14} />
                        Encrypted Checkout
                      </span>
                      <span className="w-1 h-1 bg-outline-variant/30 rounded-full"></span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        Authenticity Guaranteed
                      </span>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Below the fold: You might also like */}
              <section className="mt-32">
                <div className="flex justify-between items-end mb-12">
                  <h2 className="font-headline text-4xl tracking-tight">You might also like</h2>
                  <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:border-primary transition-colors text-on-surface">
                      <ArrowLeft size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-outline-variant/20 flex items-center justify-center hover:border-primary transition-colors text-on-surface">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-8 overflow-x-auto no-scrollbar pb-12 snap-x">
                  {[
                    { name: 'Vanguard Titanium VII', price: '$8,900.00', img: '/images/local/asset-0045.png' },
                    { name: 'Nomad Leather Holdall', price: '$2,450.00', img: '/images/local/asset-0046.png' },
                    { name: 'Stiletto Noir \'24', price: '$1,150.00', img: '/images/local/asset-0047.png' },
                    { name: 'Eclipse Shades', price: '$620.00', img: '/images/local/asset-0048.png' }
                  ].map((item, i) => (
                    <div key={i} className="min-w-[320px] snap-start group cursor-pointer">
                      <div className="h-96 w-full mb-6 overflow-hidden rounded-lg bg-surface-container-low">
                        <img loading="lazy" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700" src={item.img} alt={item.name} referrerPolicy="no-referrer" />
                      </div>
                      <h4 className="font-headline text-xl mb-1 text-on-background group-hover:text-primary transition-colors">{item.name}</h4>
                      <span className="font-mono text-on-surface-variant">{item.price}</span>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="w-full mt-20 bg-surface-container-lowest border-t border-[#F5F5F0]/5 pt-16 font-headline text-xs leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto">
                <div className="col-span-1 md:col-span-1">
                  <div className="text-lg font-bold text-primary mb-4">The Obsidian Curator</div>
                  <p className="text-[#F5F5F0]/40 max-w-50">The definitive destination for the rarest acquisitions and bespoke luxury items.</p>
                </div>
                <div>
                  <h5 className="text-primary uppercase tracking-widest mb-6 text-[10px]">Concierge</h5>
                  <ul className="space-y-4">
                    <li><button type="button" onClick={() => openInfoPage('private-suite')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors">Private Suite</button></li>
                    <li><button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors">Shipping Etiquette</button></li>
                    <li><button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors">Authenticity Guarantee</button></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-primary uppercase tracking-widest mb-6 text-[10px]">Legal</h5>
                  <ul className="space-y-4">
                    <li><button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors">Terms of Service</button></li>
                    <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-primary uppercase tracking-widest mb-6 text-[10px]">Newsletter</h5>
                  <div className="flex border-b border-outline-variant/30 pb-2">
                    <input className="bg-transparent border-none focus:ring-0 text-[10px] uppercase tracking-widest placeholder:text-on-surface-variant/30 w-full outline-none" placeholder="YOUR EMAIL" type="email" />
                    <button className="text-primary hover:opacity-80 transition-opacity">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-12 py-10 border-t border-outline-variant/5 text-center md:text-left text-[#F5F5F0]/40 uppercase tracking-[0.2em] text-[8px] font-bold">
                © 2024 The Obsidian Curator. All Rights Reserved.
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'checkout-address' && (
          <motion.div
            key="checkout-address"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            {/* Top Navigation (Transactional Flow) */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-360 mx-auto px-8 py-12 md:py-20 grow w-full">
              {/* Progress Indicator */}
              <nav className="mb-20 flex justify-center overflow-x-auto pb-4 no-scrollbar">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center font-headline font-bold">1</div>
                    <span className="font-headline text-primary tracking-wide text-sm uppercase">Address</span>
                  </div>
                  <div className="w-16 h-px bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">2</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Payment</span>
                  </div>
                  <div className="w-16 h-px bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">3</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Review</span>
                  </div>
                  <div className="w-16 h-px bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">4</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Confirm</span>
                  </div>
                </div>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left: Delivery Address Selection */}
                <section className="lg:col-span-8 space-y-12">
                  <header>
                    <h1 className="text-4xl font-headline text-on-surface mb-2 tracking-tight italic">Delivery Address</h1>
                    <p className="text-on-surface-variant font-light tracking-wide">Select your curated destination for arrival.</p>
                  </header>

                  {/* FIX: checkout address radio highlight */}
                  {/* Saved Addresses Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <label key={addr.id} className={`address-card relative group cursor-pointer h-full p-6 bg-surface-container-highest/10 backdrop-blur-xl border rounded-xl transition-all duration-500 hover:bg-surface-container-high/40 ${selectedAddress === addr.id ? 'border-yellow-400 shadow-[0_0_0_1px_#F5C518]' : 'border-outline-variant/30'}`}>
                        <input
                          className="checkout-address-radio"
                          name="address"
                          type="radio"
                          value={addr.id}
                          checked={selectedAddress === addr.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                        />
                        <div className="h-full">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-headline uppercase tracking-[0.2em] rounded-full">{addr.addressType}</span>
                          </div>
                          <h3 className="text-lg font-headline text-on-surface mb-1">{addr.fullName}</h3>
                          <p className="text-sm text-on-surface-variant mb-4">{addr.phone}</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                            {addr.street}<br/>
                            {addr.city}, {addr.state} {addr.pincode}<br/>
                          </p>
                        </div>
                      </label>
                    ))}

                    {/* Add New Address Button */}
                    <button type="button" onClick={() => setShowAddressForm(true)} className="h-full p-8 border border-dashed border-outline-variant/50 rounded-xl flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:text-primary hover:border-primary transition-all duration-500 hover:bg-primary/5 group">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                      <span className="font-headline tracking-widest text-xs uppercase">Add New Address</span>
                    </button>
                  </div>

                  {/* Inline Form (Expanded State Concept) */}
                  {showAddressForm && (
                    <form onSubmit={handleAddAddressSubmit} className="pt-8 border-t border-outline-variant/10">
                      {addressError && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-xs uppercase tracking-widest font-bold">
                          {addressError}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                          <input required value={addressFormData.fullName} onChange={(e) => setAddressFormData({...addressFormData, fullName: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light outline-none" placeholder="Enter full name" type="text"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                          <input required value={addressFormData.phone} onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light outline-none" placeholder="+1 (000) 000-0000" type="tel"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Pincode</label>
                          <input required value={addressFormData.pincode} onChange={(e) => setAddressFormData({...addressFormData, pincode: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light font-mono outline-none" placeholder="Zip / Postal Code" type="text"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Address Type</label>
                          <div className="flex gap-4 py-1">
                            <button type="button" onClick={() => setAddressFormData({...addressFormData, addressType: 'HOME'})} className={`px-4 py-2 rounded-full border ${addressFormData.addressType === 'HOME' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'} text-[10px] font-headline uppercase tracking-widest transition-colors`}>Home</button>
                            <button type="button" onClick={() => setAddressFormData({...addressFormData, addressType: 'WORK'})} className={`px-4 py-2 rounded-full border ${addressFormData.addressType === 'WORK' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'} text-[10px] font-headline uppercase tracking-widest transition-colors`}>Work</button>
                            <button type="button" onClick={() => setAddressFormData({...addressFormData, addressType: 'OTHER'})} className={`px-4 py-2 rounded-full border ${addressFormData.addressType === 'OTHER' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'} text-[10px] font-headline uppercase tracking-widest transition-colors`}>Other</button>
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Address Line 1</label>
                          <input required value={addressFormData.street} onChange={(e) => setAddressFormData({...addressFormData, street: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light outline-none" placeholder="Street name and house number" type="text"/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">City</label>
                          <input required value={addressFormData.city} onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text" placeholder="New York" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">State</label>
                          <input required value={addressFormData.state} onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text" placeholder="NY" />
                        </div>
                      </div>
                      <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-3 font-headline text-xs tracking-widest uppercase hover:text-primary transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-3 bg-primary text-on-primary rounded font-headline text-xs tracking-widest uppercase">Save</button>
                      </div>
                    </form>
                  )}

                  <div className="flex justify-start">
                    <button 
                      className={`group flex items-center gap-4 bg-primary text-on-primary px-12 py-5 rounded-lg font-headline font-bold tracking-widest uppercase text-xs overflow-hidden relative transition-all hover:shadow-[0_0_30px_rgba(230,195,100,0.3)] active:scale-95 ${(!selectedAddress || showAddressForm) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                      onClick={() => {
                        if (showAddressForm) {
                          setAddressError('Please save or cancel the address form before continuing.');
                          return;
                        }
                        if (!selectedAddress) {
                          setAddressError('Please select a shipping residence.');
                          return;
                        }
                        setView('checkout-payment');
                        window.scrollTo(0, 0);
                      }}
                    >
                      <span>Save & Continue</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </section>

                {/* Right: Mini Order Summary */}
                <aside className="lg:col-span-4 sticky top-32">
                  <div className="bg-surface-container-highest/20 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16"></div>
                    <h2 className="text-xl font-headline text-on-surface mb-8 tracking-wide italic">Order Summary</h2>
                    {/* Summary Items */}
                    <div className="space-y-6 mb-8 max-h-75 overflow-y-auto pr-2 no-scrollbar">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-surface-container-highest rounded overflow-hidden">
                              <img loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src={item.img} alt={item.name} referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="text-sm font-headline text-on-surface mb-1">{item.name}</p>
                              <p className="text-[10px] font-mono text-on-surface-variant uppercase">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-mono text-sm text-primary">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    {/* Totals */}
                    <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                      <div className="flex justify-between text-sm font-light">
                        <span className="text-on-surface-variant">Subtotal</span>
                        <span className="text-on-surface font-mono">${cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0).toLocaleString()}.00</span>
                      </div>
                      <div className="flex justify-between text-sm font-light">
                        <span className="text-on-surface-variant">White Glove Shipping</span>
                        <span className="text-on-surface font-mono">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-sm font-light">
                        <span className="text-on-surface-variant">Insurance</span>
                        <span className="text-on-surface font-mono">$45.00</span>
                      </div>
                      <div className="flex justify-between items-center pt-6 mt-4 border-t border-primary/20">
                        <span className="font-headline text-on-surface uppercase tracking-[0.2em] text-xs">Total Amount</span>
                        <span className="text-2xl font-mono text-primary font-bold">
                          ${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 1.08 - 200).toLocaleString()}.00
                        </span>
                      </div>
                    </div>
                    {/* Trust Badge */}
                    <div className="mt-8 flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low/50 rounded-lg border border-outline-variant/10">
                      <ShieldCheck size={18} className="text-primary" />
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">Authenticity Guaranteed</span>
                    </div>
                  </div>
                </aside>
              </div>
            </main>

            {/* Footer (Minimal) */}
            <footer className="w-full mt-20 bg-surface-container-lowest border-t border-[#F5F5F0]/5 pt-16">
              <div className="max-w-480 mx-auto px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div className="md:col-span-2">
                    <div className="text-lg font-bold text-primary mb-4 font-headline uppercase tracking-widest">The Obsidian Curator</div>
                    <p className="text-[#F5F5F0]/40 text-xs leading-relaxed max-w-sm font-body">
                      The ultimate destination for the world's most rare and exceptional artifacts. Exclusivity defined by scarcity and heritage.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Concierge</h5>
                    <ul className="space-y-4">
                      <li><button type="button" onClick={() => openInfoPage('private-suite')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Private Suite</button></li>
                      <li><button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Shipping Etiquette</button></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Legal</h5>
                    <ul className="space-y-4">
                      <li><button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Terms of Service</button></li>
                      <li><button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Authenticity Guarantee</button></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase font-label">© 2024 The Obsidian Curator. All Rights Reserved.</p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'checkout-payment' && (
          <motion.div
            key="checkout-payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            {/* Top Navigation (Transactional Flow) */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-360 mx-auto px-8 py-12 md:py-20 grow w-full">
              {/* Progress Indicator */}
              <nav className="mb-20 flex justify-center overflow-x-auto pb-4 no-scrollbar">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center font-headline font-bold">1</div>
                    <span className="font-headline text-primary tracking-wide text-sm uppercase">Address</span>
                  </div>
                  <div className="w-16 h-px bg-primary shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center font-headline font-bold">2</div>
                    <span className="font-headline text-primary tracking-wide text-sm uppercase">Payment</span>
                  </div>
                  <div className="w-16 h-px bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">3</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Review</span>
                  </div>
                  <div className="w-16 h-px bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">4</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Confirm</span>
                  </div>
                </div>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left Column: Payment Details */}
                <div className="lg:col-span-8">
                  <h1 className="text-4xl md:text-5xl font-headline text-on-surface mb-12 italic">Select Payment Method</h1>
                  
                  <div className="space-y-6">
                    {/* Credit/Debit Card Option */}
                    <div className={`glass rounded-xl p-8 border transition-all ${paymentMethod === 'card' ? 'border-primary/20 ring-1 ring-primary/10' : 'border-outline-variant/10'}`}>
                      <label className="flex items-center justify-between cursor-pointer mb-8">
                        <div className="flex items-center gap-4">
                          <input 
                            checked={paymentMethod === 'card'} 
                            onChange={() => setPaymentMethod('card')}
                            className="w-5 h-5 text-primary bg-surface-container-highest border-outline-variant focus:ring-primary ring-offset-background" 
                            name="payment_method" 
                            type="radio"
                          />
                          <div className="flex items-center gap-3">
                            <CreditCard className={paymentMethod === 'card' ? 'text-primary' : 'text-on-surface-variant'} />
                            <span className={`font-headline text-lg ${paymentMethod === 'card' ? 'text-on-surface' : 'text-on-surface-variant'}`}>Credit / Debit Card</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <img loading="lazy" className="h-6 opacity-80" src="/images/local/asset-0049.png" alt="Visa" />
                          <img loading="lazy" className="h-6 opacity-80" src="/images/local/asset-0050.png" alt="Mastercard" />
                        </div>
                      </label>
                      
                      <AnimatePresence>
                        {paymentMethod === 'card' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Card Number</label>
                                <div className="relative">
                                  <input className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 py-4 px-0 text-lg font-mono tracking-widest placeholder:text-on-surface-variant/20 transition-all outline-none" placeholder="XXXX XXXX XXXX XXXX" type="text"/>
                                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/60">
                                    <Smartphone size={20} />
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Expiry Date</label>
                                <input className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 py-4 px-0 text-lg font-mono tracking-widest placeholder:text-on-surface-variant/20 transition-all outline-none" placeholder="MM / YY" type="text"/>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">CVV</label>
                                <div className="relative">
                                  <input className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 py-4 px-0 text-lg font-mono tracking-widest placeholder:text-on-surface-variant/20 transition-all outline-none" placeholder="•••" type="password"/>
                                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-sm">
                                    <ShieldCheck size={18} />
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Cardholder Name</label>
                                <input className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/50 focus:border-primary focus:ring-0 py-4 px-0 text-lg font-body uppercase tracking-wider placeholder:text-on-surface-variant/20 transition-all outline-none" placeholder="AS APPEARS ON CARD" type="text"/>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* UPI Option */}
                    <div 
                      className={`bg-surface-container-low rounded-xl p-6 hover:bg-surface-container transition-colors cursor-pointer border ${paymentMethod === 'upi' ? 'border-primary/20' : 'border-transparent'}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <input 
                            checked={paymentMethod === 'upi'} 
                            onChange={() => setPaymentMethod('upi')}
                            className="w-5 h-5 text-primary bg-surface-container-highest border-outline-variant focus:ring-primary ring-offset-background" 
                            name="payment_method" 
                            type="radio"
                          />
                          <div className="flex items-center gap-3">
                            <Smartphone className={paymentMethod === 'upi' ? 'text-primary' : 'text-on-surface-variant'} />
                            <span className={`font-headline text-lg ${paymentMethod === 'upi' ? 'text-on-surface' : 'text-on-surface-variant'}`}>UPI Payment</span>
                          </div>
                        </div>
                        <img loading="lazy" className="h-4 opacity-40" src="/images/local/asset-0051.png" alt="UPI" />
                      </label>
                    </div>

                    {/* Net Banking Option */}
                    <div 
                      className={`bg-surface-container-low rounded-xl p-6 hover:bg-surface-container transition-colors cursor-pointer border ${paymentMethod === 'netbanking' ? 'border-primary/20' : 'border-transparent'}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <input 
                            checked={paymentMethod === 'netbanking'} 
                            onChange={() => setPaymentMethod('netbanking')}
                            className="w-5 h-5 text-primary bg-surface-container-highest border-outline-variant focus:ring-primary ring-offset-background" 
                            name="payment_method" 
                            type="radio"
                          />
                          <div className="flex items-center gap-3">
                            <Building2 className={paymentMethod === 'netbanking' ? 'text-primary' : 'text-on-surface-variant'} />
                            <span className={`font-headline text-lg ${paymentMethod === 'netbanking' ? 'text-on-surface' : 'text-on-surface-variant'}`}>Net Banking</span>
                          </div>
                        </div>
                        <ChevronRight className="text-on-surface-variant/40" />
                      </label>
                    </div>

                    {/* Wallets */}
                    <div 
                      className={`bg-surface-container-low rounded-xl p-6 hover:bg-surface-container transition-colors cursor-pointer border ${paymentMethod === 'wallet' ? 'border-primary/20' : 'border-transparent'}`}
                      onClick={() => setPaymentMethod('wallet')}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <input 
                            checked={paymentMethod === 'wallet'} 
                            onChange={() => setPaymentMethod('wallet')}
                            className="w-5 h-5 text-primary bg-surface-container-highest border-outline-variant focus:ring-primary ring-offset-background" 
                            name="payment_method" 
                            type="radio"
                          />
                          <div className="flex items-center gap-4">
                            <div className="space-y-4">
                              {paymentMethods.map((pm) => (
                                <div 
                                  key={pm.id}
                                  onClick={() => setSelectedPayment(pm.id)}
                                  className={`p-6 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedPayment === pm.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 bg-surface-container-lowest/50 hover:border-primary/20'}`}
                                >
                                  <div className="flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPayment === pm.id ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                                        {selectedPayment === pm.id && <Check size={12} className="text-on-primary" />}
                                      </div>
                                      <div>
                                        <p className="text-sm font-headline uppercase tracking-widest">Card</p>
                                        <p className="text-xs text-on-surface-variant font-mono">{pm.maskedCardNumber}</p>
                                      </div>
                                    </div>
                                    <CreditCardIcon className={`transition-colors ${selectedPayment === pm.id ? 'text-primary' : 'text-on-surface-variant/20'}`} size={24} />
                                  </div>
                                </div>
                              ))}

                              <button 
                                 onClick={() => setShowPaymentForm(!showPaymentForm)}
                                 className="w-full p-6 rounded-xl border-2 border-dashed border-outline-variant/20 flex items-center justify-center gap-3 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all text-sm uppercase tracking-widest font-bold"
                              >
                                 <Plus size={18} /> {showPaymentForm ? 'Cancel New Instrument' : 'Initialize New Instrument'}
                              </button>

                              {showPaymentForm && (
                                <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
                                  <form onSubmit={handleAddPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Card Holder Name</label>
                                      <input 
                                         required
                                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                                         placeholder="Alex Johnson"
                                         value={paymentFormData.cardHolderName}
                                         onChange={e => setPaymentFormData({...paymentFormData, cardHolderName: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Card Number</label>
                                      <input 
                                         required
                                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                                         placeholder="4111 1111 1111 1111"
                                         value={paymentFormData.cardNumber}
                                         onChange={e => setPaymentFormData({...paymentFormData, cardNumber: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Expiry (MM/YY)</label>
                                      <input 
                                         required
                                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                                         placeholder="12/29"
                                         value={paymentFormData.expiryDate}
                                         onChange={e => setPaymentFormData({...paymentFormData, expiryDate: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">CVV</label>
                                      <input 
                                         required
                                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                                         placeholder="123"
                                         value={paymentFormData.cvv}
                                         onChange={e => setPaymentFormData({...paymentFormData, cvv: e.target.value})}
                                      />
                                    </div>
                                    <div className="md:col-span-2 flex justify-end pt-4">
                                      <button type="submit" className="bg-primary text-on-primary px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-xs">Authorize Instrument</button>
                                    </div>
                                  </form>
                                </div>
                              )}

                            </div>
                            <span className={`font-headline text-lg ${paymentMethod === 'wallet' ? 'text-on-surface' : 'text-on-surface-variant'}`}>Digital Wallets</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* COD */}
                    <div 
                      className={`bg-surface-container-low rounded-xl p-6 hover:bg-surface-container transition-colors cursor-pointer border ${paymentMethod === 'cod' ? 'border-primary/20' : 'border-transparent'}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                          <input 
                            checked={paymentMethod === 'cod'} 
                            onChange={() => setPaymentMethod('cod')}
                            className="w-5 h-5 text-primary bg-surface-container-highest border-outline-variant focus:ring-primary ring-offset-background" 
                            name="payment_method" 
                            type="radio"
                          />
                          <div className="flex items-center gap-3">
                            <Banknote className={paymentMethod === 'cod' ? 'text-primary' : 'text-on-surface-variant'} />
                            <span className={`font-headline text-lg ${paymentMethod === 'cod' ? 'text-on-surface' : 'text-on-surface-variant'}`}>Cash on Delivery</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded tracking-widest uppercase">Service Fee Applies</span>
                      </label>
                    </div>
                  </div>

                  {/* Security Badges */}
                  <div className="mt-12 flex flex-wrap items-center gap-10 opacity-40">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} />
                      <span className="text-[10px] uppercase tracking-widest font-label">SSL Encrypted Secure Connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={20} />
                      <span className="text-[10px] uppercase tracking-widest font-label">PCI-DSS Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="lg:col-span-4">
                  <div className="sticky top-32 space-y-8">
                    <div className="bg-surface-container-highest/20 backdrop-blur-xl rounded-xl p-8 border border-outline-variant/10 shadow-2xl">
                      <h2 className="text-xl font-headline mb-8 pb-4 border-b border-outline-variant/10">Order Summary</h2>
                      <div className="space-y-6 mb-8 max-h-100 overflow-y-auto pr-2 no-scrollbar">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-24 bg-surface-container-highest rounded overflow-hidden shrink-0">
                              <img loading="lazy" className="w-full h-full object-cover" src={item.img} alt={item.name} referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex flex-col justify-between py-1">
                              <div>
                                <h4 className="text-sm font-headline">{item.name}</h4>
                                <p className="text-[10px] text-on-surface-variant font-mono uppercase mt-1">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-bold text-primary">${(item.price * item.quantity).toLocaleString()}.00</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4 pt-6 border-t border-outline-variant/10">
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">Subtotal</span>
                          <span className="text-on-surface font-mono">${cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0).toLocaleString()}.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">Curation & Shipping</span>
                          <span className="text-secondary uppercase text-[10px] tracking-widest font-bold">Complimentary</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">Estimated Tax</span>
                          <span className="text-on-surface font-mono">${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 0.08).toLocaleString()}.00</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end mt-10 pt-6 border-t border-outline-variant/20">
                        <span className="text-xs uppercase tracking-[0.2em] font-label text-on-surface-variant">Total Investment</span>
                        <span className="text-3xl font-headline text-primary tracking-tighter">
                          ${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 1.08 - 200).toLocaleString()}.00
                        </span>
                      </div>
                      
                      <button 
                        className="w-full mt-12 py-5 bg-primary text-on-primary rounded-lg font-bold uppercase tracking-[0.25em] text-xs hover:bg-primary-container transition-all active:scale-[0.98] shadow-[0_12px_40px_rgba(230,195,100,0.15)] flex items-center justify-center gap-3"
                        onClick={() => {
                          setView('checkout-review');
                          window.scrollTo(0, 0);
                        }}
                      >
                        <Lock size={14} />
                        Continue to Review
                      </button>
                      
                      <p className="mt-6 text-center text-[10px] text-on-surface-variant/60 font-label tracking-widest uppercase">
                        Transactions protected by 256-bit AES encryption
                      </p>
                    </div>

                    {/* Assurance Card */}
                    <div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/5">
                      <div className="flex items-start gap-4">
                        <Award className="text-primary shrink-0" size={24} />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Authenticity Guarantee</h4>
                          <p className="text-[11px] leading-relaxed text-on-surface-variant">
                            Every item curated by The Obsidian Curator undergoes rigorous verification and is accompanied by a digitally-signed Certificate of Provenance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer (Minimal) */}
            <footer className="w-full mt-20 bg-surface-container-lowest border-t border-[#F5F5F0]/5 pt-16">
              <div className="max-w-480 mx-auto px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div className="md:col-span-2">
                    <div className="text-lg font-bold text-primary mb-4 font-headline uppercase tracking-widest">The Obsidian Curator</div>
                    <p className="text-[#F5F5F0]/40 text-xs leading-relaxed max-w-sm font-body">
                      The ultimate destination for the world's most rare and exceptional artifacts. Exclusivity defined by scarcity and heritage.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Concierge</h5>
                    <ul className="space-y-4">
                      <li><button type="button" onClick={() => openInfoPage('private-suite')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Private Suite</button></li>
                      <li><button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Shipping Etiquette</button></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Legal</h5>
                    <ul className="space-y-4">
                      <li><button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Terms of Service</button></li>
                      <li><button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Authenticity Guarantee</button></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase font-label">© 2024 The Obsidian Curator. All Rights Reserved.</p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'checkout-review' && (
          <motion.div
            key="checkout-review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            {/* Top Navigation (Transactional Flow) */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-360 mx-auto px-6 md:px-12 py-12 md:py-20 grow w-full">
              {/* Progress Indicator */}
              <div className="mb-16 max-w-2xl mx-auto">
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-outline-variant -z-10"></div>
                  <div className="flex flex-col items-center gap-3 bg-background px-4">
                    <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center text-xs font-mono">01</span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 bg-background px-4">
                    <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center text-xs font-mono">02</span>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 bg-background px-4">
                    <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-mono shadow-[0_0_20px_rgba(230,195,100,0.3)]">03</span>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Review</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-8 space-y-16">
                  <section>
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-on-surface mb-8 tracking-tight italic">Final Acquisition Review</h1>
                    <p className="font-body text-on-surface-variant max-w-xl leading-relaxed font-light">
                      Please review the details of your curated selection before finalizing the transaction. Every piece is handled with exceptional care and discretion.
                    </p>
                  </section>

                  {/* Items List */}
                  <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                      <h2 className="font-headline text-2xl text-primary italic">Your Curation</h2>
                      <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-label">
                        {cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.quantity), 0)} Items Total
                      </span>
                    </div>
                    <div className="space-y-6">
                      {cartItems.map((item) => !item.outOfStock && (
                        <div key={item.id} className="flex gap-6 items-center p-4 rounded-xl bg-surface-container-low/30 hover:bg-surface-container-high/50 transition-colors group border border-outline-variant/10">
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-highest shrink-0">
                            <img 
                              alt={item.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                              src={item.img}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="grow">
                            <h3 className="font-headline text-lg text-on-surface">{item.name}</h3>
                            <p className="text-sm text-on-surface-variant font-body font-light">{item.variant}</p>
                            <p className="text-xs font-mono mt-2 text-primary">SKU: OC-{item.id.toString().padStart(3, '0')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-headline text-xl text-on-surface">${item.price.toLocaleString()}.00</p>
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 font-label">Qty: {item.quantity.toString().padStart(2, '0')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Logistics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Delivery Address */}
                    <div className="p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/10 space-y-6 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Truck size={20} className="text-primary" />
                          <h3 className="font-headline text-xl text-on-surface italic">Delivery Suite</h3>
                        </div>
                        <button 
                          className="text-xs uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary transition-all font-label"
                          onClick={() => setView('checkout-address')}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-1 font-body text-on-surface-variant text-sm leading-relaxed font-light">
                        {(() => {
                          const addr = addresses.find(a => a.id === selectedAddress);
                          if (!addr) return <p className="italic opacity-40">No destination selected.</p>;
                           return (
                             <>
                               <p className="text-on-surface font-semibold">{addr.fullName}</p>
                               <p>{addr.street}</p>
                               <p>{addr.city}, {addr.state} {addr.pincode}</p>
                               <p>{addr.phone}</p>
                             </>
                           );
                        })()}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/10 space-y-6 relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <CreditCard size={20} className="text-primary" />
                          <h3 className="font-headline text-xl text-on-surface italic">Payment Method</h3>
                        </div>
                        <button 
                          className="text-xs uppercase tracking-widest text-primary border-b border-primary/20 hover:border-primary transition-all font-label"
                          onClick={() => setView('checkout-payment')}
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-4">
                        {(() => {
                          const pm = paymentMethods.find(p => p.id === selectedPayment);
                          if (!pm) return <p className="italic opacity-40">No instrument selected.</p>;
                          return (
                            <div className="flex items-center gap-4 bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/5">
                              <div className="w-10 h-6 bg-surface-container-highest rounded flex items-center justify-center">
                                <CreditCard size={16} className="opacity-60" />
                              </div>
                              <div>
                                <p className="text-sm font-mono text-on-surface tracking-widest">{pm.maskedCardNumber}</p>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">{pm.cardHolderName}</p>
                              </div>
                            </div>
                          );
                        })()}
                        <p className="text-xs font-body text-on-surface-variant italic font-light">Encrypted transaction via Obsidian Private Banking.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <aside className="lg:col-span-4 lg:sticky lg:top-28">
                  <div className="bg-surface-container-lowest/50 backdrop-blur-xl p-8 rounded-2xl border border-outline-variant/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] space-y-10">
                    <div className="space-y-6">
                      <h2 className="font-headline text-2xl text-on-surface border-b border-outline-variant/10 pb-4 italic">Financial Summary</h2>
                      <div className="space-y-4 font-body">
                        <div className="flex justify-between text-sm font-light">
                          <span className="text-on-surface-variant">Acquisition Subtotal</span>
                          <span className="text-on-surface font-mono">${cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0).toLocaleString()}.00</span>
                        </div>
                        <div className="flex justify-between text-sm font-light">
                          <span className="text-on-surface-variant">White-Glove Delivery</span>
                          <span className="text-on-surface font-mono">$125.00</span>
                        </div>
                        <div className="flex justify-between text-sm font-light">
                          <span className="text-on-surface-variant">Estimated Luxury Surcharge</span>
                          <span className="text-on-surface font-mono">${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 0.08).toLocaleString()}.00</span>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-baseline">
                        <span className="font-headline text-on-surface uppercase tracking-widest text-xs">Grand Total</span>
                        <span className="font-headline text-3xl text-primary tracking-tighter font-bold">
                          ${(cartItems.reduce((acc, item) => acc + (item.outOfStock ? 0 : item.price * item.quantity), 0) * 1.08 + 125).toLocaleString()}.00
                        </span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                          <input 
                            className="h-4 w-4 rounded border-outline-variant bg-surface-container-highest text-primary focus:ring-primary focus:ring-offset-background" 
                            id="terms" 
                            name="terms" 
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                          />
                        </div>
                        <div className="text-xs text-on-surface-variant leading-relaxed font-light">
                          <label className="font-body" htmlFor="terms">
                            I accept the{' '}
                            <button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-primary hover:underline">
                              Terms of Service
                            </button>{' '}
                            and the{' '}
                            <button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-primary hover:underline">
                              Authenticity Guarantee
                            </button>{' '}
                            protocol.
                          </label>
                        </div>
                      </div>
                      <button 
                        disabled={!agreeTerms || isLoading}
                        className={`w-full py-5 rounded-lg font-headline tracking-widest uppercase text-xs shadow-[0_12px_24px_rgba(230,195,100,0.15)] transition-all active:scale-[0.98] ${agreeTerms ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'}`}
                        onClick={handleFinalizeAcquisition}
                      >
                        {isLoading ? 'Finalizing...' : 'Finalize Acquisition'}
                      </button>
                      {checkoutError && (
                        <p className="text-error text-xs font-label tracking-wide">{checkoutError}</p>
                      )}
                      <div className="flex items-center justify-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-label">
                        <Lock size={12} className="text-primary" />
                        Secure Encrypted Transaction
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <p className="text-xs font-body text-primary leading-relaxed text-center font-light">
                      <span className="font-bold uppercase tracking-widest text-[10px]">Concierge Note:</span> Your order includes complimentary insurance and personal tracking by our specialist team.
                    </p>
                  </div>
                </aside>
              </div>
            </main>

            {/* Footer (Minimal) */}
            <footer className="w-full mt-20 bg-surface-container-lowest border-t border-[#F5F5F0]/5 pt-16">
              <div className="max-w-480 mx-auto px-12 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div className="md:col-span-2">
                    <div className="text-lg font-bold text-primary mb-4 font-headline uppercase tracking-widest">The Obsidian Curator</div>
                    <p className="text-[#F5F5F0]/40 text-xs leading-relaxed max-w-sm font-body">
                      The ultimate destination for the world's most rare and exceptional artifacts. Exclusivity defined by scarcity and heritage.
                    </p>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Concierge</h5>
                    <ul className="space-y-4">
                      <li><button type="button" onClick={() => openInfoPage('private-suite')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Private Suite</button></li>
                      <li><button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Shipping Etiquette</button></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Legal</h5>
                    <ul className="space-y-4">
                      <li><button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Terms of Service</button></li>
                      <li><button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline">Authenticity Guarantee</button></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-[#F5F5F0]/40 text-[10px] tracking-widest uppercase font-label">© 2024 The Obsidian Curator. All Rights Reserved.</p>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'checkout-success' && (
          <motion.div
            key="checkout-success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            {/* TopNavBar Suppression: Page intent is transactional "Success", no global nav needed */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="grow flex flex-col items-center justify-center px-6 py-12 max-w-350 mx-auto w-full">
              {/* Hero Confirmation Section */}
              <section className="w-full text-center mb-16">
                <div className="mb-8 flex justify-center">
                  <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl"></div>
                    <CheckCircle2 className="text-primary" size={48} />
                  </div>
                </div>
                <h1 className="font-headline text-5xl md:text-7xl text-on-surface tracking-tight mb-4">Your Order is Confirmed</h1>
                <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
                  We've sent details and a receipt to <span className="text-primary">alexander.vogel@curator.com</span>. Your curated selection is being prepared for transit.
                </p>
              </section>

              {/* Bento Grid Layout for Order Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                {/* Summary Column */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Transaction Details Card */}
                  <div className="glass-panel p-8 rounded-xl border border-outline-variant/10">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label">Order Reference</span>
                        <div className="flex items-center gap-2 group cursor-pointer">
                          <span className="font-mono text-xl text-on-surface">OC-9928-VX-2024</span>
                          <Copy className="text-primary/40 group-hover:text-primary transition-colors" size={16} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label">Estimated Delivery</span>
                        <p className="text-xl font-headline text-primary">October 24 — 26, 2024</p>
                      </div>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-outline-variant/10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <MapPin size={18} />
                          <span className="text-xs uppercase tracking-widest font-label">Delivery Destination</span>
                        </div>
                        <div className="text-on-surface-variant leading-relaxed">
                          <p className="text-on-surface font-semibold">Alexander Vogel</p>
                          <p>Suite 402, Obsidian Tower</p>
                          <p>88 Velvet Lane, Zurich</p>
                          <p>8001, Switzerland</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Truck size={18} />
                          <span className="text-xs uppercase tracking-widest font-label">Shipping Method</span>
                        </div>
                        <div className="text-on-surface-variant leading-relaxed">
                          <p className="text-on-surface font-semibold">Priority White-Glove</p>
                          <p>Insured global transit with climate control and specialized handling.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Actions Area */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <button 
                      onClick={() => setView('order-tracking')}
                      className="bg-primary text-on-primary px-10 py-4 rounded-lg font-label text-xs uppercase tracking-widest font-bold flex items-center gap-3 hover:shadow-[0_8px_32px_rgba(230,195,100,0.15)] transition-all active:scale-95"
                    >
                      <Activity size={18} />
                      Track Order
                    </button>
                    <button
                      onClick={handleDownloadInvoice}
                      disabled={isDownloadingInvoice}
                      className="glass-panel text-on-surface px-10 py-4 rounded-lg border border-outline-variant/30 font-label text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Download size={18} />
                      {isDownloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                    </button>
                    <button 
                      onClick={() => setView('home')}
                      className="text-on-surface-variant hover:text-primary px-6 py-4 font-label text-xs uppercase tracking-widest transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  {invoiceError && (
                    <p className="text-error text-xs font-label tracking-wide">{invoiceError}</p>
                  )}
                </div>

                {/* Items Sidebar Column */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
                    <h3 className="font-headline text-xl mb-8 flex items-center justify-between">
                      Items Ordered
                      <span className="text-sm font-body text-on-surface-variant font-normal">3 items</span>
                    </h3>
                    <div className="space-y-8">
                      {/* Item 1 */}
                      <div className="flex gap-6 group">
                        <div className="w-20 h-24 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative">
                          <img 
                            alt="Luxury Item" 
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" 
                            src="/images/local/asset-0052.png"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-on-surface font-medium leading-tight">The Obsidian Chronograph</h4>
                          <p className="text-xs text-on-surface-variant font-label uppercase tracking-tighter">Edition No. 042/100</p>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-primary text-sm font-mono">$12,400.00</span>
                          </div>
                        </div>
                      </div>
                      {/* Item 2 */}
                      <div className="flex gap-6 group">
                        <div className="w-20 h-24 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative">
                          <img 
                            alt="Luxury Item" 
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" 
                            src="/images/local/asset-0053.png"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-on-surface font-medium leading-tight">Hand-Welted Loafers</h4>
                          <p className="text-xs text-on-surface-variant font-label uppercase tracking-tighter">Mahogany / Size 42</p>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-primary text-sm font-mono">$2,850.00</span>
                          </div>
                        </div>
                      </div>
                      {/* Item 3 */}
                      <div className="flex gap-6 group">
                        <div className="w-20 h-24 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 relative">
                          <img 
                            alt="Luxury Item" 
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" 
                            src="/images/local/asset-0054.png"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-on-surface font-medium leading-tight">Geometric Sculpture Frames</h4>
                          <p className="text-xs text-on-surface-variant font-label uppercase tracking-tighter">Gold-Plated Titanium</p>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-primary text-sm font-mono">$1,100.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-outline-variant/10 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Subtotal</span>
                        <span className="text-on-surface font-mono">$16,350.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant">Insured Shipping</span>
                        <span className="text-on-surface font-mono">$125.00</span>
                      </div>
                      <div className="flex justify-between text-lg pt-4">
                        <span className="font-headline">Total</span>
                        <span className="text-primary font-mono font-bold">$16,475.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-primary/10 bg-primary/5">
                    <div className="flex gap-4 items-start">
                      <Headphones className="text-primary" size={20} />
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-label text-primary mb-1">Concierge Service</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          Your personal curator is available 24/7 for adjustments or delivery instructions. Simply reply to your confirmation email.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer suppression for transactional focus, but keeping brand identity */}
            <footer className="w-full py-12 px-12 mt-20 border-t border-outline-variant/5">
              <div className="max-w-480 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-on-surface-variant text-xs font-label uppercase tracking-[0.3em]">
                  © 2024 THE OBSIDIAN CURATOR
                </div>
                <div className="flex gap-12">
                  <button type="button" onClick={() => openInfoPage('private-suite')} className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest font-label transition-colors">Private Suite</button>
                  <button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest font-label transition-colors">Authenticity Guarantee</button>
                  <button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest font-label transition-colors">Shipping Etiquette</button>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'order-tracking' && (
          <motion.div
            key="order-tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            {/* TopNavBar */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-6xl mx-auto px-6 py-12 w-full">
              {/* Header & Status */}
              <section className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="font-mono text-primary uppercase tracking-widest text-xs mb-2">Order Tracking</p>
                  <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-4 text-on-surface">#OC-882941-LX</h1>
                  <p className="text-on-surface-variant font-body">Placed on October 24, 2024 • 2:14 PM</p>
                </div>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="font-headline font-semibold text-primary tracking-wide text-lg uppercase">Shipped</span>
                </div>
              </section>

              {/* Visual Stepper */}
              <section className="mb-20 overflow-x-auto pb-8">
                <div className="relative min-w-200 py-12">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-outline-variant -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-3/5 h-px bg-primary -translate-y-1/2"></div>
                  <div className="relative z-10 flex justify-between">
                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary mb-4 shadow-[0_0_20px_rgba(230,195,100,0.3)]">
                        <Check size={20} />
                      </div>
                      <span className="font-headline text-sm font-semibold text-on-surface">Order Placed</span>
                      <span className="font-mono text-[10px] text-on-surface-variant mt-1 italic">Oct 24</span>
                    </div>
                    {/* Step 2: Confirmed */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary mb-4 shadow-[0_0_20px_rgba(230,195,100,0.3)]">
                        <Check size={20} />
                      </div>
                      <span className="font-headline text-sm font-semibold text-on-surface">Confirmed</span>
                      <span className="font-mono text-[10px] text-on-surface-variant mt-1 italic">Oct 24</span>
                    </div>
                    {/* Step 3: Packed */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary mb-4 shadow-[0_0_20px_rgba(230,195,100,0.3)]">
                        <Check size={20} />
                      </div>
                      <span className="font-headline text-sm font-semibold text-on-surface">Packed</span>
                      <span className="font-mono text-[10px] text-on-surface-variant mt-1 italic">Oct 25</span>
                    </div>
                    {/* Step 4: Shipped (ACTIVE) */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 -mt-2 rounded-full bg-primary flex items-center justify-center text-on-primary mb-2 shadow-[0_0_30px_rgba(230,195,100,0.5)] ring-4 ring-primary/20">
                        <Truck size={24} />
                      </div>
                      <span className="font-headline text-base font-bold text-primary tracking-tight">Shipped</span>
                      <span className="font-mono text-[10px] text-primary/80 mt-1 italic">Oct 26</span>
                    </div>
                    {/* Step 5: Out for Delivery */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface-variant mb-4">
                        <Package size={20} />
                      </div>
                      <span className="font-headline text-sm font-semibold text-on-surface-variant">Out for Delivery</span>
                      <span className="font-mono text-[10px] text-on-surface-variant/40 mt-1 italic">Expected Oct 28</span>
                    </div>
                    {/* Step 6: Delivered */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface-variant mb-4">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="font-headline text-sm font-semibold text-on-surface-variant">Delivered</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bento Grid Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Shipment Details Card */}
                <div className="lg:col-span-2 glass-panel p-10 rounded-xl border border-outline-variant/10">
                  <div className="flex items-center gap-4 mb-8">
                    <Route className="text-primary" size={32} />
                    <h2 className="font-headline text-2xl font-bold text-on-surface">Shipment Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Truck size={24} />
                        </div>
                        <div>
                          <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">Tracking Number</p>
                          <a className="font-mono text-primary text-lg flex items-center gap-2 hover:underline" href="#">
                            TRK-990-2184-XP
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface-container-high/40 p-6 rounded-lg border border-outline-variant/30">
                      <div className="flex items-center gap-4 mb-4">
                        <img loading="lazy" className="w-12 h-12 rounded-full object-cover grayscale brightness-110" src="/images/local/asset-0055.png" alt="Designated Driver Avatar" />
                        <div>
                          <p className="font-label text-[10px] uppercase text-on-surface-variant">Designated Driver</p>
                          <p className="font-body font-bold text-on-surface">Julien Vasseur</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-primary text-on-primary py-2 px-4 rounded font-label text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                          <PhoneCall size={14} /> Contact
                        </button>
                        <button className="flex-1 bg-surface-container-highest text-on-surface py-2 px-4 rounded font-label text-xs font-bold hover:bg-surface-bright transition-all flex items-center justify-center gap-2">
                          <MessageSquare size={14} /> Message
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-outline-variant/20">
                    <h3 className="font-headline text-lg font-semibold mb-6 text-on-surface">Recent Activity</h3>
                    <div className="space-y-8">
                      <div className="flex gap-6">
                        <div className="font-mono text-xs text-on-surface-variant pt-1 w-20">10:45 AM</div>
                        <div>
                          <p className="font-body font-semibold text-on-surface">Departed from Sorting Facility</p>
                          <p className="text-xs text-on-surface-variant">Lyon, France Regional Hub</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="font-mono text-xs text-on-surface-variant pt-1 w-20">08:12 AM</div>
                        <div>
                          <p className="font-body font-semibold text-on-surface">Quality Inspection Completed</p>
                          <p className="text-xs text-on-surface-variant">Passed 14-point luxury protocol</p>
                        </div>
                      </div>
                      <div className="flex gap-6 opacity-60">
                        <div className="font-mono text-xs text-on-surface-variant pt-1 w-20">Oct 25</div>
                        <div>
                          <p className="font-body font-semibold text-on-surface">Package Sanitized & Sealed</p>
                          <p className="text-xs text-on-surface-variant">Obsidian Signature Vault Packing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Info: Address & Items */}
                <div className="space-y-8">
                  {/* Delivery Address */}
                  <div className="glass-panel p-8 rounded-xl border border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="text-primary" size={24} />
                      <h2 className="font-headline text-xl font-bold text-on-surface">Delivery Destination</h2>
                    </div>
                    <div className="font-body space-y-1">
                      <p className="font-bold text-on-surface">Victor Saint-Clair</p>
                      <p className="text-on-surface-variant">Avenue Montaigne, 75</p>
                      <p className="text-on-surface-variant">8th Arrondissement</p>
                      <p className="text-on-surface-variant">Paris, 75008</p>
                      <p className="text-on-surface-variant">France</p>
                    </div>
                    <div className="mt-6 aspect-video rounded-lg overflow-hidden grayscale brightness-50 contrast-125 border border-outline-variant/30">
                      <img loading="lazy" className="w-full h-full object-cover" src="/images/local/asset-0056.png" alt="Luxury Interior Showcase" />
                    </div>
                  </div>
                  {/* Items in Shipment */}
                  <div className="glass-panel p-8 rounded-xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-headline text-xl font-bold text-on-surface">Your Selection</h2>
                      <span className="font-mono text-xs px-2 py-1 bg-surface-container-highest rounded text-on-surface">3 Items</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex gap-4 group">
                        <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden shrink-0">
                          <img loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="/images/local/asset-0057.png" alt="Obsidian Heritage Signature" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-headline text-sm font-semibold leading-tight text-on-surface">Noire Saffiano Tote</p>
                          <p className="font-mono text-[10px] text-on-surface-variant">SKU: OBS-7721</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group">
                        <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden shrink-0">
                          <img loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="/images/local/asset-0058.png" alt="Premium Crafted Essence" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-headline text-sm font-semibold leading-tight text-on-surface">Eclipse Chronometer</p>
                          <p className="font-mono text-[10px] text-on-surface-variant">SKU: CLK-0094</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group opacity-50">
                        <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden shrink-0">
                          <img loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="/images/local/asset-0059.png" alt="Artisanal Leather Craft" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-headline text-sm font-semibold leading-tight text-on-surface">Velvet Step Loafers</p>
                          <p className="font-mono text-[10px] text-on-surface-variant">SKU: SHO-1105</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-8 py-3 border-t border-outline-variant/20 font-label text-xs uppercase tracking-widest text-primary hover:text-on-surface transition-colors">
                      View Order Details
                    </button>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-lowest w-full mt-20 border-t border-outline-variant/5 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto font-headline text-xs leading-relaxed">
                <div className="col-span-1">
                  <div className="text-lg font-bold text-primary mb-4">The Obsidian Curator</div>
                  <p className="text-on-surface-variant max-w-xs">Curating the world's finest artifacts for the discerning soul. Experience the pinnacle of digital luxury.</p>
                </div>
                <div>
                  <h4 className="text-primary font-bold mb-6 uppercase tracking-widest">Concierge</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => openInfoPage('private-suite')} className="text-on-surface-variant hover:text-primary transition-colors">Private Suite</button></li>
                    <li><button onClick={() => openInfoPage('shipping-etiquette')} className="text-on-surface-variant hover:text-primary transition-colors">Shipping Etiquette</button></li>
                    <li><button onClick={() => openInfoPage('authenticity-guarantee')} className="text-on-surface-variant hover:text-primary transition-colors">Authenticity Guarantee</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary font-bold mb-6 uppercase tracking-widest">Legal</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => openInfoPage('terms-of-service')} className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</button></li>
                    <li><button className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</button></li>
                    <li><button className="text-on-surface-variant hover:text-primary transition-colors">Cookie Policy</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary font-bold mb-6 uppercase tracking-widest">Subscribe</h4>
                  <p className="text-on-surface-variant mb-4">Join our inner circle for exclusive curation drops.</p>
                  <div className="flex">
                    <input className="bg-surface-container-low border-none text-on-surface text-xs px-4 py-2 w-full focus:ring-1 focus:ring-primary" placeholder="Email Address" type="email" />
                    <button className="bg-primary text-on-primary px-4 font-bold uppercase tracking-tighter">Join</button>
                  </div>
                </div>
              </div>
              <div className="border-t border-outline-variant/5 py-8 text-center text-on-surface-variant/20 text-[10px] tracking-widest uppercase font-label">
                © 2024 The Obsidian Curator. All Rights Reserved.
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'my-orders' && (
          <motion.div
            key="my-orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            {/* TopNavBar */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <div className="flex max-w-480 mx-auto min-h-screen w-full">
              {/* SideNavBar */}
              <aside className="fixed left-0 top-0 h-full w-80 z-60 bg-surface-container-lowest flex-col p-6 gap-8 border-r border-outline-variant/10 shadow-[20px_0_60px_rgba(0,0,0,0.5)] hidden xl:flex pt-24">
                <div>
                  <div className="flex flex-col mb-12">
                    <span className="text-primary font-black font-headline text-sm uppercase tracking-widest">Filter Gallery</span>
                    <span className="text-on-surface-variant/40 text-[10px] uppercase tracking-widest">Refine your selection</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button className="flex items-center gap-4 p-3 text-on-surface-variant/40 hover:text-on-surface hover:translate-x-1 transition-transform duration-200 font-headline text-sm uppercase tracking-widest">
                      <LayoutGridIcon size={18} /> Categories
                    </button>
                    <button className="flex items-center gap-4 p-3 text-on-surface-variant/40 hover:text-on-surface hover:translate-x-1 transition-transform duration-200 font-headline text-sm uppercase tracking-widest">
                      <DollarSignIcon size={18} /> Price Range
                    </button>
                    <button className="flex items-center gap-4 p-3 text-on-surface-variant/40 hover:text-on-surface hover:translate-x-1 transition-transform duration-200 font-headline text-sm uppercase tracking-widest">
                      <AwardIcon size={18} /> Designer Brands
                    </button>
                    <button className="flex items-center gap-4 p-3 text-primary bg-surface-container-highest/30 rounded-lg transition-transform duration-200 font-headline text-sm uppercase tracking-widest">
                      <StarIcon size={18} fill="currentColor" /> Client Ratings
                    </button>
                    <button className="flex items-center gap-4 p-3 text-on-surface-variant/40 hover:text-on-surface hover:translate-x-1 transition-transform duration-200 font-headline text-sm uppercase tracking-widest">
                      <PackageIcon size={18} /> Availability
                    </button>
                  </div>
                </div>
                <div className="mt-auto border-t border-outline-variant/10 pt-6">
                  <button className="flex items-center gap-4 p-3 text-on-surface-variant/40 hover:text-primary transition-colors font-headline text-xs uppercase tracking-widest">
                    <RotateCcw size={16} /> Clear All
                  </button>
                  <button className="w-full bg-primary text-on-primary py-4 px-6 rounded-lg font-bold text-xs uppercase tracking-widest mt-4 hover:opacity-90 transition-opacity">Apply Filters</button>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 xl:ml-80 px-8 py-12 md:px-20 lg:py-24">
                <header className="mb-16">
                  <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface mb-8 tracking-tighter">My Acquisitions</h1>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit overflow-x-auto no-scrollbar">
                      {['ALL', 'PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button 
                          key={status}
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${orderStatusFilter === status ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </header>

                {/* Orders Grid */}
                <div className="space-y-8">
                  {isLoading ? (
                    <div className="flex justify-center py-20">
                      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : myOrders.length > 0 ? (
                    myOrders.map((order) => (
                      <div key={order.orderId} className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-outline-variant/10">
                        <div className="p-8 flex flex-col md:flex-row gap-12">
                          <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-semibold italic">Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                <h3 className="font-mono text-lg text-primary font-bold">#{order.orderId}</h3>
                              </div>
                              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full border ${
                                order.status === 'DELIVERED' ? 'bg-primary/10 text-primary border-primary/20' : 
                                order.status === 'CANCELLED' ? 'bg-error/10 text-error border-error/20' : 
                                'bg-secondary-container/20 text-secondary border-secondary/20'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                              {order.items.slice(0, 3).map((item: any, idx: number) => (
                                <div key={idx} className="w-20 h-24 rounded-lg overflow-hidden border-2 border-surface-container-lowest shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                                   <img 
                                     src={item.productImage || "/images/local/asset-0060.png"} 
                                     alt="Product" 
                                     className="w-full h-full object-cover" 
                                     onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/local/asset-0060.png"; }}
                                    />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-20 h-24 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-surface-container-lowest shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                                  <span className="text-xs font-bold text-outline">+{order.items.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-on-surface-variant font-medium">{order.totalItems} Items total • <span className="text-on-surface">Payment: {order.paymentStatus}</span></p>
                          </div>
                          <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/10 pt-8 md:pt-0 md:pl-12">
                            <div className="mb-8 md:mb-0">
                              <p className="text-[10px] uppercase tracking-widest text-outline mb-1">Total Amount</p>
                              <p className="text-3xl font-headline font-bold text-on-surface">${order.totalAmount.toFixed(2)}</p>
                            </div>
                            <div className="space-y-3">
                              <button 
                                onClick={() => { setSelectedOrder(order); setView('order-tracking'); }}
                                className="w-full py-3 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                              >
                                <TruckIcon size={14} /> Track Order
                              </button>
                              <button 
                                onClick={() => { setSelectedOrder(order); setView('order-detail'); }}
                                className="w-full py-3 glass-panel border border-outline-variant/30 text-on-surface rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-outline-variant/20 rounded-3xl">
                      <PackageIcon size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
                      <p className="text-on-surface-variant/60 font-headline text-lg">Your acquisition history is currently blank.</p>
                      <button onClick={() => setView('shop')} className="mt-6 text-primary font-bold uppercase text-[10px] tracking-widest hover:underline">Explore Boutique</button>
                    </div>
                  )}
                </div>
              </main>
            </div>

            {/* Footer */}
            <footer className="w-full mt-20 bg-surface-container-lowest border-t border-outline-variant/5 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto">
                <div className="col-span-1 md:col-span-1">
                  <p className="text-lg font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</p>
                  <p className="text-on-surface-variant/40 text-xs leading-relaxed font-headline">
                    Elevating the digital gallery experience. Every piece is curated, every interaction is an exhibit of luxury.
                  </p>
                </div>
                <div>
                  <h4 className="text-primary text-xs uppercase tracking-widest font-bold mb-6 font-headline">Collection</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => openInfoPage('private-suite')} className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Private Suite</button></li>
                    <li><button onClick={() => openInfoPage('authenticity-guarantee')} className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Authenticity Guarantee</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary text-xs uppercase tracking-widest font-bold mb-6 font-headline">Service</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => openInfoPage('shipping-etiquette')} className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Shipping Etiquette</button></li>
                    <li><button onClick={() => openInfoPage('terms-of-service')} className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Terms of Service</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary text-xs uppercase tracking-widest font-bold mb-6 font-headline">Newsletter</h4>
                  <form className="relative" onSubmit={handleNewsletterSubmit}>
                    <input
                      className="w-full border-b border-outline-variant/30 text-xs py-2 focus:border-primary transition-all bg-transparent outline-none"
                      placeholder="Concierge Email"
                      type="email"
                      value={newsletterEmail}
                      disabled={isSubmittingNewsletter}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" disabled={isSubmittingNewsletter} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary disabled:opacity-60">
                      <ArrowRight size={16} />
                    </button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80 mt-2">{newsletterMessage}</p>}
                  {isSubmittingNewsletter && <p className="text-[10px] text-primary/70 mt-2">Submitting...</p>}
                </div>
              </div>
              <div className="px-12 pb-12">
                <p className="text-on-surface-variant/40 text-[10px] font-headline text-center">© 2024 The Obsidian Curator. All Rights Reserved.</p>
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'order-detail' && selectedOrder && (
          <motion.div
            key="order-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen bg-background"
          >
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-4xl mx-auto w-full px-6 py-12 md:py-24 space-y-12">
              <button 
                onClick={() => setView('my-orders')}
                className="flex items-center gap-2 text-on-surface-variant/60 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> Back to Acquisitions
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/10 pb-8">
                <div>
                  <h1 className="text-4xl font-headline font-bold text-on-surface mb-2">Acquisition Dossier</h1>
                  <p className="font-mono text-primary font-bold">#{selectedOrder.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
                  <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-black rounded-full border border-primary/20">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                  <h3 className="text-xl font-headline font-semibold">Manifest Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-6 p-4 rounded-xl bg-surface-container-low/40 border border-outline-variant/10">
                        <div className="w-24 h-28 rounded-lg overflow-hidden border border-outline-variant/20">
                          <img 
                            src={item.productImage || "/images/local/asset-0060.png"} 
                            alt={item.productName} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/local/asset-0060.png"; }}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="font-headline text-lg text-on-surface">{item.productName}</h4>
                            <p className="text-xs text-on-surface-variant/60">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-primary font-mono font-bold">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-6 rounded-xl bg-surface-container-highest/20 border border-outline-variant/10 space-y-6">
                    <h3 className="text-sm font-headline font-bold uppercase tracking-widest text-primary border-b border-primary/10 pb-4">Acquisition Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant/60">Subtotal</span>
                        <span className="text-on-surface">${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-on-surface-variant/60">Shipping</span>
                        <span className="text-primary font-bold">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-sm pt-4 border-t border-outline-variant/10">
                        <span className="font-bold uppercase tracking-widest text-[10px]">Total</span>
                        <span className="text-xl font-headline font-bold text-on-surface">${selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl border border-outline-variant/10 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/60">Shipping Information</h3>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-on-surface">{selectedOrder.fullName}</p>
                      <p className="text-on-surface-variant">{selectedOrder.shippingAddress}</p>
                      <p className="text-on-surface-variant">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}</p>
                      <p className="text-on-surface-variant/60 pt-2 font-mono">{selectedOrder.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        )}
        {view === 'wishlist' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Curated Wishlist"
            description="A digital sanctuary for your most coveted acquisitions. Refined, timeless, and awaiting your final directive."
          >
            <div className="flex flex-col gap-12">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-surface-container-highest border border-outline-variant/30 rounded-lg text-sm tracking-widest uppercase font-label hover:bg-surface-container-high transition-colors group">
                  <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                  Share Link
                </button>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {wishlistItems.map((item) => (
                    <motion.div 
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex flex-col space-y-6"
                    >
                      <div className="aspect-4/5 overflow-hidden bg-surface-container-lowest rounded-sm relative">
                        <img 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700 ease-out" 
                          src={item.img}
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-4 right-4 p-2 bg-background/40 backdrop-blur-md rounded-full text-on-surface hover:text-error transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[10px] text-primary/60 tracking-widest uppercase">SKU: {item.sku}</span>
                            <h3 className="text-xl font-headline font-semibold text-on-surface mt-1">{item.name}</h3>
                          </div>
                          <span className="font-headline text-lg text-primary">${item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => moveToCart(item)}
                            className="flex-1 bg-primary text-on-primary font-label text-[11px] uppercase tracking-widest py-4 rounded-sm hover:brightness-110 transition-all active:scale-95"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 space-y-8 border border-dashed border-outline-variant/20 rounded-2xl bg-surface-container-lowest/30">
                  <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant/20">
                    <Heart size={48} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-headline font-bold text-on-surface">Your Vault is Empty</h3>
                    <p className="text-on-surface-variant max-w-xs mx-auto">The archive awaits your selection. Explore our boutique to begin your curation.</p>
                  </div>
                  <button 
                    onClick={() => setView('shop')}
                    className="px-10 py-4 bg-primary text-on-primary font-label text-xs uppercase tracking-[0.2em] rounded-sm hover:scale-105 transition-transform"
                  >
                    Explore Boutique
                  </button>
                </div>
              )}
            </div>
          </ProfileViewLayout>
        )}
        {view === 'profile' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Personal Vault"
            description="Refine your curatorial identity. Manage your private profile details and shipping preferences for an unparalleled boutique experience."
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              {/* Profile Main Section */}
              <div className="xl:col-span-8 flex flex-col gap-12">
                <div className="bg-surface-container-lowest/50 backdrop-blur-xl p-10 rounded-xl relative overflow-hidden group border border-outline-variant/10">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Fingerprint className="text-[120px] text-primary" size={120} />
                  </div>
                  <div className="flex flex-col md:flex-row gap-10 items-start md:items-center relative z-10">
                    <div className="relative group/avatar">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/20 p-1">
                        <img 
                          loading="lazy" 
                          className="w-full h-full object-cover rounded-full" 
                          alt="Curator Identity" 
                          src={profileFormData.avatarUrl || "/images/local/asset-0064.png"} 
                          referrerPolicy="no-referrer" 
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/local/asset-0064.png"; }}
                        />
                      </div>
                      <label className="absolute bottom-2 right-2 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center cursor-pointer">
                        <Camera size={16} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-headline text-on-surface">{profileFormData.name || 'Curator Identity'}</h3>
                      <p className="text-on-surface-variant text-sm uppercase tracking-widest">Member since Oct 2023</p>
                      <div className="flex gap-3 mt-4">
                        <span className="px-4 py-1.5 bg-surface-container-highest/50 border border-outline-variant/30 text-primary text-[10px] uppercase tracking-widest rounded-full flex items-center gap-2">
                          <CheckCircle2 size={12} fill="currentColor" />
                          Verified Account
                        </span>
                        <span className="px-4 py-1.5 bg-primary/10 border border-primary/30 text-primary text-[10px] uppercase tracking-widest rounded-full">
                          Elite Collector
                        </span>
                      </div>
                    </div>
                  </div>

                  {profileError && (
                    <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-xs uppercase tracking-widest font-bold">
                      {profileError}
                    </div>
                  )}
                  {profileSuccess && (
                    <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs uppercase tracking-widest font-bold">
                      {profileSuccess}
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-12">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Full Name</label>
                      <input 
                        value={profileFormData.name}
                        onChange={(e) => setProfileFormData({...profileFormData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" 
                        type="text" 
                        placeholder="Alexander Vance"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Private Email</label>
                      <div className="relative">
                        <input 
                          value={profileFormData.email}
                          readOnly
                          className="w-full bg-transparent border-b border-outline-variant opacity-50 cursor-not-allowed py-4 px-1 text-on-surface font-headline text-lg outline-none" 
                          type="email"
                        />
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
                          <CheckCircle2 size={14} fill="currentColor" />
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Phone Connection</label>
                      <input 
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({...profileFormData, phone: e.target.value})}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" 
                        type="tel" 
                        placeholder="+1 (555) 001-2834"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Date of Origin</label>
                      <input 
                        value={profileFormData.dob}
                        onChange={(e) => setProfileFormData({...profileFormData, dob: e.target.value})}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" 
                        placeholder="YYYY-MM-DD" 
                        type="date"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Identity Preference</label>
                      <select 
                        value={profileFormData.gender}
                        onChange={(e) => setProfileFormData({...profileFormData, gender: e.target.value})}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none appearance-none"
                      >
                        <option value="Prefer not to state" className="bg-background">Prefer not to state</option>
                        <option value="Masculine" className="bg-background">Masculine</option>
                        <option value="Feminine" className="bg-background">Feminine</option>
                        <option value="Non-binary" className="bg-background">Non-binary</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 mt-16 flex justify-end">
                      <button type="submit" className="px-10 py-4 bg-primary text-on-primary rounded-lg font-headline font-bold uppercase tracking-widest hover:bg-primary-container transition-all shadow-[0_4px_24px_rgba(230,195,100,0.15)] active:scale-95">
                        Save Manifest
                      </button>
                    </div>
                  </form>
                </div>

                {/* Recent Acquisitions Section */}
                <div className="bg-surface-container-lowest/50 backdrop-blur-xl p-10 rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-headline text-on-surface">Recent Acquisitions</h3>
                    <button 
                      onClick={() => setView('my-orders')}
                      className="text-primary text-xs uppercase tracking-widest font-bold hover:underline"
                    >
                      View All History
                    </button>
                  </div>
                  <div className="space-y-6">
                    {[
                      { id: 'OC-82910-VX', date: 'Oct 14, 2024', status: 'In Transit', total: '$2,450.00', items: 3 },
                      { id: 'OC-77124-AQ', date: 'Sep 28, 2024', status: 'Delivered', total: '$12,800.00', items: 1 }
                    ].map((order, i) => (
                      <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-lg bg-surface-container-low/40 border border-outline-variant/10 group hover:border-primary/30 transition-all">
                        <div className="flex gap-6 items-center">
                          <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-mono text-sm text-on-surface font-bold">{order.id}</p>
                            <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{order.date} • {order.items} Items</p>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-8">
                          <div className="text-right">
                            <p className="font-headline text-lg text-on-surface">{order.total}</p>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${order.status === 'Delivered' ? 'text-primary' : 'text-secondary'}`}>
                              {order.status}
                            </span>
                          </div>
                          <button 
                            onClick={() => setView('order-tracking')}
                            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <ArrowRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Secondary Column */}
              <div className="xl:col-span-4 flex flex-col gap-12">
                {/* Addresses Preview */}
                <div className="bg-surface-container-lowest/50 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-headline text-xl text-on-surface">Private Residences</h3>
                    <button 
                      onClick={() => setView('profile-addresses')}
                      className="text-primary text-xs uppercase tracking-widest font-bold hover:underline"
                    >
                      Add New
                    </button>
                  </div>
                  <div className="space-y-6">
                    {addresses.length > 0 ? (
                      <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 flex gap-4">
                        <Home className="text-primary-container" size={20} />
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">
                            {addresses[0].addressType} {addresses[0].isDefault ? '(Primary)' : ''}
                          </p>
                          <p className="text-on-surface text-sm">{addresses[0].street}</p>
                          <p className="text-on-surface/60 text-xs">{addresses[0].city}, {addresses[0].state} {addresses[0].pincode}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant/40 italic">No residences recorded.</p>
                    )}
                  </div>
                </div>
                {/* Security Highlight */}
                <div className="bg-linear-to-br from-surface-container-highest to-surface-container-low p-8 rounded-xl border border-primary/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lock className="text-primary" size={20} />
                    </div>
                    <h4 className="font-headline text-lg">Vault Protection</h4>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">Two-factor authentication is active on your account. Your personal data is encrypted with 256-bit protocol.</p>
                  <button 
                    onClick={() => setView('profile-security')}
                    className="w-full py-3 border border-outline-variant rounded-lg text-xs uppercase tracking-[0.2em] font-bold hover:bg-surface-container-highest transition-colors"
                  >
                    Manage Credentials
                  </button>
                </div>

                {/* Wishlist Preview */}
                <div className="bg-surface-container-lowest/50 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-headline text-xl text-on-surface">Wishlist Preview</h3>
                    <button 
                      onClick={() => setView('wishlist')}
                      className="text-primary text-xs uppercase tracking-widest font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {wishlistItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant/10">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setView('shop')}
                            className="p-2 bg-on-surface text-background rounded-full hover:bg-primary transition-colors"
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {wishlistItems.length === 0 && (
                      <div className="col-span-2 py-8 text-center border-2 border-dashed border-outline-variant/20 rounded-xl">
                        <Heart className="mx-auto text-on-surface-variant/20 mb-2" size={24} />
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">Your vault is empty</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ProfileViewLayout>
        )}

        {view === 'profile-addresses' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Private Residences"
            description="Manage your global shipping destinations. Curate your primary estates and metropolitan suites for seamless acquisition delivery."
          >
            <div className="flex flex-col gap-8">
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => {
                    if (!showAddressForm) {
                      setAddressFormData({ fullName: '', phone: '', pincode: '', addressType: 'HOME', street: '', city: '', state: '' });
                      setIsEditingAddress(false);
                      setEditingAddressId(null);
                    }
                    setShowAddressForm(!showAddressForm);
                  }} 
                  className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline text-xs uppercase tracking-widest hover:bg-primary-container transition-all"
                >
                  {showAddressForm ? 'Cancel' : 'Add New Residence'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddressSubmit} className="pt-8 border-t border-outline-variant/10">
                  {addressError && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-xs uppercase tracking-widest font-bold">
                      {addressError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                      <input required value={addressFormData.fullName} onChange={(e) => setAddressFormData({...addressFormData, fullName: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text"/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                      <input required value={addressFormData.phone} onChange={(e) => setAddressFormData({...addressFormData, phone: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="tel"/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Pincode</label>
                      <input required value={addressFormData.pincode} onChange={(e) => setAddressFormData({...addressFormData, pincode: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text"/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Address Type</label>
                      <div className="flex gap-4 py-1">
                        <button type="button" onClick={() => setAddressFormData({...addressFormData, addressType: 'HOME'})} className={`px-4 py-2 rounded-full border ${addressFormData.addressType === 'HOME' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'} text-[10px] transform-none transition-colors`}>Home</button>
                        <button type="button" onClick={() => setAddressFormData({...addressFormData, addressType: 'WORK'})} className={`px-4 py-2 rounded-full border ${addressFormData.addressType === 'WORK' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'} text-[10px] transform-none transition-colors`}>Work</button>
                        <button type="button" onClick={() => setAddressFormData({...addressFormData, addressType: 'OTHER'})} className={`px-4 py-2 rounded-full border ${addressFormData.addressType === 'OTHER' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'} text-[10px] transform-none transition-colors`}>Other</button>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Address Line 1</label>
                      <input required value={addressFormData.street} onChange={(e) => setAddressFormData({...addressFormData, street: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text"/>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">City</label>
                      <input required value={addressFormData.city} onChange={(e) => setAddressFormData({...addressFormData, city: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">State</label>
                      <input required value={addressFormData.state} onChange={(e) => setAddressFormData({...addressFormData, state: e.target.value})} className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text" />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-4">
                    <button type="submit" className="px-6 py-3 bg-primary text-on-primary rounded font-headline text-xs tracking-widest uppercase">{isEditingAddress ? 'Update Residence' : 'Save Address'}</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-8 rounded-xl bg-surface-container-lowest border border-primary/20 relative group">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleEditAddress(addr)}
                        className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Home size={24} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{addr.addressType}</span>
                        <h4 className="text-xl font-headline text-on-surface">{addr.fullName}</h4>
                        <p className="text-on-surface-variant font-light">{addr.street}</p>
                        <p className="text-on-surface-variant font-light">{addr.city}, {addr.state} {addr.pincode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProfileViewLayout>
        )}

        {view === 'profile-payments' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Payment Methods"
            description="Secure your financial conduits. Manage your encrypted payment instruments for swift and secure transactions."
          >
            <div className="flex flex-col gap-8">
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline text-xs uppercase tracking-widest hover:bg-primary-container transition-all"
                >
                  {showPaymentForm ? 'Cancel' : 'Add Payment Method'}
                </button>
              </div>

              {showPaymentForm && (
                <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
                  <h4 className="font-headline text-xl mb-6">Initialize New Instrument</h4>
                  <form onSubmit={handleAddPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Card Holder Name</label>
                       <input 
                          required
                          className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                          placeholder="Alex Johnson"
                          value={paymentFormData.cardHolderName}
                          onChange={e => setPaymentFormData({...paymentFormData, cardHolderName: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Card Number</label>
                      <input 
                         required
                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                         placeholder="4111 1111 1111 1111"
                         value={paymentFormData.cardNumber}
                         onChange={e => setPaymentFormData({...paymentFormData, cardNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Expiry (MM/YY)</label>
                      <input 
                         required
                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                         placeholder="12/29"
                         value={paymentFormData.expiryDate}
                         onChange={e => setPaymentFormData({...paymentFormData, expiryDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">CVV</label>
                      <input 
                         required
                         className="w-full bg-surface-container-highest border-0 border-b border-outline-variant py-3 px-2 focus:border-primary outline-none" 
                         placeholder="123"
                         value={paymentFormData.cvv}
                         onChange={e => setPaymentFormData({...paymentFormData, cvv: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4">
                      <button type="submit" className="bg-primary text-on-primary px-10 py-4 rounded-lg font-bold uppercase tracking-widest text-xs">Authorize Instrument</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-on-surface">
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="p-8 rounded-xl bg-linear-to-br from-[#1a1a1f] to-[#2a2a30] border border-outline-variant/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <CreditCardIcon size={120} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-8 bg-surface-container-highest/30 rounded flex items-center justify-center">
                          <div className="w-8 h-5 bg-primary/20 rounded-sm"></div>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">CARD</span>
                      </div>
                      <div className="space-y-4">
                        <p className="text-2xl font-mono tracking-[0.2em]">{pm.maskedCardNumber}</p>
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Cardholder</p>
                            <p className="text-sm font-headline uppercase">{pm.cardHolderName}</p>
                          </div>
                          {pm.expiryDate && (
                            <div className="space-y-1 text-right">
                              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Expires</p>
                              <p className="text-sm font-headline">{pm.expiryDate}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {paymentMethods.length === 0 && (
                  <div className="md:col-span-2 py-20 text-center border-2 border-dashed border-outline-variant/20 rounded-3xl">
                    <CreditCardIcon size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
                    <p className="text-on-surface-variant/60 font-headline">No stored instruments.</p>
                  </div>
                )}
              </div>
            </div>
          </ProfileViewLayout>
        )}

        {view === 'profile-notifications' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Notification Center"
            description="Control your digital correspondence. Tailor your alerts for new acquisitions, order updates, and exclusive curatorial insights."
          >
            <div className="space-y-12">
              <div className="bg-surface-container-lowest/50 backdrop-blur-xl rounded-xl border border-outline-variant/10 overflow-hidden">
                <div className="p-6 border-b border-outline-variant/10">
                  <h3 className="text-xl font-headline font-semibold">Preferences</h3>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {[
                    { key: 'orderUpdates', title: 'Order Updates', desc: 'Receive alerts regarding your acquisition status and delivery.', icon: Package },
                    { key: 'newCollections', title: 'New Collections', desc: 'Be the first to know when new curated series are unveiled.', icon: Sparkles },
                    { key: 'securityAlerts', title: 'Security Alerts', desc: 'Critical notifications regarding your vault access and identity.', icon: Lock },
                    { key: 'newsletter', title: 'Newsletter', desc: 'Monthly insights into the world of digital luxury and curation.', icon: Mail }
                  ].map((item) => (
                    <div key={item.key} className="p-8 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
                      <div className="flex gap-6 items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <h4 className="text-lg font-headline text-on-surface">{item.title}</h4>
                          <p className="text-sm text-on-surface-variant font-light">{item.desc}</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={!!(notifications as any)[item.key]} 
                          onChange={(e) => handleToggleNotification(item.key as any, e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-2xl font-headline font-semibold px-2">Acquisition Feed</h3>
                 <div className="space-y-4">
                    {userNotifications.map((notif) => (
                      <div key={notif.id} className={`p-6 rounded-xl border border-outline-variant/10 transition-all ${notif.read ? 'bg-surface-container-lowest/30 opacity-60' : 'bg-surface-container-lowest shadow-lg border-primary/20'}`}>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-headline font-bold text-on-surface">{notif.title}</h4>
                           <span className="text-[10px] text-on-surface-variant font-mono">{new Date(notif.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{notif.message}</p>
                        {!notif.read && (
                          <button 
                            onClick={async () => {
                              await notificationApi.markAsRead(notif.id);
                              fetchNotifications();
                            }}
                            className="mt-4 text-[10px] uppercase tracking-widest text-primary font-bold hover:underline"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    ))}
                    {userNotifications.length === 0 && (
                      <div className="py-20 text-center border-2 border-dashed border-outline-variant/20 rounded-3xl">
                        <BellOff size={48} className="mx-auto text-on-surface-variant/20 mb-4" />
                        <p className="text-on-surface-variant/60 font-headline">Your feed is current.</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </ProfileViewLayout>
        )}

        {view === 'profile-security' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Vault Security"
            description="Fortify your digital presence. Manage your credentials, active sessions, and multi-factor authentication protocols."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Key size={24} />
                  </div>
                  <h4 className="text-xl font-headline">Change Password</h4>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  {securityError && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-[10px] uppercase tracking-widest font-bold">
                      {securityError}
                    </div>
                  )}
                  {securitySuccess && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-[10px] uppercase tracking-widest font-bold">
                      {securitySuccess}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Current Password</label>
                    <input 
                      required
                      value={securityFormData.currentPassword}
                      onChange={(e) => setSecurityFormData({...securityFormData, currentPassword: e.target.value})}
                      className="w-full bg-transparent border-b border-outline-variant focus:border-primary py-3 outline-none" 
                      type="password" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">New Password</label>
                    <input 
                      required
                      value={securityFormData.newPassword}
                      onChange={(e) => setSecurityFormData({...securityFormData, newPassword: e.target.value})}
                      className="w-full bg-transparent border-b border-outline-variant focus:border-primary py-3 outline-none" 
                      type="password" 
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-surface-container-highest text-on-surface font-headline text-xs uppercase tracking-widest rounded-lg hover:bg-primary hover:text-on-primary transition-all">Update Credentials</button>
                </form>
              </div>
              <div className="p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="text-xl font-headline">Two-Factor Auth</h4>
                </div>
                <p className="text-on-surface-variant text-sm font-light leading-relaxed">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
                  <span className="text-sm font-headline">Status: <span className={`uppercase tracking-widest font-bold ${profileFormData.twoFactorEnabled ? 'text-primary' : 'text-on-surface-variant/40'}`}>{profileFormData.twoFactorEnabled ? 'Active' : 'Disabled'}</span></span>
                  <button 
                    onClick={() => handleToggle2FA(!profileFormData.twoFactorEnabled)}
                    className={`text-xs uppercase tracking-widest font-bold transition-colors ${profileFormData.twoFactorEnabled ? 'text-on-surface-variant hover:text-error' : 'text-primary hover:brightness-110'}`}
                  >
                    {profileFormData.twoFactorEnabled ? 'Deactivate' : 'Activate Portal'}
                  </button>
                </div>
              </div>
            </div>
          </ProfileViewLayout>
        )}

        {view === 'profile-help' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            title="Concierge Support"
            description="Our dedicated team is at your disposal. Access our curated knowledge base or connect with a personal concierge for assistance."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Knowledge Base', desc: 'Explore our archive of frequently asked questions and guides.', icon: BookOpen },
                { title: 'Live Concierge', desc: 'Connect with a dedicated support specialist for immediate aid.', icon: MessageSquare },
                { title: 'Email Inquiry', desc: 'Send a formal request to our curatorial support team.', icon: Mail }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-xl bg-surface-container-lowest border border-outline-variant/10 hover:border-primary/30 transition-all group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <item.icon size={28} />
                  </div>
                  <h4 className="text-xl font-headline text-on-surface mb-2">{item.title}</h4>
                  <p className="text-sm text-on-surface-variant font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </ProfileViewLayout>
        )}


        {view === 'category-timepieces' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="timepieces"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Luxury Timepieces"
            subtitle="Engineering Eternity"
            heroImg="/images/local/asset-0001.png"
            products={timepieceProducts}
          />
        )}

        {view === 'category-jewelry' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="jewelry"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="High Jewelry"
            subtitle="Artisanal Brilliance"
            heroImg="/images/local/asset-0009.png"
            products={jewelryProducts}
          />
        )}

        {view === 'category-leather' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="leather"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Leather Goods"
            subtitle="Timeless Craftsmanship"
            heroImg="/images/local/asset-0003.png"
            products={leatherProducts}
          />
        )}

        {view === 'category-fashion' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="fashion"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Haute Couture"
            subtitle="Sartorial Excellence"
            heroImg="/images/local/asset-0002.png"
            products={fashionProducts}
          />
        )}

        {view === 'category-home' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="home"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Home & Living"
            subtitle="Curated Interiors"
            heroImg="/images/local/asset-0004.png"
            products={homeProducts}
          />
        )}

        {view === 'category-beauty' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="beauty"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Fragrances & Beauty"
            subtitle="Olfactory Masterpieces"
            heroImg="/images/local/asset-0005.png"
            products={beautyProducts}
          />
        )}

        {view === 'category-sports' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="sports"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Sports & Recreation"
            subtitle="Athletic Excellence"
            heroImg="/images/local/asset-0006.png"
            products={sportsProducts}
          />
        )}

        {view === 'category-books' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="books"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Rare Books & Manuscripts"
            subtitle="Literary Treasures"
            heroImg="/images/local/asset-0007.png"
            products={booksProducts}
          />
        )}

        {view === 'category-toys' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setIsCategoryMenuOpen(true)}
            activeCategory="toys"
            onCategorySelect={openShopCategory}
            onProductSelect={openProductDetail}
            title="Collectible Toys"
            subtitle="Timeless Companions"
            heroImg="/images/local/asset-0008.png"
            products={toysProducts}
          />
        )}

        {isInfoView(view) && (
          <InfoPageLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            onLogout={handleLogout}
            content={infoPageContent[view]}
          />
        )}


        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* TopNavBar */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />
            
            <CategoryBar 
              view={view} 
              setView={setView} 
              onCategorySelect={openShopCategory}
            />

            <main className="grow">
              {/* FIX: hero mobile responsiveness */}
              <section className="relative min-h-svh flex items-center px-4 md:px-20 py-12 md:py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none"></div>
                <div className="max-w-480 mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                  >
                    <span className="inline-block px-4 py-1 rounded-full bg-surface-container-highest text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-6 border border-primary/20">
                      New Era of Commerce
                    </span>
                    <h1 className="font-black text-on-surface leading-[0.9] mb-8 tracking-tighter font-headline text-[clamp(1.5rem,5vw,3.5rem)] md:text-8xl">
                      Shop the Future, <br/>
                      <span className="text-primary italic">Delivered Today</span>
                    </h1>
                    <p className="text-on-surface-variant/70 text-lg max-w-lg mb-12 font-body leading-relaxed">
                      Experience a curated sanctuary of high-performance tech, artisanal designer wear, and timeless luxury—delivered with the precision of a private gallery.
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <button 
                        onClick={() => openShopCategory('all')}
                        className="px-10 py-4 min-h-11 min-w-11 bg-primary text-on-primary font-bold rounded-lg shadow-[0_20px_40px_rgba(230,195,100,0.2)] hover:scale-105 transition-transform uppercase tracking-widest text-xs"
                      >
                        Shop Now
                      </button>
                      <button className="px-10 py-4 bg-surface-container-highest/40 backdrop-blur border border-primary/20 text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors uppercase tracking-widest text-xs">
                        Explore Deals
                      </button>
                    </div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative flex justify-center items-center"
                  >
                    <div className="absolute w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full"></div>
                    <div 
                      className="relative w-full aspect-square md:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 group cursor-pointer"
                      onClick={() => {
                        setSelectedProduct({
                          brand: 'AUREL & CO',
                          name: 'The Onyx Chrono X1',
                          price: '$14,200',
                          rating: 5,
                          reviews: 84,
                          img: '/images/local/asset-0065.png'
                        });
                        setView('product-detail');
                        setSelectedImage(0);
                      }}
                    >
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt="Featured Product"
                        src="/images/local/asset-0065.png" 
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                      />
                      <div className="absolute bottom-8 left-8">
                        <span className="text-primary text-[10px] tracking-widest uppercase font-bold">Featured Arrival</span>
                        <h3 className="text-2xl font-headline mt-2 text-white">The Onyx Chrono X1</h3>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* FIX: category images mapping */}
              <section className="py-24 px-6 md:px-12 max-w-480 mx-auto">
                <div className="flex justify-between items-end mb-16">
                  <div>
                    <h2 className="text-4xl font-headline text-on-surface">Curated Categories</h2>
                    <p className="text-on-surface-variant mt-2 font-body">Precision filtered by The Obsidian Curator</p>
                  </div>
                  <button
                    onClick={() => openShopCategory('all')}
                    className="text-primary font-bold flex items-center gap-2 hover:translate-x-2 transition-transform uppercase tracking-widest text-xs"
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {shopCategoryOptions.map((cat, i) => (
                    <motion.div 
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => openShopCategory(cat.id)}
                      className="group bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-highest transition-all duration-500 cursor-pointer border border-outline-variant/5 hover:border-primary/20"
                    >
                      <div className="relative w-full h-32 overflow-hidden rounded-lg mb-4 border border-outline-variant/10">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                        <cat.icon size={24} />
                      </div>
                      <h4 className="text-xl font-headline mb-2">{cat.label}</h4>
                      <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">{cat.count}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Flash Sale Banner */}
              <section className="w-full py-12 bg-primary/5 border-y border-primary/10 relative overflow-hidden mb-24">
                <div className="max-w-480 mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="text-primary flex items-center gap-3">
                      <Zap className="fill-primary" size={32} />
                      <h2 className="text-3xl font-headline italic font-bold">Flash Sale Ends In:</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-surface-container-highest px-4 py-2 rounded border border-primary/20 text-primary font-mono text-2xl font-bold">04</div>
                      <span className="text-primary text-2xl">:</span>
                      <div className="bg-surface-container-highest px-4 py-2 rounded border border-primary/20 text-primary font-mono text-2xl font-bold">12</div>
                      <span className="text-primary text-2xl">:</span>
                      <div className="bg-surface-container-highest px-4 py-2 rounded border border-primary/20 text-primary font-mono text-2xl font-bold">59</div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant max-w-sm text-center md:text-left font-body text-sm">
                    Exclusive drops at up to 60% off. Once the timer hits zero, these artifacts return to the vault.
                  </p>
                  <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform whitespace-nowrap uppercase tracking-widest text-xs">
                    Access the Sale
                  </button>
                </div>
              </section>

              {/* Editorial Selections */}
              <section className="py-24 overflow-hidden">
                <div className="px-6 md:px-12 max-w-480 mx-auto mb-12">
                  <h2 className="text-4xl font-headline">Editorial Selections</h2>
                  <p className="text-on-surface-variant mt-2 font-body">Objects of desire, hand-picked for the modern collector</p>
                </div>
                <div className="flex gap-8 px-6 md:px-12 overflow-x-auto no-scrollbar pb-12 scroll-smooth">
                  {[
                    { name: 'The Navigator Prime', price: '$1,299', tag: 'Limited Edition', img: '/images/local/asset-0066.png' },
                    { name: 'Obsidian Soundstage v4', price: '$549', tag: 'Audio Perfection', img: '/images/local/asset-0067.png' },
                    { name: "L'Essence de L'Ombre", price: '$210', tag: 'Signature Scent', img: '/images/local/asset-0068.png' },
                    { name: 'The Voyager Duffel', price: '$890', tag: 'Artisanal Carry', img: '/images/local/asset-0069.png' },
                  ].map((item, i) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="min-w-[320px] bg-surface-container-low rounded-2xl p-4 group cursor-pointer hover:bg-surface-container-high transition-all border border-outline-variant/5"
                      onClick={() => {
                        setSelectedProduct({
                          brand: item.tag,
                          name: item.name,
                          price: item.price,
                          rating: 4.8,
                          reviews: 156,
                          img: item.img
                        });
                        setView('product-detail');
                        setSelectedImage(0);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-6">
                        <img 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={item.name}
                          src={item.img} 
                        />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart size={18} />
                        </button>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">{item.tag}</span>
                      <h3 className="text-xl font-headline mt-1 group-hover:text-primary transition-colors">{item.name}</h3>
                      <div className="flex justify-between items-end mt-4">
                        <span className="font-mono text-lg text-primary">{item.price}</span>
                        <button className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                          <Plus size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Brand Logos */}
              <section className="py-12 border-y border-outline-variant/10 bg-surface-container-lowest/50">
                <div className="max-w-480 mx-auto px-6 md:px-12 overflow-hidden flex items-center justify-between gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 flex-wrap">
                  {['VOGUE', 'HARRODS', 'GUCCI', 'ROLEX', 'CARTIER', 'HERMÈS', 'APPLE', 'TESLA'].map(brand => (
                    <span key={brand} className="font-headline font-black text-2xl tracking-tighter whitespace-nowrap">{brand}</span>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-24 px-6 md:px-12 max-w-480 mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-headline mb-4">Voices of the Suite</h2>
                  <p className="text-on-surface-variant max-w-lg mx-auto font-body">Hear from our inner circle of collectors and style enthusiasts who have redefined their daily essentials.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Elena Vance', role: 'Art Director', quote: "The level of curation here is unmatched. It's like having a personal shopper with the world's most discerning eye for quality.", img: '/images/local/asset-0070.png' },
                    { name: 'Julian Thorne', role: 'Tech Founder', quote: "Fast delivery used to mean compromising on experience. The Obsidian Curator proves you can have both: speed and luxury.", img: '/images/local/asset-0071.png' },
                    { name: 'Sasha Grey', role: 'Digital Creator', quote: "Every package feels like a gift. The presentation is as important as the product itself. Truly a five-star service.", img: '/images/local/asset-0072.png' },
                  ].map((t, i) => (
                    <motion.div 
                      key={t.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="bg-surface-container p-8 rounded-2xl border border-primary/5 hover:border-primary/20 transition-all"
                    >
                      <div className="flex text-primary mb-6 gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                      </div>
                      <p className="text-on-surface leading-relaxed mb-8 font-body italic text-lg">"{t.quote}"</p>
                      <div className="flex items-center gap-4">
                        <img loading="lazy" className="w-12 h-12 rounded-full object-cover border border-primary/20" src={t.img} alt={t.name} />
                        <div>
                          <h4 className="font-bold text-on-surface">{t.name}</h4>
                          <span className="text-[10px] text-primary/60 uppercase font-bold tracking-widest">{t.role}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* App Download Banner */}
              <section className="py-24 px-6 md:px-12">
                <div className="max-w-6xl mx-auto bg-surface-container-highest/20 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -ml-32 -mb-32 rounded-full"></div>
                  <div className="flex-1 text-center md:text-left z-10">
                    <h2 className="text-5xl font-headline text-on-surface mb-6 leading-tight">The Obsidian Suite <br/> In Your Pocket</h2>
                    <p className="text-on-surface-variant text-lg mb-10 max-w-md font-body">Get real-time drop notifications, exclusive mobile-only collections, and one-tap checkout.</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <button className="bg-on-surface text-background px-8 py-4 rounded-xl flex items-center gap-3 font-bold hover:scale-105 transition-transform uppercase tracking-widest text-xs">
                        <Apple size={20} /> App Store
                      </button>
                      <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-xl border border-white/10 flex items-center gap-3 font-bold hover:scale-105 transition-transform uppercase tracking-widest text-xs">
                        <Play size={20} /> Play Store
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 z-10 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="w-48 h-48 bg-white p-4 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
                        <div className="bg-black"></div><div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div>
                        <div className="bg-black"></div><div className="bg-white"></div><div className="bg-black"></div><div className="bg-white"></div>
                        <div className="bg-white"></div><div className="bg-black"></div><div className="bg-black"></div><div className="bg-black"></div>
                        <div className="bg-black"></div><div className="bg-white"></div><div className="bg-white"></div><div className="bg-black"></div>
                      </div>
                    </div>
                    <p className="text-center mt-4 text-[10px] uppercase font-bold tracking-[0.2em] text-primary">Scan to Curate</p>
                  </div>
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/10 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-20 max-w-480 mx-auto">
                <div className="md:col-span-1">
                  <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant/60 text-sm max-w-xs font-body leading-relaxed">Elevating the standard of digital commerce through intentional curation and timeless aesthetics.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">The Experience</h4>
                  <button type="button" onClick={() => openInfoPage('private-suite')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Private Suite</button>
                  <button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Authenticity Guarantee</button>
                  <button type="button" onClick={() => openInfoPage('boutique-locations')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Boutique Locations</button>
                </div>
                <div className="flex flex-col gap-4">
                  <button type="button" onClick={() => openInfoPage('client-care')} className="text-left text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Client Care</button>
                  <button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Shipping Etiquette</button>
                  <button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Terms of Service</button>
                  <button type="button" onClick={() => openInfoPage('curator-concierge')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Curator Concierge</button>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Newsletter</h4>
                  <p className="text-on-surface-variant/60 text-sm font-body mb-2">Join the inner circle for exclusive drops.</p>
                  <form className="flex border-b border-primary/20 pb-2" onSubmit={handleNewsletterSubmit}>
                    <input
                      className="bg-transparent border-none focus:ring-0 text-on-surface w-full text-sm outline-none"
                      placeholder="Email Address"
                      type="email"
                      value={newsletterEmail}
                      disabled={isSubmittingNewsletter}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" disabled={isSubmittingNewsletter} className="text-primary hover:translate-x-1 transition-transform disabled:opacity-60"><ArrowRight size={18} /></button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80">{newsletterMessage}</p>}
                  {isSubmittingNewsletter && <p className="text-[10px] text-primary/70">Submitting...</p>}
                </div>
              </div>
              <div className="px-6 md:px-12 py-8 border-t border-outline-variant/5 text-center text-on-surface-variant/20 tracking-widest text-[10px] uppercase font-bold">
                © 2024 The Obsidian Curator. All Rights Reserved.
              </div>
            </footer>
          </motion.div>
        )}

        {view === 'product-detail' && (
          <motion.div
            key="product-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* TopNavBar */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <main className="max-w-360 mx-auto px-8 pt-12 grow w-full">
              <div className="mb-8">
                <BackButton onBack={() => setView('shop')} />
              </div>
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/40 mb-8">
                <span className="hover:text-primary cursor-pointer" onClick={() => setView('home')}>Home</span>
                <ChevronRight size={10} />
                <span className="hover:text-primary cursor-pointer" onClick={() => setView('shop')}>Boutique</span>
                <ChevronRight size={10} />
                <span className="text-primary">{selectedProduct?.name || 'Product Details'}</span>
              </nav>

              {/* Product Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 mb-24">
                {/* Left Column: Gallery */}
                <section className="space-y-8">
                  <div className="relative group aspect-square bg-surface-container-lowest rounded-xl overflow-hidden cursor-zoom-in border border-outline-variant/10">
                    <motion.img 
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={selectedProduct?.img || "/images/local/asset-0073.png"}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6 bg-primary/90 text-on-primary px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl">
                      Sold 420+ units
                    </div>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {[0, 1, 2, 3].map((i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-24 h-24 shrink-0 rounded-lg border-2 transition-all overflow-hidden cursor-pointer ${selectedImage === i ? 'border-primary' : 'border-outline-variant/20 hover:border-primary/50'}`}
                      >
                        <img 
                          className="w-full h-full object-cover" 
                          src={selectedProduct?.img || "/images/local/asset-0074.png"}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Right Column: Details */}
                <section className="flex flex-col gap-8">
                  <div>
                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] mb-2 inline-block">
                      {selectedProduct?.brand || 'Chronos Noir'}
                    </span>
                      <button
                        className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors mb-2"
                        onClick={openSelectedProductCollection}
                      >
                        View matching collection
                    </button>
                    <h1 className="text-5xl font-headline text-on-surface font-light leading-tight mb-4 tracking-tight">
                      {selectedProduct?.name || 'The Midnight Eclipse Perpetual'}
                    </h1>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-widest">
                      <span>SKU: CN-ECLIPSE-2024</span>
                      <div className="flex items-center gap-1 text-primary">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "opacity-30"} />
                        ))}
                        <span className="ml-1 text-on-surface-variant font-body normal-case tracking-normal">({selectedProduct?.reviews || 128} Reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-headline text-primary">{selectedProduct?.price || '$4,250.00'}</span>
                    <span className="text-xl text-on-surface-variant/40 line-through">$5,100.00</span>
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 tracking-widest">SAVE 15%</span>
                  </div>

                  {/* Variants */}
                  <div className="space-y-6">
                    <div>
                      <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">Case Finish</span>
                      <div className="flex gap-4">
                        {[
                          { name: 'Obsidian Black', color: '#131317' },
                          { name: 'Platinum Silver', color: '#E5E4E2' },
                          { name: 'Rose Gold', color: '#B76E79' }
                        ].map((variant) => (
                          <button 
                            key={variant.name}
                            onClick={() => setSelectedProductColor(variant.name)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedProductColor === variant.name ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-transparent hover:border-primary/50'}`}
                            style={{ backgroundColor: variant.color }}
                            title={variant.name}
                          ></button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">Strap Size</span>
                      <div className="grid grid-cols-4 gap-2">
                        {['40MM', '42MM', '44MM', '46MM'].map((size) => (
                          <button 
                            key={size}
                            onClick={() => size !== '46MM' && setSelectedProductSize(size)}
                            className={`py-3 px-4 rounded-lg border transition-all text-xs font-bold tracking-widest ${selectedProductSize === size ? 'bg-surface-container-highest border-primary text-primary' : size === '46MM' ? 'bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant/20 cursor-not-allowed' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:border-primary'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-surface-container rounded-lg border border-outline-variant/20 overflow-hidden">
                        <button 
                          onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                          className="p-4 text-on-surface hover:bg-surface-container-highest transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-mono font-bold">{productQuantity}</span>
                        <button 
                          onClick={() => setProductQuantity(productQuantity + 1)}
                          className="p-4 text-on-surface hover:bg-surface-container-highest transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex gap-4 grow">
                        <button className="p-4 rounded-lg border border-outline-variant/20 hover:text-primary transition-all">
                          <Heart size={20} />
                        </button>
                        <button className="p-4 rounded-lg border border-outline-variant/20 hover:text-primary transition-all">
                          <Share2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      <button 
                        className="w-full bg-primary text-on-primary py-5 rounded-xl font-bold tracking-widest uppercase text-xs shadow-[0_12px_40px_rgba(230,195,100,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                        onClick={() => {
                          const newItem = {
                            id: Date.now(),
                            productId: selectedProduct?.id,
                            name: selectedProduct?.name || 'The Midnight Eclipse Perpetual',
                            price: parseInt((selectedProduct?.price || '$4,250.00').replace(/[^0-9]/g, '')),
                            quantity: productQuantity,
                            img: selectedProduct?.img || '/images/local/asset-0073.png',
                            variant: `${selectedProductSize} / ${selectedProductColor}`,
                            outOfStock: false
                          };
                          setCartItems(prev => [...prev, newItem]);
                          setView('cart');
                          window.scrollTo(0, 0);
                        }}
                      >
                        Add to Shopping Bag
                      </button>
                      <button className="w-full bg-transparent border-2 border-outline-variant/20 text-on-surface py-5 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-surface-container-highest transition-all">
                        Immediate Acquisition
                      </button>
                    </div>
                  </div>

                  {/* Delivery & Service */}
                  <div className="pt-8 border-t border-outline-variant/10">
                    <div className="flex flex-col gap-4 mb-8">
                      <label className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">Delivery Estimator</label>
                      <div className="flex gap-2">
                        <input 
                          className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all outline-none" 
                          placeholder="Enter Pincode" 
                          type="text"
                        />
                        <button className="text-primary font-bold text-[10px] uppercase px-4 border border-primary/20 rounded-lg hover:bg-primary/10 tracking-widest">Check</button>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/60 flex items-center gap-2 font-bold tracking-widest uppercase">
                        <Truck size={14} className="text-primary" />
                        Estimated delivery by Oct 24th - Oct 27th
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: ShieldCheck, label: 'Free Express Shipping' },
                        { icon: RotateCcw, label: '30-Day Returns' },
                        { icon: Award, label: 'Lifetime Warranty' },
                        { icon: Lock, label: 'Secure Encryption' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/5">
                          <item.icon size={16} className="text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline text-xl">A</div>
                      <div>
                        <p className="text-sm font-bold">Aurelian Horology</p>
                        <div className="flex items-center gap-1 text-[10px] text-primary font-bold tracking-widest uppercase">
                          <Star size={10} fill="currentColor" />
                          <span>4.9 Curator Rating</span>
                        </div>
                      </div>
                    </div>
                      <button
                        className="text-[10px] font-bold text-primary uppercase border-b border-primary/30 hover:border-primary transition-all tracking-widest"
                        onClick={openSelectedProductCollection}
                      >
                      Visit Store
                    </button>
                  </div>
                </section>
              </div>

              {/* Tabs Section */}
              <section className="mb-32">
                <div className="flex border-b border-outline-variant/10 gap-12 mb-12 overflow-x-auto no-scrollbar">
                  {['Detailed Narrative', 'Technical Specifications', 'Collector Reviews', 'Inquiries (12)'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveProductTab(tab)}
                      className={`pb-6 border-b-2 font-headline text-lg transition-all whitespace-nowrap ${activeProductTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant/40 hover:text-on-surface'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="w-full">
                  <div>
                    {activeProductTab === 'Detailed Narrative' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-6">
                          <h3 className="font-headline text-3xl text-on-surface mb-6">A Masterpiece of Temporal Art</h3>
                          <p className="text-on-surface-variant leading-relaxed font-body text-lg font-light">
                            The {selectedProduct?.name} represents the absolute pinnacle of artisanal engineering. Every curve of its titanium housing is hand-sculpted over ninety hours, ensuring a tactile experience as profound as its visual majesty.
                          </p>
                          <p className="text-on-surface-variant leading-relaxed font-body text-lg font-light">
                            This creation is not merely a tool for measurement; it is an inheritance of precision, a statement of intent for the modern connoisseur who understands that time is the ultimate luxury.
                          </p>
                        </div>
                        <div className="bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/10">
                          <p className="text-on-surface-variant leading-relaxed mb-8 font-body text-lg font-light">
                            Each component is hand-finished by master horologists in our private atelier, ensuring that every second is measured with unprecedented grace.
                          </p>
                          <ul className="space-y-4 text-on-surface-variant font-body list-none p-0">
                            <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Hand-polished Grade 5 Obsidian glass dial</li>
                            <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> In-house Caliber-88 Perpetual Movement</li>
                            <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 72-hour power reserve with moon-phase display</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {activeProductTab === 'Technical Specifications' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
                          {[
                            { label: 'Movement', value: 'Caliber OC-992 Automatic' },
                            { label: 'Case Material', value: 'Grade 5 Brushed Titanium' },
                            { label: 'Diameter', value: '42.5mm' },
                            { label: 'Power Reserve', value: '72 Hours' },
                            { label: 'Water Resistance', value: '10 ATM / 100 Meters' },
                            { label: 'Crystal', value: 'Anti-Reflective Sapphire' },
                            { label: 'Strap', value: 'Full-Grain Tuscan Leather' },
                            { label: 'Complications', value: 'Moon Phase, Date, Power Reserve' },
                            { label: 'Origin', value: 'Switzerland' }
                          ].map((spec, i) => (
                            <div key={i} className="border-b border-outline-variant/10 pb-6">
                              <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">{spec.label}</p>
                              <p className="text-xl font-headline text-on-surface">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeProductTab === 'Collector Reviews' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-3 space-y-12">
                          {[
                            { author: 'Julian V.', date: 'Oct 12, 2024', text: 'An absolute triumph of design. The weight is perfect, and the dial has a depth that photos simply cannot capture.', rating: 5 },
                            { author: 'Elena R.', date: 'Sep 28, 2024', text: 'Incredible hospitality during the acquisition process. The piece itself is a work of art.', rating: 5 }
                          ].map((review, i) => (
                            <div key={i} className="space-y-4 pb-8 border-b border-outline-variant/10">
                              <div className="flex justify-between items-center">
                                <div className="flex gap-1 text-primary">
                                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/40">{review.date}</span>
                              </div>
                              <p className="text-on-surface-variant font-body italic text-lg leading-relaxed">"{review.text}"</p>
                              <p className="text-sm font-bold text-on-surface uppercase tracking-widest">— {review.author}</p>
                            </div>
                          ))}
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                          <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/10">
                            <div className="flex justify-between items-center mb-10">
                              <h4 className="font-headline text-2xl">Ratings Overview</h4>
                              <div className="text-center">
                                <p className="text-5xl font-headline text-primary">4.8</p>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold mt-1">Global Average</p>
                              </div>
                            </div>
                            <div className="space-y-6">
                              {[85, 10, 3, 1, 1].map((val, i) => (
                                <div key={i} className="flex items-center gap-4">
                                  <span className="text-xs font-mono w-4 font-bold">{5 - i}</span>
                                  <div className="grow h-2 bg-surface-container rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${val}%` }}></div>
                                  </div>
                                  <span className="text-[10px] text-on-surface-variant/40 font-bold w-10 text-right">{val}%</span>
                                </div>
                              ))}
                            </div>
                            <button className="w-full mt-10 py-5 bg-transparent border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-all">
                              Read All 142 Reviews
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeProductTab === 'Inquiries (12)' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="max-w-2xl mx-auto p-12 bg-surface-container-highest/10 rounded-3xl border border-outline-variant/10 text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
                            <div className="font-headline text-2xl">?</div>
                          </div>
                          <h4 className="font-headline text-3xl mb-6">Curatorial Concierge</h4>
                          <p className="text-on-surface-variant mb-10 text-lg font-light leading-relaxed">
                            Should you require specific technical documentation or wish to discuss bespoke customization, 
                            our master curators are available for formal consultation.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-10 py-4 bg-primary text-on-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">Submit Inquiry</button>
                            <button className="px-10 py-4 bg-transparent border border-outline-variant/30 text-on-surface rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all">Direct Contact</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </section>

              {/* Frequently Bought Together */}
              <section className="mb-32">
                <h2 className="text-3xl font-headline mb-12 flex items-center gap-4">
                  Frequently Curated Together
                  <span className="h-px grow bg-linear-to-r from-outline-variant/20 to-transparent"></span>
                </h2>
                <div className="bg-surface-container-low p-10 rounded-3xl flex flex-col lg:flex-row items-center gap-12 border border-outline-variant/10">
                  <div className="flex items-center gap-8 flex-wrap justify-center">
                    {[
                      { name: 'Midnight Eclipse', img: selectedProduct?.img || '/images/local/asset-0075.png' },
                      { name: 'Leather Watch Roll', img: '/images/local/asset-0076.png' },
                      { name: 'Automatic Winder', img: '/images/local/asset-0077.png' }
                    ].map((item, i) => (
                      <React.Fragment key={i}>
                        <div className="relative group text-center">
                          <div className="w-40 h-40 rounded-2xl overflow-hidden border border-outline-variant/20">
                            <img loading="lazy" className="w-full h-full object-cover" src={item.img} alt={item.name} referrerPolicy="no-referrer" />
                          </div>
                          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">{item.name}</p>
                        </div>
                        {i < 2 && <Plus size={20} className="text-on-surface-variant/20" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="lg:ml-auto text-center lg:text-right space-y-4">
                    <p className="text-on-surface-variant/40 uppercase text-[10px] tracking-widest font-bold">Bundle Exclusive Price</p>
                    <p className="text-4xl font-headline text-primary">$4,950.00</p>
                    <button className="bg-primary text-on-primary px-10 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg">
                      Acquire Selection
                    </button>
                  </div>
                </div>
              </section>

              {/* You May Also Like */}
              <section className="mb-32">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">Refined Selections</span>
                    <h2 className="text-4xl font-headline">Other Curated Treasures</h2>
                  </div>
                  <div className="flex gap-4">
                    <button className="p-3 rounded-full border border-outline-variant/20 text-on-surface-variant/40 hover:text-primary hover:border-primary transition-all">
                      <ArrowLeft size={20} />
                    </button>
                    <button className="p-3 rounded-full border border-primary text-primary transition-all">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-8 overflow-x-auto pb-12 no-scrollbar">
                  {[
                    { brand: 'Aurelian', name: 'The Solstice Gold', price: '$3,800.00', img: '/images/local/asset-0078.png' },
                    { brand: 'Techne', name: 'Vanguard Titanium', price: '$2,450.00', img: '/images/local/asset-0079.png' },
                    { brand: 'Chronos', name: 'Aero Classic', price: '$5,200.00', img: '/images/local/asset-0080.png' },
                    { brand: 'Objets', name: 'Tonal Desk Chronometer', price: '$950.00', img: '/images/local/asset-0081.png' },
                    { brand: 'Forge', name: 'The Ironclad GMT', price: '$3,100.00', img: '/images/local/asset-0082.png' },
                  ].map((item, i) => (
                    <div key={i} className="w-72 shrink-0 group cursor-pointer" onClick={() => { setSelectedProduct(item); setSelectedImage(0); window.scrollTo(0, 0); }}>
                      <div className="aspect-4/5 bg-surface-container-lowest rounded-2xl overflow-hidden relative mb-6 border border-outline-variant/10">
                        <img loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.img} alt={item.name} referrerPolicy="no-referrer" />
                        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                          <Heart size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-primary uppercase tracking-widest mb-1 font-bold">{item.brand}</p>
                      <h3 className="font-headline text-lg mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-primary font-mono font-bold">{item.price}</p>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/10 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto">
                <div className="col-span-1">
                  <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant/60 text-sm max-w-xs font-body leading-relaxed">Refining the digital acquisition experience through intentional design and unparalleled quality.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Navigation</h4>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => openInfoPage('private-suite')}>Private Suite</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => openInfoPage('shipping-etiquette')}>Shipping Etiquette</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => openInfoPage('terms-of-service')}>Terms of Service</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => openInfoPage('authenticity-guarantee')}>Authenticity Guarantee</button>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Concierge</h4>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('profile-help')}>Support</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('my-orders')}>Wholesale</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('profile')}>Journal</button>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Newsletter</h4>
                  <p className="text-on-surface-variant/60 text-sm font-body mb-2">Join our private list for exclusive curations.</p>
                  <form className="flex border-b border-primary/20 pb-2" onSubmit={handleNewsletterSubmit}>
                    <input
                      className="bg-transparent border-none focus:ring-0 text-on-surface w-full text-sm outline-none"
                      placeholder="Email address"
                      type="email"
                      value={newsletterEmail}
                      disabled={isSubmittingNewsletter}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" disabled={isSubmittingNewsletter} className="text-primary hover:translate-x-1 transition-transform disabled:opacity-60"><ArrowRight size={18} /></button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80">{newsletterMessage}</p>}
                  {isSubmittingNewsletter && <p className="text-[10px] text-primary/70">Submitting...</p>}
                </div>
              </div>
              <div className="px-12 py-8 border-t border-outline-variant/5 text-center text-on-surface-variant/20 text-[10px] uppercase tracking-[0.3em] font-bold">
                © 2024 The Obsidian Curator. All Rights Reserved.
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'shop' && (
          <motion.div
            key="shop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col min-h-screen"
          >
            {/* TopNavBar */}
            
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
              onLogout={handleLogout}
            />

            <CategoryBar 
              view={view} 
              setView={setView} 
              activeCategory={selectedShopCategory}
              onCategorySelect={openShopCategory}
            />

            <div className="flex flex-1 max-w-480 mx-auto w-full">
              {/* SideNavBar (Filter Gallery) */}
              <aside className="hidden lg:flex flex-col p-8 gap-8 bg-surface-container-lowest border-r border-outline-variant/10 w-80 sticky top-18.25 h-[calc(100vh-73px)] overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-primary font-black text-xl mb-1 font-headline">Filter Gallery</h2>
                  <p className="text-on-surface-variant/40 normal-case tracking-normal text-xs italic font-body">Refine your selection</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Categories</p>
                    {shopCategoryOptions.map((cat) => {
                      const isActive = selectedShopCategories.includes(cat.id) || selectedShopCategory === cat.id;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => toggleShopCategoryFilter(cat.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/20 hover:border-primary/40 text-on-surface'}`}
                        >
                          <img
                            src={cat.image}
                            alt={cat.label}
                            className="w-10 h-10 rounded object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                          />
                          <span className="font-label uppercase tracking-widest text-xs font-bold">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-outline-variant/10">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold block">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={0}
                        value={priceRange.min}
                        onChange={(e) => {
                          setShopPage(1);
                          setPriceRange((prev) => ({ ...prev, min: Math.max(0, Number(e.target.value) || 0) }));
                        }}
                        className="bg-surface-container-highest/30 border border-outline-variant/20 rounded px-2 py-2 text-xs outline-none"
                      />
                      <input
                        type="number"
                        min={0}
                        value={priceRange.max}
                        onChange={(e) => {
                          setShopPage(1);
                          setPriceRange((prev) => ({ ...prev, max: Math.max(prev.min, Number(e.target.value) || 0) }));
                        }}
                        className="bg-surface-container-highest/30 border border-outline-variant/20 rounded px-2 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold block">Brands</label>
                    <div className="max-h-40 overflow-auto space-y-1 pr-1">
                      {availableBrands.slice(0, 10).map((brand) => (
                        <label key={brand} className="flex items-center gap-2 text-xs">
                          <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-outline-variant/10">
                    <label className="flex items-center justify-between text-xs">
                      <span className="uppercase tracking-widest text-on-surface-variant/60 font-bold">In Stock</span>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => {
                          setShopPage(1);
                          setInStockOnly(e.target.checked);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-outline-variant/10">
                    <button
                      type="button"
                      onClick={clearShopFilters}
                      className="w-full text-on-surface-variant/40 hover:text-primary flex items-center justify-center gap-2 p-3 cursor-pointer text-xs font-bold uppercase tracking-widest"
                    >
                    <RotateCcw size={14} />
                    <span>Clear All</span>
                  </button>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 px-8 md:px-12 py-12">
                <div className="mb-8">
                  <BackButton onBack={() => setView('home')} />
                </div>
                {/* Header & Context */}
                <header className="mb-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h1 className="font-headline text-5xl mb-4 tracking-tight">The Boutique</h1>
                      <p className="text-on-surface-variant max-w-xl font-body leading-relaxed">Curated excellence from the world's most exclusive ateliers. Each piece is authenticated by our master curators.</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-on-surface-variant uppercase tracking-widest opacity-60">Showing {filteredShopProducts.length} curated products</span>
                    </div>
                  </div>

                  {/* FIX: responsive filter controls */}
                  <div className="mt-6 flex items-center gap-3 lg:hidden">
                    <button
                      type="button"
                      onClick={() => setIsCategoryMenuOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/40 text-primary"
                    >
                      <Menu size={16} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Categories</span>
                    </button>
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  </div>

                  {/* Controls */}
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 py-6 border-y border-outline-variant/10">
                      <div className="min-w-55 flex-1 max-w-xl">
                        <input
                          type="search"
                          value={searchTerm}
                          onChange={(e) => {
                            setShopPage(1);
                            setSearchTerm(e.target.value);
                          }}
                          placeholder="Search by name, category, brand, description..."
                          className="w-full bg-surface-container-highest/20 border border-outline-variant/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Applied Filters */}
                        {selectedShopCategories.length === 0 && selectedShopCategory === 'all' && shopMaxPrice === 'all' && shopMinRating === 0 && shopSortBy === 'relevance' && !searchTerm.trim() ? (
                          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-bold">No filters applied</span>
                        ) : (
                          <>
                            {(selectedShopCategory !== 'all' || selectedShopCategories.length > 0) && (
                              <button
                                type="button"
                                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold hover:border-primary/50 transition-colors"
                                onClick={() => {
                                  setSelectedShopCategory('all');
                                  setSelectedShopCategories([]);
                                }}
                              >
                                <span className="text-primary">{selectedShopCategories.length ? `${selectedShopCategories.length} Categories` : getShopCategoryLabel(selectedShopCategory)}</span>
                                <X size={12} />
                              </button>
                            )}
                            {searchTerm.trim() && (
                              <button
                                type="button"
                                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold hover:border-primary/50 transition-colors"
                                onClick={() => setSearchTerm('')}
                              >
                                <span className="text-primary">Search: {searchTerm}</span>
                                <X size={12} />
                              </button>
                            )}
                            {shopMaxPrice !== 'all' && (
                              <button
                                type="button"
                                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold hover:border-primary/50 transition-colors"
                                onClick={() => setShopMaxPrice('all')}
                              >
                                <span className="text-primary">{getShopPriceLabel(shopMaxPrice)}</span>
                                <X size={12} />
                              </button>
                            )}
                            {shopMinRating > 0 && (
                              <button
                                type="button"
                                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold hover:border-primary/50 transition-colors"
                                onClick={() => setShopMinRating(0)}
                              >
                                <span className="text-primary">{shopMinRating === 5 ? '5 Star Only' : 'Designer Brands'}</span>
                                <X size={12} />
                              </button>
                            )}
                            {shopSortBy !== 'relevance' && (
                              <button
                                type="button"
                                className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold hover:border-primary/50 transition-colors"
                                onClick={() => setShopSortBy('relevance')}
                              >
                                <span className="text-primary">{getShopSortLabel(shopSortBy)}</span>
                                <X size={12} />
                              </button>
                            )}
                          </>
                        )}
                      </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sort By</label>
                        <select
                            className="bg-transparent border-none text-sm text-on-surface focus:ring-0 cursor-pointer font-bold pr-8 outline-none"
                            value={shopSortBy}
                            onChange={(e) => {
                              setShopPage(1);
                              setShopSortBy(e.target.value as ShopSortBy);
                            }}
                        >
                          <option className="bg-background" value="relevance">Relevance</option>
                          <option className="bg-background" value="low-to-high">Price: Low to High</option>
                          <option className="bg-background" value="high-to-low">Price: High to Low</option>
                          <option className="bg-background" value="top-rated">Top Rated</option>
                          <option className="bg-background" value="newest">Newest</option>
                          <option className="bg-background" value="most-popular">Most Popular</option>
                        </select>
                      </div>
                      <div className="h-4 w-px bg-outline-variant/20"></div>
                      <div className="flex gap-2">
                        <button className="p-2 text-primary bg-surface-variant/30 rounded transition-colors">
                          <LayoutGrid size={20} />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors">
                          <List size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </header>

                {/* FIX: loading states + pagination */}
                {isShopLoading ? (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-8 gap-y-12" aria-live="polite" aria-busy="true">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={`skeleton-${index}`} className="animate-pulse">
                        <div className="aspect-4/3 rounded-xl bg-surface-container-high mb-4" />
                        <div className="h-4 bg-surface-container-high rounded mb-2 w-2/3" />
                        <div className="h-3 bg-surface-container-high rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredShopProducts.length === 0 ? (
                  <div className="py-16 text-center border border-outline-variant/20 rounded-xl bg-surface-container-low/30">
                    <p className="text-on-surface text-lg font-headline mb-3">No products match your search and filters.</p>
                    <button
                      type="button"
                      onClick={clearShopFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs uppercase tracking-widest font-bold"
                    >
                      <RotateCcw size={14} />
                      Clear Search
                    </button>
                  </div>
                ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-8 gap-y-12">
                  {paginatedShopProducts.map((product, i) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 3) * 0.1 }}
                        className="group flex flex-col cursor-pointer"
                        onClick={() => openProductDetail(product)}
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-surface-container-low mb-8 rounded-xl">
                        <img 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          src={product.img} 
                          alt={product.name}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGE_FALLBACK_URL; }}
                          referrerPolicy="no-referrer"
                        />
                        <button className="absolute top-6 right-6 p-3 bg-background/40 backdrop-blur-md rounded-full text-on-surface/60 hover:text-primary transition-colors z-10">
                          <Heart size={18} />
                        </button>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                          <button className="w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            Quick View
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-2 block">{renderHighlightedText(product.brand, debouncedSearchTerm)}</span>
                          <h3 className="font-headline text-2xl group-hover:text-primary transition-colors cursor-pointer leading-tight">{renderHighlightedText(product.name, debouncedSearchTerm)}</h3>
                        </div>
                        <span className="font-mono text-xl text-on-surface font-bold">{product.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex text-primary">
                          {[...Array(5)].map((_, idx) => (
                            <Star 
                              key={idx} 
                              size={12} 
                              fill={idx < Math.floor(product.rating) ? "currentColor" : "none"} 
                              className={idx < Math.floor(product.rating) ? "" : "opacity-30"}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-on-surface-variant font-bold ml-2 tracking-widest">({product.reviews})</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}

                {showMainPagination && totalShopPages > 1 && (
                  <nav className="mt-16 flex items-center justify-center gap-4" aria-label="Product pagination">
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={shopPage === 1}
                      onClick={() => setShopPage((prev) => Math.max(1, prev - 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalShopPages }).slice(0, 7).map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={`page-${page}`}
                            type="button"
                            onClick={() => setShopPage(page)}
                            className={`w-11 h-11 flex items-center justify-center rounded-full font-bold text-sm transition-all ${shopPage === page ? 'bg-primary text-on-primary' : 'border border-outline-variant/20 text-on-surface-variant hover:border-primary hover:text-primary'}`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={shopPage === totalShopPages}
                      onClick={() => setShopPage((prev) => Math.min(totalShopPages, prev + 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </main>
            </div>

            {/* Footer */}
            <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/10 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto">
                <div className="md:col-span-1">
                  <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant/60 text-sm max-w-xs font-body leading-relaxed">A legacy of refinement and the pursuit of the extraordinary. Dedicated to the collector who understands true luxury.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Concierge</h4>
                  <button type="button" onClick={() => openInfoPage('private-suite')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Private Suite</button>
                  <button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Shipping Etiquette</button>
                  <button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Authenticity Guarantee</button>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Legal</h4>
                  <button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body">Terms of Service</button>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Privacy Policy</a>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Newsletter</h4>
                  <p className="text-on-surface-variant/60 text-sm font-body mb-2">Subscribe for invitations to private auctions.</p>
                  <form className="flex border-b border-primary/20 pb-2" onSubmit={handleNewsletterSubmit}>
                    <input
                      className="bg-transparent border-none focus:ring-0 text-on-surface w-full text-sm outline-none"
                      placeholder="Email Address"
                      type="email"
                      value={newsletterEmail}
                      disabled={isSubmittingNewsletter}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" disabled={isSubmittingNewsletter} className="text-primary hover:translate-x-1 transition-transform disabled:opacity-60"><ArrowRight size={18} /></button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80">{newsletterMessage}</p>}
                  {isSubmittingNewsletter && <p className="text-[10px] text-primary/70">Submitting...</p>}
                </div>
              </div>
              <div className="px-12 py-8 border-t border-outline-variant/5 flex justify-between items-center text-on-surface-variant/20 text-[10px] uppercase font-bold tracking-widest">
                <div>© 2024 The Obsidian Curator. All Rights Reserved.</div>
                <div className="flex gap-8">
                  <span className="hover:text-primary transition-colors cursor-pointer">Instagram</span>
                  <span className="hover:text-primary transition-colors cursor-pointer">LinkedIn</span>
                </div>
              </div>
            </footer>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.main
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col md:flex-row overflow-hidden"
          >

            {/* Left Side: Editorial Image & Quote */}
            <section className="hidden md:flex md:w-7/12 relative items-end p-20 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  alt="Luxury Interior"
                  className="w-full h-full object-cover grayscale brightness-[0.3]"
                  src="/images/local/asset-0083.png"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 bg-linear-to-r from-background/40 to-transparent"></div>
              </div>
              
              <div className="relative z-10 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="w-12 h-px bg-primary"></div>
                  <span className="font-mono text-primary tracking-[0.3em] uppercase text-[10px]">Private Access</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="font-headline text-5xl lg:text-7xl text-on-surface leading-[1.1] mb-10 italic"
                >
                  The quiet art of <span className="text-primary not-italic font-bold">curation.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="font-body text-on-surface-variant text-lg max-w-md leading-relaxed"
                >
                  Step back into the digital vault where every pixel is a testament to the obsidian craft.
                </motion.p>
              </div>

              <div className="absolute top-12 left-12 z-20 flex items-center gap-3">
                <BrandMark className="w-10 h-10 rounded-xl shadow-[0_0_20px_rgba(230,195,100,0.25)]" />
                <span className="font-headline text-2xl font-bold tracking-tighter text-primary">The Obsidian Curator</span>
              </div>
            </section>

            {/* Right Side: Auth Panel */}
            <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 bg-surface-container-lowest relative z-10">
              <div className="w-full max-w-md">
                {/* Mobile Branding */}
                <div className="md:hidden mb-12 flex items-center justify-center gap-3">
                  <BrandMark className="w-10 h-10 rounded-xl" />
                  <span className="font-headline text-3xl font-bold tracking-tighter text-primary">The Obsidian Curator</span>
                </div>

                <div className="mb-12">
                  <h2 className="font-headline text-3xl text-on-surface font-bold mb-3 tracking-tight">Welcome back</h2>
                  <p className="text-on-surface-variant font-body text-sm opacity-60">Enter your credentials to access the suite.</p>
                </div>

                {/* Form Section */}
                {authError && <div className="text-error font-body text-sm mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-center">{authError}</div>}
                <form className="space-y-8" onSubmit={handleLogin}>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/30 py-4 px-1 text-on-surface focus:ring-0 focus:border-primary transition-all placeholder:text-outline-variant/50 font-body outline-none"
                        id="email"
                        placeholder="curator@obsidian.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1" htmlFor="password">
                        Secure Key
                      </label>
                      <button 
                        type="button"
                        onClick={() => { setView('forgot-password'); setForgotStep(1); }}
                        className="text-[10px] uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative group">
                      <input
                        className="w-full bg-surface-container-highest border-0 border-b border-outline-variant/30 py-4 px-1 text-on-surface focus:ring-0 focus:border-primary transition-all placeholder:text-outline-variant/50 font-body outline-none"
                        id="password"
                        placeholder="••••••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div 
                    className="flex items-center space-x-3 group cursor-pointer"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    <div className="relative flex items-center">
                      <input
                        className="appearance-none w-4 h-4 border border-outline-variant rounded-sm bg-transparent checked:bg-primary checked:border-primary focus:ring-0 transition-all cursor-pointer"
                        id="remember"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      {rememberMe && (
                        <Check size={12} className="absolute text-on-primary pointer-events-none left-0.5" />
                      )}
                    </div>
                    <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                      Remember this station
                    </label>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <button
                      disabled={isLoading}
                      className="w-full gold-glint py-5 rounded-lg text-on-primary font-bold tracking-widest uppercase text-xs shadow-xl active:scale-[0.98] transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <span>{isLoading ? "Authenticating..." : "Sign In"}</span>
                      {isLoading && (
                        <div className="w-4 h-4 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin"></div>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="relative my-12">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                    <span className="bg-surface-container-lowest px-4 text-on-surface-variant/40">or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-1">
                  <button type="button" onClick={() => googleLogin()} className="flex items-center justify-center gap-3 py-4 bg-surface-container border border-outline-variant/10 rounded-lg hover:bg-surface-container-high transition-colors group">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#e4e1e7"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#e4e1e7"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#e4e1e7"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#e4e1e7"></path>
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sign in with Google</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                  <p className="text-xs text-on-surface-variant opacity-60">
                    Don't have an account? 
                    <button 
                      onClick={() => setView('register')}
                      className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/30 transition-all ml-1"
                    >
                      Register
                    </button>
                  </p>
                </div>
              </div>

              {/* Accessibility/Legal Footer */}
              <div className="mt-auto pt-12">
                <nav className="flex gap-6 justify-center">
                  <a className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-colors" href="#">Privacy</a>
                  <a className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-colors" href="#">Terms</a>
                  <a className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-on-surface transition-colors" href="#">Support</a>
                </nav>
              </div>
            </section>
          </motion.main>
        )}

        {view === 'register' && (
          <motion.main
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col md:flex-row"
          >

            {/* Left Side: Visual Narrative */}
            <section className="relative hidden md:flex md:w-1/2 lg:w-[60%] overflow-hidden items-center justify-center">
              <img
                alt="Luxury black onyx and gold watch display"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-105"
                src="/images/local/asset-0084.png"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-background via-transparent to-transparent"></div>
              <div className="relative z-10 px-16 max-w-2xl">
                <span className="text-primary font-label tracking-[0.3em] uppercase text-xs mb-6 block">The Inner Circle</span>
                <div className="flex items-center gap-4 mb-8">
                  <BrandMark className="w-12 h-12 rounded-xl shadow-[0_0_28px_rgba(230,195,100,0.2)]" />
                  <h1 className="font-headline text-6xl lg:text-7xl leading-tight text-on-background gold-glow">The Obsidian Curator</h1>
                </div>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-12">
                  Begin your journey into the world of uncompromised rarity. Join an elite collective of seekers, collectors, and visionaries.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <img loading="lazy" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="/images/local/asset-0085.png" referrerPolicy="no-referrer" alt="Curator Avatar 1" />
                    <img loading="lazy" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="/images/local/asset-0086.png" referrerPolicy="no-referrer" alt="Curator Avatar 2" />
                    <img loading="lazy" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="/images/local/asset-0087.png" referrerPolicy="no-referrer" alt="Curator Avatar 3" />
                  </div>
                  <p className="text-on-surface-variant text-sm tracking-wide">Joined by <span className="text-primary font-semibold">1,200+</span> luxury enthusiasts</p>
                </div>
              </div>
            </section>

            {/* Right Side: Registration Form */}
            <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-y-auto">
              {/* Mobile Header Logo */}
              <div className="md:hidden mb-12 flex items-center justify-center gap-3">
                <BrandMark className="w-10 h-10 rounded-xl" />
                <span className="font-headline text-3xl font-bold tracking-tighter text-primary">The Obsidian Curator</span>
              </div>
              
              <div className="w-full max-w-md space-y-10">
                <div className="space-y-3">
                  <h2 className="font-headline text-3xl font-medium text-on-surface">Create an Account</h2>
                  <p className="text-on-surface-variant font-light">Enter your details to access the private suite.</p>
                </div>

                {/* Registration Form */}
                {authError && <div className="text-error font-body text-sm mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-center">{authError}</div>}
                <form className="space-y-6" onSubmit={handleRegister}>
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-highest/30 border-none border-b border-outline-variant/30 text-on-surface px-4 py-4 rounded-lg focus:ring-1 focus:ring-primary focus:bg-surface-container-highest/50 transition-all placeholder:text-on-surface-variant/40 outline-none"
                        id="name"
                        placeholder="Elias Thorne"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={16} />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="reg-email">Email Address</label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-highest/30 border-none border-b border-outline-variant/30 text-on-surface px-4 py-4 rounded-lg focus:ring-1 focus:ring-primary focus:bg-surface-container-highest/50 transition-all placeholder:text-on-surface-variant/40 outline-none"
                        id="reg-email"
                        placeholder="e.thorne@curator.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={16} />
                    </div>
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="phone">Phone <span className="normal-case opacity-40 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container-highest/30 border-none border-b border-outline-variant/30 text-on-surface px-4 py-4 rounded-lg focus:ring-1 focus:ring-primary focus:bg-surface-container-highest/50 transition-all placeholder:text-on-surface-variant/40 outline-none"
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={16} />
                    </div>
                  </div>

                  {/* Password Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="reg-password">Password</label>
                      <div className="relative">
                        <input
                          className="w-full bg-surface-container-highest/30 border-none border-b border-outline-variant/30 text-on-surface px-4 py-4 rounded-lg focus:ring-1 focus:ring-primary focus:bg-surface-container-highest/50 transition-all placeholder:text-on-surface-variant/40 outline-none"
                          id="reg-password"
                          placeholder="••••••••"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={16} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="confirm_password">Confirm Password</label>
                      <div className="relative">
                        <input
                          className={`w-full bg-surface-container-highest/30 border-none border-b ${confirmPassword && password !== confirmPassword ? 'border-error' : 'border-outline-variant/30'} text-on-surface px-4 py-4 rounded-lg focus:ring-1 focus:ring-primary focus:bg-surface-container-highest/50 transition-all placeholder:text-on-surface-variant/40 outline-none`}
                          id="confirm_password"
                          placeholder="••••••••"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      {confirmPassword && (
                        <p className={`text-[10px] ml-1 uppercase tracking-widest font-bold ${password === confirmPassword ? 'text-green-500' : 'text-error'}`}>
                          {password === confirmPassword ? 'Passwords Match' : 'Passwords Do Not Match'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password Strength */}
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Security Strength</span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${passwordStrength >= 3 ? 'text-primary' : passwordStrength === 2 ? 'text-yellow-500' : 'text-error'}`}>
                        {passwordStrengthLabel}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden flex gap-0.5">
                      <div className={`h-full flex-1 transition-all duration-500 ${passwordStrength >= 1 ? (passwordStrength >= 3 ? 'bg-primary' : passwordStrength === 2 ? 'bg-yellow-500' : 'bg-error') : 'bg-transparent'}`}></div>
                      <div className={`h-full flex-1 transition-all duration-500 ${passwordStrength >= 2 ? (passwordStrength >= 3 ? 'bg-primary' : 'bg-yellow-500') : 'bg-transparent'}`}></div>
                      <div className={`h-full flex-1 transition-all duration-500 ${passwordStrength >= 3 ? 'bg-primary' : 'bg-transparent'}`}></div>
                      <div className={`h-full flex-1 transition-all duration-500 ${passwordStrength >= 4 ? 'bg-primary opacity-50' : 'bg-transparent'}`}></div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3 px-1 pt-2">
                    <div className="relative flex items-center">
                      <input
                        className="peer h-5 w-5 rounded border-outline-variant/50 bg-surface-container-highest text-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer appearance-none checked:bg-primary"
                        id="terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms(!agreeTerms)}
                        required
                      />
                      {agreeTerms && (
                        <Check className="absolute text-on-primary pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={14} />
                      )}
                    </div>
                    <label className="text-sm text-on-surface-variant font-light leading-snug cursor-pointer" htmlFor="terms">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => openInfoPage('terms-of-service')}
                        className="text-on-surface underline underline-offset-4 decoration-outline-variant hover:decoration-primary transition-colors"
                      >
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <a className="text-on-surface underline underline-offset-4 decoration-outline-variant hover:decoration-primary transition-colors" href="#">Privacy Etiquette</a>.
                    </label>
                  </div>

                  {/* CTA */}
                  <button
                    className="w-full bg-primary hover:bg-secondary-container text-on-primary font-bold py-5 rounded-lg transition-all duration-300 scale-100 active:scale-95 shadow-[0_8px_32px_rgba(230,195,100,0.15)] flex justify-center items-center gap-3 group disabled:opacity-70"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative py-4 flex items-center">
                  <div className="grow border-t border-outline-variant/20"></div>
                  <span className="shrink mx-4 text-xs font-label text-on-surface-variant/40 tracking-[0.2em] uppercase">Authenticate via</span>
                  <div className="grow border-t border-outline-variant/20"></div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-1">
                  <button type="button" onClick={() => googleLogin()} className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/10 transition-colors group">
                    <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                    <span className="text-xs font-semibold tracking-wider uppercase">Sign up with Google</span>
                  </button>
                </div>

                {/* Footer Link */}
                <div className="text-center pt-8">
                  <p className="text-on-surface-variant font-light">
                    Already have an account? 
                    <button 
                      onClick={() => setView('login')}
                      className="text-primary font-semibold ml-1 hover:text-secondary-fixed transition-colors underline underline-offset-4 decoration-primary/20"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </div>

              {/* Visual Texture Detail */}
              <div className="absolute bottom-10 right-10 opacity-10 hidden lg:block">
                <Diamond className="text-8xl" strokeWidth={1} />
              </div>
            </section>
          </motion.main>
        )}

        {view === 'verify-otp' && (
          <motion.main
            key="verify-otp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative"
          >
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
              <img className="w-full h-full object-cover" alt="Abstract fluid waves" src="/images/local/asset-0088.png" referrerPolicy="no-referrer" />
            </div>

            <div className="relative z-10 w-full max-w-md glass-morphism rounded-xl ghost-border p-8 md:p-12 space-y-8 text-center shadow-2xl">
              <div className="space-y-3">
                <div className="flex justify-center mb-6">
                  <BrandMark className="w-12 h-12" />
                </div>
                <h2 className="font-headline text-3xl font-bold text-on-surface">Identity Verification</h2>
                <p className="text-on-surface-variant font-light">
                  A verification code has been dispatched to <span className="text-primary font-semibold">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleForgotVerify} className="space-y-10">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={`verify-otp-${idx}`}
                      id={`otp-${idx}`}
                      className="w-12 h-16 text-center text-2xl font-headline bg-surface-container-highest border border-outline-variant/30 text-primary rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      maxLength={1}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      required
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-xs text-error font-semibold">{otpError}</p>
                )}
                <button 
                  className="w-full bg-primary hover:bg-secondary-container text-on-primary py-4 rounded-lg uppercase tracking-widest font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying Identity..." : "Verify Access"}
                </button>
              </form>

              <div className="pt-4">
                <p className="text-xs text-on-surface-variant/60 uppercase tracking-widest">
                  Didn't receive the code? 
                  <button 
                    onClick={() => authApi.resendOtp(email, otpType)}
                    className="text-primary font-bold ml-2 hover:underline underline-offset-4"
                  >
                    Resend Code
                  </button>
                </p>
              </div>

            </div>
          </motion.main>
        )}

        {view === 'forgot-password' && (
          <motion.main
            key="forgot-password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative"
          >

            {/* Hero Background Context */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
              <img 
                className="w-full h-full object-cover" 
                alt="Abstract ethereal fluid waves" 
                src="/images/local/asset-0088.png" 
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Header Branding */}
            <div className="relative z-10 mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <BrandMark className="w-10 h-10 rounded-xl" />
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                  The Obsidian Curator
                </h1>
              </div>
              <p className="font-body text-on-surface-variant text-sm tracking-widest uppercase mt-2">
                Secure Access Recovery
              </p>
            </div>

            {/* Auth Card Container */}
            <div className="relative z-10 w-full max-w-xl glass-morphism rounded-xl ghost-border overflow-hidden shadow-2xl">
              {/* Step Indicator */}
              <div className="grid grid-cols-3 w-full border-b border-outline-variant/10">
                <div className={`py-6 flex flex-col items-center gap-2 border-r border-outline-variant/10 transition-colors ${forgotStep === 1 ? 'bg-primary/5' : 'opacity-40'}`}>
                  <span className={`font-headline text-xl font-bold ${forgotStep === 1 ? 'text-primary' : 'text-on-surface'}`}>01</span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold ${forgotStep === 1 ? 'text-primary/80' : 'text-on-surface-variant'}`}>Identify</span>
                </div>
                <div className={`py-6 flex flex-col items-center gap-2 border-r border-outline-variant/10 transition-colors ${forgotStep === 2 ? 'bg-primary/5' : 'opacity-40'}`}>
                  <span className={`font-headline text-xl font-bold ${forgotStep === 2 ? 'text-primary' : 'text-on-surface'}`}>02</span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold ${forgotStep === 2 ? 'text-primary/80' : 'text-on-surface-variant'}`}>Verify</span>
                </div>
                <div className={`py-6 flex flex-col items-center gap-2 transition-colors ${forgotStep === 3 ? 'bg-primary/5' : 'opacity-40'}`}>
                  <span className={`font-headline text-xl font-bold ${forgotStep === 3 ? 'text-primary' : 'text-on-surface'}`}>03</span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold ${forgotStep === 3 ? 'text-primary/80' : 'text-on-surface-variant'}`}>Restore</span>
                </div>
              </div>

              {/* Content Canvas */}
              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {forgotStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="max-w-md mx-auto space-y-8"
                    >
                      <div className="space-y-2">
                        <h2 className="font-headline text-2xl text-on-surface">Forgot your password?</h2>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          Enter the email address associated with your vault. We will send a secure authentication code to restore your access.
                        </p>
                      </div>
                      {authError && <div className="text-error font-body text-sm mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-center">{authError}</div>}
                      <form className="space-y-6" onSubmit={handleForgotIdentify}>
                        <div className="space-y-2">
                          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-outline" htmlFor="forgot-email">
                            Registry Email
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Mail className="text-primary/60" size={18} />
                            </div>
                            <input 
                              className="w-full bg-surface-container-highest border-b border-outline-variant/30 text-on-surface py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-outline/40" 
                              id="forgot-email" 
                              placeholder="curator@obsidian.com" 
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="pt-4">
                          <button 
                            className="group relative w-full overflow-hidden rounded-lg bg-primary py-4 px-8 transition-all duration-500 hover:shadow-[0_0_40px_rgba(230,195,100,0.2)] active:scale-95 disabled:opacity-70" 
                            type="submit"
                            disabled={isLoading}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2 text-on-primary font-bold uppercase tracking-widest text-xs">
                              {isLoading ? "Processing..." : "Send Reset Link"}
                              {!isLoading && <ArrowRight size={16} />}
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_100%] transition-all duration-500 group-hover:bg-position-[100%_0%]"></div>
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {forgotStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="max-w-md mx-auto text-center space-y-8"
                    >
                      <div className="space-y-2">
                        <h2 className="font-headline text-2xl text-on-surface">Authenticating</h2>
                        <p className="text-on-surface-variant text-sm">Enter the 6-digit code sent to your mail.</p>
                      </div>
                      <form onSubmit={handleForgotVerify} className="space-y-10">
                        <div className="flex justify-center gap-3">
                          {otp.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              className="w-12 h-16 text-center text-2xl font-headline bg-surface-container-highest border border-outline-variant/30 text-primary rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                              maxLength={1}
                              type="text"
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              required
                            />
                          ))}
                        </div>
                        {otpError && (
                          <p className="text-xs text-error text-center -mt-4">{otpError}</p>
                        )}
                        <button 
                          className="w-full bg-primary/10 border border-primary/30 text-primary py-4 rounded-lg uppercase tracking-widest font-bold text-xs hover:bg-primary/20 transition-all disabled:opacity-50"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                      </form>
                      <p className="text-xs text-on-surface-variant opacity-60">
                        Didn't receive the code? <button className="text-primary font-bold hover:underline">Resend</button>
                      </p>
                    </motion.div>
                  )}

                  {forgotStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="max-w-md mx-auto space-y-8"
                    >
                      <div className="space-y-2">
                        <h2 className="font-headline text-2xl text-on-surface">Restore Access</h2>
                        <p className="text-on-surface-variant text-sm">Create a new master key for your vault.</p>
                      </div>
                      {authError && <div className="text-error font-body text-sm mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-center">{authError}</div>}
                      <form className="space-y-6" onSubmit={handleForgotRestore}>
                        <div className="space-y-2">
                          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-outline">New Master Key</label>
                          <div className="relative">
                            <input 
                              className="w-full bg-surface-container-highest border-b border-outline-variant/30 text-on-surface py-4 px-4 focus:outline-none focus:border-primary transition-all" 
                              placeholder="••••••••" 
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                            <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={18} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-outline">Confirm Master Key</label>
                          <div className="relative">
                            <input 
                              className="w-full bg-surface-container-highest border-b border-outline-variant/30 text-on-surface py-4 px-4 focus:outline-none focus:border-primary transition-all" 
                              placeholder="••••••••" 
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <button 
                          className="w-full bg-primary text-on-primary py-4 rounded-lg uppercase tracking-widest font-bold text-xs hover:bg-secondary-container transition-all disabled:opacity-70"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {forgotStep === 4 && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 space-y-8"
                    >
                      <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5">
                          <Check className="text-primary" size={40} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h2 className="font-headline text-3xl text-primary font-bold">Vault Restored</h2>
                        <p className="text-on-surface-variant">Your security credentials have been updated successfully.</p>
                      </div>
                      <button 
                        onClick={() => setView('login')}
                        className="inline-flex items-center gap-3 text-primary uppercase tracking-[0.3em] font-bold text-sm hover:translate-x-2 transition-transform group"
                      >
                        Return to Gallery 
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Support Footer */}
            <div className="relative z-10 mt-12 text-center text-outline/60 text-[10px] uppercase tracking-[0.3em] max-w-xs">
              Having trouble? Contact the <span className="text-primary/60">Concierge Desk</span> for immediate assistance.
            </div>

            {/* Global Footer */}
            <footer className="relative z-10 w-full mt-20 border-t border-outline-variant/5 bg-surface-container-lowest">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-480 mx-auto">
                <div className="col-span-1 md:col-span-2">
                  <div className="text-lg font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant text-xs leading-relaxed max-w-sm font-body">
                    A private sanctuary for the world's most exquisite digital artifacts. Curated with precision, secured with the latest encryption standards.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">Concierge</div>
                  <nav className="flex flex-col gap-4">
                    <button type="button" onClick={() => openInfoPage('private-suite')} className="text-left text-on-surface-variant text-xs hover:text-primary transition-colors">Private Suite</button>
                    <button type="button" onClick={() => openInfoPage('shipping-etiquette')} className="text-left text-on-surface-variant text-xs hover:text-primary transition-colors">Shipping Etiquette</button>
                    <button type="button" onClick={() => openInfoPage('authenticity-guarantee')} className="text-left text-on-surface-variant text-xs hover:text-primary transition-colors">Authenticity Guarantee</button>
                  </nav>
                </div>
                <div className="space-y-4 text-right">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">Legal</div>
                  <nav className="flex flex-col gap-4">
                    <button type="button" onClick={() => openInfoPage('terms-of-service')} className="text-right text-on-surface-variant text-xs hover:text-primary transition-colors">Terms of Service</button>
                    <a className="text-on-surface-variant text-xs hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <p className="text-on-surface-variant text-[10px] mt-8 opacity-40">© 2024 The Obsidian Curator. All Rights Reserved.</p>
                  </nav>
                </div>
              </div>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
    </SearchContext.Provider>
  );
}
