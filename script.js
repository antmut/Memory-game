console.log("Play single clue: 2 in 1000ms");

//Global constants
const clueHoldTime = 1000; // hold each clue`s light/sound 1s 
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be 0.0 to 1.0 !
var guessCounter = 0;

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

// Start the game
function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

// Stop the game
function stopGame(){
    // swap the Start and Stop buttons
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  playClueSequence();
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Lighting a button
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

// Clearing a button
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

// Playing a single clue
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

//Play clue sequences
function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

//Lose the game
function loseGame(){
  stopGame();
  alert("Game Over. You lost.")
}

//Win the game
function winGame(){
  stopGame();
  alert("Game Over. You won!")
}

//Keep track of guesses
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  // pattern = [2, 2, 4, 3, 2, 1, 2, 4] progress guessCounter
  
  if(pattern[guessCounter] != btn){        // 1st guess is wrong Game Over. You lose.
    loseGame(); 
  }
  else{                                    // 1st guess is correct
    if(guessCounter != progress){        
      guessCounter++;                     // Go to next guess
    }
    else {
      if(progress != pattern.length - 1){ // Keep going
        progress++;
        playClueSequence();
      }
      else{
        winGame();                       // Game over. You win!
      }
    }
  } 
}