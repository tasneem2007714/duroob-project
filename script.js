import{initializeApp}from"https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import{getFirestore,doc,setDoc,getDoc,addDoc,collection,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import{getAuth,onAuthStateChanged,signInWithPopup,GoogleAuthProvider,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut}from"https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
// ===== Firebase setup (Firestore) =====
const firebaseConfig={
  apiKey:"AIzaSyCXGrozhMnjYHfwTl0q7Q6XU17M_n4-nnc",
  authDomain:"duroob-project.firebaseapp.com",
  projectId:"duroob-project",
  storageBucket:"duroob-project.firebasestorage.app",
  messagingSenderId:"510195026351",
  appId:"1:510195026351:web:45c356d5d931a6ffea475a"
};
const fbApp=initializeApp(firebaseConfig);
const db=getFirestore(fbApp);
const auth=getAuth(fbApp);
// ===== end Firebase setup =====

const P={
 amman:{
   t:"Amman",a:"عمان",de:"Capital City, Citadel & Downtown Souqs",da:"العاصمة الخالدة، جبل القلعة، وأسواق وسط البلد",
   images:["images/amman/amman-1.jpeg","images/amman/amman-2.jpeg","images/amman/amman-3.jpeg"],
   g:["#2c3e50","#4ca1af"],tagE:"Culture & City Life",tagA:"ثقافة وحياة المدينة",cats:["Food","Culture"]
 },
 petra:{
   t:"Petra",a:"البتراء",de:"Rose Red City & The Great Siq",da:"مدينة الأنباط الوردية والسيق العظيم",
   images:["images/petra/petra-1.jpeg","images/petra/petra-2.jpeg","images/petra/petra-3.jpeg"],
   g:["#f0894f","#7a2e2a"],tagE:"World Wonder",tagA:"عجائب الدنيا",cats:["Adventure","Culture"]
 },
 deadsea:{
   t:"Dead Sea",a:"البحر الميت",de:"Lowest point on Earth & Baptism Site (Maghtas)",da:"أخفض نقطة على الأرض واسترخاء وموقع المغطس",
   images:["images/deadsea/deadsea-1.jpeg","images/deadsea/deadsea-2.jpeg"],
   g:["#22d3c5","#1450a3"],tagE:"Relaxation & Spa",tagA:"استرخاء وعلاج",cats:["Water","Relaxation"]
 },
 aqaba:{
   t:"Aqaba",a:"العقبة",de:"Red Sea Beaches, Diving & Coral Reefs",da:"شواطئ البحر الأحمر والغوص والشعب المرجانية",
   images:["images/aqaba/aqaba-1.jpeg","images/aqaba/aqaba-2.jpeg","images/aqaba/aqaba-3.jpeg"],
   g:["#2fb6f0","#ff9f5a"],tagE:"Marine Tourism",tagA:"سياحة بحرية",cats:["Water","Adventure"]
 },
 wadirum:{
   t:"Wadi Rum",a:"وادي رم",de:"Valley of the Moon & Desert Camping",da:"وادي القمر وسحر الصحراء والتخييم والنجوم",
   images:["images/wadirum/wadirum-1.jpeg","images/wadirum/wadirum-2.jpeg","images/wadirum/wadirum-3.jpeg"],
   g:["#ffb45e","#a13d2d"],tagE:"Adventure & Desert",tagA:"مغامرة وصحراء",cats:["Adventure","Relaxation"]
 },
 madaba:{
   t:"Madaba",a:"مأدبا",de:"City of Mosaics & Historical Religious Sites",da:"مدينة الفسيفساء والمواقع الدينية التاريخية",
   images:["images/madaba/madaba-1.jpeg","images/madaba/madaba-2.jpeg","images/madaba/madaba-3.jpeg"],
   g:["#d9a074","#8a4a1f"],tagE:"Heritage & Religion",tagA:"تراث ودين",cats:["Culture"]
 },
 ajloun:{
   t:"Ajloun",a:"عجلون",de:"Ajloun Castle, Green Forests & Cable Car",da:"قلعة عجلون والغابات الخضراء والتلفريك",
   images:["images/ajloun/ajloun-1.jpeg","images/ajloun/ajloun-2.jpeg","images/ajloun/ajloun-3.jpeg"],
   g:["#8fd16b","#1e6b4f"],tagE:"Nature & History",tagA:"طبيعة وتاريخ",cats:["Nature","Adventure","Food"]
 },
 jerash:{
   t:"Jerash",a:"جرش",de:"City of 1,000 Columns & Ancient Roman Ruins",da:"مدينة الألف عمود والآثار الرومانية الخالدة",
   images:["images/jerash/jerash-1.jpeg","images/jerash/jerash-2.jpeg","images/jerash/jerash-3.jpeg"],
   g:["#e8845a","#5a2a1c"],tagE:"Historical Ruins",tagA:"آثار تاريخية",cats:["Nature","Culture"]
 }
};
Object.entries(P).forEach(([k,v])=>v.id=k);

const localExperiences=[
 {id:"petra_kitchen",images:["images/pk/pk-1.jpeg","images/pk/pk-2.jpeg","images/pk/pk-3.jpeg"],tA:"البتراء — التجربة النبطية والمطبخ النبطي (Petra Kitchen)",tE:"Petra — Nabataean Experience & Petra Kitchen",dA:"المشاركة في ورش طهي تفاعلية لإعداد الأطباق الأردنية والشرقية التراثية مع طهاة محليين.",dE:"Participate in interactive cooking workshops to prepare traditional Jordanian and Middle Eastern dishes with local chefs.",price:"35 JOD"},
 {id:"mansaf",images:["images/mansaf/mansaf-1.jpeg","images/mansaf/mansaf-2.jpeg","images/mansaf/mansaf-3.jpeg"],tA:"طهي وتناول المنسف الأردني الاصيل",tE:"Cook & Enjoy Authentic Mansaf",dA:"تجربة إعداد المنسف بالجميد الكركي واللحم الشعبي مع عائلة أردنية وصبه في السدر على أصوله.",dE:"Cook & taste traditional Mansaf made with Jameed with a local host family.",price:"15 JOD"},
 {id:"bedouin",images:["images/bed/bed-1.jpeg","images/bed/bed-2.jpeg","images/bed/bed-3.jpeg"],tA:"ليلة وتعليلة في بيت شعر بالبادية",tE:"Bedouin Tent Night & Cultural Storytelling",dA:"معايشة الحياة البدوية كاملة، حلب الشياه، إعداد القهوة السادة، والاستماع للقصيد تحت النجوم.",dE:"Experience true Bedouin life: sheep milking, cardamom coffee & storytelling under desert stars.",price:"35 JOD"},
 {id:"olive_bread",images:["images/ob/ob-1.jpeg","images/ob/ob-2.jpeg","images/ob/ob-3.jpeg"],tA:"موسم قطاف الزيتون وخبز الشراك",tE:"Olive Harvest & Taboon Bread Baking",dA:"المشاركة في قطاف الزيتون في الشمال وصنع خبز الشراك على الصاج والمقليات مع أصحاب المزارع.",dE:"Participate in olive picking in northern hills and bake fresh Shrak bread over fire.",price:"12 JOD"},
 {id:"mosaic_craft",images:["images/mc/mc-1.jpeg","images/mc/mc-2.jpeg","images/mc/mc-3.jpeg"],tA:"ورشة صناعة الفسيفساء وتعبئة الرمل",tE:"Mosaic Crafting & Sand Bottle Art",dA:"تعلم تشكيل لوحتك الفسيفسائية الخاصة في مأدبا أو الرسم بالرمل الملون داخل الزجاج بالبتراء.",dE:"Craft your own mosaic piece in Madaba or master colored sand art in Petra.",price:"10 JOD"},
  {id:"jordan_craft_centre",images:["images/jcc/jcc-1.jpeg","images/jcc/jcc-2.jpeg","images/jcc/jcc-3.jpeg"],tA:"مركز الحرف الأردني ",tE:"Jordan Craft Centre — Jabal Amman",dA:"وجهة ثقافية وتجارية في جبل عمان، متخصصة في دعم السيدات والجمعيات النسائية في بيع وتسويق الحرف اليدوية التقليدية والتراثية الأردنية.",dE:"A cultural and commercial destination in Jabal Amman dedicated to supporting women and women's associations in selling and marketing traditional and heritage Jordanian handicrafts.",price:"مجاني / Free"}
];

const leisureSpots=[
 {id:"marine-life",images:["images/ml/ml-1.jpeg","images/ml/ml-2.jpeg","images/ml/ml-3.jpeg"],cityId:"aqaba",tA:"متحف الأحياء البحرية",tE:"Marine Life Museum",dA:"يعرض كائنات من خليج العقبة والبحر الأحمر، مثل الأسماك والشعاب المرجانية والسلاحف. تحققي من الاسم الرسمي وساعات الزيارة قبل النشر.",dE:"A visitor display featuring marine life from the Gulf of Aqaba and the Red Sea, such as fish, coral and turtles. Verify the official venue name and visiting hours before publishing."},
 {id:"climbat-amman",images:["images/clm/clm-1.jpeg","images/clm/clm-2.jpeg","images/clm/clm-3.jpeg"],cityId:"amman",tA:"كليمبات عمّان",tE:"Climbat Amman",dA:"صالة تسلق داخلية بمسارات لمستويات مختلفة. تحققي من الأعمار المسموحة ومتطلبات السلامة والحجز مباشرة من المكان.",dE:"An indoor climbing centre with routes for different experience levels. Confirm age requirements, safety guidance and booking directly with the venue."},
 {id:"wadi-balloon",images:["images/wb/wb-1.jpeg","images/wb/wb-2.jpeg","images/wb/wb-3.jpeg"],cityId:"wadirum",tA:"رحلة منطاد في وادي رم",tE:"Wadi Rum Hot-Air Balloon",dA:"تجربة جوية مقترحة عند الشروق لمشاهدة الصحراء والتكوينات الصخرية. تعتمد على الطقس وتوفر المشغّل.",dE:"A proposed sunrise flight to view the desert and its rock formations. Flights depend on weather and operator availability."},
 {id:"wadi-stargazing",images:["images/ws/ws-1.jpeg","images/ws/ws-2.jpeg","images/ws/ws-3.jpeg"],cityId:"wadirum",tA:"رصد النجوم في وادي رم",tE:"Stargazing in Wadi Rum",dA:"تأمل سماء الصحراء ليلًا ضمن جولة أو نشاط محلي. تأكدي من توفر المرشد أو المعدات قبل الزيارة.",dE:"An opportunity to view the desert sky at night through a local tour or activity. Confirm guide and equipment availability."},
 {id:"petra-night",images:["images/pn/pn-1.jpeg","images/pn/pn-2.jpeg","images/pn/pn-3.jpeg"],cityId:"petra",tA:"فعالية البتراء ليلاً",tE:"Petra by Night",dA:"فعالية مسائية للمشي عبر السيق وصولًا إلى الخزنة على ضوء الشموع. تحققي من أيام الفعالية ومواعيدها وشروط الدخول قبل التخطيط.",dE:"An evening event described as a candlelit walk through the Siq to the Treasury. Check event dates, times and entry requirements before planning."},
 {id:"ajloun-cable-car",images:["images/ajcc/ajcc-1.jpeg","images/ajcc/ajcc-2.jpeg","images/ajcc/ajcc-3.jpeg"],cityId:"ajloun",tA:"تلفريك عجلون",tE:"Ajloun Cable Car",dA:"وسيلة نقل جوية تتكون من كابينات (عربات) مغلقة تتحرك معلقة على أسلاك حديدية قوية، وتتيح مشاهدة الغابات والمشهد الأخضر من الأعلى. تحققي من ساعات التشغيل والأسعار قبل الزيارة.",dE:"An aerial transport system of enclosed cabins suspended from strong steel cables, offering views over the green forests from above. Check operating hours and prices before visiting."},
 {id:"black-iris-farm",images:["images/black/black-1.jpeg","images/black/black-2.jpeg","images/black/black-3.jpeg"],cityId:"madaba",tA:"حديقة ومزرعة السوسنة السوداء للحيوانات",tE:"Black Iris Animal Farm & Park",dA:"مكان عائلي للتعرّف إلى الطيور والحيوانات، وقد تتوفر فيه أنشطة مثل إطعام الحيوانات أو ركوب البوني. تحققي من الأنشطة المتاحة قبل الزيارة.",dE:"A family destination to see birds and animals, with possible activities such as feeding animals or pony rides. Confirm available activities directly before visiting."},
];

