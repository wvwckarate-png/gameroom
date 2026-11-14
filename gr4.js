// Game Room v4: header bar, search, favorites, recently played, save slots, controller bridge, site-wide season effects.
// Loaded after the main script in index.html and builds on its globals (GAMES, SYSTEMS, openSystem, openGame, showScreen ...).
(function() {
'use strict';
function $(id) { return document.getElementById(id); }
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
function jget(key, dflt) { try { var v = JSON.parse(lsGet(key)); return v === null || v === undefined ? dflt : v; } catch (e) { return dflt; } }
function jset(key, v) { lsSet(key, JSON.stringify(v)); }
function gameKey(sys, title) { return sys + '|' + title; }
function findGame(sys, title) {
  var list = GAMES[sys] || [];
  for (var i = 0; i < list.length; i++) if (list[i].title === title) return list[i];
  return null;
}
function emu() { return window.EJS_emulator; }
function emuRunning() { var e = emu(); return !!(e && e.started && e.gameManager); }
function onPlaying() { return $('playing').classList.contains('active'); }

// ---------------------------------------------------------------- page furniture
var header = el('div', '', '<button type="button" id="gr-logo">GAME ROOM</button><span id="gr-season"></span>' +
  '<div id="gr-search-wrap"><input id="gr-search" type="search" placeholder="Search all games..." autocomplete="off" spellcheck="false"></div>' +
  '<span class="gr-pill" id="gr-time"><span>TODAY</span> <b>0:00</b></span>' +
  '<button type="button" class="gr-pill" id="gr-pad" title="Controller"><i class="dot"></i>&#127918;<span> CONTROLLER</span></button>');
header.id = 'gr-header';
document.body.appendChild(header);
// on the play screen the game's name and the clock sit in the header (where the search box is on other screens)
var now = el('div'); now.id = 'gr-now';
['playing-title', 'playing-system', 'session-timer'].forEach(function(id) { now.appendChild($(id)); });
header.insertBefore(now, $('gr-time'));
header.appendChild($('play-online-btn'));
document.body.appendChild(el('div', '', '<i class="la"></i><i class="lb"></i>')).id = 'gr-lights';
var fx = el('canvas'); fx.id = 'season-fx'; document.body.insertBefore(fx, document.body.firstChild);
var toastEl = el('div'); toastEl.id = 'gr-toast'; document.body.appendChild(toastEl);
var toastTimer = null;
function toast(msg) {
  try { if (emuRunning() && document.fullscreenElement) emu().displayMessage(msg, 2500); } catch (e) {}
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toastEl.classList.remove('show'); }, 2600);
}
function modal(id, html) { var m = el('div', 'gr-modal', '<div class="gr-box">' + html + '</div>'); m.id = id; document.body.appendChild(m); return m; }
function anyModalOpen() { return !!document.querySelector('.gr-modal.active, .online-modal.active'); }

$('gr-logo').onclick = function() { if (onPlaying()) { leaveGame(function() { location.href = location.pathname; }); } else { $('gr-search').value = ''; showScreen('systems'); } };

// the old big title is in the header now
var homeTitle = document.querySelector('#systems .page-title'); if (homeTitle) homeTitle.style.display = 'none';
var homeSub = document.querySelector('#systems .page-sub'); if (homeSub) homeSub.style.display = 'none';

// ---------------------------------------------------------------- favorites + recently played
function favs() { return jget('grFavs', []); }
function isFav(key) { return favs().indexOf(key) >= 0; }
function toggleFav(key) { var f = favs(), i = f.indexOf(key); if (i >= 0) f.splice(i, 1); else f.unshift(key); jset('grFavs', f); return i < 0; }
var RECENT_MAX = 6, RECENT_DAYS = 30;      // the shelf keeps the last 6 games, and drops any not played for a month
function recents() {
  var cut = Date.now() - RECENT_DAYS * 86400000;
  return jget('grRecent', []).filter(function(x) { return x && x.k && x.at > cut; }).slice(0, RECENT_MAX);
}
function removeRecent(key) { jset('grRecent', recents().filter(function(x) { return x.k !== key; })); }
function addRecent(sys, title) {
  var key = gameKey(sys, title), r = recents().filter(function(x) { return x.k !== key; });
  r.unshift({ k: key, at: Date.now() });
  jset('grRecent', r.slice(0, RECENT_MAX));
}
function saveIndex() { return jget('grSaveIdx', {}); }

// ---------------------------------------------------------------- cover cards
function coverCard(sys, game, opts) {
  opts = opts || {};
  var key = gameKey(sys, game.title), color = (SYSTEMS[sys] || {}).color || '#ffdc00';
  var card = el('div', 'cover-card');
  card.style.setProperty('--sys', color);
  var art = el('div', 'cover-art');
  var fb = el('div', 'cover-fallback', '<i>&#127918;</i><b></b>');
  fb.querySelector('b').textContent = game.title;
  art.appendChild(fb);
  if (game.thumb) {
    var img = new Image();
    img.loading = 'lazy'; img.alt = '';
    img.onload = function() {
      fb.style.display = 'none';
      if (img.naturalWidth > img.naturalHeight * 0.85) {       // not a tall box: fill the frame behind it
        var blur = el('div', 'cover-blur');
        blur.style.backgroundImage = 'url("' + game.thumb.replace(/"/g, '%22') + '")';
        art.insertBefore(blur, img);
      }
    };
    img.onerror = function() { img.remove(); };
    img.src = game.thumb;
    art.appendChild(img);
  }
  if (saveIndex()[key]) art.appendChild(el('span', 'cover-badge', 'SAVED'));
  if (game.file) {
    var star = el('button', 'fav-btn' + (isFav(key) ? ' on' : ''), '&#9733;');
    star.type = 'button';
    star.title = 'Favorite';
    star.onclick = function(e) {
      e.stopPropagation();
      var on = toggleFav(key);
      star.classList.toggle('on', on);
      toast(on ? 'ADDED TO FAVORITES' : 'REMOVED FROM FAVORITES');
      if ($('systems').classList.contains('active')) renderHome();
    };
    star.onkeydown = function(e) { e.stopPropagation(); };
    art.appendChild(star);
  }
  card.appendChild(art);
  var name = el('div', 'cover-name');
  name.textContent = game.title;
  if (opts.showSystem) { var s = el('span', 'cover-sys'); s.textContent = (SYSTEMS[sys] || {}).label || sys; name.appendChild(s); }
  if (game.note && !opts.noNote) { var n = el('span', 'cover-note'); n.textContent = (game.version ? game.version + ' - ' : '') + game.note; name.appendChild(n); }
  if (opts.onRemove) {
    var x = el('button', 'rm-btn', '&#10005;');
    x.type = 'button';
    x.title = 'Remove from this list';
    x.onclick = function(e) { e.stopPropagation(); opts.onRemove(key); };
    x.onkeydown = function(e) { e.stopPropagation(); };
    art.appendChild(x);
  }
  card.appendChild(name);
  makeActivatable(card, function() { currentSystem = sys; openGame(game); });
  return card;
}

function renderList(items, rows) {
  var list = $('game-list');
  list.innerHTML = '';
  list.classList.toggle('rows', !!rows);
  for (var i = 0; i < items.length; i++) {
    var c = coverCard(items[i].sys, items[i].game, { showSystem: items[i].showSystem });
    c.style.animationDelay = Math.min(i * 0.015, 0.4) + 's';
    list.appendChild(c);
  }
  return list;
}

