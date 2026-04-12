const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the <AdminLayout ...> with <motion.div ...><AdminLayout ...>
if (!app.includes('key="admin-layout"')) {
    app = app.replace(
      '<AdminLayout activeView={view} setView={setView}>',
      '<motion.div key="admin-layout" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="w-full relative z-50">\n            <AdminLayout activeView={view} setView={setView}>'
    );
    app = app.replace(
      '          </AdminLayout>',
      '          </AdminLayout>\n          </motion.div>'
    );
    fs.writeFileSync('src/App.tsx', app);
}
