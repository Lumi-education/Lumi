/* This h5p content library is based on ...
 * juxtapose - v1.1.2 - 2015-07-16
 * Copyright (c) 2015 Alex Duner and Northwestern University Knight Lab
 * License: Mozilla Public License 2.0, https://www.mozilla.org/en-US/MPL/2.0/
 * original source code: https://github.com/NUKnightLab/juxtapose
 *
 * TODO: Convert DOM Elements to jQuery elements
 */
var H5P = H5P || {};

H5P.ImageJuxtaposition = function ($) {
  /**
   * Constructor function.
   *
   * @param {object} options from semantics.json.
   * @param {number} content id.
   */
  function C(options, id, extras) {
    this.extras = extras;
    // Extend defaults with provided options
    this.options = $.extend(true, {
      title: '',
      imageBefore: {
        imageBefore: undefined,
        labelBefore: ''
      },
      imageAfter: {
        imageAfter: undefined,
        labelAfter: ''
      },
      behavior: {
        startingPosition: 50,
        sliderOrientation: 'horizontal' }
    }, options);
    this.id = id;

    // Initialize event inheritance
    H5P.EventDispatcher.call(this);
  }

  // Extends the event dispatcher
  C.prototype = Object.create(H5P.EventDispatcher.prototype);
  C.prototype.constructor = C;

  /**
   * Get the content type title.
   *
   * @return {string} title.
   */
  C.prototype.getTitle = function () {
    return H5P.createTitle((this.extras.metadata && this.extras.metadata.title) ? this.extras.metadata.title : 'Image Juxtaposition');
  };

  /**
   * Attach function called by H5P framework to insert H5P content into page.
   *
   * @param {jQuery} container to attach to.
   */
  C.prototype.attach = function ($container) {
    this.container = $container;
    $container.addClass("h5p-image-juxtaposition");
    if (this.options.title) {
      $container.append('<div class="h5p-image-juxtaposition-title">' + this.options.title + '</div>');
    }

    if (typeof this.options.imageBefore.imageBefore === 'undefined' || typeof this.options.imageAfter.imageAfter === 'undefined') {
      $container.append('<div class="h5p-image-juxtaposition-missing-images">I really need two background images :)</div>');
      return;
    }

    // The div element will be filled by JXSlider._onLoaded later
    $container.append('<div class="h5p-image-juxtaposition-juxtapose"></div>');

    // Create the slider
    var slider = new JXSlider('.h5p-image-juxtaposition-juxtapose', [{
      src: H5P.getPath(this.options.imageBefore.imageBefore.path, this.id),
      label: this.options.imageBefore.labelBefore
    }, {
      src: H5P.getPath(this.options.imageAfter.imageAfter.path, this.id),
      label: this.options.imageAfter.labelAfter
    }], {
      startingPosition: this.options.behavior.startingPosition + '%',
      mode: this.options.behavior.sliderOrientation
    }, this);

    // This is needed for Chrome to detect the mouseup outside the iframe
    $(window).mouseup(function() {
      slider.mouseup();
    });
  };

  /**
   * Create Graphics.
   *
   * @private
   * @param {object} properties from options.
   * @return {JXSlider} slider to attach graphics to.
   */
  var Graphic = function (properties, slider) {
    var self = this;
    this.image = new Image();

    this.loaded = false;
    this.image.onload = function () {
      self.loaded = true;
      slider._onLoaded();
    };

    this.image.src = properties.src;
    this.label = properties.label || false;
  };

  /**
   * Get dimensions of a DOM element.
   *
   * @private
   * @param {object} DOMelement.
   * @return {object} object containing width and height.
   */
  var getNaturalDimensions = function (DOMelement) {
    if (DOMelement.naturalWidth && DOMelement.naturalHeight) {
      return {
        width: DOMelement.naturalWidth,
        height: DOMelement.naturalHeight
      };
    }
    // http://www.jacklmoore.com/notes/naturalwidth-and-naturalheight-in-ie/
    var img = new Image();
    img.src = DOMelement.src;
    return {
      width: img.width,
      height: img.height
    };
  };

  /**
   * Get dimensions for Graphics.
   *
   * @private
   * @param {object} Graphic object.
   * @return {object} object containing width, height, and ratio.
   */
  var getImageDimensions = function (img) {
    return {
      width: getNaturalDimensions(img).width,
      height: getNaturalDimensions(img).height,
      aspect: function aspect() {
        return this.width / this.height;
      }
    };
  };

  /**
   * Add a class to a DOM element.
   * Could be removed if using jQuery
   *
   * @private
   * @param {object} DOM element.
   * @param {string} className to be added.
   */
  var addClass = function (element, c) {
    if (element.classList) {
      element.classList.add(c);
    }
    else {
      element.className += " " + c;
    }
  };

  /**
   * Set text to a DOM element.
   * Could be removed if using jQuery
   *
   * @private
   * @param {object} DOM element.
   * @param {string} text to be removed.
   */
  var setText = function (element, text) {
    if (document.body.textContent) {
      element.textContent = text;
    }
    else {
      element.innerText = text;
    }
  };

  /**
   * Get pageX from event.
   *
   * @private
   * @param {object} event.
   * @return {number} pageX.
   */
  var getPageX = function (e) {
    var pageX;
    if (e.pageX) {
      pageX = e.pageX;
    }
    else if (e.touches) {
      pageX = e.touches[0].pageX;
    }
    else {
      pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    return pageX;
  };

  /**
   * Get pageY from event.
   *
   * @private
   * @param {object} event.
   * @return {number} pageY.
   */
  var getPageY = function (e) {
    var pageY;
    if (e.pageY) {
      pageY = e.pageY;
    }
    else if (e.touches) {
      pageY = e.touches[0].pageY;
    }
    else {
      pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return pageY;
  };

  /**
   * Get position for handle bar
   *
   * @private
   * @param {object} slider DOM object.
   * @return {number} position.
   */
  var getLeftPercent = function (slider, input) {
    var leftPercent;
    if (typeof input === "string" || typeof input === "number") {
      leftPercent = parseInt(input, 10);
    }
    else {
      var sliderRect = slider.getBoundingClientRect();
      var offset = {
        top: sliderRect.top + document.body.scrollTop,
        left: sliderRect.left + document.body.scrollLeft
      };
      var width = slider.offsetWidth;
      var pageX = getPageX(input);
      var relativeX = pageX - offset.left;
      leftPercent = relativeX / width * 100;
    }
    if (leftPercent === 0) {
      leftPercent = 0.01;
    }
    if (leftPercent === 100) {
      leftPercent = 99.99;
    }
    return leftPercent;
  };

  /**
   * Get position for handle bar
   *
   * @private
   * @param {object} slider DOM object.
   * @return {number} position.
   */
  var getTopPercent = function (slider, input) {
    var topPercent;
    if (typeof input === "string" || typeof input === "number") {
      topPercent = parseInt(input, 10);
    }
    else {
      var sliderRect = slider.getBoundingClientRect();
      var offset = {
        top: sliderRect.top + document.body.scrollTop,
        left: sliderRect.left + document.body.scrollLeft
      };
      var width = slider.offsetHeight;
      var pageY = getPageY(input);
      var relativeY = pageY - offset.top;
      topPercent = relativeY / width * 100;
    }
    if (topPercent === 0) {
      topPercent = 0.01;
    }
    if (topPercent === 100) {
      topPercent = 99.99;
    }
    return topPercent;
  };

  /**
   * The JXSlider.
   */
  var JXSlider = function (selector, images, options, parent) {
    this.selector = selector;
    this.options = options;
    this.parent = parent;

    if (images.length === 2) {
      this.imgBefore = new Graphic(images[0], this);
      this.imgAfter = new Graphic(images[1], this);
    }
    else {
      console.warn("The images parameter takes two Image objects.");
    }
  };

  /**
   * The JXSlider prototype functions.
   */
  JXSlider.prototype = {
    updateSlider: function updateSlider(input, animate) {
      var leftPercent, rightPercent, leftPercentNum;

      if (this.options.mode === "vertical") {
        leftPercent = getTopPercent(this.slider, input);
      }
      else {
        leftPercent = getLeftPercent(this.slider, input);
      }

      leftPercent = leftPercent.toFixed(2) + "%";
      leftPercentNum = parseFloat(leftPercent);
      rightPercent = 100 - leftPercentNum + "%";

      // set handler position and image areas
      if (leftPercentNum > 0 && leftPercentNum < 100) {
        // add animation effect
        if (animate === true) {
          $('.h5p-image-juxtaposition-handle').addClass('transition');
          $('.h5p-image-juxtaposition-left').addClass('transition');
          $('.h5p-image-juxtaposition-right').addClass('transition');
        } else {
          $('.h5p-image-juxtaposition-handle').removeClass('transition');
          $('.h5p-image-juxtaposition-left').removeClass('transition');
          $('.h5p-image-juxtaposition-right').removeClass('transition');
        }

        if (this.options.mode === "vertical") {
          this.handle.style.top = leftPercent;
          this.leftImage.style.height = leftPercent;
          this.rightImage.style.height = rightPercent;
        }
        else {
          this.handle.style.left = leftPercent;
          this.leftImage.style.width = leftPercent;
          this.rightImage.style.width = rightPercent;
        }
        this.sliderPosition = leftPercent;
      }

      // update aria
      this.controller.setAttribute('aria-valuenow', leftPercentNum);
    },

    /**
     * Set the label for an image
     * Could be simplified and removed if using jQuery
     */
    displayLabel: function displayLabel(element, labelText) {
      var label = document.createElement("div");
      label.className = 'h5p-image-juxtaposition-label';
      label.setAttribute('unselectable', 'on');
      label.setAttribute('onselectstart', 'return false;');
      label.setAttribute('onmousedown', 'return false;');
      label.setAttribute('tabindex', 0); //put the controller in the natural tab order of the document

      setText(label, labelText);
      element.appendChild(label);
    },

    /**
     * Check whether both images habe the same aspect ratio
     */
    checkImages: function checkImages() {
      return getImageDimensions(this.imgBefore.image).aspect() === getImageDimensions(this.imgAfter.image).aspect() ? true : false;
    },

    /**
     * Calculate the image dimensions
     */
    calculateDims: function calculateDims(width, height) {
      var ratio = getImageDimensions(this.imgBefore.image).aspect();
      if (width) {
        height = width / ratio;
      }
      else if (height) {
        width = height * ratio;
      }
      return {
        width: width,
        height: height,
        ratio: ratio
      };
    },

    /**
     * Update the wrapper dimensions
     * TODO: enhance for other scaling methods, e.g. for fullscreen
     */
    setWrapperDimensions: function setWrapperDimensions() {
      var targetWidth = Math.floor(window.innerWidth - 2);
      var targetHeight = Math.floor(targetWidth / this.imageRatio);

      this.wrapper.style.width = targetWidth + 'px';
      this.wrapper.style.height = targetHeight + 'px';

      // resize iframe if image's height is too small or too high
      if (((window.innerHeight - $('ul.h5p-actions').outerHeight()) > 0) &&
        ((window.innerHeight - $('ul.h5p-actions').outerHeight() - 1) !== targetHeight)) {
        this.parent.trigger('resize');
      }
    },

    /**
     * Create the DOM elements after images have loaded.
     */
    _onLoaded: function _onLoaded() {
      if (this.imgBefore && this.imgBefore.loaded === true && this.imgAfter && this.imgAfter.loaded === true) {

        this.imageRatio = getImageDimensions(this.imgBefore.image).aspect();

        this.wrapper = document.querySelector(this.selector);
        this.wrapper.style.width = getNaturalDimensions(this.imgBefore.image).width;

        this.slider = document.createElement("div");
        this.slider.className = 'h5p-image-juxtaposition-slider';
        this.slider.setAttribute('draggable', 'false');
        this.wrapper.appendChild(this.slider);

        // set orientation
        addClass(this.slider, 'h5p-image-juxtaposition-' + this.options.mode);

        this.handle = document.createElement("div");
        this.handle.className = 'h5p-image-juxtaposition-handle';
        this.handle.setAttribute('draggable', 'false');

        this.rightImage = document.createElement("div");
        this.rightImage.className = 'h5p-image-juxtaposition-image h5p-image-juxtaposition-right';
        this.rightImage.setAttribute('draggable', 'false');
        this.rightImageIMG = $(this.imgAfter.image)
          .addClass('h5p-image-juxtaposition-rightimg')
          // prevent dragging, etc. when leaving iframe
          .attr({
            draggable: 'false',
            unselectable: 'on',
            onselectstart: 'return false;',
            onmousedown: 'return false;'
          });
        this.rightImage.appendChild(this.rightImageIMG[0]);

        this.leftImage = document.createElement("div");
        this.leftImage.className = 'h5p-image-juxtaposition-image h5p-image-juxtaposition-left';
        this.leftImage.setAttribute('draggable', 'false');
        this.leftImageIMG = $(this.imgBefore.image)
          .addClass('h5p-image-juxtaposition-leftimg')
          // prevent dragging, etc. when leaving iframe
          .attr({
            draggable: 'false',
            unselectable: 'on',
            onselectstart: 'return false;',
            onmousedown: 'return false;'
          });
        this.leftImage.appendChild(this.leftImageIMG[0]);

        this.slider.appendChild(this.handle);
        this.slider.appendChild(this.leftImage);
        this.slider.appendChild(this.rightImage);

        this.leftArrow = document.createElement("div");
        this.rightArrow = document.createElement("div");
        this.control = document.createElement("div");
        this.controller = document.createElement("div");

        this.leftArrow.className = 'h5p-image-juxtaposition-arrow h5p-image-juxtaposition-left';
        this.leftArrow.setAttribute('draggable', 'false');
        this.rightArrow.className = 'h5p-image-juxtaposition-arrow h5p-image-juxtaposition-right';
        this.rightArrow.setAttribute('draggable', 'false');
        this.control.className = 'h5p-image-juxtaposition-control';
        this.control.setAttribute('draggable', 'false');
        this.controller.className = 'h5p-image-juxtaposition-controller';
        this.controller.setAttribute('draggable', 'false');

        this.controller.setAttribute('tabindex', 0); //put the controller in the natural tab order of the document
        this.controller.setAttribute('role', 'slider');
        this.controller.setAttribute('aria-valuenow', parseInt(this.options.startingPosition));
        this.controller.setAttribute('aria-valuemin', 0);
        this.controller.setAttribute('aria-valuemax', 100);

        this.handle.appendChild(this.leftArrow);
        this.handle.appendChild(this.control);
        this.handle.appendChild(this.rightArrow);
        this.control.appendChild(this.controller);

        this._init();
      }
    },

    /**
     * Trigger mouseup manually (from outside).
     */
    mouseup: function () {
      this.slider.dispatchEvent(new CustomEvent('mouseup'));
    },

    /**
     * Initialize Slider after DOM has been filled
     */
    _init: function _init() {

      if (this.checkImages() === false) {
        console.warn(this, "Check that the two images have the same aspect ratio for the slider to work correctly.");
      }

      // Display labels
      if (this.imgBefore.label) {
        this.displayLabel(this.leftImage, this.imgBefore.label);
      }
      if (this.imgAfter.label) {
        this.displayLabel(this.rightImage, this.imgAfter.label);
      }

      var self = this;
      window.addEventListener('resize', function () {
        self.setWrapperDimensions();
      });

      // Event Listeners for Mouse Interface
      this.slider.addEventListener("mousedown", function (e) {
        e = e || window.event;
        // Don't use preventDefault or Firefox won't detect mouseup outside the iframe.
        self.updateSlider(e, true);
        var animate = true;

        this.addEventListener("mousemove", function (e) {
          e = e || window.event;
          e.preventDefault();
          if (animate) {
            self.updateSlider(e, false);
          }
        });

        this.addEventListener('mouseup', function (e) {
          e = e || window.event;
          e.preventDefault();
          e.stopPropagation();
          this.removeEventListener('mouseup', arguments.callee);
          animate = false;
        });
      });

      // Event Listeners for Touch Interface
      this.slider.addEventListener('touchstart', function (e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();
        self.updateSlider(e, true);

        this.addEventListener('touchmove', function (e) {
          e = e || window.event;
          e.preventDefault();
          e.stopPropagation();
          self.updateSlider(e, false);
        });
      });

      // Event Listeners for Keyboard on handle
      this.handle.addEventListener('keydown', function (e) {
        e = e || window.event;
        var key = e.which || e.keyCode;
        var ariaValue = parseFloat(this.style.left || this.style.top);
        var position = 0;

        // handler left
        if (key === 37) {
          position = Math.max(0, ariaValue - 1);
          self.updateSlider(position, false);
          self.controller.setAttribute('aria-valuenow', position);
        }

        // handler right
        if (key === 39) {
          position = Math.min(100, ariaValue + 1);
          self.updateSlider(position, false);
          self.controller.setAttribute('aria-valuenow', position);
        }
      });

      // Event Listeners for Keyboard on images
      this.leftImage.addEventListener('keydown', function (e) {
        var key = e.which || e.keyCode;
        if ((key === 13) || (key === 32)) {
          self.updateSlider('90%', true);
          self.controller.setAttribute('aria-valuenow', 90);
        }
      });

      this.rightImage.addEventListener('keydown', function (e) {
        var key = e.which || e.keyCode;
        if ((key === 13) || (key === 32)) {
          self.updateSlider('10%', true);
          self.controller.setAttribute('aria-valuenow', 10);
        }
      });

      self.updateSlider(this.options.startingPosition, false);
      self.setWrapperDimensions();

      // This is a workaround for our beloved IE that would otherwise distort the images
      $('.h5p-image-juxtaposition-leftimg').attr({ width: '', height: '' });
      $('.h5p-image-juxtaposition-rightimg').attr({ width: '', height: '' });
    }
  };

  return C;
}(H5P.jQuery);
