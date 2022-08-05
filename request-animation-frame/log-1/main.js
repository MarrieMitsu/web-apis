const boxEl = document.getElementById('box');
let start;
let previousTimestamp;
let done = false;

function step(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }

    const elapsed = timestamp - start;

    if (previousTimestamp !== timestamp) {
        const count = Math.min(1 * elapsed, 200);
        boxEl.style.transform = `translateX(${count}px)`;
        if (count === 200) done = true;
    }

    if (elapsed < 2000) {
        previousTimestamp = timestamp;
        if (!done) {
            window.requestAnimationFrame(step);
        }
    }
}

window.requestAnimationFrame(step);