var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

let gameOver = false;
let isGameRunning = false;
let imagesLoaded = 0;
const totalImages = 3;
const yInicio = 300;

// JavaScript - Manipulação de tela de menu e jogo
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    const howButton = document.getElementById('how');
    const backButtons = document.querySelectorAll('#back-to-menu');
    const backToMenuSelection = document.getElementById('back-to-menu-selection');
    const gameScreen = document.getElementById('game-screen');
    const howToPlayScreen = document.getElementById('how-to-play');
    const characterSelectionScreen = document.getElementById('character-selection');
    const characterGrid = document.getElementById('character-grid');
    const menuScreen = document.getElementById('menu');

    // Função para mostrar a tela de seleção de personagens
    function startGame() {
        menuScreen.style.display = 'none';
        howToPlayScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        characterSelectionScreen.style.display = 'block';
    }

    // Exibe a tela de instruções
    function showHowToPlay() {
        menuScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        characterSelectionScreen.style.display = 'none';
        howToPlayScreen.style.display = 'block';
    }

    // Função de voltar ao menu principal
    function goToMenu() {
        howToPlayScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        characterSelectionScreen.style.display = 'none';
        menuScreen.style.display = 'block';
    }

    // Botão para voltar ao menu principal da seleção de personagens
    backToMenuSelection.addEventListener('click', goToMenu);

    // Adiciona os eventos para cada botão
    startButton.addEventListener('click', () => {
        startGame();
        populateCharacterGrid();
    });
    howButton.addEventListener('click', showHowToPlay);

    // Voltar ao menu principal
    backButtons.forEach(button => {
        button.addEventListener('click', goToMenu);
    });

    // Função para encher a grade de personagens
    function populateCharacterGrid() {
        const characters = personagens;

        // Preenche a lista
        characterGrid.innerHTML = characters.map((char, index) => `
            <div class="character-item" data-index="${index}">
                <!-- <img src="${char.imagem}" alt="${char.nome}"> -->
                <span>${char.nome}</span>
            </div>
        `).join('');

        let currentPlayer = 1;
        const selectedCharacters = { player1: null, player2: null };
        let isSelectionLocked = false;

        const updateIndicator = () => {
            const indicator = document.getElementById('current-player-indicator');
            if (currentPlayer < 3) {
                indicator.textContent = `Player ${currentPlayer}`;
            } else {
                indicator.textContent = 'Carregando...';
            }
        };

        updateIndicator();

        // Função para bloquear seleção
        function lockSelection() {
            isSelectionLocked = true;
            document.querySelectorAll('.character-item').forEach(item => {
                item.style.pointerEvents = 'none';
            });
        }

        // Função para liberar seleção
        function unlockSelection() {
            isSelectionLocked = false;
            document.querySelectorAll('.character-item').forEach(item => {
                item.style.pointerEvents = 'auto';
            });
        }

        document.querySelectorAll('.character-item').forEach(item => {
            item.addEventListener('click', (event) => {
                if (isSelectionLocked) return;

                const selectedIndex = event.target.closest('.character-item').getAttribute('data-index');

                if (currentPlayer === 1) {
                    // Remove seleção anterior do Player 1
                    if (selectedCharacters.player1 !== null) {
                        document.querySelector(`.character-item[data-index="${selectedCharacters.player1}"]`)
                            ?.classList.remove('selected-player1');
                    }

                    selectedCharacters.player1 = selectedIndex;
                    event.target.closest('.character-item').classList.add('selected-player1');
                    currentPlayer = 2;
                } else if (currentPlayer === 2) {
                    // Remove seleção anterior do Player 2
                    if (selectedCharacters.player2 !== null) {
                        document.querySelector(`.character-item[data-index="${selectedCharacters.player2}"]`)
                            ?.classList.remove('selected-player2');
                    }

                    selectedCharacters.player2 = selectedIndex;
                    event.target.closest('.character-item').classList.add('selected-player2');
                    currentPlayer = 3;
                }

                updateIndicator();

                // Atribui os status após ambos escolherem
                if (selectedCharacters.player1 !== null && selectedCharacters.player2 !== null) {

                    player1.sts.dano = 3;
                    player2.sts.dano = 3;
                    player1.sts.velocidade = 7;
                    player2.sts.velocidade = 7;

                    // Atribuir os status aos players
                    player1.nome = characters[selectedCharacters.player1].nome;
                    player1.sts.dano += characters[selectedCharacters.player1].sts.dano * 0.7;
                    player1.sts.velocidade += characters[selectedCharacters.player1].sts.velocidade * 0.6;
                    player1.sts.defesa = characters[selectedCharacters.player1].sts.defesa;
                    
                    
                    player2.nome = characters[selectedCharacters.player2].nome;
                    player2.sts.dano += characters[selectedCharacters.player2].sts.dano * 0.7;
                    player2.sts.velocidade += characters[selectedCharacters.player2].sts.velocidade * 0.6;
                    player2.sts.defesa = characters[selectedCharacters.player2].sts.defesa;

                    player1.img.src = characters[selectedCharacters.player1].path;
                    player2.img.src = characters[selectedCharacters.player2].path;

                    // Resetar posições antes de iniciar o jogo
                    player1.set.x = 900;
                    player2.set.x = 200;
                    player1.set.y = yInicio;
                    player2.set.y = yInicio;

                    lockSelection();

                    // Aguarda 3 segundos antes de trocar de tela
                    setTimeout(() => {
                        characterSelectionScreen.style.display = 'none';
                        gameScreen.style.display = 'block';
                        unlockSelection();
                    }, 3000);
                }
            });
        });
    }
});


