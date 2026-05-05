
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');

let openBraces = 0;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let initial = openBraces;
    for (let char of line) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
    }
    if (openBraces !== initial) {
        console.log(`Line ${i + 1}: ${initial} -> ${openBraces}`);
    }
}
console.log(`Final count: ${openBraces}`);
