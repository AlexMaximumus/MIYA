

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
            { word: "です", furigana: "です", translation: "есть (связка)", partOfSpeech: "связка" },
        ],
        fullTranslation: "Господин Ямада — учитель."
    },
    nakayamasan_ga_isha_desu: {
        sentence: [
            { word: "中山さん", furigana: "なかやまさん", translation: "г-н Накаяма", partOfSpeech: "имя собственное" },
            { word: "が", furigana: "が", translation: "частица", partOfSpeech: "частица" },
            { word: "医者", furigana: "いしゃ", translation: "врач", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", translation: "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Господин Накаяма — врач."
    },
    yamamotosan_ga_gishi_desu: {
        sentence: [
            { word: "山本さん", furigana: "やまもとさん", translation: "г-н Ямамото", partOfSpeech: "имя собственное" },
            { word: "が", furigana: "が", translation: "частица", partOfSpeech: "частица" },
            { word: "技師", furigana: "ぎし", translation: "инженер", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", translation: "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Господин Ямамото — инженер."
    },
    gosenmon_wa_bungaku_desu: {
        sentence: [
            { word: "ご専門", furigana: "ごせんもん", translation: "специальность", partOfSpeech: "существительное" },
            { word: "は", furigana: "は", translation: "частица (тема)", partOfSpeech: "частица (тема)" },
            { word: "文学", furigana: "ぶんがく", translation: "литература", partOfSpeech: "существительное" },
            { word: "です", furigana: "です", translation: "есть (связка)", partOfSpeech: "связка" },
        ],
        fullTranslation: "Специальность — литература."
    },
    onamae_wa_anna_desu: {
        sentence: [
            { word: "お名前", furigana: "おなまえ", translation: "имя", partOfSpeech: "существительное" },
            { word: "は", furigana: "は", translation: "частица (тема)", partOfSpeech: "частица (тема)" },
            { word: "アンナ", furigana: "アンナ", translation: "Анна", partOfSpeech: "имя собственное" },
            { word: "です", furigana: "です", translation: "есть (связка)", "partOfSpeech": "связка" },
        ],
        fullTranslation: "Имя — Анна."
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
    }
};




    

    

    
