const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

// The `useState<View>` block looks like this:
// const [view, setView] = useState<View>('home');
// 
// React.useEffect(() => {
//   (window as any).__setView = setView;
// }, []);

// First, find the exact string.
const searchStr = `  const [view, setView] = useState<View>('home');

  React.useEffect(() => {
    (window as any).__setView = setView;
  }, []);`;

const replaceStr = `  const [view, setView] = useState<View>('home');

  React.useEffect(() => {
    (window as any).__setView = setView;
    const handleHash = () => {
      let hash = window.location.hash.replace('#', '');
      if (['admin-dashboard', 'admin-products', 'admin-orders', 'admin-customers'].includes(hash)) {
        setView(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);`;

if (app.includes(searchStr)) {
  app = app.replace(searchStr, replaceStr);
  fs.writeFileSync('src/App.tsx', app);
  console.log('Successfully injected combined useEffect hook');
} else {
  console.log('Could not find the target string! Current content around useState:');
  const lines = app.split('\\n');
  const idx = lines.findIndex(l => l.includes('useState<View>'));
  console.log(lines.slice(Math.max(0, idx - 2), idx + 5).join('\\n'));
}
