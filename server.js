const express = require('express');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply a rate limit to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    // Validate query parameters
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Construct the API URL with environment variables
    const api_url = `${process.env.WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;

    try {
        const apiResponse = await fetch(api_url);
        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }
        const apiData = await apiResponse.json();
        res.json(apiData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
