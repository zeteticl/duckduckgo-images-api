const axios = require('axios');
const { url } = require('./constants');

const RETRY_CONFIG = {
    maxRetries: 3,
    delay: 1000,
    timeout: 5000
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const axiosClient = axios.create({
    timeout: RETRY_CONFIG.timeout,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

async function retry(fn, retries = RETRY_CONFIG.maxRetries) {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0) {
            await sleep(RETRY_CONFIG.delay);
            return retry(fn, retries - 1);
        }
        throw error;
    }
}

async function getToken(keywords) {
    if (!keywords) {
        throw new Error('Keywords parameter is required');
    }

    async function fetchToken() {
        const response = await axiosClient.get(url, {
            params: { q: keywords }
        });

        const matches = response.data.match(/vqd=([\d-]+)\&/);
        if (!matches || !matches[1]) {
            throw new Error('Token pattern not found in response');
        }

        return matches[1];
    }

    try {
        return await retry(fetchToken);
    } catch (error) {
        console.error('DuckDuckGo API Error:', {
            message: error.message,
            keywords,
            timestamp: new Date().toISOString()
        });
        throw new Error(`Failed to get token: ${error.message}`);
    }
}

module.exports = {
    sleep,
    getToken,
    RETRY_CONFIG,
    axiosClient
};