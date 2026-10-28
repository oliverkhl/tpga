// --- DYNAMIC OPEX BUDGET ENGINE STATE ---
let currentAnnualOpExAUD = 280435.00;
let ANNUAL_CONTAINERS = 12; // Default: 12 x 20ft FCL Shipments per year
let currentOpExPerContainerAUD = currentAnnualOpExAUD / ANNUAL_CONTAINERS;
let containerOverCapacityAlertShown = false; // Tracks alert state to prevent repeated triggers

// Default OpEx Baseline Values for Reset Button
const defaultOpExValues = {
    c1_1_input: 60.00,
    c1_2_input: 130.00,
    c1_3_input: 444.00,
    c2_1_base: 110000.00,
    c2_1_wc: 2200.00,
    c2_2_base: 84000.00,
    c2_2_wc: 2440.00,
    c3_1_mth_input: 260.00,
    c3_2_mth_input: 85.00,
    c3_3_mth_input: 40.00,
    c4_1_mth_input: 160.00,
    c4_2_mth_input: 55.00,
    c4_3_mth_input: 30.00,
    c4_4_mth_input: 90.00,
    c4_5_mth_input: 70.00,
    c5_1_ann_input: 177.00,
    c5_2_ann_input: 1800.00,
    c5_3_ann_input: 1500.00,
    c5_4_ann_input: 1860.00,
    c6_1_ship_input: 475.00,  // Synchronized Customs Admin Baseline
    c6_2_ship_input: 450.00,  // Synchronized Port Handling Benchmark
    c6_3_ship_input: 750.00   // Synchronized Wharf Cartage (tied to input-cartage)
};

// --- REAL-TIME OPEX CALCULATOR & RE-ALLOCATION WITH TOGGLE SWITCHES FOR ALL CATEGORIES ---
function updateOpExFromInputs() {
    function getCategoryState(catNum, rawAnnualSubtotal) {
        const toggleEl = document.getElementById(`c${catNum}_toggle_input`);
        const isEnabled = toggleEl ? toggleEl.checked : true;
        const statusLabel = document.getElementById(`c${catNum}_toggle_status`);
        const containerEl = document.getElementById(`c${catNum}-card-container`);
        const headerEl = document.getElementById(`subtotal-c${catNum}-hdr`);

        if (statusLabel) {
            statusLabel.innerText = isEnabled ? 'ON' : 'OFF';
            statusLabel.className = isEnabled 
                ? 'ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600' 
                : 'ml-2 text-[10px] font-bold uppercase tracking-wider text-slate-400';
        }

        if (headerEl) {
            if (isEnabled) {
                headerEl.innerText = '$' + rawAnnualSubtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '/yr';
                headerEl.className = (catNum === 2 ? "text-emerald-700" : "text-gold-700") + " font-mono font-bold text-xs";
            } else {
                headerEl.innerText = '$0.00/yr (OFF)';
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

        return isEnabled ? rawAnnualSubtotal : 0;
    }

    // Category 1
    const c1_1_wk = parseFloat(document.getElementById('c1_1_input')?.value) || 0;
    const c1_2_wk = parseFloat(document.getElementById('c1_2_input')?.value) || 0;
    const c1_3_wk = parseFloat(document.getElementById('c1_3_input')?.value) || 0;

    const c1_1_ann = c1_1_wk * 52;
    const c1_2_ann = c1_2_wk * 52;
    const c1_3_ann = c1_3_wk * 52;

    if (document.getElementById('c1_1_mth')) document.getElementById('c1_1_mth').innerText = '$' + (c1_1_ann / 12).toFixed(2);
    if (document.getElementById('c1_1_ann')) document.getElementById('c1_1_ann').innerText = '$' + c1_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c1_2_mth')) document.getElementById('c1_2_mth').innerText = '$' + (c1_2_ann / 12).toFixed(2);
    if (document.getElementById('c1_2_ann')) document.getElementById('c1_2_ann').innerText = '$' + c1_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c1_3_mth')) document.getElementById('c1_3_mth').innerText = '$' + (c1_3_ann / 12).toFixed(2);
    if (document.getElementById('c1_3_ann')) document.getElementById('c1_3_ann').innerText = '$' + c1_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c1_raw_ann_sub = c1_1_ann + c1_2_ann + c1_3_ann;
    const c1_wk_sub = c1_1_wk + c1_2_wk + c1_3_wk;
    if (document.getElementById('c1_wk_sub')) document.getElementById('c1_wk_sub').innerText = '$' + c1_wk_sub.toFixed(2);
    if (document.getElementById('c1_mth_sub')) document.getElementById('c1_mth_sub').innerText = '$' + (c1_raw_ann_sub / 12).toFixed(2);
    if (document.getElementById('c1_ann_sub')) document.getElementById('c1_ann_sub').innerText = '$' + c1_raw_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c1_ann_sub = getCategoryState(1, c1_raw_ann_sub);
    const c1_mth_sub = c1_ann_sub / 12;

    // Category 2
    const c2_1_base = parseFloat(document.getElementById('c2_1_base')?.value) || 0;
    const c2_1_super = c2_1_base * 0.115;
    const c2_1_wc = parseFloat(document.getElementById('c2_1_wc')?.value) || 0;
    const c2_1_tot = c2_1_base + c2_1_super + c2_1_wc;

    const c2_2_base = parseFloat(document.getElementById('c2_2_base')?.value) || 0;
    const c2_2_super = c2_2_base * 0.115;
    const c2_2_wc = parseFloat(document.getElementById('c2_2_wc')?.value) || 0;
    const c2_2_tot = c2_2_base + c2_2_super + c2_2_wc;

    if (document.getElementById('c2_1_super')) document.getElementById('c2_1_super').innerText = '$' + c2_1_super.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_1_tot')) document.getElementById('c2_1_tot').innerText = '$' + c2_1_tot.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_2_super')) document.getElementById('c2_2_super').innerText = '$' + c2_2_super.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_2_tot')) document.getElementById('c2_2_tot').innerText = '$' + c2_2_tot.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c2_base_sub = c2_1_base + c2_2_base;
    const c2_super_sub = c2_1_super + c2_2_super;
    const c2_wc_sub = c2_1_wc + c2_2_wc;
    const c2_raw_ann_sub = c2_1_tot + c2_2_tot;

    if (document.getElementById('c2_base_sub')) document.getElementById('c2_base_sub').innerText = '$' + c2_base_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_super_sub')) document.getElementById('c2_super_sub').innerText = '$' + c2_super_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_wc_sub')) document.getElementById('c2_wc_sub').innerText = '$' + c2_wc_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_ann_sub')) document.getElementById('c2_ann_sub').innerText = '$' + c2_raw_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c2_ann_sub = getCategoryState(2, c2_raw_ann_sub);
    const c2_mth_sub = c2_ann_sub / 12;

    // Category 3
    const c3_1_mth = parseFloat(document.getElementById('c3_1_mth_input')?.value) || 0;
    const c3_2_mth = parseFloat(document.getElementById('c3_2_mth_input')?.value) || 0;
    const c3_3_mth = parseFloat(document.getElementById('c3_3_mth_input')?.value) || 0;

    const c3_1_ann = c3_1_mth * 12;
    const c3_2_ann = c3_2_mth * 12;
    const c3_3_ann = c3_3_mth * 12;

    if (document.getElementById('c3_1_ann')) document.getElementById('c3_1_ann').innerText = '$' + c3_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_2_ann')) document.getElementById('c3_2_ann').innerText = '$' + c3_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c3_3_ann')) document.getElementById('c3_3_ann').innerText = '$' + c3_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c3_raw_mth_sub = c3_1_mth + c3_2_mth + c3_3_mth;
    const c3_raw_ann_sub = c3_1_ann + c3_2_ann + c3_3_ann;

    if (document.getElementById('c3_mth_sub')) document.getElementById('c3_mth_sub').innerText = '$' + c3_raw_mth_sub.toFixed(2);
    if (document.getElementById('c3_ann_sub')) document.getElementById('c3_ann_sub').innerText = '$' + c3_raw_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c3_ann_sub = getCategoryState(3, c3_raw_ann_sub);
    const c3_mth_sub = c3_ann_sub / 12;

    // Category 4
    const c4_1_mth = parseFloat(document.getElementById('c4_1_mth_input')?.value) || 0;
    const c4_2_mth = parseFloat(document.getElementById('c4_2_mth_input')?.value) || 0;
    const c4_3_mth = parseFloat(document.getElementById('c4_3_mth_input')?.value) || 0;
    const c4_4_mth = parseFloat(document.getElementById('c4_4_mth_input')?.value) || 0;
    const c4_5_mth = parseFloat(document.getElementById('c4_5_mth_input')?.value) || 0;

    const c4_1_ann = c4_1_mth * 12;
    const c4_2_ann = c4_2_mth * 12;
    const c4_3_ann = c4_3_mth * 12;
    const c4_4_ann = c4_4_mth * 12;
    const c4_5_ann = c4_5_mth * 12;

    if (document.getElementById('c4_1_ann')) document.getElementById('c4_1_ann').innerText = '$' + c4_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c4_2_ann')) document.getElementById('c4_2_ann').innerText = '$' + c4_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c4_3_ann')) document.getElementById('c4_3_ann').innerText = '$' + c4_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c4_4_ann')) document.getElementById('c4_4_ann').innerText = '$' + c4_4_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c4_5_ann')) document.getElementById('c4_5_ann').innerText = '$' + c4_5_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c4_raw_mth_sub = c4_1_mth + c4_2_mth + c4_3_mth + c4_4_mth + c4_5_mth;
    const c4_raw_ann_sub = c4_1_ann + c4_2_ann + c4_3_ann + c4_4_ann + c4_5_ann;

    if (document.getElementById('c4_mth_sub')) document.getElementById('c4_mth_sub').innerText = '$' + c4_raw_mth_sub.toFixed(2);
    if (document.getElementById('c4_ann_sub')) document.getElementById('c4_ann_sub').innerText = '$' + c4_raw_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c4_ann_sub = getCategoryState(4, c4_raw_ann_sub);
    const c4_mth_sub = c4_ann_sub / 12;

    // Category 5
    const c5_1_ex = parseFloat(document.getElementById('c5_1_ann_input')?.value) || 0;
    const c5_2_ex = parseFloat(document.getElementById('c5_2_ann_input')?.value) || 0;
    const c5_3_ex = parseFloat(document.getElementById('c5_3_ann_input')?.value) || 0;
    const c5_4_ex = parseFloat(document.getElementById('c5_4_ann_input')?.value) || 0;

    if (document.getElementById('c5_1_inc_gst')) document.getElementById('c5_1_inc_gst').innerText = '$' + (c5_1_ex * 1.1).toFixed(2);
    if (document.getElementById('c5_2_inc_gst')) document.getElementById('c5_2_inc_gst').innerText = '$' + (c5_2_ex * 1.1).toFixed(2);
    if (document.getElementById('c5_3_inc_gst')) document.getElementById('c5_3_inc_gst').innerText = '$' + (c5_3_ex * 1.1).toFixed(2);
    if (document.getElementById('c5_4_inc_gst')) document.getElementById('c5_4_inc_gst').innerText = '$' + (c5_4_ex * 1.1).toFixed(2);

    const c5_raw_ann_sub = c5_1_ex + c5_2_ex + c5_3_ex + c5_4_ex;
    const c5_inc_sub = c5_raw_ann_sub * 1.1;

    if (document.getElementById('c5_ex_sub')) document.getElementById('c5_ex_sub').innerText = '$' + c5_raw_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c5_inc_sub')) document.getElementById('c5_inc_sub').innerText = '$' + c5_inc_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c5_ann_sub = getCategoryState(5, c5_raw_ann_sub);
    const c5_mth_sub = c5_ann_sub / 12;

