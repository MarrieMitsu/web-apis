onmessage = function(e) {
    const msg = e.data;
    const arr = [];

    const subWorker1 = new Worker('sub-worker-1.js');
    const subWorker2 = new Worker('sub-worker-2.js');

    // listen message
    subWorker1.onmessage = function(e) {
        const subMsg = e.data;
        arr.push(subMsg);
        postMessage(arr);
    }
    subWorker2.onmessage = function(e) {
        const subMsg = e.data;
        arr.push(subMsg);
        postMessage(arr);
    }

    // do task
    const start = new Date();

    subWorker1.postMessage(msg);
    subWorker2.postMessage(msg);

}
