const modal = document.getElementById('modal');
const congradModal = document.getElementById('congradulations');
const closeModal = document.getElementById('closeModal');
const newPlayerFirstName = document.getElementById('newPlayerFirstName');
const newPlayerLastName = document.getElementById('newPlayerLastName');
const newPlayerEmail = document.getElementById('newPlayerEmail');
const easy = document.getElementById('easy');
const medium = document.getElementById('medium');
const hard = document.getElementById('hard');
const firstDeck = document.getElementById('firstDeck');
const secondDeck = document.getElementById('secondDeck');
const thirdDeck = document.getElementById('thirdDeck');
const cardsBackPath = './images/cardDecks/cardsBackSides/backRed.jpg';
const startNewGame = document.getElementById('startNewGame');
const timer = document.getElementById('timer');
const moves = document.getElementById('moves');
const Deck12 = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
const Deck9 = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9];
const Deck6 = [1,1,2,2,3,3,4,4,5,5,6,6];
let firstName, lastName, emailAddress;
let newStopWatch;
let movesCounter = 1, numberOfOpenedCards = 0, numberOfRemovedPairs = 0, idToRemeber = 1;
let difficulty = Deck6, deck = 'oldFrench';
let hours = 0, minutes = 0, seconds = 0;
//localStorage.records = {};

// show start modal by default
setTimeout(modal.style.display = "block", 1000);

// event listener for the start modal
let newGameForm = document.getElementById('formNewGame');
newGameForm.addEventListener('click', isTargetRadio);

function isTargetRadio(e) {
    if (e.target.nodeName === 'INPUT') {
        switch(e.target.id) {
            case 'easy':
            difficulty = Deck6;
            break;
            case 'medium':
            difficulty = Deck9;
            break;
            case 'hard':
            difficulty = Deck12;
            break;
            case 'firstDeck':
            deck = 'oldFrench';
            break;
            case 'secondDeck':
            deck = 'oldRussian';
            break;
            case 'thirdDeck':
            deck = 'mayanStyle';
        }
    }
}

// start new game
startNewGame.onclick = function() {
    modal.style.display = "none";   
    stopwatch();
    createCardDivsOnGameTable(deck, difficulty);
}

// close start modal by ckicking on X
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Stopwatch
function incrementStopwatch() {
    ++seconds;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) { 
            minutes = 0; 
            hours++; 
        }
    }
    let t = showElapsedTime();
    timer.textContent = t;
    stopwatch();
}

function showElapsedTime() {
    let t = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    return t;
}

function stopwatch() {
    newStopWatch = setTimeout(incrementStopwatch, 1000);
}

function stopStopwatch() {
    clearTimeout(newStopWatch);
}

// dial cards according to the pattern - distribute cards among three rows
function setNumberOfColumns(numberOfCards) {
	let cardsInRow;
	switch (numberOfCards) {
        case 12:
        cardsInRow = 4;
        break;
        case 18:
        cardsInRow = 6;
        break;
        case 24:        
        cardsInRow = 8;
	}
	return cardsInRow;
}

function createCardDivsOnGameTable(deck, difficulty) {
    let numberOfCards = difficulty.length;
    let numberOfColumns = setNumberOfColumns(numberOfCards);
    let randomizedDeck = shuffleDeck(difficulty);
    for (let i = 0; i < 3; i++) {
        let newRow = document.createElement("div");
        newRow.setAttribute("class", "rowOfCards");
        gameTable.appendChild(newRow);
        for (let j = 0; j < numberOfColumns; j++) {
            let currentCardId = i*numberOfColumns+j;
            let newFigure = document.createElement("figure");
            newRow.appendChild(newFigure);           
            newFigure.setAttribute("id", currentCardId);
            newFigure.setAttribute("data-pair", randomizedDeck[currentCardId]);
            newFigure.setAttribute("data-show", true);
            addFrontBackSides(newFigure, deck, randomizedDeck, currentCardId);
        }   
    }     
}

function addFrontBackSides (figure, deck, randomizedDeck, currentCardId) {
    // create back side
    let backDiv = document.createElement("div");
    let backSide = document.createElement("img");
    let frontImgPath = './images/cardDecks/' + deck + '/' + randomizedDeck[currentCardId] + '.jpg';
    backSide.setAttribute("src", frontImgPath);
    figure.appendChild(backDiv);
    backDiv.setAttribute("class", "back");
    backDiv.appendChild(backSide);
    // create front side
    let frontDiv = document.createElement("div");
    let frontSide = document.createElement("img");
    figure.appendChild(frontDiv);
    frontDiv.setAttribute("class", "front");
    frontDiv.appendChild(frontSide); 
    frontSide.setAttribute("src", cardsBackPath);
}

function shuffleDeck(array) {
    let currentIndex = array.length, temp, randomIndex;
    while (currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex--)
        temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

//congradulation modal
function congradulations() {
    //congradModal.style.display = "block";
    setTimeout(function() { alert(`Congradulations! Your time is ${showElapsedTime()}`); }, 1000);
}

//event listener for the card moves
setTimeout(function() {
    window.addEventListener('click', checkCard);
}, 0);

// event handler for the card moves
function checkCard(e) {
    const currentCard = e.target.parentNode.parentNode;
    const cardToCompare = document.getElementById(idToRemeber);
    if (currentCard.nodeName === 'FIGURE') {
        if (numberOfOpenedCards < 2) {
            openCard(currentCard);
            if (numberOfOpenedCards === 1) {
                idToRemeber = currentCard.id;
            }
        }
        if (numberOfOpenedCards === 2) {
            numberOfOpenedCards = 0;
            if (cardToCompare.dataset.pair === currentCard.dataset.pair) {
                hideMatchedCards(currentCard,cardToCompare);
                numberOfRemovedPairs++;
            } else {
                closeCards(currentCard,cardToCompare);
            }
        }
    }
    if (numberOfRemovedPairs >= (difficulty.length / 2)) { 
        stopStopwatch();
        congradulations();
    }
}

function openCard(card) {
    card.children[1].style.transform = "rotateY(-180deg)";
    card.children[0].style.transform = "rotateY(0deg)";
    moves.textContent = movesCounter++ ;
    numberOfOpenedCards++;
}

function closeCards(card1,card2) {
    setTimeout(function() {
        card1.children[1].style.transform = "rotateY(0deg)";
        card1.children[0].style.transform = "rotateY(180deg)";
        card2.children[1].style.transform = "rotateY(0deg)";
        card2.children[0].style.transform = "rotateY(180deg)";
    }, 700);
}

function hideMatchedCards (card1,card2) {
    setTimeout(function() {
        card1.setAttribute('data-show','false');
        card2.setAttribute('data-show','false');
    }, 800);
}
