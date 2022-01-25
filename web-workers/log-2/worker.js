onmessage = function(e) {
    const msg = e.data;

    const subWorker1 = new Worker('sub-worker-1.js');
    const subWorker2 = new Worker('sub-worker-2.js');

    // listen message
    subWorker1.onmessage = function(e) {
        const subMsg = e.data;
        postMessage(subMsg);
    }

    // listen error message
    subWorker1.onmessageerror = function(e) {
        console.error(`[message-error: sub-cluster-1]: ${e}`);
    }

    // listen error
    subWorker1.onerror = function(e) {
        console.log('error occurred on sub-cluster-1');
    }

    subWorker2.onmessage = function(e) {
        const subMsg = e.data;
        postMessage(subMsg);
    }

    // listen error message
    subWorker2.onmessageerror = function(e) {
        console.error(`[message-error: sub-cluster-2]: ${e}`);
    }

    // listen error
    subWorker2.onerror = function(e) {
        console.log('error occurred on sub-cluster-2');
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
