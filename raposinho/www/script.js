'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// ███████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Física
    GRAVITY: 0.6,
    JUMP_FORCE: -14,
    FAST_FALL_MULTIPLIER: 1.8,

    // Velocidade
    BASE_SPEED: 7,
    SPEED_ACCELERATION: 0.002,
    MAX_SPEED_MULTIPLIER: 2.5,

    // Spawning
    MIN_OBSTACLE_DISTANCE: 250,
    SPAWN_VARIANCE: 600,
    MIN_SPAWN_DISTANCE: 180,
    BASE_SPAWN_CHANCE: 0.05,

    // Player
    CROUCH_HEIGHT_MULTIPLIER: 0.6,
    COLLISION_PADDING: 3.5,

    // Gameplay
    TRIPLE_JUMP_SCORE: 100,
    SCORE_DIVISOR: 10,

    // Visual
    GROUND_HEIGHT: 0,
    GRID_SPACING_H: 13.5,
    GRID_SPACING_V: 100,
    PARTICLE_COUNT: 30,
    OUTDOOR_SPAWN_INTERVAL: 10,

    // Debug
    DEBUG_MODE: false,
    //GOD MODE
    NO_COLLISION_MODE: false

    //Power-Up

};


// Dificuldades
const DIFFICULTIES = {
    // easy: {
    //     name: 'Fácil',
    //     speedMultiplier: 0.7,
    //     spawnRate: 0.7,
    //     tripleJumpScore: 100
    // },
    // normal: {
    //     name: 'Normal',
    //     speedMultiplier: 1.0,
    //     spawnRate: 1.0,
    //     tripleJumpScore: 150
    // },
    hard: {
        name: 'Difícil',
        speedMultiplier: 1.5,
        spawnRate: 1.5,
        tripleJumpScore: 100
    }
};

let currentDifficulty = 'hard';

// ═══════════════════════════════════════════════════════════════════════════
//  █████╗ ███████╗███████╗███████╗████████╗███████╗
// ██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
// ███████║███████╗███████╗█████╗     ██║   ███████╗
// ██╔══██║╚════██║╚════██║██╔══╝     ██║   ╚════██║
// ██║  ██║███████║███████║███████╗   ██║   ███████║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
// ═══════════════════════════════════════════════════════════════════════════

const ASSETS = {
    raposinho: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/518e7232-4122-424f-9e22-5287b830731b.png',
    jump: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/4e53f535-7b37-4c60-9244-701f1ef03fe9.png',
    crouch: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/4560dec0-9390-4201-a87b-5aebd3c19d50.png',
    fastfall: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/69554b25-45ae-45e5-a917-de864cba302d.png',
    fall: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/dbd0b929-d67b-42ec-9957-e723f4662042.png',
    juiz: './img/juiz.png',
    bola: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/42fb5dd1-157d-4abe-8e2a-153a74b69ca7.png',
    chute: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/f21f5038-1ce5-4852-a2ef-103ab7d7ccda.png',
    bgSequence: [
        './img/IMAGEM_JOGO1.png',
    ],
    outdoor: 'https://image.crm.cruzeiro.com.br/lib/fe34117371640478741c71/m/1/bc38933e-eec1-49ea-b35c-8b01d3f74036.png',
    ground: './img/ground-minigame.png'
};

// Carregar imagens

const powerUpsAssets = {
    lavitan: {
        img: './img/powerUpLavitan.png',
        effectDuration: 5000, // Duração do efeito em ms
        player: './img/power-player-lavitan.png'
    }
};
//==========================================================================
//carregar imagens
//==========================================================================

const Images = {};
Object.keys(ASSETS).forEach(key => {
    if (key === 'bgSequence') return;
    Images[key] = new Image();
    Images[key].src = ASSETS[key];
});

// Carrega lista de bgSequence separadamente
Images.bgSequence = [];
if (Array.isArray(ASSETS.bgSequence)) {
    ASSETS.bgSequence.forEach(src => {
        const img = new Image();
        img.src = src;
        Images.bgSequence.push(img);
    });
}

const PowerUpImages = {};
const PowerUpPlayerImages = {};
Object.keys(powerUpsAssets).forEach(key => {
    PowerUpImages[key] = new Image();
    PowerUpImages[key].src = powerUpsAssets[key].img;

    PowerUpPlayerImages[key] = new Image();
    PowerUpPlayerImages[key].src = powerUpsAssets[key].player;
});

// ═══════════════════════════════════════════════════════════════════════════
//  █████╗ ██╗   ██╗██████╗ ██╗ ██████╗ 
// ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗
// ███████║██║   ██║██║  ██║██║██║   ██║
// ██╔══██║██║   ██║██║  ██║██║██║   ██║
// ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝
// ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
// ═══════════════════════════════════════════════════════════════════════════


const AUDIO_ASSETS = {
    bgMusic: './sound/HINO DO CRUZEIRO - 8BITS .mp3',
    gameOver: './sound/lumora_studios-pixel-game-over.mp3',
    jump: './sound/freesound_community-sfx_jump.mp3'
}



// ═══════════════════════════════════════════════════════════════════════════
//  █████╗ ██╗   ██╗██████╗ ██╗ ██████╗     ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗ 
// ██╔══██╗██║   ██║██╔══██╗██║██╔═══██╗    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
// ███████║██║   ██║██║  ██║██║██║   ██║    ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝
// ██╔══██║██║   ██║██║  ██║██║██║   ██║    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗
// ██║  ██║╚██████╔╝██████╔╝██║╚██████╔╝    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║
// ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝     ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
// ═══════════════════════════════════════════════════════════════════════════
class AudioManager {
    static instance = null;

    constructor() {
        this.sounds = {};
        this.musicVolume = 0.3;  // 30% de volume para música de fundo
        this.sfxVolume = 0.5;    // 50% de volume para efeitos sonoros
        this.isMuted = false;
        
        this._loadSounds();
    }

    _loadSounds() {
        console.log('AudioManager: Carregando sons...');
        
        Object.keys(AUDIO_ASSETS).forEach(key => {
            try {
                const audio = new Audio();
                audio.src = AUDIO_ASSETS[key];
                audio.preload = 'auto';
                
                // Configurações específicas
                if (key === 'bgMusic') {
                    audio.loop = true;
                    audio.volume = this.musicVolume;
                } else {
                    audio.loop = false;
                    audio.volume = this.sfxVolume;
                }
                
                this.sounds[key] = audio;
                console.log(`AudioManager: ${key} carregado`);
            } catch (error) {
                console.error(`Erro ao carregar áudio ${key}:`, error);
            }
        });
    }

    play(soundName, forceRestart = false) {
        if (this.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Som não encontrado: ${soundName}`);
            return;
        }

        try {
            if (forceRestart) {
                sound.currentTime = 0;
            }
            
            // Tentar tocar (pode falhar se o usuário não interagiu ainda)
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Não foi possível tocar ${soundName}:`, error.message);
                });
            }
        } catch (error) {
            console.error(`Erro ao tocar ${soundName}:`, error);
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    pause(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
        }
    }

    stopAll() {
        Object.keys(this.sounds).forEach(key => {
            this.stop(key);
        });
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.sounds.bgMusic) {
            this.sounds.bgMusic.volume = this.musicVolume;
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'bgMusic') {
                this.sounds[key].volume = this.sfxVolume;
            }
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        Object.values(this.sounds).forEach(sound => {
            sound.muted = this.isMuted;
        });
        
        console.log('AudioManager: Mute', this.isMuted ? 'ON' : 'OFF');
        return this.isMuted;
    }

    fadeOut(soundName, duration = 1000) {
        const sound = this.sounds[soundName];
        if (!sound) return;

        const startVolume = sound.volume;
        const startTime = Date.now();

        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            sound.volume = startVolume * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                this.stop(soundName);
                sound.volume = startVolume; // Restaurar volume original
            }
        };

        fade();
    }

    fadeIn(soundName, duration = 1000) {
        const sound = this.sounds[soundName];
        if (!sound) return;

        const targetVolume = soundName === 'bgMusic' ? this.musicVolume : this.sfxVolume;
        sound.volume = 0;
        
        this.play(soundName);

        const startTime = Date.now();

        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            sound.volume = targetVolume * progress;
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        };

        fade();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ███████╗████████╗ █████╗ ████████╗███████╗
