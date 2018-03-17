let cards = new Array();

function loadCards() {
	let cardCount = 1;

	for(let i = 0; i < 16; i += 2) {
		cards[i] = "img"+cardCount+".svg";
		cards[i+1] = "img"+cardCount+".svg";
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




