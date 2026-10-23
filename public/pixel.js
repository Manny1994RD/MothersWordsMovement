// 8-bit sprite icons, drawn as crisp SVG rectangles. Each letter is a color; "." is empty.
'use strict';

const PX_COLORS = {
  K: '#3a1650', // outline
  P: '#6b2a8c', // purple
  L: '#a463c4', // light purple
  C: '#e8584f', // coral
  R: '#d93a4a', // heart red
  O: '#f39a3b', // orange
  Y: '#ffd84a', // yellow
  W: '#ffffff',
  B: '#7cc8ec', // sky
  D: '#3a8fc4', // deep sky
  G: '#5bb04a', // leaf
  S: '#f6c89a', // skin
  T: '#c98a5a', // skin shade
  N: '#9a5a2a', // brown
};

const SPRITES = {
  heart: [
    '..KK...KK..',
    '.KRRK.KRRK.',
    'KRWRRKRRRRK',
    'KRWRRRRRRRK',
    'KRRRRRRRRRK',
    '.KRRRRRRRK.',
    '..KRRRRRK..',
    '...KRRRK...',
    '....KRK....',
    '.....K.....',
  ],
  visits: [ // a little house with a door
    '.....K.....',
    '....KCK....',
    '...KCCCK...',
    '..KCCCCCK..',
    '.KCCCCCCCK.',
    'KKKKKKKKKKK',
    '.KYYYYYYYK.',
    '.KBBYYKKKK.',
    '.KBBYYKOOK.',
    '.KYYYYKOOK.',
    '.KKKKKKKKK.',
  ],
  returned: [ // church
    '.....K.....',
    '....KPK....',
    '...KPPPK...',
    '..KPPYPPK..',
    '.KPPPPPPPK.',
    'KKKKKKKKKKK',
    '.KWWWWWWWK.',
    '.KWBWWWBWK.',
    '.KWBWKWBWK.',
    '.KWWKOKWWK.',
    '.KWWKOKWWK.',
    '.KKKKKKKKK.',
  ],
  prayers: [ // praying hands
    '....K.K....',
    '...KSKSK...',
    '...KSKSK...',
    '..KSSKSTK..',
    '..KSSKSTK..',
    '.KSSSKSSTK.',
    '.KSSSKSSTK.',
    '.KSSKKKSTK.',
    '..KK.K.KK..',
    '..KBBBBBK..',
    '..KBBBBBK..',
  ],
  letters: [ // envelope with a heart seal
    'KKKKKKKKKKK',
    'KCWWWWWWWCK',
    'KWCWWWWWCWK',
    'KWWCWWWCWWK',
    'KWWWCRCWWWK',
    'KWWWWCWWWWK',
    'KWWWWWWWWWK',
    'KKKKKKKKKKK',
  ],
  book: [
    'KKKKK.KKKKK',
    'KWWWWKWWWWK',
    'KWLLWKWLLWK',
    'KWWWWKWWWWK',
    'KWLLWKWLLWK',
    'KWWWWKWWWWK',
    'KKKKKKKKKKK',
    '.KPPPPPPPK.',
  ],
  flame: [
    '.....K.....',
    '....KOK....',
    '...KOOK....',
    '...KOYOK...',
    '..KOYYOOK..',
    '..KOYYYOK..',
    '.KOYYWYYOK.',
    '.KOYWWWYOK.',
    '..KOYWYOK..',
    '...KKKKK...',
  ],
  star: [
    '.....K.....',
    '....KYK....',
    '....KYK....',
    'KKKKYYYKKKK',
    'KYYYYWYYYYK',
    '.KYYYYYYYK.',
    '..KYYYYYK..',
    '..KYYKYYK..',
    '.KYYK.KYYK.',
    '.KKK...KKK.',
  ],
  globe: [
    '...KKKKK...',
    '..KBBGGBK..',
    '.KBGGGBBBK.',
    'KBBGGBBBGBK',
    'KBBBGBBGGBK',
    'KGBBBBBGGBK',
    'KGGBBBBBGBK',
    '.KGBBBBBBK.',
    '..KBBBGBK..',
    '...KKKKK...',
  ],
  trophy: [
    'KKKKKKKKKKK',
    'KYKYYYYYKYK',
    'KYKYYWYYKYK',
    '.KKYYWYYKK.',
    '...KYYYK...',
    '....KYK....',
    '....KYK....',
    '...KKKKK...',
    '..KNNNNNK..',
    '..KKKKKKK..',
  ],
  people: [
    '..KKK...KKK',
    '.KSSSK.KSSS',
    '.KSSSK.KSSS',
    '..KKK...KKK',
    '.KCCCK.KBBB',
    'KCCCCCKBBBB',
    'KCCCCCKBBBB',
    'KKKKKKKKKKK',
  ],
  chart: [
    '.........K.',
    '........KGK',
    '....K...KGK',
    '...KCK..KGK',
    '...KCK..KGK',
    'K..KCK..KGK',
    'KPK.KCK.KGK',
    'KPK.KCK.KGK',
    'KKKKKKKKKKK',
  ],
  daisy: [
    '...W.W.W...',
    '..WWWWWWW..',
    '.WWWKKKWWW.',
    'WWWKYYYKWWW',
    '.WWKYYYKWW.',
    'WWWKYYYKWWW',
    '.WWWKKKWWW.',
    '..WWWWWWW..',
    '...W.G.W...',
    '.....G.GG..',
    '..GG.G.G...',
    '...GGGG....',
  ],
  seed: [
    '...........',
    '...........',
    '...........',
    '...........',
    '...........',
    '...........',
    '....KKK....',
    '...KNYNK...',
    '....KKK....',
    '.NNNNNNNNN.',
    'NNNNNNNNNNN',
  ],
  sprout: [
    '...........',
    '...........',
    '...........',
    '..GG.......',
    '..GGG..GG..',
    '...GGGGGG..',
    '.....G.....',
    '.....G.....',
    '.....G.....',
    '.NNNNNNNNN.',
    'NNNNNNNNNNN',
  ],
  bud: [
    '...........',
    '....KKK....',
    '...KWWWK...',
    '...KWYWK...',
    '....KGK....',
    '..GG.G.....',
    '..GGGG..GG.',
    '.....GGGG..',
    '.....G.....',
    '.NNNNNNNNN.',
    'NNNNNNNNNNN',
  ],
  flower: [
    '....K.K....',
    '...KWKWK...',
    '..KWWWWWK..',
    '.KWWYYYWWK.',
    '..KWYYYWK..',
    '.KWWWWWWWK.',
    '..KK.G.KK..',
    '..GG.G.GG..',
    '...GGGGG...',
    '.NNNNGNNNN.',
    'NNNNNNNNNNN',
  ],
  bouquet: [
    '..KK.....KK..',
    '.KWWK...KCCK.',
    'KWYYWK.KCYYCK',
    '.KWWK...KCCK.',
    '..KG..KK.GK..',
    '...G.KOOK.G..',
    '...GKOYYOKG..',
    '....GKOOKG...',
    '.....GGGG....',
    '....KPPPPK...',
    '...KPPCPPPK..',
    '...KPPPPPPK..',
    '....KKKKKK...',
  ],
  share: [
    '.......KK..',
    '......KCCK.',
    '..KK.KCCK..',
    '.KCCKCCK...',
    '.KCCCCK....',
    '.KCCCK.....',
    '.KCCCCK....',
    'KKKKKKKK...',
  ],
  tv: [
    '...K...K...',
    '....K.K....',
    'KKKKKKKKKKK',
    'KBBBBBBBBBK',
    'KBYBBBBCBBK',
    'KBBBBGBBBBK',
    'KBBBGGGBBBK',
    'KBBGGGGGBBK',
    'KKKKKKKKKKK',
    '...KK.KK...',
  ],
  check: [
    '.........KK',
    '........KGK',
    '.......KGK.',
    'KK....KGK..',
    'KGK..KGK...',
    '.KGKKGK....',
    '..KGGK.....',
    '...KK......',
  ],
};

function pixelIcon(name, size = 28, title) {
  const rows = SPRITES[name] || SPRITES.heart;
  const w = Math.max(...rows.map((r) => r.length));
  const hgt = rows.length;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${hgt}`);
  svg.setAttribute('width', size);
  svg.setAttribute('height', Math.round((size * hgt) / w));
  svg.setAttribute('class', 'px');
  svg.setAttribute('shape-rendering', 'crispEdges');
  if (title) {
    svg.setAttribute('role', 'img');
    const tt = document.createElementNS(ns, 'title');
    tt.textContent = title;
    svg.append(tt);
  } else {
    svg.setAttribute('aria-hidden', 'true');
  }
  rows.forEach((row, y) => {
    // Merge horizontal runs of the same color into one rect.
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let run = 1;
      while (row[x + run] === ch) run++;
      if (ch !== '.' && PX_COLORS[ch]) {
        const r = document.createElementNS(ns, 'rect');
        r.setAttribute('x', x); r.setAttribute('y', y);
        r.setAttribute('width', run); r.setAttribute('height', 1);
        r.setAttribute('fill', PX_COLORS[ch]);
        svg.append(r);
      }
      x += run;
    }
  });
  return svg;
}
