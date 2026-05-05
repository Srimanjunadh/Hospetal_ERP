
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');
const pos = parseInt(process.argv[2]);
const line = content.substring(0, pos).split('\n').length;
const around = content.substring(pos - 50, pos + 50);
console.log(`Line ${line}: ...${around}...`);
