const isFR = document.documentElement.lang === "fr";
const t = (en, fr) => isFR ? fr : en;


// Pricing Tier Definitions
// ===== Catering Pricing Section (START) =====
document.addEventListener('DOMContentLoaded', () => {
  // 🌟 Expand Step 1 content on first load
  emailjs.init("HK_s0OMOwSSr6bl0n");
  
  const firstStep = document.getElementById('step-1');
  const firstContent = firstStep.querySelector('.step-content');
  firstStep.classList.add('active');
  firstContent.classList.add('active');

  // 📌 Accordion toggle on header click
  document.querySelectorAll('.accordion-step h3').forEach(header => {
    header.addEventListener('click', () => {
      const step = header.parentElement;
      const content = step.querySelector('.step-content');

      // Collapse all step contents
      document.querySelectorAll('.accordion-step').forEach(s => {
        s.classList.remove('active');
        const c = s.querySelector('.step-content');
        if (c) c.style.maxHeight = null;
      });

      // Expand clicked step
      step.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';

      scrollToStep(step.id);
    });
  });

});

// 🌈 Tier Color Map
const tierColors = {
    A: '#1e90ff',  // blue
    B: '#4caf50',  // green
    C: '#f4a300'   // gold
};

// 🍱 Shared Dish Toggles
const sharedToggles = [
    [t('Chickpeas', 'Pois chiches'), t('Daal', 'Daal'), t('Main', 'Plat principal')],
    [t('Signature Kofta', 'Kofta signature'), t('Shai Paneer', 'Shahi paneer'), t('Main', 'Plat principal')],
    [t('Mixed Veg Sabji', 'Sabji de légumes variés'), t('Aloo Gobhi', 'Aloo gobhi'), t('Main', 'Plat principal')],
    [t('Gulab Jamun', 'Gulab jamun'), t('Burfi', 'Barfi'), t('Dessert', 'Dessert')]
];

// 🌟 Dual Selections Only in Tier C
const dualSelectIndexes = [0, 3]; // Chickpeas/Daal and Gulab Jamun/Barfi
const tierBExtras = [t('Tikki', 'Tikki'), t('Pakora', 'Pakora')];
const tierCExtras = [t('Raita', 'Raita'), t('Salad', 'Salade')];

// 🏷️ Full Tier Definitions
const tiersA_Base = [
    t('Samosa (Appetizer)', 'Samosa (Entrée)'),
    t('Basmati rice (Side)', 'Riz basmati (Accompagnement)'),
    t('Chapati Flat Bread (Side)', 'Pain chapati (Accompagnement)')
];

const tiers = {
    A: {
        price: 14,
        base: tiersA_Base
    },
    B: {
        price: 16,
        base: tiersA_Base,
        adds: [
            t('Extra Chapatis - plus 2 (Side)', 'Chapatis supplémentaires - plus 2 (Accompagnement)'),
            t('Extra Rice (Side)', 'Riz supplémentaire (Accompagnement)')
        ]
    },
    C: {
        price: 19,
        base: tiersA_Base,
        adds: [
            t('Extra Chapatis - plus 2 (Side)', 'Chapatis supplémentaires - plus 2 (Accompagnement)'),
            t('Extra Rice (Side)', 'Riz supplémentaire (Accompagnement)')
        ]
    }
};

let selectedTier = null;
let selectedChoices = {};
let choiceTiers = {};  // Maps toggle index to tier selected in
let togglesInitialized = false;


// 🔘 Tier Button Selection
document.querySelectorAll('.tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        selectedTier = btn.getAttribute('data-tier');
        renderToggles(selectedTier);
        updateSummary();

        expandStepHeight('step-3');

    });
});

// 🧩 Build Toggle Rows
function renderToggles(tierKey) {
    const container = document.getElementById('dish-toggles');
    container.innerHTML = '';
    const color = tierColors[tierKey];
    selectedTier = tierKey;

    // 🌱 Initializing one-time shared toggle defaults
    if (!togglesInitialized) {
        sharedToggles.forEach(([opt1], index) => {
            selectedChoices[index] = opt1;
            choiceTiers[index] = tierKey;
        });
        togglesInitialized = true;
    }

    // ➕ Extra items setup
    if ((tierKey === 'B' || tierKey === 'C') && !selectedChoices['B-Appetizer']) {
        selectedChoices['B-Appetizer'] = tierBExtras[0];
    }
    if (tierKey === 'C' && !selectedChoices['C-Side']) {
        selectedChoices['C-Side'] = tierCExtras[0];
    }
}