// --- CATEGORY 6 (FULLY SYNCHRONIZED WITH FREIGHT & TERMINAL BASELINE) ---
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const is40ft = containerType === '40ft';

    // 1. Dynamic Cartage Sync with Card 2 / Live Control Panel
    const currentCartageVal = parseFloat(document.getElementById('input-cartage')?.value) || (is40ft ? 1450.00 : 750.00);
    const c6_3_input_el = document.getElementById('c6_3_ship_input');
    if (c6_3_input_el && document.activeElement !== c6_3_input_el) {
        c6_3_input_el.value = currentCartageVal.toFixed(2);
    }

    // 2. Dynamic Port Charges Sync (Default: $450 AUD for 20ft, $850 AUD for 40ft)
    const defaultPortCharge = is40ft ? 850.00 : 450.00;
    const c6_2_input_el = document.getElementById('c6_2_ship_input');
    if (c6_2_input_el && document.activeElement !== c6_2_input_el && (!c6_2_input_el.value || c6_2_input_el.getAttribute('data-container-type') !== containerType)) {
        c6_2_input_el.value = defaultPortCharge.toFixed(2);
        c6_2_input_el.setAttribute('data-container-type', containerType);
    }

    // 3. Read Active Inputs
    const c6_1_ship = parseFloat(document.getElementById('c6_1_ship_input')?.value) || 475.00;
    const c6_2_ship = parseFloat(c6_2_input_el?.value) || defaultPortCharge;
    const c6_3_ship = parseFloat(c6_3_input_el?.value) || currentCartageVal;

    // 4. Calculate Annual Totals using Live Annual Container Count (12 for 20ft, 6 for 40ft)
    const c6_1_ann = c6_1_ship * ANNUAL_CONTAINERS;
    const c6_2_ann = c6_2_ship * ANNUAL_CONTAINERS;
    const c6_3_ann = c6_3_ship * ANNUAL_CONTAINERS;

    // Update UI Annual Labels
    if (document.getElementById('c6_1_ann')) document.getElementById('c6_1_ann').innerText = '$' + c6_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_2_ann')) document.getElementById('c6_2_ann').innerText = '$' + c6_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_3_ann')) document.getElementById('c6_3_ann').innerText = '$' + c6_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c6_ship_sub = c6_1_ship + c6_2_ship + c6_3_ship;
    const c6_raw_ann_sub = c6_1_ann + c6_2_ann + c6_3_ann;

    if (document.getElementById('c6_ship_sub')) document.getElementById('c6_ship_sub').innerText = '$' + c6_ship_sub.toFixed(2);
    if (document.getElementById('c6_ann_sub')) document.getElementById('c6_ann_sub').innerText = '$' + c6_raw_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c6_ann_sub = getCategoryState(6, c6_raw_ann_sub);
    const c6_mth_sub = c6_ann_sub / 12;

    // GRAND TOTAL OPEX RECALCULATION
    const totalAnnualOpEx = c1_ann_sub + c2_ann_sub + c3_ann_sub + c4_ann_sub + c5_ann_sub + c6_ann_sub;
    const totalMonthlyOpEx = totalAnnualOpEx / 12;

    currentAnnualOpExAUD = totalAnnualOpEx;
    currentOpExPerContainerAUD = totalAnnualOpEx / ANNUAL_CONTAINERS;

    // Update Summary Banner & Top Cards
    if (document.getElementById('banner-opex-total')) document.getElementById('banner-opex-total').innerText = totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('kpi-monthly-opex')) document.getElementById('kpi-monthly-opex').innerText = '$' + totalMonthlyOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';
    if (document.getElementById('kpi-annual-opex')) document.getElementById('kpi-annual-opex').innerText = '$' + totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';

    // Dynamic Top Cost Driver Calculation
    const categories = [
        { name: 'Fixed Overheads', amt: c1_ann_sub, sub: '$' + c1_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' AUD (Office, Storage, Car)' },
        { name: 'Personnel', amt: c2_ann_sub, sub: '$' + c2_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' AUD (Salary + Super + WorkCover)' },
        { name: 'Vehicle Running', amt: c3_ann_sub, sub: '$' + c3_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' AUD (Fuel, Tolls, Maint.)' },
        { name: 'IT & SaaS Stack', amt: c4_ann_sub, sub: '$' + c4_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' AUD (Software & Telecoms)' },
        { name: 'Insurance & Compliance', amt: c5_ann_sub, sub: '$' + c5_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' AUD (Liability, Transit, Audit)' },
        { name: 'Import Clearance & Port', amt: c6_ann_sub, sub: '$' + c6_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2}) + ' AUD (Clearance & Cartage)' }
    ];

    const topCategory = categories.reduce((max, cat) => cat.amt > max.amt ? cat : max, categories[0]);
    const topPct = totalAnnualOpEx > 0 ? ((topCategory.amt / totalAnnualOpEx) * 100).toFixed(1) : '0.0';

    const kpiValEl = document.querySelector('[data-i18n="opex_kpi3_val"]');
    if (kpiValEl) kpiValEl.innerText = topCategory.amt > 0 ? topCategory.name : 'None';
    if (document.getElementById('kpi-personnel-pct')) document.getElementById('kpi-personnel-pct').innerText = topPct + '%';
    if (document.getElementById('kpi-personnel-amt')) document.getElementById('kpi-personnel-amt').innerText = topCategory.amt > 0 ? topCategory.sub : 'No Active Expense Categories';

    // Executive Summary Table Updates
    if (document.getElementById('sum-mth-c1')) document.getElementById('sum-mth-c1').innerText = '$' + c1_mth_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-c1')) document.getElementById('sum-ann-c1').innerText = '$' + c1_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-pct-c1')) document.getElementById('sum-pct-c1').innerText = (totalAnnualOpEx > 0 ? ((c1_ann_sub / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';

    if (document.getElementById('sum-mth-c2')) document.getElementById('sum-mth-c2').innerText = '$' + c2_mth_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-c2')) document.getElementById('sum-ann-c2').innerText = '$' + c2_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-pct-c2')) document.getElementById('sum-pct-c2').innerText = (totalAnnualOpEx > 0 ? ((c2_ann_sub / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';

    if (document.getElementById('sum-mth-c3')) document.getElementById('sum-mth-c3').innerText = '$' + c3_mth_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-c3')) document.getElementById('sum-ann-c3').innerText = '$' + c3_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-pct-c3')) document.getElementById('sum-pct-c3').innerText = (totalAnnualOpEx > 0 ? ((c3_ann_sub / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';

    if (document.getElementById('sum-mth-c4')) document.getElementById('sum-mth-c4').innerText = '$' + c4_mth_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-c4')) document.getElementById('sum-ann-c4').innerText = '$' + c4_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-pct-c4')) document.getElementById('sum-pct-c4').innerText = (totalAnnualOpEx > 0 ? ((c4_ann_sub / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';

    if (document.getElementById('sum-mth-c5')) document.getElementById('sum-mth-c5').innerText = '$' + c5_mth_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-c5')) document.getElementById('sum-ann-c5').innerText = '$' + c5_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-pct-c5')) document.getElementById('sum-pct-c5').innerText = (totalAnnualOpEx > 0 ? ((c5_ann_sub / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';

    if (document.getElementById('sum-mth-c6')) document.getElementById('sum-mth-c6').innerText = '$' + c6_mth_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-c6')) document.getElementById('sum-ann-c6').innerText = '$' + c6_ann_sub.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-pct-c6')) document.getElementById('sum-pct-c6').innerText = (totalAnnualOpEx > 0 ? ((c6_ann_sub / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';

    if (document.getElementById('sum-mth-total')) document.getElementById('sum-mth-total').innerText = '$' + totalMonthlyOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-total')) document.getElementById('sum-ann-total').innerText = '$' + totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    renderTable();
}

function resetOpExBudget() {
    Object.keys(defaultOpExValues).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = defaultOpExValues[id];
    });

    [1, 3, 4, 5, 6].forEach(i => {
        const toggle = document.getElementById(`c${i}_toggle_input`);
        if (toggle) toggle.checked = true;
    });
    const c2Toggle = document.getElementById('c2_toggle_input');
    if (c2Toggle) c2Toggle.checked = false;

    updateOpExFromInputs();
}

function resetMasterProfitOrders() {
    productsData.forEach(p => {
        p.orderQty = 0;
        syncOrderQty(p.id, 0);
    });
}

// --- AUTOMATED DAILY FX RATE FETCHER ---
async function fetchLiveFxRate() {
    const statusTag = document.getElementById('fx-status-tag');
    try {
        if (statusTag) {
            statusTag.innerText = 'Updating...';
            statusTag.className = 'text-[9px] text-amber-400 font-mono ml-1';
        }
        const response = await fetch('https://open.er-api.com/v6/latest/AUD');
        if (!response.ok) throw new Error('Live FX Rate fetch failed');
        
        const data = await response.json();
        if (data && data.rates && data.rates.USD) {
            const liveUsdRate = data.rates.USD;
            const inputFx = document.getElementById('input-fx');
            if (inputFx) inputFx.value = liveUsdRate.toFixed(4);
            if (statusTag) {
                statusTag.innerText = 'Live Daily Updated';
                statusTag.className = 'text-[9px] text-emerald-400 font-mono ml-1';
            }
            renderTable();
        }
    } catch (err) {
        console.warn('Could not fetch daily live FX rate, using benchmark fallback:', err);
        if (statusTag) {
            statusTag.innerText = 'Benchmark FX';
            statusTag.className = 'text-[9px] text-slate-400 font-mono ml-1';
        }
    }
}

// --- MULTI-LANGUAGE I18N DICTIONARY ENGINE ---
let currentLang = 'en';

const translations = {
    en: {
        modal_title: "Restricted Access",
        modal_desc: "Please enter the security password to view the Landed Cost Quotation & Analytics.",
        modal_label: "Enter Password",
        modal_error: "Incorrect password. Please try again.",
        modal_btn: "Unlock Dashboard",
        header_company_name: "TWO PARROTS GROUP AUSTRALIA",
        header_sub: "Import & Distribution Landed Cost Intelligence",
        btn_print: "Print A4 Quotation",
        hdr_company_title: "Two Parrots Group Australia",
        lbl_md: "Managing Director:",
        card_contact_title: "Contact & Web Portal",
        card_logistics_title: "Import / Logistics Terminal",
        lbl_discharge_port: "Discharge Port:",
        val_discharge_port: "Melbourne Swanson Dock / DP World",
        lbl_standard_unit: "Standard Unit:",
        val_standard_unit: "20ft FCL Container",
        lbl_effective_date: "Effective Date:",
        val_effective_date: "October 2026",
        card1_header: "Customs & Import Entry",
        card1_tag: "Quotation Baseline",
        lbl_importer: "Importer:",
        lbl_contact_phone: "Contact Phone:",
        lbl_customs_fee: "Customs Clearance Fee:",
        lbl_quarantine_fee: "Biosecurity Inspection / Doc:",
        lbl_quarantine_release: "Quarantine Release & Assessment:",
        lbl_import_duty: "Customs Import Duty (LDC P50):",
        val_duty_free: "$0.00 AUD (Duty Free)",
        lbl_border_gst: "Border Import GST (10% Deferred):",
        card2_header: "Freight & Terminal Baseline",
        card2_tag: "20ft FCL Pricing Model",
        lbl_supplier: "Supplier:",
        lbl_route: "Route:",
        val_route_short: "Kampong Saom → Melb",
        lbl_ocean_freight: "Ocean Freight Benchmark:",
        lbl_port_handling: "Port Handling & Infrastructure:",
        lbl_wharf_cartage: "Wharf Cartage & Sideloader:",
        lbl_fx_rate: "Customs N10 FX Rate:",
        card3_header: "Compliance Framework",
        card3_tag: "Landed Cost Model",
        card3_subhdr: "Landing Cost Benchmarks",
        chk_bol_rates: "Bill of Lading Rates",
        chk_fob_pricing: "FOB Benchmark Pricing",
        chk_carton_metrics: "Carton/Pack Metrics",
        chk_customs_rates: "Customs N10 Rates",
        chk_phyto_protocols: "Phytosanitary Protocols",
        chk_daff_fees: "DAFF Inspection Fees",
        opex_main_title: "Master Operational Expense Budget & Operating Model",
        opex_main_subtitle: "Business Entity: Cambodia-to-Melbourne Import & Distribution Business | Location: Melbourne, VIC, Australia (AUD)",
        lbl_total_opex_banner: "Total OpEx:",
        lbl_year: "Year",
        lbl_yr: "yr",
        btn_reset_opex: "Reset Budget",
        opex_sec1_title: "1. Executive Summary & Budget Overview",
        opex_kpi1_lbl: "Monthly Operational Expenses",
        opex_kpi1_sub: "Excl. GST | All 6 Categories",
        opex_kpi2_lbl: "Annual Operational Expenses",
        opex_kpi2_sub: "Excl. GST | Fixed + Salaries + Logistics",
        opex_kpi3_lbl: "Primary Cost Driver",
        opex_kpi3_val: "Personnel",
        opex_kpi3_sub: "$220,950.00 AUD (Salary + Super + WorkCover)",
        th_opex_cat: "Expense Category",
        th_opex_mth: "Monthly Cost (ex GST)",
        th_opex_ann: "Annual Cost (ex GST)",
        th_opex_pct: "% of Total OpEx",
        opex_cat1_name: "1. Stated Fixed Overheads (Office, Storage, Rental Car)",
        opex_cat2_name: "2. Executive & Operational Personnel (Salaries, Super, WorkCover)",
        opex_cat3_name: "3. Vehicle Running & Transportation Expenses (Fuel, Tolls, Maint.)",
        opex_cat4_name: "4. IT, Communications & SaaS Stack (Telecoms, Web, Software)",
        opex_cat5_name: "5. Business Insurance & Compliance (Liability, Transit, Audit)",
        opex_cat6_name: "6. Estimated Logistics & Customs Administration (Clearance, PSC)",
        opex_total_lbl: "TOTAL OPERATIONAL EXPENSES (OpEx)",
        opex_sec2_title: "2. Detailed Expense Itemization (Editable AUD Prices)",
        c1_hdr: "Category 1: Stated Fixed Overheads",
        th_item: "Line Item",
        th_wk: "Weekly AUD",
        th_mth: "Monthly",
        th_ann: "Annual",
        c1_item1: "Office Rent",
        c1_item2: "Storage Unit / Small Warehouse",
        c1_item3: "Commercial Vehicle Rental",
        lbl_subtotal_ex_gst: "Subtotal (excl. GST)",
        c2_hdr: "Category 2: Personnel Overhead",
        th_role: "Role / Position",
        th_base: "Base Salary AUD",
        th_super: "Super (11.5%)",
        th_wc: "WorkCover",
        c2_role1: "Managing Director",
        c2_role2: "Operations Manager",
        lbl_subtotal: "Subtotal",
        c3_hdr: "Category 3: Vehicle Running Expenses",
        th_desc: "Expense Description",
        c3_item1: "Fuel (Unleaded / Diesel)",
        c3_item2: "Transurban Tolls",
        c3_item3: "Vehicle Maintenance",
        c4_hdr: "Category 4: IT & SaaS Stack",
        th_software: "Software / Service",
        c4_item1: "Telecoms & Mobile Services",
        c4_item2: "E-Commerce Platform",
        c4_item3: "Email & Productivity",
        c4_item4: "Accounting & ERP Integration",
        c4_item5: "Inventory Management Software",
        c5_hdr: "Category 5: Insurance & Compliance",
        th_policy: "Service / Policy Type",
        th_ex_gst: "Annual ex GST AUD",
        th_inc_gst: "inc GST (10%)",
        c5_item1: "Accounting & Tax Compliance Fee",
        c5_item2: "Public & Products Liability",
        c5_item3: "Marine Cargo / Transit Insurance",
        c5_item4: "Management Liability & Cyber",
        c6_hdr: "Category 6: Import Freight Clearance & Customs",
        th_service: "Service Component",
        th_per_shipment: "Per Shipment AUD",
        th_ann_shipments: "Annual (12 Shipments)",
        c6_item1: "Customs Clearance & Admin Fees",
        c6_item2: "Port Charges & Infrastructure Levies",
        c6_item3: "Wharf Cartage & Sideloader Transport",
        lbl_subtotal_ex_ocean: "Subtotal (excl. Ocean & Duty)",
        opex_sec3_title: "3. Key Compliance & Financial Considerations",
        opex_note1_title: "Customs Tariffs & FTAs:",
        opex_note1_body: "Goods originating in Cambodia qualify for duty-free entry into Australia under AANZFTA or RCEP, provided a valid Certificate of Origin (COO) is supplied.",
        opex_note2_title: "Import GST Deferred Scheme (DGST):",
        opex_note2_body: "Import GST (10%) is calculated on Customs Value + Duty + Transport/Insurance. Registering for Deferred GST defers border payment to monthly BAS returns.",
        opex_note3_title: "Superannuation Compliance:",
        opex_note3_body: "Statutory Employer Superannuation Guarantee (11.5%) must be remitted quarterly to compliant Australian super funds before statutory due dates.",
        master_profit_title: "Master Profit Model",
        master_profit_subtitle: "Business Entity: Cambodia-to-Melbourne Import & Distribution Business | Location: Melbourne, VIC, Australia (AUD)",
        btn_reset_master_profit: "Reset Orders",
        lbl_total_net_profit_banner: "Total Net Profit:",
        lbl_shipment: "Shipment",
        th_order_qty: "Order Qty (Cartons)",
        th_order_profit: "Order Net Profit (AUD)",
        lbl_total_shipment_profit: "Total Shipment Order Profit",
        tbl_title: "Landed Cost Quotation & Benchmark Schedule",
        tbl_subtitle: "Rearranged per Two Parrots Quotation (25 Active Products + 5 Upcoming Nov 2026 Launch)",
        lbl_active: "Active",
        lbl_upcoming: "Upcoming",
        th_prod_desc: "Product Description",
        th_fob_price: "CTN Price Before Delivery",
        th_fob_sub: "(Adjustable CTN USD → Auto PCS USD/AUD)",
        th_total_cost: "Total Landed Cost, Prices & Profit",
        th_itemized_note: "Structure: Total Landed CTN → Itemized Costs → Selling Prices → Net Profit (CTN - Landed - 10% Tax)",
        th_asian_bench: "Ethnic & Asian Market Comparisons",
        th_asian_sub: "(Asian, Indian, Nepalese, Sri Lankan)",
        th_aus_bench: "Australian Supermarket Prices",
        th_aus_sub: "(Coles, Woolworths, ALDI, Costco, IGA)",
        tb_title: "Live Landed Cost Recalculation Engine",
        tb_desc: "Adjust freight variables & margin percentage to compute live costings",
        lbl_fx: "FX Rate (AUD/USD)",
        lbl_freight: "Freight (USD)",
        lbl_cartage_tb: "VIC Cartage (AUD)",
        lbl_margin: "Target Margin (%)",
        btn_recalc: "Recalculate",
        lbl_landed_ctn_aud: "Landed Cost AUD (CTN):",
        lbl_fob_ctn_aud: "FOB AUD (CTN):",
        lbl_ocean_ctn_aud: "Ocean Freight AUD (CTN):",
        lbl_customs_ctn_aud: "Customs & Port AUD (CTN):",
        lbl_local_ctn_aud: "Local Transport AUD (CTN):",
        lbl_opex_ctn_aud: "OpEx Overhead AUD (CTN):",
        lbl_sell_ctn: "Selling Price CTN @",
        lbl_sell_pcs: "Selling Price Pcs @",
        lbl_net_profit_ctn: "Net Profit (CTN):",
        lbl_order_net_profits: "Order Net Profits:",
        lbl_cust_margin_fixed: "Customer Margins Fixed 30% =",
        lbl_pcs_usd: "Pcs USD:",
        lbl_pcs_aud: "Pcs AUD:",
        lbl_eq: "Eq"
    },
    km: {
        modal_title: "ការចូលប្រើប្រាស់ត្រូវបានកំណត់",
        modal_desc: "សូមបញ្ចូលពាក្យសម្ងាត់សុវត្ថិភាពដើម្បីមើលសម្រង់តម្លៃដើម និងការវិភាគ។",
        modal_label: "បញ្ចូលពាក្យសម្ងាត់",
        modal_error: "ពាក្យសម្ងាត់មិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។",
        modal_btn: "បើកផ្ទាំងគ្រប់គ្រង",
        header_company_name: "ក្រុមហ៊ុន ថូ ផារ៉ត គ្រុប អូស្ត្រាលី",
        header_sub: "ព័ត៌មានវិភាគថ្លៃដើមនាំចូល និងចែករំលែក",
        btn_print: "បោះពុម្ពសម្រង់តម្លៃ A4",
        hdr_company_title: "ក្រុមហ៊ុន ថូ ផារ៉ត គ្រុប អូស្ត្រាលី",
        lbl_md: "នាយកប្រតិបត្តិ:",
        card_contact_title: "ទំនាក់ទំនង និងវេបសាយ",
        card_logistics_title: "ស្ថានីយនាំចូល / ឡូជីស្ទិក",
        lbl_discharge_port: "កំពង់ផែនាំចុះ:",
        val_discharge_port: "កំពង់ផែម៉ែលប៊ន Swanson Dock / DP World",
        lbl_standard_unit: "ទំហំស្តង់ដារ:",
        val_standard_unit: "កុងតឺន័រ 20ft FCL",
        lbl_effective_date: "កាលបរិច្ឆេទអនុវត្ត:",
        val_effective_date: "តុលា ២០២៦",
        card1_header: "កាលវិភាគបង់ពន្ធគយ និងការរត់ការ",
        card1_tag: "មូលដ្ឋានសម្រង់តម្លៃ",
        lbl_importer: "អ្នកនាំចូល:",
        lbl_contact_phone: "លេខទូរស័ព្ទ:",
        lbl_customs_fee: "កម្រៃរត់ការគយ:",
        lbl_quarantine_fee: "កម្រៃពិនិត្យភូតគាមអនាម័យ:",
        lbl_quarantine_release: "កម្រៃបញ្ចេញ និងវាយតម្លៃភូតគាមអនាម័យ:",
        lbl_import_duty: "ពន្ធនាំចូលគយ (LDC P50):",
        val_duty_free: "$0.00 AUD (លើកលែងពន្ធ)",
        lbl_border_gst: "ពន្ធ GST នាំចូល (ពន្យារ ១០%):",
        card2_header: "មូលដ្ឋានតម្លៃដឹកជញ្ជូន និងកំពង់ផែ",
        card2_tag: "ម៉ូឌែលតម្លៃ ២០ ហ្វ៊ីត FCL",
        lbl_supplier: "អ្នកផ្គត់ផ្គង់:",
        lbl_route: "ផ្លូវដឹកជញ្ជូន:",
        val_route_short: "ក្រុងព្រះសីហនុ → ម៉ែលប៊ន",
        lbl_ocean_freight: "ថ្លៃដឹកតាមផ្លូវសមុទ្រដើម:",
        lbl_port_handling: "ថ្លៃសេវាកំពង់ផែ និងហេដ្ឋារចនាសម្ព័ន្ធ:",
        lbl_wharf_cartage: "ថ្លៃដឹកជញ្ជូនពីកំពង់ផែទៅឃ្លាំង:",
        lbl_fx_rate: "អត្រាប្តូរប្រាក់ N10 គយ:",
        card3_header: "ក្របខ័ណ្ឌអនុលោមភាព",
        card3_tag: "ម៉ូឌែលថ្លៃដើមនាំចូល",
        card3_subhdr: "សូចនាករថ្លៃដើមនាំចូល",
        chk_bol_rates: "អត្រាលិខិតដឹកជញ្ជូន (B/L)",
        chk_fob_pricing: "តម្លៃដើម FOB",
        chk_carton_metrics: "រង្វាស់ទំហំកេស/កញ្ចប់",
        chk_customs_rates: "អត្រាពន្ធគយ N10",
        chk_phyto_protocols: "ពិធីសារភូតគាមអនាម័យ",
        chk_daff_fees: "កម្រៃពិនិត្យ DAFF",
        opex_main_title: "ថវិកាចំណាយប្រតិបត្តិការសរុប និងម៉ូឌែលប្រតិបត្តិការ",
        opex_main_subtitle: "អង្គភាពអាជីវកម្ម៖ អាជីវកម្មនាំចូល និងចែករំលែកពីកម្ពុជាទៅម៉ែលប៊ន | ទីតាំង៖ ម៉ែលប៊ន វិចតូរីយ៉ា អូស្ត្រាលី (AUD)",
        lbl_total_opex_banner: "ចំណាយប្រតិបត្តិការសរុប៖",
        lbl_year: "ឆ្នាំ",
        lbl_yr: "ឆ្នាំ",
        btn_reset_opex: "កំណត់ឡើងវិញ",
        opex_sec1_title: "១. សង្ខេបប្រតិបត្តិ និងទិដ្ឋភាពទូទៅនៃថវិកា",
        opex_kpi1_lbl: "ចំណាយប្រតិបត្តិការប្រចាំខែ",
        opex_kpi1_sub: "មិនរាប់បញ្ចូល GST | ទាំង ៦ ប្រភេទ",
        opex_kpi2_lbl: "ចំណាយប្រតិបត្តិការប្រចាំឆ្នាំ",
        opex_kpi2_sub: "មិនរាប់បញ្ចូល GST | ថេរ + ប្រាក់ខែ + ឡូជីស្ទិក",
        opex_kpi3_lbl: "ចំណាយចម្បងជាងគេ",
        opex_kpi3_val: "បុគ្គលិក",
        opex_kpi3_sub: "$២២០,៩៥០.០០ AUD (ប្រាក់ខែ + ប្រាក់សោធន + ធានារ៉ាប់រង)",
        th_opex_cat: "ប្រភេទចំណាយ",
        th_opex_mth: "ចំណាយប្រចាំខែ (គិតត្រឹម GST)",
        th_opex_ann: "ចំណាយប្រចាំឆ្នាំ (គិតត្រឹម GST)",
        th_opex_pct: "ភាគរយចំណាយសរុប",
        opex_cat1_name: "១. ចំណាយថេរទូទៅ (ការិយាល័យ ឃ្លាំង រថយន្តជួល)",
        opex_cat2_name: "២. បុគ្គលិកប្រតិបត្តិ និងបច្ចេកទេស (ប្រាក់ខែ សោធន ធានារ៉ាប់រង)",
        opex_cat3_name: "៣. ចំណាយរថយន្ត និងដឹកជញ្ជូន (ប្រេង សាំង ថ្លៃផ្លូវ)",
        opex_cat4_name: "៤. ប្រព័ន្ធ IT ប្រព័ន្ធទំនាក់ទំនង និង SaaS (ទូរស័ព្ទ វេបសាយ)",
        opex_cat5_name: "៥. ធានារ៉ាប់រងអាជីវកម្ម និងអនុលោមភាព (ការទទួលខុសត្រូវ ដឹកជញ្ជូន)",
        opex_cat6_name: "៦. ចំណាយឡូជីស្ទិក និងរត់ការគយ (ការរត់ការគយ ថ្លៃកំពង់ផែ)",
        opex_total_lbl: "ចំណាយប្រតិបត្តិការសរុប (OpEx)",
        opex_sec2_title: "២. បញ្ជីលម្អិតនៃចំណាយ (អាចកែសម្រួលតម្លៃ AUD បាន)",
        c1_hdr: "ប្រភេទ ១៖ ចំណាយថេរទូទៅ",
        th_item: "កាតព្វកិច្ច/មុខទំនិញ",
        th_wk: "ប្រចាំសប្តាហ៍ AUD",
        th_mth: "ប្រចាំខែ",
        th_ann: "ប្រចាំឆ្នាំ",
        c1_item1: "ថ្លៃជួលការិយាល័យ",
        c1_item2: "ថ្លៃជួលឃ្លាំងស្តុកទំនិញ",
        c1_item3: "ថ្លៃជួលរថយន្តពាណិជ្ជកម្ម",
        lbl_subtotal_ex_gst: "សរុបរង (មិនរាប់បញ្ចូល GST)",
        c2_hdr: "ប្រភេទ ២៖ ចំណាយបុគ្គលិក",
        th_role: "តួនាទី / តំណែង",
        th_base: "ប្រាក់ខែសរុប AUD",
        th_super: "ប្រាក់សោធន (11.5%)",
        th_wc: "ធានារ៉ាប់រងបុគ្គលិក",
        c2_role1: "នាយកប្រតិបត្តិ",
        c2_role2: "អ្នកគ្រប់គ្រងប្រតិបត្តិការ",
        lbl_subtotal: "សរុបរង",
        c3_hdr: "ប្រភេទ ៣៖ ចំណាយប្រតិបត្តិការរថយន្ត",
        th_desc: "ការបរិយាយចំណាយ",
        c3_item1: "ថ្លៃប្រេងសាំង",
        c3_item2: "ថ្លៃបង់ផ្លូវ Transurban",
        c3_item3: "ថ្លៃថែទាំរថយន្ត",
        c4_hdr: "ប្រភេទ ៤៖ ប្រព័ន្ធបច្ចេកវិទ្យា IT & SaaS",
        th_software: "កម្មវិធី / សេវាកម្ម",
        c4_item1: "សេវាទូរស័ព្ទ និងអ៊ីនធឺណិត",
        c4_item2: "ប្រព័ន្ធលក់អនឡាញ",
        c4_item3: "អ៊ីមែល និងប្រព័ន្ធការងារ",
        c4_item4: "ប្រព័ន្ធគណនេយ្យ និង ERP",
        c4_item5: "កម្មវិធីគ្រប់គ្រងស្តុកទំនិញ",
        c5_hdr: "ប្រភេទ ៥៖ ធានារ៉ាប់រង និងអនុលោមភាព",
        th_policy: "ប្រភេទប័ណ្ណសន្យា/សេវាកម្ម",
        th_ex_gst: "ប្រចាំឆ្នាំ ex GST AUD",
        th_inc_gst: "រាប់បញ្ចូល GST (10%)",
        c5_item1: "ថ្លៃសេវាគណនេយ្យ និងពន្ធដារ",
        c5_item2: "ធានារ៉ាប់រងការទទួលខុសត្រូវសាធារណៈ",
        c5_item3: "ធានារ៉ាប់រងដឹកជញ្ជូនតាមសមុទ្រ",
        c5_item4: "ធានារ៉ាប់រងការគ្រប់គ្រង និងសុវត្ថិភាពស៊ីប៊ែរ",
        c6_hdr: "ប្រភេទ ៦៖ ថ្លៃដឹកជញ្ជូន និងរត់ការគយ",
        th_service: "សមាសភាគសេវាកម្ម",
        th_per_shipment: "ក្នុងមួយជើង AUD",
        th_ann_shipments: "ប្រចាំឆ្នាំ (១២ ជើង)",
        c6_item1: "ថ្លៃជើងសាគយ",
        c6_item2: "ថ្លៃសេវាកំពង់ផែ (PSC)",
        c6_item3: "ថ្លៃដឹកជញ្ជូនពីកំពង់ផែទៅឃ្លាំង",
        lbl_subtotal_ex_ocean: "សរុបរង (មិនរាប់ថ្លៃដឹកសមុទ្រ និងពន្ធ)",
        opex_sec3_title: "៣. អនុលោមភាពសំខាន់ៗ និងការពិចារណាផ្នែកហិរញ្ញវត្ថុ",
        opex_note1_title: "ពន្ធគយ និងកិច្ចព្រមព្រៀងពាណិជ្ជកម្មសេរី៖",
        opex_note1_body: "ទំនិញដែលមានប្រភពដើមពីប្រទេសកម្ពុជាទទួលបានការលើកលែងពន្ធនាំចូលមកអូស្ត្រាលីក្រោម AANZFTA ឬ RCEP ដោយគ្រាន់តែមានវិញ្ញាបនបត្រប្រភពដើម (COO)។",
        opex_note2_title: "ប្រព័ន្ធពន្យារការបង់ពន្ធ GST នាំចូល (DGST)៖",
        opex_note2_body: "ពន្ធ GST នាំចូល 10% ត្រូវគណនាលើតម្លៃគយ + ពន្ធ + ការដឹកជញ្ជូន។ ការចុះឈ្មោះប្រព័ន្ធ DGST អនុញ្ញាតឱ្យពន្យារការបង់ពន្ធរហូតដល់របាយការណ៍ BAS ប្រចាំខែ។",
        opex_note3_title: "អនុលោមភាពប្រាក់សោធននិវត្តន៍៖",
        opex_note3_body: "ភាគទានប្រាក់សោធននិវត្តន៍កាតព្វកិច្ចរបស់និយោជក (11.5%) ត្រូវតែបង់ជូនមូលនិធិសោធនអូស្ត្រាលីរៀងរាល់ត្រីមាស។",
        master_profit_title: "ម៉ូឌែលចំណេញសរុប master profit",
        master_profit_subtitle: "អង្គភាពអាជីវកម្ម៖ អាជីវកម្មនាំចូល និងចែករំលែកពីកម្ពុជាទៅម៉ែលប៊ន | ទីតាំង៖ ម៉ែលប៊ន វិចតូរីយ៉ា អូស្ត្រាលី (AUD)",
        btn_reset_master_profit: "កំណត់ការកុម្ម៉ង់ឡើងវិញ",
        lbl_total_net_profit_banner: "ចំណេញសុទ្ធសរុប៖",
        lbl_shipment: "ជើងដឹកជញ្ជូន",
        th_order_qty: "ចំនួនបញ្ជាទិញ (កេស)",
        th_order_profit: "ចំណេញសុទ្ធនៃការកុម្ម៉ង់ (AUD)",
        lbl_total_shipment_profit: "ចំណេញការកុម្ម៉ង់សរុបក្នុងមួយជើង",
        tbl_title: "តារាងសម្រង់តម្លៃដើមនាំចូល និងការប្រៀបធៀប",
        tbl_subtitle: "រៀបចំឡើងវិញតាមសម្រង់តម្លៃ Two Parrots (២៥ ផលិតផលសកម្ម + ៥ ផលិតផលថ្មី)",
        lbl_active: "សកម្ម",
        lbl_upcoming: "ជិតចេញលក់",
        th_prod_desc: "ការបរិយាយផលិតផល",
        th_fob_price: "តម្លៃមួយកេសមុនពេលដឹក",
        th_fob_sub: "(អាចកែសម្រួលតម្លៃកេស USD → គណនាដប/កញ្ចប់ស្វ័យប្រវត្តិ)",
        th_total_cost: "ថ្លៃដើមនាំចូលសរុប តម្លៃលក់ និងចំណេញ",
        th_itemized_note: "រចនាសម្ព័ន្ធ៖ ថ្លៃដើមនាំចូលកេស → លម្អិតថ្លៃដើមកេស → តម្លៃលក់ → ចំណេញសុទ្ធ (កេស - ថ្លៃដើម - ពន្ធ ១០%)",
        th_asian_bench: "ការប្រៀបធៀបទីផ្សារអាស៊ី និងអាស៊ីខាងត្បូង",
        th_asian_sub: "(អាស៊ី ឥណ្ឌា នេប៉ាល់ ស្រីលង្កា)",
        th_aus_bench: "តម្លៃផ្សារទំនើបអូស្ត្រាលី",
        th_aus_sub: "(Coles, Woolworths, ALDI, Costco, IGA)",
        tb_title: "ប្រព័ន្ធគណនាថ្លៃដើមនាំចូលផ្ទាល់",
        tb_desc: "កែប្រែប្រៀបប្រែប្រួលថ្លៃដឹកជញ្ជូន និងភាគរយចំណេញដើម្បីគណនាភ្លាមៗ",
        lbl_fx: "អត្រាប្តូរប្រាក់ (AUD/USD)",
        lbl_freight: "ថ្លៃកុងតឺន័រ ២០ហ្វ៊ីត (USD)",
        lbl_cartage_tb: "ថ្លៃដឹក VIC (AUD)",
        lbl_margin: "គោលដៅភាគរយចំណេញ (%)",
        btn_recalc: "គណនាឡើងវិញ",
        lbl_landed_ctn_aud: "ថ្លៃដើមនាំចូល AUD (កេស):",
        lbl_fob_ctn_aud: "FOB AUD (កេស):",
        lbl_ocean_ctn_aud: "ថ្លៃដឹកសមុទ្រ AUD (កេស):",
        lbl_customs_ctn_aud: "ថ្លៃគយ និងកំពង់ផែ AUD (កេស):",
        lbl_local_ctn_aud: "ថ្លៃដឹកក្នុងស្រុក AUD (កេស):",
        lbl_opex_ctn_aud: "ចំណាយប្រតិបត្តិការ AUD (កេស):",
        lbl_sell_ctn: "តម្លៃលក់មួយកេស @",
        lbl_sell_pcs: "តម្លៃលក់មួយដប/កញ្ចប់ @",
        lbl_net_profit_ctn: "ចំណេញសុទ្ធ (កេស):",
        lbl_order_net_profits: "ចំណេញសុទ្ធការកុម្ម៉ង់:",
        lbl_cust_margin_fixed: "ចំណេញអតិថិជនថេរ ៣០% =",
        lbl_pcs_usd: "មួយដប/កញ្ចប់ USD:",
        lbl_pcs_aud: "មួយដប/កញ្ចប់ AUD:",
        lbl_eq: "តម្លៃស្មើ"
    },
    fr: {
        modal_title: "Accès Restreint",
        modal_desc: "Veuillez saisir le mot de passe de sécurité pour afficher le devis des coûts rendus et les analyses.",
        modal_label: "Entrer le mot de passe",
        modal_error: "Mot de passe incorrect. Veuillez réessayer.",
        modal_btn: "Déverrouiller le tableau de bord",
        header_company_name: "TWO PARROTS GROUP AUSTRALIA",
        header_sub: "Intelligence du coût de revient à destination & distribution",
        btn_print: "Imprimer devis A4",
        hdr_company_title: "Two Parrots Group Australia",
        lbl_md: "Directeur Général:",
        card_contact_title: "Contact & Portail Web",
        card_logistics_title: "Terminal d'importation / Logistique",
        lbl_discharge_port: "Port de déchargement:",
        val_discharge_port: "Melbourne Swanson Dock / DP World",
        lbl_standard_unit: "Unité standard:",
        val_standard_unit: "Conteneur 20ft FCL",
        lbl_effective_date: "Date d'effet:",
        val_effective_date: "Octobre 2026",
        card1_header: "Dédouanement & Entrée d'importation",
        card1_tag: "Base de Devis",
        lbl_importer: "Importateur:",
        lbl_contact_phone: "Téléphone de contact:",
        lbl_customs_fee: "Frais de dédouanement:",
        lbl_quarantine_fee: "Inspection de biosécurité / Doc:",
        lbl_quarantine_release: "Mainlevée et évaluation de quarantaine:",
        lbl_import_duty: "Droits de douane (LDC P50):",
        val_duty_free: "0.00 $ AUD (Exempté)",
        lbl_border_gst: "GST d'importation aux frontières (10% différé):",
        card2_header: "Base de Fret & Terminal",
        card2_tag: "Modèle de prix FCL 20 pieds",
        lbl_supplier: "Fournisseur:",
        lbl_route: "Itinéraire:",
        val_route_short: "Kampong Saom → Melb",
        lbl_ocean_freight: "Fret maritime de référence:",
        lbl_port_handling: "Manutention portuaire & Infrastructure:",
        lbl_wharf_cartage: "Camionnage sur quai & Chargement latéral:",
        lbl_fx_rate: "Taux de change Douane N10:",
        card3_header: "Cadre de Conformité",
        card3_tag: "Modèle de Coût Rendu",
        card3_subhdr: "Réf. des Coûts Rendus",
        chk_bol_rates: "Tarifs du connaissement",
        chk_fob_pricing: "Prix de référence FOB",
        chk_carton_metrics: "Métriques Carton/Colis",
        chk_customs_rates: "Taux de douane N10",
        chk_phyto_protocols: "Protocole phytosanitaire",
        chk_daff_fees: "Frais d'inspection DAFF",
        opex_main_title: "Budget d'Exploitation Master & Modèle Opérationnel",
        opex_main_subtitle: "Entité commerciale: Import & Distribution Cambodge-Melbourne | Lieu: Melbourne, VIC, Australie (AUD)",
        lbl_total_opex_banner: "OpEx Total:",
        lbl_year: "Année",
        lbl_yr: "an",
        btn_reset_opex: "Réinitialiser",
        opex_sec1_title: "1. Résumé Exécutif & Aperçu du Budget",
        opex_kpi1_lbl: "Dépenses d'Exploitation Mensuelles",
        opex_kpi1_sub: "Hors GST | Les 6 catégories",
        opex_kpi2_lbl: "Dépenses d'Exploitation Annuelles",
        opex_kpi2_sub: "Hors GST | Fixes + Salaires + Logistique",
        opex_kpi3_lbl: "Principal Facteur de Coût",
        opex_kpi3_val: "Personnel",
        opex_kpi3_sub: "220 950,00 $ AUD (Salaire + Retraite + Assurance)",
        th_opex_cat: "Catégorie de Dépenses",
        th_opex_mth: "Coût Mensuel (hors GST)",
        th_opex_ann: "Annuel Cost (hors GST)",
        th_opex_pct: "% de l'OpEx Total",
        opex_cat1_name: "1. Frais Fixes Établis (Bureau, Stockage, Véhicule de location)",
        opex_cat2_name: "2. Personnel Exécutif et Opérationnel (Salaires, Retraite, WorkCover)",
        opex_cat3_name: "3. Frais de Véhicule et de Transport (Carburant, Péages, Entretien)",
        opex_cat4_name: "4. IT, Communications et SaaS (Télécoms, Web, Logiciels)",
        opex_cat5_name: "5. Assurance Entreprise et Conformité (Responsabilité, Transit, Audit)",
        opex_cat6_name: "6. Administration Logistique et Douanière (Dédouanement, PSC)",
        opex_total_lbl: "TOTAL DES DÉPENSES D'EXPLOITATION (OpEx)",
        opex_sec2_title: "2. Dépenses Détaillées (Prix AUD modifiables)",
        c1_hdr: "Catégorie 1: Frais Fixes Établis",
        th_item: "Poste de Dépense",
        th_wk: "Hebdomadaire AUD",
        th_mth: "Mensuel",
        th_ann: "Annuel",
        c1_item1: "Loyer du bureau",
        c1_item2: "Unité de stockage / Petit entrepôt",
        c1_item3: "Location de véhicule commercial",
        lbl_subtotal_ex_gst: "Sous-total (hors GST)",
        c2_hdr: "Catégorie 2: Frais de Personnel",
        th_role: "Rôle / Poste",
        th_base: "Salaire de base AUD",
        th_super: "Retraite (11.5%)",
        th_wc: "WorkCover",
        c2_role1: "Directeur Général",
        c2_role2: "Responsable des Opérations",
        lbl_subtotal: "Sous-total",
        c3_hdr: "Catégorie 3: Frais de Véhicule",
        th_desc: "Description de la Dépense",
        c3_item1: "Carburant",
        c3_item2: "Péages Transurban",
        c3_item3: "Entretien du véhicule",
        c4_hdr: "Catégorie 4: Suite IT & SaaS",
        th_software: "Logiciel / Service",
        c4_item1: "Services Télécoms & Mobiles",
        c4_item2: "Plateforme E-Commerce",
        c4_item3: "E-mail & Productivité",
        c4_item4: "Comptabilité & Intégration ERP",
        c4_item5: "Logiciel de gestion des stocks",
        c5_hdr: "Catégorie 5: Assurance & Conformité",
        th_policy: "Type de Police / Service",
        th_ex_gst: "Annuel hors GST AUD",
        th_inc_gst: "avec GST (10%)",
        c5_item1: "Frais de conformité comptable et fiscale",
        c5_item2: "Responsabilité civile et produits",
        c5_item3: "Assurance fret maritime et transit",
        c5_item4: "Responsabilité des dirigeants et cyber-assurance",
        c6_hdr: "Catégorie 6: Dédouanement et Transit",
        th_service: "Composante du service",
        th_per_shipment: "Par expédition AUD",
        th_ann_shipments: "Annuel (12 expéditions)",
        c6_item1: "Frais de courtage en douane",
        c6_item2: "Frais de manutention portuaire (PSC)",
        c6_item3: "Camionnage / Transport du quai au stockage",
        lbl_subtotal_ex_ocean: "Sous-total (hors fret maritime et droits)",
        opex_sec3_title: "3. Considérations Financières et de Conformité",
        opex_note1_title: "Tarifs Douaniers & ALE:",
        opex_note1_body: "Les marchandises du Cambodge sont exemptées de droits en Australie sous AANZFTA ou RCEP avec un certificat d'origine (COO) valide.",
        opex_note2_title: "Régime de GST d'Importation Différée (DGST):",
        opex_note2_body: "La GST d'importation (10%) est calculée sur Valeur en douane + Droits + Transport. L'inscription au DGST reporte le paiement à la déclaration BAS mensuelle.",
        opex_note3_title: "Conformité de la Retraite (Superannuation):",
        opex_note3_body: "La contribution légale de l'employeur à la retraite (11,5%) doit être versée chaque trimestre à des fonds de retraite australiens conformes.",
        master_profit_title: "Modèle de Profit Master",
        master_profit_subtitle: "Entité commerciale: Import & Distribution Cambodge-Melbourne | Lieu: Melbourne, VIC, Australie (AUD)",
        btn_reset_master_profit: "Réinitialiser la commande",
        lbl_total_net_profit_banner: "Bénéfice Net Total:",
        lbl_shipment: "Expédition",
        th_order_qty: "Qté Commandée (Cartons)",
        th_order_profit: "Bénéfice Net Commande (AUD)",
        lbl_total_shipment_profit: "Bénéfice Total de la Commande d'Expédition",
        tbl_title: "Devis des coûts rendus & Tableau comparatif",
        tbl_subtitle: "Réorganisé selon le devis Two Parrots (25 produits actifs + 5 nouveaux nov. 2026)",
        lbl_active: "Actifs",
        lbl_upcoming: "À venir",
        th_prod_desc: "Description du produit",
        th_fob_price: "Prix par Carton avant livraison",
        th_fob_sub: "(Ajustable CTN USD → Auto PCS USD/AUD)",
        th_total_cost: "Coût rendu total, Prix & Bénéfice",
        th_itemized_note: "Structure: Coût rendu Carton → Détail Coûts → Prix de vente → Bénéfice Net (Carton - Coût - Taxe 10%)",
        th_asian_bench: "Comparaisons du marché asiatique & ethnique",
        th_asian_sub: "(Asiatique, Indien, Népalais, Sri Lankais)",
        th_aus_bench: "Prix des supermarchés australiens",
        th_aus_sub: "(Coles, Woolworths, ALDI, Costco, IGA)",
        tb_title: "Calculateur de coût rendu en direct",
        tb_desc: "Ajustez les variables de fret et le pourcentage de marge pour calculer les coûts en direct",
        lbl_fx: "Taux de change (AUD/USD)",
        lbl_freight: "Fret (USD)",
        lbl_cartage_tb: "Camionnage VIC (AUD)",
        lbl_margin: "Marge cible (%)",
        btn_recalc: "Recalculer",
        lbl_landed_ctn_aud: "Coût rendu AUD (Carton):",
        lbl_fob_ctn_aud: "FOB AUD (Carton):",
        lbl_ocean_ctn_aud: "Fret maritime AUD (Carton):",
        lbl_customs_ctn_aud: "Douane & Port AUD (Carton):",
        lbl_local_ctn_aud: "Transport local AUD (Carton):",
        lbl_opex_ctn_aud: "Coûts OpEx AUD (Carton):",
        lbl_sell_ctn: "Prix de vente Carton @",
        lbl_sell_pcs: "Prix de vente Pièce @",
        lbl_net_profit_ctn: "Bénéfice Net (Carton):",
        lbl_order_net_profits: "Bénéfice Net Commande:",
        lbl_cust_margin_fixed: "Marge Client Fixe 30% =",
        lbl_pcs_usd: "Pièce USD:",
        lbl_pcs_aud: "Pièce AUD:",
        lbl_eq: "Éq"
    },
    zh: {
        modal_title: "受限访问",
        modal_desc: "请输入安全密码以查看到岸成本报价和分析数据。",
        modal_label: "输入密码",
        modal_error: "密码不正确，请重试。",
        modal_btn: "解锁控制面板",
        header_company_name: "双鹦鹉集团澳大利亚公司",
        header_sub: "进口与分销到岸成本情报",
        btn_print: "打印 A4 报价单",
        hdr_company_title: "双鹦鹉集团澳大利亚公司",
        lbl_md: "总经理:",
        card_contact_title: "联系方式与网站",
        card_logistics_title: "进口 / 物流枢纽",
        lbl_discharge_port: "卸货港:",
        val_discharge_port: "墨尔本 Swanson 码头 / DP World",
        lbl_standard_unit: "标准集装箱:",
        val_standard_unit: "20尺整柜集装箱 (FCL)",
        lbl_effective_date: "生效日期:",
        val_effective_date: "2026年10月",
        card1_header: "海关清关与进口申报",
        card1_tag: "报价基准",
        lbl_importer: "进口商:",
        lbl_contact_phone: "联系电话:",
        lbl_customs_fee: "报关清关费:",
        lbl_quarantine_fee: "生物安全检验/文件费:",
        lbl_quarantine_release: "检疫放行与评估费:",
        lbl_import_duty: "海关进口关税 (LDC P50):",
        val_duty_free: "$0.00 AUD (免关税)",
        lbl_border_gst: "边境进口 GST (10% 延期):",
        card2_header: "货运与码头基准",
        card2_tag: "20尺柜定价模型",
        lbl_supplier: "供应商:",
        lbl_route: "运输航线:",
        val_route_short: "西哈努克港 → 墨尔本",
        lbl_ocean_freight: "海运费基准:",
        lbl_port_handling: "港口处理与基础设施费:",
        lbl_wharf_cartage: "码头拖车与侧翻车运输:",
        lbl_fx_rate: "海关 N10 结算汇率:",
        card3_header: "合规性框架",
        card3_tag: "到岸成本模型",
        card3_subhdr: "到岸成本对比基准",
        chk_bol_rates: "海运提单费率",
        chk_fob_pricing: "FOB 基准定价",
        chk_carton_metrics: "箱规/包装指标",
        chk_customs_rates: "海关 N10 税率",
        chk_phyto_protocols: "植物检疫协议",
        chk_daff_fees: "DAFF 查验费",
        opex_main_title: "总运营费用预算与运营模型",
        opex_main_subtitle: "业务主体：柬埔寨至墨尔本进口与分销业务 | 业务地点：澳大利亚墨尔本 (AUD)",
        lbl_total_opex_banner: "总运营支出 (OpEx):",
        lbl_year: "年",
        lbl_yr: "年",
        btn_reset_opex: "重置预算",
        opex_sec1_title: "1. 执行摘要与预算总览",
        opex_kpi1_lbl: "每月运营支出",
        opex_kpi1_sub: "不含 GST | 包含所有 6 个类别",
        opex_kpi2_lbl: "每年运营支出",
        opex_kpi2_sub: "不含 GST | 固定成本 + 薪酬 + 物流",
        opex_kpi3_lbl: "最主要成本驱动因素",
        opex_kpi3_val: "人员薪酬",
        opex_kpi3_sub: "$220,950.00 AUD (基本工资 + 养老金 + 工伤险)",
        th_opex_cat: "费用类别",
        th_opex_mth: "每月费用 (不含 GST)",
        th_opex_ann: "每年费用 (不含 GST)",
        th_opex_pct: "占总支出比例",
        opex_cat1_name: "1. 规定固定开支 (办公室、仓库、租车)",
        opex_cat2_name: "2. 管理与运营人员 (薪酬、养老金、工伤险)",
        opex_cat3_name: "3. 车辆运营与运输费用 (燃油、路桥费、维护)",
        opex_cat4_name: "4. IT、通讯与 SaaS 软件服务 (网络、软件)",
        opex_cat5_name: "5. 商业保险与合规费用 (责任险、货运险)",
        opex_cat6_name: "6. 预估清关与物流管理 (报关费、港口费)",
        opex_total_lbl: "总运营支出费用 (OpEx)",
        opex_sec2_title: "2. 详细费用明细表 (可实时修改 AUD 价格)",
        c1_hdr: "类别 1: 规定固定开支",
        th_item: "费用项目",
        th_wk: "每周 AUD",
        th_mth: "每月",
        th_ann: "每年",
        c1_item1: "办公室租金",
        c1_item2: "迷你仓库/小型仓库租金",
        c1_item3: "商用车租赁费",
        lbl_subtotal_ex_gst: "小计 (不含 GST)",
        c2_hdr: "类别 2: 人员薪酬开支",
        th_role: "职位 / 岗位",
        th_base: "基本年薪 AUD",
        th_super: "养老金 (11.5%)",
        th_wc: "工伤保险",
        c2_role1: "总经理",
        c2_role2: "运营经理",
        lbl_subtotal: "小计",
        c3_hdr: "类别 3: 车辆运营费用",
        th_desc: "费用描述",
        c3_item1: "燃油费 (无铅汽油/柴油)",
        c3_item2: "Transurban 高速路桥费",
        c3_item3: "车辆日常维护费",
        c4_hdr: "类别 4: IT 与 SaaS 软件服务",
        th_software: "软件 / 服务",
        c4_item1: "通讯与移动服务",
        c4_item2: "电商平台",
        c4_item3: "企业邮箱与办公软件",
        c4_item4: "财务与 ERP 软件",
        c4_item5: "库存管理软件",
        c5_hdr: "类别 5: 保险与合规费用",
        th_policy: "服务 / 保单类型",
        th_ex_gst: "每年不含 GST AUD",
        th_inc_gst: "含 GST (10%)",
        c5_item1: "会计与税务合规服务费",
        c5_item2: "公众与产品责任险",
        c5_item3: "海运货物与运输险",
        c5_item4: "高管责任险与网络安全险",
        c6_hdr: "类别 6: 进口货运清关与海关管理",
        th_service: "服务组成部分",
        th_per_shipment: "单次运费 AUD",
        th_ann_shipments: "每年费用 (12次进口)",
        c6_item1: "报关行服务费",
        c6_item2: "港口服务费 (PSC)",
        c6_item3: "码头至仓库短驳拖車费",
        lbl_subtotal_ex_ocean: "小计 (不含海运费与关税)",
        opex_sec3_title: "3. 关键合规与财务注意事项",
        opex_note1_title: "海关关税与自贸协定:",
        opex_note1_body: "原产于柬埔寨的货物在提供有效原产地证书 (COO) 的情况下，可通过 AANZFTA 或 RCEP 享受零关税进入澳大利亚。",
        opex_note2_title: "进口 GST 延期缴纳计划 (DGST):",
        opex_note2_body: "进口 GST (10%) 按海关价值 + 关税 + 运费/保险计算。注册延期 GST 计划可将清关时的支付延期至每月 BAS 申报时缴纳。",
        opex_note3_title: "雇主养老金合规要求:",
        opex_note3_body: "法定雇主养老金 (11.5%) 必须在法定截止日期前按季度缴纳至符合条件的澳大利亚养老金基金中。",
        master_profit_title: "总利润模型 Master Profit Model",
        master_profit_subtitle: "业务主体：柬埔寨至墨尔本进口与分销业务 | 业务地点：澳大利亚墨尔本 (AUD)",
        btn_reset_master_profit: "重置订货量",
        lbl_total_net_profit_banner: "总净利润:",
        lbl_shipment: "单次货运",
        th_order_qty: "订货数量 (箱/CTN)",
        th_order_profit: "订单净利润 (AUD)",
        lbl_total_shipment_profit: "整柜订单总净利润",
        tbl_title: "到岸成本报价与市场标杆对照表",
        tbl_subtitle: "根据 Two Parrots 报价单重新排列（25 个在售产品 + 5 个 2026 年 11 月新品）",
        lbl_active: "在售",
        lbl_upcoming: "即将上市",
        th_prod_desc: "产品描述",
        th_fob_price: "每箱发货前单价 (CTN)",
        th_fob_sub: "(可调节箱价 USD → 自动计算单件 USD/AUD)",
        th_total_cost: "总到岸成本、售价与净利润",
        th_itemized_note: "结构: 每箱到岸价 → 拆解成本 → 建议售价 → 净利润 (整箱 - 到岸 - 10% 税)",
        th_asian_bench: "族群及亚洲超市标杆对比",
        th_asian_sub: "(东南亚, 印度, 尼泊尔, 斯里兰卡超市)",
        th_aus_bench: "澳大利亚主流超市标杆",
        th_aus_sub: "(Coles, Woolworths, ALDI, Costco, IGA)",
        tb_title: "实时到岸成本重算引擎",
        tb_desc: "调整运费变量和目标利润率以计算实时成本",
        lbl_fx: "汇率 (AUD/USD)",
        lbl_freight: "海运费 (USD)",
        lbl_cartage_tb: "VIC 拖车费 (AUD)",
        lbl_margin: "目标利润率 (%)",
        btn_recalc: "重新计算",
        lbl_landed_ctn_aud: "整箱到岸价 AUD (CTN):",
        lbl_fob_ctn_aud: "整箱离岸价 AUD (CTN):",
        lbl_ocean_ctn_aud: "整箱海运费 AUD (CTN):",
        lbl_customs_ctn_aud: "整箱海关及港口费 AUD (CTN):",
        lbl_local_ctn_aud: "整箱陆运费 AUD (CTN):",
        lbl_opex_ctn_aud: "整箱分摊运营成本 AUD (CTN):",
        lbl_sell_ctn: "整箱建议售价 @",
        lbl_sell_pcs: "单件建议售价 @",
        lbl_net_profit_ctn: "净利润 (CTN/整箱):",
        lbl_order_net_profits: "订单总净利润:",
        lbl_cust_margin_fixed: "客户固定利润率 30% =",
        lbl_pcs_usd: "单件 USD:",
        lbl_pcs_aud: "单件 AUD:",
        lbl_eq: "等效单价"
    }
};

function setLanguage(lang) {
    currentLang = lang;
    
    ['en', 'km', 'fr', 'zh'].forEach(l => {
        const btn = document.getElementById(`lang-btn-${l}`);
        if (btn) {
            if (l === lang) {
                btn.className = "px-2.5 py-1 text-base rounded transition bg-gold-500/20 border border-gold-500 shadow";
            } else {
                btn.className = "px-2.5 py-1 text-base rounded transition opacity-60 hover:opacity-100";
            }
        }
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    renderTable();
}

// --- RESTORED SECURITY LOGIN & PASSWORD MODAL LOGIC ---
function unlockPage(e) {
    if (e) e.preventDefault();
    const inputVal = document.getElementById('password-input')?.value;
    const errorMsg = document.getElementById('password-error');
    const modal = document.getElementById('password-modal');
    const content = document.getElementById('page-content');

    if (inputVal === 'twoparrots') {
        if (modal) {
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
        if (content) content.classList.remove('blur-xl', 'pointer-events-none', 'select-none');

        loadLatestPrices();
    } else {
        if (errorMsg) errorMsg.classList.remove('hidden');
        const pInput = document.getElementById('password-input');
        if (pInput) pInput.classList.add('border-red-500');
    }
}

function togglePasswordVisibility() {
    const input = document.getElementById('password-input');
    const icon = document.getElementById('eye-icon');
    if (!input || !icon) return;
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function getPcsPerCtn(specStr) {
    if (!specStr) return 1;
    const match = specStr.match(/(\d+)\s*(Pcs|Cans|Bags)/i);
    return match ? parseInt(match[1], 10) : 1;
}

// --- FULL 30 PRODUCT DATASET WITH COMPETITOR PRICE DATA & PERSISTED ORDER STATE ---
const productsData = [
    {
        id: 1, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Finest Rice Flour 500g', km: 'ម្សៅអង្ករខ្សាយ ៥០០ក្រាម', fr: 'Farine de riz fine 500g', zh: '优质大米粉 500g' },
        nameKhmer: 'ម្សៅអង្ករខ្សាយ ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.36, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Erawan Rice Flour', weightG: 500, priceAud: 1.60, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Rice Flour', weightG: 500, priceAud: 1.65, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Anil Fine Rice Flour', weightG: 500, priceAud: 1.80, source: 'Src: DesiKart Indian Grocery' },
            { brand: 'Harischandra Rice Flour', weightG: 500, priceAud: 1.90, source: 'Src: Lankan Groceries Melbourne' },
            { brand: 'Maneely Rice Flour', weightG: 1000, priceAud: 3.20, source: 'Src: Nepsay Nepalese Mart' }
        ],
        ausComps: [
            { brand: 'McKenzie\'s Rice Flour', weightG: 375, priceAud: 1.70, source: 'Src: Woolworths Online AU (Melb)' },
            { brand: 'Anchor Rice Flour', weightG: 500, priceAud: 2.20, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Has No Wheat Rice Flour', weightG: 500, priceAud: 1.80, source: 'Src: ALDI Australia' },
            { brand: 'Kirkland White Rice Flour Bulk', weightG: 2000, priceAud: 6.99, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 2, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Glutinous Rice Flour 500g', km: 'ម្សៅអង្ករដំណើប ៥០០ក្រាម', fr: 'Farine de riz glutineux 500g', zh: '水磨糯米粉 500g' },
        nameKhmer: 'ម្សៅអង្ករដំណើប ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.58, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Erawan Glutinous Flour', weightG: 500, priceAud: 1.75, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Three Rings Glutinous', weightG: 500, priceAud: 1.80, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Heera Sticky Rice Flour', weightG: 500, priceAud: 2.10, source: 'Src: Radhe Indian Grocery' }
        ],
        ausComps: [
            { brand: 'Cock Brand Glutinous', weightG: 500, priceAud: 2.20, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'McKenzie\'s Glutinous', weightG: 500, priceAud: 2.50, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 3, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Tapioca Flour 500g', km: 'ម្សៅឆា ៥០០ក្រាម', fr: 'Farine de tapioca 500g', zh: '木薯淀粉 / 生粉 500g' },
        nameKhmer: 'ម្សៅឆា ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.44, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Cock Brand Tapioca Starch', weightG: 500, priceAud: 1.50, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Panda Tapioca Flour', weightG: 500, priceAud: 1.45, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Swagat Tapioca Flour', weightG: 500, priceAud: 1.70, source: 'Src: Spice World Indian Mart' },
            { brand: 'Elephant House Tapioca', weightG: 500, priceAud: 1.80, source: 'Src: Ceylon Supermarket VIC' }
        ],
        ausComps: [
            { brand: 'McKenzie\'s Tapioca Flour', weightG: 300, priceAud: 1.70, source: 'Src: Woolworths Online AU (Melb)' },
            { brand: 'Lotus Tapioca Flour', weightG: 500, priceAud: 2.20, source: 'Src: Coles Supermarkets VIC' }
        ]
    },
    {
        id: 4, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Pancake Flour (Banh Xeo) 500g', km: 'ម្សៅបាញ់ឆែវ ៥០០ក្រាម', fr: 'Farine pour crêpes asiatiques 500g', zh: '柬式/越式煎饼粉 (Banh Xeo) 500g' },
        nameKhmer: 'ម្សៅបាញ់ឆែវ ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.90, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Bot Banh Xeo Pancake Mix', weightG: 500, priceAud: 2.80, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Vinh Thuan Pancake Mix', weightG: 500, priceAud: 2.90, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Gits Dosa Pancake Mix', weightG: 500, priceAud: 3.10, source: 'Src: India Gate Supermarket' }
        ],
        ausComps: [
            { brand: 'Greens Original Pancake Mix', weightG: 375, priceAud: 2.40, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'White Wings Pancake Shake', weightG: 325, priceAud: 2.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Krusteaz Pancake Mix Bulk', weightG: 2000, priceAud: 9.99, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 5, status: 'Active', weightG: 1000, orderQty: 0,
        name: { en: 'Crispy Tempura Flour 1000g', km: 'ម្សៅបំពងស្រួយ ១០០០ក្រាម', fr: 'Farine à tempura croustillante 1000g', zh: '香酥天妇罗炸粉 1000g' },
        nameKhmer: 'ម្សៅបំពងស្រួយ ១០០០ក្រាម', spec: { en: '1000g Bag / 10 Pcs (10kg/CTN)', km: 'ថង់ ១០០០ក្រាម / ១០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Pcs (10kg/CTN)', zh: '1000g/袋 / 10包 (10kg/箱)' }, fobUsd: 1.25, pcsPer20ft: 10000,
        asianComps: [
            { brand: 'Gogi Tempura Batter Mix', weightG: 500, priceAud: 2.20, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Showa Tempura Flour', weightG: 1000, priceAud: 4.10, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'L3 Bajji / Bonda Batter Mix', weightG: 500, priceAud: 2.50, source: 'Src: DesiKart Indian Grocery' },
            { brand: 'Ceylon Crispy Fry Flour', weightG: 1000, priceAud: 4.30, source: 'Src: Lankan Groceries Melbourne' }
        ],
        ausComps: [
            { brand: 'White Wings Tempura Batter', weightG: 300, priceAud: 2.80, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Knorr Crispy Tempura Mix', weightG: 500, priceAud: 3.60, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 6, status: 'Active', weightG: 150, orderQty: 0,
        name: { en: 'Crispy Tempura Flour 150g', km: 'ម្សៅបំពងស្រួយ ១៥០ក្រាម', fr: 'Farine à tempura croustillante 150g', zh: '香酥天妇罗炸粉 150g' },
        nameKhmer: 'ម្សៅបំពងស្រួយ ១៥០ក្រាម', spec: { en: '150g Bag / 60 Pcs (6x10pcs/CTN)', km: 'ថង់ ១៥០ក្រាម / ៦០ កញ្ចប់ (៦x១០កញ្ចប់/កេស)', fr: 'Sac de 150g / 60 Pcs (6x10pcs/CTN)', zh: '150g/袋 / 60包 (6x10包/箱)' }, fobUsd: 0.39, pcsPer20ft: 60000,
        asianComps: [
            { brand: 'Gogi Crispy Batter Pack', weightG: 150, priceAud: 1.10, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Aroma Crispy Coating', weightG: 150, priceAud: 1.05, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Knorr Crispy Seasoned', weightG: 150, priceAud: 1.80, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'MasterFoods Seasoned Batter', weightG: 150, priceAud: 1.95, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 7, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Fried Banana Flour 500g', km: 'ម្សៅចេកចៀន ៥០០ក្រាម', fr: 'Farine pour bananes frites 500g', zh: '炸香蕉专用脆粉 500g' },
        nameKhmer: 'ម្សៅចេកចៀន ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 1.60, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Bot Chien Chuoi Banana Mix', weightG: 500, priceAud: 3.20, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Thai Banana Fritter Mix', weightG: 500, priceAud: 3.10, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Asian Specialty Dessert Batter', weightG: 400, priceAud: 3.80, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Golden Fry Sweet Batter', weightG: 400, priceAud: 3.60, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 8, status: 'Active', weightG: 120, orderQty: 0,
        name: { en: 'Black Pepper Whole 120g', km: 'ម្រេចខ្មៅគ្រាប់មូល ១២០ក្រាម', fr: 'Poivre noir entier 120g', zh: '整粒黑胡椒粒 120g' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ១២០ក្រាម', spec: { en: '120g Can / 12 Cans/CTN', km: 'កំប៉ុង ១២០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 120g / 12 Boîtes/CTN', zh: '120g/罐 / 12罐/箱' }, fobUsd: 3.63, pcsPer20ft: 18000,
        asianComps: [
            { brand: 'Thai Whole Black Peppercorn', weightG: 100, priceAud: 4.80, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Whole Pepper', weightG: 100, priceAud: 4.60, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'MD Black Peppercorns', weightG: 100, priceAud: 5.10, source: 'Src: Lankan Groceries Melbourne' },
            { brand: 'Deep Whole Black Pepper', weightG: 100, priceAud: 4.50, source: 'Src: India Gate Supermarket' }
        ],
        ausComps: [
            { brand: 'Hoyts Whole Black Peppercorn', weightG: 100, priceAud: 4.90, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'MasterFoods Black Peppercorn', weightG: 100, priceAud: 5.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Stonemill Whole Peppercorns', weightG: 100, priceAud: 3.80, source: 'Src: ALDI Australia' },
            { brand: 'Kirkland Signature Black Peppercorn', weightG: 357, priceAud: 14.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 9, status: 'Active', weightG: 80, orderQty: 0,
        name: { en: 'Fine Ground Black Pepper 80g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ៨០ក្រាម', fr: 'Poivre noir moulu fin 80g', zh: '细磨黑胡椒粉 80g' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ៨០ក្រាម', spec: { en: '80g Can / 20 Cans/CTN', km: 'កំប៉ុង ៨០ក្រាម / ២០ កំប៉ុង/កេស', fr: 'Boîte de 80g / 20 Boîtes/CTN', zh: '80g/罐 / 20罐/箱' }, fobUsd: 1.43, pcsPer20ft: 24000,
        asianComps: [
            { brand: 'Cock Brand Ground Black Pepper', weightG: 80, priceAud: 2.80, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Thai Pure Black Pepper', weightG: 80, priceAud: 2.65, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Saxa Black Pepper Ground', weightG: 50, priceAud: 2.90, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'McCormick Ground Black Pepper', weightG: 50, priceAud: 3.10, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Kirkland Fine Ground Pepper', weightG: 348, priceAud: 13.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 10, status: 'Active', weightG: 80, orderQty: 0,
        name: { en: 'Coarse Ground Black Pepper 80g', km: 'ម្រេចខ្មៅចម្រៀក ៨០ក្រាម', fr: 'Poivre noir concassé 80g', zh: '粗磨黑胡椒碎 80g' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ៨០ក្រាម', spec: { en: '80g Can / 20 Cans/CTN', km: 'កំប៉ុង ៨០ក្រាម / ២០ កំប៉ុង/កេស', fr: 'Boîte de 80g / 20 Boîtes/CTN', zh: '80g/罐 / 20罐/箱' }, fobUsd: 1.43, pcsPer20ft: 24000,
        asianComps: [
            { brand: 'MasterFoods Cracked Pepper', weightG: 50, priceAud: 3.20, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Cracked Pepper', weightG: 80, priceAud: 2.85, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'McCormick Cracked Black Pepper', weightG: 40, priceAud: 3.10, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Hoyts Cracked Black Pepper', weightG: 50, priceAud: 2.95, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Kirkland Coarse Ground Pepper', weightG: 359, priceAud: 10.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 11, status: 'Active', weightG: 80, orderQty: 0,
        name: { en: 'Fine Ground White Pepper 80g', km: 'ម្រេចសចម្រៀក ៨០ក្រាម', fr: 'Poivre blanc moulu fin 80g', zh: '细磨白胡椒粉 80g' },
        nameKhmer: 'ម្រេចសចម្រៀក ៨០ក្រាម', spec: { en: '80g Can / 20 Cans/CTN', km: 'កំប៉ុង ៨០ក្រាម / ២០ កំប៉ុង/កេស', fr: 'Boîte de 80g / 20 Boîtes/CTN', zh: '80g/罐 / 20罐/箱' }, fobUsd: 1.43, pcsPer20ft: 24000,
        asianComps: [
            { brand: 'Cock Brand White Pepper Powder', weightG: 100, priceAud: 3.90, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Erawan White Pepper Powder', weightG: 80, priceAud: 3.60, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Hoyts White Pepper Ground', weightG: 100, priceAud: 4.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Saxa Ground White Pepper', weightG: 50, priceAud: 3.20, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 12, status: 'Active', weightG: 650, orderQty: 0,
        name: { en: 'Coarse Ground Black Pepper 650g', km: 'ម្រេចខ្មៅចម្រៀក ៦៥០ក្រាម', fr: 'Poivre noir concassé 650g', zh: '粗磨黑胡椒碎 650g (餐饮罐装)' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ៦៥០ក្រាម', spec: { en: '650g Can / 6 Cans/CTN', km: 'កំប៉ុង ៦៥០ក្រាម / ៦ កំប៉ុង/កេស', fr: 'Boîte de 650g / 6 Boîtes/CTN', zh: '650g/罐 / 6罐/箱' }, fobUsd: 7.46, pcsPer20ft: 9000,
        asianComps: [
            { brand: 'Chef Choice Coarse Pepper', weightG: 500, priceAud: 12.50, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Thai Catering Cracked Pepper', weightG: 600, priceAud: 13.80, source: 'Src: KFL Asian Grocery Springvale' }
        ],
        ausComps: [
            { brand: 'MasterFoods Pepper Catering', weightG: 500, priceAud: 14.50, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'McCormick Catering Cracked', weightG: 500, priceAud: 15.20, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Kirkland Coarse Pepper Bulk Container', weightG: 359, priceAud: 10.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 13, status: 'Active', weightG: 650, orderQty: 0,
        name: { en: 'Fine Ground Black Pepper 650g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ៦៥០ក្រាម', fr: 'Poivre noir moulu fin 650g', zh: '细磨黑胡椒粉 650g (餐饮罐装)' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ៦៥០ក្រាម', spec: { en: '650g Can / 6 Cans/CTN', km: 'កំប៉ុង ៦៥០ក្រាម / ៦ កំប៉ុង/កេស', fr: 'Boîte de 650g / 6 Boîtes/CTN', zh: '650g/罐 / 6罐/箱' }, fobUsd: 7.46, pcsPer20ft: 9000,
        asianComps: [
            { brand: 'Thai Pure Ground Pepper', weightG: 500, priceAud: 12.00, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Fine Pepper', weightG: 600, priceAud: 13.20, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Hoyts Catering Ground Pepper', weightG: 500, priceAud: 13.80, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Saxa Fine Pepper Catering', weightG: 500, priceAud: 14.20, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Kirkland Ground Pepper Bulk', weightG: 348, priceAud: 13.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 14, status: 'Active', weightG: 1000, orderQty: 0,
        name: { en: 'Black Pepper Whole 1000g', km: 'ម្រេចខ្មៅគ្រាប់មូល ១០០០ក្រាម', fr: 'Poivre noir entier 1000g', zh: '整粒黑胡椒粒 1000g (大包装)' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ១០០០ក្រាម', spec: { en: '1000g Bag / 10 Bags (10kg/CTN)', km: 'ថង់ ១០០០ក្រាម / ១០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Sacs (10kg/CTN)', zh: '1000g/袋 / 10袋 (10kg/箱)' }, fobUsd: 9.07, pcsPer20ft: 10000,
        asianComps: [
            { brand: 'VN Premium Whole Pepper', weightG: 1000, priceAud: 16.50, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Erawan Whole Pepper', weightG: 1000, priceAud: 15.90, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Deep Black Peppercorns Bulk', weightG: 1000, priceAud: 17.50, source: 'Src: Radhe Indian Grocery' },
            { brand: 'MD Sri Lankan Peppercorn Bulk', weightG: 1000, priceAud: 18.20, source: 'Src: Ceylon Supermarket VIC' }
        ],
        ausComps: [
            { brand: 'MasterFoods Peppercorns Bulk', weightG: 1000, priceAud: 21.50, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Hoyts Whole Pepper Bulk', weightG: 1000, priceAud: 19.80, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Kirkland Whole Peppercorn Jar', weightG: 357, priceAud: 14.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 15, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Black Pepper Whole 500g', km: 'ម្រេចខ្មៅគ្រាប់មូល ៥០០ក្រាម', fr: 'Poivre noir entier 500g', zh: '整粒黑胡椒粒 500g' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ៥០០ក្រាម', spec: { en: '500g Bag / 20 Bags (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Sacs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 4.60, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Erawan Whole Black Pepper', weightG: 500, priceAud: 8.80, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Whole Pepper', weightG: 500, priceAud: 8.50, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Hoyts Black Peppercorn', weightG: 500, priceAud: 10.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'McCormick Peppercorn Bag', weightG: 500, priceAud: 11.20, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 16, status: 'Active', weightG: 1000, orderQty: 0,
        name: { en: 'Crushed Black Pepper (10-20 Mesh) 1000g', km: 'ម្រេចខ្មៅចម្រៀកកំរិត 10-20 ម៉េស ១០០០ក្រាម', fr: 'Poivre noir concassé (10-20 Mesh) 1000g', zh: '黑胡椒碎 (10-20目) 1000g' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀកកំរិត 10-20 ម៉េស ១០០០ក្រាម', spec: { en: '1000g Bag / 10 Bags (10kg/CTN)', km: 'ថង់ ១០០០ក្រាម / ១០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Bags (10kg/CTN)', zh: '1000g/袋 / 10袋 (10kg/箱)' }, fobUsd: 9.46, pcsPer20ft: 10000,
        asianComps: [
            { brand: 'VN Cracked Black Pepper', weightG: 1000, priceAud: 17.50, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Thai Chef Cracked Pepper', weightG: 1000, priceAud: 16.90, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'McCormick Cracked Pepper', weightG: 1000, priceAud: 22.50, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'MasterFoods Cracked Pepper', weightG: 1000, priceAud: 23.90, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 17, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Crushed Black Pepper (10-20 Mesh) 500g', km: 'ម្រេចខ្មៅចម្រៀកកំរិត 10-20 ម៉េស ៥០០ក្រាម', fr: 'Poivre noir concassé (10-20 Mesh) 500g', zh: '黑胡椒碎 (10-20目) 500g' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀកកំរិត 10-20 ម៉េស ៥០០ក្រាម', spec: { en: '500g Bag / 20 Bags (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Bags (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 4.79, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Cock Brand Crushed Pepper', weightG: 500, priceAud: 9.20, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Erawan Crushed Pepper', weightG: 500, priceAud: 8.90, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'MasterFoods Cracked Pepper', weightG: 500, priceAud: 11.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Hoyts Cracked Black Pepper', weightG: 500, priceAud: 10.90, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 18, status: 'Active', weightG: 1000, orderQty: 0,
        name: { en: 'Fine Ground Black Pepper (40 Mesh) 1000g', km: 'ម្រេចខ្មៅម៉ដ្ឋកំរិត 40 ម៉េស ១០០០ក្រាម', fr: 'Poivre noir moulu fin (40 Mesh) 1000g', zh: '细磨黑胡椒粉 (40目) 1000g' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋកំរិត 40 ម៉េស ១០០០ក្រាម', spec: { en: '1000g Bag / 10 Bags (10kg/CTN)', km: 'ថង់ ១០០០ក្រាម / ១០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Bags (10kg/CTN)', zh: '1000g/袋 / 10袋 (10kg/箱)' }, fobUsd: 9.46, pcsPer20ft: 10000,
        asianComps: [
            { brand: 'Thai Pure Pepper Powder', weightG: 1000, priceAud: 17.20, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Ground Pepper', weightG: 1000, priceAud: 16.80, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Saxa Ground Black Pepper', weightG: 1000, priceAud: 21.90, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Hoyts Fine Ground Pepper', weightG: 1000, priceAud: 20.50, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 19, status: 'Active', weightG: 500, orderQty: 0,
        name: { en: 'Fine Ground Black Pepper (40 Mesh) 500g', km: 'ម្រេចខ្មៅម៉ដ្ឋកំរិត 40 ម៉េស ៥០០ក្រាម', fr: 'Poivre noir moulu fin (40 Mesh) 500g', zh: '细磨黑胡椒粉 (40目) 500g' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋកំរិត 40 ម៉េស ៥០០ក្រាម', spec: { en: '500g Bag / 20 Bags (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Bags (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 4.78, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Cock Brand Fine Pepper', weightG: 500, priceAud: 8.90, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Erawan Fine Pepper', weightG: 500, priceAud: 8.50, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Hoyts Fine Black Pepper', weightG: 500, priceAud: 10.80, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Saxa Ground Pepper Bag', weightG: 500, priceAud: 10.50, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 20, status: 'Active', weightG: 200, orderQty: 0,
        name: { en: 'Black Pepper Whole 200g', km: 'ម្រេចខ្មៅគ្រាប់មូល ២០០ក្រាម', fr: 'Poivre noir entier 200g', zh: '整粒黑胡椒粒 200g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ២០០ក្រាម', spec: { en: '200g Can / 12 Cans/CTN', km: 'កំប៉ុង ២០០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 200g / 12 Boîtes/CTN', zh: '200g/罐 / 12罐/箱' }, fobUsd: 2.68, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'Thai Whole Pepper Can', weightG: 200, priceAud: 5.20, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Peppercorn Can', weightG: 200, priceAud: 4.90, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'McCormick Peppercorn Can', weightG: 200, priceAud: 6.20, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'MasterFoods Peppercorn Shaker', weightG: 200, priceAud: 6.50, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 21, status: 'Active', weightG: 250, orderQty: 0,
        name: { en: 'Coarse Ground Black Pepper 250g', km: 'ម្រេចខ្មៅចម្រៀក ២៥០ក្រាម', fr: 'Poivre noir concassé 250g', zh: '粗磨黑胡椒碎 250g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ២៥០ក្រាម', spec: { en: '250g Can / 12 Cans/CTN', km: 'កំប៉ុង ២៥០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 250g / 12 Boîtes/CTN', zh: '250g/罐 / 12罐/箱' }, fobUsd: 3.37, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'Cock Brand Coarse Pepper', weightG: 250, priceAud: 5.80, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Thai Chef Coarse Pepper', weightG: 250, priceAud: 5.60, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'MasterFoods Cracked Pepper', weightG: 250, priceAud: 6.90, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Hoyts Cracked Pepper Can', weightG: 250, priceAud: 6.50, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 22, status: 'Active', weightG: 250, orderQty: 0,
        name: { en: 'Fine Ground Black Pepper 250g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ២៥០ក្រាម', fr: 'Poivre noir moulu fin 250g', zh: '细磨黑胡椒粉 250g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ២៥០ក្រាម', spec: { en: '250g Can / 12 Cans/CTN', km: 'កំប៉ុង ២៥០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 250g / 12 Boîtes/CTN', zh: '250g/罐 / 12罐/箱' }, fobUsd: 3.37, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'Erawan Ground Black Pepper', weightG: 250, priceAud: 5.60, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Fine Pepper', weightG: 250, priceAud: 5.40, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Saxa Pepper Shaker', weightG: 250, priceAud: 6.80, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'McCormick Ground Pepper', weightG: 250, priceAud: 7.10, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 23, status: 'Active', weightG: 350, orderQty: 0,
        name: { en: 'Black Pepper Whole 350g', km: 'ម្រេចខ្មៅគ្រាប់មូល ៣៥០ក្រាម', fr: 'Poivre noir entier 350g', zh: '整粒黑胡椒粒 350g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ៣៥០ក្រាម', spec: { en: '350g Can / 12 Cans/CTN', km: 'កំប៉ុង ៣៥០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 350g / 12 Boîtes/CTN', zh: '350g/罐 / 12罐/箱' }, fobUsd: 3.59, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'Thai Whole Peppercorn Can', weightG: 350, priceAud: 7.50, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'VN Whole Peppercorn Can', weightG: 350, priceAud: 7.20, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Hoyts Peppercorns Can', weightG: 350, priceAud: 8.80, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'MasterFoods Peppercorns', weightG: 350, priceAud: 9.20, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 24, status: 'Active', weightG: 360, orderQty: 0,
        name: { en: 'Coarse Ground Black Pepper 360g', km: 'ម្រេចខ្មៅចម្រៀក ៣៦០ក្រាម', fr: 'Poivre noir concassé 360g', zh: '粗磨黑胡椒碎 360g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ៣៦០ក្រាម', spec: { en: '360g Can / 12 Cans/CTN', km: 'កំប៉ុង ៣៦០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 360g / 12 Boîtes/CTN', zh: '360g/罐 / 12罐/箱' }, fobUsd: 4.06, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'VN Cracked Black Pepper Can', weightG: 360, priceAud: 8.20, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Cock Brand Cracked Pepper', weightG: 360, priceAud: 7.90, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'MasterFoods Cracked Pepper Can', weightG: 360, priceAud: 9.90, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'McCormick Cracked Pepper Can', weightG: 360, priceAud: 10.20, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Kirkland Coarse Pepper Shaker', weightG: 359, priceAud: 10.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 25, status: 'Active', weightG: 360, orderQty: 0,
        name: { en: 'Fine Ground Black Pepper 360g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ៣៦០ក្រាម', fr: 'Poivre noir moulu fin 360g', zh: '细磨黑胡椒粉 360g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ៣៦០ក្រាម', spec: { en: '360g Can / 12 Cans/CTN', km: 'កំប៉ុង ៣៦០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 360g / 12 Boîtes/CTN', zh: '360g/罐 / 12罐/箱' }, fobUsd: 3.89, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'Cock Brand Fine Pepper Can', weightG: 360, priceAud: 7.90, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Erawan Fine Pepper Can', weightG: 360, priceAud: 7.60, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Saxa Ground Black Pepper Can', weightG: 360, priceAud: 9.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Hoyts Ground Pepper Can', weightG: 360, priceAud: 9.10, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Kirkland Fine Pepper Shaker', weightG: 348, priceAud: 13.50, source: 'Src: Costco Wholesale AU' }
        ]
    },
    {
        id: 26, status: 'Upcoming', weightG: 100, orderQty: 0,
        name: { en: 'Instant Rice Stir-Fry Noodle 100g', km: 'មីគោក ១០០ក្រាម', fr: 'Nouilles de riz sautées instantanées 100g', zh: '即食干炒米粉 100g' },
        nameKhmer: 'មីគោក ១០០ក្រាម', spec: { en: '100g Box / 24 Pcs per CTN', km: 'ប្រអប់ ១០០ក្រាម / ២៤ កញ្ចប់/កេស', fr: 'Boîte de 100g / 24 Pcs/CTN', zh: '100g/盒 / 24包/箱' }, fobUsd: 0.85, pcsPer20ft: 18000,
        asianComps: [
            { brand: 'Mama Instant Rice Noodle Pack', weightG: 100, priceAud: 1.50, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Wai Wai Rice Noodle', weightG: 100, priceAud: 1.40, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Maggi Fusian Noodles', weightG: 100, priceAud: 1.60, source: 'Src: DesiKart Indian Grocery' }
        ],
        ausComps: [
            { brand: 'Trident Instant Rice Noodle Bowl', weightG: 100, priceAud: 1.95, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Suimin Noodle Cup', weightG: 100, priceAud: 1.80, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 27, status: 'Upcoming', weightG: 500, orderQty: 0,
        name: { en: 'Crispy Rice Cake Flour 500g', km: 'ម្សៅនំគ្រក់ ៥០០ក្រាម', fr: 'Farine pour gâteau de riz croustillant 500g', zh: '柬式香脆米饼粉 (Nom Krok) 500g' },
        nameKhmer: 'ម្សៅនំគ្រក់ ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.95, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Bot Banh Khot Cake Flour', weightG: 500, priceAud: 2.70, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Vinh Thuan Rice Cake Premix', weightG: 500, priceAud: 2.60, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Asian Specialty Rice Cake Premix', weightG: 500, priceAud: 3.40, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Lian How Rice Flour Premix', weightG: 500, priceAud: 3.20, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 28, status: 'Upcoming', weightG: 500, orderQty: 0,
        name: { en: 'Chinese Doughnuts Flour 500g', km: 'ម្សៅនំឆា ៥០០ក្រាម', fr: 'Farine pour beignets chinois (Youtiao) 500g', zh: '油条专用预拌粉 500g' },
        nameKhmer: 'ម្សៅនំឆា ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.90, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Youtiao Chinese Donut Premix', weightG: 500, priceAud: 2.50, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'San Gaou Youtiao Mix', weightG: 500, priceAud: 2.40, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Defiance Specialty Flour Mix', weightG: 500, priceAud: 3.10, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Laucke Sweet Dough Premix', weightG: 500, priceAud: 3.30, source: 'Src: Coles Online AU (Melb)' }
        ]
    },
    {
        id: 29, status: 'Upcoming', weightG: 500, orderQty: 0,
        name: { en: 'Waffle Flour 500g', km: 'ម្សៅពុម្ព ៥០០ក្រាម', fr: 'Farine pour gaufres asiatiques 500g', zh: '东南亚华夫饼/格仔饼预拌粉 500g' },
        nameKhmer: 'ម្សៅពុម្ព ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 1.10, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Thai Pandan Waffle Premix', weightG: 500, priceAud: 2.90, source: 'Src: Minh Phat Market Richmond' },
            { brand: 'Erawan Waffle Mix', weightG: 500, priceAud: 2.80, source: 'Src: KFL Asian Grocery Springvale' }
        ],
        ausComps: [
            { brand: 'Greens Belgian Waffle Mix', weightG: 400, priceAud: 3.20, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'White Wings Waffle Mix', weightG: 400, priceAud: 3.40, source: 'Src: Woolworths Supermarkets VIC' }
        ]
    },
    {
        id: 30, status: 'Upcoming', weightG: 500, orderQty: 0,
        name: { en: 'Steamed Rice Cake Flour 500g', km: 'ម្សៅនំអាកោ ៥០០ក្រាម', fr: 'Farine pour gâteau de riz à la vapeur 500g', zh: '蒸米糕粉 (Nom Ako) 500g' },
        nameKhmer: 'ម្សៅនំអាកោ ៥០០ក្រាម', spec: { en: '500g Bag / 20 Pcs (10kg/CTN)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.85, pcsPer20ft: 20000,
        asianComps: [
            { brand: 'Bot Banh Khot Cake Flour', weightG: 500, priceAud: 2.40, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Vinh Thuan Steamed Cake', weightG: 500, priceAud: 2.30, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Asian Rice Cake Premix', weightG: 500, priceAud: 3.10, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Lian How Steamed Cake Mix', weightG: 500, priceAud: 3.25, source: 'Src: Coles Online AU (Melb)' }
        ]
    }
];

const TOTAL_FIXED_CUSTOMS_AUD = 253.50 + 154.00 + 67.50 + 1695.00 + 65.00;

function calculateProductCosts(product, fx, oceanFreightUsd, localCartageAud, marginPercent, containerType) {
    const specStr = typeof product.spec === 'object' ? product.spec.en : product.spec;
    const pcsPerCtn = getPcsPerCtn(specStr);
    
    const containerCapacityMultiplier = containerType === '40ft' ? 2.0 : 1.0;
    const effectivePcsPerContainer = product.pcsPer20ft * containerCapacityMultiplier;

    const fobAudPcs = product.fobUsd / fx;
    const oceanFreightAudTotal = oceanFreightUsd / fx;
    const freightAudPerPc = oceanFreightAudTotal / effectivePcsPerContainer;
    const customsAudPerPc = TOTAL_FIXED_CUSTOMS_AUD / effectivePcsPerContainer;
    const cartageAudPerPc = localCartageAud / effectivePcsPerContainer;
    const opexAudPerPc = currentOpExPerContainerAUD / effectivePcsPerContainer;

    const landedCostAudPcs = fobAudPcs + freightAudPerPc + customsAudPerPc + cartageAudPerPc + opexAudPerPc;
    
    const fobAudCtn = fobAudPcs * pcsPerCtn;
    const freightAudCtn = freightAudPerPc * pcsPerCtn;
    const customsAudCtn = customsAudPerPc * pcsPerCtn;
    const cartageAudCtn = cartageAudPerPc * pcsPerCtn;
    const opexAudCtn = opexAudPerPc * pcsPerCtn;
    const landedCostAudCtn = landedCostAudPcs * pcsPerCtn;

    const marginDecimal = marginPercent / 100;
    const sellingPriceAudCtn = marginDecimal < 1 ? landedCostAudCtn / (1 - marginDecimal) : landedCostAudCtn;
    const sellingPriceAudPcsBase = sellingPriceAudCtn / pcsPerCtn;

    const customerSellingPriceAudPcs = sellingPriceAudPcsBase * 1.30;

    const grossMarginCtn = sellingPriceAudCtn - landedCostAudCtn;
    const tax10PctCtn = grossMarginCtn * 0.10;
    const netProfitCtn = grossMarginCtn - tax10PctCtn;
    const netProfitPcs = netProfitCtn / pcsPerCtn;
    
    product.lastCalculatedNetProfitCtn = netProfitCtn;

    return {
        fobAudPcs, fobAudCtn, freightAudCtn, customsAudCtn, cartageAudCtn, opexAudCtn,
        landedCostAudPcs, landedCostAudCtn, sellingPriceAudCtn, sellingPriceAudPcsBase,
        customerSellingPriceAudPcs, grossMarginCtn, tax10PctCtn, netProfitCtn, netProfitPcs,
        effectivePcsPerContainer
    };
}

function updateProductCtnUsd(productId, newCtnUsd) {
    const parsedCtnVal = parseFloat(newCtnUsd);
    const product = productsData.find(p => p.id === productId);
    
    if (product && !isNaN(parsedCtnVal) && parsedCtnVal >= 0) {
        const specStr = typeof product.spec === 'object' ? product.spec.en : product.spec;
        const pcsPerCtn = getPcsPerCtn(specStr);
        product.fobUsd = parsedCtnVal / pcsPerCtn;
        renderTable();
    }
}

function generateCompetitorHtml(compList, targetWeightG, customerSellingPriceAudPcs, iconClass) {
    if (!compList || !compList.length) return '';
    const t = translations[currentLang];
    return compList.map(comp => {
        const equivPriceAud = (comp.priceAud / comp.weightG) * targetWeightG;
        const isBetter = customerSellingPriceAudPcs <= equivPriceAud;
        const badgeClass = isBetter ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300';
        
        return `
            <div class="mb-2 last:mb-0 pb-1 border-b border-slate-100 last:border-b-0">
                <div class="text-slate-800 font-medium text-xs mb-0.5">${comp.brand} ${comp.weightG}g ($${comp.priceAud.toFixed(2)}/pc)</div>
                <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="source-badge border ${badgeClass}"><i class="${iconClass} mr-0.5 text-[9px]"></i> ${comp.source}</span>
                    <span class="text-[10px] text-slate-500 font-mono">[${t.lbl_eq}: $${equivPriceAud.toFixed(2)}/${targetWeightG}g]</span>
                </div>
            </div>
        `;
    }).join('');
}

// --- AUTOMATIC CONTAINER CARTAGE & FREIGHT SWITCHING ENGINE ---
function handleContainerTypeChange() {
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const inputFreight = document.getElementById('input-freight');
    const inputCartage = document.getElementById('input-cartage');

    if (containerType === '40ft') {
        if (inputFreight && (inputFreight.value === '1650' || inputFreight.value === '1650.00')) inputFreight.value = '2850';
        if (inputCartage) inputCartage.value = '1450';
    } else {
        if (inputFreight && (inputFreight.value === '2850' || inputFreight.value === '2850.00')) inputFreight.value = '1650';
        if (inputCartage) inputCartage.value = '750';
    }

    updateOpExFromInputs();
}

function renderTable() {
    const inputContainerType = document.getElementById('input-container-type');
    const inputFx = document.getElementById('input-fx');
    const inputFreight = document.getElementById('input-freight');
    const inputCartage = document.getElementById('input-cartage');
    const inputMargin = document.getElementById('input-margin');

    const containerType = inputContainerType?.value || '20ft';
    const fx = parseFloat(inputFx?.value) || 0.6620;
    const oceanFreightUsd = parseFloat(inputFreight?.value) || (containerType === '40ft' ? 2850 : 1650);
    const localCartageAud = parseFloat(inputCartage?.value) || (containerType === '40ft' ? 1450 : 750);
    const marginPercent = parseFloat(inputMargin?.value) || 20;

    ANNUAL_CONTAINERS = containerType === '40ft' ? 6 : 12;
    currentOpExPerContainerAUD = currentAnnualOpExAUD / ANNUAL_CONTAINERS;

    if (document.getElementById('card-fx-rate')) document.getElementById('card-fx-rate').innerText = fx.toFixed(4) + ' AUD/USD';
    if (document.getElementById('card-ocean-freight')) document.getElementById('card-ocean-freight').innerText = '$' + oceanFreightUsd.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' USD';
    if (document.getElementById('card-local-cartage')) document.getElementById('card-local-cartage').innerText = '$' + localCartageAud.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';

    const tbody = document.getElementById('product-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const t = translations[currentLang];

    productsData.forEach((p, idx) => {
        const calc = calculateProductCosts(p, fx, oceanFreightUsd, localCartageAud, marginPercent, containerType);
        const isUpcoming = p.status === 'Upcoming';
        const displayName = p.name[currentLang] || p.name.en;
        const displaySpec = typeof p.spec === 'object' ? (p.spec[currentLang] || p.spec.en) : p.spec;
        const specStrEn = typeof p.spec === 'object' ? p.spec.en : p.spec;
        const pcsPerCtn = getPcsPerCtn(specStrEn);
        const ctnUsdVal = p.fobUsd * pcsPerCtn;

        const asianCompHtml = generateCompetitorHtml(p.asianComps, p.weightG, calc.customerSellingPriceAudPcs, 'fa-solid fa-store');
        const ausCompHtml = generateCompetitorHtml(p.ausComps, p.weightG, calc.customerSellingPriceAudPcs, 'fa-solid fa-cart-shopping');

        const currentOrderQty = p.orderQty || 0;
        const currentOrderProfit = calc.netProfitCtn * currentOrderQty;

        const tr = document.createElement('tr');
        tr.id = `product-row-${p.id}`;
        tr.className = `hover:bg-slate-100/80 transition border-b-2 border-slate-300 ${isUpcoming ? 'bg-amber-50/50' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70')}`;

        tr.innerHTML = `
            <td class="py-3 px-2 text-center font-bold text-slate-500 border-r-2 border-slate-200">${p.id}</td>
            <td class="py-3 px-3 border-r-2 border-slate-200">
                <div class="flex items-center gap-1.5 mb-0.5">
                    <span class="font-bold text-slate-900">${displayName}</span>
                    ${isUpcoming ? '<span class="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">NOV 2026</span>' : ''}
                </div>
                <div class="text-slate-600 text-[11px] font-khmer mb-1">${p.nameKhmer}</div>
                <div class="flex items-center gap-2 text-[10px] text-slate-500">
                    <span class="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                        <i class="fa-solid fa-weight-hanging text-gold-600 mr-1"></i>${displaySpec}
                    </span>
                    <span class="text-slate-400">(${calc.effectivePcsPerContainer.toLocaleString()} pcs/${containerType})</span>
                </div>
            </td>
            <td class="py-3 px-3 border-r-2 border-slate-200 text-right font-mono">
                <div class="flex items-center justify-end gap-1 mb-1">
                    <span class="text-xs text-slate-500 font-bold">$</span>
                    <input type="number" step="0.10" min="0" value="${ctnUsdVal.toFixed(2)}" 
                        onchange="updateProductCtnUsd(${p.id}, this.value)"
                        class="bg-slate-100 hover:bg-white border border-slate-300 focus:border-gold-500 focus:bg-white text-slate-900 font-bold text-sm rounded px-2 py-0.5 text-right w-20 focus:outline-none transition shadow-sm"
                        title="Click or type to adjust USD CTN price">
                    <span class="text-[10px] text-gold-600 font-bold font-sans">USD/CTN</span>
                </div>
                <div class="text-[10px] text-slate-600 space-y-0.5">
                    <div class="flex justify-between items-center gap-2">
                        <span class="text-slate-400 font-sans">${t.lbl_pcs_usd}</span>
                        <strong id="pcs-usd-${p.id}" class="text-slate-800">$${p.fobUsd.toFixed(2)} USD</strong>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                        <span class="text-slate-400 font-sans">${t.lbl_pcs_aud}</span>
                        <strong id="pcs-aud-${p.id}" class="text-slate-700">$${calc.fobAudPcs.toFixed(2)} AUD</strong>
                    </div>
                </div>
            </td>
            <td class="py-3 px-3 border-r-2 border-slate-200 bg-slate-50/80 font-mono">
                <div class="flex justify-between items-center bg-slate-900 text-white p-1.5 rounded mb-1.5 shadow-sm">
                    <span class="text-[10px] uppercase font-bold text-gold-400 font-sans">${t.lbl_landed_ctn_aud}</span>
                    <span id="landed-cost-ctn-${p.id}" class="font-black text-xs text-white">$${calc.landedCostAudCtn.toFixed(2)} AUD</span>
                </div>
                <div class="space-y-0.5 text-[10px] text-slate-600 border-b border-dashed border-slate-300 pb-1.5 mb-1.5">
                    <div class="flex justify-between pl-1"><span class="text-slate-600 font-semibold font-sans">${t.lbl_fob_ctn_aud}</span><strong class="text-slate-800">$${calc.fobAudCtn.toFixed(2)}</strong></div>
                    <div class="flex justify-between pl-1"><span class="text-slate-500 font-sans">${t.lbl_ocean_ctn_aud}</span><span>$${calc.freightAudCtn.toFixed(2)}</span></div>
                    <div class="flex justify-between pl-1"><span class="text-slate-500 font-sans">${t.lbl_customs_ctn_aud}</span><span>$${calc.customsAudCtn.toFixed(2)}</span></div>
                    <div class="flex justify-between pl-1"><span class="text-slate-500 font-sans">${t.lbl_local_ctn_aud}</span><span>$${calc.cartageAudCtn.toFixed(2)}</span></div>
                    <div class="flex justify-between pl-1 text-amber-700 bg-amber-50/60 font-semibold rounded px-0.5"><span class="font-sans">${t.lbl_opex_ctn_aud}</span><span>+$${calc.opexAudCtn.toFixed(2)}</span></div>
                </div>
                <div class="bg-gold-50 border border-gold-300 p-1.5 rounded space-y-1">
                    <div class="flex justify-between items-center text-[10px]">
                        <span class="text-gold-900 font-bold font-sans">${t.lbl_sell_ctn} ${marginPercent}%:</span>
                        <span id="selling-price-ctn-${p.id}" class="text-gold-800 font-extrabold text-xs">$${calc.sellingPriceAudCtn.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center text-[10px] border-t border-gold-200/80 pt-0.5">
                        <span class="text-gold-800 font-bold font-sans">${t.lbl_cust_margin_fixed}</span>
                        <span id="selling-price-pcs-${p.id}" class="text-gold-700 font-bold text-xs">$${calc.customerSellingPriceAudPcs.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center text-[10px] border-t border-gold-300/80 pt-1 mt-1 bg-emerald-500/10 p-1 rounded">
                        <span class="text-emerald-900 font-black font-sans">${t.lbl_net_profit_ctn}</span>
                        <span id="net-profit-ctn-${p.id}" class="font-black text-xs ${calc.netProfitCtn >= 0 ? 'text-emerald-700' : 'text-rose-600'}">$${calc.netProfitCtn.toFixed(2)} AUD</span>
                    </div>
                    <div class="flex justify-between items-center text-[10px] border-t border-emerald-300/80 pt-1 bg-emerald-600/10 p-1 rounded">
                        <div class="flex items-center gap-1">
                            <span class="text-emerald-950 font-black font-sans">${t.lbl_order_net_profits}</span>
                            <input type="number" id="input-order-qty-${p.id}" value="${currentOrderQty}" min="0" step="1"
                                oninput="syncOrderQty(${p.id}, this.value)"
                                class="w-12 bg-white border border-emerald-400 focus:border-emerald-600 font-bold font-mono text-[10px] text-right rounded px-1 py-0.5 focus:outline-none transition shadow-sm"
                                title="Enter total orders in cartons (CTN)">
                        </div>
                        <span id="order-net-profit-${p.id}" class="font-black text-xs ${currentOrderProfit > 0 ? 'text-emerald-800' : (currentOrderProfit < 0 ? 'text-rose-600' : 'text-slate-500')}">
                            $${currentOrderProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} AUD
                        </span>
                    </div>
                </div>
            </td>
            <td class="py-3 px-3 border-r-2 border-slate-200">${asianCompHtml}</td>
            <td class="py-3 px-3">${ausCompHtml}</td>
        `;

        tbody.appendChild(tr);
    });

    renderMasterProfitModelTable();
}

function syncOrderQty(productId, newQty) {
    const qty = parseFloat(newQty) || 0;

    const product = productsData.find(p => p.id === productId);
    if (product) product.orderQty = qty;

    const mainInput = document.getElementById(`input-order-qty-${productId}`);
    if (mainInput && parseFloat(mainInput.value) !== qty) mainInput.value = qty;

    const masterInput = document.getElementById(`master-profit-qty-${productId}`);
    if (masterInput && parseFloat(masterInput.value) !== qty) masterInput.value = qty;

    if (product && product.lastCalculatedNetProfitCtn !== undefined) {
        const orderProfit = product.lastCalculatedNetProfitCtn * qty;

        const mainDisplay = document.getElementById(`order-net-profit-${productId}`);
        if (mainDisplay) {
            mainDisplay.innerText = '$' + orderProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';
            mainDisplay.className = `font-black text-xs ${orderProfit > 0 ? 'text-emerald-800' : (orderProfit < 0 ? 'text-rose-600' : 'text-slate-500')}`;
        }

        const masterDisplay = document.getElementById(`master-profit-val-${productId}`);
        if (masterDisplay) {
            masterDisplay.innerText = '$' + orderProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';
            masterDisplay.className = `font-bold text-xs ${orderProfit > 0 ? 'text-emerald-700' : (orderProfit < 0 ? 'text-rose-600' : 'text-slate-400')}`;
        }
    }

    recalculateMasterProfitTotal();
}

// --- RECALCULATE MASTER PROFIT & AUTOMATIC OVER-CAPACITY ALERT (UNIT: CTN) ---
function recalculateMasterProfitTotal() {
    let totalProfit = 0;
    let totalCartons = 0;

    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    
    // Standard Carton Capacity: 1,000 CTN for 20ft container; 2,000 CTN for 40ft container
    const containerCapacityCartons = containerType === '40ft' ? 2000 : 1000;

    productsData.forEach(p => {
        const qtyCartons = p.orderQty || 0;
        totalCartons += qtyCartons;

        if (p.lastCalculatedNetProfitCtn !== undefined) {
            totalProfit += p.lastCalculatedNetProfitCtn * qtyCartons;
        }
    });

    const bannerTotal = document.getElementById('banner-master-profit-total');
    if (bannerTotal) bannerTotal.innerText = totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const footerVal = document.getElementById('master-profit-total-val');
    if (footerVal) footerVal.innerText = '$' + totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';

    const footerQty = document.getElementById('master-profit-total-qty');
    if (footerQty) footerQty.innerText = totalCartons.toLocaleString('en-US') + ' CTN';

    const floatProfit = document.getElementById('floating-total-profit');
    if (floatProfit) floatProfit.innerText = '$' + totalProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';

    const rawSpacePct = (totalCartons / containerCapacityCartons) * 100;
    const spacePct = Math.round(rawSpacePct);
    
    const spaceText = document.getElementById('floating-space-text');
    if (spaceText) spaceText.innerText = `${totalCartons.toLocaleString()} / ${containerCapacityCartons.toLocaleString()} CTN`;

    const spacePctEl = document.getElementById('floating-space-pct');
    if (spacePctEl) spacePctEl.innerText = `${spacePct}%`;

    const spaceBar = document.getElementById('floating-space-bar');
    if (spaceBar) {
        spaceBar.style.width = `${Math.min(spacePct, 100)}%`;
        if (spacePct > 100) {
            spaceBar.className = 'bg-rose-600 h-full rounded-full transition-all duration-300 animate-pulse';
        } else {
            spaceBar.className = 'bg-gradient-to-r from-emerald-500 to-gold-400 h-full rounded-full transition-all duration-300';
        }
    }

    // --- AUTOMATIC OVER-CAPACITY WARNING ALERT LOGIC ---
    let alertBadge = document.getElementById('over-capacity-badge');
    
    if (rawSpacePct > 100) {
        if (!alertBadge && spacePctEl) {
            alertBadge = document.createElement('span');
            alertBadge.id = 'over-capacity-badge';
            alertBadge.className = 'ml-2 px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded uppercase tracking-wider animate-bounce';
            alertBadge.innerText = 'OVER CAPACITY!';
            spacePctEl.parentNode.appendChild(alertBadge);
        }

        if (!containerOverCapacityAlertShown) {
            containerOverCapacityAlertShown = true;
            setTimeout(() => {
                alert(`⚠️ CONTAINER CAPACITY WARNING ⚠️\n\nTotal order volume has reached ${spacePct}% (${totalCartons.toLocaleString()} CTN) of maximum container capacity (${containerCapacityCartons.toLocaleString()} CTN for ${containerType}).\n\nPlease adjust carton quantities or switch to a 40ft container.`);
            }, 100);
        }
    } else {
        if (alertBadge) alertBadge.remove();
        containerOverCapacityAlertShown = false;
    }
}

function renderMasterProfitModelTable() {
    const masterTbody = document.getElementById('master-profit-table-body');
    if (!masterTbody) return;

    masterTbody.innerHTML = '';

    productsData.forEach(p => {
        const displayName = p.name[currentLang] || p.name.en;
        const qty = p.orderQty || 0;
        const netProfitCtn = p.lastCalculatedNetProfitCtn || 0;
        const orderProfit = netProfitCtn * qty;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-200';
        tr.innerHTML = `
            <td class="py-2 px-3 text-center font-bold text-slate-500">${p.id}</td>
            <td class="py-2 px-4 font-semibold text-slate-800">${displayName}</td>
            <td class="py-2 px-4 text-right">
                <input type="number" id="master-profit-qty-${p.id}" value="${qty}" min="0" step="1"
                    oninput="syncOrderQty(${p.id}, this.value)"
                    class="w-16 bg-slate-100 hover:bg-white border border-slate-300 focus:border-gold-500 rounded text-right font-bold py-0.5 px-1.5 text-xs font-mono focus:outline-none transition">
            </td>
            <td class="py-2 px-4 text-right font-mono">
                <span id="master-profit-val-${p.id}" class="font-bold text-xs ${orderProfit > 0 ? 'text-emerald-700' : (orderProfit < 0 ? 'text-rose-600' : 'text-slate-400')}">
                    $${orderProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} AUD
                </span>
            </td>
        `;
        masterTbody.appendChild(tr);
    });

    recalculateMasterProfitTotal();
}

async function loadLatestPrices() {
    try {
        fetchLiveFxRate();
        const response = await fetch('./prices.json?t=' + Date.now());
        if (!response.ok) throw new Error('Could not load prices.json');

        const data = await response.json();
        if (data && data.competitors) {
            productsData.forEach(product => {
                const compUpdate = data.competitors[product.id];
                if (compUpdate) {
                    if (compUpdate.asianComps) product.asianComps = compUpdate.asianComps;
                    if (compUpdate.ausComps) product.ausComps = compUpdate.ausComps;
                }
            });
        }
    } catch (err) {
        console.warn('Using default local pricing fallback:', err);
    } finally {
        updateOpExFromInputs();
    }
}

// Global Window Function Attachments
window.unlockPage = unlockPage;
window.togglePasswordVisibility = togglePasswordVisibility;
window.setLanguage = setLanguage;
window.updateProductCtnUsd = updateProductCtnUsd;
window.syncOrderQty = syncOrderQty;
window.resetOpExBudget = resetOpExBudget;
window.resetMasterProfitOrders = resetMasterProfitOrders;

// Initial Launch listeners
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(defaultOpExValues).forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateOpExFromInputs);
    });

    [1, 2, 3, 4, 5, 6].forEach(i => {
        document.getElementById(`c${i}_toggle_input`)?.addEventListener('change', updateOpExFromInputs);
    });

    document.getElementById('input-container-type')?.addEventListener('change', handleContainerTypeChange);
    document.getElementById('input-fx')?.addEventListener('input', renderTable);
    document.getElementById('input-freight')?.addEventListener('input', renderTable);
    document.getElementById('input-cartage')?.addEventListener('input', updateOpExFromInputs);
    document.getElementById('input-margin')?.addEventListener('input', renderTable);

    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', unlockPage);
    }
	// Attach inside DOMContentLoaded or init block:
const c6_3_el = document.getElementById('c6_3_ship_input');
if (c6_3_el) {
    c6_3_el.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        const inputCartage = document.getElementById('input-cartage');
        if (inputCartage) {
            inputCartage.value = val.toFixed(2);
        }
        updateOpExFromInputs();
    });
}

    updateOpExFromInputs();
});