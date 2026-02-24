# prototipo-page-jogos

## Sobre o Jogo (Atualmente contém apenas o jogo do Raposinho)

**Raposinho Runner** é um jogo endless runner desenvolvido em JavaScript puro com Canvas API. O jogador controla o Raposinho, mascote oficial do Cruzeiro Esporte Clube, em uma corrida infinita onde deve desviar de obstáculos, coletar power-ups para alcançar a maior pontuação possível.

### Destaques

* Arte Pixel Art nostálgica e vibrante
* Trilha Sonora baseada no Hino do Cruzeiro em 8-bits (Não possuímos os direitos da música)
* 100% Responsivo - Jogue no PC, tablet ou celular
* Performance Otimizada com sistema de partículas e parallax
* Sistema de Progressão com desbloqueio de habilidades
* Mecânicas Avançadas como pulo triplo e mergulho rápido

---

## Características

### Jogabilidade

* **Endless Runner** com dificuldade progressiva
* **Sistema de Pulos**: Simples, Duplo e Triplo (desbloqueável)
* **Fast Fall**: Mergulho rápido para o chão
* **Agachamento** para desviar de obstáculos aéreos
* **Power-Ups** especiais com efeitos visuais impressionantes (Apenas o Lavitan da CIMED)

### Visual & Áudio

* Gráficos em Pixel Art de alta qualidade (Arts feitas por iA generativa)
* Sistema de Parallax Background dinâmico
* Sistema de Partículas com efeitos de brilho
* Música de fundo: Hino do Cruzeiro 8-bits
* Efeitos sonoros imersivos

### Sistemas Técnicos

* Sistema de colisão preciso com formas geométricas simples (retângulo e circular)
* Spawn dinâmico de obstáculos com IA
* Gerenciamento de estado robusto
* Carregamento assíncrono de assets com feedback visual (Ainda precisa de um refinamento)
* Detecção automática de dispositivo (mobile/desktop)
* Sistema de escala responsivo adaptativo

---

## Como Jogar

### Objetivo

Corra o máximo que conseguir desviando de obstáculos e coletando power-ups. Sua pontuação aumenta automaticamente quanto mais tempo você sobreviver!

### Início Rápido

1. Abra o jogo no navegador
2. Aguarde o carregamento dos assets
3. Clique em **"INICIAR"**
4. Use os controles para desviar dos obstáculos
5. Colete power-ups para habilidades especiais
6. Ao atingir **100 pontos**, você desbloqueia o **Pulo Triplo**

---

## Controles

### Desktop (Teclado)


| Tecla                  | Ação                                                       |
| ---------------------- | ------------------------------------------------------------ |
| `ESPAÇO` / `↑` / `W` | **Pular** (pressione novamente no ar para pulo duplo/triplo) |
| `↓` / `S`             | **Agachar** (no chão) / **Fast Fall** (no ar)               |
| `D`                    | Ativar/Desativar**Modo Debug**                               |
| `SHIFT + M`            | Ativar/Desativar**God Mode** (sem colisão)                  |

### Mobile (Touch)


| Gesto                 | Ação                |
| --------------------- | --------------------- |
| **Swipe para cima**   | Pular                 |
| **Swipe para baixo**  | Agachar / Fast Fall   |
| **Toque à direita**  | Pular (alternativa)   |
| **Toque à esquerda** | Agachar (alternativa) |

### Observações Mobile

* Sistema anti "pulo metralhadora" implementado (anti cheat)
* Detecção de swipe com threshold de 50 pixels (Sensibilidade máxima)
* Suporte a eventos touch otimizado

---

## Mecânicas do Jogo

### Sistema de Pulos

```
Pulo Simples  → Altura base (JUMP_FORCE: -14)
Pulo Duplo    → 85% da força do primeiro pulo
Pulo Triplo   → Desbloqueado aos 100 pontos
```

**Detalhes Técnicos:**

* Gravidade: 0.6
* Força de pulo: -14 (escalonada pelo Game.scale)
* Máximo de pulos no ar: 2 (3 após desbloquear)

### Fast Fall (Mergulho Rápido)

