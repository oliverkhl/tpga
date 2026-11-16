// --- MASTER STATE DECLARATIONS & BASELINES ---
let currentAnnualOpExAUD = null;
let ANNUAL_CONTAINERS = 12;
let currentOpExPerContainerAUD = null;

// Default OpEx Baseline Values for Reset Button
const defaultOpExValues = {
    "c1_1_input": null,
    "c1_2_input": null,
    "c1_3_input": null,
    "c1_4_input": null,
    "c1_5_input": null,
    "c1_6_input": null,
    "c1_7_input": null,
    "c1_8_input": null,
    "c2_1_input": null,
    "c2_2_input": null,
    "c2_3_input": null,
    "c3_1_base": null,
    "c3_1_wc": null,
    "c3_2_base": null,
    "c3_2_wc": null,
    "c4_1_mth_input": null,
    "c4_2_mth_input": null,
    "c4_3_mth_input": null,
    "c5_1_mth_input": null,
    "c5_2_mth_input": null,
    "c5_3_mth_input": null,
    "c5_4_mth_input": null,
    "c5_5_mth_input": null,
    "c6_1_ann_input": null,
    "c6_2_ann_input": null,
    "c6_3_ann_input": null,
    "c6_4_ann_input": null,
    "c7_1_ship_input": null,
    "c7_2_ship_input": null,
    "c7_3_ship_input": null,
    "c7_4_ship_input": null,
    "c7_5_ship_input": null
};

function getAudToUsdRate() {
    const val = parseFloat(document.getElementById('aud-usd-rate-input')?.value);
    return (!isNaN(val) && val > 0) ? val : tpgaNum('fxFallback');
}

// Shared staff session for this tab (Q1, Q1-1, B1, qc1).
function tpgaStaffSessionActive() {
    try {
        return sessionStorage.getItem('tpgaStaffAuth') === '1';
    } catch (err) {
        return false;
    }
}

function tpgaRememberStaffAuth() {
    try {
        sessionStorage.setItem('tpgaStaffAuth', '1');
    } catch (err) {}
    document.documentElement.classList.add('tpga-show-logout');
}

function tpgaApplyStaffUnlock() {
    const modal = document.getElementById('password-modal');
    const content = document.getElementById('page-content');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
    if (content) content.classList.remove('filter', 'blur-xl', 'pointer-events-none', 'select-none');
    const focused = document.activeElement;
    if (focused && modal && modal.contains(focused) && focused.blur) focused.blur();
    document.documentElement.classList.add('tpga-staff-auth', 'tpga-show-logout');
}

// --- PASSWORD & ACCESS CONTROL ---
function unlockPage(e) {
    if (e) e.preventDefault();
    const inputVal = document.getElementById('password-input')?.value;
    const errorMsg = document.getElementById('password-error');
    const modal = document.getElementById('password-modal');
    const content = document.getElementById('page-content');

    if (false) {
        tpgaRememberStaffAuth();
        if (modal) {
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => modal.style.display = 'none', 300);
        }
        if (content) content.classList.remove('filter', 'blur-xl', 'pointer-events-none', 'select-none');
        updateOpExFromInputs();
    } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('password-input');
    const icon = document.getElementById('eye-icon');
    const btn = document.getElementById('toggle-password-btn');
    if (!input || !icon) return;
    const showing = input.type === 'password';
    input.type = showing ? 'text' : 'password';
    icon.classList.toggle('fa-eye', !showing);
    icon.classList.toggle('fa-eye-slash', showing);
    if (btn) {
        btn.setAttribute('aria-pressed', showing ? 'true' : 'false');
        btn.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
    }
}

