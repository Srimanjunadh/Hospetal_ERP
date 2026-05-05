
const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ASUS\\OneDrive\\Desktop\\ERP\\frontend\\src\\app\\doctor\\page.tsx', 'utf8');

const tags = [];
const tagRegex = /<(\/?[a-zA-Z][a-zA-Z0-9]*)/g;
let match;
while ((match = tagRegex.exec(content)) !== null) {
    const tagName = match[1];
    if (tagName.startsWith('/')) {
        const opening = tags.pop();
        if (opening !== tagName.substring(1)) {
            console.log(`Mismatch: found </${tagName.substring(1)}> but expected </${opening}>`);
        }
    } else {
        // Ignore self-closing tags (simplified)
        const rest = content.substring(match.index + match[0].length);
        const endOfTag = rest.indexOf('>');
        if (rest[endOfTag - 1] !== '/') {
            tags.push(tagName);
        }
    }
}

console.log(`Remaining tags: ${tags.join(', ')}`);
