import { seminarDecks as semester1 } from './seminar-ppg-data.js';
import { seminarDecksS2 as legacySemester2 } from './seminar-ppg-data-s2.js';
import finalPresentations from '../public/seminar/semester2/decks.json' with { type: 'json' };

const finalByMeeting = new Map(finalPresentations.decks.map((deck) => [deck.meeting, deck]));

export const seminarDecks = [
  ...semester1,
  ...legacySemester2.map((deck) => finalByMeeting.get(deck.meeting) || deck),
];

export function initialDeckIndex(search) {
  const course = new URLSearchParams(search).get('presentasi')?.toUpperCase();
  return Math.max(0, seminarDecks.findIndex((deck) => deck.course === course));
}

export function progressKey(deck) {
  return deck.revision ? `final-${deck.course}-${deck.revision}` : String(deck.meeting);
}
