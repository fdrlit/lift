'use strict';
/* Lift — дневник тренировок. Данные: localStorage, всё офлайн. */

// ---------- каталог упражнений: [id фото, название, группа, тип (w вес / bw свой вес / t время), подсказка]
// [id, название, группа, тип (w вес / bw свой вес / t время), подсказка, медиа {p: фото, v: видео}]
// фото по умолчанию — img/<id>_0/1.jpg (free-exercise-db), видео — vid/<v>.mp4 (Pexels / Mixkit, свободная лицензия)
const MY_LEGS = [
 ['Barbell_Hip_Thrust','Ягодичный мостик со штангой','glutes','w','Лопатки на скамье, подбородок к груди, голени вертикально вверху. Сожми ягодицы в верхней точке на секунду.'],
 ['step_down','Сшагивания','glutes','w','Шаг назад с платформы, корпус чуть наклонён вперёд. Вес на пятке передней ноги, поднимайся толчком через неё.',{p:null,v:'step_down'}],
 ['Romanian_Deadlift','Румынская тяга со штангой','glutes','w','Колени чуть согнуты и неподвижны, таз уходит назад, гриф скользит по бёдрам. Спина ровная, опускай до растяжения задней поверхности.',{v:'Romanian_Deadlift'}],
 ['Split_Squat_with_Dumbbells','Болгарские выпады','glutes','w','Задняя нога на скамье, передняя достаточно далеко. Корпус с наклоном вперёд — больше нагрузки на ягодицу.',{v:'Split_Squat_with_Dumbbells'}],
 ['Lying_Leg_Curls','Сгибание бедра лёжа','legs','w','Таз прижат к скамье, без рывков. Медленно опускай 2–3 секунды.'],
 ['Seated_Leg_Curl','Сгибание бедра сидя','legs','w','Колено на оси тренажёра, бёдра зафиксированы. Полная амплитуда, пауза внизу.'],
 ['glute_hyper','Гиперэкстензия на ягодицы','glutes','w','Валик ниже тазовых косточек, спина слегка округлена, носки врозь. Поднимайся за счёт ягодиц, без переразгибания в пояснице.',{p:'Hyperextensions_Back_Extensions'}],
 ['cable_kickback','Кикбэки в кроссовере','glutes','w','Манжета на щиколотке, корпус наклонён, опора на тренажёр. Отводи ногу назад-вверх ягодицей, поясница не прогибается.',{p:'One-Legged_Cable_Kickback'}],
 ['Thigh_Abductor','Разведение ягодиц в тренажёре','glutes','w','Наклонись корпусом вперёд — больше работает ягодица. Разводи с паузой, сводить медленно.'],
 ['single_leg_rdl','Журавлик','glutes','w','Опорное колено чуть согнуто, таз смотрит в пол — не раскрывай его. Наклон вперёд, свободная нога уходит назад одной линией с корпусом.',{p:'Kettlebell_One-Legged_Deadlift'}],
 ['Leg_Press','Жим ногами лёжа в тренажёре','legs','w','Поясница прижата, колени по линии носков. Стопы выше на платформе — больше работают ягодицы.',{v:'Leg_Press'}],
 ['Barbell_Squat','Приседания со штангой','legs','w','Гриф на трапеции, колени по линии носков, таз назад. Глубина — до параллели и ниже, если позволяет мобильность.',{v:'Barbell_Squat'}],
];
const MY_UPPER = [
 ['cable_oh_triceps','Трицепс с косичкой французский в кроссовере','arms','w','Спиной к блоку, локти у головы и смотрят вперёд. Разгибай руки полностью, локти не разводи.',{p:'Cable_Rope_Overhead_Triceps_Extension'}],
 ['machine_curl','Бицепс в тренажёре','arms','w','Подмышки плотно на подушке, без рывков. Не разгибай руки до конца внизу.',{p:'Machine_Bicep_Curl'}],
 ['straight_arm_pulldown','Пулловер в кроссовере с прямой рукоятью','back','w','Руки почти прямые, лёгкий наклон вперёд. Тяни рукоять дугой к бёдрам за счёт широчайших.',{p:'Straight-Arm_Pulldown'}],
 ['Wide-Grip_Lat_Pulldown','Вертикальная тяга широким хватом','back','w','Гриф к верху груди, лопатки вниз и назад. Не отклоняйся сильно, локти тянутся к рёбрам.',{v:'Wide-Grip_Lat_Pulldown'}],
 ['close_pulldown','Вертикальная тяга узким хватом с W-ручкой','back','w','Грудь вперёд, тяни рукоять к солнечному сплетению. Локти идут вниз вдоль корпуса.',{p:'Wide-Grip_Lat_Pulldown',v:'close_pulldown'}],
 ['band_pullup','Подтягивания с резинкой','back','bw','Резинка под колено или стопу. Тяни грудь к перекладине, опускайся медленно до полного выпрямления рук.',{p:'Band_Assisted_Pull-Up'}],
 ['machine_shoulder_press','Жим плечами в тренажёре','shoulders','w','Спина прижата, рукояти на уровне ушей внизу. Выжимай вверх без запрокидывания головы.',{p:'Machine_Shoulder_Military_Press',v:'machine_shoulder_press'}],
 ['knee_pushup','Отжимания с колен','chest','bw','От колен до головы — прямая линия, ладони чуть шире плеч. Опускайся грудью к полу, локти под 45°.',{p:'Pushups',v:'knee_pushup'}],
 ['Pushups','Отжимания','chest','bw','Тело — прямая линия, пресс и ягодицы напряжены. Грудь почти касается пола.',{v:'Pushups'}],
 ['machine_chest_press','Жим грудью в тренажёре','chest','w','Лопатки сведены и прижаты к спинке, рукояти на уровне середины груди. Не разгибай локти до щелчка.',{p:'Machine_Bench_Press',v:'machine_chest_press'}],
];
const MINE = [...MY_LEGS, ...MY_UPPER].map(r => r[0]);
const EX_RAW = [...MY_LEGS, ...MY_UPPER,
 ['Barbell_Bench_Press_-_Medium_Grip','Жим штанги лёжа','chest','w','Лопатки сведены, гриф опускай к низу груди, стопы плотно в пол.'],
 ['Barbell_Incline_Bench_Press_-_Medium_Grip','Жим штанги на наклонной','chest','w','Скамья 30°, гриф к верху груди, локти под 45° к корпусу.'],
 ['Dumbbell_Bench_Press','Жим гантелей лёжа','chest','w','Опускай гантели до уровня груди, вверху своди без удара.'],
 ['Incline_Dumbbell_Press','Жим гантелей на наклонной','chest','w','Наклон 30–45°, медленно вниз, мощно вверх.'],
 ['Dumbbell_Flyes','Разводка гантелей','chest','w','Локти слегка согнуты, почувствуй растяжение внизу.'],
 ['Cable_Crossover','Сведение в кроссовере','chest','w','Сводишь руки дугой, задержись на секунду в точке сведения.'],
 ['Butterfly','Бабочка','chest','w','Спина прижата, своди медленно и подконтрольно.',{v:'Butterfly'}],
 ['Dips_-_Chest_Version','Отжимания на брусьях','chest','bw','Корпус наклонён вперёд — нагрузка уходит в грудь.'],
 ['Barbell_Deadlift','Становая тяга','back','w','Спина нейтральная, гриф скользит по ногам, толкай пол.'],
 ['Pullups','Подтягивания','back','bw','Тяни локти вниз к рёбрам, без раскачки.'],
 ['Chin-Up','Подтягивания обратным хватом','back','bw','Ладони к себе, подбородок над перекладиной.'],
 ['Bent_Over_Barbell_Row','Тяга штанги в наклоне','back','w','Наклон ~45°, тяни гриф к низу живота.'],
 ['Seated_Cable_Rows','Тяга нижнего блока','back','w','Спина ровная, своди лопатки в конце движения.'],
 ['One-Arm_Dumbbell_Row','Тяга гантели одной рукой','back','w','Тяни гантель к поясу, локоть вдоль корпуса.'],
 ['T-Bar_Row_with_Handle','Тяга Т-грифа','back','w','Грудь раскрыта, тяни к животу, не округляй спину.'],
 ['Hyperextensions_Back_Extensions','Гиперэкстензия','back','bw','Поднимайся до прямой линии, без переразгибания.'],
 ['Barbell_Shrug','Шраги со штангой','back','w','Поднимай плечи вверх к ушам, без вращения.'],
 ['Front_Barbell_Squat','Фронтальные приседания','legs','w','Локти высоко, корпус вертикальный.'],
 ['Goblet_Squat','Гоблет-присед','legs','w','Гантель у груди, садись глубоко между коленями.'],
 ['Hack_Squat','Гакк-присед','legs','w','Спина прижата, опускайся подконтрольно.'],
 ['Dumbbell_Lunges','Выпады с гантелями','legs','w','Шаг широкий, заднее колено почти касается пола.'],
 ['Leg_Extensions','Разгибание ног','legs','w','Задержись вверху на секунду, опускай медленно.',{v:'Leg_Extensions'}],
 ['Standing_Calf_Raises','Подъёмы на носки стоя','legs','w','Максимально вверх, растяжка внизу.'],
 ['Seated_Calf_Raise','Подъёмы на носки сидя','legs','w','Пауза вверху и внизу каждого повтора.'],
 ['Thigh_Adductor','Сведение ног в тренажёре','legs','w','Своди подконтрольно, не бросай вес.'],
 ['Barbell_Glute_Bridge','Ягодичный мостик','glutes','w','Толкай пятками, таз до прямой линии.'],
 ['Sumo_Deadlift','Становая сумо','glutes','w','Широкая стойка, носки врозь, колени наружу.'],
 ['Glute_Kickback','Отведение ноги назад','glutes','w','Без прогиба в пояснице, работает только ягодица.'],
 ['Standing_Military_Press','Армейский жим','shoulders','w','Пресс напряжён, гриф над головой по прямой.'],
 ['Seated_Dumbbell_Press','Жим гантелей сидя','shoulders','w','Спина прижата, гантели до уровня ушей.'],
 ['Arnold_Dumbbell_Press','Жим Арнольда','shoulders','w','Разворачивай ладони во время подъёма.'],
 ['Side_Lateral_Raise','Махи в стороны','shoulders','w','Локти чуть выше кистей, до уровня плеч.',{v:'Side_Lateral_Raise'}],
 ['Front_Dumbbell_Raise','Подъём гантелей перед собой','shoulders','w','До уровня глаз, без раскачки корпусом.'],
 ['Reverse_Flyes','Обратная разводка','shoulders','w','Наклон вперёд, разводи руки, своди лопатки.'],
 ['Face_Pull','Тяга к лицу','shoulders','w','Канат к лицу, локти высоко, разводи концы.'],
 ['Upright_Barbell_Row','Тяга штанги к подбородку','shoulders','w','Локти ведут движение, не выше плеч.'],
 ['Barbell_Curl','Подъём штанги на бицепс','arms','w','Локти прижаты, без раскачки корпусом.'],
 ['EZ-Bar_Curl','Подъём EZ-грифа на бицепс','arms','w','Медленная негативная фаза — 2–3 секунды.'],
 ['Dumbbell_Bicep_Curl','Сгибания с гантелями','arms','w','Супинируй кисть вверху, локти неподвижны.'],
 ['Hammer_Curls','Молотки','arms','w','Нейтральный хват, ладони друг к другу.'],
 ['Preacher_Curl','Сгибания на скамье Скотта','arms','w','Не разгибай руку до конца внизу.'],
 ['Concentration_Curls','Концентрированные сгибания','arms','w','Локоть упирается в бедро, пик-сокращение вверху.'],
 ['Triceps_Pushdown_-_Rope_Attachment','Разгибание на блоке с канатом','arms','w','Внизу разводи концы каната, локти прижаты.'],
 ['Lying_Triceps_Press','Французский жим','arms','w','Двигаются только предплечья, локти смотрят вверх.'],
 ['Standing_Dumbbell_Triceps_Extension','Разгибание гантели из-за головы','arms','w','Локти близко к голове, полная растяжка.'],
 ['Close-Grip_Barbell_Bench_Press','Жим узким хватом','arms','w','Хват на ширине плеч, локти вдоль корпуса.'],
 ['Bench_Dips','Обратные отжимания от скамьи','arms','bw','Спина близко к скамье, локти назад.'],
 ['Plank','Планка','core','t','Тело прямое, пресс и ягодицы напряжены.'],
 ['Crunches','Скручивания','core','bw','Отрывай лопатки, поясница прижата.'],
 ['Hanging_Leg_Raise','Подъём ног в висе','core','bw','Подкручивай таз, без раскачки.',{v:'Hanging_Leg_Raise'}],
 ['Russian_Twist','Русский твист','core','w','Поворачивай корпус, а не только руки.'],
 ['Cable_Crunch','Скручивания на блоке','core','w','Скручивайся рёбрами к тазу, бёдра неподвижны.'],
 ['Ab_Roller','Ролик для пресса','core','bw','Не прогибай поясницу, катись насколько держишь.'],
];
const EX = EX_RAW.map(([id,name,g,k,cue,m={}]) => ({id,name,g,k,cue,p:m.p === undefined ? id : m.p,v:m.v || null}));
const GROUPS = {glutes:'Ягодицы',legs:'Ноги',back:'Спина',chest:'Грудь',shoulders:'Плечи',arms:'Руки',core:'Пресс'};
// [ключ, название, фон, текст, акцент] — полные токены в index.html
const THEMES = [
  ['auto','Как в системе','#FFFFFF','#0F1013','#2F54EB'], ['light','Светлая','#FFFFFF','#0F1013','#2F54EB'], ['dark','Тёмная','#0B0C0E','#F2F3F5','#8197FF'],
  ['blush','Пудра','#FBF3F4','#3A2228','#D9668A'], ['sakura','Сакура','#FFF5F8','#4A1F33','#E4579A'], ['peony','Пион','#FDF0F3','#5B1730','#C2185B'],
  ['marsh','Зефир','#FFF8FA','#2E2430','#F07FA8'], ['rosegold','Розовое золото','#FAF2EF','#3B2420','#C9776B'], ['flamingo','Фламинго','#FFF1F3','#4D0F22','#FF4F7B'],
  ['nightrose','Ночная роза','#1A1014','#FBE9EF','#FF8FB1'],
];

