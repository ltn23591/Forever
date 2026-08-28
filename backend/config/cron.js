import { CronJob } from 'cron';
import https from 'https';
import http from 'http';

const job = new CronJob('*/14 * * * *', function () {
    const url = process.env.API_URL;
    if (!url) {
        console.warn('Cron job skipped: API_URL environment variable is not defined.');
        return;
    }

    try {
        // Dynamically choose client based on the URL protocol to prevent mismatch crashes
        const client = url.startsWith('https') ? https : http;
        client
            .get(url, (res) => {
                if (res.statusCode === 200) {
                    console.log('Cron job executed successfully (pinged self) at ' + new Date());
                } else {
                    console.warn('Cron job ping returned non-200 status code: ' + res.statusCode);
                }
            })
            .on('error', (err) => {
                console.error('Error executing cron job (network request failed):', err.message);
            });
    } catch (err) {
        console.error('Error executing cron job (invalid URL or protocol error):', err.message);
    }
});

export default job;