// ██╔════╝╚──██╔═╝██╔═ ██╗╚──██╔═╝██╔═ ═╝
// ███████╗   ██║   ███████║   ██║   █████╗
// ╚════██║   ██║   ██╔══██║   ██║   ██╔══╝
// ███████║   ██║   ██║  ██║   ██║   ███████╗
// ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
// ═══════════════════════════════════════════════════════════════════════════

class GameState {
    constructor() {
        this.reset();
    }
    reset() {
        this.isRunning = false;
        this.isGameOver = false;
        this.score = 0;
        this.frameCount = 0;
        //  fix: Inicializar com velocidade base em vez de 0
        this.currentSpeed = CONFIG.BASE_SPEED * (Game.scale || 1);
        this.gridOffset = 0;
        this.lastOutdoorTime = 0;
        this.slowMotionActive = false;
        this.slowMotionEndFrame = 0;
        this.activePowerUpCimed = null;
        this.powerUpStartY = 0;
        this.powerUpStartFrame = 0;
        this.obstacleSpawnBlockedUntilFrame = 0;  //  fix: 'U' maiúsculo
    }
}
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
            console.warn(' Adicionando segmento de emergência!');
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

class Player {
    constructor() {
        // Valores temporários que serão atualizados pelo resize
        this.x = 0;
        this.y = 0;
        this.w = 60; // Valor base padrão
        this.h = 60; // Valor base padrão
        this.originalH = 60;
        this.dy = 0;
        this.groundY = 0;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.isCrouching = false;
        this.isFastFalling = false;
        
        // Inicializar dimensões imediatamente se Game já estiver configurado
        if (Game.canvas && Game.scale > 0) {
            this._updateDimensions();
        }
        
        console.log('Player criado com dimensões:', { w: this.w, h: this.h, scale: Game.scale });
    }

    _updateDimensions() {
        const playerBaseSize = 60 * Game.scale;
        this.w = playerBaseSize;
        this.h = playerBaseSize;
        this.originalH = playerBaseSize;
        this.x = Game.canvas.width * 0.1;
        this.groundY = Game.canvas.height - Game.groundHeight - (5 * Game.scale);
        this.y = this.groundY - this.h;
        
        console.log('Player dimensões atualizadas:', {
            w: this.w,
            h: this.h,
            x: this.x,
            y: this.y,
            groundY: this.groundY
        });
    }

    get isGrounded() {
        return this.dy === 0;
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

        if (this.y + this.h > this.groundY) {
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
        // Proteção: se dimensões ainda são zero, não desenhar
        if (this.w === 0 || this.h === 0) {
            console.error('Player.draw: Dimensões inválidas!', { w: this.w, h: this.h });
            // Tentar atualizar dimensões
            this._updateDimensions();
            return;
        }

        const sprite = this.getCurrentSprite();
        const isPoweredUp = gameState.activePowerUpCimed !== null;
        const sizeMultiplier = isPoweredUp ? 3 : 1;

        ctx.save();
        
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            // Desenhar sprite
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
            // FALLBACK visual
            ctx.fillStyle = '#FF6B00';
            ctx.fillRect(this.x, this.y, this.w * sizeMultiplier, this.h * sizeMultiplier);
            
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.w * sizeMultiplier, this.h * sizeMultiplier);
            
            // Olhos
            const eyeSize = 4 * Game.scale;
            const eyeY = this.y + (this.h * 0.3);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x + (this.w * 0.3), eyeY, eyeSize, eyeSize);
            ctx.fillRect(this.x + (this.w * 0.6), eyeY, eyeSize, eyeSize);
        }
        
        ctx.restore();
    }
}

class Obstacle {
    constructor(type, x, y, size, config) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.initialY = y;
        this.isAirborne = config.isAirborne;
        this.speedFactor = config.speedFactor;
        this.rotation = config.rotation;
        this.wobbleAmplitude = config.wobbleAmplitude;
        this.wobbleSpeed = config.wobbleSpeed;
        this.wobblePhase = config.wobblePhase;

        // Hitbox calculada dinamicamente
        this.hitBox = null;
        this.radius = null;
        this.cx = null;
        this.cy = null;
    }

    update(speed) {
        this.x -= speed;
    }

    isOffScreen() {
        return this.x + this.width < -100;
    }

    draw(ctx) {
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        // Reset hitbox
        this.hitBox = null;
        this.radius = null;
        this.cx = null;
        this.cy = null;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        if (this.type === 'bola') {
            this._drawBola(ctx, x, y, w, h);
        } else if (this.type === 'juiz') {
            this._drawJuiz(ctx, x, y, w, h);
        } else if (this.type === 'chute') {
            this._drawChute(ctx, x, y, w, h);
        }

        ctx.shadowColor = 'transparent';
    }

    _drawBola(ctx, x, y, w, h) {
        const cx = x + w / 2;
        const cy = y + h / 4;

        if (Images.bola?.complete && Images.bola.naturalWidth) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(this.rotation || 0);

            const aspect = Images.bola.naturalWidth / Images.bola.naturalHeight;
            let drawW = w;
            let drawH = drawW / aspect;
            if (drawH > h) {
                drawH = h;
                drawW = drawH * aspect;
            }

            ctx.drawImage(Images.bola, -drawW / 3, -drawH / 2, drawW, drawH);
            ctx.restore();

            this.radius = Math.min(drawW, drawH) / 2 * 0.7;
        } else {
            const r = Math.min(w, h) * 0.4;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            this.radius = r;
        }

        this.cx = cx;
        this.cy = cy;
    }

    _drawJuiz(ctx, x, y, w, h) {
        if (Images.juiz?.complete && Images.juiz.naturalWidth) {
            const cx = x + w / 2;
            const cy = y + h / 2;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate((this.rotation || 0) * 0.15);

            const aspect = Images.juiz.naturalWidth / Images.juiz.naturalHeight;
            let drawW = w;
            let drawH = drawW / aspect;
            if (drawH > h) {
                drawH = h;
                drawW = drawH * aspect;
            }

            ctx.drawImage(Images.juiz, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            this.hitBox = {
                x: x + (w - drawW) / 2 + drawW * 0.2,
                y: y + (h - drawH) / 2 + drawH * 0.2,
                width: drawW * 0.6,
                height: drawH * 0.6
            };
        } else {
            ctx.fillStyle = '#808080';
            ctx.fillRect(x, y, w, h);
            this.hitBox = { x, y, width: w, height: h };
        }
    }

    _drawChute(ctx, x, y, w, h) {
        const wave = this.isAirborne 
            ? Math.sin((gameState.frameCount * 0.08) + (this.wobblePhase || 0)) * (this.wobbleAmplitude || 6)
            : 0;

        if (Images.chute?.complete && Images.chute.naturalWidth) {
            const aspect = Images.chute.naturalWidth / Images.chute.naturalHeight;
            let drawW = w;
            let drawH = drawW / aspect;
            if (drawH > h) {
                drawH = h;
                drawW = drawH * aspect;
            }

            const drawX = x + (w - drawW) / 2;
            const drawY = y + (h - drawH) / 2 + wave;

            ctx.save();
            ctx.translate(drawX + drawW / 2, drawY + drawH / 1.8);
            ctx.rotate((this.rotation || 0) * 0.08 + Math.sin((gameState.frameCount * 0.02) + (this.wobblePhase || 0)) * 0.02);
            ctx.drawImage(Images.chute, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();

            this.hitBox = {
                x: drawX + drawW * 0.14,
                y: drawY + drawH * 0.2,
                width: drawW * 0.32,
                height: drawH * 0.75
            };
        } else {
            const clothW = w * 0.6;
            const clothH = h * 0.6;
            ctx.fillStyle = '#0066CC';
            ctx.fillRect(x, y + wave, clothW, clothH);
            this.hitBox = { x, y: y + wave, width: clothW, height: clothH };
        }
    }
}

class ObstacleManager {
    constructor() {
        this.obstacles = [];
    }

    spawn() {
        const types = ['bola', 'juiz', 'chute'];
        const type = types[Math.floor(Math.random() * types.length)];

        let sizeBase = (30 + Math.random() * 120) * Game.scale;
        if (type === 'chute') sizeBase *= (0.8 + Math.random() * 0.6);
        if (type === 'bola') sizeBase *= (0.9 + Math.random() * 0.4);
        const size = Math.max(24, sizeBase);

        const groundY = Game.canvas.height - Game.groundHeight;
        const canBeAir = type !== 'juiz';
        const isAirborne = canBeAir && Math.random() < 0.7;

        let y;
        if (isAirborne) {
            const jumpHeight = Math.abs(CONFIG.JUMP_FORCE);
            const maxDoubleJumpHeight = (jumpHeight * 1.5) + (jumpHeight * 0.85 * 1.5);
            const maxObstacleHeight = maxDoubleJumpHeight * (0.6 + Math.random() * 0.4);

            const flyHeightMultiplier = Math.random();
            const lift = flyHeightMultiplier > 0.5
                ? maxObstacleHeight * (0.4 + Math.random() * 0.6)
                : maxObstacleHeight * (0.1 + Math.random() * 0.7);

            y = groundY - size - lift;
            y = Math.max(20 * Game.scale, y);
        } else {
            y = groundY - size;
        }

        const x = Game.canvas.width + (100 + Math.random() * 200) * Game.scale;

        const obstacle = new Obstacle(type, x, y, size, {
            isAirborne,
            speedFactor: 0.6 + Math.random() * 0.8,
            rotation: (Math.random() - 0.5) * 0.8,
            wobbleAmplitude: isAirborne ? (3 + Math.random() * 20) * Game.scale : 0,
            wobbleSpeed: 0.01 + Math.random() * 0.1,
            wobblePhase: Math.random() * Math.PI * 2
        });

        this.obstacles.push(obstacle);
    }

    update(speed) {
        // Atualizar obstáculos
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(speed);

            if (this.obstacles[i].isOffScreen()) {
                this.obstacles.splice(i, 1);
            }
        }

        // Spawn de novos obstáculos
        this._checkSpawn();
    }

    _checkSpawn() {
        // Se power-up Cimed ativo ou estamos no período de bloqueio, não spawnar os obstaculos
        if (gameState.activePowerUpCimed) return;
        if (gameState.obstacleSpawnBlockedUntilFrame && gameState.frameCount < gameState.obstacleSpawnBlockedUntilFrame) return;

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
            }
        }
    }

    draw(ctx) {
        this.obstacles.forEach(ob => ob.draw(ctx));
    }

    checkCollision(playerHitbox) {
        for (const ob of this.obstacles) {
            let collided = false;

            if (ob.type === 'bola' && ob.radius && ob.cx != null && ob.cy != null) {
                collided = CollisionSystem.rectCircle(playerHitbox, {
                    x: ob.cx - ob.radius,
                    y: ob.cy - ob.radius,
                    radius: ob.radius,
                    width: ob.radius * 2,
                    height: ob.radius * 2
                });
            } else {
                const hb = ob.hitBox || {
                    x: ob.x,
                    y: ob.y,
                    width: ob.width,
                    height: ob.height
                };
                collided = CollisionSystem.rectRect(playerHitbox, hb);
            }

            if (collided) return true;
        }
        return false;
    }

    clear() {
        this.obstacles = [];
    }
}