//status do player(atualizar dps)
let player1 = {
    img: new Image(),
    nome: "Arthur",
    
    sts: {
        vida: 100,
        vidaMax: 100,
        displayedVida: 100,
        altura: 0,
        dano: 3,
        velocidade: 7,
        defesa: 0,
    },
    set: {
        x: 900,
        y: yInicio, 
        largura: 50*3,
        altura: 90*3,
        poderPulo: -20,
        gravity: 0.5,
        velocityY: 0,
        direcao: 0,
    },
    anim: {
        atual: 0,
        linha: 0,
        quant: 0,
        repeat: false,
        interval: null,
    },
    is: {
        moving: false,
        jumping: false,
        crawling: false,
        punching: false,
        kicking: false,
    },
    keys: {
        cima: false,
        esqu: false,
        dire: false,
        baix: false,
        soco: false,
        kick: false,
    },
    soco: {
        timeout: null,
        largura: 11*2*3,
        altura: 5*2*3
    },
    kick: {
        timeout: null,
        largura: 21*2*3,
        altura: 8*2*3
    },
};

let player2 = {
    img: new Image(),
    
    sts: {
        vida: 100,
        vidaMax: 100,
        displayedVida: 100,
        altura: 0,
        dano: 3,
        velocidade: 7,
        defesa: 0,
    },
    set: {
        x: 200,
        y: yInicio, 
        largura: 50*3,
        altura: 100*3,
        poderPulo: -20,
        gravity: 0.5,
        velocityY: 0,
        direcao: 0,
    },
    anim: {
        atual: 0,
        linha: 0,
        quant: 0,
        repeat: false,
        interval: null,
    },
    is: {
        moving: false,
        jumping: false,
        crawling: false,
        punching: false,
        kicking: false,
    },
    keys: {
        cima: false,
        esqu: false,
        dire: false,
        baix: false,
        soco: false,
        kick: false,
    },
    soco: {
        timeout: null,
        largura: 11*2,
        altura: 5*2
    },
    kick: {
        timeout: null,
        largura: 21*2*3,
        altura: 8*2*3
    },
};

player1.img.src = 'source/placeholders.png';
player2.img.src = 'source/placeholders.png';