// === Shared Toggles ===
sharedToggles.forEach(([opt1, opt2, category], index) => {
    const rowWrapper = document.createElement('div');
    rowWrapper.style.display = 'flex';
    rowWrapper.style.alignItems = 'center';
    rowWrapper.style.marginBottom = '1rem';
    rowWrapper.style.flexWrap = 'wrap';

    // Label on the left
    const label = document.createElement('div');
    label.innerText = category;
    label.style.minWidth = '80px';
    label.style.marginRight = '1rem';
    label.style.fontWeight = 'bold';
    label.style.textAlign = 'left';
    rowWrapper.appendChild(label);

    // Button group for two choices and divider
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.alignItems = 'center';
    buttonGroup.style.flexWrap = 'nowrap';
    buttonGroup.style.flex = '1';
    buttonGroup.style.gap = '1rem';

    const btnA = document.createElement('div');
    const btnB = document.createElement('div');
    [btnA, btnB].forEach((btn, i) => {
        const text = i === 0 ? opt1 : opt2;
        btn.className = 'toggle-option';
        btn.innerText = text;
        btn.dataset.category = category;
        btn.style.textAlign = 'center';
        btn.style.borderColor = color;
        btn.style.flex = '0 1 45%';

        const stored = selectedChoices[index];
        const isSelected = stored === text;
        const isDual = tierKey === 'C' && dualSelectIndexes.includes(index);
        const showAsSelected = isSelected || (isDual && stored !== null);

        btn.classList.toggle('active', showAsSelected);
        btn.style.backgroundColor = showAsSelected ? color + '33' : '#f9f9f9';
        btn.style.borderColor = showAsSelected ? color : '#ccc';

        btn.style.minWidth = '50px';

        btn.onclick = () => {
            selectedChoices[index] = text;
            choiceTiers[index] = tierKey;
            renderToggles(tierKey);
            updateSummary();

            expandStepHeight('step-3');
        };

        buttonGroup.appendChild(btn);
    });

    // Divider element
    const divider = document.createElement('span');
    const isDual = tierKey === 'C' && dualSelectIndexes.includes(index);
    divider.innerText = isDual ? t('and', 'et') : t('or', 'ou');
    divider.className = 'toggle-divider';

    buttonGroup.insertBefore(divider, buttonGroup.children[1]);
    rowWrapper.appendChild(buttonGroup);
    container.appendChild(rowWrapper);
});
// === Tier B Extras ===
const rowKeyB = 'B-Appetizer';
const selectedB = selectedChoices[rowKeyB];
const [extraB1, extraB2] = tierBExtras;
const bEnabled = tierKey === 'B' || tierKey === 'C';

const bRowWrapper = document.createElement('div');
bRowWrapper.style.display = 'flex';
bRowWrapper.style.alignItems = 'center';
bRowWrapper.style.marginBottom = '1rem';
bRowWrapper.style.flexWrap = 'wrap';

const bLabel = document.createElement('div');
bLabel.innerText = t('Appetizer', 'Entrée');
bLabel.style.minWidth = '80px';
bLabel.style.marginRight = '1rem';
bLabel.style.fontWeight = 'bold';
bLabel.style.textAlign = 'left';
bRowWrapper.appendChild(bLabel);

const bGroup = document.createElement('div');
bGroup.style.display = 'flex';
bGroup.style.alignItems = 'center';
bGroup.style.flexWrap = 'nowrap';
bGroup.style.flex = '1';
bGroup.style.gap = '1rem';

const bBtnA = document.createElement('div');
const bBtnB = document.createElement('div');
[bBtnA, bBtnB].forEach((btn, i) => {
    const text = i === 0 ? extraB1 : extraB2;
    btn.className = 'toggle-option';
    btn.innerText = text;
    btn.dataset.category = t('Appetizer', 'Entrée');
    btn.style.textAlign = 'center';
    btn.style.flex = '0 1 45%';

    const isSelected = selectedB === text;
    const showAsSelected = isSelected || (tierKey === 'C' && selectedB !== null);

    btn.style.opacity = bEnabled ? '1' : '0.5';
    btn.style.pointerEvents = bEnabled ? 'auto' : 'none';
    btn.classList.toggle('active', showAsSelected);
    btn.style.backgroundColor = showAsSelected ? color + '33' : '#f9f9f9';
    btn.style.borderColor = showAsSelected ? color : '#ccc';

    btn.style.minWidth = '50px';

    btn.onclick = () => {
        if (!bEnabled) return;
        selectedChoices[rowKeyB] = selectedB === text ? null : text;
        renderToggles(tierKey);
        updateSummary();

        expandStepHeight('step-3');
    };

    bGroup.appendChild(btn);
});

const bDivider = document.createElement('span');
bDivider.innerText = tierKey === 'C' ? t('and', 'et') : t('or', 'ou');
bDivider.className = 'toggle-divider';
bGroup.insertBefore(bDivider, bGroup.children[1]);
bRowWrapper.appendChild(bGroup);
container.appendChild(bRowWrapper);

// === Tier C Extras ===
const rowKeyC = 'C-Side';
const selectedC = selectedChoices[rowKeyC];
const [extraC1, extraC2] = tierCExtras;
const cEnabled = tierKey === 'C';

const cRowWrapper = document.createElement('div');
cRowWrapper.style.display = 'flex';
cRowWrapper.style.alignItems = 'center';
cRowWrapper.style.marginBottom = '1rem';
cRowWrapper.style.flexWrap = 'wrap';

const cLabel = document.createElement('div');
cLabel.innerText = t('Side', 'Accompagnement');
cLabel.style.minWidth = '80px';
cLabel.style.marginRight = '1rem';
cLabel.style.fontWeight = 'bold';
cLabel.style.textAlign = 'left';
cRowWrapper.appendChild(cLabel);

const cGroup = document.createElement('div');
cGroup.style.display = 'flex';
cGroup.style.alignItems = 'center';
cGroup.style.flexWrap = 'nowrap';
cGroup.style.flex = '1';
cGroup.style.gap = '1rem';

const cBtnA = document.createElement('div');
const cBtnB = document.createElement('div');
[cBtnA, cBtnB].forEach((btn, i) => {
    const text = i === 0 ? extraC1 : extraC2;
    btn.className = 'toggle-option';
    btn.innerText = text;
    btn.dataset.category = t('Side', 'Accompagnement');
    btn.style.textAlign = 'center';
    btn.style.flex = '0 1 45%';

    const isSelected = selectedC === text;

    btn.style.opacity = cEnabled ? '1' : '0.5';
    btn.style.pointerEvents = cEnabled ? 'auto' : 'none';
    btn.classList.toggle('active', isSelected);
    btn.style.backgroundColor = isSelected ? color + '33' : '#f9f9f9';
    btn.style.borderColor = isSelected ? color : '#ccc';

    btn.style.minWidth = '50px';

    btn.onclick = () => {
        if (!cEnabled) return;
        selectedChoices[rowKeyC] = selectedC === text ? null : text;
        renderToggles(tierKey);
        updateSummary();

        expandStepHeight('step-3');
    };

    cGroup.appendChild(btn);
});

