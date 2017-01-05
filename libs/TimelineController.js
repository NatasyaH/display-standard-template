var controller = function( tl, pos ) {

	var timeline = tl;
	var position = pos || { x:0, y:0 };

	var container = null;
	var playToggleContainer = null;
	var playToggleIcons = null;
	var playToggleButton = null;
	var progressContainer = null;
	var progressBar = null;

	var addDomElements = function() {

		container = document.createElement( 'div' );
		container.style.width = "400px";
		container.style.height = "200px";
		container.style.position = "absolute";
		container.style.left = position.x + "px";
		container.style.top = position.y + "px";
		container.style.backgroundColor = "#0e2b50";
		container.style.color = "#FFFFFF";
		container.style.font = "12px arial, serif";
		document.body.appendChild( container );

		var header = document.createElement( 'div' );
		header.style.width = "392px";
		header.style.height = "12px";
		header.style.backgroundColor = "#020714";
		header.style.padding = "4px";
		header.style.borderBottom = "1px solid #3467A5";
		header.style.fontSize = "10px";
		header.style.color = "#75d5ff";
		header.innerHTML = "GSAP Timeline Controller";
		container.appendChild( header );

		playToggleContainer = document.createElement( 'div' );
		playToggleContainer.style.width = "30px";
		playToggleContainer.style.height = "30px";
		playToggleContainer.style.backgroundColor = "#2DA5DA";
		playToggleContainer.style.position = "absolute";
		playToggleContainer.style.top = "26px";
		playToggleContainer.style.left = "5px";

		playToggleIcons = document.createElement( 'div' );
		playToggleIcons.style.width = "8px";
		playToggleIcons.style.height = "16px";
		playToggleIcons.style.position = "absolute";
		playToggleIcons.style.top = "7px";
		playToggleIcons.style.left = "11px";
		playToggleIcons.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="16px" viewBox="0 0 8 16" enable-background="new 0 0 8 16" xml:space="preserve"><path class="tc-play-icon" d="M0,0l8,8l-8,8V0z"/><path class="tc-pause-icon" d="M8,16H5V0h3V16z"/><path class="tc-pause-icon" d="M3,16H0V0h3V16z"/></svg>'
		playToggleContainer.appendChild( playToggleIcons );

		playToggleButton = document.createElement( 'div' );
		playToggleButton.style.width = "100%";
		playToggleButton.style.height = "100%";
		playToggleButton.style.position = "absolute";
		playToggleButton.style.top = "0px";
		playToggleButton.style.left = "0px";
		playToggleButton.style.cursor = "pointer";
		playToggleContainer.appendChild( playToggleButton );

		container.appendChild( playToggleContainer );

		progressContainer = document.createElement( 'div' );
		progressContainer.style.width = "355px";
		progressContainer.style.height = "30px";
		progressContainer.style.lineHeight = "30px";
		progressContainer.style.position = "absolute";
		progressContainer.style.top = "26px";
		progressContainer.style.left = "40px";
		progressContainer.style.backgroundColor = "#000000";
		container.appendChild( progressContainer );

	}

	addDomElements();

}



/*var controller = function( timeline ) {
	
	var container = document.getElementById( 'timeline-controller' );
	var playToggle = document.getElementById( 'tc-play-toggle' );
	var isPlaying = false;

	var playhead = document.getElementById( 'tc-playhead' );
	var progressTimeline = document.getElementById( 'tc-progress-container' );
	var progressOffsetX = 0;

	var durationContainer = document.getElementById( 'tc-total-time' );
	var timeContainer = document.getElementById( 'tc-current-time' );

	// ********* TIMELINES **********
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
	
	
	// ********* EVENT HANDLERS **********
	
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

	function addDomElements() {

	}
}*/