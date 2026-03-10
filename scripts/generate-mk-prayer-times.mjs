import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const YEARS = [2025, 2026];
const CSV_HEADER = ['date', 'imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const BASE_URL = 'https://muslimani-ideal.org/api/times';
const CITIES = [
  { key: 'mk', cityId: 'skopje', country: 'mk', exportName: 'SKOPJE_PRAYER_ROWS' },
  { key: 'al', cityId: 'tirana', country: 'al', exportName: 'TIRANA_PRAYER_ROWS' },
  { key: 'xk', cityId: 'prishtina', country: 'xk', exportName: 'PRISHTINA_PRAYER_ROWS' },
];

function sortRowsByDate(a, b) {
  return a.date.localeCompare(b.date);
}

async function fetchYear(year) {
  const [country] = process.argv.slice(2);
  const url = `${BASE_URL}/${year}?country=${country}&token=test&location=20,20`;
  const requestOptions = {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json,text/plain,*/*',
    },
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${year}: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    const fallback = execFileSync('curl', ['-fsSL', '-A', 'Mozilla/5.0', url], {
      encoding: 'utf8',
    });
    return JSON.parse(fallback);
  }
}

async function main() {
  for (const city of CITIES) {
    const outputDir = path.join(process.cwd(), 'data', 'prayer-times', city.key);
    fs.mkdirSync(outputDir, { recursive: true });

    const allRows = [];

    for (const year of YEARS) {
      process.argv[2] = city.country;
      const json = await fetchYear(year);
      const timings = json.timings ?? {};
      const yearRows = Object.entries(timings).map(([date, values]) => ({
        date,
        imsak: values.imsak,
        fajr: values.fajr,
        sunrise: values.sunrise,
        dhuhr: values.dhuhr,
        asr: values.asr,
        maghrib: values.maghrib,
        isha: values.isha,
      })).sort(sortRowsByDate);

      allRows.push(...yearRows);

      const csv = [
        CSV_HEADER.join(','),
        ...yearRows.map((row) => CSV_HEADER.map((key) => row[key]).join(',')),
      ].join('\n');

      fs.writeFileSync(path.join(outputDir, `${city.cityId}-${year}.csv`), `${csv}\n`);
    }

    const generatedModule = `export interface LocalPrayerCsvRow {\n  date: string;\n  imsak: string;\n  fajr: string;\n  sunrise: string;\n  dhuhr: string;\n  asr: string;\n  maghrib: string;\n  isha: string;\n}\n\nexport const ${city.exportName}: LocalPrayerCsvRow[] = ${JSON.stringify(allRows.sort(sortRowsByDate), null, 2)};\n`;

    fs.writeFileSync(path.join(outputDir, `${city.cityId}.generated.ts`), generatedModule);

    console.log(`Generated ${allRows.length} rows for ${city.cityId}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
