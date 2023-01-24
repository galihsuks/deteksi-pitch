let audioContext;
let mic;
let pitch;
const jarak = 3;
let note;
let merekam = false;
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let audios = []
function preload() {
    for(let i=0; i < 12; i++){
        audios[i] = loadSound(`https://cdn.glitch.global/f9f20392-9f68-488a-b49d-d91c589220b8/${chords[i]}5.mp3`)
    }
}
function setup() {
    noCanvas();
    audioContext = getAudioContext();
    mic = new p5.AudioIn();
    mic.start(startPitch);
    userStartAudio();
}
function startPitch() {
    pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}
function modelLoaded() {
    getPitch();
}
function getPitch() {
    pitch.getPitch(function(err, frequency) {
        if (frequency) {
            if(mic.getLevel()>0.06){
                let midiNum = freqToMidi(frequency);
                note = chords[midiNum % 12];
                if(note == chordsacak[nomor] && merekam){
                    gantiNomor()
                }
            }
        } else {
            note = '. . .'
        }
        getPitch();
    })
}