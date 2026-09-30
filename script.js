/* =========================================================
   يلا جو — محرك الرحلة المخصصة
   التفضيلات ← التوصيات ← المسار ← الاستكشاف
========================================================= */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// تغيير نص عنصر لو كان موجود
function setText(el, text) {
    if (el) el.textContent = text;
}


/* ---------- سلايدشو الصور بالواجهة ---------- */

const heroImages = $$(".main-images img");
let heroIndex = 0;

if (heroImages.length > 1) {
    setInterval(() => {
        heroImages[heroIndex].classList.remove("active");
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroImages[heroIndex].classList.add("active");
    }, 4000);
}


/* ---------- العناصر ---------- */

const startButton = $(".button");
const steps = $$(".step");
const panels = $$(".step-panel");
const options = $$(".option");
const nextButton = $(".next-button");
const backButton = $(".back-button");

const recommendations = $("#recommendations");
const recommendationGrid = $("#recommendationGrid");
const recommendationIntro = $("#recommendationIntro");
const recommendationMatch = $("#recommendationMatch");
const buildJourneyButton = $("#buildJourneyButton");
const journeyStartOptions = $("#journeyStartOptions");
const journeyStartMessage = $("#journeyStartMessage");

const destinationSection = $("#destination");
const destinationInput = $("#destinationInput");
const destinationButton = $("#destinationButton");
const destinationPlaces = $$(".destination-places span");
const destinationHelper = $("#destinationHelper");

const routeMap = $("#routeMap");
const routeDestinationMeta = $("#routeDestinationMeta");
const routeDestinationLabel = $("#routeDestinationLabel");
const routeStartLabel = $("#routeStartLabel");
const routeStops = $("#routeStops");
const routeLabels = $$("[data-route-label]");

const placeOverview = $("#placeOverview");
const placeImage = $("#placeImage");
const placeCategory = $("#placeCategory");
const placeTitle = $("#placeTitle");
const placeDescription = $("#placeDescription");
const placeInfo = $("#placeInfo");

const storyButton = $("#storyButton");
const storySection = $("#storySection");
const storyNextButton = $("#storyNextButton");
const storyTabs = $$(".story-tab");
const storyTitle = $("#storyTitle");
const storyIntroText = $("#storyIntroText");
const storyText = $("#storyText");

const practicalInfo = $("#practicalInfo");
const practicalNextButton = $("#practicalNextButton");

const challengeSection = $("#challengeSection");
const challengeOptions = $$(".challenge-option");
const challengeComplete = $("#challengeComplete");
const challengeMessage = $("#challengeMessage");
const challengeNextButton = $("#challengeNextButton");

const checkinSection = $("#checkinSection");
const checkinButton = $("#checkinButton");
const checkinMessage = $("#checkinMessage");
const checkinNextButton = $("#checkinNextButton");

const journeyMapSection = $("#journeyMap");
const journeySection = $("#journey");
const journeyNextButton = $("#journeyNextButton");
const journeyStops = $("#journeyStops");
const journeyPoints = $("#journeyPoints");
const journeyRoute = $("#journeyRoute");
const journeyArea = $("#journeyArea");

const passportSection = $("#passport");
const passportStamps = $$(".passport-stamp");
const passportCount = $("#passportCount");
const passportPoints = $("#passportPoints");
const passportProgress = $("#passportProgress");
const passportStampLabels = [1, 2, 3, 4].map((n) => $("#passportStamp" + n));

const mapMarkers = $("#mapMarkers");
const mapRouteLine = $("#mapRouteLine");
const mapSummary = $("#mapSummary");
const mapDistance = $("#mapDistance");

const transitionLayer = $("#transitionLayer");


/* ---------- الحالة ---------- */

let currentStep = 1;
let totalPoints = 0;
let selectedPlace = null;   // الوجهة النهائية للرحلة
let currentPlace = null;    // المكان المفتوح حالياً (محطة أو وجهة)
let selectedStart = null;   // نقطة البداية
let selectedRoute = [];     // المحطات بين البداية والوجهة
const explored = new Set();
const completedSteps = new Set();

const preferences = {
    interests: [],
    travelStyle: "",
    time: "",
    accessibility: []
};


/* ---------- بيانات الوجهات ---------- */

