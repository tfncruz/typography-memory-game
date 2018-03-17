const main = document.querySelector("main");

let cards = new Array();

function loadCards() {
	let cardCount = 1;

	for(let i = 0; i < 16; i += 2) {
		cards[i] = "background-image: url('./imgs/img"+cardCount+".svg');";
		cards[i+1] = "background-image: url('./imgs/img"+cardCount+".svg');";
		cardCount++;
	}

	shuffleCards();
}

function shuffleCards() {
	let currentIndex = cards.length-1;

	while(currentIndex >= 0) {
		let tmp = cards[currentIndex];
		let choice = Math.floor((Math.random() * 16) + 1);
		cards[currentIndex] = cards[choice];
		cards[choice] = tmp;
		--currentIndex;
	}
}

loadCards();

main.addEventListener("click", function(event) {

	const elem = event.target;
	const row = elem.id.split("_");
	elem.style.cssText = cards[row[1]-1];
});


