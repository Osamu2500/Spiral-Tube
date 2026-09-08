const SUFFIX_MULTIPLIERS = {
  k: 1e3,
  m: 1e6,
  mln: 1e6,
  mio: 1e6,
  mn: 1e6,
  b: 1e9,
  md: 1e9,
  万: 1e4,
  億: 1e8,
  亿: 1e8,
  만: 1e4,
  억: 1e8,
  тыс: 1e3,
  млн: 1e6,
  млрд: 1e9,
  mi: 1e3,
  mil: 1e3,
  rb: 1e3,
  lakh: 1e5,
  cr: 1e7,
};

const SUFFIX_REGEX = new RegExp(
  '(' +
    Object.keys(SUFFIX_MULTIPLIERS)
      .sort((a, b) => b.length - a.length)
      .map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|') +
    ')\\.?',
  'i',
);

const VIEW_COUNT_LABELS_BY_LOCALE = {
  am: ['ዕይታዎች'],
  ar: ['مشاهدات', 'مشاهدة'],
  as: ['টা ভিউ'],
  be: ['прагляд', 'праглядаў', 'прагляды'],
  bg: ['показвания'],
  bn: ['টি ভিউ'],
  el: ['προβολές'],
  fa: ['بازدید'],
  gu: ['જોવાયાની સંખ્યા'],
  hi: ['व्यू'],
  hy: ['դիտում'],
  id: ['x ditonton'],
  iw: ['צפיות'],
  ja: ['回視聴'],
  ka: ['ნახვა'],
  kk: ['рет көрілді'],
  kn: ['ವೀಕ್ಷಣೆಗಳು'],
  ky: ['жолу көрүлдү'],
  mk: ['прегледи'],
  ml: ['കാഴ്‌ച'],
  mn: ['үзэлт'],
  mr: ['व्ह्यू'],
  ne: ['भ्यु'],
  or: ['ଟି ଭ୍ୟୁ'],
  pa: ['ਵਾਰ ਦੇਖਿਆ'],
  ro: ['de vizionări'],
  ru: ['просмотр', 'просмотра', 'просмотров'],
  sr: ['преглед', 'прегледа'],
  ta: ['பார்வைகள்'],
  te: ['వీక్షణలు'],
  uk: ['перегляд', 'перегляди', 'переглядів'],
  ur: ['ملاحظات'],
  vi: ['lượt xem'],
  'zh-CN': ['次观看'],
};

function normalizeViewLabel(label) {
  return String(label).replace(/\s+/g, ' ').trim();
}

const VIEW_COUNT_LABELS = new Set(
  Object.keys(VIEW_COUNT_LABELS_BY_LOCALE).reduce(
    (all, locale) =>
      all.concat(VIEW_COUNT_LABELS_BY_LOCALE[locale].map(normalizeViewLabel)),
    [],
  ),
);

const VIEW_COUNT_PREFIXES_BY_LOCALE = {
  km: ['ចំនួនមើល', ''],
  ko: ['조회수', '회'],
  lo: ['ຍອດເບິ່ງ', 'ເທື່ອ'],
  my: ['ကြည့်ရှုမှု', ''],
  si: ['බැලීම්', ''],
  sw: ['Kutazamwa:', ''],
  th: ['การดู', 'ครั้ง'],
  'zh-HK': ['收看次數：', '次'],
  'zh-TW': ['觀看次數：', '次'],
};

const VIEW_COUNT_PREFIXES = Object.keys(VIEW_COUNT_PREFIXES_BY_LOCALE)
  .map(locale => VIEW_COUNT_PREFIXES_BY_LOCALE[locale])
  .sort((a, b) => b[0].length - a[0].length);

const BIDI_MARKS_REGEX = /[\u200e\u200f\u061c\u2066-\u2069]/g;