const destinations = [
    {
        id: "petra", name: "Petra", region: "South Jordan",
        image: "assets/images/petra.webp",
        category: "HISTORY · CULTURE",
        interests: ["History", "Culture", "Local Experiences"],
        styles: ["Solo", "Couple", "Family", "Friends"],
        times: ["Full Day", "More Than a Day"],
        walking: "high", wheelchair: false, distanceBase: 250,
        description: "A world-famous archaeological city where ancient architecture, landscapes and stories meet.",
        tags: ["History", "Culture", "Iconic"],
        story: "Petra brings together history, landscape and discovery. Its paths reward travelers who want to slow down and notice the details along the way."
    },
    {
        id: "wadi-rum", name: "Wadi Rum", region: "South Jordan",
        image: "assets/images/wadi_rum.webp",
        category: "NATURE · ADVENTURE",
        interests: ["Nature", "Adventure", "Local Experiences"],
        styles: ["Solo", "Couple", "Friends", "Family"],
        times: ["Half Day", "Full Day", "More Than a Day"],
        walking: "medium", wheelchair: false, distanceBase: 320,
        description: "Vast desert landscapes, dramatic rock formations and experiences shaped by the open sky.",
        tags: ["Desert", "Adventure", "Nature"],
        story: "Wadi Rum is a landscape built for looking outward. The desert becomes part of the experience, from its rock formations to its changing light."
    },
    {
        id: "wadi-mujib", name: "Wadi Mujib", region: "Dead Sea",
        image: "assets/images/wadi_mujib2.webp",
        category: "NATURE · ADVENTURE",
        interests: ["Nature", "Adventure"],
        styles: ["Solo", "Friends", "Couple"],
        times: ["Few Hours", "Half Day"],
        walking: "high", wheelchair: false, distanceBase: 80,
        description: "A dramatic canyon landscape for travelers looking for nature, movement and adventure.",
        tags: ["Canyon", "Hiking", "Adventure"],
        story: "Wadi Mujib turns the landscape into an active experience. Water, stone and narrow canyon walls create a route that feels different at every turn."
    },
    {
        id: "karak", name: "Karak", region: "South Jordan",
        image: "assets/images/karak.webp",
        category: "HISTORY · LOCAL LIFE",
        interests: ["History", "Culture", "Food", "Local Experiences"],
        styles: ["Solo", "Couple", "Family", "Friends"],
        times: ["Few Hours", "Half Day", "Full Day"],
        walking: "medium", wheelchair: false, distanceBase: 140,
        description: "A southern Jordanian destination combining a historic castle, local food and everyday stories.",
        tags: ["Castle", "Food", "Local Life"],
        story: "Karak is more than its castle. The destination connects history with local food, streets and stories that make a stop feel personal."
    },
    {
        id: "ajloun", name: "Ajloun", region: "North Jordan",
        image: "assets/images/ajloun_castle.webp",
        category: "HISTORY · NATURE",
        interests: ["History", "Nature", "Culture", "Local Experiences"],
        styles: ["Family", "Couple", "Friends", "Solo"],
        times: ["Half Day", "Full Day"],
        walking: "medium", wheelchair: false, distanceBase: 110,
        description: "Green landscapes, forest trails and a historic castle make Ajloun a balanced day out.",
        tags: ["Forest", "Castle", "Nature"],
        story: "Ajloun brings together two sides of Jordan: green northern landscapes and a strong layer of history."
    },
    {
        id: "madaba", name: "Madaba", region: "Central Jordan",
        image: "assets/images/madaba.webp",
        category: "CULTURE · HISTORY",
        interests: ["Culture", "History", "Local Experiences"],
        styles: ["Family", "Couple", "Solo", "Friends"],
        times: ["Few Hours", "Half Day"],
        walking: "low", wheelchair: true, distanceBase: 40,
        description: "A cultural stop known for historic mosaics, local craft and a walkable town experience.",
        tags: ["Mosaics", "Culture", "Craft"],
        story: "Madaba is a place where history is visible in small details. Its mosaics and local craft make the town rewarding to explore slowly."
    },
    {
        id: "jerash", name: "Jerash", region: "North Jordan",
        image: "assets/images/jerash.webp",
        category: "HISTORY · CULTURE",
        interests: ["History", "Culture"],
        styles: ["Family", "Couple", "Solo", "Friends"],
        times: ["Half Day", "Full Day"],
        walking: "medium", wheelchair: false, distanceBase: 70,
        description: "An extraordinary ancient city where colonnades, plazas and stone streets reveal Jordan's layered history.",
        tags: ["Ancient City", "History", "Architecture"],
        story: "Jerash makes history feel spatial. Walking through its ancient streets reveals how a city was shaped, used and connected."
    },
    {
        id: "dead-sea", name: "Dead Sea", region: "West Jordan",
        image: "assets/images/hammamat_maien.webp",
        category: "RELAX · NATURE",
        interests: ["Nature", "Food", "Local Experiences"],
        styles: ["Couple", "Family", "Friends", "Solo"],
        times: ["Few Hours", "Half Day", "Full Day"],
        walking: "low", wheelchair: true, distanceBase: 55,
        description: "A slower experience around the lowest point on Earth, combining landscape, water and relaxation.",
        tags: ["Relax", "Water", "Landscape"],
        story: "The Dead Sea is about slowing down. The landscape, water and open horizon create a very different rhythm from an active sightseeing route."
    },
    {
        id: "aqaba", name: "Aqaba", region: "South Jordan",
        image: "assets/images/aqaba.webp",
        category: "NATURE · LOCAL LIFE",
        interests: ["Nature", "Food", "Adventure", "Local Experiences"],
        styles: ["Family", "Couple", "Friends", "Solo"],
        times: ["Full Day", "More Than a Day"],
        walking: "low", wheelchair: true, distanceBase: 330,
        description: "Jordan's coastal city for sea views, local food and a change of pace by the Red Sea.",
        tags: ["Sea", "Food", "Coast"],
        story: "Aqaba adds a coastal chapter to Jordan. The Red Sea, local food and city life create a different kind of journey."
    }
];

const findPlace = (id) => destinations.find((p) => p.id === id);


/* ---------- دوال عامة ---------- */

function scrollToSection(section) {
    if (!section) return;
    setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}

// الـ HTML بيستخدم أسماء كلاسات وصفية والـ CSS بيستخدم أسماء ثانية،
// فنضيف الكلاسات المطلوبة مرة وحدة عند تحميل الصفحة
function applyDesignClasses() {
    const addClass = (el, cls) => el && el.classList.add(cls);
    const inside = (root, sel) => root && root.querySelector(sel);

    addClass(routeMap, "route-section");
    addClass(inside(routeMap, ".route-layout"), "route");

    addClass(inside(placeOverview, ".place-content"), "place-copy");
    addClass(inside(placeOverview, "#placeInfo"), "place-meta");
    addClass(storyButton, "primary-action");

    addClass(practicalInfo, "practical-section");
    addClass(inside(practicalInfo, ".practical-layout"), "practical-inner");
    addClass(inside(practicalInfo, ".practical-main"), "practical-grid");
    if (practicalInfo) {
        practicalInfo.querySelectorAll(".info-row").forEach((r) => r.classList.add("practical-card"));
    }

    addClass(challengeSection, "challenge-section");
    addClass(checkinSection, "checkin-section");
    addClass(journeySection, "journey-section");
    addClass(passportSection, "passport-section");
}

