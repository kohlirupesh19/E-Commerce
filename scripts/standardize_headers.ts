import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const standardHeaderClass = 'bg-background/80 backdrop-blur-xl sticky top-0 z-[70] border-b border-outline-variant/10 shadow-[0_8px_32px_rgba(230,195,100,0.04)]';

const headerRegexes = [
  /className="sticky top-0 z-50 bg-\[#131317\]\/80 backdrop-blur-xl border-b border-outline-variant\/10"/g,
  /className="w-full px-8 py-6 flex justify-between items-center z-50"/g,
  /className="w-full px-8 py-6 flex justify-between items-center z-50 bg-background\/80 backdrop-blur-xl sticky top-0 border-b border-outline-variant\/5"/g,
  /className="bg-background\/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant\/10"/g,
  /className="sticky top-0 z-50 w-full px-8 py-4 bg-\[#131317\]\/80 backdrop-blur-xl flex justify-between items-center border-b border-outline-variant\/10 shadow-\[0_8px_32px_rgba\(230,195,100,0\.04\)\]"/g,
  /className="sticky top-0 z-50 bg-\[#131317\]\/80 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4 border-b border-outline-variant\/10 shadow-\[0_8px_32px_rgba\(230,195,100,0\.04\)\]"/g
];

headerRegexes.forEach(regex => {
  content = content.replace(regex, `className="${standardHeaderClass}"`);
});

fs.writeFileSync('src/App.tsx', content);
console.log('Headers standardized');