const foodPlaces=[
 {id:"tawahin-al-hawa",tA:"مطعم طواحين الهوا",tE:"Tawaheen Al-Hawa Restaurant",locationA:"عرجان، عجلون",locationE:"Arjan, Ajloun"},
 {id:"beit-jiddi",tA:"مطعم بيت جدي",tE:"Beit Jiddi Restaurant",locationA:"عمّان",locationE:"Amman"}
];
// صورتان لكل مطعم: images/food/<id>-1.jpeg و images/food/<id>-2.jpeg
foodPlaces.forEach(r=>{r.images=[1,2].map(n=>`images/food/${r.id}-${n}.jpeg`)});

const religiousData={
 amman:[
  {tA:"كهف أهل الكهف",tE:"Cave of the Seven Sleepers",dA:"الموقع الأثري والتاريخي الذي يُعتقد جازماً أنه الكهف الذي وردت قصته في القرآن الكريم في سورة الكهف، حيث يضم القبور الصخرية التي رقد فيها الفتية المؤمنون وكلبهم، بالإضافة إلى بقايا مسجدين أثريين بُنيا فوق الكهف عبر العصور.",dE:"An archaeological and historical site widely believed to be the cave described in the Quran's Surah Al-Kahf. It contains rock-cut tombs associated with the believing youths and their dog, as well as remains of two historic mosques built above the cave over the centuries."},
  {tA:"مسجد الملك عبد الله الأول",tE:"King Abdullah I Mosque",dA:"تحفة معمارية إسلامية فريدة بقبته الزرقاء الضخمة غير المرتكزة على أعمدة، ويضم المتحف الإسلامي الذي يحتوي على مقتنيات وصور نادرة تروي التاريخ الإسلامي في الأردن، كما أنه من المساجد القليلة في عمّان التي تفتح أبوابها للزوار غير المسلمين للتعرف على الحضارة الإسلامية.",dE:"A distinctive Islamic architectural landmark, known for its large blue dome without supporting columns. It houses an Islamic museum with rare objects and photographs documenting Islamic history in Jordan, and is among the few Amman mosques that welcome non-Muslim visitors to learn about Islamic culture."},
   
 ],
 petra:[
  {tA:"مقام النبي هارون عليه السلام",tE:"Shrine of Prophet Aaron",dA:"يضم القبر التاريخي المنسوب للنبي هارون (شقيق النبي موسى عليه السلام)، والمقام عبارة عن بناء مستطيل أبيض اللون تعلوه قبة، أُعيد ترميمه في العهد المملوكي عام 1320م. يقع على قمة جبل هارون وهي أعلى قمة في البتراء (1350م فوق سطح البحر)، ويوفر إطلالة روحية وبانورامية ساحرة تكشف كامل المنطقة الأثرية.",dE:"The shrine contains the historic tomb attributed to Prophet Aaron, brother of Prophet Moses. It is a white rectangular building topped by a dome, restored during the Mamluk period in 1320 CE. It stands atop Jabal Haroun, Petra's highest peak (1,350 metres above sea level), with panoramic views over the archaeological area."},
  {tA:"المجمع الكنسي البيزنطي",tE:"Byzantine Monastic Complex",dA:"كشفت التنقيبات الأثرية عن وجود مجمع دير رهباني متكامل يعود للقرنين الرابع والخامس الميلاديين أسفل منحدرات جبل هارون. كان المجمع يضم كنيسة بازيليكية ضخمة ونُزُلًا مخصصاً لاستقبال الحجاج المسيحيين القدامى الذين كانوا يمرون بالمنطقة في طريقهم إلى سيناء ومصر.",dE:"Archaeological excavations revealed a monastic complex dating to the fourth and fifth centuries CE below the slopes of Jabal Haroun. It included a large basilica and lodging for Christian pilgrims travelling through the area toward Sinai and Egypt."}
 ],
 aqaba:[
  {tA:"كنيسة العقبة الأثرية",tE:"Historic Aqaba Church",dA:"تعد أقدم كنيسة مبنية في العالم اكتُشفت حتى الآن (تعود لعام 290م أواخر القرن الثالث الميلادي).",dE:"Considered the oldest purpose-built Christian church discovered to date (dating back to 290 AD)."},
  {tA:"مسجد الشريف الحسين بن علي",tE:"Sharif Hussein Bin Ali Mosque",dA:"الأيقونة المعمارية الأبرز في العقبة، يتميز ببنائه الأبيض الناصع وقبابه الضخمة المستوحاة من العمارة الفاطمية.",dE:"Architectural icon in Aqaba, characterized by its bright white Fatimid Islamic style."}
 ],
 
};

const heritageData={
 amman:[
  {tA:"جبل القلعة",tE:"Amman Citadel",dA:"يمثل نقطة البداية لتاريخ عمّان، حيث تعاقبت عليه العصور البرونزية والحديدية والرومانية والإسلامية.",dE:"A starting point for Amman's history, with successive Bronze Age, Iron Age, Roman, and Islamic periods represented at the site."},
  {tA:"متحف الأردن",tE:"The Jordan Museum",dA:"يُعد المتحف الوطني الأبرز والأحدث في المملكة. يعرض قصة الأردن وتاريخه عبر قاعات تفاعلية مذهلة، ويحتوي على أقدم تماثيل بشرية صنعها الإنسان في التاريخ (تماثيل عين غزال التي تعود لـ 9000 عام)، بالإضافة إلى جزء من مخطوطات البحر الميت الأثرية الشهيرة.",dE:"Jordan's leading modern national museum, presenting the country's story and history through interactive galleries. Its collection includes the 9,000-year-old Ain Ghazal statues, among the earliest human statues made, as well as part of the famous Dead Sea Scrolls."},
],
 aqaba:[
  {tA:"قلعة العقبة",tE:"Aqaba Castle",dA:"حصن مملوكي تاريخي شهد أحداثاً محورية في الثورة العربية الكبرى عام 1917 وتضم تحصينات عسكرية وسراديب أثرية.",dE:"A historic Mamluk fortress associated with key events of the Great Arab Revolt in 1917, with military fortifications and archaeological passageways."},
  {tA:"متحف آثار العقبة",tE:"Aqaba Archaeological Museum",dA:"قصر تاريخي للشريف الحسين بن علي مبني على الطراز الحجازي ويعرض قطعاً فخارية ودنانير ذهبية كوفية نادرة عُثر عليها في المنطقة.",dE:"A historic palace of Sharif Hussein bin Ali, built in the Hejazi style, displaying pottery and rare Kufic gold dinars found in the region."}
 ],
 petra:[
  {tA:"الخزنة",tE:"The Treasury",dA:"الواجهة النبطية الأكثر شهرة وسحراً المحفورة بالكامل في الصخر الوردي والتي كانت مقبرة ملكية وصرحاً معمارياً مذهلاً.",dE:"Petra's best-known Nabataean façade, carved into rose-colored rock and traditionally associated with a royal tomb; it is a remarkable architectural monument."},
  {tA:"السيق",tE:"The Siq",dA:"ممر صخري طبيعي ضيق ومتعرج يمتد لـ 1.2 كم ويشكل المدخل الرئيسي للمدينة ويضم قنوات مياه نبطية قديمة.",dE:"A narrow, winding natural rock passage about 1.2 kilometres long, forming the main entrance to Petra and containing ancient Nabataean water channels."},
 
 ]
};
Object.assign(religiousData,{
 deadsea:[
  {tA:"موقع المَغطس",tE:"Baptism Site (Al-Maghtas)",dA:"المكان الفعلي الذي عُمّد فيه السيد المسيح على يد يوحنا المعمدان في نهر الأردن.",dE:"The site traditionally identified as where Jesus Christ was baptised by John the Baptist in the Jordan River."},
  {tA:"جبل نيبو",tE:"Mount Nebo",dA:"الموقع الذي وقف عليه النبي موسى عليه السلام لرؤية الأرض المقدسة.",dE:"The site where Prophet Moses, peace be upon him, is said to have stood to view the Holy Land."}
 ],
 wadirum:[
  {tA:"نقوش جبل «أم عِشرين» الإسلامية",tE:"Islamic Inscriptions of Jabal Umm Ishrin",dA:"يحتوي الجبل على واجهات صخرية تضم أقدم النقوش والكتابات الإسلامية بالخط الكوفي المبكر.",dE:"The mountain has rock faces bearing some of the earliest Islamic inscriptions, written in early Kufic script."},
  
 ],
 madaba:[
  {tA:"قلعة هيرودوس",tE:"Herod's Fortress (Machaerus)",dA:"بقايا قلعة قديمة تقع على قمة جبل شاهق ومنعزل يطل على البحر الميت.",dE:"The remains of an ancient fortress on top of a tall, isolated mountain overlooking the Dead Sea."},
  {tA:"كنيسة الخارطة",tE:"Church of the Map (St. George)",dA:"تحتوي على أقدم خريطة ليروزاليم (القدس) والأراضي المقدسة في العالم مصممة من ملايين قطع الفسيفساء الملونة.",dE:"Home to the oldest known map of Jerusalem and the Holy Land, made from millions of coloured mosaic pieces."}
 ],
 ajloun:[
  {tA:"سيدة الجبل",tE:"Our Lady of the Mountain",dA:"كنيسة كاثوليكية قديمة وهادئة تضم مغارة ومزاراً مخصصاً للسيدة العذراء.",dE:"An old, peaceful Catholic church with a grotto and a shrine dedicated to the Virgin Mary."},
  {tA:"كنيسة مار الياس",tE:"Church of Mar Elias",dA:"تلة أثرية خضراء تضم بقايا واحدة من أكبر الكنائس البيزنطية الأثرية في الأردن. ويُعد المكان دينياً وتاريخياً مسقط رأس النبي إلياس (إيليا) عليه السلام.",dE:"A green archaeological hill with the remains of one of the largest Byzantine churches in Jordan, regarded religiously and historically as the birthplace of Prophet Elijah (Elias)."}
 ],
 jerash:[
  {tA:"مسجد جرش الأموي",tE:"Jerash Umayyad Mosque",dA:"أقدم المساجد الأثرية المكتشفة في المنطقة ويعود للفترة الأموية.",dE:"The oldest archaeological mosque discovered in the area, dating to the Umayyad period."}
 ]
});

