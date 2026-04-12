const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

const searchRegex = /const handleHash = \(\) => \{.+?return \(\) => window\.removeEventListener\('hashchange', handleHash\);\s+\}, \[\]\);/s;

const replaceStr = `const handlePath = () => {
      let path = window.location.pathname.replace('/', '');
      if (['admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers'].includes(path)) {
        setView(path as any);
      } else if (path === '') {
        // Default
      }
    };
    window.addEventListener('popstate', handlePath);
    handlePath();
    return () => window.removeEventListener('popstate', handlePath);
  }, []);`;

if (app.match(searchRegex)) {
  app = app.replace(searchRegex, replaceStr);
  fs.writeFileSync('src/App.tsx', app);
  console.log('Path routing injected');
} else {
  console.log('Regex not matched in App.tsx');
}
