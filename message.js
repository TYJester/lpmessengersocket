const API_URL = 'https://lsm-api.lsmessenger.com';

async function sendMessage(eventID, groupID, userID, message) {
    const payload = {
        "eventID" : eventID,
        "groupID": groupID,
        "author": userID,
        "message": message
    };

    try {
        const response = await fetch(`${API_URL}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonRes = await response.json();
        console.log(jsonRes);
    } catch (err) {
        console.log(`Attempt ${attempt}: Failed to send message -`, err);
        if (attempt < maxAttempts) {
            console.log(`Retrying in ${retryDelay}ms...`);
            setTimeout(() => sendMessageWithRetry(data, attempt + 1), retryDelay);
        } else {
            console.log('Max retry attempts reached. Giving up.');
        }
    }
}

export default sendMessage