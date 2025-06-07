class WordleGame {
    constructor() {
        this.targetWord = '';
        this.currentGuess = '';
        this.guessCount = 0;
        this.maxGuesses = 6;
        this.gameOver = false;
        this.currentRow = 0;

        this.wordList = [
            'APPLE', 'BRAVE', 'CHARM', 'DANCE', 'EAGLE',
            'FLAME', 'GRACE', 'HOUSE', 'IMAGE', 'JUICE',
            'KNIFE', 'LIGHT', 'MUSIC', 'NIGHT', 'OCEAN',
            'PEACE', 'QUICK', 'RIVER', 'STORM', 'TRUTH',
            'UNITY', 'VALUE', 'WORLD', 'YOUTH', 'ZEBRA',
            'BRAIN', 'CRAFT', 'DREAM', 'FIELD', 'GLORY',
            'HEART', 'IDEAL', 'LEARN', 'MAGIC', 'PLANT',
            'SMILE', 'STONE', 'TEACH', 'WATER', 'YOUNG'
        ];
        
        this.init();
    }
    
    init() {
        this.selectRandomWord();
        this.setupEventListeners();
        this.createGameGrid();
        console.log('Target word:', this.targetWord); 
    }
    
    selectRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.wordList.length);
        this.targetWord = this.wordList[randomIndex];
    }
    
    setupEventListeners() {
        const submitBtn = document.getElementById('sbbtn');
        const inputBox = document.getElementById('inbox');
        
        submitBtn.addEventListener('click', () => this.submitGuess());
        inputBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitGuess();
            }
        });

        inputBox.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase().slice(0, 5);
        });
    }
    
    createGameGrid() {
        const gameScreen = document.querySelector('.gamescreen');
        gameScreen.innerHTML = ''; 

        for (let row = 0; row < this.maxGuesses; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'game-row';
            rowDiv.style.display = 'flex';
            rowDiv.style.justifyContent = 'center';
            rowDiv.style.gap = '5px';
            rowDiv.style.marginBottom = '5px';
            
            for (let col = 0; col < 5; col++) {
                const button = document.createElement('button');
                button.className = 'display';
                button.id = `cell-${row}-${col}`;
                button.textContent = '';
                rowDiv.appendChild(button);
            }
            
            gameScreen.appendChild(rowDiv);
        }
    }
    
    submitGuess() {
        if (this.gameOver) return;
        
        const inputBox = document.getElementById('inbox');
        const guess = inputBox.value.toUpperCase().trim();

        if (guess.length !== 5) {
            this.showMessage('Please enter a 5-letter word!');
            return;
        }
        
        if (!this.isValidWord(guess)) {
            this.showMessage('Please enter a valid word!');
            return;
        }
        
        this.processGuess(guess);
        inputBox.value = '';
        
        if (guess === this.targetWord) {
            this.endGame(true);
        } else if (this.currentRow >= this.maxGuesses) {
            this.endGame(false);
        }
    }
    
    isValidWord(word) {
        return /^[A-Z]{5}$/.test(word);
    }
    
    processGuess(guess) {
        const targetArray = this.targetWord.split('');
        const guessArray = guess.split('');
        const result = new Array(5).fill('absent');
        const targetLetterCount = {};

        targetArray.forEach(letter => {
            targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
        });

        guessArray.forEach((letter, index) => {
            if (letter === targetArray[index]) {
                result[index] = 'correct';
                targetLetterCount[letter]--;
            }
        });

        guessArray.forEach((letter, index) => {
            if (result[index] === 'absent' && targetLetterCount[letter] > 0) {
                result[index] = 'present';
                targetLetterCount[letter]--;
            }
        });

        this.updateDisplay(guessArray, result);
        this.currentRow++;
    }
    
    updateDisplay(guessArray, result) {
        guessArray.forEach((letter, index) => {
            const cell = document.getElementById(`cell-${this.currentRow}-${index}`);
            cell.textContent = letter;
            cell.classList.remove('correct', 'present', 'absent');

            if (result[index] === 'correct') {
                cell.style.backgroundColor = '#6aaa64';
                cell.style.color = 'white';
                cell.style.border = '2px solid #6aaa64';
            } else if (result[index] === 'present') {
                cell.style.backgroundColor = '#c9b458';
                cell.style.color = 'white';
                cell.style.border = '2px solid #c9b458';
            } else {
                cell.style.backgroundColor = '#787c7e';
                cell.style.color = 'white';
                cell.style.border = '2px solid #787c7e';
            }
        });
    }
    
    endGame(won) {
        this.gameOver = true;
        
        if (won) {
            this.showMessage(`Congratulations! You guessed the word "${this.targetWord}" in ${this.currentRow} tries!`);
        } else {
            this.showMessage(`Game Over! The word was "${this.targetWord}". Better luck next time!`);
        }

        setTimeout(() => {
            if (confirm('Would you like to play again?')) {
                this.restartGame();
            }
        }, 2000);
    }
    
    restartGame() {
        this.currentRow = 0;
        this.gameOver = false;
        this.selectRandomWord();
        this.createGameGrid();
        document.getElementById('inbox').value = '';
        console.log('New target word:', this.targetWord); 
    }
    
    showMessage(message) {
        let messageDiv = document.getElementById('game-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'game-message';
            messageDiv.style.textAlign = 'center';
            messageDiv.style.marginTop = '20px';
            messageDiv.style.fontSize = '1.2rem';
            messageDiv.style.fontWeight = 'bold';
            messageDiv.style.color = '#333';
            document.querySelector('main').appendChild(messageDiv);
        }
        
        messageDiv.textContent = message;

        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordleGame();
});