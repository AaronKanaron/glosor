const renderText = (element_id, text) => {
	try{
		const element = document.querySelectorAll(element_id)
		element.forEach(el => {
			if (el.tagName == "INPUT") {
				el.value = text
			} else {
				el.textContent = text
			}
		})
		
	} catch {
		console.error("Error in renderText, element does not exist")
	}
}


const greetings = ["Hey! What's up?", "Hé ! Quoi de neuf ?", "¡Hola! ¿Qué pasa?", "Hej! Hur är läget?", "Hey! Was gibt's?", "やあ、どうしたんだい？", "Эй! Как дела?"]
const greeting = () => {
	//make greeting text to a random choice from the array greetings
	let random_greeting = greetings[Math.floor(Math.random() * greetings.length)];
	//set element with id greeting to the text
	renderText("#greeting", "👋 " + random_greeting );
}


//on page load
window.onload = () => {
	//set the greeting text
	greeting();
}