const fs = require('fs');
const path = require('path');

// Auto-detect mobile directory
let mobileDir = __dirname;
while (mobileDir !== path.dirname(mobileDir)) {
  if (fs.existsSync(path.join(mobileDir, 'package.json')) && fs.existsSync(path.join(mobileDir, 'app.json'))) {
    break;
  }
  mobileDir = path.dirname(mobileDir);
}

const targetDirs = [
  path.join(mobileDir, 'dist'),
  path.resolve(process.cwd(), 'dist'),
  path.resolve(process.cwd(), 'mobile/dist'),
  path.resolve(process.cwd(), '../dist')
];

const filesToCopy = [
  { src: path.join(mobileDir, 'manifest.json'), dest: 'manifest.json' },
  { src: path.join(mobileDir, 'sw.js'), dest: 'sw.js' },
  { src: path.join(mobileDir, 'assets/icon-192.png'), dest: 'icon-192.png' },
  { src: path.join(mobileDir, 'assets/icon-512.png'), dest: 'icon-512.png' },
  { src: path.join(mobileDir, 'assets/favicon.png'), dest: 'favicon.png' },
  { src: path.join(mobileDir, 'assets/icon.png'), dest: 'icon.png' }
];

targetDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;

  // Copy PWA assets
  filesToCopy.forEach(({ src, dest }) => {
    try {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(dir, dest));
      }
    } catch (e) {
      console.warn(`Could not copy ${src} to ${dest}:`, e.message);
    }
  });

  // Enhance index.html
  const htmlPath = path.join(dir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    try {
      let html = fs.readFileSync(htmlPath, 'utf-8');
      if (!html.includes('manifest.json')) {
        const pwaTags = `
    <!-- PWA & Mobile Installability -->
    <meta name="theme-color" content="#1E3A8A" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="TurnWise" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').catch(function() {});
        });
      }
    </script>`;
        html = html.replace('</head>', `${pwaTags}\n</head>`);
      }
      html = html.replace('<title>Turn Wise</title>', '<title>TurnWise</title>');
      fs.writeFileSync(htmlPath, html, 'utf-8');
    } catch (e) {
      console.warn('Could not update index.html:', e.message);
    }
  }
});

console.log('✅ PWA manifest, service worker, and icons successfully configured!');