Object.assign(heritageData,{
 deadsea:[
  {tA:"متحف أخفض مكان على الأرض",tE:"Lowest Place on Earth Museum",dA:"يعرض التاريخ الحضاري والثقافي للمنطقة منذ العصر الحجري حتى العصر الإسلامي، ويحتوي على مكتشفات أثرية نادرة وفسيفساء بيزنطية، بالإضافة إلى تسليط الضوء على صناعة السكر القديمة في الأغوار.",dE:"Presents the cultural history of the region from the Stone Age to the Islamic era, with rare archaeological finds and Byzantine mosaics, and highlights the ancient sugar industry of the Jordan Valley."},
  
 ],
 wadirum:[
  {tA:"معبد عين شلالة النبطي",tE:"Ain Shallalah Nabataean Temple",dA:"موقع مقدس ومفتوح في الهواء الطلق للأنباط يحتوي على 27 نقشاً أثرياً باللغة النبطية واليونانية القديمة تركها البناؤون والنحاتون والمعماريون الأنباط الذين كانوا يقدسون عيون الماء ويمارسون عندها طقوسهم الدينية واليومية قبل آلاف السنين.",dE:"An open-air sacred Nabataean site with 27 inscriptions in Nabataean and ancient Greek, left by Nabataean builders, sculptors and architects who revered water springs and held their religious and daily rituals there thousands of years ago."},
  
 ],
 madaba:[
  {tA:"قصر الحرقان",tE:"Al-Haraqan Palace",dA:"بيت تراثي قديم جداً تم ترميمه، وأرضيته مليئة بالرسومات والزخارف الأرضية الملونة.",dE:"A very old heritage house that has been restored, with floors full of coloured drawings and decorative patterns."}
 ],
 ajloun:[
  {tA:"قلعة عجلون",tE:"Ajloun Castle",dA:"بناها القائد عز الدين أسامة (أحد قادة صلاح الدين الأيوبي) لحماية المنطقة من الصليبيين ومراقبة طرق التجارة.",dE:"Built by Izz ad-Din Usama, one of Saladin's commanders, to protect the region from the Crusaders and monitor trade routes."}
 ],
 jerash:[
  {tA:"ساحة الندوة",tE:"Oval Plaza",dA:"من أندر الساحات الرومانية في العالم بسبب تصميمها البيضاوي غير التقليدي.",dE:"One of the rarest Roman plazas in the world because of its unusual oval design."},
  {tA:"شارع الأعمدة",tE:"Colonnaded Street",dA:"هو الشريان الرئيسي للمدينة الرومانية القديمة.",dE:"The main artery of the ancient Roman city."}
 ]
});
/* ===== مسارات الصور المحلية (الإضافة الجديدة) ===== */
const PHOTOS=3; // عدد الصور لكل عنصر
const addImages=(list,folder)=>list.forEach(x=>{
  x.images=Array.from({length:PHOTOS},(_,n)=>`images/${folder}/${x.id}-${n+1}.jpeg`);
});

[["religious",religiousData],["heritage",heritageData]].forEach(([folder,data])=>{
  Object.entries(data).forEach(([city,list])=>list.forEach((x,i)=>{
    x.images=Array.from({length:PHOTOS},(_,n)=>`images/${folder}/${city}/${i+1}-${n+1}.jpeg`);
  }));
});const AR={
 "Home":"الرئيسية","Discover":"اكتشف","Map":"الخريطة","Budget Planner":"مخطط الميزانية",
 "Tours & Trips":"الرحلات","Planner":"المخطط","Trips":"الرحلات",
 "Stories":"مرشد دروب","Saved":"المحفوظات","Jordan, your way":"الأردن على طريقتك",
 "Explore Jordan":"استكشف الأردن","Live Jordanian":"عِش أردنيًا","Hidden Jordan":"خفايا الأردن",
 "Nature":"طبيعة","Water":"مائي","Adventure":"مغامرة",
 "Relaxation":"استرخاء","Food":"طعام"
};

let L="ar",selectedCityId=null,selectedTripType="vip",currentCategory="religious";
const tr=s=>L==="ar"?(AR[s]||s):(s==="Stories"?"Digital Guide":s);
const nm=p=>L==="ar"?p.a:p.t;
const desc=p=>L==="ar"?p.da:p.de;
const tag=p=>L==="ar"?p.tagA:p.tagE;
const bg=p=>`background:linear-gradient(160deg,${p.g[0]},${p.g[1]})`;
const visualBg=p=>imageList(p).length?`background-image:url('${imageList(p)[0]}');background-size:cover;background-position:center`:bg(p);
const text=(ar,en)=>L==="ar"?ar:en;
const S={stack:["home"],moods:new Set()};
const $=s=>document.querySelector(s);
let cur="home",rot,galleryTimers=[];

const imageList=item=>{
  if(Array.isArray(item?.images))return item.images.filter(Boolean);
  return item?.img?[item.img]:[];
};


const gallery=(item,label,extraClass="")=>{
  const images=imageList(item);
  return `<div class="gallery ${extraClass}" data-gallery aria-label="${label}">
    ${images.length?images.map((src,index)=>`<img src="${src}" alt="${label} ${index+1}" class="${index===0?"on":""}" loading="lazy" onerror="this.remove()">`).join(""):`<div class="gallery-empty">${label}</div>`}
  </div>`;
};

function initGalleries(){
  galleryTimers.forEach(timer=>clearInterval(timer));
  galleryTimers=[];
  document.querySelectorAll("[data-gallery]").forEach(galleryElement=>{
    const slides=galleryElement.querySelectorAll("img");
    if(slides.length<2)return;
    let index=0;
    galleryTimers.push(setInterval(()=>{
      slides[index].classList.remove("on");
      index=(index+1)%slides.length;
      slides[index].classList.add("on");
    },3000));
  });
}

function loadSavedCities(){
  try{
    const value=JSON.parse(localStorage.getItem("duroob-saved-cities")||"[]");
    return new Set(Array.isArray(value)?value.filter(id=>P[id]):[]);
  }catch{return new Set()}
}
const savedCities=loadSavedCities();
function loadSavedSouq(){
  try{
    const value=JSON.parse(localStorage.getItem("duroob-saved-souq")||"[]");
    return new Set(Array.isArray(value)?value.filter(id=>typeof id==="string"):[]);
  }catch{return new Set()}
}
const savedSouq=loadSavedSouq();

function persistSavedCities(){
  try{
    localStorage.setItem("duroob-saved-cities",JSON.stringify([...savedCities]));
    localStorage.setItem("duroob-saved-souq",JSON.stringify([...savedSouq]));
  }catch{}
  const user=auth.currentUser;
  if(user){
    // saved items live under the signed-in user's own document (users/uid), protected by Firestore rules
    setDoc(doc(db,"savedCities",user.uid),{cities:[...savedCities],souq:[...savedSouq],updatedAt:serverTimestamp()})
      .catch(err=>console.error("Firestore: saving items failed",err));
  }
  return true;
}

async function loadSavedCitiesFromFirebase(){
  const user=auth.currentUser;
  if(!user)return;
  try{
    const snap=await getDoc(doc(db,"savedCities",user.uid));
    if(!auth.currentUser||auth.currentUser.uid!==user.uid)return;
    if(snap.exists()){
      const data=snap.data();
      if(Array.isArray(data.cities)){
        savedCities.clear();
        data.cities.filter(id=>P[id]).forEach(id=>savedCities.add(id));
      }
      if(Array.isArray(data.souq)){
        savedSouq.clear();
        data.souq.filter(id=>typeof id==="string").forEach(id=>savedSouq.add(id));
      }
      try{
        localStorage.setItem("duroob-saved-cities",JSON.stringify([...savedCities]));
        localStorage.setItem("duroob-saved-souq",JSON.stringify([...savedSouq]));
      }catch{}
      renderCurrentPage();
    }
  }catch(err){console.error("Firestore: loading saved items failed",err)}
}

function saveDemoRequest(request){
  try{
    const requests=JSON.parse(localStorage.getItem("duroob-demo-requests")||"[]");
    if(Array.isArray(requests)){
      requests.push({...request,savedAt:new Date().toISOString(),sent:false});
      localStorage.setItem("duroob-demo-requests",JSON.stringify(requests));
    }
  }catch{}
  addDoc(collection(db,"requests"),{...request,uid:auth.currentUser?auth.currentUser.uid:null,createdAt:serverTimestamp()})
    .catch(err=>console.error("Firestore: saving enquiry failed",err));
  return true;
}

const toast=m=>{
  const element=$("#ts");
  element.textContent=m;
  element.classList.add("show");
  setTimeout(()=>element.classList.remove("show"),2600);
};
const bookBtn=(title,extra="")=>`<button class="btn book" ${extra} data-act="fakeBook" data-title="${title}">${text("احجز","Book")}</button>`;
const card=(p,i=0)=>`
  <div class="card" style="--i:${i}" data-act="openCityPage" data-id="${p.id}">
    <button class="card-save" type="button" data-act="toggleSaved" data-id="${p.id}" aria-label="${savedCities.has(p.id)?text("إزالة من المحفوظات","Remove from saved"):text("حفظ المكان","Save place")}">
      ${savedCities.has(p.id)?"♥️":"♡"}
    </button>
    <div class="im">${imageList(p).length?gallery(p,nm(p)):gallery({images:[]},nm(p),"city-gallery")}</div>
    <div class="tx"><b>${nm(p)}</b><span>${desc(p)}</span><em>${tag(p)}</em></div>
  </div>`;
const grid=items=>`<div class="grid">${items.map((item,index)=>card(item,index)).join("")}</div>`;

const localCard=item=>`
  <div class="local-card">
    ${gallery(item,L==="ar"?`تجربة ${item.tA}`:`${item.tE} experience`)}
    <div>
      <b style="font-size:16px;color:var(--n);display:block;margin-bottom:6px">${L==="ar"?item.tA:item.tE}</b>
      <p style="font-size:13px;color:#4c6478;white-space:pre-line">${L==="ar"?item.dA:item.dE}</p>
    </div>
    <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
      <span style="font-weight:800;color:var(--c);width:100%">${text("سعر توضيحي:","Illustrative price:")} ${item.price}</span>
      <div style="display:flex;gap:8px;width:100%">
        <button class="btn book" style="margin-top:0" data-act="bookExp" data-title="${L==="ar"?item.tA:item.tE}">${text("استفسار","Enquiry")}</button>
        ${bookBtn(L==="ar"?item.tA:item.tE,'style="margin-top:0"')}
      </div>
    </div>
  </div>`;

const leisureCard=item=>{
  const city=P[item.cityId];
  return `<article class="hid-card">
    ${gallery(item,L==="ar"?item.tA:item.tE)}
   <div class="tx"><b>${L==="ar"?item.tA:item.tE}</b><em>${city?nm(city):""}</em><p>${L==="ar"?item.dA:item.dE}</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn book" style="margin-top:0" data-act="bookExp" data-title="${L==="ar"?item.tA:item.tE}">${text("استفسار","Enquiry")}</button>
        ${bookBtn(L==="ar"?item.tA:item.tE,'style="margin-top:0"')}
      </div></div>
  </article>`;
};

const foodCard=item=>`<article class="rel-card">
  ${gallery(item,text("صورة المطعم","Restaurant photo"),"food-gallery")}
  <h3>${L==="ar"?item.tA:item.tE}</h3>
  <div class="sub">${text("الموقع:","Location:")} ${L==="ar"?item.locationA:item.locationE}</div>
  <div class="food-res"><button class="btn book" type="button" data-act="foodReserve" data-id="${item.id}">${text("احجز طاولة","Reserve a table")}</button></div>
</article>`;

function getFilteredCities(){
  const keys=["amman","aqaba","petra","deadsea","wadirum","madaba","ajloun","jerash"];
  const cities=keys.map(key=>P[key]);
  const moods=[...S.moods].filter(mood=>mood!=="Live Jordanian"&&mood!=="Hidden Jordan"&&mood!=="Food");
  if(moods.length===0)return cities;
  return cities.filter(city=>moods.some(mood=>city.cats?.includes(mood)));
}

