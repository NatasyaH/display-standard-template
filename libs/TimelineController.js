var controller = function( tl, pos ) {

	var timeline = tl;
	var position = pos || { x:0, y:0 };

	var container = null;
	var playToggleContainer = null;
	var playToggleIcons = null;
	var playToggleButton = null;
	var progressContainer = null;
	var progressBar = null;
	var timeContainer = null;
	var durationContainer = null;

	var progressOffsetX = 0;

	var complete = false;
	var paused = false;
	
	var addListeners = function() {

		playToggleButton.addEventListener( 'mouseover', playToggleOverHandler );
		playToggleButton.addEventListener( 'mouseout',  playToggleOutHandler );
		playToggleButton.addEventListener( 'click',     playToggleClickHandler );

		timeline.eventCallback( 'onUpdate', update );
		timeline.eventCallback( 'onComplete', onComplete );
		timeline.eventCallback( 'onStart', onStart );

		progressContainer.addEventListener( 'mousedown', progressMouseDownHandler );
	};

	(function(){
		addDomElements();
		addListeners();
		updateDuration();
	})();

	function update() {
		var p = timeline.progress();
		var t = timeline.time();
		var d = timeline.duration();
		var w = (p*100)+"%";
		progressBar.style.width = w;
		updateTime();
	}

	function onStart() {
		complete = false;
		updatePlayIcon();
	}

	function onComplete() {
		complete = true;
		updatePlayIcon();
	}

	function playToggleOverHandler() {
		TweenMax.to( playToggleContainer, 0.2, { smoothify:true, backgroundColor:"#5adeff", ease:Power2.easeOut } );
	}

	function playToggleOutHandler() {
		TweenMax.to( playToggleContainer, 0.2, { smoothify:true, backgroundColor:"#00CCFF", ease:Power2.easeOut } );
	}

	function playToggleClickHandler() {
		if( timeline.paused() ) {
			timeline.play();
			paused = false;
		} else if( complete === true ) {
			timeline.restart();
			paused = false;
		} else {
			timeline.pause();
			paused = true;
		}
		updatePlayIcon();
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

	function updatePlayIcon() {
		if( paused === true || complete === true ) {
			TweenMax.set( ".tc-play-icon", { autoAlpha:1 } );
			TweenMax.set( ".tc-pause-icon", { autoAlpha:0 } );
		} else {
			TweenMax.set( ".tc-play-icon", { autoAlpha:0 } );
			TweenMax.set( ".tc-pause-icon", { autoAlpha:1 } );
		}
	}

	function progressMouseDownHandler( e ){
		progressOffsetX = e.pageX - e.offsetX;
		document.body.addEventListener( 'mousemove', progressMouseMoveHandler );
		document.body.addEventListener( 'mouseup', progressMouseUpHandler );
		progressMouseMoveHandler( e );
	}

	function progressMouseMoveHandler( e ) {
		var w = progressContainer.offsetWidth;
		var x = e.pageX - progressOffsetX;
		var p = x/w;
		var t = timeline.totalDuration() * p;
		seek( t, true );
	}

	function progressMouseUpHandler( e ) {
		document.body.removeEventListener( 'mousemove', progressMouseMoveHandler );
		document.body.removeEventListener( 'mouseup', progressMouseUpHandler );
		if( paused === false ) timeline.resume();
	}

	function seek( time, pause ){
		timeline.seek( time );
		if( pause ) timeline.pause();
		update();
	}

	function addDomElements() {

		container = document.createElement( 'div' );
		container.id = "tc-container";
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
		playToggleContainer.id = "tc-playToggleContainer";
		playToggleContainer.style.width = "30px";
		playToggleContainer.style.height = "30px";
		playToggleContainer.style.backgroundColor = "#00CCFF";
		playToggleContainer.style.position = "absolute";
		playToggleContainer.style.top = "26px";
		playToggleContainer.style.left = "5px";

		playToggleIcons = document.createElement( 'div' );
		playToggleIcons.id = "tc-playToggleIcons";
		playToggleIcons.style.width = "8px";
		playToggleIcons.style.height = "16px";
		playToggleIcons.style.position = "absolute";
		playToggleIcons.style.top = "7px";
		playToggleIcons.style.left = "11px";
		playToggleIcons.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="16px" viewBox="0 0 8 16" enable-background="new 0 0 8 16" xml:space="preserve"><path class="tc-play-icon" d="M0,0l8,8l-8,8V0z"/><path class="tc-pause-icon" d="M8,16H5V0h3V16z"/><path class="tc-pause-icon" d="M3,16H0V0h3V16z"/></svg>'
		playToggleContainer.appendChild( playToggleIcons );

		playToggleButton = document.createElement( 'div' );
		playToggleButton.id = "tc-playToggleButton";
		playToggleButton.style.width = "100%";
		playToggleButton.style.height = "100%";
		playToggleButton.style.position = "absolute";
		playToggleButton.style.top = "0px";
		playToggleButton.style.left = "0px";
		playToggleButton.style.cursor = "pointer";
		playToggleContainer.appendChild( playToggleButton );

		container.appendChild( playToggleContainer );

		progressContainer = document.createElement( 'div' );
		progressContainer.id = "tc-progressContainer";
		progressContainer.style.width = "355px";
		progressContainer.style.height = "30px";
		progressContainer.style.lineHeight = "30px";
		progressContainer.style.position = "absolute";
		progressContainer.style.top = "26px";
		progressContainer.style.left = "40px";
		progressContainer.style.backgroundColor = "#000000";

		progressBar = document.createElement( 'div' );
		progressBar.id = "tc-progressBar";
		progressBar.style.width = "1px";
		progressBar.style.height = "100%";
		progressBar.style.backgroundColor = "#FF00CC";
		progressBar.style.position = "absolute";
		progressBar.style.top = "0px";
		progressBar.style.left = "0px";
		progressContainer.appendChild( progressBar );

		container.appendChild( progressContainer );

		timeContainer = document.createElement( 'div' );
		timeContainer.id = "tc-timeContainer";
		timeContainer.style.position = "absolute";
		timeContainer.style.top = "58px";
		timeContainer.style.left = "42px";
		timeContainer.style.fontSize = "10px";
		container.appendChild( timeContainer );

		durationContainer = document.createElement( 'div' );
		durationContainer.id = "tc-durationContainer";
		durationContainer.style.position = "absolute";
		durationContainer.style.top = "58px";
		durationContainer.style.right = "5px";
		durationContainer.style.fontSize = "10px";
		container.appendChild( durationContainer );

	};
}