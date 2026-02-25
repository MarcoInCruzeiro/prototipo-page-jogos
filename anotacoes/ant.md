# Cloud Sonnet 4.5 (Analise atual do codigo)

Reasoning: O usuário está pedindo ajuda para resolver conflitos em um código JavaScript de um jogo. Vou analisar o código para identificar os problemas:

1. **Problemas Identificados:**

   a) **Inicialização do Player:**

   - No construtor do Player, há uma verificação `if (Game.canvas && Game.scale > 0)` mas o Game ainda não foi inicializado quando o Player é criado
   - O método `_updateDimensions()` é chamado mas pode falhar se o Game não estiver pronto
   - Existe um check `if (this.w === 0 || this.h === 0)` no draw que tenta corrigir, mas pode causar problemas

   b) **Ordem de Inicialização:**

   - No `Game.init()`, o canvas é redimensionado ANTES do Player ser criado
   - Mas o Player pode não receber as dimensões corretas se criado antes do resize completar

   c) **BackgroundManager:**

   - O resize do BackgroundManager pode não estar sendo chamado corretamente
   - A transição de segmentos pode ter gaps (espaços vazios)
   - O OVERLAP de 5px pode não ser suficiente

   d) **PowerUp Collision:**

   - A flag `isShowing` no NotificationManager pode travar se a notificação não esconder corretamente
   - O `hidePowerUpNotification()` precisa garantir que `isShowing = false`

   e) **Spawn de Obstáculos após PowerUp:**

   - O sistema de bloqueio de spawn `obstacleSpawnBlockedUntilFrame` pode ter inconsistências
   - O 'U' maiúsculo em um comentário sugere que havia um bug de nomenclatura

   f) **Ground Drawing:**

   - O chão pode ter problemas de renderização com pixel art se não desabilitar anti-aliasing
   - Já está implementado mas pode ter problemas de sincronização

   g) **Resize e Scale:**

   - Múltiplas chamadas de resize podem causar problemas
   - O player pode perder posição durante resize

   h) **Áudio:**

   - Os sons podem não tocar se o usuário não interagiu com a página
   - Já tem tratamento mas pode melhorar

   i) **Touch Controls:**

   - Sistema de pulo pode dar múltiplos pulos em um único toque
   - JÁ FOI CORRIGIDO com a variável `hasJumped`

Preciso estruturar as correções em etapas: primeiro, ajustar a sequência de inicialização e garantir que o Player tenha dimensões válidas desde o início. Depois, refinar o BackgroundManager para eliminar gaps visuais, corrigir as flags de notificação, melhorar o spawn após powerup e adicionar validações adicionais no resize.

# Correções para os Conflitos do Jogo

Identifiquei vários problemas. Vou listar as correções necessárias por seção:

---

## 🔧 **1. CORREÇÃO CRÍTICA - Classe Player**

Substitua a classe `Player` completa:

