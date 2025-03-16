#!/usr/bin/env node

/**
 * Version update script for mcp-sentry
 * 
 * This script updates the version in:
 * - src/version.ts
 * - package.json
 * 
 * Usage:
 *   node scripts/version.js <version-type>
 * 
 * Where <version-type> is one of:
 *   - patch (0.1.0 -> 0.1.1)
 *   - minor (0.1.0 -> 0.2.0)
 *   - major (0.1.0 -> 1.0.0)
 *   - <specific-version> (e.g., 0.2.0)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Get the version type from command line arguments
const versionType = process.argv[2];
if (!versionType) {
  console.error('Error: Version type is required');
  console.error('Usage: node scripts/version.js <patch|minor|major|specific-version>');
  process.exit(1);
}

// Read the current version from package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Calculate the new version
let newVersion;
if (versionType === 'patch' || versionType === 'minor' || versionType === 'major') {
  // Use npm version to calculate the new version number
  const output = execSync(`npm --no-git-tag-version version ${versionType} --json`, { cwd: rootDir });
  const result = JSON.parse(output.toString());
  newVersion = result.version;
  
  // Revert the change to package.json (we'll update it manually)
  execSync('git checkout -- package.json', { cwd: rootDir });
} else {
  // Use the provided specific version
  newVersion = versionType;
}

console.log(`Updating version: ${currentVersion} -> ${newVersion}`);

// Update src/version.ts
const versionTsPath = path.join(rootDir, 'src', 'version.ts');
let versionTsContent = fs.readFileSync(versionTsPath, 'utf8');
versionTsContent = versionTsContent.replace(/export const VERSION = ['"].*['"];/, `export const VERSION = '${newVersion}';`);
fs.writeFileSync(versionTsPath, versionTsContent);
console.log(`✅ Updated src/version.ts`);

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log(`✅ Updated package.json`);

// Build the project
console.log('Building project...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
console.log('✅ Build completed');

// Create a git commit and tag
console.log('Creating git commit and tag...');
execSync(`git add .`, { cwd: rootDir });
execSync(`git commit -m "chore: bump version to ${newVersion}"`, { cwd: rootDir });
execSync(`git tag v${newVersion}`, { cwd: rootDir });
console.log(`✅ Created git commit and tag v${newVersion}`);

console.log(`\nVersion ${newVersion} is ready!`);
console.log('To push changes and tag to remote repository:');
console.log('  git push && git push --tags');