// Carregar a imagem de fundo
let backgroundImg = new Image();
backgroundImg.src = 'source/background.png';


// Loop do jogo

function gameLoop() {
    if (gameOver) return;

    direção(player1, player2);  
    direção(player2, player1);

    ataques(player1);
    ataques(player2);

    update(player1, player2);
    update(player2, player1);

    selecionarAni(player1);
    selecionarAni(player2);
    
    tocarAni(player1);
    tocarAni(player2);
    
    parede(player1);
    parede(player2);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBG();
    draw(player1);
    draw(player2);
    

    drawHealthBar(player1,player1.nome, 700);
    drawHealthBar(player2,player2.nome, 20);

    updateHealth(player1);
    updateHealth(player2);

    // Verifique colisões
    if (checarColisão(player1, player2)) {
        colisãoPlayers(player1, player2);
        colisãoPlayers(player2, player1);
    }

    // Checar se morreu
    if (player1.sts.vida <= 0 || player2.sts.vida <= 0) {
        gameOver = true;
        mostrarGameOver();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function drawBG() {
    ctx.save();
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}

//desenha
function draw(objeto) {
    const spriteWidth = objeto.img.naturalWidth / 8;
    const spriteHeight = objeto.img.naturalHeight / 10;

    ctx.save();
    ctx.scale(objeto.set.direcao === -1 ? -1 : 1, 1); 
    ctx.drawImage(objeto.img,
        objeto.anim.linha * spriteWidth,
        objeto.anim.atual * spriteHeight,
        spriteWidth - 1,
        spriteHeight - 1,
        objeto.set.direcao === -1 ? -objeto.set.x - objeto.set.largura : objeto.set.x,
        objeto.set.y,
        spriteWidth,
        spriteHeight
    );
    ctx.restore();
}

function drawHealthBar(objeto, nome, xis) {

    // Definir dimensões da barra
    const barWidth = 480;
    const barHeight = 30;
    const x = xis;
    const y = 10;

    // Calcular larguras proporcionais
    if(objeto.sts.vida < 0){
        objeto.sts.vida = 0;
    }
    const currentBarWidth = (objeto.sts.vida / objeto.sts.vidaMax) * barWidth;
    const displayedBarWidth = (objeto.sts.displayedVida / objeto.sts.vidaMax) * barWidth;

    // Desenhar fundo vermelho
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Desenhar borda da barra
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, barHeight);

    // Desenhar vida perdida
    ctx.fillStyle = '#ffc107';
    ctx.fillRect(x, y, displayedBarWidth, barHeight);

    // Desenhar vida atual
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(x, y, currentBarWidth, barHeight);

    // Desenhar nome do jogador na barra
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(nome, x + barWidth / 2, y + barHeight - 7);
}


// Função para animar a barra amarela suavemente
function updateHealth(objeto) {
    if (objeto.sts.displayedVida > objeto.sts.vida) {
        objeto.sts.displayedVida -= 0.34;
        if (objeto.sts.displayedVida < objeto.sts.vida) {
            objeto.sts.displayedVida = objeto.sts.vida;
        }
    }
}


function mostrarGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Pressione R para reiniciar', canvas.width / 2, canvas.height / 2 + 20);
}

function restartGame() {
    player1.sts.vida = 100;
    player2.sts.vida = 100;
    player1.sts.displayedVida = 100;    
    player2.sts.displayedVida = 100;
    player1.set.x = 900;
    player1.set.y = yInicio;
    player2.set.x = 200;
    player2.set.y = yInicio;
    gameOver = false;
    requestAnimationFrame(gameLoop);
}


// Função para determinar direção do personagem (modestamente genial)

function direção(objeto1, objeto2) {
    if (objeto1.set.x + objeto1.set.largura / 2  > objeto2.set.x + objeto2.set.largura / 2 && objeto1.set.x != objeto2.set.x)  {
        objeto1.set.direcao = -1
    } else if (objeto1.set.x != objeto2.set.x){
        objeto1.set.direcao = 1
    }
}