// ---------- утилиты
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isFinite(n) ? n : null; };
const f1 = n => (Math.round(n * 10) / 10).toLocaleString('ru-RU');
const fVol = v => v >= 10000 ? f1(v / 1000) + ' т' : Math.round(v).toLocaleString('ru-RU') + ' кг';
const pad = n => String(n).padStart(2, '0');
const fClock = ms => { const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + pad(m) : m) + ':' + pad(s % 60); };
const fDur = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m < 60 ? m + ' мин' : Math.floor(m / 60) + ' ч ' + (m % 60) + ' мин'; };
const fDate = (t, o = {day:'numeric', month:'long'}) => new Date(t).toLocaleDateString('ru-RU', o);
const cap = s => s[0].toUpperCase() + s.slice(1);
const plural = (n, a, b, c) => { const m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c; };
const dayStart = t => { const d = new Date(t); d.setHours(0,0,0,0); return d; };
const weekStart = t => { const d = dayStart(t); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.getTime(); };
const e1 = (w, r) => r > 0 && w > 0 ? (r === 1 ? w : w * (1 + r / 30)) : 0; // Эпли

const IC = {
 home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 cal:'<rect x="3" y="4.5" width="18" height="17" rx="3"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
 dumb:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 down:'<path d="m6 9 6 6 6-6"/>', left:'<path d="m15 6-6 6 6 6"/>', right:'<path d="m9 6 6 6-6 6"/>',
 up:'<path d="m6 15 6-6 6 6"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
 more:'<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 flame:'<path d="M12 22c4 0 7-2.7 7-6.8 0-4-3-6.2-4-9.2-1.5 1.5-2 3-2 4.5C11 9 9 7 9 3c-3 2-4 6-4 9.5C5 18 8 22 12 22z"/>',
 play:'<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>',
 repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 share:'<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
 load:'<path d="M12 15V3M7 10l5 5 5-5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
 scale:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 10a5 5 0 0 1 8 0l-3 2.5"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 disc:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
};
const ico = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${IC[n]}</svg>`;

// ---------- хранилище
const KEY = 'lift.v1';
function fresh() {
  return { v:1, workouts:[], custom:[], body:[], active:null,
    templates:[
      {id:uid(), name:'Ноги и ягодицы', ex:MY_LEGS.map(r => r[0])},
      {id:uid(), name:'Верх тела', ex:MY_UPPER.map(r => r[0])},
    ],
    settings:{name:'', goal:3, rest:90, theme:'blush', sound:true, wake:true, hint:true, backup:0, mine:[...MINE], seenReport:''} };
}
// Надёжность: битые данные не затираются (копия в lift.v1.broken), раз в день — автокопия
// прошлого состояния (lift.v1.bak), запись сразу при сворачивании/закрытии приложения.
const BAK = KEY + '.bak';
let loadProblem = '';
function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); return true; } catch { return null; } }
function hydrate(d) { const f = fresh(); return {...f, ...d, settings:{...f.settings, ...d.settings}}; }
function load() {
  const raw = ls(KEY);
  if (raw) {
    try { const d = JSON.parse(raw); if (d && Array.isArray(d.workouts)) return hydrate(d); throw 0; }
    catch {
      ls(KEY + '.broken.' + Date.now(), raw); // не теряем ничего
      try { const b = JSON.parse(ls(BAK) || 'null'); if (b && Array.isArray(b.data.workouts)) { loadProblem = 'restored'; return hydrate(b.data); } } catch {}
      loadProblem = 'broken';
    }
  }
  return fresh();
}
let db = load();
if (loadProblem === 'restored') ls(KEY, JSON.stringify(db));
(function dailyBackup() {
  const today = new Date().toDateString(), raw = ls(KEY);
  try { const b = JSON.parse(ls(BAK) || 'null'); if (b && b.day === today) return; } catch {}
  if (raw && !loadProblem) ls(BAK, JSON.stringify({day:today, t:Date.now(), data:JSON.parse(raw)}));
})();
let saveT, saveFail = false;
function save() {
  clearTimeout(saveT); saveT = null;
  const ok = ls(KEY, JSON.stringify(db));
  if (!ok && !saveFail) toast('Не получилось сохранить: память телефона заполнена. Сделай копию в профиле.');
  saveFail = !ok;
}
function saveSoon() { clearTimeout(saveT); saveT = setTimeout(save, 300); }
const flush = () => { if (saveT) save(); };
addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

const ui = { tab:'home', sheets:[], q:'', grp:'mine', woOpen:false };

// ---------- доменная логика
const allEx = () => [...EX, ...db.custom];
const exById = id => allEx().find(e => e.id === id) || {id, name:'Удалённое упражнение', g:'core', k:'w', cue:''};
const workSets = it => it.sets.filter(s => !s.wu);
const setVol = (s, k) => k === 't' ? 0 : (s.w || 0) * (s.r || 0);
const score = (s, k) => k === 'w' ? e1(s.w, s.r) : k === 'bw' ? (s.w || 0) * 1000 + (s.r || 0) : (s.r || 0);
const woVol = w => w.items.reduce((a, it) => a + workSets(it).reduce((b, s) => b + setVol(s, exById(it.ex).k), 0), 0);
const woSets = w => w.items.reduce((a, it) => a + workSets(it).length, 0);
const woPRs = w => w.items.reduce((a, it) => a + it.sets.filter(s => s.pr).length, 0);
function fSet(s, k) {
  if (k === 't') return (s.r || 0) + ' сек';
  if (k === 'bw') return (s.w ? '+' + f1(s.w) + ' × ' : '') + (s.r || 0);
  return f1(s.w || 0) + ' × ' + (s.r || 0);
}
function lastSession(ex, skipId) {
  for (const w of db.workouts) { if (w.id === skipId) continue; const it = w.items.find(i => i.ex === ex); if (it) return it; }
  return null;
}
function bestScore(ex, skipId) {
  let b = 0;
  for (const w of db.workouts) { if (w.id === skipId) continue; for (const it of w.items) if (it.ex === ex) for (const s of workSets(it)) b = Math.max(b, score(s, exById(ex).k)); }
  return b;
}
function exSessions(ex) { // по возрастанию времени
  const k = exById(ex).k, out = [];
  for (const w of db.workouts) for (const it of w.items) if (it.ex === ex) {
    const ws = workSets(it); if (!ws.length) continue;
    out.push({t:w.start, wid:w.id, sets:it.sets, maxW:Math.max(...ws.map(s => s.w || 0)), best:Math.max(...ws.map(s => k === 'w' ? e1(s.w, s.r) : s.r || 0)), vol:ws.reduce((a, s) => a + setVol(s, k), 0), reps:Math.max(...ws.map(s => s.r || 0))});
  }
  return out.reverse();
}
function sortWo() { db.workouts.sort((a, b) => b.start - a.start); }

// ---------- график (SVG без библиотек)
let gid = 0;
function chart(pts, unit = '') {
  if (pts.length < 2) return `<p class="ce">${pts.length ? 'Нужна ещё одна запись, чтобы построить график' : 'Данных пока нет'}</p>`;
  const W = 340, H = 150, px = 6, pt = 24, pb = 24;
  const xs = pts.map(p => p.t), ys = pts.map(p => p.v);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(...ys), y1 = Math.max(...ys); if (y0 === y1) { y0 -= 1; y1 += 1; }
  const py = (y1 - y0) * .08; y0 -= py; y1 += py;
  const X = t => px + (x1 === x0 ? .5 : (t - x0) / (x1 - x0)) * (W - 2 * px), Y = v => pt + (1 - (v - y0) / (y1 - y0)) * (H - pt - pb);
  const P = pts.map(p => [+X(p.t).toFixed(1), +Y(p.v).toFixed(1)]);
  let d = `M${P[0]}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2}`;
  }
  const mi = ys.lastIndexOf(Math.max(...ys)), last = P.at(-1), mp = P[mi];
  const lx = v => Math.min(W - 22, Math.max(22, v));
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="График прогресса">
   <line x1="0" x2="${W}" y1="${H - pb + 6}" y2="${H - pb + 6}" stroke="var(--line)"/>
   <path d="${d}" fill="none" stroke="var(--acc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="${last[0]}" cy="${last[1]}" r="4" fill="var(--acc)"/>
   <circle cx="${mp[0]}" cy="${mp[1]}" r="3" fill="var(--bg)" stroke="var(--tx)" stroke-width="1.5"/>
   <text class="lab" x="${lx(mp[0])}" y="${mp[1] - 10}" text-anchor="middle">${f1(ys[mi])}${unit}</text>
   <text x="${px}" y="${H - 2}">${fDate(x0, {day:'numeric', month:'short'})}</text>
   <text x="${W - px}" y="${H - 2}" text-anchor="end">${fDate(x1, {day:'numeric', month:'short'})}</text>
  </svg>`;
}
const numU = (v, u) => `${v}<small>${u}</small>`;
const volParts = v => v >= 10000 ? [f1(v / 1000), 'т'] : [Math.round(v).toLocaleString('ru-RU'), 'кг'];

// ---------- экраны
function vHome() {
  const S = db.settings, now = Date.now(), wk = weekStart(now), day = 864e5;
  const wkW = db.workouts.filter(w => w.start >= wk);
  const trained = new Set(db.workouts.map(w => dayStart(w.start).toDateString()));
  const today = dayStart(now);
  let streak = 0, ws = wkW.length ? wk : weekStart(wk - day);
  for (;;) { const we = ws + 7 * day + 3600e3; if (db.workouts.some(w => w.start >= ws && w.start < we)) { streak++; ws = weekStart(ws - day); } else break; }
  const mStart = new Date(today); mStart.setDate(1);
  const mW = db.workouts.filter(w => w.start >= mStart.getTime());
  const [vv, vu] = volParts(mW.reduce((x, w) => x + woVol(w), 0));
  const left = S.goal - wkW.length;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent), standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  const prs = [];
  for (const w of db.workouts) { for (const it of w.items) for (const s of it.sets) if (s.pr) prs.push({ex:it.ex, s, t:w.start}); if (prs.length >= 4) break; }
  const a = db.active;
  const days = Array.from({length:7}, (_, i) => { const d = new Date(wk); d.setDate(d.getDate() + i); return d; });
  return `
  <div class="eyebrow toprow"><span>${cap(fDate(now, {weekday:'long', day:'numeric', month:'long'}))}</span>${streak > 1 ? `<span class="streak">${streak} ${plural(streak, 'неделя', 'недели', 'недель')} подряд</span>` : ''}</div>
  <h1>${S.name ? 'Привет, ' + esc(S.name) : 'Привет'}</h1>
  <div class="week">${days.map((d, i) => `<button class="wd ${trained.has(d.toDateString()) ? 'on' : ''} ${d > today ? 'fut' : ''} ${d.getTime() === today.getTime() ? 'today' : ''}" data-a="day" data-t="${d.getTime()}" aria-label="${fDate(d)}"><span>${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</span><b class="n">${d.getDate()}</b></button>`).join('')}</div>
  <p class="weeknote"><b>${wkW.length} из ${S.goal}</b> на этой неделе${left <= 0 ? ' — цель выполнена' : wkW.length ? ` · ещё ${left} до цели` : ''}</p>
  ${a ? `<button class="btn" data-a="openWo">Вернуться к тренировке</button>` : `<button class="btn" data-a="startMenu">Начать тренировку</button>`}
  ${notices(ios, standalone)}
  ${db.workouts.length ? `<div class="sec" style="margin-top:34px"><h2>В ${MONTHS_PREP[new Date().getMonth()]}</h2></div><div class="figs" style="margin-top:0;border:0;padding-top:4px">
    <div><b class="n">${mW.length}</b><span>${plural(mW.length, 'тренировка', 'тренировки', 'тренировок')}</span></div>
    <div><b class="n">${numU(vv, vu)}</b><span>тоннаж</span></div>
    <div><b class="n">${mW.reduce((x, w) => x + woPRs(w), 0)}</b><span>${plural(mW.reduce((x, w) => x + woPRs(w), 0), 'рекорд', 'рекорда', 'рекордов')}</span></div>
  </div>
  ${monthCard()}` : `<ol class="steps">
    <li><b>Выбери шаблон</b> ниже — и отметь, что делаешь сегодня.</li>
    <li><b>Отмечай подход</b> галочкой — таймер отдыха запустится сам.</li>
    <li><b>В следующий раз</b> увидишь прошлые веса и подсказку, сколько попробовать.</li>
  </ol>`}
  <div class="sec"><h2>Шаблоны</h2><button data-a="newTpl">Создать</button></div>
  <div class="list">${db.templates.map(t => `<div class="li"><button class="grow" data-a="tplEdit" data-id="${t.id}" style="min-width:0"><div class="t ell">${esc(t.name || 'Без названия')}</div><div class="s ell">${t.ex.length} ${plural(t.ex.length, 'упражнение', 'упражнения', 'упражнений')}${lastTpl(t) ? ' · ' + lastTpl(t) : ''}</div></button><button class="go" data-a="startTpl" data-id="${t.id}" aria-label="Начать «${esc(t.name)}»">${ico('play')}</button></div>`).join('') || `<p class="empty">Шаблон — это готовый список упражнений. Создай, чтобы начинать тренировку в одно касание.</p>`}</div>
  ${prs.length ? `<div class="sec"><h2>Последние рекорды</h2></div><div class="list">${prs.map(p => { const e = exById(p.ex); return `<button class="li" data-a="exInfo" data-id="${e.id}"><div class="grow"><div class="t ell">${esc(e.name)}</div><div class="s">${fDate(p.t)}</div></div><span class="v n">${fSet(p.s, e.k)}<span class="pr">PR</span></span></button>`; }).join('')}</div>` : ''}
  ${db.workouts.length ? `<div class="sec"><h2>Активность</h2><span class="mut" style="font-size:14px">${db.workouts.length} ${plural(db.workouts.length, 'тренировка', 'тренировки', 'тренировок')}</span></div>
  ${heat()}` : ''}`;
}
// важные предупреждения про сохранность данных
function notices(ios, standalone) {
  const S = db.settings, out = [];
  if (loadProblem === 'restored') out.push(['warn', 'Данные были повреждены — восстановила последнюю автокопию. Проверь последние тренировки.', 'hideProblem']);
  if (loadProblem === 'broken') out.push(['warn', 'Сохранённые данные повреждены, копии нет. Если у тебя есть файл копии — восстанови его в профиле.', 'hideProblem']);
  if (ios && !standalone && S.hint) out.push(['info', 'Ты в Safari. Данные здесь и в приложении на экране «Домой» хранятся отдельно — пользуйся только приложением. Добавить: «Поделиться» → «На экран „Домой“».', 'hideHint']);
  const old = Date.now() - (S.backup || 0) > 14 * 864e5;
  if (db.workouts.length >= 4 && old) out.push(['info', `${S.backup ? 'Последняя копия была давно' : 'У тебя ещё нет копии данных'}. Сохрани её в «Файлы» или iCloud — на случай смены телефона.`, null, 'export', 'Сохранить копию']);
  return out.map(([kind, text, hide, act, label]) => `<div class="notice ${kind}"><p>${text}</p>${act ? `<button class="btn sm" data-a="${act}">${label}</button>` : ''}${hide ? `<button class="ib" data-a="${hide}" aria-label="Скрыть">${ico('x')}</button>` : ''}</div>`).join('');
}
function monthCard() {
  const now = mKey(Date.now()), pk = now - 1;
  const prevHas = db.workouts.some(w => mKey(w.start) === pk);
  if (prevHas && db.settings.seenReport !== pk) return `<button class="mcard new" data-a="month" data-k="${pk}"><span class="grow"><span class="eyebrow">Готовы итоги</span><b>${MONTHS[pk % 12][0].toUpperCase() + MONTHS[pk % 12].slice(1)}: как ты прогрессировала</b></span>${ico('right')}</button>`;
  if (!db.workouts.length) return '';
  return `<button class="mcard" data-a="month" data-k="${now}"><span class="grow"><span class="eyebrow">Итоги месяца</span><b>${mName(now)} — разбор прогресса</b></span>${ico('right')}</button>`;
}
function lastTpl(t) {
  const w = db.workouts.find(w => w.tpl === t.id);
  if (!w) return '';
  const d = Math.round((dayStart(Date.now()) - dayStart(w.start)) / 864e5);
  return d === 0 ? 'сегодня' : d === 1 ? 'вчера' : d + ' ' + plural(d, 'день', 'дня', 'дней') + ' назад';
}
function heat() {
  const weeks = 18, today = dayStart(Date.now()), start = new Date(weekStart(today)); start.setDate(start.getDate() - (weeks - 1) * 7);
  const map = {};
  for (const w of db.workouts) { const k = dayStart(w.start).toDateString(); map[k] = (map[k] || 0) + woVol(w) + 1; }
  const vals = Object.values(map).sort((a, b) => a - b), q = p => vals[Math.floor(p * (vals.length - 1))] || 0;
  const t1 = q(.33), t2 = q(.66);
  let cells = '', months = [], lastM = -1;
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    if (i % 7 === 0 && d.getMonth() !== lastM) { months.push(d.toLocaleDateString('ru-RU', {month:'short'}).replace('.', '')); lastM = d.getMonth(); }
    const v = map[d.toDateString()] || 0;
    cells += `<i class="${!v ? '' : v <= t1 ? 'l1' : v <= t2 ? 'l2' : 'l3'}${d > today ? ' f' : ''}${d.getTime() === today.getTime() ? ' t' : ''}" data-a="day" data-t="${d.getTime()}"></i>`;
  }
  return `<div class="heat">${cells}</div><div class="heatm">${months.map(m => `<span>${m}</span>`).join('')}</div>`;
}

