import React from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard({ setView }: { setView: (view: any) => void }) {
  return (
    <div className="animate-in fade-in">
<header className="flex justify-between items-center mb-16">
<div>
<h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">Curator Insights</h1>
<p className="text-on-surface-variant font-body tracking-wide">Overview for Oct 24 — Nov 24</p>
</div>
<div className="flex items-center gap-6">
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
<input className="bg-surface-container-highest/30 border-none rounded-full pl-12 pr-6 py-3 text-sm focus:ring-1 focus:ring-primary w-64 transition-all" placeholder="Search data..." type="text"/>
</div>
<div className="flex items-center gap-4 border-l border-outline-variant/30 pl-6">
<div className="text-right">
<p className="text-sm font-bold text-on-surface">Adrian Thorne</p>
<p className="text-[10px] text-primary uppercase tracking-widest">Master Curator</p>
</div>
<div className="w-12 h-12 rounded-full overflow-hidden border border-primary/40 p-0.5">
<img alt="Admin Profile" className="w-full h-full object-cover rounded-full" data-alt="close-up portrait of a professional man in a tailored dark suit, studio lighting, high-end editorial style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv2qXLlVk_GTeEOtyd-knS9MzHz8yNnO9rkN5Zocp4AWPpV1uWSSpFdvL77On_L-nNNLTTOm9cbNpNl6gFj56hgY__JGBWZ92q3NAFKRMzUy69pF5pK5cj9tUdFuhAUCJglYB0L1j35iocx_gVkX5qKoa5IPXO-Noqe9myDyrIQdU0GUP4Usvex4JEp25FrahiSw7n-cEK5n5e7qjwp5SN9_BvjVMEq69DdPA_6BTsX3ytBnQk3u6niLqIPdszH3TKEN8waRXRrdM"/>
</div>
</div>
</div>
</header>
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
<!-- KPI 1 -->
<div className="glass-card p-8 rounded-xl border border-outline-variant/10 group hover:border-primary/20 transition-all">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
<span className="material-symbols-outlined" data-icon="payments">payments</span>
</div>
<div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                            +12.5%
                        </div>
</div>
<p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] font-label mb-2">Total Revenue</p>
<h3 className="text-3xl font-headline font-bold text-on-surface">$428,590</h3>
</div>
<!-- KPI 2 -->
<div className="glass-card p-8 rounded-xl border border-outline-variant/10 group hover:border-primary/20 transition-all">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
<span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
</div>
<div className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
                            +4.2%
                        </div>
</div>
<p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] font-label mb-2">Orders Today</p>
<h3 className="text-3xl font-headline font-bold text-on-surface">142</h3>
</div>
<!-- KPI 3 -->
<div className="glass-card p-8 rounded-xl border border-outline-variant/10 group hover:border-primary/20 transition-all">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
<span className="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant text-xs font-bold font-mono">
<span className="material-symbols-outlined text-sm" data-icon="remove">remove</span>
                            0.0%
                        </div>
</div>
<p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] font-label mb-2">New Customers</p>
<h3 className="text-3xl font-headline font-bold text-on-surface">2,841</h3>
</div>
<!-- KPI 4 -->
<div className="glass-card p-8 rounded-xl border border-outline-variant/10 group hover:border-primary/20 transition-all">
<div className="flex justify-between items-start mb-6">
<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
<span className="material-symbols-outlined" data-icon="local_shipping">local_shipping</span>
</div>
<div className="flex items-center gap-1 text-error text-xs font-bold font-mono">
<span className="material-symbols-outlined text-sm" data-icon="trending_down">trending_down</span>
                            -2.1%
                        </div>
