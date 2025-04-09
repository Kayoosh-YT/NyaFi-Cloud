import { db, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Конфигурация
const NYA_RATE = 0.00001; // 1 NYA = $0.00001

// Элементы интерфейса
const elements = {
  walletDisplay: document.getElementById('walletDisplay'),
  nyaBalance: document.getElementById('nyaBalance'),
  usdValue: document.getElementById('usdValue'),
  totalMined: document.getElementById('totalMined'),
  miningTime: document.getElementById('miningTime'),
  earnBtn: document.querySelector('.mining-link') // Кнопка перехода
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  const wallet = localStorage.getItem('solanaWallet');
  if (!wallet) {
    window.location.href = 'index.html';
    return;
  }

  loadUserData(wallet);
});

// Загрузка данных пользователя
function loadUserData(wallet) {
  elements.walletDisplay.textContent = shortenWallet(wallet);

  const userRef = ref(db, `users/${wallet}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val() || {};
    
    // Обновляем UI
    elements.nyaBalance.textContent = `${(data.nyaCoins || 0).toFixed(6)} NYA`;
    elements.usdValue.textContent = `≈ ${((data.nyaCoins || 0) * NYA_RATE).toFixed(4)} USD`;
    elements.totalMined.textContent = `${(data.totalMined || 0).toFixed(6)} NYA`;
    
    if (data.miningTime) {
      elements.miningTime.textContent = formatTime(data.miningTime);
    }
  });
}

// Форматирование времени (HH:MM:SS)
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

// Сокращение адреса кошелька
function shortenWallet(wallet) {
  return wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : '';
}

// Показать уведомление
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
    setTimeout(() => notification.remove(), 3000);
  }, 10);
}