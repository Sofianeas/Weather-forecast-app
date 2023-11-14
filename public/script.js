document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData();
    // Refresh every 24 hours
    setInterval(fetchWeatherData, 86400000); // 24 hours in milliseconds
});

function fetchWeatherData() {
    const latitude = 43.610769; // Example latitude, replace with actual value if needed
    const longitude = 3.876716; // Example longitude, replace with actual value if needed
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateWeatherDisplay(data.daily);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeatherDisplay(dailyData) {
    const container = document.querySelector('.weather-forecast');
    container.innerHTML = ''; // Clear existing content

    dailyData.time.forEach((time, index) => {
        const day = dailyData[index]; // Get the data for the current day
        const dayElem = document.createElement('div');
        dayElem.className = 'day-forecast';
        dayElem.innerHTML = `
            <div class="day-name">${getDayName(time)}</div>
            <div class="weather-icon">
                <!-- Icons based on the time of day and weather conditions -->
                <img src="icons/${getWeatherIcon(day.weathercode, time)}.png" alt="Weather icon">
            </div>
            <div class="temperature">
                <span class="high">${day.temperature_2m_max.toFixed(0)}°C</span>
                <span class="low">${day.temperature_2m_min.toFixed(0)}°C</span>
            </div>
            <div class="precipitation">${day.precipitation_sum.toFixed(0)} mm</div>
            <div class="wind">
                <img src="icons/wind.png" alt="Wind icon"> ${day.windspeed_10m_max.toFixed(0)} km/h
            </div>
        `;

        container.appendChild(dayElem);
    });
}

function getDayName(time) {
    return new Date(time).toLocaleDateString('en-US', { weekday: 'short' });
}

function getWeatherIcon(weatherCode, time) {
    // You will need to map the weather codes from your API to specific icons
    const codeMap = {
        // These codes are placeholders; use actual codes from the API
        'clear-day': 'sunny',
        'clear-night': 'moon',
        'rain': 'rain',
        'wind': 'wind',
        // Add all necessary weather conditions
    };

    const isNight = new Date(time).getHours() > 18; // Simple check for night time
    if (isNight) {
        return 'icons/moon.png'; // Path to your night time icon
    }
    return `icons/${codeMap[weatherCode] || 'default'}.png`; // Path to your weather icons
}
