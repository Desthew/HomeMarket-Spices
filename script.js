const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

// =====================
// TIMER: 2 days 3 hours 16 minutes (persist in localStorage)
// =====================
const TIMER_KEY = "spice_timer_end_fixed";
const DURATION_MS = ((2 * 24 + 3) * 60 + 16) * 60 * 1000; // 2д 3ч 16м

function getEndTimeFixed(){
  const saved = localStorage.getItem(TIMER_KEY);
  if(saved){
    const t = Number(saved);
    if(!Number.isNaN(t) && t > Date.now()) return t;
  }
  const end = Date.now() + DURATION_MS;
  localStorage.setItem(TIMER_KEY, String(end));
  return end;
}

function fmtTime(ms){
  const total = Math.max(0, Math.floor(ms/1000));
  const h = String(Math.floor(total/3600)).padStart(2,"0");
  const m = String(Math.floor((total%3600)/60)).padStart(2,"0");
  const s = String(total%60).padStart(2,"0");
  return `${h}:${m}:${s}`;
}

function setupTimer(){
  const timerInline = $("#timerInline");
  const timerBig = $("#timerBig");
  const timerBottom = $("#timerBottom");
  if(!timerInline && !timerBig && !timerBottom) return;

  const endTime = getEndTimeFixed();

  function tick(){
    const left = endTime - Date.now();
    const t = fmtTime(left);

    if(timerInline) timerInline.textContent = t;
    if(timerBig) timerBig.textContent = t;
    if(timerBottom) timerBottom.textContent = t;

    // если дошло до нуля — можно оставить 00:00:00 (не перезагружаем)
    if(left <= 0){
      if(timerInline) timerInline.textContent = "00:00:00";
      if(timerBig) timerBig.textContent = "00:00:00";
      if(timerBottom) timerBottom.textContent = "00:00:00";
    }
  }

  tick();
  setInterval(tick, 1000);
}
setupTimer();

// =====================
// Social proof / stock simulation (index only)
// =====================
function setupSocialProof(){
  const liveBuyCount = $("#liveBuyCount");
  const stockLeft = $("#stockLeft");
  const progressPct = $("#progressPct");
  const barFill = $("#barFill");
  if(!liveBuyCount || !stockLeft || !progressPct || !barFill) return;

  let viewers = 37;
  let stock = 48;

  function update(){
    viewers = clamp(viewers + (Math.random() > 0.5 ? 1 : -1), 18, 89);
    if(Math.random() > 0.72 && stock > 7) stock -= 1;

    liveBuyCount.textContent = viewers;
    stockLeft.textContent = stock;

    const pct = clamp(Math.round(55 + (48 - stock) * 1.8 + Math.random()*6), 55, 96);
    progressPct.textContent = `${pct}%`;
    barFill.style.width = `${pct}%`;
  }

  update();
  setInterval(update, 3800);
}
setupSocialProof();

// =====================
// Recipe toggle (index only)
// =====================
function setupRecipes(){
  const recipeBox = $("#recipeBox");
  const chips = $$(".chip");
  if(!recipeBox || chips.length === 0) return;

  const recipes = {
    beef: {
      title: "Рецепт: тушкована яловичина",
      items: [
        "500–800 г яловичини",
        "1 пакетик спецій",
        "1–1.2 л води, соєвий соус за бажанням",
        "Тушкувати 90 хв. на слабкому вогні"
      ],
    },
    eggs: {
      title: "Рецепт: чайні яйця",
      items: [
        "6–10 яєць (відварити 8–9 хв.)",
        "1 пакетик спецій + 700–900 мл води",
        "Додайте трохи соєвого соусу для кольору",
        "Томіть 40–60 хв., залиште настоятись"
      ],
    },
    mix: {
      title: "Рецепт: універсальний (м’ясо/овочі)",
      items: [
        "1 пакетик на 1–1.2 л рідини",
        "Додавайте за 5 хв. до кипіння",
        "Тушкуйте 45–120 хв. залежно від страви",
        "Саше дістаньте наприкінці"
      ],
    }
  };

  chips.forEach(ch => {
    ch.addEventListener("click", () => {
      chips.forEach(x => x.classList.remove("active"));
      ch.classList.add("active");
      const r = recipes[ch.dataset.recipe];
      if(!r) return;

      recipeBox.innerHTML = `
        <b>${r.title}</b>
        <ul>${r.items.map(i => `<li>${i}</li>`).join("")}</ul>
      `;
    });
  });
}
setupRecipes();

// =====================
// Gallery lightbox (index only)
// =====================
function setupGallery(){
  const imgModal = $("#imgModal");
  const modalImg = $("#modalImg");
  const closeImgModal = $("#closeImgModal");
  const items = $$(".gallery__item");
  if(!imgModal || !modalImg || items.length === 0) return;

  function openImg(src){
    modalImg.src = src;
    imgModal.style.display = "flex";
    imgModal.setAttribute("aria-hidden","false");
  }
  function closeImg(){
    imgModal.style.display = "none";
    imgModal.setAttribute("aria-hidden","true");
  }

  items.forEach(btn => btn.addEventListener("click", () => openImg(btn.dataset.img || btn.querySelector("img")?.src)));
  if(closeImgModal) closeImgModal.addEventListener("click", closeImg);
  imgModal.addEventListener("click", (e) => { if(e.target === imgModal) closeImg(); });

  const scrollBtn = $("#scrollToGallery");
  if(scrollBtn){
    scrollBtn.addEventListener("click", () => {
      $("#gallery")?.scrollIntoView({behavior:"smooth"});
    });
  }
}
setupGallery();

