'use strict';

(function () {
  var playerForm = document.getElementById('player-form');
  var playerNameInput = document.getElementById('player-name');
  var startBtn = document.getElementById('start-btn');

  var gameInfo = document.getElementById('game-info');
  var displayPlayer = document.getElementById('display-player');
  var displayLevel = document.getElementById('display-level');
  var displayScore = document.getElementById('display-score');
  var displayTimer = document.getElementById('display-timer');

  var board = document.getElementById('board');
  var pads = document.querySelectorAll('.pad-btn');

  var lostModal = document.getElementById('lost-modal');
  var lostMsg = document.getElementById('lost-msg');
  var restartBtn = document.getElementById('restart-btn');

  var rankingModal = document.getElementById('ranking-modal');
  var rankingList = document.getElementById('ranking-list');
  var closeRanking = document.getElementById('close-ranking');
  var sortScore = document.getElementById('sortScore');
  var sortDate = document.getElementById('sortDate');
  var openRankingPre = document.getElementById('open-ranking-pre');

  var contactForm = document.getElementById('contact-form');

  // CONTACT - VALIDATIONS
if (contactForm) {

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var msgInput = document.getElementById('contact-msg');

    var errorName = document.getElementById('error-name');
    var errorEmail = document.getElementById('error-email');
    var errorMsg = document.getElementById('error-msg');

    errorName.innerHTML = '';
    errorEmail.innerHTML = '';
    errorMsg.innerHTML = '';

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var msg = msgInput.value.trim();

    var isValid = true;

    // Nombre alfanumérico
    var nameRegex = /^[a-zA-Z0-9 ]{3,}$/;
    if (!nameRegex.test(name)) {
      errorName.innerHTML = 'Ingresá un nombre alfanumérico (mín. 3 caracteres).';
      isValid = false;
    }

    // Email válido
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorEmail.innerHTML = 'Ingresá un email válido.';
      isValid = false;
    }

    // Mensaje mínimo 5
    if (msg.length < 5) {
      errorMsg.innerHTML = 'El mensaje debe tener al menos 5 caracteres.';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    var subject = encodeURIComponent('Contacto desde Simon Says');
    var body = encodeURIComponent(
      'Nombre: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      msg
    );

    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;

  }, false);
}


  function validatePlayerName(name) {
    var re = /^[A-Za-z0-9 ]{3,}$/;
    return re.test(name);
  }

  if (playerForm) {
    playerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = playerNameInput.value.trim();
      if (!validatePlayerName(name)) {
        var errorMsg = document.getElementById('error-player-name');
        errorMsg.innerHTML = 'El nombre debe tener al menos 3 caracteres alfanuméricos.';
        return;
      }
      if (window.SimonGame && typeof window.SimonGame.startGame === 'function') {
        window.SimonGame.startGame(name);
      }
      displayPlayer.textContent = name;
      playerForm.className += ' hidden';
      gameInfo.className = gameInfo.className.replace('hidden','').trim();
      board.className = board.className.replace('hidden','').trim();
    }, false);
  }

  // pad clicks
  pads.forEach = Array.prototype.forEach;
  pads.forEach(function (pad) {
    pad.addEventListener('click', function () {
      var color = this.getAttribute('data-color');
      if (window.SimonGame && typeof window.SimonGame.handlePlayerInput === 'function') {
        window.SimonGame.handlePlayerInput(color);
      }
    }, false);
  });

  // modal controls
  if (restartBtn){
  restartBtn.addEventListener('click', function () {
    lostModal.className += ' hidden';
    if (window.SimonGame && typeof window.SimonGame.reset === 'function') {
      window.SimonGame.reset();
    }
    playerForm.className = playerForm.className.replace(' hidden','').trim();
    gameInfo.className += ' hidden';
    board.className += ' hidden';
  }, false);
}

if (closeRanking){
  // ranking popup
  closeRanking.addEventListener('click', function () {
    rankingModal.className += ' hidden';
  }, false);
}
 
if (openRankingPre){
  openRankingPre.addEventListener('click', function () {
  populateRanking('score');
  rankingModal.className = rankingModal.className.replace('hidden', '').trim();
}, false);
}

if(sortScore)
  sortScore.addEventListener('click', function () { populateRanking('score'); }, false);

if(sortDate)
  sortDate.addEventListener('click', function () { populateRanking('date'); }, false);

  function populateRanking(order) {
    var list = Storage.getAll();

    if (order === 'score') {
      list.sort(function (a, b) { return b.score - a.score; });
    } else {
      list.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    }

    var html = '';
    for (var i = 0; i < list.length; i++) {
      var x = list[i];
      html +=
        '<tr>' +
        '<td>' + x.name + '</td>' +
        '<td>' + x.score + '</td>' +
        '<td>' + x.level + '</td>' +
        '<td>' + new Date(x.date).toLocaleString() + '</td>' +
        '</tr>';
    }
    rankingList.innerHTML = html;
  }


  window.SimonUI = {
    updateLevel: function (lvl) { displayLevel.textContent = lvl; },
    updateScore: function (score) { displayScore.textContent = score; },
    updateTimer: function (s) { displayTimer.textContent = s + 's'; },
    showLostModal: function (finalScore) {
      lostMsg.textContent = 'Puntuación final: ' + finalScore;
      lostModal.className = lostModal.className.replace('hidden','').trim();
    }
  };
})();