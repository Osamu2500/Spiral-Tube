const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    // Go to youtube to get the right origin context
    await page.goto('https://www.youtube.com', {waitUntil: 'networkidle2'});

    // Inject iframe with no-referrer
    const result = await page.evaluate(() => {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.setAttribute('referrerpolicy', 'no-referrer');
            iframe.allow = 'autoplay; encrypted-media';
            iframe.src = 'https://www.youtube-nocookie.com/embed/jnleJkZcnes?autoplay=1&mute=1';
            
            iframe.onload = () => {
                setTimeout(() => {
                    // Check if it's playing or showing error
                    resolve(true); // Just knowing it loaded without throwing sync errors
                }, 2000);
            };
            document.body.appendChild(iframe);
        });
    });
    
    console.log("Iframe loaded successfully in Puppeteer.");
    await browser.close();
})();
