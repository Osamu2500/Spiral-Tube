const fs = require('fs');
let css = fs.readFileSync('src/popup/styles/core/popup.css', 'utf8');

// The file has a duplicate from '/* ─── Reset ─── */' at line 227 down to line 413.
// We can just find the second occurrence of '/* ─── Reset ─── */' and remove everything between the first one and the second one!
// Let's check where they are.
const lines = css.split('\n');
let firstReset = -1;
let secondReset = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('/* ─── Reset ─── */')) {
        if (firstReset === -1) {
            firstReset = i;
        } else if (secondReset === -1) {
            secondReset = i;
        }
    }
}

if (firstReset !== -1 && secondReset !== -1) {
    console.log('Found first reset at ' + firstReset + ' and second reset at ' + secondReset);
    // Remove the lines between firstReset and secondReset (excluding secondReset so it becomes the new firstReset)
    lines.splice(firstReset, secondReset - firstReset);
} else {
    console.log('Could not find two Reset blocks');
}

// Now let's fix the malformed html.full-page body and remove the animation.
// Around line 445 (now shifted), we have:
// html.full-page body {
//   width: calc(100vw / var(--popup-zoom)) !important;
//   height: calc(100vh / var(--popup-zoom)) !important;
// }
//   font-size: calc(14px * var(--ui-font-scale, 1));
//   overflow: hidden;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   animation: popup-enter 0.28s var(--ease-snap) both;
//   transition: width 0.15s ease-out, height 0.15s ease-out;
// }
//
// These orphan properties belong to the ody { block that was split!
// Let's join them back into ody and remove the nimation: line.
// First, find html.full-page body {
let htmlFullPageBodyIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('html.full-page body {')) {
        htmlFullPageBodyIndex = i;
        break;
    }
}

if (htmlFullPageBodyIndex !== -1) {
    // Look backwards for ody { to append the orphaned properties.
    let bodyIndex = -1;
    for (let i = htmlFullPageBodyIndex; i >= 0; i--) {
        if (lines[i].trim() === 'body {') {
            bodyIndex = i;
            break;
        }
    }
    
    // Find where the orphaned properties end (the '}' after transition)
    let orphanEndIndex = -1;
    for (let i = htmlFullPageBodyIndex + 4; i < lines.length; i++) {
        if (lines[i].trim() === '}') {
            orphanEndIndex = i;
            break;
        }
    }
    
    if (bodyIndex !== -1 && orphanEndIndex !== -1) {
        console.log('Fixing orphaned body properties from ' + (htmlFullPageBodyIndex + 4) + ' to ' + orphanEndIndex);
        
        // Extract orphaned properties (excluding the closing '}')
        let orphanedProps = [];
        for (let i = htmlFullPageBodyIndex + 4; i < orphanEndIndex; i++) {
            // Remove the popup-enter animation
            if (!lines[i].includes('animation: popup-enter')) {
                orphanedProps.push(lines[i]);
            }
        }
        
        // Remove the orphaned properties and their closing '}'
        lines.splice(htmlFullPageBodyIndex + 4, orphanEndIndex - (htmlFullPageBodyIndex + 4) + 1);
        
        // Now insert them into the body block (just before html.full-page body, which is right after body's closing brace... wait, no.)
        // Let's find body's closing brace.
        let bodyCloseIndex = -1;
        for (let i = bodyIndex; i < htmlFullPageBodyIndex; i++) {
            if (lines[i].trim() === '}') {
                bodyCloseIndex = i;
                break;
            }
        }
        
        if (bodyCloseIndex !== -1) {
            lines.splice(bodyCloseIndex, 0, ...orphanedProps);
            console.log('Successfully merged orphaned properties back into body');
        } else {
            console.log('Could not find body closing brace');
        }
    } else {
        console.log('Could not find body index or orphan end index');
    }
} else {
    console.log('Could not find html.full-page body');
}

// Remove popup-enter from anywhere else just to be sure.
// Also remove the @keyframes popup-enter
let keyframesStart = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('@keyframes popup-enter')) {
        keyframesStart = i;
        break;
    }
}
if (keyframesStart !== -1) {
    let keyframesEnd = -1;
    for (let i = keyframesStart; i < lines.length; i++) {
        if (lines[i].trim() === '}') {
            keyframesEnd = i;
            break;
        }
    }
    if (keyframesEnd !== -1) {
        lines.splice(keyframesStart, keyframesEnd - keyframesStart + 1);
        console.log('Removed @keyframes popup-enter');
    }
}

fs.writeFileSync('src/popup/styles/core/popup.css', lines.join('\n'));
console.log('Done.');
