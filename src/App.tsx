import React, { useState, useContext } from 'react';
import { 
  Eye, EyeOff, Check, User, Mail, Phone, Lock, ArrowRight, Diamond, 
  ArrowLeft, ShieldCheck, KeyRound, Key, Search, Heart, ShoppingBag, 
  Monitor, Shirt, Armchair, Sparkles, Dumbbell, BookOpen, Gamepad2, 
  ShoppingBasket, Zap, Star, Apple, Play, Plus, Menu, X, ChevronRight, ChevronLeft, Minus, Truck, Share2, Bookmark, Trash2,
  LayoutGrid, DollarSign, Award, Package, RotateCcw, List, CreditCard, Smartphone, Building2, Wallet, Banknote,
  CheckCircle2, Copy, MapPin, Activity, Download, Headphones, Route, ExternalLink, PhoneCall, MessageSquare, Clock, Map,
  Filter, ChevronDown, Box, History, RefreshCw, Layers, Bell, Shield, HelpCircle, Fingerprint, Camera, Home,
  LayoutDashboard, Users, BarChart3, Ticket, TrendingUp, TrendingDown, UserPlus, MoreVertical, Settings,
  SignalHigh, Trash, Edit, Globe, Watch, LogOut,
  CreditCard as CreditCardIcon, Star as StarIcon, Package as PackageIcon, Search as SearchIcon, Truck as TruckIcon, Eye as EyeIcon, Award as AwardIcon, LayoutGrid as LayoutGridIcon, DollarSign as DollarSignIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'login' | 'register' | 'forgot-password' | 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout-address' | 'checkout-payment' | 'checkout-review' | 'checkout-success' | 'order-tracking' | 'my-orders' | 'profile' | 'wishlist' | 'category-timepieces' | 'category-jewelry' | 'category-leather' | 'category-fashion' | 'category-home' | 'category-beauty' | 'category-sports' | 'category-books' | 'category-toys' | 'profile-addresses' | 'profile-payments' | 'profile-notifications' | 'profile-security' | 'profile-help';

type SearchContextValue = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const SearchContext = React.createContext<SearchContextValue>({
  searchTerm: '',
  setSearchTerm: () => {}
});

const toNumericPrice = (value: string) => Number(value.replace(/[$,]/g, ''));

const getCategoryForBrand = (brand?: string): View => {
  const brandName = (brand || '').toLowerCase();
  if (/vacheron|audemars|patek|richard|omega|cartier|chronos|aurelian|techne/.test(brandName)) return 'category-timepieces';
  if (/chopard|graff|piaget|tiffany|bvlgari|harry winston|van cleef/.test(brandName)) return 'category-jewelry';
  if (/hermès|louis vuitton|bottega|prada|fendi|dior|gucci|mara/.test(brandName)) return 'category-leather';
  if (/saint laurent|chanel|savile|valeria/.test(brandName)) return 'category-fashion';
  return 'shop';
};

const TopNavBar = ({ 
  view, 
  setView, 
  cartCount, 
  showProfileDropdown, 
  setShowProfileDropdown 
}: { 
  view: View, 
  setView: (v: View) => void, 
  cartCount: number,
  showProfileDropdown: boolean,
  setShowProfileDropdown: (b: boolean) => void
}) => {
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const isCategory = view.startsWith('category-');
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 px-6 md:px-12 py-4">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isCategory && (
            <button
              onClick={() => setView('home')}
              className="p-2 hover:bg-surface-container-highest/30 rounded-lg transition-colors text-on-surface-variant hover:text-primary"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-[0_0_20px_rgba(230,195,100,0.3)] group-hover:scale-110 transition-transform">
              <Diamond size={20} />
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
  setView 
}: { 
  view: View, 
  setView: (v: View) => void 
}) => {
  const categories = [
    { id: 'category-timepieces', icon: Watch, label: 'Timepieces', count: '42 ITEMS' },
    { id: 'category-fashion', icon: Shirt, label: 'Fashion', count: '842 ITEMS' },
    { id: 'category-home', icon: Armchair, label: 'Home', count: '450 ITEMS' },
    { id: 'category-beauty', icon: Sparkles, label: 'Beauty', count: '312 ITEMS' },
    { id: 'category-sports', icon: Dumbbell, label: 'Sports', count: '210 ITEMS' },
    { id: 'category-books', icon: BookOpen, label: 'Books', count: '1,029 ITEMS' },
    { id: 'category-toys', icon: Gamepad2, label: 'Toys', count: '560 ITEMS' },
    { id: 'category-jewelry', icon: Diamond, label: 'Jewelry', count: '150 ITEMS' },
  ];

  return (
    <div className="w-full bg-background border-b border-outline-variant/10 sticky top-20 z-40">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setView(cat.id as View)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                view === cat.id 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-surface-container-highest/20 border border-outline-variant/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                view === cat.id 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-surface-container-highest text-on-surface-variant group-hover:text-primary'
              }`}>
                <cat.icon size={24} />
              </div>
              <div className="text-center">
                <p className={`font-headline text-sm font-semibold ${
                  view === cat.id ? 'text-on-surface' : 'text-on-surface-variant'
                }`}>
                  {cat.label}
                </p>
                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/60 mt-1">
                  {cat.count}
                </p>
              </div>
            </button>
          ))}
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
  children
}: {
  view: View,
  setView: (v: View) => void,
  cartItems: any[],
  showProfileDropdown: boolean,
  setShowProfileDropdown: (b: boolean) => void,
  title: string,
  description: string,
  children: React.ReactNode
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
      />

      <div className="flex max-w-[1920px] mx-auto min-h-screen w-full">
        <ProfileSidebar currentView={view} setView={setView} />
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

const ProfileSidebar = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
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
      <div className="mt-auto pt-8 border-t border-outline-variant/5">
        <button className="flex items-center gap-4 px-4 py-3 text-on-surface-variant/40 hover:text-on-surface font-headline text-sm uppercase tracking-widest hover:translate-x-1 transition-transform duration-200">
          <RotateCcw size={18} />
          <span>Clear All</span>
        </button>
      </div>
    </aside>
  );
};

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterStatus('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('Subscribed successfully.');
    setNewsletterEmail('');
  };

  return (
    <footer className="w-full mt-20 bg-surface-container-lowest border-t border-outline-variant/5 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="text-lg font-bold text-primary mb-4 font-headline tracking-tight">The Obsidian Curator</div>
          <p className="text-on-surface-variant/40 font-headline text-xs leading-relaxed max-w-xs">An exclusive sanctuary for the world's most distinguished collectors and curators of fine luxury goods.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Concierge</h4>
          <a className="text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Private Suite</a>
          <a className="text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Shipping Etiquette</a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Legal</h4>
          <a className="text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Terms of Service</a>
          <a className="text-on-surface-variant/40 hover:text-primary font-headline text-xs transition-colors cursor-pointer">Authenticity Guarantee</a>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-primary text-[10px] uppercase tracking-[0.3em] font-bold mb-2">The Newsletter</h4>
          <form className="relative" onSubmit={submitNewsletter}>
            <input
              className="w-full bg-transparent border-b border-outline-variant focus:border-primary transition-colors py-2 text-xs text-on-surface outline-none"
              placeholder="Email Address"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="absolute right-0 bottom-2 text-primary">
              <ArrowRight size={16} />
            </button>
          </form>
          {newsletterStatus && <p className="text-[10px] text-primary/80">{newsletterStatus}</p>}
          <p className="text-[10px] text-on-surface-variant/50">© 2024 The Obsidian Curator. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const timepieceProducts = [
  { id: 1, brand: 'Vacheron Heritage', name: 'Patrimony Moon Phase', price: '$38,500', img: 'https://images.unsplash.com/photo-1523170335684-f042f1b8f374?w=500&h=500&fit=crop' },
  { id: 2, brand: 'Audemars Piguet', name: 'Royal Oak Offshore', price: '$54,200', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
  { id: 3, brand: 'Patek Philippe', name: 'Nautilus Skeleton', price: '$120,000', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop' },
  { id: 4, brand: 'Richard Mille', name: 'RM 011 Felipe Massa', price: '$185,000', img: 'https://images.unsplash.com/photo-1506084868230-bb8a9135be18?w=500&h=500&fit=crop' },
  { id: 5, brand: 'Cartier', name: 'Tank Louis Cartier', price: '$14,800', img: 'https://images.unsplash.com/photo-1633114291692-bda994bb3334?w=500&h=500&fit=crop' },
  { id: 6, brand: 'Omega', name: 'Speedmaster Moonphase', price: '$12,400', img: 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=500&h=500&fit=crop' }
];

const jewelryProducts = [
  { id: 7, brand: 'Cartier', name: 'Love Bracelet Diamond-Paved', price: '$42,100', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
  { id: 8, brand: 'Tiffany & Co.', name: 'HardWear Graduated Link', price: '$18,500', img: 'https://images.unsplash.com/photo-1515562141207-5dba3b964d7d?w=500&h=500&fit=crop' },
  { id: 11, brand: 'Van Cleef & Arpels', name: 'Alhambra Necklace Gold', price: '$28,500', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
  { id: 12, brand: 'Bvlgari', name: 'Serpenti Viper Ring', price: '$15,800', img: 'https://images.unsplash.com/photo-1599643478582-9969c1e0b06b?w=500&h=500&fit=crop' },
  { id: 13, brand: 'Chopard', name: 'Happy Diamonds Moving', price: '$22,900', img: 'https://images.unsplash.com/photo-1515562141207-5dba3b964d7d?w=500&h=500&fit=crop' },
  { id: 14, brand: 'Graff Diamonds', name: 'Infinity Diamond Earrings', price: '$65,000', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop' },
  { id: 15, brand: 'Piaget', name: 'Possession Bracelet', price: '$34,500', img: 'https://images.unsplash.com/photo-1515562141207-5dba3b964d7d?w=500&h=500&fit=crop' },
  { id: 16, brand: 'Harry Winston', name: 'Emerald Cluster Pendant', price: '$78,500', img: 'https://images.unsplash.com/photo-1599643478582-9969c1e0b06b?w=500&h=500&fit=crop' }
];

const leatherProducts = [
  { id: 9, brand: 'Hermès', name: 'Birkin 35 Togo', price: '$24,500', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop' },
  { id: 10, brand: 'Louis Vuitton', name: 'Keepall Bandoulière 50', price: '$3,200', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop' },
  { id: 17, brand: 'Bottega Veneta', name: 'Intrecciato Woven Tote', price: '$5,900', img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop' },
  { id: 18, brand: 'Prada', name: 'Saffiano Leather Briefcase', price: '$4,200', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop' },
  { id: 19, brand: 'Gucci', name: 'Marmont Leather Shoulder Bag', price: '$2,650', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop' },
  { id: 20, brand: 'Celine', name: 'Classic Box Leather Bag', price: '$3,850', img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=500&fit=crop' },
  { id: 21, brand: 'Fendi', name: 'Baguette Leather Crossbody', price: '$2,200', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop' },
  { id: 22, brand: 'Dior', name: 'Book Tote Embroidered Bag', price: '$3,600', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop' }
];

const fashionProducts = [
  { id: 23, brand: 'Gucci', name: 'Silk Double Breasted Blazer', price: '$4,200', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop' },
  { id: 24, brand: 'Saint Laurent', name: 'Le Smoking Tuxedo', price: '$5,800', img: 'https://images.unsplash.com/photo-1617021231846-42bd5ce3fcd5?w=500&h=500&fit=crop' },
  { id: 25, brand: 'Hermès', name: 'Trench Coat Cashmere', price: '$6,500', img: 'https://images.unsplash.com/photo-1539613881-24b0fed0edd9?w=500&h=500&fit=crop' },
  { id: 26, brand: 'Chanel', name: 'Tweed Jacket', price: '$7,200', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=500&fit=crop' },
];

const homeProducts = [
  { id: 27, brand: 'Baccarat', name: 'Empire Chandelier Gold', price: '$8,500', img: 'https://images.unsplash.com/photo-1565636192335-14f0c6710223?w=500&h=500&fit=crop' },
  { id: 28, brand: 'Medusa Art', name: 'Marble Sculpture', price: '$12,000', img: 'https://images.unsplash.com/photo-1578926314433-8e51a28a0204?w=500&h=500&fit=crop' },
  { id: 29, brand: 'Heritage Design', name: 'Persian Rug 4x6', price: '$18,900', img: 'https://images.unsplash.com/photo-1578926314433-8e51a28a0204?w=500&h=500&fit=crop' },
  { id: 30, brand: 'Restoration Hardware', name: 'Victorian Settee', price: '$9,800', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop' },
];

const beautyProducts = [
  { id: 31, brand: 'Creed', name: 'Royal Oud Parfum', price: '$620', img: 'https://images.unsplash.com/photo-1595777707802-21b287641c1d?w=500&h=500&fit=crop' },
  { id: 32, brand: 'Heeley', name: 'Rose Helena Perfume', price: '$480', img: 'https://images.unsplash.com/photo-1599599810694-b3b2f5532d1c?w=500&h=500&fit=crop' },
  { id: 33, brand: 'Penhaligons', name: 'Heritage Collection Set', price: '$850', img: 'https://images.unsplash.com/photo-1595777707802-21b287641c1d?w=500&h=500&fit=crop' },
  { id: 34, brand: 'Acqua di Parma', name: 'Blu Mediterraneo', price: '$220', img: 'https://images.unsplash.com/photo-1599599810694-b3b2f5532d1c?w=500&h=500&fit=crop' },
];

const sportsProducts = [
  { id: 35, brand: 'Callaway', name: 'Golf Club Set Carbon', price: '$2,850', img: 'https://images.unsplash.com/photo-1535088462336-e933e3f06e57?w=500&h=500&fit=crop' },
  { id: 36, brand: 'Wilson', name: 'Pro Tennis Racket', price: '$680', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34c8?w=500&h=500&fit=crop' },
  { id: 37, brand: 'Bauer', name: 'Ice Hockey Equipment', price: '$1,200', img: 'https://images.unsplash.com/photo-1535088462336-e933e3f06e57?w=500&h=500&fit=crop' },
  { id: 38, brand: 'Specialized', name: 'Carbon Mountain Bike', price: '$4,500', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop' },
];

const booksProducts = [
  { id: 39, brand: 'First Edition', name: 'Signed Hemingway Collection', price: '$4,200', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop' },
  { id: 40, brand: 'Antiquarian', name: 'Leather Bound Shakespeare', price: '$3,100', img: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=500&fit=crop' },
  { id: 41, brand: 'Vintage Press', name: 'Limited Edition Art Book', price: '$1,850', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=500&fit=crop' },
  { id: 42, brand: 'Collector Editions', name: 'Signed Philosophy Set', price: '$2,600', img: 'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=500&fit=crop' },
];

const toysProducts = [
  { id: 43, brand: 'Steiff', name: 'Limited Edition Teddy Bear', price: '$1,200', img: 'https://images.unsplash.com/photo-1590080876/teddy-bear?w=500&h=500&fit=crop' },
  { id: 44, brand: 'Lego', name: 'Platinum Set Collectible', price: '$890', img: 'https://images.unsplash.com/photo-1594545514411-854a028e7195?w=500&h=500&fit=crop' },
  { id: 45, brand: 'Scalextric', name: 'Vintage Track Set', price: '$1,450', img: 'https://images.unsplash.com/photo-1594545514411-854a028e7195?w=500&h=500&fit=crop' },
  { id: 46, brand: 'Hot Wheels', name: 'Rare 1968 Custom', price: '$2,800', img: 'https://images.unsplash.com/photo-1594545514411-854a028e7195?w=500&h=500&fit=crop' },
];

const CategoryLayout = ({ 
  view, 
  setView, 
  cartItems, 
  showProfileDropdown, 
  setShowProfileDropdown,
  title,
  subtitle,
  heroImg,
  products
}: {
  view: View,
  setView: (v: View) => void,
  cartItems: any[],
  showProfileDropdown: boolean,
  setShowProfileDropdown: (b: boolean) => void,
  title: string,
  subtitle: string,
  heroImg: string,
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
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
      />

      <CategoryBar 
        view={view} 
        setView={setView} 
      />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <img 
            src={heroImg} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 text-center space-y-6 px-6">
            <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold">{subtitle}</span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-on-surface tracking-tighter">{title}</h1>
          </div>
        </section>

        <div className="max-w-[1920px] mx-auto w-full px-6 md:px-12 py-20">
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
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-lowest relative rounded-sm">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="w-12 h-12 rounded-full bg-on-surface text-background flex items-center justify-center hover:bg-primary transition-colors">
                      <ShoppingBag size={18} />
                    </button>
                    <button 
                      className="px-6 py-3 bg-background/80 backdrop-blur text-[10px] uppercase tracking-widest font-bold text-on-surface hover:bg-on-surface hover:text-background transition-all"
                      onClick={() => setView('product-detail')}
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
                      onClick={() => setView('product-detail')}
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
      <Footer />
    </motion.div>
  );
};

const ProfileDropdown = ({ setView, onClose }: { setView: (v: View) => void, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-4 w-64 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl z-[100] overflow-hidden"
    >
      <div className="p-4 border-b border-outline-variant/10 bg-surface-container-highest/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-headline font-bold text-on-surface">Alexander Vance</p>
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
          onClick={() => { setView('login'); onClose(); }}
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
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Obsidian Chronograph MK II',
      price: 14500,
      variant: 'Midnight Gold / Sapphire Glass',
      quantity: 1,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZLtyJY0T_xYQ4dgbHTpaT8jV1nkOFLQqS_YToxNdmgTku2pqHcrJolN4CFHsRz7ppEJ0sN5Q--XCQvvfJlh_x9Nv36FFUkSDbxyWxnwphIw7wgkfzaoMrKLmlfLc7z5xXfiWT9eJPhEY5P7RbLxgK6brX40apJpHfokciMlIplJJaFLfKcdaM4rNyQKcZeoEcnvUZatJLOi4beuNDipS3dMyUrsf_YlzlkaafGCy9GTQjcQs9hZ6MUW8r0Ed7KyLPYz1_o2awav4',
      outOfStock: false
    },
    {
      id: 2,
      name: 'The Archon Lounge Chair',
      price: 3200,
      variant: 'Hand-Carved Ebony / Gold Leaf',
      quantity: 0,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW0D-rFr_LJooQnIVylTNYb5yC8Y2uxK9zE7D-TFkzqlr9p3S3ZjRy1R7uzxR6hLkhHSk_sclGoqHj_VU7mpzyYmpOr9tQABkHjvUWJajdcibj_DWuqf-YLaVXt19Z8g19ARvF7TSxx25O6LCId4uu0-ect4hD5iyv8lqq-iUCWhBniYXzbBEYUAkB2r_1_e-5G2Tihd46eSUzsI2sMQ6vopxL4qDnJW4glQy4JMcXNCRCY08PkFOMjljPXRReJDEKpFVnKWA69iw',
      outOfStock: true
    },
    {
      id: 3,
      name: 'Essence of Void (Limited Edition)',
      price: 850,
      variant: '100ml Parfum / Collector Case',
      quantity: 2,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU8yjUAd9oPk5oNzuGEZYqp7tnvVQQ5CnF-ef6B1BDXwrzTEAd1_7dpF3yFsJFhO2yjGyS9RLnQW4eFnt1xlQTDj2-4Rg5ZaU4jMPmJgEdD6__euR-2bhFjwG9Rzrt8dDowTfmoca2mf_--8o3ggwcsel8yCPyRarEwOvmxBYCB8te-lKEyYPutCZCIMkF_c8U6lvB9jA8anCMhO4_ZQ2x6sp1s5RA7CbEbN0806uD_lIYC5Mcx34eyiQptX29iej5lDUatmURZww',
      outOfStock: false
    }
  ]);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 101,
      name: 'Noir Architect Bag',
      price: 4250,
      sku: 'OBS-7721',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXrl-PgGyFXAkoiRkt-_1gsnpsg0geI5JtylUb-tAs28FTpxN6STtwz0OZwmv-u-3nwT95yoRyyBx3H4Ud7AQVUViI0l4q5uloc2iu5uqLF3sxxxW1HtvBELT0Uh8BkjzflbAETpMXNq-pUdQH0WLhWvtPaHWIQSaFJ2kfE0iWZjcQ5xe8s7UUgC2s-L_jDjayA7ikJTTeklgFhDLTjELP-tUD4drtIIcq4v-TysnjuNjizLvgPjNjMyKBrT5tUEFtbDnPLCYNmA'
    },
    {
      id: 102,
      name: 'Ethereal Chrono',
      price: 12800,
      sku: 'OBS-1099',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUmqWyWmckSwvqlXnrokBllJWQilzRe90w064wzfqWnT8kqymX-gSZq7e2jamQQ-zgO5NJqu2d8hVLb9vqKOMCCyBlx1OdI5STpezTZFMU-XUoaQQPUE5DbahV4843-Q8ymFH0czxPtHjsAQ95KZgMXKYbjN8q8XT-PlMx4cKPOuPNUECVLvst8aVvg3xgYtYatUpiODqYN3oiTbf7_0Yyl8qFSnD6ZAKW0Y0Lm2FZElMJGXQb9o-v4IpSunxuaa7VrVC-pl_HSCM'
    },
    {
      id: 103,
      name: 'Imperial Silk Drape',
      price: 890,
      sku: 'OBS-0045',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwpPqziGJ4hGa1_6cTl4ffwP7vU4w--Q2sxXiLiBA5xpeqsryEyRB1ZXz4od2x_CjA7E7ihrCdkceJDqLr-jS6kEnESv1LU2gUoOIlmqjCBtJF7-YtAwbwMYe31p4-FvbzIqp-s-If2KgpGmVtZxzkfZlXlKxbIlW2KfKt3K7iSGUfRiQhay1toayNrvBkQ7N1Bevkh4dfVJtFpgWpbjmizLL5ijxnkYaBNmAT5Y7VbRw3qVh1mUz_oDwIHxeTJySmV4fb9CRnhYs'
    },
    {
      id: 104,
      name: 'Aurelian Stilettos',
      price: 1100,
      sku: 'OBS-3382',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhxWwFxcfoZ6C0FIa1GSZbMymePYJBiAEbIrnLdMRIPqxaHbfd6fMukU-_Vyfh3XPDAhOSfWwqkQMPEXAxzoCIwNfYmhI438kC2j-zmGhCRLMYnKPXj78FF85RZeEz5qzM7BQqN3ZsWpQ47hEbM28xf9dQ6jP-vmuB12qvHOqjGPv0e5nI3lFqr5GJjI3xta-MXIO6RfXuLoPBhxb6XmNn1p7Pp01BL7EOsncsFw76cTeVKRXijt4NCPG2WFYo6OzqtCIzjmuPjJU'
    }
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [shopSortBy, setShopSortBy] = useState<'relevance' | 'low-to-high' | 'high-to-low' | 'top-rated'>('relevance');
  const [shopMaxPrice, setShopMaxPrice] = useState<'all' | '5000' | '10000' | '20000'>('all');
  const [shopMinRating, setShopMinRating] = useState<0 | 4 | 5>(0);
  const [otpError, setOtpError] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Forgot Password states
  const [forgotStep, setForgotStep] = useState(1); // 1: Identify, 2: Verify, 3: Restore, 4: Success
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const addToWishlist = (product: any) => {
    if (!wishlistItems.find(item => item.id === product.id)) {
      setWishlistItems([...wishlistItems, product]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('home');
    }, 2000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('home');
    }, 2000);
  };

  const handleForgotIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep(2);
    }, 1500);
  };

  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (!/^\d{6}$/.test(enteredOtp)) {
      setOtpError('Enter a valid 6-digit code to continue.');
      return;
    }

    setOtpError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep(3);
    }, 1500);
  };

  const handleForgotRestore = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep(4);
    }, 1500);
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
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

    setNewsletterMessage('Subscribed successfully. Invitations will arrive in your inbox.');
    setNewsletterEmail('');
  };

  const shopProducts = [
    { id: 1001, brand: 'AUREL & CO', name: 'The Midnight Chrono', price: '$12,400', rating: 4.5, reviews: 42, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcc1ysQTol8JUR_QreOBTctd9-wWDZTkjgw6rFkk_zhsFfGrVwu5ZkkGcJDEggJVbHGxXlVVjZu-eGynLe0RyjNwzAS4WlAphEPGEwQKfH4LXdw3Nigkyl8CgpPItELUNH_-CAlxghstdiGpJgVXcaIJKpi4snCZBtp7JkVIKU7p8PhsKMFN1s0we3JFPYcLhrc0PuLefjls6FSF3wOmJpyyItsKFth-SJ04PYsffCXCbD0pklmEZo9Z_U7Kdo_wkgCI6IRk3r6Os' },
    { id: 1002, brand: 'ESSENCE NOIR', name: 'Velvet Oud Extract', price: '$850', rating: 5, reviews: 128, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnY3IkrKndvvqBCsfooDiD_mMXWFCCjhHzRd7qKfwagVxOzE_moPQP068Odna3MU4G18919aI3gd2Sq59Kijpc11Rgd3HcgHT7RQaFBkmPHuFlNjJ_WgloGA0oTpy3xqenip2EDT3THGMPk4soKH1xJ8HVlPv8S3UqoyzHFThLN1FeoK1IhMondM9UNUXfobdZZO73eTu5StIpyScS_DGXHjuBqUSeEsN6CQiKw7biXaPtU2px-tVmSPyFXTekrgNxckuBZ2uFryo' },
    { id: 1003, brand: 'VALERIA STELLE', name: 'Starlight Pumps', price: '$4,200', rating: 4.5, reviews: 18, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO5gXJpE3HtQEdhHnrZZZY_6BjMhmIHHmNrXgi83MXmFpxUjXI6XBPPaCGYiHAp_NUeEde4vdzBx5LJnfwPqatK7W0BljXUCAX19bJ87vWGXJKdXLwQWWasBRtawH_ZXUavxU6rrAzTmTP7ak8ttIv8oGHUlVxtpJNoXddiiXXyW0w5bmTslKvD-U0KpI1IkM8AEHD_6Jl2BZ1YYmxDJuOFVnzppxHwej5yAuixR95WEkJ1XZNeYvPVHs3eUWuQY6jPHlPvGY6M74' },
    { id: 1004, brand: 'SAVILE ELITE', name: 'Obsidian Tuxedo', price: '$6,800', rating: 4.8, reviews: 24, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwbQGzcfAAJP6mZQX8uh846G36_t1lidhdsU4F1DCgKR8gu1AKpiMDM5b6CA24uUyNvFGqgt2DwPQWVYhIEwGIizY4Eo1KwDHJRHPj_IfsVMDk2sbGvVE1T4xNHtEh2j56NhAe1x_CnnayPDf7qRdsNYfajYV7wAt91aAo_oxIXNzqqmNNnUdZihIi-r3pSYreEJa8U8W-r-3PEFA8LEGr1UO5jjnwkXRErZYrsnFSr4GV9fczgXBNc1cNlKfjCu9YbffkS3PyCyY' },
    { id: 1005, brand: 'MAISON MARA', name: 'The Heritage Tote', price: '$3,150', rating: 4.9, reviews: 56, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0C0J8X839ZwJ5BCotPeTrOp38HY1b1B-qwM2Obw4hg38S0MbWq433kvaKdyr8r2eShhEqxlH0JeWA6yn5q7CiGIcaxfY26zkTTPT3SXL87pkRX9vHc_GJ9tNoV_Pqm0N_4Pdvj_yH3ffD7Ci9ur85sF4zvKmzZumOoXJGV6qeYsDa6JVtA-Kl61e5rK1SG1MnHOFjWjm02VOJE40qSwmvCagtjGjAFffYypWZVWkq3bV8DnSfQsRVyDBDziyhZbtqvUznZ_ykBjE' },
    { id: 1006, brand: 'AUREL & CO', name: 'The Midnight Chrono', price: '$12,400', rating: 4.5, reviews: 42, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcc1ysQTol8JUR_QreOBTctd9-wWDZTkjgw6rFkk_zhsFfGrVwu5ZkkGcJDEggJVbHGxXlVVjZu-eGynLe0RyjNwzAS4WlAphEPGEwQKfH4LXdw3Nigkyl8CgpPItELUNH_-CAlxghstdiGpJgVXcaIJKpi4snCZBtp7JkVIKU7p8PhsKMFN1s0we3JFPYcLhrc0PuLefjls6FSF3wOmJpyyItsKFth-SJ04PYsffCXCbD0pklmEZo9Z_U7Kdo_wkgCI6IRk3r6Os' }
  ];

  const filteredShopProducts = shopProducts
    .filter((product) => {
      const matchesSearch = !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = shopMaxPrice === 'all' || toNumericPrice(product.price) <= Number(shopMaxPrice);
      const matchesRating = product.rating >= shopMinRating;
      return matchesSearch && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      if (shopSortBy === 'low-to-high') return toNumericPrice(a.price) - toNumericPrice(b.price);
      if (shopSortBy === 'high-to-low') return toNumericPrice(b.price) - toNumericPrice(a.price);
      if (shopSortBy === 'top-rated') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

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
      {/* Overlay Grain Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

      <AnimatePresence mode="wait">
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
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
            />

            <main className="max-w-[1920px] mx-auto px-8 md:px-12 py-16 flex-grow">
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
                    { name: 'Vanguard Titanium VII', price: '$8,900.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9yKS7lKG6nzAZUnoDJ6Dh4KjMZ6Ely0t-BGuWCPkjnYystsMd5XPHD9qQDo7YNbTamm-xwpbCCJdRsdfUy1eY9WuJ7tDI_yF0h7Vae6ZPdOhBB506Zy5C704pC8CD5Nrw_aB1yCG2ey7N9GWpn6GW6RH5G0o5HJtH4lHaHdmYJMFVeq4-qb4SC8dvIl3E0i6d8jo_PoZwMch-V5c5GbLzzbM9FSFpQRbDc7ajeUPqtLNvFqDnl0yoNhXy60XbCqpl9rh3gniMUwQ' },
                    { name: 'Nomad Leather Holdall', price: '$2,450.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh8RXwoI94VQ9T1jx_0iszg3N6y6tbEw-f8AL59q6dxVPjsuNs8BMorQmNs5odRgAH0fHo2r2epFT_Q2a6IPXhkp-3Bz42e5-m1NIsa_ooV3wWV8dm5K8peLnubr_8wrNYgyVs7hrbMoDVCg-uZ7hd7em6P99GaDNrXokpV3fU-1kMIeMChCA2iXJLKd_Ylhu4ExeCorMuMOnn9z20yYGKbsCGVOx4gBex94dorYDRvY-dvySQCmDFJDMyF9qA5x8ur6KUswc1cug' },
                    { name: 'Stiletto Noir \'24', price: '$1,150.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWt0sgrctWUgrBdPIupTTjZHXJP9zIV3u2BcoqUEtMyAyvLaFSZdHtiA61pP1v0WgjrdJi10Djh4P1OlqftEogqVs88IRt4JC9CBt4zKxn0GpsyjD972YJw-y6vK_nG4X_83ZuQ6ehIgSCcyd8ljMg9_m6Rwxcq1pyjpyccevxBkybSgw5ixbgbPJm2nRsYWh4lNHAbyV64TCPwyKyklMznanXMTA2wuuVDL22GCe2MZi45k-Uax3mMDHjc36PdNk6YMrRNcYwHwo' },
                    { name: 'Eclipse Shades', price: '$620.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn6xOKVfISdW3SWOCKl1KZOEXBbN8sBYrxfkDSberFqHHrky9W8k1RVEMH4qIeVUgIB_l8bI-WBUF5sJwNbDx_44HYFKKT8W_g4TiBefO7qDGNTW_Bt5DXNChEt2tNlikHqzIaQGYt7HL-zXetgGX53jwcYIGfPiPuHdtt2oiqZIyqPG2Jfk5p-vtYUH4bOr8pypKyndQunYGIwxFcjsOIjXzLhs4wRbPd7SPBJ-a23Oj3U-BIHXs8mpjqODLi4IVSnNAq8zzipJA' }
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
            <footer className="w-full mt-20 bg-[#0e0e12] border-t border-[#F5F5F0]/5 pt-16 font-headline text-xs leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
                <div className="col-span-1 md:col-span-1">
                  <div className="text-lg font-bold text-primary mb-4">The Obsidian Curator</div>
                  <p className="text-[#F5F5F0]/40 max-w-[200px]">The definitive destination for the rarest acquisitions and bespoke luxury items.</p>
                </div>
                <div>
                  <h5 className="text-primary uppercase tracking-widest mb-6 text-[10px]">Concierge</h5>
                  <ul className="space-y-4">
                    <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors" href="#">Private Suite</a></li>
                    <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors" href="#">Shipping Etiquette</a></li>
                    <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors" href="#">Authenticity Guarantee</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-primary uppercase tracking-widest mb-6 text-[10px]">Legal</h5>
                  <ul className="space-y-4">
                    <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors" href="#">Terms of Service</a></li>
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
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
            />

            <main className="max-w-[1440px] mx-auto px-8 py-12 md:py-20 flex-grow w-full">
              {/* Progress Indicator */}
              <nav className="mb-20 flex justify-center overflow-x-auto pb-4 no-scrollbar">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center font-headline font-bold">1</div>
                    <span className="font-headline text-primary tracking-wide text-sm uppercase">Address</span>
                  </div>
                  <div className="w-16 h-[1px] bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">2</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Payment</span>
                  </div>
                  <div className="w-16 h-[1px] bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">3</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Review</span>
                  </div>
                  <div className="w-16 h-[1px] bg-outline-variant/30 shrink-0"></div>
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

                  {/* Saved Addresses Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Card Active */}
                    <label className="relative group cursor-pointer">
                      <input defaultChecked className="peer sr-only" name="address" type="radio"/>
                      <div className="h-full p-6 bg-surface-container-highest/10 backdrop-blur-xl border border-outline-variant/30 rounded-xl transition-all duration-500 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-surface-container-high/40">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-headline uppercase tracking-[0.2em] rounded-full">Home</span>
                          <div className="w-5 h-5 rounded-full border border-outline-variant peer-checked:bg-primary flex items-center justify-center transition-colors">
                            <div className="w-2 h-2 rounded-full bg-on-primary opacity-0 peer-checked:opacity-100"></div>
                          </div>
                        </div>
                        <h3 className="text-lg font-headline text-on-surface mb-1">Julian Thorne</h3>
                        <p className="text-sm text-on-surface-variant mb-4">+1 (555) 012-3456</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                          427 Obsidian Avenue, Suite 900<br/>
                          Lower Manhattan, NY 10013<br/>
                          United States
                        </p>
                      </div>
                    </label>

                    {/* Address Card */}
                    <label className="relative group cursor-pointer">
                      <input className="peer sr-only" name="address" type="radio"/>
                      <div className="h-full p-6 bg-surface-container-highest/10 backdrop-blur-xl border border-outline-variant/30 rounded-xl transition-all duration-500 peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-surface-container-high/40">
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-headline uppercase tracking-[0.2em] rounded-full">Work</span>
                          <div className="w-5 h-5 rounded-full border border-outline-variant peer-checked:bg-primary flex items-center justify-center transition-colors"></div>
                        </div>
                        <h3 className="text-lg font-headline text-on-surface mb-1">Julian Thorne</h3>
                        <p className="text-sm text-on-surface-variant mb-4">+1 (555) 987-6543</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                          Metropolitan Tower, Floor 54<br/>
                          Financial District, NY 10005<br/>
                          United States
                        </p>
                      </div>
                    </label>

                    {/* Add New Address Button */}
                    <button className="h-full p-8 border border-dashed border-outline-variant/50 rounded-xl flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:text-primary hover:border-primary transition-all duration-500 hover:bg-primary/5 group">
                      <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                      </div>
                      <span className="font-headline tracking-widest text-xs uppercase">Add New Address</span>
                    </button>
                  </div>

                  {/* Inline Form (Expanded State Concept) */}
                  <div className="pt-8 border-t border-outline-variant/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                        <input className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light outline-none" placeholder="Enter full name" type="text"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                        <input className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light outline-none" placeholder="+1 (000) 000-0000" type="tel"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Pincode</label>
                        <input className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light font-mono outline-none" placeholder="Zip / Postal Code" type="text"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Address Type</label>
                        <div className="flex gap-4 py-1">
                          <button className="px-4 py-2 rounded-full border border-primary bg-primary/10 text-primary text-[10px] font-headline uppercase tracking-widest">Home</button>
                          <button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant text-[10px] font-headline uppercase tracking-widest hover:border-on-surface transition-colors">Work</button>
                          <button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant text-[10px] font-headline uppercase tracking-widest hover:border-on-surface transition-colors">Other</button>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">Address Line 1</label>
                        <input className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 py-3 transition-all font-light outline-none" placeholder="Street name and house number" type="text"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">City</label>
                        <input className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text" defaultValue="New York"/>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant ml-1">State</label>
                        <input className="w-full bg-surface-container-highest/50 border-0 border-b border-outline-variant/40 focus:ring-0 focus:border-primary text-on-surface py-3 transition-all font-light outline-none" type="text" defaultValue="NY"/>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button 
                      className="group flex items-center gap-4 bg-primary text-on-primary px-12 py-5 rounded-lg font-headline font-bold tracking-widest uppercase text-xs overflow-hidden relative transition-all hover:shadow-[0_0_30px_rgba(230,195,100,0.3)] active:scale-95"
                      onClick={() => {
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
                    <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
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
            <footer className="w-full mt-20 bg-[#0e0e12] border-t border-[#F5F5F0]/5 pt-16">
              <div className="max-w-[1920px] mx-auto px-12 py-20">
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
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Private Suite</a></li>
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Shipping Etiquette</a></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Legal</h5>
                    <ul className="space-y-4">
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Terms of Service</a></li>
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Authenticity Guarantee</a></li>
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
            />

            <main className="max-w-[1440px] mx-auto px-8 py-12 md:py-20 flex-grow w-full">
              {/* Progress Indicator */}
              <nav className="mb-20 flex justify-center overflow-x-auto pb-4 no-scrollbar">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center font-headline font-bold">1</div>
                    <span className="font-headline text-primary tracking-wide text-sm uppercase">Address</span>
                  </div>
                  <div className="w-16 h-[1px] bg-primary shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center font-headline font-bold">2</div>
                    <span className="font-headline text-primary tracking-wide text-sm uppercase">Payment</span>
                  </div>
                  <div className="w-16 h-[1px] bg-outline-variant/30 shrink-0"></div>
                  <div className="flex items-center gap-3 shrink-0 opacity-40">
                    <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center font-headline font-bold">3</div>
                    <span className="font-headline tracking-wide text-sm uppercase">Review</span>
                  </div>
                  <div className="w-16 h-[1px] bg-outline-variant/30 shrink-0"></div>
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
                          <img loading="lazy" className="h-6 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6COW9Wlghkg27HhY8Bv0r0aRHiAQ-Rs-5l3FjZC9jBT582dsgbTsu998n-UDSPlC9brVW-X3f4sjRUjJXM_APbPu73-tqN7Dt-oSrB3IDtjzSTwmdC1KluyTRU237t71CkWVvNXH1hcg-1KpLPiRQw5wl3kjuNuqJF5jp85Wm4UEgkbrHa6MHQ72xmU_04MiENtQgBfwG4ciVCTxuTPF6F66TMxEG6mJpa-gCW0_7jeGfecLkMvj2Erarrv1YvJXFXThRg0l4_VY" alt="Visa" />
                          <img loading="lazy" className="h-6 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiKrjxS9gB9now9ctq4FNKNBzsS1JCEpgwzu5KyhtRiz7SbaYGcd7-4qIjVu6Ue3D3O0IWnMUcmaQ7uQgHQNIq1GPrRmYYWXVNNNxaqzTweIJMTXO8hdarfPT_khnExM0YqxVVYbCQus1vuEJCfVFqV9eY3UtOzYehkyMmGEDhw1u55ZF-lxIds57XpZy1Su4XWjdK9J4M6ClN_9TDahf3ZGvDegmsHL2s4GAC-CifsxJTfjRV5RqJnMoN7_nrNhxJgKTTeiWYD6I" alt="Mastercard" />
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
                        <img loading="lazy" className="h-4 opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVzjbe1B4nl5VLbJzUTY-69oFjlLPemtPzOdLNImPLpPotGsZvJ8W6I07NkUD4CS9LdAaz9ZmYxXGebDHvTthUj_kmKDtlB5vYKKU7ea1bro_dT_tW7_4W0_g6bjblzvunZ7-4DbmHgahFCVgNzDfDod_IJnClJIIdDUMCwnYHwRPJ0M_J2vES8gkgQ2AhVH6nuwJ2ie67ngaTMmhJvwVWbrl3KHw7__t5t_yuhqThZZYhvvhSPpXzSqdDRDBNg7SdDer0namC8AY" alt="UPI" />
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
                          <div className="flex items-center gap-3">
                            <Wallet className={paymentMethod === 'wallet' ? 'text-primary' : 'text-on-surface-variant'} />
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
                      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-20 h-24 bg-surface-container-highest rounded overflow-hidden flex-shrink-0">
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
            <footer className="w-full mt-20 bg-[#0e0e12] border-t border-[#F5F5F0]/5 pt-16">
              <div className="max-w-[1920px] mx-auto px-12 py-20">
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
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Private Suite</a></li>
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Shipping Etiquette</a></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Legal</h5>
                    <ul className="space-y-4">
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Terms of Service</a></li>
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Authenticity Guarantee</a></li>
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
            />

            <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20 flex-grow w-full">
              {/* Progress Indicator */}
              <div className="mb-16 max-w-2xl mx-auto">
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -z-10"></div>
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
                          <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-container-highest flex-shrink-0">
                            <img 
                              alt={item.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                              src={item.img}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-grow">
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
                        <p className="text-on-surface font-semibold">Julian Sterling</p>
                        <p>Penthouse 4B, The Glass Tower</p>
                        <p>722 Luxury Row, Manhattan</p>
                        <p>New York, NY 10019</p>
                        <p>+1 (212) 555-0198</p>
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
                        <div className="flex items-center gap-4 bg-surface-container-low/50 p-3 rounded-lg border border-outline-variant/5">
                          <div className="w-10 h-6 bg-surface-container-highest rounded flex items-center justify-center">
                            <CreditCard size={16} className="opacity-60" />
                          </div>
                          <div>
                            <p className="text-sm font-mono text-on-surface tracking-widest">•••• 9901</p>
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Expires 09/27</p>
                          </div>
                        </div>
                        <p className="text-xs font-body text-on-surface-variant italic font-light">Billed to the Manhattan address above.</p>
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
                        <span className="font-headline text-xl text-on-surface uppercase tracking-widest text-xs">Grand Total</span>
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
                            I accept the <a className="text-primary hover:underline" href="#">Terms of Service</a> and the <a className="text-primary hover:underline" href="#">Authenticity Guarantee</a> protocol.
                          </label>
                        </div>
                      </div>
                      <button 
                        disabled={!agreeTerms}
                        className={`w-full py-5 rounded-lg font-headline text-lg tracking-widest uppercase text-xs shadow-[0_12px_24px_rgba(230,195,100,0.15)] transition-all active:scale-[0.98] ${agreeTerms ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed'}`}
                        onClick={() => {
                          setIsLoading(true);
                          setTimeout(() => {
                            setIsLoading(false);
                            setCartItems([]);
                            setView('checkout-success');
                          }, 3000);
                        }}
                      >
                        Finalize Acquisition
                      </button>
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
            <footer className="w-full mt-20 bg-[#0e0e12] border-t border-[#F5F5F0]/5 pt-16">
              <div className="max-w-[1920px] mx-auto px-12 py-20">
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
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Private Suite</a></li>
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Shipping Etiquette</a></li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-primary text-[10px] uppercase tracking-widest font-bold mb-6">Legal</h5>
                    <ul className="space-y-4">
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Terms of Service</a></li>
                      <li><a className="text-[#F5F5F0]/40 hover:text-primary transition-colors text-xs font-headline" href="#">Authenticity Guarantee</a></li>
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
            />

            <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-[1400px] mx-auto w-full">
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
                    <button className="glass-panel text-on-surface px-10 py-4 rounded-lg border border-outline-variant/30 font-label text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-colors flex items-center gap-3">
                      <Download size={18} />
                      Download Invoice
                    </button>
                    <button 
                      onClick={() => setView('home')}
                      className="text-on-surface-variant hover:text-primary px-6 py-4 font-label text-xs uppercase tracking-widest transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
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
                        <div className="w-20 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img 
                            alt="Luxury Item" 
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM_J84AWBlt1n-UwraOxGAdemOwbRosz4-zpe2TKrYENbkiNQtTKe52-kflw8f8iDc5fs0QbsekjyTG96JuD9ReUFllsUitI_KcfGeDQiS_zS89KnjWHroRGJeXxN6ezVHs3kE7vZUOatATKdKSKJy5FcsotRb9Bq5LHNijXNhK7n2n-IrSTXrglnzVsWrA3P98SzePGV3tWvLX4Dmiag4tdDMmBwfnsCWEps0AapSkxhl2_Bkv7bx12G1lvoOqDrIxuFwcCDuPWw"
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
                        <div className="w-20 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img 
                            alt="Luxury Item" 
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiUu4V-hZLRrhctVtDqZiGdQZtjd0mnZvfHVMAv9Nn-eFFINDzU4VrGHkSFkciq0Mg7fg7gWH_MxVBXCT5acQewn16IsApXkXxKAGhg_oI0NwtsSZkjA9ErCQtAs92XRGrKt5doU7_xWrcueHbfktLmYJmFN1fQrXCpZXaUxCwcEF7OCQSfTJoHMKTwjSVhp5P2fSSFrPFuvMgts64WL7TAG40Aqs_WDWMLohwQ9CCUVM3N_CEl0MFDiv6OtkGAxkN9VEYhCy8RdQ"
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
                        <div className="w-20 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img 
                            alt="Luxury Item" 
                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiCQpMYBekSgE57-anDVkf40zYJwOu_pystzAyc2A31x-9YN1BssuQUETD-IlCoC9UzANYmeFSjyrKRh8sA5ABYHg6e_19xUIYwViMHX4rBroWgdhqdEQxU8sVxjg0vMmHdtsTJjIin52cay_DtRF0EiTP1uFnbENrZU20mgt5esH3WF-MxXAs2oVcHfldMFTFUy4uQjOkmB3URGKILu0TKOSMI7G1p6roTJMSOLKG7CASoR8NSR7snIMwsnZzZ-JWBeRbV4xF2d8"
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
              <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-on-surface-variant text-xs font-label uppercase tracking-[0.3em]">
                  © 2024 THE OBSIDIAN CURATOR
                </div>
                <div className="flex gap-12">
                  <a className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest font-label transition-colors" href="#">Private Suite</a>
                  <a className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest font-label transition-colors" href="#">Authenticity Guarantee</a>
                  <a className="text-xs text-on-surface-variant hover:text-primary uppercase tracking-widest font-label transition-colors" href="#">Shipping Etiquette</a>
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
                <div className="relative min-w-[800px] py-12">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-3/5 h-[1px] bg-primary -translate-y-1/2"></div>
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
                      <div>
                        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">Courier</p>
                        <p className="font-body text-lg font-semibold text-on-surface">Excellence Logistique Prestige</p>
                      </div>
                      <div>
                        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-1">Tracking Number</p>
                        <a className="font-mono text-primary text-lg flex items-center gap-2 hover:underline" href="#">
                          TRK-990-2184-XP
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                    <div className="bg-surface-container-high/40 p-6 rounded-lg border border-outline-variant/30">
                      <div className="flex items-center gap-4 mb-4">
                        <img loading="lazy" className="w-12 h-12 rounded-full object-cover grayscale brightness-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANiWUQVAXT2mseIYESKYPqTOYmIInFyzgB7GybWRrvyxMEjNyXLOyUGilGLg3R8wgd1B_8BHiL0HgAB-h9UKandWii5N-Y-nBui-7Uut0AYFmXjw4jGH7OT5PoiXtRz3rH5_XWUSJP0Go9HWbN0RnHmgZZ6kfwkOKuJpEZtdy66bsYGey_xKfboJoPC0wZODIKeGsTxCpzcEA3tD0Y6PLQnY4YEfH-4j5lJtB5ksLsdDI7PtqlPYnq7GQ4t3sSCaojjgoIweijGpo" alt="Designated Driver Avatar" />
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
                      <img loading="lazy" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCETgRstAM0HrZBkWfOmkhLKzTxtROGgerIUjzUKoyXR2UgLc1jjD84BtJmV4HRzY9YR7FYSyx2OChoqd0vQ9yJ3jUdYLMSARtPqAT-fuN-DpOcer-SHrLB4lF3LOvRmDFhbDne9jxStsrQ4HFBeusOLdBZN11YT7Iw110SaJa5KQxIiYDMKrmevLKGexkfg494hp3H9fDdPdC1Cjk8McBHO9VYNuBrieKdVvxcmH6U8KGqm2YAHpSHaO-ykvJF7dJBSEQ7g2H9T-k" alt="Luxury Interior Showcase" />
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
                          <img loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVanmtsmbt0gH7LorH6TuYJEDEM_Z3Qk4lGvh4PIBAbkA7hba9bdDihvYhBWtK9m2_UnCB-_EETqqOAw-a-D4iy5KiWr5IcD8OsgG0_7Z7-_ZaIHZVTkxSUjIZ7vamAKS3rWBSkjd-TwjKKoimdjzMW3tymVbVo3NBm2o_BYiGM6Q3BwAIxQV9W-j63nKa-AXbVdf3GlOdrtnNbT4VQ2L0k6n_8GH9JuBlptKXokGn8IhFX0twf4xFU54U0PZ4y_YPErKx3FsQqu0" alt="Obsidian Heritage Signature" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-headline text-sm font-semibold leading-tight text-on-surface">Noire Saffiano Tote</p>
                          <p className="font-mono text-[10px] text-on-surface-variant">SKU: OBS-7721</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group">
                        <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden shrink-0">
                          <img loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4IMP9xvc9vfj_82Z4AhX_2WQKLPXElmakGqZcwfNDpAEYy8SOvt-b4nXMrTehEjFtwoJGILWG7qV0bCXaMQpCX3Pd6_5WP4W1bZnzKbx6esio94_AEVcDB29Qcd5eFhSke-t2STghbwdK1oqBfoOx4HHyArs9kus0Ns21_tQ1tD0ujXWJ935_atkwLHGkNDqAc6RSfRiG-kFJy-zUTJ6cA3Unkcu4HbyOR0K4WtV7zz4L2edrnjPRoITgjtZCgKfXgnCkDEEtnVw" alt="Premium Crafted Essence" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-headline text-sm font-semibold leading-tight text-on-surface">Eclipse Chronometer</p>
                          <p className="font-mono text-[10px] text-on-surface-variant">SKU: CLK-0094</p>
                        </div>
                      </div>
                      <div className="flex gap-4 group opacity-50">
                        <div className="w-16 h-16 rounded bg-surface-container-high overflow-hidden shrink-0">
                          <img loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ80WVERTSqcG39j3RqBe2jz6cuJXg7OXKa3IZEYtmZeDGNxkQP8vK9dKSFG0JkahUsOZsX0Ajsx6uZ2AWNMRYYAjsJHORQdYujf7bulgCt9CFn-bFK1HwhJiGrOSuCpAVmzi0pDH1levb0D4xlZWFZsdAUt0W2Thy6gQoEWPZpQzJqyvGrdSkrUEoF8jgZeLJUxX1-kIrE4P5EDJb_Yka2LBX_EZNjdkSThqjTdlpA07WWDw9j0aHKqQZlojUs5kharrLdhslCEk" alt="Artisanal Leather Craft" />
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto font-headline text-xs leading-relaxed">
                <div className="col-span-1">
                  <div className="text-lg font-bold text-primary mb-4">The Obsidian Curator</div>
                  <p className="text-on-surface-variant max-w-xs">Curating the world's finest artifacts for the discerning soul. Experience the pinnacle of digital luxury.</p>
                </div>
                <div>
                  <h4 className="text-primary font-bold mb-6 uppercase tracking-widest">Concierge</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => setView('home')} className="text-on-surface-variant hover:text-primary transition-colors">Private Suite</button></li>
                    <li><button className="text-on-surface-variant hover:text-primary transition-colors">Shipping Etiquette</button></li>
                    <li><button className="text-on-surface-variant hover:text-primary transition-colors">Authenticity Guarantee</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary font-bold mb-6 uppercase tracking-widest">Legal</h4>
                  <ul className="space-y-4">
                    <li><button className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</button></li>
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
            />

            <div className="flex max-w-[1920px] mx-auto min-h-screen w-full">
              {/* SideNavBar */}
              <aside className="fixed left-0 top-0 h-full w-80 z-[60] bg-surface-container-lowest flex flex-col p-6 gap-8 border-r border-outline-variant/10 shadow-[20px_0_60px_rgba(0,0,0,0.5)] hidden xl:flex pt-24">
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
                  <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface mb-8 tracking-tighter">My Orders</h1>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl w-fit overflow-x-auto no-scrollbar">
                      <button className="px-6 py-2 bg-surface-container-highest text-primary rounded-lg text-sm font-semibold transition-all">All</button>
                      <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface rounded-lg text-sm transition-all">Active</button>
                      <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface rounded-lg text-sm transition-all">Delivered</button>
                      <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface rounded-lg text-sm transition-all">Cancelled</button>
                      <button className="px-6 py-2 text-on-surface-variant hover:text-on-surface rounded-lg text-sm transition-all">Returns</button>
                    </div>
                    {/* Search Bar */}
                    <div className="relative max-w-md w-full">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                      <input className="w-full bg-surface-container-highest border-none rounded-xl py-4 pl-12 pr-6 text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary" placeholder="Search by order ID or product name" type="text"/>
                    </div>
                  </div>
                </header>

                {/* Orders Grid */}
                <div className="space-y-8">
                  {/* Order Card 1 */}
                  <div className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-outline-variant/10">
                    <div className="p-8 flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-semibold">Ordered on October 14, 2024</p>
                            <h3 className="font-mono text-lg text-primary font-bold">#OC-82910-VX</h3>
                          </div>
                          <span className="px-3 py-1 bg-secondary-container/20 text-secondary text-[10px] uppercase tracking-widest font-bold rounded-full border border-secondary/20">Active Delivery</span>
                        </div>
                        <div className="flex -space-x-4">
                          <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-surface-container-lowest shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300">
                            <img loading="lazy" alt="Luxury silk scarf" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC33u-D5feId20_mfEE8zEDs0igE03Uk4FFop3NCatE5MKtVlY8DKU5Pfnw2v4A8GQ6MN2GOhKI6HlzsMFw7oIjpBfA8FMEPiLQ1vxK4Z9Npgr0zVxAf2RbRYwdazGHls1_UWw0-QxORsTL5lzXIOydvqu1IXvz9iXop6TzVLvFHQrZm2auFBF8DQ1cKAoitRB1oxwdAXuVjlKY85q4J5Wl26juIlBSPirv8XSWAzRDENT2id0UqIs6GpFulxd6Q0LvrVlY3hjOmyw" />
                          </div>
                          <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-surface-container-lowest shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300 delay-75">
                            <img loading="lazy" alt="Designer timepiece" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrwvNinjtVsciLIx2_xGa7Wdy8ryErfCWJW3lFnZKPQDBVU9IQZwEPfnyP4Bjpbox7HAel3RuKVV3NOyP-RVMuucIOMMSIAB7z5Ls-CjGLlr3_QiNCrf9kCIBRI-HskZY-7t3ATkY-QSdjCaG-GOo2m36AmBHt7n7I3YTNcnAUCygkDYIPVurjFm_zmHUVnURhDGYzjqVUefGK90pTytGGh-YVri62pdUKgTBZsDgdRcmfiNLAWOnMIwFBlf9ROhfjFnp0XVOBzkM" />
                          </div>
                          <div className="w-20 h-24 bg-surface-container-high rounded-lg flex items-center justify-center border-2 border-surface-container-lowest shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300 delay-150">
                            <span className="text-xs font-bold text-outline">+1</span>
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant font-medium">3 Items total • <span className="text-on-surface">Expected delivery: Oct 20</span></p>
                      </div>
                      <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/10 pt-8 md:pt-0 md:pl-12">
                        <div className="mb-8 md:mb-0">
                          <p className="text-[10px] uppercase tracking-widest text-outline mb-1">Total Amount</p>
                          <p className="text-3xl font-headline font-bold text-on-surface">$2,450.00</p>
                        </div>
                        <div className="space-y-3">
                          <button 
                            onClick={() => setView('order-tracking')}
                            className="w-full py-3 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          >
                            <TruckIcon size={14} /> Track Order
                          </button>
                          <button className="w-full py-3 glass-panel border border-outline-variant/30 text-on-surface rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Card 2 */}
                  <div className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-outline-variant/10">
                    <div className="p-8 flex flex-col md:flex-row gap-12 opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-semibold">Ordered on September 28, 2024</p>
                            <h3 className="font-mono text-lg text-outline font-bold">#OC-71204-KL</h3>
                          </div>
                          <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] uppercase tracking-widest font-bold rounded-full">Delivered</span>
                        </div>
                        <div className="flex">
                          <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-surface-container-lowest shadow-xl">
                            <img loading="lazy" alt="Bespoke leather boots" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1nFaLKAs15ex2WwLINfv3Vscb47Cyni7CNOhb-twK0R5YJ2y4rxE4hnXTyOR7LoI8DEO9B8ApPpQS1l8hlv4a3LJ8_4P5Dc4iA8uDKz6Edv_O6S8xQLkxh2ikMRViKLjVtBdfkhMAPTPt4cmxm-Z5nj52nkyCrKZw_qrCx_r8A-QW15YE5rolbyHY6WiULtNJTRmcl5mrWUkTgAzkhSp8X_aDDHka5_5QmR9YNamjqTabYmpfMnXFnSlh7M5TJekq2aGx2_NWIko" />
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant font-medium">1 Item total • <span className="text-on-surface">Delivered Oct 02, 2024</span></p>
                      </div>
                      <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/10 pt-8 md:pt-0 md:pl-12">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-outline mb-1">Total Amount</p>
                          <p className="text-3xl font-headline font-bold text-on-surface-variant">$1,100.00</p>
                        </div>
                        <div className="space-y-3">
                          <button className="w-full py-3 bg-surface-container-highest text-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2">
                            <RotateCcw size={14} /> Reorder
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="py-3 glass-panel border border-outline-variant/30 text-on-surface rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-all">Details</button>
                            <button className="py-3 glass-panel border border-outline-variant/30 text-on-surface rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-error/10 hover:text-error transition-all">Return</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Card 3 (Cancelled) */}
                  <div className="group relative bg-surface-container-lowest/50 rounded-2xl overflow-hidden border border-outline-variant/5">
                    <div className="p-8 flex flex-col md:flex-row gap-12 opacity-60">
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-outline mb-1 font-semibold">Ordered on September 10, 2024</p>
                            <h3 className="font-mono text-lg text-outline/50 font-bold">#OC-68821-ZM</h3>
                          </div>
                          <span className="px-3 py-1 bg-error-container/10 text-error text-[10px] uppercase tracking-widest font-bold rounded-full border border-error/10">Cancelled</span>
                        </div>
                        <div className="flex">
                          <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-surface-container-lowest grayscale shadow-xl">
                            <img loading="lazy" alt="Crystal decanter" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKD_EFGiKYA46zgCCroiGNUAofr9VKqFbySpn87T_iJXA8gJ7aYAqC9ap1hS4R84_yQ0PJh17kEAEjFm3EXsM1GrLfQ1ci0M63CBw8bsWZJKROEEfA4m2CiC5tLRnPQFbZ5E86dXPu-AVD0UMbYDSt9rI7fGIY8B-MR7nGn2iFJvNO4vjQETpRgpvpscD2MHssqwM4y6UtZU_f14YI825Jy3EKr9dU7FZ571azXbz6Hpefbfi5lAQ59oq61uXG6WvfpFbdvUvrbFU" />
                          </div>
                        </div>
                        <p className="text-sm text-outline font-medium italic">Order was cancelled by customer</p>
                      </div>
                      <div className="md:w-64 flex flex-col justify-end border-t md:border-t-0 md:border-l border-outline-variant/10 pt-8 md:pt-0 md:pl-12">
                        <button className="w-full py-3 glass-panel border border-outline-variant/30 text-outline rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest hover:text-on-surface transition-all">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination/Load More */}
                <div className="mt-20 flex justify-center">
                  <button className="group flex flex-col items-center gap-4 text-outline hover:text-primary transition-all">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover More Records</span>
                    <ChevronDown className="animate-bounce" size={24} />
                  </button>
                </div>
              </main>
            </div>

            {/* Footer */}
            <footer className="w-full mt-20 bg-surface-container-lowest border-t border-outline-variant/5 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
                <div className="col-span-1 md:col-span-1">
                  <p className="text-lg font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</p>
                  <p className="text-on-surface-variant/40 text-xs leading-relaxed font-headline">
                    Elevating the digital gallery experience. Every piece is curated, every interaction is an exhibit of luxury.
                  </p>
                </div>
                <div>
                  <h4 className="text-primary text-xs uppercase tracking-widest font-bold mb-6 font-headline">Collection</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => setView('home')} className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Private Suite</button></li>
                    <li><button className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Authenticity Guarantee</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary text-xs uppercase tracking-widest font-bold mb-6 font-headline">Service</h4>
                  <ul className="space-y-4">
                    <li><button className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Shipping Etiquette</button></li>
                    <li><button className="text-on-surface-variant/40 hover:text-primary text-xs font-headline transition-opacity">Terms of Service</button></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-primary text-xs uppercase tracking-widest font-bold mb-6 font-headline">Newsletter</h4>
                  <form className="relative" onSubmit={handleNewsletterSubmit}>
                    <input
                      className="w-full bg-surface-container-low border-b border-outline-variant/30 text-xs py-2 focus:border-primary transition-all bg-transparent outline-none"
                      placeholder="Concierge Email"
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
                      <ArrowRight size={16} />
                    </button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80 mt-2">{newsletterMessage}</p>}
                </div>
              </div>
              <div className="px-12 pb-12">
                <p className="text-on-surface-variant/40 text-[10px] font-headline text-center">© 2024 The Obsidian Curator. All Rights Reserved.</p>
              </div>
            </footer>
          </motion.div>
        )}
        {view === 'wishlist' && (
          <ProfileViewLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
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
                      <div className="aspect-[4/5] overflow-hidden bg-surface-container-lowest rounded-sm relative">
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
                        <img loading="lazy" className="w-full h-full object-cover rounded-full" alt="Curator Identity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOb_-CF6n0kU_BRR35D8QXnZfNWMZ0hZBDDCGrrF4q_UOqszPvINYF_XpBq3nxGn2j5-OD7mY1v6nrW9mb-sGJGLvEP1hxYjHw273WYP7DYSqdZ-Wa22GdoGAIIgGnsLjs1Na4o8IlWizQSlVKvJbEB5A5NALojxA511bCbJ0CzNHv-c8jarzZ6VUKLFcmiSiMhtgjxXI0DA0uPBjGYccoxMyKrYKyw5lORzHJ7i_MUdEO6ydcokJpiY3Hm6NCJZr14qir068t3bQ" referrerPolicy="no-referrer" />
                      </div>
                      <button className="absolute bottom-2 right-2 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-headline text-on-surface">Curator Identity</h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-12">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Full Name</label>
                      <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" type="text" defaultValue="Alexander Vance"/>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Private Email</label>
                      <div className="relative">
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" type="email" defaultValue="a.vance@obsidian-curator.com"/>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
                          <CheckCircle2 size={14} fill="currentColor" />
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Phone Connection</label>
                      <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" type="tel" defaultValue="+1 (555) 001-2834"/>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Date of Origin</label>
                      <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none" placeholder="MM/DD/YYYY" type="text" defaultValue="05/12/1988"/>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant ml-1 font-bold">Identity Preference</label>
                      <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-colors py-4 px-1 text-on-surface font-headline text-lg outline-none appearance-none">
                        <option className="bg-background">Prefer not to state</option>
                        <option selected className="bg-background">Masculine</option>
                        <option className="bg-background">Feminine</option>
                        <option className="bg-background">Non-binary</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-16 flex justify-end">
                    <button className="px-10 py-4 bg-primary text-on-primary rounded-lg font-headline font-bold uppercase tracking-widest hover:bg-primary-container transition-all shadow-[0_4px_24px_rgba(230,195,100,0.15)] active:scale-95">
                      Save Manifest
                    </button>
                  </div>
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
                    <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 flex gap-4">
                      <Home className="text-primary-container" size={20} />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Primary Estate</p>
                          <div className="flex gap-3 text-on-surface-variant">
                            <RotateCcw size={14} className="cursor-pointer hover:text-primary" />
                            <Trash2 size={14} className="cursor-pointer hover:text-error" />
                          </div>
                        </div>
                        <p className="text-on-surface text-sm">742 Evergreen Terrace</p>
                        <p className="text-on-surface/60 text-xs">Springfield, OR 97403</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Security Highlight */}
                <div className="bg-gradient-to-br from-surface-container-highest to-surface-container-low p-8 rounded-xl border border-primary/10">
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
            title="Private Residences"
            description="Manage your global shipping destinations. Curate your primary estates and metropolitan suites for seamless acquisition delivery."
          >
            <div className="flex flex-col gap-8">
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline text-xs uppercase tracking-widest hover:bg-primary-container transition-all">
                  Add New Residence
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-xl bg-surface-container-lowest border border-primary/20 relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 text-on-surface-variant hover:text-primary transition-colors"><RotateCcw size={16} /></button>
                    <button className="p-2 text-on-surface-variant hover:text-error transition-colors"><Trash2 size={16} /></button>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Home size={24} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Primary Estate</span>
                      <h4 className="text-xl font-headline text-on-surface">Alexander Vance</h4>
                      <p className="text-on-surface-variant font-light">742 Evergreen Terrace</p>
                      <p className="text-on-surface-variant font-light">Springfield, OR 97403</p>
                      <p className="text-on-surface-variant font-light">United States</p>
                    </div>
                  </div>
                </div>
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
            title="Payment Methods"
            description="Secure your financial conduits. Manage your encrypted payment instruments for swift and secure transactions."
          >
            <div className="flex flex-col gap-8">
              <div className="flex justify-end">
                <button className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline text-xs uppercase tracking-widest hover:bg-primary-container transition-all">
                  Add Payment Method
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-xl bg-gradient-to-br from-[#1a1a1f] to-[#2a2a30] border border-outline-variant/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <CreditCardIcon size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-8 bg-surface-container-highest/30 rounded flex items-center justify-center">
                        <div className="w-8 h-5 bg-primary/20 rounded-sm"></div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Primary Card</span>
                    </div>
                    <div className="space-y-4">
                      <p className="text-2xl font-mono tracking-[0.2em] text-on-surface">•••• •••• •••• 8824</p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Card Holder</p>
                          <p className="text-sm font-headline uppercase">Alexander Vance</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Expires</p>
                          <p className="text-sm font-headline">12/26</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
            title="Notification Center"
            description="Control your digital correspondence. Tailor your alerts for new acquisitions, order updates, and exclusive curatorial insights."
          >
            <div className="bg-surface-container-lowest/50 backdrop-blur-xl rounded-xl border border-outline-variant/10 overflow-hidden">
              <div className="divide-y divide-outline-variant/10">
                {[
                  { title: 'Order Updates', desc: 'Receive alerts regarding your acquisition status and delivery.', icon: Package },
                  { title: 'New Collections', desc: 'Be the first to know when new curated series are unveiled.', icon: Sparkles },
                  { title: 'Security Alerts', desc: 'Critical notifications regarding your vault access and identity.', icon: Lock },
                  { title: 'Newsletter', desc: 'Monthly insights into the world of digital luxury and curation.', icon: Mail }
                ].map((item, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
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
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                      <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </div>
                ))}
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
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Current Password</label>
                    <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary py-3 outline-none" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">New Password</label>
                    <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary py-3 outline-none" type="password" />
                  </div>
                  <button className="w-full py-4 bg-surface-container-highest text-on-surface font-headline text-xs uppercase tracking-widest rounded-lg hover:bg-primary hover:text-on-primary transition-all">Update Credentials</button>
                </div>
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
                  <span className="text-sm font-headline">Status: <span className="text-primary uppercase tracking-widest font-bold">Active</span></span>
                  <button className="text-xs text-on-surface-variant hover:text-error transition-colors uppercase tracking-widest font-bold">Deactivate</button>
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
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Luxury Timepieces"
            subtitle="Engineering Eternity"
            heroImg="https://images.unsplash.com/photo-1523170335684-f042f1b8f374?w=1600&h=800&fit=crop"
            products={timepieceProducts}
          />
        )}

        {view === 'category-jewelry' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="High Jewelry"
            subtitle="Artisanal Brilliance"
            heroImg="https://images.unsplash.com/photo-1515562141207-5dba3b964d7d?w=1600&h=800&fit=crop"
            products={jewelryProducts}
          />
        )}

        {view === 'category-leather' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Leather Goods"
            subtitle="Timeless Craftsmanship"
            heroImg="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&h=800&fit=crop"
            products={leatherProducts}
          />
        )}

        {view === 'category-fashion' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Haute Couture"
            subtitle="Sartorial Excellence"
            heroImg="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1600&h=800&fit=crop"
            products={fashionProducts}
          />
        )}

        {view === 'category-home' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Home & Living"
            subtitle="Curated Interiors"
            heroImg="https://images.unsplash.com/photo-1578926314433-8e51a28a0204?w=1600&h=800&fit=crop"
            products={homeProducts}
          />
        )}

        {view === 'category-beauty' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Fragrances & Beauty"
            subtitle="Olfactory Masterpieces"
            heroImg="https://images.unsplash.com/photo-1595777707802-21b287641c1d?w=1600&h=800&fit=crop"
            products={beautyProducts}
          />
        )}

        {view === 'category-sports' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Sports & Recreation"
            subtitle="Athletic Excellence"
            heroImg="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&h=800&fit=crop"
            products={sportsProducts}
          />
        )}

        {view === 'category-books' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Rare Books & Manuscripts"
            subtitle="Literary Treasures"
            heroImg="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&h=800&fit=crop"
            products={booksProducts}
          />
        )}

        {view === 'category-toys' && (
          <CategoryLayout
            view={view}
            setView={setView}
            cartItems={cartItems}
            showProfileDropdown={showProfileDropdown}
            setShowProfileDropdown={setShowProfileDropdown}
            title="Collectible Toys"
            subtitle="Timeless Companions"
            heroImg="https://images.unsplash.com/photo-1594545514411-854a028e7195?w=1600&h=800&fit=crop"
            products={toysProducts}
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
            />
            
            <CategoryBar 
              view={view} 
              setView={setView} 
            />

            <main className="flex-grow">
              {/* Hero Banner */}
              <section className="relative min-h-[80vh] flex items-center px-6 md:px-20 py-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                <div className="max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                    <h1 className="text-6xl md:text-8xl font-black text-on-surface leading-[0.9] mb-8 tracking-tighter font-headline">
                      Shop the Future, <br/>
                      <span className="text-primary italic">Delivered Today</span>
                    </h1>
                    <p className="text-on-surface-variant/70 text-lg max-w-lg mb-12 font-body leading-relaxed">
                      Experience a curated sanctuary of high-performance tech, artisanal designer wear, and timeless luxury—delivered with the precision of a private gallery.
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <button 
                        onClick={() => setView('shop')}
                        className="px-10 py-4 bg-primary text-on-primary font-bold rounded-lg shadow-[0_20px_40px_rgba(230,195,100,0.2)] hover:scale-105 transition-transform uppercase tracking-widest text-xs"
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
                      className="relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/10 group cursor-pointer"
                      onClick={() => {
                        setSelectedProduct({
                          brand: 'AUREL & CO',
                          name: 'The Onyx Chrono X1',
                          price: '$14,200',
                          rating: 5,
                          reviews: 84,
                          img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_llE45W0HkI_1DaKHqIRFybzWfdmRrSP4o_5YaBTEngwCN07GrVPGKXz36N1WvS78lhaMCa1yszjkpbfhfxln1otPQdPxoWQ-WywHcsxuYILqUrKhh1PnLNdpNV1zv1EO_7R8-TCRKq_DHwXdG_jagWgo3ut86EiqhwkNxOe2Oxr1ZICwCy-j0uV4FGfJBXBeZcstmQ5g8Q1We1cg6h850_RqsFkxfX-TEGXbQyjJgLeNUreHAxr_trXn6a9ASYD1lI6BAGCFNKE'
                        });
                        setView('product-detail');
                        setSelectedImage(0);
                      }}
                    >
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt="Featured Product"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_llE45W0HkI_1DaKHqIRFybzWfdmRrSP4o_5YaBTEngwCN07GrVPGKXz36N1WvS78lhaMCa1yszjkpbfhfxln1otPQdPxoWQ-WywHcsxuYILqUrKhh1PnLNdpNV1zv1EO_7R8-TCRKq_DHwXdG_jagWgo3ut86EiqhwkNxOe2Oxr1ZICwCy-j0uV4FGfJBXBeZcstmQ5g8Q1We1cg6h850_RqsFkxfX-TEGXbQyjJgLeNUreHAxr_trXn6a9ASYD1lI6BAGCFNKE" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-8 left-8">
                        <span className="text-primary text-[10px] tracking-widest uppercase font-bold">Featured Arrival</span>
                        <h3 className="text-2xl font-headline mt-2 text-white">The Onyx Chrono X1</h3>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Category Grid */}
              <section className="py-24 px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="flex justify-between items-end mb-16">
                  <div>
                    <h2 className="text-4xl font-headline text-on-surface">Curated Categories</h2>
                    <p className="text-on-surface-variant mt-2 font-body">Precision filtered by The Obsidian Curator</p>
                  </div>
                  <button className="text-primary font-bold flex items-center gap-2 hover:translate-x-2 transition-transform uppercase tracking-widest text-xs">
                    View All <ArrowRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'Timepieces', icon: Watch, count: '42', view: 'category-timepieces' },
                    { name: 'Fashion', icon: Shirt, count: '842' },
                    { name: 'Home', icon: Armchair, count: '450' },
                    { name: 'Beauty', icon: Sparkles, count: '312' },
                    { name: 'Sports', icon: Dumbbell, count: '210' },
                    { name: 'Books', icon: BookOpen, count: '1,029' },
                    { name: 'Toys', icon: Gamepad2, count: '560' },
                    { name: 'Jewelry', icon: Diamond, count: '150' },
                  ].map((cat, i) => (
                    <motion.div 
                      key={cat.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => cat.view ? setView(cat.view as View) : setView('shop')}
                      className="group bg-surface-container-low p-8 rounded-xl hover:bg-surface-container-highest transition-all duration-500 cursor-pointer border border-outline-variant/5 hover:border-primary/20"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <cat.icon size={24} />
                      </div>
                      <h4 className="text-xl font-headline mb-2">{cat.name}</h4>
                      <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest font-bold">{cat.count} Items</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Flash Sale Banner */}
              <section className="w-full py-12 bg-primary/5 border-y border-primary/10 relative overflow-hidden mb-24">
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
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
                <div className="px-6 md:px-12 max-w-[1920px] mx-auto mb-12">
                  <h2 className="text-4xl font-headline">Editorial Selections</h2>
                  <p className="text-on-surface-variant mt-2 font-body">Objects of desire, hand-picked for the modern collector</p>
                </div>
                <div className="flex gap-8 px-6 md:px-12 overflow-x-auto no-scrollbar pb-12 scroll-smooth">
                  {[
                    { name: 'The Navigator Prime', price: '$1,299', tag: 'Limited Edition', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOddCSuAs9TiAg1kqTUIDDwGV1MFMWwUBY7DGwpvvNcHNbw5aFIx2-fsFnC2SpxX08WVoUGeOP_RjmYEvTEXZBMDbExeNPa_ZOdUH2PcAi_LLTazPmaKYNzM89A1ptZFTK23Rt2biy6Dy_IvblACBK73R5gotvCe7ah7xR4wLf0GLMR1iY-9-6LXV6PMU0dFsYSCSOnkp7rPoPTJixzOquTmZ7IjDKpZHE_a6pOChS3pbBXPB3l-o-roHxxTpfci8c_vNTq-KA6wU' },
                    { name: 'Obsidian Soundstage v4', price: '$549', tag: 'Audio Perfection', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClzLo29TAEyv7VoOsTD1JmYbu5he6v0z6PEqVSSGgODa7zm_OQTGUM3aaANXWb5HUtBG8yvn8nkcboHcWy2Id1MJMIA7iut6ykzRqCl5Vin3CvTCUHqWBpPeMLWQX_U5Jv-fsLNh_7oW-SqRNQSCh1rVZz_iK4JmdboUFyGSQwf6-DJsjd9Wag36aGx9ZREfq0o64tjcfCnWbSRzHIw4ZZaS6ujubv4QNzqr0djcYQtskzFcsuIketnsOivl3fEnbPeU3Qy2GpYSI' },
                    { name: "L'Essence de L'Ombre", price: '$210', tag: 'Signature Scent', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5-O5lwAGAhiQGzu2PplCemk6W8UA_Bo2-kVxVQqJGj291d5WC-NYyy-NwvmI1DL0_-GOaKCK38ebkJ5LQWUL6JEdT4wJfypz1rXn2ZxRneu18CrGPIiHi-xRSVnmLYlnIBfAzmCC-lAaktZU7lDOkC225pK7ZHVFWjqvGEbWITsK74t4xWA9bcKyj--hz1mcW-X3rVVaSfXx5au0gjj0HSzAyLD3p9Hk8i63J6mTA6VOQvSlmSrM3sYvWEF3NjUsQnaF4ZABCxEQ' },
                    { name: 'The Voyager Duffel', price: '$890', tag: 'Artisanal Carry', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxuimTsUOnsUNyyaDjC_Q1UTSjbp3KJ9MjpDZDko9jtNp5mp8i_8YEAmtEyz2-RhMS5twd13TGwacLDhtW8KQ5_ZUo1SntTHoMAcGgzGD-qMIaxXrlzOkh4fK9VgwM440SZs1y2rU2uBGd9aX_zxHp3C7vUuU6pwRfm4NUOzwpnPjgXv4ysEH5wBj4EEbK8sUupGhffzmOiRovQQT_77-bhnHyxXHf2VUiP2A2THHmhSY6Svhl82CYnUG2-utAqaiQvfOKgScCMs' },
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
                <div className="max-w-[1920px] mx-auto px-6 md:px-12 overflow-hidden flex items-center justify-between gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 flex-wrap">
                  {['VOGUE', 'HARRODS', 'GUCCI', 'ROLEX', 'CARTIER', 'HERMÈS', 'APPLE', 'TESLA'].map(brand => (
                    <span key={brand} className="font-headline font-black text-2xl tracking-tighter whitespace-nowrap">{brand}</span>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-24 px-6 md:px-12 max-w-[1920px] mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-headline mb-4">Voices of the Suite</h2>
                  <p className="text-on-surface-variant max-w-lg mx-auto font-body">Hear from our inner circle of collectors and style enthusiasts who have redefined their daily essentials.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Elena Vance', role: 'Art Director', quote: "The level of curation here is unmatched. It's like having a personal shopper with the world's most discerning eye for quality.", img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMsVgiI2n02XAVYXgk12_LrMY30XvytuGXDYO9PUO9s-HDVtFo6nUviMQS7onkIU-wvj5sQMgzQRBP08iHfC4Yh52gskBFTiLtWu-EzGi9PNi5Ht0VSdhkYRmzBVCQA3qc864kohKHt23dsd_9yprsJp_yb1QyWbtrywtu4fbfiwjujoiDLs1pD5MBCgN017oztCOQRYpOSfxK-Nm9Zzb64LrwaVLoP8qXq5GbldiF6b_bhBCT3gVX5YQc9hsNVtRXwNyalpKAiNA' },
                    { name: 'Julian Thorne', role: 'Tech Founder', quote: "Fast delivery used to mean compromising on experience. The Obsidian Curator proves you can have both: speed and luxury.", img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb2bg1mT3ZHRXWb0FXQIlD8Y2UOYXcirCAVc_9fbAppAToGLsAKGbLGJCVVTXqS4664q83lafxMFAKZFJtribwfDR6Z1dFMzfbqfHqdLK5aXSjI-SxhLiHvNA5f2i5u7FPAoE7zGeJcCLtGJuqi-5qSf-cTZfzx44df9GQShsVP1F8SgXqvgp__9IbvGW2YV2AQUwAYpJ6raDp6uyq1Y7NOt4KhPrqr4Rm86eErVrIy5_By5LOx_aic49c6Jje2uv6bIL1_HrwMTM' },
                    { name: 'Sasha Grey', role: 'Digital Creator', quote: "Every package feels like a gift. The presentation is as important as the product itself. Truly a five-star service.", img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANE9RLknVyHX9dmRIfJfsTGU7bK0A37GbDJ9V0TgG0sdEvrbyi450ae533uSj58Oiod5AyFTnBKQN2GMEPAPbmoDfivqlSDh1jStBeNoAE1InD6Ee9lPsAOBvzEp4eomZan_lGZC9bC4Mc0c3AwJI0MRFo7EHfooQeKInKi37PorOAbFpP7Nou1C89px9x6dENlyYXLbifK3De1UTVuCvzuKDyi2qiCRJ9Ak_YAPOqM7OPl2zW8P7VCc88fIAtGTKaHLsDViNtwGU' },
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
                  <div className="flex-shrink-0 z-10 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-12 py-20 max-w-[1920px] mx-auto">
                <div className="md:col-span-1">
                  <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant/60 text-sm max-w-xs font-body leading-relaxed">Elevating the standard of digital commerce through intentional curation and timeless aesthetics.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">The Experience</h4>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Private Suite</a>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Authenticity Guarantee</a>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Boutique Locations</a>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Client Care</h4>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Shipping Etiquette</a>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Terms of Service</a>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Curator Concierge</a>
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
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" className="text-primary hover:translate-x-1 transition-transform"><ArrowRight size={18} /></button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80">{newsletterMessage}</p>}
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
            />

            <main className="max-w-[1440px] mx-auto px-8 pt-12 flex-grow">
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
                      src={selectedProduct?.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuBPODWNW7yoQlR40fXLLrKJmu00Ts5azOeRgAAe8l3NYn6OkugzT2xOJ4PjMzLpohaNC3APoDw4R1uxscE-gLT1nyjQlaKWhrgySEOtwVzq4RcLM000R3RVl109y271dZlxz_OItntjBih7CUfRiMVK413UWPkyrlY4dVkyIEPBQv1j_aVljKiR6lWrzu5DMHwQqyti1H8hoFT8jMDx_D27zo5pGzowndIumzaTY4vbUKG-XSYRsFvnmR4hFJdpdmS3hvfY9Yqt6O4"}
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
                        className={`w-24 h-24 flex-shrink-0 rounded-lg border-2 transition-all overflow-hidden cursor-pointer ${selectedImage === i ? 'border-primary' : 'border-outline-variant/20 hover:border-primary/50'}`}
                      >
                        <img 
                          className="w-full h-full object-cover" 
                          src={selectedProduct?.img || "https://lh3.googleusercontent.com/aida-public/AB6AXuBsciy6ogfhpGFJSwJKeZwPDLgbf2Ez9h9hXsBCpLxJ3y4GwUZWPKoSN8B370y3uzR43yPnN13y5LRaIFeqSskyt4arXjCiqC9NU5qAsJA7nFw_TTSd5FqQ4Masxptv-xS2l_HAEFr9_SeMjDE1mJnGkapj6JuP1ndmOvMnL0_b2DQ1LDuML05CNJo0n2D3wHwNA3w-vtybB7gsb8uq5PFYfIYJzabUkOIHHi7_uxY8vm54oWQlKpyakotY8OxMO0wR4yjSzm1Vo2o"}
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
                      onClick={() => setView(getCategoryForBrand(selectedProduct?.brand))}
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
                        <button className="w-8 h-8 rounded-full bg-[#131317] border-2 border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"></button>
                        <button className="w-8 h-8 rounded-full bg-[#E5E4E2] border-2 border-transparent hover:border-primary/50 transition-all"></button>
                        <button className="w-8 h-8 rounded-full bg-[#B76E79] border-2 border-transparent hover:border-primary/50 transition-all"></button>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-4">Strap Size</span>
                      <div className="grid grid-cols-4 gap-2">
                        <button className="py-3 px-4 rounded-lg bg-surface-container-highest border border-primary text-primary text-xs font-bold tracking-widest">40MM</button>
                        <button className="py-3 px-4 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs font-bold tracking-widest hover:border-primary transition-colors">42MM</button>
                        <button className="py-3 px-4 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs font-bold tracking-widest hover:border-primary transition-colors">44MM</button>
                        <button className="py-3 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/10 text-on-surface-variant/20 text-xs font-bold tracking-widest cursor-not-allowed">46MM</button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-surface-container rounded-lg border border-outline-variant/20 overflow-hidden">
                        <button className="p-4 text-on-surface hover:bg-surface-container-highest transition-colors">
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-mono font-bold">1</span>
                        <button className="p-4 text-on-surface hover:bg-surface-container-highest transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="flex gap-4 flex-grow">
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
                            name: selectedProduct?.name || 'The Midnight Eclipse Perpetual',
                            price: parseInt((selectedProduct?.price || '$4,250.00').replace(/[^0-9]/g, '')),
                            quantity: 1,
                            img: selectedProduct?.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPODWNW7yoQlR40fXLLrKJmu00Ts5azOeRgAAe8l3NYn6OkugzT2xOJ4PjMzLpohaNC3APoDw4R1uxscE-gLT1nyjQlaKWhrgySEOtwVzq4RcLM000R3RVl109y271dZlxz_OItntjBih7CUfRiMVK413UWPkyrlY4dVkyIEPBQv1j_aVljKiR6lWrzu5DMHwQqyti1H8hoFT8jMDx_D27zo5pGzowndIumzaTY4vbUKG-XSYRsFvnmR4hFJdpdmS3hvfY9Yqt6O4',
                            variant: '40MM / Obsidian Black',
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
                      onClick={() => setView(getCategoryForBrand(selectedProduct?.brand))}
                    >
                      Visit Store
                    </button>
                  </div>
                </section>
              </div>

              {/* Tabs Section */}
              <section className="mb-32">
                <div className="flex border-b border-outline-variant/10 gap-12 mb-12 overflow-x-auto no-scrollbar">
                  {['Detailed Narrative', 'Technical Specifications', 'Collector Reviews', 'Inquiries (12)'].map((tab, i) => (
                    <button 
                      key={tab}
                      className={`pb-6 border-b-2 font-headline text-lg transition-all whitespace-nowrap ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant/40 hover:text-on-surface'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div className="prose prose-invert">
                    <h3 className="font-headline text-3xl text-on-surface mb-6">A Masterpiece of Temporal Art</h3>
                    <p className="text-on-surface-variant leading-relaxed mb-6 font-body text-lg font-light">
                      The Midnight Eclipse is not merely a timepiece; it is a manifestation of celestial mechanics captured within a 42mm obsidian vessel. Each component is hand-finished by master horologists in our private atelier, ensuring that every second is measured with unprecedented grace.
                    </p>
                    <ul className="space-y-4 text-on-surface-variant font-body list-none p-0">
                      <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Hand-polished Grade 5 Obsidian glass dial</li>
                      <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> In-house Caliber-88 Perpetual Movement</li>
                      <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 72-hour power reserve with moon-phase display</li>
                    </ul>
                  </div>
                  <div className="bg-surface-container-low p-10 rounded-3xl border border-outline-variant/10">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="font-headline text-2xl">Ratings Overview</h4>
                      <div className="text-center">
                        <p className="text-4xl font-headline text-primary">4.8</p>
                        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold">Out of 5 Stars</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[85, 10, 3, 1, 1].map((val, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-[10px] font-mono w-4 font-bold">{5 - i}</span>
                          <div className="flex-grow h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${val}%` }}></div>
                          </div>
                          <span className="text-[10px] text-on-surface-variant/40 font-bold w-8">{val}%</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-10 py-4 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/5 transition-all">
                      Read All Reviews
                    </button>
                  </div>
                </div>
              </section>

              {/* Frequently Bought Together */}
              <section className="mb-32">
                <h2 className="text-3xl font-headline mb-12 flex items-center gap-4">
                  Frequently Curated Together
                  <span className="h-[1px] flex-grow bg-gradient-to-r from-outline-variant/20 to-transparent"></span>
                </h2>
                <div className="bg-surface-container-low p-10 rounded-3xl flex flex-col lg:flex-row items-center gap-12 border border-outline-variant/10">
                  <div className="flex items-center gap-8 flex-wrap justify-center">
                    {[
                      { name: 'Midnight Eclipse', img: selectedProduct?.img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9fkRIfaXffB46jLtFI5J5c01IBnnOBtsDEApeY80pHsmbazkPWScLdCitIqcFk63NTvxlhflEvwpHOSvCGLKw2oyPtax5oyZpHL2NtMdKOkCaG1wzr3Pq18GVB31Xg-EIP7NGUjADEciDbgIfn1nq_luKt4o82aRvgF7MgKVFcV8ciHRhwlTvS97jXLe3R-dDOEeAiWIT9cN3PmD6IsQfLVFyxxz7qtSbZ-p1FmIp2JlH71v_oy55kI6OBObtMjhUfiLd7zZkQxc' },
                      { name: 'Leather Watch Roll', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8GErgE6IgM4e0CxYDOxDhi1T8Q8ReNPQnAu5gP5x1v_ZhxIAFZtc2F4-GXChquLN53EyNccmAGy06J72YbaApp9-h-RjscBlAGyvk5Hoo8SaIQmfhukDWPxbHRiGyw5z4MNkk-6a3SZaEnhE3j-0dsJETbkRTVfQ3fiHeF_QhAVVeaUkuW538cCqRS7VQhkxOxTd9206lkenF4l1GIqyEBp3AcWsjcCQbwTMV3xrjTGF98-Rlkg46EtmBupgL0eBQ_w2z1dmimAc' },
                      { name: 'Automatic Winder', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfLc80feKUxYjz9Tw65eY9a7t8QxIpwo_R3-FwYhz3SdaP6shawONx7aM5KiACt97UK6pP2hRrGGpeM8tD7b8ngEtqWESvMJE5K_QVVibKWgp40uPJY0BLdFIsGFbqA78X2EpSBnPwoprjadqOxb_FJk1mVohh61CLjB-kEX6JF3mqbYXJoyHvFepn8k4if0-vPZaKoNJ4w4H0nqEC0wPkgCe2TFz2kPGExPL-um1ZBrHTbgQ01urvngJUX0gjOVvk08UqG2vxwUc' }
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
                    { brand: 'Aurelian', name: 'The Solstice Gold', price: '$3,800.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjVfG-U-x6uccoEhW4n4ieh5jAk9nSLt-ozUWCQtR3rPINvkCKHbB8o3yDnIvo5dFdC9ALXxCpQ6T7XSI6H4psLePfgPGPs_Ti1kQ2N2FAnYarY0r8KRXwmyyBqSo__PXR0K58Lcxo2bQ8BDk7v1vKXZrdG72VgWuIsjUVPq2XpWakXbFbi-D1Ayqc4dwt4K1TUQ9Iz-kcXZXRKxWgUpZzwjghgn0xzKrzL0F41N2H7RVxOMpZOBJ9c72pCI_0DQ0RCxEAqtL1fD8' },
                    { brand: 'Techne', name: 'Vanguard Titanium', price: '$2,450.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqDoP5CLAhd2EQZ7YeEwPMl_EUsT26QCsB8Pr848lbtDx2g1Nmivf8xUTduYCYFZFSD8PDbbv-1u5k3X2G_ckDn5vJ4UOyzXcvN2ML4lMIAyLN9RfMfw-m5p2pgsOJzxp_yCLKuUUjsWbiSwXD0GvFipceUKIgazAAiIcwHn3NrEjoLXvRvT99rvkQp_zM60-U0pd1ciLeDMqoPPmZ2V08hEnPLhN7DPsNxIh7QM-tSGFMrJ5XHUwOwN7F8OTa5AEF2XLhwDw6VNM' },
                    { brand: 'Chronos', name: 'Aero Classic', price: '$5,200.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJZKpUuXubYXQMTIC7_N2lPAEmuiDsoWSf7TnxAuukhaG3LEshpStlxCMEh52EJuJfcgLMsLxtkahWV7K5HqcouSm6pSW2-WdlFga9Y2WUzjgVnfa0a6HNKitLWXtxw6_vLVapBIgCqZP2vvtawMTG7FHqiIpz5gB7BEEJZQcf6_2vq4Z-3lBtMJ4LyMGOsucJAY3LISfNBOUS5y_T2MxnMIQIGT_i2vLJKSXygySm_avst3pb1vrWyMgELYft9P6aZguBQnHoKdE' },
                    { brand: 'Objets', name: 'Tonal Desk Chronometer', price: '$950.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApTG5Tl4lOaRP8prNfeexzrPhgwAbWV10YUeGawD82oJ-LUs78on3xaA1yUdXbAJGVctiP8KI7FIP8vZyGa4QL-ShZNq-3RmvSsSUsdYllAyL-aKSzywya_pFnbVcrUDl8Y35MEjJ4rB7XN22uEh5W_m6p_gpblRvNAZGHXUh3dTeIfgA97ZOm9TQADEkUjjOADhAS-_j2J2Yep2GqWPEWVifpAzDeqvb-t-8SepAvm2hzp-X2wV7eJwdQYjqJP6xnyHAJPXn2n9I' },
                    { brand: 'Forge', name: 'The Ironclad GMT', price: '$3,100.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChrdA9wum_tq-hgyHiGEwue543ZoZ0eBzmLOo8NDyoSPpf4fcPz_z_tQPyzHTUGOlnz4QyJUkF2uP9MJI8kkgeHjIARJHk5N-itBrtN59qavg5S8EWk-zO0VjOnHGOnP3q7rjxub6N0b_eSYmYoE_ecKU229JnUFSGo1R8OeadkU8o9rIUNsZGb-XGZFQHIUcr6v4O4Oj4C5aw4lWxfUBxb49NRumkM49xTEDOPrVfngyNQ6KbKm0fXcRZZ1FkDhFUbSJIWFQfSH8' },
                  ].map((item, i) => (
                    <div key={i} className="w-72 flex-shrink-0 group cursor-pointer" onClick={() => { setSelectedProduct(item); setSelectedImage(0); window.scrollTo(0, 0); }}>
                      <div className="aspect-[4/5] bg-surface-container-lowest rounded-2xl overflow-hidden relative mb-6 border border-outline-variant/10">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
                <div className="col-span-1">
                  <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant/60 text-sm max-w-xs font-body leading-relaxed">Refining the digital acquisition experience through intentional design and unparalleled quality.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Navigation</h4>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('home')}>Private Suite</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('order-tracking')}>Shipping Etiquette</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('checkout-review')}>Terms of Service</button>
                  <button className="text-left text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" onClick={() => setView('shop')}>Authenticity Guarantee</button>
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
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" className="text-primary hover:translate-x-1 transition-transform"><ArrowRight size={18} /></button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80">{newsletterMessage}</p>}
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
            />

            <CategoryBar 
              view={view} 
              setView={setView} 
            />

            <div className="flex flex-1 max-w-[1920px] mx-auto w-full">
              {/* SideNavBar (Filter Gallery) */}
              <aside className="hidden lg:flex flex-col p-8 gap-8 bg-surface-container-lowest border-r border-outline-variant/10 w-80 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-primary font-black text-xl mb-1 font-headline">Filter Gallery</h2>
                  <p className="text-on-surface-variant/40 normal-case tracking-normal text-xs italic font-body">Refine your selection</p>
                </div>
                
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setShopMaxPrice('all')}
                    className="w-full text-primary bg-surface-variant/30 rounded-lg flex items-center gap-4 p-4 hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                  >
                    <LayoutGrid size={20} />
                    <span className="font-label uppercase tracking-widest text-xs font-bold">Categories</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShopMaxPrice('5000')}
                    className="w-full text-on-surface-variant/40 hover:text-on-surface flex items-center gap-4 p-4 hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                  >
                    <DollarSign size={20} />
                    <span className="font-label uppercase tracking-widest text-xs font-bold">Price under $5K</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShopMinRating(4)}
                    className="w-full text-on-surface-variant/40 hover:text-on-surface flex items-center gap-4 p-4 hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                  >
                    <Award size={20} />
                    <span className="font-label uppercase tracking-widest text-xs font-bold">Designer Brands</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShopMinRating(5)}
                    className="w-full text-on-surface-variant/40 hover:text-on-surface flex items-center gap-4 p-4 hover:translate-x-1 transition-transform duration-200 cursor-pointer"
                  >
                    <Star size={20} />
                    <span className="font-label uppercase tracking-widest text-xs font-bold">5 Star Only</span>
                  </button>
                  <div className="text-on-surface-variant/40 hover:text-on-surface flex items-center gap-4 p-4 hover:translate-x-1 transition-transform duration-200 cursor-pointer">
                    <Package size={20} />
                    <span className="font-label uppercase tracking-widest text-xs font-bold">Availability</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-outline-variant/10">
                  <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold tracking-widest text-xs uppercase hover:opacity-90 transition-opacity mb-4">
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShopMaxPrice('all');
                      setShopMinRating(0);
                      setShopSortBy('relevance');
                      setSearchTerm('');
                    }}
                    className="w-full text-on-surface-variant/40 hover:text-primary flex items-center justify-center gap-2 p-3 cursor-pointer text-xs font-bold uppercase tracking-widest"
                  >
                    <RotateCcw size={14} />
                    <span>Clear All</span>
                  </button>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 px-8 md:px-12 py-12">
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

                  {/* Controls */}
                  <div className="mt-12 flex flex-wrap items-center justify-between gap-4 py-6 border-y border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      {/* Applied Filters */}
                      <div 
                        className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setView('category-timepieces')}
                      >
                        <span className="text-primary">Watchmaking</span>
                        <button className="hover:text-primary transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/20 text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-primary">Newest</span>
                        <button className="hover:text-primary transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-4">
                        <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sort By</label>
                        <select
                          className="bg-transparent border-none text-sm text-on-surface focus:ring-0 cursor-pointer font-bold pr-8 outline-none"
                          value={shopSortBy}
                          onChange={(e) => setShopSortBy(e.target.value as 'relevance' | 'low-to-high' | 'high-to-low' | 'top-rated')}
                        >
                          <option className="bg-background" value="relevance">Relevance</option>
                          <option className="bg-background" value="low-to-high">Price: Low to High</option>
                          <option className="bg-background" value="high-to-low">Price: High to Low</option>
                          <option className="bg-background" value="top-rated">Top Rated</option>
                        </select>
                      </div>
                      <div className="h-4 w-[1px] bg-outline-variant/20"></div>
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

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20">
                  {filteredShopProducts.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 3) * 0.1 }}
                      className="group flex flex-col cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setView('product-detail');
                      }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low mb-8 rounded-xl">
                        <img 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                          src={product.img} 
                          alt={product.name}
                          referrerPolicy="no-referrer"
                        />
                        <button className="absolute top-6 right-6 p-3 bg-background/40 backdrop-blur-md rounded-full text-on-surface/60 hover:text-primary transition-colors z-10">
                          <Heart size={18} />
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                          <button className="w-full py-4 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            Quick View
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-2 block">{product.brand}</span>
                          <h3 className="font-headline text-2xl group-hover:text-primary transition-colors cursor-pointer leading-tight">{product.name}</h3>
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

                {/* Pagination */}
                <nav className="mt-32 flex items-center justify-center gap-6">
                  <button className="w-14 h-14 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold text-sm">1</button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant font-bold text-sm">2</button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant font-bold text-sm">3</button>
                    <span className="text-on-surface-variant/40 px-4 font-mono tracking-widest">...</span>
                    <button className="w-14 h-14 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant font-bold text-sm">15</button>
                  </div>
                  <button className="w-14 h-14 flex items-center justify-center rounded-full border border-outline-variant/20 hover:border-primary hover:text-primary transition-all text-on-surface-variant group">
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </nav>
              </main>
            </div>

            {/* Footer */}
            <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/10 pt-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
                <div className="md:col-span-1">
                  <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant/60 text-sm max-w-xs font-body leading-relaxed">A legacy of refinement and the pursuit of the extraordinary. Dedicated to the collector who understands true luxury.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Concierge</h4>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Private Suite</a>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Shipping Etiquette</a>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Authenticity Guarantee</a>
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">Legal</h4>
                  <a className="text-on-surface-variant/60 hover:text-primary transition-colors text-sm font-body" href="#">Terms of Service</a>
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
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                    />
                    <button type="submit" className="text-primary hover:translate-x-1 transition-transform"><ArrowRight size={18} /></button>
                  </form>
                  {newsletterMessage && <p className="text-[10px] text-primary/80">{newsletterMessage}</p>}
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_MvWAl5HPdC41DpWypptmZrnBykl6FSoZNKZclY7vvfBp6HSOY--hFEP_DLwAdvDgT1kGywqIdrHuehXk8YozxM_Y5LBrnvVV707P87B7FIH-urfefbXsYMhFbHypWckrXmrUwosiGLV0Xbehaz3KxK6fs0_M0C1MHjhIC3gG8XpahnXDqhSHISqdbowLUIkiq14AgI5jIpInONIcoAbUB8IK_pB6iZylE78EmLTb8cbA7BYasJqyEkauZ4Q00D6n535H0MQk1m8"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent"></div>
              </div>
              
              <div className="relative z-10 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="w-12 h-[1px] bg-primary"></div>
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

              <div className="absolute top-12 left-12 z-20">
                <span className="font-headline text-2xl font-bold tracking-tighter text-primary">The Obsidian Curator</span>
              </div>
            </section>

            {/* Right Side: Auth Panel */}
            <section className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 bg-surface-container-lowest relative z-10">
              <div className="w-full max-w-md">
                {/* Mobile Branding */}
                <div className="md:hidden mb-12 text-center">
                  <span className="font-headline text-3xl font-bold tracking-tighter text-primary">The Obsidian Curator</span>
                </div>

                <div className="mb-12">
                  <h2 className="font-headline text-3xl text-on-surface font-bold mb-3 tracking-tight">Welcome back</h2>
                  <p className="text-on-surface-variant font-body text-sm opacity-60">Enter your credentials to access the suite.</p>
                </div>

                {/* Form Section */}
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

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-4 bg-surface-container border border-outline-variant/10 rounded-lg hover:bg-surface-container-high transition-colors group">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#e4e1e7"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#e4e1e7"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#e4e1e7"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#e4e1e7"></path>
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 py-4 bg-surface-container border border-outline-variant/10 rounded-lg hover:bg-surface-container-high transition-colors group">
                    <svg className="w-4 h-4" fill="#e4e1e7" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Facebook</span>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4w4zwGBW3gWQOH27GwTrg3Z8Ms3QL1d9jthK67VCPj1BZq8agqn2XU-VfF-n4wbFarsN9i1eJBCJq8UhJ2_KwkK4Qj2EdKn0O39xqV9YijR1XPS_DT54-OnqJHAjPSeBxpPP8mVMjgU4xuEMFNVn0XHJ3shyHAroYu8eTa-jNlMGsZ8NLfMdX4IxE-ljkhAO92pgCxrlovpR5eUSlsJGK-9g1qY65RwBSD6ORddoT42IDbVsID3PIGzMXCM7VkaY1zqmO17a-RNM"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-transparent"></div>
              <div className="relative z-10 px-16 max-w-2xl">
                <span className="text-primary font-label tracking-[0.3em] uppercase text-xs mb-6 block">The Inner Circle</span>
                <h1 className="font-headline text-6xl lg:text-7xl leading-tight mb-8 text-on-background gold-glow">The Obsidian Curator</h1>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-12">
                  Begin your journey into the world of uncompromised rarity. Join an elite collective of seekers, collectors, and visionaries.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <img loading="lazy" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnqx1-pixOCBN02ewAIwKmI0jOn41p4JBnlytSLKnoonfYAA1qaqJqAKwbiTD0yjd3-OfWX34iovKlUUfs_Sy8m44EUhAH94cb0nvF0CZKFT-dU1OGjppFXVNmvmHuBXe5iIb0vanvbWHyjTk13s5m2NIUFrEjAAVH-kQngvCjZVNS35RvbUaNzi-JdnHUmiF1YL3kaoeOM0FGY-zrdurONRTVQZ_p91ctl5Xkr2Imc9RIJqQnuP21Dn5bR8rqiVVJR3YreFHPJxM" referrerPolicy="no-referrer" alt="Curator Avatar 1" />
                    <img loading="lazy" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTcY9kiSxEu3JIqlH4ioBRoo7EwVXhkhROVV6EdBWHDExhN8GuZfThAHZskyHxwXyD3S4S93BtGV2ZjjNDPe9jd_q7eSJshjCbn8Wsoj8fVOKjyN0mUhzEmaCL8CQ2bSUdn3CIFzjQ8kYRePNh5t3VvSY9xz8503q6GtCguJML8pQqSaP6DYNgJo_4YYNfctJgDpmZ08Dmli7F2CeZTjwM3R8KG4oaDndUg8sV3Mawl6ipa8YOINb1BY8x6kzsSVVfFaA2Hy6mbic" referrerPolicy="no-referrer" alt="Curator Avatar 2" />
                    <img loading="lazy" className="w-10 h-10 rounded-full border-2 border-background object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAogWBpy1Gsu4mTHLtxpoasFq9bkA2N_IyfjZ8olraccrRkLl9oI9KjcIug3n87jza55p_5-5Iy1HttfgHq1-grftCtaBCglmTS_GGGf7moVFcIE1fro-UEOXzxe8LkBZXp3nT9yzzHNnhbrnrwOfv7kk2_Z37Ez-GCZ0uzA1aRZ6NACRD5EtzYhLi7UpsNRghMFrmbU8bm9Jnq3mrouPQ05ij1ZTcEx4IAE-vUSgeplsDKfBnprv9xQ9L-qD_AtspaYO9NATk1MkU" referrerPolicy="no-referrer" alt="Curator Avatar 3" />
                  </div>
                  <p className="text-on-surface-variant text-sm tracking-wide">Joined by <span className="text-primary font-semibold">1,200+</span> luxury enthusiasts</p>
                </div>
              </div>
            </section>

            {/* Right Side: Registration Form */}
            <section className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-y-auto">
              {/* Mobile Header Logo */}
              <div className="md:hidden mb-12">
                <span className="font-headline text-3xl font-bold tracking-tighter text-primary">The Obsidian Curator</span>
              </div>
              
              <div className="w-full max-w-md space-y-10">
                <div className="space-y-3">
                  <h2 className="font-headline text-3xl font-medium text-on-surface">Create an Account</h2>
                  <p className="text-on-surface-variant font-light">Enter your details to access the private suite.</p>
                </div>

                {/* Registration Form */}
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
                          className="w-full bg-surface-container-highest/30 border-none border-b border-outline-variant/30 text-on-surface px-4 py-4 rounded-lg focus:ring-1 focus:ring-primary focus:bg-surface-container-highest/50 transition-all placeholder:text-on-surface-variant/40 outline-none"
                          id="confirm_password"
                          placeholder="••••••••"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Strength */}
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">Security Strength</span>
                      <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Strong</span>
                    </div>
                    <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden flex gap-0.5">
                      <div className="h-full w-1/3 bg-primary"></div>
                      <div className="h-full w-1/3 bg-primary"></div>
                      <div className="h-full w-1/4 bg-primary opacity-50"></div>
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
                      I agree to the <a className="text-on-surface underline underline-offset-4 decoration-outline-variant hover:decoration-primary transition-colors" href="#">Terms of Service</a> and <a className="text-on-surface underline underline-offset-4 decoration-outline-variant hover:decoration-primary transition-colors" href="#">Privacy Etiquette</a>.
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
                  <div className="flex-grow border-t border-outline-variant/20"></div>
                  <span className="flex-shrink mx-4 text-xs font-label text-on-surface-variant/40 tracking-[0.2em] uppercase">Authenticate via</span>
                  <div className="flex-grow border-t border-outline-variant/20"></div>
                </div>

                {/* Social Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/10 transition-colors group">
                    <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
                    <span className="text-xs font-semibold tracking-wider uppercase">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-surface-container-highest/20 hover:bg-surface-container-highest/40 border border-outline-variant/10 transition-colors group">
                    <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"></path></svg>
                    <span className="text-xs font-semibold tracking-wider uppercase">Apple</span>
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXHp5bgmsPgmOSfthm8TCBe59JSC-9egcnpQPTaqdL6xtJUdYx3a8YxofQBxktpcsyIcOv_Wo1_va-npYJfwdyHO3OajI69Q64CnCXaflHPXXXUvtRsGadqqHddzBySY-INlL8x8h56TRXTBrP7egLJUTog-AIUyCTb-4DJQHWDB2BqCCMQ4DFIOuFgjBGOkgjBnPA3XfzvBrhb2X_ZgHoClgjgdGUtqfIgENCO81HstMvaN37MG-cxhPoPJZ09QTtZz03b5u794I" 
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Header Branding */}
            <div className="relative z-10 mb-12 text-center">
              <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                The Obsidian Curator
              </h1>
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
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[100%_0%]"></div>
                          </button>
                        </div>
                      </form>
                      <div className="text-center">
                        <button 
                          onClick={() => setView('login')}
                          className="text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                          <ArrowLeft size={14} />
                          Back to Entrance
                        </button>
                      </div>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
                <div className="col-span-1 md:col-span-2">
                  <div className="text-lg font-bold text-primary mb-4 font-headline tracking-tighter">The Obsidian Curator</div>
                  <p className="text-on-surface-variant text-xs leading-relaxed max-w-sm font-body">
                    A private sanctuary for the world's most exquisite digital artifacts. Curated with precision, secured with the latest encryption standards.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">Concierge</div>
                  <nav className="flex flex-col gap-4">
                    <a className="text-on-surface-variant text-xs hover:text-primary transition-colors" href="#">Private Suite</a>
                    <a className="text-on-surface-variant text-xs hover:text-primary transition-colors" href="#">Shipping Etiquette</a>
                    <a className="text-on-surface-variant text-xs hover:text-primary transition-colors" href="#">Authenticity Guarantee</a>
                  </nav>
                </div>
                <div className="space-y-4 text-right">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-6">Legal</div>
                  <nav className="flex flex-col gap-4">
                    <a className="text-on-surface-variant text-xs hover:text-primary transition-colors" href="#">Terms of Service</a>
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
