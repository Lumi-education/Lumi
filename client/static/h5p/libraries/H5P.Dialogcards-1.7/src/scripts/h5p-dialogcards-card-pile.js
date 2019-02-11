class CardPile {
  /**
   * @constructor
   *
   * @params {object[]} cards Card Ids.
   */
  constructor(cards=[]) {
    // Only use unique values
    this.cards = cards.filter((item, index) => cards.indexOf(item) >= index);

    return this;
  }

  /**
   * Get complete card pile.
   */
  getCards() {
    return this.cards;
  }

  /**
   * Peek at card in pile.
   *
   * @param {number|string} position Position to peek at.
   * @param {number} [amount=1] Number of cards to peek at.
   */
  peek(position, amount=1) {
    amount = Math.max(0, amount);
    if (position === 'top') {
      position = 0;
    }
    if (position === 'bottom') {
      position = this.cards.length - amount;
    }
    if (position < 0 || position > this.cards.length -1) {
      return [];
    }

    return this.cards.slice(position, position + amount);
  }

  /**
   * Add cards to the pile.
   *
   * @param {number|object[]} ids Id or array of card ids to be added.
   * @param {number|string} [position='top'] Position to add cards to (top|bottom), can be amended.
   */
  add(ids, position='top') {
    if (typeof ids === 'number') {
      ids = [ids];
    }

    ids.forEach(id => {
      if (this.cards.indexOf(id) !== -1) {
        return;
      }

      if (position === 'top') {
        position = 0;
      }
      else if (position === 'bottom') {
        position = this.cards.length;
      }
      else if (position === 'random') {
        position = Math.floor(Math.random() * (this.cards.length));
      }

      this.cards.splice(position, 0, ...ids);
    });
  }

  /**
   * Shorthand for adding cards to top.
   *
   * @param {number|object[]} ids Id or array of card ids to be added.
   */
  push(ids) {
    this.add(ids, 'top');
  }

  /**
   * Pull consecutive cards from the pile.
   *
   * @param {number} [amount=1] Amount of cards to be pulled.
   * @param {number|string} [position='top'] Position to take cards from. Default top.
   */
  pull(amount=1, position='top') {
    amount = Math.max(1, Math.min(amount, this.cards.length));

    if (position === 'top') {
      position = 0;
    }
    if (position === 'bottom') {
      position = -amount;
    }
    position = Math.max(0, Math.min(position, this.cards.length-1));

    return this.cards.splice(position, amount);
  }

  /**
   * Remove cards from the pile.
   *
   * @param {number|object[]} ids Id or array of card ids to be removed.
   */
  remove(ids) {
    if (typeof ids === 'number') {
      ids = [ids];
    }

    ids.forEach(id => {
      const position = this.cards.indexOf(id);
      if (position > -1) {
        this.cards.splice(position, 1);
      }
    });
  }

  /**
   * Shuffle pile in place.
   *
   * @return {object[]} Shuffled cards.
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }

    return this.cards;
  }

  /**
   * Check if id is in pile.
   *
   * @return {boolean} True, if card is in pile.
   */
  contains(id) {
    return this.cards.indexOf(id) !== -1;
  }

  /**
   * Get amount of cards on pile.
   *
   * @return {number} Amount of cards on pile.
   */
  length() {
    return this.cards.length;
  }
}

export default CardPile;