class Outdoor {
    constructor(x, y, width, height, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
        this.parallaxFactor = 0.25; // Reduzido de 0.3 para movimento mais suave
        this.opacity = 0;
        this.fadeInProgress = 0;
        this.fadeInSpeed = 0.02; // Fade mais suave
    }

    update(speed) {
        // Fade-in suave
        if (this.fadeInProgress < 1) {
            this.fadeInProgress += this.fadeInSpeed;
            // Easing suave
            const eased = this.fadeInProgress * this.fadeInProgress;
            this.opacity = Math.min(1, eased);
        }
        
        // Movimento parallax
        this.x -= speed * this.parallaxFactor;
    }

    isOffScreen() {
        // Adicionar margem para não remover muito cedo
        return this.x + this.width < -150;
    }

    draw(ctx) {
        // Verificar se imagem está disponível
        if (!this.img || !this.img.complete || !this.img.naturalWidth) {
            return;
        }

        // Só desenhar se estiver visível
        if (this.x + this.width < -100 || this.x > ctx.canvas.width + 100) {
            return;
        }

        ctx.save();
        
        // Aplicar opacidade
        ctx.globalAlpha = this.opacity;
        
        // Sombra suave
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 12 * Game.scale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6 * Game.scale;

        try {
            ctx.drawImage(
                this.img,
                Math.floor(this.x),
                Math.floor(this.y),
                Math.ceil(this.width),
                Math.ceil(this.height)
            );
        } catch (e) {
            console.error('Erro ao desenhar outdoor:', e);
            // Fallback visual
            ctx.fillStyle = 'rgba(100, 100, 150, 0.3)';
            ctx.fillRect(
                Math.floor(this.x),
                Math.floor(this.y),
                Math.ceil(this.width),
                Math.ceil(this.height)
            );
        }
        
        ctx.restore();
    }
}

class OutdoorManager {
    constructor() {
        this.outdoors = [];
        this.nextSpawnTime = 0;
        this.MIN_SPAWN_INTERVAL = 8;  // Mínimo 8 segundos
        this.MAX_SPAWN_INTERVAL = 15; // Máximo 15 segundos
        this.MIN_DISTANCE_BETWEEN = 400; // Distância mínima entre outdoors
    }

    spawn() {
        if (!Game.canvas || !Game.groundHeight) {
            console.warn('OutdoorManager.spawn: Canvas ou groundHeight não disponível');
            return;
        }

        const img = Images.outdoor;
        
        // Verificar se imagem está carregada
        if (!img || !img.complete || !img.naturalWidth) {
            console.warn('OutdoorManager.spawn: Imagem outdoor não carregada ainda');
            return;
        }

        // Verificar se há outdoor muito próximo
        if (this.outdoors.length > 0) {
            const lastOutdoor = this.outdoors[this.outdoors.length - 1];
            const distance = (Game.canvas.width + 100) - lastOutdoor.x;
            
            if (distance < this.MIN_DISTANCE_BETWEEN * Game.scale) {
                console.log('OutdoorManager.spawn: Muito próximo do último, aguardando');
                return;
            }
        }

        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const skyZoneHeight = Game.canvas.height - Game.groundHeight;
        const skyMargin = skyZoneHeight * 0.15; // Margem maior (15%)
        const maxSafeHeight = skyZoneHeight - skyMargin;

        // Calcular dimensões com limites mais conservadores
        let finalHeight = Math.max(60 * Game.scale, Math.min(maxSafeHeight * 0.6, maxSafeHeight));
        let finalWidth = finalHeight * aspectRatio;

        const maxSafeWidth = Game.canvas.width * 0.7; // Limite de 70% da largura
        if (finalWidth > maxSafeWidth) {
            finalWidth = maxSafeWidth;
            finalHeight = finalWidth / aspectRatio;
        }

        // Garantir que não fica muito pequeno
        const minSize = 50 * Game.scale;
        if (finalHeight < minSize || finalWidth < minSize) {
            console.warn('OutdoorManager.spawn: Outdoor muito pequeno, cancelando');
            return;
        }

        const outdoor = new Outdoor(
            Game.canvas.width + 100,
            (Game.canvas.height - Game.groundHeight) - finalHeight + (5 * Game.scale),
            finalWidth,
            finalHeight,
            img
        );

        this.outdoors.push(outdoor);
        
        // Programar próximo spawn com intervalo aleatório
        const randomInterval = this.MIN_SPAWN_INTERVAL + 
                               Math.random() * (this.MAX_SPAWN_INTERVAL - this.MIN_SPAWN_INTERVAL);
        this.nextSpawnTime = (gameState.frameCount / 60) + randomInterval;
        
        console.log('OutdoorManager: Outdoor criado, próximo spawn em', randomInterval.toFixed(1), 'segundos');
    }

