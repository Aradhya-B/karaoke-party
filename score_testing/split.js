const fs = require('fs');
const lrc = fs.readFileSync('blinding_lights.lrc').toString().split("\n");

console.log(lrc);
for (i in lrc) {
  console.log(lrc[i]);
}
lrc.pop();

let MediaSplit = require('media-split');

let split = new MediaSplit({ input: 'origClips/blinding_lights_aca.mp3', sections: lrc, format: 'wav'});

split.parse().then((sections) => {
  for (let section of sections) {
    console.log(section.name);      // filename
    console.log(section.start);     // section start
    console.log(section.end);       // section end
    console.log(section.trackName); // track name
  }
});