var baseOpenSystem = openSystem;
window.openSystem = openSystem = function(sysId) {
  baseOpenSystem(sysId);
  var games = GAMES[sysId].slice().sort(function(a, b) { return a.title.localeCompare(b.title); });
  var list = renderList(games.map(function(g) { return { sys: sysId, game: g }; }), sysId === 'lab');
  if (sysId === 'lab') {
    var load = el('div', 'cover-card');
    load.style.setProperty('--sys', SYSTEMS.lab.color);
    load.innerHTML = '<div class="cover-art"><div class="cover-fallback"><i>&#128193;</i><b>LOAD A ROM</b></div></div><div class="cover-name">LOAD A ROM FROM MY COMPUTER<span class="cover-note">.nes .sfc .smc .md .gen .gb .gbc .gba - nothing is uploaded, it only plays in this browser</span></div>';
    makeActivatable(load, function() { $('lab-file').click(); });
    list.appendChild(load);
  }
  $('library-sub').textContent = games.length + (sysId === 'lab' ? ' EXPERIMENTS - HACKS, HOMEBREW AND TEST BUILDS' : ' GAMES');
};

// ---------------------------------------------------------------- home shelves
var shelves = el('div'); shelves.id = 'gr-shelves';
var grid = document.querySelector('#systems .systems-grid');
grid.parentNode.insertBefore(shelves, grid);
var sysHead = el('div', 'shelf-title', 'SYSTEMS <small>PICK ONE</small>');
grid.parentNode.insertBefore(sysHead, grid);

function shelf(title, hint, entries, extra) {
  var box = el('div', 'shelf');
  box.appendChild(el('div', 'shelf-title', title + ' <small>' + hint + '</small>'));
  var row = el('div', 'shelf-row');
  entries.forEach(function(e) { row.appendChild(coverCard(e.sys, e.game, { showSystem: true, noNote: true, onRemove: extra && extra.onRemove })); });
  box.appendChild(row);
  return box;
}
function keysToEntries(keys) {
  var out = [];
  keys.forEach(function(k) {
    var p = k.indexOf('|'), sys = k.slice(0, p), g = findGame(sys, k.slice(p + 1));
    if (g) out.push({ sys: sys, game: g });
  });
  return out;
}
function renderHome() {
  shelves.innerHTML = '';
  var rec = keysToEntries(recents().map(function(r) { return r.k; }));
  if (rec.length) shelves.appendChild(shelf('CONTINUE PLAYING', 'YOUR LAST GAMES', rec, { onRemove: function(key) { removeRecent(key); renderHome(); } }));
  var fv = keysToEntries(favs());
  if (fv.length) shelves.appendChild(shelf('&#9733; FAVORITES', fv.length + (fv.length === 1 ? ' GAME' : ' GAMES'), fv));
  else if (rec.length) shelves.appendChild(el('div', 'empty-note', 'Tip: hover a game and click the &#9733; to add it to your favorites.')).style.padding = '0 0 24px';
}

// ---------------------------------------------------------------- screens
var baseShowScreen = showScreen;
window.showScreen = showScreen = function(id) {
  baseShowScreen(id);
  document.body.classList.toggle('in', id !== 'login');
  document.body.setAttribute('data-screen', id);
  if (id === 'systems') renderHome();
};
(function() {   // the main script already picked a screen before this file loaded
  var active = document.querySelector('.screen.active');
  var id = active ? active.id : 'login';
  document.body.classList.toggle('in', id !== 'login');
  document.body.setAttribute('data-screen', id);
  if (id === 'systems') renderHome();
  if (id === 'library' && currentSystem) openSystem(currentSystem);
})();

// ---------------------------------------------------------------- search
var searchBox = $('gr-search');
function runSearch() {
  var q = searchBox.value.trim().toLowerCase();
  if (onPlaying()) return;
  if (q.length < 2) { if ($('library').classList.contains('active') && searchBox.dataset.active) { searchBox.dataset.active = ''; showScreen('systems'); } return; }
  var words = q.split(/\s+/), hits = [];
  Object.keys(GAMES).forEach(function(sys) {
    GAMES[sys].forEach(function(g) {
      var t = g.title.toLowerCase();
      if (words.every(function(w) { return t.indexOf(w) >= 0; })) hits.push({ sys: sys, game: g, showSystem: true });
    });
  });
  hits.sort(function(a, b) { return a.game.title.localeCompare(b.game.title); });
  searchBox.dataset.active = '1';
  $('library-accent').style.background = '#ffdc00';
  $('library-title').textContent = 'SEARCH';
  $('library-title').style.color = '#ffdc00';
  $('library-sub').textContent = hits.length + (hits.length === 1 ? ' MATCH' : ' MATCHES') + ' FOR "' + searchBox.value.trim().toUpperCase() + '"';
  var list = renderList(hits, false);
  if (!hits.length) list.appendChild(el('div', 'empty-note', 'No games match that. Try fewer letters.'));
  if (!$('library').classList.contains('active')) showScreen('library');
}
searchBox.addEventListener('input', runSearch);
searchBox.addEventListener('keydown', function(e) { if (e.key === 'Escape') { searchBox.value = ''; runSearch(); searchBox.blur(); } });
document.addEventListener('keydown', function(e) {
  var tag = e.target && e.target.tagName;
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && !onPlaying() && document.body.classList.contains('in')) { e.preventDefault(); searchBox.focus(); }
});
$('back-to-systems').onclick = function() { searchBox.value = ''; searchBox.dataset.active = ''; showScreen('systems'); };

// ---------------------------------------------------------------- time pill
function updateTimePill() {
  var pill = $('gr-time'), used = getTimeUsedToday();
  var short = function(s) { var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h + ':' + (m < 10 ? '0' : '') + m; };
  if (isUnlimitedToday()) { pill.querySelector('b').textContent = short(used) + ' / NO LIMIT'; pill.className = 'gr-pill'; return; }
  var limit = getLimitSeconds(), left = limit - used;
  pill.querySelector('b').textContent = short(used) + ' / ' + short(limit);
  pill.className = 'gr-pill' + (left <= 0 ? ' out' : left <= 300 ? ' warn' : '');
}
updateTimePill();
setInterval(updateTimePill, 5000);

