let cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎵', '🎬', '🎪', '🎨'];
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let score = 0;
let timer = 0;
let timerInterval;
let isPaused = false;
let difficulty = 'normal';

const difficulties = {
    easy: { pairs: 3, cols: 3, cards: cards.slice(0, 3) },
    normal: { pairs: 8, cols: 4, cards: cards.slice(0, 8) },
    hard: { pairs: 12, cols: 6, cards: cards }
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused) {
            timer++;
            document.getElementById('timer').textContent = formatTime(timer);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('text-gray-300');
    });
    document.querySelector(`[data-difficulty="${level}"]`).classList.add('bg-blue-500', 'text-white');
    document.querySelector(`[data-difficulty="${level}"]`).classList.remove('text-gray-300');
    startGame();
}

function createBoard() {
    const board = document.getElementById('gameBoard');
    const config = difficulties[difficulty];
    
    board.innerHTML = '';
    board.className = `grid grid-cols-${config.cols} gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20`;
    
    gameCards = [...config.cards, ...config.cards];
    shuffle(gameCards);
    
    gameCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-white/30 rounded-xl cursor-pointer flex items-center justify-center text-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (isPaused || card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) return;
    
    card.classList.add('flipped');
    card.classList.remove('bg-gradient-to-br', 'from-indigo-600', 'to-purple-600');
    card.classList.add('bg-gradient-to-br', 'from-pink-500', 'to-red-500', 'animate-pulse');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.remove('bg-gradient-to-br', 'from-pink-500', 'to-red-500', 'animate-pulse');
        card2.classList.remove('bg-gradient-to-br', 'from-pink-500', 'to-red-500', 'animate-pulse');
        card1.classList.add('matched', 'bg-gradient-to-br', 'from-green-500', 'to-emerald-500', 'cursor-default');
        card2.classList.add('matched', 'bg-gradient-to-br', 'from-green-500', 'to-emerald-500', 'cursor-default');
        
        matchedPairs++;
        score += 10 + (difficulty === 'hard' ? 5 : difficulty === 'easy' ? -2 : 0);
        document.getElementById('score').textContent = score;
        
        if (matchedPairs === difficulties[difficulty].pairs) {
            stopTimer();
            setTimeout(showWinModal, 500);
        }
    } else {
        card1.classList.remove('flipped', 'bg-gradient-to-br', 'from-pink-500', 'to-red-500', 'animate-pulse');
        card2.classList.remove('flipped', 'bg-gradient-to-br', 'from-pink-500', 'to-red-500', 'animate-pulse');
        card1.classList.add('bg-gradient-to-br', 'from-indigo-600', 'to-purple-600');
        card2.classList.add('bg-gradient-to-br', 'from-indigo-600', 'to-purple-600');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    flippedCards = [];
}

function showWinModal() {
    const modal = document.getElementById('winModal');
    const stats = document.getElementById('winStats');
    
    const timeBonus = Math.max(0, 300 - timer);
    const moveBonus = Math.max(0, (difficulties[difficulty].pairs * 2 - moves) * 5);
    const finalScore = score + timeBonus + moveBonus;
    
    stats.innerHTML = `
        <div class="text-yellow-400">Final Score: ${finalScore}</div>
        <div class="text-blue-400">Time: ${formatTime(timer)}</div>
        <div class="text-green-400">Moves: ${moves}</div>
        <div class="text-purple-400">Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</div>
    `;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    document.getElementById('winModal').classList.add('hidden');
    document.getElementById('winModal').classList.remove('flex');
    startGame();
}

function pauseGame() {
    isPaused = !isPaused;
    const btn = document.getElementById('pauseBtn');
    
    if (isPaused) {
        btn.innerHTML = '▶️ Resume';
        document.querySelectorAll('#gameBoard > div').forEach(card => {
            if (!card.classList.contains('matched')) {
                card.style.visibility = 'hidden';
            }
        });
    } else {
        btn.innerHTML = '⏸️ Pause';
        document.querySelectorAll('#gameBoard > div').forEach(card => {
            card.style.visibility = 'visible';
        });
    }
}

function startGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    score = 0;
    timer = 0;
    isPaused = false;
    
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('pauseBtn').innerHTML = '⏸️ Pause';
    
    stopTimer();
    createBoard();
    startTimer();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    setDifficulty('normal');
});
