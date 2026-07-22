import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:\\Users\\chait\\.gemini\\antigravity\\brain\\f73fdf03-6a13-4fb0-a555-3d02b1fa51b7';
const DEST_DIR = 'd:\\Ck\\Programming\\Cubic-Technologies-Showcase\\client\\public\\images';

const mapping = {
  'web_development_hero_1772444020033.png': 'web_development.png',
  'ui_ux_design_hero_1772444034290.png': 'ui_ux_design.png',
  'ai_solutions_hero_1772444049313.png': 'ai_solutions.png',
  'digital_marketing_hero_1772444063530.png': 'digital_marketing.png',
  'web_applications_hero_1772444079867.png': 'web_applications.png',
  'maintenance_support_hero_1772444097460.png': 'maintenance.png',
  'team_culture_lifestyle_1772444113953.png': 'team.png'
};

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  console.log('Created destination directory');
}

for (const [srcName, destName] of Object.entries(mapping)) {
  const srcPath = path.join(SRC_DIR, srcName);
  const destPath = path.join(DEST_DIR, destName);
  
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcName} to ${destName}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  } catch (err) {
    console.error(`Error copying ${srcName}:`, err);
  }
}

// Verification
const files = fs.readdirSync(DEST_DIR);
console.log('Final contents of destination directory:', files);
