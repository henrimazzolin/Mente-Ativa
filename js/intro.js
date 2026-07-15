/* ============================================
   JavaScript da Intro Cinematográfica
   ============================================ */

(function() {
    // Mostrar apenas na primeira vez que acessar o site
    try {
        if (localStorage.getItem('intro_vista')) {
            const intro = document.getElementById('intro-overlay');
            if (intro) intro.style.display = 'none';
            document.body.style.overflow = '';
            return;
        }
    } catch(e) {}

    try { localStorage.setItem('intro_vista', 'true'); } catch(e) {}

    var intro = document.getElementById('intro-overlay');
    if (!intro) return;

    document.body.classList.add('ma-intro-active');

    var title = document.getElementById('title');
    var main = document.getElementById('main');
    var desc = document.getElementById('desc');

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

    // Sequência de animações
    setTimeout(function() {
        if (main) main.classList.add('move');
        if (title) { title.style.opacity = 1; typeWriter(); }
    }, 1800);

    setTimeout(function() {
        if (desc) {
            desc.style.opacity = 1;
            desc.style.transform = 'translateY(0)';
            desc.style.transition = 'all 0.8s ease';
        }
    }, 3500);

    function closeIntro() {
        intro.classList.add('intro-fade-out');
        document.body.style.overflow = '';
        setTimeout(function() {
            intro.style.display = 'none';
            document.body.classList.remove('ma-intro-active');
            document.dispatchEvent(new CustomEvent('mente-ativa-intro-fechada'));
        }, 800);
    }

    // Clique para fechar
    intro.addEventListener('click', closeIntro);

    // Fechar automaticamente após 12 segundos
    setTimeout(closeIntro, 12000);
})();
