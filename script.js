// =====================================================
// HELON — comportamento básico
// Propositalmente enxuto: sem bibliotecas externas.
// =====================================================

const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const temMouseFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// MENU MOBILE
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('aberto');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('aberto'));
    });
}


// =====================================================
// INDICADOR DESLIZANTE DO MENU
// =====================================================

const navIndicador = document.querySelector('.nav-indicador');
const navLinks = document.querySelectorAll('.nav > a');

if (navIndicador && navLinks.length) {
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            navIndicador.style.width = link.offsetWidth + 'px';
            navIndicador.style.transform = `translateX(${link.offsetLeft}px)`;
        });
    });
}


// =====================================================
// HEADER: SOMBRA SUAVE AO ROLAR
// =====================================================

const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('rolado', window.scrollY > 30);
    }, { passive: true });
}


// =====================================================
// TÍTULOS DIVIDIDOS EM PALAVRAS
// Preserva <br> como quebra de linha real.
// =====================================================

function dividirTitulo(elemento) {

    const nos = Array.from(elemento.childNodes);
    elemento.innerHTML = '';

    nos.forEach((no) => {

        if (no.nodeType === Node.TEXT_NODE) {

            no.textContent.trim().split(/\s+/).forEach((palavra) => {
                if (!palavra) return;

                const linha = document.createElement('span');
                linha.className = 'linha-palavra';

                const span = document.createElement('span');
                span.className = 'palavra';
                span.textContent = palavra + '\u00A0';

                linha.appendChild(span);
                elemento.appendChild(linha);
            });

        } else {
            elemento.appendChild(no.cloneNode(true));
        }
    });
}

document.querySelectorAll('.titulo-dividido').forEach(dividirTitulo);


// =====================================================
// REVELAÇÃO LEVE AO ROLAR A PÁGINA
// Sem bibliotecas — só IntersectionObserver nativo do
// navegador, bem mais leve que animar com JS a cada frame.
// Cobre tanto ".reveal" quanto os títulos divididos —
// ambos usam a mesma classe "ativo" como gatilho.
// =====================================================

const elementosReveal = document.querySelectorAll('.reveal, .titulo-dividido');

if (elementosReveal.length && !reduzirMovimento) {

    const observerReveal = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('ativo');
                observerReveal.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elementosReveal.forEach(el => observerReveal.observe(el));

} else {
    elementosReveal.forEach(el => el.classList.add('ativo'));
}


// =====================================================
// TILT 3D NAS FOTOS DE PRODUTO + BOTÕES MAGNÉTICOS
// Só roda em telas com mouse de verdade — não faz
// sentido (nem tem custo) em touch.
// =====================================================

if (temMouseFino && !reduzirMovimento) {

    document.querySelectorAll('.peca-foto').forEach((foto) => {

        foto.addEventListener('mousemove', (e) => {
            foto.style.transition = 'transform 0.1s ease';
            const rect = foto.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            foto.style.transform = `rotateY(${px * 10}deg) rotateX(${py * -10}deg)`;
        });

        foto.addEventListener('mouseleave', () => {
            foto.style.transition = 'transform 0.5s ease';
            foto.style.transform = 'rotateY(0deg) rotateX(0deg)';
        });
    });

    document.querySelectorAll('.btn-cheio, .btn-seguir').forEach((botao) => {

        botao.addEventListener('mousemove', (e) => {
            botao.style.transition = 'transform 0.1s ease';
            const rect = botao.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            botao.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
        });

        botao.addEventListener('mouseleave', () => {
            botao.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            botao.style.transform = 'translate(0, 0)';
        });
    });
}


// FORMULÁRIO DA LISTA DE ESPERA (placeholder)
// Troque isso por uma integração real (Google Forms, planilha,
// Zapier, etc.) quando for usar de verdade.
const formEspera = document.querySelector('.form-espera');

if (formEspera) {
    formEspera.addEventListener('submit', (e) => {
        e.preventDefault();
        const numero = formEspera.querySelector('input').value;
        alert('Recebido! (isso é só um placeholder — conecte a um formulário real antes de publicar)\nWhatsApp informado: ' + numero);
        formEspera.reset();
    });
}
