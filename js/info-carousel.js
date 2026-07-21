(function () {
    'use strict';

    function ativarCarousel(carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-video-slide]'));
        var status = carousel.querySelector('[data-carousel-status]');
        var indice = 0;

        function descarregar(slide) {
            var video = slide.querySelector('video');
            if (video) video.pause();
            var iframe = slide.querySelector('iframe');
            if (iframe) iframe.remove();
        }

        function carregar(slide) {
            var container = slide.querySelector('[data-youtube-id]');
            if (!container || container.querySelector('iframe')) return;
            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + container.dataset.youtubeId;
            iframe.title = slide.querySelector('h2').textContent;
            iframe.loading = 'lazy';
            iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            container.insertBefore(iframe, container.firstChild);
        }

        function mostrar(novoIndice) {
            descarregar(slides[indice]);
            indice = (novoIndice + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                var ativo = i === indice;
                slide.hidden = !ativo;
                slide.classList.toggle('active', ativo);
                slide.setAttribute('aria-hidden', String(!ativo));
            });
            carregar(slides[indice]);
            status.textContent = 'Vídeo ' + (indice + 1) + ' de ' + slides.length;
        }

        carousel.querySelector('[data-carousel-prev]').addEventListener('click', function () { mostrar(indice - 1); });
        carousel.querySelector('[data-carousel-next]').addEventListener('click', function () { mostrar(indice + 1); });
        carousel.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') { event.preventDefault(); mostrar(indice - 1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); mostrar(indice + 1); }
        });
        mostrar(0);
    }

    function init() {
        document.querySelectorAll('[data-video-carousel]').forEach(ativarCarousel);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
