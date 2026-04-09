import fs from 'fs';

const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Standard header pattern
const headerPattern = /<header className="bg-background\/80 backdrop-blur-xl sticky top-0 z-\[70\] border-b border-outline-variant\/10 shadow-\[0_8px_32px_rgba\(230,195,100,0\.04\)\]">[\s\S]*?<\/header>/g;

content = content.replace(headerPattern, `
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
            />`);

// Category timepieces header pattern
const navPattern = /<nav className="bg-\[#131317\]\/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant\/10 shadow-\[0_8px_32px_rgba\(230,195,100,0\.04\)\]">[\s\S]*?<\/nav>/g;

content = content.replace(navPattern, `
            <TopNavBar 
              view={view} 
              setView={setView} 
              cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              showProfileDropdown={showProfileDropdown}
              setShowProfileDropdown={setShowProfileDropdown}
            />`);

fs.writeFileSync(filePath, content);