```javascript
class Player {
    constructor() {
        // Valores padrão seguros
        this.w = 60;
        this.h = 60;
        this.originalH = 60;
        this.x = 100;
        this.y = 400;
        this.groundY = 500;
        this.dy = 0;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.isCrouching = false;
        this.isFastFalling = false;
      
        //  Flag para garantir que dimensões foram inicializadas
        this.dimensionsReady = false;
      
        console.log('Player criado com valores padrão');
    }

    //  Método público para inicializar dimensões (chamar DEPOIS do Game.resize)
    initDimensions() {
        if (!Game.canvas || !Game.scale || Game.scale <= 0) {
            console.warn('Player.initDimensions: Game não está pronto');
            return false;
        }
      
        const playerBaseSize = 60 * Game.scale;
        this.w = playerBaseSize;
        this.h = playerBaseSize;
        this.originalH = playerBaseSize;
        this.x = Game.canvas.width * 0.1;
        this.groundY = Game.canvas.height - Game.groundHeight - (5 * Game.scale);
        this.y = this.groundY - this.h;
      
        this.dimensionsReady = true;
      
        console.log(' Player dimensões inicializadas:', {
            w: this.w.toFixed(1),
            h: this.h.toFixed(1),
            x: this.x.toFixed(1),
            y: this.y.toFixed(1),
            scale: Game.scale.toFixed(2)
        });
      
        return true;
    }

    //  Atualizar dimensões durante resize (só posição e tamanho, não reset do estado)
    updateDimensionsOnResize() {
        if (!Game.canvas || !Game.scale) return;
      
        const wasGrounded = this.isGrounded;
        const oldGroundY = this.groundY;
      
        const playerBaseSize = 60 * Game.scale;
        this.w = playerBaseSize;
        this.h = playerBaseSize;
        this.originalH = playerBaseSize;
        this.x = Game.canvas.width * 0.1;
        this.groundY = Game.canvas.height - Game.groundHeight - (5 * Game.scale);
      
        // Ajustar Y proporcionalmente se estava no ar
        if (wasGrounded) {
            this.y = this.groundY - this.h;
        } else if (oldGroundY > 0) {
            const heightRatio = (oldGroundY - this.y) / oldGroundY;
            this.y = this.groundY - (this.groundY * heightRatio);
        }
      
        this.dimensionsReady = true;
    }

    get isGrounded() {
        return Math.abs(this.dy) < 0.1 && Math.abs(this.y - (this.groundY - this.h)) < 1;
    }

    get hitbox() {
        const pad = CONFIG.COLLISION_PADDING * Game.scale;
        return {
            x: this.x + pad,
            y: this.y + pad,
            width: Math.max(4, this.w - pad * 2),
            height: Math.max(4, this.h - pad * 2)
        };
    }

    getCurrentSprite() {
        if (gameState.activePowerUpCimed && PowerUpPlayerImages[gameState.activePowerUpCimed]?.complete) {
            return PowerUpPlayerImages[gameState.activePowerUpCimed];
        }
        if (this.isFastFalling && Images.fastfall?.complete) {
            return Images.fastfall;
        }
        if (this.dy < 0 && Images.jump?.complete) {
            return Images.jump;
        }
        if (this.dy > 0 && !this.isFastFalling && Images.fall?.complete) {
            return Images.fall;
        }
        if (this.isCrouching && Images.crouch?.complete) {
            return Images.crouch;
        }
        return Images.raposinho;
    }

    jump() {
        if (gameState.activePowerUpCimed) return;
        if (this.jumpCount < this.maxJumps) {
            this.jumpCount++;
            const force = this.jumpCount === 1 ? CONFIG.JUMP_FORCE : CONFIG.JUMP_FORCE * 0.85;
            this.dy = force * Game.scale;
            ParticleSystem.create(this.x + this.w / 2, this.y + this.h, 5, '#fff');
            AudioManager.instance?.play('jump', true);
        }
    }

    startCrouch() {
        if (gameState.activePowerUpCimed) return;
        if (this.isGrounded) {
            this.isCrouching = true;
            this.isFastFalling = false;
        } else {
            this.isFastFalling = true;
            this.isCrouching = false;
            if (this.dy < 0) {
                this.dy = 0;
            }
            this.dy += CONFIG.GRAVITY * 6 * Game.scale;
            ParticleSystem.create(this.x + this.w / 2, this.y, 8, '#00ffff');
        }
    }

    stopCrouch() {
        this.isCrouching = false;
        this.isFastFalling = false;
    }

    update() {
        if (gameState.activePowerUpCimed) {
            const TARGET_Y = Game.canvas.height * 0.2;
            const DURATION = 900;
          
            const rawProgress = (gameState.frameCount - gameState.powerUpStartFrame) / DURATION;
            const progress = Math.min(rawProgress, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            this.y = gameState.powerUpStartY + (TARGET_Y - gameState.powerUpStartY) * ease;

            const sizeMultiplier = 3;
            const sprite = this.getCurrentSprite();
          
            if (sprite?.complete && sprite.naturalWidth > 0) {
                const ratio = sprite.naturalWidth / sprite.naturalHeight;
                const baseWidth = this.w;
                const drawWidth = baseWidth * sizeMultiplier;
                const drawHeight = drawWidth / ratio;
                const drawY = (this.y + this.h) - drawHeight;
              
                const drawX = this.x - (drawWidth - this.w) / 2;
                const centerX = drawX + (drawWidth / 2);
                const centerY = drawY + (drawHeight * 0.5);
              
                ParticleSystem.createSonicBoom(centerX, centerY, drawHeight);
            }

            this.dy = 0;
            this.jumpCount = 0;
            this.isCrouching = false;
            this.isFastFalling = false;

            return;
        }

        const scaledGravity = this.isFastFalling 
            ? CONFIG.GRAVITY * CONFIG.FAST_FALL_MULTIPLIER * Game.scale
            : CONFIG.GRAVITY * Game.scale;

        this.dy += scaledGravity;

        if (this.isFastFalling) {
            const maxFallSpeed = 25 * Game.scale;
            this.dy = Math.min(this.dy, maxFallSpeed);
        }

        this.y += this.dy;

        if (this.y + this.h >= this.groundY) {
            this.y = this.groundY - this.h;
            this.dy = 0;
            this.jumpCount = 0;

            if (this.isFastFalling) {
                ParticleSystem.create(this.x + this.w / 2, this.y + this.h, 12, '#ffaa00');
            }
            this.isFastFalling = false;
        }

        if (this.isCrouching && this.isGrounded) {
            this.h = this.originalH * CONFIG.CROUCH_HEIGHT_MULTIPLIER;
        } else {
            this.h = this.originalH;
        }

        if (this.isGrounded) {
            this.y = this.groundY - this.h;
        }

        this.maxJumps = gameState.score >= DIFFICULTIES[currentDifficulty].tripleJumpScore ? 3 : 2;
    }

    draw(ctx) {
        //  Proteção melhorada
        if (!this.dimensionsReady || this.w <= 0 || this.h <= 0) {
            console.warn('Player.draw: Dimensões inválidas, tentando inicializar...');
            if (!this.initDimensions()) {
                // Fallback visual de emergência
                ctx.save();
                ctx.fillStyle = 'red';
                ctx.fillRect(50, 50, 50, 50);
                ctx.fillStyle = 'white';
                ctx.font = '12px monospace';
                ctx.fillText('PLAYER LOADING...', 50, 40);
                ctx.restore();
                return;
            }
        }

        const sprite = this.getCurrentSprite();
        const isPoweredUp = gameState.activePowerUpCimed !== null;
        const sizeMultiplier = isPoweredUp ? 3 : 1;

        ctx.save();
      
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            const ratio = sprite.naturalWidth / sprite.naturalHeight;
            const baseWidth = this.w * (this.isCrouching ? 1.2 : 1);
            const drawWidth = baseWidth * sizeMultiplier;
            const drawHeight = drawWidth / ratio;
            const drawY = (this.y + this.h) - drawHeight;

            let drawX = this.x;
            if (isPoweredUp) {
                drawX = this.x - (drawWidth - this.w) / 2;
            }

            ctx.drawImage(sprite, drawX, drawY, drawWidth, drawHeight);
          
        } else {
            // Fallback
            ctx.fillStyle = '#FF6B00';
            ctx.fillRect(this.x, this.y, this.w * sizeMultiplier, this.h * sizeMultiplier);
          
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.w * sizeMultiplier, this.h * sizeMultiplier);
          
            const eyeSize = 4 * Game.scale;
            const eyeY = this.y + (this.h * 0.3);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + (this.w * 0.3), eyeY, eyeSize, eyeSize);
            ctx.fillRect(this.x + (this.w * 0.6), eyeY, eyeSize, eyeSize);
        }
      
        ctx.restore();
    }
}
```

