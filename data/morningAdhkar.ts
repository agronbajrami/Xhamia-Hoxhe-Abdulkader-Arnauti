import type { LocalizedText } from './morningEveningIntro';

export interface LocalizedAdhkarItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: LocalizedText;
  repeat: number;
  source: string;
}

const t = (sq: string, mk: string, tr: string): LocalizedText => ({ sq, mk, tr });

export const MORNING_ADHKAR_ITEMS: LocalizedAdhkarItem[] = [
  {
    id: 'morning-1',
    arabic:
      'اللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Ajetul Kursija (El-Bekare: 255)',
    translation: t(
      "All-llahu është Një, s'ka Zot tjetër përveç Atij, Ai është Mbikëqyrës i përhershëm dhe i përjetshëm. Atë nuk e zë as kotja as gjumi. Gjithçka që është në qiej dhe në tokë është vetëm e Tij. Kursija e Tij përfshin qiejt dhe tokën. Ai është më i Larti, më i Madhi.",
      'Аллах е Еден, нема друго божество освен Него. Тој е Вечно Живиот и Одржувачот на сè. Не Го обзема ни дремка ни сон. Сè што е на небесата и на земјата е Негово. Неговиот Курси ги опфаќа небесата и земјата. Тој е Возвишениот, Великиот.',
      "Allah birdir, O'ndan başka ilah yoktur. O, Hayy'dır, Kayyum'dur. O'nu ne uyuklama ne de uyku tutar. Göklerde ve yerde ne varsa O'nundur. O'nun Kürsüsü gökleri ve yeri kuşatmıştır. O, Yüce ve Çok Büyüktür."
    ),
    repeat: 1,
    source: 'El-Bekare 255',
  },
  {
    id: 'morning-2',
    arabic:
      'قُلْ هُوَ اللّٰهُ أَحَدٌ ۝ اللّٰهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ\n\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ\n\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration:
      "Suret: Kul huvall-llahu ehad, Kul e'udhu bi Rabbil-felek, Kul e'udhu bi Rabbin-nas.",
    translation: t(
      'Lexohen suret Ihlas, Felek dhe Nas, nga tri herë.',
      'Се читаат сурите Ихлас, Фелек и Нас, по три пати.',
      'İhlas, Felak ve Nas sureleri üçer defa okunur.'
    ),
    repeat: 3,
    source: 'Ebu Davud, Tirmidhi',
  },
  {
    id: 'morning-3',
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا اليَوْمِ ، وَخَيْرَ مَا بَعْدَهُ ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا اليَوْمِ وَشَرِّ مَا بَعْدَهُ ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration: 'Asbahna ve asbaha el-Mulku lil-lah vel-hamdulil-lah...',
    translation: t(
      'E arritëm mëngjesin; e gjithë pasuria i takon Allahut; falënderimi është për Allahun. O Zot, kërkoj prej Teje të mirën e kësaj dite dhe të ditëve pas saj; kërkoj mbrojtjen Tënde nga e liga e kësaj dite dhe e ditëve pas saj.',
      'Го дочекавме утрото; целото владеење му припаѓа на Аллах и благодарноста е за Аллах. Господару, ја барам од Тебе добрината на овој ден и на деновите по него; барам заштита од злото на овој ден и од деновите по него.',
      "Sabaha erdik; bütün mülk Allah'ındır ve hamd Allah'a aittir. Rabbim, bu günün ve bundan sonrakilerin hayrını Senden isterim; bu günün ve bundan sonrakilerin şerrinden Sana sığınırım."
    ),
    repeat: 1,
    source: 'Muslim 4/2088',
  },
  {
    id: 'morning-4',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: "All-llahumme bike asbahna ve bike emsejna ve bike nahja ve bike nemutu ve ilejken-nushur.",
    translation: t(
      'O Zot im, me emrin Tënd e arrijmë mëngjesin dhe mbrëmjen; me emrin Tënd ngjallemi dhe me emrin Tënd vdesim, dhe te Ti është ringjallja.',
      'О Господару мој, со Тебе го дочекуваме утрото и вечерта; со Тебе живееме и со Тебе умираме, а кај Тебе е воскресението.',
      "Allah'ım, Seninle sabaha ve akşama ereriz; Seninle yaşar ve Seninle ölürüz; dönüş ve diriliş Sanadır."
    ),
    repeat: 1,
    source: 'Tirmidhi, Ebu Davud',
  },
  {
    id: 'morning-5',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ',
    transliteration: "All-llahumme ente Rabbi la Ilahe il-la ente...",
    translation: t(
      'O Allah, Ti je Zoti im, nuk ka të adhuruar tjetër përveç Teje. Ti më ke krijuar dhe unë jam robi Yt. Kërkoj mbrojtjen Tënde nga e keqja që kam vepruar. I pranoj begatitë e Tua dhe i pranoj mëkatet e mia, andaj më fal, sepse mëkatet nuk i fal askush tjetër përveç Teje.',
      'О Аллах, Ти си мојот Господар, нема друго божество освен Тебе. Ти ме создаде и јас сум Твој роб. Барам заштита од злото што сум го направил. Ги признавам Твоите благодети и моите гревови, па прости ми, бидејќи никој освен Тебе не ги простува гревовите.',
      "Allah'ım, Sen benim Rabbimsin; Senden başka ilah yoktur. Beni Sen yarattın ve ben Senin kulunum. Yaptığım kötülüklerin şerrinden Sana sığınırım. Bana verdiğin nimetleri ve günahlarımı itiraf ediyorum; beni bağışla, çünkü günahları Senden başka kimse bağışlayamaz."
    ),
    repeat: 1,
    source: 'Buhari 7/150',
  },
  {
    id: 'morning-6',
    arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration: 'All-llahumme inni asbahtu ush-hiduke...',
    translation: t(
      'O Zoti im, u gdhiva duke të dëshmuar Ty, bartësit e Arshit Tënd, melaiket e Tua dhe të gjitha krijesat e Tua, se vërtet Ti je Allahu, i Vetëm dhe i pashoq, dhe se Muhammedi është robi dhe i dërguari Yt.',
      'О Господару мој, го дочекав утрото сведочејќи за Тебе, за носителите на Твојот Арш, за Твоите ангели и за сите Твои созданија, дека Ти си Аллах, Единствениот без сопатник, и дека Мухаммед е Твој роб и Пратеник.',
      "Allah'ım, sabaha erdim; Seni, Arşını taşıyanları, meleklerini ve bütün yaratıklarını şahit tutuyorum ki Sen Allah'sın, teksin ve ortağın yoktur; Muhammed de Senin kulun ve Rasulündür."
    ),
    repeat: 4,
    source: 'Ebu Davud, Nesai',
  },
  {
    id: 'morning-7',
    arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: "All-llahumme ma asbaha bi min ni'metin...",
    translation: t(
      'O Zoti im, çdo begati që më ka arritur mua ose ndonjërit prej krijesave të Tua këtë mëngjes është vetëm prej Teje, i Vetëm dhe i pashoq. Ty të qoftë lavdërimi dhe falënderimi.',
      'О Господару мој, секоја благодет што ме стигнала мене или некого од Твоите созданија ова утро е само од Тебе, Единствениот без сопатник. Тебе Ти припаѓа пофалбата и благодарноста.',
      "Allah'ım, bu sabah bana veya yaratıklarından herhangi birine ulaşan her nimet yalnızca Sendendir. Sen teksin, ortağın yoktur. Hamd de şükür de Sana aittir."
    ),
    repeat: 1,
    source: 'Ebu Davud',
  },
  {
    id: 'morning-8',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي لاَ إِلَهَ إِلاَّ أَنْتَ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ لاَ إِلَهَ إِلاَّ أَنْتَ',
    transliteration: 'All-llahumme afini fi bedeni...',
    translation: t(
      'O Zoti im, më jep shëndet në trupin tim, në të dëgjuarit tim dhe në të pamurit tim. Nuk ka të adhuruar tjetër përveç Teje. O Zoti im, kërkoj mbrojtjen Tënde nga kufri, varfëria dhe nga dënimi i varrit.',
      'О Господару мој, подари ми здравје во телото, слухот и видот. Нема друго божество освен Тебе. Барам заштита од неверство, сиромаштија и од казната на гробот.',
      "Allah'ım, bedenime, işitmeme ve görmeme sağlık ver. Senden başka ilah yoktur. Allah'ım, küfürden, fakirlikten ve kabir azabından Sana sığınırım."
    ),
    repeat: 3,
    source: 'Ebu Davud, Ahmed',
  },
  {
    id: 'morning-9',
    arabic: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'HasbijAll-llahu la Ilahe il-la hu, alejhi tevekkeltu ve Huve Rabbul-arshil-adhim.',
    translation: t(
      "Më mjafton mua Allahu; s'ka të adhuruar tjetër përveç Tij. Tek Ai jam mbështetur dhe Ai është Zoti i Arshit të Madh.",
      'Аллах ми е доволен; нема друго божество освен Него. На Него се потпирам и Тој е Господарот на Големиот Арш.',
      "Bana Allah yeter; O'ndan başka ilah yoktur. O'na tevekkül ettim ve O büyük Arş'ın Rabbidir."
    ),
    repeat: 7,
    source: 'Ibn Sunni, Ebu Davud',
  },
  {
    id: 'morning-10',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration: "All-llahumme inni es'elukel-afve vel-afijeh...",
    translation: t(
      'O Zoti im, kërkoj nga Ti falje dhe mbrojtje në këtë botë dhe në Ahiret. Më fal dhe më mbro në fenë time, jetën time, familjen time dhe pasurinë time. Më ruaj nga çdo anë dhe mos më lër të shkatërrohem nga poshtë meje.',
      'О Господару мој, барам од Тебе прошка и заштита на овој и на другиот свет. Прости ми и чувај ме во верата, животот, семејството и имотот. Заштити ме од сите страни и не дозволувај да бидам уништен одоздола.',
      "Allah'ım, dünya ve ahirette affını ve korumanı istiyorum. Dinimde, hayatımda, ailemde ve malımda beni bağışla ve koru. Beni her yönden muhafaza et ve altımdan helak olmaktan koru."
    ),
    repeat: 1,
    source: 'Ebu Davud, Ibn Maxheh',
  },
  {
    id: 'morning-11',
    arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    transliteration: 'All-llahumme alime-l-gajbi vesh-shehadeti...',
    translation: t(
      'O Zoti im, Ti je Njohësi i së fshehtës dhe së dukshmes, Krijues i qiejve dhe i tokës, Zot i çdo sendi dhe Sundues i tij. Kërkoj mbrojtjen Tënde nga e keqja e vetes sime dhe nga e keqja e djallit.',
      'О Господару мој, Ти си Познавач на скриеното и видливото, Создател на небесата и земјата, Господар и Владетел на сè. Барам заштита од злото на мојата душа и од злото на шејтанот.',
      "Allah'ım, gaybı ve görüneni bilen, gökleri ve yeri yaratan, her şeyin Rabbi ve sahibi Sensin. Nefsimin şerrinden ve şeytanın şerrinden Sana sığınırım."
    ),
    repeat: 1,
    source: 'Tirmidhi, Ebu Davud',
  },
  {
    id: 'morning-12',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الارْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismil-lahil-ledhi la jedurru me'a ismihi shej'un...",
    translation: t(
      "Me emrin e Allahut pranë emrit të të Cilit nuk bën dëm asgjë në tokë e as në qiell; Ai dëgjon shumë dhe di çdo send.",
      'Во името на Аллах, со Чие име ништо не може да наштети ни на земјата ни на небото; Тој е Се-Слушач, Се-Знаечки.',
      "Yerde ve gökte hiçbir şeyin, O'nun ismiyle birlikte zarar veremeyeceği Allah'ın adıyla. O, her şeyi işiten ve bilendir."
    ),
    repeat: 3,
    source: 'Ebu Davud, Tirmidhi',
  },
  {
    id: 'morning-13',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلاَمِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا',
    transliteration: 'Reditu bil-lahi Rabben ve bil-Islami dinen ve bi Muhammedin nebijjen.',
    translation: t(
      'Jam i kënaqur që Zoti im është Allahu, feja ime është Islami dhe Pejgamberi im është Muhammedi.',
      'Задоволен сум мојот Господар да е Аллах, мојата вера да е Исламот и мојот Пратеник да е Мухаммед.',
      "Rabbim olarak Allah'tan, din olarak İslam'dan ve peygamber olarak Muhammed'den razı oldum."
    ),
    repeat: 3,
    source: 'Ahmed, Ebu Davud',
  },
  {
    id: 'morning-14',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: "Ja Hajju ja Kajjumu bi rahmetike estegithu...",
    translation: t(
      'O i Gjallë përgjithmonë, O Mbikëqyrës i çdo gjëje, me mëshirën Tënde kërkoj ndihmë. Ma përmirëso tërë gjendjen time dhe mos më lër të mbështetem në veten time as sa një lëvizje syri.',
      'О Вечно Жив, О Одржувач на сè, со Твојата милост барам помош. Поправи ја целата моја состојба и не ме препуштај на самиот себе ни колку трепкање со окото.',
      "Ey daima diri olan, ey her şeyi ayakta tutan! Rahmetinle yardım istiyorum. Tüm halimi düzelt ve beni göz açıp kapayıncaya kadar bile nefsime bırakma."
    ),
    repeat: 1,
    source: 'Hakim 1/545',
  },
  {
    id: 'morning-15',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ',
    transliteration: 'Asbahna ve asbahal-Mulku lil-lahi Rabbil-alemin...',
    translation: t(
      'E arritëm mëngjesin dhe e tërë pasuria i takon Allahut, Zotit të botërave. O Zoti im, kërkoj mirësinë e kësaj dite, dritën, ndihmën, bereqetin dhe udhëzimin e saj; kërkoj mbrojtje nga e keqja e saj dhe e asaj që vjen pas saj.',
      'Го дочекавме утрото и целото владеење му припаѓа на Аллах, Господарот на световите. Господару, ја барам добрината, светлината, помошта, благословот и упатството на овој ден; барам заштита од неговото зло и од злото што доаѓа по него.',
      "Sabaha erdik ve bütün mülk âlemlerin Rabbi Allah'ındır. Rabbim, bu günün hayrını, nurunu, yardımını, bereketini ve hidayetini isterim; onun şerrinden ve sonrasının şerrinden Sana sığınırım."
    ),
    repeat: 1,
    source: 'Ebu Davud 4/322',
  },
  {
    id: 'morning-16',
    arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلامِ وَعَلَى كَلِمَةِ الإِخْلاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
    transliteration: 'Asbahna ala fitretil-Islam...',
    translation: t(
      'E arritëm mëngjesin në natyrshmërinë islame, në fjalën e sinqertë, në fenë e Pejgamberit tonë Muhammed dhe në fenë e Ibrahimit, i cili ishte besimdrejtë dhe musliman.',
      'Го дочекавме утрото врз исламската природност, врз зборот на искреноста, врз верата на нашиот Пратеник Мухаммед и врз верата на Ибрахим, кој беше исправен и муслиман.',
      "Sabaha İslam fıtratı, ihlas kelimesi, Peygamberimiz Muhammed'in dini ve İbrahim'in doğru ve Müslüman milleti üzere erdik."
    ),
    repeat: 1,
    source: 'Ahmed, Ibn Sunni',
  },
  {
    id: 'morning-17',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAll-llahi ve bihamdihi.',
    translation: t(
      'I Lartësuar qoftë Allahu, Atij të Cilit i takon lavdërimi.',
      'Возвишен нека е Аллах, Нему му припаѓа пофалбата.',
      "Allah eksikliklerden münezzehtir; hamd O'nadır."
    ),
    repeat: 100,
    source: 'Muslim 4/2071',
  },
  {
    id: 'morning-18',
    arabic: 'لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilahe il-lAll-llahu vahdehu la sherike leh...',
    translation: t(
      "S'ka të adhuruar përveç Allahut, Një dhe i pashoq. Atij i takon sundimi dhe lavdërimi. Ai është i plotfuqishëm mbi çdo send.",
      'Нема друго божество освен Аллах, Едниот без сопатник. Нему му припаѓа владеењето и пофалбата. Тој е Се-моќен над сè.',
      "Allah'tan başka ilah yoktur; O tektir ve ortağı yoktur. Mülkün sahibi de hamdin sahibi de O'dur. O her şeye gücü yetendir."
    ),
    repeat: 10,
    source: 'Ebu Davud, Ibn Maxheh',
  },
  {
    id: 'morning-19',
    arabic: 'لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilahe il-lAll-llahu vahdehu la sherike leh...',
    translation: t(
      "S'ka të adhuruar përveç Allahut, Një dhe i pashoq. Atij i takon sundimi dhe lavdërimi. Ai është i plotfuqishëm mbi çdo send.",
      'Нема друго божество освен Аллах, Едниот без сопатник. Нему му припаѓа владеењето и пофалбата. Тој е Се-моќен над сè.',
      "Allah'tan başka ilah yoktur; O tektir ve ortağı yoktur. Mülkün sahibi de hamdin sahibi de O'dur. O her şeye gücü yetendir."
    ),
    repeat: 100,
    source: 'Buhari, Muslim',
  },
  {
    id: 'morning-20',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
    transliteration: "SubhanAll-llahi ve bihamdihi adede halkihi...",
    translation: t(
      'I Madhëruar qoftë Allahu dhe Atij i takon lavdërimi, aq sa është numri i krijesave të Tij, aq sa është kënaqësia e Tij, aq sa është pesha e Arshit të Tij dhe aq sa janë fjalët e Tij.',
      'Возвишен нека е Аллах и Нему му припаѓа пофалбата, онолку колку што е бројот на Неговите созданија, Неговото задоволство, тежината на Неговиот Арш и мастилото на Неговите зборови.',
      "Allah eksikliklerden münezzehtir ve hamd O'nadır; yarattıklarının sayısınca, razı olacağı kadar, Arş'ının ağırlığınca ve kelimelerinin mürekkebi kadar."
    ),
    repeat: 3,
    source: 'Muslim 4/2090',
  },
  {
    id: 'morning-21',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلا مُتَقَبَّلاً',
    transliteration: "All-llahumme inni es'eluke ilmen nafi'an ve rizkan tajjiben ve amelen mutekabbelen.",
    translation: t(
      "O Zoti im, të lutem më jep dituri të dobishme, furnizim të mirë dhe vepra të pranuara.",
      'О Господару мој, Те молам да ми дадеш корисно знаење, добар ризк и прифатени дела.',
      "Allah'ım, Senden faydalı ilim, güzel rızık ve kabul edilmiş amel istiyorum."
    ),
    repeat: 1,
    source: 'Ibn Maxheh 925',
  },
  {
    id: 'morning-22',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Estagfirullahe ve etubu ilejhi.',
    translation: t(
      'Kërkoj faljen e Allahut dhe tek Ai pendohem.',
      'Барам прошка од Аллах и кај Него се каам.',
      "Allah'tan bağışlanma diliyor ve O'na tevbe ediyorum."
    ),
    repeat: 100,
    source: 'Buhari',
  },
  {
    id: 'morning-23',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: 'All-llahumme sal-li ve sel-lim ala nebijjina Muhammed.',
    translation: t(
      'O Allah, dërgo salavate dhe paqe mbi pejgamberin tonë Muhammed.',
      'О Аллах, испрати благослов и мир врз нашиот пратеник Мухаммед.',
      "Allah'ım, Peygamberimiz Muhammed'e salat ve selam eyle."
    ),
    repeat: 10,
    source: 'Salavat',
  },
];