function initPasswordModalA11y() {
    const modal = document.getElementById('password-modal');
    if (!modal || modal.dataset.trapBound === '1') return;
    modal.dataset.trapBound = '1';
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        if (modal.style.display === 'none' || modal.classList.contains('pointer-events-none')) return;
        const focusable = [...modal.querySelectorAll('button, [href], input, select, textarea')]
            .filter((el) => !el.disabled && el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!modal.contains(document.activeElement)) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

function loadScriptOnce(src) {
    const existing = document.querySelector(`script[data-lazy-src="${src}"]`);
    if (existing && existing.dataset.loaded === '1') return Promise.resolve();
    if (existing && existing._loadPromise) return existing._loadPromise;
    const script = existing || document.createElement('script');
    const promise = new Promise((resolve, reject) => {
        script.addEventListener('load', () => {
            script.dataset.loaded = '1';
            resolve();
        }, { once: true });
        script.addEventListener('error', () => reject(new Error('Failed to load ' + src)), { once: true });
    });
    script._loadPromise = promise;
    if (!existing) {
        script.src = src;
        script.async = true;
        script.dataset.lazySrc = src;
        document.head.appendChild(script);
    }
    return promise;
}

let pdfLibsPromise = null;
function ensurePdfLibraries() {
    if (window.jspdf && window.jspdf.jsPDF && typeof html2canvas === 'function') {
        return Promise.resolve();
    }
    if (!pdfLibsPromise) {
        pdfLibsPromise = Promise.all([
            loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        ]).then(() => undefined).catch((err) => {
            pdfLibsPromise = null;
            throw err;
        });
    }
    return pdfLibsPromise;
}

// --- CONTAINER / SHIPMENT FREQUENCY HANDLER ---
function handleContainerTypeChange() {
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const c7_1_ship_input = document.getElementById('c7_1_ship_input');
    const c7_2_ship_input = document.getElementById('c7_2_ship_input');
    const annShipHeader = document.getElementById('c7-ann-shipments-hdr');

    if (containerType === '40ft') {
        if (c7_1_ship_input) c7_1_ship_input.value = 3222.40;
        if (c7_2_ship_input) c7_2_ship_input.value = 740.00;
        if (annShipHeader) {
            annShipHeader.innerHTML = `Annual (6 Shipments)<span class="km-sub text-[9.5px] text-gold-400">ប្រចាំឆ្នាំ (៦ ជើងដឹកជញ្ជូន)</span>`;
        }
    } else {
        if (c7_1_ship_input) c7_1_ship_input.value = 3479.64;
        if (c7_2_ship_input) c7_2_ship_input.value = 3223.00;
        if (annShipHeader) {
            annShipHeader.innerHTML = `Annual (12 Shipments)<span class="km-sub text-[9.5px] text-gold-400">ប្រចាំឆ្នាំ (១២ ជើងដឹកជញ្ជូន)</span>`;
        }
    }
    updateOpExFromInputs();
}

// --- CATEGORY TOGGLE STATE ---
function getCategoryState(catNum, rawSubtotal, suffix = '/yr') {
    const toggleEl = document.getElementById(`c${catNum}_toggle_input`);
    const isEnabled = toggleEl ? toggleEl.checked : true;
    const statusLabel = document.getElementById(`c${catNum}_toggle_status`);
    const containerEl = document.getElementById(`c${catNum}-card-container`);
    const headerEl = document.getElementById(`subtotal-c${catNum}-hdr`);

    if (statusLabel) {
        statusLabel.innerText = isEnabled ? 'ON' : 'OFF';
        statusLabel.className = isEnabled 
            ? 'ml-1.5 text-[10px] font-bold uppercase text-emerald-600' 
            : 'ml-1.5 text-[10px] font-bold uppercase text-slate-400';
    }

    if (headerEl) {
        if (isEnabled) {
            headerEl.innerText = '$' + rawSubtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + suffix;
            headerEl.className = (catNum === 3 ? "text-emerald-700" : "text-gold-800") + " font-mono font-bold text-xs";
        } else {
            headerEl.innerText = 'Off';
            headerEl.className = "text-slate-400 font-mono font-bold text-xs";
        }
    }

    if (containerEl) {
        if (isEnabled) {
            containerEl.classList.remove('opacity-70');
        } else {
            containerEl.classList.add('opacity-70');
        }
    }

    return isEnabled ? rawSubtotal : 0;
}

// --- MAIN OPEX RECALCULATION ENGINE ---
function updateOpExFromInputs() {
    // Category 1: Business Start Up Expense (One-Off Expense)
    const c1Items = [
        parseFloat(document.getElementById('c1_1_input')?.value) || 0,
        parseFloat(document.getElementById('c1_2_input')?.value) || 0,
        parseFloat(document.getElementById('c1_3_input')?.value) || 0,
        parseFloat(document.getElementById('c1_4_input')?.value) || 0,
        parseFloat(document.getElementById('c1_5_input')?.value) || 0,
        parseFloat(document.getElementById('c1_6_input')?.value) || 0,
        parseFloat(document.getElementById('c1_7_input')?.value) || 0,
        parseFloat(document.getElementById('c1_8_input')?.value) || 0
    ];

    const c1_raw_total = c1Items.reduce((sum, val) => sum + val, 0);
    if (document.getElementById('c1_ann_sub')) {
        document.getElementById('c1_ann_sub').innerText = '$' + c1_raw_total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    const c1_total = getCategoryState(1, c1_raw_total, '');

    // Category 2: Stated Fixed Overheads
    const c2_1_wk = parseFloat(document.getElementById('c2_1_input')?.value) || 0;
    const c2_2_wk = parseFloat(document.getElementById('c2_2_input')?.value) || 0;
    const c2_3_wk = parseFloat(document.getElementById('c2_3_input')?.value) || 0;
    const c2_1_ann = c2_1_wk * 52;
    const c2_2_ann = c2_2_wk * 52;
    const c2_3_ann = c2_3_wk * 52;

    if (document.getElementById('c2_1_mth')) document.getElementById('c2_1_mth').innerText = '$' + (c2_1_ann / 12).toFixed(2);
    if (document.getElementById('c2_1_ann')) document.getElementById('c2_1_ann').innerText = '$' + c2_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_2_mth')) document.getElementById('c2_2_mth').innerText = '$' + (c2_2_ann / 12).toFixed(2);
    if (document.getElementById('c2_2_ann')) document.getElementById('c2_2_ann').innerText = '$' + c2_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_3_mth')) document.getElementById('c2_3_mth').innerText = '$' + (c2_3_ann / 12).toFixed(2);
    if (document.getElementById('c2_3_ann')) document.getElementById('c2_3_ann').innerText = '$' + c2_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c2_raw_ann = c2_1_ann + c2_2_ann + c2_3_ann;
    if (document.getElementById('c2_wk_sub')) document.getElementById('c2_wk_sub').innerText = '$' + (c2_1_wk + c2_2_wk + c2_3_wk).toFixed(2);
    if (document.getElementById('c2_mth_sub')) document.getElementById('c2_mth_sub').innerText = '$' + (c2_raw_ann / 12).toFixed(2);
    if (document.getElementById('c2_ann_sub')) document.getElementById('c2_ann_sub').innerText = '$' + c2_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c2_ann = getCategoryState(2, c2_raw_ann);
    const c2_mth = c2_ann / 12;

    // Category 3: Personnel Overhead
    const c3_1_base = parseFloat(document.getElementById('c3_1_base')?.value) || 0;
    const c3_1_super = c3_1_base * tpgaNum('superRate');
    const c3_1_wc = parseFloat(document.getElementById('c3_1_wc')?.value) || 0;
    const c3_1_tot = c3_1_base + c3_1_super + c3_1_wc;

    const c3_2_base = parseFloat(document.getElementById('c3_2_base')?.value) || 0;
    const c3_2_super = c3_2_base * tpgaNum('superRate');
    const c3_2_wc = parseFloat(document.getElementById('c3_2_wc')?.value) || 0;
    const c3_2_tot = c3_2_base + c3_2_super + c3_2_wc;

    if (document.getElementById('c3_1_super')) document.getElementById('c3_1_super').innerText = '$' + c3_1_super.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_1_tot')) document.getElementById('c3_1_tot').innerText = '$' + c3_1_tot.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_2_super')) document.getElementById('c3_2_super').innerText = '$' + c3_2_super.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_2_tot')) document.getElementById('c3_2_tot').innerText = '$' + c3_2_tot.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c3_raw_ann = c3_1_tot + c3_2_tot;
    if (document.getElementById('c3_base_sub')) document.getElementById('c3_base_sub').innerText = '$' + (c3_1_base + c3_2_base).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_super_sub')) document.getElementById('c3_super_sub').innerText = '$' + (c3_1_super + c3_2_super).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_wc_sub')) document.getElementById('c3_wc_sub').innerText = '$' + (c3_1_wc + c3_2_wc).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_ann_sub')) document.getElementById('c3_ann_sub').innerText = '$' + c3_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c3_ann = getCategoryState(3, c3_raw_ann);
    const c3_mth = c3_ann / 12;

    // Category 4: Vehicle Running Expenses
    const c4_1_mth = parseFloat(document.getElementById('c4_1_mth_input')?.value) || 0;
    const c4_2_mth = parseFloat(document.getElementById('c4_2_mth_input')?.value) || 0;
    const c4_3_mth = parseFloat(document.getElementById('c4_3_mth_input')?.value) || 0;
    const c4_1_ann = c4_1_mth * 12;
    const c4_2_ann = c4_2_mth * 12;
    const c4_3_ann = c4_3_mth * 12;

    if (document.getElementById('c4_1_ann')) document.getElementById('c4_1_ann').innerText = '$' + c4_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c4_2_ann')) document.getElementById('c4_2_ann').innerText = '$' + c4_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c4_3_ann')) document.getElementById('c4_3_ann').innerText = '$' + c4_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c4_raw_ann = c4_1_ann + c4_2_ann + c4_3_ann;
    if (document.getElementById('c4_mth_sub')) document.getElementById('c4_mth_sub').innerText = '$' + (c4_1_mth + c4_2_mth + c4_3_mth).toFixed(2);
    if (document.getElementById('c4_ann_sub')) document.getElementById('c4_ann_sub').innerText = '$' + c4_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c4_ann = getCategoryState(4, c4_raw_ann);
    const c4_mth = c4_ann / 12;

    // Category 5: IT & SaaS Stack
    const c5_1_mth = parseFloat(document.getElementById('c5_1_mth_input')?.value) || 0;
    const c5_2_mth = parseFloat(document.getElementById('c5_2_mth_input')?.value) || 0;
    const c5_3_mth = parseFloat(document.getElementById('c5_3_mth_input')?.value) || 0;
    const c5_4_mth = parseFloat(document.getElementById('c5_4_mth_input')?.value) || 0;
    const c5_5_mth = parseFloat(document.getElementById('c5_5_mth_input')?.value) || 0;

    const c5_1_ann = c5_1_mth * 12;
    const c5_2_ann = c5_2_mth * 12;
    const c5_3_ann = c5_3_mth * 12;
    const c5_4_ann = c5_4_mth * 12;
    const c5_5_ann = c5_5_mth * 12;

    if (document.getElementById('c5_1_ann')) document.getElementById('c5_1_ann').innerText = '$' + c5_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c5_2_ann')) document.getElementById('c5_2_ann').innerText = '$' + c5_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c5_3_ann')) document.getElementById('c5_3_ann').innerText = '$' + c5_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c5_4_ann')) document.getElementById('c5_4_ann').innerText = '$' + c5_4_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c5_5_ann')) document.getElementById('c5_5_ann').innerText = '$' + c5_5_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c5_raw_ann = c5_1_ann + c5_2_ann + c5_3_ann + c5_4_ann + c5_5_ann;
    if (document.getElementById('c5_mth_sub')) document.getElementById('c5_mth_sub').innerText = '$' + (c5_1_mth + c5_2_mth + c5_3_mth + c5_4_mth + c5_5_mth).toFixed(2);
    if (document.getElementById('c5_ann_sub')) document.getElementById('c5_ann_sub').innerText = '$' + c5_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c5_ann = getCategoryState(5, c5_raw_ann);
    const c5_mth = c5_ann / 12;

    // Category 6: Business Insurance & Compliance
    const c6_1_ex = parseFloat(document.getElementById('c6_1_ann_input')?.value) || 0;
    const c6_2_ex = parseFloat(document.getElementById('c6_2_ann_input')?.value) || 0;
    const c6_3_ex = parseFloat(document.getElementById('c6_3_ann_input')?.value) || 0;
    const c6_4_ex = parseFloat(document.getElementById('c6_4_ann_input')?.value) || 0;

    if (document.getElementById('c6_1_inc_gst')) document.getElementById('c6_1_inc_gst').innerText = '$' + (c6_1_ex * 1.1).toFixed(2);
    if (document.getElementById('c6_2_inc_gst')) document.getElementById('c6_2_inc_gst').innerText = '$' + (c6_2_ex * 1.1).toFixed(2);
    if (document.getElementById('c6_3_inc_gst')) document.getElementById('c6_3_inc_gst').innerText = '$' + (c6_3_ex * 1.1).toFixed(2);
    if (document.getElementById('c6_4_inc_gst')) document.getElementById('c6_4_inc_gst').innerText = '$' + (c6_4_ex * 1.1).toFixed(2);

    const c6_raw_ann = c6_1_ex + c6_2_ex + c6_3_ex + c6_4_ex;
    if (document.getElementById('c6_ex_sub')) document.getElementById('c6_ex_sub').innerText = '$' + c6_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_inc_sub')) document.getElementById('c6_inc_sub').innerText = '$' + (c6_raw_ann * 1.1).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c6_ann = getCategoryState(6, c6_raw_ann);
    const c6_mth = c6_ann / 12;

    // Category 7: Import Freight Clearance & Customs
    const parseInputValue = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const val = parseFloat(el.value);
        return isNaN(val) ? 0 : val;
    };

    const c7_1_ship = parseInputValue('c7_1_ship_input');
    const c7_2_ship = parseInputValue('c7_2_ship_input');
    const c7_3_ship = parseInputValue('c7_3_ship_input');
    const c7_4_ship = parseInputValue('c7_4_ship_input');
    const c7_5_ship = parseInputValue('c7_5_ship_input');

    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    ANNUAL_CONTAINERS = containerType === '40ft' ? 6 : 12;

    const c7_1_ann = c7_1_ship * ANNUAL_CONTAINERS;
    const c7_2_ann = c7_2_ship * ANNUAL_CONTAINERS;
    const c7_3_ann = c7_3_ship * ANNUAL_CONTAINERS;
    const c7_4_ann = c7_4_ship * ANNUAL_CONTAINERS;
    const c7_5_ann = c7_5_ship * ANNUAL_CONTAINERS;

    if (document.getElementById('c7_1_ann')) document.getElementById('c7_1_ann').innerText = '$' + c7_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c7_2_ann')) document.getElementById('c7_2_ann').innerText = '$' + c7_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c7_3_ann')) document.getElementById('c7_3_ann').innerText = '$' + c7_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c7_4_ann')) document.getElementById('c7_4_ann').innerText = '$' + c7_4_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c7_5_ann')) document.getElementById('c7_5_ann').innerText = '$' + c7_5_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c7_ship_sub_total = c7_1_ship + c7_2_ship + c7_3_ship + c7_4_ship + c7_5_ship;
    const c7_raw_ann = c7_1_ann + c7_2_ann + c7_3_ann + c7_4_ann + c7_5_ann;

    if (document.getElementById('c7_ship_sub')) document.getElementById('c7_ship_sub').innerText = '$' + c7_ship_sub_total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c7_ann_sub')) document.getElementById('c7_ann_sub').innerText = '$' + c7_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c7_ann = getCategoryState(7, c7_raw_ann);
    const c7_mth = c7_ann / 12;

    // Grand Total OpEx (Category 1 is one-off so excluded from recurring monthly sum)
    const totalAnnualOpEx = c1_total + c2_ann + c3_ann + c4_ann + c5_ann + c6_ann + c7_ann;
    const totalMonthlyOpEx = c2_mth + c3_mth + c4_mth + c5_mth + c6_mth + c7_mth;
    const fxRate = getAudToUsdRate();

    currentAnnualOpExAUD = totalAnnualOpEx;
    currentOpExPerContainerAUD = totalAnnualOpEx / ANNUAL_CONTAINERS;

    if (document.getElementById('banner-opex-total')) {
        document.getElementById('banner-opex-total').innerText = totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    if (document.getElementById('banner-opex-total-usd')) {
        document.getElementById('banner-opex-total-usd').innerText = (totalAnnualOpEx * fxRate).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    const setSumRow = (catNum, mth, ann, isOneOff = false) => {
        const mthEl = document.getElementById(`sum-mth-c${catNum}`);
        const annEl = document.getElementById(`sum-ann-c${catNum}`);
        const pctEl = document.getElementById(`sum-pct-c${catNum}`);
        if (mthEl && !isOneOff) mthEl.innerText = '$' + mth.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (annEl) annEl.innerText = '$' + ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (pctEl) pctEl.innerText = (totalAnnualOpEx > 0 ? ((ann / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';
    };

    setSumRow(1, 0, c1_total, true);
    setSumRow(2, c2_mth, c2_ann);
    setSumRow(3, c3_mth, c3_ann);
    setSumRow(4, c4_mth, c4_ann);
    setSumRow(5, c5_mth, c5_ann);
    setSumRow(6, c6_mth, c6_ann);
    setSumRow(7, c7_mth, c7_ann);

    if (document.getElementById('sum-mth-total')) {
        document.getElementById('sum-mth-total').innerText = '$' + totalMonthlyOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    if (document.getElementById('sum-ann-total')) {
        document.getElementById('sum-ann-total').innerText = '$' + totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
}

// --- INDIVIDUAL BILINGUAL (EN + KM) CATEGORY PDF EXPORT ENGINE (WITH AUD & USD COLUMNS) ---
async function exportCategoryPDF(catNum) {
    const saved = await tpgaSaveRecord('B1', 'export_pdf');
    tpgaShowStatus(saved.ok ? 'Saved. Preparing the PDF.' : 'Could not save to Cloudflare (' + saved.message + '). The PDF will still download.', saved.ok);
    try {
        await ensurePdfLibraries();
    } catch (err) {
        alert('Could not load the PDF libraries. Check your connection and try again.');
        return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF || typeof html2canvas === 'undefined') {
        alert("PDF export libraries are still loading. Please try again in a moment.");
        return;
    }

    const fxRate = getAudToUsdRate();
    const fmt = (val) => '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtUsd = (audVal) => '$' + (audVal * fxRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const getVal = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const getTxt = (id) => document.getElementById(id)?.innerText || '';
    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

    const isEnabled = document.getElementById(`c${catNum}_toggle_input`)?.checked ?? true;
    const statusText = isEnabled
        ? 'ACTIVE (INCLUDED IN BUDGET) / សកម្ម (រួមបញ្ចូលក្នុងថវិកា)'
        : 'DISABLED (EXCLUDED FROM BUDGET) / បិទ (មិនរួមបញ្ចូលក្នុងថវិកា)';
    const todayStr = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    const expDate = document.getElementById(`c${catNum}_expense_date`)?.value || 'Not Specified / មិនបានបញ្ជាក់';
    const preparedByRaw = document.getElementById('prepared-by-input')?.value?.trim();
    const preparedByDisplay = preparedByRaw ? escapeHtml(preparedByRaw) : '____________________________';

    const thCell = (en, km, align = 'left') => `
        <th style="padding: 9px 10px; text-align: ${align}; background-color: #1E293B; color: #FFFFFF; font-size: 10.5px; font-weight: 700; border: 1px solid #334155; vertical-align: top;">
            <div>${en}</div>
            <div style="font-family: 'Noto Sans Khmer', sans-serif; color: #E6C655; font-size: 10px; font-weight: 500; margin-top: 2px;">${km}</div>
        </th>
    `;

    const tdLabel = (en, km, subEn = '', subKm = '') => `
        <td style="padding: 8px 10px; text-align: left; border: 1px solid #CBD5E1; color: #1E293B; font-size: 11px; font-weight: 600;">
            <div>${en}</div>
            <div style="font-family: 'Noto Sans Khmer', sans-serif; color: #475569; font-size: 10.5px; font-weight: 400; margin-top: 2px;">${km}</div>
            ${subEn ? `<div style="color: #64748B; font-size: 9.5px; font-weight: 400; margin-top: 3px;">${subEn} — <span style="font-family: 'Noto Sans Khmer', sans-serif;">${subKm}</span></div>` : ''}
        </td>
    `;

    const tdNum = (val, bold = false, isUsd = false) => `
        <td style="padding: 8px 10px; text-align: right; border: 1px solid #CBD5E1; color: ${isUsd ? '#065F46' : '#1E293B'}; background-color: ${isUsd ? '#F0FDF4' : 'transparent'}; font-family: monospace; font-size: 11.5px; font-weight: ${bold ? '700' : '500'}; white-space: nowrap;">
            ${val}
        </td>
    `;

    let catTitleEn = '';
    let catTitleKm = '';
    const metaLine = `Expense Date / កាលបរិច្ឆេទចំណាយ៖ <strong>${escapeHtml(expDate)}</strong> &nbsp;|&nbsp; FX Rate / អត្រាប្តូរប្រាក់៖ <strong>1 AUD = ${fxRate.toFixed(4)} USD</strong> &nbsp;|&nbsp; Generated / បង្កើតនៅថ្ងៃ៖ ${todayStr} &nbsp;|&nbsp; ${statusText}`;
    let theadHTML = '';
    let tbodyHTML = '';
    let tfootHTML = '';

    if (catNum === 1) {
        catTitleEn = 'Category 1: Business Start Up Expense (One-Off — incl. GST)';
        catTitleKm = 'ប្រភេទទី ១៖ ចំណាយចាប់ផ្តើមអាជីវកម្ម (ចំណាយម្តងគត់ — រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Line Item', 'បរិយាយមុខទំនិញ/សេវា', 'left')}
            ${thCell('One-Off AUD (incl. GST)', 'ចំណាយម្តងគត់ AUD', 'right')}
            ${thCell('One-Off USD', 'ចំណាយម្តងគត់ USD', 'right')}
        </tr>`;
        const items = [
            ['1. ABN/ACN Registration', '១. ការចុះបញ្ជី ABN/ACN', getVal('c1_1_input')],
            ['2. Accounting Fee', '២. កម្រៃសេវាគណនេយ្យ', getVal('c1_2_input')],
            ['3. Business Structure Lawyer Fee', '៣. កម្រៃមេធាវីរៀបចំរចនាសម្ព័ន្ធអាជីវកម្ម', getVal('c1_3_input')],
            ['4. Business Transport Expenses', '៤. ចំណាយធ្វើដំណើរអាជីវកម្ម', getVal('c1_4_input')],
            ['5. Business Meeting Expenses', '៥. ចំណាយប្រជុំអាជីវកម្ម', getVal('c1_5_input')],
            ['6. Business Events Expenses', '៦. ចំណាយចូលរួមព្រឹត្តិការណ៍អាជីវកម្ម', getVal('c1_6_input')],
            ['7. Business Online Setup Expense', '៧. ចំណាយរៀបចំប្រព័ន្ធអនឡាញអាជីវកម្ម', getVal('c1_7_input')],
            ['8. Permit and Licence Expense', '៨. ចំណាយលិខិតអនុញ្ញាត និងអាជ្ញាប័ណ្ណ', getVal('c1_8_input')]
        ];
        const totalAud = items.reduce((s, r) => s + r[2], 0);
        tbodyHTML = items.map(r => `<tr>${tdLabel(r[0], r[1])}${tdNum(fmt(r[2]), true)}${tdNum(fmtUsd(r[2]), true, true)}</tr>`).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1; color: #9B7817; font-weight: 700; font-size: 11.5px;">
                    <div>Subtotal (incl. GST)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST)</div>
                </td>
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #9B7817; font-family: monospace; font-weight: 700; font-size: 12.5px;">
                    ${getTxt('c1_ann_sub')}
                </td>
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 12.5px;">
                    ${fmtUsd(totalAud)}
                </td>
            </tr>
        `;
    } else if (catNum === 2) {
        catTitleEn = 'Category 2: Stated Fixed Overheads (incl. GST)';
        catTitleKm = 'ប្រភេទទី ២៖ ចំណាយថេរប្រចាំ (រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Line Item', 'បរិយាយមុខទំនិញ/សេវា', 'left')}
            ${thCell('Weekly AUD', 'ប្រចាំសប្តាហ៍', 'right')}
            ${thCell('Monthly AUD', 'ប្រចាំខែ', 'right')}
            ${thCell('Annual AUD', 'ប្រចាំឆ្នាំ AUD', 'right')}
            ${thCell('Annual USD', 'ប្រចាំឆ្នាំ USD', 'right')}
        </tr>`;
        const rows = [
            ['Office Rent', 'ឈ្នួលការិយាល័យ', getVal('c2_1_input')],
            ['Storage Unit / Small Warehouse', 'ឃ្លាំងស្តុកទំនិញខ្នាតតូច', getVal('c2_2_input')],
            ['Commercial Vehicle Rental', 'ការជួលរថយន្តពាណិជ្ជកម្ម', getVal('c2_3_input')]
        ];
        const totalAud = rows.reduce((s, r) => s + r[2] * 52, 0);
        tbodyHTML = rows.map(r => {
            const ann = r[2] * 52;
            return `<tr>${tdLabel(r[0], r[1])}${tdNum(fmt(r[2]))}${tdNum(fmt(ann / 12))}${tdNum(fmt(ann), true)}${tdNum(fmtUsd(ann), true, true)}</tr>`;
        }).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9; font-weight: 700; color: #9B7817;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1;">
                    <div>Subtotal (incl. GST)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST)</div>
                </td>
                ${tdNum(getTxt('c2_wk_sub'), true)}${tdNum(getTxt('c2_mth_sub'), true)}${tdNum(getTxt('c2_ann_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 12px;">
                    ${fmtUsd(totalAud)}
                </td>
            </tr>
        `;
    } else if (catNum === 3) {
        catTitleEn = 'Category 3: Executive & Operational Personnel Overhead (incl. GST)';
        catTitleKm = 'ប្រភេទទី ៣៖ ចំណាយលើបុគ្គលិកប្រតិបត្តិ និងប្រតិបត្តិការ (រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Role / Position', 'តួនាទី / មុខតំណែង', 'left')}
            ${thCell('Base AUD', 'ប្រាក់ខែគោល', 'right')}
            ${thCell('Super (12%)', 'ប្រាក់សោធន', 'right')}
            ${thCell('WorkCover', 'ធានារ៉ាប់រងការងារ', 'right')}
            ${thCell('Annual AUD', 'សរុប AUD', 'right')}
            ${thCell('Annual USD', 'សរុប USD', 'right')}
        </tr>`;
        const b1 = getVal('c3_1_base'), wc1 = getVal('c3_1_wc'), tot1 = b1 + (b1 * tpgaNum('superRate')) + wc1;
        const b2 = getVal('c3_2_base'), wc2 = getVal('c3_2_wc'), tot2 = b2 + (b2 * tpgaNum('superRate')) + wc2;
        const totalAud = tot1 + tot2;
        const rows = [
            ['Managing Director', 'នាយកគ្រប់គ្រង', fmt(b1), getTxt('c3_1_super'), fmt(wc1), tot1],
            ['Operations Manager', 'ប្រធានគ្រប់គ្រងប្រតិបត្តិការ', fmt(b2), getTxt('c3_2_super'), fmt(wc2), tot2]
        ];
        tbodyHTML = rows.map(r => `<tr>${tdLabel(r[0], r[1])}${tdNum(r[2])}${tdNum(r[3])}${tdNum(r[4])}${tdNum(fmt(r[5]), true)}${tdNum(fmtUsd(r[5]), true, true)}</tr>`).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9; font-weight: 700; color: #9B7817;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1;">
                    <div>Subtotal (incl. GST)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST)</div>
                </td>
                ${tdNum(getTxt('c3_base_sub'), true)}${tdNum(getTxt('c3_super_sub'), true)}${tdNum(getTxt('c3_wc_sub'), true)}${tdNum(getTxt('c3_ann_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 12px;">
                    ${fmtUsd(totalAud)}
                </td>
            </tr>
        `;
    } else if (catNum === 4) {
        catTitleEn = 'Category 4: Vehicle Running Expenses (incl. GST)';
        catTitleKm = 'ប្រភេទទី ៤៖ ចំណាយប្រតិបត្តិការយានយន្ត (រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Expense Description', 'បរិយាយចំណាយ', 'left')}
            ${thCell('Monthly AUD', 'ប្រចាំខែ (AUD)', 'right')}
            ${thCell('Annual AUD', 'សរុបប្រចាំឆ្នាំ AUD', 'right')}
            ${thCell('Annual USD', 'សរុបប្រចាំឆ្នាំ USD', 'right')}
        </tr>`;
        const rows = [
            ['Fuel (Unleaded / Diesel)', 'ប្រេងឥន្ធនៈ (សាំង / ម៉ាស៊ូត)', getVal('c4_1_mth_input')],
            ['Transurban Tolls', 'ថ្លៃផ្លូវល្បឿនលឿន (Transurban Tolls)', getVal('c4_2_mth_input')],
            ['Vehicle Maintenance', 'ការថែទាំ និងជួសជុលរថយន្ត', getVal('c4_3_mth_input')]
        ];
        const totalAud = rows.reduce((s, r) => s + r[2] * 12, 0);
        tbodyHTML = rows.map(r => {
            const ann = r[2] * 12;
            return `<tr>${tdLabel(r[0], r[1])}${tdNum(fmt(r[2]))}${tdNum(fmt(ann), true)}${tdNum(fmtUsd(ann), true, true)}</tr>`;
        }).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9; font-weight: 700; color: #9B7817;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1;">
                    <div>Subtotal (incl. GST)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST)</div>
                </td>
                ${tdNum(getTxt('c4_mth_sub'), true)}${tdNum(getTxt('c4_ann_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 12px;">
                    ${fmtUsd(totalAud)}
                </td>
            </tr>
        `;
    } else if (catNum === 5) {
        catTitleEn = 'Category 5: IT, Communications & SaaS Stack (incl. GST)';
        catTitleKm = 'ប្រភេទទី ៥៖ បច្ចេកវិទ្យា ទំនាក់ទំនង និងកម្មវិធី SaaS (រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Software / Service', 'កម្មវិធី / សេវាកម្ម', 'left')}
            ${thCell('Monthly AUD', 'ប្រចាំខែ (AUD)', 'right')}
            ${thCell('Annual AUD', 'សរុបប្រចាំឆ្នាំ AUD', 'right')}
            ${thCell('Annual USD', 'សរុបប្រចាំឆ្នាំ USD', 'right')}
        </tr>`;
        const rows = [
            ['Telecoms & Mobile Services', 'សេវាទូរគមនាគមន៍ និងទូរស័ព្ទចល័ត', getVal('c5_1_mth_input')],
            ['E-Commerce Platform', 'ប្រព័ន្ធពាណិជ្ជកម្មអេឡិចត្រូនិក (E-Commerce)', getVal('c5_2_mth_input')],
            ['Email & Productivity', 'អ៊ីមែល និងកម្មវិធីការងារ', getVal('c5_3_mth_input')],
            ['Accounting & ERP Integration', 'ប្រព័ន្ធគណនេយ្យ និង ERP', getVal('c5_4_mth_input')],
            ['Inventory Management Software', 'កម្មវិធីគ្រប់គ្រងស្តុកទំនិញ', getVal('c5_5_mth_input')]
        ];
        const totalAud = rows.reduce((s, r) => s + r[2] * 12, 0);
        tbodyHTML = rows.map(r => {
            const ann = r[2] * 12;
            return `<tr>${tdLabel(r[0], r[1])}${tdNum(fmt(r[2]))}${tdNum(fmt(ann), true)}${tdNum(fmtUsd(ann), true, true)}</tr>`;
        }).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9; font-weight: 700; color: #9B7817;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1;">
                    <div>Subtotal (incl. GST)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST)</div>
                </td>
                ${tdNum(getTxt('c5_mth_sub'), true)}${tdNum(getTxt('c5_ann_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 12px;">
                    ${fmtUsd(totalAud)}
                </td>
            </tr>
        `;
    } else if (catNum === 6) {
        catTitleEn = 'Category 6: Business Insurance & Compliance (incl. GST)';
        catTitleKm = 'ប្រភេទទី ៦៖ ធានារ៉ាប់រងអាជីវកម្ម និងអនុលោមភាព (រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Service / Policy Type', 'ប្រភេទសេវាកម្ម / ប័ណ្ណសន្យារ៉ាប់រង', 'left')}
            ${thCell('Annual ex GST AUD', 'ប្រចាំឆ្នាំ មិនរួម GST', 'right')}
            ${thCell('inc GST (10%) AUD', 'រួម GST AUD', 'right')}
            ${thCell('inc GST USD', 'រួម GST USD', 'right')}
        </tr>`;
        const rows = [
            ['Accounting & Tax Compliance Fee', 'កម្រៃសេវាគណនេយ្យ និងអនុលោមភាពពន្ធ', getVal('c6_1_ann_input')],
            ['Public & Products Liability', 'ធានារ៉ាប់រងទំនួលខុសត្រូវសាធារណៈ និងផលិតផល', getVal('c6_2_ann_input')],
            ['Marine Cargo / Transit Insurance', 'ធានារ៉ាប់រងទំនិញតាមផ្លូវសមុទ្រ / ដឹកជញ្ជូន', getVal('c6_3_ann_input')],
            ['Management Liability & Cyber', 'ធានារ៉ាប់រងទំនួលខុសត្រូវគ្រប់គ្រង និងសុវត្ថិភាពតាមអ៊ីនធឺណិត', getVal('c6_4_ann_input')]
        ];
        const totalIncGstAud = rows.reduce((s, r) => s + r[2] * 1.1, 0);
        tbodyHTML = rows.map(r => {
            const incGst = r[2] * 1.1;
            return `<tr>${tdLabel(r[0], r[1])}${tdNum(fmt(r[2]))}${tdNum(fmt(incGst), true)}${tdNum(fmtUsd(incGst), true, true)}</tr>`;
        }).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9; font-weight: 700; color: #9B7817;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1;">
                    <div>Subtotal (incl. GST)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST)</div>
                </td>
                ${tdNum(getTxt('c6_ex_sub'), true)}${tdNum(getTxt('c6_inc_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 12px;">
                    ${fmtUsd(totalIncGstAud)}
                </td>
            </tr>
        `;
    } else if (catNum === 7) {
        const containerType = document.getElementById('input-container-type')?.value || '20ft';
        const shipmentsCount = containerType === '40ft' ? 6 : 12;
        const shipmentsEn = containerType === '40ft' ? 'Annual AUD (6 Shipments)' : 'Annual AUD (12 Shipments)';
        const shipmentsKm = containerType === '40ft' ? 'ប្រចាំឆ្នាំ AUD (៦ ជើង)' : 'ប្រចាំឆ្នាំ AUD (១២ ជើង)';
        catTitleEn = `Category 7: Import Freight Clearance & Customs (${containerType.toUpperCase()} — incl. GST)`;
        catTitleKm = 'ប្រភេទទី ៧៖ ការបញ្ចេញទំនិញនាំចូល និងគយ (រួមបញ្ចូល GST)';
        theadHTML = `<tr>
            ${thCell('Service Component', 'ផ្នែកនៃសេវាកម្ម', 'left')}
            ${thCell('Per Shipment AUD', 'ក្នុងមួយជើង AUD', 'right')}
            ${thCell('Per Shipment USD', 'ក្នុងមួយជើង USD', 'right')}
            ${thCell(shipmentsEn, shipmentsKm, 'right')}
            ${thCell('Annual USD', 'ប្រចាំឆ្នាំ USD', 'right')}
        </tr>`;
        const rows = [
            ['Local Charges & GST', 'ថ្លៃសេវាក្នុងស្រុក និង GST', 'Handling fees + local GST', 'ថ្លៃលើកដាក់ទំនិញ + ពន្ធ GST ក្នុងស្រុក', getVal('c7_1_ship_input')],
            ['Warehouse Services & GST', 'សេវាកម្មឃ្លាំង និង GST', 'Unpacking, 38 pallets, storage, admin + GST', 'ការរើទំនិញ ប៉ាឡែត ៣៨ ការស្តុកទុក រដ្ឋបាល + GST', getVal('c7_2_ship_input')],
            ['Customs Duty', 'ពន្ធគយនាំចូល', 'Waived via valid Free Trade Agreement certificate', 'លើកលែងពន្ធតាមវិញ្ញាបនបត្រកិច្ចព្រមព្រៀងពាណិជ្ជកម្មសេរី (FTA)', getVal('c7_3_ship_input')],
            ['Import GST', 'ពន្ធ GST នាំចូល', 'Recalculated at 10% of VoTI (CIF value + freight)', 'គណនា 10% លើតម្លៃ VoTI (តម្លៃ CIF + ថ្លៃដឹកជញ្ជូន)', getVal('c7_4_ship_input')],
            ['Electronic Entry Fee', 'កម្រៃប្រតិវេទន៍អេឡិចត្រូនិក', 'Tiered fee for higher-value consignments', 'កម្រៃតាមកម្រិតសម្រាប់ទំនិញតម្លៃខ្ពស់', getVal('c7_5_ship_input')]
        ];
        const totalShipAud = rows.reduce((s, r) => s + r[4], 0);
        const totalAnnAud = totalShipAud * shipmentsCount;
        tbodyHTML = rows.map(r => {
            const ann = r[4] * shipmentsCount;
            return `<tr>${tdLabel(r[0], r[1], r[2], r[3])}${tdNum(fmt(r[4]))}${tdNum(fmtUsd(r[4]), false, true)}${tdNum(fmt(ann), true)}${tdNum(fmtUsd(ann), true, true)}</tr>`;
        }).join('');
        tfootHTML = `
            <tr style="background-color: #F1F5F9; font-weight: 700; color: #9B7817;">
                <td style="padding: 9px 10px; border: 1px solid #CBD5E1;">
                    <div>Subtotal (incl. GST, excl. Ocean & Duty)</div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px;">សរុបរង (រួមបញ្ចូល GST មិនរួមថ្លៃដឹកតាមសមុទ្រ និងពន្ធគយ)</div>
                </td>
                ${tdNum(getTxt('c7_ship_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 11.5px;">
                    ${fmtUsd(totalShipAud)}
                </td>
                ${tdNum(getTxt('c7_ann_sub'), true)}
                <td style="padding: 9px 10px; text-align: right; border: 1px solid #CBD5E1; color: #065F46; background-color: #DCFCE7; font-family: monospace; font-weight: 700; font-size: 11.5px;">
                    ${fmtUsd(totalAnnAud)}
                </td>
            </tr>
        `;
    }

    // Create temporary high-DPI container for native browser Khmer rendering
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '820px';
    container.style.backgroundColor = '#FFFFFF';
    container.style.fontFamily = "'Inter', 'Noto Sans Khmer', sans-serif";
    container.style.color = '#1E293B';

    container.innerHTML = `
        <div style="background-color: #1E293B; padding: 24px 32px; border-bottom: 4px solid #D4AF37; color: #FFFFFF;">
            <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.5px;">TWO PARROTS GROUP AUSTRALIA PTY LTD</div>
            <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 13px; color: #E6C655; margin-top: 3px;">ក្រុមហ៊ុន ថូ ផារ៉ត គ្រុប អូស្ត្រាលី ភីធីវ៉ាយ អិលធីឌី</div>
            <div style="font-size: 10.5px; color: #CBD5E1; margin-top: 8px;">
                ABN: 79699476107 &nbsp;|&nbsp; 1/57 Elonera Rd, Noble Park North, VIC 3174, Australia
            </div>
            <div style="font-size: 10.5px; color: #CBD5E1; margin-top: 2px;">
                Email: info@twoparrotsgroup.com.au &nbsp;|&nbsp; Tel: 0468829988
            </div>
        </div>

        <div style="padding: 24px 32px;">
            <div style="font-size: 15px; font-weight: 700; color: #0F172A;">${catTitleEn}</div>
            <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 13px; color: #334155; margin-top: 2px;">${catTitleKm}</div>
            <div style="font-size: 10px; color: #475569; margin-top: 6px; padding-bottom: 12px; border-bottom: 1px solid #E2E8F0;">
                ${metaLine}
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 14px;">
                <thead>${theadHTML}</thead>
                <tbody>${tbodyHTML}</tbody>
                <tfoot>${tfootHTML}</tfoot>
            </table>

            <!-- PREPARED BY & AUTHORISATION SIGNATURE BLOCK -->
            <div style="display: flex; justify-content: space-between; gap: 24px; margin-top: 32px;">
                <!-- Prepared By Column -->
                <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; padding: 14px 16px; background-color: #F8FAFC;">
                    <div style="font-size: 11px; font-weight: 700; color: #0F172A; text-transform: uppercase;">
                        Prepared By
                    </div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px; color: #475569; margin-top: 1px;">
                        រៀបចំដោយ
                    </div>

                    <div style="margin-top: 14px; font-size: 12px; color: #1E293B;">
                        <span style="font-weight: 600;">Name / ឈ្មោះ៖</span>
                        <span style="font-weight: 700; color: #0F172A; margin-left: 4px;">${preparedByDisplay}</span>
                    </div>

                    <div style="margin-top: 34px; border-top: 1px solid #64748B; padding-top: 5px; font-size: 10.5px; color: #475569;">
                        Signature / ហត្ថលេខា
                    </div>

                    <div style="margin-top: 12px; font-size: 10.5px; color: #475569;">
                        Date / កាលបរិច្ឆេទ៖ ${todayStr}
                    </div>
                </div>

                <!-- Authorised & Approved By Column -->
                <div style="flex: 1; border: 1px solid #CBD5E1; border-radius: 8px; padding: 14px 16px; background-color: #F8FAFC;">
                    <div style="font-size: 11px; font-weight: 700; color: #0F172A; text-transform: uppercase;">
                        Authorised & Approved By
                    </div>
                    <div style="font-family: 'Noto Sans Khmer', sans-serif; font-size: 10.5px; color: #475569; margin-top: 1px;">
                        អនុម័ត និងយល់ព្រមលើការចំណាយដោយ
                    </div>

                    <div style="margin-top: 14px; font-size: 11px; color: #475569;">
                        Name & Title / ឈ្មោះ និងតួនាទី៖ _____________________
                    </div>

                    <div style="margin-top: 34px; border-top: 1px solid #64748B; padding-top: 5px; font-size: 10.5px; color: #475569;">
                        Authorised Signature / ហត្ថលេខាអ្នកអនុម័ត
                    </div>

                    <div style="margin-top: 12px; font-size: 10.5px; color: #475569;">
                        Approval Date / កាលបរិច្ឆេទអនុម័ត៖ ____ / ____ / 20____
                    </div>
                </div>
            </div>

            <div style="margin-top: 18px; font-size: 10px; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 10px;">
                Two Parrots Group Australia Pty Ltd — Business Budget Plan (AUD incl. GST | 1 AUD = ${fxRate.toFixed(4)} USD) &nbsp;|&nbsp;
                <span style="font-family: 'Noto Sans Khmer', sans-serif;">ក្រុមហ៊ុន ថូ ផារ៉ត គ្រុប អូស្ត្រាលី (រួមបញ្ចូល GST)</span>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    try {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#FFFFFF'
        });

        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight <= pageHeight) {
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            const scaleFactor = pageHeight / imgHeight;
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth * scaleFactor, pageHeight);
        }

        doc.save(`TwoParrots_Business_Budget_Plan_Category_${catNum}.pdf`);
    } finally {
        document.body.removeChild(container);
    }
}

// --- RESET BUDGET TO BASELINE ---
function resetOpExBudget() {
    Object.keys(defaultOpExValues).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = defaultOpExValues[id];
    });

    [1, 2, 3, 4, 5, 6, 7].forEach(i => {
        const dateInput = document.getElementById(`c${i}_expense_date`);
        if (dateInput) dateInput.value = '';
    });

    const preparedByInput = document.getElementById('prepared-by-input');
    if (preparedByInput) preparedByInput.value = '';

    const fxInput = document.getElementById('aud-usd-rate-input');
    if (fxInput) fxInput.value = String(tpgaNum('fxFallback'));

    [1, 2, 4, 5, 6, 7].forEach(i => {
        const toggle = document.getElementById(`c${i}_toggle_input`);
        if (toggle) toggle.checked = true;
    });
    const c3Toggle = document.getElementById('c3_toggle_input');
    if (c3Toggle) c3Toggle.checked = false;

    const containerSelect = document.getElementById('input-container-type');
    if (containerSelect) containerSelect.value = '20ft';

    handleContainerTypeChange();
}

// --- INITIALIZATION ON PAGE LOAD ---
async function tpgaBoot() {
    try {
        const loaded = await tpgaHydratePage('B1', { defaults: defaultOpExValues });
        currentAnnualOpExAUD = loaded.engine.currentAnnualOpExAUD;
        currentOpExPerContainerAUD = currentAnnualOpExAUD / ANNUAL_CONTAINERS;
    } catch (err) {
        tpgaShowStatus('Could not load prices from Cloudflare. ' + err.message, false);
        return;
    }
    updateOpExFromInputs();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tpgaBoot);
else tpgaBoot();


async function exportBudgetPDF() {
    try {
        await ensurePdfLibraries();
    } catch (err) {
        alert('Could not load the PDF libraries. Check your connection and try again.');
        return;
    }
    const target = document.getElementById('page-content');
    const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const img = canvas.toDataURL('image/png');
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    doc.addImage(img, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
        position -= pageHeight;
        doc.addPage();
        doc.addImage(img, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
    }
    doc.save('TwoParrots_Business_Budget_Plan.pdf');
}
window.exportBudgetPDF = exportBudgetPDF;
