const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
if (!app.includes('import AdminLayout')) {
    const importStatements = `\nimport AdminLayout from './views/admin/AdminLayout';\nimport AdminDashboard from './views/admin/AdminDashboard';\nimport AdminProducts from './views/admin/AdminProducts';\nimport AdminOrders from './views/admin/AdminOrders';\nimport AdminCustomers from './views/admin/AdminCustomers';\n`;
    
    const lastImportIndex = app.lastIndexOf('import ');
    const nextLineIndex = app.indexOf('\n', lastImportIndex);
    app = app.slice(0, nextLineIndex) + importStatements + app.slice(nextLineIndex);
}

// Add conditions
if (!app.includes('AdminLayout activeView')) {
    const renderBlock = `
        {['admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers'].includes(view) && (
          <AdminLayout activeView={view} setView={setView}>
            {view === 'admin-dashboard' && <AdminDashboard setView={setView} />}
            {view === 'admin-products' && <AdminProducts setView={setView} />}
            {view === 'admin-orders' && <AdminOrders setView={setView} />}
            {view === 'admin-customers' && <AdminCustomers setView={setView} />}
          </AdminLayout>
        )}
      </AnimatePresence>`;
    app = app.replace('      </AnimatePresence>', renderBlock);
}

fs.writeFileSync('src/App.tsx', app);