// FUNÇÕES DE COLISÃO


// função geral para checar colisões
function checarColisão(objeto1, objeto2) {
    return (
        objeto1.set.x < objeto2.set.x + objeto2.set.largura &&
        objeto1.set.x + objeto1.set.largura > objeto2.set.x &&
        objeto1.set.y < objeto2.set.y + objeto2.set.altura &&
        objeto1.set.y + objeto1.set.altura > objeto2.set.y
    );
}

// colisão entre players
function colisãoPlayers(objeto1, objeto2) {
    if(objeto1.is.moving || checarColisão(objeto1, objeto2)){
        objeto2.set.x += (objeto1.sts.velocidade*1.2 * objeto1.set.direcao)/2;
        objeto1.set.x += (objeto2.sts.velocidade*1.2 * objeto2.set.direcao)/2;
    }
}

// colisão parede
function parede(objeto){
    if (objeto.set.x < 0 ){
        objeto.set.x = 0;
    }
    if (objeto.set.x + objeto.set.largura > canvas.width){
        objeto.set.x = canvas.width - objeto.set.largura;
    }
}

// checarHit
function checarHit(objeto1, objeto2) {
    if(objeto1.is.punching) {
        if (objeto1.soco.x < objeto2.set.x + objeto2.set.largura &&
            objeto1.soco.x + objeto1.soco.largura > objeto2.set.x &&
            objeto1.soco.y < objeto2.set.y + objeto2.set.altura &&
            objeto1.soco.y + objeto1.soco.altura > objeto2.set.y) {
            objeto2.sts.vida -= objeto1.sts.dano - objeto2.sts.defesa / 10;
            objeto2.set.x += 10 * objeto1.set.direcao;
        }
    }
    if(objeto1.is.kicking) {
        if (objeto1.kick.x < objeto2.set.x + objeto2.set.largura &&
            objeto1.kick.x + objeto1.kick.largura > objeto2.set.x &&
            objeto1.kick.y < objeto2.set.y + objeto2.set.altura &&
            objeto1.kick.y + objeto1.kick.altura > objeto2.set.y) {
            objeto2.sts.vida -= objeto1.sts.dano - objeto2.sts.defesa / 10;;
            objeto2.set.x += 10 * objeto1.set.direcao;
        }
    }
}

// Aplicar hit
function ataques(objeto) {
    objeto.soco = {
        x: objeto.set.x + objeto.set.largura * objeto.set.direcao,
        y: player1.set.y + player1.set.largura - 13*2,
        largura: 11*2,
        altura: 5*2
    };
    objeto.kick = {
        x: objeto.set.x + objeto.set.largura * objeto.set.direcao,
        y: player1.set.y + player1.set.largura - 14*2,
        largura: 21*2,
        altura: 8*2
    };

}