---

## 🔧 **2. CORREÇÃO - Game.init() e Game.resize()**

```javascript
static init() {
    console.log('🎮 Game.init: Iniciando...');
  
    if (!Game.canvas) Game.canvas = document.getElementById('gameCanvas');
    if (!Game.ctx && Game.canvas) Game.ctx = Game.canvas.getContext('2d');

    if (!Game.canvas || !Game.ctx) {
        console.error('❌ ERRO CRÍTICO: Canvas não encontrado!');
        return;
    }

    //  PASSO 1: Resize PRIMEIRO
    Game.resize();
    console.log(' Canvas configurado:', {
        width: Game.canvas.width,
        height: Game.canvas.height,
        scale: Game.scale.toFixed(2)
    });

    //  PASSO 2: Criar GameState
    gameState = new GameState();
    gameState.currentSpeed = CONFIG.BASE_SPEED * Game.scale; // ← Garantir velocidade inicial

    //  PASSO 3: Criar Player e INICIALIZAR dimensões
    player = new Player();
    if (!player.initDimensions()) {
        console.error('❌ Falha ao inicializar Player');
        setTimeout(() => {
            player.initDimensions();
            Game.draw();
        }, 200);
    }

    //  PASSO 4: Criar managers
    obstacleManager = new ObstacleManager();
    outdoorManager = new OutdoorManager();
    powerUpManager = new PowerUpManager();
    ParticleSystem.instance = new ParticleSystem();
    AudioManager.instance = new AudioManager();
    NotificationManager.instance = new NotificationManager();

    //  PASSO 5: Criar Renderer
    Renderer.instance = new Renderer(Game.canvas, Game.ctx);

    //  PASSO 6: Criar BackgroundManager
    const bgImages = Images.bgSequence?.length ? Images.bgSequence : [];
    Renderer.instance.backgroundManager = new BackgroundManager(Game.canvas, bgImages);

    //  PASSO 7: Event listeners
    Game.setupEventListeners();

    //  PASSO 8: Desenhar frame inicial
    console.log(' Desenhando frame inicial');
    Game.draw();
  
    console.log(' Game.init: Concluído!');
}

static resize() {
    if (!Game.canvas) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    Game.canvas.width = viewportWidth;
    Game.canvas.height = viewportHeight;

    const isPortrait = viewportHeight > viewportWidth;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || viewportWidth <= 768;

    if (isPortrait) {
        Game.scale = Math.min(viewportWidth / 650, viewportHeight / 850);
    } else {
        Game.scale = Math.min(viewportWidth / 800, viewportHeight / 500);
    }

    Game.scale = Math.max(0.5, Math.min(Game.scale, 2.5));

    if (isMobile) {
        Game.groundHeight = Math.max(80, viewportHeight * 0.08) * Game.scale;
    } else {
        Game.groundHeight = Math.max(40, viewportHeight * 0.08) * Game.scale;
    }

    //  Atualizar player se já existe
    if (player) {
        player.updateDimensionsOnResize();
    }

    //  Atualizar background
    if (Renderer.instance?.backgroundManager) {
        Renderer.instance.backgroundManager.resize();
    }

    //  Atualizar partículas
    if (ParticleSystem.instance && !ParticleSystem.instance.glowParticles.length) {
        ParticleSystem.instance._initGlowParticles();
    }

    console.log('📐 Resize:', {
        width: Game.canvas.width,
        height: Game.canvas.height,
        scale: Game.scale.toFixed(2),
        groundHeight: Math.floor(Game.groundHeight),
        isMobile,
        isPortrait
    });
}
```