    update(speed) {
        if (!gameState || !gameState.isRunning) return;

        // Atualizar outdoors existentes
        for (let i = this.outdoors.length - 1; i >= 0; i--) {
            this.outdoors[i].update(speed);

            if (this.outdoors[i].isOffScreen()) {
                console.log('OutdoorManager: Outdoor removido (off-screen)');
                this.outdoors.splice(i, 1);
            }
        }

        // Verificar se deve spawnar novo
        const currentTime = gameState.frameCount / 60;
        
        if (!gameState.isGameOver && currentTime >= this.nextSpawnTime) {
            this.spawn();
        }
    }

    draw(ctx) {
        if (!this.outdoors || this.outdoors.length === 0) return;
        
        // Desenhar em ordem (para profundidade correta)
        this.outdoors.forEach(outdoor => {
            if (outdoor && typeof outdoor.draw === 'function') {
                outdoor.draw(ctx);
            }
        });
    }

    clear() {
        this.outdoors = [];
        this.nextSpawnTime = 0;
        console.log('OutdoorManager: Limpo');
    }
}

class ParticleSystem {
    static instance = null;

    constructor() {
        this.particles = [];
        this.glowParticles = [];
        this._initGlowParticles();
    }

    _initGlowParticles() {
        if (!Game.canvas || Game.canvas.width === 0 || Game.canvas.height === 0) {
            setTimeout(() => this._initGlowParticles(), 100);
            return;
        }

        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            this.glowParticles.push({
                x: Math.random() * Game.canvas.width,
                y: Game.canvas.height - (Math.random() * (Game.groundHeight || 40)),
                size: Math.random() * 1.5,
                speedX: -2 - Math.random() * 3,
                alpha: Math.random()
            });
        }
    }

    static create(x, y, count, color) {
        if (!ParticleSystem.instance) return;

        for (let i = 0; i < count; i++) {
            ParticleSystem.instance.particles.push({
                x, y,
                dy: (Math.random() - 0.5) * 2,
                life: 20 + Math.random() * 10,
                color
            });
        }
    }

    static createSonicBoom(frontX, centerY, height) {
    if (!ParticleSystem.instance) return;

    const particleCount = 5;
    const spreadRange = height * 0.3;  // 🔧 REDUZIDO: de 0.8 para 0.3
    
    for (let i = 0; i < particleCount; i++) {
        const offsetY = (Math.random() - 0.5) * spreadRange;  // 🔧 CENTRALIZADO: de -1 para -0.5
        const velocityX = -(2 + Math.random() * 4);
        const velocityY = 1;  // 🔧 REDUZIDO: de *2 para *0.8
        
        ParticleSystem.instance.particles.push({
            x: frontX,
            y: centerY + offsetY,
            dx: velocityX,
            dy: velocityY,
            life: 40 + Math.random() * 30,
            maxLife: 70,
            color: '#FFD700',
            isSonic: true,
            alpha: 1,
            size: 3 + Math.random() * 4,
            glowIntensity: 20 + Math.random() * 15
        });
    }
}
    update(speed) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            if (p.isSonic) {
                p.x += p.dx;
                p.y += p.dy;
                p.life--;
                p.alpha = p.life / p.maxLife;
            } else {
                p.x -= speed;
                p.y += p.dy;
                p.life--;
            }

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        const groundY = Game.canvas.height - Game.groundHeight;
        this.glowParticles.forEach(p => {
            p.x -= speed;
            p.alpha -= 0.01;

            if (p.x < -10 || p.alpha <= 0) {
                p.x = Game.canvas.width + 10;
                p.y = groundY + (Math.random() * Game.groundHeight);
                p.alpha = 0.5 + Math.random() * 0.5;
                p.size = 2 + Math.random() * 3;
            }
        });
    }

    draw(ctx) {
        this.particles.forEach(p => {
            if (p.isSonic) {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.shadowBlur = p.glowIntensity;
                ctx.shadowColor = p.color;
                ctx.fillStyle = p.color;
                
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * Game.scale);
                gradient.addColorStop(0, 'rgba(255, 255, 255, ' + p.alpha + ')');
                gradient.addColorStop(0.3, 'rgba(255, 215, 0, ' + p.alpha + ')');
                gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
                ctx.fillStyle = gradient;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * Game.scale, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 4 * Game.scale, 4 * Game.scale);
            }
        });

        const groundY = Game.canvas.height - Game.groundHeight;
        this.glowParticles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00ffff';
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.restore();
        });
    }

    clear() {
        this.particles = [];
    }
}

class CollisionSystem {
    static rectRect(a, b) {
        return !(
            a.x > b.x + b.width ||
            a.x + a.width < b.x ||
            a.y > b.y + b.height ||
            a.y + a.height < b.y
        );
    }

    static rectCircle(rect, circle) {
        const cx = circle.x + (circle.radius ?? circle.width / 2);
        const cy = circle.y + (circle.radius ?? circle.height / 2);
        const r = circle.radius ?? Math.min(circle.width, circle.height) / 2;

        const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

        const dx = cx - closestX;
        const dy = cy - closestY;

        return (dx * dx + dy * dy) <= (r * r);
    }
}

