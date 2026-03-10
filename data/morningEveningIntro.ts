import type { Language } from '@/constants/translations';

export type LocalizedText = Record<Language, string>;

export interface MorningEveningIntro {
  arabic: string;
  transliteration: string;
  translation: LocalizedText;
  note: LocalizedText;
}

export const MORNING_EVENING_INTRO: MorningEveningIntro = {
  arabic:
    'اَلْحَمْدُ لِلّٰهِ وَحْدَهُ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى مَنْ لَا نَبِيَّ بَعْدَهُ',
  transliteration:
    "Elhamdu lil-lahi vahdeh, ves-salatu ves-selamu ala men la nebijje ba'deh.",
  translation: {
    sq: "Falënderimi i takon vetëm Allahut, ndërsa mëshira dhe paqja qofshin mbi atë pas të cilit nuk ka më pejgamber, Muhammedin (s.a.v.s.).",
    mk: 'Благодарноста му припаѓа само на Аллах, а милоста и мирот нека бидат врз оној по кого нема повеќе пратеник, Мухаммед (с.а.в.с.).',
    tr: "Hamd yalnız Allah'a mahsustur. Rahmet ve selam, kendisinden sonra peygamber olmayan Muhammed'in (s.a.v.) üzerine olsun.",
  },
  note: {
    sq: 'Transmetohet nga Enesi se Pejgamberi (s.a.v.s.) ka thënë se të ulesh me njerëz që e përmendin Allahun prej sabahut deri sa të lind dielli, apo prej ikindisë deri sa të perëndojë dielli, është më e dashur për të se sa të lirojë katër robër. Ebu Davudi, nr. 3667; Albani e ka vlerësuar hadithin hasen.',
    mk: 'Од Енес се пренесува дека Пратеникот (с.а.в.с.) рекол дека седењето со луѓе кои го спомнуваат Аллах од сабах до изгрејсонце, или од икиндија до зајдисонце, му е помило отколку да ослободи четири робови. Ебу Давуд, бр. 3667; Албани го оценил хадисот како хасен.',
    tr: "Enes'ten rivayet edildiğine göre Rasulullah (s.a.v.), sabah namazından güneş doğuncaya kadar veya ikindi namazından güneş batıncaya kadar Allah'ı zikreden insanlarla oturmanın, dört köle azat etmekten daha sevimli olduğunu buyurmuştur. Ebu Davud, no: 3667; Albani hadisi hasen kabul etmiştir.",
  },
};