const cDivider = document.createElement('span');
cDivider.innerText = t('or', 'ou');
cDivider.className = 'toggle-divider';
cGroup.insertBefore(cDivider, cGroup.children[1]);
cRowWrapper.appendChild(cGroup);
container.appendChild(cRowWrapper);
}



// 🟦 Update Active Toggle Styling
function updateToggles() {
    document.querySelectorAll('.toggle-option').forEach(btn => {
        btn.classList.remove('active');
    });

    Object.values(selectedChoices).forEach(choice => {
        document.querySelectorAll('.toggle-option').forEach(btn => {
            if (btn.innerText === choice) {
                btn.classList.add('active');
                btn.style.backgroundColor = tierColors[selectedTier] + '33';
                btn.style.borderColor = tierColors[selectedTier];
            }
        });
    });
}

// 📋 Live Summary Update

function updateSummary() {
    const list = document.getElementById('summary-list');
    const priceTag = document.getElementById('price-per-guest');
    list.innerHTML = '';

    if (!selectedTier) return;
    const tierInfo = tiers[selectedTier];

    // 🧠 Tier Heading
    const tierItem = document.createElement('li');
    tierItem.innerText = t(
        `Selected Tier: ${selectedTier} – $${tierInfo.price}/person`,
        `Forfait sélectionné : ${selectedTier} – ${tierInfo.price} $/personne`
    );
    tierItem.style.fontWeight = 'bold';
    list.appendChild(tierItem);

    // 🧾 Base Items
    tierInfo.base.forEach(item => {
        const li = document.createElement('li');
        li.innerText = item;
        list.appendChild(li);
    });

    // ✅ Selected Shared Toggles
    Object.entries(selectedChoices).forEach(([key, choice]) => {
        if (!isNaN(parseInt(key))) {
            const category = sharedToggles[key][2];
            const li = document.createElement('li');
            li.innerText = `${choice} (${category})`;
            li.style.color = tierColors[selectedTier];
            list.appendChild(li);
        }
    });

    // ➕ Tier B and C Toggle Selections
    const bChoice = selectedChoices['B-Appetizer'];
    const cChoice = selectedChoices['C-Side'];

    if (bChoice && (selectedTier === 'C')) {
        const li = document.createElement('li');
        li.innerText = t(
            `Tikki and Pakora (Appetizers)`,
            `Tikki et Pakora (Entrées)`
        );
        li.style.color = tierColors[selectedTier];
        list.appendChild(li);

    } else if (bChoice && selectedTier === 'B') {
        const li = document.createElement('li');
        li.innerText = `${bChoice} (${t('Appetizer', 'Entrée')})`;
        li.style.color = tierColors[selectedTier];
        list.appendChild(li);
    }

    if (cChoice && selectedTier === 'C') {
        const li = document.createElement('li');
        li.innerText = `${cChoice} (${t('Side', 'Accompagnement')})`;
        li.style.color = tierColors[selectedTier];
        list.appendChild(li);
    }

    // 🧠 Combo Replacements (Tier C only)
    const comboOverrides = [
        { chosen: ['Pakora', 'Tikki'], category: t('Appetizer', 'Entrée') },
        { chosen: ['Chickpeas', 'Daal'], category: t('Main', 'Plat principal') },
        { chosen: ['Gulab Jamun', 'Burfi'], category: t('Dessert', 'Dessert') }
    ];

    if (selectedTier === 'C') {
        comboOverrides.forEach(({ chosen, category }) => {
            const [opt1, opt2] = chosen;

            const selectedToggleKey = Object.entries(selectedChoices).find(
                ([key, val]) => !isNaN(parseInt(key)) && (val === opt1 || val === opt2)
            );

            if (selectedToggleKey) {
                const [index, selectedText] = selectedToggleKey;

                const foundLine = Array.from(list.children).find(li =>
                    li.innerText.startsWith(selectedText)
                );
                if (foundLine) foundLine.remove();

                const li = document.createElement('li');
                li.innerText = t(
                    `${opt1} and ${opt2} (${category}s)`,
                    `${opt1} et ${opt2} (${category}s)`
                );
                li.style.color = tierColors[selectedTier];
                list.appendChild(li);
            }
        });
    }

    // 🧩 Built-in Tier Add-ons from definition
    if (tierInfo.adds) {
        tierInfo.adds.forEach(addon => {
            const alreadyListed = Array.from(list.children).some(li =>
                li.innerText.startsWith(addon)
            );

            if (!alreadyListed) {
                const li = document.createElement('li');
                li.innerText = addon;
                li.style.fontStyle = 'italic';
                list.appendChild(li);
            }
        });
    }

    // 💲 Price Tag
    // priceTag.innerText = `Estimated Price per Guest: $${tierInfo.price}`;
}

// Auto-select Tier A on load
document.querySelector('.tier-btn[data-tier="A"]').click();


//pricing options logic ends



//accordion menu logic starts

