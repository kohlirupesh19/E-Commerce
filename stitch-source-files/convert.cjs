const fs = require('fs');

function convertHtmlToReact(htmlFile, outputFile, componentName, mainContentOnly) {
    if (!fs.existsSync(htmlFile)) {
        console.log("File not found:", htmlFile);
        return;
    }
    const html = fs.readFileSync(htmlFile, 'utf8');

    let tsxCode = "";

    if (!mainContentOnly) {
        // Find aside
        const asideMatch = html.match(/<aside[\s\S]*?<\/aside>/);
        if (asideMatch) {
            tsxCode = asideMatch[0];
            tsxCode = tsxCode.replace(/class=/g, 'className=');
            tsxCode = tsxCode.replace(/for=/g, 'htmlFor=');
            tsxCode = tsxCode.replace(/style="([^"]*)"/g, (match, p1) => {
                return `style={{ fontVariationSettings: "'FILL' 1" }}`;
            });
            tsxCode = tsxCode.replace(/href="#"/g, `href="#" onClick={(e)=>{e.preventDefault();}}`);

            // Change links to use setView based on text
            tsxCode = tsxCode.replace(/<span>Dashboard<\/span>/g, `<span onClick={() => setView('admin-dashboard')} className={activeView === 'admin-dashboard' ? 'text-primary' : ''}>Dashboard</span>`);
            // Wait, we need to apply onClick on the <a> tag instead
        }
    } else {
        const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
        let headerMatch = mainMatch[0].match(/<header[\s\S]*?<\/header>/);
        let sectionsMatch = mainMatch[0].match(/<section[\s\S]*?<\/section>/g);
        let footerMatch = mainMatch[0].match(/<footer[\s\S]*?<\/footer>/);

        tsxCode = "<div className=\"animate-in fade-in\">\n";
        if(headerMatch) tsxCode += headerMatch[0] + "\n";
        if(sectionsMatch) sectionsMatch.forEach(s => tsxCode += s + "\n");
        if(footerMatch) tsxCode += footerMatch[0] + "\n";
        tsxCode += "</div>";

        tsxCode = tsxCode.replace(/class=/g, 'className=');
        tsxCode = tsxCode.replace(/for=/g, 'htmlFor=');
        tsxCode = tsxCode.replace(/style="([^"]*)"/g, (match, p1) => {
            return `style={{ }}`;
        });
        tsxCode = tsxCode.replace(/href="#"/g, `href="#" onClick={(e)=>{e.preventDefault();}}`);
        
        // fix img tags without closing slash
        tsxCode = tsxCode.replace(/<img(.*?[^\/])>/g, '<img$1 />');
        // fix hr tags
        tsxCode = tsxCode.replace(/<hr(.*?[^\/])>/g, '<hr$1 />');
        // fix input tags
        tsxCode = tsxCode.replace(/<input(.*?[^\/])>/g, '<input$1 />');
        // fix br tags
        tsxCode = tsxCode.replace(/<br(.*?[^\/])>/g, '<br$1 />');
    }

    if (componentName === 'AdminLayout') {
        const out = `import React from 'react';
import { motion } from 'framer-motion';

export default function AdminLayout({ children, activeView, setView }: { children: React.ReactNode, activeView: string, setView: (view: any) => void }) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body selection:bg-primary/30">
      <aside className="fixed left-0 top-0 h-full w-80 z-[60] bg-[#0e0e12] flex flex-col p-6 gap-8 border-r border-[#F5F5F0]/10 shadow-[20px_0_60px_rgba(0,0,0,0.5)] font-['Noto_Serif'] text-sm uppercase tracking-widest">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div>
                <h2 className="text-primary font-black tracking-tighter">The Obsidian</h2>
                <p className="text-[10px] text-on-surface-variant/60 lowercase tracking-normal">Administration</p>
            </div>
        </div>
        <nav className="flex-1 space-y-2">
            <a onClick={(e) => { e.preventDefault(); setView('admin-dashboard'); }} className={\`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 \${activeView === 'admin-dashboard' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}\`} href="#">
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('admin-products'); }} className={\`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 \${activeView === 'admin-products' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}\`} href="#">
                <span className="material-symbols-outlined">inventory_2</span>
                <span>Products</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('admin-orders'); }} className={\`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 \${activeView === 'admin-orders' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}\`} href="#">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>Orders</span>
            </a>
            <a onClick={(e) => { e.preventDefault(); setView('admin-customers'); }} className={\`flex items-center gap-4 px-4 py-3 rounded-lg transition-transform duration-200 hover:translate-x-1 \${activeView === 'admin-customers' ? 'text-primary bg-[#353439]/30' : 'text-[#F5F5F0]/40 hover:text-[#F5F5F0]'}\`} href="#">
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
`;
        fs.writeFileSync(outputFile, out);
    } else {
        const out = `import React from 'react';
import { motion } from 'framer-motion';

export default function ${componentName}({ setView }: { setView: (view: any) => void }) {
  return (
    ${tsxCode}
  );
}
`;
        fs.writeFileSync(outputFile, out);
    }
}

convertHtmlToReact('admin-dashboard.html', 'src/views/admin/AdminLayout.tsx', 'AdminLayout', false);
convertHtmlToReact('admin-dashboard.html', 'src/views/admin/AdminDashboard.tsx', 'AdminDashboard', true);
convertHtmlToReact('admin-products.html', 'src/views/admin/AdminProducts.tsx', 'AdminProducts', true);
convertHtmlToReact('admin-orders.html', 'src/views/admin/AdminOrders.tsx', 'AdminOrders', true);
convertHtmlToReact('admin-customers.html', 'src/views/admin/AdminCustomers.tsx', 'AdminCustomers', true);

console.log('Conversion complete');
