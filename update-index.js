import fs from 'fs';

try {
    const manifestPath = './public/build/manifest.json';
    const indexPath = './public/index.html';

    if (fs.existsSync(manifestPath) && fs.existsSync(indexPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        let indexHtml = fs.readFileSync(indexPath, 'utf-8');

        const appEntry = manifest['resources/js/app.js'];

        if (appEntry) {
            const jsFile = `/build/${appEntry.file}`;
            const cssFile = appEntry.css ? `/build/${appEntry.css[0]}` : null;

            // Replace JS
            indexHtml = indexHtml.replace(
                /<script type="module" src="\/build\/assets\/app-[a-zA-Z0-9_-]+\.js"><\/script>/,
                `<script type="module" src="${jsFile}"></script>`
            );

            // Replace CSS
            if (cssFile) {
                indexHtml = indexHtml.replace(
                    /<link rel="stylesheet" href="\/build\/assets\/app-[a-zA-Z0-9_-]+\.css">/,
                    `<link rel="stylesheet" href="${cssFile}">`
                );
            }

            fs.writeFileSync(indexPath, indexHtml);
            console.log(`✅ Successfully updated index.html with:`);
            console.log(`   - JS: ${jsFile}`);
            if (cssFile) console.log(`   - CSS: ${cssFile}`);
        }
    }
} catch (error) {
    console.error('Failed to update index.html:', error);
}