// =====================
// Reviews add more (index only)
// =====================
function setupReviews(){
  const shuffleBtn = $("#shuffleReviews");
  const reviewsWrap = $("#reviews");
  if(!shuffleBtn || !reviewsWrap) return;

  const extraReviews = [
    {name:"Вікторія", stars:"★★★★★", text:"Аромат дуже приємний, соус насичений. Реально “як треба”."},
    {name:"Ігор", stars:"★★★★★", text:"Саше — супер ідея. Нічого не треба проціджувати."},
    {name:"Світлана", stars:"★★★★☆", text:"Смак класний, але люблю трохи гостріше — додала перцю."},
  ];

  function renderReview({name, stars, text}){
    return `
      <article class="review">
        <div class="review__top"><b>${name}</b><span class="stars">${stars}</span></div>
        <p>${text}</p>
      </article>
    `;
  }

  shuffleBtn.addEventListener("click", () => {
    reviewsWrap.insertAdjacentHTML("beforeend", renderReview(extraReviews[Math.floor(Math.random()*extraReviews.length)]));
    reviewsWrap.lastElementChild?.scrollIntoView({behavior:"smooth", block:"nearest"});
  });
}
setupReviews();

// =====================
// ORDER -> thankyou.html (index only)
// phone: +380 fixed + user enters 9 digits
// =====================
function onlyDigits(s){ return (s || "").replace(/\D/g, ""); }

function setupOrderForm(){
  const form = $("#orderForm");
  const formError = $("#formError");
  const phoneRestInput = $('input[name="phoneRest"]');
  if(!form) return;

  // auto-clean digits on input
  if(phoneRestInput){
    phoneRestInput.addEventListener("input", () => {
      const d = onlyDigits(phoneRestInput.value).slice(0, 9);
      phoneRestInput.value = d;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if(formError) formError.textContent = "";

    const fd = new FormData(form);
    const fullName = (fd.get("fullName") || "").toString().trim();
    const phoneRest = onlyDigits((fd.get("phoneRest") || "").toString());

    const agree = fd.get("agree");

    if(fullName.length < 3){
      if(formError) formError.textContent = "Будь ласка, введіть ПІБ (мінімум 3 символи).";
      return;
    }
    if(phoneRest.length !== 9){
      if(formError) formError.textContent = "Введіть 9 цифр після +380.";
      return;
    }
    if(!agree){
      if(formError) formError.textContent = "Потрібна згода на обробку персональних даних.";
      return;
    }

    const payload = {
      fullName,
      phone: `+380${phoneRest}`,
      product: "Набір 20 пакетиків",
      price: 399,
      oldPrice: 600,
      currency: "UAH",
      ts: Date.now()
    };

    // Send to Telegram bot
    const now = new Date();
    const dateStr = now.toLocaleDateString("uk-UA", { day:"2-digit", month:"2-digit", year:"numeric" });
    const timeStr = now.toLocaleTimeString("uk-UA", { hour:"2-digit", minute:"2-digit", second:"2-digit" });

    const text = [
      `\u{1F4E6} *Нове замовлення!*`,
      ``,
      `\u{1F464} *ПІБ:* ${fullName}`,
      `\u{1F4DE} *Телефон:* +380${phoneRest}`,
      `\u{1F310} *Сайт:* ${window.location.href}`,
      `\u{1F4C5} *Дата:* ${dateStr}`,
      `\u{1F552} *Час:* ${timeStr}`,
    ].join("\n");

    const TG_TOKEN = "8238136423:AAGhlFwZbDMqzOr5RmZBNxe6PGWNvcFv0lU";
    const TG_CHAT  = "-5234504493";

    fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: "Markdown" }),
    })
    .finally(() => {
      sessionStorage.setItem("order_payload", JSON.stringify(payload));
      window.location.href = "thankyou.html";
    });
  });
}
setupOrderForm();

// =====================
// THANKYOU page (no confirm button)
// =====================
function setupThankYou(){
  const tName = $("#tName");
  const tPhone = $("#tPhone");
  const tError = $("#tError");
  if(!tName || !tPhone) return; // not thankyou page

  const raw = sessionStorage.getItem("order_payload");
  let payload = null;
  try { payload = raw ? JSON.parse(raw) : null; } catch(e){ payload = null; }

  if(payload && payload.fullName && payload.phone){
    tName.textContent = payload.fullName;
    tPhone.textContent = payload.phone;
  } else {
    if(tError) tError.textContent = "Не знайдено дані замовлення. Поверніться назад і заповніть форму ще раз.";
  }
}
setupThankYou();
