import CardManager from './h5p-dialogcards-card-manager';
import SummaryScreen from './h5p-dialogcards-summary-screen';

const $ = H5P.jQuery;
const JoubelUI = H5P.JoubelUI;

class Dialogcards extends H5P.EventDispatcher {
  /**
   * Initialize module.
   *
   * @constructor
   *
   * @param {Object} params Parameters.
   * @param {Number} id Content id.
   * @param {Object} contentData Content data, e.g. for saveContentState
   * @returns {DialogCards} self
   */
  constructor(params, id, contentData) {
    super();

    this.contentId = this.id = id;

    // Var cardOrder stores order of cards to allow resuming of card set.
    // Var progress stores current card index.
    this.contentData = contentData || {};

    // Set default behavior.
    this.params = $.extend({
      title: '',
      mode: 'normal',
      description: "Sit in pairs and make up sentences where you include the expressions below.<br/>Example: I should have said yes, HOWEVER I kept my mouth shut.",
      next: "Next",
      prev: "Previous",
      retry: "Retry",
      answer: "Turn",
      correctAnswer: 'I got it right!',
      incorrectAnswer: 'I got it wrong',
      round: 'Round @round',
      cardsLeft: 'Cards left: @number',
      nextRound: 'Proceed to round @round',
      showSummary: 'Next',
      summary: 'Summary',
      summaryCardsRight: 'Cards you got right:',
      summaryCardsWrong: 'Cards you got wrong:',
      summaryCardsNotShown: 'Cards in pool not shown:',
      summaryOverallScore: 'Overall Score',
      summaryCardsCompleted: 'Cards you have completed learning:',
      summaryCompletedRounds: 'Completed rounds:',
      summaryAllDone: 'Well done! You got all @cards cards correct @max times in a row each!',
      progressText: "Card @card of @total",
      cardFrontLabel: "Card front",
      cardBackLabel: "Card back",
      tipButtonLabel: 'Show tip',
      audioNotSupported: 'Your browser does not support this audio',
      dialogs: [
        {
          text: 'Horse',
          answer: 'Hest'
        },
        {
          text: 'Cow',
          answer: 'Ku'
        }
      ],
      behaviour: {
        enableRetry: true,
        disableBackwardsNavigation: false,
        scaleTextNotCard: false,
        randomCards: false,
        maxProficiency: 5,
        quickProgression: false
      }
    }, params);

    this.cards = [];

    this.currentCardId = 0;
    this.round = 0; // 0 indicates that DOM needs to be set up
    this.results = [];

    /**
     * Attach h5p inside the given container.
     *
     * @param {jQuery} $container Container.
     */
    this.attach = ($container) => {
      this.$inner = $container.addClass('h5p-dialogcards');
      if (this.params.behaviour.scaleTextNotCard) {
        $container.addClass('h5p-text-scaling');
      }

      // Only pass what's necessary
      const managerParams = {
        mode: this.params.mode,
        dialogs: this.params.dialogs,
        audioNotSupported: this.params.audioNotSupported,
        answer: this.params.answer,
        showSummary: this.params.showSummary,
        incorrectAnswer: this.params.incorrectAnswer,
        correctAnswer: this.params.correctAnswer,
        progressText: this.params.progressText,
        tipButtonLabel: this.params.tipButtonLabel,
        behaviour: {
          scaleTextNotCard: this.params.behaviour.scaleTextNotCard,
          maxProficiency: this.params.behaviour.maxProficiency,
          quickProgression: this.params.behaviour.quickProgression
        }
      };

      this.cardManager = new CardManager(managerParams, this.id, {
        onCardTurned: this.handleCardTurned,
        onNextCard: this.nextCard
      });

      this.createDOM(this.round === 0);

      this.updateNavigation();
      this.trigger('resize');
    };

    /**
     * Create DOM.
     * @param {boolean} firstCall Is first call?
     */
    this.createDOM = (firstCall) => {
      this.cardIds = this.cardManager.createSelection();
      this.cardPoolSize = this.cardPoolSize || this.cardIds.length;

      if (firstCall === true) {
        const title = $('<div>' + this.params.title + '</div>').text().trim();
        this.$header = $((title ? '<div class="h5p-dialogcards-title"><div class="h5p-dialogcards-title-inner">' + this.params.title + '</div></div>' : '') +
          '<div class="h5p-dialogcards-description">' + this.params.description + '</div>');

        this.summaryScreen = new SummaryScreen(this.params, {nextRound: this.nextRound, retry: this.restartRepetition});
      }

      if (firstCall === true) {
        this.$cardwrapperSet = this.initCards(this.cardIds);
      }
      else {
        this.$cardwrapperSet.remove();
        this.$cardwrapperSet = this.initCards(this.cardIds);
        this.$cardSideAnnouncer.before(this.$cardwrapperSet);
      }

      this.$cardwrapperSet.prepend(this.summaryScreen.getDOM());

      if (firstCall === true) {
        this.$cardSideAnnouncer = $('<div>', {
          html: this.params.cardFrontLabel,
          'class': 'h5p-dialogcards-card-side-announcer',
          'aria-live': 'polite',
          'aria-hidden': 'true'
        });

        this.$footer = this.createFooter();

        this.$mainContent = $('<div>')
          .append(this.$header)
          .append(this.$cardwrapperSet)
          .append(this.$cardSideAnnouncer)
          .append(this.$footer)
          .appendTo(this.$inner);

        this.on('reset', function () {
          this.reset();
        });

        this.on('resize', this.resize);

        this.round = 1;
      }
    };

    /**
     * Create footer/navigation line
     *
     * @returns {*|jQuery|HTMLElement} Footer element
     */
    this.createFooter = () => {
      const $footer = $('<nav>', {
        'class': 'h5p-dialogcards-footer',
        'role': 'navigation'
      });

      if (this.params.mode === 'normal') {
        this.$prev = JoubelUI.createButton({
          'class': 'h5p-dialogcards-footer-button h5p-dialogcards-prev truncated',
          'aria-label': this.params.prev,
          'title': this.params.prev
        }).click(() => {
          this.prevCard();
        }).appendTo($footer);

        this.$next = JoubelUI.createButton({
          'class': 'h5p-dialogcards-footer-button h5p-dialogcards-next truncated',
          'aria-label': this.params.next,
          'title': this.params.next
        }).click(() => {
          this.nextCard();
        }).appendTo($footer);

        this.$retry = JoubelUI.createButton({
          'class': 'h5p-dialogcards-footer-button h5p-dialogcards-retry h5p-dialogcards-disabled',
          'aria-title': this.params.retry,
          'title': this.params.retry,
          'html': this.params.retry
        }).click(() => {
          this.trigger('reset');
        }).appendTo($footer);

        this.$progress = $('<div>', {
          'class': 'h5p-dialogcards-progress',
          'aria-live': 'assertive'
        }).appendTo($footer);
      }
      else {
        this.$round = $('<div>', {
          'class': 'h5p-dialogcards-round'
        }).appendTo($footer);

        this.$progress = $('<div>', {
          'class': 'h5p-dialogcards-cards-left',
          'aria-live': 'assertive'
        }).appendTo($footer);
      }

      return $footer;
    };

    /**
     * Called when all cards has been loaded.
     */
    this.updateImageSize = () => {
      // Find highest card content
      let relativeHeightCap = 15;
      let height = 0;

      const $currentCardContent = this.cards[this.currentCardId].getDOM().find('.h5p-dialogcards-card-content');

      this.params.dialogs.forEach(dialog => {
        if (!dialog.image) {
          return;
        }

        const imageHeight = dialog.image.height / dialog.image.width * $currentCardContent.get(0).getBoundingClientRect().width;
        if (imageHeight > height) {
          height = imageHeight;
        }
      });

      if (height > 0) {
        let relativeImageHeight = height / parseFloat(this.$inner.css('font-size'));
        if (relativeImageHeight > relativeHeightCap) {
          relativeImageHeight = relativeHeightCap;
        }
        this.cards.forEach(card => {
          card.getImage().parent().css('height', relativeImageHeight + 'em');
        });
      }
    };

    /**
     * Creates all cards and appends them to card wrapper.
     *
     * @param {object[]} cardIds Card ids.
     * @returns {*|jQuery|HTMLElement} Card wrapper set
     */
    this.initCards = (cardIds) => {
      const initLoad = 2;
      this.cards = [];
      this.currentCardId = 0;

      // Randomize cards order
      if (this.params.behaviour.randomCards) {
        cardIds = H5P.shuffleArray(cardIds);
      }

      const $cardwrapperSet = $('<div>', {
        'class': 'h5p-dialogcards-cardwrap-set'
      });

      for (let i = 0; i < cardIds.length; i++) {
        // Load cards progressively
        if (i >= initLoad) {
          break;
        }

        const card = this.getCard(cardIds[i]);
        card.setProgressText(i + 1, cardIds.length);

        this.cards.push(card);
        const $cardWrapper = card.getDOM();

        // Set current card
        if (i === this.currentCardId) {
          $cardWrapper.addClass('h5p-dialogcards-current');
          this.$current = $cardWrapper;
        }

        card.addTipToCard($cardWrapper.find('.h5p-dialogcards-card-content'), 'front', i);

        $cardwrapperSet.append($cardWrapper);
      }

      return $cardwrapperSet;
    };

    /**
     * Handle card turned.
     *
     * @param {boolean} turned - True, if card is turned.
     */
    this.handleCardTurned = (turned) => {
      // a11y notification
      this.$cardSideAnnouncer.html(turned ? this.params.cardFrontLabel : this.params.cardBackLabel);

      // retry button
      if (this.params.behaviour.enableRetry && this.currentCardId + 1 === this.cardIds.length) {
        if (this.$retry) {
          this.$retry.removeClass('h5p-dialogcards-disabled');
          this.truncateRetryButton();
        }
      }
    };

    /**
     * Update navigation text and show or hide buttons.
     */
    this.updateNavigation = () => {
      if (this.params.mode === 'normal') {
        // Final card
        if (this.currentCardId < this.cardIds.length - 1) {
          this.$next.removeClass('h5p-dialogcards-disabled');
          this.$retry.addClass('h5p-dialogcards-disabled');
        }
        else {
          this.$next.addClass('h5p-dialogcards-disabled');
        }

        // First card
        if (this.currentCardId > 0 && !this.params.behaviour.disableBackwardsNavigation) {
          this.$prev.removeClass('h5p-dialogcards-disabled');
        }
        else {
          this.$prev.addClass('h5p-dialogcards-disabled');
        }

        this.$progress.text(this.params.progressText.replace('@card', this.currentCardId + 1).replace('@total', this.cardIds.length));

        this.cards[this.currentCardId].resizeOverflowingText();
      }
      else {
        this.$round.text(this.params.round.replace('@round', this.round));
        this.$progress.text(this.params.cardsLeft.replace('@number', this.cardIds.length - this.currentCardId));
      }

      this.trigger('resize');
    };

    /**
     * Show summary screen.
     */
    this.showSummary = () => {
      // Update piles and retrieve the new pile sizes
      const newPileSizes = this.cardManager.updatePiles(this.results);

      const right = this.results.filter(result => result.result === true).length;
      const wrong = this.results.length - right;
      const notShown = this.cardPoolSize - right - wrong;
      const completed = newPileSizes.slice(-1)[0];
      const done = completed === this.cardPoolSize;

      const summary = {
        round: this.round,
        results: [
          {
            field: 'h5p-dialogcards-round-cards-right',
            score: {value: right, max: wrong + right}
          },
          {
            field: 'h5p-dialogcards-round-cards-wrong',
            score: {value: wrong, max: wrong + right}
          },
          {
            field: 'h5p-dialogcards-round-cards-not-shown',
            score: {value: notShown}
          },
          {
            field: 'h5p-dialogcards-overall-cards-completed',
            score: {value: completed, max: this.cardPoolSize}
          },
          {
            field: 'h5p-dialogcards-overall-completed-rounds',
            score: {value: this.round}
          }
        ]
      };

      if (done) {
        summary.done = true;
        summary.message = this.params.summaryAllDone
          .replace('@cards', this.cardPoolSize)
          .replace('@max', this.params.behaviour.maxProficiency - 1);
      }

      this.summaryScreen.update(summary);
      this.summaryScreen.show();
      this.hideCards();

      this.trigger('resize');
    };

    /**
     * Show main content.
     */
    this.showCards = () => {
      this.$cardwrapperSet.find('.h5p-dialogcards-cardwrap').removeClass('h5p-dialogcards-gone');
      this.$footer.removeClass('h5p-dialogcards-gone');
      this.cardsShown = true;
    };

    /**
     * Hide main content.
     */
    this.hideCards = () => {
      this.$cardwrapperSet.find('.h5p-dialogcards-cardwrap').addClass('h5p-dialogcards-gone');
      this.$footer.addClass('h5p-dialogcards-gone');
      this.cardsShown = false;
    };

    /**
     * Show next card.
     *
     * @param {object} [result] Optional result of repetition mode.
     */
    this.nextCard = (result) => {
      this.results.push(result);

      // On final card
      if (this.currentCardId + 1 === this.cardIds.length) {
        if (this.params.mode === 'repetition') {
          this.$progress.text(this.params.cardsLeft.replace('@number', 0));
          this.cards[this.currentCardId].showSummaryButton(this.showSummary);
        }
        return;
      }

      let currentCard = this.cards[this.currentCardId];
      currentCard.stopAudio();
      currentCard.getDOM().removeClass('h5p-dialogcards-current').addClass('h5p-dialogcards-previous');

      this.currentCardId++;
      currentCard = this.cards[this.currentCardId];
      currentCard.getDOM().addClass('h5p-dialogcards-current');
      currentCard.setCardFocus();

      const nextCardIndex = this.currentCardId + 1;
      // Load next card if it isn't loaded already
      if (nextCardIndex >= this.cards.length && nextCardIndex < this.cardIds.length) {
        const card = this.getCard(this.cardIds[nextCardIndex]);
        card.setProgressText(nextCardIndex + 1, this.cardIds.length);
        this.cards.push(card);

        const $cardWrapper = card.getDOM();
        $cardWrapper.appendTo(this.$cardwrapperSet);

        card.addTipToCard($cardWrapper.find('.h5p-dialogcards-card-content'), 'front', nextCardIndex);
        this.resize();
      }

      this.updateNavigation();
    };

    /**
     * Get card from card manager.
     * @param {number} id Card's Id.
     * @return {object} Card.
     */
    this.getCard = (id) => {
      const card = this.cardManager.getCard(id);
      card.createButtonListeners();

      return card;
    };

    /**
     * Show previous card.
     */
    this.prevCard = () => {
      if (this.currentCardId === 0) {
        return;
      }

      let currentCard = this.cards[this.currentCardId];
      currentCard.stopAudio();
      currentCard.getDOM().removeClass('h5p-dialogcards-current');

      this.currentCardId--;
      currentCard = this.cards[this.currentCardId];
      currentCard.getDOM().addClass('h5p-dialogcards-current').removeClass('h5p-dialogcards-previous');
      currentCard.setCardFocus();

      this.updateNavigation();
    };

    /**
     * Show all audio buttons
     */
    this.showAllAudio = () => {
      this.$cardwrapperSet.find('.h5p-audio-inner')
        .removeClass('hide');
    };

    this.restartRepetition = () => {
      this.cardManager.reset();
      this.round = 0;

      this.nextRound();
    };

    this.nextRound = () => {
      this.round++;
      this.summaryScreen.hide();
      this.showCards();

      this.reset();
      this.createDOM();
      this.cards[this.currentCardId].setCardFocus(true);

      this.updateNavigation();

      this.trigger('resize');
    };

    /**
     * Reset the task so that the user can do it again.
     */
    this.reset = () => {
      this.results = [];
      this.cards[this.currentCardId].stopAudio(this.$current.index());

      // Turn all cards to front
      this.cards.forEach(card => {
        card.reset();
      });

      // Show first card
      this.currentCardId = 0;
      if (this.params.mode === 'normal') {
        this.cards[this.currentCardId].getDOM().addClass('h5p-dialogcards-current');
      }
      this.updateNavigation();

      if (this.$retry) {
        this.$retry.addClass('h5p-dialogcards-disabled');
      }
      this.showAllAudio();

      this.cards[this.currentCardId].resizeOverflowingText();
      this.cards[this.currentCardId].setCardFocus();
    };

    /**
     * Update the dimensions of the task when resizing the task.
     */
    this.resize = () => {
      let maxHeight = 0;
      this.updateImageSize();
      if (!this.params.behaviour.scaleTextNotCard && this.cardsShown !== false) {
        this.determineCardSizes();
      }

      // Reset card-wrapper-set height
      this.$cardwrapperSet.css('height', 'auto');

      //Find max required height for all cards
      this.$cardwrapperSet.children(':not(.h5p-dialogcards-gone)').each( function () {
        const wrapperHeight = $(this).css('height', 'initial').outerHeight();
        $(this).css('height', 'inherit');
        maxHeight = wrapperHeight > maxHeight ? wrapperHeight : maxHeight;

        // Check height
        if (!$(this).next('.h5p-dialogcards-cardwrap').length) {
          const initialHeight = $(this).find('.h5p-dialogcards-cardholder').css('height', 'initial').outerHeight();
          maxHeight = initialHeight > maxHeight ? initialHeight : maxHeight;
          $(this).find('.h5p-dialogcards-cardholder').css('height', 'inherit');
        }
      });
      const relativeMaxHeight = maxHeight / parseFloat(this.$cardwrapperSet.css('font-size'));
      this.$cardwrapperSet.css('height', relativeMaxHeight + 'em');
      this.scaleToFitHeight();
      this.truncateRetryButton();

      this.cards[this.currentCardId].resizeOverflowingText();
    };

    /**
     * Resizes each card to fit its text
     */
    this.determineCardSizes = () => {
      const self = this;

      if (this.cardSizeDetermined === undefined) {
        // Keep track of which cards we've already determined size for
        this.cardSizeDetermined = [];
      }

      // Go through each card
      this.$cardwrapperSet.children(':visible').each(function (i) {
        if (self.cardSizeDetermined.indexOf(i) !== -1) {
          return; // Already determined, no need to determine again.
        }
        self.cardSizeDetermined.push(i);

        // Here "this" references the jQuery object
        const $content = $('.h5p-dialogcards-card-content', this);
        const $text = $('.h5p-dialogcards-card-text-inner-content', $content);

        // Grab size with text
        const textHeight = $text[0].getBoundingClientRect().height;

        // Change to answer
        const currentCard = self.cards[i];
        currentCard.changeText(currentCard.getAnswer());

        // Grab size with answer
        const answerHeight = $text[0].getBoundingClientRect().height;

        // Use highest
        let useHeight = (textHeight > answerHeight ? textHeight : answerHeight);

        // Min. limit
        const minHeight = parseFloat($text.parent().parent().css('minHeight'));
        if (useHeight < minHeight) {
          useHeight =  minHeight;
        }

        // Convert to em
        const fontSize = parseFloat($content.css('fontSize'));
        useHeight /= fontSize;

        // Set height
        $text.parent().css('height', useHeight + 'em');

        // Change back to text
        currentCard.changeText(currentCard.getText());
      });
    };

    /**
     * Scales the card contents.
     */
    this.scaleToFitHeight = () => {
      if (!this.$cardwrapperSet || !this.$cardwrapperSet.is(':visible') || !this.params.behaviour.scaleTextNotCard) {
        return;
      }

      // Resize font size to fit inside CP
      if (this.$inner.parents('.h5p-course-presentation').length) {
        let $parentContainer = this.$inner.parent();
        if (this.$inner.parents('.h5p-popup-container').length) {
          $parentContainer = this.$inner.parents('.h5p-popup-container');
        }
        const containerHeight = $parentContainer.get(0).getBoundingClientRect().height;
        const getContentHeight = () => {
          let contentHeight = 0;
          this.$inner.children().each(function () {
            // Here "this" references the jQuery object
            const $child = $(this);
            contentHeight += this.getBoundingClientRect().height +
            parseFloat($child.css('margin-top')) + parseFloat($child.css('margin-bottom'));
          });
          return contentHeight;
        };
        let contentHeight = getContentHeight();
        const parentFontSize = parseFloat(this.$inner.parent().css('font-size'));
        let newFontSize = parseFloat(this.$inner.css('font-size'));

        // Decrease font size
        if (containerHeight < contentHeight) {
          while (containerHeight < contentHeight) {
            newFontSize -= Dialogcards.SCALEINTERVAL;

            // Cap at min font size
            if (newFontSize < Dialogcards.MINSCALE) {
              break;
            }

            // Set relative font size to scale with full screen.
            this.$inner.css('font-size', (newFontSize / parentFontSize) + 'em');
            contentHeight = getContentHeight();
          }
        }
        else { // Increase font size
          let increaseFontSize = true;
          while (increaseFontSize) {
            newFontSize += Dialogcards.SCALEINTERVAL;

            // Cap max font size
            if (newFontSize > Dialogcards.MAXSCALE) {
              increaseFontSize = false;
              break;
            }

            // Set relative font size to scale with full screen.
            let relativeFontSize = newFontSize / parentFontSize;
            this.$inner.css('font-size', relativeFontSize + 'em');
            contentHeight = getContentHeight();
            if (containerHeight <= contentHeight) {
              increaseFontSize = false;
              relativeFontSize = (newFontSize - Dialogcards.SCALEINTERVAL) / parentFontSize;
              this.$inner.css('font-size', relativeFontSize + 'em');
            }
          }
        }
      }
      else { // Resize mobile view
        this.cards[this.currentCardId].resizeOverflowingText();
      }
    };

    /**
     * Truncate retry button if width is small.
     */
    this.truncateRetryButton = () => {
      if (!this.$retry) {
        return;
      }

      // Reset button to full size
      this.$retry.removeClass('truncated');
      this.$retry.html(this.params.retry);

      // Measure button
      const maxWidthPercentages = 0.3;
      const retryWidth = this.$retry.get(0).getBoundingClientRect().width +
          parseFloat(this.$retry.css('margin-left')) + parseFloat(this.$retry.css('margin-right'));
      const retryWidthPercentage = retryWidth / this.$retry.parent().get(0).getBoundingClientRect().width;

      // Truncate button
      if (retryWidthPercentage > maxWidthPercentages) {
        this.$retry.addClass('truncated');
        this.$retry.html('');
      }
    };

    /**
     * Get the content type title.
     *
     * @return {string} title.
     */
    this.getTitle = () => {
      return H5P.createTitle((this.contentData && this.contentData.metadata && this.contentData.metadata.title) ? this.contentData.metadata.title : 'Dialog Cards');
    };
  }
}

// Constants
Dialogcards.SCALEINTERVAL = 0.2;
Dialogcards.MAXSCALE = 16;
Dialogcards.MINSCALE = 4;

export default Dialogcards;
