import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

console.log('📦 Starting Packaging Process...');

// 1. Build Frontend
console.log('🔨 Building Frontend...');
try {
    execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });
} catch (e) {
    console.error('❌ Build failed!');
    process.exit(1);
}

// 2. Prepare Release Directory
console.log('🧹 Preparing Release Directory...');
if (fs.existsSync(RELEASE_DIR)) {
    fs.rmSync(RELEASE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(RELEASE_DIR);
fs.mkdirSync(path.join(RELEASE_DIR, 'bin'));

// 3. Copy Assets
console.log('📂 Copying Files...');
// Copy dist -> public
fs.cpSync(DIST_DIR, path.join(RELEASE_DIR, 'public'), { recursive: true });

// Copy server
fs.copyFileSync(path.join(ROOT_DIR, 'prod-server.js'), path.join(RELEASE_DIR, 'server.js'));

// Create package.json for production
const pkg = {
    name: "eyeclinic-server",
    version: "1.0.0",
    type: "module",
    scripts: {
        "start": "node server.js"
    },
    dependencies: {
        "express": "^5.2.1",
        "cors": "^2.8.5"
    }
};
fs.writeFileSync(path.join(RELEASE_DIR, 'package.json'), JSON.stringify(pkg, null, 2));

// 4. Install Dependencies
console.log('📥 Installing Production Dependencies...');
execSync('npm install --production', { stdio: 'inherit', cwd: RELEASE_DIR });

// 5. Bundle Node.js
console.log('🤖 Bundling Node.js Runtime...');
const nodePath = process.execPath; // Current node executable
console.log(`   Detailed Node Path: ${nodePath}`);
fs.copyFileSync(nodePath, path.join(RELEASE_DIR, 'bin', 'node.exe'));

// 6. Create Startup Script
console.log('📜 Creating Startup Script...');
const batchScript = `@echo off
title Eye Clinic Management Server
color 0A
cls
echo ==================================================
echo      EYE CLINIC MANAGEMENT PRO - SERVER
echo ==================================================
echo.
echo [INFO] Starting Database and Web Server...
echo [INFO] Please do not close this window while using.
echo.

start http://localhost:3000

"%~dp0bin\\node.exe" "%~dp0server.js"

pause
`;
fs.writeFileSync(path.join(RELEASE_DIR, 'start.bat'), batchScript);

console.log('✅ Packaging Completed Successfully!');
console.log(`👉 Artifact is located at: ${RELEASE_DIR}`);
