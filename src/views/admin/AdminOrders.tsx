import React from "react";

export default function AdminOrders({
  setView,
}: {
  setView: (view: any) => void;
}) {
  return (
    <div className="animate-in fade-in">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="font-headline text-5xl mb-4 tracking-tight">
          Order Management
        </h1>
        <p className="text-on-surface-variant max-w-2xl font-body">
          Manage boutique transactions, fulfillment statuses, and high-value
          customer acquisitions within the Obsidian vault.
        </p>
      </header>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-highest/30 p-4 rounded-xl border-b border-outline-variant/15">
          <label className="block text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">
            Date Range
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm font-body">Oct 01 - Oct 31, 2024</span>
            <span className="material-symbols-outlined text-outline">
              calendar_today
            </span>
          </div>
        </div>
        <div className="bg-surface-container-highest/30 p-4 rounded-xl border-b border-outline-variant/15">
          <label className="block text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">
            Order Status
          </label>
          <select className="bg-transparent border-none text-sm w-full p-0 focus:ring-0 cursor-pointer">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
        </div>
        <div className="bg-surface-container-highest/30 p-4 rounded-xl border-b border-outline-variant/15">
          <label className="block text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">
            Payment Method
          </label>
          <select className="bg-transparent border-none text-sm w-full p-0 focus:ring-0 cursor-pointer">
            <option>Any Method</option>
            <option>Wire Transfer</option>
            <option>Crypto (USDC)</option>
            <option>Premium Credit</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <span className="material-symbols-outlined">search</span> Search
            Orders
          </button>
        </div>
      </div>

      {/* Orders Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table Section */}
        <div className="flex-1 overflow-hidden">
          <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/5 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-primary font-headline text-sm uppercase tracking-widest">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Items</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Payment</th>
                  <th className="px-6 py-5">Fulfillment</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5 text-on-surface">
                {/* Row 1 */}
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-6 font-mono text-xs">#OC-88219</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        AM
                      </div>
                      <span className="font-semibold text-sm">
                        Adrian Moretti
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    Oct 12, 2024
                  </td>
                  <td className="px-6 py-6 text-sm">03</td>
                  <td className="px-6 py-6 font-headline text-primary font-bold text-lg">
                    $12,450.00
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-secondary-container/20 text-secondary border border-secondary/20">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-surface-container-highest text-on-surface-variant">
                      Processing
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer group bg-surface-container-lowest/40">
                  <td className="px-6 py-6 font-mono text-xs">#OC-88217</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        EL
                      </div>
                      <span className="font-semibold text-sm">
                        Elena Laurent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    Oct 11, 2024
                  </td>
                  <td className="px-6 py-6 text-sm">01</td>
                  <td className="px-6 py-6 font-headline text-primary font-bold text-lg">
                    $4,200.00
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-secondary-container/20 text-secondary border border-secondary/20">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-tertiary-container/20 text-tertiary border border-tertiary/20">
                      Shipped
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-6 font-mono text-xs">#OC-88214</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        SR
                      </div>
                      <span className="font-semibold text-sm">Soren Raske</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    Oct 10, 2024
                  </td>
                  <td className="px-6 py-6 text-sm">05</td>
                  <td className="px-6 py-6 font-headline text-primary font-bold text-lg">
                    $28,900.00
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-surface-container-highest text-on-surface-variant">
                      Awaiting Wire
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-surface-container-highest text-on-surface-variant">
                      On Hold
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </button>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-primary/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-6 font-mono text-xs">#OC-88209</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        JH
                      </div>
                      <span className="font-semibold text-sm">
                        Julianne Hayes
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-on-surface-variant">
                    Oct 09, 2024
                  </td>
                  <td className="px-6 py-6 text-sm">02</td>
                  <td className="px-6 py-6 font-headline text-primary font-bold text-lg">
                    $1,850.00
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-secondary-container/20 text-secondary border border-secondary/20">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-surface-container-highest text-on-surface-variant">
                      Delivered
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                      chevron_right
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/5 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                Showing 1 to 10 of 420 orders
              </span>
              <div className="flex gap-2">
                <button className="h-8 w-8 rounded bg-surface-container-highest flex items-center justify-center material-symbols-outlined text-sm">
                  chevron_left
                </button>
                <button className="h-8 w-8 rounded bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                  1
                </button>
                <button className="h-8 w-8 rounded bg-surface-container-highest flex items-center justify-center text-xs font-bold">
                  2
                </button>
                <button className="h-8 w-8 rounded bg-surface-container-highest flex items-center justify-center material-symbols-outlined text-sm">
                  chevron_right
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Detail Side Panel */}
        <aside className="w-full lg:w-96">
          <div className="glass-card rounded-2xl border border-primary/10 p-8 flex flex-col gap-8 sticky top-24">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline text-2xl text-primary">
                    Order Details
                  </h3>
                  <p className="font-mono text-xs opacity-50">#OC-88219</p>
                </div>
                <span className="material-symbols-outlined text-outline cursor-pointer hover:text-on-surface">
                  close
                </span>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-3 font-bold">
                    Items
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-surface-container overflow-hidden">
                        <img
                          alt="Obsidian Handbag"
                          className="h-full w-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf_IDPQvaHN28wPRYizd548tx_S4TMPOEJjZC8y3U3ipt1L8n9SD-ZQEc35alu6u-aLFL9HM7GUIQRfGPcFxMKYcVs5YcYnZwL9Ir9X2_v1xxG9Aiu3rgwZ9A7UlMTDP-X9J9yfqYNQPGedxpBoM_wSrQjsM3UJ-lUg8AqNO_6VIVtf_nJibdygd0vpaRQZDIwDCN5lcYo7VWLcgVo3zmCGxYvipq6D3i_rPICJfT8LdGRd1z50ixc3u8CyfzUxirc_KQ0ePtapvI"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          Obsidian Night Clutch
                        </p>
                        <p className="text-[10px] text-outline">
                          SKU: LXP-229-B
                        </p>
                      </div>
                      <span className="font-headline text-primary">$8,900</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded bg-surface-container overflow-hidden">
                        <img
                          alt="Gold Cufflinks"
                          className="h-full w-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1DS4n3qTtzRrWGeHDCeTi8c3GqIDP7Ii7VsJFKkH-9K1Cv9A7zJTRlTN7_TvITrwSCBXrRhfuxQggPPF-qYLCAMg-OCldbF94f1I9T9uC-WA-JTysFav4zAOYnJFWWZfmuOYFkbSiTGcZH6ZTmW93PIr3jzgkdVuQkt-nmLW2yeTer8syXynUPWSwbjPfZAH_3eV2_Y4I166KS77xaZFcGLlEDrjNteS40zslAGo97Ko2175emOiflLuiXqDH8B9or1tTGAn-imc"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          24K Geometric Links
                        </p>
                        <p className="text-[10px] text-outline">
                          SKU: LXP-114-G
                        </p>
                      </div>
                      <span className="font-headline text-primary">$3,550</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/5">
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2 font-bold">
                    Shipping Address
                  </label>
                  <p className="text-sm text-on-surface leading-relaxed">
                    1120 Park Avenue, Suite 4B
                    <br />
                    Upper East Side, NY 10128
                    <br />
                    United States
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-outline mb-2 font-bold">
                    Internal Notes
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low border border-outline-variant/5 rounded-lg p-3 text-xs focus:border-primary outline-none h-24"
                    placeholder="Add confidential curator notes here..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-primary mb-2 font-bold">
                    Quick Status Update
                  </label>
                  <select className="w-full bg-surface-container-highest text-on-surface border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary">
                    <option>Processing</option>
                    <option>Preparing for Transit</option>
                    <option>Shipped</option>
                    <option>Awaiting Curated Delivery</option>
                  </select>
                </div>
                <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold tracking-widest uppercase text-xs shadow-lg shadow-primary/10">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-outline-variant/5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-lg font-bold text-primary mb-4 font-headline">
              The Obsidian Curator
            </div>
            <p className="text-on-surface-variant/40 text-xs max-w-xs leading-relaxed">
              An exclusive vault for the discerning collector. Curated with
              precision, delivered with discretion.
            </p>
          </div>
          <div>
            <h4 className="text-primary text-[10px] uppercase tracking-widest mb-6 font-bold">
              Services
            </h4>
            <nav className="flex flex-col gap-4">
              <a
                className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Private Suite
              </a>
              <a
                className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Shipping Etiquette
              </a>
              <a
                className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Authenticity Guarantee
              </a>
            </nav>
          </div>
          <div>
            <h4 className="text-primary text-[10px] uppercase tracking-widest mb-6 font-bold">
              Policy
            </h4>
            <nav className="flex flex-col gap-4">
              <a
                className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Terms of Service
              </a>
              <a
                className="text-on-surface-variant/40 hover:text-primary text-xs transition-colors"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Privacy Protocol
              </a>
            </nav>
          </div>
          <div>
            <h4 className="text-primary text-[10px] uppercase tracking-widest mb-6 font-bold">
              Archives
            </h4>
            <p className="text-on-surface-variant/40 text-xs mb-4">
              Subscribe for private acquisitions and seasonal lookbooks.
            </p>
            <div className="flex">
              <input
                className="bg-surface-container border-none rounded-l-lg text-xs w-full focus:ring-1 focus:ring-primary"
                placeholder="Entry key..."
                type="text"
              />
              <button className="bg-surface-container-highest px-4 rounded-r-lg material-symbols-outlined text-primary">
                arrow_forward
              </button>
            </div>
          </div>
        </div>
        <div className="py-8 border-t border-outline-variant/5 flex justify-between items-center text-on-surface-variant/20 text-[10px] uppercase tracking-widest">
          <span>© 2024 The Obsidian Curator. All Rights Reserved.</span>
          <div className="flex gap-8">
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">
              share
            </span>
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">
              lock
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