// ---------------------------------------------------------------- save slots (IndexedDB, per browser)
var SLOTS = [['auto', 'AUTO SAVE', 'Made for you when you leave a game'], ['quick', 'QUICK SAVE', 'The SAVE button under the TV'], ['1', 'SLOT 1', ''], ['2', 'SLOT 2', ''], ['3', 'SLOT 3', '']];
var dbPromise = null;
function db() {
  if (!dbPromise) dbPromise = new Promise(function(res, rej) {
    var rq = indexedDB.open('grSaves', 1);
    rq.onupgradeneeded = function() { rq.result.createObjectStore('saves', { keyPath: 'id' }); };
    rq.onsuccess = function() { res(rq.result); };
    rq.onerror = function() { rej(rq.error); };
  });
  return dbPromise;
}
function dbDo(mode, fn) {
  return db().then(function(d) {
    return new Promise(function(res, rej) {
      var tx = d.transaction('saves', mode), out = fn(tx.objectStore('saves'));
      tx.oncomplete = function() { res(out && out.result); };
      tx.onerror = tx.onabort = function() { rej(tx.error); };
    });
  });
}
function savesFor(key) { return dbDo('readonly', function(s) { return s.getAll(IDBKeyRange.bound(key + '#', key + '#￿')); }).then(function(r) { return r || []; }); }
function newest(list) { return list.slice().sort(function(a, b) { return b.at - a.at; })[0] || null; }
function when(ts) {
  var d = new Date(ts), now = new Date(), t = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return 'Today ' + t;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + t;
}
function shrinkShot(shot) {      // PNG bytes / blob from the emulator -> small JPEG data URL
  return new Promise(function(res) {
    if (!shot) return res('');
    var blob = shot instanceof Blob ? shot : new Blob([shot], { type: 'image/png' });
    var url = URL.createObjectURL(blob), img = new Image();
    img.onload = function() {
      var w = 320, h = Math.round(w * img.height / img.width) || 240, c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      try { res(c.toDataURL('image/jpeg', 0.7)); } catch (e) { res(''); }
    };
    img.onerror = function() { URL.revokeObjectURL(url); res(''); };
    img.src = url;
  });
}
function grabShot() {
  var e = emu();
  var p = Promise.resolve().then(function() { return e.gameManager.screenshot(); }).then(function(png) { return shrinkShot(png); });
  return Promise.race([p, new Promise(function(res) { setTimeout(function() { res(''); }, 2000); })]).catch(function() { return ''; });
}
var cur = null;     // { sys, title, key } of the game on the TV
function writeSave(slot, state, shot) {
  var rec = { id: cur.key + '#' + slot, key: cur.key, slot: slot, state: state, shot: shot || '', at: Date.now() };
  return dbDo('readwrite', function(s) { return s.put(rec); }).then(function() {
    var idx = saveIndex(); idx[cur.key] = rec.at; jset('grSaveIdx', idx);
    return rec;
  });
}
function saveTo(slot, quiet, shotGiven) {
  if (!cur || !emuRunning()) return Promise.resolve(null);
  var state;
  try { state = emu().gameManager.getState(); } catch (e) { if (!quiet) toast('COULD NOT SAVE'); return Promise.resolve(null); }
  if (!state || !state.length) return Promise.resolve(null);
  state = new Uint8Array(state);      // copy now: the emulator reuses its buffer
  return (typeof shotGiven === 'string' ? Promise.resolve(shotGiven) : shotGiven === null ? Promise.resolve('') : grabShot()).then(function(shot) { return writeSave(slot, state, shot); })
    .then(function(rec) { if (!quiet) toast('GAME SAVED'); return rec; })
    .catch(function() { if (!quiet) toast('COULD NOT SAVE - BROWSER STORAGE IS FULL OR BLOCKED'); return null; });
}
function loadRec(rec) {
  try { emu().gameManager.loadState(new Uint8Array(rec.state)); toast('LOADED ' + when(rec.at).toUpperCase()); return true; }
  catch (e) { toast('COULD NOT LOAD THAT SAVE'); return false; }
}
function resumeEmu() { try { if (emuRunning() && emu().paused && !isOverLimit()) emu().play(); } catch (e) {} }
function pauseEmu() { try { if (emuRunning()) emu().pause(); } catch (e) {} }

// the emulator's own toolbar buttons (they also work in full screen)
window.EJS_onSaveState = function() { saveTo('quick'); };
window.EJS_onLoadState = function() {
  if (!cur) return;
  if (!saveIndex()[cur.key]) { pickSaveFile(); return; }        // nothing saved here yet: offer a save file from the computer
  savesFor(cur.key).then(function(list) { var n = newest(list); if (n) loadRec(n); else toast('NO SAVE FOR THIS GAME YET'); });
};
window.EJS_onGameStart = function() {
  takeOverGamepads();
  if (!cur) return;
  var key = cur.key;
  savesFor(key).then(function(list) {
    if (list.length) return list;
    // nothing in Game Room's slots: look for a state the old site kept inside the browser and adopt it
    var e = emu();
    return Promise.resolve().then(function() { return e.storage.states.get(e.getBaseFileName() + '.state'); }).then(function(old) {
      if (!old || !old.length || !cur || cur.key !== key) return list;
      return writeSave('1', new Uint8Array(old), '').then(function(rec) { return [rec]; });
    }).catch(function() { return list; });
  }).then(function(list) {
    var n = newest(list);
    if (!n || !cur || cur.key !== key || !onPlaying()) return;
    pauseEmu();
    $('resume-when').textContent = when(n.at);
    $('resume-shot').style.backgroundImage = n.shot ? 'url(' + n.shot + ')' : 'none';
    $('resume-yes').onclick = function() { resumeModal.classList.remove('active'); resumeEmu(); setTimeout(function() { loadRec(n); }, 250); };
    resumeModal.classList.add('active');
  }).catch(function() {});
};

var resumeModal = modal('resume-modal', '<h2>WELCOME BACK!</h2><p>You have a saved game from <b id="resume-when"></b>.</p><div id="resume-shot"></div>' +
  '<div class="gr-actions"><button type="button" class="gr-btn" id="resume-yes">&#9654; CONTINUE</button><button type="button" class="gr-btn ghost" id="resume-no">START OVER</button></div>' +
  '<p style="margin:14px 0 0;font-size:12px;">Starting over does not erase your saves. Open SAVES under the TV any time.</p>');
$('resume-no').onclick = function() { resumeModal.classList.remove('active'); resumeEmu(); };

var savesModal = modal('saves-modal', '<h2>SAVES</h2><p id="saves-game"></p><div id="saves-list"></div>' +
  '<div class="gr-actions"><button type="button" class="gr-btn ghost small" id="saves-import">&#128193; LOAD A SAVE FILE</button><button type="button" class="gr-btn ghost small" id="saves-export">&#11015; SAVE TO A FILE</button><button type="button" class="gr-btn" id="saves-close">BACK TO THE GAME</button></div>' +
  '<p style="margin:14px 0 0;font-size:12px;">Saves live in this browser on this computer. <b>LOAD A SAVE FILE</b> opens a .state file from your Downloads (old saves work too) and keeps a copy in an empty slot. <b>SAVE TO A FILE</b> downloads where you are right now.</p>' +
  '<input type="file" id="saves-file" style="display:none">');
function renderSaves() {
  if (!cur) return;
  $('saves-game').textContent = cur.title;
  savesFor(cur.key).then(function(list) {
    var by = {}; list.forEach(function(r) { by[r.slot] = r; });
    var box = $('saves-list'); box.innerHTML = '';
    SLOTS.forEach(function(def) {
      var slot = def[0], rec = by[slot];
      var row = el('div', 'save-slot' + (rec ? ' has' : ''));
      var shot = el('div', 'shot', rec && rec.shot ? '' : (rec ? 'SAVED' : 'EMPTY'));
      if (rec && rec.shot) shot.style.backgroundImage = 'url(' + rec.shot + ')';
      var meta = el('div', 'meta', '<b>' + def[1] + '</b><span></span>');
      meta.querySelector('span').textContent = rec ? when(rec.at) : (def[2] || 'Empty');
      var btns = el('div', 'btns');
      if (slot !== 'auto') {
        var sv = el('button', 'gr-btn small', 'SAVE HERE'); sv.type = 'button';
        sv.onclick = function() { if (rec && !confirm('Replace the save in ' + def[1] + '?')) return; saveTo(slot, false, panelShot).then(renderSaves); };
        btns.appendChild(sv);
      }
      if (rec) {
        var ld = el('button', 'gr-btn ghost small', 'LOAD'); ld.type = 'button';
        ld.onclick = function() { savesModal.classList.remove('active'); resumeEmu(); setTimeout(function() { loadRec(rec); }, 150); };
        btns.appendChild(ld);
        var more = el('div'); more.style.cssText = 'display:flex;gap:6px;';
        var dl = el('button', 'gr-btn ghost small', '&#11015;'); dl.type = 'button'; dl.title = 'Copy this save to a file';
        dl.onclick = function() {
          var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([rec.state]));
          a.download = cur.title.replace(/[^\w\- ]+/g, '') + ' - ' + def[1] + '.state'; a.click();
          setTimeout(function() { URL.revokeObjectURL(a.href); }, 2000);
        };
        var rm = el('button', 'gr-btn danger small', '&#10005;'); rm.type = 'button'; rm.title = 'Delete this save';
        rm.onclick = function() { if (!confirm('Delete ' + def[1] + '?')) return; dbDo('readwrite', function(s) { return s.delete(rec.id); }).then(renderSaves); };
        more.appendChild(dl); more.appendChild(rm); btns.appendChild(more);
      }
      row.appendChild(shot); row.appendChild(meta); row.appendChild(btns);
      box.appendChild(row);
    });
  });
}
var panelShot = '';      // picture of the game taken just before the panel paused it
function openSaves() {
  if (!cur) return;
  try { exitFullscreenIfNeeded(); } catch (e) {}
  (emuRunning() && !emu().paused ? grabShot() : Promise.resolve('')).then(function(shot) { panelShot = shot; pauseEmu(); renderSaves(); savesModal.classList.add('active'); });
}
$('saves-close').onclick = function() { savesModal.classList.remove('active'); resumeEmu(); };
// save files on the computer (.state): the old site downloaded these, and they still load
function pickSaveFile() { if (!cur || !emuRunning()) { toast('START A GAME FIRST'); return; } $('saves-file').click(); }
function loadSaveFile(f) {
  if (!f || !cur || !emuRunning()) return;
  var key = cur.key;
  f.arrayBuffer().then(function(buf) {
    savesModal.classList.remove('active'); resumeModal.classList.remove('active'); resumeEmu();
    setTimeout(function() {
      if (!cur || cur.key !== key) return;
      try { emu().gameManager.loadState(new Uint8Array(buf)); } catch (e) { toast('THAT FILE IS NOT A SAVE FOR THIS GAME'); return; }
      toast('LOADED ' + f.name.toUpperCase());
      setTimeout(function() {          // keep a copy in the first empty slot so it is there next time
        savesFor(key).then(function(list) {
          var used = {}; list.forEach(function(r) { used[r.slot] = 1; });
          var slot = !used['1'] ? '1' : !used['2'] ? '2' : !used['3'] ? '3' : 'auto';
          return saveTo(slot, true);
        });
      }, 700);
    }, 250);
  });
}
$('saves-import').onclick = pickSaveFile;
$('saves-file').onchange = function() { var f = this.files && this.files[0]; this.value = ''; loadSaveFile(f); };
$('saves-export').onclick = function() {
  if (!cur || !emuRunning()) return;
  try {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([new Uint8Array(emu().gameManager.getState())]));
    a.download = cur.title.replace(/[^\w\- ]+/g, '') + '.state'; a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 2000);
    toast('SAVE FILE DOWNLOADED');
  } catch (e) { toast('COULD NOT SAVE'); }
};
// dropping a .state file on the page while a game is on loads it
document.addEventListener('dragover', function(e) { if (onPlaying()) e.preventDefault(); });
document.addEventListener('drop', function(e) {
  if (!onPlaying()) return;
  e.preventDefault();
  var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  if (f) loadSaveFile(f);
});

