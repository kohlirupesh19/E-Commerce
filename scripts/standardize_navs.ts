import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const navRegex = /<nav className="hidden md:flex items-center gap-8 font-headline tracking-tight">[\s\S]*?<\/nav>/g;

content = content.replace(navRegex, (match) => {
  return `<nav className="hidden md:flex items-center gap-8 font-headline tracking-tight">
                  <a 
                    className="text-on-surface-variant/60 hover:text-on-surface transition-colors text-sm uppercase tracking-widest font-bold cursor-pointer" 
                    onClick={() => setView('home')}
                  >
                    Collections
                  </a>
                  <a 
                    className="text-on-surface-variant/60 hover:text-on-surface transition-colors text-sm uppercase tracking-widest font-bold cursor-pointer" 
                    onClick={() => setView('shop')}
                  >
                    Boutique
                  </a>
                </nav>`;
});

fs.writeFileSync('src/App.tsx', content);
console.log('Navs standardized');
