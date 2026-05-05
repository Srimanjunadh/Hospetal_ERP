
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');

const regex = /[^{]}[\s]*[^{]/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const line = content.substring(0, match.index).split('\n').length;
    console.log(`Found possible literal brace at line ${line}: "${match[0]}"`);
}
