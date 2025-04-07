// Импорт Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

console.log("index.js загружен");

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDMu6u7yFPgzN2RktCRP6hPy3nJen5OdJM",
    authDomain: "nyafi-cloud.firebaseapp.com",
    databaseURL: "https://nyafi-cloud-default-rtdb.firebaseio.com",
    projectId: "nyafi-cloud",
    storageBucket: "nyafi-cloud.firebasestorage.app",
    messagingSenderId: "323199817977",
    appId: "1:323199817977:web:1917ee3663cf5dd457aa28",
    measurementId: "G-EQYPQ2QHMB"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase инициализирован");
const database = getDatabase(app);

// Элементы DOM
const loginButton = document.getElementById("loginButton");
const userGmailInput = document.getElementById("userGmail");
const errorMessage = document.getElementById("errorMessage");

if (!loginButton || !userGmailInput || !errorMessage) {
    console.error("Один из элементов DOM не найден!");
}

// Функция проверки Gmail и перехода
async function checkGmail() {
    console.log("Клик по кнопке!");
    const gmail = userGmailInput.value.trim();
    console.log("Введен Gmail:", gmail);

    if (gmail === "" || !gmail.includes("@gmail.com")) {
        errorMessage.innerText = "Пожалуйста, введи корректный Gmail!";
        errorMessage.style.opacity = "1";
        console.log("Ошибка: некорректный Gmail");
        return;
    }

    const gmailKey = gmail.replace(/\./g, "_");
    console.log("Ключ для Firebase:", gmailKey);

    // Анимация кнопки
    loginButton.classList.add("button-clicked");
    setTimeout(() => loginButton.classList.remove("button-clicked"), 300);

    try {
        // Проверка в Firebase
        const userRef = ref(database, "users/" + gmailKey);
        const snapshot = await get(userRef);
        console.log("Данные из Firebase:", snapshot.val());

        if (snapshot.exists()) {
            console.log("Пользователь существует, перенаправляем...");
            window.location.href = "main.html?user=" + encodeURIComponent(gmail);
        } else {
            console.log("Создаем нового пользователя...");
            await set(userRef, {
                balance: 0,
                gmail: gmail
            });
            console.log("Пользователь создан, перенаправляем...");
            window.location.href = "main.html?user=" + encodeURIComponent(gmail);
        }
    } catch (error) {
        errorMessage.innerText = "Ошибка: " + error.message;
        errorMessage.style.opacity = "1";
        console.error("Ошибка Firebase:", error);
    }
}

// Обработчик клика
if (loginButton) {
    loginButton.addEventListener("click", checkGmail);
} else {
    console.error("Кнопка не найдена!");
}

// Обработчик Enter
if (userGmailInput) {
    userGmailInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            console.log("Нажат Enter!");
            checkGmail();
        }
    });
}