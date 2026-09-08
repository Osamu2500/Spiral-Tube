import { normalizeNumStr } from './view-parser.js';

const TIME_UNIT_DAYS = {};
const TIME_UNIT_ENTRIES = [
  [
    1 / 86400,
    [
      'second',
      'seconds',
      'sec',
      'secs',
      'секунд',
      'секунды',
      'секунду',
      '秒',
      '초',
      'ثاني',
      'ثانية',
      'ثوان',
      'secondo',
      'secondi',
      'seconde',
      'secondes',
      'Sekunde',
      'Sekunden',
      'segundo',
      'segundos',
    ],
  ],
  [
    1 / 1440,
    [
      'minute',
      'minutes',
      'min',
      'mins',
      'минут',
      'минуты',
      'минуту',
      '分',
      '분',
      'دقيقة',
      'دقائق',
      'minuto',
      'minutos',
      'minuti',
      'minuta',
      'Minute',
      'Minuten',
    ],
  ],
  [
    1 / 24,
    [
      'hour',
      'hours',
      'hr',
      'hrs',
      'h',
      'час',
      'часа',
      'часов',
      '時間',
      '시간',
      'ساعة',
      'ساعات',
      'ora',
      'ore',
      'heure',
      'heures',
      'Stunde',
      'Stunden',
      'hora',
      'horas',
    ],
  ],
  [
    1,
    [
      'day',
      'days',
      'd',
      'день',
      'дня',
      'дней',
      '日',
      '일',
      'يوم',
      'يومين',
      'أيام',
      'giorno',
      'giorni',
      'jour',
      'jours',
      'Tag',
      'Tagen',
      'Tage',
      'día',
      'días',
      'dia',
      'dias',
    ],
  ],
  [
    7,
    [
      'week',
      'weeks',
      'wk',
      'wks',
      'w',
      'неделю',
      'недели',
      'недель',
      '週間',
      '주',
      'أسبوع',
      'أسبوعين',
      'أسابيع',
      'settimana',
      'settimane',
      'semaine',
      'semaines',
      'Woche',
      'Wochen',
      'semana',
      'semanas',
    ],
  ],
  [
    30,
    [
      'month',
      'months',
      'mo',
      'mos',
      'mth',
      'mths',
      'месяц',
      'месяца',
      'месяцев',
      'か月',
      'ヶ月',
      '개월',
      'شهر',
      'شهرين',
      'أشهر',
      'mese',
      'mesi',
      'mois',
      'Monat',
      'Monaten',
      'Monate',
      'mes',
      'meses',
      'mês',
      'meses',
    ],
  ],
  [
    365,
    [
      'year',
      'years',
      'yr',
      'yrs',
      'y',
      'год',
      'года',
      'лет',
      '年',
      '년',
      'سنة',
      'سنتين',
      'سنوات',
      'anno',
      'anni',
      'an',
      'ans',
      'année',
      'années',
      'Jahr',
      'Jahren',
      'Jahre',
      'año',
      'años',
      'ano',
      'anos',
    ],
  ],
];

TIME_UNIT_ENTRIES.forEach(([multiplier, words]) => {
  words.forEach(w => {
    TIME_UNIT_DAYS[w.toLowerCase()] = multiplier;
  });
});

const TIME_UNIT_ANCHORED = new RegExp(
  '^\\s*(' +
    Object.keys(TIME_UNIT_DAYS)
      .sort((a, b) => b.length - a.length)
      .join('|') +
    ')(?![a-zA-Z])',
  'i',
);

const RELATIVE_SUFFIX = new Set(['ago', 'fa', 'atrás', 'atras', 'назад', '前', '전']);

export function extractUploadAgeDays(text) {
  const s = String(text).trim();
  if (!/\d/.test(s)) return NaN;

  const stripped = s.replace(/^[^\d]+/, '');
  if (!stripped) return NaN;

  const numMatch = stripped.match(/^([\d.,]+)/);
  if (!numMatch) return NaN;

  const numStr = numMatch[1];
  const normalized = normalizeNumStr(numStr);
  const base = parseFloat(normalized);
  if (isNaN(base) || base < 0) return NaN;

  const afterNum = stripped.slice(numMatch[0].length);
  const unitMatch = afterNum.match(TIME_UNIT_ANCHORED);
  if (!unitMatch) return NaN;

  const multiplier = TIME_UNIT_DAYS[unitMatch[1].toLowerCase()];
  if (!multiplier) return NaN;

  const tail = afterNum.slice(unitMatch[0].length).trim();
  if (tail) {
    const firstToken = tail.split(/\s+/)[0].replace(/[.,!?;:]+$/, '').toLowerCase();
    if (!RELATIVE_SUFFIX.has(firstToken)) return NaN;
  }

  return base * multiplier;
}

export function resolveUploadAgeFromSpans(spans) {
  let last = null;
  for (const span of spans) {
    const text = (span.textContent || '').trim();
    for (const part of text.split(/[·•]/)) {
      const ageDays = extractUploadAgeDays(part.trim());
      if (!isNaN(ageDays) && ageDays >= 0) {
        last = { ageDays, span };
      }
    }
  }
  return last;
}
