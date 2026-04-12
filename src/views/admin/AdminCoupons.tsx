import React from "react";

export default function AdminCoupons({
  setView,
}: {
  setView: (view: any) => void;
}) {
  return (
    <div className="animate-in fade-in">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline text-4xl text-on-surface mb-2">Promotional Vault</h2>
          <p className="text-gray-500 tracking-wide text-sm">Orchestrate exclusivity through curated incentives.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-on-primary font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:-translate-y-1 shadow-[0_32px_64px_-12px_rgba(230,195,100,0.06)] group">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-sm uppercase tracking-widest">Add New Coupon</span>
        </button>
      </div>

      {/* KPI Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Total Active Coupons</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline text-on-surface">24</span>
            <span className="text-primary text-xs font-mono">+3 this month</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Total Redemptions</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline text-on-surface">1,842</span>
            <span className="text-emerald-500 text-xs font-mono">↑ 12%</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity opacity-0 group-hover:opacity-100" />
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Revenue Impact</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline text-primary">$42,900</span>
            <span className="text-gray-500 text-xs font-mono tracking-tighter">Gross Attributed</span>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="glass-card rounded-2xl border border-white/5 shadow-[0_32px_64px_-12px_rgba(230,195,100,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Code</th>
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Type</th>
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Value</th>
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Min. Order</th>
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Usage Limit</th>
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Expiry Date</th>
                <th className="px-8 py-5 font-headline text-primary/80 font-normal tracking-wide italic border-b border-white/5">Status</th>
                <th className="px-8 py-5 border-b border-white/5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Row 1 */}
              <tr className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-primary bg-primary/10 px-3 py-1 rounded text-xs tracking-widest uppercase">OBSIDIAN25</span>
                </td>
                <td className="px-8 py-6 text-on-surface text-sm">Percentage</td>
                <td className="px-8 py-6 text-on-surface text-sm font-bold">25%</td>
                <td className="px-8 py-6 text-on-surface font-mono text-xs">$1,500.00</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "75%" }} />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">75/100</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-500 text-sm">Oct 24, 2024</td>
                <td className="px-8 py-6">
                  <span className="text-xs uppercase tracking-tighter text-on-surface font-bold">Active</span>
                </td>
                <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-primary bg-primary/10 px-3 py-1 rounded text-xs tracking-widest uppercase">WELCOME100</span>
                </td>
                <td className="px-8 py-6 text-on-surface text-sm">Flat</td>
                <td className="px-8 py-6 text-on-surface text-sm font-bold">$100.00</td>
                <td className="px-8 py-6 text-on-surface font-mono text-xs">$500.00</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "20%" }} />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">42/200</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-500 text-sm">Dec 31, 2024</td>
                <td className="px-8 py-6">
                  <span className="text-xs uppercase tracking-tighter text-on-surface font-bold">Active</span>
                </td>
                <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                </td>
              </tr>
              {/* Row 3 - Expired */}
              <tr className="hover:bg-white/5 transition-colors group opacity-60">
                <td className="px-8 py-6">
                  <span className="font-mono text-gray-500 bg-white/5 px-3 py-1 rounded text-xs tracking-widest uppercase line-through">SUMMER24</span>
                </td>
                <td className="px-8 py-6 text-on-surface text-sm">Percentage</td>
                <td className="px-8 py-6 text-on-surface text-sm font-bold">15%</td>
                <td className="px-8 py-6 text-on-surface font-mono text-xs">$0.00</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-gray-600 h-full" style={{ width: "100%" }} />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">500/500</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-500 text-sm">Aug 31, 2024</td>
                <td className="px-8 py-6">
                  <span className="text-xs uppercase tracking-tighter text-gray-500">Expired</span>
                </td>
                <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <span className="font-mono text-primary bg-primary/10 px-3 py-1 rounded text-xs tracking-widest uppercase">VIPACCESS</span>
                </td>
                <td className="px-8 py-6 text-on-surface text-sm">Tiered</td>
                <td className="px-8 py-6 text-on-surface text-sm font-bold">Custom</td>
                <td className="px-8 py-6 text-on-surface font-mono text-xs">$5,000.00</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: "12%" }} />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">6/50</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-gray-500 text-sm">Jan 01, 2025</td>
                <td className="px-8 py-6">
                  <span className="text-xs uppercase tracking-tighter text-on-surface font-bold">Active</span>
                </td>
                <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined text-lg">more_vert</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-8 py-4 bg-white/5 flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest">
          <span>Showing 4 of 24 curators-exclusive offers</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors cursor-not-allowed opacity-50"><span className="material-symbols-outlined">chevron_left</span></button>
            <span className="text-on-surface">Page 1 of 6</span>
            <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="mt-20 text-center opacity-40">
        <p className="font-headline italic text-lg mb-1">&ldquo;Style is a way to say who you are without having to speak.&rdquo;</p>
        <p className="text-[10px] uppercase tracking-[0.3em]">Vault Management System v4.2.0</p>
      </div>
    </div>
  );
}