function showSection(section) {
    if (section) section.classList.add("active");
}

// انتقال سينمائي بين الأقسام
function startTransition(target) {
    if (!target) return;

    if (!transitionLayer) {
        showSection(target);
        scrollToSection(target);
        return;
    }

    transitionLayer.classList.remove("hide", "show");
    void transitionLayer.offsetWidth; // إعادة تشغيل الأنيميشن
    transitionLayer.classList.add("show");

    setTimeout(() => {
        showSection(target);
        target.scrollIntoView({ behavior: "auto", block: "start" });
    }, 650);

    setTimeout(() => {
        transitionLayer.classList.remove("show");
        transitionLayer.classList.add("hide");
    }, 900);

    setTimeout(() => transitionLayer.classList.remove("hide"), 1650);
}

const normalize = (v) => String(v || "").trim().toLowerCase();
const getPanel = (n) => $(`.step-panel[data-panel="${n}"]`);

// فتح خريطة الرحلة + رحلتي مع بعض
function openJourneyView() {
    showSection(journeyMapSection);
    showSection(journeySection);
    renderJourney();
    renderMap();
    scrollToSection(journeyMapSection || journeySection);
}


/* ---------- قراءة التفضيلات ---------- */

function getSelectedValues(panelNumber) {
    const panel = getPanel(panelNumber);
    if (!panel) return [];

    return Array.from(panel.querySelectorAll(".option.selected")).map((opt) => {
        const label = opt.querySelector("span:last-child");
        return label ? label.textContent.trim() : "";
    });
}

function collectPreferences() {
    preferences.interests = getSelectedValues(1);
    preferences.travelStyle = getSelectedValues(2)[0] || "";
    preferences.time = getSelectedValues(3)[0] || "";
    preferences.accessibility = getSelectedValues(4);
}

function hasSelection(stepNumber) {
    const panel = getPanel(stepNumber);
    return !!(panel && panel.querySelector(".option.selected"));
}

function showValidationMessage() {
    const panel = getPanel(currentStep);
    if (!panel) return;

    let msg = panel.querySelector(".validation-message");

    if (!msg) {
        msg = document.createElement("p");
        msg.className = "validation-message";
        msg.textContent = "Please choose at least one option to continue.";
        panel.appendChild(msg);
    }

    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 2000);
}


/* ---------- حساب نسبة التوافق ---------- */

function scoreDestination(place) {
    let score = 0;
    let possible = 0;
    const acc = preferences.accessibility;

    // كل اهتمام مطابق = 25 نقطة
    preferences.interests.forEach((interest) => {
        possible += 25;
        if (place.interests.includes(interest)) score += 25;
    });

    if (preferences.travelStyle) {
        possible += 15;
        if (place.styles.includes(preferences.travelStyle)) score += 15;
    }

    if (preferences.time) {
        possible += 20;
        if (place.times.includes(preferences.time)) score += 20;
    }

    if (acc.includes("Less Walking")) {
        possible += 20;
        if (place.walking === "low") score += 20;
        else if (place.walking === "medium") score += 10;
    }

    if (acc.includes("Wheelchair Friendly")) {
        possible += 20;
        if (place.wheelchair) score += 20;
    }

    // الدعم الصوتي متوفر بكل الأماكن
    if (acc.includes("Audio Support")) {
        possible += 5;
        score += 5;
    }

    const percent = possible ? Math.round((score / possible) * 100) : 50;
    return Math.max(45, Math.min(99, percent));
}

function getRecommendations() {
    return destinations
        .map((place) => ({ place, score: scoreDestination(place) }))
        .sort((a, b) => b.score - a.score);
}


/* ---------- عرض التوصيات ---------- */

function renderRecommendations() {
    if (!recommendationGrid) return;

    const top = getRecommendations().slice(0, 6);

    setText(recommendationMatch, (top[0] ? top[0].score : 0) + "% match");
    setText(recommendationIntro, "A route shaped around what you love.");

    recommendationGrid.innerHTML = top.map((item, i) => {
        const p = item.place;
        const tags = p.tags.slice(0, 3).map((t) => `<span>${t}</span>`).join("");

        return `
            <article class="recommendation-card ${i === 0 ? "featured" : ""}" data-place-id="${p.id}">
                <div class="recommendation-image">
                    <img src="${p.image}" alt="${p.name}">
                    <span class="match-badge">${item.score}% match</span>
                </div>
                <div class="recommendation-content">
                    <p class="recommendation-category">${p.category}</p>
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="recommendation-tags">${tags}</div>
                    <button type="button" class="recommendation-select" data-place-id="${p.id}">
                        Choose this path →
                    </button>
                </div>
            </article>
        `;
    }).join("");

    recommendationGrid.querySelectorAll(".recommendation-select").forEach((btn) => {
        btn.addEventListener("click", () => selectRecommendation(btn));
    });

    selectedPlace = null;
    selectedStart = null;
    if (buildJourneyButton) buildJourneyButton.disabled = true;
    setText(journeyStartMessage, "");
    renderStartOptions();
}