// buttons on the TV's front panel
var panel = document.querySelector('.crt-panel');
if (panel) {
  var bSave = el('button', 'crt-btn', '&#128190; SAVE'); bSave.type = 'button'; bSave.onclick = function() { saveTo('quick'); };
  var bSaves = el('button', 'crt-btn', '&#128194; SAVES'); bSaves.type = 'button'; bSaves.onclick = openSaves;
  var brand = panel.querySelector('.crt-brand');
  panel.insertBefore(bSaves, brand.nextSibling);
  panel.insertBefore(bSave, bSaves);
  var bFile = el('button', 'crt-btn', '&#128193; LOAD FILE'); bFile.type = 'button'; bFile.title = 'Load a .state save file from this computer'; bFile.onclick = pickSaveFile;
  panel.insertBefore(bFile, bSaves.nextSibling);
}

// auto save: when leaving, when time runs out, when the tab is hidden, and every few minutes for small states
function autoSave() { return saveTo('auto', true); }
function leaveGame(then) {
  var done = false, go = function() { if (!done) { done = true; stopSessionTimer(); then(); } };
  if (!cur || !emuRunning()) return go();
  autoSave().then(go, go);
  setTimeout(go, 2500);
}
$('back-to-library').onclick = function() { leaveGame(function() { location.href = location.pathname + '?system=' + currentSystem; }); };
$('back-to-systems-from-playing').onclick = function() { leaveGame(function() { location.href = location.pathname; }); };
var baseTimesUp = showTimesUp;
window.showTimesUp = showTimesUp = function(t) { if (onPlaying()) autoSave(); baseTimesUp(t); };
document.addEventListener('visibilitychange', function() { if (document.hidden && onPlaying()) saveTo('auto', true, null); });
window.addEventListener('pagehide', function() { if (onPlaying()) saveTo('auto', true, null); });
setInterval(function() {
  if (!onPlaying() || !emuRunning() || emu().paused || anyModalOpen()) return;
  try { if (emu().gameManager.getState().length > 3 * 1024 * 1024) return; } catch (e) { return; }
  autoSave();
}, 180000);
var warnSub = document.querySelector('#save-warning .sw-sub');
if (warnSub) warnSub.textContent = 'Your game is saved for you when time runs out. Finish what you are doing! (Click to dismiss)';
var warnTitle = document.querySelector('#save-warning .sw-title');
if (warnTitle) warnTitle.textContent = '⏰ 1 MINUTE LEFT';

