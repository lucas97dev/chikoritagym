// --- NOVAS FUNÇÕES E MELHORIAS NO SCRIPT ---

// Função para gerar ID único (substitui o index instável)
const generateId = () => Math.random().toString(36).substr(2, 9);

// Sistema de áudio para o Timer (Web Audio API)
function playTimerEndSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Nota Lá
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.log("Áudio não suportado ou bloqueado pelo navegador.");
    }
}

// Melhoria na função de Salvar Set com Feedback
function saveSet(workoutIndex, exerciseIndex, seriesIndex, restTime) {
    const weightInput = document.getElementById(`weight-${exerciseIndex}-${seriesIndex}`);
    const repsInput = document.getElementById(`reps-${exerciseIndex}-${seriesIndex}`);
    
    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);

    if (!weight || !reps) {
        alert('Por favor, preencha carga e repetições! 🍃');
        return;
    }

    const serie = workouts[workoutIndex].exercises[exerciseIndex].series[seriesIndex];
    if (!serie.history) serie.history = [];

    // Lógica de "Recorde Pessoal" (PR)
    const lastWeight = serie.history.length > 0 ? serie.history[serie.history.length - 1].weight : 0;
    if (weight > lastWeight && lastWeight > 0) {
        alert("Novo Recorde! ⭐ Evolução de " + (weight - lastWeight) + "kg!");
    }

    serie.history.push({
        id: generateId(),
        date: new Date().toISOString(),
        weight: weight,
        reps: reps
    });

    saveToStorage();
    hideRegisterForm(exerciseIndex, seriesIndex);
    
    // Feedback tátil e visual
    if (navigator.vibrate) navigator.vibrate(50);
    startTimer(exerciseIndex, seriesIndex, restTime);
}

// Timer aprimorado com som e sem alert() travando a tela
function startTimer(exerciseIndex, seriesIndex, restTime) {
    if (timerInterval) clearInterval(timerInterval);

    const timerDiv = document.getElementById(`timer-${exerciseIndex}-${seriesIndex}`);
    timerDiv.classList.remove('hidden');
    timerDiv.classList.add('active');

    timerSeconds = restTime;
    updateTimerDisplay(exerciseIndex, seriesIndex);

    timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds >= 0) {
            updateTimerDisplay(exerciseIndex, seriesIndex);
        }

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerDiv.classList.remove('active');
            playTimerEndSound(); // Som em vez de alert()
            
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            
            // Mudança visual no timer quando acaba
            document.getElementById(`timer-time-${exerciseIndex}-${seriesIndex}`).textContent = "CONCLUÍDO!";
            setTimeout(() => timerDiv.classList.add('hidden'), 3000);
        }
    }, 1000);
}
