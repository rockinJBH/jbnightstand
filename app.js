function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, make it 12

    document.getElementById('time').textContent = `${hours}:${minutes}`;
    document.getElementById('date').textContent = now.toDateString();
}

// Update time every second
setInterval(updateTime, 1000);
updateTime();

const weatherAPIKey = '1cd56c176c13ab6c6b877e3c8e2378f3'; // Replace with your OpenWeatherMap API key
const city = 'New Jersey'; // Replace with your city
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPIKey}`;

async function fetchWeather() {
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.weather) {
            const description = data.weather[0].description;
            const temp = Math.round(data.main.temp);
            const tempHigh = Math.round(data.main.temp_max);
            const tempLow = Math.round(data.main.temp_min);
            const city = data.name; // Extract city name
            const country = data.sys.country; // Extract country code

            document.getElementById('weather').textContent = `${temp}°F, ${description}`;
            document.getElementById('temp-range').textContent = `High: ${tempHigh}°F | Low: ${tempLow}°F`;
            document.getElementById('location').textContent = `${city}, ${country}`; // Display location
        } else {
            document.getElementById('weather').textContent = 'Weather not available';
            document.getElementById('temp-range').textContent = '';
            document.getElementById('location').textContent = '';
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('weather').textContent = 'Error loading weather';
        document.getElementById('temp-range').textContent = '';
        document.getElementById('location').textContent = '';
    }
}

// Fetch weather on load
fetchWeather();

// Fetch weather on load
fetchWeather();

const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherAPIKey}`;

async function fetchForecast() {
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        // Group data by day
        const groupedByDay = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' });
            if (!groupedByDay[date]) {
                groupedByDay[date] = [];
            }
            groupedByDay[date].push(item);
        });

        // Process the forecast for each day
        const forecastElements = document.querySelectorAll('.forecast-day');
        Object.keys(groupedByDay).slice(0, 5).forEach((day, index) => {
            const dailyData = groupedByDay[day];

            // Calculate high and low temperatures
            const temps = dailyData.map(entry => entry.main.temp);
            const tempHigh = Math.round(Math.max(...temps));
            const tempLow = Math.round(Math.min(...temps));

            // Determine the dominant weather condition (most frequent)
            const weatherCounts = {};
            dailyData.forEach(entry => {
                const condition = entry.weather[0].main; // Main weather condition
                weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
            });
            const dominantCondition = Object.keys(weatherCounts).reduce((a, b) =>
                weatherCounts[a] > weatherCounts[b] ? a : b
            );

            // Use the icon from the first occurrence of the dominant condition
            const dominantIcon = dailyData.find(entry => entry.weather[0].main === dominantCondition).weather[0].icon;

            // Update the HTML
            forecastElements[index].querySelector('.forecast-date').textContent = day;
            forecastElements[index].querySelector('.forecast-icon').src = `https://openweathermap.org/img/wn/${dominantIcon}.png`;
            forecastElements[index].querySelector('.forecast-icon').alt = dominantCondition;
            forecastElements[index].querySelector('.forecast-temp').textContent = `High: ${tempHigh}°F | Low: ${tempLow}°F`;
        });
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Fetch forecast on load
fetchForecast();

// Update the forecast every hour (3600000 ms)
setInterval(fetchForecast, 3600000);
// Fetch weather every hour (3600000 ms)
setInterval(fetchWeather, 3600000);

function updateBackground() {
    const now = new Date();
    const hours = now.getHours();
    const appContainer = document.querySelector('.app-container');

    if (hours >= 9 && hours < 18) {
        // Daytime image
        appContainer.style.backgroundImage = "url('daytime.jpg')"; // Replace with your daytime image
    } else {
        // Nighttime image
        appContainer.style.backgroundImage = "url('nighttime.jpg')"; // Replace with your nighttime image
    }
}

// Run the background update function on load
updateBackground();

// Check and update the background every minute (60000 ms)
setInterval(updateBackground, 60000);
