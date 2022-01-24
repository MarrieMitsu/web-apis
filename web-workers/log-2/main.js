// main
function main() {
    const paragraph = document.getElementById('task');

    const cluster1 = [
        {
            name: '[cluster-1]: Task 1',
            duration: 2
        },
        {
            name: '[cluster-1]: Task 2',
            duration: 3,
        }
    ];

    const cluster2 = [
        {
            name: '[cluster-2]: Task 1',
            duration: 5
        },
        {
            name: '[cluster-2]: Task 2',
            duration: 1,
        }
    ];

    if (window.Worker) {

        const worker = new Worker('http://localhost:3000/worker.js');

        // listen message
        worker.onmessage = function(e) {
            const msg = e.data;

            paragraph.textContent = msg;
        }

        // do task
        paragraph.textContent = 'Task 1';

        for (let i = 0; i < cluster1.length; i++) {
            worker.postMessage(cluster1[i]);
        }

        for (let i = 0; i < cluster2.length; i++) {
            worker.postMessage(cluster2[i]);
        }

        paragraph.textContent = 'Task 2';


    }

}
main();
