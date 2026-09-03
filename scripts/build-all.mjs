import { execSync } from 'child_process';

console.log('--- Starting Build Process ---');

function runCommand(command) {
  console.log(`\n> Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', shell: true });
  } catch (error) {
    console.error(`\n[!] Error executing command: ${command}`);
    process.exit(1);
  }
}

// 1. Build CSS Themes (Disabled: script missing)
// runCommand('node scripts/build-themes.mjs');

// 2. Vite Build (Main content script & CSS)
runCommand('npx vite build');

// 3. Vite Build (Service Worker)
runCommand('npx vite build --config vite.config.sw.js');

// 4. Vite Build (External scripts)
runCommand('npx vite build --config vite.config.external.js');

console.log('\n--- Build Process Completed Successfully ---');