//movimentações gerais
function update(objeto1, objeto2) {
    objeto1.set.velocityY += objeto1.set.gravity;
    objeto1.set.y += objeto1.set.velocityY;

    if (objeto1.set.y >= yInicio) { 
        objeto1.set.y = yInicio;
        objeto1.is.jumping = false;
        objeto1.set.velocityY = 0;
    }

    if (objeto1.keys.soco && !objeto1.is.punching) {
        objeto1.is.punching = true;
        checarHit(objeto1, objeto2);
        clearTimeout(objeto1.soco.timeout);
        objeto1.soco.timeout = setTimeout(() => {
            objeto1.is.punching = false;
            objeto1.keys.soco = false;
        }, 50 + (10-objeto1.sts.velocidade)*10);
    }

    if (objeto1.keys.kick && !objeto1.is.kicking) {
        objeto1.is.kicking = true;
        checarHit(objeto1, objeto2);
        clearTimeout(objeto1.kick.timeout);
        objeto1.kick.timeout = setTimeout(() => {
            objeto1.is.kicking = false;
            objeto1.keys.kick = false;
        }, 50 + (10-objeto1.sts.velocidade)*10);
    }

    if (objeto1.keys.baix) {
        objeto1.is.crawling = true;
    }

    if (objeto1.keys.cima) {
        if (!objeto1.is.jumping && objeto1.set.y >= yInicio) { 
            objeto1.set.velocityY = objeto1.set.poderPulo;
            objeto1.is.jumping = true;
        }
    } else if (objeto1.is.jumping) {
        objeto1.set.velocityY += objeto1.set.gravity;
    }

    if(!objeto1.is.crawling && !objeto1.is.punching && !objeto1.is.kicking || objeto1.is.jumping) {
        if (objeto1.keys.esqu && objeto1.keys.dire) {
            objeto1.is.moving = false
        } else{
            if (objeto1.keys.esqu) {
                objeto1.set.x -= objeto1.sts.velocidade;
                objeto1.is.moving = true;
            }
            if (objeto1.keys.dire) {
                objeto1.set.x += objeto1.sts.velocidade;
                objeto1.is.moving = true;
            }
        }
    }
}

//listener para quando a tecla é precionada
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        player1.keys.esqu = true;
    } else if (event.key === 'ArrowRight') {
        player1.keys.dire = true;
    } else if (event.key === 'ArrowUp') {
        player1.keys.cima = true;
    } else if (event.key === 'ArrowDown') {
        player1.keys.baix = true;
    } else if (event.key === 'p') {
        player1.keys.soco = true;
    } else if (event.key === 'o') {
        player1.keys.kick = true;
    } 
    
    else if (event.key === 'a') {
        player2.keys.esqu = true;
    } else if (event.key === 'd') {
        player2.keys.dire = true;
    } else if (event.key === 'w') {
        player2.keys.cima = true;
    } else if (event.key === 's') {
        player2.keys.baix = true;
    } else if (event.key === 'f') {
        player2.keys.soco = true;
    } else if (event.key === 'g') {
        player2.keys.kick = true;
    } 

    if (event.key === 'r' && gameOver) {
        restartGame();
    }
});

//listener para quando a tecla é solta
document.addEventListener('keyup', (event) => {
    // teclas player 1
    if (event.key === 'ArrowLeft') {
        player1.keys.esqu = false;
        player1.is.moving = false;
    } else if (event.key === 'ArrowRight') {
        player1.keys.dire = false; 
        player1.is.moving = false;
    } else if (event.key === 'ArrowUp') {
        player1.keys.cima = false;
    } else if (event.key === 'ArrowDown') {
        player1.keys.baix = false;
        player1.is.crawling = false;
    }
    
    // teclas player 2
    else if (event.key === 'a') {
        player2.keys.esqu = false;
        player2.is.moving = false; 
    } else if (event.key === 'd') {
        player2.keys.dire = false; 
        player2.is.moving = false;
    } else if (event.key === 'w') {
        player2.keys.cima = false;
    } else if (event.key === 's') {
        player2.keys.baix = false;
        player2.is.crawling = false;  
    }
});


// testar se imagens carregaram
function startGame() {
    console.log('Images loaded:', imagesLoaded, 'Total images:', totalImages);
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
}
backgroundImg.onload = function() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    imagesLoaded++;
    startGame();
};
player1.img.onload = () => {
    imagesLoaded++;
    startGame();
};
player2.img.onload = () => {
    imagesLoaded++;
    startGame();
};

