const { ref, onMounted, nextTick } = Vue;

const app = Vue.createApp({
    setup(props) {
        const EMBEDDED_URL = 'https://www.youtube.com/embed/';

        const videoSource = ref([null, null]);
        const containerState = ref(['input', 'input']); // input or video
        const videoRef = ref(null);
        const videoBarValue = ref(0);
        const videoTime = ref('00:00:00');
        const videoType = ref(['file', 'youtube']); // file or youtube
        const youtubeID = ref('', '');
        const youtubeURL = ref([null, null]);
        const youtubeSource = ref([null, null]);
        const playerInstance = ref([null, null]);

        onMounted(() => {
            // createIFrameAPI(1, 'SGVSvi1OxE8', 'player2');
        });

        const chooseVideo = (event, index) => {
            const file = event.target.files[0];
            const src = window.URL.createObjectURL(file);

            containerState.value[index] = 'video';
            videoSource.value[index] = src;
        };
        const hoverVideo = (isHover) => {
            // currentVideo.value = videoRef.value;
        };
        const updateDisplayTime = () => {
            // currentVideo.value = videoRef.value;
            if (videoRef.value !== null) {
                videoTime.value = secondsToHms(videoRef.value.currentTime);
                videoBarValue.value = (videoRef.value.currentTime / videoRef.value.duration) * 100;
            }
        };
        const togglePlay = (event) => {
            // currentVideo.value = videoRef.value;
            const videoWidth = videoRef.value.offsetWidth;
            if ((event.offsetX > (videoWidth / 2 - videoWidth / 6)) &&
                (event.offsetX < (videoWidth / 2 + videoWidth / 6))
            ) {
                videoRef.value.paused ? videoRef.value.play() : videoRef.value.pause();
            }
        };
        const doubleClickHandler = (event) => {
            // currentVideo.value = videoRef.value;
            const videoWidth = videoRef.value.offsetWidth;
            if ((event.offsetX < videoWidth / 2 - videoWidth / 6)) {
                rewindVideo()
            } else if ((event.offsetX > videoWidth / 2 + videoWidth / 6)) {
                forwardVideo();
            }
        };
        const secondsToHms = (seconds) => {
            const number = Number(seconds);
            const h = Math.floor(number / 3600);
            const m = Math.floor(number % 3600 / 60);
            const s = Math.floor(number % 3600 % 60);

            const hDisplay = h >= 10 ? (h + '') : ('0' + h);
            const mDisplay = m >= 10 ? (m + '') : ('0' + m);
            const sDisplay = s >= 10 ? (s + '') : ('0' + s);
            return hDisplay + ':' + mDisplay + ':' + sDisplay;
        };
        const rewindVideo = () => {
            console.log('rewind');
            videoRef.value.currentTime -= 2;
        };
        const forwardVideo = () => {
            console.log('forward');
            videoRef.value.currentTime += 2;
        };
        const returnToInput = (index) => {
            videoRef.value = null;
            videoTime.value = '00:00:00';
            containerState.value[index] = 'input';
        };
        const dragVideoTime = () => {
            videoRef.value.currentTime = (videoBarValue.value / 100) * videoRef.value.duration;
        };
        const confirmURL = (blockIndex) => {
            let keywordIndex;
            const videoParameters = youtubeURL.value[blockIndex].split(/[/?=&]/);

            if (videoParameters.includes('watch')) {
                keywordIndex = videoParameters.indexOf('v');
            } else if (videoParameters.includes('youtu.be')) {
                keywordIndex = videoParameters.indexOf('youtu.be');
            } else if (videoParameters.includes('embed')) {
                keywordIndex = videoParameters.indexOf('embed');
            } else if (videoParameters.includes('live')) {
                keywordIndex = videoParameters.indexOf('live');
            }

            youtubeID.value = videoParameters[keywordIndex + 1];
            youtubeSource.value[blockIndex] = EMBEDDED_URL + youtubeID.value;
            containerState.value[blockIndex] = 'video';

            nextTick(() => {
                const playerId = 'player' + (parseInt(blockIndex) + 1);
                createIFrameAPI(blockIndex, youtubeID.value, playerId);
            });
            console.log('youtubeSource.value', youtubeSource.value[blockIndex]);
        };
        const createIFrameAPI = (index, videoId, playerId) => {
            window.YT.ready(function() {
                playerInstance[index] = new window.YT.Player(playerId, {
                    height: "390",
                    width: "640",
                    videoId: videoId,
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });
            });
        };
        const onPlayerReady = (event, index) => {
            console.log('onPlayerReady', event);
            event.target.mute();
        }
        const onPlayerStateChange = (event) => {
            console.log('onPlayerStateChange', event);
        }
        const changeVideoType = (index, tabName) => {
            videoType.value[index] = tabName;
        };

        return {
            videoRef,
            videoBarValue,
            videoType,
            videoTime,
            videoSource,
            youtubeURL,
            youtubeSource,
            containerState,
            chooseVideo,
            changeVideoType,
            hoverVideo,
            updateDisplayTime,
            togglePlay,
            doubleClickHandler,
            returnToInput,
            confirmURL,
            dragVideoTime
        }
    }
});

app.mount('#vueEntry');