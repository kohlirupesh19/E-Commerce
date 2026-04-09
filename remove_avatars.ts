import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the profile avatars
const avatarRegex = /\s*<div className="w-8 h-8 rounded-full overflow-hidden border border-primary\/20[^>]*>[\s\S]*?<img alt="User Profile Avatar"[^>]*>[\s\S]*?<\/div>/g;
content = content.replace(avatarRegex, '');

const avatarRegex2 = /\s*<div className="h-8 w-8 rounded-full overflow-hidden border border-primary\/20[^>]*>[\s\S]*?<img alt="User Profile Avatar"[^>]*>[\s\S]*?<\/div>/g;
content = content.replace(avatarRegex2, '');

const avatarRegex3 = /\s*<div className="w-8 h-8 rounded-full overflow-hidden border border-primary\/20 cursor-pointer"[^>]*>[\s\S]*?<img alt="User Profile"[^>]*>[\s\S]*?<\/div>/g;
content = content.replace(avatarRegex3, '');

const avatarRegex4 = /\s*<div className="w-10 h-10 rounded-full overflow-hidden border border-primary\/20 cursor-pointer"[^>]*>[\s\S]*?<img alt="Admin Profile"[^>]*>[\s\S]*?<\/div>/g;
content = content.replace(avatarRegex4, '');

fs.writeFileSync('src/App.tsx', content);
console.log('Avatars removed');
