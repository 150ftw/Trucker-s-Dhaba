/* ==========================================================================
   DHABA LOUDSPEAKER / RAAT KA WOH AAKHRI PADAAV - APP LOGIC
   Uses YouTube IFrame Player API with hidden iframe for actual playlist audio.
   Custom glass UI controls the hidden YT player.
   ========================================================================== */

// ── YOUTUBE PLAYLIST CONFIG ──
const YT_PLAYLIST_ID = 'PLGvMr3iU7xJE';

// ── DHABA OWNER QUOTES (17 rotating taglines) ──
const DHABA_TAGLINES = [
  "\"रात, चाय और पुराने गाने — बस यही तो है असली मुसाफ़िर का ठिकाना।\"",
  "\"चाय गरम है, रास्ता लंबा है — दो पल बैठो, पुराना गाना सुनो।\"",
  "\"चारपाई बिछी है, लाउडस्पीकर चालू है — रात का सफर बिना संगीत के कैसा?\"",
  "\"ट्रक का हॉर्न और बजता पुराना गाना — यही तो है असली हाइवे का ढाबा।\"",
  "\"आधा सफर कट गया, आधा बाकी है — कड़क अदरक चाय के साथ थोड़ा सुर मिला लो।\"",
  "\"रात 2 बजे की कड़क चाय और 90 के दशक की आवाज़ — सफर की थकान यहीं उतरती है।\"",
  "\"इंजन ठंडा कर लो साहब, जब तक गाना खत्म होगा, पराठा तैयार मिलेगा।\"",
  "\"चलती हवा, तारों भरी रात, और लाउडस्पीकर पर बस सुरमई तराने।\"",
  "\"जीटी रोड का ढाबा है, यहाँ घड़ी नहीं, गानों से वक़्त नापा जाता है।\"",
  "\"मुसाफिर हो तो दो घूंट पीकर जाओ, लाउडस्पीकर पर आपकी पसंद का तराना चल रहा है।\"",
  "\"सड़क की दूरियाँ कम नहीं होतीं, पर पुराने गानों से रास्ता छोटा लगता है।\"",
  "\"सफ़र शरीर को थका देता है, पर पुराने सुर रूह को तरोताज़ा कर देते हैं।\"",
  "\"रात के अंधेरे में सड़क की बत्तियां और लाउडस्पीकर पर गूंजती पुरानी यादें।\"",
  "\"हर रात के मुसाफ़िर को मालूम है — असली सुकून कड़क चाय और पुराने गानों में है।\"",
  "\"गाड़ी किनारे लगाओ, दो कदम चलो, और हाईवे की धूल को संगीत में बह जाने दो।\"",
  "\"कितनी भी दूर जाना हो, यहाँ हमेशा एक कप कड़क चाय और आपका पसंदीदा गाना मिलेगा।\"",
  "\"रास्ता कभी खत्म नहीं होता, पर बल्ब की रोशनी में वक्त ठहर सा जाता है।\""
];

// ── COVER ART IMAGES (cycle through for visual variety) ──
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80"
];

// ── DOM ELEMENTS ──
const tagLineEl = document.getElementById('dhaba-tagline');
const listenersCountEl = document.getElementById('listeners-count');
const clockEl = document.getElementById('highway-clock');

const pillArtBtn = document.getElementById('pill-art-btn');
const vinylWrap = document.getElementById('vinyl-wrap');
const trackCover = document.getElementById('track-cover');

