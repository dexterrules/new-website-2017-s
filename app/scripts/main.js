import Barba from './barba';

var headerItems = $('nav a');

var links = document.querySelectorAll('a[href]');
var cbk = function(e) {
  if (e.currentTarget.href === window.location.href) {
    e.preventDefault();
    e.stopPropagation();
  }
};

for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', cbk);
}

document.addEventListener('DOMContentLoaded', function() {
  var lastElementClicked;
  Barba.Pjax.init();
  Barba.Prefetch.init();

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      /**
       * This function is automatically called as soon the Transition starts
       * this.newContainerLoading is a Promise for the loading of the new container
       * (Barba.js also comes with an handy Promise polyfill!)
       */

      // As soon the loading is finished and the old page is faded out, let's fade the new page
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      /**
       * this.oldContainer is the HTMLElement of the old Container
       */
      return $(this.oldContainer).animate({
        paddingTop: '40px',
        opacity: 0
      }, 400).promise();

    },

    fadeIn: function() {
      /**
       * this.newContainer is the HTMLElement of the new Container
       * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
       * Please note, newContainer is available just after newContainerLoading is resolved!
       */

      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: 'visible',
        paddingTop: '20px',
        opacity: 0
      });

      window.scrollTo(0, 0);
      

      $el.animate({ 
        opacity: 1,
        paddingTop: '0px'
       }, 400, function() {
        /**
         * Do not forget to call .done() as soon your transition is finished!
         * .done() will automatically remove from the DOM the old Container
         */
         showIntroComponents();
        _this.done();
      });

    }
  });

  /**
   * Next step, you have to tell Barba to use the new Transition
   */

  Barba.Pjax.getTransition = function() {
    /**
     * Here you can use your own logic!
     * For example you can use different Transition based on the current page or link...
     */

    return FadeTransition;
  };

  Barba.Dispatcher.on('newPageReady', function(currentStatus, prevStatus) {
    setHeader(currentStatus.url, prevStatus.url);
  });
});

function setHeader(url, purl) {
  if (url.indexOf('index.html') !== -1) {
    resetActive();
    $('nav a[href="index.html"]').addClass('active');
    return;
  }

  if (url.indexOf('about.html') !== -1) {
    resetActive();
    $('nav a[href="about.html"]').addClass('active');
    return;
  }

  if (purl.indexOf('index.html') !== -1 || purl.indexOf('about.html') !== -1) {
    resetActive();
  }

  $('nav a[href="portfolio.html"]').addClass('active');
}

function resetActive() {
  $.each(headerItems, function() {
    $(this).removeClass('active');
  });
}

function LettheGamesBegin() {
  window.scrollTo(0, 0);
}

window.onload = function() {
  setHeader(window.location.href, ' ');
  $('body').addClass('loaded');
  showIntroComponents();
};

function showIntroComponents(){
  staggerItemsShow();
  contentReveal();
}

function staggerItemsShow(){
  $('.staggerChildren > div').each(function(i, obj){
    $(this).removeClass('hiddenStaggerItem');
  });  
}

function contentReveal(){
  $('.revealContent').removeClass('hidden');
}



