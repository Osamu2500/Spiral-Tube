// Run this in the YouTube console to test if we can bypass the embed block
const videoId = "jnleJkZcnes"; // The Brooklyn 99 video from the screenshot

const iframe = document.createElement('iframe');
iframe.style.cssText = "position: fixed; top: 100px; left: 100px; width: 640px; height: 360px; z-index: 999999;";
iframe.allow = "autoplay; encrypted-media";

// Try 1: nocookie with no-referrer
// iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1`;
// iframe.setAttribute('referrerpolicy', 'no-referrer');

// Try 2: srcdoc with meta referrer
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta name="referrer" content="no-referrer">
    <style>body{margin:0;overflow:hidden;}</style>
</head>
<body>
    <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1" frameborder="0" allow="autoplay; encrypted-media"></iframe>
</body>
</html>
`;
iframe.srcdoc = html;

document.body.appendChild(iframe);
console.log("Iframe injected. Check if it plays the video.");