// a shorter emulator toolbar: Game Room has its own saves and its own way out (which auto-saves)
window.EJS_Buttons = { cacheManager: false, saveSavFiles: false, loadSavFiles: false, contextMenu: false, exitEmulation: false, screenRecord: false };
// ---------------------------------------------------------------- the console "plugged into" the TV
// Small drawings (220 x 70) that sit in front of the TV's feet; the one for the current system is shown.
var CONSOLE_ART = {
  nes: '<rect x="28" y="14" width="164" height="26" rx="3" fill="#dcd9d2"/><rect x="28" y="38" width="164" height="24" rx="2" fill="#8f8c86"/><rect x="28" y="36" width="164" height="4" fill="#26262a"/>' +
       '<rect x="36" y="18" width="104" height="14" rx="1" fill="#cbc8c0"/><path d="M36 22h104M36 26h104M36 30h104" stroke="#b5b2aa" stroke-width="1"/>' +
       '<rect x="38" y="44" width="46" height="12" rx="1" fill="#26262a"/><circle cx="44" cy="50" r="2" fill="#ff3b2f"/><rect x="50" y="47" width="13" height="6" fill="#b3261e"/><rect x="67" y="47" width="13" height="6" fill="#b3261e"/>' +
       '<rect x="122" y="45" width="26" height="11" rx="1" fill="#1a1a1c"/><rect x="156" y="45" width="26" height="11" rx="1" fill="#1a1a1c"/><path d="M127 50h16M161 50h16" stroke="#555" stroke-width="2" stroke-dasharray="2 2"/>',
  snes: '<path d="M26 60 Q26 20 40 18 H180 Q194 20 194 60 Z" fill="#cfccd6"/><rect x="26" y="52" width="168" height="10" rx="2" fill="#a9a6b2"/>' +
        '<rect x="66" y="22" width="88" height="14" rx="3" fill="#3a3842"/><rect x="72" y="25" width="76" height="8" rx="2" fill="#1c1b22"/>' +
        '<rect x="40" y="28" width="18" height="12" rx="2" fill="#7b5fc4"/><rect x="162" y="28" width="18" height="12" rx="2" fill="#7b5fc4"/><rect x="96" y="40" width="28" height="8" rx="2" fill="#8d8a98"/>' +
        '<rect x="48" y="54" width="22" height="6" rx="1" fill="#55535e"/><rect x="78" y="54" width="22" height="6" rx="1" fill="#55535e"/><circle cx="182" cy="57" r="2" fill="#ff3b2f"/>',
  genesis: '<path d="M24 60 L32 22 Q34 18 40 18 H180 Q186 18 188 22 L196 60 Z" fill="#1b1b20"/><rect x="24" y="56" width="172" height="6" rx="2" fill="#0d0d10"/>' +
           '<circle cx="110" cy="36" r="17" fill="#26262c" stroke="#3a3a42" stroke-width="2"/><rect x="92" y="32" width="36" height="8" rx="2" fill="#0a0a0c"/>' +
           '<rect x="40" y="28" width="26" height="5" rx="2" fill="#c8281e"/><rect x="40" y="38" width="12" height="6" rx="1" fill="#55555e"/><rect x="150" y="30" width="30" height="4" rx="2" fill="#44444c"/><rect x="158" y="28" width="8" height="8" rx="1" fill="#88888f"/>' +
           '<rect x="36" y="50" width="60" height="3" fill="#c8281e"/><circle cx="184" cy="50" r="2" fill="#ff3b2f"/>',
  n64: '<path d="M22 60 Q20 34 46 30 Q70 16 110 16 Q150 16 174 30 Q200 34 198 60 Z" fill="#2c2c33"/><rect x="22" y="56" width="176" height="6" rx="3" fill="#18181c"/>' +
       '<rect x="78" y="20" width="64" height="12" rx="3" fill="#121215"/><ellipse cx="52" cy="38" rx="12" ry="5" fill="#3a3a43"/><ellipse cx="168" cy="38" rx="12" ry="5" fill="#3a3a43"/>' +
       '<circle cx="46" cy="50" r="5" fill="#0e0e11"/><circle cx="68" cy="50" r="5" fill="#0e0e11"/><circle cx="152" cy="50" r="5" fill="#0e0e11"/><circle cx="174" cy="50" r="5" fill="#0e0e11"/>' +
       '<rect x="102" y="44" width="5" height="5" fill="#e03a2f"/><rect x="108" y="44" width="5" height="5" fill="#2f8fe0"/><rect x="102" y="50" width="5" height="5" fill="#f2c21e"/><rect x="108" y="50" width="5" height="5" fill="#3aa84a"/><circle cx="124" cy="50" r="2" fill="#ff3b2f"/>',
  gameboy: '<g transform="translate(86 2)"><path d="M0 4 Q0 0 4 0 H44 Q48 0 48 4 V56 Q48 66 36 66 H4 Q0 66 0 62 Z" fill="#c9c7be"/><rect x="5" y="5" width="38" height="28" rx="2" fill="#5a5d66"/><rect x="10" y="9" width="28" height="20" fill="#9bbc0f"/>' +
           '<rect x="8" y="41" width="12" height="4" fill="#26262a"/><rect x="12" y="37" width="4" height="12" fill="#26262a"/><circle cx="33" cy="45" r="3.4" fill="#a8245c"/><circle cx="41" cy="40" r="3.4" fill="#a8245c"/>' +
           '<rect x="16" y="56" width="7" height="2.5" rx="1" fill="#77756e" transform="rotate(-25 19 57)"/><rect x="25" y="56" width="7" height="2.5" rx="1" fill="#77756e" transform="rotate(-25 28 57)"/><circle cx="7" cy="14" r="1.2" fill="#ff3b2f"/></g>',
  gbc: '<g transform="translate(87 2)"><path d="M0 4 Q0 0 4 0 H42 Q46 0 46 4 V58 Q46 66 23 66 Q0 66 0 58 Z" fill="#6a4fc4"/><rect x="5" y="5" width="36" height="28" rx="2" fill="#26262c"/><rect x="9" y="8" width="28" height="22" fill="#7ad0e8"/>' +
       '<rect x="9" y="8" width="7" height="22" fill="#e85a5a"/><rect x="16" y="8" width="7" height="22" fill="#f2c21e"/><rect x="23" y="8" width="7" height="22" fill="#4cc86a"/>' +
       '<rect x="7" y="42" width="12" height="4" fill="#1c1c20"/><rect x="11" y="38" width="4" height="12" fill="#1c1c20"/><circle cx="31" cy="46" r="3.4" fill="#1c1c20"/><circle cx="39" cy="41" r="3.4" fill="#1c1c20"/><circle cx="6" cy="14" r="1.2" fill="#ff3b2f"/></g>',
  gba: '<path d="M40 16 H180 Q200 18 204 38 Q204 58 186 60 H34 Q16 58 16 38 Q20 18 40 16 Z" fill="#5a3fb0"/><rect x="70" y="20" width="80" height="36" rx="3" fill="#1c1c22"/><rect x="77" y="24" width="66" height="28" fill="#8fd08f"/>' +
       '<rect x="34" y="35" width="20" height="6" fill="#26262c"/><rect x="41" y="28" width="6" height="20" fill="#26262c"/><circle cx="170" cy="42" r="6" fill="#d8d6e0"/><circle cx="186" cy="34" r="6" fill="#d8d6e0"/>' +
       '<rect x="36" y="13" width="30" height="5" rx="2" fill="#463090"/><rect x="154" y="13" width="30" height="5" rx="2" fill="#463090"/><circle cx="160" cy="54" r="1.5" fill="#3ddc6a"/>',
  gamegear: '<path d="M30 12 H190 Q206 14 206 36 Q206 60 190 62 H30 Q14 60 14 36 Q14 14 30 12 Z" fill="#17171b"/><rect x="68" y="18" width="84" height="40" rx="3" fill="#0a0a0c" stroke="#2a2a30"/><rect x="76" y="23" width="68" height="30" fill="#3a78c8"/>' +
            '<circle cx="42" cy="38" r="12" fill="#26262c"/><rect x="33" y="35" width="18" height="6" fill="#55555e"/><rect x="39" y="29" width="6" height="18" fill="#55555e"/>' +
            '<circle cx="170" cy="42" r="6" fill="#33333a"/><circle cx="186" cy="34" r="6" fill="#33333a"/><rect x="164" y="18" width="16" height="4" rx="2" fill="#2f6fd0"/><path d="M76 53 h20 M100 53 h20 M124 53 h20" stroke="#e03a2f" stroke-width="1.5"/>',
  nds: '<g transform="translate(74 0)"><rect x="0" y="2" width="72" height="32" rx="3" fill="#c9ccd4"/><rect x="14" y="6" width="44" height="24" fill="#1c1c22"/><rect x="17" y="8" width="38" height="20" fill="#7ad0e8"/>' +
       '<rect x="0" y="34" width="72" height="3" fill="#8d9099"/><rect x="0" y="37" width="72" height="31" rx="3" fill="#b9bcc6"/><rect x="18" y="41" width="36" height="23" fill="#1c1c22"/><rect x="20" y="43" width="32" height="19" fill="#bfe8a8"/>' +
       '<rect x="4" y="50" width="10" height="3" fill="#44464e"/><rect x="7.5" y="46.5" width="3" height="10" fill="#44464e"/><circle cx="60" cy="52" r="2" fill="#44464e"/><circle cx="66" cy="48" r="2" fill="#44464e"/><circle cx="66" cy="56" r="2" fill="#44464e"/><circle cx="5" cy="40.5" r="1" fill="#3ddc6a"/></g>',
  mame: '<path d="M30 62 L40 34 H180 L190 62 Z" fill="#1a1a20"/><rect x="26" y="58" width="168" height="6" rx="2" fill="#0c0c10"/><path d="M40 34 H180 L176 28 H44 Z" fill="#ff6600"/>' +
        '<rect x="67" y="18" width="4" height="26" fill="#9a9aa2"/><circle cx="69" cy="15" r="9" fill="#e0281e"/><ellipse cx="66" cy="12" rx="3" ry="2" fill="rgba(255,255,255,0.5)"/><ellipse cx="69" cy="45" rx="12" ry="4" fill="#33333a"/>' +
        '<circle cx="112" cy="44" r="7" fill="#f2c21e"/><circle cx="134" cy="40" r="7" fill="#2f8fe0"/><circle cx="156" cy="44" r="7" fill="#3aa84a"/><circle cx="123" cy="55" r="5" fill="#e0e0e6"/><circle cx="145" cy="55" r="5" fill="#e0e0e6"/>',
  lab: '<rect x="40" y="22" width="140" height="40" rx="3" fill="#0f6b4a"/><path d="M52 34h30v10h24M150 30v14h-22M60 54h60" stroke="#3ddc9a" stroke-width="1.5" fill="none"/>' +
       '<rect x="88" y="30" width="34" height="18" rx="1" fill="#16161a"/><path d="M92 30v-3M100 30v-3M108 30v-3M116 30v-3M92 48v3M100 48v3M108 48v3M116 48v3" stroke="#c9c9d2" stroke-width="2"/>' +
       '<circle cx="54" cy="52" r="3" fill="#ff3b2f"/><circle cx="64" cy="52" r="3" fill="#ffd34d"/><circle cx="74" cy="52" r="3" fill="#3ddc6a"/><rect x="140" y="46" width="28" height="10" rx="1" fill="#c9a43a"/><path d="M144 46v10M150 46v10M156 46v10M162 46v10" stroke="#8a6d1a" stroke-width="1"/>' +
       '<rect x="150" y="14" width="18" height="10" rx="1" fill="#26262c"/>'
};
var consoleEl = el('div', 'crt-console');
(function() { var tv = document.querySelector('.crt-tv'); if (tv) tv.appendChild(consoleEl); })();
window.grSetConsole = setConsole;      // handy for previewing: grSetConsole('n64')
function setConsole(sys) {
  var art = CONSOLE_ART[sys];
  consoleEl.style.display = art ? 'block' : 'none';
  if (art) consoleEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 70" role="img" aria-label="' + ((SYSTEMS[sys] || {}).label || sys) + ' console"><ellipse cx="110" cy="64" rx="96" ry="5" fill="rgba(0,0,0,0.45)"/>' + art + '</svg>';
}

