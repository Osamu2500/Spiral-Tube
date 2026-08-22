const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const TARGET_DIRS = [
    'src/content/design-system/themes',
    'src/content/design-system/ui-styles',
    'src/content/design-system/card-styles'
];

let leaks = [];

const plugin = postcss.plugin('verifier', () => {
    return (root, result) => {
        root.walkRules(rule => {
            // Ignore keyframes inner rules (e.g. 0%, 100%)
            if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name === 'keyframes') return;

            rule.selectors.forEach(sel => {
                let trimmed = sel.trim();
                
                // Allow :root for variables, but warn if it has actual properties
                if (trimmed === ':root') return;
                
                // Allow @font-face and @keyframes which are technically global but meant to be
                if (trimmed.startsWith('@')) return;
                
                // Check if it starts with a safe scope
                if (!trimmed.startsWith('html[data-ypp-')) {
                    leaks.push({
                        file: result.opts.from,
                        selector: trimmed
                    });
                }
            });
        });
    };
});

async function verifyFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    await postcss([plugin()]).process(content, { from: filePath });
}

async function run() {
    for (const dir of TARGET_DIRS) {
        const fullDir = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullDir)) continue;
        
        const files = [];
        const walk = (d) => {
            fs.readdirSync(d).forEach(file => {
                const fullPath = path.join(d, file);
                if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
                else if (fullPath.endsWith('.css')) files.push(fullPath);
            });
        };
        walk(fullDir);

        for (const file of files) {
            try {
                await verifyFile(file);
            } catch (e) {
                console.error(`Error parsing ${file}: ${e.message}`);
            }
        }
    }
    
    if (leaks.length > 0) {
        // Group by file
        const grouped = {};
        leaks.forEach(l => {
            if (!grouped[l.file]) grouped[l.file] = [];
            if (!grouped[l.file].includes(l.selector)) grouped[l.file].push(l.selector);
        });
        
        const reportPath = path.join(process.cwd(), 'css_leaks_report.txt');
        let reportStr = `Found ${leaks.length} leaking selectors:\n\n`;
        for (const [file, selectors] of Object.entries(grouped)) {
            reportStr += `FILE: ${file}\n`;
            selectors.forEach(s => reportStr += `  - ${s}\n`);
            reportStr += `\n`;
        }
        fs.writeFileSync(reportPath, reportStr);
        console.log(`Found leaks! Wrote to css_leaks_report.txt`);
    } else {
        console.log(`ZERO leaks found! All CSS rules are perfectly scoped.`);
        fs.writeFileSync(path.join(process.cwd(), 'css_leaks_report.txt'), 'ZERO leaks found!');
    }
}

run();