function selectRecommendation(button) {
    selectedPlace = findPlace(button.dataset.placeId);

    // نشيل الاختيار القديم
    recommendationGrid.querySelectorAll(".recommendation-card").forEach((c) => c.classList.remove("selected"));
    recommendationGrid.querySelectorAll(".recommendation-select").forEach((b) => {
        b.classList.remove("selected");
        b.textContent = "Choose this path →";
    });

    // نفعّل الاختيار الجديد
    const card = button.closest(".recommendation-card");
    if (card) card.classList.add("selected");
    button.classList.add("selected");
    button.textContent = "Path selected ✓";

    // نقطة البداية لازم تختلف عن الوجهة
    if (selectedStart && selectedStart.id === selectedPlace.id) {
        selectedStart = null;
        setText(journeyStartMessage, "Choose where you would like to begin.");
    }

    renderStartOptions();
    updateBuildButton();
}

function updateBuildButton() {
    if (buildJourneyButton) buildJourneyButton.disabled = !(selectedPlace && selectedStart);
}


/* ---------- اختيار نقطة البداية ---------- */

function renderStartOptions() {
    if (!journeyStartOptions) return;

    const candidates = destinations
        .filter((p) => !selectedPlace || p.id !== selectedPlace.id)
        .slice(0, 8);

    journeyStartOptions.innerHTML = candidates.map((p) => `
        <button type="button"
            class="journey-start-option ${selectedStart && selectedStart.id === p.id ? "selected" : ""}"
            data-start-id="${p.id}">
            <span class="journey-start-name">${p.name}</span>
            <span class="journey-start-region">${p.region}</span>
        </button>
    `).join("");

    journeyStartOptions.querySelectorAll(".journey-start-option").forEach((btn) => {
        btn.addEventListener("click", () => {
            selectedStart = findPlace(btn.dataset.startId);

            journeyStartOptions.querySelectorAll(".journey-start-option")
                .forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");

            setText(journeyStartMessage, `Starting from ${selectedStart.name}.`);
            updateBuildButton();
        });
    });
}


/* ---------- بناء المسار ---------- */

function getStopsForDestination(place) {
    // أعلى الأماكن توافقاً مع تفضيلات المستخدم
    const ranked = getRecommendations()
        .filter((r) => r.place.id !== place.id && r.score >= 50)
        .slice(0, 3)
        .map((r) => r.place);

    // أماكن من نفس المنطقة كاحتياط
    const sameRegion = destinations.filter((d) => d.id !== place.id && d.region === place.region);

    const unique = [];
    [...ranked, ...sameRegion].forEach((item) => {
        if (!unique.some((u) => u.id === item.id)) unique.push(item);
    });

    return unique.slice(0, 3);
}

function buildPersonalizedRoute(destinationPlace, startPoint) {
    if (!destinationPlace) return;

    selectedPlace = destinationPlace;
    currentPlace = destinationPlace;
    selectedStart = startPoint || selectedStart;

    // نقطة البداية ما لازم تكون هي الوجهة
    if (selectedStart && selectedStart.id === destinationPlace.id) selectedStart = null;

    selectedRoute = getStopsForDestination(destinationPlace);

    // نستثني نقطة البداية من المحطات
    if (selectedStart) {
        selectedRoute = selectedRoute.filter((p) => p.id !== selectedStart.id);
    }

    setText(routeStartLabel, selectedStart ? selectedStart.name : "Your starting point");
    setText(routeDestinationMeta, destinationPlace.name);
    setText(routeDestinationLabel, destinationPlace.name);

    // تسميات المحطات على الخريطة المبسطة
    routeLabels.forEach((label, i) => {
        const stop = selectedRoute[i];
        const box = label.closest(".route-label") || label;

        setText(label, stop ? stop.name : "—");
        box.style.display = stop ? "" : "none";
    });

    renderRouteStops(destinationPlace);
    renderJourney();
    renderMap();
}

function renderRouteStops(destinationPlace) {
    if (!routeStops) return;

    const walkingLabel = { low: "Easy walking", medium: "Moderate walking", high: "Active" };

    // البداية (إن وجدت) ثم المحطات ثم الوجهة
    const items = [
        ...(selectedStart ? [selectedStart] : []),
        ...selectedRoute,
        destinationPlace
    ];

    routeStops.innerHTML = items.map((p, i) => {
        const isFinal = p.id === destinationPlace.id;
        const isStart = selectedStart && i === 0;
        const stopNumber = i + (selectedStart ? 0 : 1);

        let type = `STOP 0${stopNumber}`;
        let buttonText = "Explore stop";
        if (isStart) { type = "START"; buttonText = "Explore start"; }
        if (isFinal) { type = "DESTINATION"; buttonText = "Discover destination"; }

        return `
            <article class="route-stop ${isFinal ? "final-stop" : ""}" data-stop-id="${p.id}">
                <span class="route-dot"></span>
                <p class="stop-type">${type}</p>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="route-stop-meta">
                    <span>${p.region}</span>
                    <span>${walkingLabel[p.walking]}</span>
                    <span>${p.tags[0] || "Jordan"}</span>
                </div>
                <button type="button" class="route-stop-button" data-stop-id="${p.id}">
                    ${buttonText}
                </button>
            </article>
        `;
    }).join("");

    routeStops.querySelectorAll(".route-stop-button").forEach((btn) => {
        btn.addEventListener("click", () => openPlace(findPlace(btn.dataset.stopId)));
    });
}


