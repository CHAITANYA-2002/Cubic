import fs from 'fs';
import path from 'path';

console.log('Current Working Directory:', process.cwd());
const testPath = path.join(process.cwd(), 'debug_test.txt');
try {
  fs.writeFileSync(testPath, 'test content');
  console.log('Successfully wrote to:', testPath);
} catch (err) {
  console.error('Failed to write to:', testPath, err);
}
