const fs = require('fs');

const files = [
  'f:\\Youtube 2.0\\src\\content\\features\\player\\enhancements\\audio-enhancer.js',
  'f:\\Youtube 2.0\\src\\content\\features\\player\\enhancements\\intentional-delay.js',
  'f:\\Youtube 2.0\\src\\content\\features\\player\\enhancements\\pin-video.js',
  'f:\\Youtube 2.0\\src\\content\\features\\player\\enhancements\\time-display.js',
  'f:\\Youtube 2.0\\src\\content\\features\\player\\controls\\snapshot-button.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
}

console.log('Fixed escaped backticks and dollars in all files.');
