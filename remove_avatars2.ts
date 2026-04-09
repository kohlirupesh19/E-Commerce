import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const avatarRegex = /\s*<div[^>]*onClick=\{\(\) => setView\('profile'\)\}[^>]*>[\s\S]*?<img alt="User Profile"[^>]*>[\s\S]*?<\/div>/g;
content = content.replace(avatarRegex, '');

fs.writeFileSync('src/App.tsx', content);
console.log('Avatars removed');
