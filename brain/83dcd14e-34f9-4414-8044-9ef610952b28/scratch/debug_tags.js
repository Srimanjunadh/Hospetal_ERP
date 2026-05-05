
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');

const stack = [];
const tagRegex = /<(\/?[a-zA-Z][a-zA-Z0-9\.]*)/g;
let match;

while ((match = tagRegex.exec(content)) !== null) {
    const fullTag = match[1];
    console.log(`Found: ${fullTag} at pos ${match.index}`);
    if (fullTag.startsWith('/')) {
        const closingTag = fullTag.substring(1);
        const openingTag = stack.pop();
        if (openingTag !== closingTag) {
            console.log(`Mismatch: expected </${openingTag}> but found </${closingTag}>`);
        }
    } else {
        const rest = content.substring(match.index + match[0].length);
        const endOfTag = rest.indexOf('>');
        if (rest[endOfTag - 1] === '/' || ['input', 'img', 'br', 'hr'].includes(fullTag.toLowerCase())) {
            // console.log(`Self-closing: ${fullTag}`);
        } else {
            stack.push(fullTag);
        }
    }
}
console.log(`Final stack: ${stack.join(', ')}`);