---

## 🔧 **3. CORREÇÃO - BackgroundManager (Evitar Gaps)**

```javascript
class BackgroundManager {
    constructor(canvas, images) {
        this.canvas = canvas;
        this.images = images && images.length ? images : [];
        this.segments = [];
        this.currentImageIndex = 0;
        this.OVERLAP = 10; //  Aumentado de 5 para 10
      
        console.log('BackgroundManager: Inicializando com', this.images.length, 'imagens');
      
        this._initSegments();
    }

    _initSegments() {
        this.segments = [];
      
        if (!this.canvas || this.canvas.width === 0 || this.canvas.height === 0) {
            console.warn('BackgroundManager: Canvas não está pronto ainda');
            setTimeout(() => this._initSegments(), 100);
            return;
        }

        // Verificar imagens válidas
        let validImage = null;
        for (let img of this.images) {
            if (img && img.complete && img.naturalWidth > 0) {
                validImage = img;
                break;
            }
        }

        if (!validImage && this.images.length > 0) {
            console.warn('BackgroundManager: Aguardando imagens carregarem...');
            setTimeout(() => this._initSegments(), 200);
            return;
        }

        //  Criar 3 segmentos com OVERLAP garantido
        const segment1 = this._createSegmentData(0);
        const segment2 = this._createSegmentData(segment1.width - this.OVERLAP);
        const segment3 = this._createSegmentData(segment2.x + segment2.width - this.OVERLAP);
      
        this.segments = [segment1, segment2, segment3];
      
        console.log(' BackgroundManager: Segmentos criados:', this.segments.map(s => 
            `x=${Math.floor(s.x)}, w=${Math.floor(s.width)}`
        ));
    }

    _createSegmentData(startX) {
        const img = this._getNextImage();
      
        if (!img || !img.complete || img.naturalWidth === 0) {
            return {
                x: startX,
                y: 0,
                width: this.canvas.width + 20, //  Margem extra
                height: this.canvas.height + 20,
                img: null
            };
        }

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = this.canvas.width / this.canvas.height;

        let width, height, offsetY = 0;

        if (imgRatio > canvasRatio) {
            height = this.canvas.height + 20; //  Margem extra
            width = height * imgRatio;
        } else {
            width = this.canvas.width + 20;
            height = width / imgRatio;
            offsetY = Math.max(0, (this.canvas.height - height) / 2);
        }

        return {
            x: startX,
            y: offsetY,
            width: width,
            height: height,
            img: img
        };
    }

    _getNextImage() {
        if (this.images.length === 0) return null;
      
        const img = this.images[this.currentImageIndex];
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      
        return img;
    }

    update(speed) {
        if (!this.segments || this.segments.length === 0) {
            console.warn('BackgroundManager.update: Reinicializando segmentos');
            this._initSegments();
            return;
        }

        const parallaxSpeed = speed * 0.3;

        // Mover todos os segmentos
        for (let segment of this.segments) {
            segment.x -= parallaxSpeed;
        }

        //  Reciclar com margem maior
        const recycleThreshold = -this.segments[0].width - 100;
      
        if (this.segments[0].x < recycleThreshold) {
            this.segments.shift();
          
            const lastSegment = this.segments[this.segments.length - 1];
            const newX = lastSegment.x + lastSegment.width - this.OVERLAP;
          
            const newSegment = this._createSegmentData(newX);
            this.segments.push(newSegment);
          
            console.log('🔄 Segmento reciclado, x:', Math.floor(newX));
        }

        //  Garantir mínimo de 3 segmentos
        while (this.segments.length < 3) {
            const lastSegment = this.segments[this.segments.length - 1];
            const newX = lastSegment ? (lastSegment.x + lastSegment.width - this.OVERLAP) : this.canvas.width;
            this.segments.push(this._createSegmentData(newX));
            console.warn('⚠️ Adicionando segmento de emergência');
        }
    }

    draw(ctx, speed) {
        if (!ctx || !this.canvas) return;

        this.update(speed);

        // Fundo gradiente (sempre primeiro)
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a1a4f');
        gradient.addColorStop(1, '#4a108a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.segments || this.segments.length === 0) return;

        // Desenhar segmentos
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
          
            if (!segment || typeof segment.x !== 'number') continue;
          
            //  Margem maior para garantir cobertura
            const margin = 150;
            if (segment.x + segment.width < -margin) continue;
            if (segment.x > this.canvas.width + margin) continue;

            if (segment.img && segment.img.complete && segment.img.naturalWidth > 0) {
                try {
                    ctx.drawImage(
                        segment.img,
                        Math.floor(segment.x),
                        Math.floor(segment.y),
                        Math.ceil(segment.width) + 1, //  +1 para evitar gaps
                        Math.ceil(segment.height) + 1
                    );
                } catch (e) {
                    console.error('Erro ao desenhar background:', e);
                    // Fallback
                    ctx.fillStyle = i % 2 === 0 ? 'rgba(20, 40, 100, 0.5)' : 'rgba(40, 20, 100, 0.5)';
                    ctx.fillRect(Math.floor(segment.x), Math.floor(segment.y), Math.ceil(segment.width), Math.ceil(segment.height));
                }
            } else {
                // Fallback
                ctx.fillStyle = i % 2 === 0 ? 'rgba(20, 40, 100, 0.3)' : 'rgba(40, 20, 100, 0.3)';
                ctx.fillRect(Math.floor(segment.x), Math.floor(segment.y), Math.ceil(segment.width), Math.ceil(segment.height));
            }
        }
    }

    resize() {
        console.log('BackgroundManager.resize chamado');
      
        if (!this.canvas || this.canvas.width === 0 || this.canvas.height === 0) {
            console.warn('BackgroundManager.resize: Canvas não está pronto');
            setTimeout(() => this.resize(), 100);
            return;
        }

        this._initSegments();
    }
}
```

