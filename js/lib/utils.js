window.MenteAtiva = window.MenteAtiva || {};

MenteAtiva.utils = {
    shuffleArray: function(array) {
        var shuffled = Array.prototype.slice.call(array);
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    },

    getRandomItems: function(array, count) {
        var shuffled = this.shuffleArray(array);
        return shuffled.slice(0, count);
    },

    getRandomItem: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    showElement: function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('show');
    },

    hideElement: function(id) {
        var el = document.getElementById(id);
        if (el) el.classList.remove('show');
    },

    playBeep: function(freq, duration) {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq || 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (duration || 0.3));
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + (duration || 0.3));
        } catch (e) {}
    },

    showFeedback: function(title, text, btnText, onReplay) {
        var overlay = document.getElementById('overlay');
        var feedback = document.getElementById('feedback');
        var feedbackIcon = document.getElementById('feedbackIcon');
        var feedbackTitle = document.getElementById('feedbackTitle');
        var feedbackText = document.getElementById('feedbackText');
        var feedbackBtn = document.getElementById('feedbackBtn');

        if (!overlay || !feedback) return;

        if (feedbackIcon) {
            feedbackIcon.className = 'feedback-icon success';
            feedbackIcon.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
        }
        if (feedbackTitle) feedbackTitle.textContent = title || 'Parabéns!';
        if (feedbackText) feedbackText.textContent = text || '';
        if (feedbackBtn) {
            feedbackBtn.textContent = btnText || 'Jogar Novamente';
            feedbackBtn.onclick = function() {
                MenteAtiva.utils.hideFeedback();
                if (onReplay) onReplay();
            };
        }

        overlay.classList.add('show');
        feedback.classList.add('show');
    },

    hideFeedback: function() {
        var overlay = document.getElementById('overlay');
        var feedback = document.getElementById('feedback');
        if (overlay) overlay.classList.remove('show');
        if (feedback) feedback.classList.remove('show');
    },

    imgPlaceholder: 'img/placeholder.svg',

    setImgErrorHandler: function(img) {
        img.onerror = function() {
            if (!img.dataset.fallback) {
                img.dataset.fallback = 'true';
                img.src = MenteAtiva.utils.imgPlaceholder;
            }
        };
    },

    formatTime: function(minutes) {
        if (minutes < 60) return minutes + 'min';
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        return h + 'h' + (m > 0 ? m + 'min' : '');
    },

    toggleLeitura: function(texto) {
        if (window.Accessibility && window.Accessibility.TTS) {
            window.Accessibility.TTS.falar(texto);
        }
    }
};
