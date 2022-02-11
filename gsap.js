gsap.registerPlugin(ScrollToPlugin);

const step_animation = () => {
	gsap.to("html", {"--step-width": 100, duration: 0.5, ease: "power4.out"});
}

const slide_in = (direction = "right", element, duration = 2, opacity = true) => {
	let x_dir = "";
	let y_dir = "";
	if (direction === "right") {
		x_dir = "100%";
	} else if (direction === "left") {
		x_dir = "-100%";
	} else if (direction === "up") {
		y_dir = "-100%";
	} else if (direction === "down") {
		y_dir = "100%";
	} else {
		y_dir = "0";
		x_dir = "0";
		console.log("Error in slide_in, direction not recognized")
	}

	opacity = opacity ? "0" : "1";

	gsap.fromTo(element, {duration: duration, opacity: opacity, y: y_dir, x: x_dir, ease: "power4.out"}, {duration: duration, opacity: opacity, y: "0", x: "0", ease: "power4.out"});
}
const slide_out = (direction = "right", element, duration = 2, opacity = true) => {
	let x_dir = "0";
	let y_dir = "0";
	if (direction === "right") {
		x_dir = "100%";
	} else if (direction === "left") {
		x_dir = "-100%";
	} else if (direction === "up") {
		y_dir = "-100%";
	} else if (direction === "down") {
		y_dir = "100%";
	} else {
		y_dir = "0";
		x_dir = "0";
		console.log("Error in slide_in, direction not recognized")
	}

	opacity = opacity ? "0" : "1";

	gsap.to(element, {duration: duration, opacity: opacity, y: y_dir, x: x_dir, ease: "power4.out"});
}

const add_char = (char) => {
	document.getElementById("input").value += char;
}

const error_shake = (element = this, amount = 10, time = .4) => {
	let time_divided = time / 7;
	
	const error_shake_tl = gsap.timeline({ defaults: {duration: time_divided, ease: "power4.out"}});
	error_shake_tl.to(element, {x: `${amount}%`})
				.to(element, {x: `-${amount}%`})
				.to(element, {x: `${Math.round(amount/2)}%`})
				.to(element, {x: `-${Math.round(amount/2)}%`})
				.to(element, {x: `${Math.round(amount/4)}%`})
				.to(element, {x: `-${Math.round(amount/4)}%`})
				.to(element, {x: 0});
}