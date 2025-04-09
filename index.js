document.addEventListener('DOMContentLoaded', () => {
    const walletInput = document.getElementById('walletInput');
    
    // Проверка введенного кошелька при потере фокуса
    walletInput.addEventListener('blur', (e) => {
        const walletAddress = e.target.value.trim();
        
        if(walletAddress && !isValidSolanaAddress(walletAddress)) {
            alert('Пожалуйста, введите корректный адрес Solana кошелька');
            walletInput.focus();
        }
    });

    document.getElementById('connectWallet').addEventListener('click', function() {
        const wallet = document.getElementById('walletInput').value.trim();
        
        if (!wallet || !isValidSolanaAddress(wallet)) {
          alert('Введите корректный адрес Solana!');
          return;
        }
        
        // Анимация загрузки
        const btn = this;
        btn.classList.add('loading');
        
        // Имитация задержки (например, проверка кошелька)
        setTimeout(() => {
          localStorage.setItem('solanaWallet', wallet);
          window.location.href = 'dashboard.html';
        }, 1500);
      });
    
    // Анимация при наведении на заголовок
    const title = document.querySelector('h1');
    title.addEventListener('mouseenter', () => {
        title.style.textShadow = '0 0 15px rgba(187, 134, 252, 0.5)';
    });
    
    title.addEventListener('mouseleave', () => {
        title.style.textShadow = '0 0 10px rgba(187, 134, 252, 0.3)';
    });
});

// Базовая проверка адреса Solana (упрощенная)
function isValidSolanaAddress(address) {
    return address.length >= 32 && address.length <= 44;
}

// В конец файла:
document.getElementById('connectWallet').addEventListener('click', () => {
    const wallet = document.getElementById('walletInput').value.trim();
    if (!wallet || !isValidSolanaAddress(wallet)) {
      alert('Введите корректный адрес Solana!');
      return;
    }
    localStorage.setItem('solanaWallet', wallet);
    window.location.href = 'dashboard.html';
  });