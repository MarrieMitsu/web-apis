// main
function main() {
    const paragraph = document.getElementById('task');

    const cluster1 = [
        {
            subCluster: 1,
            name: '[cluster-1]: Task 1',
            duration: 2
        },
        {
            subCluster: 2,
            name: '[cluster-1]: Task 2',
            duration: 3,
        }
    ];

    const cluster2 = [
        {
            subCluster: 1,
            name: '[cluster-2]: Task 1',
            duration: 5
        },
        {
            subCluster: 2,
            name: '[cluster-2]: Task 2',
            duration: 1,
        }
    ];

    if (window.Worker) {

        const worker = new Worker('http://localhost:3000/worker.js');

        // listen message
        worker.onmessage = function(e) {
            const msg = e.data;

            console.log(msg);
            paragraph.textContent = msg;
        }

        // listen error message
        worker.onmessageerror = function(e) {
            console.error(`[message-error]: ${e}`);
        }

        // listen error
        worker.onerror = function(e) {
            console.log('error occurred');
        }

        // do task
        console.log('first manual init')
        paragraph.textContent = 'Task 1';

        for (let i = 0; i < cluster1.length; i++) {
            console.log('run cluster 1 task');
            worker.postMessage(cluster1[i]);
        }

        for (let i = 0; i < cluster2.length; i++) {
            console.log('run cluster 2 task');
            worker.postMessage(cluster2[i]);
        }

        console.log('second manual init')
        paragraph.textContent = 'Task 2';


    }

}
main();
