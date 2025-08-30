let cards = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];
let gameCards = [...cards, ...cards];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let score = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    shuffle(gameCards);
    
    gameCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'w-20 h-20 bg-slate-600 border-2 border-blue-400 rounded-lg cursor-pointer flex items-center justify-center text-2xl transition-all hover:bg-slate-500';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains('bg-red-500') || card.classList.contains('bg-green-500') || flippedCards.length === 2) return;
    
    card.classList.remove('bg-slate-600', 'hover:bg-slate-500');
    card.classList.add('bg-red-500');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.remove('bg-red-500');
        card2.classList.remove('bg-red-500');
        card1.classList.add('bg-green-500', 'cursor-default');
        card2.classList.add('bg-green-500', 'cursor-default');
        matchedPairs++;
        score += 10;
        document.getElementById('score').textContent = score;
        
        if (matchedPairs === cards.length) {
            setTimeout(() => alert(`You won! Score: ${score}, Moves: ${moves}`), 100);
        }
    } else {
        card1.classList.remove('bg-red-500');
        card2.classList.remove('bg-red-500');
        card1.classList.add('bg-slate-600', 'hover:bg-slate-500');
        card2.classList.add('bg-slate-600', 'hover:bg-slate-500');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    flippedCards = [];
}

function startGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('moves').textContent = moves;
    createBoard();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', startGame);
