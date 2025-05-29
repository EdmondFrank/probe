const { platform, arch } = process;
const fs = require('fs');
const path = require('path');

function getPackageName() {
  if (platform === 'darwin' && arch === 'x64') return '@edmondfrank/probe-darwin-x64';
  if (platform === 'darwin' && arch === 'arm64') return '@edmondfrank/probe-darwin-arm64';
  if (platform === 'linux' && arch === 'x64') return '@edmondfrank/probe-linux-x64';
  if (platform === 'linux' && arch === 'arm64') return '@edmondfrank/probe-linux-arm64';
  if (platform === 'win32' && arch === 'x64') return '@edmondfrank/probe-win32-x64';
  throw new Error(`Unsupported platform or architecture: ${platform} ${arch}`);
}

function main() {
  const pkg = getPackageName();
  const binDir = path.join(__dirname, 'bin');
  if (!fs.existsSync(binDir)) fs.mkdirSync(binDir);

  let binPath;
  try {
    // Each arch package should export the binary path in its package.json "bin" field
    binPath = require.resolve(`${pkg}/probe${platform === 'win32' ? '.exe' : ''}`);
  } catch (e) {
    console.error(`Could not resolve binary for ${pkg}:`, e);
    process.exit(1);
  }

  const dest = path.join(binDir, `probe${platform === 'win32' ? '.exe' : ''}`);
  fs.copyFileSync(binPath, dest);
  fs.chmodSync(dest, 0o755);
}

main();