* Pressione `↓` ou `S` **enquanto estiver no ar**
* Aumenta a velocidade de queda em **1.8x**
* Cancela o impulso de pulo atual
* Velocidade máxima de queda: 25 (escalonada)
* Cria efeito de partículas ao aterrissar

### Sistema de Pontuação

```
Pontuação = Frames Sobrevividos ÷ 10
Velocidade Base = 7
Aceleração = 0.002 por ponto (2% por segundo com limitador de maximo 200% do valor original)
Velocidade Máxima = 2.5x da base
Dificuldade: Hard (Multiplicador 1.5x)
```

### Progressão de Dificuldade

* Velocidade aumenta progressivamente com o score
* Taxa de spawn de obstáculos aumenta gradualmente
* Obstáculos aéreos ficam mais frequentes
* Variação de altura dos obstáculos aumenta

---

## Power-Ups

### Lavitan (Power-Up Especial)

**Efeitos Visuais:**

* Slow Motion (50% da velocidade)
* Voo Automático (sobe suavemente para 20% da altura da tela)
* Invencibilidade temporária
* Sonic Boom (rastro de partículas douradas)
* Sprite alterado para versão powered-up
* Tamanho aumentado em 3x (apenas imagem)

**Duração:**

* Efeito principal: **5 segundos** (5000ms)
* Proteção pós-efeito: **1 segundo** (60 frames)
* Animação de subida: **0.9 segundos** (900ms)

**Mecânica de Spawn:**

* Intervalo: 5-15 segundos (aleatório)
* Distância mínima de obstáculos: 300 pixels
* Chance de spawn: 1% por frame (após intervalo)
* Altura: 50% da altura de pulo simples

**Comportamento:**

* Durante o power-up:
  * Obstáculos param de spawnar
  * Player sobe suavemente (easing cúbico)
  * Partículas douradas são geradas continuamente
  * Colisões desabilitadas
  * Controles de pulo/agachar desabilitados
* Após o término:
  * 1 segundo de proteção adicional
  * Spawn de obstáculos bloqueado durante a proteção
  * Retorno suave ao gameplay normal

---

## Obstáculos

### Tipos de Obstáculos

#### 1. Bola

* **Comportamento:** Pode estar no chão ou voando com rotação
* **Tamanho:** 90-130% do tamanho base
* **Colisão:** Circular (raio = 70% do tamanho)
* **Pode voar:** Sim
* **Movimento:** Rotação contínua

#### 2. Juiz

* **Comportamento:** Sempre no chão, sem movimento vertical
* **Tamanho:** 100% do tamanho base
* **Colisão:** Retangular (60% do sprite)
* **Pode voar:** Não
* **Movimento:** Rotação leve (15% da rotação base)

#### 3. Chute (Chuteira)

* **Comportamento:** Pode estar no chão ou balançando no ar
* **Tamanho:** 80-140% do tamanho base
* **Colisão:** Retangular (32% largura x 75% altura)
* **Pode voar:** Sim
* **Movimento:** Oscilação senoidal (wobble) + rotação

### Sistema de Spawn

**Parâmetros Base:**

```
MIN_OBSTACLE_DISTANCE: 250 pixels
SPAWN_VARIANCE: 600 pixels
MIN_SPAWN_DISTANCE: 180 pixels
BASE_SPAWN_CHANCE: 0.05 (5%)
```

**Cálculo de Spawn:**

* Distância base diminui com o score
* Chance aumenta progressivamente: `0.05 + (score * 0.0005)`
* Multiplicador Hard: 1.5x na taxa de spawn
* Variação aleatória adicional para imprevisibilidade

**Altura Aérea (obstáculos voadores):**

* Probabilidade de ser aéreo: 70% (para bola e chute)
* Altura base: Calculada a partir da altura de pulo duplo
* Variação: 10-100% da altura máxima alcançável
* Mínimo do topo: 20 pixels (escalonado)

---

## Instalação

### Pré-requisitos

* Navegador moderno com suporte a:
  * Canvas API
  * ES6+ JavaScript
  * Web Audio API
  * Touch Events (para mobile)
* Servidor HTTP (para desenvolvimento local)

### Método 1: Servidor Local Simples

