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

// Master volumes
export const audioVolumes = {
  wind: 1.0,
  rain: 1.0,
  bowl: 1.0,
  voice: 1.0
};

export function setVolume(type, val) {
  audioVolumes[type] = val;
  // Apply immediately if playing
  if (type === 'wind' && ambientGain) {
    ambientGain.gain.setTargetAtTime(currentWindTarget * val, audioCtx.currentTime, 0.1);
  }
  if (type === 'rain' && rainGain) {
    rainGain.gain.setTargetAtTime(currentRainTarget * val, audioCtx.currentTime, 0.1);
  }
}

export function playBowlSound() {
  if (audioVolumes.bowl <= 0) return;
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    const osc1 = ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 220;
    const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 220 * 2.75;
    const osc3 = ctx.createOscillator(); osc3.type = 'sine'; osc3.frequency.value = 220 * 5.4;

    const gainNode1 = ctx.createGain();
    const gainNode2 = ctx.createGain();
    const gainNode3 = ctx.createGain();
    const masterGain = ctx.createGain();

    osc1.connect(gainNode1); osc2.connect(gainNode2); osc3.connect(gainNode3);
    gainNode1.connect(masterGain); gainNode2.connect(masterGain); gainNode3.connect(masterGain);
    masterGain.connect(ctx.destination);

    gainNode1.gain.setValueAtTime(0, t);
    gainNode1.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, t + 6);
    
    gainNode2.gain.setValueAtTime(0, t);
    gainNode2.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, t + 3);

    gainNode3.gain.setValueAtTime(0, t);
    gainNode3.gain.linearRampToValueAtTime(0.1, t + 0.01);
    gainNode3.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

    // Apply master bowl volume
    masterGain.gain.setValueAtTime(audioVolumes.bowl, t);
    masterGain.gain.setValueAtTime(audioVolumes.bowl, t + 4);
    masterGain.gain.linearRampToValueAtTime(0.001, t + 6);

    const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 4;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 2;
    lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);
    
    osc1.start(t); osc2.start(t); osc3.start(t); lfo.start(t);
    osc1.stop(t + 6.1); osc2.stop(t + 6.1); osc3.stop(t + 6.1); lfo.stop(t + 6.1);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

// -- VOICE GUIDE (pre-recorded MP3s — fully offline, zero robot) --

// Available voice packs — each is a folder under /audio/
const VOICE_PACKS = ['neutral', 'warm', 'serene', 'deep'];
const DEFAULT_PACK = 'neutral';

function packPath(pack, file) {
  const p = VOICE_PACKS.includes(pack) ? pack : DEFAULT_PACK;
  return `/audio/${p}/${file}.mp3`;
}

// In-memory cache so each file is fetched + decoded only once
const audioBufferCache = new Map();

async function loadAudioBuffer(url) {
  if (audioBufferCache.has(url)) return audioBufferCache.get(url);
  const ctx = getAudioContext();
  const res = await fetch(url);
  const arrayBuf = await res.arrayBuffer();
  const audioBuf = await ctx.decodeAudioData(arrayBuf);
  audioBufferCache.set(url, audioBuf);
  return audioBuf;
}

let currentVoiceSource = null;

function playBuffer(buf) {
  const ctx = getAudioContext();
  if (currentVoiceSource) {
    try { currentVoiceSource.stop(); } catch (_) {}
    currentVoiceSource = null;
  }
  const source = ctx.createBufferSource();
  source.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = audioVolumes.voice;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
  currentVoiceSource = source;
}

export async function playVoice(type, pack = DEFAULT_PACK, preloadOnly = false) {
  if (audioVolumes.voice <= 0 && !preloadOnly) return;
  try {
    const url = packPath(pack, type);
    const buf = await loadAudioBuffer(url);
    if (!preloadOnly) playBuffer(buf);
  } catch (e) {
    console.error('Failed to play voice', e);
  }
}

// Preload cues for the selected pack so playback is instant during the session
export async function preloadVoices(pack = DEFAULT_PACK) {
  initAudio();
  await Promise.all(['inhale', 'hold', 'exhale'].map(t => loadAudioBuffer(packPath(pack, t))));
}

// Play the intro for the selected pack and resolve when it finishes
export function playIntro(pack = DEFAULT_PACK) {
  return new Promise(async (resolve) => {
    if (audioVolumes.voice <= 0) { resolve(); return; }
    try {
      const buf = await loadAudioBuffer(packPath(pack, 'intro'));
      const ctx = getAudioContext();
      const source = ctx.createBufferSource();
      source.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.value = audioVolumes.voice > 0 ? audioVolumes.voice : 0.85;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.onended = () => resolve();
      source.start(0);
      currentVoiceSource = source;
    } catch (e) {
      console.error('Failed to play intro', e);
      resolve();
    }
  });
}

