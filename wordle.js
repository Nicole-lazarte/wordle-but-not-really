const state = {
  secret: '',
  hint : '',
  grid: Array(4)
    .fill()
    .map(() => Array(4).fill('')),
  currentRow: 0,
  currentCol: 0,
};

const myButton = document.getElementById('startover_button');

var guessword = {
  word: "",
  hint: "",}; 

  const list = async () => {
    myButton.disabled = true;
    myButton.innerText = 'Loading...';
    document.body.style.cursor = 'wait';

  const res = await fetch("https://api.masoudkf.com/v1/wordle", {
      headers: {
      "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
      },
  });

  let json = await res.json();
  let {dictionary} = json;


  guessword = dictionary[Math.floor(Math.random() * dictionary.length)];
  guessword.word = guessword.word.toUpperCase();
  guessword.hint = guessword.hint;
  myButton.disabled = false;
  myButton.innerText = 'Start over';
  document.body.style.cursor = 'default';

  return guessword.word;
  }

list().then((data) => {
  state.secret = data;
  state.hint = guessword.hint;
  console.log(state.secret);

});

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    let key = e.key;
    key = key.toUpperCase();
    if (key === 'ENTER') {
      if (state.currentRow === 4){
    const show = document.getElementById("hint");
    show.style.display = "none";
    if (state.currentCol === 4) {
      if (state.guess.join('') === state.secret) {
      } else {
        const wrong = document.getElementById("wrong");
        wrong.innerHTML = `You missed the word '${state.secret}' and lost!`;
        wrong.style.display = "block";
      }
    }
  }
      if (state.currentCol < 4) {
        alert('word must be 4 letters')
      }
      else{
        const word = getCurrentWord();
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
      }
    }
    if (key === 'BACKSPACE') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }
    if (state.currentRow === 4) {
        const show = document.getElementById("hint");
        show.style.display = "none";
        const wrong = document.getElementById("wrong");
        wrong.style.display = "block";
        wrong.innerHTML = `You missed the word '${state.secret}' and lost!`;
    }
    updateGrid();
  };
}



function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500;

  for (let i = 0; i < 4; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
     }, ((i + 1) * animation_duration) / 2);
    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }
  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 4;

 setTimeout(() => {
   if (isWinner) {
     const winnerGif = document.getElementById('img');
     const show = document.getElementById('hint');
     const game = document.getElementById('game');
     const wrong = document.getElementById('wrong');
     
     show.style.display = 'none';
     winnerGif.style.display = 'block';
     game.style.display = 'none';
     wrong.style.display = 'none';
   }
   if (guess === state.secret) {
     for (let i = 0; i < 4; i++) {
       const box = document.getElementById(`box${row}${i}`);
       box.classList.add('right');
     }
   } else {
     for (let i = 0; i < guess.length; i++) {
       const letter = guess[i];
       const position = getPositionOfOccurrence(state.secret, letter, i);
       const box = document.getElementById(`box${row}${position - 1}`);
       box.classList.add('right');
     }
   }
 }, 3 * animation_duration);
}

function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      drawBox(grid, i, j);
    }
  }
  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;
  container.appendChild(box);
  return box;
}


function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol === 4) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

function makeGuess() {
  const input = document.getElementById('guess');
  const hint = document.getElementById('hint');

  if (input.value.toLowerCase() === state.secret) {
    state.grid[state.currentRow][state.currentCol] = input.value.toLowerCase();
    updateGrid();
    hint.innerHTML = state.hint;
    hint.style.display = "block";
    input.value = '';
    input.focus();

    // Check if user has completed all the rows and guessed the correct word
    if (state.currentRow === 3 && state.currentCol === 3 && state.grid[state.currentRow][state.currentCol] === state.secret) {
      const winnerGif = document.getElementById('img');
      winnerGif.style.display = 'block';
      const game = document.getElementById('game');
      game.style.display = 'none';
    }

    checkIfMissedWordAndLost(); // Call function here

  } else {
    const wrong = document.getElementById("wrong");
    wrong.innerHTML = "Incorrect guess, try again";
    wrong.style.display = "block";
    input.value = '';
    input.focus();
  }
}



const startover_button = document.getElementById('startover_button');
startover_button.addEventListener('click', () => {

  const wrong = document.getElementById("wrong");
  wrong.style.display = "none";

  const show = document.getElementById("hint");
  show.style.display = "none";

  const winnerGif = document.getElementById('img');
  winnerGif.style.display = 'none';

  const game = document.getElementById('game');
  game.style.display = 'flex';

  state.currentRow = 0;
  state.currentCol = 0;
  clearformat();
  state.grid = Array(4).fill().map(() => Array(4).fill(''));
  updateGrid();

  // Add a delay of 1 second before disabling the button and changing the text to "Loading..."
  startover_button.disabled = true;
  startover_button.innerHTML = "Loading...";
  setTimeout(() => {
    list().then(() => {
      state.secret = guessword.word;
      state.hint = guessword.hint;
      console.log(state.secret);
      startover_button.disabled = false;
      startover_button.innerHTML = "Start Over";
      checkIfMissedWordAndLost();
    });
  }, 1000);

  function checkIfMissedWordAndLost() {
    // Show the "wrong" element only if the user has completed all the rows and still did not guess the secret word
    if (state.currentRow === 4 && state.currentCol === 4 && state.grid[state.currentRow][state.currentCol] !== state.secret) {
      const show = document.getElementById("hint");
      show.style.display = "none";

      const wrong = document.getElementById("wrong");
      wrong.style.display = "block";
      wrong.innerHTML = `You missed the word '${state.secret}' and lost!`;
    }
  }

});



function clearformat() {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          var box = document.getElementById(`box${i}${j}`);
          box.classList.remove('right');
          box.classList.remove('wrong');
          box.classList.remove('empty');
      }
    }

}


function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  registerKeyboardEvents();
}

startup();

const gameInstructionsBtn = document.getElementById("Instructions");
gameInstructionsBtn.addEventListener("click", () => {
  var gameInstructions = document.getElementById("information");
  if (gameInstructions.style.display === "flex") {
    gameInstructions.style.display = "none";
  } 
  else {
    gameInstructions.style.display = "flex";
  }

});


const Hint_icon = document.getElementById("Hint_icon");
Hint_icon.addEventListener("click", () => {
  var show = document.getElementById("hint");
  show.innerHTML = state.hint;
  if (show.style.display === "block") {
    show.style.display = "none";
  } 
  else {
    show.style.display = "block";
  }

});

const button = document.getElementById('Dark_Mode');
const body = document.body;
const html = document.documentElement;
const navigation = document.querySelector('.navigation');
const darkModeButton = document.getElementById('Dark_Mode');

button.addEventListener('click', () => {
  body.classList.toggle('dark');
  html.classList.toggle('dark');
  navigation.classList.toggle('dark');
  footer.classList.toggle('dark');

});

darkModeButton.addEventListener('click', function() {
  body.classList.toggle('dark-mode');
});

const Instructions = document.getElementById('footer');
const click = document.getElementById('Instructions');
click.addEventListener('click', () => {
  Instructions.classList.toggle('hidden');
});