/* ---------- تحديث المحتوى حسب المكان ---------- */

function updatePlaceDependentContent(place) {
    if (!place) return;

    // المعلومات العملية
    if (practicalInfo) {
        const rows = practicalInfo.querySelectorAll(".info-row");
        const rowText = (i) => rows[i] && rows[i].querySelector("p");

        setText(rowText(0), `Give yourself enough time to explore ${place.name} without rushing through the experience.`);

        const walkingText = {
            low: "The stop is relatively easy to explore, with less demanding movement between areas.",
            medium: "Expect some walking across a natural or historic environment, so comfortable footwear is recommended.",
            high: "Expect more active movement and uneven terrain, so suitable footwear and preparation are recommended."
        };
        setText(rowText(1), walkingText[place.walking]);

        if (rows[2]) {
            setText(
                rows[2].querySelector("h3"),
                place.category.includes("ADVENTURE") ? "Outdoor adventure" : "A place worth exploring"
            );
            setText(rowText(2), `Experience ${place.name} through the landscape, stories and details that make this stop part of your journey.`);
        }

        setText(rowText(3), "Check current local conditions before visiting and follow any safety guidance available at the site.");

        const quick = practicalInfo.querySelectorAll(".quick-item");
        const quickText = (i) => quick[i] && quick[i].querySelector("p");

        setText(quickText(0), `Location — ${place.region}, Jordan`);
        setText(quickText(1), `Type — ${place.category.replace(" · ", " & ")}`);
        setText(quickText(2), `Setting — ${place.walking === "low" ? "Easy access" : "Outdoor / active"}`);
        setText(quickText(3), `Route stop — ${place.name}`);
    }

    // التحدي
    if (challengeSection) {
        setText(challengeSection.querySelector(".challenge-label"), `${place.name.toUpperCase()} · OBSERVE`);
    }

    // الوسائط بقسم القصة
    if (storySection) {
        setText(storySection.querySelector(".media-placeholder strong"), place.name);
    }

    // تسجيل الوصول
    if (checkinSection) {
        const img = checkinSection.querySelector(".checkin-image img");
        const locSpans = checkinSection.querySelectorAll(".checkin-location span");
        const bottomSpans = checkinSection.querySelectorAll(".checkin-bottom span");

        if (img) {
            img.src = place.image;
            img.alt = place.name;
        }

        setText(checkinSection.querySelector(".checkin-content h3"), place.name);
        setText(
            checkinSection.querySelector(".checkin-content > p:not(.checkin-label):not(.checkin-message)"),
            `You have reached ${place.name}, one of the stops on your personalized journey. Check in and make this moment part of your YallaJO story.`
        );

        setText(locSpans[0], place.region.toUpperCase());

        const idx = getRoutePlaces().findIndex((r) => r.id === place.id);
        setText(locSpans[1], `STOP ${String(Math.max(1, idx + 1)).padStart(2, "0")}`);

        setText(bottomSpans[0], place.name.toUpperCase());
        setText(bottomSpans[1], `JOURNEY STOP ${String(Math.max(1, idx + 1)).padStart(2, "0")}`);
    }

    // حالة زر تسجيل الوصول حسب المكان
    const done = explored.has(place.id);
    if (checkinButton) {
        checkinButton.disabled = done;
        checkinButton.textContent = done ? "Checked In" : "Check in here";
    }
    if (checkinMessage) checkinMessage.classList.toggle("show", done);
}


/* ---------- صفحة المكان ---------- */

function openPlace(place) {
    if (!place) return;
    currentPlace = place;

    if (placeImage) {
        placeImage.src = place.image;
        placeImage.alt = place.name;
    }

    setText(placeCategory, place.category);
    setText(placeDescription, place.description);

    // كل كلمة من اسم المكان على سطر
    if (placeTitle) placeTitle.innerHTML = place.name.split(" ").join("<br>");

    if (placeInfo) {
        placeInfo.innerHTML = place.tags.map((t) => `<span>${t}</span>`).join("");
    }

    if (storyTitle) storyTitle.innerHTML = `More than<br>${place.name}.`;
    setText(storyIntroText, `Every place has something worth noticing. Discover why ${place.name} became part of your journey.`);

    if (storyText) {
        const paras = storyText.querySelectorAll("p");
        if (paras.length > 1) paras[paras.length - 1].textContent = place.story;
    }

    updatePlaceDependentContent(place);
    showSection(placeOverview);
    scrollToSection(placeOverview);
}


/* ---------- الخريطة التفاعلية ---------- */

// مواقع تقريبية بالنسبة المئوية على لوحة الخريطة [يسار، أعلى]
const mapCoords = {
    "petra": [76, 70],
    "wadi-rum": [84, 86],
    "wadi-mujib": [50, 57],
    "karak": [45, 66],
    "ajloun": [33, 23],
    "madaba": [42, 39],
    "jerash": [39, 20],
    "dead-sea": [45, 51],
    "aqaba": [77, 92]
};

function getCoords(place) {
    if (mapCoords[place.id]) return mapCoords[place.id];
    const i = destinations.indexOf(place);
    return [35 + (i * 7) % 45, 25 + (i * 9) % 55];
}

// أماكن المسار بدون تكرار
function getRoutePlaces() {
    const all = [...selectedRoute, selectedPlace].filter(Boolean);
    return all.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
}

