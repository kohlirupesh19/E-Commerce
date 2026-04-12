const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const routingHook = `
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers'].includes(hash)) {
        setView(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
`;

if (!app.includes('handleHash')) {
    app = app.replace(
        /const \[view, setView\] = useState<View>\('home'\);/,
        `const [view, setView] = useState<View>('home');\n${routingHook}`
    );
    fs.writeFileSync('src/App.tsx', app);
}