export function extractNumberAndSuffix(input) {
  const s = String(input)
    .trim()
    .replace(/\s+(?=\d)/g, '');
  const numMatch = s.match(/^([\d.,]+)/);
  if (!numMatch) return { numStr: '', suffix: '', remainder: s };

  const numStr = numMatch[1];
  const afterNum = s.slice(numMatch[0].length).trimStart();

  const suffixMatch = afterNum.match(SUFFIX_REGEX);
  if (suffixMatch && afterNum.indexOf(suffixMatch[0]) === 0) {
    const charAfterMatch = afterNum[suffixMatch[0].length];
    const lastSuffixChar = suffixMatch[1][suffixMatch[1].length - 1];
    if (charAfterMatch && /[a-z]/i.test(lastSuffixChar) && /[a-z]/i.test(charAfterMatch)) {
      return { numStr, suffix: '', remainder: afterNum.trim() };
    }
    const suffix = suffixMatch[1].toLowerCase();
    const remainder = afterNum.slice(suffixMatch[0].length).trim();
    return { numStr, suffix, remainder };
  }

  return { numStr, suffix: '', remainder: afterNum.trim() };
}

export function normalizeNumStr(numStr, hasSuffix = false) {
  const dots = (numStr.match(/\./g) || []).length;
  const commas = (numStr.match(/,/g) || []).length;

  if (dots > 0 && commas > 0) {
    const lastDot = numStr.lastIndexOf('.');
    const lastComma = numStr.lastIndexOf(',');
    if (lastDot > lastComma) {
      return numStr.replace(/,/g, '');
    } else {
      return numStr.replace(/\./g, '').replace(',', '.');
    }
  }

  if (dots > 1) return numStr.replace(/\./g, '');
  if (commas > 1) return numStr.replace(/,/g, '');

  if (!hasSuffix) return numStr.replace(/[.,]/g, '');
  if (commas === 1) return numStr.replace(',', '.');

  return numStr;
}

export function parseToNumber(input) {
  const { numStr, suffix } = extractNumberAndSuffix(input);
  if (!numStr) return NaN;

  const normalized = normalizeNumStr(numStr, Boolean(suffix));
  const base = parseFloat(normalized);
  if (isNaN(base)) return NaN;

  const multiplier = suffix ? SUFFIX_MULTIPLIERS[suffix] || 1 : 1;
  return base * multiplier;
}

export function extractViewCount(text) {
  const s = String(text).replace(BIDI_MARKS_REGEX, '').trim();
  if (!/\d/.test(s)) return NaN;

  let body = s;
  let requiredLabel = null;
  for (const [prefix, label] of VIEW_COUNT_PREFIXES) {
    if (body.startsWith(prefix)) {
      body = body.slice(prefix.length).trim();
      requiredLabel = label;
      break;
    }
  }

  const { numStr, suffix, remainder } = extractNumberAndSuffix(body);
  if (!numStr) return NaN;

  const normalized = normalizeNumStr(numStr, Boolean(suffix));
  const base = parseFloat(normalized);
  if (isNaN(base)) return NaN;

  if (suffix && SUFFIX_MULTIPLIERS[suffix]) {
    return { views: base * SUFFIX_MULTIPLIERS[suffix], confidence: 'high' };
  }

  const label = normalizeViewLabel(remainder);

  if (requiredLabel !== null) {
    if (label === normalizeViewLabel(requiredLabel)) {
      return { views: base, confidence: 'high' };
    }
    return NaN;
  }

  if (!remainder) {
    return { views: base, confidence: 'low' };
  }

  if (VIEW_COUNT_LABELS.has(label)) {
    return { views: base, confidence: 'high' };
  }

  const words = remainder.split(/\s+/).filter(Boolean);
  if (words.length === 1 && /^[\p{Script=Latin}]+$/u.test(words[0])) {
    return { views: base, confidence: 'low' };
  }

  return NaN;
}

export function resolveViewsFromSpans(spans) {
  let lowCandidate = null;
  let anchorSpan = null;

  for (const span of spans) {
    const text = (span.textContent || '').trim();
    const result = extractViewCount(text);
    if (result && typeof result === 'object') {
      if (result.confidence === 'high') {
        return { views: result.views, span };
      }
      if (!lowCandidate) {
        lowCandidate = result.views;
        anchorSpan = span;
      }
    }
  }

  if (lowCandidate !== null) {
    return { views: lowCandidate, span: anchorSpan };
  }
  return null;
}