var baseOpenGame = openGame;
window.openGame = openGame = function(game) {
  if (isOverLimit()) return baseOpenGame(game);
  cur = { sys: currentSystem, title: game.title, key: gameKey(currentSystem, game.title) };
  padSent = [];
  setConsole(currentSystem);
  baseOpenGame(game);
  if (game.file) addRecent(currentSystem, game.title);
};

// ---------------------------------------------------------------- controllers
// Game Room reads the controller itself and presses the emulator's buttons, so it does not depend on the emulator's own gamepad setup.
var RP = { B: 0, Y: 1, SELECT: 2, START: 3, UP: 4, DOWN: 5, LEFT: 6, RIGHT: 7, A: 8, X: 9, L: 10, R: 11, L2: 12, R2: 13, L3: 14, R3: 15 };
var RP_NAMES = ['B', 'Y', 'SELECT', 'START', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'A', 'X', 'L', 'R', 'L2', 'R2', 'L3', 'R3'];
var STD = { 0: 0, 1: 8, 2: 1, 3: 9, 4: 10, 5: 11, 6: 12, 7: 13, 8: 2, 9: 3, 10: 14, 11: 15, 12: 4, 13: 5, 14: 6, 15: 7 };   // standard-layout button -> RetroPad (by position, like an SNES pad)
var WIZ = [['UP', 'D-PAD UP'], ['DOWN', 'D-PAD DOWN'], ['LEFT', 'D-PAD LEFT'], ['RIGHT', 'D-PAD RIGHT'], ['A', 'A  (right button)'], ['B', 'B  (bottom button)'], ['X', 'X  (top button)'], ['Y', 'Y  (left button)'], ['L', 'L  (left shoulder)'], ['R', 'R  (right shoulder)'], ['START', 'START'], ['SELECT', 'SELECT']];
var padSent = [];                 // per player: last values sent to the emulator
var padMaps = jget('grPadMaps', {});
var bridgeOn = lsGet('grPadBridge') !== 'off';
var wiz = null;

function pads() {
  var out = [];
  try { var g = navigator.getGamepads ? navigator.getGamepads() : []; for (var i = 0; i < g.length; i++) if (g[i] && g[i].connected) out.push(g[i]); } catch (e) {}
  return out;
}
function pressed(b) { return !!b && (b.pressed || b.value > 0.5); }
function readPad(p) {            // -> array of 24 RetroPad values (0/1 for buttons, 0..0x7fff for sticks)
  var v = new Array(24).fill(0), map = padMaps[p.id], i;
  if (map) {
    for (var r in map) {
      var m = map[r], on = false;
      if (m.t === 'b') on = pressed(p.buttons[m.i]);
      else if (m.t === 'a') on = (p.axes[m.i] || 0) * m.d > 0.5;
      else if (m.t === 'h') on = Math.abs((p.axes[m.i] || 0) - m.v) < 0.15;
      if (on) v[r] = 1;
    }
  } else {
    for (i = 0; i < p.buttons.length && i < 16; i++) if (pressed(p.buttons[i]) && STD[i] !== undefined) v[STD[i]] = 1;
  }
  var ax = p.axes[0] || 0, ay = p.axes[1] || 0, bx = p.axes[2] || 0, by = p.axes[3] || 0;
  if (!map || p.mapping === 'standard') {
    if (cur && cur.sys === 'n64') {
      var dz = function(a) { return Math.abs(a) < 0.15 ? 0 : Math.min(1, Math.abs(a)); };
      v[16] = ax > 0 ? Math.round(dz(ax) * 0x7fff) : 0; v[17] = ax < 0 ? Math.round(dz(ax) * 0x7fff) : 0;
      v[18] = ay > 0 ? Math.round(dz(ay) * 0x7fff) : 0; v[19] = ay < 0 ? Math.round(dz(ay) * 0x7fff) : 0;
      v[20] = bx > 0.5 ? 0x7fff : 0; v[21] = bx < -0.5 ? 0x7fff : 0; v[22] = by > 0.5 ? 0x7fff : 0; v[23] = by < -0.5 ? 0x7fff : 0;
    } else {                     // every other system: the left stick works as a D-pad too
      if (ax > 0.5) v[RP.RIGHT] = 1; if (ax < -0.5) v[RP.LEFT] = 1;
      if (ay > 0.5) v[RP.DOWN] = 1; if (ay < -0.5) v[RP.UP] = 1;
    }
  }
  return v;
}
function takeOverGamepads() {    // stop the emulator's own gamepad reader so buttons are not pressed twice
  try { if (bridgeOn && emu() && emu().gamepad) emu().gamepad.getGamepads = function() { return []; }; } catch (e) {}
}
function padLoop() {
  requestAnimationFrame(padLoop);
  var list = pads();
  $('gr-pad').classList.toggle('on', list.length > 0);
  var panelOpen = padModal.classList.contains('active');
  if (wiz) { wizardStep(list); if (panelOpen) drawPads(list); return; }
  var canSend = bridgeOn && onPlaying() && emuRunning() && !anyModalOpen();
  for (var n = 0; n < list.length && n < 4; n++) {
    var v = readPad(list[n]);
    if (canSend) {
      var last = padSent[n] || (padSent[n] = new Array(24).fill(0));
      for (var i = 0; i < 24; i++) if (v[i] !== last[i]) { try { emu().gameManager.simulateInput(n, i, v[i]); } catch (e) {} last[i] = v[i]; }
    }
    list[n]._v = v;
  }
  if (panelOpen) drawPads(list);
}

