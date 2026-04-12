const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import AdminLayout from './views/admin/AdminLayout';
import AdminDashboard from './views/admin/AdminDashboard';
import AdminProducts from './views/admin/AdminProducts';
import AdminOrders from './views/admin/AdminOrders';
import AdminCustomers from './views/admin/AdminCustomers';\n`;

if (!app.includes('import AdminLayout')) {
    app = app.replace(/^import React/m, imports + 'import React');
}

app = app.replace(/type View = '(.*?)';/, `type View = '$1' | 'admin-dashboard' | 'admin-products' | 'admin-orders' | 'admin-customers';`);

const adminRoutes = `
        {['admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers'].includes(view) && (
          <motion.div
            key="admin-routes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminLayout activeView={view} setView={setView}>
              {view === 'admin-dashboard' && <AdminDashboard setView={setView} />}
              {view === 'admin-products' && <AdminProducts setView={setView} />}
              {view === 'admin-orders' && <AdminOrders setView={setView} />}
              {view === 'admin-customers' && <AdminCustomers setView={setView} />}
            </AdminLayout>
          </motion.div>
        )}
`;

const targetStr = '</AnimatePresence>\n    </div>\n    </SearchContext.Provider>';
if (app.includes(targetStr) && !app.includes('admin-dashboard')) {
    app = app.replace(targetStr, adminRoutes + '      ' + targetStr);
} else {
    // try removing carriage returns
    const targetStr2 = '</AnimatePresence>\r\n    </div>\r\n    </SearchContext.Provider>';
    if (app.includes(targetStr2) && !app.includes('admin-dashboard')) {
        app = app.replace(targetStr2, adminRoutes + '      ' + targetStr2);
    }
}

fs.writeFileSync('src/App.tsx', app);