function validateStep1() {
    const inputEl = document.getElementById('event-date');
    const timeInput = document.getElementById('event-time');
    const guestInput = document.getElementById('guest-count');

    let inputDate = inputEl.value;
    const warning = document.getElementById('date-warning');
    const timeWarning = document.getElementById('time-warning');
    const guestWarning = document.getElementById('guest-warning');

    // ⛔ No date chosen? Set it to tomorrow by default
    if (!inputDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        inputDate = tomorrow.toISOString().split('T')[0];
        inputEl.value = inputDate;
    }

    const daysAhead = (new Date(inputDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysAhead < 2) {
        warning.innerHTML = t(
            "Date is too soon to book in advance. <br>Please use our delivery/pickup platform. <br>Or choose a later date.",
            "La date est trop rapprochée pour une réservation à l’avance. <br>Veuillez utiliser notre plateforme de livraison/commande à emporter. <br>Ou choisissez une date ultérieure."
        );
        return;
    } else if (daysAhead < 5) {
        warning.innerHTML = t(
            `Date is too soon to book in advance. <br>Please call us directly to confirm availability.<br>
      <strong>Phone:</strong> +1 (514) 521-1301<br>
      <strong>Email:</strong> govindasMontreal@gmail.com <br>Or choose a later date.`,
            `La date est trop rapprochée pour une réservation à l’avance. <br>Veuillez nous appeler directement pour confirmer la disponibilité.<br>
      <strong>Téléphone :</strong> +1 (514) 521-1301<br>
      <strong>Courriel :</strong> govindasMontreal@gmail.com <br>Ou choisissez une date ultérieure.`
        );
        return;
    } else {
        warning.innerHTML = "";
    }

    // ✅ Validate time input
    const eventTime = timeInput.value;
    if (!eventTime) {
        timeWarning.innerText = t(
            "Please select a time for food service.",
            "Veuillez sélectionner une heure pour le service de nourriture."
        );
        return;
    }

    const [hour, minute] = eventTime.split(':').map(Number);
    if (
        hour < 11 ||
        (hour === 11 && minute < 30) ||
        hour > 21 ||
        (hour === 21 && minute > 0)
    ) {
        timeWarning.innerHTML = t(
            "Food service must be scheduled between 11:30 AM and 9:00 PM.",
            "Le service de nourriture doit être prévu entre 11 h 30 et 21 h."
        );
        return;
    } else {
        timeWarning.innerText = "";
    }

    // ✅ Validate guest count
    const guestCount = parseInt(guestInput.value);
    if (isNaN(guestCount) || guestCount < 1) {
        guestWarning.innerText = t(
            "Please enter a valid number of guests.",
            "Veuillez entrer un nombre valide de convives."
        );
        return;
    }

    if (guestCount < 20) {
        guestWarning.innerHTML = t(
            "Catering minimum is 20 guests. Please adjust your guest count.",
            "Le minimum pour un service traiteur est de 20 convives. Veuillez ajuster votre nombre."
        );
        return;
    } else {
        guestWarning.innerText = "";
    }

    // ✅ Proceed to next step
    const currentStep = document.getElementById('step-1');
    const currentContent = currentStep.querySelector('.step-content');
    const nextStep = document.getElementById('step-2');
    const nextContent = nextStep.querySelector('.step-content');

    currentStep.classList.add('completed');
    currentStep.classList.remove('active');
    currentContent.classList.remove('active');

    nextStep.classList.add('active');
    nextContent.classList.add('active');

    setTimeout(() => {
        scrollToStep('step-2');
    }, 300);
}

let selectedEventType = '';

function selectEventType(type) {
    selectedEventType = type;

    // Reset and highlight selection
    Array.from(document.querySelectorAll('#event-type-options button')).forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText === type) btn.classList.add('active');
    });

    // Toggle text input for "Other"
    const otherBox = document.getElementById('other-event-type');
    otherBox.style.display = type === t('Other', 'Autre') ? 'block' : 'none';
}

function validateStep2() {
    if (selectedEventType === '') return alert(t(
        'Please select an event type.',
        'Veuillez sélectionner un type d’événement.'
    ));

    if (selectedEventType === 'Other' || selectedEventType === t('Other', 'Autre')) {
        const otherInput = document.getElementById('other-input').value.trim();
        if (!otherInput) return alert(t(
            'Please describe your event.',
            'Veuillez décrire votre événement.'
        ));
        selectedEventType = otherInput;
    }

    const currentStep = document.getElementById('step-2');
    const currentContent = currentStep.querySelector('.step-content');
    const nextStep = document.getElementById('step-3');
    const nextContent = nextStep.querySelector('.step-content');

    // Collapse current step
    currentStep.classList.add('completed');
    currentStep.classList.remove('active');
    currentContent.classList.remove('active');

    // Open next step fully
    nextStep.classList.add('active');
    nextContent.classList.add('active');

    // Smooth scroll
    setTimeout(() => {
        scrollToStep('step-3');
    }, 300);
}


function validateStep3() {
    if (!selectedTier) return alert(t(
        'Please choose a catering package to proceed.',
        'Veuillez choisir un forfait traiteur pour continuer.'
    ));

    const currentStep = document.getElementById('step-3');
    const currentContent = currentStep.querySelector('.step-content');
    const nextStep = document.getElementById('step-4');
    const nextContent = nextStep.querySelector('.step-content');

    // Collapse current step
    currentStep.classList.add('completed');
    currentStep.classList.remove('active');
    currentContent.classList.remove('active');

    // Open next step fully
    nextStep.classList.add('active');
    nextContent.classList.add('active');

    // Smooth scroll
    setTimeout(() => {
        scrollToStep('step-4');
    }, 300);
}
function toggleAllergyInput(show) {
    document.getElementById('allergy-input').style.display = show ? 'block' : 'none';
}

