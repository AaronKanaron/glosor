function commentGenerator(e,t=5,r=1,a=!1){return`${(a?"/*":"=")+"-".repeat(t)+"-".repeat(e.length)+"-".repeat(a?t-2:t)+(a?"*\\":"=")+"\n"+("|"+" ".repeat(t)+" ".repeat(e.length)+" ".repeat(t)+"|\n").repeat(r)+"|"+" ".repeat(t)+e+" ".repeat(t)+"|\n"+("|"+" ".repeat(t)+" ".repeat(e.length)+" ".repeat(t)+"|\n").repeat(r)+(a?"\\*":"=")+"-".repeat(t)+"-".repeat(e.length)+"-".repeat(a?t-2:t)+(a?"*/":"=")}`}


 /*---------------------------*\
|                             |
|          Functions          |
|                             |
\*---------------------------*/

const render_text = (text, element, add = false) => {
	try{
		if(add) { element.innerHTML += text; return; }
		element.innerHTML = text
	} catch {
		console.error("Error in render_text, element does not exist")
	}
}
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const input_fix = (input) => {
	const firefox_copy = input.match(/\n[f,m]\n/gm)
	if(firefox_copy) {
		console.log("Running Firefox Regex")
		// glossary_filtered = input.replace(/[f,m]\n/gm, '');
		glossary_filtered = input.replace(/\n{2}/gm, '\n');
		glossary_filtered = glossary_filtered.replace(/\s{3}/gm, '\n');
		glossary_filtered = glossary_filtered.replace(/\([^)]*\)/g, '');	
	} else {
		console.log("Running Chrome Regex")
		// glossary_filtered = input.replace(/[f,m]\s$/gm, '');
		glossary_filtered = input.replace(/\n$/gm, '');
		glossary_filtered = glossary_filtered.replace(/\([^)]*\)/g, '');
	}

	glossary_filtered = glossary_filtered.toLowerCase();
	return glossary_filtered;
}
function debounce(func, timeout = 300){
    let timer;
	return (...args) => {
		if (!timer) {
			func.apply(this, args);
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
		}, timeout);
	};
}



function getFirstCharacters(string, amount = 2){
	return string.substring(0, amount);
}
function toggleModal(modal_id){
	let modal = document.getElementById(modal_id);
	modal.classList.toggle("open");
}

function shuffle(array, array2) {
    var counter = array.length, temp, temp2, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        temp2 = array2[counter];
        array[counter] = array[index];
        array2[counter] = array2[index];
        array[index] = temp;
        array2[index] = temp2;
    } 
}
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
const latest = (e) => {
	let latest_gloss = JSON.parse(localStorage.getItem("latest_gloss"));
	let latest_gender = JSON.parse(localStorage.getItem("latest_gender"));
	if(!latest_gloss || latest_gloss == "" || latest_gloss == null || latest_gloss == undefined || !latest_gender || latest_gender == "" || latest_gender == null || latest_gender == undefined) {
		render_message(`Kunde inte hitta din senaste ordlista i din lokala lagring`, "red", "error_message", 0, .25);
		error_shake('#' + e.id, 5);
		return;
	} 

	handle_input(latest_gloss);
}

let glosses = []
let gender = [];
var glossIndex = 0;
let glossTries = 0;

//10 colors from red to green
const colors = [
	"#e14141",
	"#e3532d",
	"#e16612",
	"#da7800",
	"#ce8b00",
	"#bf9d00",
	"#abad00",
	"#92bd00",
	"#70cb00",
	"#35d938"
]
const messages = [
	"Helt fel!",
	"Vad skriver du ens?",
	"Fel!",
	"Nix, det är inte det.",
	"Ett sådant angreppssätt ger vida missvisande utfall!",
	"Det är inte det.",
	"Lite fel, men det är nära!",
	"Nästan!",
	"Du är så nära!",
	"Galet nära!",
]
const winning_message = [
	"Fantastique!",
	"Bien!",
	"Parfait!",
	"Bonne réponse!",
	"Colossal!",
	"Magnifique!",
	"Merveilleux!",
	"Suprême!",
	"Excellent!",
	"Élégant!",
	"Sehr Gut!"
	"Fantastiskt"
	"Helt Otroligt"
	"Osannoligt bra"
	"Kolosalt bra",
	"Woauw",
]
const numbers = [
	"första",
	"andra",
	"tredje",
	"fjärde",
	"femte",
	"sjätte",
	"sjunde",
	"åttonde",
	"nionde",
	"tionde",
	"elfte",
	"tolfte",
	"trettonde"
]

