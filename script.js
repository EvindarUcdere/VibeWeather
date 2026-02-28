const apiKey = 'SİZİN_API_ANAHTARINIZ'; // Kendi anahtarınız buraya koyun lütfen :)

const searchBtn = document.querySelector('#searchBtn');
const geoBtn = document.querySelector('#geoBtn');
const cityInput = document.querySelector('#cityInput');
const displayArea = document.querySelector('#weatherDisplay');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) getWeather(`q=${city}`);
});

geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            getWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
        });
    }
});

async function getWeather(queryParam) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?${queryParam}&appid=${apiKey}&units=metric&lang=tr`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Şehir bulunamadı!");
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        alert(error.message);
    }
}

function getSmartMood(data) {

    const weatherMain = data.weather[0].main.toLowerCase();
    const temp = data.main.temp;
    const icon = data.weather[0].icon;

    const isNight = icon.includes("n");

    function randomMood(genre, ids) {
        const randomIndex = Math.floor(Math.random() * ids.length);
        return {
            genre,
            id: ids[randomIndex]
        };
    }

    // 🌙 GECE
    if (isNight) {
        return randomMood("Gece Lo-fi", [
            "37i9dQZF1DWWQRwui0ExPn",  // Lo-Fi Chill
            "37i9dQZF1DX9XIZzbM93To"   // Late Night Vibes
        ]);
    }

    // 🌧 YAĞMUR
    if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
        return randomMood("Yağmurlu Jazz", [
            "37i9dQZF1DX4wniR0jZts6",  // Coffee & Jazz
            "37i9dQZF1DXbITWG5p43w4"   // Rainy Day
        ]);
    }

    // ❄ KAR
    if (weatherMain.includes("snow")) {
        return randomMood("Karlı Chill", [
            "37i9dQZF1DX6ziVCJnEm59",  // Winter Acoustic
            "37i9dQZF1DX4Y4RIsT542h"   // Chill Winter
        ]);
    }

    // ☁ BULUTLU
    if (weatherMain.includes("cloud")) {
        if (temp <= 10) {
            return randomMood("Soğuk Gün Acoustic", [
                "37i9dQZF1DX6ziVCJnEm59"  // Winter Acoustic
            ]);
        }
        return randomMood("Bulutlu Lo-fi", [
            "37i9dQZF1DWWQRwui0ExPn"  // Lo-Fi Chill
        ]);
    }

    // ☀ GÜNEŞLİ
    if (weatherMain.includes("clear")) {
        if (temp >= 25) {
            return randomMood("Yaz Enerjisi", [
                "37i9dQZF1DX0BcQWzuB7ZO"  // Summer Hits
            ]);
        }
        return randomMood("Güneşli Pop", [
            "37i9dQZF1DXcBWIGoYBM5M"  // Today's Top Hits
        ]);
    }

    return randomMood("Günün Mixi", [
        "37i9dQZF1DXcBWIGoYBM5M"
    ]);
}

function updateUI(data) {

    const weatherStatus = data.weather[0].main.toLowerCase();
    const mood = getSmartMood(data);

    document.body.className = `${weatherStatus}-mood`;

    const spotifyUrl = `https://open.spotify.com/embed/playlist/${mood.id}?t=${Date.now()}`;

    displayArea.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" style="width:80px;">
            <div style="text-align: left;">
                <h1 style="margin:0;">${data.name}</h1>
                <p style="text-transform: capitalize; margin: 0; opacity: 0.8;">${data.weather[0].description}</p>
            </div>
        </div>
        
        <div style="font-size: 3.5rem; font-weight: bold; margin: 15px 0;">
            ${Math.round(data.main.temp)}°C
        </div>
        
        <div class="music-box">
            <p style="margin-bottom: 10px;">
                🎧 Önerilen: <strong>${mood.genre}</strong>
            </p>
            <iframe 
                src="${spotifyUrl}" 
                width="100%" 
                height="180" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                style="border-radius:15px;">
            </iframe>
        </div>
    `;

    displayArea.classList.remove('hidden');
}