function validateStep4() {
    const selected = document.querySelector('input[name="has-allergies"]:checked');
    if (!selected) return alert(t(
        "Please let us know whether there are any allergies.",
        "Veuillez nous indiquer s’il y a des allergies."
    ));

    if (selected.value === "yes") {
        const details = document.getElementById('allergy-details').value.trim();
        if (!details) return alert(t(
            "Please specify any known allergens.",
            "Veuillez préciser les allergènes connus."
        ));
    }

    const currentStep = document.getElementById('step-4');
    const currentContent = currentStep.querySelector('.step-content');
    const nextStep = document.getElementById('step-5');
    const nextContent = nextStep.querySelector('.step-content');

    // Collapse current step
    currentStep.classList.add('completed');
    currentStep.classList.remove('active');
    currentContent.classList.remove('active');

    // Open next step fully
    nextStep.classList.add('active');
    nextContent.classList.add('active');

    // Smooth scroll
    setTimeout(() => {
        scrollToStep('step-5');
    }, 300);
}

// Step 5 setup: Show/hide location fields based on event type selection
function setupStep5Listeners() {
    const eventTypeInputs = document.querySelectorAll('input[name="event-type"]');
    const locationDetails = document.getElementById('location-details');

    eventTypeInputs.forEach(el => {
        el.addEventListener('change', () => {
            const selectedValue = document.querySelector('input[name="event-type"]:checked').value;
            locationDetails.style.display = selectedValue === 'offsite' ? 'block' : 'none';
        });
    });
}

const nextButton = document.getElementById('next-button');

document.querySelectorAll('input[name="event-type"]').forEach(el => {
    el.addEventListener('change', () => {
        const selected = document.querySelector('input[name="event-type"]:checked');
        const locationDetails = document.getElementById('location-details');
        const deliveryOptions = document.getElementById('delivery-options');
        const note = document.getElementById('location-message');

        if (selected?.value === "offsite") {
            locationDetails.style.display = "block";
            deliveryOptions.style.display = "block";
            note.innerHTML = "";
        } else {
            locationDetails.style.display = "none";
            deliveryOptions.style.display = "none";
            note.innerHTML = "";
        }
    });
});
document.querySelectorAll('input[name="needs-delivery"]').forEach(el => {
    el.addEventListener('change', async () => {
        const selected = document.querySelector('input[name="needs-delivery"]:checked');
        const note = document.getElementById('location-message');
        const address = document.getElementById('event-address').value.trim();

        note.innerHTML = "";
        nextButton.disabled = true;

        if (selected.value !== "yes") {
            nextButton.disabled = false;
            return;
        }

        if (!address) {
            note.innerText = t(
                "Please enter your event location before calculating delivery.",
                "Veuillez entrer l’adresse de votre événement avant de calculer la livraison."
            );
            return;
        }

        note.innerText = t(
            "Calculating delivery fee...",
            "Calcul du frais de livraison..."
        );

        try {
            const govindasCoords = [-73.5384, 45.54907];

            const geoResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`);
            const geoData = await geoResponse.json();
            const userCoords = geoData?.features?.[0]?.geometry?.coordinates;

            if (!userCoords) {
                note.innerText = t(
                    "❌ Unable to geocode the address. Please check and try again.",
                    "❌ Impossible de géocoder l’adresse. Veuillez vérifier et réessayer."
                );
                return;
            }

            const routeResponse = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${govindasCoords.join(',')};${userCoords.join(',')}?access_token=${MAPBOX_TOKEN}`);
            const routeData = await routeResponse.json();
            const meters = routeData?.routes?.[0]?.distance;
            const kilometers = Math.ceil(meters / 1000);

            if (kilometers > 108) {
                note.innerHTML += `<br>${t(
                    "⚠️ This address is outside of our delivery radius.",
                    "⚠️ Cette adresse est en dehors de notre zone de livraison."
                )}`;
                return;
            }

            const extraKm = Math.max(kilometers - 1, 0);
            const totalCost = 15 + extraKm;

            note.innerHTML += `<br>${t(
                `🚗 Distance: ~${kilometers} km<br>💰 Estimated Delivery Fee: $${totalCost}`,
                `🚗 Distance : ~${kilometers} km<br>💰 Frais de livraison estimé : ${totalCost} $`
            )}`;

            nextButton.disabled = false;

        } catch (err) {
            console.error(err);
            note.innerText = t(
                "❌ Something went wrong while calculating delivery.",
                "❌ Une erreur est survenue lors du calcul de la livraison."
            );
        }
    });
});
// Step 5 validation and progression
async function validateStep5() {
    const eventType = document.querySelector('input[name="event-type"]:checked');
    if (!eventType) return alert(t(
        'Please select whether your event is hosted at Govinda’s or offsite.',
        'Veuillez indiquer si votre événement a lieu chez Govinda’s ou à l’extérieur.'
    ));

    const note = document.getElementById('location-message');
    const deliveryOptions = document.getElementById('delivery-options');

    if (eventType.value === 'offsite') {
        const address = document.getElementById('event-address').value.trim();
        if (!address) return alert(t(
            'Please enter your event location.',
            'Veuillez entrer l’adresse de votre événement.'
        ));

        const addressLower = address.toLowerCase();

        const isMontreal = addressLower.includes('montreal') || addressLower.includes('montréal');
        const isQuebec = isMontreal || addressLower.includes('qc') || addressLower.includes('quebec') || addressLower.includes('québec');

        if (!isMontreal) {
            note.innerText = t(
                "⚠️ Delivery may be limited for areas outside the central Montreal region. Proceeding with estimate.",
                "⚠️ La livraison peut être limitée pour les régions à l’extérieur du centre de Montréal. Estimation en cours."
            );
            deliveryOptions.style.display = 'block';
        } else {
            note.innerText = '';
            deliveryOptions.style.display = 'block';
        }

        if (!isQuebec) {
            note.innerText = t(
                "❌ This address appears to be outside Quebec. Delivery is not available in this region.",
                "❌ Cette adresse semble être à l’extérieur du Québec. La livraison n’est pas disponible dans cette région."
            );
            deliveryOptions.style.display = 'none';
            return;
        }

        const deliveryChoice = document.querySelector('input[name="needs-delivery"]:checked');
        if (!deliveryChoice || deliveryChoice.value !== 'yes') return;

        const govindasCoords = [-73.5384, 45.54907];

        const geoResponse = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`);
        const geoData = await geoResponse.json();
        const userCoords = geoData?.features?.[0]?.geometry?.coordinates;

        if (!userCoords) {
            note.innerText = t(
                "❌ Unable to geocode the address. Please check and try again.",
                "❌ Impossible de géocoder l’adresse. Veuillez vérifier et réessayer."
            );
            return;
        }

        const routeResponse = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${govindasCoords.join(',')};${userCoords.join(',')}?access_token=${MAPBOX_TOKEN}`);
        const routeData = await routeResponse.json();
        const meters = routeData?.routes?.[0]?.distance;
        const kilometers = Math.ceil(meters / 1000);

        if (kilometers > 108) {
            note.innerHTML += `<br>${t(
                "⚠️ This address is outside of our delivery radius.",
                "⚠️ Cette adresse est en dehors de notre zone de livraison."
            )}`;
            return;
        }

        const extraKm = Math.max(kilometers - 1, 0);
        const totalCost = 15 + extraKm;

        window.latestDeliveryCost = totalCost;

        note.innerHTML += `<br>${t(
            `🚗 Distance: ~${kilometers} km<br>💰 Estimated Delivery Fee: $${totalCost}`,
            `🚗 Distance : ~${kilometers} km<br>💰 Frais de livraison estimé : ${totalCost} $`
        )}`;
    }

    const step5 = document.getElementById('step-5');
    const step6 = document.getElementById('step-6');
    const step5Content = step5.querySelector('.step-content');
    const step6Content = step6.querySelector('.step-content');

    step5.classList.add('completed', 'inactive');
    step5.classList.remove('active');
    step5Content.classList.remove('active');

    step6.classList.add('active');
    step6.classList.remove('inactive');
    step6Content.classList.add('active');

    setTimeout(() => scrollToStep('step-6'), 300);
}
// Attach listener to button


