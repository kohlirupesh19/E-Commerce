const fs = require('fs');
let layout = fs.readFileSync('src/views/admin/AdminLayout.tsx', 'utf8');

if (!layout.includes('{children}')) {
    // If AdminLayout has its own main content area, add children there
    // The structure typically is <div className="flex..."> <aside>...</aside> ... </div>
    // Let's insert children after aside
    layout = layout.replace('</aside>', '</aside>\n      <main className="flex-1 ml-80 min-h-screen">{children}</main>');
    fs.writeFileSync('src/views/admin/AdminLayout.tsx', layout);
}