```
# Clone o repositório
git clone https://github.com/seu-usuario/raposinho-runner.git

# Entre no diretório
cd raposinho-runner

# Opção A: Python 3
python -m http.server 8000

# Opção B: Python 2
python -SimpleHTTPServer 8000

# Opção C: Node.js (http-server)
npx http-server -p 8000

# Opção D: PHP
php -S localhost:8000

# Acesse no navegador
http://localhost:8000
```

### Método 2: Live Server (VS Code)

1. Instale a extensão **Live Server** no VS Code
2. Clique com botão direito no `index.html`
3. Selecione **"Open with Live Server"**

### Método 3: Deploy em Produção

#### GitHub Pages:

```
# Após push para o GitHub
# Vá em Settings > Pages
# Selecione branch main e pasta root
# O jogo estará disponível em:
# https://seu-usuario.github.io/raposinho-runner
```

#### Netlify:

```
# Arraste a pasta do projeto para netlify.com/drop
# Ou conecte o repositório GitHub
```

### Método 4: Executar index.html (Simples)

* Abra o arquivo `index.html` diretamente no navegador.

---

## Configuração

### Arquivo de Configuração (CONFIG)

Todas as configurações do jogo estão no objeto `CONFIG` no início do arquivo:

```
const CONFIG = {
    // Física
    GRAVITY: 0.6,                    // Força da gravidade
    JUMP_FORCE: -14,                 // Força do pulo
    FAST_FALL_MULTIPLIER: 1.8,       // Multiplicador de queda rápida

    // Velocidade
    BASE_SPEED: 7,                   // Velocidade inicial
    SPEED_ACCELERATION: 0.002,       // Aceleração por ponto
    MAX_SPEED_MULTIPLIER: 2.5,       // Velocidade máxima (2.5x base)

    // Spawning
    MIN_OBSTACLE_DISTANCE: 250,      // Distância mínima entre obstáculos
    SPAWN_VARIANCE: 600,             // Variação aleatória
    MIN_SPAWN_DISTANCE: 180,         // Distância mínima absoluta
    BASE_SPAWN_CHANCE: 0.05,         // Chance base de spawn (5%)

    // Player
    CROUCH_HEIGHT_MULTIPLIER: 0.6,   // Altura ao agachar (60%)
    COLLISION_PADDING: 3.5,          // Margem de colisão

    // Gameplay
    TRIPLE_JUMP_SCORE: 100,          // Score para desbloquear pulo triplo
    SCORE_DIVISOR: 10,               // Divisor para cálculo de pontuação

    // Visual
    GROUND_HEIGHT: 0,                // Calculado dinamicamente
    PARTICLE_COUNT: 30,              // Partículas de brilho no chão
    OUTDOOR_SPAWN_INTERVAL: 10,      // Intervalo de outdoors (segundos)

    // Debug
    DEBUG_MODE: false,               // Modo debug (hitboxes)
    NO_COLLISION_MODE: false         // God mode (sem colisão)
};
```

### Configuração de Dificuldades

```
const DIFFICULTIES = {
    hard: {
        name: 'Difícil',
        speedMultiplier: 1.5,        // 50% mais rápido
        spawnRate: 1.5,              // 50% mais obstáculos
        tripleJumpScore: 100         // Pontos para pulo triplo
    }
};
```

**Nota:** Dificuldades easy e normal estão comentadas, mas podem ser reativadas.

### Assets Externos

#### Imagens (CDN Cruzeiro):

```
const ASSETS = {
    raposinho: 'URL_CDN',
    jump: 'URL_CDN',
    crouch: 'URL_CDN',
    fastfall: 'URL_CDN',
    fall: 'URL_CDN',
    bola: 'URL_CDN',
    chute: 'URL_CDN',
    outdoor: 'URL_CDN',
    // Assets locais
    juiz: './img/juiz.png',
    ground: './img/ground-minigame.png',
    bgSequence: ['./img/IMAGEM_JOGO1.png']
};
```

#### Power-Ups:

```
const powerUpsAssets = {
    lavitan: {
        img: './img/powerUpLavitan.png',
        effectDuration: 5000,
        player: './img/power-player-lavitan.png'
    }
};
```

#### Áudios:

