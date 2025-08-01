
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
    watashiwagakuseidesu: watashiwagakuseidesu,
    anokatawagakuseidehaarimasen: anokatawagakuseidehaarimasen,
    watashiwasenseidehaarimasengakuseidesu: watashiwasenseidehaarimasengakuseidesu,
    anokatawadonadesuka: anokatawadonadesuka,
    anokatawayamadasandesu: anokatawayamadasandesu,
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
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
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
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "(Я/он/она) — учитель."
    },
    gakuseidesu: {
        sentence: [
            { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: '(Кто-то) студент.'
    },
    tanakasan_wa_gakuseidesu: {
        sentence: [
          { "word": "たなかさん", "furigana": "たなかさん", "translation": "г-н Танака", "partOfSpeech": "имя собственное" },
          { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
          { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
          { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Г-н Танака — студент."
      },
    watashi_wa_gakusei_dewa_arimasen: {
        sentence: [
            { "word": "わたし", "furigana": "わたし", "translation": "я", "partOfSpeech": "местоимение" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
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
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
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
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
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
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
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
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Нет, он учитель."
    },
    iie_senseidesu: {
        sentence: [
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
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
            { word: 'たなかさん', furigana: 'たなかさん', translation: 'г-н Танака', partOfSpeech: 'имя собственное' },
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
            { "word": "やまださん", "furigana": "やまださん", "translation": "г-н Ямада", "partOfSpeech": "имя собственное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица (тема)" },
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
            { "word": "か", "furigana": "か", "translation": "частица (вопрос)", "partOfSpeech": "вопросительная частица" },
            { "word": "。", "furigana": "", "translation": "точка", "partOfSpeech": "знак препинания" },
            { "word": "いいえ", "furigana": "いいえ", "translation": "нет", "partOfSpeech": "междометие" },
            { "word": "、", "furigana": "", "translation": "запятая", "partOfSpeech": "знак препинания" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
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
    }
}