class Renderer {
    static instance = null; 

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.backgroundManager = null; // será setado em Game.init
    }
    clear() {
        // Fundo degradê
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a1a4f');
        gradient.addColorStop(1, '#4a108a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        // Se houver BackgroundManager usa a sequência
        if (this.backgroundManager) {
            // Só movimenta se o jogo estiver rodando
            const speed = gameState?.isRunning ? (gameState.currentSpeed || (CONFIG.BASE_SPEED * Game.scale)) : 0;
            this.backgroundManager.draw(this.ctx, speed);
            return;
        }

        // Fallback para bg único antigo
        if (!Images.bg?.complete) return;

        this.ctx.save();
        const bgAspectRatio = Images.bg.naturalWidth / Images.bg.naturalHeight;
        const scaledBgWidth = this.canvas.height * bgAspectRatio;
        const bgSpeed = 1.5;
        const bgOffset = (gameState.frameCount * bgSpeed) % scaledBgWidth;

        for (let i = 0; i <= Math.ceil(this.canvas.width / scaledBgWidth) + 1; i++) {
            this.ctx.drawImage(
                Images.bg,
                (i * scaledBgWidth) - bgOffset,
                0,
                scaledBgWidth,
                this.canvas.height
            );
        }
        this.ctx.restore();
    }

    drawGround() {
        const ctx = this.ctx;
        const groundY = this.canvas.height - Game.groundHeight ;

        if (Images.ground?.complete) {
            ctx.save();
            
            // 1. FUNDAMENTAL PARA PIXEL ART: Desabilita a suavização (anti-aliasing)
            ctx.imageSmoothingEnabled = false;

            // 2. Cálculos de Escala (Mantendo a proporção da sua imagem 1920x400)
            const scale = Game.groundHeight / Images.ground.naturalHeight;
            const scaledWidth = Images.ground.naturalWidth * scale;

            // 3. Movimentação (Ajuste a velocidade conforme o delta time se possível)
            const groundSpeed = CONFIG.BASE_SPEED * Game.scale * 1; // Velocidade do chão (80% da velocidade base)
            // Usamos Math.floor para evitar que o pixel "dance" entre coordenadas decimais
            const groundOffset = Math.floor((gameState.frameCount * groundSpeed) % scaledWidth);

            // 4. Loop de renderização (Desenhamos apenas o necessário para preencher a tela)
            // Adicionamos +1 no loop para garantir que não haja um buraco no final da tela
            for (let i = 0; i <= Math.ceil(this.canvas.width / scaledWidth) + 1; i++) {
                const xPos = Math.floor(i * scaledWidth - groundOffset);
                
                ctx.drawImage(
                    Images.ground,
                    xPos,
                    groundY,
                    scaledWidth,
                    Game.groundHeight
                );
            }
            
            ctx.restore();
        } else {
            // Fallback elegante enquanto a imagem não carrega
            ctx.fillStyle = '#2d5016'; // Um verde escuro da sua paleta
            ctx.fillRect(0, groundY, this.canvas.width, Game.groundHeight);
        }

        // 5. Horizonte - Removi o neon pra combinar com a grama "realista"
        // Mas mantive uma linha de transição para dar profundidade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Sombra sutil no topo da grama
        ctx.fillRect(0, groundY, this.canvas.width, 2 * Game.scale);
    }

    drawDebug(player, obstacles) {
        if (!CONFIG.DEBUG_MODE) return;

        this.ctx.save();
        const pad = CONFIG.COLLISION_PADDING * Game.scale;

        // Player hitbox
        this.ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(player.x, player.y, player.w, player.h);

        const playerHitbox = player.hitbox;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height);
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.fillRect(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height);

        // Obstacles hitbox
        obstacles.forEach((ob, index) => {
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = '#ff0044';
            this.ctx.fillStyle = 'rgba(255, 0, 68, 0.2)';

            if (ob.type === 'bola' && ob.cx != null && ob.radius != null) {
                this.ctx.beginPath();
                this.ctx.arc(ob.cx, ob.cy, ob.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.fill();
            } else if (ob.hitBox) {
                this.ctx.strokeRect(ob.hitBox.x, ob.hitBox.y, ob.hitBox.width, ob.hitBox.height);
                this.ctx.fillRect(ob.hitBox.x, ob.hitBox.y, ob.hitBox.width, ob.hitBox.height);
            } else {
                this.ctx.strokeStyle = 'yellow';
                this.ctx.strokeRect(ob.x, ob.y, ob.width, ob.height);
            }

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(`#${index}`, ob.x, ob.y - 5);
        });

        this._drawDebugPanel();
        this.ctx.restore();
    }

    _drawDebugPanel() {
        if (!gameState || !player || !obstacleManager || !Game.canvas) return;

        const s = Game.scale;
        const startX = 20 * s;
        const startY = 50 * s;
        const rowH = 20 * s;
        const panelW = 300 * s;
        const totalRows = 11;
        const panelH = (rowH * totalRows) + 40;

        // Fundo do painel
        this.ctx.fillStyle = 'rgba(10, 15, 30, 0.9)';
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Desenhar retângulo com cantos arredondados manualmente
        const x = startX - 10;
        const y = startY - 30;
        const radius = 8;
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + panelW - radius, y);
        this.ctx.quadraticCurveTo(x + panelW, y, x + panelW, y + radius);
        this.ctx.lineTo(x + panelW, y + panelH - radius);
        this.ctx.quadraticCurveTo(x + panelW, y + panelH, x + panelW - radius, y + panelH);
        this.ctx.lineTo(x + radius, y + panelH);
        this.ctx.quadraticCurveTo(x, y + panelH, x, y + panelH - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Título
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = `bold ${14 * s}px monospace`;
        this.ctx.fillText("/// DEV_CONSOLE ///", startX, startY - 5);

        const drawRow = (label, value, index, color = '#fff') => {
            const yPos = startY + 16 + (index * rowH);

            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
            this.ctx.textAlign = 'left';
            this.ctx.font = `${11 * s}px monospace`;
            this.ctx.fillText(label, startX, yPos);

            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.beginPath();
            this.ctx.setLineDash([2, 4]);
            this.ctx.moveTo(startX + (label.length * 7 * s), yPos - 3);
            this.ctx.lineTo(startX + panelW - 50, yPos - 3);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            this.ctx.fillStyle = color;
            this.ctx.textAlign = 'right';
            this.ctx.font = `bold ${14 * s}px monospace`;
            this.ctx.fillText(value, startX + panelW - 20, yPos);
        };

        const lastOb = obstacleManager.obstacles[obstacleManager.obstacles.length - 1];
        const distLast = lastOb ? Math.floor(this.canvas.width - lastOb.x) : "N/A";
        const groundStatus = player.isGrounded ? "GROUNDED" : "AIRBORNE";

        drawRow("GAME SCORE", gameState.score, 0, "#ffff00");
        drawRow("GAME SPEED", gameState.currentSpeed.toFixed(2), 1);
        drawRow("GRAVITY", CONFIG.GRAVITY.toFixed(2), 2);
        drawRow("OBSTACLES", obstacleManager.obstacles.length, 3, obstacleManager.obstacles.length > 3 ? "#ffaa00" : "#fff");
        drawRow("SPAWN DIST", distLast, 4);
        drawRow("------ PLAYER ------", "", 5, "transparent");
        drawRow("STATE", groundStatus, 6, groundStatus === "AIRBORNE" ? "#00ff00" : "#aaa");
        drawRow("VELOCITY Y", player.dy.toFixed(2), 7);
        drawRow("JUMPS", `${player.jumpCount} / ${player.maxJumps}`, 8, player.jumpCount >= player.maxJumps ? "#ff4444" : "#fff");
        drawRow("CROUCH", player.isCrouching ? "YES" : "NO", 9, player.isCrouching ? "#ff00ff" : "#fff");
        drawRow("FAST FALL", player.isFastFalling ? "ACTIVE" : "INACTIVE", 10, player.isFastFalling ? "#ff8800" : "#fff");
    }
}
// ═══════════════════════════════════════════════════════════════════════════
// ███╗   ██╗ ██████╗ ████████╗██╗███████╗██╗ ██████╗ █████╗  ██████╗ █████╗  ██████╗
// ████╗  ██║██╔═══██╗╚══██╔══╝██║██╔════╝██║██╔════╝██╔══██╗██╔════╝██╔══██╗██╔═══██╗
// ██╔██╗ ██║██║   ██║   ██║   ██║█████╗  ██║██║     ███████║██║     ███████║██║   ██║
// ██║╚██╗██║██║   ██║   ██║   ██║██╔══╝  ██║██║     ██╔══██║██║     ██╔══██║██║   ██║
// ██║ ╚████║╚██████╔╝   ██║   ██║██║     ██║╚██████╗██║  ██║╚██████╗██║  ██║╚██████╔╝
// ╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝
// ═══════════════════════════════════════════════════════════════════════════

class NotificationManager {
    static instance = null;

    constructor() {
        this.tripleJumpElement = document.getElementById('aviso-tripleJump');
        this.tripleJumpShown = false;
        this.isShowing = false;
    }

    /**
     * Exibe o aviso de pulo triplo com animação
     * @param {number} duration - Duração em milissegundos que o aviso ficará visível
     */
    showTripleJumpNotification(duration = 3000) {
        if (this.isShowing || !this.tripleJumpElement) return;

        console.log(' Pulo Triplo Ativado!');
        
        this.isShowing = true;
        
        // Mostrar com animação
        this.tripleJumpElement.classList.remove('hide');
        this.tripleJumpElement.classList.add('show');
        
        // Tocar som de power-up (opcional)
        // AudioManager.instance?.play('powerup'); // Descomente se tiver um som de power-up
        
        // Criar partículas especiais
        if (player && ParticleSystem.instance) {
            ParticleSystem.create(
                player.x + player.w / 2, 
                player.y + player.h / 2, 
                30, 
                '#ffffff'
            );
        }
        
        // Esconder após o tempo especificado
        setTimeout(() => {
            this.hideTripleJumpNotification();
        }, duration);
    }



