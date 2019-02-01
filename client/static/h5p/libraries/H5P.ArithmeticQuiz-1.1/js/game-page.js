/**
 * Defines the H5P.ArithmeticQuiz.GamePage class
 */
H5P.ArithmeticQuiz.GamePage = (function ($, UI, ArithmeticType, QuestionsGenerator) {

  /**
   * Creates a new GamePage instance
   *
   * @class
   * @augments H5P.EventDispatcher
   * @namespace H5P
   * @param  {arithmeticType} type
   * @param  {number} maxQuestions Maximum number of questions
   * @param  {Object} t Object containing translation texts
   * @param {number} id Unique id to identify this quiz
   * @fires H5P.XAPIEvent
   */
  function GamePage(type, maxQuestions, t, id) {
    H5P.EventDispatcher.call(this);

    var self = this;
    self.id = id;
    self.translations = t;
    self.type = type;
    self.maxQuestions = maxQuestions;
    self.sliding = false;

    self.$gamepage = $('<div>', {
      'class': 'h5p-baq-game counting-down'
    });

    self.questionsGenerator = new QuestionsGenerator(self.type, self.maxQuestions);
    self.score = 0;
    self.scoreWidget = new ScoreWidget(t);
    self.scoreWidget.appendTo(self.$gamepage);

    self.timer = new H5P.ArithmeticQuiz.TimerWidget(t);
    self.timer.appendTo(self.$gamepage);

    self.slider = UI.createSlider();

    self.countdownWidget = new H5P.ArithmeticQuiz.CountdownWidget(4, t);
    self.slider.addSlide(self.countdownWidget.create());
    self.countdownWidget.on('ignition', function () {
      self.$gamepage.removeClass('counting-down');
      self.progressbar.setProgress(0);
      self.slider.next();
      self.timer.start();
      self.trigger('started-quiz');
    });

    // Shuffle quizzes:
    self.quizzes = self.questionsGenerator.get();

    var numQuestions = self.quizzes.length;
    for (var i = 0; i < numQuestions; i++) {
      self.slider.addSlide(self.createSlide(self.quizzes[i], i));
    }

    // Create progressbar
    self.progressbar = UI.createProgressbar(numQuestions, {
      progressText: t.slideOfTotal
    });
    self.progressbar.appendTo(self.$gamepage);

    // Add result page:
    self.resultPage = new H5P.ArithmeticQuiz.ResultPage(numQuestions, t);
    self.slider.addSlide(self.resultPage.create());

    self.resultPage.on('retry', function () {
      self.reset();
      self.slider.first();
    });

    self.slider.on('last-slide', function () {
      self.resultPage.update(self.score, self.timer.pause());
      self.$gamepage.addClass('result-page');
      self.trigger('last-slide', {
        score: self.score,
        numQuestions: numQuestions
      });
    });

    self.slider.on('first-slide', function () {
      self.$gamepage.removeClass('result-page');
    });

    self.slider.on('move', function () {
      self.progressbar.next();
    });

    self.slider.on('moved', function () {
      self.sliding = false;
      // Set focus
      var $button = self.$gamepage.find('.current .h5p-joubelui-button')[0];
      if ($button) {
        $button.focus();
      }
    });

    self.slider.attach(self.$gamepage);
  }
  GamePage.prototype = Object.create(H5P.EventDispatcher.prototype);
  GamePage.prototype.constructor = GamePage;

  /**
   * Starts the countdown
   */
  GamePage.prototype.startCountdown = function () {
    this.countdownWidget.start();
  };

  /**
   * Calculate maximum height
   * @method getMaxHeight
   * @return {number}
   */
  GamePage.prototype.getMaxHeight = function () {
    var $slide = $('.question-page', this.$gamepage).first();
    $slide.css({
      display: 'block',
      width: $('.h5p-container').width() + 'px'
    });
    var height = $slide.height();
    $slide.css({
      display: '',
      width: '100%'
    });

    return height;
  };

  /**
   * Resets quiz
   */
  GamePage.prototype.reset = function () {
    this.score = 0;
    this.scoreWidget.update(0);
    this.timer.reset();
    this.$gamepage.find('.reveal-wrong').removeClass('reveal-wrong');
    this.$gamepage.find('.reveal-correct').removeClass('reveal-correct');
    this.$gamepage.addClass('counting-down');
    this.countdownWidget.restart();
    this.$gamepage.find('.h5p-joubelui-button:first-child, .h5p-joubelui-button:last-child').attr('tabindex', 0);
  };

  /**
   * Creates a question slide
   *
   * @param  {Object} question
   * @param  {string} question.q The question
   * @param  {number} question.correct The correct answer
   * @param {number} i Index of question
   * @return {H5P.jQuery} The jquery dom element generated
   */
  GamePage.prototype.createSlide = function (question, i) {
    var self = this;

    var $slide = $('<div>', {
      'class': 'question-page'
    });

    // Make arithmetic readable, e.g. plus signs are not read by ChromeVox.
    var readableArithmetic = question.textual
      .replace('+', self.translations.plusOperator)
      .replace('−', self.translations.minusOperator)
      .replace('×', self.translations.multiplicationOperator)
      .replace('÷', self.translations.divisionOperator);

    var readableQuestion = self.translations.humanizedQuestion
      .replace(':arithmetic', readableArithmetic);

    var questionId = 'arithmetic-quiz-' + self.id + '-question-' + i;

    $('<div>', {
      'class': 'question',
      'text': question.textual + ' = ?',
      'aria-label': readableQuestion,
      'id': questionId
    }).appendTo($slide);

    var $alternatives = $('<ul>', {
      'class': 'h5p-baq-alternatives',
      'role': 'radiogroup',
      'aria-labelledby': questionId
    });

    // Index of the currently focused option.
    var focusedOption;

    /**
     * Handles focusing one of the options, making the rest non-tabbable.
     * @private
     */
    var handleFocus = function () {
      // Go through all alternatives
      for (var i = 0; i < alternatives.length; i++) {
        if (alternatives[i] === this) {
          // Keep track of currently focused option
          focusedOption = i;
          alternatives[i].tabbable();
        }
        else {
          // Remove from tab
          alternatives[i].notTabbable();
        }
      }
    };

    /**
     * Handles moving the focus from the current option to the previous option.
     * @private
     */
    var handlePreviousOption = function () {
      if (focusedOption !== 0) {
        alternatives[focusedOption - 1].focus();
      }
    };

    /**
     * Handles moving the focus from the current option to the next option.
     * @private
     */
    var handleNextOption = function () {
      if (focusedOption !== alternatives.length - 1) {
        alternatives[focusedOption + 1].focus();
      }
    };

    var alternatives = [];
    for (var k = 0; k < question.alternatives.length; k++) {
      alternatives.push(new Alternative(question.alternatives[k], question.alternatives[k]===question.correct, self.translations));
    }
    alternatives.forEach(function (alternative, index) {
      if (index === 0 || index === alternatives.length - 1) {
        alternative.tabbable();
      }
      alternative.on('focus', handleFocus);
      alternative.on('previousOption', handlePreviousOption);
      alternative.on('nextOption', handleNextOption);
      alternative.appendTo($alternatives);
      alternative.on('answered', function () {

        // Ignore clicks if in the middle of something else:
        if (self.sliding) {
          return;
        }
        self.sliding = true;

        self.trigger('alternative-chosen');

        // Can't play it after the transition end is received, since this is not
        // accepted on iPad. Therefore we are playing it here with a delay instead
        H5P.ArithmeticQuiz.SoundEffects.play(alternative.correct ? 'positive-short' : 'negative-short', 300);

        if (alternative.correct) {
          self.score++;
          self.scoreWidget.update(self.score);
        }

        alternatives.forEach(function (alt) {
          if (alt.correct && alternative !== alt) {
            alternative.announce(self.translations.incorrectText.replace(':num', alt.number));
          }
          alt.reveal();
        });

        setTimeout(function(){
          self.slider.next();
        }, 3500);
      });
    });

    $alternatives.appendTo($slide);
    return $slide;
  };


  /**
   * Append game page to container
   *
   * @param  {H5P.jQuery} $container
   */
  GamePage.prototype.appendTo = function ($container) {
    this.$gamepage.appendTo($container);
  };

  /**
   * Creates a ScoreWidget instance
   *
   * @class
   * @private
   * @param  {Object} t Translation object
   */
  function ScoreWidget(t) {
    var self = this;

    var $score = $('<span>', {
      'class': 'h5p-baq-score-widget-number',
      html: 0
    });

    this.$scoreWidget = $('<div>', {
      'class': 'h5p-baq-score-widget',
      'aria-live': 'polite',
      'aria-atomic': true,
      html: t.score + ' '
    }).append($score);

    this.scoreElement = $score.get(0);

    this.appendTo = function ($container) {
      this.$scoreWidget.appendTo($container);

      new Odometer({
        el: this.scoreElement
      });
    };

    this.update = function (score) {
      // Need this aria-busy to make sure readspeaker is not reading
      // both old and new score
      this.$scoreWidget.attr('aria-busy', true);
      this.scoreElement.innerHTML = score;
      setTimeout(function () {
        self.$scoreWidget.attr('aria-busy', false);
      }, 1);
    };
  }


  /**
   * Creates an Alternative button instance
   *
   * @class
   * @private
   * @augments H5P.EventDispatcher
   * @fires H5P.Event
   * @param {number} number Number on button
   * @param {boolean} correct Correct or not
   * @param {Object} t Translations
   */
  function Alternative(number, correct, t) {
    H5P.EventDispatcher.call(this);
    var self = this;

    self.number = number;
    self.correct = correct;

    var answer = function (event) {
      if (self.correct) {
        self.announce(t.correctText);
      }
      self.trigger('answered');
      setTimeout(self.dropLive, 500);
      event.preventDefault();
    };

    // Create radio button and set up event listeners
    this.$button = $('<li>', {
      'class': 'h5p-joubelui-button',
      'role': 'radio',
      'tabindex': -1,
      'text': number,
      'on': {
        'keydown': function (event) {
          if (self.$button.is('.reveal-correct, .reveal-wrong')) {
            return;
          }
          switch (event.which) {
            case 13: // Enter
            case 32: // Space
              // Answer question
              answer(event);
              break;

            case 37: // Left Arrow
            case 38: // Up Arrow
              // Go to previous Option
              self.trigger('previousOption');
              event.preventDefault();
              break;

            case 39: // Right Arrow
            case 40: // Down Arrow
              // Go to next Option
              self.trigger('nextOption');
              event.preventDefault();
              break;
          }
        },
        'focus': function () {
          if (self.$button.is('.reveal-correct, reveal-wrong')) {
            return;
          }
          self.trigger('focus');
        },
        'click': function (event) {
          if (self.$button.is('.reveal-correct, reveal-wrong')) {
            return;
          }
          // Answer question
          answer(event);
        }
      }
    });

    /**
     * Move focus to this option.
     */
    self.focus = function () {
      self.$button.focus();
    };

    /**
     * Makes it possible to tab your way to this option.
     */
    self.tabbable = function () {
      self.$button.attr('tabindex', 0);
    };

    /**
     * Make sure it's NOT possible to tab your way to this option.
     */
    self.notTabbable = function () {
      self.$button.attr('tabindex', -1);
    };

    this.dropLive = function() {
      if (self.$liveRegion) {
        var node = self.$liveRegion[0];
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };

    this.announce = function(text) {
      self.$liveRegion = $('<div>', {
        'class': 'h5p-baq-live-feedback',
        'aria-live': 'assertive',
        'width': '1px',
        'height': '1px',
        html: text
      }).appendTo(document.body.lastChild);
    };


    this.reveal = function () {
      this.$button.addClass(this.correct ? 'reveal-correct' : 'reveal-wrong')
          .attr('tabindex', -1);
    };

    this.appendTo = function ($container) {
      this.$button.appendTo($container);
      return this;
    };
  }
  Alternative.prototype = Object.create(H5P.EventDispatcher.prototype);
  Alternative.prototype.constructor = Alternative;

  return GamePage;
})(H5P.jQuery, H5P.JoubelUI, H5P.ArithmeticQuiz.ArithmeticType, H5P.ArithmeticQuiz.QuestionsGenerator);

/*function GridResultsView(rows, cols) {
  var $grid = $('<table>', {
    'class': 'h5p-baq-grid-results',
    cellspacing: 0,
    cellpadding: 0,
    'border-collapse': 'collapse'
  });

  for (var i = 0; i < rows; i++) {
    var $tr = $('<tr>');
    for (var j = 0; j < rows; j++) {
      $tr.append($('<td>'));
    }
    $grid.append($tr);
  }

  this.appendTo = function ($container) {
    $grid.appendTo($container);
  }

  this.getCell = function (row, col) {
    return $grid.find('tr:nth-child('+row+')').find('td:nth-child('+col+')');
  }
}*/
