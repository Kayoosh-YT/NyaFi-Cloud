import { db, ref, update, get } from './firebase.js';

// Конфигурация
const MINING_RATE = 0.016; // NYA в секунду
const MINING_SESSION = 15; // Длительность майнинга (сек)

// Элементы
const elements = {
  miningBtn: document.getElementById('miningBtn'),
  timerDisplay: document.getElementById('timer'),
  earnedDisplay: document.getElementById('earned'),
  walletDisplay: document.getElementById('walletDisplay')
};

// Состояние
const state = {
  wallet: null,
  isMining: false,
  timer: MINING_SESSION,
  earned: 0,
  interval: null
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  state.wallet = localStorage.getItem('solanaWallet');
  if (!state.wallet) window.location.href = 'index.html';

  elements.walletDisplay.textContent = shortenWallet(state.wallet);
  startAutoMining(); // Автозапуск майнинга
});

// Автоматический старт майнинга
function startAutoMining() {
  state.isMining = true;
  updateButton();
  startTimer();
  startMining();
}

// Запуск таймера
function startTimer() {
  updateTimerDisplay();
  
  state.interval = setInterval(() => {
    state.timer--;
    updateTimerDisplay();
    
    if (state.timer <= 0) {
      restartMining();
    }
  }, 1000);
}

// Обновление отображения таймера
function updateTimerDisplay() {
  const mins = Math.floor(state.timer / 60);
  const secs = state.timer % 60;
  elements.timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Майнинг
function startMining() {
  const miningInterval = setInterval(() => {
    if (!state.isMining) {
      clearInterval(miningInterval);
      return;
    }
    
    state.earned += MINING_RATE;
    elements.earnedDisplay.textContent = state.earned.toFixed(3);
    
    // Сохранение каждые 5 сек
    if (state.timer % 5 === 0) {
      saveToFirebase();
    }
  }, 1000);
}

// Перезапуск майнинга
function restartMining() {
  clearInterval(state.interval);
  saveToFirebase();
  state.timer = MINING_SESSION;
  state.earned = 0;
  setTimeout(() => location.reload(), 500);
}

// Сохранение в Firebase
async function saveToFirebase() {
  const userRef = ref(db, `users/${state.wallet}`);
  const snapshot = await get(userRef);
  const userData = snapshot.val() || {};
  
  await update(userRef, {
    nyaCoins: (userData.nyaCoins || 0) + state.earned,
    totalMined: (userData.totalMined || 0) + state.earned
  });
}

// Остановка майнинга
function stopMining() {
  state.isMining = false;
  clearInterval(state.interval);
  saveToFirebase();
  updateButton();
}

// Обновление кнопки
function updateButton() {
  if (state.isMining) {
    elements.miningBtn.textContent = 'СТОП МАЙНИНГ';
    elements.miningBtn.classList.add('active');
  } else {
    elements.miningBtn.textContent = 'СТАРТ МАЙНИНГ';
    elements.miningBtn.classList.remove('active');
  }
}

// Вспомогательные функции
function shortenWallet(wallet) {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

// Обработчик кнопки
elements.miningBtn.addEventListener('click', () => {
  if (state.isMining) {
    stopMining();
  } else {
    startAutoMining();
  }
});