    /**
     * Esconde o aviso com animação de saída
     */
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
    hideTripleJumpNotification() {
        if (!this.tripleJumpElement) return;
        
        this.tripleJumpElement.classList.remove('show');
        this.tripleJumpElement.classList.add('hide');
        
        setTimeout(() => {
            this.tripleJumpElement.classList.remove('hide');
            this.isShowing = false;
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
                title: '⚡ LAVITAN ENCONTRADO! ⚡',
                subtitle: 'Super Raposinho!',
                color: '#ffffff',
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
    reset() {
        this.hideTripleJumpNotification();
        this.hidePowerUpNotification();
        this.isShowing = false;
        console.log('NotificationManager: Resetado');
    }

    checkTripleJumpUnlock(currentScore, previousScore) {
        if (!this.tripleJumpShown && currentScore >= CONFIG.TRIPLE_JUMP_UNLOCK_SCORE) {
            this.showTripleJumpNotification();
            this.tripleJumpShown = true;
        }
    }

}
// ═══════════════════════════════════════════════════════════════════════════
//  ██████╗  █████╗ ███╗   ███╗███████╗
// ██╔════╝ ██╔══██╗████╗ ████║██╔════╝
// ██║  ███╗███████║██╔████╔██║█████╗
// ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝
// ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗
//  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝
// ═══════════════════════════════════════════════════════════════════════════

class Game {
    static canvas = document.getElementById('gameCanvas');
    static ctx = Game.canvas.getContext('2d');
    static scale = 1;
    static groundHeight = CONFIG.GROUND_HEIGHT;

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
        player._updateDimensions();
    }

    //  Atualizar background
    if (Renderer.instance?.backgroundManager) {
        Renderer.instance.backgroundManager.resize();
    }

    //  Atualizar partículas
    if (ParticleSystem.instance && !ParticleSystem.instance.glowParticles.length) {
        ParticleSystem.instance._initGlowParticles();
    }

    console.log(' Resize:', {
        width: Game.canvas.width,
        height: Game.canvas.height,
        scale: Game.scale.toFixed(2),
        groundHeight: Math.floor(Game.groundHeight),
        isMobile,
        isPortrait
    });
}


 
//═══════════════════════════════════════════════════════════════════════════
//   ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ███████╗███████╗
//  ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██╔════╝██╔════╝
//  ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     █████╗  ███████╗
//  ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██╔══╝  ╚════██║
//  ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████║
//   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
// ═══════════════════════════════════════════════════════════════════════════


    static setupEventListeners() {
        // Resize
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                Game.resize();
                if (!gameState.isRunning) Game.draw();
            }, 100);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Teclado
        document.addEventListener('keydown', (e) => {
            if (!gameState.isRunning) return;

            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault();
                player.jump();
            }

            if (e.code === 'KeyS' || e.code === 'ArrowDown') {
                e.preventDefault();
                player.startCrouch();
            }

            if (e.code === 'KeyD') {
                CONFIG.DEBUG_MODE = !CONFIG.DEBUG_MODE;
                console.log(' Debug Mode:', CONFIG.DEBUG_MODE ? 'ON' : 'OFF');
            }
            if (e.code === 'KeyM' && e.shiftKey) {
                e.preventDefault();
                CONFIG.NO_COLLISION_MODE = !CONFIG.NO_COLLISION_MODE;
                console.log(' God Mode (No Collision):', CONFIG.NO_COLLISION_MODE ? 'ON' : 'OFF');
                
                // Feedback visual
                if (CONFIG.NO_COLLISION_MODE) {
                    document.body.style.border = '5px solid gold';
                } else {
                    document.body.style.border = 'none';
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'KeyS' || e.code === 'ArrowDown') {
                player.stopCrouch();
            }
        });

        // Touch/Swipe (mobile)
        // Variáveis de controle
        let touchStartY = 0;
        const swipeThreshold = 50;
        let hasJumped = false; // NOVA VARIÁVEL: Trava para impedir "pulo metralhadora"