function selecionarAni(objeto) {
    const animacoes = [
        // Idle
        { condicao: (!objeto.is.moving && !objeto.is.jumping && !objeto.is.crawling && !objeto.is.punching && !objeto.is.kicking), anim: { atual: 0, quant: 8, repeat: true } },
        // Andando
        { condicao: (objeto.is.moving && !objeto.is.jumping && !objeto.is.crawling && !objeto.is.punching && !objeto.is.kicking), anim: { atual: 1, quant: 8, repeat: true } },
        // Chute
        { condicao: (!objeto.is.jumping && !objeto.is.crawling && !objeto.is.punching && objeto.is.kicking), anim: { atual: 3, quant: 3, repeat: false } },
        // Soco
        { condicao: (!objeto.is.jumping && !objeto.is.crawling && objeto.is.punching && !objeto.is.kicking), anim: { atual: 4, quant: 2, repeat: false } },
        // Pulando
        { condicao: (objeto.is.jumping && !objeto.is.punching && !objeto.is.kicking), anim: { atual: 2, quant: 2, repeat: false } },
        // Pulando + Chute
        { condicao: (objeto.is.jumping && !objeto.is.crawling && !objeto.is.punching && objeto.is.kicking), anim: { atual: 9, quant: 1, repeat: false } },
        // Pulando + Soco
        { condicao: (objeto.is.jumping && !objeto.is.crawling && objeto.is.punching && !objeto.is.kicking), anim: { atual: 8, quant: 1, repeat: false } },
        // Agachando
        { condicao: (!objeto.is.jumping && objeto.is.crawling && !objeto.is.punching && !objeto.is.kicking), anim: { atual: 5, quant: 3, repeat: false } },
        // Agachando + Soco
        { condicao: (!objeto.is.jumping && objeto.is.crawling && objeto.is.punching && !objeto.is.kicking), anim: { atual: 7, quant: 3, repeat: false } },
        // Agachando + Chute
        { condicao: (!objeto.is.jumping && objeto.is.crawling && !objeto.is.punching && objeto.is.kicking), anim: { atual: 6, quant: 2, repeat: false } }
    ];

    // Seleciona a animação correspondente
    for (let i = 0; i < animacoes.length; i++) {
        if (animacoes[i].condicao) {
            if (objeto.anim.atual !== animacoes[i].anim.atual) {
                objeto.anim.atual = animacoes[i].anim.atual;
                objeto.anim.quant = animacoes[i].anim.quant;
                objeto.anim.repeat = animacoes[i].anim.repeat;
                objeto.anim.linha = 0;
            }
            break;
        }
    }
}



function tocarAni(objeto) {
    // Verifica se há uma animação configurada
    if (!objeto.anim || !objeto.anim.quant) return;

    // Repetir
    if (objeto.anim.repeat) {
        if (!objeto.anim.animationInterval) {
            objeto.anim.animationInterval = setInterval(() => {
                objeto.anim.linha = (objeto.anim.linha + 1) % objeto.anim.quant;
            }, 50 + (10-objeto.sts.velocidade)*10);
        }
    } else {
    // Não Repetir
        if (objeto.anim.animationInterval) {
            clearInterval(objeto.anim.animationInterval);
            objeto.anim.animationInterval = null;
        }
        objeto.anim.linha = objeto.anim.quant - 1;
    }
}


// Personagens

// Abismo

// O medo abundante de todas as verdades


