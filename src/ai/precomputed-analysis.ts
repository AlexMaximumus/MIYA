
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

export const mainScreenAnalyses: JapaneseAnalysisOutput[] = [
    {
        sentence: [
            { word: '今日', furigana: 'きょう', translation: 'сегодня', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
            { word: 'いい', furigana: 'いい', translation: 'хорошая', partOfSpeech: 'прилагательное' },
            { word: '天気', furigana: 'てんき', translation: 'погода', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'ね', furigana: 'ね', translation: 'частица (не так ли?)', partOfSpeech: 'частица' },
        ],
        fullTranslation: 'Сегодня хорошая погода, не так ли?',
    },
    {
        sentence: [
            { word: 'それ', furigana: 'それ', translation: 'это', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
            { word: '猫', furigana: 'ねこ', translation: 'кошка', partOfSpeech: 'существительное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'частица (вопрос)', partOfSpeech: 'частица' },
        ],
        fullTranslation: 'Это кошка?',
    },
    {
        sentence: [
            { word: '日本語', furigana: 'にほんご', translation: 'японский язык', partOfSpeech: 'существительное' },
            { word: 'の', furigana: 'の', translation: 'частица (принадлежность)', partOfSpeech: 'частица' },
            { word: '勉強', furigana: 'べんきょう', translation: 'учеба', partOfSpeech: 'существительное' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
            { word: '楽しい', furigana: 'たのしい', translation: 'веселый/приятный', partOfSpeech: 'прилагательное' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        ],
        fullTranslation: 'Изучение японского языка - это весело.',
    }
];


const watashiwagakuseidesu: JapaneseAnalysisOutput = {
    sentence: [
      { word: 'わたし', furigana: 'わたし', translation: 'я', partOfSpeech: 'местоимение' },
      { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
      { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
      { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Я студент.'
};

const anokatawagakuseidehaarimasen: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
        { word: 'では', furigana: 'では', translation: 'отрицательная частица', partOfSpeech: 'частица' },
        { word: 'ありません', furigana: 'ありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
    ],
    fullTranslation: 'Тот человек не является студентом.'
};

const watashiwasenseidehaarimasengakuseidesu: JapaneseAnalysisOutput = {
    sentence: [
        { "word": "わたし", "furigana": "わたし", "translation": "я", "partOfSpeech": "местоимение" },
        { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица" },
        { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
        { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "частица" },
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
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'どなた', furigana: 'どなた', translation: 'кто (вежл.)', partOfSpeech: 'вопросительное местоимение' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
    ],
    fullTranslation: 'Кто тот человек?'
};
const anokatawayamadasandesu: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'やまだ', furigana: 'やまだ', translation: 'Ямада', partOfSpeech: 'имя собственное' },
        { word: 'さん', furigana: 'さん', translation: 'господин/госпожа', partOfSpeech: 'суффикс вежливости' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Тот человек — господин Ямада.'
};

const anohitowadaredesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'ひと', furigana: 'ひと', translation: 'человек', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'だれ', furigana: 'だれ', translation: 'кто', partOfSpeech: 'вопросительное местоимение' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
    ],
    fullTranslation: 'Кто тот человек?'
};
const anohitowatanakasandesu: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'ひと', furigana: 'ひと', translation: 'человек', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'たなか', furigana: 'たなか', translation: 'Танака', partOfSpeech: 'имя собственное' },
        { word: 'さん', furigana: 'さん', translation: 'господин/госпожа', partOfSpeech: 'суффикс вежливости' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Тот человек — господин Танака.'
};

const satousanwagishidesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'さとう', furigana: 'さとう', translation: 'Сато', partOfSpeech: 'имя собственное' },
        { word: 'さん', furigana: 'さん', translation: 'господин/госпожа', partOfSpeech: 'суффикс вежливости' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'ぎし', furigana: 'ぎし', translation: 'инженер', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
    ],
    fullTranslation: 'Господин Сато — инженер?'
};
const hai_soudesu_gishidesu: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'はい', furigana: 'はい', translation: 'да', partOfSpeech: 'междометие' },
        { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
        { word: 'そうです', furigana: 'そうです', translation: 'это так', partOfSpeech: 'выражение' },
        { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        { word: 'ぎし', furigana: 'ぎし', translation: 'инженер', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Да, это так. Он инженер.'
};

const anokatawagishidesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'ぎし', furigana: 'ぎし', translation: 'инженер', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
    ],
    fullTranslation: 'Тот человек — инженер?'
};

const yamadasanwagakuseidesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'やまだ', furigana: 'やまだ', translation: 'Ямада', partOfSpeech: 'имя собственное' },
        { word: 'さん', furigana: 'さん', translation: 'господин/госпожа', partOfSpeech: 'суффикс вежливости' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
    ],
    fullTranslation: 'Господин Ямада — студент?'
};
const iie_yamadasanwasenseidesu: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'いいえ', furigana: 'いいえ', translation: 'нет', partOfSpeech: 'междометие' },
        { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
        { word: 'やまだ', furigana: 'やまだ', translation: 'Ямада', partOfSpeech: 'имя собственное' },
        { word: 'さん', furigana: 'さん', translation: 'господин/госпожа', partOfSpeech: 'суффикс вежливости' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'せんせい', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Нет, господин Ямада — учитель.'
};
const anokatawasenseidesuka: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'せんせい', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
        { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
    ],
    fullTranslation: 'Тот человек — учитель?'
};

