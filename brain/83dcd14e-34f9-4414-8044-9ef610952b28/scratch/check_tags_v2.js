
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');

const stack = [];
const tagRegex = /<(\/?[a-zA-Z][a-zA-Z0-9\.]*)/g;
let match;

while ((match = tagRegex.exec(content)) !== null) {
    const fullTag = match[1];
    if (fullTag.startsWith('/')) {
        const closingTag = fullTag.substring(1);
        const openingTag = stack.pop();
        if (openingTag !== closingTag) {
            console.log(`Mismatch at pos ${match.index}: expected </${openingTag}> but found </${closingTag}>`);
        }
    } else {
        // Check if self-closing
        const rest = content.substring(match.index + match[0].length);
        const endOfTag = rest.indexOf('>');
        if (rest[endOfTag - 1] === '/' || ['input', 'img', 'br', 'hr'].includes(fullTag.toLowerCase())) {
            // Self-closing
        } else {
            stack.push(fullTag);
        }
    }
}

console.log(`Remaining stack: ${stack.join(', ')}`);