export function stopVoice() {
  if (currentVoiceSource) {
    try { currentVoiceSource.stop(); } catch (_) {}
    currentVoiceSource = null;
  }
}

// -- AMBIENT GENERATORS --
let ambientSource = null;
let ambientGain = null;
let windFilter = null;
let rainSource = null;
let rainGain = null;
let rainFilter = null;

let lastOutWind = 0;
let lastOutRain = 0;

let currentWindTarget = 0;
let currentRainTarget = 0;

export function startForestAmbient() { startAmbientLayer(true, false); }
export function stopForestAmbient() { stopAmbientLayer(); }
export function startMeditationAmbient() { startAmbientLayer(true, true); }
export function stopMeditationAmbient() { stopAmbientLayer(); }

export function updateMeditationAmbient(progress) {
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    if (ambientGain) {
      currentWindTarget = 0.3 - (progress * 0.1);
      ambientGain.gain.linearRampToValueAtTime(currentWindTarget * audioVolumes.wind, t + 1);
    }
    if (windFilter) {
      windFilter.frequency.linearRampToValueAtTime(400 - (progress * 100), t + 1);
    }
    if (rainGain) {
      currentRainTarget = progress * 0.5;
      rainGain.gain.linearRampToValueAtTime(currentRainTarget * audioVolumes.rain, t + 1);
    }
  } catch (e) {}
}

function startAmbientLayer(enableWind, enableRain) {
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    if (enableWind) {
      const windBufferSize = ctx.sampleRate * 2;
      const windBuffer = ctx.createBuffer(1, windBufferSize, ctx.sampleRate);
      const windOutput = windBuffer.getChannelData(0);
      for (let i = 0; i < windBufferSize; i++) {
        let white = Math.random() * 2 - 1;
        windOutput[i] = (lastOutWind + (0.02 * white)) / 1.02;
        lastOutWind = windOutput[i];
        windOutput[i] *= 3.5;
      }
      ambientSource = ctx.createBufferSource();
      ambientSource.buffer = windBuffer;
      ambientSource.loop = true;
      windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass'; windFilter.frequency.value = 400;
      
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.1;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 300;
      lfo.connect(lfoGain); lfoGain.connect(windFilter.frequency);
      
      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0, t);
      
      ambientSource.connect(windFilter); windFilter.connect(ambientGain); ambientGain.connect(ctx.destination);
      lfo.start(t); ambientSource.start(t);
      
      currentWindTarget = 0.3;
      ambientGain.gain.linearRampToValueAtTime(currentWindTarget * audioVolumes.wind, t + 3);
    }

    if (enableRain) {
      const rainBufferSize = ctx.sampleRate * 2;
      const rainBuffer = ctx.createBuffer(1, rainBufferSize, ctx.sampleRate);
      const rainOutput = rainBuffer.getChannelData(0);
      for (let i = 0; i < rainBufferSize; i++) {
        let white = Math.random() * 2 - 1;
        rainOutput[i] = (lastOutRain + (0.05 * white)) / 1.05;
        lastOutRain = rainOutput[i];
        rainOutput[i] *= 2.0; 
      }
      rainSource = ctx.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;
      
      rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'bandpass'; rainFilter.frequency.value = 1200; rainFilter.Q.value = 0.7; 
      
      rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0, t);
      
      rainSource.connect(rainFilter); rainFilter.connect(rainGain); rainGain.connect(ctx.destination);
      rainSource.start(t);
    }
  } catch (e) {
    console.error("Ambient playback failed", e);
  }
}

function stopAmbientLayer() {
  try {
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    
    if (ambientGain) {
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, t);
      ambientGain.gain.linearRampToValueAtTime(0, t + 2);
    }
    if (rainGain) {
      rainGain.gain.setValueAtTime(rainGain.gain.value, t);
      rainGain.gain.linearRampToValueAtTime(0, t + 2);
    }

    setTimeout(() => {
      if (ambientSource) { ambientSource.stop(); ambientSource = null; }
      ambientGain = null; windFilter = null;
      if (rainSource) { rainSource.stop(); rainSource = null; }
      rainGain = null; rainFilter = null;
    }, 2100);
  } catch (e) { console.error(e); }
}
