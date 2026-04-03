const fs = require('fs');
const path = require('path');

const langs = {
  hindi: {
    hello: { w: 'नमस्ते', t: 'na-mas-te' },
    howAreYou: { p: 'आप कैसे हैं? (Aap kaise hain?)', tr: 'How are you?' },
    market: { t: 'बाज़ार (Market Scene)', s1: 'यह बाज़ार है।', s1t: 'This is a market.', s2: 'पेड़ हरे हैं।', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'क', t: 'ka', ex: 'e.g. कल (kal) = tomorrow' },
    trans: { w1: 'कुत्ता', w1s: 'correct', w2: 'दौड़ता ?', w2s: 'hint', w3: 'पार्क', w3s: 'correct' },
    const: { w: ['मैं', 'खाना', 'खाता', 'हूँ'], tr: 'I (Subject) - food (Object) - eat (Verb)', tip: 'Hindi follows Subject-Object-Verb order.', ex: 'मैं (I) · खाना (food) · खाता हूँ (eat)' }
  },
  bengali: {
    hello: { w: 'নমস্কার', t: 'Na-mas-kar' },
    howAreYou: { p: 'আপনি কেমন আছেন? (Apni kemon achen?)', tr: 'How are you?' },
    market: { t: 'বাজার (Market Scene)', s1: 'এটি একটি বাজার।', s1t: 'This is a market.', s2: 'গাছগুলি সবুজ।', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'ক', t: 'ka', ex: 'e.g. কাল (kal) = tomorrow' },
    trans: { w1: 'কুকুর', w1s: 'correct', w2: 'দৌড়চ্ছে ?', w2s: 'hint', w3: 'পার্ক', w3s: 'correct' },
    const: { w: ['আমি', 'খাবার', 'খাই'], tr: 'I (Subject) - food (Object) - eat (Verb)', tip: 'Bengali follows Subject-Object-Verb order.', ex: 'আমি (I) · খাবার (food) · খাই (eat)' }
  },
  tamil: {
    hello: { w: 'வணக்கம்', t: 'Va-nak-kam' },
    howAreYou: { p: 'நீங்கள் எப்படி இருக்கிறீர்கள்? (Neengal eppadi irukkirirgal?)', tr: 'How are you?' },
    market: { t: 'சந்தை (Market Scene)', s1: 'இது ஒரு சந்தை.', s1t: 'This is a market.', s2: 'மரங்கள் பச்சையாக உள்ளன.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'க', t: 'ka', ex: 'e.g. கடல் (kadal) = sea' },
    trans: { w1: 'நாய்', w1s: 'correct', w2: 'ஓடுகிறது ?', w2s: 'hint', w3: 'பூங்கா', w3s: 'correct' },
    const: { w: ['நான்', 'உணவு', 'சாப்பிடுகிறேன்'], tr: 'I - food - eat', tip: 'Tamil follows Subject-Object-Verb order.', ex: 'நான் (I) · உணவு (food) · சாப்பிடுகிறேன் (eat)' }
  },
  telugu: {
    hello: { w: 'నమస్కారం', t: 'Na-mas-ka-ram' },
    howAreYou: { p: 'మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?)', tr: 'How are you?' },
    market: { t: 'మార్కెట్ (Market Scene)', s1: 'ఇది మార్కెట్.', s1t: 'This is a market.', s2: 'చెట్లు పచ్చగా ఉన్నాయి.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'క', t: 'ka', ex: 'e.g. కల (kala) = dream' },
    trans: { w1: 'కుక్క', w1s: 'correct', w2: 'పరుగెత్తుతోంది ?', w2s: 'hint', w3: 'పార్క్', w3s: 'correct' },
    const: { w: ['నేను', 'ఆహారం', 'తింటాను'], tr: 'I - food - eat', tip: 'Telugu follows SOV order.', ex: 'నేను (I) · ఆహారం (food) · తింటాను (eat)' }
  },
  marathi: {
    hello: { w: 'नमस्कार', t: 'Na-mas-kar' },
    howAreYou: { p: 'तू कसा आहेस? (Tu kasa aahes?)', tr: 'How are you?' },
    market: { t: 'बाजार (Market Scene)', s1: 'हा बाजार आहे.', s1t: 'This is a market.', s2: 'झाडे हिरवी आहेत.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'क', t: 'ka', ex: 'e.g. काम (kaam) = work' },
    trans: { w1: 'कुत्रा', w1s: 'correct', w2: 'धावत आहे ?', w2s: 'hint', w3: 'पार्क', w3s: 'correct' },
    const: { w: ['मी', 'जेवण', 'खातो'], tr: 'I - food - eat', tip: 'Marathi follows SOV order.', ex: 'मी (I) · जेवण (food) · खातो (eat)' }
  },
  gujarati: {
    hello: { w: 'નમસ્તે', t: 'Na-mas-te' },
    howAreYou: { p: 'તમે કેમ છો? (Tame kem cho?)', tr: 'How are you?' },
    market: { t: 'બજાર (Market Scene)', s1: 'આ બજાર છે.', s1t: 'This is a market.', s2: 'વૃક્ષો લીલા છે.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'ક', t: 'ka', ex: 'e.g. કામ (kaam) = work' },
    trans: { w1: 'કૂતરો', w1s: 'correct', w2: 'દોડી રહ્યો છે ?', w2s: 'hint', w3: 'પાર્ક', w3s: 'correct' },
    const: { w: ['હું', 'ખોરાક', 'ખાઉં છું'], tr: 'I - food - eat', tip: 'Gujarati follows SOV order.', ex: 'હું (I) · ખોરાક (food) · ખાઉં છું (eat)' }
  },
  kannada: {
    hello: { w: 'ನಮಸ್ಕಾರ', t: 'Na-mas-ka-ra' },
    howAreYou: { p: 'ನೀವು ಹೇಗಿದ್ದೀರಿ? (Neevu hegiddiri?)', tr: 'How are you?' },
    market: { t: 'ಮಾರುಕಟ್ಟೆ (Market Scene)', s1: 'ಇದು ಮಾರುಕಟ್ಟೆ.', s1t: 'This is a market.', s2: 'ಮರಗಳು ಹಸಿರಾಗಿವೆ.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'ಕ', t: 'ka', ex: 'e.g. ಕೆಲಸ (kelasa) = work' },
    trans: { w1: 'ನಾಯಿ', w1s: 'correct', w2: 'ಓಡುತ್ತಿದೆ ?', w2s: 'hint', w3: 'ಪಾರ್ಕ್', w3s: 'correct' },
    const: { w: ['ನಾನು', 'ಆಹಾರ', 'ತಿನ್ನುತ್ತೇನೆ'], tr: 'I - food - eat', tip: 'Kannada follows SOV order.', ex: 'ನಾನು (I) · ಆಹಾರ (food) · ತಿನ್ನುತ್ತೇನೆ (eat)' }
  },
  malayalam: {
    hello: { w: 'നമസ്കാരം', t: 'Na-mas-ka-ram' },
    howAreYou: { p: 'സുഖമാണോ? (Sukhamano?)', tr: 'How are you?' },
    market: { t: 'മാർക്കറ്റ് (Market Scene)', s1: 'ഇതൊരു മാർക്കറ്റാണ്.', s1t: 'This is a market.', s2: 'മരങ്ങൾ പച്ചയാണ്.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'ക', t: 'ka', ex: 'e.g. കട (kada) = shop' },
    trans: { w1: 'നായ', w1s: 'correct', w2: 'ഓടുന്നു ?', w2s: 'hint', w3: 'പാർക്കിൽ', w3s: 'correct' },
    const: { w: ['ഞാൻ', 'ഭക്ഷണം', 'കഴിക്കുന്നു'], tr: 'I - food - eat', tip: 'Malayalam follows SOV order.', ex: 'ഞാൻ (I) · ഭക്ഷണം (food) · കഴിക്കുന്നു (eat)' }
  },
  punjabi: {
    hello: { w: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', t: 'Sat Sri Akal' },
    howAreYou: { p: 'ਤੁਸੀ ਕਿਵੇਂ ਹੋ? (Tusi kiven ho?)', tr: 'How are you?' },
    market: { t: 'ਬਾਜ਼ਾਰ (Market Scene)', s1: 'ਇਹ ਬਾਜ਼ਾਰ ਹੈ.', s1t: 'This is a market.', s2: 'ਰੁੱਖ ਹਰੇ ਹਨ.', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'ਕ', t: 'ka', ex: 'e.g. ਕੰਮ (kamm) = work' },
    trans: { w1: 'ਕੁੱਤਾ', w1s: 'correct', w2: 'ਦੌੜ ਰਿਹਾ ਹੈ ?', w2s: 'hint', w3: 'ਪਾਰਕ', w3s: 'correct' },
    const: { w: ['ਮੈਂ', 'ਖਾਣਾ', 'ਖਾਂਦਾ', 'ਹਾਂ'], tr: 'I - food - eat', tip: 'Punjabi follows SOV order.', ex: 'ਮੈਂ (I) · ਖਾਣਾ (food) · ਖਾਂਦਾ ਹਾਂ (eat)' }
  },
  urdu: {
    hello: { w: 'سلام', t: 'Sa-lam' },
    howAreYou: { p: 'آپ کیسے ہیں؟ (Aap kaise hain?)', tr: 'How are you?' },
    market: { t: 'بازار (Market Scene)', s1: 'یہ بازار ہے۔', s1t: 'This is a market.', s2: 'درخت سبز ہیں۔', s2t: 'The trees are green.' },
    char: { id: 'alif', c: 'ا', t: 'alif', ex: 'e.g. اچھا (acha) = good' },
    trans: { w1: 'کتا', w1s: 'correct', w2: 'دوڑ رہا ہے ؟', w2s: 'hint', w3: 'پارک', w3s: 'correct' },
    const: { w: ['میں', 'کھانا', 'کھاتا', 'ہوں'], tr: 'I - food - eat', tip: 'Urdu follows SOV order and is written right to left.', ex: 'میں (I) · کھانا (food) · کھاتا ہوں (eat)' }
  },
  odia: {
    hello: { w: 'ନମସ୍କାର', t: 'Na-mas-kar' },
    howAreYou: { p: 'ଆପଣ କେମିତି ଅଛନ୍ତି? (Apan kemiti achanti?)', tr: 'How are you?' },
    market: { t: 'ବଜାର (Market Scene)', s1: 'ଏହା ଏକ ବଜାର |', s1t: 'This is a market.', s2: 'ଗଛଗୁଡିକ ସବୁଜ |', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'କ', t: 'ka', ex: 'e.g. କାମ (kaama) = work' },
    trans: { w1: 'କୁକୁର', w1s: 'correct', w2: 'ଦୌଡୁଛି ?', w2s: 'hint', w3: 'ପାର୍କ', w3s: 'correct' },
    const: { w: ['ମୁଁ', 'ଖାଦ୍ୟ', 'ଖାଏ'], tr: 'I - food - eat', tip: 'Odia follows SOV order.', ex: 'ମୁଁ (I) · ଖାଦ୍ୟ (food) · ଖାଏ (eat)' }
  },
  sanskrit: {
    hello: { w: 'नमो नमः', t: 'Na-mo na-mah' },
    howAreYou: { p: 'कथम् अस्ति भवान्? (Katham asti bhavan?)', tr: 'How are you?' },
    market: { t: 'आपणः (Market Scene)', s1: 'एषः आपणः अस्ति।', s1t: 'This is a market.', s2: 'वृक्षाः हरिताः सन्ति।', s2t: 'The trees are green.' },
    char: { id: 'ka', c: 'क', t: 'ka', ex: 'e.g. करः (karah) = hand' },
    trans: { w1: 'कुक्कुरः', w1s: 'correct', w2: 'धावति ?', w2s: 'hint', w3: 'उद्याने', w3s: 'correct' },
    const: { w: ['अहं', 'भोजनं', 'खादामि'], tr: 'I - food - eat', tip: 'Sanskrit is highly inflected, but SOV is common.', ex: 'अहं (I) · भोजनं (food) · खादामि (eat)' }
  },
  english: {
    hello: { w: 'Hello', t: 'Hel-lo' },
    howAreYou: { p: 'How are you?', tr: 'How are you?' },
    market: { t: 'Market Scene', s1: 'This is a market.', s1t: 'This is a market.', s2: 'The trees are green.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Apple' },
    trans: { w1: 'dog', w1s: 'correct', w2: 'is running ?', w2s: 'hint', w3: 'park', w3s: 'correct' },
    const: { w: ['I', 'eat', 'food'], tr: 'I (Subject) - eat (Verb) - food (Object)', tip: 'English follows Subject-Verb-Object (SVO) order.', ex: 'I · eat · food' }
  },
  spanish: {
    hello: { w: 'Hola', t: 'O-la' },
    howAreYou: { p: '¿Cómo estás?', tr: 'How are you?' },
    market: { t: 'Escena del Mercado', s1: 'Este es un mercado.', s1t: 'This is a market.', s2: 'Los árboles son verdes.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Agua (Water)' },
    trans: { w1: 'perro', w1s: 'correct', w2: 'está corriendo ?', w2s: 'hint', w3: 'parque', w3s: 'correct' },
    const: { w: ['Yo', 'como', 'comida'], tr: 'I - eat - food', tip: 'Spanish follows SVO order similarly to English.', ex: 'Yo (I) · como (eat) · comida (food)' }
  },
  french: {
    hello: { w: 'Bonjour', t: 'Bon-zhoor' },
    howAreYou: { p: 'Comment ça va?', tr: 'How are you?' },
    market: { t: 'Scène de Marché', s1: "C'est un marché.", s1t: 'This is a market.', s2: 'Les arbres sont verts.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Arbre (Tree)' },
    trans: { w1: 'chien', w1s: 'correct', w2: 'court ?', w2s: 'hint', w3: 'parc', w3s: 'correct' },
    const: { w: ['Je', 'mange', 'la nourriture'], tr: 'I - eat - food', tip: 'French follows SVO order.', ex: 'Je (I) · mange (eat) · la nourriture (food)' }
  },
  mandarin: {
    hello: { w: '你好', t: 'Nǐ hǎo' },
    howAreYou: { p: '你好吗? (Nǐ hǎo ma?)', tr: 'How are you?' },
    market: { t: '市场 (Market Scene)', s1: '这是一个市场。', s1t: 'This is a market.', s2: '树是绿色的。', s2t: 'The trees are green.' },
    char: { id: 'ni', c: '你', t: 'nǐ', ex: 'e.g. 你好 (nǐ hǎo) = hello' },
    trans: { w1: '狗', w1s: 'correct', w2: '在跑 ?', w2s: 'hint', w3: '公园', w3s: 'correct' },
    const: { w: ['我', '吃', '食物'], tr: 'I - eat - food', tip: 'Mandarin follows SVO order.', ex: '我 (I) · 吃 (eat) · 食物 (food)' }
  },
  japanese: {
    hello: { w: 'こんにちは', t: 'Kon-ni-chi-wa' },
    howAreYou: { p: 'お元気ですか? (Ogenkidesuka?)', tr: 'How are you?' },
    market: { t: '市場 (Market Scene)', s1: 'ここは市場です。', s1t: 'This is a market.', s2: '木は緑色です。', s2t: 'The trees are green.' },
    char: { id: 'ko', c: 'こ', t: 'ko', ex: 'e.g. こんにちは (konnichiwa) = hello' },
    trans: { w1: '犬は', w1s: 'correct', w2: '走っています ?', w2s: 'hint', w3: '公園で', w3s: 'correct' },
    const: { w: ['私は', '食べ物を', '食べます'], tr: 'I - food - eat', tip: 'Japanese follows Subject-Object-Verb (SOV) order.', ex: '私は (I) · 食べ物を (food) · 食べます (eat)' }
  },
  arabic: {
    hello: { w: 'مرحبا', t: 'Mar-ha-ba' },
    howAreYou: { p: 'كيف حالك؟ (Kayfa haluk?)', tr: 'How are you?' },
    market: { t: 'سوق (Market Scene)', s1: 'هذا سوق.', s1t: 'This is a market.', s2: 'الأشجار خضراء.', s2t: 'The trees are green.' },
    char: { id: 'alif', c: 'ا', t: 'alif', ex: 'e.g. أب (ab) = father' },
    trans: { w1: 'الكلب', w1s: 'correct', w2: 'يركض ؟', w2s: 'hint', w3: 'الحديقة', w3s: 'correct' },
    const: { w: ['أنا', 'آكل', 'الطعام'], tr: 'I - eat - food', tip: 'Arabic can be VSO or SVO.', ex: 'أنا (I) · آكل (eat) · الطعام (food)' }
  },
  german: {
    hello: { w: 'Hallo', t: 'Ha-lo' },
    howAreYou: { p: 'Wie geht es dir?', tr: 'How are you?' },
    market: { t: 'Marktszene', s1: 'Das ist ein Markt.', s1t: 'This is a market.', s2: 'Die Bäume sind grün.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Apfel (Apple)' },
    trans: { w1: 'Hund', w1s: 'correct', w2: 'rennt ?', w2s: 'hint', w3: 'Park', w3s: 'correct' },
    const: { w: ['Ich', 'esse', 'Essen'], tr: 'I - eat - food', tip: 'German follows SVO order in main clauses.', ex: 'Ich (I) · esse (eat) · Essen (food)' }
  },
  portuguese: {
    hello: { w: 'Olá', t: 'O-la' },
    howAreYou: { p: 'Como você está?', tr: 'How are you?' },
    market: { t: 'Cena de Mercado', s1: 'Este é um mercado.', s1t: 'This is a market.', s2: 'As árvores são verdes.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Água (Water)' },
    trans: { w1: 'cachorro', w1s: 'correct', w2: 'está correndo ?', w2s: 'hint', w3: 'parque', w3s: 'correct' },
    const: { w: ['Eu', 'como', 'comida'], tr: 'I - eat - food', tip: 'Portuguese follows SVO order.', ex: 'Eu (I) · como (eat) · comida (food)' }
  },
  korean: {
    hello: { w: '안녕하세요', t: 'An-nyeong-ha-se-yo' },
    howAreYou: { p: '잘 지내요? (Jal  jinaeyo?)', tr: 'How are you?' },
    market: { t: '시장 (Market Scene)', s1: '이것은 시장입니다.', s1t: 'This is a market.', s2: '나무는 녹색입니다.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'ㅏ', t: 'a', ex: 'e.g. 아빠 (appa) = dad' },
    trans: { w1: '개가', w1s: 'correct', w2: '달리고 있습니다 ?', w2s: 'hint', w3: '공원에서', w3s: 'correct' },
    const: { w: ['나는', '음식을', '먹는다'], tr: 'I - food - eat', tip: 'Korean strict SOV word order.', ex: '나는 (I) · 음식을 (food) · 먹는다 (eat)' }
  },
  russian: {
    hello: { w: 'Здравствуйте', t: 'Zdrav-stvu-yte' },
    howAreYou: { p: 'Как дела? (Kak dela?)', tr: 'How are you?' },
    market: { t: 'Рынок (Market Scene)', s1: 'Это рынок.', s1t: 'This is a market.', s2: 'Деревья зеленые.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'А', t: 'a', ex: 'e.g. Арбуз (Watermelon)' },
    trans: { w1: 'собака', w1s: 'correct', w2: 'бежит ?', w2s: 'hint', w3: 'парк', w3s: 'correct' },
    const: { w: ['Я', 'ем', 'еду'], tr: 'I - eat - food', tip: 'Russian typically follows SVO order.', ex: 'Я (I) · ем (eat) · еду (food)' }
  },
  italian: {
    hello: { w: 'Ciao', t: 'Chay-o' },
    howAreYou: { p: 'Come stai?', tr: 'How are you?' },
    market: { t: 'Mercato (Market Scene)', s1: 'Questo è un mercato.', s1t: 'This is a market.', s2: 'Gli alberi sono verdi.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Acqua (Water)' },
    trans: { w1: 'cane', w1s: 'correct', w2: 'sta correndo ?', w2s: 'hint', w3: 'parco', w3s: 'correct' },
    const: { w: ['Io', 'mangio', 'cibo'], tr: 'I - eat - food', tip: 'Italian follows SVO word order.', ex: 'Io (I) · mangio (eat) · cibo (food)' }
  },
  turkish: {
    hello: { w: 'Merhaba', t: 'Mer-ha-ba' },
    howAreYou: { p: 'Nasılsın?', tr: 'How are you?' },
    market: { t: 'Pazar Sahnesi', s1: 'Bu bir pazar.', s1t: 'This is a market.', s2: 'Ağaçlar yeşil.', s2t: 'The trees are green.' },
    char: { id: 'a', c: 'A', t: 'a', ex: 'e.g. Anne (Mother)' },
    trans: { w1: 'köpek', w1s: 'correct', w2: 'koşuyor ?', w2s: 'hint', w3: 'park', w3s: 'correct' },
    const: { w: ['Ben', 'yemek', 'yiyorum'], tr: 'I - food - eat', tip: 'Turkish follows SOV word order.', ex: 'Ben (I) · yemek (food) · yiyorum (eat)' }
  }
};

let pronunciationObj = {};
let repeatObj = {};
let pictureObj = {};
let tracingObj = {};
let translateTypeObj = {};
let constructionObj = {};

for (const [key, val] of Object.entries(langs)) {
  pronunciationObj[key] = [{
    word: val.hello.w, transliteration: val.hello.t, instruction: 'Listen to the word and try to pronounce it. Click the microphone when ready!'
  }];
  repeatObj[key] = [{
    phrase: val.howAreYou.p, translation: val.howAreYou.tr + ' - Native speaker', instruction: 'Listen to the native speaker, then record yourself repeating the phrase.'
  }];
  pictureObj[key] = [{
    id: 'market', title: val.market.t, instruction: "Describe this scene in 1-2 sentences. Speak clearly and use vocabulary you have learned.",
    suggestedSentences: [
      { hindi: val.market.s1, translation: val.market.s1t },
      { hindi: val.market.s2, translation: val.market.s2t }
    ]
  }];
  tracingObj[key] = [{
    id: val.char.id, character: val.char.c, transliteration: val.char.t, example: val.char.ex, instruction: 'Trace the character following the correct stroke order. Try to match the outline!'
  }];
  translateTypeObj[key] = [{
    id: 'dog_park', english: 'The dog is running in the park.', instruction: 'Translate the English sentence and type it below.',
    wordMap: [
      { hindi: val.trans.w1, status: val.trans.w1s },
      { hindi: val.trans.w2, status: val.trans.w2s },
      { hindi: val.trans.w3, status: val.trans.w3s }
    ]
  }];
  constructionObj[key] = [{
    id: 'eat_food', instruction: 'Drag the words into the correct order to form a sentence.',
    words: val.const.w, translation: val.const.tr, grammarTip: val.const.tip, tipExample: val.const.ex
  }];
}

const speakingDataCode = `export const SPEAKING_CHALLENGES = [
  { id: 'pronunciation', title: 'Pronunciation Challenge', time: '~2 min', xp: 10, icon: 'Mic', accent: 'bg-green-500/10 text-green-500', dotColor: 'bg-green-500' },
  { id: 'repeat', title: 'Repeat After Me', time: '~3 min', xp: 10, icon: 'Volume2', accent: 'bg-orange-500/10 text-orange-500', dotColor: 'bg-orange-500' },
  { id: 'picture', title: 'Picture Description', time: '~3 min', xp: 15, icon: 'Image', accent: 'bg-orange-500/10 text-orange-500', dotColor: 'bg-orange-500' },
  { id: 'conversation', title: 'Conversation Simulation', time: '~5 min', xp: 20, icon: 'MessageSquare', accent: 'bg-red-500/10 text-red-500', dotColor: 'bg-red-500' }
];

export const PRONUNCIATION_DATA = ${JSON.stringify(pronunciationObj, null, 2)};
export const REPEAT_DATA = ${JSON.stringify(repeatObj, null, 2)};
export const PICTURE_DATA = ${JSON.stringify(pictureObj, null, 2)};
`;

const writingDataCode = `export const WRITING_CHALLENGES = [
  { id: 'tracing', title: 'Script Tracing', time: '~3 min', xp: 10, icon: 'Feather', accent: 'bg-yellow-500/10 text-yellow-500', dotColor: 'bg-green-500' },
  { id: 'blanks', title: 'Fill in the Blanks', time: '~2 min', xp: 10, icon: 'FileText', accent: 'bg-blue-500/10 text-blue-500', dotColor: 'bg-green-500' },
  { id: 'translate_type', title: 'Translate and Type', time: '~4 min', xp: 15, icon: 'Type', accent: 'bg-indigo-500/10 text-indigo-500', dotColor: 'bg-orange-500' },
  { id: 'construction', title: 'Sentence Construction', time: '~3 min', xp: 15, icon: 'Puzzle', accent: 'bg-emerald-500/10 text-emerald-500', dotColor: 'bg-orange-500' }
];

export const TRACING_DATA = ${JSON.stringify(tracingObj, null, 2)};
export const TRANSLATE_TYPE_DATA = ${JSON.stringify(translateTypeObj, null, 2)};
export const CONSTRUCTION_DATA = ${JSON.stringify(constructionObj, null, 2)};
`;

const destSpeaking = path.join(__dirname, 'frontend/src/data/speakingData.js');
const destWriting = path.join(__dirname, 'frontend/src/data/writingData.js');

fs.writeFileSync(destSpeaking, speakingDataCode);
fs.writeFileSync(destWriting, writingDataCode);
console.log('Language data populated successfully.');
