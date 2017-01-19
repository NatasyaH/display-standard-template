'use strict';
(function () {
  var Animation = function () {
    // do all your animation in this function. Including any calls to get DOM elements.
    var render = function () {

      var onComplete = function () {
        console.log('animation complete');
        
      };

      var onStart = function () {
        
      };

      var container = document.getElementById( 'animation-container' );
      var drawBoxes = function() {
        var colors = [ "#000000", "#006680", "#00CCFF", "#bf72e5", "#FF00CC" ];
        var div;
        colors.forEach(function( item, index ){
          div = document.createElement( 'div' );
          div.className = "box";
          div.style.backgroundColor = item;
          container.appendChild( div );
        })
      };

      drawBoxes();
      
      TweenMax.set( ".box", { transformOrigin:"50% 50%" } );
      TweenMax.to( '#adRoot', 0.15, { opacity: 1 });
      var tl = null;
      // make additional timeline here.
      tl = new TimelineMax({
        onComplete: onComplete,
        onStart: onStart,
        //paused: true
      });

      tl.addLabel( "animateIn", 0 );


      tl.staggerFromTo( ".box", 1.3, { scale:1 }, { smoothify:true, cycle:{ 
                                                                      scale:function(i){
                                                                        return 0.35 + (i * 0.02);
                                                                      }}, ease:Elastic.easeOut.config (0.8, 0.4) }, -0.1, "animateIn" );

      tl.addLabel( "animateOut" );
      tl.staggerTo( ".box", 0.8, { smoothify:true, scale:0, ease:Power4.easeInOut }, -0.1, "animateOut" );


      var c = new controller( tl );
      c.position.x = 5;
      c.position.y = 265;
      //c.size.width = 350;


      //customize this function so that when called it kills all animation timelines, etc.
      return function destroy() {
        console.log('Kill Animations');
        tl.kill();
      }
    };
    return render();
  };
  window.Animation = Animation;
})();
