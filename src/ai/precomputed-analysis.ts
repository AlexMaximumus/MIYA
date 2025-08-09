

/**
 * @fileoverview This file contains pre-computed analysis for Japanese sentences
 * to avoid making live AI calls for static content, improving performance and
 * reducing costs.
 */

export interface WordAnalysis {
    word: string;
    furigana: string;
    translation: string;
    partOfSpeech: string;
}

export interface JapaneseAnalysisOutput {
    sentence: WordAnalysis[];
    fullTranslation: string;
}

export const termExplanations = {
    'существительное': "Отвечает на вопрос 'кто?' или 'что?'. Обозначает предмет, человека, место или явление.",
    'частица': "Служебное слово. Связывает слова в предложении, указывает на их роль (например, кто что делает) или добавляет эмоциональные оттенки.",
    'частица (тема)': "Частица 'は' (wa) указывает на тему всего предложения. Это то, о чём мы будем говорить.",
    'прилагательное': "Отвечает на вопрос 'какой?'. Описывает свойство или качество предмета (например, 'красивый', 'хороший').",
    'связка': "Слово 'です' (desu). Ставится в конце предложения, чтобы сделать его вежливым. Можно перевести как 'есть' или 'является'.",
    'частица (не так ли?)': "Частица 'ね' (ne) ставится в конце предложения для поиска согласия собеседника, смягчения утверждения. Похоже на русское '...не так ли?', '...да?', '...ведь?'.",
    'местоимение': "Заменяет существительное, чтобы не повторяться. Примеры: 'я', 'ты', 'он', 'это', 'тот'.",
    'частица (вопрос)': "Частица 'か' (ka) ставится в самом конце предложения и превращает его в вопрос. Знак '?' при этом не нужен.",
    'частица (принадлежность)': "Частица 'の' (no) указывает на принадлежность. Например, 'моя книга' (watashi no hon).",
    'указательное местоимение': "Указывает на конкретный предмет или человека в пространстве. Например: 'этот', 'тот', 'тот, который далеко'.",
    'существительное (вежл.)': "Вежливая форма существительного, используется при обращении к уважаемым людям или в формальной обстановке. Например, 'かた' (kata) вместо 'ひと' (hito) для слова 'человек'.",
    'отрицательная частица': "Частица 'では' (dewa) или 'じゃ' (ja) используется для построения отрицательной формы сказуемого. Например, 'не студент' (gakusei dewa arimasen).",
    'вспомогательный глагол': "Помогает основному глаголу или связке образовать нужную форму, например, отрицание 'ありません' (arimasen) — 'не является'.",
    'знак препинания': "Символы для разделения предложений и слов, такие как точка (。) или запятая (、).",
    'вопросительное местоимение': "Слово, которое используется для задания вопроса. Например, 'кто?' (だれ/どなた) или 'что?' (なに/なん).",
    'вопросительная частица': "Частица 'か' (ka), которая ставится в конце предложения, чтобы сделать его вопросительным.",
    'имя собственное': "Имя человека (Ямада, Танака) или название места. Пишется с большой буквы в русском переводе.",
    'суффикс вежливости': "Добавляется после имени, чтобы показать уважение. Самый известный — '～さん' (-san), аналог 'господин/госпожа'.",
    'междометие': "Короткое слово, выражающее эмоцию или реакцию. Например, 'はい' (hai) — 'да', 'いいえ' (iie) — 'нет'.",
    'выражение': "Устойчивая фраза, которая часто используется в речи. Например, 'そうです' (sou desu) — 'это так / верно'.",
    'отрицательная частица (разг.)': "Разговорный, менее формальный вариант отрицательной частицы 'では'. Используется в повседневной речи.",
    'глагол': "Обозначает действие или состояние. Например, 'идти', 'есть', 'быть'.",
    'наречие': "Описывает признак действия или другого признака. Отвечает на вопросы 'как?', 'где?', 'когда?'. Например, 'быстро', 'здесь'.",
    'числительное': "Обозначает количество или порядок предметов. Например, 'один', 'первый'.",
    'союз': "Связывает однородные члены предложения или части сложного предложения. Например, 'и', 'но', 'или'.",
    'послелог': "Аналог предлога в русском, но ставится после слова, к которому относится. Указывает на падежные отношения."
};

