
export interface Word {
    word: string;
    reading: string;
    translation: string;
    pos: 'существительное' | 'глагол' | 'прилагательное' | 'наречие' | 'местоимение' | 'частица' | 'выражение' | 'другое';
    jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

const n5: Word[] = [
    // Существительные
    { word: '人', reading: 'ひと', translation: 'человек', pos: 'существительное', jlpt: 'N5' },
    { word: '学生', reading: 'がくせい', translation: 'студент', pos: 'существительное', jlpt: 'N5' },
    { word: '先生', reading: 'せんせい', translation: 'учитель', pos: 'существительное', jlpt: 'N5' },
    { word: '学校', reading: 'がっこう', translation: 'школа', pos: 'существительное', jlpt: 'N5' },
    { word: '日本', reading: 'にほん', translation: 'Япония', pos: 'существительное', jlpt: 'N5' },
    { word: '日本語', reading: 'にほんご', translation: 'японский язык', pos: 'существительное', jlpt: 'N5' },
    { word: '私', reading: 'わたし', translation: 'я', pos: 'местоимение', jlpt: 'N5' },
    { word: 'あなた', reading: 'あなた', translation: 'ты, вы', pos: 'местоимение', jlpt: 'N5' },
    { word: 'これ', reading: 'これ', translation: 'это (близко ко мне)', pos: 'местоимение', jlpt: 'N5' },
    { word: 'それ', reading: 'それ', translation: 'это (близко к тебе)', pos: 'местоимение', jlpt: 'N5' },
    { word: 'あれ', reading: 'あれ', translation: 'то (далеко от нас)', pos: 'местоимение', jlpt: 'N5' },
    { word: '本', reading: 'ほん', translation: 'книга', pos: 'существительное', jlpt: 'N5' },
    { word: '猫', reading: 'ねこ', translation: 'кошка', pos: 'существительное', jlpt: 'N5' },
    { word: '犬', reading: 'いぬ', translation: 'собака', pos: 'существительное', jlpt: 'N5' },
    { word: '家', reading: 'いえ', translation: 'дом', pos: 'существительное', jlpt: 'N5' },
    { word: '車', reading: 'くるま', translation: 'машина', pos: 'существительное', jlpt: 'N5' },
    { word: '今日', reading: 'きょう', translation: 'сегодня', pos: 'наречие', jlpt: 'N5' },
    { word: '明日', reading: 'あした', translation: 'завтра', pos: 'наречие', jlpt: 'N5' },
    { word: '昨日', reading: 'きのう', translation: 'вчера', pos: 'наречие', jlpt: 'N5' },
    { word: '時間', reading: 'じかん', translation: 'время', pos: 'существительное', jlpt: 'N5' },
    { word: '友達', reading: 'ともだち', translation: 'друг', pos: 'существительное', jlpt: 'N5' },

    // Глаголы
    { word: '行く', reading: 'いく', translation: 'идти', pos: 'глагол', jlpt: 'N5' },
    { word: '来る', reading: 'くる', translation: 'приходить', pos: 'глагол', jlpt: 'N5' },
    { word: '帰る', reading: 'かえる', translation: 'возвращаться', pos: 'глагол', jlpt: 'N5' },
    { word: '食べる', reading: 'たべる', translation: 'есть, кушать', pos: 'глагол', jlpt: 'N5' },
    { word: '飲む', reading: 'のむ', translation: 'пить', pos: 'глагол', jlpt: 'N5' },
    { word: '見る', reading: 'みる', translation: 'смотреть', pos: 'глагол', jlpt: 'N5' },
    { word: '聞く', reading: 'きく', translation: 'слушать, спрашивать', pos: 'глагол', jlpt: 'N5' },
    { word: '読む', reading: 'よむ', translation: 'читать', pos: 'глагол', jlpt: 'N5' },
    { word: '書く', reading: 'かく', translation: 'писать', pos: 'глагол', jlpt: 'N5' },
    { word: '買う', reading: 'かう', translation: 'покупать', pos: 'глагол', jlpt: 'N5' },
    { word: '話す', reading: 'はなす', translation: 'говорить', pos: 'глагол', jlpt: 'N5' },
    { word: 'する', reading: 'する', translation: 'делать', pos: 'глагол', jlpt: 'N5' },
    { word: 'ある', reading: 'ある', translation: 'быть (неодуш.)', pos: 'глагол', jlpt: 'N5' },
    { word: 'いる', reading: 'いる', translation: 'быть (одуш.)', pos: 'глагол', jlpt: 'N5' },

    // Прилагательные
    { word: '大きい', reading: 'おおきい', translation: 'большой', pos: 'прилагательное', jlpt: 'N5' },
    { word: '小さい', reading: 'ちいさい', translation: 'маленький', pos: 'прилагательное', jlpt: 'N5' },
    { word: '新しい', reading: 'あたらしい', translation: 'новый', pos: 'прилагательное', jlpt: 'N5' },
    { word: '古い', reading: 'ふるい', translation: 'старый', pos: 'прилагательное', jlpt: 'N5' },
    { word: 'いい', reading: 'いい', translation: 'хороший', pos: 'прилагательное', jlpt: 'N5' },
    { word: '悪い', reading: 'わるい', translation: 'плохой', pos: 'прилагательное', jlpt: 'N5' },
    { word: '高い', reading: 'たかい', translation: 'высокий, дорогой', pos: 'прилагательное', jlpt: 'N5' },
    { word: '安い', reading: 'やすい', translation: 'дешевый', pos: 'прилагательное', jlpt: 'N5' },
    { word: '好き', reading: 'すき', translation: 'любимый, нравится', pos: 'прилагательное', jlpt: 'N5' },
    { word: '嫌い', reading: 'きらい', translation: 'ненавистный, не нравится', pos: 'прилагательное', jlpt: 'N5' },
    { word: '静か', reading: 'しずか', translation: 'тихий', pos: 'прилагательное', jlpt: 'N5' },
    { word: '元気', reading: 'げんき', translation: 'здоровый, бодрый', pos: 'прилагательное', jlpt: 'N5' },

    // Выражения и другое
    { word: 'はい', reading: 'はい', translation: 'да', pos: 'выражение', jlpt: 'N5' },
    { word: 'いいえ', reading: 'いいえ', translation: 'нет', pos: 'выражение', jlpt: 'N5' },
    { word: 'です', reading: 'です', translation: 'есть (связка)', pos: 'частица', jlpt: 'N5' },
    { word: 'は', reading: 'は', translation: 'частица темы', pos: 'частица', jlpt: 'N5' },
    { word: 'が', reading: 'が', translation: 'частица подлежащего', pos: 'частица', jlpt: 'N5' },
    { word: 'を', reading: 'を', translation: 'частица прямого дополнения', pos: 'частица', jlpt: 'N5' },
    { word: 'に', reading: 'に', translation: 'частица направления, времени', pos: 'частица', jlpt: 'N5' },
    { word: 'で', reading: 'で', translation: 'частица места действия', pos: 'частица', jlpt: 'N5' },
];

export const vocabularyData = {
    n5
};
