const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// remove previous routing hook
app = app.replace(/React\.useEffect\(\(\) => \{\s+const handleHash = \(\) => \{(?:.|\n)*?window\.removeEventListener\('hashchange', handleHash\);\s+\}, \[\]\);/g, '');

const newHook = `
  React.useEffect(() => {
    (window as any).__setView = setView;
  }, []);
`;

// It might be difficult to replace exactly correctly if the previous replace was messy.
// So let's just insert it after useState<View>
const lines = app.split('\n');
const useStateIndex = lines.findIndex(l => l.includes('useState<View>'));
if (useStateIndex !== -1 && !app.includes('__setView')) {
  lines.splice(useStateIndex + 1, 0, newHook);
  fs.writeFileSync('src/App.tsx', lines.join('\n'));
}
