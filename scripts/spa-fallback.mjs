// GitHub Pages has no SPA rewrites. Copying index.html to 404.html lets deep links
// like /projects/pa-mac load the app, which then routes client-side.
import { copyFileSync, writeFileSync } from 'node:fs';
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');
console.log('✓ 404.html + .nojekyll written');
