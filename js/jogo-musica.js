document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var tracks = [
        { id: 'musica-01', title: 'Música 01', artist: 'Artista a definir', duration: '--:--', audioSrc: null },
        { id: 'musica-02', title: 'Música 02', artist: 'Artista a definir', duration: '--:--', audioSrc: null },
        { id: 'musica-03', title: 'Música 03', artist: 'Artista a definir', duration: '--:--', audioSrc: null },
        { id: 'musica-04', title: 'Música 04', artist: 'Artista a definir', duration: '--:--', audioSrc: null },
        { id: 'musica-05', title: 'Música 05', artist: 'Artista a definir', duration: '--:--', audioSrc: null },
        { id: 'musica-06', title: 'Música 06', artist: 'Artista a definir', duration: '--:--', audioSrc: null }
    ];
    var DEMO_DURATION = 30;
    var activeTrackId = null;
    var playing = false;
    var elapsed = 0;
    var timer = null;
    var lastTick = 0;
    var playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5Z"/></svg>';
    var pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6V5Zm8 0h4v14h-4V5Z"/></svg>';

    function formatTime(seconds) {
        return '0:' + String(Math.floor(seconds)).padStart(2, '0');
    }

    function activeTrack() {
        return tracks.find(function (track) { return track.id === activeTrackId; }) || null;
    }

    function setStatus(text) { document.getElementById('musicStatus').textContent = text; }

    function updateProgress() {
        var percentage = Math.min(100, elapsed / DEMO_DURATION * 100);
        document.getElementById('currentTime').textContent = formatTime(elapsed);
        document.getElementById('playerProgressFill').style.width = percentage + '%';
        var progress = document.querySelector('.player-progress');
        progress.setAttribute('aria-valuenow', String(Math.floor(elapsed)));
        progress.setAttribute('aria-valuetext', formatTime(elapsed) + ' de 0:30 da demonstração');
    }

    function updateTrackRows() {
        document.querySelectorAll('.track').forEach(function (row) {
            var isActive = row.dataset.trackId === activeTrackId;
            row.classList.toggle('active', isActive);
            var button = row.querySelector('.track-play');
            var isPlaying = isActive && playing;
            button.innerHTML = isPlaying ? pauseIcon : playIcon;
            button.setAttribute('aria-label', (isPlaying ? 'Pausar ' : (isActive && elapsed > 0 ? 'Retomar ' : 'Tocar ')) + row.dataset.trackTitle + '. Demonstração sem áudio.');
            button.setAttribute('aria-pressed', String(isPlaying));
        });
    }

    function stopTimer() {
        if (timer) window.clearInterval(timer);
        timer = null;
    }

    function finishDemo() {
        stopTimer();
        playing = false;
        elapsed = DEMO_DURATION;
        updateProgress();
        updateTrackRows();
        setStatus('Demonstração concluída. Nenhum áudio foi reproduzido.');
    }

    function tick() {
        var now = Date.now();
        elapsed += (now - lastTick) / 1000;
        lastTick = now;
        if (elapsed >= DEMO_DURATION) {
            finishDemo();
            return;
        }
        updateProgress();
    }

    function startTimer() {
        stopTimer();
        lastTick = Date.now();
        timer = window.setInterval(tick, 200);
    }

    function selectTrack(track) {
        var isSameTrack = activeTrackId === track.id;
        if (!isSameTrack) {
            activeTrackId = track.id;
            elapsed = 0;
            document.getElementById('currentTrackTitle').textContent = track.title;
            document.getElementById('currentTrackArtist').textContent = track.artist + ' · demonstração sem áudio';
            document.getElementById('nowPlaying').classList.add('active');
        } else if (elapsed >= DEMO_DURATION) {
            elapsed = 0;
        }

        playing = isSameTrack ? !playing : true;
        if (playing) {
            startTimer();
            setStatus('Prévia visual em andamento. Não há som nesta versão.');
        } else {
            stopTimer();
            setStatus('Prévia visual pausada.');
        }
        updateProgress();
        updateTrackRows();
    }

    function renderPlaylist() {
        var playlist = document.getElementById('playlist');
        tracks.forEach(function (track) {
            var row = document.createElement('article');
            row.className = 'track';
            row.dataset.trackId = track.id;
            row.dataset.trackTitle = track.title;

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'track-play';
            button.innerHTML = playIcon;
            button.setAttribute('aria-label', 'Tocar ' + track.title + '. Demonstração sem áudio.');
            button.setAttribute('aria-pressed', 'false');
            button.addEventListener('click', function () { selectTrack(track); });

            var info = document.createElement('div');
            info.className = 'track-info';
            var title = document.createElement('strong');
            title.textContent = track.title;
            var artist = document.createElement('span');
            artist.textContent = track.artist;
            info.appendChild(title);
            info.appendChild(artist);

            var badge = document.createElement('span');
            badge.className = 'track-badge';
            badge.textContent = 'Em breve';
            var duration = document.createElement('span');
            duration.className = 'track-duration';
            duration.textContent = track.duration;

            row.appendChild(button);
            row.appendChild(info);
            row.appendChild(badge);
            row.appendChild(duration);
            playlist.appendChild(row);
        });
    }

    renderPlaylist();
    updateProgress();
});
