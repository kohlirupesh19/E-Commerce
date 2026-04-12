import React from 'react';
import { motion } from 'framer-motion';

export default function AdminCustomers({ setView }: { setView: (view: any) => void }) {
  return (
    <div className="animate-in fade-in">
<header className="docked full-width top-0 sticky z-50 bg-[#131317]/80 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto no-line tonal-transition bg-gradient-to-b from-[#131317] to-transparent shadow-[0_8px_32px_rgba(230,195,100,0.04)]">
<div className="flex items-center gap-8">
<h1 className="font-headline text-2xl font-bold tracking-tighter text-[#e6c364]">Admin Customers</h1>
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
<input className="bg-surface-container-highest border-none focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2 text-sm w-80 font-body transition-all" placeholder="Search clientele..." type="text"/>
</div>
</div>
<div className="flex items-center gap-6">
<div className="flex gap-4">
<button className="material-symbols-outlined text-[#F5F5F0]/60 hover:text-[#e6c364] transition-colors">notifications</button>
<button className="material-symbols-outlined text-[#F5F5F0]/60 hover:text-[#e6c364] transition-colors">settings</button>
</div>
<div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
<img className="w-full h-full object-cover" data-alt="Portrait of a sophisticated male administrator in a dark studio setting with professional lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB5U5rmbEDtW_lHqUpixhKtk9gZWHkRHNs89-fPC6Z3SEElhMEYGAAuvvd3HPy7A_f-pDshujnSENF7l_EAlzMxh5HYhzW-pTOPNInGER42ZhYTx8nkH_2LLtQS6H9UAMlElBHIN9g_YCnH-ofqBYFzTY8RJzrfteDcky7XkAQoIg3gQqpqjpZSGlqPkhMqeY-oBb_254Fs6kMU3mYOUTHRK1xH6sl4pVukNT_5JoxUW6XrrSMgzKTiVbLnwP9eYWQ1ppxGgXTcFY"/>
</div>
</div>
</header>
<section className="p-12 space-y-12">
<!-- Stat Grid -->
<div className="grid grid-cols-4 gap-8">
<div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 group hover:border-primary/30 transition-all duration-500">
<p className="text-xs font-headline uppercase tracking-[0.2em] text-outline mb-4">Total Clientele</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-primary">2,842</span>
<span className="text-xs text-secondary-fixed">+12%</span>
</div>
</div>
<div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 group hover:border-primary/30 transition-all duration-500">
<p className="text-xs font-headline uppercase tracking-[0.2em] text-outline mb-4">Active Members</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-primary">1,190</span>
<span className="text-xs text-secondary-fixed">+4%</span>
</div>
</div>
<div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 group hover:border-primary/30 transition-all duration-500">
<p className="text-xs font-headline uppercase tracking-[0.2em] text-outline mb-4">AOV (Premium)</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-primary">$4,280</span>
<span className="text-xs text-secondary-fixed">+8%</span>
</div>
</div>
<div className="p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/10 group hover:border-primary/30 transition-all duration-500">
<p className="text-xs font-headline uppercase tracking-[0.2em] text-outline mb-4">New Applications</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-headline font-bold text-primary">14</span>
<span className="text-xs text-outline">Pending</span>
</div>
</div>
</div>
<!-- Customer Table (Editorial Exhibit) -->
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl border border-outline-variant/5">
<div className="p-8 flex justify-between items-center border-b border-outline-variant/5">
<h3 className="font-headline text-xl text-on-surface">Client Directory</h3>
<div className="flex gap-4">
<button className="px-6 py-2.5 bg-surface-container-highest text-[#F5F5F0] text-xs font-headline uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 rounded-lg">Export CSV</button>
<button className="px-6 py-2.5 bg-primary text-on-primary text-xs font-headline uppercase tracking-widest hover:brightness-110 transition-all duration-300 rounded-lg flex items-center gap-2">
<span className="material-symbols-outlined text-sm">add</span> Add New Client
                            </button>
</div>
</div>
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container/50 border-b border-outline-variant/10">
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Client</th>
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Contact</th>
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Activity</th>
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Net Worth Spend</th>
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Joined</th>
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Status</th>
<th className="px-8 py-6 text-[10px] font-headline uppercase tracking-[0.3em] text-outline">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/5">
<!-- Row 1 -->
<tr className="group hover:bg-[#353439]/20 transition-colors cursor-pointer">
<td className="px-8 py-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="Close-up portrait of an elegant woman with minimalist jewelry in soft, moody atmospheric lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrpbOxu1RDDyDO-UMb3aQNzPHU20ABHX46J7RyqitBwHzXhofBjcS1Bk_d6XSSY8AK9vAz7OH4XUp-h13VQCqiURWpoI-MtV67SvUYYWPnshMO_U2JMhGkUph0chg91AWT66NUKxYCJ6ty9gim9qioZEw5nvI_sWB201c88DsN057bFTqf3xftMCkPK5l2OJo1NcyTZpQke_vCCWorB-XSsXA0Q5ipBy8Rx7YytFBd6xNb8-Eu6MKkCT4ZaSgOlydZHwgXp2EQQnU"/>
</div>
<div>
<p className="text-sm font-headline font-bold text-on-surface">Elena Valerius</p>
<p className="text-[10px] font-mono text-outline uppercase">ID: OB-9021</p>
</div>
</div>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface-variant">e.valerius@obsidian.com</p>
<p className="text-[11px] text-outline">+41 79 123 45 67</p>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface">42 Orders</p>
<p className="text-[11px] text-primary-fixed">Tier: Onyx Private</p>
</td>
<td className="px-8 py-6">
<p className="text-sm font-headline text-primary font-bold">$124,500.00</p>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface-variant">Nov 12, 2023</p>
</td>
<td className="px-8 py-6">
<span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-headline uppercase tracking-widest rounded-full border border-primary/20">Active</span>
</td>
<td className="px-8 py-6">
<button className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<!-- Row 2 -->
<tr className="group hover:bg-[#353439]/20 transition-colors cursor-pointer">
<td className="px-8 py-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="Portrait of a distinguished man in a dark tailored suit looking thoughtfully into the distance" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3x_wiUqB5xgIYvRWa9irQnmyNDf4E4s1vrpTe69Gcb8SglaQVF0SbxAJRGqanJaR_oApWI1XPbF32q8EDycqrqY981YzRs39YdI2fR-3oDddB4P1eeaN8oY_WJ-KuR_sXa9JWCYS66gORSfy5CzAIX1qHtTatUt8IJwvUl50MR9rjC8tluQp11sBEaYaf0wTFEkz1BcU_KAuRJgELg-3NeUjxp8glrqi7emZWZp5qaeU9Ocd_taEbsiXy9eeeUM-oU3qniy2fnUQ"/>
</div>
<div>
<p className="text-sm font-headline font-bold text-on-surface">Julian Thorne</p>
<p className="text-[10px] font-mono text-outline uppercase">ID: OB-4432</p>
</div>
</div>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface-variant">julian.thorne@mail.uk</p>
<p className="text-[11px] text-outline">+44 20 7946 0958</p>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface">18 Orders</p>
<p className="text-[11px] text-outline">Tier: Gold</p>
</td>
<td className="px-8 py-6">
<p className="text-sm font-headline text-primary font-bold">$54,200.00</p>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface-variant">Jan 05, 2024</p>
</td>
<td className="px-8 py-6">
<span className="px-3 py-1 bg-error-container/20 text-error text-[10px] font-headline uppercase tracking-widest rounded-full border border-error/20">Blocked</span>
</td>
<td className="px-8 py-6">
<button className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<!-- Row 3 -->
<tr className="group hover:bg-[#353439]/20 transition-colors cursor-pointer">
<td className="px-8 py-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="Close-up face of an artistic woman with dramatic high-contrast studio lighting and dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmdgzgXUoKmJtyZcVYM41XcMa2H9DbcqO2Ea2bm28gvoWUSYies02I9WxaYw2cWchzNrYN6nxAitIUMc-CEikShtJsgbEBrnKJfDga4cZ8pRo9auEkKc91XOXtv5pM41oQZUsdg8WaRX14JrLxyhNQkqgkQEfec59XSnNFJjg97cctxruXiPEj8iBCzUX9gUQPESSvwzmtN81QF4ksc6Yz4ENgPKQuhNquls9R5az2D4GJMAkbyygYBFKBCY0iJZkQ5486pYP92_c"/>
</div>
<div>
<p className="text-sm font-headline font-bold text-on-surface">Sienna Rossi</p>
<p className="text-[10px] font-mono text-outline uppercase">ID: OB-1120</p>
</div>
</div>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface-variant">s.rossi@vogue.it</p>
<p className="text-[11px] text-outline">+39 02 1234567</p>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface">8 Orders</p>
<p className="text-[11px] text-outline">Tier: Silver</p>
</td>
<td className="px-8 py-6">
<p className="text-sm font-headline text-primary font-bold">$12,900.00</p>
</td>
<td className="px-8 py-6">
<p className="text-sm text-on-surface-variant">Mar 22, 2024</p>
</td>
<td className="px-8 py-6">
<span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-headline uppercase tracking-widest rounded-full border border-primary/20">Active</span>
</td>
<td className="px-8 py-6">
<button className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
</tbody>
</table>
<div className="p-8 bg-surface-container/30 flex justify-between items-center">
<p className="text-xs text-outline font-body">Showing 3 of 2,842 clients</p>
<div className="flex gap-2">
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-highest border border-outline-variant/10 text-outline hover:text-primary transition-all">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-headline text-xs">1</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-highest border border-outline-variant/10 text-outline hover:text-primary transition-all">2</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-highest border border-outline-variant/10 text-outline hover:text-primary transition-all">3</button>
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-highest border border-outline-variant/10 text-outline hover:text-primary transition-all">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Bento Activity Preview -->
<div className="grid grid-cols-3 gap-8">
<div className="col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10">
<h4 className="font-headline text-lg text-on-surface mb-8 uppercase tracking-widest">Recent Activity Log</h4>
<div className="space-y-6">
<div className="flex gap-6 items-start">
<div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
<div>
<p className="text-sm text-on-surface"><span className="font-bold">Elena Valerius</span> placed a pre-order for <span className="text-primary italic">"The Gilded Obsidian Watch"</span></p>
<p className="text-[11px] text-outline mt-1 uppercase font-mono">14 minutes ago • Order #OB-55612</p>
</div>
</div>
<div className="flex gap-6 items-start">
<div className="w-2 h-2 rounded-full bg-outline-variant mt-2"></div>
<div>
<p className="text-sm text-on-surface"><span className="font-bold">System Admin</span> updated status of Julian Thorne to <span className="text-error uppercase text-xs">Blocked</span></p>
<p className="text-[11px] text-outline mt-1 uppercase font-mono">2 hours ago • Action Ref: LOG-998</p>
</div>
</div>
<div className="flex gap-6 items-start">
<div className="w-2 h-2 rounded-full bg-secondary-fixed mt-2"></div>
<div>
<p className="text-sm text-on-surface"><span className="font-bold">New Client Application</span> received from Marcus Aurelius IV</p>
<p className="text-[11px] text-outline mt-1 uppercase font-mono">5 hours ago • Application Pending</p>
</div>
</div>
</div>
</div>
<div className="bg-gradient-to-br from-primary/10 to-transparent rounded-xl p-8 border border-primary/20 flex flex-col justify-between">
<div>
<h4 className="font-headline text-lg text-primary mb-2 uppercase tracking-widest">Curation Insights</h4>
<p className="text-sm text-on-surface-variant leading-relaxed">Client retention for Onyx members has increased by <span className="text-primary font-bold">14.2%</span> this quarter. Focus on personalized outreach for Gold tier members.</p>
</div>
<button className="w-full py-4 border-b border-primary/40 text-primary text-[10px] font-headline uppercase tracking-[0.3em] hover:bg-primary/5 transition-all text-center">View Full Analytics</button>
</div>
</div>
</section>
<footer className="w-full mt-20 border-t border-[#F5F5F0]/5 pt-16 bg-[#0e0e12]">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-[1920px] mx-auto">
<div className="col-span-1">
<h3 className="text-lg font-bold text-[#e6c364] mb-4 font-headline uppercase tracking-tighter">The Obsidian Curator</h3>
<p className="text-[#F5F5F0]/40 text-xs font-headline leading-relaxed">Exclusivity refined. The ultimate interface for the world's most discerning collectors and curators.</p>
</div>
<div>
<h4 className="text-[10px] font-headline uppercase tracking-[0.3em] text-outline mb-6">Management</h4>
<ul className="space-y-4">
<li><a className="text-[#F5F5F0]/40 hover:text-[#e6c364] text-xs font-headline transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Private Suite</a></li>
<li><a className="text-[#F5F5F0]/40 hover:text-[#e6c364] text-xs font-headline transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Shipping Etiquette</a></li>
</ul>
</div>
<div>
<h4 className="text-[10px] font-headline uppercase tracking-[0.3em] text-outline mb-6">Legal</h4>
<ul className="space-y-4">
<li><a className="text-[#F5F5F0]/40 hover:text-[#e6c364] text-xs font-headline transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Terms of Service</a></li>
<li><a className="text-[#F5F5F0]/40 hover:text-[#e6c364] text-xs font-headline transition-colors" href="#" onClick={(e)=>{e.preventDefault();}}>Authenticity Guarantee</a></li>
</ul>
</div>
<div>
<h4 className="text-[10px] font-headline uppercase tracking-[0.3em] text-outline mb-6">System</h4>
<p className="text-[#F5F5F0]/40 text-xs font-headline mb-4">v4.2.0-Alpha High Security</p>
<div className="flex gap-4">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-[10px] font-headline uppercase tracking-widest text-primary">All Systems Nominal</span>
</div>
</div>
</div>
<div className="px-12 py-8 border-t border-white/5 text-center">
<p className="text-[#F5F5F0]/40 text-[10px] font-headline uppercase tracking-widest">© 2024 The Obsidian Curator. All Rights Reserved.</p>
</div>
</footer>
</div>
  );
}
