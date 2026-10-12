import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const manifestUrl = new URL('../public/seminar/semester2/decks.json', import.meta.url);

test('kelima presentasi final Semester II tersedia sebagai 50 gambar dengan notes', () => {
  assert.ok(existsSync(manifestUrl), 'manifest presentasi final belum tersedia');
  const { decks } = JSON.parse(readFileSync(manifestUrl, 'utf8'));
  assert.deepEqual(decks.map((deck) => deck.course).sort(),
    ['INOVASI', 'KEPEMIMPINAN', 'PMAL', 'PPL', 'PSE']);
  const slides = decks.flatMap((deck) => deck.slides);
  assert.equal(slides.length, 50);
  assert.equal(new Set(slides.map((slide) => slide.src)).size, 50);
  for (const deck of decks) {
    assert.equal(deck.slides.length, 10);
    assert.deepEqual(deck.slides.map((slide) => slide.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const slide of deck.slides) {
      assert.match(slide.src, /^seminar\/semester2\/assets\/[a-z]+\/\d{2}-[a-f0-9]{12}\.webp$/);
      assert.match(slide.thumbnail, /\/thumbs\/\d{2}-[a-f0-9]{12}\.webp$/);
      assert.match(slide.notes, /saya/i);
      assert.match(slide.sourceSha256, /^[a-f0-9]{64}$/);
      assert.ok(slide.alt);
      assert.equal(slide.content, undefined);
      assert.ok(Array.isArray(slide.hotspots));
      for (const path of [slide.src, slide.thumbnail]) {
        const url = new URL(`../public/${path}`, import.meta.url);
        assert.ok(existsSync(url), `aset tidak ditemukan: ${path}`);
        const bytes = readFileSync(url);
        assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
        assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      }
    }
  }
});

test('seluruh slide final memiliki hyperlink yang benar dan tujuan 4C sesuai materi', () => {
  const { decks } = JSON.parse(readFileSync(manifestUrl, 'utf8'));
  const expected = {
    PSE: { connection: 2, challenge: 4, concept: 5, change: 9 },
    PMAL: { connection: 2, challenge: 5, concept: 4, change: 9 },
    PPL: { connection: 3, challenge: 5, concept: 6, change: 9 },
    KEPEMIMPINAN: { connection: 2, challenge: 4, concept: 5, change: 9 },
    INOVASI: { connection: 4, challenge: 6, concept: 7, change: 10 },
  };
  for (const deck of decks) {
    assert.deepEqual(deck.sections, expected[deck.course]);
    for (const slide of deck.slides) {
      assert.ok(slide.hotspots.length >= 2, `${deck.course} slide ${slide.number} belum interaktif`);
      assert.equal(new Set(slide.hotspots.map(h => h.id)).size, slide.hotspots.length);
      for (const hotspot of slide.hotspots) {
        assert.ok(hotspot.label);
        assert.ok(hotspot.targetSlide >= 1 && hotspot.targetSlide <= deck.slides.length);
        assert.ok(hotspot.x >= 0 && hotspot.y >= 0 && hotspot.width > 0 && hotspot.height > 0);
        assert.ok(hotspot.x + hotspot.width <= 100 && hotspot.y + hotspot.height <= 100);
        if (hotspot.section) assert.equal(hotspot.targetSlide, deck.sections[hotspot.section]);
      }
      assert.equal(slide.hotspots.find(h => h.id === 'home').targetSlide, 1);
    }
  }
});

test('library memakai lima deck final tanpa mengubah 74 slide Semester I', async () => {
  const url = new URL('../js/seminar-ppg-library.js', import.meta.url);
  assert.ok(existsSync(url), 'library deck final belum diintegrasikan');
  const { seminarDecks, initialDeckIndex, progressKey } = await import(url);
  const { seminarDecks: semester1 } = await import('../js/seminar-ppg-data.js');
  assert.deepEqual(seminarDecks.slice(0, 7), semester1);
  assert.equal(seminarDecks.slice(0, 7).flatMap((deck) => deck.slides).length, 74);
  for (const course of ['PSE', 'PMAL', 'PPL', 'KEPEMIMPINAN', 'INOVASI']) {
    const index = initialDeckIndex(`?presentasi=${course.toLowerCase()}`);
    const deck = seminarDecks[index];
    assert.equal(deck.course, course);
    assert.equal(deck.slides.length, 10);
    assert.match(progressKey(deck), /^final-/);
  }
  assert.equal(initialDeckIndex('?presentasi=tidak-ada'), 0);
  assert.equal(progressKey(semester1[0]), '1');
});

test('viewer menyediakan notes dan thumbnail khusus untuk presentasi final', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const player = readFileSync(new URL('../js/seminar-ppg.js', import.meta.url), 'utf8');
  assert.match(html, /id="seminarSpeakerNotes"/);
  assert.match(html, /id="seminarNotesText"/);
  assert.match(player, /slide\.thumbnail/);
  assert.match(player, /notesText\.textContent\s*=\s*slide\.notes/);
});

test('area hyperlink dapat ditampilkan agar interaksi terlihat', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const player = readFileSync(new URL('../js/seminar-ppg.js', import.meta.url), 'utf8');
  assert.ok(html.includes('id="seminarHotspotToggle"'), 'tombol area klik belum tersedia');
  assert.ok(player.includes("classList.toggle('show-hotspots'"), 'toggle area klik belum berfungsi');
});

test('tautan langsung seminar tidak menunggu gestur intro dan tidak mengganti URL beranda', () => {
  const main = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
  const player = readFileSync(new URL('../js/seminar-ppg.js', import.meta.url), 'utf8');
  assert.ok(main.includes("const isSeminarLink = window.location.hash === '#seminar-ppg'"));
  assert.match(main, /if \(introTear && isSeminarLink\)/);
  assert.match(player, /if \(isVisible\(elements\.wrapper\)\)\s*\{\s*const url/s);
  assert.match(main, /function highlightNav\(\)\s*\{\s*if \(document\.body\.dataset\.portfolio === 'seminar'\) return;/);
});
