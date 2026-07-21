document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var canvas = document.getElementById('simplePaintCanvas');
    var ctx = canvas.getContext('2d');
    var colors = [{v:'#2563EB',n:'azul'},{v:'#EF4444',n:'vermelha'},{v:'#16A34A',n:'verde'},{v:'#F59E0B',n:'laranja'},{v:'#7C3AED',n:'roxa'},{v:'#111827',n:'preta'}];
    var color = colors[0].v;
    var drawing = false;
    var erasing = false;

    function fillWhite() { ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
    function point(event) { var r=canvas.getBoundingClientRect(); return {x:(event.clientX-r.left)*canvas.width/r.width,y:(event.clientY-r.top)*canvas.height/r.height}; }
    function status(text) { document.getElementById('simplePaintStatus').textContent=text; }
    function setTool(erase) {
        erasing=erase;
        document.getElementById('simpleBrush').classList.toggle('active',!erase);
        document.getElementById('simpleBrush').setAttribute('aria-pressed',String(!erase));
        document.getElementById('simpleEraser').classList.toggle('active',erase);
        document.getElementById('simpleEraser').setAttribute('aria-pressed',String(erase));
        status(erase?'Borracha selecionada.':'Pincel selecionado.');
    }
    colors.forEach(function(item,index){ var b=document.createElement('button'); b.type='button'; b.className='simple-color'+(index===0?' active':''); b.style.background=item.v; b.setAttribute('aria-label','Usar cor '+item.n); b.setAttribute('aria-pressed',String(index===0)); b.onclick=function(){ color=item.v; erasing=false; document.querySelectorAll('.simple-color').forEach(function(x){x.classList.remove('active');x.setAttribute('aria-pressed','false');}); b.classList.add('active');b.setAttribute('aria-pressed','true');setTool(false);status('Cor '+item.n+' selecionada.');}; document.getElementById('simpleColors').appendChild(b); });
    canvas.addEventListener('pointerdown',function(e){drawing=true;canvas.setPointerCapture(e.pointerId);var p=point(e);ctx.beginPath();ctx.moveTo(p.x,p.y);});
    canvas.addEventListener('pointermove',function(e){if(!drawing)return;var p=point(e);ctx.strokeStyle=erasing?'#fff':color;ctx.lineWidth=erasing?42:18;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke();});
    function stop(){drawing=false;ctx.closePath();}
    canvas.addEventListener('pointerup',stop); canvas.addEventListener('pointercancel',stop);
    document.getElementById('simpleBrush').onclick=function(){setTool(false);};
    document.getElementById('simpleEraser').onclick=function(){setTool(true);};
    document.getElementById('simpleClear').onclick=function(){exibirConfirmacao('Limpar a pintura?','Todo o desenho será apagado.',function(){fillWhite();status('Tela limpa. Escolha uma cor para continuar.');});};
    fillWhite();
});