document.getElementById('input').addEventListener('keydown', function onEvent(event) {
    if (event.key === "Enter") {
        submit_answer()
    }
});
const submit_answer = debounce(() => handle_answer(document.getElementById('input').value), 200);

const handle_input = (user_input) => {
	glossary = input_fix(user_input);	
	const genders = glossary.matchAll(/[f,m]\n/gm);

	for (const g of genders) {
		gender.push(g);
	}

	const firefox_copy = glossary.match(/\n[f,m]\n/gm)

	if(firefox_copy) {
		console.log("runing firfox")
		glossary = glossary.replace(/[f,m]\n/gm, "")
	} else {
		console.log("runing chrome")
		glossary = glossary.replace(/[f,m]\s$/gm, "")
	}
 
	glossary += "\n";
	const matches = glossary.matchAll(/(.*\n){1}(.*\n){1}/gm)
	
	//for every match in matches
	
	
	for (const match of matches) {
		let lang1 = match[1].replace(/\n/g, '');
		lang1 = lang1.replace(/[ \t]+$/gm, '');
		let lang2 = match[2].replace(/\n/g, '');
		lang2 = lang2.replace(/[ \t]+$/gm, '');


		glosses.push([lang1, lang2]);
	}


	//after array completion

	try{
		document.getElementById("unfiltered_input").value = ""
	} catch(e) {
		console.log("Error in handle_input, element does not exist")
	}

	try{
		glosses[0][1]
	} catch {
		console.error("Glossary Not Valid")
		toggleModal("error")
		return
	}

	localStorage.setItem("latest_gloss", JSON.stringify(glossary));
	localStorage.setItem("latest_gender", JSON.stringify(gender));

	shuffle(glosses, gender)
	console.log(glosses, gender);
	render_text(glossIndex + 1, document.getElementById("gloss_index"));
	render_text(glosses.length, document.getElementById("gloss_count"));
	render_text(steps(glosses.length), document.getElementById("lines"));
	plusGloss();
	slide_in("up", ".glossary_container", 1, false);

	console.log(glosses)
	console.log(gender)

}

let rendering = false;
const render_message = (message, color, element_id, delay = 0, stay_delay = 0, custom_style = null, renderblock = true) => {
	if (renderblock && rendering) {
		return 
	};
	rendering = true;

	let message_string = `<span style="color: ${color}${custom_style != null ? "; " + custom_style : ""}">${message}</span>`
	render_text(message_string, document.getElementById(element_id));
	animation_tl.to("#" + element_id, {duration: .5, opacity: 1, delay: delay});
	animation_tl.to("#" + element_id, {duration: .5, opacity: 0, onComplete: () => {
		rendering = false;
	}}, "+=" + stay_delay);
}

const steps = (amount) => {
	//make a span for every amount
	let spans = "";
	for (let i = 0; i < amount; i++) {
		spans += `<div class="step" id="step"><span class="step-fill"></span></div>`
	}
	return spans;
}

const previous = () => {
	if (glossIndex > 0) {
		plusGloss(-1);
		// glossIndex;
		showProgress(glossIndex-1);


	} else {
		close();
	}
}
const skip = () => {
	// glosses.push(glosses[glossIndex]);
	glosses.push(glosses.splice(glossIndex, 1)[0]);
	gender.push(gender.splice(glossIndex, 1)[0]);
	showGloss(glossIndex);
}
const close = () => {
	slide_out("up", ".glossary_container", 1, false);
	glosses = []
	glossIndex = 0;
	document.getElementById("unfiltered_input").focus();
}


/*


*/


