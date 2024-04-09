const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseBt = document.querySelector('#start-pause')
const musicaFocoInput = document.querySelector('#alternar-musica')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon") 
const tempoNaTela = document.querySelector('#timer')
const btnFechar = document.querySelector('.close');

const musica = new Audio('/sons/luna-rise-part-one.mp3')
const audioPlay = new Audio('/sons/play.wav');
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3')


let tempoDecorridoEmSegundos = 0
let intervaloId = null

musica.loop = true

musicaFocoInput.addEventListener('change', () => {
  musica.paused ? musica.play() : musica.pause()
})

const addClickEvent = (button, callback) => {
  button.removeEventListener('click', callback)
  button.addEventListener('click', callback)
}

curtoBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 300
  alterarContexto('descanso-curto')
  curtoBt.classList.add('active')
  addClickEvent(iniciarOuPausarBt, iniciarOuPausar)
})

longoBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 900
  alterarContexto('descanso-longo')
  longoBt.classList.add('active')
  addClickEvent(iniciarOuPausarBt, iniciarOuPausar)
})

focoBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 0
  alterarContexto('foco')
  focoBt.classList.add('active')
  addClickEvent(iniciarOuPausarBt, iniciarContagemProgressiva)
})

function alterarContexto(contexto) {
  mostrarTempo()
  botoes.forEach(contexto => contexto.classList.remove('active'))
  html.setAttribute('data-contexto', contexto)
  banner.setAttribute('src', `./imagens/${contexto}.png`)
  switch (contexto) {
    case "foco":
      titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
      break
    case "descanso-curto":
      titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
      break
    case "descanso-longo":
      titulo.innerHTML = `
            Hora de voltar à superfície.<strong class="app__title-strong"> Faça uma pausa longa.</strong>
            `
    default:
      break
  }
}

// Função para abrir o modal
function openModal() {
  document.getElementById("modal").style.display = "block";
}

// Função para fechar o modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Event listener para fechar o modal clicando no botão "X"
document.querySelector(".close").addEventListener("click", closeModal);

// Event listener para fechar o modal clicando fora dele
window.addEventListener("click", function (event) {
  if (event.target == document.getElementById("modal")) {
    closeModal();
  }
});

// Função para chamar a contagem regressiva no modal
function iniciarContagemRegressiva() {
  clearInterval(intervaloId);
  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarBt.textContent = "Pausar";
  iniciarOuPausarBtIcone.setAttribute('src', './imagens/pause.png');
}

function iniciarContagemProgressiva() {
  clearInterval(intervaloId);
  intervaloId = setInterval(contagemProgressiva, 1000);
  iniciarOuPausarBt.textContent = "Pausar";
  iniciarOuPausarBtIcone.setAttribute('src', './imagens/pause.png');
}

startPauseBt.addEventListener('click', () => {
  if (intervaloId) {
    audioPausa.play();
    zerar();
    return;
  }
  audioPlay.play();
  if (html.getAttribute('data-contexto') === 'foco') {
    iniciarContagemProgressiva();
  } else {
    iniciarContagemRegressiva();
  }
});

function iniciarOuPausar() {
  if (intervaloId) {
    audioPausa.play()
    zerar()
    return
  }
  audioPlay.play()
  intervaloId = setInterval(contagemProgressiva, 1000)
  iniciarOuPausarBt.textContent = "Pausar"
  iniciarOuPausarBtIcone.setAttribute('src', `./imagens/pause.png`)
}

function zerar() {
  clearInterval(intervaloId) 
  iniciarOuPausarBt.textContent = "Começar"
  iniciarOuPausarBtIcone.setAttribute('src', `./imagens/play_arrow.png`)
  intervaloId = null
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000)
  const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' })
  tempoNaTela.innerHTML = `${tempoFormatado}`
}

// Função para chamar o modal quando o tempo acabar
function contagemRegressiva() {
  if (tempoDecorridoEmSegundos <= 0) {
    audioTempoFinalizado.play();
    btnFechar.addEventListener('click', () => {
      audioTempoFinalizado.pause();
    });
    openModal();
    const focoAtivo = html.getAttribute('data-contexto') == 'foco';
    if (focoAtivo) {
      const evento = new CustomEvent('FocoFinalizado');
      document.dispatchEvent(evento);
    }
    zerar();
    return;
  }
  tempoDecorridoEmSegundos -= 1;
  mostrarTempo();
}

function contagemProgressiva() {
    tempoDecorridoEmSegundos += 1;
    mostrarTempo();
  }

mostrarTempo()