function renderMap() {
    if (!mapMarkers || !selectedPlace) return;

    const places = getRoutePlaces();

    mapMarkers.innerHTML = places.map((p) => {
        const [left, top] = getCoords(p);
        return `
            <button type="button"
                class="map-marker ${explored.has(p.id) ? "explored" : ""}"
                style="left:${left}%;top:${top}%"
                data-map-place="${p.id}"
                aria-label="${p.name}">
                <span class="map-marker-dot"></span>
                <span class="map-marker-label">${p.name}</span>
            </button>
        `;
    }).join("");

    mapMarkers.querySelectorAll(".map-marker").forEach((marker) => {
        marker.addEventListener("click", () => openPlace(findPlace(marker.dataset.mapPlace)));
    });

    if (places.length > 1 && mapRouteLine) {
        const points = places.map(getCoords).map(([x, y]) => `${x}% ${y}%`).join(", ");
        mapRouteLine.style.clipPath = `polygon(${points})`;
        mapRouteLine.classList.add("active");
    }

    const doneCount = places.filter((p) => explored.has(p.id)).length;
    setText(mapSummary, `${doneCount} of ${places.length} places on this route explored.`);

    const km = places.reduce((sum, p) => sum + Math.round(p.distanceBase / 3), 0);
    setText(mapDistance, `${km} km route estimate`);
}


/* ---------- زر Start Exploring ---------- */

function startExploringTransition() {
    const personalize = $("#personalize");
    if (!personalize) return;

    document.body.classList.add("entering-personalize");

    setTimeout(() => personalize.scrollIntoView({ behavior: "auto", block: "start" }), 650);
    setTimeout(() => document.body.classList.remove("entering-personalize"), 1500);
}

if (startButton) {
    startButton.addEventListener("click", (e) => {
        e.preventDefault();
        startExploringTransition();
    });
}


/* ---------- خطوات التخصيص ---------- */

function showStep(n) {
    currentStep = n;

    panels.forEach((panel) => {
        panel.classList.toggle("active", Number(panel.dataset.panel) === currentStep);
    });

    steps.forEach((step) => {
        const num = Number(step.dataset.step);
        step.classList.toggle("active", num === currentStep);
        step.classList.toggle("completed", completedSteps.has(num));
    });

    if (backButton) backButton.style.visibility = currentStep === 1 ? "hidden" : "visible";
    if (nextButton) nextButton.textContent = currentStep === 4 ? "Build My Path" : "Continue";
}

options.forEach((option) => {
    option.addEventListener("click", () => {
        const panel = option.closest(".step-panel");
        if (!panel) return;

        const stepNumber = Number(panel.dataset.panel);
        const label = option.querySelector("span:last-child");
        const isNone = label && label.textContent.trim() === "No Special Needs";

        // الخطوتين 1 و 4 تسمح باختيار أكثر من خيار
        if (stepNumber === 1 || stepNumber === 4) {
            const allOptions = panel.querySelectorAll(".option");

            if (stepNumber === 4 && isNone) {
                // "No Special Needs" يلغي باقي الخيارات
                allOptions.forEach((o) => o.classList.remove("selected"));
                option.classList.add("selected");
                return;
            }

            if (stepNumber === 4) {
                // اختيار أي خيار ثاني يلغي "No Special Needs"
                allOptions.forEach((o) => {
                    if (o.textContent.trim() === "No Special Needs") o.classList.remove("selected");
                });
            }

            option.classList.toggle("selected");
            return;
        }

        // باقي الخطوات: اختيار واحد فقط
        panel.querySelectorAll(".option").forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
    });
});

steps.forEach((step) => {
    step.addEventListener("click", () => {
        const target = Number(step.dataset.step);

        if (target > currentStep) {
            if (!hasSelection(currentStep)) {
                showValidationMessage();
                return;
            }
            for (let i = currentStep; i < target; i++) completedSteps.add(i);
        }

        showStep(target);
    });
});

if (nextButton) {
    nextButton.addEventListener("click", () => {
        if (!hasSelection(currentStep)) {
            showValidationMessage();
            return;
        }

        completedSteps.add(currentStep);

        if (currentStep < 4) {
            showStep(currentStep + 1);
            return;
        }

        // آخر خطوة: نجمع التفضيلات ونعرض التوصيات
        collectPreferences();
        renderRecommendations();
        showSection(destinationSection); // قسم البحث المباشر يظهر بعد التوصيات
        startTransition(recommendations);
    });
}

if (backButton) {
    backButton.addEventListener("click", () => {
        if (currentStep <= 1) return;
        completedSteps.delete(currentStep);
        showStep(currentStep - 1);
    });
}


/* ---------- زر بناء الرحلة ---------- */

if (buildJourneyButton) {
    buildJourneyButton.addEventListener("click", () => {
        if (!selectedStart) {
            setText(journeyStartMessage, "Choose where you would like to begin.");
            return;
        }

        // لو المستخدم ما اختار وجهة ناخد أعلى توصية
        const chosen = selectedPlace || (getRecommendations()[0] || {}).place;
        if (!chosen) return;

        buildPersonalizedRoute(chosen, selectedStart);
        startTransition(routeMap);
    });
}


/* ---------- البحث المباشر عن وجهة ---------- */

destinationPlaces.forEach((span) => {
    span.style.cursor = "pointer";
    span.addEventListener("click", () => {
        if (!destinationInput) return;
        destinationInput.value = span.textContent.trim();
        destinationInput.focus();
    });
});

function findDestination(query) {
    const q = normalize(query);
    if (!q) return null;
    return (
        destinations.find((p) => normalize(p.name) === q) ||
        destinations.find((p) => normalize(p.name).includes(q))
    );
}