const animation_tl = gsap.timeline();
const animation = () => {
	showProgress(glossIndex);
	animation_tl.to(".glossary-wrapper", {duration: 0.8, y: "50%", opacity: 0, ease: "power3.inOut"});
	render_message(winning_message[Math.floor(Math.random() * winning_message.length)], "hsl(130, 100%, 40%)", "message", -.5, .2, "font-size: 3em; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);", false)
	animation_tl.to(".glossary-wrapper", {duration: 0.8, y: "0%", opacity: 1, ease: "power3.inOut", onStart: () => {
		plusGloss(1);
	}});
}

const handle_answer = (answer) =>{
	if (answer.trim().length === 0) {return;}

	if (glosses[glossIndex][0].slice(-1) == "s"){
		//Answer is plural
		prefix = "les ";
	} else if (/a|o|u|e|i/.test(glosses[glossIndex][0].charAt(0))){
		prefix = "l'"
	}
	else if(gender[glossIndex == "f\n"]){
		prefix = "la "
	} else {
		prefix = "le "
	}

	usedPrefix = prefix + glosses[glossIndex][0]

	if (answer.toLowerCase() == glosses[glossIndex][0].toLowerCase() || answer.toLowerCase() == usedPrefix) {
		if(glossIndex >= glosses.length-1) { close(); return; }

		if (glossIndex >= 0) {
			document.getElementById("prev").innerHTML = "Föregående";
		}

		animation()
	}
	else {


		similarity_score = similarity(answer, glosses[glossIndex][0]);
		rounded_score = Math.round(similarity_score * 10);
		
		console.log("from 1-10, how close? (1 least, 10 max) :", similarity_score, "(rounded", rounded_score+") - corresponding message:", messages[rounded_score]);

		glossTries += 1;

		message = messages[rounded_score];
		color = colors[rounded_score]
		number = numbers[glossTries-1] ? numbers[glossTries-1] : glossTries + "'de";
		render_message(`${message} Du är ${Math.round(100 - similarity_score * 100)}% ifrån | ${number} försöket.`, color, "message", 0, 1.5, null, false);
	}
}

//Glosses

const generate_tip = () => {
	let tip_amount = Math.round(glosses[glossIndex][0].length / 3)
	render_text("Ordet börjar med " + getFirstCharacters(glosses[glossIndex][0], tip_amount), document.getElementById("tip"));
}
const plusGloss = (n = 0) => {
	showGloss(glossIndex += n);
}
const showGloss = (n = 0) => {
	let gendr = "";
	if (!gender[n] || gender[n] == "undefined"){
		gendr = "";
	} else {
		gendr = gender[n]
	}

	render_text(`Översätt "${capitalizeFirstLetter(glosses[n][1])}". ${gendr}`, document.getElementById("gloss_output"));
	generate_tip();
	render_text(glosses[glossIndex][0], document.getElementById("answer"));
	glossTries = 0;
	
	[].forEach.call(document.querySelectorAll(".tooltip"), (el) => {
		el.classList.remove("active");
	})
	
	document.getElementById("input").value = "";
	document.getElementById("input").focus();
	
	if (n == 0) {
		document.getElementById("prev").innerHTML = "Stäng";
	}
}

const count_steps = (n) => {
	console.log(n, glossIndex)
	let question_steps = document.getElementsByClassName("step");
	let question_steps_fill = document.getElementsByClassName("step-fill");
	//for every step
	for (let i = 0; i < question_steps.length; i++) {
		//remove class active
		question_steps[i].classList.remove("active");
		question_steps[i].classList.remove("last");
	}

	gsap.to("#lines", {duration: 1.5, scrollTo: {x: (96*(glossIndex-5))}})


	//add class active to n and every before
	for (let i = 0; i <= n; i++) {
		question_steps[i].classList.add("active");
	
		if (i == n) {
			question_steps[i].classList.add("last");
			gsap.to(question_steps_fill[i], {duration: 0.8, x: 0, ease: "power3.out"});
		}
	}

	//target every element after n
	for (let i = n+1; i < question_steps.length; i++) {
		gsap.to(question_steps_fill[i], {duration: 0.8, x: "-100%", ease: "power3.out"});
	}

} 

const plusProgress = (n) => {
	console.count("progress")
	showProgress(glossIndex + n)
}

const showProgress = (n) => {
	render_text(n + 1, document.getElementById("gloss_index"));
	count_steps(n);
}
