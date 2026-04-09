import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const navRegex = /<div className="hidden md:flex items-center gap-8">[\s\S]*?<\/div>\s*<\/header>/g;

content = content.replace(navRegex, (match) => {
  return `<div className="hidden md:flex items-center gap-8">
                <button onClick={() => setView('home')} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-label">Collections</button>
                <button onClick={() => setView('shop')} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-label">Boutique</button>
              </div>
            </header>`;
});

const navRegex2 = /<div className="hidden md:flex items-center gap-6">[\s\S]*?<\/div>\s*<\/header>/g;
content = content.replace(navRegex2, (match) => {
  return `<div className="hidden md:flex items-center gap-6">
                <button onClick={() => setView('home')} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-label">Collections</button>
                <button onClick={() => setView('shop')} className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors font-label">Boutique</button>
              </div>
            </header>`;
});

fs.writeFileSync('src/App.tsx', content);
console.log('Navbars fixed');