</div>
<p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] font-label mb-2">Pending Shipments</p>
<h3 className="text-3xl font-headline font-bold text-on-surface">18</h3>
</div>
</section>
<section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
<!-- Revenue Chart -->
<div className="lg:col-span-2 glass-card p-8 rounded-xl border border-outline-variant/10">
<div className="flex justify-between items-center mb-10">
<h4 className="font-headline text-xl font-bold">Revenue Analytics</h4>
<div className="flex gap-2 p-1 bg-surface-container-low rounded-lg border border-outline-variant/20">
<button className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant hover:text-primary transition-colors">7D</button>
<button className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-primary bg-surface-container-highest rounded-md">30D</button>
<button className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant hover:text-primary transition-colors">90D</button>
</div>
</div>
<div className="h-80 relative flex items-end gap-2 pb-6 border-b border-outline-variant/20">
<!-- Simulated Chart Bars -->
<div className="flex-1 bg-primary/20 rounded-t-sm h-[40%] group relative">
<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-container-highest text-primary font-mono text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">$12k</div>
</div>
<div className="flex-1 bg-primary/30 rounded-t-sm h-[65%] group relative"></div>
<div className="flex-1 bg-primary/20 rounded-t-sm h-[45%] group relative"></div>
<div className="flex-1 bg-primary/40 rounded-t-sm h-[80%] group relative"></div>
<div className="flex-1 bg-primary/60 rounded-t-sm h-[55%] group relative"></div>
<div className="flex-1 bg-primary/80 rounded-t-sm h-[90%] group relative"></div>
<div className="flex-1 bg-primary rounded-t-sm h-[75%] group relative"></div>
<div className="flex-1 bg-primary/40 rounded-t-sm h-[60%] group relative"></div>
<div className="flex-1 bg-primary/20 rounded-t-sm h-[40%] group relative"></div>
<div className="flex-1 bg-primary/30 rounded-t-sm h-[55%] group relative"></div>
<div className="flex-1 bg-primary/10 rounded-t-sm h-[30%] group relative"></div>
<div className="flex-1 bg-primary/50 rounded-t-sm h-[70%] group relative"></div>
</div>
<div className="flex justify-between mt-4 font-mono text-[10px] text-on-surface-variant/40">
<span>OCT 24</span>
<span>NOV 01</span>
<span>NOV 08</span>
<span>NOV 15</span>
<span>NOV 22</span>
<span>TODAY</span>
</div>
</div>
<!-- Order Status Donut -->
<div className="glass-card p-8 rounded-xl border border-outline-variant/10 flex flex-col">
<h4 className="font-headline text-xl font-bold mb-10">Order Status</h4>
<div className="flex-1 flex flex-col justify-center items-center relative">
<!-- Abstract Visual Donut -->
<div className="w-48 h-48 rounded-full border-[12px] border-surface-container-highest flex items-center justify-center relative">
<div className="absolute inset-0 border-[12px] border-primary border-t-transparent border-r-transparent rounded-full rotate-45"></div>
<div className="text-center">
<span className="text-4xl font-headline font-bold text-on-surface">88%</span>
<p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">Fulfilled</p>
</div>
</div>
<div className="mt-10 w-full space-y-4">
<div className="flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<span className="text-on-surface-variant">Delivered</span>
</div>
<span className="font-mono font-bold">1,240</span>
</div>
<div className="flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<span className="text-on-surface-variant">Processing</span>
</div>
<span className="font-mono font-bold">156</span>
</div>
<div className="flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-outline"></div>
<span className="text-on-surface-variant">Cancelled</span>
</div>
<span className="font-mono font-bold">42</span>
</div>
</div>
</div>
</div>
</section>
<section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
<!-- Recent Orders -->
<div className="space-y-8">
<div className="flex justify-between items-end">
<h4 className="font-headline text-2xl font-bold tracking-tight">Recent Acquisitions</h4>
<a className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:opacity-70 transition-opacity" href="#" onClick={(e)=>{e.preventDefault();}}>View All Orders</a>
</div>
<div className="glass-card rounded-xl border border-outline-variant/10 overflow-hidden">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
<th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Order ID</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Customer</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Amount</th>
<th className="px-6 py-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Status</th>
<th className="px-6 py-4"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/5">
<tr className="hover:bg-primary/5 transition-colors group">
<td className="px-6 py-5 font-mono text-xs text-primary">#OB-9281</td>
<td className="px-6 py-5">
<p className="text-sm font-bold">Julianne Vough</p>
<p className="text-[10px] text-on-surface-variant/60">Nov 24, 2024</p>
</td>
<td className="px-6 py-5 font-mono font-bold text-sm text-on-surface">$1,450.00</td>
<td className="px-6 py-5">
<span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Paid</span>
</td>
<td className="px-6 py-5 text-right">
<button className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="more_vert">more_vert</button>
</td>
</tr>
<tr className="hover:bg-primary/5 transition-colors group">
<td className="px-6 py-5 font-mono text-xs text-primary">#OB-9279</td>
<td className="px-6 py-5">
<p className="text-sm font-bold">Marcus Chen</p>
<p className="text-[10px] text-on-surface-variant/60">Nov 23, 2024</p>
</td>
<td className="px-6 py-5 font-mono font-bold text-sm text-on-surface">$8,900.00</td>
<td className="px-6 py-5">
<span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Pending</span>
</td>
<td className="px-6 py-5 text-right">
<button className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="more_vert">more_vert</button>
</td>
</tr>
<tr className="hover:bg-primary/5 transition-colors group">
<td className="px-6 py-5 font-mono text-xs text-primary">#OB-9275</td>
<td className="px-6 py-5">
<p className="text-sm font-bold">Elena Rossi</p>
<p className="text-[10px] text-on-surface-variant/60">Nov 23, 2024</p>
</td>
<td className="px-6 py-5 font-mono font-bold text-sm text-on-surface">$2,100.00</td>
<td className="px-6 py-5">
<span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Paid</span>
</td>
<td className="px-6 py-5 text-right">
<button className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="more_vert">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!-- Top Selling Products -->
<div className="space-y-8">
<div className="flex justify-between items-end">
<h4 className="font-headline text-2xl font-bold tracking-tight">Top Performance</h4>
<div className="flex gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
<span className="text-primary">Revenue</span>
<span className="text-on-surface-variant/40">Units</span>
</div>
</div>
<div className="space-y-4">
<!-- Product 1 -->
<div className="glass-card flex items-center p-4 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
<div className="w-16 h-16 rounded overflow-hidden bg-surface-container-highest">
<img alt="Product" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="minimalist expensive watch on dark velvet background, dramatic spot lighting, luxury product photography" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhrufPIkIo_APZwRB-aeThH56ijSMelehJem0JODwMRUwirTOG5aKfQucsTZ6p9g1afWKxP6JxnPy2iKdmoOszeMRHWEh0-sVZ6ICdAfcp-yFdkHH1WEfl7C7kTuzs0gmIbEuc4Wtxp88GWYt1RlUQE6NW29JRKzdRWW2yMvvFNcHeB26SmBuP7t3olHPXwQUpe58lFmor9hNRN51gAKedj94QjzEcmDCPDK6dKhlmetjrdYPUjP9NByBSEYf0DrRxZmIkK_o3Ois"/>
</div>
<div className="flex-1 px-6">
<p className="text-xs text-primary font-mono mb-1">RANK #1</p>
<h5 className="font-bold text-sm text-on-surface">Obsidian Chronograph X1</h5>
</div>
<div className="text-right">
<p className="font-mono font-bold text-sm text-on-surface">$124,500</p>
<p className="text-[10px] text-on-surface-variant/60">82 Units Sold</p>
</div>
</div>
<!-- Product 2 -->
<div className="glass-card flex items-center p-4 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
<div className="w-16 h-16 rounded overflow-hidden bg-surface-container-highest">
<img alt="Product" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="dark tailored wool coat on a designer mannequin, shadows and high contrast, editorial fashion style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD30nV4lMtVVQinOYaREvmtcnMzYZukWZmSa_HapPoWYqYit9eoKxBGFWiPdAj9oaVIUk4CFuRvTbEFf-i_F8W2Hqbr5A7Vy3L41XSmyOCwMMvIm17giXytofmYnWUxkRwnUEwaiqnNSG8NBr3TX1ov0pol_swxqCigzGYGFjK2lcgUXTdYc-1JyhemHGHlfwnUlJm9_KBacuXWB5lFb9XNWpH8n-_Wak2i6VvlZhvKb4zOLGUmD-513z33GzzInHkVq6bNoVvyjUI"/>
</div>
<div className="flex-1 px-6">
<p className="text-xs text-primary font-mono mb-1">RANK #2</p>
<h5 className="font-bold text-sm text-on-surface">Midnight Cashmere Overcoat</h5>
</div>
<div className="text-right">
<p className="font-mono font-bold text-sm text-on-surface">$98,200</p>
<p className="text-[10px] text-on-surface-variant/60">45 Units Sold</p>
</div>
</div>
<!-- Product 3 -->
<div className="glass-card flex items-center p-4 rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group">
<div className="w-16 h-16 rounded overflow-hidden bg-surface-container-highest">
<img alt="Product" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" data-alt="exquisite hand-blown glass sculpture with golden amber swirl, dramatic dark gallery background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnP-K63vf4ZSnkGFtOWoQX2KoMj7z9_xuqU0K-4Uk_J2Lf9XTsiH8ZfYLay6xtqGNjtCEMBD_oizVs_SHgiervuYnO7NRGRZfvBJzxoDOXAajas5xsqKMSg0tqYQAYAoUECooJIHseQiJZTS5yx2NwTL9q2XGcZHq0lTKl2RKEBjTiVHbwSIZJehrokvWoYQr5COJocCYE4IOHmwHKWq1YDduFODx4Dc3Mu84d40Lg7vRIqjAI9_7RPL9CvVYsqvUHkmmU3shGhc"/>
</div>
<div className="flex-1 px-6">
<p className="text-xs text-primary font-mono mb-1">RANK #3</p>
<h5 className="font-bold text-sm text-on-surface">Amber Helix Sculpture</h5>
</div>
<div className="text-right">
<p className="font-mono font-bold text-sm text-on-surface">$56,700</p>
<p className="text-[10px] text-on-surface-variant/60">12 Units Sold</p>
</div>
</div>
</div>
</div>
</section>
<footer className="mt-32 pt-16 border-t border-outline-variant/10">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
<div className="col-span-1 md:col-span-2">
<div className="text-lg font-bold text-primary mb-4 font-headline uppercase tracking-widest">The Obsidian Curator</div>
<p className="text-on-surface-variant/60 text-xs max-w-sm leading-relaxed">
                            A bespoke administrative interface for the world's most exclusive luxury gallery. Precision data meets editorial excellence.
                        </p>
</div>
<div className="flex flex-col gap-3">
<span className="text-[10px] uppercase tracking-widest font-bold text-on-surface mb-2">Systems</span>
<a className="text-xs text-on-surface-variant/40 hover:text-primary transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Private Suite</a>
<a className="text-xs text-on-surface-variant/40 hover:text-primary transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Shipping Etiquette</a>
</div>
<div className="flex flex-col gap-3">
<span className="text-[10px] uppercase tracking-widest font-bold text-on-surface mb-2">Legal</span>
<a className="text-xs text-on-surface-variant/40 hover:text-primary transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Terms of Service</a>
<a className="text-xs text-on-surface-variant/40 hover:text-primary transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Authenticity Guarantee</a>
</div>
</div>
<div className="text-[10px] text-on-surface-variant/40 text-center uppercase tracking-[0.3em]">
                    © 2024 The Obsidian Curator. All Rights Reserved.
                </div>
</footer>
</div>
  );
}