function vHist() {
  let out = `<div class="head"><h1>История</h1>${db.workouts.length ? `<button class="chipb" data-a="month">Итоги месяцев</button>` : ''}</div>`;
  if (!db.workouts.length) return out + `<p class="empty"><b>Пока пусто</b>Завершённые тренировки появятся здесь — с весами, подходами и рекордами.</p>`;
  const [tv, tu] = volParts(db.workouts.reduce((a, w) => a + woVol(w), 0));
  const hrs = Math.round(db.workouts.reduce((a, w) => a + (w.end - w.start), 0) / 3600e3);
  out += `<div class="figs" style="margin-top:0;border:0;padding:0"><div><b class="n">${db.workouts.length}</b><span>тренировок</span></div><div><b class="n">${numU(tv, tu)}</b><span>поднято</span></div><div><b class="n">${numU(hrs, 'ч')}</b><span>в зале</span></div></div>`;
  let m = '';
  for (const w of db.workouts) {
    const mm = fDate(w.start, {month:'long', year:'numeric'}).replace(' г.', '');
    if (mm !== m) { out += `<div class="month">${mm}</div>`; m = mm; }
    const prs = woPRs(w), [v, u] = volParts(woVol(w));
    out += `<button class="hrow" data-a="woInfo" data-id="${w.id}">
      <div class="d"><b class="n">${new Date(w.start).getDate()}</b><span>${fDate(w.start, {weekday:'short'})}</span></div>
      <div style="min-width:0"><h3 class="ell">${esc(w.name)}</h3>
      <div class="m">${fDur(w.end - w.start)} · ${v} ${u} · ${woSets(w)} ${plural(woSets(w), 'подход', 'подхода', 'подходов')}${prs ? ` · <span class="acc">${prs} PR</span>` : ''}</div>
      ${w.items.slice(0, 4).map(it => { const e = exById(it.ex), ws = workSets(it), b = ws.reduce((x, s) => score(s, e.k) > score(x, e.k) ? s : x, ws[0] || it.sets[0]); return `<div class="x"><span class="ell">${esc(e.name)}</span><span class="n">${b ? fSet(b, e.k) : ''}</span></div>`; }).join('')}
      ${w.items.length > 4 ? `<div class="x mut">ещё ${w.items.length - 4}</div>` : ''}</div>
    </button>`;
  }
  return out;
}

const mineIds = () => db.settings.mine || MINE;
const isMine = id => mineIds().includes(id);
const GORDER = Object.keys(GROUPS);
function exFiltered(q, g) {
  q = q.trim().toLowerCase();
  const hit = e => !q || e.name.toLowerCase().includes(q);
  if (g === 'mine') return mineIds().map(exById).filter(e => e && hit(e));
  return allEx().filter(e => (g === 'all' || e.g === g) && hit(e));
}
// «Мои» сверху, остальные по группам мышц
function exSections(q, g) {
  const list = exFiltered(q, g);
  if (g !== 'all') return [[g === 'mine' ? '' : null, list]];
  const mine = mineIds().map(exById).filter(e => list.includes(e));
  const rest = list.filter(e => !isMine(e.id)).sort((a, b) => GORDER.indexOf(a.g) - GORDER.indexOf(b.g));
  const out = [];
  if (mine.length) out.push(['Мои упражнения', mine]);
  for (const k of GORDER) { const r = rest.filter(e => e.g === k); if (r.length) out.push([GROUPS[k], r]); }
  return out;
}
const filters = (cur, act) => `<div class="filters">${['mine', 'all', ...GORDER].map(g => `<button class="${cur === g ? 'on' : ''}" data-a="${act}" data-v="${g}">${g === 'mine' ? 'Мои' : g === 'all' ? 'Все' : GROUPS[g]}</button>`).join('')}</div>`;
function vEx() {
  return `<div class="head"><h1>Упражнения</h1><button class="ib" data-a="newEx" aria-label="Своё упражнение">${ico('plus')}</button></div>
  <label class="search">${ico('search')}<input id="q" type="search" placeholder="Найти упражнение" value="${esc(ui.q)}" autocomplete="off"></label>
  ${filters(ui.grp, 'grp')}
  <div id="exlist">${exList()}</div>`;
}
function exList() {
  const secs = exSections(ui.q, ui.grp);
  if (!secs.some(([, l]) => l.length)) return ui.grp === 'mine' && !ui.q ? `<p class="empty"><b>Здесь будут твои упражнения</b>Открой любое упражнение и нажми «Добавить в мои».</p>` : `<p class="empty"><b>Ничего не нашлось</b>Добавь своё упражнение кнопкой «+».</p>`;
  const best = id => { let b = 0; for (const w of db.workouts) for (const it of w.items) if (it.ex === id) for (const s of workSets(it)) b = Math.max(b, s.w || 0); return b; };
  const row = e => { const b = e.k === 'w' ? best(e.id) : 0; return `<button class="li" data-a="exInfo" data-id="${e.id}"><div class="grow t ell">${esc(e.name)}</div>${e.v ? `<span class="vtag" aria-label="есть видео">${ico('play')}</span>` : ''}${b ? `<span class="v n">${f1(b)}<small class="mut" style="font-family:Onest;font-size:13px;font-stretch:100%"> кг</small></span>` : ''}${ico('right', 'chev')}</button>`; };
  return secs.map(([h, l]) => (h ? `<div class="grp${h === 'Мои упражнения' ? ' mine' : ''}">${h}</div>` : '') + `<div class="${h ? '' : 'list'}">${l.map(row).join('')}</div>`).join('');
}

function vMe() {
  const S = db.settings, bw = [...db.body].sort((a, b) => a.t - b.t), lastBw = bw.at(-1);
  const diff = bw.length > 1 ? lastBw.v - bw[0].v : 0;
  const bk = S.backup ? fDate(S.backup, {day:'numeric', month:'short'}) : 'не было';
  const r = (k, v, a, extra = '', cls = '') => { const tag = a ? 'button' : 'div'; return `<${tag} class="set-r ${cls}" ${a ? `data-a="${a}"` : ''} ${extra}><span class="k">${k}</span>${v}</${tag}>`; };
  const restL = v => v ? (v < 60 ? v + ' с' : String(v / 60).replace('.', ',') + ' мин') : 'Выкл';
  return `<input class="namein" id="pname" placeholder="Как тебя зовут?" value="${esc(S.name)}" maxlength="24" enterkeyhint="done">
  <p class="mut" style="font-size:14px;margin-top:4px">${db.workouts.length ? `${db.workouts.length} ${plural(db.workouts.length, 'тренировка', 'тренировки', 'тренировок')} с ${fDate(db.workouts.at(-1).start, {day:'numeric', month:'long', year:'numeric'})}` : 'Первая тренировка впереди'}</p>
  <div class="sec"><h2>Вес тела</h2><button data-a="addBw">Записать</button></div>
  ${lastBw ? `<div class="row" style="align-items:baseline;margin-top:6px"><b class="n" style="font-size:44px;line-height:1">${f1(lastBw.v)}</b><span class="mut">кг</span>${bw.length > 1 ? `<span class="n" style="font-size:18px;margin-left:6px">${diff > 0 ? '+' : diff < 0 ? '−' : ''}${f1(Math.abs(diff))}</span><span class="mut" style="font-size:13px">с ${fDate(bw[0].t, {day:'numeric', month:'short'})}</span>` : ''}</div>` : ''}
  ${chart(bw.map(p => ({t:p.t, v:p.v})))}
  <div class="sec"><h2>Тренировки</h2></div>
  <div class="group">
    ${r('Цель в неделю', `<span class="step"><button data-a="goal" data-v="-1" aria-label="Меньше">−</button><b class="n">${S.goal}</b><button data-a="goal" data-v="1" aria-label="Больше">+</button></span>`)}
    ${r('Отдых между подходами', `<span class="v">${restL(S.rest)}</span>`)}
    <div class="opts">${[0, 45, 60, 90, 120, 180, 240].map(v => `<button class="${S.rest === v ? 'on' : ''}" data-a="restDef" data-v="${v}">${restL(v)}</button>`).join('')}</div>
    ${r('Звук в конце отдыха', `<span class="tg ${S.sound ? 'on' : ''}"></span>`, 'tgl', 'data-v="sound"')}
    ${r('Не гасить экран', `<span class="tg ${S.wake ? 'on' : ''}"></span>`, 'tgl', 'data-v="wake"')}
  </div>
  <div class="sec"><h2>Оформление</h2></div>
  <div class="group">
    <div class="themes">${THEMES.map(([k, n, bg, tx, ac]) => `<button class="th ${(S.theme || 'auto') === k ? 'on' : ''}" style="background:${k === 'auto' ? `linear-gradient(225deg,#0B0C0E 26%,#FFFFFF 26%)` : bg};color:${k === 'auto' ? '#0F1013' : tx}" data-a="theme" data-v="${k}"><i><b style="background:${tx}"></b><b style="background:${ac}"></b></i><span>${n}</span></button>`).join('')}</div>
  </div>
  <div class="sec"><h2>Инструменты</h2></div>
  <div class="group">
    ${r('Калькулятор блинов', ico('right', 'chev mut'), 'plates')}
    ${r('Расчёт разового максимума', ico('right', 'chev mut'), 'orm')}
  </div>
  <div class="sec"><h2>Данные</h2></div>
  <div class="group">
    ${r('Сохранить копию', `<span class="v">${bk}</span>`, 'export')}
    ${r('Восстановить из файла копии', '', 'import')}
    ${(b => b ? r('Вернуть автокопию', `<span class="v">${fDate(b.t, {day:'numeric', month:'short'})}</span>`, 'restoreBak') : '')((() => { try { return JSON.parse(ls(BAK) || 'null'); } catch { return null; } })())}
    ${r('Удалить все данные', '', 'wipe', '', 'red')}
  </div>
  <p class="foot">Всё хранится только на этом телефоне и сохраняется сразу. Раз в день приложение само делает автокопию. Файл копии раз в пару недель — на случай смены телефона.</p>`;
}

