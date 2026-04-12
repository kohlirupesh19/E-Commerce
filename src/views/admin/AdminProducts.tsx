export default function AdminProducts({
  setView: _setView,
}: {
  setView: (view: any) => void;
}) {
  return (
    <div className="animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div>
          <span className="text-primary font-label text-[10px] uppercase tracking-[0.3em] block mb-2">Vault Administration</span>
          <h2 className="font-headline text-5xl font-light text-on-surface tracking-tight">Product Archive</h2>
        </div>
        <button className="bg-primary hover:bg-secondary-fixed text-on-primary px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_12px_40px_rgba(230,195,100,0.15)] active:scale-95">
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Product
        </button>
      </div>

      {/* Action Bar */}
      <div className="bg-surface-container-low/50 backdrop-blur-md p-6 rounded-2xl flex flex-wrap items-center justify-between gap-6 mb-8 border border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-lg border border-outline-variant/15 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Category: <span className="text-on-surface font-semibold">All Items</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-lg border border-outline-variant/15 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">signal_cellular_alt</span>
            Status: <span className="text-on-surface font-semibold">Active</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export CSV
          </button>
          <div className="h-4 w-[1px] bg-outline-variant/30" />
          <button className="flex items-center gap-2 text-xs text-error hover:opacity-80 transition-colors">
            <span className="material-symbols-outlined text-lg">delete_sweep</span>
            Delete Selected
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/20 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label border-b border-outline-variant/10">
              <th className="px-8 py-6 w-12 text-center">
                <input className="rounded bg-background border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
              </th>
              <th className="px-6 py-6">Exhibition / Product</th>
              <th className="px-6 py-6">Reference ID</th>
              <th className="px-6 py-6">Collection</th>
              <th className="px-6 py-6">Valuation</th>
              <th className="px-6 py-6">Acquisition</th>
              <th className="px-6 py-6">Availability</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {/* Product 1 */}
            <tr className="group hover:bg-surface-container-highest/20 transition-colors">
              <td className="px-8 py-6 text-center">
                <input className="rounded bg-background border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded bg-surface-container overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img alt="Obsidian Watch" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmh2t6o1K2_IYiCbGjvWapOgjHAQHi0wpIc0UXPEnOj-fqykkUtLptKeX8Pyn2v38_jJ-iT8sL2L4sgip-3tyJY8UhrhsqTLhoLjkMeUKY15IlZ5aJnEeIBN4PwbeGe4H1CSVR-MjJSTWD5Tx6wAEoUjpEx2A31OTES0en9eSkcQT_zbISNMWfHg-A2W1ulnx32FC94KqL0o64jNeyLJKMpwcRA9NLoKESHNjLapq9RrryNjovJrPj_XR8l7YxlqaZUtk05BPTHu8" />
                  </div>
                  <div>
                    <h4 className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">Nocturnal Meridian</h4>
                    <p className="text-xs text-on-surface-variant">Limited Edition Horology</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6 font-mono text-xs tracking-tighter">OC-WAT-9021</td>
              <td className="px-6 py-6"><span className="px-3 py-1 bg-surface-container rounded-full text-[10px] uppercase font-bold text-on-surface-variant border border-outline-variant/10">Boutique</span></td>
              <td className="px-6 py-6 font-headline text-primary">$12,450</td>
              <td className="px-6 py-6 text-xs">12 In Stock</td>
              <td className="px-6 py-6">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            {/* Product 2 */}
            <tr className="group hover:bg-surface-container-highest/20 transition-colors">
              <td className="px-8 py-6 text-center">
                <input className="rounded bg-background border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded bg-surface-container overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img alt="Minimalist Lamp" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUj4xZiVxerOwaUhCGWy9VZMDDOsTYfaorVqqOLOXV2YsAOvQdb8ftJLOjRwkEKsX7ayecsKXenYUf7N6RTMf_G5wL2xdymNyUwW_BzvYZ_VsPgDujkG2520mekU_WcH_Xn0xHxOkibhWhcJLosSDEGrpaaTTnxITo36maQgkYn3yIJO8kCKFlIWcx--rB_vNJRzia2119LFMbPndLRXC-mBuHaqYMlpzN9-gCB2yz7BFz3I-LWA2qGUSKXsrxieT1OafQe2WrvO8" />
                  </div>
                  <div>
                    <h4 className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">Aurelian Beacon</h4>
                    <p className="text-xs text-on-surface-variant">Interior Statement Piece</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6 font-mono text-xs tracking-tighter">OC-LIT-5542</td>
              <td className="px-6 py-6"><span className="px-3 py-1 bg-surface-container rounded-full text-[10px] uppercase font-bold text-on-surface-variant border border-outline-variant/10">Home Suite</span></td>
              <td className="px-6 py-6 font-headline text-primary">$4,800</td>
              <td className="px-6 py-6 text-xs text-error">2 In Stock</td>
              <td className="px-6 py-6">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            {/* Product 3 */}
            <tr className="group hover:bg-surface-container-highest/20 transition-colors">
              <td className="px-8 py-6 text-center">
                <input className="rounded bg-background border-outline-variant text-primary focus:ring-primary/20" type="checkbox" />
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded bg-surface-container overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img alt="Silk Fragment" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXkZaJSaZGZ6BRntOHwXYPlFFKLyAO6HCFLGeEL4WGT_RthgcKoPF2kJs8hkdbdUjFIblmRknG1B8w3C0ijaYQX6DefiLeC0LMiqTOQETbOdvEH1bUcYmht5oDMQY9h1iT3_PMO4EnIjJPFbGcqkA--gLrlWNPsbBROHgh9vsJw45sfSgvnt9ynaBzSVlxRmCGsL4aA85U-IyggO3BhpP5-jORiIylgo3BFeusKF6eTqMZnVpAXqLX_605AVPB0riPdOxzYBisulo" />
                  </div>
                  <div>
                    <h4 className="font-headline text-lg text-on-surface group-hover:text-primary transition-colors">Vesper Silk Scarf</h4>
                    <p className="text-xs text-on-surface-variant">Hand-woven Textiles</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6 font-mono text-xs tracking-tighter">OC-TEX-1108</td>
              <td className="px-6 py-6"><span className="px-3 py-1 bg-surface-container rounded-full text-[10px] uppercase font-bold text-on-surface-variant border border-outline-variant/10">Apparel</span></td>
              <td className="px-6 py-6 font-headline text-primary">$1,200</td>
              <td className="px-6 py-6 text-xs">Out of Stock</td>
              <td className="px-6 py-6">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-primary after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20" />
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-6 bg-surface-container-high/10 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant">Exhibiting <span className="text-on-surface font-bold">1-3</span> of <span className="text-on-surface font-bold">482</span> Masterpieces</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-highest/50 border border-outline-variant/10 hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-on-primary font-bold text-sm">1</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-highest/50 border border-outline-variant/10 hover:bg-surface-container-highest transition-colors text-sm">2</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-highest/50 border border-outline-variant/10 hover:bg-surface-container-highest transition-colors text-sm">3</button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container-highest/50 border border-outline-variant/10 hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
