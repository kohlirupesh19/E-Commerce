const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Regex to match the 'My Orders' link
const myOrdersRegex = /\s*<a[^>]*onClick=\{\(\) => setView\('my-orders'\)\}[^>]*>[\s\S]*?<\/a>/g;
content = content.replace(myOrdersRegex, '');

// Regex to match the 'Profile' link
const profileRegex = /\s*<a[^>]*onClick=\{\(\) => setView\('profile'\)\}[^>]*>[\s\S]*?<\/a>/g;
content = content.replace(profileRegex, '');

// Regex to match the 'Wishlist' link
const wishlistRegex = /\s*<a[^>]*onClick=\{\(\) => setView\('wishlist'\)\}[^>]*>[\s\S]*?<\/a>/g;
content = content.replace(wishlistRegex, '');

// Also remove button versions
const buttonMyOrdersRegex = /\s*<button[^>]*onClick=\{\(\) => setView\('my-orders'\)\}[^>]*>[\s\S]*?<\/button>/g;
content = content.replace(buttonMyOrdersRegex, '');

const buttonProfileRegex = /\s*<button[^>]*onClick=\{\(\) => setView\('profile'\)\}[^>]*>[\s\S]*?<\/button>/g;
content = content.replace(buttonProfileRegex, '');

const buttonWishlistRegex = /\s*<button[^>]*onClick=\{\(\) => setView\('wishlist'\)\}[^>]*>[\s\S]*?<\/button>/g;
content = content.replace(buttonWishlistRegex, '');

fs.writeFileSync('src/App.tsx', content);
console.log('Links removed');
