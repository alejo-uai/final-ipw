'use strict';

(function () {
  var COLORS = ['green','red','yellow','blue'];
  var sequence = [];
  var playerSeq = [];
  var level = 0;
  var score = 0;
  var playerName = '';
  var playInterval = 700; 
  var timerStart = null;
  var timerIntervalId = null;
  var timePenaltyPerSecond = 0.2;
  var isPlaying = false;

  function nextColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function getPadEl(color) { return document.getElementById(color); }

  function flash(color, callback) {
    var el = getPadEl(color);
    if (!el) { if (callback) callback(); return; }

    el.classList.add('active');
    setTimeout(function () {
      el.classList.remove('active');
      if (callback) callback();
    }, 400);
  }

  function playSequence(seq, index) {
    updateTurnIndicator(false);
    if (index >= seq.length) {
      isPlaying = false;
      updateTurnIndicator(true);
      playerSeq = [];
      return;
    }
    isPlaying = true;    
    flash(seq[index], function () {
      setTimeout(function () {
        playSequence(seq, index + 1);
      }, playInterval);
    });
  }

  function nextRound() {
    level += 1;
    window.SimonUI.updateLevel(level);
    sequence.push(nextColor());
    playSequence(sequence,0);
  }

  function handlePlayerInput(color) {
    if (isPlaying) return; 
    playerSeq.push(color);

    flash(color);

    var currentIndex = playerSeq.length - 1;
    if (playerSeq[currentIndex] !== sequence[currentIndex]) {
      gameOver();
      return;
    }

    score += 1;
    window.SimonUI.updateScore(score);

    if (playerSeq.length === sequence.length) {
      setTimeout(nextRound, 1000);
    }
  }

  function finalizeScore() {
    var elapsed = 0;
    if (timerStart) {
      elapsed = Math.floor((Date.now() - timerStart) / 1000);
    }
    var penalty = Math.floor(elapsed * timePenaltyPerSecond);
    var finalScore = score - penalty;
    if (finalScore < 0) { finalScore = 0; }
    return {
      finalScore: finalScore,
      elapsed: elapsed,
      penalty: penalty
    };
  }

  // game over
function gameOver() {
  stopTimer();

  var elapsed = Math.floor((Date.now() - timerStart) / 1000);
  var penalty = Math.floor(elapsed * timePenaltyPerSecond);
  var finalScore = score - penalty;
  if (finalScore < 0) { finalScore = 0; }

  // show modal
  window.SimonUI.showLostModal(finalScore);

  // Save on local storage
  Storage.save({
    name: playerName,
    score: finalScore,
    level: level,
    date: new Date().toISOString()
  });
}
  // timer
  function startTimer() {
    timerStart = Date.now();
    timerIntervalId = setInterval(function () {
      var s = Math.floor((Date.now() - timerStart) / 1000);
      window.SimonUI.updateTimer(s);
    }, 1000);
  }

  function stopTimer() {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      timerIntervalId = null;
    }
  }

  function startGame(name) {
    sequence = [];
    playerSeq = [];
    level = 0;
    score = 0;
    playerName = name;
    window.SimonUI.updateScore(score);
    window.SimonUI.updateLevel(level);
    window.SimonUI.updateTimer(0);
    updateTurnIndicator(false);
    startTimer();
    setTimeout(function () { nextRound(); }, 400);
  }

  function reset() {
    stopTimer();
    sequence = [];
    playerSeq = [];
    level = 0;
    score = 0;
    playerName = '';
    window.SimonUI.updateScore(score);
    window.SimonUI.updateLevel(level);
    window.SimonUI.updateTimer(0);
  }

  window.SimonGame = {
    startGame: startGame,
    handlePlayerInput: handlePlayerInput,
    reset: reset
  };

  function updateTurnIndicator(isPlayerTurn) {
  var el = document.getElementById('turn-indicator');
  if (!el) return;

  if (isPlayerTurn) {
    el.innerHTML = 'Es tu turno...';
    el.className = 'turn-indicator turn-player';
  } else {
    el.innerHTML = 'Mostrando secuencia...';
    el.className = 'turn-indicator turn-wait';
  }
}
})();
