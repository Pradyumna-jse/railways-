const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const mobileDir = path.join(rootDir, 'mobile');

const targetDirs = [
  path.join(rootDir, 'dist'),
  path.join(mobileDir, 'dist')
];

const filesToCopy = [
  { src: path.join(mobileDir, 'manifest.json'), dest: 'manifest.json' },
  { src: path.join(mobileDir, 'sw.js'), dest: 'sw.js' },
  { src: path.join(mobileDir, 'assets/icon-192.png'), dest: 'icon-192.png' },
  { src: path.join(mobileDir, 'assets/icon-512.png'), dest: 'icon-512.png' },
  { src: path.join(mobileDir, 'assets/favicon.png'), dest: 'favicon.png' }
];

targetDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;

  // Copy PWA assets
  filesToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(dir, dest));
    }
  });

  // Enhance index.html
  const htmlPath = path.join(dir, 'index.html');
  if (fs.existsSync(htmlPath)) {
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
      html = html.replace('<title>Turn Wise</title>', '<title>TurnWise</title>');
      fs.writeFileSync(htmlPath, html, 'utf-8');
    }
  }
});

console.log('✅ PWA manifest, service worker, and icons configured in dist!');

