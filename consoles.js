// Game Room: drawings of each console, shown in front of the TV while you play (used by gr4.js).
// Every drawing uses the same canvas, 420 x 156 units where 1 unit = 1 millimetre of the real machine, floor at y = 152.
// So an NES is 256 wide and a Game Boy is 90 wide: the sizes relative to each other are the real ones.
(function() {
function T(x, y, size, fill, txt, extra) { return '<text x="' + x + '" y="' + y + '" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="' + size + '" fill="' + fill + '"' + (extra || '') + '>' + txt + '</text>'; }
function shadow(cx, rx) { return '<ellipse cx="' + cx + '" cy="152" rx="' + rx + '" ry="4.5" fill="rgba(0,0,0,0.5)"/>'; }
var CABLE_AV = '<path d="M120 74 C118 44 150 36 150 -8" fill="none" stroke="#0c0c0c" stroke-width="4.5" stroke-linecap="round"/><path d="M120 74 C118 44 150 36 150 -8" fill="none" stroke="#3a3a3a" stroke-width="1.2"/>';
function padCable(d) { return '<path d="' + d + '" fill="none" stroke="#17171a" stroke-width="2.6" stroke-linecap="round"/>'; }

var ART = {};

// ------------------------------------------------------------------ NES + controller
ART.nes = CABLE_AV + shadow(136, 136) + shadow(350, 66) +
  '<path d="M22 62 H250 L264 88 H8 Z" fill="#e6e3dc"/>' +                                   // top
  '<path d="M30 66 H168 L174 84 H22 Z" fill="#d4d1c9"/><path d="M29 70h141M27 74h143M25 78h146M24 82h148" stroke="#bcb9b1" stroke-width="1"/>' +
  '<path d="M186 68h54M188 72h54M190 76h54M192 80h54" stroke="#c4c1b9" stroke-width="1.6"/>' +
  '<rect x="8" y="88" width="256" height="22" fill="#dcd9d2"/><rect x="8" y="88" width="256" height="2" fill="#f2f0ea"/>' +   // front, upper
  '<rect x="16" y="92" width="152" height="16" rx="1" fill="#cbc8c0"/><rect x="16" y="106" width="152" height="2" fill="#a9a69e"/>' +
  T(22, 103, 7.5, '#c0281e', 'Nintendo', ' font-style="italic"') + T(64, 103, 4.4, '#55534e', 'ENTERTAINMENT SYSTEM') +
  '<rect x="8" y="110" width="256" height="6" fill="#1b1b1e"/>' +
  '<rect x="8" y="116" width="256" height="36" fill="#8f8c86"/><rect x="8" y="148" width="256" height="4" fill="#76736e"/>' +   // front, lower
  '<rect x="18" y="121" width="78" height="24" rx="2" fill="#1b1b1e"/><circle cx="26" cy="133" r="3" fill="#ff3b2f"/><circle cx="26" cy="133" r="5" fill="rgba(255,59,47,0.25)"/>' +
  '<rect x="34" y="125" width="26" height="16" rx="1" fill="#b3261e"/><rect x="64" y="125" width="26" height="16" rx="1" fill="#b3261e"/>' + T(36.5, 135, 4.2, '#f4dcd8', 'POWER') + T(67, 135, 4.2, '#f4dcd8', 'RESET') +
  '<rect x="150" y="121" width="42" height="24" rx="2" fill="#1b1b1e"/><rect x="206" y="121" width="42" height="24" rx="2" fill="#1b1b1e"/>' +
  '<path d="M158 129h26v9h-20z" fill="#3a3a40"/><path d="M214 129h26v9h-20z" fill="#3a3a40"/><path d="M161 132h20M163 135h18M217 132h20M219 135h18" stroke="#8a8a92" stroke-width="1.2" stroke-dasharray="1.6 2.2"/>' +
  padCable('M348 100 C342 78 298 82 286 112 C278 132 222 150 176 136') +
  '<rect x="288" y="98" width="124" height="54" rx="3" fill="#dcd9d2"/><rect x="288" y="148" width="124" height="4" rx="2" fill="#b9b6ae"/>' +   // controller
  '<rect x="293" y="106" width="114" height="40" rx="2" fill="#1b1b1e"/><rect x="293" y="106" width="114" height="5" fill="#8f8c86"/>' +
  '<rect x="300" y="122" width="24" height="8" rx="1" fill="#34343a"/><rect x="308" y="114" width="8" height="24" rx="1" fill="#34343a"/><circle cx="312" cy="126" r="2.4" fill="#1b1b1e"/>' +
  '<rect x="332" y="116" width="36" height="6" rx="1" fill="#8f8c86"/><rect x="332" y="126" width="36" height="12" rx="2" fill="#dcd9d2"/><rect x="336" y="129.5" width="12" height="5" rx="2.5" fill="#1b1b1e"/><rect x="352" y="129.5" width="12" height="5" rx="2.5" fill="#1b1b1e"/>' +
  T(333.5, 121, 3.4, '#c0281e', 'SELECT') + T(352.5, 121, 3.4, '#c0281e', 'START') +
  '<rect x="372" y="121" width="14" height="14" rx="2" fill="#dcd9d2"/><rect x="389" y="121" width="14" height="14" rx="2" fill="#dcd9d2"/><circle cx="379" cy="128" r="5.6" fill="#c0281e"/><circle cx="396" cy="128" r="5.6" fill="#c0281e"/>' +
  T(377, 142, 4.2, '#c0281e', 'B') + T(394, 142, 4.2, '#c0281e', 'A') + T(376, 115, 4.6, '#c0281e', 'Nintendo', ' font-style="italic"');

// ------------------------------------------------------------------ SNES + controller
ART.snes = CABLE_AV + shadow(132, 130) + shadow(350, 66) +
  '<path d="M34 78 H230 Q240 78 244 86 L252 100 H12 L20 86 Q24 78 34 78 Z" fill="#dad7e2"/>' +     // top
  '<path d="M82 82 H182 L186 94 H78 Z" fill="#33313b"/><path d="M90 85 H174 L176 91 H88 Z" fill="#15141a"/>' +
  '<rect x="34" y="84" width="34" height="11" rx="2" fill="#7458c2"/><rect x="196" y="84" width="34" height="11" rx="2" fill="#7458c2"/><rect x="38" y="86" width="12" height="7" rx="1" fill="#8f76d6"/><rect x="212" y="86" width="12" height="7" rx="1" fill="#8f76d6"/>' +
  T(36, 82.5, 3.6, '#6b6878', 'POWER') + T(199, 82.5, 3.6, '#6b6878', 'RESET') + '<rect x="114" y="95.5" width="36" height="4" rx="2" fill="#a9a6b5"/>' +
  '<rect x="12" y="100" width="240" height="52" rx="5" fill="#cbc8d4"/><rect x="12" y="100" width="240" height="3" fill="#e9e7ef"/>' +   // front
  '<path d="M12 126 H252 V147 Q252 152 247 152 H17 Q12 152 12 147 Z" fill="#aeabba"/>' +
  '<rect x="36" y="130" width="116" height="18" rx="4" fill="#6f6c7b"/><rect x="43" y="133" width="46" height="12" rx="3" fill="#24232b"/><rect x="99" y="133" width="46" height="12" rx="3" fill="#24232b"/>' +
  '<path d="M49 139h34M105 139h34" stroke="#77748a" stroke-width="1.6" stroke-dasharray="2 3"/>' +
  T(164, 118, 6.4, '#4c4a57', 'SUPER NINTENDO', ' font-style="italic"') + T(164, 124.5, 3.4, '#6b6878', 'ENTERTAINMENT SYSTEM') +
  '<circle cx="238" cy="139" r="2.6" fill="#ff3b2f"/><circle cx="238" cy="139" r="4.6" fill="rgba(255,59,47,0.25)"/>' +
  padCable('M350 104 C346 82 300 86 286 114 C276 134 150 152 122 142') +
  '<rect x="318" y="100" width="64" height="6" rx="3" fill="#b3b0bf"/>' +                                           // controller
  '<rect x="288" y="104" width="124" height="48" rx="24" fill="#d3d0dc"/><rect x="312" y="104" width="76" height="40" fill="#d3d0dc"/>' +
  '<circle cx="312" cy="128" r="21" fill="#c6c3d0"/><circle cx="388" cy="128" r="22" fill="#b8b5c4"/>' +
  '<rect x="300" y="124" width="24" height="8" rx="1.5" fill="#33313b"/><rect x="308" y="116" width="8" height="24" rx="1.5" fill="#33313b"/>' +
  '<rect x="336" y="127" width="12" height="4.5" rx="2.2" fill="#55525f" transform="rotate(-32 342 129)"/><rect x="352" y="127" width="12" height="4.5" rx="2.2" fill="#55525f" transform="rotate(-32 358 129)"/>' +
  T(333, 140, 3, '#77748a', 'SELECT') + T(352, 140, 3, '#77748a', 'START') +
  '<circle cx="388" cy="116" r="5.6" fill="#b3a5e6"/><circle cx="376" cy="128" r="5.6" fill="#b3a5e6"/><circle cx="400" cy="128" r="5.6" fill="#6a4fc4"/><circle cx="388" cy="140" r="5.6" fill="#6a4fc4"/>' +
  T(386.3, 117.6, 4, '#fff', 'X') + T(374.3, 129.6, 4, '#fff', 'Y') + T(398.4, 129.6, 4, '#fff', 'A') + T(386.4, 141.6, 4, '#fff', 'B');

// ------------------------------------------------------------------ Genesis (model 1) + controller
ART.genesis = CABLE_AV + shadow(140, 146) + shadow(350, 66) +
  '<path d="M34 80 H246 Q254 80 258 86 L272 106 H8 L22 86 Q26 80 34 80 Z" fill="#23232a"/>' +     // top
  '<ellipse cx="140" cy="92" rx="66" ry="11" fill="#2d2d35" stroke="#44444e" stroke-width="1.4"/><ellipse cx="140" cy="92" rx="52" ry="8" fill="none" stroke="#3a3a44" stroke-width="1"/>' +
  '<rect x="108" y="87.5" width="64" height="9" rx="2" fill="#09090b"/>' + T(86, 103, 4.2, '#c9c9d2', '16-BIT', ' font-style="italic"') +
  '<rect x="36" y="88" width="20" height="7" rx="1.5" fill="#e6e6ec"/><rect x="38" y="89.5" width="8" height="4" fill="#9a9aa4"/>' + T(35, 86, 3.4, '#8d8d98', 'POWER') +
  '<rect x="226" y="88" width="16" height="7" rx="1.5" fill="#e6e6ec"/>' + T(224, 86, 3.4, '#8d8d98', 'RESET') +
  '<rect x="8" y="106" width="264" height="46" rx="3" fill="#18181d"/><rect x="8" y="106" width="264" height="2.5" fill="#34343d"/><rect x="8" y="146" width="264" height="6" rx="3" fill="#0b0b0e"/>' +   // front
  T(20, 124, 10, '#f2f2f6', 'SEGA', ' font-style="italic"') + T(52, 124, 10, '#f2f2f6', 'GENESIS', ' font-style="italic"') + '<rect x="20" y="128" width="88" height="2.2" fill="#c8281e"/>' +
  '<circle cx="24" cy="138" r="2.6" fill="#ff3b2f"/><circle cx="24" cy="138" r="4.6" fill="rgba(255,59,47,0.25)"/><rect x="34" y="135.5" width="34" height="5" rx="2.5" fill="#2e2e36"/><rect x="44" y="134" width="8" height="8" rx="1.5" fill="#9a9aa4"/>' +
  '<circle cx="80" cy="138" r="3" fill="#050506" stroke="#55555e" stroke-width="1"/>' +
  '<path d="M146 122 H186 L182 140 H150 Z" fill="#050506" stroke="#44444e" stroke-width="1"/><path d="M206 122 H246 L242 140 H210 Z" fill="#050506" stroke="#44444e" stroke-width="1"/>' +
  '<path d="M153 128h26M155 134h22M213 128h26M215 134h22" stroke="#8a8a92" stroke-width="1.4" stroke-dasharray="1.6 3"/>' + T(150, 119, 3.2, '#8d8d98', 'CONTROL 1') + T(210, 119, 3.2, '#8d8d98', 'CONTROL 2') +
  padCable('M350 104 C346 84 302 88 290 116 C282 136 206 154 170 138') +
  '<path d="M290 116 Q296 100 350 104 Q404 100 410 116 Q418 146 398 152 Q380 153 372 138 H328 Q320 153 302 152 Q282 146 290 116 Z" fill="#202027"/>' +   // controller
  '<path d="M294 116 Q300 105 350 108 Q400 105 406 116" fill="none" stroke="#3a3a44" stroke-width="1.4"/>' +
  '<circle cx="314" cy="126" r="15" fill="#2c2c34"/><rect x="302" y="122.5" width="24" height="7" rx="1.5" fill="#55555f"/><rect x="310.5" y="114" width="7" height="24" rx="1.5" fill="#55555f"/>' +
  '<rect x="344" y="113" width="14" height="5" rx="2.5" fill="#55555f"/>' + T(343.5, 124, 3, '#8d8d98', 'START') +
  '<circle cx="370" cy="134" r="6.4" fill="#34343c" stroke="#55555f" stroke-width="1"/><circle cx="385" cy="127" r="6.4" fill="#34343c" stroke="#55555f" stroke-width="1"/><circle cx="399" cy="119" r="6.4" fill="#34343c" stroke="#55555f" stroke-width="1"/>' +
  T(368.4, 135.6, 4.2, '#d6d6de', 'A') + T(383.4, 128.6, 4.2, '#d6d6de', 'B') + T(397.4, 120.6, 4.2, '#d6d6de', 'C') + T(334, 147, 3.6, '#c8281e', 'SEGA', ' font-style="italic"');

// ------------------------------------------------------------------ Nintendo 64 + controller
ART.n64 = CABLE_AV + shadow(138, 140) + shadow(354, 66) +
  '<path d="M18 104 Q20 82 56 78 Q88 62 138 62 Q188 62 220 78 Q256 82 258 104 Z" fill="#383840"/>' +     // top
  '<path d="M30 96 Q38 84 62 82 M246 96 Q238 84 214 82" fill="none" stroke="#4a4a54" stroke-width="2"/>' +
  '<rect x="100" y="68" width="76" height="13" rx="4" fill="#111114"/><rect x="106" y="71" width="64" height="7" rx="2" fill="#26262c"/>' +
  '<rect x="108" y="85" width="60" height="10" rx="3" fill="#2a2a31" stroke="#4a4a54" stroke-width="0.8"/><path d="M116 88h44M116 91.5h44" stroke="#4a4a54" stroke-width="1"/>' +
  '<rect x="52" y="87" width="26" height="8" rx="2" fill="#17171b"/><rect x="54" y="88.5" width="11" height="5" rx="1" fill="#55555f"/><rect x="198" y="87" width="26" height="8" rx="2" fill="#17171b"/><rect x="211" y="88.5" width="11" height="5" rx="1" fill="#55555f"/>' +
  T(53, 85, 3.2, '#8d8d98', 'POWER') + T(201, 85, 3.2, '#8d8d98', 'RESET') +
  '<path d="M12 148 Q8 104 18 104 H258 Q268 104 264 148 Q264 152 258 152 H18 Q12 152 12 148 Z" fill="#2d2d34"/><path d="M18 104 H258" stroke="#4a4a54" stroke-width="2"/>' +     // front
  '<g fill="#0c0c0f" stroke="#4a4a54" stroke-width="1"><rect x="26" y="118" width="38" height="24" rx="8"/><rect x="72" y="118" width="38" height="24" rx="8"/><rect x="166" y="118" width="38" height="24" rx="8"/><rect x="212" y="118" width="38" height="24" rx="8"/></g>' +
  '<g fill="#3a3a44"><rect x="36" y="126" width="18" height="8" rx="2"/><rect x="82" y="126" width="18" height="8" rx="2"/><rect x="176" y="126" width="18" height="8" rx="2"/><rect x="222" y="126" width="18" height="8" rx="2"/></g>' +
  '<path d="M126 112 l8 -4 l8 4 v10 l-8 4 l-8 -4 Z" fill="#e03a2f"/><path d="M134 108 l8 4 v10 l-8 4 Z" fill="#2f8fe0"/><path d="M126 112 l8 4 l8 -4" fill="none" stroke="#f2c21e" stroke-width="2"/><path d="M134 116 v10" stroke="#3aa84a" stroke-width="2"/>' +
  T(119, 138, 4.4, '#c9c9d2', 'NINTENDO') + T(146.5, 138.4, 6, '#e03a2f', '64') + '<circle cx="138" cy="145" r="2.2" fill="#ff3b2f"/>' +
  padCable('M356 102 C352 84 304 88 292 116 C284 138 110 156 46 140') +
  '<path d="M298 106 Q356 92 414 106 Q422 116 416 148 Q406 156 398 134 Q386 127 374 129 L370 150 Q356 157 342 150 L338 129 Q326 127 314 134 Q306 156 296 148 Q290 116 298 106 Z" fill="#bcbfc8"/>' +   // controller
  '<path d="M302 108 Q356 96 410 108" fill="none" stroke="#e2e4ea" stroke-width="1.6"/>' +
  '<rect x="306" y="114.5" width="22" height="7" rx="1.5" fill="#34343c"/><rect x="313.5" y="107" width="7" height="22" rx="1.5" fill="#34343c"/>' +
  '<circle cx="356" cy="107" r="4" fill="#d6281e"/><circle cx="356" cy="124" r="9" fill="#d6d9e0" stroke="#9a9da6" stroke-width="1"/><circle cx="356" cy="124" r="5.4" fill="#8d9098"/><circle cx="356" cy="124" r="2.4" fill="#6c6f77"/>' +
  '<circle cx="380" cy="124" r="5.4" fill="#3aa84a"/><circle cx="390" cy="131" r="5.4" fill="#2f8fe0"/>' +
  '<circle cx="396" cy="108" r="3.4" fill="#f2c21e"/><circle cx="403" cy="114" r="3.4" fill="#f2c21e"/><circle cx="389" cy="114" r="3.4" fill="#f2c21e"/><circle cx="396" cy="120" r="3.4" fill="#f2c21e"/>' +
  T(378.6, 125.4, 3.6, '#fff', 'B') + T(388.6, 132.4, 3.6, '#fff', 'A');

// ------------------------------------------------------------------ Game Boy + cartridge
function cart(x, y, body, label, title, rot) {
  return '<g transform="rotate(' + rot + ' ' + (x + 28) + ' ' + (y + 32) + ')"><path d="M' + x + ' ' + (y + 4) + ' Q' + x + ' ' + y + ' ' + (x + 4) + ' ' + y + ' H' + (x + 46) + ' L' + (x + 57) + ' ' + (y + 9) + ' V' + (y + 61) + ' Q' + (x + 57) + ' ' + (y + 65) + ' ' + (x + 53) + ' ' + (y + 65) + ' H' + (x + 4) + ' Q' + x + ' ' + (y + 65) + ' ' + x + ' ' + (y + 61) + ' Z" fill="' + body + '"/>' +
    '<path d="M' + (x + 5) + ' ' + (y + 5) + 'h36M' + (x + 5) + ' ' + (y + 8.5) + 'h39M' + (x + 5) + ' ' + (y + 12) + 'h42" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>' +
    '<rect x="' + (x + 6) + '" y="' + (y + 18) + '" width="45" height="40" rx="2" fill="' + label + '"/><rect x="' + (x + 6) + '" y="' + (y + 18) + '" width="45" height="9" rx="2" fill="rgba(255,255,255,0.85)"/>' +
    T(x + 9, y + 25, 5, '#222', title) + '<circle cx="' + (x + 28) + '" cy="' + (y + 42) + '" r="9" fill="rgba(255,255,255,0.3)"/><path d="M' + (x + 18) + ' ' + (y + 54) + 'h21" stroke="rgba(255,255,255,0.6)" stroke-width="2"/></g>';
}
ART.gameboy = shadow(210, 62) + shadow(110, 40) + cart(80, 85, '#b5b3aa', '#2f6fd0', 'GAME PAK', -9) +
  '<path d="M165 8 Q165 4 169 4 H251 Q255 4 255 8 V130 Q255 152 233 152 H169 Q165 152 165 148 Z" fill="#cbc9c0"/>' +
  '<path d="M165 8 Q165 4 169 4 H251 Q255 4 255 8 V12 H165 Z" fill="#dedcd4"/><path d="M165 12 H255" stroke="#a9a79e" stroke-width="1"/><path d="M176 4v8M244 4v8" stroke="#a9a79e" stroke-width="1"/>' +
  '<path d="M172 18 H248 Q251 18 251 21 V66 Q251 78 239 78 H175 Q172 78 172 75 Z" fill="#5d6069"/>' +
  '<path d="M176 23 H186 M234 23 H247" stroke="#8a2a5a" stroke-width="1.2"/><path d="M176 25.5 H186 M234 25.5 H247" stroke="#2a3a8a" stroke-width="1.2"/>' + T(188, 25.5, 2.7, '#c9c9d2', 'DOT MATRIX WITH STEREO SOUND') +
  '<rect x="187" y="29" width="46" height="42" fill="#9bbc0f"/><g fill="#306230"><rect x="191" y="59" width="8" height="8"/><rect x="199" y="59" width="8" height="8"/><rect x="207" y="59" width="8" height="8"/><rect x="199" y="51" width="8" height="8"/><rect x="219" y="43" width="8" height="24"/><rect x="211" y="33" width="8" height="8" opacity="0.7"/></g>' +
  '<circle cx="178.5" cy="44" r="1.8" fill="#ff3b2f"/>' + T(175.5, 50, 2.3, '#c9c9d2', 'BATTERY') +
  T(172, 88, 4.2, '#2a3a8a', 'Nintendo') + T(190, 88, 6.4, '#2a3a8a', 'GAME BOY', ' font-style="italic"') +
  '<circle cx="186" cy="110" r="14" fill="#bdbbb2"/><rect x="173" y="105.75" width="26" height="8.5" rx="1.5" fill="#25252a"/><rect x="181.75" y="97" width="8.5" height="26" rx="1.5" fill="#25252a"/><circle cx="186" cy="110" r="2.6" fill="#3a3a40"/>' +
  '<rect x="205" y="98" width="44" height="19" rx="9.5" fill="#bdbbb2" transform="rotate(-26 227 107.5)"/><circle cx="218" cy="112" r="7.4" fill="#a3215a"/><circle cx="237" cy="103" r="7.4" fill="#a3215a"/>' + T(214, 125, 3.6, '#2a3a8a', 'B') + T(236, 116, 3.6, '#2a3a8a', 'A') +
  '<rect x="190" y="131" width="13" height="4.6" rx="2.3" fill="#77756e" transform="rotate(-26 196.5 133.3)"/><rect x="206" y="131" width="13" height="4.6" rx="2.3" fill="#77756e" transform="rotate(-26 212.5 133.3)"/>' + T(186, 144, 2.8, '#2a3a8a', 'SELECT') + T(204, 144, 2.8, '#2a3a8a', 'START') +
  '<g stroke="#a19f96" stroke-width="2.2" stroke-linecap="round"><path d="M226 144l8 -17M231 146l8 -17M236 147l8 -17M241 146l7 -15M246 143l4 -9"/></g>';

// ------------------------------------------------------------------ Game Boy Color + cartridge
ART.gbc = shadow(210, 56) + shadow(112, 40) + cart(84, 86, '#7a62cc', '#f2b01e', 'GAME PAK', -9) +
  '<path d="M171 23 Q171 19 175 19 H245 Q249 19 249 23 V136 Q249 152 210 152 Q171 152 171 136 Z" fill="#6a4fc4"/><path d="M171 23 Q171 19 175 19 H245 Q249 19 249 23 V26 H171 Z" fill="#8068d6"/>' +
  '<path d="M177 30 H243 V74 Q243 84 210 84 Q177 84 177 74 Z" fill="#1b1b20"/>' +
  '<rect x="188" y="34" width="44" height="40" fill="#8fd6f0"/><rect x="188" y="60" width="44" height="14" fill="#4cb04a"/><circle cx="222" cy="43" r="5" fill="#ffd34d"/><path d="M188 60 l10 -10 l8 6 l9 -12 l17 16 Z" fill="#3f8a3a"/><rect x="202" y="62" width="6" height="8" fill="#e85a5a"/>' +
  '<circle cx="181.5" cy="46" r="1.7" fill="#ff3b2f"/>' + T(190, 81, 3.4, '#e6e6ee', 'GAME BOY') +
  '<text x="212" y="81" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="3.6"><tspan fill="#e85a5a">C</tspan><tspan fill="#b06ae0">O</tspan><tspan fill="#8fd04a">L</tspan><tspan fill="#f2c21e">O</tspan><tspan fill="#4ac0e8">R</tspan></text>' +
  T(197, 92, 3.6, '#c9c2f0', 'Nintendo') +
  '<rect x="179" y="103.75" width="24" height="8.5" rx="1.5" fill="#1b1b20"/><rect x="186.75" y="96" width="8.5" height="24" rx="1.5" fill="#1b1b20"/><circle cx="191" cy="108" r="2.4" fill="#34343c"/>' +
  '<circle cx="222" cy="112" r="6.8" fill="#1b1b20"/><circle cx="238" cy="104" r="6.8" fill="#1b1b20"/>' + T(219, 124, 3.4, '#c9c2f0', 'B') + T(237, 116, 3.4, '#c9c2f0', 'A') +
  '<rect x="194" y="130" width="12" height="4.2" rx="2.1" fill="#4a36a0"/><rect x="212" y="130" width="12" height="4.2" rx="2.1" fill="#4a36a0"/>' + T(192, 140, 2.6, '#c9c2f0', 'SELECT') + T(212, 140, 2.6, '#c9c2f0', 'START') +
  '<g fill="#4a36a0"><circle cx="232" cy="130" r="1.3"/><circle cx="237" cy="130" r="1.3"/><circle cx="242" cy="130" r="1.3"/><circle cx="232" cy="135" r="1.3"/><circle cx="237" cy="135" r="1.3"/><circle cx="242" cy="135" r="1.3"/><circle cx="234.5" cy="140" r="1.3"/><circle cx="239.5" cy="140" r="1.3"/></g>';

// ------------------------------------------------------------------ Game Boy Advance + cartridge
ART.gba = shadow(210, 84) + shadow(86, 34) +
  '<g transform="rotate(-8 86 126)"><rect x="56" y="108" width="60" height="38" rx="3" fill="#55525f"/><path d="M60 112h52M60 115.5h52" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/><rect x="62" y="120" width="48" height="22" rx="2" fill="#e85a5a"/>' + T(66, 134, 5, '#fff', 'GAME PAK') + '</g>' +
  '<rect x="146" y="68" width="38" height="9" rx="4" fill="#3a2c88"/><rect x="236" y="68" width="38" height="9" rx="4" fill="#3a2c88"/>' +
  '<path d="M152 72 H268 Q284 74 286 98 Q288 140 268 150 Q250 154 238 148 H182 Q170 154 152 150 Q132 140 134 98 Q136 74 152 72 Z" fill="#4b3aa8"/>' +
  '<path d="M152 73.5 H268 Q280 75 283 90" fill="none" stroke="#7565cf" stroke-width="2"/>' +
  '<rect x="171" y="79" width="78" height="58" rx="5" fill="#17171c"/><rect x="179" y="85" width="62" height="42" fill="#8fd6f0"/><rect x="179" y="111" width="62" height="16" fill="#4cb04a"/><circle cx="230" cy="94" r="5" fill="#ffd34d"/><path d="M179 111 l12 -9 l10 6 l12 -12 l14 9 l14 6 Z" fill="#3f8a3a"/><rect x="196" y="112" width="6" height="9" fill="#e85a5a"/>' +
  T(183, 134, 3.6, '#c9c2f0', 'GAME BOY ADVANCE', ' font-style="italic"') +
  '<circle cx="154" cy="106" r="13" fill="#3f309a"/><rect x="142.5" y="102" width="23" height="8" rx="1.5" fill="#1f1f26"/><rect x="150" y="94.5" width="8" height="23" rx="1.5" fill="#1f1f26"/>' +
  '<circle cx="269" cy="100" r="7.4" fill="#d9d6e6"/><circle cx="256" cy="112" r="7.4" fill="#d9d6e6"/>' + T(267.4, 101.8, 4.4, '#4b3aa8', 'A') + T(254.4, 113.8, 4.4, '#4b3aa8', 'B') +
  '<rect x="146" y="127" width="13" height="4.4" rx="2.2" fill="#8478cc"/><rect x="146" y="135" width="13" height="4.4" rx="2.2" fill="#8478cc"/>' + T(161, 131, 2.6, '#c9c2f0', 'START') + T(161, 139, 2.6, '#c9c2f0', 'SELECT') +
  '<g stroke="#2c2270" stroke-width="1.8" stroke-linecap="round"><path d="M256 130h14M254 135h18M256 140h14"/></g><circle cx="163" cy="84" r="1.6" fill="#3ddc6a"/>';

// ------------------------------------------------------------------ Game Gear + cartridge
ART.gamegear = shadow(210, 116) +
  '<path d="M125 39 H295 Q315 41 317 76 V114 Q315 150 295 152 H125 Q105 150 103 114 V76 Q105 41 125 39 Z" fill="#1b1b20"/>' +
  '<path d="M125 41 H295 Q311 43 314 70" fill="none" stroke="#3a3a44" stroke-width="2"/><rect x="150" y="34" width="120" height="7" rx="3" fill="#101013"/>' +
  '<rect x="158" y="50" width="104" height="88" rx="8" fill="#0a0a0d" stroke="#2c2c34" stroke-width="1.4"/>' +
  '<rect x="170" y="60" width="80" height="62" fill="#5ab0f0"/><path d="M170 100 Q190 86 210 100 T250 96 V122 H170 Z" fill="#3aa84a"/><g fill="#8a5a2b"><rect x="170" y="110" width="10" height="6"/><rect x="190" y="110" width="10" height="6"/><rect x="210" y="110" width="10" height="6"/><rect x="230" y="110" width="10" height="6"/><rect x="180" y="116" width="10" height="6"/><rect x="200" y="116" width="10" height="6"/><rect x="220" y="116" width="10" height="6"/><rect x="240" y="116" width="10" height="6"/></g>' +
  '<circle cx="232" cy="72" r="6" fill="#fff8c0"/><circle cx="196" cy="92" r="5" fill="#2f4fd0"/>' +
  '<rect x="186" y="127" width="14" height="2.4" fill="#e03a2f"/><rect x="203" y="127" width="14" height="2.4" fill="#3aa84a"/><rect x="220" y="127" width="14" height="2.4" fill="#2f6fd0"/>' +
  T(176, 148, 7, '#d6d6de', 'GAME GEAR', ' font-style="italic"') + T(119, 52, 4.4, '#8d8d98', 'SEGA', ' font-style="italic"') +
  '<circle cx="130" cy="90" r="20" fill="#26262d" stroke="#3a3a44" stroke-width="1.2"/><rect x="116" y="86" width="28" height="8" rx="2" fill="#44444e"/><rect x="126" y="76" width="8" height="28" rx="2" fill="#44444e"/>' +
  '<rect x="276" y="56" width="22" height="7" rx="3.5" fill="#2f6fd0"/>' + T(279, 70, 3.2, '#8d8d98', 'START') +
  '<circle cx="282" cy="104" r="9.6" fill="#2c2c34" stroke="#44444e" stroke-width="1.2"/><circle cx="300" cy="88" r="9.6" fill="#2c2c34" stroke="#44444e" stroke-width="1.2"/>' + T(280.2, 106, 5, '#8d8d98', '1') + T(298.2, 90, 5, '#8d8d98', '2') +
  '<g fill="#0a0a0d"><circle cx="118" cy="124" r="1.6"/><circle cx="125" cy="124" r="1.6"/><circle cx="132" cy="124" r="1.6"/><circle cx="139" cy="124" r="1.6"/><circle cx="118" cy="131" r="1.6"/><circle cx="125" cy="131" r="1.6"/><circle cx="132" cy="131" r="1.6"/><circle cx="139" cy="131" r="1.6"/><circle cx="121" cy="138" r="1.6"/><circle cx="128" cy="138" r="1.6"/><circle cx="135" cy="138" r="1.6"/></g>' +
  '<circle cx="290" cy="130" r="2" fill="#ff3b2f"/>';

// ------------------------------------------------------------------ Nintendo DS Lite (open) + stylus
ART.nds = shadow(210, 80) +
  '<rect x="300" y="60" width="4.6" height="88" rx="2.3" fill="#e9ebf0" transform="rotate(14 302 104)"/><path d="M290 146 l3 5 l3 -5 Z" fill="#9a9da6" transform="rotate(14 302 104)"/>' +
  '<rect x="143" y="6" width="134" height="72" rx="7" fill="#eef0f4"/><rect x="143" y="6" width="134" height="4" rx="2" fill="#fff"/>' +
  '<rect x="169" y="13" width="82" height="58" rx="3" fill="#17171c"/><rect x="179" y="19" width="62" height="46" fill="#8fd6f0"/><rect x="179" y="49" width="62" height="16" fill="#4cb04a"/><circle cx="231" cy="29" r="5" fill="#ffd34d"/><path d="M179 49 l12 -10 l9 6 l12 -13 l16 10 l13 7 Z" fill="#3f8a3a"/><rect x="197" y="50" width="6" height="9" fill="#e85a5a"/>' +
  '<g fill="#b9bcc6"><circle cx="153" cy="38" r="1.2"/><circle cx="158" cy="38" r="1.2"/><circle cx="153" cy="43" r="1.2"/><circle cx="158" cy="43" r="1.2"/><circle cx="262" cy="38" r="1.2"/><circle cx="267" cy="38" r="1.2"/><circle cx="262" cy="43" r="1.2"/><circle cx="267" cy="43" r="1.2"/></g>' +
  '<rect x="150" y="78" width="120" height="7" rx="3.5" fill="#c4c7d0"/><rect x="204" y="79.5" width="12" height="4" rx="2" fill="#17171c"/>' +
  '<rect x="143" y="85" width="134" height="67" rx="7" fill="#e4e6ec"/><rect x="143" y="146" width="134" height="6" rx="3" fill="#c4c7d0"/>' +
  '<rect x="172" y="91" width="76" height="54" rx="3" fill="#17171c"/><rect x="179" y="95" width="62" height="46" fill="#f2e8c8"/><path d="M185 104h28M185 112h44M185 120h36M185 128h20" stroke="#b9a66a" stroke-width="2.4" stroke-linecap="round"/><circle cx="228" cy="126" r="7" fill="none" stroke="#e85a5a" stroke-width="2"/>' +
  '<rect x="148" y="109" width="18" height="6" rx="1.5" fill="#9a9da6"/><rect x="154" y="103" width="6" height="18" rx="1.5" fill="#9a9da6"/>' +
  '<g fill="#9a9da6"><circle cx="262" cy="104" r="3.8"/><circle cx="262" cy="120" r="3.8"/><circle cx="254" cy="112" r="3.8"/><circle cx="270" cy="112" r="3.8"/></g>' + T(260.8, 105.4, 3.2, '#fff', 'X') + T(260.8, 121.4, 3.2, '#fff', 'B') + T(252.8, 113.4, 3.2, '#fff', 'Y') + T(268.8, 113.4, 3.2, '#fff', 'A') +
  '<circle cx="258" cy="132" r="1.7" fill="#9a9da6"/><circle cx="258" cy="139" r="1.7" fill="#9a9da6"/>' + T(261.5, 133, 2.4, '#8d9098', 'START') + T(261.5, 140, 2.4, '#8d9098', 'SELECT') +
  '<circle cx="149" cy="90" r="1.5" fill="#3ddc6a"/><circle cx="154" cy="90" r="1.5" fill="#f2c21e"/>' + T(149, 136, 3, '#8d9098', 'POWER');

// ------------------------------------------------------------------ arcade control deck
ART.mame = '<path d="M150 96 C150 60 176 44 176 -8" fill="none" stroke="#0c0c0c" stroke-width="4.5" stroke-linecap="round"/>' + shadow(210, 170) +
  '<path d="M84 90 H336 L364 122 H56 Z" fill="#26262e"/><path d="M84 90 H336 L340 94.5 H80 Z" fill="#ff6a00"/><path d="M60 118 H360 L364 122 H56 Z" fill="#ffb02e"/>' +
  '<rect x="56" y="122" width="308" height="30" rx="2" fill="#16161b"/><rect x="56" y="122" width="308" height="2.4" fill="#34343d"/><rect x="56" y="146" width="308" height="6" rx="2" fill="#0a0a0d"/>' +
  '<ellipse cx="128" cy="106" rx="20" ry="6.5" fill="#0c0c0f"/><ellipse cx="128" cy="105" rx="12" ry="3.8" fill="#34343d"/><rect x="125" y="60" width="6" height="46" rx="2" fill="#c4c7d0"/><rect x="125" y="60" width="2" height="46" fill="#eef0f4"/>' +
  '<circle cx="128" cy="52" r="15" fill="#e0281e"/><circle cx="128" cy="52" r="15" fill="none" stroke="#a51a12" stroke-width="1.4"/><ellipse cx="122.5" cy="46" rx="5" ry="3.4" fill="rgba(255,255,255,0.55)" transform="rotate(-30 122.5 46)"/>' +
  [[196, 101, '#f2c21e', '#a8860f'], [234, 99, '#2f8fe0', '#1c5c96'], [272, 101, '#3aa84a', '#226a2e'], [206, 113, '#e03a2f', '#961f17'], [246, 111, '#f2f2f6', '#9a9aa4'], [286, 113, '#ff7a1a', '#a84d0c']].map(function(b) {
    return '<ellipse cx="' + b[0] + '" cy="' + (b[1] + 1.6) + '" rx="13" ry="6.2" fill="#0c0c0f"/><ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="11" ry="5.2" fill="' + b[3] + '"/><ellipse cx="' + b[0] + '" cy="' + (b[1] - 1.2) + '" rx="9.6" ry="4.2" fill="' + b[2] + '"/><ellipse cx="' + (b[0] - 3) + '" cy="' + (b[1] - 2.6) + '" rx="3.4" ry="1.3" fill="rgba(255,255,255,0.5)"/>';
  }).join('') +
  '<circle cx="84" cy="136" r="7" fill="#f2f2f6" stroke="#9a9aa4" stroke-width="1.4"/><circle cx="108" cy="136" r="7" fill="#f2f2f6" stroke="#9a9aa4" stroke-width="1.4"/>' + T(79.6, 138, 5, '#16161b', '1P') + T(103.6, 138, 5, '#16161b', '2P') +
  '<rect x="180" y="127" width="22" height="20" rx="2" fill="#b3261e"/><rect x="186" y="130" width="10" height="3" rx="1" fill="#16161b"/>' + T(183, 143, 6, '#ffd9d4', '25¢') +
  '<rect x="208" y="127" width="22" height="20" rx="2" fill="#b3261e"/><rect x="214" y="130" width="10" height="3" rx="1" fill="#16161b"/>' + T(211, 143, 6, '#ffd9d4', '25¢') +
  T(252, 141, 8.4, '#ff9a3c', 'INSERT COIN', ' font-style="italic"');

// ------------------------------------------------------------------ The Lab: a home-made development cartridge
ART.lab = '<path d="M150 70 C150 44 176 36 176 -8" fill="none" stroke="#0c0c0c" stroke-width="4.5" stroke-linecap="round"/>' + shadow(210, 136) +
  '<rect x="88" y="62" width="244" height="84" rx="4" fill="#0f6b4a"/><rect x="88" y="62" width="244" height="3" rx="1.5" fill="#1c9468"/>' +
  '<g fill="none" stroke="#3ddc9a" stroke-width="1.4" opacity="0.75"><path d="M104 80h28v18h40M104 92h16v24h52M236 88h26v-12h40M236 100h46v20h26M236 112h18v16h-70M150 132h86"/></g>' +
  '<g fill="#c9a43a"><circle cx="104" cy="80" r="2.2"/><circle cx="104" cy="92" r="2.2"/><circle cx="302" cy="76" r="2.2"/><circle cx="308" cy="120" r="2.2"/><circle cx="150" cy="132" r="2.2"/></g>' +
  '<rect x="172" y="76" width="64" height="44" rx="2" fill="#5a3a78"/><rect x="172" y="76" width="64" height="5" fill="#74509a"/><circle cx="204" cy="100" r="11" fill="#d6e6f2" stroke="#2a1c3a" stroke-width="1.6"/><rect x="198" y="95" width="12" height="10" fill="#8a7a3a"/><path d="M200 97h8M200 100h8M200 103h8" stroke="#3a3216" stroke-width="0.8"/>' +
  '<path d="M178 76v-5M188 76v-5M198 76v-5M208 76v-5M218 76v-5M228 76v-5M178 120v5M188 120v5M198 120v5M208 120v5M218 120v5M228 120v5" stroke="#d6d6de" stroke-width="2.6"/>' +
  T(176, 116.5, 4, '#e6d6f6', 'EPROM 27C256') +
  '<rect x="252" y="96" width="40" height="22" rx="1.5" fill="#16161a"/><circle cx="257" cy="101" r="1.4" fill="#44444e"/><path d="M258 96v-4M266 96v-4M274 96v-4M282 96v-4M258 118v4M266 118v4M274 118v4M282 118v4" stroke="#d6d6de" stroke-width="2.2"/>' + T(256, 110.5, 4, '#c9c9d2', 'MMC1') +
  '<rect x="106" y="104" width="12" height="20" rx="5" fill="#2f6fd0"/><rect x="106" y="104" width="12" height="5" rx="2.5" fill="#c9c9d2"/><rect x="124" y="108" width="10" height="16" rx="4" fill="#16161a"/><rect x="124" y="108" width="10" height="4" rx="2" fill="#c9c9d2"/>' +
  '<rect x="300" y="84" width="20" height="8" rx="2" fill="#d9c48a"/><path d="M304 84v8M308 84v8M312 84v8" stroke="#8a2a2a" stroke-width="1.4"/>' +
  '<circle cx="300" cy="134" r="3.4" fill="#ff3b2f"/><circle cx="300" cy="134" r="5.6" fill="rgba(255,59,47,0.25)"/><circle cx="311" cy="134" r="3.4" fill="#ffd34d"/><circle cx="322" cy="134" r="3.4" fill="#3ddc6a"/><circle cx="322" cy="134" r="5.6" fill="rgba(61,220,106,0.25)"/>' +
  T(96, 74, 5, '#bff2dc', 'FAMILY GAME ROOM - DEV CART rev.4') + T(96, 141, 4.2, '#bff2dc', 'TEST BUILD') +
  '<rect x="120" y="140" width="180" height="12" fill="#0b5238"/><g fill="#e0b84a">' + (function() { var s = ''; for (var i = 0; i < 22; i++) s += '<rect x="' + (124 + i * 8) + '" y="142" width="5" height="10"/>'; return s; })() + '</g>';

window.GR_CONSOLES = { art: ART, view: '0 0 420 156' };
})();