// ---------- тренировка
function newSets(ex) {
  const last = lastSession(ex);
  const n = last ? last.sets.length : 3;
  return Array.from({length:Math.max(1, Math.min(n, 10))}, (_, i) => ({w:null, r:null, d:false, wu:!!(last && last.sets[i] && last.sets[i].wu)}));
}
function startWo(exIds, name, tpl, back) {
  if (db.active && !confirm(db.active.wid ? 'Сейчас открыто редактирование другой тренировки. Отменить его?' : 'Уже идёт тренировка. Удалить её и начать новую?')) return;
  db.active = {start:Date.now(), name:name || defName(), tpl:tpl || null, items:exIds.map(ex => ({ex, sets:newSets(ex)})), restEnd:0, restTot:0};
  if (back) Object.assign(db.active, {wid:uid(), back:true, start:back.start, end:back.end, name:name || 'Тренировка'});
  ui.sheets = []; ui.woOpen = true; save(); render(); wake();
}
function defName() { const h = new Date().getHours(); return h < 12 ? 'Утренняя тренировка' : h < 17 ? 'Дневная тренировка' : 'Вечерняя тренировка'; }
function prevSet(ex, si) { const l = lastSession(ex, db.active?.wid); return l ? l.sets[si] || l.sets.at(-1) : null; }
function placeholder(it, si) {
  const p = prevSet(it.ex, si); if (p) return p;
  for (let i = si - 1; i >= 0; i--) { const s = it.sets[i]; if (s.r) return s; }
  return null;
}
function woStatHTML() {
  const a = db.active;
  const [v, u] = volParts(woVol({items:a.items.map(it => ({...it, sets:it.sets.filter(s => s.d)}))}));
  const done = a.items.reduce((x, it) => x + it.sets.filter(s => s.d && !s.wu).length, 0);
  return `<span><span class="n">${v}</span> ${u}</span><span><span class="n">${done}</span> ${plural(done, 'подход', 'подхода', 'подходов')}</span>`;
}
function vWo() {
  const a = db.active; if (!a) return '';
  return `<div class="wohd">
    <button class="ib" data-a="minWo" aria-label="Свернуть">${ico('down')}</button>
    <div class="clock n">${a.wid ? fDate(a.start) + `<small>${a.back ? 'задним числом' : 'редактирование'}</small>` : `<span data-clock>${fClock(Date.now() - a.start)}</span><small>идёт тренировка</small>`}</div>
    <div class="row" style="gap:2px">${a.wid ? '' : `<button class="ib" data-a="restStart" aria-label="Таймер отдыха">${ico('timer')}</button>`}<button class="btn sm" data-a="finish">${a.wid ? 'Сохранить' : 'Завершить'}</button></div>
  </div>
  <div class="wobody" id="wobody">
    <input class="woname" id="woname" value="${esc(a.name)}" maxlength="40" enterkeyhint="done" aria-label="Название тренировки">
    <div class="wostat" id="wostat">${woStatHTML()}</div>
    ${a.items.map((it, ei) => wex(it, ei)).join('')}
    ${!a.items.length ? `<p class="empty">Добавь упражнения — можно выбрать сразу несколько.</p>` : ''}
    <div class="acts" style="margin-top:30px">
      <button class="btn sec2" data-a="addEx">${ico('plus')} Добавить упражнения</button>
      <button class="btn del" data-a="cancelWo">${a.wid ? 'Отменить изменения' : 'Удалить тренировку'}</button>
    </div>
  </div>`;
}
// двойная прогрессия: все рабочие подходы на максимальном весе с одинаковыми повторами — прибавь вес, иначе добей повторы
// прошлый раз целиком: «30 × 10·10·9», если вес во всех рабочих подходах одинаковый
function wasStr(last, k) {
  const ws = workSets(last); if (!ws.length) return '';
  if (k === 't') return ws.map(x => x.r).join('·') + ' сек';
  const w = ws[0].w || 0;
  if (!ws.every(x => (x.w || 0) === w)) return '';
  return (k === 'bw' ? (w ? '+' + f1(w) + ' × ' : '') : f1(w) + ' × ') + ws.map(x => x.r).join('·');
}
function suggest(last, k) {
  const ws = workSets(last); if (!ws.length) return '';
  if (k === 't') return Math.max(...ws.map(x => x.r || 0)) + 5 + ' сек';
  if (k === 'bw') { const r = Math.max(...ws.map(x => x.r || 0)); const w = Math.max(...ws.map(x => x.w || 0)); return (w ? '+' + f1(w) + ' × ' + (r + 1) : (r + 1) + '</span> ' + plural(r + 1, 'повтор', 'повтора', 'повторов') + '<span>'); }
  const top = Math.max(...ws.map(x => x.w || 0)); if (!top) return '';
  const at = ws.filter(x => x.w === top), lo = Math.min(...at.map(x => x.r)), hi = Math.max(...at.map(x => x.r));
  if (lo === hi && at.length > 1) return f1(top + (top >= 10 ? 2.5 : 1)) + ' × ' + lo;
  return f1(top) + ' × ' + hi + '</span> в каждом подходе<span>';
}
function wex(it, ei) {
  const e = exById(it.ex), k = e.k;
  const last = lastSession(it.ex, db.active.wid);
  const lb = last && (workSets(last).reduce((x, s) => score(s, k) > score(x, k) ? s : x, workSets(last)[0]) || last.sets[0]);
  let n = 0;
  return `<section class="wex">
    <div class="hd"><button class="nm" data-a="exInfo" data-id="${e.id}"><h3>${esc(e.name)}</h3><small>${lb ? `Было <span class="n">${wasStr(last, k) || fSet(lb, k)}</span>${db.active.wid ? '' : (sg => sg ? ` · <span class="goal">цель <span class="n">${sg}</span></span>` : '')(suggest(last, k))}` : GROUPS[e.g] + ' · первый раз'}</small></button>
      <button class="ib" data-a="exMenu" data-e="${ei}" aria-label="Действия с упражнением" style="margin-right:-8px">${ico('more')}</button></div>
    <div class="sets">
      <div class="sh"><span></span><span>Прошлый</span><span>${k === 'bw' ? '+кг' : k === 't' ? '' : 'кг'}</span><span>${k === 't' ? 'сек' : 'повт'}</span><span></span></div>
      ${it.sets.map((s, si) => { const p = prevSet(it.ex, si), ph = placeholder(it, si); if (!s.wu) n++;
        return `<div class="set ${s.d ? 'done' : ''} ${s.wu ? 'wu' : ''}">
          <button class="sn n" data-a="setType" data-e="${ei}" data-s="${si}" aria-label="Разминка или рабочий">${s.wu ? 'Р' : n}</button>
          <button class="prev n" data-a="usePrev" data-e="${ei}" data-s="${si}">${p ? fSet(p, k) : '—'}${s.pr ? '<span class="pr">PR</span>' : ''}</button>
          ${k === 't' ? '<span class="na">—</span>' : `<input class="in n" inputmode="decimal" data-f="w" data-e="${ei}" data-s="${si}" value="${s.w == null ? '' : String(s.w).replace('.', ',')}" placeholder="${ph && ph.w ? f1(ph.w).replace(/\s/g, '') : k === 'bw' ? '0' : ''}" aria-label="Вес">`}
          <input class="in n" inputmode="numeric" pattern="[0-9]*" data-f="r" data-e="${ei}" data-s="${si}" value="${s.r ?? ''}" placeholder="${ph && ph.r ? ph.r : ''}" aria-label="${k === 't' ? 'Секунды' : 'Повторы'}">
          <button class="ck" data-a="check" data-e="${ei}" data-s="${si}" aria-label="Подход выполнен">${ico('check')}</button>
        </div>`; }).join('')}
    </div>
    <div class="ft"><button data-a="addSet" data-e="${ei}">+ Подход</button>${it.sets.length > 1 ? `<button class="m" data-a="delSet" data-e="${ei}">Убрать последний</button>` : ''}</div>
  </section>`;
}
function woStatUpdate() { const el = $('#wostat'); if (db.active && el) el.innerHTML = woStatHTML(); }
function renderWo() {
  const el = $('#wo'), a = db.active;
  if (!a) { el.classList.remove('on'); setTimeout(() => { if (!db.active) el.innerHTML = ''; }, 450); return; }
  const top = $('#wobody')?.scrollTop || 0;
  el.innerHTML = vWo();
  $('#wobody').scrollTop = top;
  el.classList.toggle('on', ui.woOpen);
}
function finish() {
  const a = db.active;
  const items = a.items.map(it => ({ex:it.ex, sets:it.sets.filter(s => s.d || (a.wid && s.r > 0)).map(s => ({w:s.w || 0, r:s.r || 0, wu:!!s.wu, pr:!!s.pr}))})).filter(it => it.sets.length);
  if (!items.length) { if (confirm(a.wid ? 'Не заполнено ни одного подхода. Выйти без сохранения?' : 'Ни один подход не отмечен. Удалить тренировку?')) { db.active = null; ui.woOpen = false; save(); releaseWake(); render(); } return; }
  const left = a.items.reduce((x, it) => x + it.sets.filter(s => !s.d).length, 0);
  if (left && !a.wid && !confirm(`${left} ${plural(left, 'подход не отмечен', 'подхода не отмечены', 'подходов не отмечены')} и не сохранятся. Завершить?`)) return;
  const w = {id:a.wid || uid(), name:a.name.trim() || defName(), start:a.start, end:a.wid ? a.end : Date.now(), tpl:a.tpl, items};
  db.workouts = db.workouts.filter(x => x.id !== w.id); db.workouts.push(w); sortWo();
  recomputePR();
  db.active = null; ui.woOpen = false; save(); releaseWake();
  render();
  if (!a.wid) openSheet({t:'sum', id:w.id}); else toast(a.back ? `Тренировка за ${fDate(w.start)} добавлена` : 'Изменения сохранены');
}
function recomputePR() { // рекорды пересчитываются хронологически — правки и удаления не ломают отметки
  const best = {};
  for (const w of [...db.workouts].reverse()) for (const it of w.items) {
    const k = exById(it.ex).k; let top = null;
    for (const s of it.sets) { s.pr = false; if (!s.wu && (!top || score(s, k) > score(top, k))) top = s; }
    if (!top) continue;
    const sc = score(top, k); // одна отметка на упражнение за тренировку — лучший подход
    if (best[it.ex] !== undefined && sc > best[it.ex]) top.pr = true;
    best[it.ex] = Math.max(best[it.ex] ?? 0, sc);
  }
}

// ---------- таймер отдыха и звук
let ac;
function unlockAudio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch {} }
function beep() {
  if (!db.settings.sound || !ac) return;
  [0, .2, .4].forEach((d, i) => { const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + d;
    o.type = 'sine'; o.frequency.value = i === 2 ? 1318 : 988;
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.45, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + .16);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .18); });
  navigator.vibrate?.([120, 80, 120]);
}
function startRest(sec) {
  const a = db.active; if (!a || !sec) return;
  a.restTot = sec; a.restEnd = Date.now() + sec * 1000; save(); tick();
}
function tick() {
  const a = db.active, now = Date.now(), r = $('#rest');
  if (!a) { r.classList.remove('on'); return; }
  if (!a.wid) document.querySelectorAll('[data-clock]').forEach(el => el.textContent = fClock(now - a.start));
  if (a.restEnd) {
    const left = a.restEnd - now;
    if (left <= 0) { a.restEnd = 0; save(); beep(); haptic(); toast('Отдых закончился'); r.classList.remove('on'); return; }
    if (!r.firstChild) r.innerHTML = `<div class="bar" id="rbar"></div><div class="t"><b class="n" id="rtime"></b><span>отдых</span></div>
      <button class="n" data-a="restAdd" data-v="-15" aria-label="Минус 15 секунд">−15</button><button class="n" data-a="restAdd" data-v="15" aria-label="Плюс 15 секунд">+15</button><button data-a="restSkip">Пропустить</button>`;
    $('#rtime').textContent = fClock(left + 999);
    $('#rbar').style.transform = 'scaleX(' + (1 - left / (a.restTot * 1000)).toFixed(4) + ')';
    r.classList.add('on'); r.classList.toggle('inwo', ui.woOpen);
  } else r.classList.remove('on');
}
setInterval(() => db.active && tick(), 1000);

let wl = null;
async function wake() { if (db.active && !db.active.wid && db.settings.wake && 'wakeLock' in navigator && !wl && document.visibilityState === 'visible') { try { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => wl = null); } catch {} } }
function releaseWake() { wl?.release().catch(() => {}); wl = null; }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { wake(); tick(); } });

