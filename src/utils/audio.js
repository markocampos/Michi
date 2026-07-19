let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getAudioContext() {
  return initAudio();
}

export function playBowlSound() {
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    // Main fundamental frequency
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 220; // A3

    // First overtone
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 220 * 2.75; // Approx E5

    // Second overtone
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 220 * 5.4;

    const gainNode1 = ctx.createGain();
    const gainNode2 = ctx.createGain();
    const gainNode3 = ctx.createGain();
    const masterGain = ctx.createGain();

    osc1.connect(gainNode1);
    osc2.connect(gainNode2);
    osc3.connect(gainNode3);
    
    gainNode1.connect(masterGain);
    gainNode2.connect(masterGain);
    gainNode3.connect(masterGain);
    
    masterGain.connect(ctx.destination);

    // Envelopes
    // Strike (fast attack)
    gainNode1.gain.setValueAtTime(0, t);
    gainNode1.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, t + 6);
    
    gainNode2.gain.setValueAtTime(0, t);
    gainNode2.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, t + 3);

    gainNode3.gain.setValueAtTime(0, t);
    gainNode3.gain.linearRampToValueAtTime(0.1, t + 0.01);
    gainNode3.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    // Master fade out
    masterGain.gain.setValueAtTime(1, t);
    masterGain.gain.setValueAtTime(1, t + 4);
    masterGain.gain.linearRampToValueAtTime(0.001, t + 6);

    // Add slight frequency modulation for the "wobble" (beating) of a singing bowl
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 4; // 4Hz wobble
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 2; // +/- 2Hz
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    
    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    lfo.start(t);
    
    osc1.stop(t + 6.1);
    osc2.stop(t + 6.1);
    osc3.stop(t + 6.1);
    lfo.stop(t + 6.1);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

let ambientSource = null;
let ambientGain = null;

export function startForestAmbient() {
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    // Create pink noise buffer
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise to loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for gain
    }

    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;
    
    // Lowpass filter to make it sound like wind/distant ambient
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Deep wind sound
    
    // Add LFO to filter frequency to simulate wind gusts
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow 10s cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300; // Swells from 100Hz to 700Hz
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0, t);
    
    ambientSource.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    
    lfo.start(t);
    ambientSource.start(t);
    
    // Gentle fade in (3 seconds)
    ambientGain.gain.linearRampToValueAtTime(0.3, t + 3);
  } catch (e) {
    console.error("Ambient playback failed", e);
  }
}

let lastOut = 0; // State for pink noise generator

export function stopForestAmbient() {
  if (ambientGain && ambientSource) {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;
      // Gentle fade out
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, t);
      ambientGain.gain.linearRampToValueAtTime(0, t + 2);
      setTimeout(() => {
        ambientSource.stop();
        ambientSource = null;
        ambientGain = null;
      }, 2100);
    } catch (e) {
      console.error(e);
    }
  }
}
