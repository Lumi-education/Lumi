import CardPool from './h5p-dialogcards-card-pool';
import CardPile from './h5p-dialogcards-card-pile';

class CardManager {
  /**
   * @constructor
   *
   * @param {object} params Parameters from content type.
   * @param {number} contentId Id of content.
   * @param {object} callbacks Callbacks to parent.
   */
  constructor(params, contentId, callbacks) {
    this.params = params;
    this.cardPool = new CardPool(params, contentId, callbacks);

    this.reset();

    return this;
  }

  /**
   * Create a selection of card ids depending on mode.
   *
   * @return {object[]} Selection of card ids.
   */
  createSelection() {
    let selectionIds = [];

    switch (this.params.mode) {
      case 'repetition':
        // Repetition mode
        selectionIds = this.createSelectionRepetition();
        break;
      default:
        // Normal mode
        selectionIds = this.cardPool.getCardIds();
    }

    return selectionIds;
  }

  /**
   * Create card piles depending on mode.
   */
  createPiles() {
    this.cardPiles = [];
    const pool = this.cardPool.getCardIds();

    switch (this.params.mode) {
      case 'repetition':
        // Repetition mode
        for (let i = 0; i < this.params.behaviour.maxProficiency; i++) {
          if (i === 0) {
            this.cardPiles.push(new CardPile(pool));
          }
          else {
            this.cardPiles.push(new CardPile());
          }
        }
        break;

      case 'normal':
        // Normal mode. One pile only with all cards
        this.cardPiles.push(new CardPile(pool));
    }
  }

  /**
   * Update piles.
   *
   * Just one "rule" for now. Could be amended with more modes.
   *
   * @param {object[]} results Results.
   * @param {number} results.cardId Card that result is reported for.
   * @param {boolean} results.result Result for that card.
   * @return {number[]} Card pile sizes.
   */
  updatePiles(results) {
    results.forEach(result => {
      // Find card in pile
      const pileId = this.find(result.cardId);
      if (pileId === -1) {
        return;
      }

      // Move card to next pile or first pile
      let newPileId = (result.result === true) ? pileId + 1 : 0;
      newPileId = Math.max(0, Math.min(newPileId, this.cardPiles.length - 1));
      this.cardPiles[pileId].remove(result.cardId);
      this.cardPiles[newPileId].add(result.cardId, 'bottom');
    });

    return this.cardPiles.map(pile => pile.length());
  }

  /**
   * Create card selection for repetition mode.
   *
   * Draw all cards from first pile with cards, 1/2 of next, 1/3 of next, ...
   * Don't draw cards from last pile
   * Get cards from top - will be moved at the bottom of other pile according to results (LIFO)
   *
   * @return {object[]} Ids of selected cards from pool.
   */
  createSelectionRepetition() {
    let selectionIds = [];

    let firstPileWithCards = null;
    for (let j = 0; j < this.cardPiles.length - 1; j++) {
      const pileAmount = this.cardPiles[j].length();

      // Skip empty piles
      if (firstPileWithCards === null && pileAmount === 0) {
        continue;
      }

      // Remember first pile with cards
      if (firstPileWithCards === null) {
        firstPileWithCards = j;
      }

      // Draw cards favoring those of piles with low id
      const drawAmount = Math.ceil(pileAmount * 1 / (1 + j - firstPileWithCards));
      const cardsDrawn = this.cardPiles[j].peek(0, drawAmount);
      selectionIds = selectionIds.concat(...cardsDrawn);
    }

    // Shuffle selection
    selectionIds = this.shuffle(selectionIds);

    return selectionIds;
  }

  /**
   * Shuffle items (not in place).
   *
   * @param {object[]} items Items.
   * @return {object[]} Shuffled items.
   */
  shuffle(items) {
    const copies = items.slice();
    for (let i = copies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copies[i], copies[j]] = [copies[j], copies[i]];
    }
    return copies;
  }

  /**
   * Find id of pile that contains card with particular id.
   *
   * @param {number} id Id of card to be found.
   * @return {number} Id of pile or -1.
   */
  find(id) {
    let found = -1;
    this.cardPiles.forEach((cardPile, index) => {
      if (found !== -1) {
        return found;
      }
      if (cardPile.contains(id))  {
        found = index;
      }
    });
    return found;
  }

  /**
   * Reset Card Manager.
   */
  reset() {
    this.createPiles();
  }

  /**
   * Retrieve card from pool. Will be loaded on call.
   *
   * @param {number} id Id of card to be retrieved.
   */
  getCard(id) {
    return this.cardPool.getCard(id);
  }
}

export default CardManager;