var padModal = modal('pad-modal', '<h2>&#127918; CONTROLLER</h2>' +
  '<p>Game Room finds a controller the moment you <b>press any button on it</b> with this page open.</p>' +
  '<div id="pad-list"></div><div id="pad-wizard"></div>' +
  '<details style="margin:6px 0 14px;"><summary style="cursor:pointer;color:#ffdc00;font-size:12px;letter-spacing:2px;">HOW TO CONNECT AN 8BITDO SN30 PRO TO A MAC</summary>' +
  '<ol class="pad-steps" style="margin-top:12px;">' +
  '<li>Turn the controller off (hold <b>START</b> for 3 seconds).</li>' +
  '<li>Hold <b>START + A</b> until the lights blink - that is Mac mode. (If that does not work, try <b>START + Y</b>, Switch mode.) Do not use START + X: that is Windows mode and does not work over Bluetooth on a Mac.</li>' +
  '<li>Hold the small <b>PAIR</b> button on top for 3 seconds until the lights race.</li>' +
  '<li>On the Mac open <b>System Settings &rarr; Bluetooth</b> and connect the controller (it shows up as "Wireless Controller" or "Pro Controller").</li>' +
  '<li>Come back to this Chrome window and press any button. The dot next to CONTROLLER turns green.</li>' +
  '<li>If the mode was wrong before: in Bluetooth settings click the (i) next to the old entry, choose <b>Forget This Device</b>, and start again from step 1.</li></ol>' +
  '<p style="font-size:12px;">A USB-C cable also works and is the quickest test: plug it in, press a button.</p></details>' +
  '<div class="gr-actions"><button type="button" class="gr-btn ghost small" id="pad-setup">SET UP BUTTONS</button><button type="button" class="gr-btn ghost small" id="pad-reset">RESET BUTTONS</button>' +
  '<button type="button" class="gr-btn ghost small" id="pad-bridge"></button><button type="button" class="gr-btn" id="pad-close">DONE</button></div>');
function bridgeLabel() { $('pad-bridge').textContent = bridgeOn ? 'GAME ROOM CONTROLS: ON' : 'GAME ROOM CONTROLS: OFF'; }
bridgeLabel();
$('pad-bridge').onclick = function() { bridgeOn = !bridgeOn; lsSet('grPadBridge', bridgeOn ? 'on' : 'off'); bridgeLabel(); toast(bridgeOn ? 'GAME ROOM READS THE CONTROLLER' : 'THE EMULATOR READS THE CONTROLLER - RELOAD THE GAME'); };
$('gr-pad').onclick = function() { try { exitFullscreenIfNeeded(); } catch (e) {} pauseEmu(); padModal.classList.add('active'); };
$('pad-close').onclick = function() { wiz = null; $('pad-wizard').style.display = 'none'; padModal.classList.remove('active'); padSent = []; resumeEmu(); };
$('pad-reset').onclick = function() { pads().forEach(function(p) { delete padMaps[p.id]; }); jset('grPadMaps', padMaps); toast('BUTTONS RESET'); };
$('pad-setup').onclick = function() {
  var list = pads();
  if (!list.length) { toast('PRESS A BUTTON ON THE CONTROLLER FIRST'); return; }
  wiz = { id: list[0].id, step: 0, map: {}, rest: Array.prototype.slice.call(list[0].axes), wait: true, used: {} };
  $('pad-wizard').style.display = 'block';
  showWizard();
};
function showWizard() {
  var w = $('pad-wizard');
  if (wiz.step >= WIZ.length) {
    padMaps[wiz.id] = wiz.map; jset('grPadMaps', padMaps);
    wiz = null; w.style.display = 'none'; toast('CONTROLLER SET UP!');
    return;
  }
  w.innerHTML = 'PRESS<br><b>' + WIZ[wiz.step][1] + '</b><br><span style="font-size:12px;color:#9a9aa8;">' + (wiz.step + 1) + ' of ' + WIZ.length + ' &nbsp; <a href="#" id="wiz-skip" style="color:#ffdc00;">skip this one</a></span>';
  $('wiz-skip').onclick = function(e) { e.preventDefault(); wiz.step++; wiz.wait = true; showWizard(); };
}
function wizardStep(list) {
  var p = null, i;
  for (i = 0; i < list.length; i++) if (list[i].id === wiz.id) p = list[i];
  if (!p) return;
  var found = null;
  for (i = 0; i < p.buttons.length; i++) if (pressed(p.buttons[i])) found = { t: 'b', i: i };
  if (!found) for (i = 0; i < p.axes.length; i++) {
    var a = p.axes[i], rest = wiz.rest[i] || 0;
    if (Math.abs(rest) > 1.1) { if (Math.abs(a - rest) > 0.3) found = { t: 'h', i: i, v: Math.round(a * 100) / 100 }; }   // "hat" D-pad
    else if (Math.abs(a) > 0.7) found = { t: 'a', i: i, d: a > 0 ? 1 : -1 };
  }
  if (wiz.wait) { if (!found) wiz.wait = false; return; }      // wait until everything is let go
  if (!found) return;
  var sig = JSON.stringify(found);
  if (wiz.used[sig]) return;
  wiz.used[sig] = 1;
  wiz.map[RP[WIZ[wiz.step][0]]] = found;
  wiz.step++; wiz.wait = true;
  showWizard();
}
function drawPads(list) {
  var box = $('pad-list');
  if (!list.length) { if (box.dataset.n !== '0') { box.dataset.n = '0'; box.innerHTML = '<div class="pad-card"><div class="pid">No controller found yet.</div><div class="pmap odd">PRESS ANY BUTTON ON IT, WITH THIS WINDOW IN FRONT</div></div>'; } return; }
  var sig = list.map(function(p) { return p.id; }).join('|');
  if (box.dataset.n !== sig) {
    box.dataset.n = sig; box.innerHTML = '';
    list.forEach(function(p, n) {
      var c = el('div', 'pad-card');
      var std = p.mapping === 'standard', custom = !!padMaps[p.id];
      c.innerHTML = '<div class="pid"></div><div class="pmap ' + (std || custom ? 'ok' : 'odd') + '"></div><div class="pad-keys">' +
        ['UP', 'DOWN', 'LEFT', 'RIGHT', 'A', 'B', 'X', 'Y', 'L', 'R', 'START', 'SELECT'].map(function(k) { return '<i data-k="' + RP[k] + '">' + k + '</i>'; }).join('') + '</div><div class="pad-raw"></div>';
      c.querySelector('.pid').textContent = 'PLAYER ' + (n + 1) + ': ' + p.id;
      c.querySelector('.pmap').textContent = custom ? 'USING YOUR BUTTON SETUP' : std ? 'STANDARD LAYOUT - READY TO PLAY' : 'UNUSUAL LAYOUT - PRESS "SET UP BUTTONS" BELOW';
      box.appendChild(c);
    });
  }
  list.forEach(function(p, n) {
    var c = box.children[n]; if (!c) return;
    var v = p._v || readPad(p), keys = c.querySelectorAll('.pad-keys i');
    for (var i = 0; i < keys.length; i++) keys[i].classList.toggle('down', !!v[+keys[i].dataset.k]);
    var raw = [];
    for (var b = 0; b < p.buttons.length; b++) if (pressed(p.buttons[b])) raw.push('button ' + b);
    for (var a = 0; a < p.axes.length; a++) if (Math.abs(p.axes[a]) > 0.5 && Math.abs(p.axes[a]) <= 1.05) raw.push('axis ' + a + (p.axes[a] > 0 ? '+' : '-'));
    c.querySelector('.pad-raw').textContent = raw.length ? 'The browser sees: ' + raw.join(', ') : '';
  });
}
window.addEventListener('gamepadconnected', function(e) { toast('CONTROLLER CONNECTED'); takeOverGamepads(); });
window.addEventListener('gamepaddisconnected', function() { toast('CONTROLLER DISCONNECTED'); padSent = []; });
requestAnimationFrame(padLoop);

