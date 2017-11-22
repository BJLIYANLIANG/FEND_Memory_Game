/*
 * Create a list that holds all of your cards
 */
const cardsHtmlElem = $('.card');

const ICONS = [ 'fa-diamond', 'fa-paper-plane-o', 'fa-bank', 'fa-bolt',
                'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle'];
const ICONSx2 = [...ICONS, ...ICONS];

const STATE = {HIDE: 0, SHOW: 1, MATCH: 2, ERROR: 3, }; 

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

/**
 * class Card code 
 * @param {*} index 
 * @param {*} htmlElem 
 * @param {*} icon 
 */

let Card = function(index, htmlElem, icon) {
    this.index = index;
    this.htmlElem = htmlElem;
    this.icon = icon;
    this.status = STATE.HIDE;
};

Card.prototype.init = function() {
    this.htmlElem.id = this.index;
    this.htmlElem.attr('class', 'card');
    this.htmlElem.find('i').attr('class',`fa ${this.icon}`);
};

Card.prototype.show = function() {
    this.htmlElem.attr('class', 'card open show');
    this.status = STATE.SHOW;
};

Card.prototype.hide = function() {
    this.htmlElem.attr('class', 'card');
    this.status = STATE.HIDE;
};

Card.prototype.error = function() {
    this.htmlElem.attr('class', 'card error');
    this.status = STATE.ERROR;
}

Card.prototype.markAsMatch = function() {
    this.htmlElem.attr('class', 'card match show');
    this.status = STATE.MATCH;
};

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
let cards;
let lastClickIndex;
let moveCounter;
let stars;

function startGame() {
    cards = [];
    lastClickIndex = -1;
    moveCounter = 0;
    stars = 3;
    showMoveCounter();

    //let card_icons = shuffle(ICONSx2)
    let card_icons = ICONSx2;
    const cardCount = card_icons.length;   
    
    for (let i = 0; i < cardCount; i ++) {
        let card = new Card(i, cardsHtmlElem.eq(i), card_icons[i]);
        card.init();
        cards.push(card);
        //card.htmlElem.addEventListener('click', function(event) {
        card.htmlElem.on('click', function(event) {
            cardClickEvent(card)
        });   
    }
};

function cardClickEvent(card){
    console.log("clicked " + card.index);
    if (card.status == STATE.HIDE) {
        card.show();
        setTimeout(checkMatching, 300, card);
    }
};

function showMoveCounter() {
    $('.moves').text(moveCounter);
    starsHtmlElem = $('.stars').first().children('i');    
    if (moveCounter < 16) {
        stars = 3;
        starsHtmlElem.eq(0).attr("class", "fa fa-star");
        starsHtmlElem.eq(1).attr("class", "fa fa-star");
        starsHtmlElem.eq(2).attr("class", "fa fa-star");
    } else if (moveCounter < 25) {
        stars = 2.5;
        starsHtmlElem.eq(0).attr("class", "fa fa-star");
        starsHtmlElem.eq(1).attr("class", "fa fa-star");
        starsHtmlElem.eq(2).attr("class", "fa fa-star-half-o");
    } else if (moveCounter < 30) {
        stars = 2;
        starsHtmlElem.eq(0).attr("class", "fa fa-star");
        starsHtmlElem.eq(1).attr("class", "fa fa-star");
        starsHtmlElem.eq(2).attr("class", "fa fa-star-o");
    } else if (moveCounter < 40) {
        stars = 1.5;
        starsHtmlElem.eq(0).attr("class", "fa fa-star");
        starsHtmlElem.eq(1).attr("class", "fa fa-star-half-o");
        starsHtmlElem.eq(2).attr("class", "fa fa-star-o");
    } else if (moveCounter < 50) {
        stars = 1;
        starsHtmlElem.eq(0).attr("class", "fa fa-star");
        starsHtmlElem.eq(1).attr("class", "fa fa-star-o");
        starsHtmlElem.eq(2).attr("class", "fa fa-star-o");
    } else if (moveCounter < 60) {
        stars = 0.5;
        starsHtmlElem.eq(0).attr("class", "fa fa-star-half-o");
        starsHtmlElem.eq(1).attr("class", "fa fa-star-o");
        starsHtmlElem.eq(2).attr("class", "fa fa-star-o");
    } else {
        stars = 0;
        starsHtmlElem.eq(0).attr("class", "fa fa-star-o");
        starsHtmlElem.eq(1).attr("class", "fa fa-star-o");
        starsHtmlElem.eq(2).attr("class", "fa fa-star-o");
    }
};

function checkMatching(card) {
    if (lastClickIndex == -1) {
        lastClickIndex = card.index;
    } else {
        moveCounter ++
        showMoveCounter();
        if (cards[lastClickIndex].icon != card.icon) {
            // no match
            card.error();
            cards[lastClickIndex].error();
            setTimeout(gotoHide, 300, card, cards[lastClickIndex]);
        } else {
            // match
            card.markAsMatch();
            cards[lastClickIndex].markAsMatch();
            checkGameCompletetion();
        }
        lastClickIndex = -1;
    }
};

function gotoHide(card, oldCard) {
    card.hide();
    oldCard.hide();
};

function checkGameCompletetion() {
    for(let card of cards) {
		if(card.status != STATE.MATCH) {
			return;
		}
    }

    let msg = $('.success-sub-msg');
	msg.text(msg.text().replace('#{move}', moveCounter).replace(
        '#{stars}', stars));
	$('#game-success').addClass("fullScreen");
}

$(function(){
	startGame();
});