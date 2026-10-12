import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { seminarDecks } from '../js/seminar-ppg-data.js';
import { seminarDecksS2 } from '../js/seminar-ppg-data-s2.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const main = read('js/main.js');
const serviceWorker = read('public/sw.js');
const enhancements = read('js/enhancements.js');
const particles = read('js/particles.js');
const eportfolio2Animation = read('js/eportfolio2-animation.js');
const seminarPlayer = read('js/seminar-ppg.js');
const portfolioChooser = read('js/portfolio-chooser.js');
const indexHtml = read('index.html');
const pendidikanCss = read('css/pendidikan.css');
const semester2Css = read('css/semester2-ep1.css');
const seminarCss = read('css/seminar-ppg.css');
const allCss = readdirSync(new URL('../css/', import.meta.url))
  .filter((name) => name.endsWith('.css'))
  .map((name) => read(`css/${name}`))
  .join('\n');

test('preloader mempertahankan lazy-loading gambar di luar layar', () => {
  assert.doesNotMatch(main, /img\.loading\s*=\s*['"]eager['"]/);
  assert.match(main, /filter\(img\s*=>\s*img\.loading\s*!==\s*['"]lazy['"]\)/);
});

test('localhost membersihkan Service Worker lama sebelum modul utama dimuat', () => {
  const resetMarker = 'data-local-cache-reset';
  const resetPosition = indexHtml.indexOf(resetMarker);
  const mainModulePosition = indexHtml.indexOf('<script type="module" data-app-bootstrap>');

  assert.ok(resetPosition >= 0, 'reset cache localhost belum tersedia');
  assert.ok(resetPosition < mainModulePosition, 'reset cache harus berjalan sebelum modul utama');
  assert.match(indexHtml, /(?:localhost|127\.0\.0\.1)/);
  assert.match(indexHtml, /getRegistrations\(\)/);
  assert.match(indexHtml, /registration\.unregister\(\)/);
  assert.match(indexHtml, /caches\.delete\(cacheName\)/);
  assert.match(indexHtml, /await window\.__localCacheReset/);
  assert.match(indexHtml, /import\(['"]\.\/js\/main\.js['"]\)/);
  assert.match(main, /!isLocalhost.*serviceWorker|serviceWorker.*!isLocalhost/s);
  assert.match(serviceWorker, /const CACHE_NAME = 'eportfolio-v5-seminar-hotspots';/);
});

test('preferensi reduced motion tidak dinonaktifkan oleh hard-code atau media query mustahil', () => {
  assert.doesNotMatch(main, /reducedMotionQuery\s*=\s*\{\s*matches:\s*false\s*\}/);
  assert.match(main, /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/);
  assert.doesNotMatch(enhancements, /prefersReducedMotion\s*=\s*false/);
  assert.match(enhancements, /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/);
  assert.doesNotMatch(allCss, /prefers-reduced-motion:\s*reduce\)\s*and\s*\(max-width:\s*0px\)/);
});

test('banner draf Semester 2 sudah dihapus dari markup dan style', () => {
  assert.doesNotMatch(indexHtml, /id=["']s2ep1Draf["']/);
  assert.doesNotMatch(semester2Css, /\.s2ep1-draf(?:[-_]|\s|\{|:)/);
});

test('selector E-Portfolio 1 Semester 2 menolak klik dan deep link saat dikunci', () => {
  const card = indexHtml.match(
    /<button[^>]*class=["'][^"']*chooser-card[^"']*is-locked[^"']*["'][^>]*data-portfolio=["']s2ep1["'][^>]*>[\s\S]*?<\/button>/
  )?.[0] ?? '';

  assert.match(card, /data-locked=["']true["']/);
  assert.match(card, /aria-disabled=["']true["']/);
  assert.match(card, /BELUM DIBUKA/);
  assert.match(portfolioChooser, /const s2ep1Card\s*=\s*chooser\.querySelector\([^\n]+s2ep1/);
  assert.match(portfolioChooser, /isS2Hash\s*&&\s*s2ep1Locked/);
});

test('selector E-Portfolio 2 Semester 2 memakai tampilan lock yang sama', () => {
  const card = indexHtml.match(
    /<button[^>]*class=["'][^"']*chooser-card[^"']*is-locked[^"']*["'][^>]*data-portfolio=["']s2ep2["'][^>]*>[\s\S]*?<\/button>/
  )?.[0] ?? '';

  assert.match(card, /data-locked=["']true["']/);
  assert.match(card, /aria-disabled=["']true["']/);
  assert.match(card, /class=["']chooser-card-lock["']/);
  assert.match(card, /Terkunci/);
  assert.match(card, /Akan segera hadir/);
});

test('selector E-Portfolio 2 Semester 1 tetap tersedia tanpa auto-unlock', () => {
  const card = indexHtml.match(
    /<button[^>]*class=["'][^"']*chooser-card[^"']*["'][^>]*data-portfolio=["']2["'][^>]*>[\s\S]*?<\/button>/
  )?.[0] ?? '';

  assert.doesNotMatch(card, /is-locked|data-locked|aria-disabled/);
  assert.match(card, /Lihat E-Portfolio 2/);
  assert.doesNotMatch(portfolioChooser, /maybeAutoUnlockEp2|UNLOCK_AT|applyUnlock/);
});

test('link fungsional href hash tidak ditandai sebagai disabled secara global', () => {
  assert.doesNotMatch(enhancements, /querySelectorAll\(['"]a\[href=['"]#['"]\]['"]\)/);
  assert.doesNotMatch(enhancements, /setAttribute\(['"]aria-disabled['"],\s*['"]true['"]\)/);
});

test('partikel tetap aktif dengan kepadatan ringan pada layar kecil', () => {
  assert.match(particles, /const prefersReduced\s*=\s*window\.matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)\.matches/);
  assert.match(particles, /if\s*\(prefersReduced\s*\|\|\s*isPerfMode\)/);
  assert.doesNotMatch(particles, /if\s*\(isMobile\s*\|\|\s*prefersReduced\s*\|\|\s*isPerfMode\)/);

  const ep2Particles = eportfolio2Animation.slice(
    eportfolio2Animation.indexOf('function initEp2Particles()'),
    eportfolio2Animation.indexOf('function initEp2ScrollRail()')
  );
  assert.match(ep2Particles, /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)\.matches/);
  assert.doesNotMatch(ep2Particles, /if\s*\(window\.innerWidth\s*<\s*768\)\s*return/);
  assert.match(ep2Particles, /particleCount\s*=\s*isMobile\s*\?\s*10\s*:/);
});

test('titik timeline akademik tetap terpusat saat transform dianimasikan', () => {
  assert.match(
    pendidikanCss,
    /\.timeline-dot\s*\{[^}]*margin-left:\s*-9px;[^}]*transform:\s*none;/s
  );
});

test('Seminar PPG menyediakan player Meeting 1 dengan hotspot PPTX', () => {
  assert.match(indexHtml, /data-portfolio=["']seminar["']/);
  assert.match(indexHtml, /id=["']seminarPpgWrapper["']/);
  assert.match(indexHtml, /aria-label=["']Slide sebelumnya["']/);
  assert.match(indexHtml, /aria-label=["']Slide berikutnya["']/);
  assert.match(indexHtml, /aria-label=["']Tampilkan presentasi layar penuh["']/);

  const dataUrl = new URL('../js/seminar-ppg-data.js', import.meta.url);
  assert.equal(existsSync(dataUrl), true, 'manifest Seminar PPG belum dibuat');
  const meetingOne = seminarDecks.find((deck) => deck.id === 'meeting-01');
  assert.ok(meetingOne, 'deck Meeting 1 tidak ditemukan');
  assert.equal(meetingOne.slides.at(-1)?.number, 10);
  assert.equal(
    meetingOne.slides.some(({ hotspots }) =>
      hotspots.some(({ targetSlide }) => Number.isInteger(targetSlide))
    ),
    true
  );
  assert.match(seminarPlayer, /is-pseudo-fullscreen/);
});

test('tujuh deck Seminar PPG memakai 74 URL Drive unik dengan hotspot valid', () => {
  const expectedSeminarDecks = [
    { id: 'meeting-01', meeting: 1, slides: 10, hotspots: 67 },
    { id: 'meeting-02', meeting: 2, slides: 10, hotspots: 60 },
    { id: 'meeting-03', meeting: 3, slides: 10, hotspots: 55 },
    { id: 'meeting-04', meeting: 4, slides: 10, hotspots: 66 },
    { id: 'meeting-05', meeting: 5, slides: 10, hotspots: 41 },
    { id: 'meeting-06', meeting: 6, slides: 12, hotspots: 56 },
    { id: 'meeting-07', meeting: 7, slides: 12, hotspots: 62 },
  ];
  const summary = seminarDecks.map((deck) => ({
    id: deck.id,
    meeting: deck.meeting,
    slides: deck.slides.length,
    hotspots: deck.slides.reduce((sum, slide) => sum + slide.hotspots.length, 0),
  }));
  assert.deepEqual(summary, expectedSeminarDecks);

  const allSlides = seminarDecks.flatMap((deck) =>
    deck.slides.map((slide) => ({ deck, slide }))
  );
  assert.equal(allSlides.length, 74);
  const driveUrlPattern = /^https:\/\/drive\.google\.com\/thumbnail\?id=([\w-]+)&sz=w1920(?:&v=([\w-]+))?$/;
  const fileIds = allSlides.map(({ deck, slide }) => {
    assert.doesNotMatch(slide.src, /^assets\/seminar\//);
    const match = slide.src.match(driveUrlPattern);
    assert.ok(match, `${deck.id} slide ${slide.number} bukan URL Drive`);
    assert.equal(
      match[2],
      deck.meeting === 7 ? 'm7-composite-v2' : undefined,
      `${deck.id} slide ${slide.number} memakai revisi gambar yang salah`
    );

    slide.hotspots.forEach((hotspot) => {
      for (const value of [hotspot.x, hotspot.y, hotspot.width, hotspot.height]) {
        assert.equal(Number.isFinite(value), true);
      }
      assert.ok(hotspot.x >= 0 && hotspot.y >= 0);
      assert.ok(hotspot.width > 0 && hotspot.height > 0);
      assert.ok(hotspot.x + hotspot.width <= 100.001);
      assert.ok(hotspot.y + hotspot.height <= 100.001);
      if (hotspot.targetSlide !== null) {
        assert.ok(hotspot.targetSlide >= 1 && hotspot.targetSlide <= deck.slides.length);
      }
    });

    return match[1];
  });
  assert.equal(new Set(fileIds).size, 74);
  assert.doesNotMatch(indexHtml, /(?:src|srcset)=["'][^"']*assets\/seminar\//);
});

test('fullscreen Seminar PPG menjaga rasio slide dan memisahkan kontrol', () => {
  const shellRule = seminarCss.match(
    /\.seminar-stage-shell:fullscreen,\s*\.seminar-stage-shell\.is-pseudo-fullscreen\s*\{([^}]*)\}/s
  )?.[1] ?? '';
  const stageRule = seminarCss.match(
    /\.seminar-stage-shell:fullscreen \.seminar-stage,\s*\.seminar-stage-shell\.is-pseudo-fullscreen \.seminar-stage\s*\{([^}]*)\}/s
  )?.[1] ?? '';
  const hotspotRule = seminarCss.match(/\.seminar-hotspot\s*\{([^}]*)\}/s)?.[1] ?? '';

  assert.match(shellRule, /grid-template-rows:\s*minmax\(0,\s*1fr\)\s+auto;/);
  assert.match(shellRule, /gap:\s*clamp\(/);
  assert.match(shellRule, /--seminar-fullscreen-gutter:\s*clamp\(/);
  assert.match(shellRule, /--seminar-fullscreen-controls-height:\s*60px;/);
  assert.match(stageRule, /width:\s*min\(100%,\s*calc\(\(100dvh\s*-/);
  assert.match(stageRule, /height:\s*auto;/);
  assert.match(stageRule, /aspect-ratio:\s*16\s*\/\s*9;/);
  assert.match(hotspotRule, /min-width:\s*0;/);
  assert.match(hotspotRule, /min-height:\s*0;/);
});

test('deck 8-16 Seminar PPG memakai slide teks dengan struktur valid', () => {
  const expectedS2 = [
    { id: 'meeting-08', meeting: 8, slides: 6, hotspots: 0 },
    { id: 'meeting-09', meeting: 9, slides: 8, hotspots: 0 },
    { id: 'meeting-10', meeting: 10, slides: 6, hotspots: 0 },
    { id: 'meeting-11', meeting: 11, slides: 6, hotspots: 0 },
    { id: 'meeting-12', meeting: 12, slides: 6, hotspots: 0 },
    { id: 'meeting-13', meeting: 13, slides: 8, hotspots: 0 },
    { id: 'meeting-14', meeting: 14, slides: 6, hotspots: 0 },
    { id: 'meeting-15', meeting: 15, slides: 6, hotspots: 0 },
    { id: 'meeting-16', meeting: 16, slides: 8, hotspots: 4 },
  ];
  const summary = seminarDecksS2.map((deck) => ({
    id: deck.id,
    meeting: deck.meeting,
    slides: deck.slides.length,
    hotspots: deck.slides.reduce((sum, slide) => sum + slide.hotspots.length, 0),
  }));
  assert.deepEqual(summary, expectedS2);

  const allSlides = seminarDecksS2.flatMap((deck) => deck.slides);
  allSlides.forEach((slide) => {
    // Slide teks TIDAK memakai URL Drive — konten dirender langsung
    assert.equal(slide.src, undefined, 'slide teks tidak boleh punya src');
    assert.ok(slide.content, 'slide teks wajib punya content');
    assert.ok(slide.content.eyebrow, 'content wajib punya eyebrow');
    assert.ok(slide.content.title, 'content wajib punya title');
    assert.ok(
      slide.content.body?.length || slide.content.bullets?.length || slide.content.quote,
      'content wajib memuat body, bullets, atau quote'
    );
    assert.equal(Number.isInteger(slide.number), true);
    slide.hotspots.forEach((hotspot) => {
      assert.ok(hotspot.x >= 0 && hotspot.y >= 0);
      assert.ok(hotspot.width > 0 && hotspot.height > 0);
      assert.ok(hotspot.x + hotspot.width <= 100.001);
      assert.ok(hotspot.y + hotspot.height <= 100.001);
      if (hotspot.targetSlide !== null) {
        assert.ok(hotspot.targetSlide >= 1 && hotspot.targetSlide <= slide.number + 10);
      }
    });
  });
});

test('Seminar PPG menampilkan loader estetik saat gambar belum siap', () => {
  assert.match(indexHtml, /id=["']seminarLoading["']/);
  assert.match(indexHtml, /role=["']status["']/);
  assert.match(seminarCss, /\.seminar-stage\.is-loading \.seminar-loading/);
  assert.match(seminarCss, /\.seminar-stage\.is-loading \.seminar-hotspots\s*\{[^}]*pointer-events:\s*none;/s);
  assert.match(seminarPlayer, /function setSlideLoading\(/);
  assert.match(seminarPlayer, /elements\.image\.addEventListener\(['"]load['"]/);
  assert.match(seminarPlayer, /elements\.image\.addEventListener\(['"]error['"]/);
});

test('header Seminar PPG memiliki home dan toggle tema di sisi kiri', () => {
  assert.match(indexHtml, /class=["']seminar-topbar-actions["']/);
  assert.match(indexHtml, /id=["']seminarBackBtn["']/);
  assert.match(indexHtml, /id=["']seminarThemeToggle["']/);
  assert.match(indexHtml, /aria-label=["']Toggle dark mode["']/);
  assert.match(portfolioChooser, /seminarThemeToggle/);
});

test('status meeting tetap tersedia pada header mobile Seminar PPG', () => {
  assert.match(seminarCss, /\.seminar-topbar\s*\{[^}]*grid-template-columns:\s*auto\s+minmax\(0,\s*1fr\)\s+auto;/s);
  assert.doesNotMatch(seminarCss, /\.seminar-back span,\s*\.seminar-topbar-status,\s*\.seminar-brand \.seminar-eyebrow/);
});

test('Pertemuan Seminar 8 sampai 16 terkunci dengan status akan segera hadir', () => {
  assert.match(seminarPlayer, /button\.disabled\s*=\s*!available/);
  assert.match(seminarPlayer, /button\.classList\.toggle\(['"]is-locked['"],\s*!available\)/);
  assert.match(seminarPlayer, /Akan segera hadir/);
  assert.match(seminarPlayer, /fa-lock/);
});

test('light mode Seminar PPG memakai token permukaan terang', () => {
  assert.match(seminarCss, /\.seminar-wrapper\s*\{[^}]*--seminar-bg:\s*var\(--bg-light\);/s);
  assert.match(seminarCss, /\[data-theme=["']dark["']\]\s*\.seminar-wrapper\s*\{[^}]*--seminar-bg:\s*var\(--bg-dark\);/s);
});

test('klik navigasi pertemuan memusatkan player hingga hint terlihat', () => {
  assert.match(indexHtml, /id=["']seminarPlayerHint["']/);
  assert.match(seminarPlayer, /function scrollPresentationIntoView\(elements\)/);
  assert.match(seminarPlayer, /renderDeck\(elements\);\s*scrollPresentationIntoView\(elements\);/s);
});
