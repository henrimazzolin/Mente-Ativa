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

    _somAtivo: (function() { return localStorage.getItem('mente-ativa-som') !== 'false'; })(),
    _audioCtx: null,
    _getAudioCtx: function() {
        if (!this._audioCtx) {
            try {
                this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) { return null; }
        }
        if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
        }
        return this._audioCtx;
    },
    somAtivo: function(ativo) {
        if (ativo !== undefined) this._somAtivo = ativo;
        return this._somAtivo;
    },
    playBeep: function(freq, duration) {
        if (!this._somAtivo) return;
        try {
            var ctx = this._getAudioCtx();
            if (!ctx) return;
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
    playCorrect: function() {
        if (!this._somAtivo) return;
        try {
            var ctx = this._getAudioCtx();
            if (!ctx) return;
            var osc1 = ctx.createOscillator();
            var osc2 = ctx.createOscillator();
            var gain = ctx.createGain();
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.25, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc1.frequency.setValueAtTime(523, ctx.currentTime);
            osc1.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
            osc2.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.3);
            osc2.start(ctx.currentTime + 0.2);
            osc2.stop(ctx.currentTime + 0.4);
        } catch (e) {}
    },
    playWrong: function() {
        if (!this._somAtivo) return;
        try {
            var ctx = this._getAudioCtx();
            if (!ctx) return;
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    },
    playComplete: function() {
        if (!this._somAtivo) return;
        try {
            var ctx = this._getAudioCtx();
            if (!ctx) return;
            var notes = [523, 587, 659, 784];
            notes.forEach(function(n, i) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
                osc.frequency.value = n;
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.25);
            });
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
            feedbackBtn.textContent = btnText || 'Jogar novamente';
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
