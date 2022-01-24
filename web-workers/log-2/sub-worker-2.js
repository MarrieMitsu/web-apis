onmessage = function(e) {
    const msg = e.data;
    const start = new Date();

    if (!isNaN(msg.duration)) {
        while((new Date - start) / 1000 < msg.duration + 1);
    }

    postMessage(`sub-2: ${msg.duration + 2}`);
}
