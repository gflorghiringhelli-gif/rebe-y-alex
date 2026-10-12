let yaAbrio = false;
let explosionActivada = false;
const circulosCompletados = [false, false, false];

function activarInvitacion() {
    if (yaAbrio) return;
    yaAbrio = true;

    const imgSobre = document.getElementById('imgSobreEstetica');
    const videoSobre = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    const btnTexto = document.getElementById('btn-toca-abrir');
    const musica = document.getElementById('musicaInvitacion');
    const musicIcon = document.getElementById('music-toggle');

    if (btnTexto) {
        btnTexto.innerHTML = "ABRIENDO INVITACIÓN... 💌";
        btnTexto.style.opacity = "0.7";
    }

    if (musica) {
        musica.currentTime = 0;
        musica.play().catch(e => console.log("Audio play err:", e));
    }
    if (musicIcon) musicIcon.style.display = 'flex';
    if (imgSobre) imgSobre.style.opacity = '0';

    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();

        const procederAInvitacion = () => {
            transicionAFinal(intro);
        };

        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoSobre.onended = procederAInvitacion;
            }).catch(() => {
                procederAInvitacion();
            });
        } else {
            videoSobre.onended = procederAInvitacion;
        }

        setTimeout(procederAInvitacion, 3500);
    } else {
        transicionAFinal(intro);
    }
}

function transicionAFinal(intro) {
    if (intro) {
        intro.style.transition = "opacity 0.8s ease";
        intro.style.opacity = '0';
    }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const seccionFinal = document.getElementById('seccion-final');

        if (seccionFinal) seccionFinal.classList.remove('oculto');

        window.scrollTo(0, 0);
        iniciarAnimacionesScroll();
    }, 800);
}

function revelarCirculo(card, idx) {
    if (circulosCompletados[idx]) return;
    circulosCompletados[idx] = true;

    const overlay = document.getElementById(`tap-${idx}`);
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
    }

    const container = card.querySelector('.circle-reveal-content');
    if (container) container.classList.add('revealed-glow');

    if (circulosCompletados.every(Boolean) && !explosionActivada) {
        explosionActivada = true;
        const infoRevealed = document.getElementById('stdRevealedInfo');
        if (infoRevealed) {
            infoRevealed.classList.add('show-revealed');
        }
    }
}

function toggleGiftAccordion(btn) {
    const content = document.getElementById('giftAccordion');
    btn.classList.toggle('active');
    content.classList.toggle('open');
}

function toggleFaq(item) {
    item.classList.toggle('active');
}

function toggleMusic() {
    const musica = document.getElementById('musicaInvitacion');
    const icon = document.getElementById('music-toggle');
    if (!musica || !icon) return;
    
    if (musica.paused) {
        musica.play();
        icon.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        icon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarToast("¡Dato copiado con éxito! 📋");
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function mostrarToast(txt) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = txt;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}