```
const AUDIO_ASSETS = {
    bgMusic: './sound/HINO DO CRUZEIRO - 8BITS .mp3',
    gameOver: './sound/lumora_studios-pixel-game-over.mp3',
    jump: './sound/freesound_community-sfx_jump.mp3'
};
```

---

## Modo Desenvolvedor

### Debug Mode (Tecla D)

Ativa/desativa o painel de debug com informações em tempo real:

**Informações Exibidas:**

* Score atual
* Velocidade do jogo
* Gravidade aplicada
* Número de obstáculos na tela
* Distância para o último obstáculo
* Estado do player (GROUNDED/AIRBORNE)
* Velocidade vertical (dy)
* Pulos disponíveis (atual/máximo)
* Status de agachamento
* Status de fast fall

**Visualizações:**

* Hitbox do player (verde)
* Hitbox dos obstáculos (vermelho)
* Bordas reais dos sprites (cinza)
* Índices de obstáculos

### God Mode (Shift + M)

Desativa todas as colisões para testes:

**Características:**

* Colisões desabilitadas completamente
* Borda dourada ao redor da tela
* Texto "GOD MODE ATIVO" em vermelho no topo
* Mensagem no console ao ativar/desativar
* Pode ser ativado/desativado durante o jogo

**Uso:**

```
Ativar:  Shift + M
Desativar: Shift + M novamente
```

### Console Logs

O jogo emite logs detalhados no console:

```
// Inicialização
'Game.init: Começando inicialização'
'Game.init: Canvas redimensionado'
'BackgroundManager: Inicializando com X imagens'

// Assets
'Asset carregado: raposinho (1/15)'
'AudioManager: bgMusic carregado'

// Gameplay
'BackgroundManager: Segmento reciclado'
'OutdoorManager: Outdoor criado'
'Pulo Triplo Ativado!'

// Debug
'Debug Mode: ON/OFF'
'God Mode (No Collision): ON/OFF'
```

---

## Tecnologias Utilizadas

### Core

* **JavaScript ES6+** - Linguagem principal
* **HTML5 Canvas API** - Renderização gráfica
* **Web Audio API** - Sistema de som
* **CSS3** - Estilização e animações

### Arquitetura

* **Programação Orientada a Objetos** (Classes ES6)
* **Padrão Singleton** (Managers)
* **Game Loop** baseado em requestAnimationFrame
* **Delta Time** implícito via frameCount

### Recursos Avançados

* **Parallax Scrolling** multi-camadas
* **Sistema de Partículas** customizado
* **Collision Detection** otimizado (SAT)
* **Asset Loading** assíncrono com Promise
* **Event Delegation** para controles
* **Responsive Design** com detecção de dispositivo

---

### Estrutura do Código

```
script.js (estrutura lógica)
│
├── CONFIG                     # Configurações globais
├── DIFFICULTIES               # Níveis de dificuldade
├── ASSETS                     # URLs dos assets
├── powerUpsAssets             # Configuração de power-ups
├── AUDIO_ASSETS               # URLs de áudio
│
├── Images                     # Objetos Image carregados
├── PowerUpImages              # Imagens de power-ups
├── PowerUpPlayerImages        # Sprites powered-up
│
├── Classes:
│   ├── AudioManager           # Gerenciamento de som
│   ├── GameState              # Estado global do jogo
│   ├── BackgroundManager      # Sistema de background parallax
│   ├── Player                 # Personagem jogável
│   ├── Obstacle               # Obstáculos individuais
│   ├── ObstacleManager        # Gerenciador de obstáculos
│   ├── Outdoor                # Outdoors decorativos
│   ├── OutdoorManager         # Gerenciador de outdoors
│   ├── ParticleSystem         # Sistema de partículas
│   ├── CollisionSystem        # Detecção de colisão
│   ├── Renderer               # Sistema de renderização
│   ├── NotificationManager    # Notificações UI
│   ├── Game                   # Loop principal
│   ├── PowerUpLavitan         # Power-up individual
│   ├── PowerUpManager         # Gerenciador de power-ups
│   └── LoadingManager         # Tela de carregamento
│
└── Inicialização:
    ├── loadAllAssets()        # Carregamento de assets
    ├── simulateLoadingSteps() # Simulação de progresso
    └── initGame()             # Função principal de init
```