const trackTitleEl = document.getElementById('track-title');
const trackArtistEl = document.getElementById('track-artist');
const timelineSlider = document.getElementById('timeline-slider');
const sliderProgressBar = document.getElementById('slider-progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeDuration = document.getElementById('time-duration');
const statusBadge = document.getElementById('status-badge');

const btnPlay = document.getElementById('btn-play');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnHiss = document.getElementById('btn-hiss');
const btnDrawer = document.getElementById('btn-drawer');
const btnCloseDrawer = document.getElementById('btn-close-drawer');
const playIconSvg = document.getElementById('play-icon-svg');

const playlistDrawer = document.getElementById('playlist-drawer');
const drawerTrackList = document.getElementById('drawer-track-list');

const toastEl = document.getElementById('toast-notify');
const toastTextEl = document.getElementById('toast-text');

// New enhancement DOM elements
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');
const btnVol = document.getElementById('btn-vol');
const volumeSlider = document.getElementById('volume-slider');
const volumeSliderWrap = document.getElementById('volume-slider-wrap');
const volIconSvg = document.getElementById('vol-icon-svg');
const visualizerBars = document.getElementById('visualizer-bars');
const firefliesContainer = document.getElementById('fireflies-container');

// ── STATE ──
let ytPlayer = null;
let isPlaying = false;
let isYTReady = false;
let timeUpdateInterval = null;
let isSeeking = false;
let playlistData = []; // populated after YT player loads playlist
let currentTrackIdx = 0;
let currentTaglineIdx = 0;
let isShuffleActive = false;
let isRepeatActive = false;
let currentVolume = 80;

// Web Audio hiss state
let isAudioContextInit = false;
let audioCtx = null;
let noiseNode = null;
let gainNode = null;
let isHissActive = false;

// ══════════════════════════════════════════════════════════════════════
// YOUTUBE IFRAME API — Dynamic Loader & Setup
// ══════════════════════════════════════════════════════════════════════
function initYouTubePlayer() {
  if (ytPlayer) return;
  console.log('[Dhaba] Initializing YT.Player for playlist:', YT_PLAYLIST_ID);

  try {
    ytPlayer = new YT.Player('yt-player', {
      height: '200',
      width: '200',
      playerVars: {
        listType: 'playlist',
        list: YT_PLAYLIST_ID,
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  } catch (err) {
    console.error('[Dhaba] Failed to initialize YT.Player:', err);
  }
}

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    initYouTubePlayer();
    return;
  }

  window.onYouTubeIframeAPIReady = function () {
    console.log('[Dhaba] onYouTubeIframeAPIReady callback fired');
    initYouTubePlayer();
  };

  if (!document.getElementById('yt-api-script')) {
    const tag = document.createElement('script');
    tag.id = 'yt-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(tag, firstScript);
    } else {
      document.head.appendChild(tag);
    }
  }
}

function onPlayerReady(event) {
  isYTReady = true;
  console.log('[Dhaba] YouTube Player ready. Playlist loaded.');
  if (statusBadge) statusBadge.textContent = 'लाउडस्पीकर तैयार है';

  setTimeout(() => {
    buildPlaylistFromYT();
    updateTrackInfo();
  }, 1000);
}

function onPlayerStateChange(event) {
  const state = event.data;

  switch (state) {
    case YT.PlayerState.PLAYING:
      isPlaying = true;
      updateUIState(true);
      startTimeTracking();
      updateTrackInfo();
      break;

    case YT.PlayerState.PAUSED:
      isPlaying = false;
      updateUIState(false);
      stopTimeTracking();
      break;

    case YT.PlayerState.ENDED:
      // YT auto-advances in playlist mode, but let's update UI
      showToast('अगला तराना चालू हो रहा है…');
      break;

    case YT.PlayerState.BUFFERING:
      if (statusBadge) statusBadge.textContent = 'बफ़रिंग…';
      break;

    case YT.PlayerState.CUED:
      updateTrackInfo();
      break;
  }
}

function onPlayerError(event) {
  console.error('[Dhaba] YouTube Player error:', event.data);
  showToast('गाना लोड नहीं हो पाया, अगला लगा रहे हैं…');
  // Try next track on error
  setTimeout(() => {
    if (ytPlayer && typeof ytPlayer.nextVideo === 'function') {
      ytPlayer.nextVideo();
    }
  }, 1500);
}

// ══════════════════════════════════════════════════════════════════════
// TRACK INFO & PLAYLIST MANAGEMENT
// ══════════════════════════════════════════════════════════════════════
function updateTrackInfo() {
  if (!ytPlayer || !isYTReady) return;

  try {
    const videoData = ytPlayer.getVideoData();
    const title = videoData.title || 'Loading…';
    const author = videoData.author || '';
    const idx = ytPlayer.getPlaylistIndex();

    if (trackTitleEl) trackTitleEl.textContent = title;
    if (trackArtistEl) trackArtistEl.textContent = author ? `• ${author}` : '';

    // Use YouTube video thumbnail as cover art
    const videoId = videoData.video_id;
    if (videoId && trackCover) {
      trackCover.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    currentTrackIdx = idx >= 0 ? idx : 0;
    highlightActiveDrawerItem(currentTrackIdx);
  } catch (e) {
    console.warn('[Dhaba] Could not get video data:', e);
  }
}

function buildPlaylistFromYT() {
  if (!ytPlayer || !isYTReady) return;

  try {
    const playlist = ytPlayer.getPlaylist();
    if (!playlist || playlist.length === 0) {
      console.warn('[Dhaba] Playlist is empty or not yet loaded.');
      // Retry after a delay
      setTimeout(buildPlaylistFromYT, 2000);
      return;
    }

    playlistData = playlist.map((videoId, idx) => ({
      videoId: videoId,
      index: idx,
      thumbnail: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }));

    console.log(`[Dhaba] Playlist built: ${playlistData.length} tracks`);
    renderPlaylistDrawer();
  } catch (e) {
    console.warn('[Dhaba] Error building playlist:', e);
  }
}

// We need to fetch video titles. YouTube IFrame API doesn't expose titles
// for non-playing videos, so we'll use a noembed fallback or show index.
function fetchVideoTitle(videoId, callback) {
  // Use noembed.com (free, no API key needed) to get video title
  fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`)
    .then(r => r.json())
    .then(data => {
      callback(data.title || `Track`, data.author_name || '');
    })
    .catch(() => {
      callback(`Track`, '');
    });
}

// ══════════════════════════════════════════════════════════════════════
// TIME TRACKING (poll YT player for currentTime & duration)
// ══════════════════════════════════════════════════════════════════════
function startTimeTracking() {
  stopTimeTracking();
  timeUpdateInterval = setInterval(() => {
    if (!ytPlayer || !isYTReady || isSeeking) return;

    try {
      const curr = ytPlayer.getCurrentTime() || 0;
      const dur = ytPlayer.getDuration() || 1;
      const percent = (curr / dur) * 100;

      if (timelineSlider) timelineSlider.value = percent;
      if (sliderProgressBar) sliderProgressBar.style.width = `${percent}%`;
      if (timeCurrent) timeCurrent.textContent = formatTime(curr);
      if (timeDuration) timeDuration.textContent = formatTime(dur);
    } catch (e) {}
  }, 250);
}

function stopTimeTracking() {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }
}

// ══════════════════════════════════════════════════════════════════════
// UI STATE UPDATES
// ══════════════════════════════════════════════════════════════════════
function updateUIState(playing) {
  if (playing) {
    if (vinylWrap) vinylWrap.classList.add('spinning');
    if (playIconSvg) playIconSvg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    if (statusBadge) statusBadge.textContent = 'लाउडस्पीकर चालू है';
    if (visualizerBars) visualizerBars.classList.add('active');
  } else {
    if (vinylWrap) vinylWrap.classList.remove('spinning');
    if (playIconSvg) playIconSvg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    if (statusBadge) statusBadge.textContent = 'आवाज़ धीमी है';
    if (visualizerBars) visualizerBars.classList.remove('active');
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ══════════════════════════════════════════════════════════════════════
// CONTROLS SETUP
// ══════════════════════════════════════════════════════════════════════
function setupControls() {
  // Play / Pause
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (!ytPlayer || !isYTReady) {
        showToast('लाउडस्पीकर तैयार हो रहा है… फिर से दबाएँ');
        loadYouTubeAPI();
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
          try { ytPlayer.playVideo(); } catch (e) {}
        }
        return;
      }

      if (isPlaying) {
        ytPlayer.pauseVideo();
      } else {
        ytPlayer.playVideo();
      }
    });
  }

  // Previous Track
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (!ytPlayer || !isYTReady) return;
      ytPlayer.previousVideo();
      showToast('पिछला तराना…');
    });
  }

  // Next Track
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!ytPlayer || !isYTReady) return;
      ytPlayer.nextVideo();
      showToast('अगले मुसाफिर की पसंद… 🎶');
    });
  }

  // Timeline Seek Slider
  if (timelineSlider) {
    timelineSlider.addEventListener('mousedown', () => { isSeeking = true; });
    timelineSlider.addEventListener('touchstart', () => { isSeeking = true; }, { passive: true });

    timelineSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (sliderProgressBar) sliderProgressBar.style.width = `${val}%`;
    });

    timelineSlider.addEventListener('change', (e) => {
      if (!ytPlayer || !isYTReady) { isSeeking = false; return; }
      const val = parseFloat(e.target.value);
      const dur = ytPlayer.getDuration() || 1;
      const seekTime = (val / 100) * dur;
      ytPlayer.seekTo(seekTime, true);
      isSeeking = false;
    });

    timelineSlider.addEventListener('mouseup', () => { isSeeking = false; });
    timelineSlider.addEventListener('touchend', () => { isSeeking = false; });
  }

  // Tape Hiss Toggle
  if (btnHiss) {
    btnHiss.addEventListener('click', () => {
      toggleTapeHiss();
    });
  }

  // Playlist Drawer Toggle
  if (pillArtBtn) {
    pillArtBtn.addEventListener('click', () => {
      togglePlaylistDrawer();
    });
  }

  if (btnDrawer) {
    btnDrawer.addEventListener('click', () => {
      togglePlaylistDrawer();
    });
  }

  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener('click', () => {
      closePlaylistDrawer();
    });
  }

  // ── SHUFFLE TOGGLE ──
  if (btnShuffle) {
    btnShuffle.addEventListener('click', () => {
      isShuffleActive = !isShuffleActive;
      btnShuffle.classList.toggle('active', isShuffleActive);
      if (ytPlayer && isYTReady) {
        ytPlayer.setShuffle(isShuffleActive);
      }
      showToast(isShuffleActive ? 'शफ़ल चालू 🔀' : 'शफ़ल बंद');
    });
  }

  // ── REPEAT TOGGLE ──
  if (btnRepeat) {
    btnRepeat.addEventListener('click', () => {
      isRepeatActive = !isRepeatActive;
      btnRepeat.classList.toggle('active', isRepeatActive);
      if (ytPlayer && isYTReady) {
        // setLoop(true) loops the entire playlist
        ytPlayer.setLoop(isRepeatActive);
      }
      showToast(isRepeatActive ? 'दोहराव चालू 🔁' : 'दोहराव बंद');
    });
  }

  // ── VOLUME CONTROL ──
  if (btnVol) {
    btnVol.addEventListener('click', (e) => {
      e.stopPropagation();
      if (volumeSliderWrap) {
        volumeSliderWrap.classList.toggle('visible');
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      currentVolume = parseInt(e.target.value, 10);
      if (ytPlayer && isYTReady) {
        ytPlayer.setVolume(currentVolume);
      }
      updateVolumeIcon(currentVolume);
    });
  }

  // Close volume popup when clicking outside
  document.addEventListener('click', (e) => {
    if (volumeSliderWrap && volumeSliderWrap.classList.contains('visible')) {
      const volControl = document.querySelector('.volume-control');
      if (volControl && !volControl.contains(e.target)) {
        volumeSliderWrap.classList.remove('visible');
      }
    }
  });
}

function updateVolumeIcon(vol) {
  if (!volIconSvg) return;
  if (vol === 0) {
    volIconSvg.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
  } else if (vol < 50) {
    volIconSvg.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
  } else {
    volIconSvg.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  }
}

// ══════════════════════════════════════════════════════════════════════
// PLAYLIST DRAWER
// ══════════════════════════════════════════════════════════════════════
function renderPlaylistDrawer() {
  if (!drawerTrackList || playlistData.length === 0) return;
  drawerTrackList.innerHTML = '';

  playlistData.forEach((track, idx) => {
    const item = document.createElement('div');
    item.className = `drawer-track-item ${idx === currentTrackIdx ? 'active' : ''}`;
    item.dataset.index = idx;

    item.innerHTML = `
      <img class="drawer-item-img" src="${track.thumbnail}" alt="Track ${idx + 1}">
      <div class="drawer-item-info">
        <span class="drawer-item-title" id="drawer-title-${idx}">Loading…</span>
        <span class="drawer-item-artist" id="drawer-artist-${idx}"></span>
      </div>
      <span class="drawer-item-play-icon">${idx === currentTrackIdx ? '▶' : ''}</span>
    `;

    item.addEventListener('click', () => {
      if (!ytPlayer || !isYTReady) return;
      ytPlayer.playVideoAt(idx);
      closePlaylistDrawer();
      showToast('अब बज रहा है…');
    });

    drawerTrackList.appendChild(item);

    // Fetch real title from noembed
    fetchVideoTitle(track.videoId, (title, author) => {
      const titleEl = document.getElementById(`drawer-title-${idx}`);
      const artistEl = document.getElementById(`drawer-artist-${idx}`);
      if (titleEl) titleEl.textContent = title;
      if (artistEl) artistEl.textContent = author ? `• ${author}` : '';
    });
  });
}

function highlightActiveDrawerItem(activeIdx) {
  if (!drawerTrackList) return;
  const items = drawerTrackList.querySelectorAll('.drawer-track-item');
  items.forEach((item, idx) => {
    const icon = item.querySelector('.drawer-item-play-icon');
    if (idx === activeIdx) {
      item.classList.add('active');
      if (icon) icon.textContent = '▶';
    } else {
      item.classList.remove('active');
      if (icon) icon.textContent = '';
    }
  });
}

function togglePlaylistDrawer() {
  if (!playlistDrawer) return;
  playlistDrawer.classList.toggle('open');
}

function closePlaylistDrawer() {
  if (!playlistDrawer) return;
  playlistDrawer.classList.remove('open');
}

// ══════════════════════════════════════════════════════════════════════
// TAGLINE ROTATION, CLOCK, PRESENCE
// ══════════════════════════════════════════════════════════════════════
function startTaglineRotation() {
  if (!tagLineEl) return;
  currentTaglineIdx = Math.floor(Math.random() * DHABA_TAGLINES.length);
  tagLineEl.textContent = DHABA_TAGLINES[currentTaglineIdx];

  setInterval(() => {
    currentTaglineIdx = (currentTaglineIdx + 1) % DHABA_TAGLINES.length;
    tagLineEl.style.opacity = '0';
    tagLineEl.style.transform = 'translateY(-6px)';

    setTimeout(() => {
      tagLineEl.textContent = DHABA_TAGLINES[currentTaglineIdx];
      tagLineEl.style.opacity = '1';
      tagLineEl.style.transform = 'translateY(0)';
    }, 600);
  }, 16000);
}

function startHighwayClock() {
  if (!clockEl) return;
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    clockEl.textContent = `${hours}:${minutes} ${ampm}`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

// REAL-TIME ACTIVE USERS TRACKER WITH BASE 200 OFFSET
const BASE_ONLINE_OFFSET = 200;
const SESSION_ID = 'dhaba_session_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
const BROADCAST_CHANNEL_NAME = 'dhaba_presence_channel';
let presenceChannel = null;

function setupListenersCount() {
  if (!listenersCountEl) return;

  function updatePresenceUI(activeTabs) {
    const totalCount = BASE_ONLINE_OFFSET + activeTabs;
    if (listenersCountEl) {
      listenersCountEl.textContent = `${totalCount} online at NH-44`;
    }
  }

  function sendHeartbeat() {
    try {
      const now = Date.now();
      let activeSessions = {};
      const rawData = localStorage.getItem('dhaba_active_sessions');
      if (rawData) {
        try { activeSessions = JSON.parse(rawData); } catch (e) {}
      }
      Object.keys(activeSessions).forEach(id => {
        if (now - activeSessions[id] > 6000) delete activeSessions[id];
      });
      activeSessions[SESSION_ID] = now;
      localStorage.setItem('dhaba_active_sessions', JSON.stringify(activeSessions));
      updatePresenceUI(Object.keys(activeSessions).length);
    } catch (e) {
      updatePresenceUI(1);
    }
  }

  sendHeartbeat();
  setInterval(sendHeartbeat, 2000);

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      presenceChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      presenceChannel.onmessage = (event) => {
        if (event.data && (event.data.type === 'PING' || event.data.type === 'CLOSE')) {
          sendHeartbeat();
        }
      };
      presenceChannel.postMessage({ type: 'PING' });
    } catch (e) {}
  }

  window.addEventListener('beforeunload', () => {
    try {
      const rawData = localStorage.getItem('dhaba_active_sessions');
      if (rawData) {
        const activeSessions = JSON.parse(rawData);
        delete activeSessions[SESSION_ID];
        localStorage.setItem('dhaba_active_sessions', JSON.stringify(activeSessions));
      }
      if (presenceChannel) {
        presenceChannel.postMessage({ type: 'CLOSE' });
        presenceChannel.close();
      }
    } catch (e) {}
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'dhaba_active_sessions') sendHeartbeat();
  });
}

// ══════════════════════════════════════════════════════════════════════
// WEB AUDIO AMBIENT TAPE HISS SYNTHESIZER
// ══════════════════════════════════════════════════════════════════════
function initAudioContext() {
  if (isAudioContextInit) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.16;
      b6 = white * 0.115926;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3200;

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start(0);
    isAudioContextInit = true;
  } catch (e) {
    console.warn('Web Audio API error:', e);
  }
}

function toggleTapeHiss() {
  if (!isAudioContextInit) initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

  isHissActive = !isHissActive;

  if (isHissActive) {
    if (btnHiss) btnHiss.classList.add('active');
    if (gainNode && audioCtx) {
      gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.14, audioCtx.currentTime);
    }
    showToast('टेप सरसराहट चालू है 📻');
  } else {
    if (btnHiss) btnHiss.classList.remove('active');
    if (gainNode && audioCtx) {
      gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
    showToast('टेप सरसराहट बंद');
  }
}

// ══════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATION
// ══════════════════════════════════════════════════════════════════════
let toastTimeout = null;
function showToast(message) {
  if (!toastEl || !toastTextEl) return;
  toastTextEl.textContent = message;
  toastEl.classList.remove('hidden');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 2800);
}

// ══════════════════════════════════════════════════════════════════════
// FLOATING FIREFLIES GENERATOR
// ══════════════════════════════════════════════════════════════════════
function spawnFireflies(count = 18) {
  if (!firefliesContainer) return;

  for (let i = 0; i < count; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';

    const size = 4 + Math.random() * 6;
    const x = Math.random() * 100;
    const y = 20 + Math.random() * 60; // middle 60% of screen vertically
    const duration = 8 + Math.random() * 12;
    const pulseDuration = 2 + Math.random() * 3;
    const delay = Math.random() * 6;

    // Randomize float path
    const dx1 = -60 + Math.random() * 120;
    const dy1 = -40 + Math.random() * 80;
    const dx2 = -60 + Math.random() * 120;
    const dy2 = -50 + Math.random() * 100;
    const dx3 = -60 + Math.random() * 120;
    const dy3 = -40 + Math.random() * 80;

    firefly.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --dx1: ${dx1}px;
      --dy1: ${dy1}px;
      --dx2: ${dx2}px;
      --dy2: ${dy2}px;
      --dx3: ${dx3}px;
      --dy3: ${dy3}px;
      --pulse-duration: ${pulseDuration}s;
      animation: fireflyFloat ${duration}s ease-in-out ${delay}s infinite;
    `;

    const glow = document.createElement('div');
    glow.className = 'firefly-glow';
    firefly.appendChild(glow);

    firefliesContainer.appendChild(firefly);
  }
}

// ══════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════════════════
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (ytPlayer && isYTReady) {
          if (isPlaying) ytPlayer.pauseVideo();
          else ytPlayer.playVideo();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (ytPlayer && isYTReady) {
          ytPlayer.nextVideo();
          showToast('अगले मुसाफिर की पसंद… 🎶');
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (ytPlayer && isYTReady) {
          ytPlayer.previousVideo();
          showToast('पिछला तराना…');
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        currentVolume = Math.min(100, currentVolume + 10);
        if (ytPlayer && isYTReady) ytPlayer.setVolume(currentVolume);
        if (volumeSlider) volumeSlider.value = currentVolume;
        updateVolumeIcon(currentVolume);
        showToast(`आवाज़: ${currentVolume}%`);
        break;
      case 'ArrowDown':
        e.preventDefault();
        currentVolume = Math.max(0, currentVolume - 10);
        if (ytPlayer && isYTReady) ytPlayer.setVolume(currentVolume);
        if (volumeSlider) volumeSlider.value = currentVolume;
        updateVolumeIcon(currentVolume);
        showToast(`आवाज़: ${currentVolume}%`);
        break;
      case 'KeyM':
        if (ytPlayer && isYTReady) {
          if (ytPlayer.isMuted()) {
            ytPlayer.unMute();
            showToast('आवाज़ चालू');
            updateVolumeIcon(currentVolume);
          } else {
            ytPlayer.mute();
            showToast('म्यूट 🔇');
            updateVolumeIcon(0);
          }
        }
        break;
    }
  });
}

