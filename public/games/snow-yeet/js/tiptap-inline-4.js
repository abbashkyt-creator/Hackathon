placed AFTER a stylesheet cannot
       execute until that stylesheet has downloaded (the browser needs the CSSOM in case
       the script reads computed styles). With the link first, the Poki SDK script above
       was blocked on this 820-byte file's round-trip — delaying `game/loading` and losing
       players who bounce in that window. A stylesheet in <head> still blocks RENDERING
       wherever it sits, so moving it here costs no FOUC while letting the SDK fire ASAP. -->
  <script type="module" crossorigin src="./assets/main-Vi79En6k.js">
