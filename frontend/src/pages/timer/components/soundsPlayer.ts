// 1. Inicializa o contexto de áudio
const audioCtx = new (window.AudioContext)();

// Garante que o áudio seja liberado após interação do usuário (exigência dos navegadores)
function checkAudioContext() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// -------------------------------------------------------------
// EFEITOS SONOROS
// -------------------------------------------------------------

// Som 1: Iniciar Timer (Beep agudo e suave subindo)
export function playStartSound() {
  checkAudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}

// Som 2: Pausar Timer (Tom grave caindo)
export function playPauseSound() {
  checkAudioContext();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
  osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.1); // A3

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

// Som 3: Fim do Pomodoro / Hora da Pausa (Acorde harmonioso de sino)
export function playPomodoroDoneSound() {
  checkAudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5]; // Acorde Dó Maior (C5, E5, G5, C6)

  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const startTime = audioCtx.currentTime + index * 0.1;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.8);
  });
}

// Som 4: Fim da Pausa / Hora de Voltar ao Foco (3 beeps rápidos)
export function playBreakDoneSound() {
  checkAudioContext();
  const times = [0, 0.12, 0.24];

  times.forEach((delay) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const startTime = audioCtx.currentTime + delay;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, startTime); // A5

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.08);
  });
}
