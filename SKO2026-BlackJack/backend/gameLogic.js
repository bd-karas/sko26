class BlackjackGame {
  constructor() {
    this.deck = this.createDeck();
    this.shuffleDeck();
    this.playerHand = [];
    this.dealerHand = [];
  }

  createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = [
      '2', '3', '4', '5', '6', '7', '8', '9', '10',
      'Jack', 'Queen', 'King', 'Ace'
    ];
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value });
      }
    }
    return deck;
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCard(hand) {
    const card = this.deck.pop();
    hand.push(card);
    return card;
  }

  calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (const card of hand) {
      if (card.value === 'Ace') {
        aceCount++;
        value += 11;
      } else if (['King', 'Queen', 'Jack'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }
    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount--;
    }
    return value;
  }

  startGame() {
    this.playerHand = [];
    this.dealerHand = [];
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);
    this.dealCard(this.playerHand);
    this.dealCard(this.dealerHand);
  }

  getGameState() {
    return {
      playerHand: this.playerHand,
      dealerHand: this.dealerHand,
      playerValue: this.calculateHandValue(this.playerHand),
      dealerValue: this.calculateHandValue(this.dealerHand),
    };
  }
}

module.exports = BlackjackGame;