        Game.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!gameState.isRunning) return;

            touchStartY = e.touches[0].clientY;
            hasJumped = false; // Reseta a trava toda vez que o dedo toca a tela
        }, { passive: false });

        Game.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!gameState.isRunning) return;

            const touchEndY = e.touches[0].clientY;
            const diffY = touchStartY - touchEndY;

            // Lógica para BAIXO (Agachar) - Mantém contínuo
            if (diffY < -swipeThreshold) {
                if (!player.isCrouching) {
                    player.startCrouch();
                }
            } 
            // Lógica para CIMA (Pular) - Com trava de segurança
            else if (diffY > swipeThreshold) {
                // Só pula se ainda não pulou NESTE toque específico
                if (!hasJumped) {
                    player.jump();
                    hasJumped = true; // Ativa a trava! 
                    // Não resetamos mais o touchStartY aqui, pois queremos ignorar o resto do movimento para cima
                }
            }
        }, { passive: false });

        Game.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            player.stopCrouch();
            // A variável hasJumped não precisa ser resetada aqui,
            // ela será resetada automaticamente no próximo touchstart.
        });

        // Mouse (para testes)
        Game.canvas.addEventListener('mousedown', (e) => {
            if (!gameState.isRunning) return;
            const mouseX = e.clientX;
            const screenMiddle = window.innerWidth / 2;
            mouseX < screenMiddle ? player.startCrouch() : player.jump();
        });

        Game.canvas.addEventListener('mouseup', () => {
            player.stopCrouch();
        });

        // Botões de dificuldade
        document.querySelectorAll('.pixel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.pixel-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                currentDifficulty = e.target.dataset.difficulty;
            });
        });

        // Botões
        document.getElementById('start-button').addEventListener('click', () => Game.start());
        document.getElementById('restart-button').addEventListener('click', () => {
            gameState.isGameOver = false;
            Game.updateUI();
        });
    }

    static start() {
        gameState.reset();
        gameState.isRunning = true;
        gameState.currentSpeed = CONFIG.BASE_SPEED * Game.scale;
        gameState.frameCount = 0;
        obstacleManager.clear();
        outdoorManager.clear();
        powerUpManager.clear();
        ParticleSystem.instance.clear();

        if(NotificationManager.instance) {
            NotificationManager.instance.reset();
        }

        player.y = player.groundY - player.h;
        player.dy = 0;
        player.jumpCount = 0;
        player.maxJumps = 2;
        player.isCrouching = false;
        player.isFastFalling = false;

        AudioManager.instance?.fadeIn('bgMusic', 0.5, 1200);

        Game.updateUI();
        Game.loop();
    }

    static update() {
        const previousScore= gameState.score;
        
        // Pontuação (sempre na velocidade normal)
        gameState.score = Math.floor(gameState.frameCount / CONFIG.SCORE_DIVISOR);

        // Verificar slow motion
        if (gameState.slowMotionActive && gameState.frameCount >= gameState.slowMotionEndFrame) {
            gameState.slowMotionActive = false;
        }
        const slowMotionFactor = gameState.slowMotionActive ? 0.5 : 1.0;

        const safeScale = Math.max(0.5, Math.min(Game.scale || 1, 2.5));

        // Velocidade com modificador de dificuldade
        const difficultyMod = DIFFICULTIES[currentDifficulty].speedMultiplier;
        const speedMultiplier = (1 + (gameState.score * CONFIG.SPEED_ACCELERATION)) * difficultyMod;
        gameState.currentSpeed = CONFIG.BASE_SPEED * speedMultiplier * safeScale * slowMotionFactor;

        const maxSpeed = CONFIG.BASE_SPEED * CONFIG.MAX_SPEED_MULTIPLIER * safeScale * slowMotionFactor;
        gameState.currentSpeed = Math.min(gameState.currentSpeed, maxSpeed);

        gameState.gridOffset += gameState.currentSpeed;

        // Atualizar entidades
        player.update();
        obstacleManager.update(gameState.currentSpeed);
        outdoorManager.update(gameState.currentSpeed);
        powerUpManager.update(gameState.currentSpeed);
        ParticleSystem.instance.update(gameState.currentSpeed);

        // Colisões
        if (!CONFIG.NO_COLLISION_MODE && 
            !gameState.activePowerUpCimed && 
            obstacleManager.checkCollision(player.hitbox)) {
            Game.gameOver();
        }

        // PowerUps
        const collectedPowerUp = powerUpManager.checkCollision(player.hitbox);
        if (collectedPowerUp) {
            if (NotificationManager.instance) {
            NotificationManager.instance.showPowerUpNotification(collectedPowerUp, 3000);
            }
            const duration = powerUpsAssets[collectedPowerUp].effectDuration;
            const durationFrames = Math.floor(duration / (1000 / 60));
            gameState.slowMotionActive = true;
            gameState.slowMotionEndFrame = gameState.frameCount + durationFrames;
            gameState.activePowerUpCimed = collectedPowerUp;
            gameState.powerUpStartY = player.y;
            gameState.powerUpStartFrame = gameState.frameCount;

            // Bloqueia spawn de obstáculos enquanto o power-up estiver ativo e mais 1s após o fim
            const extraDelayFrames = 60; // ~1 segundo a 60 FPS
            gameState.obstacleSpawnBlockedUntilFrame = gameState.slowMotionEndFrame + extraDelayFrames;

            ParticleSystem.create(player.x + player.w / 1, player.y + player.h / 2, 10, '#FFD700');
        }
        if (gameState.activePowerUpCimed && gameState.frameCount >= gameState.slowMotionEndFrame) {
            gameState.activePowerUpCimed = null;
            // garante pelo menos 1s de delay após o fim do power-up
            gameState.obstacleSpawnBlockedUntilFrame = Math.max(gameState.obstacleSpawnBlockedUntilFrame || 0, gameState.frameCount + 60);
        }

        if(NotificationManager.instance) {
            NotificationManager.instance.checkTripleJumpUnlock(gameState.score, previousScore);
        }

        gameState.frameCount++;
    }

    static draw() {
        if (!Renderer.instance) {
            console.error('Game.draw: Renderer não existe!');
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
        
        // PLAYER (CRÍTICO)
        if (player) {
            // Debug antes de desenhar
            if (gameState && !gameState.isRunning) {
                console.log('Game.draw: Desenhando player', {
                    x: Math.floor(player.x),
                    y: Math.floor(player.y),
                    w: Math.floor(player.w),
                    h: Math.floor(player.h),
                    sprite: player.getCurrentSprite()?.src || 'sem sprite'
                });
            }
            
            player.draw(Game.ctx);
            
            // Desenhar marcador de debug (sempre visível)
            if (!gameState || !gameState.isRunning) {
                Game.ctx.save();
                Game.ctx.fillStyle = 'red';
                Game.ctx.fillRect(player.x, player.y, 5, 5);
                Game.ctx.strokeStyle = 'yellow';
                Game.ctx.lineWidth = 2;
                Game.ctx.strokeRect(player.x, player.y, player.w, player.h);
                Game.ctx.restore();
            }
        } else {
            console.error('Game.draw: Player não existe!');
        }
        
        // Obstáculos
        if (obstacleManager) {
            obstacleManager.draw(Game.ctx);
        }
        
        // Debug
        if (player && obstacleManager) {
            Renderer.instance.drawDebug(player, obstacleManager.obstacles);
        }

        // Score
        if (gameState) {
            document.getElementById('score-display').innerText = gameState.score;
        }

        // Indicador de God Mode
        if (CONFIG.NO_COLLISION_MODE) {
            Game.ctx.save();
            Game.ctx.fillStyle = 'rgb(255, 0, 0)';
            Game.ctx.font = `bold ${32 * Game.scale}px monospace`;
            Game.ctx.textAlign = 'center';
            Game.ctx.strokeStyle = '#000';
            Game.ctx.lineWidth = 3;
            const text = ' GOD MODE ATIVO';
            Game.ctx.strokeText(text, Game.canvas.width / 2, 40 * Game.scale);
            Game.ctx.fillText(text, Game.canvas.width / 2, 40 * Game.scale);
            Game.ctx.restore();
        }
    }

    static loop() {
        if (!gameState.isRunning) return;

        Game.update();
        Game.draw();
        requestAnimationFrame(Game.loop);
    }

    static gameOver() {
        gameState.isRunning = false;
        gameState.isGameOver = true;


        if (AudioManager.instance) {
            AudioManager.instance.fadeOut('bgMusic', 800);
            setTimeout(() => {
                AudioManager.instance.play('gameOver', true);
            }, 200);
        }
        Game.updateUI();
        Game.draw();
    }

    static updateUI() {
        document.getElementById('final-score-val').innerText = gameState.score;

        const startScreen = document.getElementById('start-screen');
        const gameOverScreen = document.getElementById('game-over-screen');

        if (gameState.isRunning) {
            startScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
        } else if (gameState.isGameOver) {
            startScreen.classList.add('hidden');
            gameOverScreen.classList.remove('hidden');
        } else {
            startScreen.classList.remove('hidden');
            gameOverScreen.classList.add('hidden');
        }
    }
}

//═══════════════════════════════════════════════════════════════════════════
//  ██████╗  ██████╗ ██╗    ██╗███████╗██████╗     ██╗   ██╗██████╗
//  ██╔══██╗██╔═══██╗██║    ██║██╔════╝██╔══██╗    ██║   ██║██╔══██╗
//  ██████╔╝██║   ██║██║ █╗ ██║█████╗  ██████╔╝    ██║   ██║██████╔╝
//  ██╔═══╝ ██║   ██║██║███╗██║██╔══╝  ██╔══██╗    ██║   ██║██╔═══╝
//  ██║     ╚██████╔╝╚███╔███╔╝███████╗██║  ██║    ╚██████╔╝██║
//  ╚═╝      ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚═╝
//═══════════════════════════════════════════════════════════════════════════

class PowerUpLavitan {
    constructor(type, x, y, size) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.collected = false;
        this.floatOffset = Math.random() * Math.PI * 4;
    }

    update(speed) {
        this.x -= speed;
    }

    isOffScreen() {
        return this.x + this.width < -100;
    }

    draw(ctx) {
        if (this.collected) return;

        const floatY = this.y + Math.sin(gameState.frameCount * 0.05 + this.floatOffset) * 5 * Game.scale;
        
        ctx.save();
        ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
        ctx.shadowBlur = 15;
        
        if (PowerUpImages[this.type]?.complete && PowerUpImages[this.type].naturalWidth) {
            ctx.drawImage(PowerUpImages[this.type], this.x, floatY, this.width, this.height);
        } else {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x, floatY, this.width, this.height);
        }
        
        ctx.restore();
    }

    checkCollision(playerHitbox) {
        if (this.collected) return false;
        
        return CollisionSystem.rectRect(playerHitbox, {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    }
}

class PowerUpManager {
    constructor() {
        this.powerUps = [];
        this.spawnInterval = 500 + Math.random() * 500; // Entre 5 a 15 segundos
        this.lastSpawnFrame = 0;
        this.MIN_SPAWN_DISTANCE = 300; // Distância mínima do último obstáculo para spawnar um power-up
    }

    spawn() {
        const size = 100 * Game.scale;
        const groundY = Game.canvas.height - Game.groundHeight;
        const jumpHeight = Math.abs(CONFIG.JUMP_FORCE) * Game.scale;
        const y = groundY - size - (jumpHeight * 0.5);
        const x = Game.canvas.width + 100;

        const powerUp = new PowerUpLavitan('lavitan', x, y, size);
        this.powerUps.push(powerUp);
    }

    update(speed) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            this.powerUps[i].update(speed);

            if (this.powerUps[i].isOffScreen()) {
                this.powerUps.splice(i, 1);
            }
        }

        // Checar tempo + distância mínima de obstáculos antes de spawnar
        const timeReady = (gameState.frameCount - this.lastSpawnFrame) > this.spawnInterval;
        const lastOb = obstacleManager && obstacleManager.obstacles.length
            ? obstacleManager.obstacles[obstacleManager.obstacles.length - 1]
            : null;
        const distanceToLast = lastOb ? (Game.canvas.width - lastOb.x) : Infinity;
        const minDist = this.MIN_SPAWN_DISTANCE * Game.scale;

        if (timeReady && distanceToLast >= minDist && Math.random() < 0.01) {
            this.spawn();
            this.lastSpawnFrame = gameState.frameCount;
        }
    }

    draw(ctx) {
        this.powerUps.forEach(powerUp => powerUp.draw(ctx));
    }

    checkCollision(playerHitbox) {
        for (const powerUp of this.powerUps) {
            if (powerUp.checkCollision(playerHitbox)) {
                powerUp.collected = true;
                return powerUp.type;
            }
        }
        return null;
    }

    clear() {
        this.powerUps = [];
        this.lastSpawnFrame = 0;
    }
}


