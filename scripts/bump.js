import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

const newVersion = process.argv[2];
if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error("❌ Please provide a valid version number (e.g. 1.0.3)");
  console.error("👉 Usage: npm run bump 1.0.3");
  process.exit(1);
}

// 1. package.json
const pkgPath = join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✅ Updated package.json to ${newVersion}`);

// 2. src/version.js
const versionJsPath = join(root, 'src', 'version.js');
let versionJs = fs.readFileSync(versionJsPath, 'utf-8');
versionJs = versionJs.replace(/APP_VERSION = 'v[^']+';/, `APP_VERSION = 'v${newVersion}';`);
versionJs = versionJs.replace(/APP_VERSION_NUMBER = '[^']+';/, `APP_VERSION_NUMBER = '${newVersion}';`);
fs.writeFileSync(versionJsPath, versionJs);
console.log(`✅ Updated src/version.js to ${newVersion}`);

// 3. android/app/build.gradle
const gradlePath = join(root, 'android', 'app', 'build.gradle');
if (fs.existsSync(gradlePath)) {
  let gradle = fs.readFileSync(gradlePath, 'utf-8');
  
  let newCode = 1;
  gradle = gradle.replace(/versionCode (\d+)/, (match, code) => {
    newCode = parseInt(code, 10) + 1;
    return `versionCode ${newCode}`;
  });
  
  gradle = gradle.replace(/versionName "[^"]+"/, `versionName "${newVersion}"`);
  fs.writeFileSync(gradlePath, gradle);
  console.log(`✅ Updated build.gradle to versionName "${newVersion}" and incremented versionCode to ${newCode}`);
}

console.log(`\n🎉 Successfully bumped everything to version ${newVersion}!`);
console.log(`👉 Next steps:`);
console.log(`1. Update CHANGELOG.md (if needed)`);
console.log(`2. git add . && git commit -m "Bump version to ${newVersion}"`);
console.log(`3. git tag v${newVersion} && git push --tags`);
