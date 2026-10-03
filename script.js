import{initializeApp}from"https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import{getFirestore,doc,setDoc,getDoc,addDoc,collection,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

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

// anonymous per-device id, so each visitor's saved cities are stored under their own document
function getDeviceId(){
  try{
    let id=localStorage.getItem("duroob-device-id");
    if(!id){
      id=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2);
      localStorage.setItem("duroob-device-id",id);
    }
    return id;
  }catch{return "anonymous"}
}
const deviceId=getDeviceId();
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
 {id:"mosaic_craft",images:["images/mc/mc-1.jpeg","images/mc/mc-2.jpeg","images/mc/mc-3.jpeg"],tA:"ورشة صناعة الفسيفساء وتعبئة الرمل",tE:"Mosaic Crafting & Sand Bottle Art",dA:"تعلم تشكيل لوحتك الفسيفسائية الخاصة في مأدبا أو الرسم بالرمل الملون داخل الزجاج بالبتراء.",dE:"Craft your own mosaic piece in Madaba or master colored sand art in Petra.",price:"10 JOD"}
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
 {id:"akla-w-fatla",tA:"مطعم أكلة وفتلة",tE:"Akla w Fatla Restaurant",locationA:"عرجان، عجلون",locationE:"Arjan, Ajloun"}
];

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
 "Discover":"اكتشف","Map":"الخريطة","Budget Planner":"مخطط الميزانية",
 "Tours & Trips":"الرحلات","Planner":"المخطط","Trips":"الرحلات",
 "Stories":"مرشد دروب","Saved":"المحفوظات","Jordan, your way":"الأردن على طريقتك",
 "Explore Jordan":"استكشف الأردن","Live Jordanian":"عِش أردنيًا","Hidden Jordan":"خفايا الأردن",
 "Nature":"طبيعة","Water":"ماء","Adventure":"مغامرة",
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

function persistSavedCities(){
  try{localStorage.setItem("duroob-saved-cities",JSON.stringify([...savedCities]))}catch{}
  setDoc(doc(db,"savedCities",deviceId),{cities:[...savedCities],updatedAt:serverTimestamp()})
    .catch(err=>console.error("Firestore: saving cities failed",err));
  return true;
}

async function loadSavedCitiesFromFirebase(){
  try{
    const snap=await getDoc(doc(db,"savedCities",deviceId));
    if(snap.exists()&&Array.isArray(snap.data().cities)){
      savedCities.clear();
      snap.data().cities.filter(id=>P[id]).forEach(id=>savedCities.add(id));
      try{localStorage.setItem("duroob-saved-cities",JSON.stringify([...savedCities]))}catch{}
      renderCurrentPage();
    }
  }catch(err){console.error("Firestore: loading cities failed",err)}
}

function saveDemoRequest(request){
  try{
    const requests=JSON.parse(localStorage.getItem("duroob-demo-requests")||"[]");
    if(Array.isArray(requests)){
      requests.push({...request,savedAt:new Date().toISOString(),sent:false});
      localStorage.setItem("duroob-demo-requests",JSON.stringify(requests));
    }
  }catch{}
  addDoc(collection(db,"requests"),{...request,deviceId,createdAt:serverTimestamp()})
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
  ${gallery(item,text("صورة المطعم","Restaurant photo"))}
  <h3>${L==="ar"?item.tA:item.tE}</h3>
  <div class="sub">${text("الموقع:","Location:")} ${L==="ar"?item.locationA:item.locationE}</div>
</article>`;

function getFilteredCities(){
  const keys=["amman","aqaba","petra","deadsea","wadirum","madaba","ajloun","jerash"];
  const cities=keys.map(key=>P[key]);
  const moods=[...S.moods].filter(mood=>mood!=="Live Jordanian"&&mood!=="Hidden Jordan");
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
    });
    if(status)status.textContent=text("العلامات تقريبية وتمثل مناطق المدن والوجهات.","Markers are approximate and represent city and destination areas.");
    setTimeout(()=>jordanMap?.invalidateSize(),0);
  }catch(error){
    if(status)status.textContent=text("تعذر عرض الخريطة. يمكنك استخدام قائمة الوجهات أدناه.","The map could not be displayed. You can use the destination list below.");
    console.error("Could not initialize the Jordan map:",error);
  }
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
    const regularMoods=[...S.moods].filter(mood=>mood!=="Live Jordanian"&&mood!=="Hidden Jordan");
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
    `<div class="note">${text("خريطة الأردن الفعلية. العلامات تقريبية لمناطق المدن والوجهات وليست مواقع دقيقة لكل معلم. تتطلب الخريطة اتصالًا بالإنترنت.","Map of Jordan. Markers are approximate city and destination areas, not exact pins for every attraction. An internet connection is required.")}</div>
    <div id="jordanMap" role="application" aria-label="${text("خريطة وجهات الأردن","Map of Jordan destinations")}"></div>
    <div class="note" id="mapStatus" role="status" aria-live="polite">${text("جارٍ تحميل الخريطة...","Loading the map...")}</div>
    <h3>${text("استكشف الوجهات","Explore destinations")}</h3>${grid([P.amman,P.aqaba,P.petra,P.deadsea,P.wadirum,P.madaba,P.ajloun,P.jerash])}`,
    ()=>initJordanMap()
  ],

  saved:()=>{
    const places=[...savedCities].map(id=>P[id]).filter(Boolean);
    return [tr("Saved"),places.length?grid(places):`<div class="note">${text("ما حفظتي أماكن بعد. استخدمي رمز القلب على بطاقة الوجهة لحفظها.","No saved places yet. Use the heart on a destination card to save it.")}</div>`];
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
        <div class="cat-box" data-act="openCategoryView" data-cat="heritage"><i>02</i><div><b>${text("آثار وثقافة","Heritage & culture")}</b><p style="font-size:12px;color:var(--mu)">${text("محتوى هذا التصنيف قيد الإعداد.","This category is being prepared.")}</p></div></div>
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
  if(nav){S.stack=[nav.dataset.nav];show(nav.dataset.nav);return}
  if(!action)return;

  if(data.act==="back"){
    if(S.stack.length>1)S.stack.pop();
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

lang();
show("home");
loadSavedCitiesFromFirebase();
