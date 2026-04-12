import React from "react";

export default function AdminCustomerProfile({
  setView,
}: {
  setView: (view: any) => void;
}) {
  return (
    <div className="animate-in fade-in max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4 text-xs font-medium tracking-widest uppercase text-on-surface-variant/40">
        <span>Admin</span>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => setView("admin-customers")}
        >
          Customers
        </span>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-primary">Elena Valerius</span>
      </div>

      {/* Profile Hero Section */}
      <section className="grid grid-cols-12 gap-8 items-stretch">
        {/* Main Profile Card */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-10 flex flex-col sm:flex-row gap-10 items-start border-l border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <span className="px-4 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
              Onyx Private
            </span>
          </div>
          <div className="relative group">
            <div className="w-40 h-52 rounded-lg overflow-hidden border border-outline-variant/30 transform transition-transform group-hover:scale-[1.02] duration-500">
              <img
                alt="Elena Valerius Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUJWcbzvya2PQT6O7zYLUqtruH1oMpzf6a5ZXhm17PnNwwQWDCAUgXtFRyDY_Zh3uFfPVsbODxN0PvkjrIMwmnyyKhoRFbZla1xtNhlyWmT6Cyrorzl4byRS6eNlu4HNdKqRZfmcFbmE5axbV9Jq-z68o-E6ufAe14aAFOQTEQ58Uj8HFXDHQdiM60J-G7Ppe48dp3UFf19LyRXpVP4mF2PcvapGboJULe9lsDylBM6xZPdEdXR3XODXNRdAqn3ivotsixRq7m7OY"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-background p-2 rounded-full border border-outline-variant/20">
              <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-background" />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-5xl font-headline font-black tracking-tight text-on-surface">Elena Valerius</h2>
              <p className="font-mono text-primary text-sm mt-2 tracking-widest uppercase">#OB-9021</p>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-outline-variant/10">
              <div>
                <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">Total Acquisitions</p>
                <p className="text-2xl font-headline text-primary">$124,500</p>
              </div>
              <div>
                <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">Status</p>
                <p className="text-lg font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Active
                </p>
              </div>
              <div>
                <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-lg font-medium text-on-surface">Nov 12, 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Preferences Card */}
        <div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-8 flex flex-col justify-between border-t border-primary/10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <h3 className="font-headline text-xl font-bold italic tracking-wide">Client Preferences</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-3">Preferred Ateliers</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-container-highest/50 rounded-full text-xs border border-outline-variant/10 hover:border-primary/40 transition-colors cursor-default">Patek Philippe</span>
                  <span className="px-3 py-1 bg-surface-container-highest/50 rounded-full text-xs border border-outline-variant/10 hover:border-primary/40 transition-colors cursor-default">Maison Mara</span>
                  <span className="px-3 py-1 bg-surface-container-highest/50 rounded-full text-xs border border-outline-variant/10 hover:border-primary/40 transition-colors cursor-default">Audemars Piguet</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mb-3">Core Categories</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/5 rounded-full text-[10px] font-bold text-primary border border-primary/20 uppercase tracking-tighter">Timepieces</span>
                  <span className="px-3 py-1 bg-primary/5 rounded-full text-[10px] font-bold text-primary border border-primary/20 uppercase tracking-tighter">Leather Goods</span>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 border border-outline-variant/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300">
            Edit Curatorial Profile
          </button>
        </div>
      </section>

      {/* Detailed Content Grid */}
      <div className="grid grid-cols-12 gap-12">
        {/* Acquisition Ledger */}
        <section className="col-span-12 lg:col-span-8">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-headline text-2xl font-black tracking-tight">Acquisition Ledger</h3>
            <span className="font-mono text-[10px] text-on-surface-variant">24 ENTRIES FOUND</span>
          </div>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="px-8 py-6 text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-6 text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Date</th>
                  <th className="px-8 py-6 text-[10px] font-label text-on-surface-variant uppercase tracking-widest text-center">Items</th>
                  <th className="px-8 py-6 text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="px-8 py-5 font-mono text-sm text-primary">#OB-28492</td>
                  <td className="px-8 py-5 text-sm text-on-surface/80">Jan 14, 2024</td>
                  <td className="px-8 py-5 text-sm text-on-surface/80 text-center">02</td>
                  <td className="px-8 py-5 text-sm font-medium">$42,200.00</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Shipped
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="px-8 py-5 font-mono text-sm text-primary">#OB-28114</td>
                  <td className="px-8 py-5 text-sm text-on-surface/80">Dec 28, 2023</td>
                  <td className="px-8 py-5 text-sm text-on-surface/80 text-center">01</td>
                  <td className="px-8 py-5 text-sm font-medium">$12,450.00</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Shipped
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer">
                  <td className="px-8 py-5 font-mono text-sm text-primary">#OB-27901</td>
                  <td className="px-8 py-5 text-sm text-on-surface/80">Dec 05, 2023</td>
                  <td className="px-8 py-5 text-sm text-on-surface/80 text-center">05</td>
                  <td className="px-8 py-5 text-sm font-medium">$69,850.00</td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Processing
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="p-6 text-center border-t border-outline-variant/10">
              <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 hover:text-primary transition-colors">Load Full History</button>
            </div>
          </div>
        </section>

        {/* Activity Logs */}
        <section className="col-span-12 lg:col-span-4">
          <div className="flex items-baseline justify-between mb-8">
            <h3 className="font-headline text-2xl font-black tracking-tight">Activity Logs</h3>
            <button className="text-primary hover:underline text-[10px] font-bold tracking-widest uppercase">View All</button>
          </div>
          <div className="space-y-0 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/20">
            <div className="relative pl-12 pb-10">
              <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(230,195,100,0.5)] z-10" />
              <span className="text-[10px] font-mono text-on-surface-variant uppercase mb-1 block">Today • 14:24</span>
              <p className="text-sm text-on-surface font-medium mb-1">Viewed <span className="text-primary italic">Obsidian Chronograph X1</span></p>
              <p className="text-xs text-on-surface-variant leading-relaxed">Spent 4 minutes reviewing technical specifications and macro imagery.</p>
            </div>
            <div className="relative pl-12 pb-10 group">
              <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-outline-variant/40 group-hover:bg-primary transition-colors z-10" />
              <span className="text-[10px] font-mono text-on-surface-variant uppercase mb-1 block">Yesterday • 09:12</span>
              <p className="text-sm text-on-surface font-medium mb-1">Added <span className="text-primary italic">Nebula Silk Wrap</span> to Wishlist</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">System triggered &apos;Low Stock&apos; automated concierge notification.</p>
            </div>
            <div className="relative pl-12 pb-10 group">
              <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-outline-variant/40 group-hover:bg-primary transition-colors z-10" />
              <span className="text-[10px] font-mono text-on-surface-variant uppercase mb-1 block">Jan 12 • 18:45</span>
              <p className="text-sm text-on-surface font-medium mb-1">Virtual Concierge Inquiry</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">Requested sizing details for high-jewelry collection &apos;Aethelgard&apos;.</p>
            </div>
            <div className="relative pl-12 group">
              <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-outline-variant/40 group-hover:bg-primary transition-colors z-10" />
              <span className="text-[10px] font-mono text-on-surface-variant uppercase mb-1 block">Jan 10 • 11:20</span>
              <p className="text-sm text-on-surface font-medium mb-1">Profile Tier Upgrade</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">System automated promotion from Platinum to <span className="text-primary">Onyx Private</span> status.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
