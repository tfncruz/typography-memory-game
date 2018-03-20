const main = document.querySelector("main");

/*
* modal popup vars
*/
const modalPopup = document.querySelector("#modal-popup");
const playAgainBtn = document.querySelector("#play-again-btn");
const lastTen = document.querySelector("#last-ten");
const lastTenSubmitBtn = document.querySelector("#last-ten-submit-btn");

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
	moveCounter.innerText = "000";
	stars.innerText = "***";

	// load new cards in the cards array
	loadCards();
}

/*
* update move counter
*/
function updateMoveCounter() {
	++moves;

	if(moves > 16) stars.innerText = "**";
	else if(moves > 24) stars.innerText = "*";

	if(moves < 10) moveCounter.innerText = "00"+moves;
	else if(moves > 9 && moves < 100) moveCounter.innerText = "0"+moves;
	else moveCounter.innerText = moves;
}

/*
* display last ten
*/
function displayLastTen() {

	const lastTenList = document.querySelector("#last-ten-list");

	//remove rows
	while(lastTenList.firstChild) {
		lastTenList.removeChild(lastTenList.firstChild);
	}

	let fragment = document.createDocumentFragment();

    for(let i = 0; i < localStorage.length; i++) {
    	let row = document.createElement("tr");
    	row.innerHTML = localStorage.getItem(localStorage.key(i));

    	fragment.appendChild(row);
	}

    lastTenList.appendChild(fragment);
}

/*
* delete oldest entry in Last 10 list (modal popup)
* the lowest number is the oldest
*/
function deleteOldestEntry() {
	let old_value = undefined;
	let old_index = undefined;

	// go throught the localStorage and find the lowest timestamp
	// that is attached to the name (separated by "_")
	for(let i = 0; i < localStorage.length; i++) {

		// tmp[1] will have the timestamp
		let tmp = localStorage.key(i).split("_");

		// if it is undefined/lower than the old value saved, substitute
		if(old_value === undefined) {
			old_value = tmp[1];
			old_index = i;

		} else if(old_value > tmp[1]) {
			old_value = tmp[1];
			old_index = i;
		}
	}

	localStorage.removeItem(localStorage.key(old_index));
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

			displayLastTen();

			modalPopup.classList.toggle("hidden");

			// prevent adding a new entry to the last 10 list
			document.querySelector("#last-ten-submit").classList.remove("hidden");
		}
	}
});

/*
* (reset button) listener for a click and handler
*/
resetBtn.addEventListener("click", function() { resetGame(); });

/*
* (play again button) listener for a click and handler
*/
playAgainBtn.addEventListener("click", function() {
	modalPopup.classList.toggle("hidden");
	resetGame();
});

/*
* (last 10 submit button) listener for a click and handler
*/
lastTenSubmitBtn.addEventListener("click", function() {
	let user = document.querySelector("#last-ten-username").value;

	//clear the field
	document.querySelector("#last-ten-username").value = "";

	// don't allow empty string
	if(user !== "") {

		user.trim();

		let tds = "<td>"+timer.innerText+
		"</td><td>"+stars.innerText+
		"</td><td>"+moves+
		" moves</td><td>"+user+"</td>";

		// save on localStorage the user + timestamp and table td(s)
		localStorage.setItem(user+"_"+Date.now(), tds);

		// if localStorage is more big than 10 entries, delete oldest
		if(localStorage.length > 10) deleteOldestEntry();

		displayLastTen();

		// prevent from adding more than one entry
		document.querySelector("#last-ten-submit").classList.add("hidden");

	} else document.querySelector(".validation-msg").innerText = "please provide a valid name";
});


