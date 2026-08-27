import assert from 'node:assert/strict';
import { calculateCompatibility, generateHoroscope, getCanonicalCompatibilityPair, zodiacSigns } from '../src/data/zodiac.ts';

const date = new Date(2026, 6, 15);
const nextYear = new Date(2027, 6, 15);
const results = zodiacSigns.map((sign) => generateHoroscope(sign.id, date));

assert.equal(results.length, 12);
assert.equal(new Set(results.map((item) => `${item.overall}-${item.love}-${item.career}-${item.health}-${item.wealth}`)).size, 12);
assert.deepEqual(generateHoroscope('aries', date), generateHoroscope('aries', date));
assert.notDeepEqual(generateHoroscope('aries', date), generateHoroscope('aries', nextYear));
assert.notDeepEqual(generateHoroscope('aries', date, 'daily'), generateHoroscope('aries', date, 'weekly'));
assert.deepEqual(getCanonicalCompatibilityPair('leo', 'aries'), ['aries', 'leo']);
assert.deepEqual(calculateCompatibility('leo', 'aries'), calculateCompatibility('aries', 'leo'));
assert.equal(Object.keys(calculateCompatibility('leo', 'aries').dimensions).length, 4);

console.log('Horoscope engine verification passed.');