---

## Principais Classes e Métodos

### Game (Classe Principal)

```
Game.init()           // Inicializa o jogo
Game.resize()         // Ajusta canvas responsivamente
Game.setupEventListeners()  // Configura controles
Game.start()          // Inicia uma partida
Game.update()         // Atualiza lógica (60 FPS)
Game.draw()           // Renderiza frame
Game.loop()           // Loop principal
Game.gameOver()       // Finaliza partida
Game.updateUI()       // Atualiza interface
```

### Player

```
player.jump()         // Executa pulo
player.startCrouch()  // Inicia agachamento/fast fall
player.stopCrouch()   // Para agachamento
player.update()       // Atualiza física
player.draw()         // Renderiza sprite
player.hitbox         // Getter para área de colisão
player.isGrounded     // Getter para estado no chão
player.getCurrentSprite()  // Retorna sprite atual
```

### ObstacleManager

```
obstacleManager.spawn()          // Cria novo obstáculo
obstacleManager.update(speed)    // Atualiza todos
obstacleManager.draw(ctx)        // Renderiza todos
obstacleManager.checkCollision(hitbox)  // Verifica colisões
obstacleManager.clear()          // Remove todos
```

### AudioManager

```
AudioManager.instance.play(soundName, forceRestart)
AudioManager.instance.stop(soundName)
AudioManager.instance.pause(soundName)
AudioManager.instance.fadeIn(soundName, duration)
AudioManager.instance.fadeOut(soundName, duration)
AudioManager.instance.toggleMute()
AudioManager.instance.setMusicVolume(volume)
AudioManager.instance.setSFXVolume(volume)
```

### ParticleSystem

```
ParticleSystem.create(x, y, count, color)
ParticleSystem.createSonicBoom(x, y, height)
ParticleSystem.instance.update(speed)
ParticleSystem.instance.draw(ctx)
ParticleSystem.instance.clear()
```

---

## Sistema de Colisão

### Tipos de Colisão

#### Retângulo vs Retângulo (AABB)

```
CollisionSystem.rectRect(a, b)
```

* Usado para: Juiz, Chute, Player
* Algoritmo: Axis-Aligned Bounding Box
* Performance: O(1)

#### Retângulo vs Círculo

```
CollisionSystem.rectCircle(rect, circle)
```

* Usado para: Bola vs Player
* Algoritmo: Ponto mais próximo + distância
* Performance: O(1)

### Hitbox do Player

```
const pad = CONFIG.COLLISION_PADDING * Game.scale;
hitbox = {
    x: player.x + pad,
    y: player.y + pad,
    width: player.w - (pad * 2),
    height: player.h - (pad * 2)
}
```

**Padding:** 3.5 pixels (escalonado) para tornar o jogo mais justo.

---

## Sistema de Loading

### LoadingManager

Gerencia a tela de carregamento com feedback visual:

**Fases do Loading:**

1. **Inicialização** (0-10%)
2. **Verificação** (10-25%)
3. **Preparação** (25-40%)
4. **Aquecimento** (40-55%)
5. **Calibração** (55-70%)
6. **Finalização** (70-85%)
7. **Controles** (85-95%)
8. **Últimos ajustes** (95-100%)

**Mensagens Amigáveis:**

```
'Preparando o Raposinho...'
'Treinando os pulos...'
'Enchendo as bolas...'
'Montando o estádio...'
'Pintando o gramado...'
```

**Timeout de Segurança:** 1 minuto (força inicialização mesmo com falhas, recomendo remover isso quando o projeto estiver em produção).

---

## Sistema de Notificações

### NotificationManager

Gerencia avisos in-game:

**Triple Jump Notification:**

* Exibida ao atingir 100 pontos
* Animação de fade in/out
* Duração: 3 segundos
* Partículas douradas especiais
* Só aparece uma vez por partida

**Métodos:**

```
NotificationManager.instance.showTripleJumpNotification(duration)
NotificationManager.instance.hideTripleJumpNotification()
NotificationManager.instance.reset()
NotificationManager.instance.checkTripleJumpUnlock(currentScore, previousScore)
```

---