let jordanMap=null;
function initJordanMap(){
  const status=$("#mapStatus"),mapElement=$("#jordanMap");
  if(!mapElement)return;
  if(!window.L){
    if(status)status.textContent=text("تعذر تحميل مكتبة الخريطة. تحققي من اتصال الإنترنت ثم أعيدي فتح الصفحة.","The map library could not be loaded. Check the internet connection and reopen the page.");
    return;
  }
  if(jordanMap){jordanMap.remove();jordanMap=null}
  try{
    jordanMap=window.L.map(mapElement,{scrollWheelZoom:false}).setView([31.25,35.8],7);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom:19,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
    }).addTo(jordanMap);
    const points={
      amman:[31.9539,35.9106],petra:[30.3285,35.4444],deadsea:[31.5,35.5],aqaba:[29.5321,35.0063],
      wadirum:[29.5764,35.42],madaba:[31.7167,35.7939],ajloun:[32.3323,35.7517],jerash:[32.2747,35.8961]
    };
    Object.entries(points).forEach(([id,coords])=>{
      const city=P[id],marker=window.L.marker(coords).addTo(jordanMap);
      marker.bindPopup(`<strong>${nm(city)}</strong><br><button type="button" class="map-open" data-act="openCityPage" data-id="${city.id}">${text("عرض الوجهة","View destination")}</button>`);
      marker.on("click",()=>showPlaceWeather(nm(city),coords[0],coords[1],{noMarker:true,noMove:true}));
    });
    if(status)status.textContent=text("العلامات تقريبية وتمثل مناطق المدن والوجهات.","Markers are approximate and represent city and destination areas.");
    setTimeout(()=>jordanMap?.invalidateSize(),0);
  }catch(error){
    if(status)status.textContent=text("تعذر عرض الخريطة. يمكنك استخدام قائمة الوجهات أدناه.","The map could not be displayed. You can use the destination list below.");
    console.error("Could not initialize the Jordan map:",error);
  }
}

// ===== Map search + live weather (OpenStreetMap Nominatim + Open-Meteo, no API keys) =====
const WX={
  0:["☀️","سماء صافية","Clear sky"],
  1:["🌤️","صافٍ غالبًا","Mostly clear"],
  2:["⛅","غائم جزئيًا","Partly cloudy"],
  3:["☁️","غائم","Overcast"],
  45:["🌫️","ضباب","Fog"],
  53:["🌦️","رذاذ","Drizzle"],
  63:["🌧️","مطر","Rain"],
  65:["🌧️","مطر غزير","Heavy rain"],
  73:["🌨️","ثلج","Snow"],
  81:["🌧️","زخات مطر","Rain showers"],
  95:["⛈️","عاصفة رعدية","Thunderstorm"]
};
function wxInfo(code){
  if(WX[code])return WX[code];
  if(code===48)return WX[45];
  if(code>=51&&code<=57)return WX[53];
  if(code>=61&&code<=67)return WX[63];
  if(code>=71&&code<=77)return WX[73];
  if(code>=80&&code<=86)return WX[81];
  if(code>=95)return WX[95];
  return ["🌡️","غير معروف","Unknown"];
}
const escHtml=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const wxCache=new Map();
async function fetchWeather(lat,lon){
  const key=lat.toFixed(2)+","+lon.toFixed(2);
  const hit=wxCache.get(key);
  if(hit&&Date.now()-hit.t<15*60*1000)return hit.d;
  const url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
  const res=await fetch(url);
  if(!res.ok)throw new Error("Weather HTTP "+res.status);
  const data=await res.json();
  if(!data.current)throw new Error("No weather data");
  wxCache.set(key,{t:Date.now(),d:data.current});
  return data.current;
}

// ===== Weather-based picks: ranks every destination by its own current weather (one Open-Meteo request) =====
const CITY_POINTS={amman:[31.9539,35.9106],petra:[30.3285,35.4444],deadsea:[31.5,35.5],aqaba:[29.5321,35.0063],wadirum:[29.5764,35.42],madaba:[31.7167,35.7939],ajloun:[32.3323,35.7517],jerash:[32.2747,35.8961]};
// Simple, adjustable rules: points per category for each kind of weather
const WX_PREF={
  rain:{Culture:3,Food:3,Relaxation:1,Adventure:-2,Nature:-1},
  hot:{Water:3,Relaxation:2,Culture:1,Food:1,Adventure:-2},
  cold:{Culture:3,Food:3,Relaxation:2,Adventure:-1},
  mild:{Adventure:3,Nature:3,Culture:2,Water:1,Food:1}
};
const WX_MODE_TXT={
  rain:["ممطر: الأفضل أماكن مغلقة وتجارب ثقافية","Rainy: best for indoor and cultural plans"],
  hot:["حار: مناسب للمياه والاسترخاء، وزيارة المواقع المكشوفة صباحًا أو مساءً","Hot: good for water and relaxation; visit outdoor sites early or late"],
  cold:["بارد: مناسب للثقافة والطعام والأماكن الدافئة","Cool: good for culture, food and warm spots"],
  mild:["جو لطيف: مناسب للأنشطة الخارجية والطبيعة","Pleasant: great for outdoor activities and nature"]
};
function wxMode(w){
  const c=w.weather_code,feel=w.apparent_temperature;
  if((c>=51&&c<=67)||(c>=80&&c<=99))return"rain";
  if(feel>=34)return"hot";
  if(feel<=10)return"cold";
  return"mild";
}
function wxScore(city,w){
  const pref=WX_PREF[wxMode(w)],windy=w.wind_speed_10m>=35;
  return(city.cats||[]).reduce((sum,cat)=>sum+(pref[cat]||0)-(windy&&cat==="Adventure"?2:0)-(windy&&cat==="Water"?1:0),0);
}
async function fetchAllCityWeather(){
  const ids=Object.keys(CITY_POINTS).filter(id=>P[id]);
  const hit=wxCache.get("all");
  if(hit&&Date.now()-hit.t<15*60*1000)return hit.d;
  const lat=ids.map(id=>CITY_POINTS[id][0]).join(","),lon=ids.map(id=>CITY_POINTS[id][1]).join(",");
  const url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
  const res=await fetch(url);
  if(!res.ok)throw new Error("Weather HTTP "+res.status);
  const data=await res.json();
  const list=Array.isArray(data)?data:[data];
  const out={};
  ids.forEach((id,i)=>{if(list[i]&&list[i].current)out[id]=list[i].current});
  if(!Object.keys(out).length)throw new Error("No weather data");
  wxCache.set("all",{t:Date.now(),d:out});
  return out;
}
async function showWeatherPicks(){
  const out=$("#wxRecOut"),btn=$("#wxRecBtn");
  if(!out)return;
  out.innerHTML=`<div class="note">${text("جارٍ فحص طقس الوجهات...","Checking the weather at each destination...")}</div>`;
  if(btn)btn.disabled=true;
  try{
    const all=await fetchAllCityWeather();
    const ranked=Object.keys(all)
      .map(id=>({city:P[id],w:all[id],score:wxScore(P[id],all[id])}))
      .sort((a,b)=>b.score-a.score).slice(0,3);
    const items=ranked.map((r,i)=>{
      const info=wxInfo(r.w.weather_code),mode=wxMode(r.w),windy=r.w.wind_speed_10m>=35;
      const why=text(WX_MODE_TXT[mode][0],WX_MODE_TXT[mode][1])
        +(windy?text(" · رياح قوية: انتبه في الأماكن المكشوفة"," · Strong wind: take care in exposed places"):"");
      return `<div>${card(r.city,i)}<div class="note" style="margin-top:8px"><b style="unicode-bidi:plaintext">${info[0]} ${Math.round(r.w.temperature_2m)}°C</b> · ${text(info[1],info[2])}<br>${why}</div></div>`;
    }).join("");
    out.innerHTML=`<h3 style="margin-top:22px">${text("الأنسب لجو اليوم","Best for today's weather")}</h3><div class="grid">${items}</div>`
      +`<p class="sub" style="margin-top:10px">${text("توصيات تقريبية حسب الطقس الحالي من Open-Meteo.","Approximate picks based on current weather from Open-Meteo.")}</p>`;
  }catch(error){
    console.error("Weather picks failed:",error);
    out.innerHTML=`<div class="note">${text("تعذر جلب الطقس الآن، حاول لاحقًا.","Couldn't load the weather right now. Please try again later.")}</div>`;
  }finally{
    if(btn)btn.disabled=false;
  }
}
function bindWxPicks(){
  const btn=$("#wxRecBtn");
  if(btn)btn.addEventListener("click",showWeatherPicks);
}

async function geocodePlace(query){
  const url="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=jo&accept-language="+(L==="ar"?"ar":"en")+"&q="+encodeURIComponent(query);
  const res=await fetch(url);
  if(!res.ok)throw new Error("Search HTTP "+res.status);
  const list=await res.json();
  return list[0]||null;
}

let weatherMarker=null,wxToken=0;

function weatherCardHtml(name,w,lat,lon){
  const dirUrl="https://www.google.com/maps/dir/?api=1&destination="+lat+","+lon+"&travelmode=driving";
  const row=(label,val)=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-top:1px solid #f0e2d0;font-size:14px"><span style="color:#4c6478">${label}</span><b>${val}</b></div>`;
  let body;
  if(w==="loading"){
    body=`<div style="padding:22px 0;color:#4c6478">${text("جارٍ تحميل الطقس...","Loading weather...")}</div>`;
  }else if(!w){
    body=`<div style="padding:18px 0;color:#4c6478">${text("تعذر جلب الطقس الآن.","Could not load the weather right now.")}</div>`;
  }else{
    const info=wxInfo(w.weather_code);
    body=`<div style="display:flex;align-items:center;gap:14px;margin:12px 0 8px"><span style="font-size:50px;line-height:1">${info[0]}</span><div><div style="font-size:36px;font-weight:800;color:#10264a;direction:ltr;text-align:start">${Math.round(w.temperature_2m)}°C</div><div style="font-size:15px;color:#4c6478">${text(info[1],info[2])}</div></div></div>`
      +row(text("الإحساس","Feels like"),Math.round(w.apparent_temperature)+"°C")
      +row(text("الرطوبة","Humidity"),w.relative_humidity_2m+"%")
      +row(text("الرياح","Wind"),Math.round(w.wind_speed_10m)+" km/h");
  }
  return `<div style="font-size:12px;color:#c9563a;font-weight:700">${text("الطقس الآن","Weather now")}</div>`
    +`<div style="font-size:21px;font-weight:800;color:#10264a;margin-top:2px;unicode-bidi:plaintext">${escHtml(name)}</div>${body}`
    +`<a href="${dirUrl}" target="_blank" rel="noopener" class="btn" style="display:block;text-align:center;text-decoration:none;margin-top:14px">${text("اتجاهات إلى الموقع","Get directions")}</a>`;
}

async function showPlaceWeather(name,lat,lon,opts={}){
  const card=$("#weatherCard"),status=$("#mapStatus");
  if(!jordanMap||!card)return;
  const token=++wxToken;
  card.innerHTML=weatherCardHtml(name,"loading",lat,lon);
  if(!opts.noMarker){
    if(weatherMarker)jordanMap.removeLayer(weatherMarker);
    weatherMarker=window.L.marker([lat,lon]).addTo(jordanMap);
    weatherMarker.bindPopup(`<strong>${escHtml(name)}</strong>`).openPopup();
  }
  if(!opts.noMove){
    if(opts.bounds)jordanMap.flyToBounds(opts.bounds,{maxZoom:14,padding:[60,60],duration:1.2});
    else jordanMap.flyTo([lat,lon],opts.zoom||13,{duration:1.2});
  }
  let weather=null;
  try{weather=await fetchWeather(lat,lon)}
  catch(error){console.error("Weather failed:",error)}
  if(token!==wxToken)return;
  card.innerHTML=weatherCardHtml(name,weather,lat,lon);
  if(status)status.textContent=weather
    ?text("الطقس الحالي من Open-Meteo.","Current weather from Open-Meteo.")
    :text("تعذر جلب الطقس، لكن زر الاتجاهات يعمل.","Weather unavailable, but directions still work.");
}