// ═══════════════════════════════════════════════════════════════════════════
// ██╗███╗   ██╗██╗████████╗
// ██║████╗  ██║██║╚══██╔══╝
// ██║██╔██╗ ██║██║   ██║
// ██║██║╚██╗██║██║   ██║
// ██║██║ ╚████║██║   ██║
// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
// ═══════════════════════════════════════════════════════════════════════════

// Variáveis globais inicializadas
let gameState = null;
let player = null;
let obstacleManager = null;
let outdoorManager = null;
let powerUpManager = null;

// Gerenciador de Loading
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('loading-progress');
        this.loadingText = document.getElementById('loading-text');
        this.loadingDetails = document.getElementById('loading-details');
        
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }
    
    updateProgress(loaded, total, message = '') {
        this.loadedAssets = loaded;
        this.totalAssets = total;
        
        const percentage = Math.floor((loaded / total) * 100);
        
        if (this.progressBar) {
            this.progressBar.style.width = percentage + '%';
        }
        
        if (this.loadingText) {
            this.loadingText.textContent = `Carregando... ${percentage}%`;
        }
        
        if (this.loadingDetails && message) {
            this.loadingDetails.textContent = message;
        }
    }
    
    setMessage(message) {
        if (this.loadingDetails) {
            this.loadingDetails.textContent = message;
        }
    }
    
    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

const loadingManager = new LoadingManager();

// Mensagens amigáveis para cada tipo de asset
const assetMessages = {
    'raposinho': 'Preparando o Raposinho...',
    'jump': 'Acordando...',
    'crouch': 'Se alongando...',
    'fastfall': 'Praticando mergulhos...',
    'fall': 'Testando o Raposinho...',
    'juiz': 'Convocando os árbitros...',
    'bola': 'Enchendo as bolas...',
    'chute': 'Vestindo a camisa...',
    'Background': 'Preparando o estádio...',
    'outdoor': 'Instalando os outdoors...',
    'ground': 'Pintando o gramado...',
    'PowerUp': 'Preparando as vitaminas...',
    'PowerUpPlayer': 'Motivando o Raposinho...'
};

// Função para obter mensagem amigável
function getFriendlyMessage(assetName) {
    for (let key in assetMessages) {
        if (assetName.includes(key)) {
            return assetMessages[key];
        }
    }
    return `Carregando ${assetName}... Quase lá!`;
}

// Função para simular etapas de carregamento
async function simulateLoadingSteps() {
    const steps = [
        { progress: 10, message: 'Iniciando Transmissão...', delay: 800 },
        { progress: 25, message: 'Verificando recursos...', delay: 600 },
        { progress: 40, message: 'Preparando o campo...', delay: 700 },
        { progress: 55, message: 'Aquecendo os motores...', delay: 500 },
        { progress: 70, message: 'Calibrando física do jogo...', delay: 600 },
        { progress: 85, message: 'Finalizando preparações...', delay: 500 }
    ];
    
    for (let step of steps) {
        loadingManager.updateProgress(step.progress, 100, step.message);
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
}

// Função para carregar todas as imagens
function loadAllAssets() {
    return new Promise((resolve, reject) => {
        const imagesToLoad = [];
        
        // Coletar todas as imagens para carregar
        Object.keys(Images).forEach(key => {
            if (key === 'bgSequence') {
                Images.bgSequence.forEach((img, index) => imagesToLoad.push({
                    img, 
                    name: 'Background',
                    displayName: `Cenário ${index + 1}`
                }));
            } else {
                imagesToLoad.push({
                    img: Images[key], 
                    name: key,
                    displayName: key
                });
            }
        });
        
        Object.keys(PowerUpImages).forEach(key => {
            imagesToLoad.push({
                img: PowerUpImages[key], 
                name: 'PowerUp-' + key,
                displayName: 'Power-Up'
            });
        });
        
        Object.keys(PowerUpPlayerImages).forEach(key => {
            imagesToLoad.push({
                img: PowerUpPlayerImages[key], 
                name: 'PowerUpPlayer-' + key,
                displayName: 'Power-Up do Jogador'
            });
        });
        
        const totalImages = imagesToLoad.length;
        let loadedImages = 0;
        let hasError = false;
        
        loadingManager.updateProgress(0, totalImages, 'Preparando para carregar...');
        
        // Função para verificar se terminou
        const checkComplete = () => {
            if (loadedImages >= totalImages) {
                if (hasError) {
                    console.warn('Algumas imagens falharam ao carregar, mas continuando...');
                }
                resolve();
            }
        };
        
        // Carregar cada imagem
        imagesToLoad.forEach(({img, name, displayName}) => {
            if (img.complete && img.naturalWidth > 0) {
                // Já carregada
                loadedImages++;
                const friendlyMsg = getFriendlyMessage(name);
                loadingManager.updateProgress(loadedImages, totalImages, friendlyMsg);
                checkComplete();
            } else {
                // Aguardar carregar
                img.onload = () => {
                    loadedImages++;
                    const friendlyMsg = getFriendlyMessage(name);
                    loadingManager.updateProgress(loadedImages, totalImages, friendlyMsg);
                    console.log(`Asset carregado: ${name} (${loadedImages}/${totalImages})`);
                    checkComplete();
                };
                
                img.onerror = () => {
                    loadedImages++;
                    hasError = true;
                    console.error(`Erro ao carregar: ${name}`);
                    loadingManager.updateProgress(loadedImages, totalImages, `Problema com ${displayName}...`);
                    checkComplete();
                };
                
                // Forçar reload se necessário
                if (!img.src) {
                    console.warn(`Imagem sem src: ${name}`);
                    loadedImages++;
                    checkComplete();
                }
            }
        });
        
        // Timeout de segurança (1 minuto)
        setTimeout(() => {
            if (loadedImages < totalImages) {
                console.warn('Timeout: Forçando inicialização mesmo com imagens pendentes');
                resolve();
            }
        }, 60000);
    });
}

// Inicialização principal
async function initGame() {
    if (gameState) {
        console.log('Jogo já inicializado');
        return;
    }
    
    try {
        console.log('Iniciando carregamento...');
        
        // Etapa 1: Simulação de carregamento inicial
        loadingManager.setMessage('Bem-vindo ao Raposinho Runner!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Etapa 2: Carregar assets reais
        loadingManager.setMessage('Carregando personagens e cenários...');
        await loadAllAssets();
        
        console.log('Assets carregados!');
        
        // Etapa 3: Simulação de preparação do jogo
        await simulateLoadingSteps();
        
        // Etapa 4: Finalização
        loadingManager.updateProgress(95, 100, 'Preparando controles...');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        loadingManager.updateProgress(98, 100, 'Quase lá...');
        await new Promise(resolve => setTimeout(resolve, 600));
        
        loadingManager.updateProgress(100, 100, 'Tudo pronto! Iniciando jogo...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Etapa 5: Inicializar o jogo
        console.log('Inicializando jogo...');
        Game.init();
        
        // Etapa 6: Delay final antes de esconder
        loadingManager.setMessage('Prepare-se para jogar!');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Esconder loading screen
        loadingManager.hide();
        
        console.log('Jogo inicializado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao inicializar jogo:', error);
        loadingManager.loadingDetails.textContent = 'Ops! Algo deu errado. Tente recarregar a página.';
        loadingManager.loadingDetails.style.color = '#ff4444';
    }
}

// Iniciar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}