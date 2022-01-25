onmessage = function(e) {
    const msg = e.data;

    const subWorker1 = new Worker('sub-worker-1.js');
    const subWorker2 = new Worker('sub-worker-2.js');

    // listen message
    subWorker1.onmessage = function(e) {
        const subMsg = e.data;
        postMessage(subMsg);
    }
    subWorker2.onmessage = function(e) {
        const subMsg = e.data;
        postMessage(subMsg);
    }

    // do task
    const start = new Date();

    if (!isNaN(msg.duration)) {
        while((new Date - start) / 1000 < msg.duration);
    }

    if (msg.subCluster === 1) {
        console.log('run sub-cluster 1');
        subWorker1.postMessage(msg);
    } else if (msg.subCluster === 2) {
        console.log('run sub-cluster 2');
        subWorker2.postMessage(msg);
    }

}