async function searchMapWeather(){
  const input=$("#mapSearchInput"),status=$("#mapStatus");
  if(!input||!status)return;
  const query=input.value.trim();
  if(!query)return;
  if(!jordanMap){status.textContent=text("الخريطة غير جاهزة بعد.","The map is not ready yet.");return}
  status.textContent=text("جارٍ البحث...","Searching...");
  let place;
  try{place=await geocodePlace(query)}
  catch(error){
    console.error("Map search failed:",error);
    status.textContent=text("تعذر البحث الآن. تحقق من الاتصال بالإنترنت وحاول مرة أخرى.","Search failed. Check your connection and try again.");
    return;
  }
  if(!place){status.textContent=text("لم نجد هذا المكان في الأردن. جرّب اسمًا آخر.","We could not find this place in Jordan. Try another name.");return}
  const lat=parseFloat(place.lat),lon=parseFloat(place.lon);
  const shortName=(place.display_name||query).split(",")[0].trim();
  let bounds=null;
  if(place.boundingbox&&place.boundingbox.length===4){
    const [s,n,w,e]=place.boundingbox.map(Number);
    bounds=[[s,w],[n,e]];
  }
  showPlaceWeather(shortName,lat,lon,{bounds});
}

function locateMe(){
  const status=$("#mapStatus");
  if(!navigator.geolocation){
    if(status)status.textContent=text("متصفحك لا يدعم تحديد الموقع.","Your browser does not support location.");
    return;
  }
  if(status)status.textContent=text("جارٍ تحديد موقعك...","Finding your location...");
  navigator.geolocation.getCurrentPosition(
    pos=>showPlaceWeather(text("موقعي","My location"),pos.coords.latitude,pos.coords.longitude,{zoom:13}),
    ()=>{if(status)status.textContent=text("تعذر تحديد موقعك. اسمح للمتصفح باستخدام الموقع وحاول مرة أخرى.","Could not get your location. Allow location access and try again.")},
    {timeout:10000}
  );
}

function bindMapSearch(){
  const input=$("#mapSearchInput"),btn=$("#mapSearchBtn"),locate=$("#mapLocateBtn");
  if(!input||!btn)return;
  btn.addEventListener("click",searchMapWeather);
  input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchMapWeather()}});
  if(locate)locate.addEventListener("click",locateMe);
}

function renderTripTypeForm(type){
  const container=$("#tripTypeDetails");
  if(!container)return;
  const disclaimer=text(
    "نموذج توضيحي فقط؛ لا توجد خدمة أو مركبة أو مواعيد مؤكدة. لن يُرسل هذا الاستفسار.",
    "Illustrative demo only; no service, vehicle, or schedule is confirmed. This enquiry will not be sent."
  );
  if(type==="vip"){
    container.innerHTML=`
      <div class="note">${disclaimer}</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:10px">
        <label><b>${text("نوع المركبة (مثال)","Vehicle type (example)")}</b></label>
        <select id="carTypeSelect">
          <option value="sedan">${text("سيدان — حتى 3 ركاب","Sedan — up to 3 passengers")}</option>
          <option value="suv">${text("مركبة SUV — حتى 5 ركاب","SUV — up to 5 passengers")}</option>
          <option value="van">${text("مركبة عائلية — حتى 7 ركاب","Family vehicle — up to 7 passengers")}</option>
        </select>
        <label for="passengerCount"><b>${text("عدد الركاب","Passengers")}</b></label>
        <input type="number" min="1" max="7" value="2" id="passengerCount">
      </div>`;
  }else{
    container.innerHTML=`
      <div class="note">${disclaimer}</div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:10px">
        <label><b>${text("موعد توضيحي","Illustrative schedule")}</b></label>
        <select id="groupScheduleSelect">
          <option value="morning">${text("صباحًا — مثال توضيحي","Morning — illustrative example")}</option>
          <option value="noon">${text("وقت الظهيرة — مثال توضيحي","Midday — illustrative example")}</option>
        </select>
        <label for="ticketCount"><b>${text("عدد الأفراد","Number of people")}</b></label>
        <input type="number" min="1" max="15" value="1" id="ticketCount">
      </div>`;
  }
}const Z={
  home:()=>{
    const regularMoods=[...S.moods].filter(mood=>mood!=="Live Jordanian"&&mood!=="Hidden Jordan"&&mood!=="Food");
    const showExplore=S.moods.size===0||regularMoods.length>0;
    const showLocal=S.moods.has("Live Jordanian");
    const showHidden=S.moods.has("Hidden Jordan");
    const showFood=S.moods.has("Food");
    return ["",`
    <div class="hero">
      ${["petra","wadirum","deadsea"].map((key,index)=>`<div class="sc ${index?"":"on"}" style="${visualBg(P[key])}"></div>`).join("")}
      <div class="z">
        <span class="big">دروب</span><span class="en">DUROOB</span>
        <p>${tr("Jordan, your way")}</p>
        <p class="mood-question">${text("شو مزاجك اليوم؟","What are you in the mood for today?")}</p>
        <div class="chips">${["Nature","Water","Adventure","Relaxation","Food","Live Jordanian","Hidden Jordan"].map(mood=>
          `<button class="chip ${S.moods.has(mood)?"on":""}" data-act="mood" data-v="${mood}" aria-pressed="${S.moods.has(mood)}">${tr(mood)}</button>`
        ).join("")}</div>
        <div class="btns">
          <button class="btn plan" data-act="openPlan">${tr("Budget Planner")}</button>
          <button class="btn" data-act="openTripsPage">${tr("Tours & Trips")}</button>
        </div>
      </div>
    </div>
    ${showExplore?`<div id="exploreSection"><h3>${tr("Explore Jordan")}</h3>${grid(getFilteredCities())}</div>`:""}
    ${showFood?`<h3>${text("أماكن الطعام","Food places")}</h3><div class="grid">${foodPlaces.map(foodCard).join("")}</div>`:""}
    ${showLocal?`<h3>${tr("Live Jordanian")}</h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(270px,1fr))">${localExperiences.map(localCard).join("")}</div>`:""}
    ${showHidden?`<h3>${tr("Hidden Jordan")}</h3>"<div class="hid-grid">${leisureSpots.map(leisureCard).join("")}</div>`:""}`,
    ()=>{
      const slides=document.querySelectorAll(".hero .sc");
      let index=0;
      rot=setInterval(()=>{
        if(!slides.length)return;
        slides[index].classList.remove("on");
        index=(index+1)%slides.length;
        slides[index].classList.add("on");
      },5000);
    }];
  },

  planner:()=>[
    tr("Budget Planner"),
    `<div class="note">${text("أدخلي الميزانية لعرض تقسيم توضيحي. المبالغ ليست أسعارًا فعلية.","Enter a budget to see an illustrative split. These are not actual prices.")}</div>
    <div class="btns"><button class="btn plan blk" data-act="openPlan">${tr("Budget Planner")}</button></div>`
  ],

  trips:()=>[
    tr("Tours & Trips"),
    `<div class="note">${text("هذه استفسارات تجريبية تُحفظ على جهازك فقط. لا يوجد حجز أو توفر مؤكد، ولن يُرسل أي طلب.","These are demo enquiries saved on this device only. No booking or availability is confirmed, and nothing will be sent.")}</div>
    <div class="grid">${Object.values(P).map(city=>`
      <div class="local-card">
        ${gallery(city,nm(city))}
        <div><b style="font-size:18px;color:var(--n)">${text("وجهة:","Destination:")} ${nm(city)}</b><p style="font-size:13px;color:#4c6478">${desc(city)}</p></div>
        <div style="margin-top:14px"><button class="btn book" data-act="openTripModal" data-cityid="${city.id}">${text("استفسار تجريبي","Demo enquiry")} · ${nm(city)}</button></div>
      </div>`).join("")}</div>`
  ],

  map:()=>[
    tr("Map"),
    `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0"><input id="mapSearchInput" type="search" autocomplete="off" placeholder="${text("ابحث عن مكان في الأردن... مثل وسط البلد","Search a place in Jordan... e.g. Downtown Amman")}" style="flex:1 1 220px;min-width:0;padding:12px 16px;border:1px solid #e6cfb4;border-radius:14px;font:inherit;font-size:15px"><button type="button" id="mapSearchBtn" class="btn">${text("بحث","Search")}</button><button type="button" id="mapLocateBtn" class="btn" style="background:#fff;color:#c9563a;border:1px solid #c9563a;box-shadow:none">📍 ${text("موقعي","My location")}</button></div>
    <div style="display:flex;flex-wrap:wrap;gap:18px;align-items:stretch;margin:18px 0">
      <div style="flex:2 1 380px;min-width:0"><div id="jordanMap" role="application" aria-label="${text("خريطة وجهات الأردن","Map of Jordan destinations")}" style="margin:0;height:100%;min-height:340px"></div></div>
      <aside id="weatherCard" style="flex:1 1 260px;max-width:380px;background:#fff;border:1px solid #e6cfb4;border-radius:24px;padding:20px;box-shadow:0 10px 25px #10264a12"><div style="font-size:12px;color:#c9563a;font-weight:700">${text("الطقس الآن","Weather now")}</div><div style="font-size:15px;color:#4c6478;margin-top:8px;line-height:1.7">${text("ابحث عن مكان، أو اضغط على علامة مدينة على الخريطة، أو اضغط \"موقعي\" لتظهر هنا حالة الطقس وزر الاتجاهات.","Search a place, tap a city marker, or tap \"My location\" to see the weather and directions here.")}</div></aside>
    </div>
    <div class="note" id="mapStatus" role="status" aria-live="polite">${text("جارٍ تحميل الخريطة...","Loading the map...")}</div>
    <button type="button" id="wxRecBtn" class="btn blk" style="margin-top:6px">☀️ ${text("ماذا أفعل اليوم؟ توصيات حسب الطقس","What should I do today? Weather-based picks")}</button>
    <div id="wxRecOut"></div>`,
    ()=>{initJordanMap();bindMapSearch();bindWxPicks()}
  ],

  saved:()=>{
    const places=[...savedCities].map(id=>P[id]).filter(Boolean);
    const products=[...savedSouq].map(id=>souqItems.find(x=>x.id===id)).filter(Boolean);
    if(!places.length&&!products.length){
      return [tr("Saved"),`<div class="note">${text("لا توجد عناصر محفوظة بعد. اضغط على القلب في بطاقة وجهة أو منتج من السوق لحفظه.","No saved items yet. Tap the heart on a destination or a souq product to save it.")}</div>`];
    }
    return [tr("Saved"),
      (places.length?`<h3 style="margin:6px 0 12px">${text("الوجهات المحفوظة","Saved destinations")}</h3>${grid(places)}`:"")
      +(products.length?`<h3 style="margin:22px 0 12px">${text("منتجات السوق المحفوظة","Saved souq products")}</h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(270px,1fr))">${products.map(souqItemCard).join("")}</div>`:"")];
  },


