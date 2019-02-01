/*
 * Create a list that holds all of your cards
 */ 
let toggledCards = [];
let moves = 0;
let clockIsStopped = true; 
let time = 0;
let clockTimer; 
let matched =0;
const TOTAL_PAIRS = 8;
resetCards();

let deck = document.querySelector('.deck');
const starList = document.querySelectorAll('.stars li');
const cards = document.querySelectorAll('.deck li');
const stars = document.querySelectorAll('.stars');
const clock = document.querySelector('.clock');

function shuffleDeck() {
	let cardsToShuffle = Array.from(document.querySelectorAll('.card'));
	let shuffledCards = shuffle(cardsToShuffle);
	for (let card of shuffledCards) {
		deck.appendChild(card);
	}
}
shuffleDeck();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

	deck.addEventListener('click', event => {
		const clickTarget = event.target;
		if (isClickValid(clickTarget)){
			if (clockIsStopped) {
				startClock();
				clockIsStopped = false;
			}
			toggleCard(clickTarget);
			addToggleCard(clickTarget);
			if (toggledCards.length === 2) {
				checkForMatch(clickTarget);
				addMove();
				checkScore();
		}
	}	
})

function isClickValid(clickTarget) {
	return (
		clickTarget.classList.contains('card') &&
		!clickTarget.classList.contains('match') &&
		toggledCards.length < 2 &&
		!toggledCards.includes(clickTarget)
	);
}

function toggleCard(card) {
	card.classList.toggle('open');
	card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
	toggledCards.push(clickTarget);
}

function checkForMatch() {
	if (
		toggledCards[0].firstElementChild.className ===
		toggledCards[1].firstElementChild.className) {
		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
		matched++;
		if (matched === TOTAL_PAIRS) {
		gameOver();
		}
	} else {
		setTimeout(function() {
			toggleCard(toggledCards[0]);
			toggleCard(toggledCards[1]);
			toggledCards = [];
		}, 1000);
	}
}

function addMove() {
	moves++;
	let movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

function checkScore() {
	if (moves === 12 || moves === 24
	){	hideStar();
	}
}
	
function hideStar(stars) {
	for (let star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

function startClock() {
	clockTimer = setInterval(function() {
		time++;
		displayTime();
		console.log(time);
	}, 1000);
}

function displayTime() {
	console.log(clock);
	clock.innerHTML = time;
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}	

function stopClock() {
	clearInterval(clockTimer);
}	

function toggleModal() {
	const modal = document.querySelector('.modal__background');
	modal.classList.toggle('hide');
}

function writeModalStats() {
	let timeStat = document.querySelector('.modal__time');
	let clockTime = document.querySelector('.clock').innerHTML;
	let movesStat = document.querySelector('.modal__moves');
	let starsStat = document.querySelector('.modal__stars');
	let stars = getStars();
	
	timeStat.innerHTML = `Time = ${clockTime}`;
	movesStat.innerHTML = `Moves = ${moves}`; 
	starsStat.innerHTML = `Stars = ${stars}`;
} 

function getStars(starList) {
	starCount = 0;
	for (let star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	return starCount;
}

document.querySelector('.modal__cancel').addEventListener('click', toggleModal);

document.querySelector('.modal__replay').addEventListener('click', replayGame);

document.querySelector('.restart').addEventListener('click', resetGame);

document.querySelector('.modal__close').addEventListener('click', toggleModal);

function resetGame() {
	matched = 0;
	toggledCards = [];
	resetClockAndTime();
	resetMoves();
	resetStars();
	resetCards();
	shuffleDeck();
}

function resetClockAndTime() {
	stopClock();
	clockIsStopped = true;
	time = 0;
	displayTime();
}

function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

function resetStars(stars) {
	stars = 0;
	for (let star of starList) {
		star.style.display = 'inline';
	}
}
	
function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
}

function replayGame() {
	matched = 0;
	resetGame();
	toggleModal();
	resetCards();
}

function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}
}
