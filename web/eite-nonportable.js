function normalizeMessage(message) {
    if (typeof message == 'object') {
        return (JSON && JSON.stringify ? JSON.stringify(message) : message);
    } else {
        return message;
    }
}
