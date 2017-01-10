
var controller = function( timeline ) {

    var container = null;
    var controller = null;
    var info = null;
    var controls = null;
    var playButton = null;
    var time = null;
    var currentTime = null;
    var totalTime = null;
    var progress = null;
    var progressTime = null;
    var progressOffsetX = 0;
    var rangeContainer = null;
    var rangeBg = null;
    var seekFill = null;
    var seekDrag = null;
    var progressHit = null;
    var loopContainer = null;

    var complete = false;
    var paused = false;
    var looping = true;

    var styles = document.head.appendChild(document.createElement('style'));
    styles.innerHTML = 
        '#tc-container{'+
            'width:500px;'+
            'height:75px;'+
            'background-color:#000000;'+
            'position:absolute;'+
            'font-family: Arial, Helvetica, san-serif;'+
        '}'+
        '#tc-controller{'+
            'width:100%;'+
            'height:100%;'+
            'font-family:Arial,Helvetica,san-serif;'+
            'font-size:0;'+
            'background-color:#333333;'+
            'position:relative;'+
        '}'+
        '#tc-info{'+
            'display:inline;'+
            'font-size:11px;'+
            'line-height:15px;'+
            'color:#CCCCCC;'+
            
            'position:absolute;'+
            'top:7px;'+
            'left:10px;'+
        '}'+
        '#tc-controls{'+
            'padding: 0 10px;'+
            '-moz-box-sizing: border-box;'+
            '-webkit-box-sizing: border-box;'+
            'box-sizing: border-box;'+
            'position:absolute;'+
            'display:table;'+
            'bottom:10px;'+
            'width:100%;'+
            'height:35px;'+
            'color:#FFF;'+
            'border-spacing:0;'+
        '}'+
        '#tc-playButton{'+
            'width:40px;'+
        '}'+
        '#tc-time{'+
            'font-size:10px;'+
            'width:70px;'+
        '}'+
        '#currentTime{'+
            'border-right:2px solid #7D7575;'+
            'padding-right:4px;'+
        '}'+
        '#totalTime{'+
            'color:b90094;'+
            'padding-left:4px;'+
        '}'+

        '#progressContainer {'+
          'width:auto;'+
          'position:relative;'+
        '}'+

        '#rangeContainer {'+
          'padding: 0 7px 0 5px;'+
        '}'+

        '#progressHit{'+
            'display:block;'+
            'height:12px;'+
            'position:absolute;'+
            'top:6px;'+
            'left:5px;'+
            'width:96%;'+
            'cursor:pointer;'+
        '}'+

        '#labelsContainer{'+
            'display:block;'+
            'height:12px;'+
            'position:absolute;'+
            'top:6px;'+
            'left:6px;'+
            'width:95%;'+
            'pointer-events:none;'+
        '}'+

        '.frameMarker{'+
            'position:absolute;'+
            'top: 1px;'+
            'height:10px;'+
            'cursor:pointer;'+
            
        '}'+

        '.frameMarker .marker{'+
            'position:absolute;'+
            'top:0;'+
            'width:5px;'+
            'height:10px;'+
            'border-left: 2px solid #00CCFF;'+
            'margin-left: -1px;'+
            'padding-left:1px;'+
            'color: #00CCFF;'+
            'pointer-events:all;'+
        '}'+

        '.frameMarker:hover .marker{'+
            'border-left: 2px solid #FFFFFF;'+
        '}'+

        '.frameMarker label {'+
            'pointer-events:all;'+
            'position:relative;'+
            'height:0px;'+
            'display:none;'+
        '}'+

        '.frameMarker:hover label.expandable, label.expandable:hover {'+
            'display:block;'+
            '-webkit-border-radius: 5px 5px 0px 0px;'+
            'border-radius: 5px 5px 0px 0px;'+
            'margin-top:-20px;'+
            'padding:5px;'+
            'height:10px;'+
        '}'+

        '#rangeBg {'+
          'display:block;'+
          'height:10px;'+
          'position:relative;'+
          'top:6px;'+
          'padding:0;'+
          'background-color: rgba(162, 49, 139, 0.5);'+
          'border: 1px solid rgba(210, 58, 180, 0.5);'+
          'cursor:pointer;'+
        '}'+

        '#seekFill {'+
          'height:10px;'+
          'background-color:#de1eb8;'+
          'border:1px solid #FF00CC;'+
          'position:absolute;'+
          'top:6px;'+
          'cursor:pointer;'+
          '-webkit-box-shadow: 0px 0px 3px 1px rgba(255, 255, 150, 0.2);'+
          'box-shadow: 0px 0px 3px 1px rgba(255, 255, 150, 0.2);'+
        '}'+

        '#seekDrag {'+
          'height:14px;'+
          'width:4px;'+
          'background-color:#FF00CC;'+
          'position:absolute;'+
          'top:4px;'+
          'margin-left:2px;'+
          'border:1px solid #000;'+
          'cursor:pointer;'+
          'opacity:0;'+
          'cursor:pointer;'+
        '}'+

        '#rangeContainer:hover #seekDrag {'+
          'opacity:1;'+
        '}'+

        '#right {'+
          'width: 40px;'+
        '}'+

        '#tc-loopContainer {'+
          'width:40px;'+
          'cursor:pointer;'+
        '}'+

        '#tc-loopContainer:hover label.expandable, label.expandable:hover {'+
            '-webkit-border-radius: 5px 5px 0px 0px;'+
            'border-radius: 5px 5px 0px 0px;'+
            'margin-top:-20px;'+
            'padding-bottom:5px;'+
            'height:15px;'+
        '}'+

        '#loopIcon{'+
            'margin-top:2px;'+
        '}'+

        '#tc-loopContainer:hover #loopIcon path{'+
            'fill:#FFFFFF;'+
        '}'+

        '.group {'+
          'display:table-cell;'+
          'position:relative;'+
          'vertical-align:top;'+
        '}'+
        '.group:after {'+
          'content:" ";'+
          'display:block;'+
          'height:5px;'+
          'background-color:rgba(0, 0,0,0.6);'+
          'margin-top:1px;'+
          'margin-right:1px;'+
        '}'+
        '.group:first-child:after {'+
          'display:none;'+
        '}'+
        '.group:last-child:after {'+
          '-webkit-border-radius: 0 0 5px 0;'+
          'border-radius: 0 0 5px 0;'+
        '}'+
        '.group:last-child a:last-child {'+
          'margin-right:0;'+
        '}'+
        '.group:first-child > * {'+
          '-webkit-border-radius: 5px 0px 0px 5px;'+
          'border-radius: 5px 0px 0px 5px;'+
        '}'+

        'a {'+
          'font-size:20px;'+
          'display:block;'+
          'color:#FF00CC;'+
          'margin:0 1px 0 0;'+
          'height:35px;'+
          'line-height:35px;'+
          'position:relative;'+
          'background-color: rgba(0,0,0,0.6);'+
          'text-align:center;'+
          'padding:0;'+
          'cursor:pointer;'+
        '}'+
        'a:hover {'+
          'color:#000;'+
          'background-color:#FF00CC;'+
        '}'+
        'a:hover .tc-play-icon, a:hover .tc-pause-icon {'+
          'fill:#000;'+
        '}'+
        '.tc-pause-icon{'+
            'opacity:0;'+
        '}'+

        'label {'+
          'display:block;'+
          'position:absolute;'+
          'top:-6px;'+
          'left:0;'+
          'right:0;'+
          'height:0;'+
          'line-height:20px;'+
          'font-size:10px;'+
          'color:#FFF;'+
          'width:100%;'+
          'padding-top:5px;'+
          'padding-bottom:0;'+
          'background-color:rgba(0,0,0,0.6);'+
          'overflow:hidden;'+
        '}'+

        '.static {'+
          'margin-bottom:0;'+
          'margin-top:6px;'+
          'height:23px;'+
          'line-height:23px;'+
          'background-color:rgba(0,0,0,0.6);'+
          'text-align:center;'+
          'position:relative;'+
          'bottom:0;'+
          'margin-right:1px;'+
          'font-size:0;'+
          'padding:0;'+
        '}'+
        '.static span {'+
          'font-size:10px;'+
        '}'+

        'td, tr {'+
          'padding:0;'+
          'border-spacing:0;'+
          'border-collapse:collapse;'+
        '}'+

        '.last {'+
          '-webkit-border-radius: 0px 5px 5px 0px;'+
          'border-radius: 0px 5px 5px 0px;'+
          'margin-right:0;'+
        '}'

        ;

    var position = {
        set x( val ) {
            container.style.left = val + "px";
        },

        set y( val ) {
            container.style.top = val + "px";
        }
    };

    var size = {
        set width( val ) {
            container.style.width = val + "px";
        },
        set height( val ) {
            container.style.height = val + "px";
        }
    };

    var createDomElement = function( container, id ) {
        var div = document.createElement( 'div' );
        if( id ) div.id = id;
        container.appendChild( div );
        return div;
    };

    var addListeners = function() {

        playButton.addEventListener( 'click', playButtonClickHandler );

        timeline.eventCallback( 'onUpdate', update );
        timeline.eventCallback( 'onComplete', onComplete );
        timeline.eventCallback( 'onStart', onStart );

        progressHit.addEventListener( 'mousedown', startSeek );

        loopContainer.addEventListener( 'click', loopClickHandler );

        /*fpsCheckBoxInput.addEventListener( 'click', fpsCheckBoxClickHandler );*/
    };

    var addFrameLabels = function() {
        var labels = timeline.getLabelsArray();
        var name, time, value, html;
        for (var i = 0; i < labels.length; i++) {
            name = labels[ i ].name;
            time = labels[ i ].time;
            value = Math.floor( (time/timeline.duration()) * 100 );
            var div = document.createElement( 'div' );
            div.className = "frameMarker";
            div.style.left = value + "%";
            div.id = name;
            div.innerHTML = 
                '<label class="expandable">'+ name + '</label>'+
                '<div class="marker" id="'+ name + '"></div>';
            //div.addEventListener( 'mouseover', frameMarkerOverHandler );
            //div.addEventListener( 'mouseout', frameMarkerOutHandler );
            div.addEventListener( 'click', frameMarkerClickHandler );
            var label = document.createElement('label');
            label.className = "expandable";
            labelsContainer.appendChild( div );
        }
    };

    var init = function() {
        // create main container
        container = createDomElement( document.body, "tc-container" );

        // controller
        controller = createDomElement( container, "tc-controller" );

        // info
        info = createDomElement( container, "tc-info" );
        info.innerHTML = "GSAP Timeline Controller";
        // controls
        controls = createDomElement( container, "tc-controls" );

        // play toggle
        playButton = createDomElement( controls, "tc-playButton" );
        playButton.className = "group";
        playButton.innerHTML = 
            '<a id="play">'+
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8px" height="16px" viewBox="0 0 8 16" enable-background="new 0 0 8 16" xml:space="preserve"><path class="tc-play-icon" fill="#FF00CC" d="M0,0l8,8l-8,8V0z"/><path class="tc-pause-icon" fill="#FF00CC" d="M8,16H5V0h3V16z"/><path class="tc-pause-icon" fill="#FF00CC" d="M3,16H0V0h3V16z"/></svg>'+
            '</a>';

        // time
        time = createDomElement( controls, "tc-time" );
        time.className = "group";
        time.innerHTML = 
            '<div class="static">'+
                '<label></label>'+
                '<span id="currentTime">00:00</span>'+
                '<span id="totalTime">00:00</span>'+
            '</div>';
        currentTime = document.getElementById( 'currentTime' );
        totalTime = document.getElementById( 'totalTime' );

        // progress
        progressContainer = createDomElement( controls, "tc-progressContainer" );
        progressContainer.className = "group";
        progressContainer.innerHTML = 
            '<div class="static" id="rangeContainer">'+
                '<label></label>'+
                '<div id="rangeBg"></div>'+
                '<div id="seekFill"></div>'+
                '<div id="seekDrag"></div>'+
                '<div id="progressHit"></div>'+
                '<div id="labelsContainer"></div>'+
            '</div>';
        rangeContainer = document.getElementById( 'rangeContainer' );
        rangeBg = document.getElementById( 'rangeBg' );
        seekFill = document.getElementById( 'seekFill' );
        seekDrag = document.getElementById( 'seekDrag' );
        progressHit = document.getElementById( 'progressHit' );
        

        //loop
        loopContainer = createDomElement( controls, "tc-loopContainer" );
        loopContainer.className = "group";
        loopContainer.innerHTML = 
            '<div class="static">'+
                '<label class="expandable">LOOP</label>'+
                '<svg version="1.1" id="loopIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="17px" viewBox="0 0 25 17" enable-background="new 0 0 25 17" xml:space="preserve">'+
                    '<path fill="#FF00CC" d="M19.5,4.7h-3.8v2.8h3v4.2H6.3V7.5h4.2v2.2l4-3.6l-4-3.6v2.2h-5c-1.1,0-2,0.9-2,2v5.8c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.7C21.5,5.6,20.6,4.7,19.5,4.7z"/>'+
                '</svg>'+
            '</div>';

    };

    init();
    addListeners();
    updateDuration();
    addFrameLabels();

    function update() {
        var t = timeline.time();
        var d = timeline.duration();
        seekFill.style.width = Math.round((t/d)*(rangeBg.offsetWidth-2))+"px";
        seekDrag.style.left = Math.round((t/d)*(rangeBg.offsetWidth-2))+"px";
        updateTime();
    }

    function onStart() {
        complete = false;
        updatePlayIcon();
    }

    function onComplete() {
        if( looping === true ) {
            timeline.restart();
        } else {
            complete = true;
            updatePlayIcon();
        }
        
    }

    function playButtonClickHandler() {
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

    function updatePlayIcon() {
        if( paused === true || complete === true ) {
            TweenMax.set( ".tc-play-icon", { autoAlpha:1 } );
            TweenMax.set( ".tc-pause-icon", { autoAlpha:0 } );
        } else {
            TweenMax.set( ".tc-play-icon", { autoAlpha:0 } );
            TweenMax.set( ".tc-pause-icon", { autoAlpha:1 } );
        }
    }

    function updateTime() {
        var time = timeline.time();
        var sec = Math.floor( time );
        var mil = (time % 1).toFixed(2).substring(2);
        totalTime.innerHTML = sec + ":" + mil;
    }

    function updateDuration() {
        var dur = timeline.duration();
        var sec = Math.floor( dur );
        var mil = (dur % 1).toFixed(2).substring(2);
        currentTime.innerHTML = sec + ":" + mil;
    }

    function seek( time, pause ){
        
        if( typeof time === "string" ) {
            timeline.seek( time );
            if( pause ) timeline.pause();
            update();
        } 
        if( time >= 0 && time <= timeline.totalDuration() ) {
            timeline.seek( time );
            if( pause ) timeline.pause();
            update();
        }
        
    }

    function startSeek( e ){
        progressOffsetX = e.pageX - e.offsetX;
        document.body.addEventListener( 'mousemove', seekMouseMoveHandler );
        document.body.addEventListener( 'mouseup', seekMouseUpHandler );
        seekMouseMoveHandler( e );
    }

    function seekMouseMoveHandler( e ) {
        var w = rangeBg.offsetWidth;
        var x = e.pageX - progressOffsetX;
        var p = x/w;
        var t = timeline.totalDuration() * p;
        seek( t, true );
    }

    function seekMouseUpHandler( e ) {
        document.body.removeEventListener( 'mousemove', seekMouseMoveHandler );
        document.body.removeEventListener( 'mouseup', seekMouseUpHandler );
        if( paused === false ) timeline.resume();
    }

    function loopClickHandler( e ) {
        if( looping === true ){
            TweenMax.to( "#loopIcon > path", 0.2, { fill:"#666666", ease:Power2.easeOut } );
            looping = false;
        } else {
            TweenMax.to( "#loopIcon > path", 0.2, { fill:"#FF00CC", ease:Power2.easeOut } );
            looping = true;
        }
    }

    function frameMarkerOverHandler( e ){
        var marker = e.target;
        e.target.style.borderLeft = "2px solid white";
    }

    function frameMarkerOutHandler( e ){
        var marker = e.target;
        e.target.style.borderLeft = "2px solid #00CCFF";
    }

    function frameMarkerClickHandler( e ) {
        seek( e.target.id );
    }

    return {
        position:position,
        size:size
    }

}