let personagens = [ 
    {
        nome: "Adrian - Completo",
        path: "/source/Sprite/Adrian.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 4,
            defesa: 4,
        },
    },
    {
        nome: "Alan - Completo",
        path: "/source/Sprite/Alan.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 4,
            defesa: 3,
        },
    },
    {
        nome: "Tonhão - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 3,
            defesa: 5,
        },
    },
    {
        nome: "Brayan - Completo",
        path: "/source/Sprite/Brayan.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 6,
            defesa: 2,
        },
    },
    {
        nome: "Berenice - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 1,
            velocidade: 2,
            defesa: 2,
        },
    },
    {
        nome: "Brunão - Completo",
        path: "/source/Sprite/Brunao.png",
        sts: {
            altura: 2,
            dano: 3,
            velocidade: 4,
            defesa: 3,
        },
    },
    {
        nome: "Caio - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 1,
            dano: 2,
            velocidade: 4,
            defesa: 0,
        },
    },
    {
        nome: "Carlos - sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 0,
            velocidade: 3,
            defesa: 3,
        },
    },
    {
        nome: "César - sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 4,
            defesa: 4,
        },
    },
    {
        nome: "Diofight - Completo",
        path: "/source/Sprite/Diofight.png",
        sts: {
            altura: 2,
            dano: 1,
            velocidade: 0,
            defesa: 4,
        },
    },
    {
        nome: "Gabriele - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 2,
            velocidade: 1,
            defesa: 4,
        },
    },
    {
        nome: "Gmano - Completo",
        path: "/source/Sprite/Gmano.png",
        sts: {
            altura: 1,
            dano: 3,
            velocidade: 4,
            defesa: 4,
        },
    },
    {
        nome: "Dreik - Completo",
        path: "/source/Sprite/Guilherme.png",
        sts: {
            altura: 2,
            dano: 1,
            velocidade: 3,
            defesa: 2,
        },
    },
    {
        nome: "Joana - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 2,
            velocidade: 2,
            defesa: 5,
        },
    },
    {
        nome: "João - Completo",
        path: "/source/Sprite/Joao.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 2,
            defesa: 4,
        },
    },
    {
        nome: "Kalindi - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 3,
            dano: 4,
            velocidade: 4,
            defesa: 4,
        },
    },
    {
        nome: "Lucas Fritsch - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 1,
            dano: 5,
            velocidade: 4,
            defesa: 5,
        },
    },
    {
        nome: "Lucas Paese - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 3,
            velocidade: 4,
            defesa: 2,
        },
    },
    {
        nome: "Luiza - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 3,
            dano: 3,
            velocidade: 9,
            defesa: 0,
        },
    },
    {
        nome: "Marco - Completo",
        path: "/source/Sprite/Marco.png",
        sts: {
            altura: 1,
            dano: 1,
            velocidade: 0,
            defesa: 9,
        },
    },
    {
        nome: "Mariana - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 2,
            velocidade: 4,
            defesa: 1,
        },
    },
    {
        nome: "Jablonski - Perdi",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 2,
            velocidade: 3,
            defesa: 2,
        },
    },
    {
        nome: "Naiara - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 1,
            velocidade: 1,
            defesa: 6,
        },
    },
    {
        nome: "Rafaela - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 3,
            velocidade: 3,
            defesa: 5,
        },
    },
    {
        nome: "Ramiro - 'Completo'",
        path: "/source/Sprite/Ramiro.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 4,
            defesa: 4,
        },
    },
    {
        nome: "Ronaldo - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 3,
            dano: 2,
            velocidade: 4,
            defesa: 0,
        },
    },
    {
        nome: "Sady - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 1,
            dano: 7,
            velocidade: 0,
            defesa: 7,
        },
    },
    {
        nome: "Suelen - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 2,
            velocidade: 3,
            defesa: 1,
        },
    },
    {
        nome: "Viktor - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 1,
            dano: 2,
            velocidade: 3,
            defesa: 1,
        },
    },
    {
        nome: "Vicky - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 2,
            velocidade: 4,
            defesa: 3,
        },
    },
    {
        nome: "Kbeçinha - Completo",
        path: "/source/Sprite/Kbecinha.png",
        sts: {
            altura: 3,
            dano: 1,
            velocidade: 4,
            defesa: 3,
        },
    },
    {
        nome: "Vitor - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 9,
            velocidade: 2,
            defesa: 2,
        },
    },
    {
        nome: "Yuri lanches - Sem sprite",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 3,
            velocidade: 4,
            defesa: 2,
        },
    },
    {
        nome: "Coelho - Completo",
        path: "/source/Sprite/Coelho.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 4,
            defesa: 4,
        },
    },
    {
        nome: "Arthur - Boneco base",
        path: "/source/Sprite/Arthur.png",
        sts: {
            altura: 2,
            dano: 4,
            velocidade: 4,
            defesa: 4,
        },
    }
];