// ---------- шторки
const SH = {};
// ---------- итоги месяца
const mKey = t => { const d = new Date(t); return d.getFullYear() * 12 + d.getMonth(); };
const mStart = k => new Date(Math.floor(k / 12), k % 12, 1).getTime();
const MONTHS = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
const MONTHS_ACC = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
const MONTHS_PREP = ['январе','феврале','марте','апреле','мае','июне','июле','августе','сентябре','октябре','ноябре','декабре'];
const mName = k => cap(MONTHS[k % 12]);
const pct = (a, b) => b ? Math.round((a - b) / b * 100) : null;
const sgn = v => v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0';
function monthData(k) {
  const a = mStart(k), b = mStart(k + 1);
  const ws = db.workouts.filter(w => w.start >= a && w.start < b);
  const prev = db.workouts.filter(w => w.start >= mStart(k - 1) && w.start < a);
  const vol = ws.reduce((x, w) => x + woVol(w), 0), pvol = prev.reduce((x, w) => x + woVol(w), 0);
  const time = ws.reduce((x, w) => x + (w.end - w.start), 0);
  // прогресс: лучший подход месяца против лучшего за всё время до него
  const ex = {};
  for (const w of ws) for (const it of w.items) { const e = exById(it.ex); for (const st of workSets(it)) { const sc = score(st, e.k); if (!ex[it.ex] || sc > ex[it.ex].sc) ex[it.ex] = {sc, st, e}; } }
  const prog = Object.entries(ex).map(([id, o]) => {
    let before = 0, bst = null;
    for (const w of db.workouts) if (w.start < a) for (const it of w.items) if (it.ex === id) for (const st of workSets(it)) { const sc = score(st, o.e.k); if (sc > before) { before = sc; bst = st; } }
    let fromStart = false;
    if (!before) { // первый месяц с упражнением: сравниваем с первой тренировкой месяца
      const ses = [...ws].reverse().filter(w => w.items.some(it => it.ex === id));
      if (ses.length > 1) { for (const st of workSets(ses[0].items.find(it => it.ex === id))) { const sc = score(st, o.e.k); if (sc > before) { before = sc; bst = st; } } fromStart = true; }
    }
    return {...o, id, before, bst, fromStart, p:before ? pct(o.sc, before) : null};
  }).sort((x, y) => (y.p ?? -1e9) - (x.p ?? -1e9));
  const prs = []; ws.forEach(w => w.items.forEach(it => it.sets.forEach(st => st.pr && prs.push({e:exById(it.ex), st, t:w.start}))));
  const groups = {}; let total = 0;
  ws.forEach(w => w.items.forEach(it => { const n = workSets(it).length, g = exById(it.ex).g; groups[g] = (groups[g] || 0) + n; total += n; }));
  const dow = [0, 0, 0, 0, 0, 0, 0]; ws.forEach(w => dow[(new Date(w.start).getDay() + 6) % 7]++);
  const weeks = {}; ws.forEach(w => { const wk = weekStart(w.start); weeks[wk] = (weeks[wk] || 0) + 1; });
  const body = db.body.filter(x => x.t >= a && x.t < b).sort((x, y) => x.t - y.t);
  return {k, a, b, ws, prev, vol, pvol, time, prog, prs, groups, total, dow, bestWeek:Math.max(0, ...Object.values(weeks)), body};
}
function monthKeys() {
  const now = mKey(Date.now());
  const first = db.workouts.length ? Math.min(now, mKey(db.workouts.at(-1).start)) : now;
  return Array.from({length:now - first + 1}, (_, i) => first + i);
}
SH.month = s => {
  const keys = monthKeys(), k = s.k ?? keys.at(-1), M = monthData(k), cur = k === mKey(Date.now());
  const idx = keys.indexOf(k);
  const withBase = M.prog.filter(x => x.p !== null), up = withBase.filter(x => x.p > 0);
  const [v, u] = volParts(M.vol), vp = M.prev.length ? pct(M.vol, M.pvol) : null, cp = M.ws.length - M.prev.length;
  const head = !M.ws.length ? (cur ? 'Месяц только начинается' : 'В этом месяце тренировок не было')
    : !withBase.length ? 'Точка отсчёта'
    : withBase.every(x => x.fromStart) ? (up.length ? `Первый месяц: рост в ${up.length} из ${withBase.length} ${plural(withBase.length, 'упражнения', 'упражнений', 'упражнений')}` : 'Первый месяц — точка отсчёта')
    : up.length ? `Сильнее в ${up.length} из ${withBase.length} ${plural(withBase.length, 'упражнения', 'упражнений', 'упражнений')}`
    : 'Месяц на удержание формы';
  const sub = !M.ws.length ? (cur ? 'После первой тренировки здесь появится разбор.' : 'Бывает. Главное — вернуться.')
    : !withBase.length ? 'Первый месяц с этими упражнениями. В следующем будет с чем сравнить.'
    : up.length ? `Лучший рост — ${esc(up[0].e.name)}: ${sgn(up[0].p)}%${up[0].fromStart ? ' с первой тренировки' : ''}.`
    : 'Веса держатся на уровне. Попробуй добавить повтор или 2,5 кг в ключевых упражнениях.';
  const days = new Date(M.b - 1).getDate(), off = (new Date(M.a).getDay() + 6) % 7;
  const trained = new Set(M.ws.map(w => new Date(w.start).getDate()));
  const DOW = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
  const topDow = M.dow.indexOf(Math.max(...M.dow));
  const maxG = Math.max(1, ...Object.values(M.groups));
  const bodyD = M.body.length > 1 ? M.body.at(-1).v - M.body[0].v : null;
  // цели — из данных, а не общие слова
  const goals = [];
  if (M.ws.length) goals.push(`<b class="n">${M.ws.length + 1}</b> ${plural(M.ws.length + 1, 'тренировка', 'тренировки', 'тренировок')} — на одну больше, чем в ${MONTHS_PREP[k % 12]}`);
  for (const x of M.prog.filter(x => x.e.k === 'w' && x.st.w).slice(0, 2)) goals.push(`${esc(x.e.name)}: <b class="n">${f1(x.st.w + 2.5)} × ${x.st.r}</b> вместо <span class="n">${fSet(x.st, 'w')}</span>`);
  for (const x of withBase.filter(x => x.p <= 0).slice(0, 1)) goals.push(`${esc(x.e.name)}: вес стоит — добавь подход или +1 повтор`);
  const hrs = M.time / 3600e3;
  return `<div class="mhead"><button class="ib" data-a="mNav" data-v="-1" ${idx > 0 ? '' : 'style="visibility:hidden"'} aria-label="Предыдущий месяц">${ico('left')}</button>
    <div><span class="eyebrow">Итоги месяца</span><h3>${mName(k)} ${Math.floor(k / 12)}</h3></div>
    <button class="ib" data-a="mNav" data-v="1" ${idx < keys.length - 1 ? '' : 'style="visibility:hidden"'} aria-label="Следующий месяц">${ico('right')}</button></div>
  <div class="mhero"><h2>${head}</h2><p>${sub}</p></div>
  <div class="figs" style="margin-top:22px">
    <div><b class="n">${M.ws.length}</b><span>тренировок${M.prev.length ? ` <em class="${cp >= 0 ? 'up' : 'dn'}">${sgn(cp)}</em>` : ''}</span></div>
    <div><b class="n">${numU(v, u)}</b><span>тоннаж${vp !== null ? ` <em class="${vp >= 0 ? 'up' : 'dn'}">${sgn(vp)}%</em>` : ''}</span></div>
    <div><b class="n">${numU(hrs < 10 ? f1(hrs) : Math.round(hrs), 'ч')}</b><span>в зале</span></div>
  </div>
  ${M.prev.length ? `<p class="note" style="margin-top:10px">В сравнении с месяцем «${MONTHS_ACC[(k + 11) % 12]}»</p>` : ''}
  ${M.prog.length ? `<div class="sec"><h2>Прогресс в упражнениях</h2></div><div class="list">${M.prog.slice(0, 10).map(x => `<button class="mrow" data-a="exInfo" data-id="${x.id}">
      <div class="row"><span class="grow t ell">${esc(x.e.name)}</span>${x.p === null ? '<span class="tagn">новое</span>' : `<b class="n pc ${x.p > 0 ? 'acc' : 'mut'}">${sgn(x.p)}%</b>`}</div>
      <div class="s n">${x.bst ? fSet(x.bst, x.e.k) + '  →  ' : ''}${fSet(x.st, x.e.k)}</div>
      ${x.p !== null ? `<i class="mbar"><b style="width:${Math.min(100, Math.max(4, 50 + x.p * 2.5))}%"></b></i>` : ''}
    </button>`).join('')}</div>` : ''}
  ${M.prs.length ? `<div class="sec"><h2>Рекорды месяца</h2><span class="n acc" style="font-size:24px">${M.prs.length}</span></div><div class="list">${M.prs.slice(0, 8).map(p => `<div class="li" style="min-height:52px"><div class="grow"><div class="t ell">${esc(p.e.name)}</div><div class="s">${fDate(p.t)}</div></div><span class="v n">${fSet(p.st, p.e.k)}<span class="pr">PR</span></span></div>`).join('')}</div>` : ''}
  ${M.ws.length ? `<div class="sec"><h2>Регулярность</h2></div>
  <div class="mcal">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => `<span>${d}</span>`).join('')}${'<i></i>'.repeat(off)}${Array.from({length:days}, (_, i) => `<b class="n ${trained.has(i + 1) ? 'on' : ''}" data-a="day" data-t="${new Date(M.a).setDate(i + 1)}">${i + 1}</b>`).join('')}</div>
  <p class="note" style="margin-top:12px">Чаще всего — ${DOW[topDow]}. Лучшая неделя: ${M.bestWeek} ${plural(M.bestWeek, 'тренировка', 'тренировки', 'тренировок')}.</p>` : ''}
  ${M.total ? `<div class="sec"><h2>Нагрузка по группам</h2><span class="mut" style="font-size:14px">${M.total} ${plural(M.total, 'подход', 'подхода', 'подходов')}</span></div>
  ${GORDER.filter(g => M.groups[g]).sort((x, y) => M.groups[y] - M.groups[x]).map(g => `<div class="gbar"><span>${GROUPS[g]}</span><i class="mbar"><b style="width:${M.groups[g] / maxG * 100}%"></b></i><span class="n">${Math.round(M.groups[g] / M.total * 100)}%</span></div>`).join('')}` : ''}
  ${bodyD !== null ? `<div class="sec"><h2>Вес тела</h2></div><div class="row" style="align-items:baseline"><b class="n" style="font-size:30px">${f1(M.body[0].v)} → ${f1(M.body.at(-1).v)}</b><span class="mut">кг</span><span class="n" style="font-size:18px;margin-left:auto">${bodyD > 0 ? '+' : bodyD < 0 ? '−' : ''}${f1(Math.abs(bodyD))}</span></div>` : ''}
  ${goals.length ? `<div class="sec"><h2>${cur ? 'Чтобы закончить месяц сильно' : 'Цели на ' + MONTHS_ACC[(k + 1) % 12]}</h2></div><ol class="goals">${goals.map(g => `<li>${g}</li>`).join('')}</ol>` : ''}`;
};

SH.start = () => `<div class="shd"><h3>Новая тренировка</h3></div>
  <button class="btn" data-a="startEmpty">Начать с пустого листа</button>
  ${db.workouts[0] ? `<button class="btn sec2" data-a="repeat" data-id="${db.workouts[0].id}" style="margin-top:8px">Повторить «${esc(db.workouts[0].name)}»</button>` : ''}
  ${db.templates.length ? `<div class="lab2">Из шаблона</div><div class="list">${db.templates.map(t => `<button class="li" data-a="startTpl" data-id="${t.id}"><div class="grow" style="min-width:0"><div class="t ell">${esc(t.name || 'Без названия')}</div><div class="s ell">${t.ex.map(id => exById(id).name).join(', ') || 'пусто'}</div></div><span class="go">${ico('play')}</span></button>`).join('')}</div>` : ''}
  <button class="btn link" data-a="newTpl" style="margin-top:6px">Создать шаблон</button>
  <button class="btn link" data-a="backOpen" style="margin-top:0">Добавить прошедшую тренировку</button>`;

// видео девушки (Pexels/Mixkit) или два кадра фото, сменяющие друг друга
function media(e) {
  if (e.v) return `<div class="photo vid"><video src="vid/${e.v}.mp4" poster="vid/${e.v}.jpg" autoplay muted loop playsinline preload="auto" onloadedmetadata="this.parentNode.classList.toggle('tall', this.videoHeight > this.videoWidth)"></video></div>`;
  if (e.p) return `<div class="photo"><img src="img/${e.p}_0.jpg" alt=""><img src="img/${e.p}_1.jpg" alt=""></div>`;
  return '';
}
SH.ex = s => {
  const e = exById(s.id), k = e.k, ses = exSessions(e.id);
  const mode = s.mode || (k === 'w' ? 'e1' : 'reps');
  const pts = ses.map(x => ({t:x.t, v:mode === 'e1' ? x.best : mode === 'w' ? x.maxW : mode === 'vol' ? x.vol : x.reps}));
  const best = ses.reduce((a, x) => Math.max(a, x.maxW), 0), b1 = ses.reduce((a, x) => Math.max(a, k === 'w' ? x.best : 0), 0);
  const maxR = ses.reduce((a, x) => Math.max(a, x.reps), 0);
  const tabs = k === 'w' ? [['e1', 'Разовый макс.'], ['w', 'Рабочий вес'], ['vol', 'Объём']] : [['reps', k === 't' ? 'Время' : 'Повторы'], ['w', 'Доп. вес']];
  const fig = (v, u, l) => `<div><b class="n">${v === '—' ? v : numU(v, u)}</b><span>${l}</span></div>`;
  const custom = e.id.startsWith('c_');
  const yt = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(e.name + ' техника выполнения');
  return `${media(e)}
  <div class="shd"><div><h3>${esc(e.name)}</h3><p>${GROUPS[e.g]}${custom ? ' · своё упражнение' : ''}</p></div></div>
  ${e.cue ? `<p class="cue">${esc(e.cue)}</p>` : ''}
  <div class="exacts"><button class="chipb ${isMine(e.id) ? 'on' : ''}" data-a="toggleMine" data-id="${e.id}">${isMine(e.id) ? ico('check') + 'В моих' : ico('plus') + 'Добавить в мои'}</button><a class="chipb" href="${yt}" target="_blank" rel="noopener">${ico('play')}Видео с техникой</a></div>
  <div class="figs" style="margin-top:22px">
    ${k === 'w' ? fig(best ? f1(best) : '—', 'кг', 'рабочий рекорд') + fig(b1 ? f1(b1) : '—', 'кг', 'разовый макс.') : k === 't' ? fig(maxR || '—', 'с', 'лучшее время') + fig(best ? '+' + f1(best) : '—', 'кг', 'доп. вес') : fig(maxR || '—', '', 'макс. повторов') + fig(best ? '+' + f1(best) : '—', 'кг', 'доп. вес')}
    ${fig(ses.length, '', plural(ses.length, 'тренировка', 'тренировки', 'тренировок'))}
  </div>
  <div class="seg">${tabs.map(([v, l]) => `<button class="${mode === v ? 'on' : ''}" data-a="exMode" data-v="${v}">${l}</button>`).join('')}</div>
  ${chart(pts, mode === 'reps' ? '' : '')}
  ${db.active && !db.active.items.some(i => i.ex === e.id) ? `<button class="btn" data-a="addOne" data-id="${e.id}" style="margin-top:18px">Добавить в тренировку</button>` : ''}
  ${ses.length ? `<div class="sec" style="margin-top:30px"><h2>Все подходы</h2></div><div class="list">${[...ses].reverse().slice(0, 30).map(x => `<button class="li" data-a="woInfo" data-id="${x.wid}" style="align-items:flex-start"><div class="grow"><div class="t">${fDate(x.t, {day:'numeric', month:'long', year:'numeric'})}</div><div class="s n" style="font-size:16px;margin-top:3px;color:var(--tx)">${x.sets.filter(st => !st.wu).map(st => fSet(st, k) + (st.pr ? '<span class="pr">PR</span>' : '')).join('<span class="mut">  ·  </span>')}</div></div></button>`).join('')}</div>` : ''}
  ${custom ? `<button class="btn del" data-a="delEx" data-id="${e.id}" style="margin-top:14px">Удалить упражнение</button>` : ''}`;
};

