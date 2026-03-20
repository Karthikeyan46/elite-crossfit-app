/**
 * Google Fit API Integration Service
 * Handles OAuth2 flow and step data fetching.
 */

const GOOGLE_FIT_SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read';

// For the token to be available, we need to load the GIS library in index.html
// <script src="https://accounts.google.com/gsi/client" async defer></script>

let tokenClient = null;
let accessToken = null;

/**
 * Initialize the Google Identity Services client
 * @param {string} clientId - The Google Cloud Console Client ID
 */
export const initGoogleFit = (clientId) => {
    if (typeof google === 'undefined') {
        console.warn('Google Identity Services library not loaded.');
        return;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_FIT_SCOPES,
        callback: (response) => {
            if (response.error !== undefined) {
                console.error('Google Auth Error:', response.error);
                return;
            }
            accessToken = response.access_token;
            // Store token for session (optional, depending on UX)
            sessionStorage.setItem('google_fit_token', accessToken);
        },
    });
};

/**
 * Request permission and get access token
 */
export const connectGoogleFit = () => {
    return new Promise((resolve, reject) => {
        if (!tokenClient) {
            reject('Google Fit client not initialized');
            return;
        }

        // Override callback to resolve promise
        const originalCallback = tokenClient.callback;
        tokenClient.callback = (response) => {
            if (response.error !== undefined) {
                reject(response.error);
            } else {
                accessToken = response.access_token;
                sessionStorage.setItem('google_fit_token', accessToken);
                resolve(accessToken);
            }
            tokenClient.callback = originalCallback; // Restore
        };

        tokenClient.requestAccessToken({ prompt: 'consent' });
    });
};

/**
 * Fetch daily steps for today
 * @returns {Promise<number>} - Steps count
 */
export const fetchDailySteps = async () => {
    const token = accessToken || sessionStorage.getItem('google_fit_token');
    if (!token) throw new Error('Not connected to Google Fit');

    const startTimeMillis = new Date().setHours(0, 0, 0, 0);
    const endTimeMillis = new Date().getTime();

    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            aggregateBy: [{
                dataTypeName: 'com.google.step_count.delta',
                dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
            }],
            bucketByTime: { durationMillis: 86400000 }, // 24 hours
            startTimeMillis,
            endTimeMillis
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch steps from Google Fit');
    }

    const data = await response.json();
    
    // Extract steps from aggregate response
    let steps = 0;
    if (data.bucket && data.bucket.length > 0) {
        const dataset = data.bucket[0].dataset;
        if (dataset && dataset[0].point && dataset[0].point.length > 0) {
            steps = dataset[0].point[0].value[0].intVal || 0;
        }
    }

    return steps;
};
