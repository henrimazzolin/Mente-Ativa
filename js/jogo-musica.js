document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var audioContext = null;
    var sounds = [
        { name:'Sino', play:function(ctx,t){ [0,0.12,0.24].forEach(function(d,i){tone(ctx,880+i*220,t+d,0.8,'sine',0.18);}); } },
        { name:'Tambor', play:function(ctx,t){ tone(ctx,130,t,0.32,'sine',0.7,55); noise(ctx,t,0.16,0.18); } },
        { name:'Chocalho', play:function(ctx,t){ for(var i=0;i<5;i++) noise(ctx,t+i*0.12,0.08,0.22,3500); } },
        { name:'Piano', play:function(ctx,t){ [261.63,329.63,392].forEach(function(f,i){ tone(ctx,f,t+i*0.16,0.55,'triangle',0.22); }); } },
        { name:'Palmas', play:function(ctx,t){ noise(ctx,t,0.09,0.5,1400); noise(ctx,t+0.32,0.09,0.5,1400); } },
        { name:'Triângulo', play:function(ctx,t){ tone(ctx,1046.5,t,1.1,'sine',0.16); tone(ctx,2093,t,0.8,'sine',0.08); } }
    ];
    var rounds=[];
    var index=0;
    var correct=0;
    var answered=false;

    function ctx(){ if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)(); if(audioContext.state==='suspended') audioContext.resume(); return audioContext; }
    function tone(c,f,start,duration,type,volume,endFrequency){ var o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,start);if(endFrequency)o.frequency.exponentialRampToValueAtTime(endFrequency,start+duration);g.gain.setValueAtTime(volume,start);g.gain.exponentialRampToValueAtTime(0.001,start+duration);o.connect(g).connect(c.destination);o.start(start);o.stop(start+duration); }
    function noise(c,start,duration,volume,frequency){ var buffer=c.createBuffer(1,Math.floor(c.sampleRate*duration),c.sampleRate),data=buffer.getChannelData(0);for(var i=0;i<data.length;i++)data[i]=Math.random()*2-1;var source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency||2500;gain.gain.setValueAtTime(volume,start);gain.gain.exponentialRampToValueAtTime(.001,start+duration);source.connect(filter).connect(gain).connect(c.destination);source.start(start); }
    function shuffle(list){ return MenteAtiva.utils.shuffleArray(list); }
    function playCurrent(){ var c=ctx(); sounds.find(function(s){return s.name===rounds[index].name;}).play(c,c.currentTime+.04); document.getElementById('musicHint').textContent='Som reproduzido. Escolha uma resposta ou ouça novamente.'; }
    function buildOptions(){ var target=rounds[index],count=index<2?2:3;var options=[target].concat(shuffle(sounds.filter(function(s){return s.name!==target.name;})).slice(0,count-1));options=shuffle(options);var grid=document.getElementById('optionsGrid');grid.innerHTML='';options.forEach(function(item){var b=document.createElement('button');b.type='button';b.className='option-btn';b.textContent=item.name;b.onclick=function(){answer(item.name,b);};grid.appendChild(b);}); }
    function load(){ answered=false;document.getElementById('question').textContent=(index+1)+'/5';document.getElementById('nextBtn').style.display='none';document.getElementById('musicHint').textContent='Você pode ouvir quantas vezes quiser.';buildOptions(); }
    function answer(name,button){ if(answered)return;if(name!==rounds[index].name){button.classList.add('wrong');document.getElementById('musicHint').textContent='Quase! Ouça novamente e tente outra resposta.';setTimeout(function(){button.classList.remove('wrong');},600);return;}answered=true;correct++;document.getElementById('correct').textContent=correct;button.classList.add('correct');document.querySelectorAll('.option-btn').forEach(function(b){b.disabled=true;});document.getElementById('musicHint').textContent='Muito bem! Você reconheceu o som.';var next=document.getElementById('nextBtn');next.style.display='inline-flex';next.textContent=index===4?'Ver resultado':'Próximo som'; }
    function next(){ if(index===4){result();return;}index++;load(); }
    function result(){ var overlay=document.getElementById('overlay'),feedback=document.getElementById('feedback');document.getElementById('feedbackIcon').textContent='🎵';document.getElementById('feedbackTitle').textContent='Muito bem!';document.getElementById('feedbackText').textContent='Você reconheceu '+correct+' de 5 sons.';var b=document.getElementById('feedbackBtn');b.textContent='Jogar novamente';b.onclick=function(){overlay.classList.remove('show');feedback.classList.remove('show');start();};overlay.classList.add('show');feedback.classList.add('show'); }
    function start(){ rounds=shuffle(sounds.slice()).slice(0,5);index=0;correct=0;document.getElementById('correct').textContent='0';load(); }
    document.getElementById('playSound').addEventListener('click',playCurrent);
    document.getElementById('nextBtn').addEventListener('click',next);
    document.getElementById('feedbackBtn').addEventListener('click',function(){document.getElementById('overlay').classList.remove('show');document.getElementById('feedback').classList.remove('show');});
    start();
});
