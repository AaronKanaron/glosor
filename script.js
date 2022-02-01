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
	glossary_filtered = input.replace(/[f,m]\n/gm, '');
	glossary_filtered = glossary_filtered.replace(/\n{2}/gm, '\n');
	glossary_filtered = glossary_filtered.replace(/\s{3}/gm, '\n');
	glossary_filtered = glossary_filtered.replace(/\([^)]*\)/g, '');
	glossary_filtered = glossary_filtered.toLowerCase();
	glossary_filtered = glossary_filtered += '\n';
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
	if(!latest_gloss || latest_gloss == "" || latest_gloss == null || latest_gloss == undefined) {
		render_message(`Kunde inte hitta din senaste ordlista i din lokala lagring`, "red", "error_message", 0, .25);
		error_shake('#' + e.id, 5);
		return;
	} 

	handle_input(latest_gloss);
}

let glosses = []
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
	"Snyggt!",
	"Bra!",
	"Perfekt!",
	"Rätt svar!",
	"Rätt!",
	"Helt rätt!",
	"Bra jobbat!",
	"Finfint!",
	"Prima!",
	"Schysst!",
	"Vasst!",
	"Fantastiskt!",
	"Skickligt!",
	"Fenomenalt!",
	"Finemang!",
	"Excellent!",
	"Super!",
	"Kanon!",
	"Tiptop!",
	"Felfritt!",
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
	const regexp = /(.*\n){1}(.*\n){1}/gm;
	const matches = glossary.matchAll(regexp)
	
	const languages = ["Franska", "Svenska", "Spanska", "Arabiska", "Italienska"]
	let language1 = ""
	let language2 = ""
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
	
	shuffle(glosses);
	render_text(glossIndex + 1, document.getElementById("gloss_index"));
	render_text(glosses.length, document.getElementById("gloss_count"));
	render_text(steps(glosses.length), document.getElementById("lines"));
	plusGloss();
	slide_in("up", ".glossary_container", 1, false);


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
	
	if (answer.toLowerCase() == glosses[glossIndex][0].toLowerCase()) {
		if(glossIndex >= glosses.length-1) { close(); return; }
		animation()
	} else {
		similarity_score = similarity(answer, glosses[glossIndex][0]);

		glossTries += 1;

		message = messages[Math.round(similarity_score * 10)];
		color = colors[Math.round(similarity_score * 10)]
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
	render_text("Översätt \"" + capitalizeFirstLetter(glosses[n][1] + "\"."), document.getElementById("gloss_output"));
	generate_tip();
	render_text(glosses[glossIndex][0], document.getElementById("answer"));
	glossTries = 0;
	
	[].forEach.call(document.querySelectorAll(".tooltip"), (el) => {
		el.classList.remove("active");
	})
	
	document.getElementById("input").value = "";
	document.getElementById("input").focus();		
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