---

## 🔧 **4. CORREÇÃO - NotificationManager (Corrigir flag travada)**

```javascript
hidePowerUpNotification() {
    const powerUpElement = document.getElementById('aviso-powerup');
  
    if (!powerUpElement) {
        this.isShowing = false; //  Resetar mesmo sem elemento
        return;
    }

    powerUpElement.classList.remove('show');
    powerUpElement.classList.add('hide');
  
    //  CRÍTICO: Resetar flag após animação
    setTimeout(() => {
        powerUpElement.classList.remove('hide');
        this.isShowing = false; // ← ESSENCIAL!
        console.log(' Notificação de PowerUp fechada, isShowing resetado');
    }, 500);
}

showPowerUpNotification(type, duration = 3000) {
    if (!type) {
        console.warn('showPowerUpNotification: tipo não fornecido');
        return;
    }
  
    if (this.isShowing) {
        console.warn('showPowerUpNotification: Notificação já está sendo exibida');
        return;
    }

    const powerUpElement = document.getElementById('aviso-powerup');
  
    if (!powerUpElement) {
        console.warn('showPowerUpNotification: Elemento não encontrado no HTML');
        this.isShowing = false; //  Garantir reset
        return;
    }

    console.log(` Power-Up ${type.toUpperCase()} Notificado!`);
  
    this.isShowing = true;
  
    const powerUpMessages = {
        'lavitan': {
            title: '⚡ LAVITAN ATIVADO! ⚡',
            subtitle: 'Super Raposinho!',
            color: '#FFD700',
            icon: '⚡'
        }
    };

    const message = powerUpMessages[type];
    if (message) {
        const titleElement = powerUpElement.querySelector('.title');
        const subtitleElement = powerUpElement.querySelector('.subtitle');
        const iconElement = powerUpElement.querySelector('.icon');
      
        if (titleElement) titleElement.textContent = message.title;
        if (subtitleElement) subtitleElement.textContent = message.subtitle;
        if (iconElement) iconElement.textContent = message.icon;
        powerUpElement.style.color = message.color;
      
        powerUpElement.classList.remove('hide');
        powerUpElement.classList.add('show');
      
        //  Esconder com timeout
        setTimeout(() => {
            this.hidePowerUpNotification();
        }, duration);
    } else {
        console.error(`Mensagem não encontrada para o tipo: ${type}`);
        this.isShowing = false; //  Reset em caso de erro
    }
}
```