stories:()=>[
    tr("Stories"),
    `<div class="grid">
      <article class="rel-card">
       <video controls playsinline preload="metadata" style="width:100%;border-radius:16px;background:#000" src="${L==="ar"?"videos/petra-ar.mp4/petra-ar.mp4":"videos/petra-en.mp4/petra-e.mp4"}"></video>
        <div class="sub" style="margin-top:10px">${text("مرشد دروب","Duroob Guide")}</div>
        <h3>${text("البتراء","Petra")}</h3>
       <p style="line-height:1.9">${text("أهلاً بكم في البترا، المدينة الوردية الأسطورية وإحدى عجائب الدنيا السبع الجديدة. تم نحت هذه التحفة التاريخية العريقة مباشرة في منحدرات الصخر الرملي قبل أكثر من ألفي عام على يد الأنباط الأذكياء، لتكون عاصمة مزدهرة ومحطة رئيسية على طرق التجارة العالمية. وفي قلبها، تبرز واجهة الخزنة الشهيرة كأعجوبة معمارية تحيط بها الأسرار والحكايات القديمة. وعلى طول هذه المناظر الصحراوية الخلابة، تقف الجمال كرمز حي للصبر والصلابة التي غذت قوافل التجارة قديماً.","Welcome to Petra, the legendary rose-red city and one of the New Seven Wonders of the World. Carved directly into vibrant sandstone cliffs over two millennia ago by the ingenious Nabataeans, this ancient masterpiece served as a thriving capital and a vital crossroads for global trade. At its heart lies the iconic Treasury, a breathtaking architectural wonder wrapped in mystery and ancient tales. Across these majestic desert landscapes, the enduring camels stand as living symbols of the resilience and spirit that once powered the ancient trade caravans. Welcome to Jordan.")}</p>
      </article>
    </div>`
  ],
  city_page:cityId=>{
    const city=P[cityId]||P.aqaba;
    selectedCityId=city.id;
    const cityName=nm(city);
    return [cityName,`<div class="city-layout">
      <div>
        <div class="hero city-hero" style="height:260px;margin-bottom:20px">${gallery(city,cityName,"city-hero-gallery")}<div class="z"><span class="big" style="font-size:55px">${cityName}</span><p>${desc(city)}</p></div></div>
        <h3>${text("استكشف معالم","Explore places in")} ${cityName}</h3>
        <p class="sub" style="margin-bottom:16px">${text("اختاري تصنيفًا لاستعراض المعلومات المتاحة.","Choose a category to view available information.")}</p>
        <div class="cat-box" data-act="openCategoryView" data-cat="religious"><i>01</i><div><b>${text("سياحة دينية ومزارات","Religious sites")}</b></div></div>
        <div class="cat-box" data-act="openCategoryView" data-cat="heritage"><i>02</i><div><b>${text("آثار وثقافة","Heritage & culture")}</b></div></div>
      </div>
      <div><div style="background:#fff;padding:20px;border-radius:24px;box-shadow:0 10px 30px #10264a15;border:2px solid #ebd3bc;position:sticky;top:90px">
        <h3 style="margin-top:0;font-size:22px">${text("استفسار عن رحلة إلى","Trip enquiry for")} ${cityName}</h3>
        <p style="font-size:13px;color:var(--mu);margin-bottom:16px">${text("استفسار تجريبي فقط؛ لا يوجد حجز أو توفر مؤكد.","Demo enquiry only; no booking or availability is confirmed.")}</p>
        <button class="btn book" style="margin-bottom:10px" data-act="openTripModal" data-cityid="${city.id}" data-triptype="vip">${text("استفسار عن رحلة خاصة","Private trip enquiry")}</button>
        <button class="btn book" style="background:linear-gradient(90deg,#22b573,#0e9f8e)" data-act="openTripModal" data-cityid="${city.id}" data-triptype="group">${text("استفسار عن رحلة جماعية","Group trip enquiry")}</button>
      ${bookBtn(cityName,'style="margin-top:10px"')}
        </div></div>
    </div>`];
  },

  category_view:(categoryId,cityId)=>{
    const city=P[cityId]||P.aqaba;
    const categoryNames={
      religious:text("سياحة دينية ومزارات","Religious sites"),
      heritage:text("آثار وثقافة","Heritage & culture")
    };
    const categoryName=categoryNames[categoryId]||categoryNames.religious;
    const items=categoryId==="heritage"?(heritageData[city.id]||[]):(religiousData[city.id]||[]);
    const list=items.length?`
      ${items.map(item=>`<div class="rel-card">
        ${gallery(item,L==="ar"?item.tA:item.tE)}
        <h3>${L==="ar"?item.tA:item.tE}</h3>
        <p style="white-space:pre-line">${L==="ar"?item.dA:item.dE}</p>
      </div>`).join("")}`:
      `<div class="note">${text(`لا توجد معلومات مضافة حالياً ضمن تصنيف «${categoryName}».`,`There is no information available in “${categoryName}” yet.`)}</div>`;
    return [`${nm(city)} - ${categoryName}`,`<div style="display:flex;flex-direction:column;gap:16px;margin-top:10px">${list}</div>`];
  }
};

function show(name,extraParam1,extraParam2){
  cur=name;
  clearInterval(rot);
  let title,html,afterRender;
  if(name==="city_page"){
    [title,html,afterRender]=Z.city_page(extraParam1||selectedCityId);
  }else if(name==="category_view"){
    [title,html,afterRender]=Z.category_view(extraParam1||currentCategory,extraParam2||selectedCityId);
  }else{
    if(!Z[name])Z[name]=()=>[name,`<div class="note">${text("هذا القسم قيد الإعداد.","This section is being prepared.")}</div>`];
    [title,html,afterRender]=Z[name]();
  }
  $("#view").innerHTML=`<div class="v">${name!=="home"?`<div class="ph"><button class="bk" data-act="back">‹</button><h1>${title}</h1></div>`:""}${html}</div>`;
  scrollTo(0,0);
  if(afterRender)afterRender();
  initGalleries();
  const active=["home","map","planner","trips","stories","saved"].includes(name)?name:S.stack[0];
  document.querySelectorAll("[data-nav]").forEach(button=>button.classList.toggle("on",button.dataset.nav===active&&!button.classList.contains("logo")));
}

function renderCurrentPage(){
  if(cur==="city_page")show("city_page",selectedCityId);
  else if(cur==="category_view")show("category_view",currentCategory,selectedCityId);
  else show(cur);
}

function lang(){
  document.documentElement.lang=L;
  document.documentElement.dir=L==="ar"?"rtl":"ltr";
  document.querySelectorAll(".lk button,.bn button").forEach(button=>{
    const key=button.dataset.nav==="planner"?"Budget Planner":button.dataset.nav==="trips"?"Tours & Trips":button.dataset.nav==="stories"?"Stories":button.dataset.nav.charAt(0).toUpperCase()+button.dataset.nav.slice(1);
    button.textContent=tr(key);
  });
  $(".lang").textContent=L==="ar"?"EN":"العربية";
  if(L==="ar"){
    $("#planModalTitle").textContent="مخطط الميزانية";
    $("#planModalSub").textContent="أدخلي ميزانيتك لرؤية تقسيم توضيحي، وليس أسعارًا فعلية.";
    $("#budgetLabel").textContent="الميزانية بالدينار الأردني:";
    $("#calcPlanBtn").textContent="عرض التقسيم التوضيحي";
    $("#closePlanBtn").textContent="إغلاق";
    $("#tripBookingModal .sp > p").textContent="استفسار تجريبي فقط؛ لن يُرسل ولن يؤكد حجزاً.";
    $("#btnTypeVIP").textContent="رحلة خاصة";
    $("#btnTypeGroup").textContent="رحلة جماعية";
    $("#confirmBookingBtn").textContent="حفظ استفسار تجريبي — لن يُرسل";
    $("#closeTripBtn").textContent="إغلاق";
    $("#ft").textContent="دروب: نموذج تجريبي لاكتشاف الأردن على طريقتك.";
  }else{
    $("#planModalTitle").textContent="Budget planner";
    $("#planModalSub").textContent="Enter a budget to see an illustrative split, not actual prices.";
    $("#budgetLabel").textContent="Budget in Jordanian dinars:";
    $("#calcPlanBtn").textContent="Show illustrative split";
    $("#closePlanBtn").textContent="Close";
    $("#tripBookingModal .sp > p").textContent="Demo enquiry only; it will not be sent or confirm a booking.";
    $("#btnTypeVIP").textContent="Private trip";
    $("#btnTypeGroup").textContent="Group trip";
    $("#confirmBookingBtn").textContent="Save demo enquiry — not sent";
    $("#closeTripBtn").textContent="Close";
    $("#ft").textContent="Duroob: a demo for discovering Jordan your way.";
  }
  $("#sosTitle").textContent=text("أرقام مهمة للزوار","Important visitor contacts");
  $("#sosNotice").textContent=text("اختاري الرقم للاتصال من جهازك. هذا النموذج لا يرسل بلاغًا ولا يطلب المساعدة تلقائيًا.","Choose a number to call from your device. This demo does not send an alert or dispatch assistance automatically.");
  $("#sosPoliceName").textContent=text("شرطة السياحة","Tourist Police");
  $("#sosMinistryName").textContent=text("وزارة السياحة والآثار","Ministry of Tourism and Antiquities");
  $("#sosAmbulanceName").textContent=text("الإسعاف / الدفاع المدني","Ambulance / Civil Defense");
  $("#sosPoliceCall").textContent=text("اتصال","Call");
  $("#sosMinistryCall").textContent=text("اتصال","Call");
  $("#sosAmbulanceCall").textContent=text("اتصال","Call");
  $("#closeSosBtn").textContent=text("إغلاق","Close");
}

const budgetPlans={
 10:[
  {ar:"خيار 1: يوم في السلط",en:"Option 1: A day in As-Salt",items:[
   {ar:"تنقل من عمّان",en:"Transport from Amman",jod:3},
   {ar:"جولة في البلدة القديمة ودرج الحارات",en:"Old town & stairways walk",jod:0},
   {ar:"غداء شعبي (فلافل وحمص)",en:"Local lunch",jod:3},
   {ar:"حلويات السلط وقهوة",en:"Salt sweets & coffee",jod:2},
   {ar:"احتياط",en:"Reserve",jod:2}]},
  {ar:"خيار 2: جبل اللويبدة والرينبو",en:"Option 2: Jabal Al-Weibdeh & Rainbow St",items:[
   {ar:"تنقل",en:"Transport",jod:3},
   {ar:"قهوة ومكتبة وجداريات",en:"Coffee, bookshops & murals",jod:4},
   {ar:"سناك شعبي",en:"Street food",jod:3}]}
 ],
 20:[
  {ar:"خيار 1: يوم في الكرك",en:"Option 1: A day in Karak",items:[
   {ar:"تنقل",en:"Transport",jod:8},
   {ar:"دخول قلعة الكرك",en:"Karak Castle entry",jod:2},
   {ar:"غداء (منسف أو زرب)",en:"Lunch (Mansaf or Zarb)",jod:7},
   {ar:"قهوة وحلويات",en:"Coffee & sweets",jod:3}]},
  {ar:"خيار 2: وادي الموجب",en:"Option 2: Wadi Mujib",items:[
   {ar:"تنقل",en:"Transport",jod:8},
   {ar:"دخول محمية الموجب (مسار مائي)",en:"Mujib reserve water trail",jod:9},
   {ar:"سناك ومياه",en:"Snacks & water",jod:3}]},
  {ar:"خيار 3: يوم في الشوبك",en:"Option 3: A day in Shobak",items:[
   {ar:"تنقل",en:"Transport",jod:9},
   {ar:"دخول قلعة الشوبك",en:"Shobak Castle entry",jod:3},
   {ar:"غداء محلي",en:"Local lunch",jod:6},
   {ar:"احتياط",en:"Reserve",jod:2}]}
 ],
 50:[
  {ar:"خيار 1: أم قيس والشمال",en:"Option 1: Umm Qais & the North",items:[
   {ar:"تنقل",en:"Transport",jod:20},
   {ar:"دخول أم قيس (إطلالة الجولان وطبريا)",en:"Umm Qais site entry",jod:3},
   {ar:"غداء على إطلالة بحيرة طبريا",en:"Lunch with a lake view",jod:12},
   {ar:"جولة في وادي الريان أو سد الوحدة",en:"Ryan Valley / Wehda Dam visit",jod:10},
   {ar:"احتياط",en:"Reserve",jod:5}]},
  {ar:"خيار 2: وادي الحسا والطفيلة",en:"Option 2: Wadi Hasa & Tafileh",items:[
   {ar:"تنقل",en:"Transport",jod:20},
   {ar:"محمية ضانا (مسار وإطلالة)",en:"Dana Reserve trail",jod:12},
   {ar:"غداء ريفي",en:"Village lunch",jod:10},
   {ar:"منتجات محلية وهدايا",en:"Local products & souvenirs",jod:8}]}
 ],
 100:[
  {ar:"خيار 1: العقبة والغوص",en:"Option 1: Aqaba & Diving",items:[
   {ar:"تنقل",en:"Transport",jod:30},
   {ar:"تجربة غوص أو سنوركلنغ مع مدرب",en:"Guided dive or snorkeling",jod:40},
   {ar:"غداء سمك",en:"Seafood lunch",jod:15},
   {ar:"قارب زجاجي أو جولة بحرية",en:"Glass-bottom boat",jod:10},
   {ar:"احتياط",en:"Reserve",jod:5}]},
  {ar:"خيار 2: ضانا ووادي فينان (تخييم)",en:"Option 2: Dana & Feynan (Eco-camping)",items:[
   {ar:"تنقل",en:"Transport",jod:30},
   {ar:"إقامة وعشاء في مخيم بيئي",en:"Eco-lodge stay & dinner",jod:50},
   {ar:"مسار مع مرشد محلي",en:"Guided trail",jod:15},
   {ar:"احتياط",en:"Reserve",jod:5}]}
 ]
};