// ══════════════════════════════════════════════════════════════════════
// HIGHWAY ATMOSPHERE MODES (CLEAR NIGHT / RAIN / FOG)
// ══════════════════════════════════════════════════════════════════════
const ATMOSPHERE_MODES = [
  { id: 'night', label: 'रात', icon: '🌙', toast: 'तारों भरी रात 🌌' },
  { id: 'rain', label: 'बारिश', icon: '🌧️', toast: 'हाईवे पर हल्की बारिश 🌧️' },
  { id: 'fog', label: 'धुंध', icon: '🌫️', toast: 'सर्दियों की धुंध 🌫️' }
];
let currentAtmosphereIdx = 0;

function setupAtmosphereModes() {
  const btnWeather = document.getElementById('btn-weather');
  const weatherIcon = document.getElementById('weather-icon');
  const weatherLabel = document.getElementById('weather-label');
  const rainContainer = document.getElementById('rain-container');
  const fogContainer = document.getElementById('fog-container');

  function spawnRain(count = 45) {
    if (!rainContainer) return;
    rainContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      const left = Math.random() * 100;
      const speed = 0.5 + Math.random() * 0.6;
      const delay = Math.random() * 2;
      drop.style.cssText = `left: ${left}%; --rain-speed: ${speed}s; animation-delay: ${delay}s;`;
      rainContainer.appendChild(drop);
    }
  }

  if (btnWeather) {
    btnWeather.addEventListener('click', () => {
      currentAtmosphereIdx = (currentAtmosphereIdx + 1) % ATMOSPHERE_MODES.length;
      const mode = ATMOSPHERE_MODES[currentAtmosphereIdx];

      if (weatherIcon) weatherIcon.textContent = mode.icon;
      if (weatherLabel) weatherLabel.textContent = mode.label;

      if (mode.id === 'rain') {
        if (rainContainer) rainContainer.classList.remove('hidden');
        if (fogContainer) fogContainer.classList.add('hidden');
        spawnRain(45);
      } else if (mode.id === 'fog') {
        if (rainContainer) rainContainer.classList.add('hidden');
        if (fogContainer) fogContainer.classList.remove('hidden');
      } else {
        if (rainContainer) rainContainer.classList.add('hidden');
        if (fogContainer) fogContainer.classList.add('hidden');
      }

      showToast(mode.toast);
    });
  }
}

