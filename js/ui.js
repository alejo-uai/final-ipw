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

  var rankingBtn = document.getElementById('ranking-btn');
  var rankingModal = document.getElementById('ranking-modal');
  var rankingList = document.getElementById('ranking-list');
  var closeRanking = document.getElementById('close-ranking');
  var sortScore = document.getElementById('sort-score');
  var sortDate = document.getElementById('sort-date');
  var openRankingPre = document.getElementById('open-ranking-pre');

  var contactForm = document.getElementById('contact-form');

  // CONTACT - VALIDATIONS
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {

    event.preventDefault();

    var nameInput = document.getElementById('contact-name');
    var emailInput = document.getElementById('contact-email');
    var msgInput = document.getElementById('contact-msg');

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var msg = msgInput.value.trim();

    // Validate name
    var nameRegex = /^[a-zA-Z0-9 ]{3,}$/;
    if (!nameRegex.test(name)) {
      alert('El nombre debe ser alfanumérico y tener al menos 3 caracteres.');
      return;
    }

    // Validate email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Ingresá un email válido.');
      return;
    }

    // Validate mensaje
    if (msg.length < 5) {
      alert('El mensaje debe tener al menos 5 caracteres.');
      return;
    }

    // If all is OK open open mail tools
    var subject = encodeURIComponent('Contacto desde Simon Says');
    var body = encodeURIComponent(
      'Nombre: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      msg
    );

    var mailto = 'mailto:?subject=' + subject + '&body=' + body;

    window.location.href = mailto;

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
        alert('El nombre debe tener al menos 3 caracteres alfanuméricos.');
        playerNameInput.focus();
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
  restartBtn.addEventListener('click', function () {
    lostModal.className += ' hidden';
    if (window.SimonGame && typeof window.SimonGame.reset === 'function') {
      window.SimonGame.reset();
    }
    playerForm.className = playerForm.className.replace(' hidden','').trim();
    gameInfo.className += ' hidden';
    board.className += ' hidden';
  }, false);

  // ranking popup
  rankingBtn.addEventListener('click', function () {
    populateRanking('score');
    rankingModal.className = rankingModal.className.replace('hidden','').trim();
  }, false);

  closeRanking.addEventListener('click', function () {
    rankingModal.className += ' hidden';
  }, false);
  
  openRankingPre.addEventListener('click', function () {
  populateRanking('score');
  rankingModal.className = rankingModal.className.replace('hidden', '').trim();
}, false);

  sortScore.addEventListener('click', function () { populateRanking('score'); }, false);
  sortDate.addEventListener('click', function () { populateRanking('date'); }, false);

function populateRanking(orderBy) {
  var list = Storage.getAll();

  if (orderBy === 'score') {
    list.sort(function (a, b) { return b.score - a.score; });
  } else if (orderBy === 'date') {
    list.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
  }

  var html = '<ol>';
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    html += '<li>' +
      item.name +
      ' — ' + item.score + ' pts' +
      ' — Nivel ' + item.level +
      ' — ' + new Date(item.date).toLocaleString() +
      '</li>';
  }
  html += '</ol>';

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