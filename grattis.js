var myCanvas = document.createElement('canvas');
document.body.appendChild(myCanvas);


var myConfetti = confetti.create(myCanvas, {
  resize: true,
  useWorker: true
});
var duration = 15 * 1000;
var animationEnd = Date.now() + duration;
var defaults = { startVelocity: 10, spread: 360, ticks: 60, zIndex: 2 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}




setTimeout(() => {
	var interval = setInterval(function() {
		var timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		var particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
		confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
	}, 250);
}, 5000);