---

## 🔧 **5. CORREÇÃO - Spawn de Obstáculos após PowerUp**

No `ObstacleManager._checkSpawn()`:

```javascript
_checkSpawn() {
    //  Verificações mais robustas
    if (gameState.activePowerUpCimed) {
        console.log('🚫 Spawn bloqueado: PowerUp ativo');
        return;
    }
  
    if (gameState.obstacleSpawnBlockedUntilFrame && 
        gameState.frameCount < gameState.obstacleSpawnBlockedUntilFrame) {
        //  Log ocasional para debug
        if (gameState.frameCount % 60 === 0) {
            const framesLeft = gameState.obstacleSpawnBlockedUntilFrame - gameState.frameCount;
            console.log(`🚫 Spawn bloqueado por mais ${Math.floor(framesLeft/60)}s`);
        }
        return;
    }

    const lastOb = this.obstacles[this.obstacles.length - 1];
    const distanceToLast = lastOb ? (Game.canvas.width - lastOb.x) : Game.canvas.width;

    let baseDist = (CONFIG.MIN_OBSTACLE_DISTANCE * Game.scale) / (1 + gameState.score * 0.015);
    let randomVariance = Math.random() * (CONFIG.SPAWN_VARIANCE * Game.scale);
    let spawnThreshold = Math.max(baseDist + randomVariance, CONFIG.MIN_SPAWN_DISTANCE * Game.scale);

    if (distanceToLast > spawnThreshold) {
        const difficultyMod = DIFFICULTIES[currentDifficulty].spawnRate;
        const spawnChance = (CONFIG.BASE_SPAWN_CHANCE + (gameState.score * 0.0005)) * difficultyMod;
        if (Math.random() < spawnChance) {
            this.spawn();
            console.log(' Obstáculo spawnado');
        }
    }
}
```