if (destinationButton) {
    destinationButton.addEventListener("click", () => {
        const value = destinationInput ? destinationInput.value.trim() : "";

        if (!value) {
            if (destinationInput) destinationInput.focus();
            return;
        }

        const place = findDestination(value);

        if (!place) {
            setText(destinationHelper, "Try one of these: " + destinations.map((d) => d.name).join(", ") + ".");
            return;
        }

        destinationButton.textContent = "Building...";
        destinationButton.disabled = true;

        buildPersonalizedRoute(place);

        setTimeout(() => {
            destinationButton.textContent = "Explore";
            destinationButton.disabled = false;
            startTransition(routeMap);
        }, 350);
    });
}

if (destinationInput) {
    destinationInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && destinationButton) {
            e.preventDefault();
            destinationButton.click();
        }
    });
}


/* ---------- التنقل بين أقسام الرحلة ---------- */

// زر يفتح قسم معين ويسكرول له
function goTo(button, section) {
    if (!button || !section) return;
    button.addEventListener("click", () => {
        showSection(section);
        scrollToSection(section);
    });
}

goTo(storyButton, storySection);
goTo(storyNextButton, practicalInfo);
goTo(practicalNextButton, challengeSection);
goTo(challengeNextButton, checkinSection);
goTo(journeyNextButton, passportSection);

if (checkinNextButton) checkinNextButton.addEventListener("click", openJourneyView);

storyTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        storyTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
    });
});


/* ---------- التحدي ---------- */

challengeOptions.forEach((option) => {
    option.addEventListener("click", () => {
        challengeOptions.forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
    });
});

if (challengeComplete) {
    challengeComplete.addEventListener("click", () => {
        if (!$(".challenge-option.selected")) return;

        challengeComplete.textContent = "Challenge Completed";
        challengeComplete.disabled = true;

        if (challengeMessage) challengeMessage.classList.add("show");
        if (challengeNextButton) challengeNextButton.classList.add("show");
    });
}


/* ---------- رحلتي ---------- */

function renderJourney() {
    if (!journeyRoute) return;

    const places = selectedRoute.length || selectedPlace ? getRoutePlaces() : [];

    journeyRoute.innerHTML = places.map((p, i) => {
        const done = explored.has(p.id);
        const isFinal = selectedPlace && p.id === selectedPlace.id;

        let status = "UPCOMING";
        if (done) status = "COMPLETED";
        else if (isFinal) status = "DESTINATION";
        else if (i === 0) status = "UP NEXT";

        let text = "A personalized stop waiting on your route.";
        if (done) text = "Checked in · +10 points";
        else if (isFinal) text = "The destination your route was built around.";

        return `
            <article class="journey-stop ${done ? "completed" : ""} ${isFinal ? "final" : ""}">
                <div class="journey-stop-number">${String(i + 1).padStart(2, "0")}</div>
                <div>
                    <span>${status}</span>
                    <h3>${p.name}</h3>
                    <p>${text}</p>
                </div>
            </article>
        `;
    }).join("");

    const doneCount = places.filter((p) => explored.has(p.id)).length;

    setText(journeyStops, `${doneCount} / ${places.length || 4}`);
    setText(journeyPoints, totalPoints);
    setText(journeyArea, selectedPlace ? selectedPlace.name : "—");

    // أسماء الأماكن على ختوم الجواز
    places.slice(0, passportStampLabels.length).forEach((p, i) => {
        setText(passportStampLabels[i], p.name);
    });
}


/* ---------- الجواز وتسجيل الوصول ---------- */

function unlockPassportStamp(number, points) {
    const stamp = passportStamps[number - 1];
    if (!stamp) return;

    if (!stamp.classList.contains("unlocked")) {
        stamp.classList.remove("locked");
        stamp.classList.add("unlocked");
        totalPoints += points;
    }

    const unlocked = $$(".passport-stamp.unlocked").length;
    const total = passportStamps.length;

    setText(passportCount, `${unlocked} / ${total}`);
    setText(passportPoints, totalPoints);
    setText(journeyPoints, totalPoints);

    if (passportProgress && total) {
        passportProgress.style.width = (unlocked / total) * 100 + "%";
    }
}

if (checkinButton) {
    checkinButton.addEventListener("click", () => {
        const place = currentPlace || selectedPlace || selectedRoute[0];
        if (!place || explored.has(place.id)) return;

        checkinButton.textContent = "Checked In";
        checkinButton.disabled = true;

        if (checkinMessage) checkinMessage.classList.add("show");

        explored.add(place.id);
        unlockPassportStamp(Math.min(explored.size, passportStamps.length), 10);

        renderJourney();
        renderMap();

        if (checkinNextButton) checkinNextButton.classList.add("show");
    });
}


/* ---------- النافبار ---------- */

// يربط رابط بالنافبار بدالة معينة بدل السلوك الافتراضي
function bindNavLink(selector, action) {
    const link = $(selector);
    if (!link) return;

    link.addEventListener("click", (e) => {
        e.preventDefault();
        action();
    });
}

bindNavLink(".navbar .logo", () => window.scrollTo({ top: 0, behavior: "smooth" }));

bindNavLink('.navbar a[href="#about"]', () => {
    const about = $("#about");
    if (about) about.scrollIntoView({ behavior: "smooth", block: "start" });
});

bindNavLink('.navbar a[href="#journey"]', openJourneyView);

bindNavLink('.navbar a[href="#passport"]', () => {
    showSection(passportSection);
    scrollToSection(passportSection);
});

bindNavLink('.navbar a[href="#personalize"]', startExploringTransition);


/* ---------- تشغيل أولي ---------- */

applyDesignClasses();
showStep(1);


