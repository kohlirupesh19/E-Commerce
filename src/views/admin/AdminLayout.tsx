import React from 'react';
import { motion } from 'framer-motion';
import BrandMark from '../../components/BrandMark';

export default function AdminLayout({ children, activeView, setView }: { children: React.ReactNode, activeView: string, setView: (view: any) => void }) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body selection:bg-primary/30">
      <aside className="fixed left-0 top-0 h-full w-80 z-[60] bg-[#0e0e12] flex flex-col p-6 gap-8 border-r border-[#F5F5F0]/10 shadow-[20px_0_60px_rgba(0,0,0,0.5)] font-['Noto_Serif'] text-sm uppercase tracking-widest">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_20px_rgba(230,195,100,0.2)]">
            <BrandMark className="w-full h-full rounded-lg" />
            </div>
            <div>
                <h2 className="text-primary font-black tracking-tighter">The Obsidian</h2>
                <p className="text-[10px] text-on-surface-variant/60 lowercase tracking-normal">Administration</p>
            </div>
        </div>
        <nav className="flex-1 space-y-2">
            <a onClick={(e) => { e.preventDefault(); setView('admin-dashboard'); }} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 ${activeView === 'admin-dashboard' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}`} href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('admin-products'); }} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 ${activeView === 'admin-products' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}`} href="#">
                <span className="material-symbols-outlined">inventory_2</span>
                <span>Products</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('admin-orders'); }} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 ${activeView === 'admin-orders' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}`} href="#">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>Orders</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('admin-customers'); }} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 ${activeView === 'admin-customers' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}`} href="#">
                <span className="material-symbols-outlined">group</span>
                <span>Customers</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('home'); }} className="flex items-center gap-4 px-4 py-3 text-[#F5F5F0]/40 hover:text-[#F5F5F0] transition-transform duration-200 hover:translate-x-1" href="#">
                <span className="material-symbols-outlined">storefront</span>
                <span>Back to Shop</span>
            </a>
        </nav>
      </aside>
      <main className="ml-80 flex-1 p-12 max-w-[1600px] mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