// Ensure listeners are bound when DOM is ready
document.addEventListener('DOMContentLoaded', setupStep5Listeners);


function validateStep6() {
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const phone = document.getElementById('user-phone').value.trim();

    if (!name || !email || !phone) {
        return alert(t(
            'Please complete all contact fields.',
            'Veuillez remplir tous les champs de contact.'
        ));
    }

    const currentStep = document.getElementById('step-6');
    const currentContent = currentStep.querySelector('.step-content');
    const nextStep = document.getElementById('step-7');
    const nextContent = nextStep.querySelector('.step-content');

    currentStep.classList.add('completed');
    currentStep.classList.remove('active');
    currentContent.classList.remove('active');

    nextStep.classList.add('active');
    nextContent.classList.add('active');

    setTimeout(() => {
        scrollToStep('step-7');
    }, 300);
}

function validateStep7() {
    const currentStep = document.getElementById('step-7');
    const currentContent = currentStep.querySelector('.step-content');
    const nextStep = document.getElementById('step-8');
    const nextContent = nextStep.querySelector('.step-content');

    currentStep.classList.add('completed');
    currentStep.classList.remove('active');
    currentContent.classList.remove('active');

    nextStep.classList.add('active');
    nextContent.classList.add('active');

    const summaryBox = document.getElementById('final-summary');
    if (summaryBox) {
        summaryBox.innerHTML = buildFullReviewSummaryHTML();
    }

    setTimeout(() => {
        scrollToStep('step-8');
    }, 300);
}
function buildMealSummary() {
    if (!selectedTier) return t('No tier selected', 'Aucun forfait sélectionné');

    const summary = [];
    const tierInfo = tiers[selectedTier];

    summary.push(t(
        `Tier ${selectedTier} – $${tierInfo.price}/person`,
        `Forfait ${selectedTier} – ${tierInfo.price} $/personne`
    ));

    summary.push(...tierInfo.base);

    // Shared Toggles
    Object.entries(selectedChoices).forEach(([key, choice]) => {
        if (!isNaN(parseInt(key))) {
            const category = sharedToggles[key][2];
            summary.push(`${choice} (${category})`);
        }
    });

    // Tier B/C Additions
    const bChoice = selectedChoices['B-Appetizer'];
    const cChoice = selectedChoices['C-Side'];

    if (selectedTier === 'C' && bChoice) {
        summary.push(t(
            `Tikki and Pakora (Appetizers)`,
            `Tikki et Pakora (Entrées)`
        ));
    } else if (selectedTier === 'B' && bChoice) {
        summary.push(`${bChoice} (${t('Appetizer', 'Entrée')})`);
    }

    if (selectedTier === 'C' && cChoice) {
        summary.push(`${cChoice} (${t('Side', 'Accompagnement')})`);
    }

    // Combo Overrides
    const combos = [
        { pair: ['Chickpeas', 'Daal'], category: t('Main', 'Plat principal') },
        { pair: ['Gulab Jamun', 'Burfi'], category: t('Dessert', 'Dessert') },
    ];

    if (selectedTier === 'C') {
        combos.forEach(({ pair: [opt1, opt2], category }) => {
            const found =
                Object.values(selectedChoices).includes(opt1) ||
                Object.values(selectedChoices).includes(opt2);

            if (found) {
                summary.push(t(
                    `${opt1} and ${opt2} (${category}s)`,
                    `${opt1} et ${opt2} (${category}s)`
                ));
            }
        });
    }

    // Tier Add-ons
    if (tierInfo.adds) {
        tierInfo.adds.forEach(addon => {
            if (!summary.includes(addon)) {
                summary.push(addon);
            }
        });
    }

    return summary.join('\n');
}
function buildFullReviewSummaryHTML() {
    const date = document.getElementById('event-date')?.value.trim() || t('Not provided', 'Non fourni');
    const time = document.getElementById('event-time')?.value.trim() || t('Not provided', 'Non fourni');
    const guests = parseInt(document.getElementById('guest-count')?.value.trim()) || 0;
    const eventType = selectedEventType || t('Not specified', 'Non précisé');

    const tier = selectedTier || t('Not selected', 'Non sélectionné');
    const pricePerGuest = tiers[tier]?.price || 0;

    const mealSummary = buildMealSummary().split('\n').map(item => `<li>${item}</li>`).join('');

    const allergies = document.querySelector('input[name="has-allergies"]:checked')?.value || t('Not specified', 'Non précisé');
    const allergyDetails = document.getElementById('allergy-details')?.value.trim();

    const locationType = document.querySelector('input[name="event-type"]:checked')?.value || t('Not specified', 'Non précisé');
    const address = document.getElementById('event-address')?.value.trim() || t('Not provided', 'Non fourni');
    const delivery = document.querySelector('input[name="needs-delivery"]:checked')?.value || t('Not specified', 'Non précisé');

    const name = document.getElementById('user-name')?.value.trim() || '';
    const email = document.getElementById('user-email')?.value.trim() || '';
    const phone = document.getElementById('user-phone')?.value.trim() || '';

    const notes = document.getElementById('extra-notes')?.value.trim() || t('None', 'Aucune');
    const deliveryCost = window.latestDeliveryCost || 0;

    const mealCost = guests * pricePerGuest;
    const totalCost = mealCost + deliveryCost;

    return `
    <div class="review-step">${t('Step 1: Event Details', 'Étape 1 : Détails de l’événement')}</div>
    <div class="step-body">
      📅 ${t('Date', 'Date')} : ${date}<br>
      ⏰ ${t('Time', 'Heure')} : ${time}<br>
      👥 ${t('Guests', 'Convives')} : ${guests}<br>
      🎉 ${t('Event Type', 'Type d’événement')} : ${eventType}
    </div>

    <div class="review-step">${t('Step 2: Catering Package', 'Étape 2 : Forfait traiteur')}</div>
    <div class="step-body">
      ${t('Tier', 'Forfait')} ${tier} – $${pricePerGuest.toFixed(2)} ${t('per guest', 'par personne')}
    </div>

    <div class="review-step">${t('Step 3: Meal Selections', 'Étape 3 : Sélections du repas')}</div>
    <div class="step-body">
      <ul style="padding-left: 1.2rem; margin: 0;">${mealSummary}</ul>
    </div>

    <div class="review-step">${t('Step 4: Allergy Information', 'Étape 4 : Allergies')}</div>
    <div class="step-body">
      ${t('Allergies', 'Allergies')} : ${allergies}
      ${allergyDetails ? `<br>⚠️ ${t('Details', 'Détails')} : ${allergyDetails}` : ''}
    </div>

    <div class="review-step">${t('Step 5: Location & Delivery', 'Étape 5 : Lieu et livraison')}</div>
    <div class="step-body">
      ${t('Location Type', 'Type de lieu')} : ${locationType}<br>
      ${t('Address', 'Adresse')} : ${address}<br>
      ${t('Delivery Required', 'Livraison requise')} : ${delivery}
    </div>

    <div class="review-step">${t('Step 6: Contact Info', 'Étape 6 : Coordonnées')}</div>
    <div class="step-body">
      👤 ${t('Name', 'Nom')} : ${name}<br>
      📧 ${t('Email', 'Courriel')} : ${email}<br>
      📞 ${t('Phone', 'Téléphone')} : ${phone}
    </div>

    <div class="review-step">${t('Step 7: Additional Notes', 'Étape 7 : Notes additionnelles')}</div>
    <div class="step-body">
      ${notes}
    </div>

    <div class="review-step">💰 ${t('Estimated Cost Breakdown', 'Estimation des coûts')}</div>
    <div class="step-body">
      $${pricePerGuest.toFixed(2)} × ${guests} ${t('guests', 'convives')} = $${mealCost.toFixed(2)}<br>
      ${t('Delivery Fee', 'Frais de livraison')} : $${deliveryCost.toFixed(2)}<br><br>
      <strong>${t('Total Estimated Cost', 'Coût total estimé')} : $${totalCost.toFixed(2)}</strong>
    </div>
  `;
}
async function submitForm() {
    const robotCheck = document.getElementById('robot-check');
    if (!robotCheck.checked) {
        alert(t(
            "Please confirm you're not a robot.",
            "Veuillez confirmer que vous n’êtes pas un robot."
        ));
        return;
    }

    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const date = document.getElementById('event-date').value.trim();
    const tier = selectedTier;

    if (!name || !email || !date || !tier) {
        return alert(t(
            "Your form isn't fully complete. Please check your answers.",
            "Votre formulaire n’est pas entièrement rempli. Veuillez vérifier vos réponses."
        ));
    }

    const fullSummaryHTML = buildFullReviewSummaryHTML();

    const summaryContainer = document.getElementById('final-summary');
    if (summaryContainer) {
        summaryContainer.innerHTML = fullSummaryHTML;
        expandStepHeight('step-8');
    }

    const templateParams = {
        name: name,
        email: email,
        phone: document.getElementById('user-phone')?.value.trim() || '',
        event_date: document.getElementById('event-date')?.value.trim() || '',
        event_time: document.getElementById('event-time')?.value.trim() || '',
        guest_count: document.getElementById('guest-count')?.value.trim() || '',
        event_type: selectedEventType || '',
        event_type_other: document.getElementById('other-input')?.value.trim() || '',
        catering_tier: selectedTier || '',
        price_per_guest: document.getElementById('price-per-guest')?.innerText.trim() || '',
        meal_config_summary: buildMealSummary(),
        has_allergies: document.querySelector('input[name="has-allergies"]:checked')?.value || t('Not specified', 'Non précisé'),
        allergy_details: document.getElementById('allergy-details')?.value.trim() || '',
        location_type: document.querySelector('input[name="event-type"]:checked')?.value || '',
        event_address: document.getElementById('event-address')?.value.trim() || '',
        delivery: document.querySelector('input[name="needs-delivery"]:checked')?.value || t('Not specified', 'Non précisé'),
        notes: document.getElementById('extra-notes')?.value.trim() || '',
        full_summary_html: fullSummaryHTML
    };

    const submitBtn = document.querySelector('#submit-button');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = t("Submitting...", "Envoi en cours...");
        submitBtn.style.opacity = "0.6";
        submitBtn.style.pointerEvents = "none";
    }

    document.getElementById('final-summary').innerHTML = fullSummaryHTML;
    templateParams.full_summary_html = fullSummaryHTML;

    try {
        await emailjs.send("service_tt4o5fi", "template_erhq81f", templateParams);
        console.log("✅ Client confirmation sent");

        await emailjs.send("service_tt4o5fi", "template_4tllm7h", templateParams);
        console.log("✅ Staff notification sent");

        const confirmation = document.createElement('div');
        confirmation.id = 'confirmation';
        confirmation.className = 'accordion-step active';
        confirmation.style.marginTop = '2rem';
        confirmation.innerHTML = `
      <h3>✅ ${t('Your request has been submitted!', 'Votre demande a été envoyée!')}</h3>
      <div class="step-content active">
        <p style="font-size:1rem;">
          ${t(
            `Thank you, ${name}, for your inquiry. We've received your event details and meal selections, and our team will be in touch shortly.`,
            `Merci, ${name}, pour votre demande. Nous avons reçu les détails de votre événement et vos sélections de repas, et notre équipe vous contactera sous peu.`
        )}
        </p>
        <p>
          ${t(
            `A confirmation summary has been sent to <strong>${email}</strong>. Please check your inbox to review what you submitted.`,
            `Un résumé de confirmation a été envoyé à <strong>${email}</strong>. Veuillez vérifier votre boîte de réception pour revoir votre soumission.`
        )}
        </p>
        <p style="margin-top:1rem; font-size:0.95rem; color:#555;">
          <strong>${t('Note', 'Note')}:</strong> ${t(
            "This is <em>not</em> a finalized booking — it’s a confirmation that we’ve received your request. We’ll follow up to confirm availability and details.",
            "Ceci n’est <em>pas</em> une réservation finale — c’est une confirmation que nous avons reçu votre demande. Nous vous contacterons pour confirmer la disponibilité et les détails."
        )}
        </p>
        <p style="margin-top:1.5rem;">
          <strong>📞 ${t('Phone', 'Téléphone')}:</strong> +1 (514) 521-1301<br>
          <strong>📧 ${t('Email', 'Courriel')}:</strong> govindasMontreal@gmail.com
        </p>
        <p style="margin-top:1rem;">
          ${t(
            "We appreciate your interest in Govinda’s and look forward to serving you!",
            "Nous vous remercions de votre intérêt pour Govinda’s et avons hâte de vous servir!"
        )}
        </p>
      </div>
    `;

        document.getElementById('form-container').appendChild(confirmation);

        setTimeout(() => {
            scrollToStep('confirmation');
        }, 300);

    } catch (err) {
        console.error("❌ Email sending failed:", err);
        alert(t(
            "Oops — something went wrong submitting your inquiry. Please try again or call us directly.",
            "Oups — une erreur est survenue lors de l’envoi de votre demande. Veuillez réessayer ou nous appeler directement."
        ));
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = t("Submit", "Envoyer");
            submitBtn.style.opacity = "1";
            submitBtn.style.pointerEvents = "auto";
        }
    }
}
function expandStepHeight(stepId) {
    const step = document.getElementById(stepId);
    if (!step) return;

    const content = step.querySelector('.step-content');
    if (!content) return;

    content.style.maxHeight = content.scrollHeight + 'px';
}

function scrollToStep(stepId) {
    const el = document.getElementById(stepId);
    if (el) {
        setTimeout(() => {
            const offset = 100;
            const topPos = el.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: topPos, behavior: 'smooth' });
        }, 300);
    }
}

document.querySelectorAll('.accordion-step h3').forEach(header => {
    header.addEventListener('click', () => {
        const parentStep = header.parentElement;

        document.querySelectorAll('.accordion-step').forEach(step => {
            step.classList.remove('active');
        });

        parentStep.classList.add('active');
        scrollToStep(parentStep.id);
    });
});

function updateParallax() {
    document.querySelectorAll('.parallax').forEach(el => {
        const offset = window.pageYOffset;
        const scrollSpeed = 0.25;
        const imageOffset = -offset * scrollSpeed;
        el.style.backgroundPositionY = `${imageOffset}px`;
    });
}

window.addEventListener('scroll', updateParallax);

