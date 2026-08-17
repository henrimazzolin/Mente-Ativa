document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var musicGroups = [
        {
            id: 'mpb-classicos',
            label: 'MPB / Clássicos brasileiros',
            tracks: [
                { title: 'O Mundo é um Moinho', artist: 'Cartola', videoId: 'ud9PlROstDw' },
                { title: 'As Rosas Não Falam', artist: 'Cartola', videoId: '5j3QjEk-6c0' },
                { title: 'Garota de Ipanema', artist: 'Tom Jobim & Vinicius de Moraes', videoId: 'rOAGNjCYprY' },
                { title: 'Como é Grande o Meu Amor por Você', artist: 'Roberto Carlos', videoId: 'Vtt7kCtdc_4' },
                { title: 'Emoções', artist: 'Roberto Carlos', videoId: 'sS7dMnE30OM' },
                { title: 'O Calhambeque', artist: 'Roberto Carlos', videoId: 'jAFaY_UXaYo' },
                { title: 'Sentado à Beira do Caminho', artist: 'Erasmo Carlos', videoId: 'i9DEYD2jEmI' },
                { title: 'Trem das Onze', artist: 'Adoniran Barbosa', videoId: 'RkkGVgOqPuM' },
                { title: 'Metamorfose Ambulante', artist: 'Raul Seixas', videoId: 'CmB4sfoZkwo' },
                { title: 'Construção', artist: 'Chico Buarque', videoId: 'wBfVsucRe1w' },
                { title: 'Naquela Mesa', artist: 'Nelson Gonçalves', videoId: 'Wmfhn6CplYg' }
            ]
        },
        {
            id: 'sertanejo',
            label: 'Sertanejo',
            tracks: [
                { title: 'Evidências', artist: 'Chitãozinho & Xororó', videoId: 'bxo9mtJjvS0' },
                { title: 'Fio de Cabelo', artist: 'Chitãozinho & Xororó', videoId: 'hGc6F5VXIGQ' },
                { title: 'Sinônimos', artist: 'Chitãozinho & Xororó', videoId: 'wdbrRRy99Eg' },
                { title: 'É o Amor', artist: 'Zezé Di Camargo & Luciano', videoId: 'LsWA1b_iCE4' },
                { title: 'Boate Azul', artist: 'Joaquim & Manuel', videoId: 'lKQ-jIAhaxI' },
                { title: 'Telefone Mudo', artist: 'Trio Parada Dura', videoId: 'pq2JKVI6F5s' },
                { title: 'Ainda Ontem Chorei de Saudade', artist: 'João Mineiro & Marciano', videoId: 'apeCgPDZGy8' },
                { title: 'Pense em Mim', artist: 'Leandro & Leonardo', videoId: 'VD5RrI3w9Ws' }
            ]
        },
        {
            id: 'rock-pop-nacional',
            label: 'Rock / Pop nacional',
            tracks: [
                { title: 'Tempo Perdido', artist: 'Legião Urbana', videoId: 'tI9kSZgMLsc' },
                { title: 'Será', artist: 'Legião Urbana', videoId: 'S_hY89b05mo' },
                { title: 'Pais e Filhos', artist: 'Legião Urbana', videoId: 'sfixHYBWaiU' },
                { title: 'Anna Júlia', artist: 'Los Hermanos', videoId: 'umMIcZODm2k' },
                { title: 'Whisky a Go-Go', artist: 'Roupa Nova', videoId: 'oLv8ZPZrbf4' },
                { title: 'Fico Assim Sem Você', artist: 'Adriana Partimpim', videoId: 'iojYDSjKK00' },
                { title: 'Sandra Maria Magdalena', artist: 'Moraes Moreira', videoId: '1j9OVcGK1lk' }
            ]
        },
        {
            id: 'internacionais',
            label: 'Internacionais',
            tracks: [
                { title: 'Self Control', artist: 'Laura Branigan', videoId: 'RP0_8J7uxhs' },
                { title: 'Big In Japan', artist: 'Alphaville', videoId: 'tl6u2NASUzU' },
                { title: 'Take On Me', artist: 'a-ha', videoId: 'djV11Xbc914' },
                { title: 'Eyes Without A Face', artist: 'Billy Idol', videoId: '9OFpfTd0EIs' },
                { title: 'Billie Jean', artist: 'Michael Jackson', videoId: 'Zi_XLOBDo_Y' },
                { title: "Livin' on a Prayer", artist: 'Bon Jovi', videoId: 'lDK9QqIzhwk' },
                { title: "It's My Life", artist: 'Bon Jovi', videoId: 'vx2u5uUu3DE' },
                { title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper', videoId: 'PIb6AZdTr-A' },
                { title: "Stayin' Alive", artist: 'Bee Gees', videoId: 'fNFzfwLM72c' },
                { title: 'Take My Breath Away', artist: 'Berlin', videoId: 'Bx51eegLTY8' },
                { title: 'Eye of the Tiger', artist: 'Survivor', videoId: 'btPJPFnesV4' }
            ]
        }
    ];

    function renderPlaylist() {
        var playlist = document.getElementById('playlist');
        var total = 0;

        musicGroups.forEach(function (group) {
            var section = document.createElement('section');
            section.className = 'music-group';
            section.setAttribute('aria-labelledby', 'group-' + group.id);

            var heading = document.createElement('div');
            heading.className = 'music-group-heading';
            var title = document.createElement('h3');
            title.id = 'group-' + group.id;
            title.textContent = group.label;
            var count = document.createElement('strong');
            count.textContent = group.tracks.length + ' faixas';
            heading.appendChild(title);
            heading.appendChild(count);
            section.appendChild(heading);

            var list = document.createElement('div');
            list.className = 'music-group-list';

            group.tracks.forEach(function (track) {
                total += 1;

                var card = document.createElement('article');
                card.className = 'track-card';

                var player = document.createElement('div');
                player.className = 'track-player';

                var iframe = document.createElement('iframe');
                iframe.src = 'https://www.youtube-nocookie.com/embed/' + track.videoId + '?rel=0';
                iframe.title = track.title + ' - ' + track.artist;
                iframe.loading = 'lazy';
                iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                player.appendChild(iframe);

                var info = document.createElement('div');
                info.className = 'track-info';
                var name = document.createElement('strong');
                name.textContent = track.title;
                var artist = document.createElement('span');
                artist.textContent = track.artist;
                info.appendChild(name);
                info.appendChild(artist);

                card.appendChild(player);
                card.appendChild(info);
                list.appendChild(card);
            });

            section.appendChild(list);
            playlist.appendChild(section);
        });

        var countEl = document.getElementById('playlistCount');
        if (countEl) {
            countEl.textContent = total + ' faixas';
        }
    }

    renderPlaylist();
});