// ══════════════════════════════════════════════════════════════════════
// ONE-TAP DIRECT SHARE & COPY LINK CONTROLLER
// ══════════════════════════════════════════════════════════════════════
const SHARE_URL = 'https://trucker-s-dhaba.vercel.app';

let copyModalTimeout = null;

function showCopyAlertModal() {
  const copyModal = document.getElementById('copy-alert-modal');
  if (!copyModal) return;

  copyModal.classList.remove('hidden');

  if (copyModalTimeout) clearTimeout(copyModalTimeout);
  copyModalTimeout = setTimeout(() => {
    copyModal.classList.add('hidden');
  }, 2600);

  copyModal.onclick = () => {
    copyModal.classList.add('hidden');
  };
}

function setupShareModal() {
  const btnShare = document.getElementById('btn-share');

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE_URL).then(() => {
          showCopyAlertModal();
        }).catch(() => {
          fallbackCopyText(SHARE_URL);
        });
      } else {
        fallbackCopyText(SHARE_URL);
      }
    });
  }
}

function fallbackCopyText(text) {
  try {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showCopyAlertModal();
  } catch (err) {
    showCopyAlertModal();
  }
}

// ══════════════════════════════════════════════════════════════════════
// INIT ON DOM READY
// ══════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  startTaglineRotation();
  startHighwayClock();
  setupListenersCount();
  setupControls();
  spawnFireflies(18);
  setupKeyboardShortcuts();
  setupAtmosphereModes();
  setupShareModal();
  loadYouTubeAPI();
});