function renderPlan(rawBudget){
  const budget=Number(rawBudget);
  const result=$("#planResult");
  if(!Number.isFinite(budget)||budget<10){
    result.innerHTML=`<div class="note">${text("أدخلي ميزانية 10 دنانير أو أكثر.","Enter a budget of 10 JOD or more.")}</div>`;
    return;
  }
  const tier=budget>=100?100:budget>=50?50:budget>=20?20:10;
  result.innerHTML=`<p class="sub" style="margin-bottom:10px">${text(`خطط مقترحة الأقرب لميزانيتك (${tier} دينار)`,`Suggested plans closest to your budget (${tier} JOD)`)}</p>`
  +budgetPlans[tier].map(p=>`<div style="background:#fff;border-radius:18px;padding:16px;margin-bottom:12px;box-shadow:0 4px 14px #10264a10">
    <h3 style="margin:0 0 10px;color:var(--c);font-size:18px">${L==="ar"?p.ar:p.en}</h3>
    ${p.items.map(i=>`<div class="note" style="display:flex;justify-content:space-between;gap:12px"><span>${L==="ar"?i.ar:i.en}</span><b>${i.jod} JOD</b></div>`).join("")}
    <div style="margin-top:8px;font-weight:800;color:var(--t)">${text("المجموع:","Total:")} ${p.items.reduce((s,i)=>s+i.jod,0)} JOD</div>
  </div>`).join("")
  +`<p class="sub">${text("الأسعار تقريبية وقابلة للتغيير.","Prices are approximate and may change.")}</p>`;
}

document.addEventListener("click",event=>{
  if(!(event.target instanceof Element))return;
  const action=event.target.closest("[data-act]");
  const nav=event.target.closest("[data-nav]");
  const data=action?.dataset||{};

  if(event.target.classList.contains("sh")){event.target.classList.remove("on");return}
  if(nav){
    const target=nav.dataset.nav;
    if((target==="souq"||target==="stories")&&(cur==="city_page"||cur==="category_view"))S.stack.push(target);
    else S.stack=[target];
    show(target);
    return;
  }
  if(!action)return;

  if(data.act==="back"){
    if(S.stack.length>1)S.stack.pop();else S.stack=["home"];
    const previous=S.stack[S.stack.length-1]||"home";
    if(previous==="city_page")show("city_page",selectedCityId);
    else if(previous==="category_view")show("category_view",currentCategory,selectedCityId);
    else show(previous);
    return;
  }
  if(data.act==="lang"){
    L=L==="en"?"ar":"en";
    lang();
    renderCurrentPage();
    return;
  }
  if(data.act==="mood"){
    S.moods.has(data.v)?S.moods.delete(data.v):S.moods.add(data.v);
    show("home");
    return;
  }
  if(data.act==="openTripsPage"){S.stack.push("trips");show("trips");return}
  if(data.act==="openPlan"){$("#planModal").classList.add("on");renderPlan($("#budgetInput").value);return}
  if(data.act==="toggleSaved"){
    if(!auth.currentUser){
  authModal.classList.add("on");
  return;
}
    if(savedCities.has(data.id))savedCities.delete(data.id);
    else savedCities.add(data.id);
    const persisted=persistSavedCities();
    if(!persisted)toast(text("تعذر حفظ التغيير على هذا الجهاز.","Could not save this change on this device."));
    renderCurrentPage();
    return;
  }
  if(data.act==="bookExp"){
    const saved=saveDemoRequest({type:"experience-enquiry",title:data.title||""});
    toast(saved?text("تم حفظ الاستفسار في Firebase.","Enquiry saved to Firebase."):text("تعذر حفظ الاستفسار على هذا الجهاز.","Could not save the enquiry on this device."));
    return;
  }
  if(data.act==="fakeBook"){toast(text("هذا نموذج تجريبي؛ لا يتم حجز فعلي.","Demo only; no real booking is made."));return}
  if(data.act==="openCityPage"){
    selectedCityId=data.id;
    S.stack.push("city_page");
    show("city_page",selectedCityId);
    return;
  }
  if(data.act==="openTripModal"){
    selectedCityId=data.cityid||selectedCityId||"aqaba";
    selectedTripType=data.triptype||"vip";
    const city=P[selectedCityId]||P.aqaba;
    $("#tripModalTitle").textContent=text(`استفسار تجريبي عن رحلة إلى ${nm(city)}`,`Demo trip enquiry for ${nm(city)}`);
    $("#btnTypeVIP").className=selectedTripType==="vip"?"btn blk":"btn o blk";
    $("#btnTypeGroup").className=selectedTripType==="group"?"btn blk":"btn o blk";
    renderTripTypeForm(selectedTripType);
    $("#tripBookingModal").classList.add("on");
    return;
  }
  if(data.act==="selectTripType"){
    selectedTripType=data.type;
    $("#btnTypeVIP").className=selectedTripType==="vip"?"btn blk":"btn o blk";
    $("#btnTypeGroup").className=selectedTripType==="group"?"btn blk":"btn o blk";
    renderTripTypeForm(selectedTripType);
    return;
  }
  if(data.act==="submitBooking"){
    const city=P[selectedCityId]||P.aqaba;
    let details;
    if(selectedTripType==="vip"){
      const vehicle=$("#carTypeSelect")?.value;
      const passengers=Number($("#passengerCount")?.value);
      const capacities={sedan:3,suv:5,van:7};
      const capacity=capacities[vehicle]||0;
      if(!Number.isInteger(passengers)||passengers<1||passengers>capacity){
        toast(text(`أدخلي عدد ركاب من 1 إلى ${capacity}.`,`Enter between 1 and ${capacity} passengers.`));
        return;
      }
      details={vehicle,passengers};
    }else{
      const people=Number($("#ticketCount")?.value);
      if(!Number.isInteger(people)||people<1||people>15){
        toast(text("أدخلي عدد أفراد من 1 إلى 15.","Enter between 1 and 15 people."));
        return;
      }
      details={schedule:$("#groupScheduleSelect")?.value||"",people};
    }
    const saved=saveDemoRequest({type:"trip-enquiry",cityId:city.id,cityName:nm(city),tripType:selectedTripType,details});
    if(!saved){
      toast(text("تعذر حفظ الاستفسار على هذا الجهاز.","Could not save the enquiry on this device."));
      return;
    }
    $("#tripBookingModal").classList.remove("on");
    toast(text("تم حفظ الاستفسار في Firebase. هذا نموذج تجريبي ولا يوجد حجز فعلي.","Enquiry saved to Firebase. Demo only; no real booking was made."));
    return;
  }
  if(data.act==="openCategoryView"){
    currentCategory=data.cat||"religious";
    S.stack.push("category_view");
    show("category_view",currentCategory,selectedCityId);
    return;
  }
  if(data.act==="sheet")$("#sosModal").classList.add("on");
});

$("#closePlanBtn")?.addEventListener("click",()=>$("#planModal").classList.remove("on"));
$("#closeTripBtn")?.addEventListener("click",()=>$("#tripBookingModal").classList.remove("on"));
$("#closeSosBtn")?.addEventListener("click",()=>$("#sosModal").classList.remove("on"));
$("#calcPlanBtn")?.addEventListener("click",()=>renderPlan($("#budgetInput").value));
// ===== Duroob Souq =====
AR["Souq"]="سوق دروب";
const souqProducts=[
 {id:"p1",images:["images/souq/p1.jpeg"],tA:"تطريز يدوي",tE:"Hand embroidery",makerA:"من إنتاج جمعية نسائية — اسم الجمعية، المدينة",makerE:"Made by a women's association — name, city",price:"00 JOD"},
 {id:"p2",images:["images/souq/p2.jpeg"],tA:"فسيفساء يدوية",tE:"Handmade mosaic",makerA:"من إنتاج حرفيين — اسم الحرفي، مأدبا",makerE:"Made by local artisans — name, Madaba",price:"00 JOD"},
 {id:"p3",images:["images/souq/p3.jpeg"],tA:"منتج تراثي",tE:"Heritage product",makerA:"اسم الحرفية أو الجمعية، المدينة",makerE:"Artisan or association name, city",price:"00 JOD"}
];

  // ===== Souq v2 =====
const souqItems=[
 {id:"s1",
  dA:"شجرة جميلة من النحاس مصنوعة يدوياً ومزينة بالخرز، لون ذهبي، تعليقة حائط بتصميم عصري.",
  dE:"A beautiful hand-made copper tree decorated with beads, in gold colour, a wall hanging with a modern design.",
  specsA:[["اللون","ذهبي، بني ونحاسي"],["المادة","شجر الياسمين الطبيعي، خرز ونحاس"],["الطول","29 سم"],["الوزن","330 غم"]],
  specsE:[["Colour","Gold, brown and copper"],["Material","Natural jasmine wood, beads and copper"],["Length","29 cm"],["Weight","330 g"]],
  price:"40 JOD"}
];
const souqItemCard=p=>`
  <div class="local-card souq-card" style="position:relative">
    <button class="card-save" type="button" data-act="toggleSouqSaved" data-id="${p.id}" aria-label="${savedSouq.has(p.id)?text("إزالة من المحفوظات","Remove from saved"):text("حفظ المنتج","Save product")}">${savedSouq.has(p.id)?"♥️":"♡"}</button>
    ${p.images&&p.images.length?gallery(p,L==="ar"?p.dA:p.dE):""}
    <p style="font-size:13px;color:#4c6478;white-space:pre-line">${L==="ar"?p.dA:p.dE}</p>
    <span class="souq-price">${p.price}</span>
    <div class="souq-btns">
      <button class="btn book" data-act="souqBuy" data-id="${p.id}">${text("شراء","Buy")}</button>
      <details class="souq-details">
        <summary class="btn o book">${text("التفاصيل","Details")}</summary>
        <ul>${(L==="ar"?p.specsA:p.specsE).map(([k,v])=>`<li><b>${k}:</b> ${v}</li>`).join("")}</ul>
      </details>
    </div>
  </div>`;
