'use strict';

var Storage = (function () {
  var KEY = 'simon_results_v1';

  function getAll() {
    var raw = localStorage.getItem(KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function save(result) {
    var list = getAll();
    list.push(result);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  return {
    getAll: getAll,
    save: save
  };
})();
