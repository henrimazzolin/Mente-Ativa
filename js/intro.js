/* ============================================
   JavaScript da Intro Cinematográfica
   ============================================ */

(function() {
    // Mostrar apenas na primeira vez da sessao atual, sem persistir no dispositivo.
    try {
        if (sessionStorage.getItem('intro_vista')) {
            const intro = document.getElementById('intro-overlay');
            if (intro) intro.style.display = 'none';
            document.body.style.overflow = '';
            return;
        }
    } catch(e) {}

    try { sessionStorage.setItem('intro_vista', 'true'); } catch(e) {}

    var intro = document.getElementById('intro-overlay');
    if (!intro) return;

    document.body.classList.add('ma-intro-active');

    var title = document.getElementById('title');
    var main = document.getElementById('main');
    var desc = document.getElementById('desc');
    var continueButton = document.getElementById('introContinue');
    var closed = false;

    var text = "Mente Ativa";
    var index = 0;

    function typeWriter() {
        if (!title) return;
        if (index === 0) {
            title.textContent = "";
            title.style.opacity = 1;
        }

        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 80 + Math.random() * 40);
        } else {
            title.classList.add('typing');
        }
    }

    function finishIntro(immediate) {
        if (closed) return;
        closed = true;
        document.body.style.overflow = '';

        if (immediate) {
            intro.style.display = 'none';
            document.body.classList.remove('ma-intro-active');
            document.dispatchEvent(new CustomEvent('mente-ativa-intro-fechada'));
            return;
        }

        intro.classList.add('intro-fade-out');
        setTimeout(function() {
            intro.style.display = 'none';
            document.body.classList.remove('ma-intro-active');
            document.dispatchEvent(new CustomEvent('mente-ativa-intro-fechada'));
        }, 500);
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishIntro(true);
        return;
    }

    // Sequência curta de animações
    setTimeout(function() {
        if (main) main.classList.add('move');
        if (title) { title.style.opacity = 1; typeWriter(); }
    }, 500);

    setTimeout(function() {
        if (desc) {
            desc.style.opacity = 1;
            desc.style.transform = 'translateY(0)';
            desc.style.transition = 'all 0.8s ease';
        }
    }, 1800);

    // Clique para fechar
    intro.addEventListener('click', function(event) {
        if (event.target === continueButton) return;
        finishIntro(false);
    });
    if (continueButton) {
        continueButton.addEventListener('click', function(event) {
            event.stopPropagation();
            finishIntro(false);
        });
        continueButton.focus();
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.key === 'Enter') finishIntro(false);
    });

    // Fechar automaticamente em no máximo 3,5 segundos.
    setTimeout(function() { finishIntro(false); }, 3500);
})();
