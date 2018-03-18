const main = document.querySelector("main");

/*
* modal popup vars
*/
const modalPopup = document.querySelector("#modal-popup");
const playAgainBtn = document.querySelector("#play-again-btn");

/*
* header vars
*/
const resetBtn = document.querySelector("#reset-btn");

const timer = document.querySelector("#timer");
let seconds = 0;
let minutes = 0;
let timerIntervalID = setInterval(updateTimer, 1000);

const moveCounter = document.querySelector("#move-counter");
let moves = 0;

const stars = document.querySelector("#stars");

/*
* cards vars
*/
const cards = new Array();
let cardSelected1;
let cardSelected2;
let noMatch = false;
let cardsFound = 0;

// ------------------------------------------ FUNCTIONS

/*
* Load cards array with images (css class)
*/
function loadCards() {

	let imageCount = 1;

	for(let i = 0; i < 16; i += 2) {
		cards[i] = "image"+imageCount;
		cards[i+1] = "image"+imageCount;

		imageCount++;
	}

	// shuffle the images inside the array
	shuffleImages();
}

/*
* shuffle the cards array
*/
function shuffleImages() {

	let currentIndex = cards.length-1;
	let index = 15;

	while(currentIndex >= 0) {
		let tmp = cards[currentIndex];
		let choice = Math.floor((Math.random() * index) + 1);
		cards[currentIndex] = cards[choice];
		cards[choice] = tmp;
		--currentIndex;
		--index;
	}
}

/*
* clear last two wrong cards choosen
*/
function clearLastTwo() {
	let classes1 = cardSelected1.classList;
	let classes2 = cardSelected2.classList;

	cardSelected1.classList.toggle(classes1[1]);
	cardSelected2.classList.toggle(classes2[1]);
	cardSelected1.classList.toggle("back");
	cardSelected2.classList.toggle("back");

	cardSelected1 = undefined;
	cardSelected2 = undefined;

	// allow new click
	noMatch = false;
}

/*
* manages timer
*/
function updateTimer() {
	let m, s;

	if(seconds < 59) ++seconds;
	else {
		++minutes;
		seconds = 0;
	}

	minutes < 10 ? m = "0"+minutes : m = minutes;
	seconds < 10 ? s = "0"+seconds : s = seconds;

    timer.innerHTML = m+":"+s;
}

/*
* resets the game and its variables
*/
function resetGame() {

	// init new timer
	clearInterval(timerIntervalID);
	seconds = 0;
	minutes = 0;
	timerIntervalID = setInterval(updateTimer, 1000);

	// clear selected cards and cards found
	cardSelected1 = undefined;
	cardSelected2 = undefined;
	cardsFound = 0;

	// reset cards class (turn them all back)
	let allCards = document.querySelectorAll(".card-container");
	for(let i = 0; i < allCards.length; i++) {
		let cardClasses = allCards[i].classList;
		if(cardClasses[1] !== "back") {
			allCards[i].classList.toggle(cardClasses[1]);
			allCards[i].classList.toggle("back");
		}
	}

	// reset moves and stars
	moves = 0;
	moveCounter.innerHTML = "000";
	stars.innerHTML = "***";

	// load new cards in the cards array
	loadCards();
}

/*
* update move counter
*/
function updateMoveCounter() {
	++moves;

	if(moves > 16) stars.innerHTML = "**";
	else if(moves > 24) stars.innerHTML = "*";

	if(moves < 10) moveCounter.innerHTML = "00"+moves;
	else if(moves > 9 && moves < 100) moveCounter.innerHTML = "0"+moves;
	else moveCounter.innerHTML = moves;
}

/*
* load the cards array with the images
*/
loadCards();

// -------------------------------------------------- Event listeners and handlers

/*
* (main element) listener for a click and handler
*/
main.addEventListener("click", function(event) {

	const element = event.target;

	// if the click was in a available card,
	// cardsFound is less than 8 (still available pairs to find)
	// and is allowed (noMatch is false)
	if(element.classList.contains("card-container") &&
		element.classList.contains("back") &&
		cardsFound < 8 && noMatch === false) {

		// turn the card and store a reference to that element
		// in cardSelected1 or cardSelected2
		const row = event.target.id.split("_");
		element.classList.toggle(cards[row[1]-1]); // this row[1]-1 could be better solved with a regular expression...
		element.classList.toggle("back");

		if(cardSelected1 === undefined) cardSelected1 = element;
		else {
			cardSelected2 = element;
			// 2 clicks equals 1 move
			updateMoveCounter();
		}

		// if cardSelected1 and cardSelected2 are set
		if(cardSelected1 !== undefined && cardSelected2 !== undefined) {

			// compare
			classes1 = cardSelected1.classList;
			classes2 = cardSelected2.classList;

			if(classes1[1] !== classes2[1]) {
				// prevent new click before timeout finishes
				noMatch = true;
				setTimeout(clearLastTwo, 1000);

			} else {
				++cardsFound;
				//reset selected cards
				cardSelected1 = undefined;
				cardSelected2 = undefined;
			}
		}

		// if cardsFound equals 8, won
		if(cardsFound === 8) {

			// stop timer
			clearInterval(timerIntervalID);

			document.querySelector("#time-spent").innerText = "in "+timer.innerText;
			document.querySelector("#moves-spent").innerText = "with "+moves+" moves";
			document.querySelector("#stars-rating").innerText = stars.innerText;

			modalPopup.classList.toggle("hidden");
		}
	}
});

resetBtn.addEventListener("click", function(event) {
	event.preventDefault();
	resetGame();
});

playAgainBtn.addEventListener("click", function(event) {
	modalPopup.classList.toggle("hidden");
	resetGame();
});


