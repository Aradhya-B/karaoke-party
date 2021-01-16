const Crunker = require('crunker');
const audio = new Crunker();

audio
  .fetchAudio('/eddy_singing.mp3', '/insClips/"I said, ooh, I\'m blinded by the lights [0100.82].mp3"')
  .then(buffers => {
    return audio.mergeAudio(buffers);
  })
  .then(merged => {
    return audio.export(merged, "merged.mp3");
  })
  .catch(error => {
    console.log(error);
  })
