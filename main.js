// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player2;
function onYouTubeIframeAPIReady() {
    player2 = new YT.Player('player2', {
    height: '390',
    width: '640',
    videoId: 'iWEqBaDTJ2M',
    playerVars: {
        'playsinline': 1
    },
    events: {
        'onReady': onPlayer2Ready,
        'onStateChange': onPlayer2StateChange
    }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayer2Ready(event) {
    console.log('onPlayerReady', event);
    player2.mute();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayer2StateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player2.stopVideo();
}