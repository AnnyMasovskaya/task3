
const crypto = require('crypto');
const readline = require('readline');


class Game {
  constructor(moves) {
    this.moves = moves;
    this.hmacKey = crypto.randomBytes(32).toString('hex');
    this.computerMove = this.getRandomMove();
    this.userMove = null;
  }

  getRandomMove() {
    const randomIndex = Math.floor(Math.random() * this.moves.length);
    return this.moves[randomIndex];
  }

  calculateHmac(move, key) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(move);
    return hmac.digest('hex');
  }

  play() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('HMAC:', this.calculateHmac(this.computerMove, this.hmacKey));
    console.log('Available moves:', this.moves.join(', '));

    rl.question('Enter your move (0 - Exit): ', (input) => {
      const moveIndex = parseInt(input);
      if (moveIndex === 0) {
        console.log('Exiting the game...');
        rl.close();
      } else if (Number.isNaN(moveIndex) || moveIndex < 1 || moveIndex > this.moves.length) {
        console.log('Invalid input. Please enter a valid move!');
        this.play();
      } else {
        this.userMove = this.moves[moveIndex - 1];
        this.printResult();
        rl.close();
      }
    });
  }

  printResult() {
    console.log('---------------------------');
    console.log('Your move:', this.userMove);
    console.log('Computer move:', this.computerMove);
    console.log('HMAC key:', this.hmacKey);
    console.log('---------------------------');

    const result = this.getResult();
    if (result === 'win') {
      console.log('You win!');
    } else if (result === 'lose') {
      console.log('You lose!');
    } else {
      console.log('It\'s a tie!');
    }
  }
  

  getResult() {
    const half = Math.floor(this.moves.length / 2);
    const movesBefore = this.moves.slice(0, half);
    const movesAfter = this.moves.slice(half + 1);

    if (movesBefore.includes(this.userMove) && movesAfter.includes(this.computerMove)) {
      return 'win';
    } else if (movesAfter.includes(this.userMove) && movesBefore.includes(this.computerMove)) {
      return 'lose';
    } else {
      return 'drow';
    }
  }
}


const moves = process.argv.slice(2);
if (moves.length % 2 !== 1 || moves.length < 3 || new Set(moves).size !== moves.length) {
  console.log('Invalid arguments. Please provide an odd number >= 3 of unique moves.');
  console.log('Example: node game.js Rock Paper Scissors');
} else {
  const game = new Game(moves);
  game.play();
}










