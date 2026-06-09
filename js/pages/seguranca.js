document.addEventListener('DOMContentLoaded', function() {
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var content = this.querySelector('.tip-content');
            if (content) {
                var text = content.textContent.trim();
                if (window.Accessibility && window.Accessibility.TTS) {
                    window.Accessibility.TTS.falar(text);
                }
            }
        });
    });
});