// ---------------------------------------------------------------- site-wide season effects
var SEASON_LOOK = {
  newyear:      { name: 'HAPPY NEW YEAR',   color: '#ffd34d', kind: 'confetti', cols: ['#ffd34d', '#ff5a8a', '#3bd1ff', '#ffffff'], burst: true },
  winter:       { name: 'WINTER',           color: '#8ec8ff', kind: 'snow' },
  valentine:    { name: "VALENTINE'S",      color: '#ff5a96', kind: 'glyph', glyphs: ['♥'], cols: ['#ff4d7e', '#ff8fb0', '#ffd0de'], rise: true },
  stpatrick:    { name: "ST. PATRICK'S",    color: '#3ddc6a', kind: 'glyph', glyphs: ['☘'], cols: ['#1fa44a', '#4cc86a', '#ffd34d'] },
  spring:       { name: 'SPRING',           color: '#ff9fd0', kind: 'petal', cols: ['#ffb7d9', '#ffd6ea', '#fff0a8'] },
  summer:       { name: 'SUMMER',           color: '#ffc828', kind: 'firefly' },
  july4:        { name: 'JULY 4TH',         color: '#ff5a64', kind: 'confetti', cols: ['#d42a3a', '#ffffff', '#3b6cff'], burst: true },
  fall:         { name: 'FALL',             color: '#ff8c2a', kind: 'leaf', cols: ['#d9531e', '#f2b01e', '#a8301c', '#c8862b'] },
  halloween:    { name: 'HALLOWEEN',        color: '#ff7a00', kind: 'bat' },
  thanksgiving: { name: 'THANKSGIVING',     color: '#e6961e', kind: 'leaf', cols: ['#c8372d', '#e8741c', '#f2b01e', '#8a5a2b'] },
  christmas:    { name: 'MERRY CHRISTMAS',  color: '#ff4040', kind: 'snow' }
};
var seasonId = (function() {
  var forced = null;
  try { forced = new URLSearchParams(location.search).get('season'); } catch (e) {}
  return (forced && SEASON_LOOK[forced]) ? forced : seasonFor(new Date());
})();
var look = SEASON_LOOK[seasonId] || SEASON_LOOK.winter;
document.body.setAttribute('data-season', seasonId);
document.documentElement.style.setProperty('--season', look.color);
$('gr-season').textContent = '✦ ' + look.name + ' ✦';

(function seasonFx() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = fx.getContext('2d'), W = 0, H = 0, parts = [], bursts = [], last = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function size() { W = innerWidth; H = innerHeight; fx.width = W * dpr; fx.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function spawn(p, fresh) {
    var up = look.rise || look.kind === 'firefly';
    p.x = rnd(0, W); p.y = fresh ? rnd(0, H) : (up ? H + 20 : -20);
    p.z = rnd(0.4, 1);                                     // depth: size, speed and brightness
    p.vy = (up ? -1 : 1) * rnd(14, 38) * p.z * (look.kind === 'snow' ? 1.2 : look.kind === 'bat' ? 0.5 : 1);
    p.vx = rnd(-12, 12); p.ph = rnd(0, 6.28); p.rot = rnd(0, 6.28); p.vr = rnd(-1.4, 1.4);
    p.col = look.cols ? pick(look.cols) : '#fff'; p.g = look.glyphs ? pick(look.glyphs) : '';
    if (look.kind === 'bat') { p.vx = rnd(30, 70) * (Math.random() < 0.5 ? -1 : 1) * p.z; p.y = fresh ? rnd(0, H * 0.7) : rnd(0, H * 0.6); p.x = fresh ? rnd(0, W) : (p.vx > 0 ? -30 : W + 30); p.vy = 0; }
    return p;
  }
  var count = look.kind === 'bat' ? 9 : look.kind === 'firefly' ? 26 : 46;
  for (var i = 0; i < count; i++) parts.push(spawn({}, true));
  function leafPath(s) { ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.8, s * 0.5, 0, s); ctx.bezierCurveTo(-s * 0.8, s * 0.5, -s * 0.9, -s * 0.6, 0, -s); ctx.fill(); }
  function draw(p, t) {
    var a = 0.35 + p.z * 0.5, s;
    ctx.save(); ctx.translate(p.x, p.y);
    if (look.kind === 'snow') { ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 1.2 + p.z * 2.6, 0, 6.28); ctx.fill(); }
    else if (look.kind === 'confetti') { ctx.rotate(p.rot); ctx.globalAlpha = a; ctx.fillStyle = p.col; s = 3 + p.z * 5; ctx.fillRect(-s / 2, -s / 4 * Math.cos(t * 3 + p.ph), s, s / 2 * Math.cos(t * 3 + p.ph) + 1); }
    else if (look.kind === 'glyph') { ctx.rotate(Math.sin(t + p.ph) * 0.4); ctx.globalAlpha = a; ctx.fillStyle = p.col; ctx.font = Math.round(10 + p.z * 16) + 'px serif'; ctx.textAlign = 'center'; ctx.fillText(p.g, 0, 0); }
    else if (look.kind === 'petal') { ctx.rotate(p.rot); ctx.globalAlpha = a; ctx.fillStyle = p.col; ctx.scale(1, 0.6 + 0.4 * Math.sin(t * 2 + p.ph)); leafPath(3 + p.z * 5); }
    else if (look.kind === 'leaf') { ctx.rotate(p.rot); ctx.globalAlpha = a; ctx.fillStyle = p.col; ctx.scale(0.5 + 0.5 * Math.abs(Math.sin(t * 1.5 + p.ph)), 1); leafPath(5 + p.z * 8); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-0.6, -(5 + p.z * 8), 1.2, (5 + p.z * 8) * 2); }
    else if (look.kind === 'firefly') { var glow = 0.5 + 0.5 * Math.sin(t * 2 + p.ph); ctx.globalAlpha = a * glow; var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 10 * p.z + 4); g.addColorStop(0, 'rgba(255,240,140,1)'); g.addColorStop(1, 'rgba(255,240,140,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 10 * p.z + 4, 0, 6.28); ctx.fill(); }
    else if (look.kind === 'bat') { s = 8 + p.z * 12; var flap = Math.sin(t * 12 + p.ph) * 0.6; ctx.globalAlpha = 0.5 + p.z * 0.4; ctx.fillStyle = '#1a0f24'; ctx.strokeStyle = 'rgba(255,122,0,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.22, s * 0.3, 0, 0, 6.28); ctx.fill();
      for (var d = -1; d <= 1; d += 2) { ctx.beginPath(); ctx.moveTo(0, -s * 0.1); ctx.quadraticCurveTo(d * s * 0.6, -s * (0.7 + flap), d * s, -s * 0.1 * flap); ctx.quadraticCurveTo(d * s * 0.7, s * 0.1, d * s * 0.5, s * 0.25); ctx.quadraticCurveTo(d * s * 0.3, 0, 0, s * 0.15); ctx.fill(); ctx.stroke(); } }
    ctx.restore();
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || now - last < 33) return;
    var dt = Math.min((now - last) / 1000, 0.1), t = now / 1000; last = now;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += (p.vx + Math.sin(t * 0.8 + p.ph) * 14) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (look.kind === 'bat') p.y += Math.sin(t * 2 + p.ph) * 18 * dt;
      if (p.y > H + 30 || p.y < -40 || p.x < -50 || p.x > W + 50) spawn(p, false);
      draw(p, t);
    }
    if (look.burst) {
      if (Math.random() < 0.012 && bursts.length < 3) bursts.push({ x: rnd(W * 0.1, W * 0.9), y: rnd(H * 0.12, H * 0.5), age: 0, col: pick(look.cols), n: 16 + Math.floor(rnd(0, 10)) });
      for (var b = bursts.length - 1; b >= 0; b--) {
        var u = bursts[b]; u.age += dt;
        if (u.age > 1.6) { bursts.splice(b, 1); continue; }
        var r = 90 * (1 - Math.pow(1 - u.age / 1.6, 3));
        ctx.globalAlpha = Math.max(0, 1 - u.age / 1.6) * 0.8; ctx.fillStyle = u.col;
        for (var k = 0; k < u.n; k++) { var ang = k / u.n * 6.283; ctx.beginPath(); ctx.arc(u.x + Math.cos(ang) * r, u.y + Math.sin(ang) * r + u.age * u.age * 18, 2, 0, 6.28); ctx.fill(); }
        ctx.globalAlpha = 1;
      }
    }
  }
  requestAnimationFrame(frame);
})();
})();