## Performance e Otimizações

### Otimizações Implementadas

1. **Object Pooling Implícito**
   * Obstáculos são removidos e recriados
   * Partículas são recicladas
   * Segmentos de background são reaproveitados
2. **Culling (Renderização Seletiva)**
   * Obstáculos fora da tela não são renderizados
   * Partículas com vida zero são removidas
   * Outdoors invisíveis são pulados
3. **Escalamento Responsivo**
   * Uma única variável `Game.scale` controla tudo
   * Dimensões calculadas uma vez por resize
   * Sprites redimensionados proporcionalmente
4. **Collision Detection Otimizado**
   * Early exit em colisões AABB
   * Hitboxes pré-calculadas quando possível
   * Verificação apenas de obstáculos visíveis
5. **Canvas Optimization**
   * `ctx.save()` e `ctx.restore()` minimizados
   * `imageSmoothingEnabled = false` para pixel art
   * Transformações agrupadas quando possível

### Configurações Recomendadas

**Para Melhor Performance:**

```
CONFIG.PARTICLE_COUNT = 15        // Reduzir partículas
CONFIG.DEBUG_MODE = false         // Desativar debug
OUTDOOR_SPAWN_INTERVAL = 15       // Menos outdoors
```

**Para Melhor Visual:**

```
CONFIG.PARTICLE_COUNT = 50
Aumentar resolução do canvas
Adicionar mais frames de animação
```

---

## Problemas Conhecidos

### Mobile

* **Safari iOS:** Possível atraso no início do áudio (requer interação do usuário)
* **Android Antigo:** Possível lag em dispositivos com menos de 2GB RAM
* **Orientação:** Melhor experiência no modo paisagem

### Desktop

* **Firefox:** Pequena diferença no rendering de partículas
* **Edge Legacy:** Não suportado (use Chromium Edge)

### Soluções

```
// Para problemas de áudio iOS
document.addEventListener('touchstart', function() {
    AudioManager.instance?.play('bgMusic');
    AudioManager.instance?.stop('bgMusic');
}, {once: true});

// Para performance mobile
if (isMobile) {
    CONFIG.PARTICLE_COUNT = 15;
}
```

---

## Roadmap (Futuras Implementações)

### Versão 1.1

* [?]  Sistema de highscore com localStorage
* [?]  Mais power-ups (escudo, imã de pontos)
* [?]  Sons individuais para cada obstáculo
* [?]  Parallax com mais camadas

### Versão 1.2

* [?]  Múltiplos personagens jogáveis
* [?]  Sistema de conquistas
* [?]  Leaderboard online

### Versão 2.0

* [?]  Multiplayer Global
* [?]  Sistema de customização(Modificar camisa ou mascote)

---

## Contribuindo

Contribuições são bem-vindas! Siga estas etapas:

### 1. Fork e Clone

```
# Fork pelo GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/raposinho-runner.git
cd raposinho-runner

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/raposinho-runner.git
```

### 2. Crie uma Branch

```
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-fix
```

### 3. Faça suas Alterações

* Mantenha o código consistente
* Adicione comentários explicativos
* Teste em múltiplos dispositivos
* Verifique o console para erros

### 4. Commit e Push

```
git add .
git commit -m "feat: adiciona nova feature X"
# ou
git commit -m "fix: corrige bug Y"

git push origin feature/minha-feature
```

### 5. Abra um Pull Request

* Descreva suas mudanças detalhadamente
* Adicione screenshots/GIFs se relevante
* Mencione issues relacionadas

### Padrões de Commit

```
feat: nova funcionalidade
fix: correção de bug
docs: alteração em documentação
style: formatação de código
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

### Code Style

```
// Use camelCase para variáveis e métodos
const myVariable = 10;
function myFunction() {}

// Use PascalCase para classes
class MyClass {}

// Use UPPER_CASE para constantes
const MAX_SPEED = 100;

// Indentação: 4 espaços
if (condition) {
    // código
}

// Aspas simples para strings
const text = 'Hello World';