/* =========================================================
   حسابات المستخدمين — Firebase Auth
========================================================= */

(function setupAuth() {
    const fb = window.yallaFirebase;

    if (!fb || !fb.auth) {
        console.warn("Firebase Auth غير متوفر");
        return;
    }

    const {
        auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
        signOut, onAuthStateChanged, signInAnonymously
    } = fb;

    // زر الحساب وقائمته
    const accountButton = $("#accountButton");
    const dropdown = $("#accountDropdown");
    const guestBox = $("#accountGuest");
    const userBox = $("#accountUser");
    const userEmail = $("#accountUserEmail");
    const loginBtn = $("#accountLogin");
    const signupBtn = $("#accountSignup");
    const logoutBtn = $("#accountLogout");

    // نافذة تسجيل الدخول
    const modal = $("#authModal");
    const closeBtn = $("#authClose");
    const form = $("#authForm");
    const emailInput = $("#authEmail");
    const passwordInput = $("#authPassword");
    const submitBtn = $("#authSubmit");
    const message = $("#authMessage");
    const switchBtn = $("#authSwitch");
    const title = $("#authTitle");
    const intro = $("#authIntro");

    if (!accountButton || !modal || !form || !emailInput || !passwordInput ||
        !submitBtn || !message || !switchBtn || !title || !intro) {
        console.warn("عناصر واجهة تسجيل الدخول ناقصة");
        return;
    }

    let signupMode = false;

    function showMessage(text, isError = false) {
        message.textContent = text;
        message.classList.toggle("error", isError);
    }

    // تبديل النصوص بين تسجيل الدخول وإنشاء حساب
    function setMode(isSignup) {
        signupMode = isSignup;
        showMessage("");

        if (isSignup) {
            title.textContent = "Create your account.";
            intro.textContent = "Save your journey, places and passport across your visits.";
            submitBtn.textContent = "Create account";
            switchBtn.textContent = "Already have an account? Log in";
        } else {
            title.textContent = "Continue your journey.";
            intro.textContent = "Log in to save your journey, places and passport.";
            submitBtn.textContent = "Log in";
            switchBtn.textContent = "Don't have an account? Sign up";
        }
    }

    function openModal(isSignup) {
        setMode(isSignup);
        closeDropdown();
        modal.classList.add("active");
        emailInput.focus();
    }

    function closeModal() {
        modal.classList.remove("active");
        showMessage("");
        form.reset();
    }

    /* --- القائمة المنسدلة --- */

    function setDropdown(open) {
        if (!dropdown) return;
        dropdown.classList.toggle("active", open);
        accountButton.classList.toggle("active", open);
        accountButton.setAttribute("aria-expanded", String(open));
        dropdown.setAttribute("aria-hidden", String(!open));
    }

    function closeDropdown() {
        setDropdown(false);
    }

    accountButton.addEventListener("click", (e) => {
        e.stopPropagation();
        setDropdown(!(dropdown && dropdown.classList.contains("active")));
    });

    // الضغط خارج القائمة يسكرها
    document.addEventListener("click", (e) => {
        if (dropdown && !dropdown.contains(e.target) && e.target !== accountButton) {
            closeDropdown();
        }
    });

    if (loginBtn) loginBtn.addEventListener("click", () => openModal(false));
    if (signupBtn) signupBtn.addEventListener("click", () => openModal(true));

    // عناصر قائمة المستخدم
    $$("[data-account-action]").forEach((item) => {
        item.addEventListener("click", () => {
            const action = item.dataset.accountAction;
            closeDropdown();

            if (action === "journey") openJourneyView();
            if (action === "passport") {
                showSection(passportSection);
                scrollToSection(passportSection);
            }
            // profile و settings لسا ما إلهم صفحات
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            closeDropdown();
            try {
                await signOut(auth);
                // نرجع نعمل دخول مجهول عشان يضل في مستخدم Firebase
                await signInAnonymously(auth);
            } catch (error) {
                console.error("خطأ بتسجيل الخروج:", error);
            }
        });
    }

    /* --- النافذة --- */

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (modal.classList.contains("active")) closeModal();
        closeDropdown();
    });

    switchBtn.addEventListener("click", () => setMode(!signupMode));

    // رسائل الأخطاء بصيغة مفهومة للمستخدم
    function friendlyError(error) {
        switch (error.code) {
            case "auth/email-already-in-use":
                return "An account with this email already exists.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                return "The email or password is incorrect.";
            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";
            case "auth/network-request-failed":
                return "Network error. Please check your connection.";
            default:
                return "Something went wrong. Please try again.";
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage("Please enter your email and password.", true);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = signupMode ? "Creating account..." : "Logging in...";
        showMessage("");

        try {
            const authFn = signupMode ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
            const credential = await authFn(auth, email, password);

            fb.user = credential.user;
            showMessage(signupMode ? "Account created successfully." : "Welcome back.");
            setTimeout(closeModal, 700);
        } catch (error) {
            console.error("خطأ بالمصادقة:", error);
            showMessage(friendlyError(error), true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = signupMode ? "Create account" : "Log in";
        }
    });

    /* --- حالة المستخدم --- */

    // نبدّل بين صندوق الضيف وصندوق المستخدم المسجّل
    onAuthStateChanged(auth, (user) => {
        const registered = !!(user && !user.isAnonymous);

        if (user) fb.user = user;

        if (guestBox) guestBox.style.display = registered ? "none" : "";
        if (userBox) userBox.classList.toggle("active", registered);
        setText(userEmail, registered ? user.email : "-");
    });
})();