Z.souq=()=>[
  text("سوق دروب","Duroob Souq"),
  `<div class="souq-slogan">${text("تسوق وادعم الحرفيين المستقلين","Shop & support independent artisans")}</div>
   <div class="note">${text("الأسعار توضيحية والشراء تجريبي، لا يتم خصم أي مبلغ.","Prices are illustrative and checkout is a demo; nothing is charged.")}</div>
   <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(270px,1fr))">${souqItems.map(souqItemCard).join("")}</div>`
];

const payModal=document.createElement("div");
payModal.className="sh";
payModal.innerHTML='<div class="sp" id="payBox"></div>';
document.body.appendChild(payModal);
payModal.addEventListener("click",e=>{if(e.target===payModal)payModal.classList.remove("on")});
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");
  if(!b)return;
  const act=b.dataset.act;
  if(act==="toggleSouqSaved"){
    if(!auth.currentUser){authModal.classList.add("on");return}
    const id=b.dataset.id;
    if(savedSouq.has(id))savedSouq.delete(id);
    else savedSouq.add(id);
    persistSavedCities();
    renderCurrentPage();
    return;
  }
  if(act==="souqBuy"){
    const p=souqItems.find(x=>x.id===b.dataset.id);
    if(!p)return;
    $("#payBox").innerHTML=`
      <h2>${text("إتمام الشراء","Checkout")}</h2>
      <p class="sub" style="margin:6px 0 14px">${text("المبلغ:","Total:")} <b style="color:var(--c)">${p.price}</b></p>
      <p style="font-weight:700;margin-bottom:10px">${text("اختاري طريقة الدفع","Choose a payment method")}</p>
      <div style="display:grid;gap:10px">
        <button class="btn blk" data-act="souqPay" data-id="${p.id}" data-method="card">💳 ${text("بطاقة بنكية (Visa / Mastercard)","Bank card (Visa / Mastercard)")}</button>
        <button class="btn blk" data-act="souqPay" data-id="${p.id}" data-method="cliq">📱 ${text("كليك (CliQ)","CliQ instant payment")}</button>
        <button class="btn blk" data-act="souqPay" data-id="${p.id}" data-method="cod">💵 ${text("الدفع عند الاستلام","Cash on delivery")}</button>
      </div>
      <div class="note">${text("نموذج تجريبي: لا يتم خصم أي مبلغ ولا تُدخل بيانات بطاقة.","Demo only: nothing is charged and no card details are entered.")}</div>
      <button class="btn o blk" data-act="souqClose">${text("إغلاق","Close")}</button>`;
    payModal.classList.add("on");
    return;
  }
  if(act==="souqPay"){
    const p=souqItems.find(x=>x.id===b.dataset.id);
    saveDemoRequest({type:"souq-order",title:p?p.dA:"",method:b.dataset.method,price:p?p.price:""});
    payModal.classList.remove("on");
    toast(text("تم تسجيل طلبك التجريبي. شكراً لدعمك الحرفيين!","Your demo order is recorded. Thank you for supporting artisans!"));
    return;
  }
  if(act==="souqClose"){payModal.classList.remove("on");return}
});
// ===== Restaurant table reservation (demo request saved to Firebase) =====
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");
  if(!b)return;
  const act=b.dataset.act;
  if(act==="foodReserve"){
    const r=foodPlaces.find(x=>x.id===b.dataset.id);
    if(!r)return;
    const today=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
    $("#payBox").innerHTML=`
      <h2>${text("حجز طاولة","Reserve a table")}</h2>
      <p class="sub" style="margin:6px 0 14px">${L==="ar"?r.tA:r.tE} · ${L==="ar"?r.locationA:r.locationE}</p>
      <label for="resDate">${text("التاريخ","Date")}</label>
      <input type="date" id="resDate" min="${today}" style="margin-bottom:10px">
      <label for="resTime">${text("الوقت","Time")}</label>
      <input type="time" id="resTime" style="margin-bottom:10px">
      <label for="resPeople">${text("عدد الأشخاص","Number of people")}</label>
      <input type="number" id="resPeople" min="1" max="20" value="2" style="margin-bottom:6px">
      <div class="note">${text("نموذج تجريبي: يتم تسجيل الطلب فقط ولا يتم تأكيد حجز فعلي مع المطعم.","Demo only: the request is recorded, but no real booking is made with the restaurant.")}</div>
      <button class="btn blk" data-act="foodReserveSend" data-id="${r.id}">${text("تأكيد طلب الحجز","Confirm reservation request")}</button>
      <button class="btn o blk" data-act="souqClose" style="margin-top:10px">${text("إغلاق","Close")}</button>`;
    payModal.classList.add("on");
    return;
  }
  if(act==="foodReserveSend"){
    const r=foodPlaces.find(x=>x.id===b.dataset.id);
    if(!r)return;
    const date=$("#resDate").value,time=$("#resTime").value,people=parseInt($("#resPeople").value,10);
    if(!date||!time||!(people>=1)){
      toast(text("أكمل التاريخ والوقت وعدد الأشخاص.","Please fill in the date, time and number of people."));
      return;
    }
    saveDemoRequest({type:"table-reservation",restaurantId:r.id,restaurantName:r.tA,city:r.locationA,date,time,people});
    payModal.classList.remove("on");
    toast(text("تم تسجيل طلب الحجز (تجريبي).","Reservation request recorded (demo)."));
  }
});
// ===== Souq products =====
souqItems[0].images=["images/souq/s1.jpeg"];
souqItems.push(
 {id:"s2",images:["images/souq/s2.jpeg"],
  dA:"جاكيت أطفال مصنوع يدوياً مع كلاكيل، امنحي طفلك أناقة ودفئًا مع جاكيت أطفال يُحاك بطريقة جميلة ومتقنة.",
  dE:"A handmade baby jacket set. Give your child elegance and warmth with a jacket knitted beautifully and with great care.",
  specsA:[["اللون","زهري"],["المادة","صوف"],["الأبعاد","35 × 33 × 1 سم"],["الوزن","230 غم"]],
  specsE:[["Colour","Pink"],["Material","Wool"],["Dimensions","35 × 33 × 1 cm"],["Weight","230 g"]],
  price:"18 JOD"},
 {id:"s3",images:["images/souq/s3.jpeg","images/souq/s3."],
  dA:"وشاح مذهل من القطن، لون أحمر وأبيض، مصنوع يدوياً بتصميم شماغ، لكلا الجنسين.",
  dE:"A stunning handmade cotton scarf in red and white with a shemagh design, for all genders.",
  specsA:[["اللون","أحمر وأبيض"],["المادة","قماش وقطن"],["الأبعاد","125 × 125 سم"],["الوزن","375 غم"]],
  specsE:[["Colour","Red and white"],["Material","Fabric and cotton"],["Dimensions","125 × 125 cm"],["Weight","375 g"]],
  price:"25 JOD"},
 {id:"s4",images:["images/souq/s4.jpeg"],
  dA:"منظم مكتب خشبي مصنوع يدوياً باللون البني، بتصميم أنيق.",
  dE:"A handmade wooden desk organiser in brown, with an elegant design.",
  specsA:[["الخامة","خشب MDF"],["اللون","بني"],["الأبعاد","40 × 20 × 20 سم"],["الوزن","1195 غرام"]],
  specsE:[["Material","MDF wood"],["Colour","Brown"],["Dimensions","40 × 20 × 20 cm"],["Weight","1195 g"]],
  price:"30 JOD"}
);
// photos live in images/souq/s1/ (s1-1..3) and images/souq/s1/s2|s3|s4/ (sX-1..3)
souqItems.forEach(p=>{const base=p.id==="s1"?"images/souq/s1/":`images/souq/s1/${p.id}/`;p.images=[1,2,3].map(n=>`${base}${p.id}-${n}.jpeg`)});
// ===== Login =====
const authModal=$("#authModal"),authMsg=$("#authMsg"),loginBtn=$("#loginBtn"),profileModal=$("#profileModal");
const closeAuth=()=>authModal.classList.remove("on");

function authLang(){
  const set=(s,ar,en)=>{const e=$(s);if(e)e.textContent=text(ar,en)};
  set("#authModal h2","تسجيل الدخول","Sign in");
  set("#googleBtn","المتابعة عبر Google","Continue with Google");
  set("#emailLoginBtn","دخول","Log in");
  set("#emailSignupBtn","إنشاء حساب","Create account");
  set("#closeAuthBtn","إغلاق","Close");
  $("#emailInput").placeholder=text("البريد الإلكتروني","Email");
  $("#passInput").placeholder=text("كلمة المرور","Password");
  set("#profileModal h2","حسابي","My account");
  set("#resetPassBtn","تغيير كلمة المرور","Change password");
  set("#logoutBtn","تسجيل الخروج","Sign out");
  set("#closeProfBtn","إغلاق","Close");
  if(!auth.currentUser)loginBtn.textContent=text("تسجيل الدخول","Sign in");
}
document.addEventListener("click",e=>{if(e.target.closest('[data-act="lang"]'))setTimeout(authLang,0)});

loginBtn.addEventListener("click",()=>{
  if(auth.currentUser){$("#profMsg").textContent="";profileModal.classList.add("on")}
  else{authMsg.textContent="";authModal.classList.add("on")}
});
$("#closeAuthBtn").addEventListener("click",closeAuth);
$("#closeProfBtn").addEventListener("click",()=>profileModal.classList.remove("on"));
$("#logoutBtn").addEventListener("click",async()=>{await signOut(auth);profileModal.classList.remove("on")});
$("#resetPassBtn").addEventListener("click",async()=>{
  try{
    const m=await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js");
    await m.sendPasswordResetEmail(auth,auth.currentUser.email);
    $("#profMsg").textContent=text("أرسلنا رابط تغيير كلمة المرور إلى بريدك","We sent a password reset link to your email");
  }catch{$("#profMsg").textContent=text("تعذّر الإرسال، حاول لاحقاً","Could not send, try again later")}
});

$("#googleBtn").addEventListener("click",async()=>{
  try{await signInWithPopup(auth,new GoogleAuthProvider());closeAuth()}
  catch{authMsg.textContent=text("تعذّر تسجيل الدخول","Sign-in failed")}
});
$("#emailLoginBtn").addEventListener("click",async()=>{
  try{await signInWithEmailAndPassword(auth,$("#emailInput").value,$("#passInput").value);closeAuth()}
  catch{authMsg.textContent=text("البريد أو كلمة المرور غير صحيحة","Wrong email or password")}
});
$("#emailSignupBtn").addEventListener("click",async()=>{
  try{await createUserWithEmailAndPassword(auth,$("#emailInput").value,$("#passInput").value);closeAuth()}
  catch{authMsg.textContent=text("تعذّر إنشاء الحساب (كلمة المرور 6 أحرف على الأقل)","Could not sign up (password: 6+ characters)")}
});

onAuthStateChanged(auth,user=>{
  if(user){
    const name=user.displayName||user.email.split("@")[0];
    loginBtn.textContent=name.charAt(0).toUpperCase();
    loginBtn.classList.add("avatar");
    $("#profName").textContent=name;
    $("#profEmail").textContent=user.email;
    $("#resetPassBtn").style.display=user.providerData.some(p=>p.providerId==="password")?"":"none";
    loadSavedCitiesFromFirebase();
  }else{
    loginBtn.classList.remove("avatar");
    loginBtn.textContent=text("تسجيل الدخول","Sign in");
    // signed out: do not keep the previous user's saved items on this device
    savedCities.clear();
    savedSouq.clear();
    try{localStorage.removeItem("duroob-saved-cities");localStorage.removeItem("duroob-saved-souq")}catch{}
    renderCurrentPage();
  }
});
authLang();

lang();
show("home");