const iie_anohitowasenseidehaarimasen_gakuseidesu: JapaneseAnalysisOutput = {
    sentence: [
        { word: 'いいえ', furigana: 'いいえ', translation: 'нет', partOfSpeech: 'междометие' },
        { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
        { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
        { word: 'ひと', furigana: 'ひと', translation: 'человек', partOfSpeech: 'существительное' },
        { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
        { word: 'せんせい', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' },
        { word: 'ではありません', furigana: 'ではありません', translation: 'не является', partOfSpeech: 'вспомогательный глагол' },
        { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' },
        { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
        { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
    ],
    fullTranslation: 'Нет, тот человек не учитель. Он студент.'
};




export const grammarAnalyses = {
    sorewanandesuka: {
        sentence: [
            { word: 'それ', furigana: 'それ', translation: 'это', partOfSpeech: 'местоимение' },
            { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
            { word: '何', furigana: 'なん', translation: 'что', partOfSpeech: 'местоимение' },
            { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'частица' },
        ],
        fullTranslation: 'Что это?',
    },
    anokatahasenseidesu: {
        sentence: [
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Тот человек — учитель."
    },
    gakuseihaanohitodesu: {
        sentence: [
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "ひと", "furigana": "ひと", "translation": "человек", "partOfSpeech": "существительное" },
            { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" }
        ],
        "fullTranslation": "Студент — тот человек."
    },
    anokatahasenseidehaarimasen: {
        sentence: [
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица" },
            { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
            { "word": "では", "furigana": "では", "translation": "отрицательная частица", "partOfSpeech": "частица" },
            { "word": "ありません", "furigana": "ありません", "translation": "не является", "partOfSpeech": "вспомогательный глагол" }
        ],
        "fullTranslation": "Тот человек не учитель."
    },
    gakuseihaanohitojaarimasen: {
        sentence: [
            { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
            { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица" },
            { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
            { "word": "ひと", "furigana": "ひと", "translation": "человек", "partOfSpeech": "существительное" },
            { "word": "じゃ", "furigana": "じゃ", "translation": "отрицательная частица (разг.)", "partOfSpeech": "частица" },
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
    bunrei: {
        anokatawadonadesuka_anokatawayamadasandesu: {
            sentence: [
                ...anokatawadonadesuka.sentence,
                { word: '—', furigana: '', translation: '', partOfSpeech: '' },
                ...anokatawayamadasandesu.sentence
            ],
            fullTranslation: "Кто тот человек? — Тот человек господин Ямада."
        },
        anohitowadaredesuka_anohitowatanakasandesu: {
            sentence: [
                ...anohitowadaredesuka.sentence,
                { word: '—', furigana: '', translation: '', partOfSpeech: '' },
                ...anohitowatanakasandesu.sentence
            ],
            fullTranslation: "Кто тот человек? — Тот человек господин Танака."
        },
        satousanwagishidesuka_haisoudesugishidesu: {
            sentence: [
                ...satousanwagishidesuka.sentence,
                { word: '—', furigana: '', translation: '', partOfSpeech: '' },
                ...hai_soudesu_gishidesu.sentence
            ],
            fullTranslation: "Господин Сато инженер? — Да, он инженер."
        },
        anokatawagishidesuka_haisoudesu: {
            sentence: [
                ...anokatawagishidesuka.sentence,
                { word: '—', furigana: '', translation: '', partOfSpeech: '' },
                { word: 'はい', furigana: 'はい', translation: 'да', partOfSpeech: 'междометие' },
                { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
                { word: 'そうです', furigana: 'そうです', translation: 'это так', partOfSpeech: 'выражение' },
            ],
            fullTranslation: "Тот человек инженер? — Да, это так."
        },
        yamadasanwagakuseidesuka_iieyamadasanwasenseidesu: {
            sentence: [
                ...yamadasanwagakuseidesuka.sentence,
                { word: '—', furigana: '', translation: '', partOfSpeech: '' },
                ...iie_yamadasanwasenseidesu.sentence
            ],
            fullTranslation: "Господин Ямада студент? — Нет, господин Ямада учитель."
        },
        anokatawasenseidesuka_iieanohitowasenseidehaarimasengakuseidesu: {
            sentence: [
                ...anokatawasenseidesuka.sentence,
                { word: '—', furigana: '', translation: '', partOfSpeech: '' },
                ...iie_anohitowasenseidehaarimasen_gakuseidesu.sentence
            ],
            fullTranslation: "Тот человек учитель? — Нет, тот человек не учитель. Он студент."
        }
    },
    questions: {
        anokatawadonadesuka,
        anokatawagakuseidesuka: {
            sentence: [
                { "word": "あの", "furigana": "あの", "translation": "тот", "partOfSpeech": "указательное местоимение" },
                { "word": "かた", "furigana": "かた", "translation": "человек (вежл.)", "partOfSpeech": "существительное" },
                { "word": "は", "furigana": "は", "translation": "частица (тема)", "partOfSpeech": "частица" },
                { "word": "がくせい", "furigana": "がくせい", "translation": "студент", "partOfSpeech": "существительное" },
                { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
                { "word": "か", "furigana": "か", "translation": "вопросительная частица", "partOfSpeech": "частица" },
            ],
            fullTranslation: 'Он студент?'
        },
        hai_anokatawagakuseidesu: {
            sentence: [
                { word: 'はい', furigana: 'はい', translation: 'да', partOfSpeech: 'междометие' },
                { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
                { word: 'あの', furigana: 'あの', translation: 'тот', partOfSpeech: 'указательное местоимение' },
                { word: 'かた', furigana: 'かた', translation: 'человек (вежл.)', partOfSpeech: 'существительное' },
                { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица' },
                { word: 'がくせい', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' },
                { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' },
            ],
            fullTranslation: 'Да, он студент.'
        },
        hai_soudesu: {
            sentence: [
                { word: 'はい', furigana: 'はい', translation: 'да', partOfSpeech: 'междометие' },
                { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
                { word: 'そうです', furigana: 'そうです', translation: 'это так', partOfSpeech: 'выражение' },
            ],
            fullTranslation: 'Да, это так.'
        },
        iie_anokatawagakuseidehaarimasen: {
            sentence: [
                { word: 'いいえ', furigana: 'いいえ', translation: 'нет', partOfSpeech: 'междометие' },
                { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
                ...anokatawagakuseidehaarimasen.sentence
            ],
            fullTranslation: 'Нет, он не студент.'
        },
        iie_senseidesu: {
            sentence: [
                { word: 'いいえ', furigana: 'いいえ', translation: 'нет', partOfSpeech: 'междометие' },
                { word: '、', furigana: '', translation: 'запятая', partOfSpeech: 'знак препинания' },
                { "word": "せんせい", "furigana": "せんせい", "translation": "учитель", "partOfSpeech": "существительное" },
                { "word": "です", "furigana": "です", "translation": "есть (связка)", "partOfSpeech": "связка" },
                { word: '。', furigana: '', translation: 'точка', partOfSpeech: 'знак препинания' }
            ],
            fullTranslation: 'Нет, он преподаватель.'
        }
    }
}
