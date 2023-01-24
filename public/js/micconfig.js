const chordsoal = document.querySelectorAll('.chordsoal')

const chords = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    microphone.connect(analyser);
  
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
    function getVolume() {
        analyser.getByteTimeDomainData(dataArray);
        let values = 0;
        let length = dataArray.length;
        for (let i = 0; i < length; i++) {
            values += (dataArray[i] - 128) * (dataArray[i] - 128);
        }
        let rms =  Math.sqrt(values / length);
        return rms;
    }
  
    function frequencyToMidi(frequency) {
        return 69 + 12 * Math.log2(frequency / 440);
    }

    function oktafke(midinum) {
        if(midinum <= 23) return 0;
        else if(midinum <= 35) return 1;
        else if(midinum <= 47) return 2;
        else if(midinum <= 59) return 3;
        else if(midinum <= 71) return 4;
        else if(midinum <= 83) return 5;
        else if(midinum <= 95) return 6;
        else if(midinum <= 107) return 7;
        else if(midinum <= 119) return 8;
    }

    const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
    let pitch = ml5.pitchDetection(model_url, audioContext , stream, getPitch);
    function getPitch() {
        pitch.getPitch(function(err, frequency) {
            if (frequency) {
                if(getVolume()>7){
                    let midiNum = frequencyToMidi(frequency).toFixed();
                    chordsoal[0].innerHTML = chords[midiNum % 12]
                    chordsoal[1].innerHTML = 'Oktaf ke ' + oktafke(midiNum)
                    console.log(frequency);
                }
            } else {
                chordsoal[0].innerHTML = '. . .'
            }
            getPitch();
        })
    }
});