SH.tplStart = s => {
  const t = db.templates.find(x => x.id === s.id); if (!t) return '';
  const last = db.workouts.find(w => w.tpl === t.id);
  return `<div class="shd"><div><h3>${esc(t.name)}</h3><p>Что делаешь сегодня?${last ? ' Отмечено то, что было в прошлый раз.' : ''}</p></div><button class="btn sm sec2" data-a="tsAll">${s.sel.length === t.ex.length ? 'Снять все' : 'Все'}</button></div>
  ${t.ex.map(id => { const e = exById(id), l = lastSession(id); const b = l && workSets(l).reduce((x, st) => score(st, e.k) > score(x, e.k) ? st : x, workSets(l)[0]);
    return `<button class="pick ${s.sel.includes(id) ? 'on' : ''}" data-a="tsT" data-id="${id}"><div class="grow"><div style="font-size:16.5px;font-weight:500">${esc(e.name)}</div><div class="mut" style="font-size:13.5px">${b ? 'В прошлый раз <span class="n" style="font-size:15px">' + fSet(b, e.k) + '</span>' : GROUPS[e.g]}</div></div><span class="cb">${ico('check')}</span></button>`; }).join('')}
  <div class="stick"><button class="btn" data-a="tsGo" ${s.sel.length ? '' : 'disabled'}>${s.sel.length ? `Начать · ${s.sel.length} ${plural(s.sel.length, 'упражнение', 'упражнения', 'упражнений')}` : 'Отметь упражнения'}</button></div>`;
};
SH.day = s => {
  const ws = db.workouts.filter(w => dayStart(w.start).getTime() === s.d);
  return `<div class="shd"><div><h3>${cap(fDate(s.d, {weekday:'long', day:'numeric', month:'long'}))}</h3><p>${ws.length ? ws.length + ' ' + plural(ws.length, 'тренировка', 'тренировки', 'тренировок') : 'Тренировок не было'}</p></div></div>
  ${ws.length ? `<div class="list">${ws.map(w => `<button class="li" data-a="woInfo" data-id="${w.id}"><div class="grow"><div class="t ell">${esc(w.name)}</div><div class="s">${new Date(w.start).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})} · ${fDur(w.end - w.start)} · ${volParts(woVol(w)).join(' ')}</div></div>${ico('right', 'chev')}</button>`).join('')}</div>` : ''}
  <div class="sec" style="margin-top:${ws.length ? 30 : 4}px"><h2>Добавить тренировку за этот день</h2></div>
  <div class="backrow"><label><span class="lab3">Начало</span><input id="daytime" class="field n" type="time" value="${s.time}"></label>
    <div><span class="lab3">Длилась</span><div class="opts" style="padding:0">${[30, 45, 60, 75, 90, 120].map(v => `<button class="${s.dur === v ? 'on' : ''}" data-a="dayDur" data-v="${v}">${v % 60 ? v + ' мин' : v / 60 + ' ч'}</button>`).join('')}</div></div></div>
  <div class="list" style="margin-top:16px">${db.templates.filter(t => t.ex.length).map(t => `<button class="li" data-a="backTpl" data-id="${t.id}"><div class="grow"><div class="t ell">${esc(t.name || 'Без названия')}</div><div class="s">${t.ex.length} ${plural(t.ex.length, 'упражнение', 'упражнения', 'упражнений')}</div></div><span class="go">${ico('plus')}</span></button>`).join('')}
  <button class="li" data-a="backEmpty"><div class="grow t">Пустая — выберу упражнения сама</div><span class="go">${ico('plus')}</span></button></div>
  <p class="note" style="margin-top:12px">Просто впиши вес и повторы — галочки не нужны, заполненные подходы сохранятся.</p>`;
};
const isoDay = t => { const d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }; // местная дата, не UTC
SH.backDate = () => `<div class="shd"><div><h3>Тренировка задним числом</h3><p>Выбери день, когда она была</p></div></div>
  <input id="backdate" class="field" type="date" max="${isoDay(Date.now())}" value="${isoDay(Date.now() - 864e5)}">
  <button class="btn" data-a="backPick" style="margin-top:6px">Дальше</button>`;
SH.wo = s => {
  const w = db.workouts.find(x => x.id === s.id); if (!w) return '<p class="empty">Тренировка удалена</p>';
  const [v, u] = volParts(woVol(w));
  return `<div class="shd"><div><h3>${esc(w.name)}</h3><p>${cap(fDate(w.start, {weekday:'long', day:'numeric', month:'long'}))}, ${new Date(w.start).toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'})}</p></div></div>
  <div class="figs" style="margin-top:0;border:0;padding:0"><div><b class="n">${numU(Math.max(1, Math.round((w.end - w.start) / 60000)), 'мин')}</b><span>время</span></div><div><b class="n">${numU(v, u)}</b><span>тоннаж</span></div><div><b class="n">${woPRs(w)}</b><span>рекордов</span></div></div>
  ${w.items.map(it => { const e = exById(it.ex); let n = 0; return `<section class="wex"><button class="row" data-a="exInfo" data-id="${e.id}" style="width:100%;margin-bottom:6px"><h3 class="grow" style="font-size:17px;font-weight:600">${esc(e.name)}</h3>${ico('right', 'chev mut')}</button>
    ${it.sets.map(st => `<div class="row" style="height:34px;border-top:1px solid var(--line)"><span class="n" style="width:22px;color:${st.wu ? 'var(--acc)' : 'var(--mut)'}">${st.wu ? 'Р' : ++n}</span><span class="grow n" style="font-size:18px">${fSet(st, e.k)}${st.pr ? '<span class="pr">PR</span>' : ''}</span>${e.k === 'w' && !st.wu && st.r > 1 ? `<span class="mut" style="font-size:13px">макс. ≈ <span class="n" style="font-size:15px">${f1(e1(st.w, st.r))}</span></span>` : ''}</div>`).join('')}</section>`; }).join('')}
  <div class="acts h" style="margin-top:28px"><button class="btn sec2" data-a="repeat" data-id="${w.id}">Повторить</button><button class="btn sec2" data-a="editWo" data-id="${w.id}">Изменить</button></div>
  <div class="acts" style="margin-top:6px"><button class="btn link" data-a="saveTpl" data-id="${w.id}">Сохранить как шаблон</button><button class="btn del" data-a="delWo" data-id="${w.id}">Удалить тренировку</button></div>`;
};

SH.pick = s => `<div class="shd"><h3>${s.mode === 'tpl' ? 'Упражнения шаблона' : 'Добавить упражнения'}</h3><button class="ib" data-a="newEx" aria-label="Своё упражнение" style="margin:-6px -8px 0 0">${ico('plus')}</button></div>
  <label class="search">${ico('search')}<input id="pq" type="search" placeholder="Найти упражнение" value="${esc(s.q || '')}" autocomplete="off"></label>
  ${filters(s.g || 'mine', 'pgrp')}
  <div id="plist">${pickList(s)}</div>
  <div class="stick"><button class="btn" data-a="pickDone" ${s.sel.length ? '' : 'disabled'}>${pickLabel(s)}</button></div>`;
const pickLabel = s => s.sel.length ? `Добавить ${s.sel.length} ${plural(s.sel.length, 'упражнение', 'упражнения', 'упражнений')}` : 'Выбери упражнения';
function pickList(s) {
  const secs = exSections(s.q || '', s.g || 'mine');
  const row = e => `<button class="pick ${s.sel.includes(e.id) ? 'on' : ''}" data-a="pickT" data-id="${e.id}"><div class="grow"><div style="font-size:16.5px;font-weight:500">${esc(e.name)}</div><div class="mut" style="font-size:13.5px">${GROUPS[e.g]}</div></div><span class="cb">${ico('check')}</span></button>`;
  return secs.map(([h, l]) => (h ? `<div class="grp${h === 'Мои упражнения' ? ' mine' : ''}">${h}</div>` : '') + l.map(row).join('')).join('') || '<p class="empty">Ничего не нашлось</p>';
}

SH.sum = s => {
  const w = db.workouts.find(x => x.id === s.id); if (!w) return '';
  const prs = []; w.items.forEach(it => it.sets.forEach(st => st.pr && prs.push({e:exById(it.ex), st})));
  const [v, u] = volParts(woVol(w));
  // сравнение с прошлым разом: та же тренировка (шаблон или название) и каждое упражнение отдельно
  const prev = db.workouts.find(x => x.start < w.start && (w.tpl ? x.tpl === w.tpl : x.name === w.name));
  const same = prev && prev.items.length === w.items.length && w.items.every(it => prev.items.some(i => i.ex === it.ex));
  const dv = same ? pct(woVol(w), woVol(prev)) : null;
  let better = 0, cmp = 0;
  for (const it of w.items) {
    const e = exById(it.ex), before = db.workouts.find(x => x.start < w.start && x.items.some(i => i.ex === it.ex)); if (!before) continue;
    const best = arr => Math.max(0, ...workSets(arr).map(st => score(st, e.k)));
    cmp++; if (best(it) > best(before.items.find(i => i.ex === it.ex))) better++;
  }
  const wk = db.workouts.filter(x => x.start >= weekStart(w.start)).length, goal = db.settings.goal;
  const head = db.workouts.length === 1 ? 'Первая тренировка в дневнике' : prs.length ? `${prs.length} ${plural(prs.length, 'новый рекорд', 'новых рекорда', 'новых рекордов')}` : better ? `Сильнее в ${better} из ${cmp} ${plural(cmp, 'упражнения', 'упражнений', 'упражнений')}` : dv > 0 ? 'Больше, чем в прошлый раз' : cmp ? 'Держишь уровень' : 'Тренировка засчитана';
  return `<div class="sum"><p class="mut" style="font-size:15px">Сохранено · ${db.workouts.length}-я тренировка</p>
    <h2 class="sumh">${head}</h2>
    <div class="big n" style="margin-top:18px">${v}<small>${u}</small></div><p class="mut" style="font-size:14px">тоннаж${dv > 0 ? ` · <span class="acc">${sgn(dv)}%</span> к прошлому разу` : ''}</p></div>
  <div class="figs"><div><b class="n">${numU(Math.max(1, Math.round((w.end - w.start) / 60000)), 'мин')}</b><span>время</span></div><div><b class="n">${woSets(w)}</b><span>подходов</span></div><div><b class="n">${wk}/${goal}</b><span>${wk >= goal ? 'цель недели ✓' : 'цель недели'}</span></div></div>
  <p class="note" style="margin-top:12px">${wk >= goal ? 'Цель недели выполнена. Всё, что дальше, — сверх плана.' : `Ещё ${goal - wk} ${plural(goal - wk, 'тренировка', 'тренировки', 'тренировок')} — и неделя закрыта.`}</p>
  ${prs.length ? `<div class="sec" style="margin-top:30px"><h2>Новые рекорды</h2></div><div class="list">${prs.map(p => `<div class="li"><div class="grow t ell">${esc(p.e.name)}</div><span class="v n">${fSet(p.st, p.e.k)}<span class="pr">PR</span></span></div>`).join('')}</div>` : ''}
  <div class="acts"><button class="btn" data-a="close">Готово</button>${w.tpl ? '' : `<button class="btn link" data-a="saveTpl" data-id="${w.id}">Сохранить как шаблон</button>`}</div>`;
};

SH.text = s => `<div class="shd"><h3>${esc(s.title)}</h3></div>
  <input class="field ${s.numeric ? 'n' : ''}" id="tx" value="${esc(s.value ?? '')}" placeholder="${esc(s.ph || '')}" ${s.numeric ? 'inputmode="decimal" style="font-size:24px"' : ''} maxlength="40" enterkeyhint="done">
  <button class="btn" data-a="textOk" style="margin-top:6px">Сохранить</button>`;

SH.tpl = s => {
  const t = db.templates.find(x => x.id === s.id); if (!t) return '';
  return `<input class="namein" id="tplname" value="${esc(t.name)}" placeholder="Название шаблона" maxlength="40" style="margin:6px 0 18px">
  <div class="list">${t.ex.map((id, i) => `<div class="li" style="min-height:52px"><div class="grow t ell">${esc(exById(id).name)}</div><button class="ib" data-a="tplMv" data-i="${i}" aria-label="Выше" ${i ? '' : 'style="visibility:hidden"'}>${ico('up')}</button><button class="ib" data-a="tplRm" data-i="${i}" aria-label="Убрать" style="margin-right:-8px">${ico('x')}</button></div>`).join('') || '<p class="empty">В шаблоне пока нет упражнений.</p>'}</div>
  <button class="btn link" data-a="tplAdd" style="margin-top:6px">+ Добавить упражнения</button>
  <div class="acts"><button class="btn" data-a="startTpl" data-id="${t.id}" ${t.ex.length ? '' : 'disabled'}>Начать тренировку</button><button class="btn del" data-a="tplDel">Удалить шаблон</button></div>`;
};

SH.menu = s => `<div class="menu">${s.items.map(([a, icon, label, red]) => `<button data-a="${a}" class="${red ? 'red' : ''}">${ico(icon)}${label}</button>`).join('')}</div>`;