export const phoneticsAnalyses = {
    kame1: { sentence: [{ word: 'かめ', furigana: 'かめ', translation: 'черепаха', partOfSpeech: 'существительное' }], fullTranslation: 'черепаха' },
    kame2: { sentence: [{ word: 'かめ', furigana: 'かめ', translation: 'кувшин', partOfSpeech: 'существительное' }], fullTranslation: 'кувшин' },
    ruble: { sentence: [{ word: 'ルーブル', furigana: 'ルーブル', translation: 'рубль', partOfSpeech: 'существительное' }], fullTranslation: 'рубль' },
    line: { sentence: [{ word: 'ライン', furigana: 'ライン', translation: 'линия', partOfSpeech: 'существительное' }], fullTranslation: 'линия' },
    kai1: { sentence: [{ word: 'かい', furigana: 'かい', translation: 'моллюск', partOfSpeech: 'существительное' }], fullTranslation: 'моллюск' },
    kai2: { sentence: [{ word: 'かい', furigana: 'かい', translation: 'низший ранг', partOfSpeech: 'существительное' }], fullTranslation: 'низший ранг' },
    akai: { sentence: [{ word: 'あかい', furigana: 'あかい', translation: 'красный', partOfSpeech: 'прилагательное' }], fullTranslation: 'красный' },
    aki: { sentence: [{ word: 'あき', furigana: 'あき', translation: 'осень', partOfSpeech: 'существительное' }], fullTranslation: 'осень' },
    ika: { sentence: [{ word: 'いか', furigana: 'いか', translation: 'кальмар', partOfSpeech: 'существительное' }], fullTranslation: 'кальмар' },
    suki: { sentence: [{ word: 'すき', furigana: 'すき', translation: 'нравится', partOfSpeech: 'прилагательное' }], fullTranslation: 'нравится' },
    deshita: { sentence: [{ word: 'でした', furigana: 'でした', translation: 'был (связка)', partOfSpeech: 'связка' }], fullTranslation: 'был' },
    tsuki: { sentence: [{ word: 'つき', furigana: 'つき', translation: 'луна', partOfSpeech: 'существительное' }], fullTranslation: 'луна' },
    desu: { sentence: [{ word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }], fullTranslation: 'есть' },
    kuni: { sentence: [{ word: '国', furigana: 'くに', translation: 'страна', partOfSpeech: 'существительное' }], fullTranslation: 'страна' },
    mizu: { sentence: [{ word: '水', furigana: 'みず', translation: 'вода', partOfSpeech: 'существительное' }], fullTranslation: 'вода' },
    akami: { sentence: [{ word: '赤み', furigana: 'あかみ', translation: 'краснота', partOfSpeech: 'существительное' }], fullTranslation: 'краснота' },
    nomimono: { sentence: [{ word: '飲み物', furigana: 'のみもの', translation: 'напитки', partOfSpeech: 'существительное' }], fullTranslation: 'напитки' },
    hayamichi: { sentence: [{ word: '早道', furigana: 'はやみち', translation: 'кратчайший путь', partOfSpeech: 'существительное' }], fullTranslation: 'кратчайший путь' },
    daigaku: { sentence: [{ word: '大学', furigana: 'だいがく', translation: 'университет', partOfSpeech: 'существительное' }], fullTranslation: 'университет' },
    hon: { sentence: [{ word: '本', furigana: 'ほん', translation: 'книга', partOfSpeech: 'существительное' }], fullTranslation: 'книга' },
    kin: { sentence: [{ word: '金', furigana: 'きん', translation: 'золото', partOfSpeech: 'существительное' }], fullTranslation: 'золото' },
    source: { sentence: [{ word: 'ソース', furigana: 'ソース', translation: 'соус', partOfSpeech: 'существительное' }], fullTranslation: 'соус' },
    oasis: { sentence: [{ word: 'オアシス', furigana: 'オアシス', translation: 'оазис', partOfSpeech: 'существительное' }], fullTranslation: 'оазис' },
    dzikki: { sentence: [{ word: 'じっき', furigana: 'じっき', translation: 'история', partOfSpeech: 'существительное' }], fullTranslation: 'история' },
    dziki: { sentence: [{ word: 'じき', furigana: 'じき', translation: 'время', partOfSpeech: 'существительное' }], fullTranslation: 'время' },
    kokki: { sentence: [{ word: '国旗', furigana: 'こっき', translation: 'государственный флаг', partOfSpeech: 'существительное' }], fullTranslation: 'государственный флаг' },
    ittai: { sentence: [{ word: 'いったい', furigana: 'いったい', translation: 'вообще, собственно', partOfSpeech: 'наречие' }], fullTranslation: 'вообще' },
    honwo: { sentence: [{ word: '本', furigana: 'ほん', translation: 'книга', partOfSpeech: 'существительное' }, { word: 'を', furigana: 'を', translation: 'частица вин. падежа', partOfSpeech: 'частица' }], fullTranslation: 'книгу' },
    yomu: { sentence: [{ word: '読', furigana: 'よ', translation: 'читать (основа)', partOfSpeech: 'глагол' }, { word: 'む', furigana: 'む', translation: 'окончание', partOfSpeech: 'суффикс' }], fullTranslation: 'читать' },
    shiroi: { sentence: [{ word: '白', furigana: 'しろ', translation: 'белый (основа)', partOfSpeech: 'прилагательное' }, { word: 'い', furigana: 'い', translation: 'окончание', partOfSpeech: 'суффикс' }], fullTranslation: 'белый' },
    hito: { sentence: [{ word: '人', furigana: 'ひと', translation: 'человек', partOfSpeech: 'существительное' }], fullTranslation: 'человек' },
    nihon: { sentence: [{ word: '日本', furigana: 'にほん', translation: 'Япония', partOfSpeech: 'существительное' }], fullTranslation: 'Япония' },
    nihongo: { sentence: [{ word: '日本語', furigana: 'にほんご', translation: 'японский язык', partOfSpeech: 'существительное' }], fullTranslation: 'японский язык' },
    sensei: { sentence: [{ word: '先生', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' }], fullTranslation: 'учитель' },
    gakusei: { sentence: [{ word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' }], fullTranslation: 'студент' },
    bungaku: { sentence: [{ word: '文学', furigana: 'ぶんがく', translation: 'литература', partOfSpeech: 'существительное' }], fullTranslation: 'литература' },
    kyou: { sentence: [{ word: 'きょう', furigana: 'きょう', translation: 'сегодня', partOfSpeech: 'существительное' }], fullTranslation: 'сегодня' },
    shu: { sentence: [{ word: 'しゅう', furigana: 'しゅう', translation: 'неделя', partOfSpeech: 'существительное' }], fullTranslation: 'неделя' },
    hiyamizu: { sentence: [{ word: 'ひやみず', furigana: 'ひやみず', translation: 'холодная вода', partOfSpeech: 'существительное' }], fullTranslation: 'холодная вода' },
    deguchi: { sentence: [{ word: '出口', furigana: 'でぐち', translation: 'выход', partOfSpeech: 'существительное' }], fullTranslation: 'дэ + кути -> дэгути' },
    monozuki: { sentence: [{ word: '物好き', furigana: 'ものずき', translation: 'любопытство', partOfSpeech: 'существительное' }], fullTranslation: 'моно + суки -> монодзуки' },
    hakko: { sentence: [{ word: '発行', furigana: 'はっこう', translation: 'издание', partOfSpeech: 'существительное' }], fullTranslation: 'хацу + ко: -> хакко:' },
    bumppo: { sentence: [{ word: '文法', furigana: 'ぶんぽう', translation: 'грамматика', partOfSpeech: 'существительное' }], fullTranslation: 'бун + хо: -> бумпо:' },
    ninzu: { sentence: [{ word: '人数', furigana: 'にんずう', translation: 'число людей', partOfSpeech: 'существительное' }], fullTranslation: 'нин + су: -> ниндзу:' },
    ippo: { sentence: [{ word: '一歩', furigana: 'いっぽ', translation: 'один шаг', partOfSpeech: 'существительное' }], fullTranslation: 'ити + хо -> иппо' },
    ongaku: { sentence: [{word: 'おんがく', furigana: 'おんがく', translation: 'музыка', partOfSpeech: 'существительное'}], fullTranslation: 'музыка'},
    tenki: { sentence: [{word: 'てんき', furigana: 'てんき', translation: 'погода', partOfSpeech: 'существительное'}], fullTranslation: 'погода'},
    genki: { sentence: [{word: 'げんき', furigana: 'げんき', translation: 'бодрый, здоровый', partOfSpeech: 'прилагательное'}], fullTranslation: 'бодрый'},
    genkan: { sentence: [{word: 'げんかん', furigana: 'げんかん', translation: 'прихожая', partOfSpeech: 'существительное'}], fullTranslation: 'прихожая'},
    ningen: { sentence: [{word: 'にんげん', furigana: 'にんげん', translation: 'человек', partOfSpeech: 'существительное'}], fullTranslation: 'человек'},
    tangutsu: { sentence: [{word: 'たんぐつ', furigana: 'たんぐつ', translation: 'ботинки', partOfSpeech: 'существительное'}], fullTranslation: 'ботинки'},
    ammari: { sentence: [{word: 'あんまり', furigana: 'あんまり', translation: 'не очень', partOfSpeech: 'наречие'}], fullTranslation: 'не очень'},
    semmon: { sentence: [{word: 'せんもん', furigana: 'せんもん', translation: 'специальность', partOfSpeech: 'существительное'}], fullTranslation: 'специальность'},
    ummei: { sentence: [{word: 'うんめい', furigana: 'うんめい', translation: 'судьба', partOfSpeech: 'существительное'}], fullTranslation: 'судьба'},
    sampo: { sentence: [{word: 'さんぽ', furigana: 'さんぽ', translation: 'прогулка', partOfSpeech: 'существительное'}], fullTranslation: 'прогулка'},
    shimpo: { sentence: [{word: 'しんぽ', furigana: 'しんぽ', translation: 'прогресс', partOfSpeech: 'существительное'}], fullTranslation: 'прогресс'},
    shinpai: { sentence: [{word: 'しんぱい', furigana: 'しんぱい', translation: 'беспокойство', partOfSpeech: 'существительное'}], fullTranslation: 'беспокойство'},
    zembu: { sentence: [{word: 'ぜんぶ', furigana: 'ぜんぶ', translation: 'всё', partOfSpeech: 'наречие'}], fullTranslation: 'всё'},
    shimbun: { sentence: [{word: 'しんぶん', furigana: 'しんぶん', translation: 'газета', partOfSpeech: 'существительное'}], fullTranslation: 'газета'},
    kantan: { sentence: [{word: 'かんたん', furigana: 'かんたん', translation: 'простой', partOfSpeech: 'прилагательное'}], fullTranslation: 'простой'},
    unten: { sentence: [{word: 'うんてん', furigana: 'うんてん', translation: 'вождение', partOfSpeech: 'существительное'}], fullTranslation: 'вождение'},
    kondo: { sentence: [{word: 'こんど', furigana: 'こんど', translation: 'в следующий раз', partOfSpeech: 'наречие'}], fullTranslation: 'в следующий раз'},
    benri: { sentence: [{word: 'べんり', furigana: 'べんり', translation: 'удобный', partOfSpeech: 'прилагательное'}], fullTranslation: 'удобный'},
    kenri: { sentence: [{word: 'けんり', furigana: 'けんり', translation: 'право', partOfSpeech: 'существительное'}], fullTranslation: 'право'},
    danchi: { sentence: [{word: 'だんち', furigana: 'だんち', translation: 'жилой комплекс', partOfSpeech: 'существительное'}], fullTranslation: 'жилой комплекс'},
    anzen: { sentence: [{word: 'あんぜん', furigana: 'あんぜん', translation: 'безопасность', partOfSpeech: 'существительное'}], fullTranslation: 'безопасность'},
    kanji: { sentence: [{word: 'かんじ', furigana: 'かんじ', translation: 'иероглиф', partOfSpeech: 'существительное'}], fullTranslation: 'иероглиф'},
    onna: { sentence: [{word: 'おんな', furigana: 'おんな', translation: 'женщина', partOfSpeech: 'существительное'}], fullTranslation: 'женщина'},
    tennen: { sentence: [{word: 'てんねん', furigana: 'てんねん', translation: 'природный', partOfSpeech: 'прилагательное'}], fullTranslation: 'природный'},
    'tenno:': { sentence: [{word: 'てんのう', furigana: 'てんのう', translation: 'император', partOfSpeech: 'существительное'}], fullTranslation: 'император'},
    annai: { sentence: [{word: 'あんない', furigana: 'あんない', translation: 'информация, ведение', partOfSpeech: 'существительное'}], fullTranslation: 'информация'},
    ammin: { sentence: [{word: 'あんみん', furigana: 'あんみん', translation: 'спокойный сон', partOfSpeech: 'существительное'}], fullTranslation: 'спокойный сон'},
    banno: { sentence: [{word: 'ばんのう', furigana: 'ばんのう', translation: 'всемогущий', partOfSpeech: 'прилагательное'}], fullTranslation: 'всемогущий'},
    fummatsu: { sentence: [{word: 'ふんまつ', furigana: 'ふんまつ', translation: 'порошок', partOfSpeech: 'существительное'}], fullTranslation: 'порошок'},
    fumman: { sentence: [{word: 'ふんまん', furigana: 'ふんまん', translation: 'возмущение', partOfSpeech: 'существительное'}], fullTranslation: 'возмущение'},
    "hon'nin": { sentence: [{word: 'ほんにん', furigana: 'ほんにん', translation: 'данное лицо', partOfSpeech: 'местоимение'}], fullTranslation: 'данное лицо'},
    kannen: { sentence: [{word: 'かんねん', furigana: 'かんねん', translation: 'идея, понятие', partOfSpeech: 'существительное'}], fullTranslation: 'идея'},
    "sen'nyu:": { sentence: [{word: 'せんにゅう', furigana: 'せんにゅう', translation: 'проникновение', partOfSpeech: 'существительное'}], fullTranslation: 'проникновение'},
    raichaku: { sentence: [{word: 'らいちゃく', furigana: 'らいちゃく', translation: 'прибытие', partOfSpeech: 'существительное'}], fullTranslation: 'прибытие'},
    raiharu: { sentence: [{word: 'らいはる', furigana: 'らいはる', translation: 'следующая весна', partOfSpeech: 'существительное'}], fullTranslation: 'следующая весна'},
    raihin: { sentence: [{word: 'らいひん', furigana: 'らいひん', translation: 'гость', partOfSpeech: 'существительное'}], fullTranslation: 'гость'},
    rakkan: { sentence: [{word: 'らっかん', furigana: 'らっかん', translation: 'оптимизм', partOfSpeech: 'существительное'}], fullTranslation: 'оптимизм'},
    riken: { sentence: [{word: 'りけん', furigana: 'りけん', translation: 'концессия', partOfSpeech: 'существительное'}], fullTranslation: 'концессия'},
    rikin: { sentence: [{word: 'りきん', furigana: 'りきん', translation: 'проценты', partOfSpeech: 'существительное'}], fullTranslation: 'проценты'},
    rikiten: { sentence: [{word: 'りきてん', furigana: 'りきてん', translation: 'точка опоры', partOfSpeech: 'существительное'}], fullTranslation: 'точка опоры'},
    ruigo: { sentence: [{word: 'るいご', furigana: 'るいご', translation: 'синоним', partOfSpeech: 'существительное'}], fullTranslation: 'синоним'},
    reigai: { sentence: [{word: 'れいがい', furigana: 'れいがい', translation: 'исключение', partOfSpeech: 'существительное'}], fullTranslation: 'исключение'},
    renzoku: { sentence: [{word: 'れんぞく', furigana: 'れんぞく', translation: 'непрерывность', partOfSpeech: 'существительное'}], fullTranslation: 'непрерывность'},
    'ro:do:': { sentence: [{word: 'ろうどう', furigana: 'ろうどう', translation: 'труд', partOfSpeech: 'существительное'}], fullTranslation: 'труд'},
    ronjutsu: { sentence: [{word: 'ろんじゅつ', furigana: 'ろんじゅつ', translation: 'изложение', partOfSpeech: 'существительное'}], fullTranslation: 'изложение'},
    'ro:nin': { sentence: [{word: 'ろうにん', furigana: 'ろうにん', translation: 'ронин', partOfSpeech: 'существительное'}], fullTranslation: 'ронин'},
    ryakuden: { sentence: [{word: 'りゃくでん', furigana: 'りゃくでん', translation: 'краткая биография', partOfSpeech: 'существительное'}], fullTranslation: 'краткая биография'},
    'ryu:ko:': { sentence: [{word: 'りゅうこう', furigana: 'りゅうこう', translation: 'мода, эпидемия', partOfSpeech: 'существительное'}], fullTranslation: 'мода'},
    'ryu:gaku': { sentence: [{word: 'りゅうがく', furigana: 'りゅうがく', translation: 'учеба за границей', partOfSpeech: 'существительное'}], fullTranslation: 'учеба за границей'},
    'ryo:gawa': { sentence: [{word: 'りょうがわ', furigana: 'りょうがわ', translation: 'оба берега', partOfSpeech: 'существительное'}], fullTranslation: 'оба берега'},
    wadai: { sentence: [{word: 'わだい', furigana: 'わだい', translation: 'тема разговора', partOfSpeech: 'существительное'}], fullTranslation: 'тема разговора'},
    warai: { sentence: [{word: 'わらい', furigana: 'わらい', translation: 'смех', partOfSpeech: 'существительное'}], fullTranslation: 'смех'},
    washi: { sentence: [{word: 'わし', furigana: 'わし', translation: 'я (старч.)', partOfSpeech: 'местоимение'}], fullTranslation: 'я'},
    wasureru: { sentence: [{word: 'わすれる', furigana: 'わすれる', translation: 'забывать', partOfSpeech: 'глагол'}], fullTranslation: 'забывать'},
    rai: { sentence: [{word: 'らい', furigana: 'らい', translation: 'гром', partOfSpeech: 'существительное'}], fullTranslation: 'гром'},
    raigetsu: { sentence: [{word: 'らいげつ', furigana: 'らいげつ', translation: 'следующий месяц', partOfSpeech: 'существительное'}], fullTranslation: 'следующий месяц'},
    raika: { sentence: [{word: 'らいか', furigana: 'らいか', translation: 'цветок сливы', partOfSpeech: 'существительное'}], fullTranslation: 'цветок сливы'},
    richi: { sentence: [{word: 'りち', furigana: 'りち', translation: 'положение', partOfSpeech: 'существительное'}], fullTranslation: 'положение'},
    rieki: { sentence: [{word: 'りえき', furigana: 'りえき', translation: 'прибыль', partOfSpeech: 'существительное'}], fullTranslation: 'прибыль'},
    rikai: { sentence: [{word: 'りかい', furigana: 'りかい', translation: 'понимание', partOfSpeech: 'существительное'}], fullTranslation: 'понимание'},
    rusu: { sentence: [{word: 'るす', furigana: 'るす', translation: 'отсутствие дома', partOfSpeech: 'существительное'}], fullTranslation: 'отсутствие дома'},
    rei: { sentence: [{word: 'れい', furigana: 'れい', translation: 'поклон, пример', partOfSpeech: 'существительное'}], fullTranslation: 'пример'},
    renga: { sentence: [{word: 'れんが', furigana: 'れんが', translation: 'кирпич', partOfSpeech: 'существительное'}], fullTranslation: 'кирпич'},
    'ro:chin': { sentence: [{word: 'ろうちん', furigana: 'ろうちん', translation: 'зарплата', partOfSpeech: 'существительное'}], fullTranslation: 'зарплата'},
    ronke: { sentence: [{word: 'ろんけ', furigana: 'ろんけ', translation: 'логический', partOfSpeech: 'прилагательное'}], fullTranslation: 'логический'},
    ryakki: { sentence: [{word: 'りゃっき', furigana: 'りゃっき', translation: 'краткая история', partOfSpeech: 'существительное'}], fullTranslation: 'краткая история'},
    'ryu:ki': { sentence: [{word: 'りゅうき', furigana: 'りゅうき', translation: 'поднятие флага', partOfSpeech: 'существительное'}], fullTranslation: 'поднятие флага'},
    'ryo:bun': { sentence: [{word: 'りょうぶん', furigana: 'りょうぶん', translation: 'территория', partOfSpeech: 'существительное'}], fullTranslation: 'территория'},
    'ryo:ri': { sentence: [{word: 'りょうり', furigana: 'りょうり', translation: 'кухня, блюдо', partOfSpeech: 'существительное'}], fullTranslation: 'кухня'},
    wani: { sentence: [{word: 'わに', furigana: 'わに', translation: 'крокодил', partOfSpeech: 'существительное'}], fullTranslation: 'крокодил'},
    wake: { sentence: [{word: 'わけ', furigana: 'わけ', translation: 'причина', partOfSpeech: 'существительное'}], fullTranslation: 'причина'},
    ware: { sentence: [{word: 'われ', furigana: 'われ', translation: 'я, мы', partOfSpeech: 'местоимение'}], fullTranslation: 'я'},
    raku: { sentence: [{word: 'らく', furigana: 'らく', translation: 'легкость, комфорт', partOfSpeech: 'существительное'}], fullTranslation: 'комфорт'},
    rashii: { sentence: [{word: 'らしい', furigana: 'らしい', translation: 'похоже что', partOfSpeech: 'прилагательное'}], fullTranslation: 'похоже что'},
    rashingi: { sentence: [{word: 'らしんぎ', furigana: 'らしんぎ', translation: 'компас', partOfSpeech: 'существительное'}], fullTranslation: 'компас'},
    rijikai: { sentence: [{word: 'りじかい', furigana: 'りじかい', translation: 'совет директоров', partOfSpeech: 'существительное'}], fullTranslation: 'совет директоров'},
    rikagaku: { sentence: [{word: 'りかがく', furigana: 'りかがく', translation: 'физика и химия', partOfSpeech: 'существительное'}], fullTranslation: 'физика и химия'},
    rekigan: { sentence: [{word: 'れきがん', furigana: 'れきがん', translation: 'конгломерат (геол.)', partOfSpeech: 'существительное'}], fullTranslation: 'конгломерат'},
    roku: { sentence: [{word: 'ろく', furigana: 'ろく', translation: 'шесть', partOfSpeech: 'числительное'}], fullTranslation: 'шесть'},
    rokubu: { sentence: [{word: 'ろくぶ', furigana: 'ろくぶ', translation: 'шесть копий', partOfSpeech: 'существительное'}], fullTranslation: 'шесть копий'},
    ryogakuki: { sentence: [{word: 'りょがくき', furigana: 'りょがくき', translation: 'период учебы за границей', partOfSpeech: 'существительное'}], fullTranslation: 'период учебы за границей'},
    wata: { sentence: [{word: 'わた', furigana: 'わた', translation: 'вата', partOfSpeech: 'существительное'}], fullTranslation: 'вата'},
    warui: { sentence: [{word: 'わるい', furigana: 'わるい', translation: 'плохой', partOfSpeech: 'прилагательное'}], fullTranslation: 'плохой'},
    waku: { sentence: [{word: 'わく', furigana: 'わく', translation: 'рама, рамка', partOfSpeech: 'существительное'}], fullTranslation: 'рама'},
    waki: { sentence: [{word: 'わき', furigana: 'わき', translation: 'подмышка, бок', partOfSpeech: 'существительное'}], fullTranslation: 'бок'},
    
    // New words for lesson 1 exercises
    ai: { sentence: [{ word: 'あい', furigana: 'あい', translation: 'любовь', partOfSpeech: 'существительное' }], fullTranslation: 'любовь' },
    aigo: { sentence: [{ word: 'あいご', furigana: 'あいご', translation: 'защита, покровительство', partOfSpeech: 'существительное' }], fullTranslation: 'защита' },
    igai: { sentence: [{ word: 'いがい', furigana: 'いがい', translation: 'кроме', partOfSpeech: 'наречие' }], fullTranslation: 'кроме' },
    eigakukai: { sentence: [{ word: 'えいがくかい', furigana: 'えいがくかい', translation: 'общество англ. языка', partOfSpeech: 'существительное' }], fullTranslation: 'общество англ. языка' },
    ikai: { sentence: [{ word: 'いかい', furigana: 'いかい', translation: 'желудочная язва', partOfSpeech: 'существительное' }], fullTranslation: 'желудочная язва' },
    ikei: { sentence: [{ word: 'いけい', furigana: 'いけい', translation: 'почитание', partOfSpeech: 'существительное' }], fullTranslation: 'почитание' },
    ikioi: { sentence: [{ word: 'いきおい', furigana: 'いきおい', translation: 'энергия, мощь', partOfSpeech: 'существительное' }], fullTranslation: 'мощь' },
    ukai: { sentence: [{ word: 'うかい', furigana: 'うかい', translation: 'обход', partOfSpeech: 'существительное' }], fullTranslation: 'обход' },
    ukurai: { sentence: [{ word: 'うくらい', furigana: 'ウクライ', translation: 'Украина (уст.)', partOfSpeech: 'существительное' }], fullTranslation: 'Украина' },
    ukei: { sentence: [{ word: 'うけい', furigana: 'うけい', translation: 'дождемер', partOfSpeech: 'существительное' }], fullTranslation: 'дождемер' },
    egui: { sentence: [{ word: 'えぐい', furigana: 'えぐい', translation: 'жесткий, суровый', partOfSpeech: 'прилагательное' }], fullTranslation: 'жесткий' },
    eii: { sentence: [{ word: 'えいい', furigana: 'えいい', translation: 'рвение', partOfSpeech: 'существительное' }], fullTranslation: 'рвение' },
    okugai: { sentence: [{ word: 'おくがい', furigana: 'おくがい', translation: 'на открытом воздухе', partOfSpeech: 'наречие' }], fullTranslation: 'на открытом воздухе' },
    kagai: { sentence: [{ word: 'かがい', furigana: 'かがい', translation: 'внеучебный', partOfSpeech: 'прилагательное' }], fullTranslation: 'внеучебный' },
    kaiyaku: { sentence: [{ word: 'かいやく', furigana: 'かいやく', translation: 'расторжение контракта', partOfSpeech: 'существительное' }], fullTranslation: 'расторжение контракта' },
    kakei: { sentence: [{ word: 'かけい', furigana: 'かけい', translation: 'домашний бюджет', partOfSpeech: 'существительное' }], fullTranslation: 'домашний бюджет' },
    keiai: { sentence: [{ word: 'けいあい', furigana: 'けいあい', translation: 'уважение и любовь', partOfSpeech: 'существительное' }], fullTranslation: 'уважение и любовь' },
    keiei: { sentence: [{ word: 'けいえい', furigana: 'けいえい', translation: 'управление, менеджмент', partOfSpeech: 'существительное' }], fullTranslation: 'управление' },
    kiei: { sentence: [{ word: 'きえい', furigana: 'きえい', translation: 'возвращение (домой)', partOfSpeech: 'существительное' }], fullTranslation: 'возвращение' },
    kigai: { sentence: [{ word: 'きがい', furigana: 'きがい', translation: 'угроза, вред', partOfSpeech: 'существительное' }], fullTranslation: 'вред' },
    gikei: { sentence: [{ word: 'ぎけい', furigana: 'ぎけい', translation: 'искусный трюк', partOfSpeech: 'существительное' }], fullTranslation: 'искусный трюк' },
    guai: { sentence: [{ word: 'ぐあい', furigana: 'ぐあい', translation: 'состояние, самочувствие', partOfSpeech: 'существительное' }], fullTranslation: 'состояние' },
    'igo:': { sentence: [{ word: 'いご', furigana: 'いご', translation: 'игра го', partOfSpeech: 'существительное' }], fullTranslation: 'игра го' },
    'eigo:': { sentence: [{ word: 'えいご', furigana: 'えいご', translation: 'английский язык', partOfSpeech: 'существительное' }], fullTranslation: 'английский язык' },
    'eiko:': { sentence: [{ word: 'えいこう', furigana: 'えいこう', translation: 'слава, величие', partOfSpeech: 'существительное' }], fullTranslation: 'слава' },
    'e:ka:': { sentence: [{ word: 'えいか', furigana: 'えいか', translation: 'гимн', partOfSpeech: 'существительное' }], fullTranslation: 'гимн' },
    'o:': { sentence: [{ word: 'おう', furigana: 'おう', translation: 'король', partOfSpeech: 'существительное' }], fullTranslation: 'король' },
    'o:i': { sentence: [{ word: 'おおい', furigana: 'おおい', translation: 'много', partOfSpeech: 'прилагательное' }], fullTranslation: 'много' },
    'o:gi': { sentence: [{ word: 'おうぎ', furigana: 'おうぎ', translation: 'веер', partOfSpeech: 'существительное' }], fullTranslation: 'веер' },
    'o:goe': { sentence: [{ word: 'おおごえ', furigana: 'おおごえ', translation: 'громкий голос', partOfSpeech: 'существительное' }], fullTranslation: 'громкий голос' },
    'o:guke': { sentence: [{ word: 'おおぐけ', furigana: 'おおぐけ', translation: 'большая семья', partOfSpeech: 'существительное' }], fullTranslation: 'большая семья' },
    'o:ka': { sentence: [{ word: 'おうか', furigana: 'おうか', translation: 'цветок вишни', partOfSpeech: 'существительное' }], fullTranslation: 'цветок вишни' },
    'o:koku': { sentence: [{ word: 'おうこく', furigana: 'おうこく', translation: 'королевство', partOfSpeech: 'существительное' }], fullTranslation: 'королевство' },
    'o:ko:': { sentence: [{ word: 'おうこう', furigana: 'おうこう', translation: 'горизонтальный ход', partOfSpeech: 'существительное' }], fullTranslation: 'горизонтальный ход' },
    'o:ko': { sentence: [{ word: 'おうこ', furigana: 'おうこ', translation: 'древность', partOfSpeech: 'существительное' }], fullTranslation: 'древность' },
    'o:u': { sentence: [{ word: 'おう', furigana: 'おう', translation: 'гнаться, преследовать', partOfSpeech: 'глагол' }], fullTranslation: 'гнаться' },
    'ka:': { sentence: [{ word: 'かあ', furigana: 'かあ', translation: 'мама (разг.)', partOfSpeech: 'существительное' }], fullTranslation: 'мама' },
    'kagu:': { sentence: [{ word: 'かぐ', furigana: 'かぐ', translation: 'мебель', partOfSpeech: 'существительное' }], fullTranslation: 'мебель' },
    'kago:': { sentence: [{ word: 'かご', furigana: 'かご', translation: 'корзина', partOfSpeech: 'существительное' }], fullTranslation: 'корзина' },
    'kaigo:': { sentence: [{ word: 'かいご', furigana: 'かいご', translation: 'уход, забота', partOfSpeech: 'существительное' }], fullTranslation: 'уход' },
    'ki:': { sentence: [{ word: 'きい', furigana: 'きい', translation: 'желтый', partOfSpeech: 'прилагательное' }], fullTranslation: 'желтый' },
    'kiko:': { sentence: [{ word: 'きこう', furigana: 'きこう', translation: 'климат', partOfSpeech: 'существительное' }], fullTranslation: 'климат' },
    'ko:eki': { sentence: [{ word: 'こうえき', furigana: 'こうえき', translation: 'торговля', partOfSpeech: 'существительное' }], fullTranslation: 'торговля' },
    'ko:gaku': { sentence: [{ word: 'こうがく', furigana: 'こうがく', translation: 'инженерия', partOfSpeech: 'существительное' }], fullTranslation: 'инженерия' },
    'ko:gi': { sentence: [{ word: 'こうぎ', furigana: 'こうぎ', translation: 'лекция', partOfSpeech: 'существительное' }], fullTranslation: 'лекция' },
    'ko:go:': { sentence: [{ word: 'こうご', furigana: 'こうご', translation: 'разговорный язык', partOfSpeech: 'существительное' }], fullTranslation: 'разговорный язык' },
    'ko:gu:': { sentence: [{ word: 'こうぐ', furigana: 'こうぐ', translation: 'инструмент', partOfSpeech: 'существительное' }], fullTranslation: 'инструмент' },
    'ko:ko:': { sentence: [{ word: 'こうこう', furigana: 'こうこう', translation: 'старшая школа', partOfSpeech: 'существительное' }], fullTranslation: 'старшая школа' },
    'ko:ku:': { sentence: [{ word: 'こうくう', furigana: 'こうくう', translation: 'авиация', partOfSpeech: 'существительное' }], fullTranslation: 'авиация' },
    'ku:geki': { sentence: [{ word: 'くうげき', furigana: 'くうげき', translation: 'воздушный налет', partOfSpeech: 'существительное' }], fullTranslation: 'воздушный налет' },
    'go:kei': { sentence: [{ word: 'ごうけい', furigana: 'ごうけい', translation: 'итого, всего', partOfSpeech: 'существительное' }], fullTranslation: 'итого' },
    'gu:': { sentence: [{ word: 'ぐう', furigana: 'ぐう', translation: 'четное число', partOfSpeech: 'существительное' }], fullTranslation: 'четное число' },
    'gu:gu:': { sentence: [{ word: 'ぐうぐう', furigana: 'ぐうぐう', translation: 'хр-хр (звук храпа)', partOfSpeech: 'наречие' }], fullTranslation: 'хр-хр' },
    aigi: { sentence: [{ word: 'あいぎ', furigana: 'あいぎ', translation: 'техника айкидо', partOfSpeech: 'существительное' }], fullTranslation: 'техника айкидо' },
    agaku: { sentence: [{ word: 'あがく', furigana: 'あがく', translation: 'бороться, барахтаться', partOfSpeech: 'глагол' }], fullTranslation: 'бороться' },
    akagi: { sentence: [{ word: 'あかぎ', furigana: 'あかぎ', translation: 'обветренная кожа', partOfSpeech: 'существительное' }], fullTranslation: 'обветренная кожа' },
    akogi: { sentence: [{ word: 'あこぎ', furigana: 'あこぎ', translation: 'жадный, безжалостный', partOfSpeech: 'прилагательное' }], fullTranslation: 'жадный' },
    age: { sentence: [{ word: 'あげ', furigana: 'あげ', translation: 'жареный тофу', partOfSpeech: 'существительное' }], fullTranslation: 'жареный тофу' },
    ago: { sentence: [{ word: 'あご', furigana: 'あご', translation: 'подбородок', partOfSpeech: 'существительное' }], fullTranslation: 'подбородок' },
    igi: { sentence: [{ word: 'いぎ', furigana: 'いぎ', translation: 'достоинство, величие', partOfSpeech: 'существительное' }], fullTranslation: 'достоинство' },
    igigaku: { sentence: [{ word: 'いぎがく', furigana: 'いぎがく', translation: 'семиотика', partOfSpeech: 'существительное' }], fullTranslation: 'семиотика' },
    igo: { sentence: [{ word: 'いご', furigana: 'いご', translation: 'после этого', partOfSpeech: 'наречие' }], fullTranslation: 'после этого' },
    igaku: { sentence: [{ word: 'いがく', furigana: 'いがく', translation: 'медицина', partOfSpeech: 'существительное' }], fullTranslation: 'медицина' },
    ugai: { sentence: [{ word: 'うがい', furigana: 'うがい', translation: 'полоскание горла', partOfSpeech: 'существительное' }], fullTranslation: 'полоскание горла' },
    ugoki: { sentence: [{ word: 'うごき', furigana: 'うごき', translation: 'движение', partOfSpeech: 'существительное' }], fullTranslation: 'движение' },
    uigo: { sentence: [{ word: 'ういご', furigana: 'ういご', translation: 'первое слово (ребенка)', partOfSpeech: 'существительное' }], fullTranslation: 'первое слово' },
    eiga: { sentence: [{ word: 'えいが', furigana: 'えいが', translation: 'фильм, кино', partOfSpeech: 'существительное' }], fullTranslation: 'фильм' },
    egaku: { sentence: [{ word: 'えがく', furigana: 'えがく', translation: 'рисовать', partOfSpeech: 'глагол' }], fullTranslation: 'рисовать' },
    ogi: { sentence: [{ word: 'おぎ', furigana: 'おぎ', translation: 'камыш', partOfSpeech: 'существительное' }], fullTranslation: 'камыш' },
    okage: { sentence: [{ word: 'おかげ', furigana: 'おかげ', translation: 'благодаря', partOfSpeech: 'существительное' }], fullTranslation: 'благодаря' },
    okugi: { sentence: [{ word: 'おくぎ', furigana: 'おくぎ', translation: 'секрет мастерства', partOfSpeech: 'существительное' }], fullTranslation: 'секрет мастерства' },
    okugaki: { sentence: [{ word: 'おくがき', furigana: 'おくがき', translation: 'послесловие', partOfSpeech: 'существительное' }], fullTranslation: 'послесловие' },
    kagaku: { sentence: [{ word: 'かがく', furigana: 'かがく', translation: 'наука', partOfSpeech: 'существительное' }], fullTranslation: 'наука' },
    kage: { sentence: [{ word: 'かげ', furigana: 'かげ', translation: 'тень', partOfSpeech: 'существительное' }], fullTranslation: 'тень' },
    kago: { sentence: [{ word: 'かご', furigana: 'かご', translation: 'корзина', partOfSpeech: 'существительное' }], fullTranslation: 'корзина' },
    kaiga: { sentence: [{ word: 'かいが', furigana: 'かいが', translation: 'живопись', partOfSpeech: 'существительное' }], fullTranslation: 'живопись' },
    kaigi: { sentence: [{ word: 'かいぎ', furigana: 'かいぎ', translation: 'совещание', partOfSpeech: 'существительное' }], fullTranslation: 'совещание' },
    keigai: { sentence: [{ word: 'けいがい', furigana: 'けいがい', translation: 'остов, скелет', partOfSpeech: 'существительное' }], fullTranslation: 'остов' },
    kiga: { sentence: [{ word: 'きが', furigana: 'きが', translation: 'голод', partOfSpeech: 'существительное' }], fullTranslation: 'голод' },
    koage: { sentence: [{ word: 'こあげ', furigana: 'こあげ', translation: 'небольшой подъем', partOfSpeech: 'существительное' }], fullTranslation: 'небольшой подъем' },
    kokugi: { sentence: [{ word: 'こくぎ', furigana: 'こくぎ', translation: 'национальный вид спорта', partOfSpeech: 'существительное' }], fullTranslation: 'нац. вид спорта' },
    kokugo: { sentence: [{ word: 'こくご', furigana: 'こくご', translation: 'национальный язык', partOfSpeech: 'существительное' }], fullTranslation: 'нац. язык' },
    kugai: { sentence: [{ word: 'くがい', furigana: 'くがい', translation: 'мир страданий', partOfSpeech: 'существительное' }], fullTranslation: 'мир страданий' },
    kuge: { sentence: [{ word: 'くげ', furigana: 'くげ', translation: 'придворная знать', partOfSpeech: 'существительное' }], fullTranslation: 'придворная знать' },
    kugi: { sentence: [{ word: 'くぎ', furigana: 'くぎ', translation: 'гвоздь', partOfSpeech: 'существительное' }], fullTranslation: 'гвоздь' },
    geigeki: { sentence: [{ word: 'げいげき', furigana: 'げいげき', translation: 'перехват (авиа)', partOfSpeech: 'существительное' }], fullTranslation: 'перехват' },
    giga: { sentence: [{ word: 'ぎが', furigana: 'ぎが', translation: 'карикатура', partOfSpeech: 'существительное' }], fullTranslation: 'карикатура' },
    gogaku: { sentence: [{ word: 'ごがく', furigana: 'ごがく', translation: 'лингвистика', partOfSpeech: 'существительное' }], fullTranslation: 'лингвистика' },
};

export const mainScreenAnalyses: JapaneseAnalysisOutput[] = [
    {
        sentence: [
            { word: '今日', furigana: 'きょう', translation: 'сегодня', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'いい', furigana: 'いい', translation: 'хорошая', partOfSpeech: 'прилагательное' },
            { word: '天気', furigana: 'てんき', translation: 'погода', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'ね', furigana: 'ね', translation: 'частица (не так ли?)', partOfSpeech: 'частица (не так ли?)' },
        ],
        fullTranslation: 'Сегодня хорошая погода, не так ли?',
    },
    {
        sentence: [
            { word: 'それ', furigana: 'それ', translation: 'это', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '猫', furigana: 'ねこ', translation: 'кошка', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'частица (вопрос)', partOfSpeech: 'частица (вопрос)' },
        ],
        fullTranslation: 'Это кошка?',
    },
    {
        sentence: [
            { word: '日本語', furigana: 'にほんご', translation: 'японский язык', partOfSpeech: 'существительное' },
            { word: 'の', furigana: 'の', translation: 'частица (принадлежность)', partOfSpeech: 'частица (принадлежность)' },
            { word: '勉強', furigana: 'べんきょう', translation: 'учеба', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '楽しい', furigana: 'たのしい', translation: 'веселый/приятный', partOfSpeech: 'прилагательное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Изучение японского языка - это весело.',
    }
];


const watashiwagakuseidesu: JapaneseAnalysisOutput = {
    sentence: [
      { word: 'わたし', furigana: 'わたし', translation: 'я', partOfSpeech: 'местоимение' },
      { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
      { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
      { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Я студент.'
};

const anokatawagakuseidehaarimasen: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное (вежл.)' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
        { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
        { word: 'では', furigana: 'では', translation: 'отрицательная частица', partOfSpeech: 'отрицательная частица' },
        { word: 'ありません', furigana: 'ありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
    ],
    fullTranslation: 'Тот человек не является студентом.'
};

const watashiwasenseidehaarimasengakuseidesu: JapaneseAnalysisOutput = {
    sentence: [
        { "word": "わたし", "furigana": "わたし", "translation": "я", "partOfSpeech": "местоимение" },
        { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
        { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
        { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "отрицательная частица" },
        { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" },
        { "word": "。", "furigana": "", "translation": "точка", "partOfSpeech": "знак препинания" },
        { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
        { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
    ],
    "fullTranslation": "Я не учитель. Я студент."
};


const anokatawadonadesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное (вежл.)' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
        { word: 'どなた', furigana: 'どなた', translation: 'кто (вежл.)', partOfSpeech: 'вопросительное местоимение' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
    ],
    fullTranslation: 'Кто тот человек?'
};

const daregagakuseidesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'だれ', furigana: 'だれ', translation: 'кто', partOfSpeech: 'вопросительное местоимение' },
        { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' },
        { word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопрос', partOfSpeech: 'частица (вопрос)' }
    ],
    fullTranslation: 'Кто студент?'
};

const anokatawayamadasandesu: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное (вежл.)' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
        { word: 'やまだ', furigana: 'やまだ', translation: 'Ямада', partOfSpeech: 'имя собственное' },
        { word: 'さん', furigana: 'さん', translation: 'господин/госпожа', partOfSpeech: 'суффикс вежливости' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Тот человек — господин Ямада.'
};


export const grammarAnalyses = {
    yamadasan: {
        sentence: [
            { word: 'ヤマダ', furigana: 'やまだ', translation: 'Ямада', partOfSpeech: 'имя собственное' },
            { word: 'さん', furigana: 'さん', translation: 'г-н/г-жа', partOfSpeech: 'суффикс вежливости' },
        ],
        fullTranslation: 'Господин/госпожа Ямада'
    },
    tanakasan: {
        sentence: [
            { word: '田中', furigana: 'たなか', translation: 'Танака', partOfSpeech: 'имя собственное' },
            { word: 'さん', furigana: 'さん', translation: 'г-н/г-жа', partOfSpeech: 'суффикс вежливости' },
        ],
        fullTranslation: 'Господин/госпожа Танака'
    },
    gosenmon: {
        sentence: [
            { word: 'ご専門', furigana: 'ごせんもん', translation: 'Ваша специальность', partOfSpeech: 'существительное' },
        ],
        fullTranslation: 'Ваша специальность'
    },
    watashiwagakuseidesu: watashiwagakuseidesu,
    anokatawagakuseidehaarimasen: anokatawagakuseidehaarimasen,
    watashiwasenseidehaarimasengakuseidesu: watashiwasenseidehaarimasengakuseidesu,
    anokatawadonadesuka: anokatawadonadesuka,
    anokatawayamadasandesu: anokatawayamadasandesu,
    daregagakuseidesuka: daregagakuseidesuka,
    sorewanandesuka: {
        sentence: [
            { word: 'それ', furigana: 'それ', translation: 'это', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '何', furigana: 'なん', translation: 'что', partOfSpeech: 'вопросительное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Что это?',
    },
    anokatahasenseidesu: {
        sentence: [
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Тот человек — учитель."
    },
    gakuseihaanohitodesu: {
        sentence: [
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "ひと", "furigana": "ひと", "translation": "человек", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Студент — тот человек."
    },
    anokatahasenseidehaarimasen: {
        sentence: [
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "отрицательная частица" },
            { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" }
        ],
        "fullTranslation": "Тот человек не учитель."
    },
    gakuseihaanohitojaarimasen: {
        sentence: [
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "ひと", "furigana": "ひと", "translation": "человек", "partOfSpeech": "существительное" },
            { "word": "じゃ", "furigana": "じゃ", "translation": "отрицательная частица (разг.)", "partOfSpeech": "отрицательная частица (разг.)" },
            { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" }
        ],
        "fullTranslation": "Студент — не тот человек."
    },
    senseidesu: {
        sentence: [
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "(Я/он/она) — учитель."
    },
    gakuseidesu: {
        sentence: [
            { word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: '(Кто-то) студент.'
    },
    tanakasan_wa_gakuseidesu: {
        sentence: [
          { "word": "田中", "furigana": "たなか", "translation": "Танака", "partOfSpeech": "имя собственное" },
          { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
          { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
          { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Танака — студент."
      },
    watashi_wa_gakusei_dewa_arimasen: {
        sentence: [
            { "word": "わたし", "furigana": "わたし", "translation": "я", "partOfSpeech": "местоимение" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "отрицательная частица" },
            { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" },
        ],
        "fullTranslation": "Я не студент."
    },
    // Lesson 2
    anokatawagakuseidesuka: {
        sentence: [
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "вопросительная частица", "partOfSpeech": "вопросительная частица" }
        ],
        "fullTranslation": "Он студент?"
    },
    hai_anokatawagakuseidesu: {
        sentence: [
            { "word": "はい", "furigana": "はい", "translation": "да", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Да, он студент."
    },
    hai_soudesu: {
        sentence: [
            { "word": "はい", "furigana": "はい", "translation": "да", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "そうです", "furigana": "そうです", "translation": "это так", "partOfSpeech": "выражение" }
        ],
        "fullTranslation": "Да, это так."
    },
    iie_anokatawagakuseidehaarimasen: {
        sentence: [
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "отрицательная частица" },
            { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" }
        ],
        "fullTranslation": "Нет, он не студент."
    },
    iie_anokatahasenseidesu: {
        sentence: [
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Нет, он учитель."
    },
    iie_senseidesu: {
        sentence: [
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Нет, (он) учитель."
    },
    anohitohadaredesuka_tanakasandesu: {
        sentence: [
            { word: 'あのひと', furigana: 'あのひと', translation: 'тот человек', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'だれ', furigana: 'だれ', translation: 'кто', partOfSpeech: 'вопросительное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'частица (вопрос)', partOfSpeech: 'вопросительная частица' },
            { "word": "。", "furigana": "", "translation": "точка", "partOfSpeech": "знак препинания" },
            { word: '田中さん', furigana: 'たなかさん', translation: 'г-н Танака', partOfSpeech: 'имя собственное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Кто тот человек? — Господин Танака.',
    },
    soujisanhagishidesuka_haisoudesu: {
        sentence: [
            { "word": "そうじさん", "furigana": "そうじさん", "translation": "г-н Содзи", "partOfSpeech": "имя собственное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "ぎし", "furigana": "ぎし", "translation": "инженер", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "частица (вопрос)", "partOfSpeech": "вопросительная частица" },
            { "word": "。", "furigana": "", "translation": "точка", "partOfSpeech": "знак препинания" },
            { "word": "はい", "furigana": "はい", "translation": "да", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "そうです", "furigana": "そうです", "translation": "это так", "partOfSpeech": "выражение" },
        ],
        "fullTranslation": "Господин Содзи инженер? — Да, это так."
    },
    yamadasanhagakuseidesuka_iiesenseidesu: {
        sentence: [
            { "word": "山田さん", "furigana": "やまださん", "translation": "г-н Ямада", "partOfSpeech": "имя собственное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "частица (вопрос)", "partOfSpeech": "вопросительная частица" },
            { "word": "。", "furigana": "", "translation": "точка", "partOfSpeech": "знак препинания" },
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
        ],
        "fullTranslation": "Господин Ямада студент? — Нет, он учитель."
    },
    anohitohasenseidesuka_iiedewaarimasen: {
        sentence: [
            { "word": "あのひと", "furigana": "あのひと", "translation": "тот человек", "partOfSpeech": "местоимение" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "частица (вопрос)", "partOfSpeech": "вопросительная частица" },
            { "word": "。", "furigana": "", "translation": "точка", "partOfSpeech": "знак препинания" },
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "отрицательная частица" },
            { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" },
        ],
        "fullTranslation": "Тот человек учитель? — Нет, не учитель."
    },
    // Lesson 2, §9
    anokata_wa_sensei_desuka_gakusei_desuka: {
        sentence: [
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное (вежл.)" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "вопросительная частица", "partOfSpeech": "вопросительная частица" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "вопросительная частица", "partOfSpeech": "вопросительная частица" },
        ],
        "fullTranslation": "Он преподаватель или студент?"
    },
    yamadasan_wa_sensei_desuka_gakusei_desuka: {
        sentence: [
            { "word": "山田さん", "furigana": "やまださん", "translation": "г-н Ямада", "partOfSpeech": "имя собственное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "先生", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "вопросительная частица", "partOfSpeech": "вопросительная частица" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "学生", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "вопросительная частица", "partOfSpeech": "вопросительная частица" }
        ],
        "fullTranslation": "Ямада — преподаватель или студент?"
    },
    yamadasan_ga_sensei_desu: {
        sentence: [
            { word: "山田さん", furigana: "やまださん", translation: "г-н Ямада", partOfSpeech: "имя собственное" },
            { word: "が", furigana: "が", translation: "частица", partOfSpeech: "частица" },
            { word: "先生", furigana: "せんせい", translation: "учитель", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Господин Ямада — учитель."
    },
    nakayamasan_ga_isha_desu: {
        sentence: [
            { word: "中山さん", furigana: "なかやまさん", translation: "г-н Накаяма", partOfSpeech: "имя собственное" },
            { word: "が", furigana: "が", translation: "частица", partOfSpeech: "частица" },
            { word: "医者", furigana: "いしゃ", translation: "врач", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Господин Накаяма — врач."
    },
    yamamotosan_ga_gishi_desu: {
        sentence: [
            { word: "山本さん", furigana: "やまもとさん", translation: "г-н Ямамото", partOfSpeech: "имя собственное" },
            { word: "が", furigana: "が", translation: "частица", partOfSpeech: "частица" },
            { word: "技師", furigana: "ぎし", translation: "инженер", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Господин Ямамото — инженер."
    },
    gosenmon_wa_bungaku_desu: {
        sentence: [
            { word: "ご専門", furigana: "ごせんもん", translation: "специальность", partOfSpeech: "существительное" },
            { word: "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { word: "文学", furigana: "ぶんがく", translation: "литература", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Специальность — литература."
    },
    onamae_wa_anna_desu: {
        sentence: [
            { word: "お名前", furigana: "おなまえ", translation: "имя", partOfSpeech: "существительное" },
            { word: "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { word: "アンナ", furigana: "アンナ", translation: "Анна", partOfSpeech: "имя собственное" },
            { word: "です", furigana: "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Имя — Анна."
    },
     // Lesson 7
     shigaku: {
        sentence: [
            { word: '史学', furigana: 'しがく', translation: 'история (как наука)', partOfSpeech: 'существительное' },
        ],
        fullTranslation: 'История (как наука)',
    },
     kyoukasho_wa_dore_desuka: {
        sentence: [
            { word: '教科書', furigana: 'きょうかしょ', translation: 'учебник', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'どれ', furigana: 'どれ', translation: 'который?', partOfSpeech: 'вопросительное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Учебник - это что (из имеющихся предметов)?',
    },
    kyoukasho_wa_kore_desu: {
        sentence: [
            { word: '教科書', furigana: 'きょうかしょ', translation: 'учебник', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'указательное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Учебник - это.',
    },
    kore_ga_hon_desu: {
        sentence: [
            { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'указательное местоимение' },
            { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' },
            { word: '本', furigana: 'ほん', translation: 'книга', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Это (а не что-либо другое) книга.',
    },
    kore_wa_hon_desu: {
        sentence: [
            { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'указательное местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '本', furigana: 'ほん', translation: 'книга', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Это книга.',
    },
    yamadasan_mo_sensei_desu: {
        sentence: [
            { word: '山田さん', furigana: 'やまださん', translation: 'г-н Ямада', partOfSpeech: 'имя собственное' },
            { word: 'も', furigana: 'も', translation: 'частица', partOfSpeech: 'частица' },
            { word: '先生', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Ямада-сан тоже преподаватель.',
    },
    anna_mo_tanakasan_mo_sensei_dewa_arimasen: {
        sentence: [
            { word: 'アンナ', furigana: 'アンナ', translation: 'Анна', partOfSpeech: 'имя собственное' },
            { word: 'も', furigana: 'も', translation: 'частица', partOfSpeech: 'частица' },
            { word: '田中さん', furigana: 'たなかさん', translation: 'г-н Танака', partOfSpeech: 'имя собственное' },
            { word: 'も', furigana: 'も', translation: 'частица', partOfSpeech: 'частица' },
            { word: '先生', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' },
            { word: 'では', furigana: 'では', translation: 'отрицательная частица', partOfSpeech: 'отрицательная частица' },
            { word: 'ありません', furigana: 'ありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
        ],
        fullTranslation: 'Ни Анна, ни Танака-сан не преподаватели.',
    },
    anohito_wa_gakusei_dewa_arimasenka: {
        sentence: [
            { word: 'あの人', furigana: 'あのひと', translation: 'тот человек', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
            { word: 'では', furigana: 'では', translation: 'отрицательная частица', partOfSpeech: 'отрицательная частица' },
            { word: 'ありません', furigana: 'ありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Он не студент?',
    },
    hai_gakuseidesu: {
        sentence: [
            { word: 'はい', furigana: 'はい', translation: 'да', partOfSpeech: 'междометие' },
            { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
            { word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Да, он студент.'
    },
    iie_gakuseidewaarimasen: {
        sentence: [
            { word: 'いいえ', furigana: 'いいえ', translation: 'нет', partOfSpeech: 'междометие' },
            { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
            { word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
            { word: 'では', furigana: 'では', translation: 'отрицательная частица', partOfSpeech: 'отрицательная частица' },
            { word: 'ありません', furigana: 'ありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
        ],
        fullTranslation: 'Нет, он не студент.'
    },
    kore_wa_note_desu: {
        sentence: [
            { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'ノート', furigana: 'ノート', translation: 'тетрадь', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Это тетрадь.'
    },
    sore_wa_pen_desu: {
        sentence: [
            { word: 'それ', furigana: 'それ', translation: 'то', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'ペン', furigana: 'ペン', translation: 'ручка', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'То ручка.'
    },
    are_wa_hondana_desu: {
        sentence: [
            { word: 'あれ', furigana: 'あれ', translation: 'то', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '本棚', furigana: 'ほんだな', translation: 'книжная полка', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'То книжная полка.'
    },
    doa_wa_doko_desu_ka: {
        sentence: [
            { word: 'ドア', furigana: 'ドア', translation: 'дверь', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'どこ', furigana: 'どこ', translation: 'где?', partOfSpeech: 'вопросительное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Где дверь?'
    },
    enpitsu_wa_dore_desu_ka: {
        sentence: [
            { word: '鉛筆', furigana: 'えんぴつ', translation: 'карандаш', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'どれ', furigana: 'どれ', translation: 'который?', partOfSpeech: 'вопросительное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Который из них карандаш?'
    }
}

export const dialogueAnalyses = {
    konnichiwa: {
        sentence: [{ word: 'こんにちは', furigana: 'こんにちは', translation: 'Добрый день', partOfSpeech: 'междометие' }],
        fullTranslation: 'Добрый день!'
    },
    hajimemashite: {
        sentence: [
            { word: 'はじめまして', furigana: 'はじめまして', translation: 'приятно познакомиться', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Приятно познакомиться.'
    },
     hajimemashite_full: {
        sentence: [
            { word: 'はじめまして', furigana: 'はじめまして', translation: 'приятно познакомиться', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
            { word: '私', furigana: 'わたし', translation: 'я', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: 'アンナ', furigana: 'アンナ', translation: 'Анна', partOfSpeech: 'имя собственное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Приятно познакомиться. Я Анна.'
    },
    anatanonamaewa: {
        sentence: [
            { word: 'あなた', furigana: 'あなた', translation: 'вы', partOfSpeech: 'местоимение' },
            { word: 'の', furigana: 'の', translation: 'частица (принадлежность)', partOfSpeech: 'частица (принадлежность)' },
            { word: 'お名前', furigana: 'おなまえ', translation: 'имя (вежл.)', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '？', furigana: '', translation: 'вопрос', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Как вас зовут?'
    },
    onamae: {
        sentence: [
            { word: 'お名前', furigana: 'おなまえ', translation: 'Ваше имя', partOfSpeech: 'существительное' },
        ],
        fullTranslation: 'Ваше имя'
    },
    hajimemashite_name: {
        sentence: [
            { word: '[name]', furigana: '[name]', translation: 'Имя пользователя', partOfSpeech: 'имя собственное' },
            { word: 'さん', furigana: 'さん', translation: 'г-н/г-жа', partOfSpeech: 'суффикс вежливости' },
            { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
            { word: 'はじめまして', furigana: 'はじめまして', translation: 'приятно познакомиться', partOfSpeech: 'выражение' },
            { word: '！', furigana: '', translation: 'воскл. знак', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Приятно познакомиться, [name]!'
    },
    yoroshiku: {
        sentence: [
            { word: 'どうぞ', furigana: 'どうぞ', translation: 'пожалуйста', partOfSpeech: 'наречие' },
            { word: 'よろしく', furigana: 'よろしく', translation: 'прошу любить', partOfSpeech: 'наречие' },
            { word: 'お願いします', furigana: 'おねがいします', translation: 'и жаловать', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Прошу любить и жаловать.'
    },
    yokudekimashita: {
        sentence: [
            { word: 'よくできました', furigana: 'よくできました', translation: 'отлично сделано', partOfSpeech: 'выражение' },
            { word: '🎉', furigana: '', translation: 'эмодзи', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Отлично получилось! 🎉'
    },
    iiesoudewaarimasen: {
        sentence: [
            { word: 'いいえ', furigana: 'いいえ', translation: 'нет', partOfSpeech: 'междометие' },
            { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
            { word: 'そう', furigana: 'そう', translation: 'так', partOfSpeech: 'наречие' },
            { word: 'では', furigana: 'では', translation: 'отрицательная частица', partOfSpeech: 'отрицательная частица' },
            { word: 'ありません', furigana: 'ありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Нет, это не так.'
    },
    wakarimasuka: {
        sentence: [
            { word: 'わかります', furigana: 'わかります', translation: 'понимаете', partOfSpeech: 'глагол' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Вам понятно?'
    },
    yondekudasai: {
        sentence: [
            { word: 'よんで', furigana: 'よんで', translation: 'прочтите', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Прочтите, пожалуйста.'
    },
    nihongodeittekudasai: {
        sentence: [
            { word: 'にほんご', furigana: 'にほんご', translation: 'по-японски', partOfSpeech: 'существительное' },
            { word: 'で', furigana: 'で', translation: 'частица (творительный падеж)', partOfSpeech: 'частица' },
            { word: 'いって', furigana: 'いって', translation: 'скажите', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Скажите по-японски, пожалуйста.'
    },
    kiitekudasai: {
        sentence: [
            { word: 'きいて', furigana: 'きいて', translation: 'слушайте', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Слушайте, пожалуйста.'
    },
    ittekudasai: {
        sentence: [
            { word: 'いって', furigana: 'いって', translation: 'скажите', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Скажите, пожалуйста.'
    },
    kotaetekudasai: {
        sentence: [
            { word: 'こたえて', furigana: 'こたえて', translation: 'ответьте', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Ответьте, пожалуйста.'
    },
    suwattekudasai: {
        sentence: [
            { word: 'すわって', furigana: 'すわって', translation: 'садитесь', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Садитесь, пожалуйста.'
    },
    naoshitekudasai: {
        sentence: [
            { word: 'なおして', furigana: 'なおして', translation: 'исправьте', partOfSpeech: 'глагол' },
            { word: 'ください', furigana: 'ください', translation: 'пожалуйста', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Исправьте, пожалуйста.'
    },
    mouichido: {
        sentence: [
            { word: 'もういちど', furigana: 'もういちど', translation: 'ещё раз', partOfSpeech: 'наречие' },
            { word: 'おねがいします', furigana: 'おねがいします', translation: 'пожалуйста', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Ещё раз, пожалуйста.'
    },
     sumimasenga: {
        sentence: [
            { word: 'すみませんが', furigana: 'すみませんが', translation: 'извините, но...', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Извините, пожалуйста, но...'
    },
    annasan_wa_gakuseidesu: {
        sentence: [
            { word: 'アンナさん', furigana: 'アンナさん', translation: 'Анна-сан', partOfSpeech: 'имя собственное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Анна — студентка.'
    },
    tanakasan_wa_senseidesu: {
        sentence: [
            { word: '田中さん', furigana: 'たなかさん', translation: 'Танака-сан', partOfSpeech: 'имя собственное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '先生', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Танака — учитель.'
    },
     tanaka_yoroshiku: {
        sentence: [
            { word: '田中', furigana: 'たなか', translation: 'Танака', partOfSpeech: 'имя собственное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
            { word: 'よろしく', furigana: 'よろしく', translation: 'прошу любить', partOfSpeech: 'наречие' },
            { word: 'お願いします', furigana: 'おねがいします', translation: 'и жаловать', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Я Танака. Прошу любить и жаловать.'
    },
    kochira_koso: {
        sentence: [
            { word: 'こちらこそ', furigana: 'こちらこそ', translation: 'мне тоже', partOfSpeech: 'выражение' },
            { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
            { word: 'よろしく', furigana: 'よろしく', translation: 'прошу любить', partOfSpeech: 'наречие' },
            { word: 'お願いします', furigana: 'おねがいします', translation: 'и жаловать', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Мне тоже очень приятно, прошу любить и жаловать.'
    },
    anna_hajimemashite: {
        sentence: [
            { word: 'はじめまして', furigana: 'はじめまして', translation: 'приятно познакомиться', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
            { word: 'アンナです', furigana: 'アンナです', translation: 'Я Анна', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
            { word: 'よろしく', furigana: 'よろしく', translation: 'прошу любить', partOfSpeech: 'наречие' },
            { word: 'お願いします', furigana: 'おねがいします', translation: 'и жаловать', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Приятно познакомиться. Я Анна. Прошу любить и жаловать.'
    },
    tanaka_kochira_koso: {
        sentence: [
            { word: 'こちらこそ', furigana: 'こちらこそ', translation: 'мне тоже', partOfSpeech: 'выражение' },
            { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
            { word: 'よろしく', furigana: 'よろしく', translation: 'прошу любить', partOfSpeech: 'наречие' },
            { word: 'お願いします', furigana: 'おねがいします', translation: 'и жаловать', partOfSpeech: 'выражение' },
            { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        ],
        fullTranslation: 'Мне тоже очень приятно, прошу любить и жаловать.'
    },
    // Lesson 7
    wakarimashita: {
        sentence: [
            { word: 'わかりました', furigana: 'わかりました', translation: 'Понятно', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Понятно.',
    },
    doumo_arigatou_gozaimashita: {
        sentence: [
            { word: 'どうも', furigana: 'どうも', translation: 'очень', partOfSpeech: 'наречие' },
            { word: 'ありがとう', furigana: 'ありがとう', translation: 'спасибо', partOfSpeech: 'выражение' },
            { word: 'ございました', furigana: 'ございました', translation: 'было', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Большое спасибо.',
    },
    dou_itashimashite: {
        sentence: [
            { word: 'どういたしまして', furigana: 'どういたしまして', translation: 'не стоит', partOfSpeech: 'выражение' },
        ],
        fullTranslation: 'Не стоит.',
    },
    kore_wa_nan_desuka: {
        sentence: [
            { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '何', furigana: 'なん', translation: 'что?', partOfSpeech: 'вопросительное местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Что это?',
    },
    sore_wa_jisho_desu: {
        sentence: [
            { word: 'それ', furigana: 'それ', translation: 'то', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' },
            { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Это словарь.',
    },
    nihongo_no_jisho_desuka: {
        sentence: [
            { word: '日本語', furigana: 'にほんご', translation: 'японский язык', partOfSpeech: 'существительное' },
            { word: 'の', furigana: 'の', translation: 'частица (принадлежность)', partOfSpeech: 'частица (принадлежность)' },
            { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' },
        ],
        fullTranslation: 'Это японский словарь?',
    },
    hai_soudesu: {
        sentence: [
            { "word": "はい", "furigana": "はい", "translation": "да", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "そうです", "furigana": "そうです", "translation": "это так", "partOfSpeech": "выражение" }
        ],
        "fullTranslation": "Да, это так."
    },
};

  