// Comentários descritivos
// Calcula a velocidade baseado no score
const speed = BASE_SPEED * multiplier;
```

---

## Testes

### Checklist de Testes

**Desktop:**

* [V]  Chrome (Windows/Mac/Linux)
* [V]  Firefox (Windows/Mac/Linux)
* [?]  Safari (Mac)
* [V]  Edge (Windows)

**Mobile:**

* [V]  Chrome Android
* [?]  Safari iOS
* [?]  Firefox Android
* [?]  Samsung Internet

**Funcionalidades:**

* [V]  Pulo simples/duplo/triplo
* [V]  Agachamento
* [V]  Fast fall
* [V]  Colisões precisas
* [V]  Power-ups funcionando
* [V]  Sons tocando corretamente
* [V]  Responsividade em todas as resoluções
* [V]  Debug mode (D)
* [V]  God mode (Shift+M)

---

## Licença

Este projeto está licenciado sob a **&copy;Cruzero Esporte Clube SAF**.

```

Copyright (c) 2026 Raposinho Runner

```

---

## Créditos

### Desenvolvimento

* **Game Design & Programação:** Marco Túlio Paiva Repoles
* **Engine:** JavaScript Vanilla + Canvas API

### Assets

**Música:**

* Hino do Cruzeiro 8-bits - [[Compositor](https://www.youtube.com/watch?v=aZbKuM8tm3s)]

**Efeitos Sonoros:**

* Jump SFX - Freesound Community
* Game Over - Lumora Studios

**Sprites:**

* Raposinho - Cruzeiro Esporte Clube Cloud (CDN)
* Obstáculos - Cruzeiro Esporte Clube Cloud (CDN)
* Background - Cruzeiro Esporte Clube Cloud (CDN)

### Ferramentas Utilizadas

* **Editor:** Visual Studio Code
* **Controle de Versão:** Git
* **Hospedagem:** Netlify(BETA)
* **Testes:** Chrome DevTools

---

## Contato e Suporte

### Reportar Bugs

Ao reportar um bug envie um email para [marco.repoles@cruzeiro.com.br](mailto:marco.repoles@cruzeiro.com.br) , inclua neste email:

1. **Descrição:** O que aconteceu vs. o que deveria acontecer
2. **Passos para Reproduzir:** Como chegar ao bug
3. **Ambiente:**
   * Navegador e versão
   * Sistema operacional
   * Dispositivo (desktop/mobile)
   * Resolução da tela
4. **Console Logs:** Mensagens de erro (F12 > Console)
5. **Screenshots/GIFs:** Se aplicável

**Exemplo:**

```
### Bug: Pulo triplo não funciona no mobile

**Descrição:**
Ao atingir 100 pontos no mobile, o pulo triplo não é ativado.

**Passos:**
1. Abrir jogo no mobile
2. Jogar até 100 pontos
3. Tentar fazer pulo triplo
4. Apenas pulo duplo funciona

**Ambiente:**
- Chrome Android 120
- Android 13
- Samsung Galaxy S21
- 1080x2400

**Console:**
Nenhum erro aparente

**Screenshot:**
[anexar imagem]
```

---

## FAQ (Perguntas Frequentes)

**P: O jogo não carrega, fica travado em "Carregando..."** R: Verifique sua conexão com a internet (assets externos) e console do navegador (F12) para erros.

**P: O som não toca no iPhone** R: Safari iOS requer interação do usuário antes de tocar áudio. Toque na tela uma vez.

**P: O jogo está muito lento no meu dispositivo** R: Reduza `CONFIG.PARTICLE_COUNT` ou desative `DEBUG_MODE`.

**P: Como adicionar novos obstáculos?** R: Edite a array `types` em `ObstacleManager.spawn()` e adicione o sprite correspondente.

**P: Como mudar a dificuldade?** R: Descomente as dificuldades `easy` ou `normal` no objeto `DIFFICULTIES` e altere `currentDifficulty`.

---

## Changelog

### v1.0.0 (2026-02-23)

* Lançamento inicial
* Sistema de pulo duplo/triplo
* Power-up Lavitan
* 3 tipos de obstáculos
* Sistema de partículas
* Background parallax
* Sistema de áudio completo
* Suporte mobile e desktop
* Modo debug e god mode
* Tela de loading animada

### Backup jogos dos mascotes, todos os jogos estão em fase beta/MVP
