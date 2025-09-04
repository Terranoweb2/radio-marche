#!/usr/bin/env node

/**
 * Netlify Build Verification Script
 * Checks if all required files and configurations are present
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Netlify Build Check Starting...\n');

const requiredFiles = [
  'index.html',
  'src/main.jsx',
  'src/App.jsx',
  'src/components/RadioPlayer.jsx',
  'package.json',
  'vite.config.js',
  'netlify.toml',
  'public/_redirects',
  'public/_headers'
];

const requiredDirs = [
  'src',
  'src/components',
  'public'
];

let allGood = true;

// Check directories
console.log('📁 Checking directories...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING`);
    allGood = false;
  }
});

console.log('\n📄 Checking files...');
// Check files
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check package.json scripts
console.log('\n🔧 Checking package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['build', 'dev', 'preview'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script: ${script}`);
    } else {
      console.log(`❌ Script: ${script} - MISSING`);
      allGood = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  allGood = false;
}

// Check vite.config.js
console.log('\n⚙️ Checking Vite configuration...');
try {
  const viteConfig = fs.readFileSync('vite.config.js', 'utf8');
  if (viteConfig.includes('react()')) {
    console.log('✅ React plugin configured');
  } else {
    console.log('❌ React plugin missing');
    allGood = false;
  }
  
  if (viteConfig.includes('outDir')) {
    console.log('✅ Output directory configured');
  } else {
    console.log('⚠️ Output directory not explicitly set (using default)');
  }
} catch (error) {
  console.log('❌ Error reading vite.config.js');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All checks passed! Ready for Netlify deployment.');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  process.exit(1);
}
