import { db, ref, set, get, child, update } from './firebase.js';

// Элементы интерфейса
const elements = {
  walletDisplay: document.getElementById('walletDisplay'),
  balance: document.getElementById('balance'),
  hashrate: document.getElementById('hashrate'),
  earned: document.getElementById('earned'),
  uptime: document.getElementById('uptime'),
  startMiningBtn: document.getElementById('startMining'),
  refLink: document.getElementById('refLink'),
  copyRefBtn: document.getElementById('copyRef')
};

// Состояние приложения
let state = {
  wallet: null,
  mining: false,
  miningInterval: null,
  stats: {
    hashrate: 0,
    earned: 0,
    uptime: 0
  }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
  state.wallet = localStorage.getItem('solanaWallet');
  if (!state.wallet) {
    window.location.href = 'index.html';
    return;
  }

  await initDashboard();
  setupEventListeners();
});

// Загрузка данных и инициализация
async function initDashboard() {
  try {
    // Отображаем сокращенный адрес кошелька
    elements.walletDisplay.textContent = shortenWallet(state.wallet);
    elements.refLink.value = generateRefLink(state.wallet);

    // Загружаем данные из Firebase
    const snapshot = await get(child(ref(db), `wallets/${state.wallet}`));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      state.stats.earned = data.balance || 0;
      updateUI();
    }
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    alert('Ошибка загрузки данных');
  }
}

// Настройка обработчиков событий
function setupEventListeners() {
  // Кнопка майнинга
  elements.startMiningBtn.addEventListener('click', toggleMining);
  
  // Копирование реферальной ссылки
  elements.copyRefBtn.addEventListener('click', () => {
    elements.refLink.select();
    document.execCommand('copy');
    alert('Реферальная ссылка скопирована!');
  });
}

// Управление майнингом
function toggleMining() {
  state.mining = !state.mining;

  if (state.mining) {
    startMining();
    elements.startMiningBtn.textContent = 'Остановить майнинг';
  } else {
    stopMining();
    elements.startMiningBtn.textContent = 'Запустить майнинг';
  }
}

// Запуск майнинга
function startMining() {
  let lastUpdateTime = Date.now();
  
  state.miningInterval = setInterval(async () => {
    // Обновляем статистику
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now;

    state.stats.hashrate = Math.floor(Math.random() * 500) + 100;
    state.stats.earned += 0.0001 * deltaTime;
    state.stats.uptime += deltaTime;

    // Обновляем интерфейс
    updateUI();

    // Сохраняем в Firebase каждые 5 секунд
    if (Math.floor(state.stats.uptime) % 5 === 0) {
      await saveToFirebase();
    }
  }, 1000);
}

// Остановка майнинга
function stopMining() {
  clearInterval(state.miningInterval);
  state.miningInterval = null;
  saveToFirebase();
}

// Сохранение в Firebase
async function saveToFirebase() {
  try {
    await update(ref(db, `wallets/${state.wallet}`), {
      balance: state.stats.earned,
      lastActive: new Date().toISOString(),
      hashrate: state.mining ? state.stats.hashrate : 0
    });
  } catch (error) {
    console.error("Ошибка сохранения:", error);
  }
}

// Обновление интерфейса
function updateUI() {
  elements.balance.textContent = `${state.stats.earned.toFixed(4)} SOL`;
  elements.hashrate.textContent = `${state.stats.hashrate} H/s`;
  elements.earned.textContent = `${state.stats.earned.toFixed(6)} SOL`;
  elements.uptime.textContent = formatTime(state.stats.uptime);
}

// Вспомогательные функции
function shortenWallet(wallet) {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

function generateRefLink(wallet) {
  return `${window.location.origin}?ref=${wallet.slice(0, 8)}`;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}