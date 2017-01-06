var controller = function( tl, pos ) {

	var css = document.createElement( 'style' );
	css.innerHTML = ""

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
	var labelsContainer = null;
	var frameLabels = null;
	var loopCheckBoxContainer = null;
	var loopCheckBoxLabel = null;
	var loopCheckBoxInput = null;
	var fpsCheckBoxContainer = null;
	var fpsCheckBoxLabel = null;
	var fpsCheckBoxInput = null;
	var fpsMeterContainer = null;

	var progressOffsetX = 0;

	var complete = false;
	var paused = false;

	var stats = null;
	
	var addListeners = function() {

		playToggleButton.addEventListener( 'mouseover', playToggleOverHandler );
		playToggleButton.addEventListener( 'mouseout',  playToggleOutHandler );
		playToggleButton.addEventListener( 'click',     playToggleClickHandler );

		timeline.eventCallback( 'onUpdate', update );
		timeline.eventCallback( 'onComplete', onComplete );
		timeline.eventCallback( 'onStart', onStart );

		progressContainer.addEventListener( 'mousedown', progressMouseDownHandler );

		fpsCheckBoxInput.addEventListener( 'click', fpsCheckBoxClickHandler );
	};

	var addFrameLabels = function() {
		var labels = timeline.getLabelsArray();
		var name, time, value, html;
		for (var i = 0; i < labels.length; i++) {
		    name = labels[ i ].name;
		    time = labels[ i ].time;
		    value = Math.floor( (time/timeline.duration()) * 100 );
		    var div = document.createElement( 'div' );
		    div.style.position = "absolute";
		    div.style.left = value + "%";
		    div.style.top = "0";
			div.style.borderLeft = "1px solid #FFFFFF";
			div.style.marginLeft = "-1px";
			div.style.paddingLeft = "1px";
			div.style.color = "#00CCFF";
			div.style.fontSize = "9px";
			div.style.cursor = "pointer";
			div.innerHTML = name;
			div.addEventListener( "click", labelClickedHandler );
			div.addEventListener( "mouseover", labelOverHandler );
			div.addEventListener( "mouseout", labelOutHandler );
			labelsContainer.appendChild( div );
		}
	};

	var createDomElement = function( id, css, container ) {
		var div = document.createElement( 'div' );
		div.id = id;
		div.style.cssText = css;
		container.appendChild( div );
		return div;
	};

	var showFpsMeter = function() {
		stats = new Stats();
		stats.domElement.style.cssText = 'position:absolute;';
		fpsMeterContainer.appendChild( stats.domElement );
		requestAnimationFrame(function loop(){
			if( fpsCheckBoxInput.checked === true ) {

				stats.update();
				requestAnimationFrame(loop);
			}
			
		});
	};

	var hideFpsMeter = function() {
		fpsMeterContainer.innerHTML = "";
		stats = null;
	};

// ********** INIT **********
	(function(){
		addDomElements();
		addListeners();
		updateDuration();
		addFrameLabels();
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
		if( loopCheckBoxInput.checked === true ) {
			timeline.restart();
		} else {
			complete = true;
			updatePlayIcon();
		}
		
	}

	function playToggleOverHandler() {
		TweenMax.to( playToggleContainer, 0.2, { backgroundColor:"#FF00CC", ease:Power2.easeOut } );
	}

	function playToggleOutHandler() {
		TweenMax.to( playToggleContainer, 0.2, { backgroundColor:"#b0008d", ease:Power2.easeOut } );
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

	function labelClickedHandler( e ) {
		seek( e.target.innerHTML );
	}

	function labelOverHandler( e ) {
		var label = e.target;
		TweenMax.to( label, 0.25, { color:"#FFFFFF", ease:Power2.easeOut } );
	}

	function labelOutHandler( e ) {
		var label = e.target;
		TweenMax.to( label, 0.25, { color:"#00CCFF", ease:Power2.easeOut } );
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

	function fpsCheckBoxClickHandler() {
		console.log(fpsCheckBoxInput.checked)
		if( fpsCheckBoxInput.checked === true ) {
			showFpsMeter();
		} else {
			hideFpsMeter();
		}

	}

	function seek( time, pause ){
		timeline.seek( time );
		if( pause ) timeline.pause();
		update();
	}

	function addDomElements() {

		var containerCss =  'width:400px;'+
							'height:200px;'+
							'position:absolute;'+
							'left:'+position.x+'px;'+
							'top:'+position.y+'px;'+
							'background-color:#0E2B50;'+
							'color:#FFFFFF;'+
							'font:12px arial,serif;';
		container = createDomElement( "tc-container", containerCss, document.body );

		var headerCss = 'width:392px;'+
						'height:12px;'+
						'background-color:#020714;'+
						'color:#75d5ff;'+
						'padding:4px;'+
						'border-bottom:1px solid #3467A5;'+
						'font-size:10px;'+
						'color:#75d5ff;';
		var header = createDomElement( "tc-header", headerCss, container );
		header.innerHTML = "GSAP Timeline Controller";

		var playToggleCss = 'width:30px;'+
							'height:30px;'+
							'background-color:#b0008d;'+
							'position:absolute;'+
							'top:42px;'+
							'left:5px;';
		playToggleContainer = createDomElement( "tc-playToggleContainer", playToggleCss, container );

		var playIconsCss =  'width:8px;'+
							'height:16px;'+
							'position:absolute;'+
							'top:7px;'+
							'left:11px;';
		playToggleIcons = createDomElement( "tc-playToggleIcons", playIconsCss, playToggleContainer );
		playToggleIcons.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="16px" viewBox="0 0 8 16" enable-background="new 0 0 8 16" xml:space="preserve"><path class="tc-play-icon" fill="#FFFFFF" d="M0,0l8,8l-8,8V0z"/><path class="tc-pause-icon" fill="#FFFFFF" d="M8,16H5V0h3V16z"/><path class="tc-pause-icon" fill="#FFFFFF" d="M3,16H0V0h3V16z"/></svg>';

		var playButtonCss = 'width:100%;'+
							'height:100%;'+
							'position:absolute;'+
							'top:0px;'+
							'left:0px;'+
							'cursor:pointer;';
		playToggleButton = createDomElement( "tc-playToggleButton", playButtonCss, playToggleContainer );

		var progressContainerCss = 	'width:355px;'+
									'height:30px;'+
									'line-height:30px;'+
									'position:absolute;'+
									'top:42px;'+
									'left:40px;'+
									'background-color:#000000;'+
									'cursor:pointer;';
		progressContainer = createDomElement( "tc-progressContainer", progressContainerCss, container );

		var progressBarCss = 'width:1px;'+
							 'height:100%;'+
							 'position:absolute;'+
							 'top:0px;'+
							 'left:0px;'+
							 'background-color:#FF00CC;';
		progressBar = createDomElement( "tc-progressContainer", progressBarCss, progressContainer );

		var labelsContainerCss = 'width:355px;'+
							 	 'height:15px;'+
							 	 'position:absolute;'+
							 	 'top:72px;'+
							 	 'left:40px;';
		labelsContainer = createDomElement( "tc-labelsContainer", labelsContainerCss, container );

		var timeContainerCss =  'position:absolute;'+
							 	'top:52px;'+
							 	'left:42px;'+
							 	'font-size:10px;';
		timeContainer = createDomElement( "tc-timeContainer", timeContainerCss, container );

		var durationContainerCss = 	'position:absolute;'+
							 		'top:52px;'+
							 		'right:8px;'+
							 		'font-size:10px;';
		durationContainer = createDomElement( "tc-durationContainer", durationContainerCss, container );

		var loopCheckboxCss = 'position:absolute;'+
							  'top:23px;'+
							  'right:5px;';
		loopCheckBoxContainer = createDomElement( "tc-loopCheckBoxContainer", loopCheckboxCss, container );
		
		loopCheckBoxLabel = document.createElement( 'label' );
		loopCheckBoxLabel.style.fontSize = "10px";
		loopCheckBoxLabel.innerHTML = "Loop";
		loopCheckBoxContainer.appendChild( loopCheckBoxLabel );

		loopCheckBoxInput = document.createElement( 'input' );
		loopCheckBoxInput.style.cursor = "pointer";
		loopCheckBoxInput.type = "checkbox";
		loopCheckBoxInput.checked = true;
		loopCheckBoxContainer.appendChild( loopCheckBoxInput );

		var fpsCheckboxCss = 'position:absolute;'+
							 'top:100px;'+
							 'left:5px;';
		fpsCheckBoxContainer = createDomElement( "tc-fpsCheckBoxContainer", fpsCheckboxCss, container );
		
		fpsCheckBoxLabel = document.createElement( 'label' );
		fpsCheckBoxLabel.style.fontSize = "10px";
		fpsCheckBoxLabel.innerHTML = "FPS:";
		fpsCheckBoxContainer.appendChild( fpsCheckBoxLabel );

		fpsCheckBoxInput = document.createElement( 'input' );
		fpsCheckBoxInput.style.cursor = "pointer";
		fpsCheckBoxInput.type = "checkbox";
		fpsCheckBoxInput.checked = false;
		fpsCheckBoxContainer.appendChild( fpsCheckBoxInput );

		var fpsMeterCss =   'position:absolute;'+
							'top:100px;'+
							'left:60px;';
		fpsMeterContainer = createDomElement( 'tc-fpsMeterContainer', fpsMeterCss, container );

		/*var stats = new Stats();
		stats.domElement.style.cssText = 'position:absolute;';
		fpsMeterContainer.appendChild( stats.domElement );
		requestAnimationFrame(function loop(){
			if( fpsCheckBoxInput.checked === true ) {

				stats.update();

			}
			requestAnimationFrame(loop);
		})*/

	};
}

/*var stats = new Stats();
stats.domElement.style.cssText = 'position:fixed;right:0;bottom:0;z-index:10000';
document.body.appendChild(stats.domElement);
requestAnimationFrame(function loop() {
stats.update();
requestAnimationFrame(loop)
});*/