import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'node_modules/@eslint/eslintrc/lib/config-array/override-tester.js');

if (fs.existsSync(filePath)) {
  console.log('Patching @eslint/eslintrc to support minimatch v10...');
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the import and destructuring
  const original = 'import minimatch from "minimatch";\n\nconst { Minimatch } = minimatch;';
  const replacement = 'import { Minimatch } from "minimatch";';

  if (content.includes(original)) {
    content = content.replace(original, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully patched @eslint/eslintrc');
  } else if (content.includes('import { Minimatch } from "minimatch";')) {
    console.log('Already patched.');
  } else {
    // Try simpler replacement if whitespace differs
    const simplerOriginal = /import minimatch from "minimatch";\s+const \{ Minimatch \} = minimatch;/;
    if (simplerOriginal.test(content)) {
        content = content.replace(simplerOriginal, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Successfully patched @eslint/eslintrc (regex)');
    } else {
        console.warn('Could not find the import statement to patch in @eslint/eslintrc');
        // console.log('Content snippet:', content.substring(0, 500));
    }
  }
} else {
  console.log('File not found:', filePath);
}