SH.newEx = s => `<div class="shd"><h3>Своё упражнение</h3></div>
  <input class="field" id="nxname" placeholder="Например, тяга в гравитроне" value="${esc(s.name || '')}" maxlength="40">
  <div class="lab2">Группа мышц</div><div class="filters" style="flex-wrap:wrap;margin:0;padding:0">${Object.keys(GROUPS).map(g => `<button class="${s.g === g ? 'on' : ''}" data-a="nxG" data-v="${g}">${GROUPS[g]}</button>`).join('')}</div>
  <div class="lab2">Что записывать</div><div class="seg" style="margin-top:0">${[['w', 'Вес и повторы'], ['bw', 'Свой вес'], ['t', 'Время']].map(([v, l]) => `<button class="${s.k === v ? 'on' : ''}" data-a="nxK" data-v="${v}">${l}</button>`).join('')}</div>
  <button class="btn" data-a="nxSave" style="margin-top:22px">Создать упражнение</button>`;

SH.plates = s => {
  const bar = s.bar ?? 20, t = num(s.v) || 0, per = Math.max(0, (t - bar) / 2), P = [[25, '#D93A2B'], [20, '#2F54EB'], [15, '#E8B21E'], [10, '#0F8A5F'], [5, '#C9CCD2'], [2.5, '#4B4F57'], [1.25, '#9AA0A8']];
  let rest = per; const used = [];
  for (const [p, c] of P) while (rest >= p - 1e-9) { used.push([p, c]); rest -= p; }
  return `<div class="shd"><div><h3>Калькулятор блинов</h3><p>Сколько вешать на каждую сторону грифа</p></div></div>
  <input class="field n" id="plv" inputmode="decimal" placeholder="Вес на штанге, кг" value="${esc(s.v || '')}" style="font-size:26px;text-align:center;height:60px">
  <div class="seg">${[20, 15, 10, 0].map(b => `<button class="${bar === b ? 'on' : ''}" data-a="plBar" data-v="${b}">${b ? 'Гриф ' + b : 'Без грифа'}</button>`).join('')}</div>
  <div id="plout">${t ? `<div class="plates"><div class="bar"></div><div class="col"></div>${used.map(([p, c]) => `<div class="pl n" style="background:${c};height:${46 + p * 4}px;width:${p >= 10 ? 22 : 16}px;${p === 5 ? 'color:#0F1013' : ''}">${String(p).replace('.', ',')}</div>`).join('')}</div>
    <p style="text-align:center;font-size:16px">${used.length ? 'На сторону: <span class="n" style="font-size:19px">' + used.map(u => String(u[0]).replace('.', ',')).join(' + ') + '</span>' : 'Только гриф'}</p>
    ${rest > 1e-9 ? `<p class="note" style="text-align:center;margin-top:4px">Точно не собрать — ближайший вес ${f1(t - rest * 2)} кг</p>` : ''}` : '<p class="ce">Введи вес — покажу раскладку</p>'}</div>`;
};
SH.orm = s => {
  const w = num(s.w), r = num(s.r), one = w && r ? e1(w, Math.round(r)) : 0;
  return `<div class="shd"><div><h3>Разовый максимум</h3><p>Сколько ты подняла бы на 1 повтор (формула Эпли)</p></div></div>
  <div class="row" style="gap:10px"><input class="field n" id="ormw" inputmode="decimal" placeholder="Вес, кг" value="${esc(s.w || '')}" style="font-size:22px"><input class="field n" id="ormr" inputmode="numeric" placeholder="Повторы" value="${esc(s.r || '')}" style="font-size:22px"></div>
  <div id="ormout">${one ? `<div class="sum"><div class="big n">${f1(one)}<small>кг</small></div></div>
  <div class="list" style="margin-top:16px">${[[95, 2], [90, 4], [85, 6], [80, 8], [75, 10], [70, 12], [60, 15]].map(([p, n]) => `<div class="row" style="height:44px;border-bottom:1px solid var(--line)"><span class="mut" style="width:52px">${p}%</span><b class="grow n" style="font-size:20px">${f1(Math.round(one * p / 100 / 2.5) * 2.5)}</b><span class="mut" style="font-size:14px">≈ ${n} ${plural(n, 'повтор', 'повтора', 'повторов')}</span></div>`).join('')}</div>` : ''}</div>`;
};

function renderSheets() {
  const keep = [...document.querySelectorAll('#sheets .sheet')].map(el => el.scrollTop);
  $('#sheets').innerHTML = ui.sheets.map((s, i) => `<div class="sw ${s._new ? 'in' : ''}" style="z-index:${100 + i}"><div class="scrim" data-a="close"></div><div class="sheet ${s.full ? 'full' : ''}" role="dialog" aria-modal="true"><div class="grab">${s.full ? `<button class="shx" data-a="close" aria-label="Закрыть">${ico('x')}</button>` : ''}</div>${SH[s.t](s)}</div></div>`).join('');
  document.querySelectorAll('#sheets .sheet').forEach((el, i) => { if (keep[i] && !ui.sheets[i]._new) el.scrollTop = keep[i]; });
  ui.sheets.forEach(s => delete s._new);
}
function openSheet(s) { s._new = true; ui.sheets.push(s); renderSheets(); }
const topS = () => ui.sheets.at(-1);
function closeSheet(n = 1) {
  const all = document.querySelectorAll('#sheets .sw');
  for (let i = 0; i < n && all[all.length - 1 - i]; i++) all[all.length - 1 - i].classList.add('out');
  return new Promise(r => setTimeout(() => { ui.sheets.splice(-n); renderSheets(); r(); }, 210));
}
const refreshTop = () => renderSheets();

// свайп шторки вниз
let drag = null;
document.addEventListener('touchstart', e => {
  const sh = e.target.closest('.sheet'); if (!sh || sh.scrollTop > 0 || e.target.closest('input,.filters')) return;
  drag = {sh, y:e.touches[0].clientY, dy:0};
}, {passive:true});
document.addEventListener('touchmove', e => {
  if (!drag) return; drag.dy = e.touches[0].clientY - drag.y;
  if (drag.dy > 0 && drag.sh.scrollTop <= 0) { drag.sh.style.transition = 'none'; drag.sh.style.transform = `translateY(${drag.dy}px)`; }
}, {passive:true});
document.addEventListener('touchend', () => {
  if (!drag) return; const {sh, dy} = drag; drag = null;
  sh.style.transition = 'transform .25s';
  if (dy > 110) { sh.style.transform = 'translateY(100%)'; setTimeout(() => { ui.sheets.pop(); renderSheets(); }, 200); }
  else sh.style.transform = '';
});

// лёгкий отклик: Android — vibrate, iPhone (iOS 18+) — переключатель-switch даёт системный тактильный щелчок
const hapticEl = (() => { const l = document.createElement('label'); l.setAttribute('aria-hidden', 'true'); l.style.cssText = 'position:fixed;left:-99px;top:0;opacity:0;pointer-events:none'; l.innerHTML = '<input type="checkbox" switch tabindex="-1">'; document.body.appendChild(l); return l; })();
function haptic() { try { if (!(navigator.vibrate && navigator.vibrate(12))) hapticEl.click(); } catch {} }
let toastT;
function toast(html) { const t = $('#toast'); t.innerHTML = html; t.className = 'on'; clearTimeout(toastT); toastT = setTimeout(() => t.className = '', 2600); }

// ---------- главный рендер
function renderTabs() {
  const t = [['home', 'home', 'Сегодня'], ['hist', 'cal', 'История'], ['ex', 'dumb', 'Упражнения'], ['me', 'user', 'Профиль']];
  $('#tabs').innerHTML = t.map(x => `<button class="${ui.tab === x[0] ? 'on' : ''}" data-a="tab" data-v="${x[0]}" aria-current="${ui.tab === x[0] ? 'page' : 'false'}">${ico(x[1])}${x[2]}</button>`).join('');
  const m = $('#mini'), a = db.active;
  m.classList.toggle('on', !!a && !ui.woOpen);
  m.innerHTML = a && !ui.woOpen ? `<span class="dot"></span><button class="grow ell" data-a="openWo" style="text-align:left"><b>${esc(a.name)}</b></button>${a.wid ? '' : `<span class="n" data-clock>${fClock(Date.now() - a.start)}</span>`}<button class="btn sm" data-a="openWo">Открыть</button>` : '';
}
function applyTheme() {
  const th = db.settings.theme || 'auto', r = document.documentElement;
  if (th === 'auto') r.removeAttribute('data-theme'); else r.dataset.theme = th;
  const bg = (THEMES.find(t => t[0] === th) || THEMES[0])[2];
  document.querySelectorAll('meta[name=theme-color]').forEach((m, i) => m.content = th === 'auto' ? (i ? '#0B0C0E' : '#FFFFFF') : bg);
}
function render() {
  applyTheme();
  $('#main').innerHTML = {home:vHome, hist:vHist, ex:vEx, me:vMe}[ui.tab]();
  renderTabs(); renderWo(); renderSheets(); tick();
  $('#main').style.paddingBottom = `calc(var(--sb) + ${db.active && !ui.woOpen ? 170 : 110}px)`;
}