E no `Game.update()`, onde o power-up termina:

```javascript
// Dentro de Game.update(), após checar colisão com power-up
if (gameState.activePowerUpCimed && gameState.frameCount >= gameState.slowMotionEndFrame) {
    console.log('⏱️ PowerUp terminando...');
    gameState.activePowerUpCimed = null;
  
    //  Garantir pelo menos 1.5s de delay após o fim do power-up
    const extraDelayFrames = 90; // ~1.5 segundos a 60 FPS
    const minBlockFrame = gameState.frameCount + extraDelayFrames;
    gameState.obstacleSpawnBlockedUntilFrame = Math.max(
        gameState.obstacleSpawnBlockedUntilFrame || 0, 
        minBlockFrame
    );
  
    console.log(` Spawn bloqueado até frame ${gameState.obstacleSpawnBlockedUntilFrame}`);
}
```

---

## 🔧 **6. PROTEÇÃO - Game.draw() mais robusto**

```javascript
static draw() {
    if (!Renderer.instance) {
        console.error('❌ Game.draw: Renderer não existe!');
        return;
    }

    // Limpar tela
    Renderer.instance.clear();

    // Background
    Renderer.instance.drawBackground();

    // Outdoors
    if (outdoorManager) {
        outdoorManager.draw(Game.ctx);
    }

    // Chão
    Renderer.instance.drawGround();

    // Partículas
    if (ParticleSystem.instance) {
        ParticleSystem.instance.draw(Game.ctx);
    }
  
    // Power-ups
    if (powerUpManager) {
        powerUpManager.draw(Game.ctx);
    }
  
    //  PLAYER com proteção extra
    if (player) {
        if (!player.dimensionsReady) {
            console.warn('⚠️ Player não está pronto, tentando inicializar...');
            player.initDimensions();
        }
        player.draw(Game.ctx);
    } else {
        console.error('❌ Player não existe!');
    }
  
    // Obstáculos
    if (obstacleManager) {
        obstacleManager.draw(Game.ctx);
    }
  
    // Debug
    if (player && obstacleManager && CONFIG.DEBUG_MODE) {
        Renderer.instance.drawDebug(player, obstacleManager.obstacles);
    }

    // Score
    if (gameState) {
        const scoreDisplay = document.getElementById('score-display');
        if (scoreDisplay) {
            scoreDisplay.innerText = gameState.score;
        }
    }

    // God Mode
    if (CONFIG.NO_COLLISION_MODE) {
        Game.ctx.save();
        Game.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        Game.ctx.font = `bold ${32 * Game.scale}px monospace`;
        Game.ctx.textAlign = 'center';
        Game.ctx.strokeStyle = '#000';
        Game.ctx.lineWidth = 4;
        const text = '⚡ GOD MODE ATIVO ⚡';
        Game.ctx.strokeText(text, Game.canvas.width / 2, 40 * Game.scale);
        Game.ctx.fillText(text, Game.canvas.width / 2, 40 * Game.scale);
        Game.ctx.restore();
    }
}
```

---

##  **CHECKLIST DE VERIFICAÇÃO**

Após aplicar as correções, verifique:

- [ ]  Player aparece na tela ao carregar
- [ ]  Background não tem espaços vazios ao rolar
- [ ]  Notificação de PowerUp não trava (pode abrir múltiplas vezes)
- [ ]  Obstáculos não spawnam enquanto PowerUp está ativo
- [ ]  Obstáculos não spawnam imediatamente após PowerUp terminar
- [ ]  Resize não quebra o jogo
- [ ]  Console não mostra erros críticos
- [ ]  Game Over funciona corretamente

---

**Qual dessas correções você quer que eu detalhe mais?** 🎮
