
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');

const braces = [];
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') braces.push({ type: '{', pos: i });
    if (content[i] === '}') braces.push({ type: '}', pos: i });
}

console.log(`Found ${braces.length} braces.`);
let count = 0;
for (let b of braces) {
    if (b.type === '{') count++;
    else count--;
    if (count < 0) {
        console.log(`Imbalance at pos ${b.pos}`);
        break;
    }
}
console.log(`Final count: ${count}`);
