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
      
      TweenLite.set( ".box", { transformOrigin:"50% 50%" } );
      TweenLite.to( '#adRoot', 0.15, { opacity: 1 });
      var tl = null;
      // make additional timeline here.
      tl = new TimelineLite({
        onComplete: onComplete,
        onStart: onStart,
        //paused: true
      });

      tl.addLabel( "start", 0 );

      tl.addLabel( "scaleDownBoxes", 0.25 );

      tl.staggerFromTo( ".box", 1.2, { scale:1 }, { smoothify:true, scale:0.35, ease:Elastic.easeOut.config (0.8, 0.5) }, -0.05 );

      tl.addLabel( "rotateBoxes" )
      tl.staggerFromTo( ".box", 1, { rotation:0 }, { smoothify:true, rotation:180, ease:Power2.easeOut }, -0.07, "rotateBoxes" );

      tl.addLabel( "scaleOutBoxes" );
      tl.staggerFromTo( ".box", 1, { immediateRender:false, scaleX:0.35 }, { smoothify:true, scaleX:0, ease:Power4.easeInOut }, -0.1, "scaleOutBoxes" );


      controller( tl, { x:0, y:280 } );

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