// ---------- действия
const A = {};
A.month = el => { const k = el.dataset.k ? +el.dataset.k : undefined; openSheet({t:'month', k, full:true}); if (k !== undefined && k < mKey(Date.now())) { db.settings.seenReport = k; save(); setTimeout(() => { const st = $('#main').scrollTop; $('#main').innerHTML = {home:vHome, hist:vHist, ex:vEx, me:vMe}[ui.tab](); $('#main').scrollTop = st; }, 300); } };
A.mNav = el => { const s = topS(), keys = monthKeys(), i = keys.indexOf(s.k ?? keys.at(-1)) + +el.dataset.v; if (keys[i] === undefined) return; s.k = keys[i]; renderSheets(); document.querySelector('#sheets .sw:last-child .sheet').scrollTop = 0; };
A.tab = el => { if (ui.tab === el.dataset.v) { $('#main').scrollTo({top:0, behavior:'smooth'}); return; } ui.tab = el.dataset.v; $('#main').scrollTop = 0; render(); };
A.close = () => closeSheet();
A.hideProblem = () => { loadProblem = ''; render(); };
A.hideHint = () => { db.settings.hint = false; save(); render(); };
A.startMenu = () => openSheet({t:'start'});
A.startEmpty = () => startWo([], '');
A.backOpen = () => closeSheet().then(() => openSheet({t:'backDate'}));
A.day = el => {
  const t = +el.dataset.t, today = dayStart(Date.now()).getTime();
  if (t > today) return toast('Этот день ещё впереди');
  const ws = db.workouts.filter(w => dayStart(w.start).getTime() === t);
  if (ws.length === 1 && t < today) return openSheet({t:'wo', id:ws[0].id, full:true});
  openSheet({t:'day', d:t, time:'18:00', dur:60, full:ws.length > 0});
};
A.dayDur = el => { const s = topS(); s.time = $('#daytime').value || s.time; s.dur = +el.dataset.v; refreshTop(); };
const backRange = s => { const [h, m] = (($('#daytime') && $('#daytime').value) || s.time).split(':').map(Number); const st = new Date(s.d); st.setHours(h || 0, m || 0, 0, 0); return {start:st.getTime(), end:st.getTime() + s.dur * 60000}; };
A.backTpl = el => {
  const s = topS(), t = db.templates.find(x => x.id === el.dataset.id), back = backRange(s);
  if (!t || !t.ex.length) return;
  if (t.ex.length <= 5) return startWo(t.ex, t.name, t.id, back);
  const last = db.workouts.find(w => w.tpl === t.id);
  openSheet({t:'tplStart', id:t.id, sel:last ? t.ex.filter(id => last.items.some(i => i.ex === id)) : [], full:true, back});
};
A.backEmpty = () => startWo([], '', null, backRange(topS()));
A.backPick = () => { const v = $('#backdate').value; if (!v) return toast('Выбери дату'); const [y, m, d] = v.split('-').map(Number); const t = new Date(y, m - 1, d).getTime(); if (t > Date.now()) return toast('Этот день ещё впереди'); closeSheet().then(() => openSheet({t:'day', d:t, time:'18:00', dur:60})); };
A.startTpl = el => {
  const t = db.templates.find(x => x.id === el.dataset.id); if (!t || !t.ex.length) return;
  if (t.ex.length <= 5) return startWo(t.ex, t.name, t.id);
  // длинный шаблон = пул упражнений: спрашиваем, что сегодня; отмечено то, что делала в прошлый раз
  const last = db.workouts.find(w => w.tpl === t.id);
  const sel = last ? t.ex.filter(id => last.items.some(i => i.ex === id)) : [];
  openSheet({t:'tplStart', id:t.id, sel, full:true});
};
A.tsT = el => { const s = topS(), id = el.dataset.id, i = s.sel.indexOf(id); i < 0 ? s.sel.push(id) : s.sel.splice(i, 1); refreshTop(); };
A.tsAll = () => { const s = topS(), t = db.templates.find(x => x.id === s.id); s.sel = s.sel.length === t.ex.length ? [] : [...t.ex]; refreshTop(); };
A.tsGo = () => { const s = topS(), t = db.templates.find(x => x.id === s.id); startWo(t.ex.filter(id => s.sel.includes(id)), t.name, t.id, s.back); };
A.repeat = el => { const w = db.workouts.find(x => x.id === el.dataset.id); if (w) startWo(w.items.map(i => i.ex), w.name, w.tpl); };
A.openWo = () => { ui.woOpen = true; ui.sheets = []; render(); wake(); };
A.minWo = () => { ui.woOpen = false; render(); };
A.grp = el => { ui.grp = el.dataset.v; render(); };
A.exInfo = el => openSheet({t:'ex', id:el.dataset.id, full:true});
A.exMode = el => { topS().mode = el.dataset.v; refreshTop(); };
A.woInfo = el => openSheet({t:'wo', id:el.dataset.id, full:true});
A.addEx = () => openSheet({t:'pick', mode:'wo', sel:[], full:true});
A.addOne = el => { db.active.items.push({ex:el.dataset.id, sets:newSets(el.dataset.id)}); save(); ui.sheets = []; ui.woOpen = true; render(); toast('Упражнение добавлено'); };
A.pickT = el => { const s = topS(), id = el.dataset.id, i = s.sel.indexOf(id); i < 0 ? s.sel.push(id) : s.sel.splice(i, 1); el.classList.toggle('on'); const b = document.querySelector('#sheets .sw:last-child [data-a="pickDone"]'); b.disabled = !s.sel.length; b.textContent = pickLabel(s); };
A.pgrp = el => { topS().g = el.dataset.v; refreshTop(); };
A.pickDone = () => {
  const s = topS(); if (!s.sel.length) return;
  if (s.mode === 'tpl') { const t = db.templates.find(x => x.id === s.tpl); t.ex.push(...s.sel.filter(id => !t.ex.includes(id))); save(); closeSheet().then(refreshTop); render(); return; }
  s.sel.forEach(id => db.active.items.push({ex:id, sets:newSets(id)})); save();
  closeSheet().then(() => { renderWo(); const b = $('#wobody'); b.scrollTo({top:b.scrollHeight, behavior:'smooth'}); });
};
A.setType = el => { const s = db.active.items[el.dataset.e].sets[el.dataset.s]; s.wu = !s.wu; if (s.wu) s.pr = false; save(); renderWo(); };
A.usePrev = el => { const it = db.active.items[el.dataset.e], s = it.sets[el.dataset.s], p = prevSet(it.ex, +el.dataset.s); if (!p) return; s.w = p.w || null; s.r = p.r; save(); renderWo(); };
A.addSet = el => { const it = db.active.items[el.dataset.e], l = it.sets.at(-1); it.sets.push({w:l?.w ?? null, r:l?.r ?? null, d:false}); save(); renderWo(); };
A.delSet = el => { const it = db.active.items[el.dataset.e]; if (it.sets.length > 1) { it.sets.pop(); save(); renderWo(); woStatUpdate(); } };
A.check = el => {
  unlockAudio();
  const ei = +el.dataset.e, si = +el.dataset.s, it = db.active.items[ei], s = it.sets[si], e = exById(it.ex);
  if (s.d) { s.d = false; s.pr = false; save(); renderWo(); return; }
  const ph = placeholder(it, si);
  if (s.w == null && e.k !== 't') s.w = ph?.w ?? (e.k === 'bw' ? 0 : null);
  if (s.r == null) s.r = ph?.r ?? null;
  if (!s.r) { toast(e.k === 't' ? 'Впиши время в секундах' : 'Впиши количество повторов'); return; }
  if (e.k === 'w' && !s.w) { toast('Впиши вес'); return; }
  s.d = true; haptic();
  if (!s.wu && !db.active.wid) {
    const prev = bestScore(it.ex, db.active.wid), cur = Math.max(...it.sets.filter((x, i) => x.d && !x.wu && i !== si).map(x => score(x, e.k)), 0);
    if (prev > 0 && score(s, e.k) > Math.max(prev, cur)) { it.sets.forEach(x => x.pr = false); s.pr = true; toast(`<span class="pr">PR</span>${esc(e.name)} — <span class="n">${fSet(s, e.k)}</span>`); }
  }
  save(); renderWo(); woStatUpdate();
  if (!db.active.wid && db.settings.rest) startRest(s.wu ? Math.min(60, db.settings.rest) : db.settings.rest);
};
A.restStart = () => { unlockAudio(); startRest(db.settings.rest || 90); };
A.restAdd = el => { const a = db.active; a.restEnd = Math.max(Date.now() + 1000, a.restEnd + el.dataset.v * 1000); a.restTot = Math.max(a.restTot, (a.restEnd - Date.now()) / 1000); save(); tick(); };
A.restSkip = () => { db.active.restEnd = 0; save(); tick(); };
A.exMenu = el => { ui.menuE = +el.dataset.e; openSheet({t:'menu', items:[['menuInfo', 'info', 'Техника и прогресс'], ['menuUp', 'up', 'Переместить выше'], ['menuDown', 'down', 'Переместить ниже'], ['menuDel', 'trash', 'Убрать из тренировки', 1]]}); };
A.menuInfo = () => { const id = db.active.items[ui.menuE].ex; closeSheet().then(() => openSheet({t:'ex', id, full:true})); };
const mv = d => { const it = db.active.items, i = ui.menuE, j = i + d; if (j < 0 || j >= it.length) return closeSheet(); [it[i], it[j]] = [it[j], it[i]]; save(); closeSheet().then(renderWo); };
A.menuUp = () => mv(-1); A.menuDown = () => mv(1);
A.menuDel = () => { const it = db.active.items[ui.menuE]; if (it.sets.some(s => s.d) && !confirm('У упражнения есть отмеченные подходы. Убрать его?')) return; db.active.items.splice(ui.menuE, 1); save(); closeSheet().then(() => { renderWo(); woStatUpdate(); }); };
A.finish = () => finish();
A.cancelWo = () => { if (!confirm(db.active.wid ? 'Отменить изменения?' : 'Удалить тренировку? Отмеченные подходы не сохранятся.')) return; db.active = null; ui.woOpen = false; save(); releaseWake(); render(); };
A.editWo = el => {
  if (db.active) { toast('Сначала заверши текущую тренировку'); return; }
  const w = db.workouts.find(x => x.id === el.dataset.id);
  db.active = {wid:w.id, start:w.start, end:w.end, name:w.name, tpl:w.tpl, items:w.items.map(it => ({ex:it.ex, sets:it.sets.map(s => ({...s, d:true}))})), restEnd:0, restTot:0};
  ui.sheets = []; ui.woOpen = true; save(); render();
};
A.delWo = el => { if (!confirm('Удалить тренировку? Это нельзя отменить.')) return; db.workouts = db.workouts.filter(w => w.id !== el.dataset.id); recomputePR(); save(); closeSheet().then(render); toast('Тренировка удалена'); };
A.saveTpl = el => { const w = db.workouts.find(x => x.id === el.dataset.id); openSheet({t:'text', title:'Название шаблона', value:w.name, ok:v => { const t = {id:uid(), name:v || w.name, ex:w.items.map(i => i.ex)}; db.templates.push(t); w.tpl = t.id; save(); render(); toast('Шаблон сохранён'); }}); };
A.textOk = () => { const s = topS(), v = $('#tx').value.trim(); closeSheet().then(() => s.ok(v)); };
A.newTpl = () => { const t = {id:uid(), name:'', ex:[]}; db.templates.push(t); save(); render(); openSheet({t:'tpl', id:t.id, full:true, isNew:true}); };
A.tplEdit = el => openSheet({t:'tpl', id:el.dataset.id, full:true});
const curTpl = () => db.templates.find(x => x.id === topS().id);
A.tplAdd = () => openSheet({t:'pick', mode:'tpl', tpl:topS().id, sel:[], full:true});
A.tplRm = el => { curTpl().ex.splice(+el.dataset.i, 1); save(); refreshTop(); render(); };
A.tplMv = el => { const ex = curTpl().ex, i = +el.dataset.i; if (i > 0) { [ex[i - 1], ex[i]] = [ex[i], ex[i - 1]]; save(); refreshTop(); } };
A.tplDel = () => { if (!confirm('Удалить шаблон? История тренировок останется.')) return; const id = topS().id; db.templates = db.templates.filter(x => x.id !== id); save(); closeSheet().then(render); };
A.newEx = () => openSheet({t:'newEx', g:'legs', k:'w'});
A.nxG = el => { const s = topS(); s.name = $('#nxname').value; s.g = el.dataset.v; refreshTop(); };
A.nxK = el => { const s = topS(); s.name = $('#nxname').value; s.k = el.dataset.v; refreshTop(); };
A.nxSave = () => {
  const s = topS(), name = $('#nxname').value.trim(); if (!name) { toast('Впиши название'); return; }
  const e = {id:'c_' + uid(), name, g:s.g, k:s.k, cue:''}; db.custom.push(e); save();
  closeSheet().then(() => { const p = topS(); if (p && p.t === 'pick') { p.sel.push(e.id); refreshTop(); } render(); });
  toast('Упражнение создано');
};
A.toggleMine = el => { const id = el.dataset.id, m = [...mineIds()], i = m.indexOf(id); i < 0 ? m.push(id) : m.splice(i, 1); db.settings.mine = m; save(); refreshTop(); const st = $('#main').scrollTop; $('#main').innerHTML = {home:vHome, hist:vHist, ex:vEx, me:vMe}[ui.tab](); $('#main').scrollTop = st; toast(i < 0 ? 'Добавлено в мои упражнения' : 'Убрано из моих'); };
A.delEx = el => { if (!confirm('Удалить упражнение? Записи в прошлых тренировках останутся.')) return; db.custom = db.custom.filter(e => e.id !== el.dataset.id); save(); closeSheet().then(render); };
A.goal = el => { db.settings.goal = Math.min(7, Math.max(1, db.settings.goal + +el.dataset.v)); save(); render(); };
A.restDef = el => { db.settings.rest = +el.dataset.v; save(); render(); };
A.tgl = el => { const k = el.dataset.v; db.settings[k] = !db.settings[k]; save(); render(); if (k === 'wake') db.settings.wake ? wake() : releaseWake(); };
A.theme = el => { db.settings.theme = el.dataset.v; save(); render(); };
A.addBw = () => openSheet({t:'text', title:'Вес тела, кг', numeric:true, value:db.body.length ? String([...db.body].sort((a, b) => b.t - a.t)[0].v).replace('.', ',') : '', ok:v => { const n = num(v); if (!n || n < 20 || n > 400) { toast('Проверь число: от 20 до 400 кг'); return; } const today = dayStart(Date.now()).getTime(); db.body = db.body.filter(b => dayStart(b.t).getTime() !== today); db.body.push({t:Date.now(), v:n}); save(); render(); }});
A.plates = () => openSheet({t:'plates', bar:20, v:''});
A.plBar = el => { const s = topS(); s.bar = +el.dataset.v; s.v = $('#plv').value; refreshTop(); };
A.orm = () => openSheet({t:'orm'});
A.export = async () => {
  const blob = new Blob([JSON.stringify(db)], {type:'application/json'});
  const name = `lift-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([blob], name, {type:'application/json'});
  const done = () => { db.settings.backup = Date.now(); save(); render(); toast('Копия сохранена'); };
  if (navigator.canShare?.({files:[file]})) { try { await navigator.share({files:[file], title:'Lift — копия данных'}); done(); return; } catch (e) { if (e.name === 'AbortError') return; } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); done();
};
A.restoreBak = () => {
  let b; try { b = JSON.parse(ls(BAK)); } catch { return; }
  if (!confirm(`Вернуть данные к автокопии от ${fDate(b.t, {day:'numeric', month:'long'})}? В ней ${b.data.workouts.length} ${plural(b.data.workouts.length, 'тренировка', 'тренировки', 'тренировок')}. Всё, что сделано после, пропадёт.`)) return;
  ls(KEY + '.before-restore', JSON.stringify(db)); db = hydrate(b.data); recomputePR(); save(); render(); toast('Данные возвращены к автокопии');
};
A.import = () => $('#file').click();
$('#file').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.workouts) || !Array.isArray(d.templates)) throw 0;
    if (!confirm(`В копии ${d.workouts.length} ${plural(d.workouts.length, 'тренировка', 'тренировки', 'тренировок')}. Заменить ими текущие данные?`)) return;
    const fr = fresh(); db = {...fr, ...d, settings:{...fr.settings, ...d.settings}}; recomputePR(); save(); render(); toast('Данные восстановлены');
  } catch { toast('Этот файл не похож на копию Lift'); }
});
A.wipe = () => { if (!confirm('Удалить все тренировки, шаблоны и настройки?')) return; if (!confirm('Восстановить можно будет только из сохранённой копии. Удалить?')) return; db = fresh(); save(); ui.tab = 'home'; render(); };

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  A[el.dataset.a]?.(el);
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.f) {
    const s = db.active.items[t.dataset.e].sets[t.dataset.s];
    let v = num(t.value); if (v != null && t.dataset.f === 'r') v = Math.round(v);
    s[t.dataset.f] = v == null ? null : Math.max(0, v);
    if (s.d) woStatUpdate(); saveSoon(); return;
  }
  switch (t.id) {
    case 'q': ui.q = t.value; $('#exlist').innerHTML = exList(); break;
    case 'pq': { const s = topS(); s.q = t.value; $('#plist').innerHTML = pickList(s); break; }
    case 'woname': db.active.name = t.value; saveSoon(); break;
    case 'pname': db.settings.name = t.value.trim(); saveSoon(); break;
    case 'tplname': curTpl().name = t.value; saveSoon(); break;
    case 'plv': { const s = topS(); s.v = t.value; const tmp = document.createElement('div'); tmp.innerHTML = SH.plates(s); $('#plout').replaceWith(tmp.querySelector('#plout')); break; }
    case 'ormw': case 'ormr': { const s = topS(); s.w = $('#ormw').value; s.r = $('#ormr').value; const tmp = document.createElement('div'); tmp.innerHTML = SH.orm(s); $('#ormout').replaceWith(tmp.querySelector('#ormout')); break; }
  }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'tx') A.textOk();
  else if (e.target.dataset.f || ['woname', 'pname', 'tplname'].includes(e.target.id)) e.target.blur();
});
document.addEventListener('focusin', e => { if (e.target.classList?.contains('in')) setTimeout(() => e.target.select?.(), 0); });
document.addEventListener('change', e => { if (e.target.id === 'pname') render(); });
// безымянный шаблон при закрытии получает имя
const _close = closeSheet;
closeSheet = function (n) { const s = topS(); if (s?.t === 'tpl') { const t = db.templates.find(x => x.id === s.id); if (t && !t.name.trim()) { t.name = 'Шаблон ' + db.templates.length; save(); } setTimeout(render, 230); } return _close(n); };
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

// ---------- запуск
recomputePR();
if (db.active && !db.active.wid) ui.woOpen = true;
render(); wake();
navigator.storage?.persist?.();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
