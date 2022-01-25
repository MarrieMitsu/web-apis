onmessage = function(e) {
    const msg = e.data;
    const start = new Date();

    if (!isNaN(msg.duration)) {
        while((new Date - start) / 1000 < msg.duration + 2);
    }

    postMessage(`[sub-2]${msg.name}: ${msg.duration * 2 + 2}`);
}
