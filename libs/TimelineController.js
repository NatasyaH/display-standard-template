var controller = function( timeline ) {
	
	var container = document.getElementById( 'timeline-controller' );
	var playToggle = document.getElementById( 'tc-play-toggle' );
	var isPlaying = false;

	var playhead = document.getElementById( 'tc-playhead' );
	var progressTimeline = document.getElementById( 'tc-progress-container' );
	var progressOffsetX = 0;

	var durationContainer = document.getElementById( 'tc-total-time' );
	var timeContainer = document.getElementById( 'tc-current-time' );

	/* ********* TIMELINES ********** */
	var playToggleBgTimeline = new TimelineMax( { paused:true } );
	playToggleBgTimeline.addLabel( "over", 0 );
	playToggleBgTimeline.to( playToggle, 0.2, { smoothify:true, backgroundColor:"#27c1b9", ease:Power2.easeOut }, "over" );
	playToggleBgTimeline.addPause("+=0");
	playToggleBgTimeline.addLabel( "out" );
	playToggleBgTimeline.to( playToggle, 0.2, { smoothify:true, backgroundColor:"#2da5da", ease:Power2.easeOut }, "out" );
	playToggleBgTimeline.addPause("+=0");

	playToggle.addEventListener( 'mouseover', playToggleOverHandler );
	playToggle.addEventListener( 'mouseout',  playToggleOutHandler );
	playToggle.addEventListener( 'click',     playToggleClickHandler );

	timeline.eventCallback( 'onUpdate', update );
	timeline.eventCallback( 'onComplete', onComplete );
	timeline.eventCallback( 'onStart', onStart );

	progressTimeline.addEventListener( 'mousedown', timelineMouseDownHandler );
	
	
	/* ********* EVENT HANDLERS ********** */
	
	function update() {
		var p = timeline.progress();
		var t = timeline.time();
		var d = timeline.duration();

		var w = (p*100)+"%";
		playhead.style.width = w;

		updateTime();
	}

	function onStart() {
		togglePlayIcon();
		isPlaying = true;
		updateDuration();
	}

	function onComplete() {
		togglePlayIcon();
		timeline.restart();
	}

	function playToggleOverHandler() {
		playToggleBgTimeline.play("over");
	}

	function playToggleOutHandler() {
		playToggleBgTimeline.play("out");
	}

	function playToggleClickHandler() {
		if( isPlaying ) {
			timeline.pause();
		} else {
			timeline.play();
		}
		togglePlayIcon();
	}

	function togglePlayIcon() {
		if( isPlaying ) {
			TweenMax.to( '.tc-play-icon', 0.2, { autoAlpha:1 } );
			TweenMax.to( '.tc-pause-icon', 0.2, { autoAlpha:0 } );
			isPlaying = false;
		} else {
			TweenMax.to( '.tc-play-icon', 0.2, { autoAlpha:0 } );
			TweenMax.to( '.tc-pause-icon', 0.2, { autoAlpha:1 } );
			isPlaying = true;
		}
	}

	function timelineMouseDownHandler( e ){
		progressOffsetX = e.pageX - e.offsetX;
		document.body.addEventListener( 'mousemove', timelineMouseMoveHandler );
		document.body.addEventListener( 'mouseup', timelineMouseUpHandler );
		timelineMouseMoveHandler( e );
	}

	function timelineMouseMoveHandler( e ) {
		var w = progressTimeline.offsetWidth;
		var x = e.pageX - progressOffsetX;
		var p = x/w;
		var t = timeline.totalDuration() * p;
		seek( t, true );
	}

	function timelineMouseUpHandler( e ) {
		document.body.removeEventListener( 'mousemove', timelineMouseMoveHandler );
		document.body.removeEventListener( 'mouseup', timelineMouseUpHandler );
		if( timeline.paused() ) timeline.resume();
	}

	function seek( time, pause ){
		timeline.seek( time );
		if( pause ) timeline.pause();
		update();
	}

	function updateTime() {
		var time = timeline.time();
		var sec = Math.floor( time );
		var mil = (time % 1).toFixed(2).substring(2);
		timeContainer.innerHTML = sec + ":" + mil;
	}

	function updateDuration() {
		var dur = timeline.duration();
		var sec = Math.floor( dur );
		var mil = (dur % 1).toFixed(2).substring(2);
		durationContainer.innerHTML = sec + ":" + mil;
	}
}