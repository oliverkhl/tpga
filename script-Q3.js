// --- MASTER STATE DECLARATIONS & BASELINES ---
let currentAnnualOpExAUD = 280435.00;
let ANNUAL_CONTAINERS = 12;
let currentOpExPerContainerAUD = currentAnnualOpExAUD / ANNUAL_CONTAINERS;
let containerOverCapacityAlertShown = false;
let currentLang = 'en';

const TOTAL_FIXED_CUSTOMS_AUD = 253.50 + 154.00 + 67.50 + 1695.00 + 65.00;

// Default OpEx Baseline Values for Reset Button
const defaultOpExValues = {
    c1_1_input: 60.00, c1_2_input: 130.00, c1_3_input: 444.00,
    c2_1_base: 110000.00, c2_1_wc: 2200.00, c2_2_base: 84000.00, c2_2_wc: 2440.00,
    c3_1_mth_input: 260.00, c3_2_mth_input: 85.00, c3_3_mth_input: 40.00,
    c4_1_mth_input: 160.00, c4_2_mth_input: 55.00, c4_3_mth_input: 30.00, c4_4_mth_input: 90.00, c4_5_mth_input: 70.00,
    c5_1_ann_input: 177.00, c5_2_ann_input: 1800.00, c5_3_ann_input: 1500.00, c5_4_ann_input: 1860.00,
    c6_1_ship_input: 2920.60, c6_2_ship_input: 600.00, c6_3_ship_input: 0.00, c6_4_ship_input: 0.00, c6_5_ship_input: 223.00
};

// --- COMPLETE 30-PRODUCT DATASET WITH MULTI-LANGUAGE & COMPETITOR COMPARISONS ---
const productsData = [
    {
        id: 1, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 7.21,
        name: { en: 'Finest Rice Flour 500g', km: 'ម្សៅអង្ករខ្សាយ ៥០០ក្រាម', fr: 'Farine de riz fine 500g', zh: '优质大米粉 500g' },
        nameKhmer: 'ម្សៅអង្ករខ្សាយ ៥០០ក្រាម', spec: { en: '20 Pcs/CTN (10kg)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.36, pcsPer20ft: 20000,
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
        id: 2, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 11.67,
        name: { en: 'Glutinous Rice Flour 500g', km: 'ម្សៅអង្ករដំណើប ៥០០ក្រាម', fr: 'Farine de riz glutineux 500g', zh: '水磨糯米粉 500g' },
        nameKhmer: 'ម្សៅអង្ករដំណើប ៥០០ក្រាម', spec: { en: '20 Pcs/CTN (10kg)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.58, pcsPer20ft: 20000,
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
        id: 3, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 8.75,
        name: { en: 'Tapioca Flour 500g', km: 'ម្សៅឆា ៥០០ក្រាម', fr: 'Farine de tapioca 500g', zh: '木薯淀粉 / 生粉 500g' },
        nameKhmer: 'ម្សៅឆា ៥០០ក្រាម', spec: { en: '20 Pcs/CTN (10kg)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.44, pcsPer20ft: 20000,
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
        id: 4, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 18.00,
        name: { en: 'Pancake Flour (Banh Xeo) 500g', km: 'ម្សៅបាញ់ឆែវ ៥០០ក្រាម', fr: 'Farine pour crêpes asiatiques 500g', zh: '柬式/越式煎饼粉 (Banh Xeo) 500g' },
        nameKhmer: 'ម្សៅបាញ់ឆែវ ៥០០ក្រាម', spec: { en: '20 Pcs/CTN (10kg)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 0.90, pcsPer20ft: 20000,
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
        id: 5, status: 'Active', weightG: 1000, orderQty: 0, ctnPriceUsd: 12.54,
        name: { en: 'Crispy Tempura Flour 1000g', km: 'ម្សៅបំពងស្រួយ ១០០០ក្រាម', fr: 'Farine à tempura croustillante 1000g', zh: '香酥天妇罗炸粉 1000g' },
        nameKhmer: 'ម្សៅបំពងស្រួយ ១០០០ក្រាម', spec: { en: '10 Pcs/CTN (10kg)', km: 'ថង់ ១០០០ក្រាម / ១០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Pcs (10kg/CTN)', zh: '1000g/袋 / 10包 (10kg/箱)' }, fobUsd: 1.25, pcsPer20ft: 10000,
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
        id: 6, status: 'Active', weightG: 150, orderQty: 0, ctnPriceUsd: 23.40,
        name: { en: 'Crispy Tempura Flour 150g', km: 'ម្សៅបំពងស្រួយ ១៥០ក្រាម', fr: 'Farine à tempura croustillante 150g', zh: '香酥天妇罗炸粉 150g' },
        nameKhmer: 'ម្សៅបំពងស្រួយ ១៥០ក្រាម', spec: { en: '60 Pcs/CTN (9kg)', km: 'ថង់ ១៥០ក្រាម / ៦០ កញ្ចប់ (៦x១០កញ្ចប់/កេស)', fr: 'Sac de 150g / 60 Pcs (6x10pcs/CTN)', zh: '150g/袋 / 60包 (6x10包/箱)' }, fobUsd: 0.39, pcsPer20ft: 60000,
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
        id: 7, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 31.93,
        name: { en: 'Fried Banana Flour 500g', km: 'ម្សៅចេកចៀន ៥០០ក្រាម', fr: 'Farine pour bananes frites 500g', zh: '炸香蕉专用脆粉 500g' },
        nameKhmer: 'ម្សៅចេកចៀន ៥០០ក្រាម', spec: { en: '20 Pcs/CTN (10kg)', km: 'ថង់ ៥០០ក្រាម / ២០ កញ្ចប់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Pcs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 1.60, pcsPer20ft: 20000,
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
        id: 8, status: 'Active', weightG: 120, orderQty: 0, ctnPriceUsd: 43.57,
        name: { en: 'Black Pepper Whole 120g', km: 'ម្រេចខ្មៅគ្រាប់មូល ១២០ក្រាម', fr: 'Poivre noir entier 120g', zh: '整粒黑胡椒粒 120g' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ១២០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ១២០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 120g / 12 Boîtes/CTN', zh: '120g/罐 / 12罐/箱' }, fobUsd: 3.63, pcsPer20ft: 18000,
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
        id: 9, status: 'Active', weightG: 80, orderQty: 0, ctnPriceUsd: 28.59,
        name: { en: 'Fine Ground Black Pepper 80g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ៨០ក្រាម', fr: 'Poivre noir moulu fin 80g', zh: '细磨黑胡椒粉 80g' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ៨០ក្រាម', spec: { en: '20 Cans/CTN', km: 'កំប៉ុង ៨០ក្រាម / ២០ កំប៉ុង/កេស', fr: 'Boîte de 80g / 20 Boîtes/CTN', zh: '80g/罐 / 20罐/箱' }, fobUsd: 1.43, pcsPer20ft: 24000,
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
        id: 10, status: 'Active', weightG: 80, orderQty: 0, ctnPriceUsd: 28.59,
        name: { en: 'Coarse Ground Black Pepper 80g', km: 'ម្រេចខ្មៅចម្រៀក ៨០ក្រាម', fr: 'Poivre noir concassé 80g', zh: '粗磨黑胡椒碎 80g' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ៨០ក្រាម', spec: { en: '20 Cans/CTN', km: 'កំប៉ុង ៨០ក្រាម / ២០ កំប៉ុង/កេស', fr: 'Boîte de 80g / 20 Boîtes/CTN', zh: '80g/罐 / 20罐/箱' }, fobUsd: 1.43, pcsPer20ft: 24000,
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
        id: 11, status: 'Active', weightG: 80, orderQty: 0, ctnPriceUsd: 28.59,
        name: { en: 'Fine Ground White Pepper 80g', km: 'ម្រេចសចម្រៀក ៨០ក្រាម', fr: 'Poivre blanc moulu fin 80g', zh: '细磨白胡椒粉 80g' },
        nameKhmer: 'ម្រេចសចម្រៀក ៨០ក្រាម', spec: { en: '20 Cans/CTN', km: 'កំប៉ុង ៨០ក្រាម / ២០ កំប៉ុង/កេស', fr: 'Boîte de 80g / 20 Boîtes/CTN', zh: '80g/罐 / 20罐/箱' }, fobUsd: 1.43, pcsPer20ft: 24000,
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
        id: 12, status: 'Active', weightG: 650, orderQty: 0, ctnPriceUsd: 44.78,
        name: { en: 'Coarse Ground Black Pepper 650g', km: 'ម្រេចខ្មៅចម្រៀក ៦៥០ក្រាម', fr: 'Poivre noir concassé 650g', zh: '粗磨黑胡椒碎 650g (餐饮罐装)' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ៦៥០ក្រាម', spec: { en: '6 Cans/CTN', km: 'កំប៉ុង ៦៥០ក្រាម / ៦ កំប៉ុង/កេស', fr: 'Boîte de 650g / 6 Boîtes/CTN', zh: '650g/罐 / 6罐/箱' }, fobUsd: 7.46, pcsPer20ft: 9000,
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
        id: 13, status: 'Active', weightG: 650, orderQty: 0, ctnPriceUsd: 44.78,
        name: { en: 'Fine Ground Black Pepper 650g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ៦៥០ក្រាម', fr: 'Poivre noir moulu fin 650g', zh: '细磨黑胡椒粉 650g (餐饮罐装)' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ៦៥០ក្រាម', spec: { en: '6 Cans/CTN', km: 'កំប៉ុង ៦៥០ក្រាម / ៦ កំប៉ុង/កេស', fr: 'Boîte de 650g / 6 Boîtes/CTN', zh: '650g/罐 / 6罐/箱' }, fobUsd: 7.46, pcsPer20ft: 9000,
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
        id: 14, status: 'Active', weightG: 1000, orderQty: 0, ctnPriceUsd: 90.73,
        name: { en: 'Black Pepper Whole 1000g', km: 'ម្រេចខ្មៅគ្រាប់មូល ១០០០ក្រាម', fr: 'Poivre noir entier 1000g', zh: '整粒黑胡椒粒 1000g (大包装)' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ១០០០ក្រាម', spec: { en: '10 Bags/CTN', km: 'ថង់ ១០០០ក្រាម / ១០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Sacs (10kg/CTN)', zh: '1000g/袋 / 10袋 (10kg/箱)' }, fobUsd: 9.07, pcsPer20ft: 10000,
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
        id: 15, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 92.02,
        name: { en: 'Black Pepper Whole 500g', km: 'ម្រេចខ្មៅគ្រាប់មូល ៥០០ក្រាម', fr: 'Poivre noir entier 500g', zh: '整粒黑胡椒粒 500g' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ៥០០ក្រាម', spec: { en: '20 Bags/CTN', km: 'ថង់ ៥០០ក្រាម / ២០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Sacs (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 4.60, pcsPer20ft: 20000,
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
        id: 16, status: 'Active', weightG: 1000, orderQty: 0, ctnPriceUsd: 94.62,
        name: { en: 'Crushed Black Pepper (10-20 Mesh) 1000g', km: 'ម្រេចខ្មៅចម្រៀក 10-20 ម៉េស ១០០០g', fr: 'Poivre noir concassé (10-20 Mesh) 1000g', zh: '黑胡椒碎 (10-20目) 1000g' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀកកំរិត 10-20 ម៉េស ១០០០ក្រាម', spec: { en: '10 Bags/CTN', km: 'ថង់ ១០០០ក្រាម / ១០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Bags (10kg/CTN)', zh: '1000g/袋 / 10袋 (10kg/箱)' }, fobUsd: 9.46, pcsPer20ft: 10000,
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
        id: 17, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 95.75,
        name: { en: 'Crushed Black Pepper (10-20 Mesh) 500g', km: 'ម្រេចខ្មៅចម្រៀក 10-20 ម៉េស ៥០០g', fr: 'Poivre noir concassé (10-20 Mesh) 500g', zh: '黑胡椒碎 (10-20目) 500g' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀកកំរិត 10-20 ម៉េស ៥០០ក្រាម', spec: { en: '20 Bags/CTN', km: 'ថង់ ៥០០ក្រាម / ២០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Bags (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 4.79, pcsPer20ft: 20000,
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
        id: 18, status: 'Active', weightG: 1000, orderQty: 0, ctnPriceUsd: 94.55,
        name: { en: 'Fine Ground Black Pepper (40 Mesh) 1000g', km: 'ម្រេចខ្មៅម៉ដ្ឋ 40 ម៉េស ១០០០g', fr: 'Poivre noir moulu fin (40 Mesh) 1000g', zh: '细磨黑胡椒粉 (40目) 1000g' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋកំរិត 40 ម៉េស ១០០០ក្រាម', spec: { en: '10 Bags/CTN', km: 'ថង់ ១០០០ក្រាម / ១០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 1000g / 10 Bags (10kg/CTN)', zh: '1000g/袋 / 10袋 (10kg/箱)' }, fobUsd: 9.46, pcsPer20ft: 10000,
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
        id: 19, status: 'Active', weightG: 500, orderQty: 0, ctnPriceUsd: 95.59,
        name: { en: 'Fine Ground Black Pepper (40 Mesh) 500g', km: 'ម្រេចខ្មៅម៉ដ្ឋ 40 ម៉េស ៥០០g', fr: 'Poivre noir moulu fin (40 Mesh) 500g', zh: '细磨黑胡椒粉 (40目) 500g' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋកំរិត 40 ម៉េស ៥០០ក្រាម', spec: { en: '20 Bags/CTN', km: 'ថង់ ៥០០ក្រាម / ២០ ថង់ (១០គីឡូ/កេស)', fr: 'Sac de 500g / 20 Bags (10kg/CTN)', zh: '500g/袋 / 20包 (10kg/箱)' }, fobUsd: 4.78, pcsPer20ft: 20000,
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
        id: 20, status: 'Active', weightG: 200, orderQty: 0, ctnPriceUsd: 32.12,
        name: { en: 'Black Pepper Whole 200g', km: 'ម្រេចខ្មៅគ្រាប់មូល ២០០ក្រាម', fr: 'Poivre noir entier 200g', zh: '整粒黑胡椒粒 200g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ២០០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ២០០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 200g / 12 Boîtes/CTN', zh: '200g/罐 / 12罐/箱' }, fobUsd: 2.68, pcsPer20ft: 14400,
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
        id: 21, status: 'Active', weightG: 250, orderQty: 0, ctnPriceUsd: 40.39,
        name: { en: 'Coarse Ground Black Pepper 250g', km: 'ម្រេចខ្មៅចម្រៀក ២៥០ក្រាម', fr: 'Poivre noir concassé 250g', zh: '粗磨黑胡椒碎 250g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ២៥០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ២៥០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 250g / 12 Boîtes/CTN', zh: '250g/罐 / 12罐/箱' }, fobUsd: 3.37, pcsPer20ft: 14400,
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
        id: 22, status: 'Active', weightG: 250, orderQty: 0, ctnPriceUsd: 40.39,
        name: { en: 'Fine Ground Black Pepper 250g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ២៥០ក្រាម', fr: 'Poivre noir moulu fin 250g', zh: '细磨黑胡椒粉 250g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ២៥០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ២៥០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 250g / 12 Boîtes/CTN', zh: '250g/罐 / 12罐/箱' }, fobUsd: 3.37, pcsPer20ft: 14400,
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
        id: 23, status: 'Active', weightG: 350, orderQty: 0, ctnPriceUsd: 43.08,
        name: { en: 'Black Pepper Whole 350g', km: 'ម្រេចខ្មៅគ្រាប់មូល ៣៥០ក្រាម', fr: 'Poivre noir entier 350g', zh: '整粒黑胡椒粒 350g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅគ្រាប់មូល ៣៥០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ៣៥០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 350g / 12 Boîtes/CTN', zh: '350g/罐 / 12罐/箱' }, fobUsd: 3.59, pcsPer20ft: 14400,
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
        id: 24, status: 'Active', weightG: 360, orderQty: 0, ctnPriceUsd: 48.68,
        name: { en: 'Coarse Ground Black Pepper 360g', km: 'ម្រេចខ្មៅចម្រៀក ៣៦០ក្រាម', fr: 'Poivre noir concassé 360g', zh: '粗磨黑胡椒碎 360g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅចម្រៀក ៣៦០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ៣៦០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 360g / 12 Boîtes/CTN', zh: '360g/罐 / 12罐/箱' }, fobUsd: 4.06, pcsPer20ft: 14400,
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
        id: 25, status: 'Active', weightG: 360, orderQty: 0, ctnPriceUsd: 46.68,
        name: { en: 'Fine Ground Black Pepper 360g', km: 'ម្រេចខ្មៅម៉ដ្ឋ ៣៦០ក្រាម', fr: 'Poivre noir moulu fin 360g', zh: '细磨黑胡椒粉 360g (罐装)' },
        nameKhmer: 'ម្រេចខ្មៅម៉ដ្ឋ ៣៦០ក្រាម', spec: { en: '12 Cans/CTN', km: 'កំប៉ុង ៣៦០ក្រាម / ១២ កំប៉ុង/កេស', fr: 'Boîte de 360g / 12 Boîtes/CTN', zh: '360g/罐 / 12罐/箱' }, fobUsd: 3.89, pcsPer20ft: 14400,
        asianComps: [
            { brand: 'Cock Brand Fine Pepper Can', weightG: 360, priceAud: 7.90, source: 'Src: KFL Asian Grocery Springvale' },
            { brand: 'Erawan Fine Pepper Can', weightG: 360, priceAud: 7.60, source: 'Src: Minh Phat Market Richmond' }
        ],
        ausComps: [
            { brand: 'Saxa Ground Black Pepper Can', weightG: 360, priceAud: 9.50, source: 'Src: Coles Online AU (Melb)' },
            { brand: 'Hoyts Ground Pepper Can', weightG: 360, priceAud: 9.10, source: 'Src: Woolworths Supermarkets VIC' },
            { brand: 'Kirkland Fine Pepper Shaker', weightG: 348, priceAud: 13.50, source: 'Src: Costco Wholesale AU' }
        ]
    }
];

// --- TRANSLATION DICTIONARIES ---
const translations = {
    en: {
        modal_title: "Restricted Access",
        modal_desc: "Please enter the security password to view the Customer Quotation & Analytics.",
        modal_label: "Enter Password",
        modal_error: "Incorrect password. Please try again.",
        modal_btn: "Unlock Dashboard",
        header_company_name: "TWO PARROTS GROUP AUSTRALIA",
        header_sub: "Customer Quotation Intelligence",
        btn_print: "Print A4 Quotation",
        hdr_company_title: "Two Parrots Group Australia Pty Ltd",
        tbl_title: "Customer Quotation",
        th_prod_desc: "Product Description & Packaging Spec",
        opex_main_title: "Master Operational Expense Budget & Operating Model",
        opex_main_subtitle: "Business Entity: Cambodia-to-Melbourne Import & Distribution Business | Location: Melbourne, VIC, Australia (AUD)",
        btn_reset_opex: "Reset Budget",
        lbl_total_opex_banner: "Total OpEx:",
        lbl_year: "Year",
        opex_sec1_title: "1. Executive Summary & Budget Overview",
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
        c6_item1: "Local Charges & GST",
        c6_item2: "Warehouse Services & GST",
        c6_item3: "Customs Duty",
        c6_item4: "Import GST",
        c6_item5: "Electronic Entry Fee",
        lbl_subtotal_ex_ocean: "Subtotal (excl. Ocean & Duty)",
        opex_sec3_title: "3. Key Compliance & Financial Considerations",
        opex_note1_title: "Customs Tariffs & FTAs:",
        opex_note1_body: "Goods originating in Cambodia qualify for duty-free entry into Australia under AANZFTA or RCEP, provided a valid Certificate of Origin (COO) is supplied.",
        opex_note2_title: "Import GST Deferred Scheme (DGST):",
        opex_note2_body: "Import GST (10%) is calculated on Customs Value + Duty + Transport/Insurance. Registering for Deferred GST defers border payment to monthly BAS returns.",
        opex_note3_title: "Superannuation Compliance:",
        opex_note3_body: "Statutory Employer Superannuation Guarantee (11.5%) must be remitted quarterly to compliant Australian super funds before statutory due dates.",
        tb_title: "Live Landed Cost Recalculation Engine",
        tb_desc: "Adjust freight variables & margin percentage to compute live costings",
        lbl_fx: "FX Rate (AUD/USD)",
        lbl_freight: "Freight (USD)",
        lbl_margin: "Target Margin (%)",
        btn_recalc: "Recalculate",
    },
    km: {
        modal_title: "ការចូលប្រើប្រាស់ត្រូវបានកំណត់",
        modal_desc: "សូមបញ្ចូលពាក្យសម្ងាត់សុវត្ថិភាពដើម្បីមើលសម្រង់តម្លៃអតិថិជន និងការវិភាគ។",
        modal_label: "បញ្ចូលពាក្យសម្ងាត់",
        modal_error: "ពាក្យសម្ងាត់មិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។",
        modal_btn: "បើកផ្ទាំងគ្រប់គ្រង",
        header_company_name: "ក្រុមហ៊ុន ថូ ផារ៉ត គ្រុប អូស្ត្រាលី",
        header_sub: "ព័ត៌មានវិភាគសម្រង់តម្លៃអតិថិជន",
        btn_print: "បោះពុម្ពសម្រង់តម្លៃ A4",
        hdr_company_title: "ក្រុមហ៊ុន ថូ ផារ៉ត គ្រុប អូស្ត្រាលី ភីធីវ៉ាយ អិលធីឌី",
        tbl_title: "សម្រង់តម្លៃអតិថិជន",
        th_prod_desc: "ការបរិយាយផលិតផល និងលក្ខណៈវេចខ្ចប់",
        opex_main_title: "ថវិកាចំណាយប្រតិបត្តិការសរុប និងម៉ូឌែលប្រតិបត្តិការ",
        opex_main_subtitle: "អង្គភាពអាជីវកម្ម៖ អាជីវកម្មនាំចូល និងចែករំលែកពីកម្ពុជាទៅម៉ែលប៊ន | ទីតាំង៖ ម៉ែលប៊ន វិចតូរីយ៉ា អូស្ត្រាលី (AUD)",
        btn_reset_opex: "កំណត់ឡើងវិញ",
        lbl_total_opex_banner: "ចំណាយប្រតិបត្តិការសរុប៖",
        lbl_year: "ឆ្នាំ",
        opex_sec1_title: "១. សង្ខេបប្រតិបត្តិ និងទិដ្ឋភាពទូទៅនៃថវិកា",
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
        c6_item1: "ថ្លៃសេវាក្នុងស្រុក និង GST",
        c6_item2: "សេវាឃ្លាំង និង GST",
        c6_item3: "ពន្ធគយ",
        c6_item4: "ពន្ធ GST នាំចូល",
        c6_item5: "ថ្លៃបញ្ចូលទិន្នន័យអេឡិចត្រូនិក",
        lbl_subtotal_ex_ocean: "សរុបរង (មិនរាប់ថ្លៃដឹកសមុទ្រ និងពន្ធ)",
        opex_sec3_title: "៣. អនុលោមភាពសំខាន់ៗ និងការពិចារណាផ្នែកហិរញ្ញវត្ថុ",
        opex_note1_title: "ពន្ធគយ និងកិច្ចព្រមព្រៀងពាណិជ្ជកម្មសេរី៖",
        opex_note1_body: "ទំនិញដែលមានប្រភពដើមពីប្រទេសកម្ពុជាទទួលបានការលើកលែងពន្ធនាំចូលមកអូស្ត្រាលីក្រោម AANZFTA ឬ RCEP ដោយគ្រាន់តែមានវិញ្ញាបនបត្រប្រភពដើម (COO)។",
        opex_note2_title: "ប្រព័ន្ធពន្យារការបង់ពន្ធ GST នាំចូល (DGST)៖",
        opex_note2_body: "ពន្ធ GST នាំចូល 10% ត្រូវគណនាលើតម្លៃគយ + ពន្ធ + ការដឹកជញ្ជូន។ ការចុះឈ្មោះប្រព័ន្ធ DGST អនុញ្ញាតឱ្យពន្យារការបង់ពន្ធរហូតដល់របាយការណ៍ BAS ប្រចាំខែ។",
        opex_note3_title: "អនុលោមភាពប្រាក់សោធននិវត្តន៍៖",
        opex_note3_body: "ភាគទានប្រាក់សោធននិវត្តន៍កាតព្វកិច្ចរបស់និយោជក (11.5%) ត្រូវតែបង់ជូនមូលនិធិសោធនអូស្ត្រាលីរៀងរាល់ត្រីមាស។",
        tb_title: "ប្រព័ន្ធគណនាថ្លៃដើមនាំចូលផ្ទាល់",
        tb_desc: "កែប្រែប្រៀបប្រែប្រួលថ្លៃដឹកជញ្ជូន និងភាគរយចំណេញដើម្បីគណនាភ្លាមៗ",
        lbl_fx: "អត្រាប្តូរប្រាក់ (AUD/USD)",
        lbl_freight: "ថ្លៃកុងតឺន័រ ២០ហ្វ៊ីត (USD)",
        lbl_margin: "គោលដៅភាគរយចំណេញ (%)",
        btn_recalc: "គណនាឡើងវិញ",
    },
    fr: {
        modal_title: "Accès Restreint",
        modal_desc: "Veuillez saisir le mot de passe de sécurité pour afficher le devis client et les analyses.",
        modal_label: "Entrer le mot de passe",
        modal_error: "Mot de passe incorrect. Veuillez réessayer.",
        modal_btn: "Déverrouiller le tableau de bord",
        header_company_name: "TWO PARROTS GROUP AUSTRALIA",
        header_sub: "Intelligence des devis clients",
        btn_print: "Imprimer devis A4",
        hdr_company_title: "Two Parrots Group Australia Pty Ltd",
        tbl_title: "Devis Client",
        th_prod_desc: "Description du produit et conditionnement",
        opex_main_title: "Budget d'Exploitation Master & Modèle Opérationnel",
        opex_main_subtitle: "Entité commerciale: Import & Distribution Cambodge-Melbourne | Lieu: Melbourne, VIC, Australie (AUD)",
        btn_reset_opex: "Réinitialiser",
        lbl_total_opex_banner: "OpEx Total:",
        lbl_year: "Année",
        opex_sec1_title: "1. Résumé Exécutif & Aperçu du Budget",
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
        c6_item1: "Frais locaux et GST",
        c6_item2: "Services d'entrepôt et GST",
        c6_item3: "Droits de douane",
        c6_item4: "GST à l'importation",
        c6_item5: "Frais de saisie électronique",
        lbl_subtotal_ex_ocean: "Sous-total (hors fret maritime et droits)",
        opex_sec3_title: "3. Considérations Financières et de Conformité",
        opex_note1_title: "Tarifs Douaniers & ALE:",
        opex_note1_body: "Les marchandises du Cambodge sont exemptées de droits en Australie sous AANZFTA ou RCEP avec un certificat d'origine (COO) valide.",
        opex_note2_title: "Régime de GST d'Importation Différée (DGST):",
        opex_note2_body: "La GST d'importation (10%) est calculée sur Valeur en douane + Droits + Transport. L'inscription au DGST reporte le paiement à la déclaration BAS mensuelle.",
        opex_note3_title: "Conformité de la Retraite (Superannuation):",
        opex_note3_body: "La contribution légale de l'employeur à la retraite (11,5%) doit être versée chaque trimestre à des fonds de retraite australiens conformes.",
        tb_title: "Calculateur de coût rendu en direct",
        tb_desc: "Ajustez les variables de fret et le pourcentage de marge pour calculer les coûts en direct",
        lbl_fx: "Taux de change (AUD/USD)",
        lbl_freight: "Fret (USD)",
        lbl_margin: "Marge cible (%)",
        btn_recalc: "Recalculer",
    },
    zh: {
        modal_title: "受限访问",
        modal_desc: "请输入安全密码以查看客户报价和分析数据。",
        modal_label: "输入密码",
        modal_error: "密码不正确，请重试。",
        modal_btn: "解锁控制面板",
        header_company_name: "双鹦鹉集团澳大利亚公司",
        header_sub: "客户报价情报",
        btn_print: "打印 A4 报价单",
        hdr_company_title: "双鹦鹉集团澳大利亚有限公司",
        tbl_title: "客户报价单",
        th_prod_desc: "产品描述与包装规格",
        opex_main_title: "总运营费用预算与运营模型",
        opex_main_subtitle: "业务主体：柬埔寨至墨尔本进口与分销业务 | 业务地点：澳大利亚墨尔本 (AUD)",
        btn_reset_opex: "重置预算",
        lbl_total_opex_banner: "总运营支出 (OpEx):",
        lbl_year: "年",
        opex_sec1_title: "1. 执行摘要与预算总览",
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
        c6_item1: "本地费用及 GST",
        c6_item2: "仓储服务及 GST",
        c6_item3: "关税",
        c6_item4: "进口 GST",
        c6_item5: "电子申报费",
        lbl_subtotal_ex_ocean: "小计 (不含海运费与关税)",
        opex_sec3_title: "3. 关键合规与财务注意事项",
        opex_note1_title: "海关关税与自贸协定:",
        opex_note1_body: "原产于柬埔寨的货物在提供有效原产地证书 (COO) 的情况下，可通过 AANZFTA 或 RCEP 享受零关税进入澳大利亚。",
        opex_note2_title: "进口 GST 延期缴纳计划 (DGST):",
        opex_note2_body: "进口 GST (10%) 按海关价值 + 关税 + 运费/保险计算。注册延期 GST 计划可将清关时的支付延期至每月 BAS 申报时缴纳。",
        opex_note3_title: "雇主养老金合规要求:",
        opex_note3_body: "法定雇主养老金 (11.5%) 必须在法定截止日期前按季度缴纳至符合条件的澳大利亚养老金基金中。",
        tb_title: "实时到岸成本重算引擎",
        tb_desc: "调整运费变量和目标利润率以计算实时成本",
        lbl_fx: "汇率 (AUD/USD)",
        lbl_freight: "海运费 (USD)",
        lbl_margin: "目标利润率 (%)",
        btn_recalc: "重新计算",
    },
};

// --- LOCAL STORAGE MANAGER & RETRIEVAL ---
function saveToLocalBrowser(buttonElement) {
    const nameInput = (
        document.getElementById('cust-company')?.value || 
        document.getElementById('cust-contact')?.value || 
        ""
    ).trim();

    if (!nameInput) {
        alert('Please enter a customer company name before saving.');
        return;
    }

    const savedItems = productsData.map(p => ({
        id: p.id,
        orderQty: p.orderQty || 0,
        ctnPriceUsd: p.ctnPriceUsd || 0
    }));

    const now = new Date();
    const formattedDateTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const quoteId = 'quote_' + Date.now();

    const customerData = {
        id: quoteId,
        name: nameInput,
        contact: document.getElementById('cust-contact')?.value || '',
        phone: document.getElementById('cust-phone')?.value || '',
        email: document.getElementById('cust-email')?.value || '',
        address: document.getElementById('cust-address')?.value || '',
        terms: document.getElementById('cust-terms')?.value || '',
        containerType: document.getElementById('input-container-type')?.value || '20ft',
        fxRate: document.getElementById('input-fx')?.value || '0.6620',
        freightUsd: document.getElementById('input-freight')?.value || '2480',
        marginPct: document.getElementById('input-margin')?.value || '20',
        discountPct: document.getElementById('dash-discount-input')?.value || '0',
        isGstInc: document.getElementById('toggle-gst-inc')?.checked ?? true,
        volumeCtn: document.getElementById('dash-card-ctn-qty')?.innerText || '0 CTN',
        totalPrice: document.getElementById('master-profit-total-val')?.innerText || '$0.00 AUD',
        items: savedItems,
        saveDate: formattedDateTime
    };

    const savedCustomers = JSON.parse(localStorage.getItem('savedCustomers') || '[]');
    savedCustomers.push(customerData);

    localStorage.setItem('savedCustomers', JSON.stringify(savedCustomers));
    populateCustomerDropdown();

    if (buttonElement) {
        const originalText = buttonElement.innerHTML;
        buttonElement.innerHTML = 'Saved';
        buttonElement.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');

        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
        }, 2500);
    }
}

function populateCustomerDropdown() {
    const selectEl = document.getElementById('selectCustomer');
    if (!selectEl) return;

    const savedCustomers = JSON.parse(localStorage.getItem('savedCustomers') || '[]');
    selectEl.innerHTML = '<option value="">Select a Customer Quotation</option>';

    savedCustomers.sort((a, b) => b.id.localeCompare(a.id));

    savedCustomers.forEach(cust => {
        const option = document.createElement('option');
        option.value = cust.id;
        option.textContent = `${cust.name} — ${cust.volumeCtn} (${cust.saveDate})`;
        selectEl.appendChild(option);
    });
}

function loadSelectedCustomer(customerId) {
    if (!customerId) return;

    const savedCustomers = JSON.parse(localStorage.getItem('savedCustomers') || '[]');
    const customer = savedCustomers.find(c => c.id === customerId);

    if (!customer) return;

    if (document.getElementById('cust-company')) document.getElementById('cust-company').value = customer.name;
    if (document.getElementById('cust-contact')) document.getElementById('cust-contact').value = customer.contact;
    if (document.getElementById('cust-phone')) document.getElementById('cust-phone').value = customer.phone;
    if (document.getElementById('cust-email')) document.getElementById('cust-email').value = customer.email;
    if (document.getElementById('cust-address')) document.getElementById('cust-address').value = customer.address;
    if (document.getElementById('cust-terms')) document.getElementById('cust-terms').value = customer.terms;

    if (document.getElementById('input-container-type')) document.getElementById('input-container-type').value = customer.containerType || '20ft';
    if (document.getElementById('input-fx')) document.getElementById('input-fx').value = customer.fxRate || '0.6620';
    if (document.getElementById('input-freight')) document.getElementById('input-freight').value = customer.freightUsd || '2480';
    if (document.getElementById('input-margin')) document.getElementById('input-margin').value = customer.marginPct || '20';
    if (document.getElementById('dash-discount-input')) document.getElementById('dash-discount-input').value = customer.discountPct || '0';
    
    if (document.getElementById('toggle-gst-inc') && customer.isGstInc !== undefined) {
        document.getElementById('toggle-gst-inc').checked = customer.isGstInc;
    }

    productsData.forEach(p => p.orderQty = 0);

    if (customer.items && Array.isArray(customer.items)) {
        customer.items.forEach(savedItem => {
            const product = productsData.find(p => p.id === savedItem.id);
            if (product) {
                product.orderQty = parseInt(savedItem.orderQty, 10) || 0;
                if (savedItem.ctnPriceUsd !== undefined) {
                    product.ctnPriceUsd = parseFloat(savedItem.ctnPriceUsd) || 0;
                    const specStr = typeof product.spec === 'object' ? product.spec.en : product.spec;
                    const pcsPerCtn = getPcsPerCtn(specStr);
                    product.fobUsd = product.ctnPriceUsd / pcsPerCtn;
                }
            }
        });
    }

    updateOpExFromInputs();
    renderTable();
}

document.addEventListener('DOMContentLoaded', populateCustomerDropdown);

function bulkFillQuantities(value) {
    const outputSpan = document.getElementById('output');
    
    if (!value) {
        if (outputSpan) outputSpan.innerText = "None";
        return;
    }

    const qty = parseInt(value, 10);
    
    productsData.forEach(p => {
        p.orderQty = qty;
    });

    if (outputSpan) {
        outputSpan.innerText = qty;
    }

    renderTable();
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
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
    if (window.jspdf && window.jspdf.jsPDF && typeof window.jspdf.jsPDF.API.autoTable === 'function') {
        return Promise.resolve();
    }
    if (!pdfLibsPromise) {
        pdfLibsPromise = loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
            .then(() => loadScriptOnce('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'))
            .catch((err) => {
                pdfLibsPromise = null;
                throw err;
            });
    }
    return pdfLibsPromise;
}

function getPcsPerCtn(specStr) {
    if (!specStr) return 1;
    const specText = typeof specStr === 'object' ? specStr.en : specStr;
    const match = specText.match(/(\d+)\s*(Pcs|Cans|Bags)/i);
    return match ? parseInt(match[1], 10) : 1;
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

function unlockPage(e) {
    if (e) e.preventDefault();
    const inputVal = document.getElementById('password-input')?.value;
    const errorMsg = document.getElementById('password-error');
    const modal = document.getElementById('password-modal');
    const content = document.getElementById('page-content');

    if (inputVal === 'twoparrots') {
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

function toggleEngine() {
    const engine = document.getElementById('landed-cost-engine');
    const icon = document.getElementById('toggle-engine-icon');
    const btn = document.getElementById('toggle-engine-btn');
    if (!engine) return;

    const willOpen = engine.classList.contains('translate-y-full');
    engine.classList.toggle('translate-y-full', !willOpen);
    if (icon) {
        icon.classList.toggle('fa-chevron-up', !willOpen);
        icon.classList.toggle('fa-chevron-down', willOpen);
    }
    if (btn) btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (willOpen) {
        document.body.style.paddingBottom = `${engine.offsetHeight + 16}px`;
    } else {
        document.body.style.paddingBottom = '';
    }
}

function handleKeyDown(event, currentId, inputType) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let nextInput;
        if (inputType === 'price') {
            nextInput = document.getElementById(`input-qty-${currentId}`);
        } else {
            nextInput = document.getElementById(`input-ctn-price-${currentId + 1}`);
        }
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    }
}

function syncCtnPrice(productId, newPrice) {
    const price = Math.max(0, parseFloat(newPrice) || 0);
    const product = productsData.find(p => p.id === productId);
    if (product) {
        product.ctnPriceUsd = price;
        const specStr = typeof product.spec === 'object' ? product.spec.en : product.spec;
        const pcsPerCtn = getPcsPerCtn(specStr);
        product.fobUsd = price / pcsPerCtn;
    }
    renderTable();
}

function syncOrderQty(productId, newQty) {
    const qty = Math.max(0, parseInt(newQty, 10) || 0);
    const product = productsData.find(p => p.id === productId);
    
    if (product) {
        product.orderQty = qty;
        
        const cell = document.getElementById(`master-profit-val-${productId}`);
        if (cell && product.lastCalculatedSellingPriceCtn) {
            const rowTotal = product.lastCalculatedSellingPriceCtn * qty;
            cell.innerText = '$' + rowTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' AUD';
        }
    }
    
    recalculateMasterProfitTotal();
}

function resetMasterProfitOrders() {
    productsData.forEach(p => p.orderQty = 0);
    renderTable();
}

function handleContainerTypeChange() {
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const inputFreight = document.getElementById('input-freight');
    const c6_1_ship_input = document.getElementById('c6_1_ship_input');
    const c6_2_ship_input = document.getElementById('c6_2_ship_input');

    if (containerType === '40ft') {
        if (inputFreight) inputFreight.value = 4710.00;
        if (c6_1_ship_input) c6_1_ship_input.value = 3222.40;
        if (c6_2_ship_input) c6_2_ship_input.value = 740.00;
    } else {
        if (inputFreight) inputFreight.value = 2480.00;
        if (c6_1_ship_input) c6_1_ship_input.value = 2920.60;
        if (c6_2_ship_input) c6_2_ship_input.value = 600.00;
    }
    updateOpExFromInputs();
}

function getCategoryState(catNum, rawAnnualSubtotal) {
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
            headerEl.innerText = '$' + rawAnnualSubtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '/yr';
            headerEl.className = (catNum === 2 ? "text-emerald-700" : "text-gold-800") + " font-mono font-bold text-xs";
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

function updateOpExFromInputs() {
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

    const c1_raw_ann = c1_1_ann + c1_2_ann + c1_3_ann;
    if (document.getElementById('c1_wk_sub')) document.getElementById('c1_wk_sub').innerText = '$' + (c1_1_wk + c1_2_wk + c1_3_wk).toFixed(2);
    if (document.getElementById('c1_mth_sub')) document.getElementById('c1_mth_sub').innerText = '$' + (c1_raw_ann / 12).toFixed(2);
    if (document.getElementById('c1_ann_sub')) document.getElementById('c1_ann_sub').innerText = '$' + c1_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c1_ann = getCategoryState(1, c1_raw_ann);
    const c1_mth = c1_ann / 12;

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

    const c2_raw_ann = c2_1_tot + c2_2_tot;
    if (document.getElementById('c2_base_sub')) document.getElementById('c2_base_sub').innerText = '$' + (c2_1_base + c2_2_base).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_super_sub')) document.getElementById('c2_super_sub').innerText = '$' + (c2_1_super + c2_2_super).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_wc_sub')) document.getElementById('c2_wc_sub').innerText = '$' + (c2_1_wc + c2_2_wc).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c2_ann_sub')) document.getElementById('c2_ann_sub').innerText = '$' + c2_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c2_ann = getCategoryState(2, c2_raw_ann);
    const c2_mth = c2_ann / 12;

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

    const c3_raw_ann = c3_1_ann + c3_2_ann + c3_3_ann;
    if (document.getElementById('c3_mth_sub')) document.getElementById('c3_mth_sub').innerText = '$' + (c3_1_mth + c3_2_mth + c3_3_mth).toFixed(2);
    if (document.getElementById('c3_ann_sub')) document.getElementById('c3_ann_sub').innerText = '$' + c3_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c3_ann = getCategoryState(3, c3_raw_ann);
    const c3_mth = c3_ann / 12;

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

    const c4_raw_ann = c4_1_ann + c4_2_ann + c4_3_ann + c4_4_ann + c4_5_ann;
    if (document.getElementById('c4_mth_sub')) document.getElementById('c4_mth_sub').innerText = '$' + (c4_1_mth + c4_2_mth + c4_3_mth + c4_4_mth + c4_5_mth).toFixed(2);
    if (document.getElementById('c4_ann_sub')) document.getElementById('c4_ann_sub').innerText = '$' + c4_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c4_ann = getCategoryState(4, c4_raw_ann);
    const c4_mth = c4_ann / 12;

    // Category 5
    const c5_1_ex = parseFloat(document.getElementById('c5_1_ann_input')?.value) || 0;
    const c5_2_ex = parseFloat(document.getElementById('c5_2_ann_input')?.value) || 0;
    const c5_3_ex = parseFloat(document.getElementById('c5_3_ann_input')?.value) || 0;
    const c5_4_ex = parseFloat(document.getElementById('c5_4_ann_input')?.value) || 0;

    if (document.getElementById('c5_1_inc_gst')) document.getElementById('c5_1_inc_gst').innerText = '$' + (c5_1_ex * 1.1).toFixed(2);
    if (document.getElementById('c5_2_inc_gst')) document.getElementById('c5_2_inc_gst').innerText = '$' + (c5_2_ex * 1.1).toFixed(2);
    if (document.getElementById('c5_3_inc_gst')) document.getElementById('c5_3_inc_gst').innerText = '$' + (c5_3_ex * 1.1).toFixed(2);
    if (document.getElementById('c5_4_inc_gst')) document.getElementById('c5_4_inc_gst').innerText = '$' + (c5_4_ex * 1.1).toFixed(2);

    const c5_raw_ann = c5_1_ex + c5_2_ex + c5_3_ex + c5_4_ex;
    if (document.getElementById('c5_ex_sub')) document.getElementById('c5_ex_sub').innerText = '$' + c5_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c5_inc_sub')) document.getElementById('c5_inc_sub').innerText = '$' + (c5_raw_ann * 1.1).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c5_ann = getCategoryState(5, c5_raw_ann);
    const c5_mth = c5_ann / 12;

    // Category 6: Import Freight Clearance & Customs
    const parseInputValue = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const val = parseFloat(el.value);
        return isNaN(val) ? 0 : val;
    };

    const c6_1_ship = parseInputValue('c6_1_ship_input');
    const c6_2_ship = parseInputValue('c6_2_ship_input');
    const c6_3_ship = parseInputValue('c6_3_ship_input');
    const c6_4_ship = parseInputValue('c6_4_ship_input');
    const c6_5_ship = parseInputValue('c6_5_ship_input');

    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    ANNUAL_CONTAINERS = containerType === '40ft' ? 6 : 12;

    const c6_1_ann = c6_1_ship * ANNUAL_CONTAINERS;
    const c6_2_ann = c6_2_ship * ANNUAL_CONTAINERS;
    const c6_3_ann = c6_3_ship * ANNUAL_CONTAINERS;
    const c6_4_ann = c6_4_ship * ANNUAL_CONTAINERS;
    const c6_5_ann = c6_5_ship * ANNUAL_CONTAINERS;

    if (document.getElementById('c6_1_ann')) document.getElementById('c6_1_ann').innerText = '$' + c6_1_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_2_ann')) document.getElementById('c6_2_ann').innerText = '$' + c6_2_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_3_ann')) document.getElementById('c6_3_ann').innerText = '$' + c6_3_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_4_ann')) document.getElementById('c6_4_ann').innerText = '$' + c6_4_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_5_ann')) document.getElementById('c6_5_ann').innerText = '$' + c6_5_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const c6_ship_sub_total = c6_1_ship + c6_2_ship + c6_3_ship + c6_4_ship + c6_5_ship;
    const c6_raw_ann = c6_1_ann + c6_2_ann + c6_3_ann + c6_4_ann + c6_5_ann;

    if (document.getElementById('c6_ship_sub')) document.getElementById('c6_ship_sub').innerText = '$' + c6_ship_sub_total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('c6_ann_sub')) document.getElementById('c6_ann_sub').innerText = '$' + c6_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('subtotal-c6-hdr')) document.getElementById('subtotal-c6-hdr').innerText = '$' + c6_raw_ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '/yr';

    const c6_ann = typeof getCategoryState === 'function' ? getCategoryState(6, c6_raw_ann) : c6_raw_ann;
    const c6_mth = c6_ann / 12;

    // Grand Total OpEx
    const totalAnnualOpEx = c1_ann + c2_ann + c3_ann + c4_ann + c5_ann + c6_ann;
    const totalMonthlyOpEx = totalAnnualOpEx / 12;

    currentAnnualOpExAUD = totalAnnualOpEx;
    currentOpExPerContainerAUD = totalAnnualOpEx / ANNUAL_CONTAINERS;

    if (document.getElementById('banner-opex-total')) document.getElementById('banner-opex-total').innerText = totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('dash-card-opex')) document.getElementById('dash-card-opex').innerText = '$' + totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const setSumRow = (catNum, mth, ann) => {
        const mthEl = document.getElementById(`sum-mth-c${catNum}`);
        const annEl = document.getElementById(`sum-ann-c${catNum}`);
        const pctEl = document.getElementById(`sum-pct-c${catNum}`);
        if (mthEl) mthEl.innerText = '$' + mth.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (annEl) annEl.innerText = '$' + ann.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        if (pctEl) pctEl.innerText = (totalAnnualOpEx > 0 ? ((ann / totalAnnualOpEx) * 100).toFixed(1) : '0.0') + '%';
    };

    setSumRow(1, c1_mth, c1_ann);
    setSumRow(2, c2_mth, c2_ann);
    setSumRow(3, c3_mth, c3_ann);
    setSumRow(4, c4_mth, c4_ann);
    setSumRow(5, c5_mth, c5_ann);
    setSumRow(6, c6_mth, c6_ann);

    if (document.getElementById('sum-mth-total')) document.getElementById('sum-mth-total').innerText = '$' + totalMonthlyOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (document.getElementById('sum-ann-total')) document.getElementById('sum-ann-total').innerText = '$' + totalAnnualOpEx.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
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

function renderTable() {
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const fx = parseFloat(document.getElementById('input-fx')?.value) || 0.6620;
    const oceanFreightUsd = parseFloat(document.getElementById('input-freight')?.value) || 2480.00;
    const marginPercent = parseFloat(document.getElementById('input-margin')?.value) || 20;
    
    const isGstInc = document.getElementById('toggle-gst-inc')?.checked ?? true;
    const gstMultiplier = isGstInc ? 1.1 : 1.0;

    ANNUAL_CONTAINERS = containerType === '40ft' ? 6 : 12;
    currentOpExPerContainerAUD = currentAnnualOpExAUD / ANNUAL_CONTAINERS;

    const tbody = document.getElementById('product-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const showCtnPrice = document.getElementById('toggle-ctn-price-col')?.checked || false;
    const thCtnPriceCol = document.getElementById('th-ctn-price-col');
    if (thCtnPriceCol) {
        if (showCtnPrice) thCtnPriceCol.classList.remove('hidden');
        else thCtnPriceCol.classList.add('hidden');
    }

    productsData.forEach((p, idx) => {
        const specStr = typeof p.spec === 'object' ? p.spec.en : p.spec;
        const pcsPerCtn = getPcsPerCtn(specStr);
        const displayName = p.name[currentLang] || p.name.en;
        const displaySpec = typeof p.spec === 'object' ? (p.spec[currentLang] || p.spec.en) : p.spec;

        const ctnPriceAud = (p.ctnPriceUsd || 0) / fx;
        const freightAudPerCtn = (oceanFreightUsd / fx) / (containerType === '40ft' ? 2000 : 1000);
        const customsAudPerCtn = 2235.00 / (containerType === '40ft' ? 2000 : 1000);
        const opexAudPerCtn = currentOpExPerContainerAUD / (containerType === '40ft' ? 2000 : 1000);

        const landedCostAudCtn = ctnPriceAud + freightAudPerCtn + customsAudPerCtn + opexAudPerCtn;

        const marginDecimal = marginPercent / 100;
        const baseSellingPriceAudCtn = marginDecimal < 1 ? landedCostAudCtn / (1 - marginDecimal) : landedCostAudCtn;
        
        const sellingPriceAudCtn = baseSellingPriceAudCtn * gstMultiplier;
        const sellingPriceAudPcs = pcsPerCtn > 0 ? sellingPriceAudCtn / pcsPerCtn : 0;
        
        p.lastCalculatedSellingPriceCtn = sellingPriceAudCtn;

        const qty = p.orderQty || 0;
        const orderPriceTotal = sellingPriceAudCtn * qty;

        const tr = document.createElement('tr');
        tr.className = `hover:bg-amber-50/60 transition ${p.status === 'Upcoming' ? 'bg-amber-50/40' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60')}`;
        tr.innerHTML = `
            <td class="py-1 px-2 text-center font-bold text-slate-400 border-r border-slate-200">${p.id}</td>
            <td class="py-1 px-3 border-r border-slate-200">
                <div class="flex items-center justify-between gap-1">
                    <span class="font-bold text-slate-900">${escapeHtml(displayName)}</span>
                    <span class="text-[10px] text-slate-400 font-mono bg-slate-100 border rounded px-1.5 shrink-0">${escapeHtml(displaySpec)}</span>
                </div>
            </td>
            <td class="py-1 px-2 border-r border-slate-200 text-center bg-slate-50 ${showCtnPrice ? '' : 'hidden'}" id="td-ctn-price-${p.id}">
                <div class="flex items-center justify-center gap-0.5">
                    <span class="text-slate-400 font-bold">$</span>
                    <input type="number" id="input-ctn-price-${p.id}" step="0.50" min="0"
                        oninput="syncCtnPrice(${p.id}, this.value)"
                        onkeydown="handleKeyDown(event, ${p.id}, 'price')"
                        class="w-20 text-right bg-white border border-slate-300 focus:border-gold-500 font-bold font-mono text-xs text-gold-800 rounded py-0.5 px-1 focus:outline-none transition">
                </div>
            </td>
            <td class="py-1 px-2 border-r border-slate-200 text-center bg-emerald-50/40">
                <input type="number" id="input-qty-${p.id}" min="0" step="1"
                    oninput="syncOrderQty(${p.id}, this.value)"
                    onkeydown="handleKeyDown(event, ${p.id}, 'qty')"
                    class="w-20 text-center bg-white border-2 border-emerald-300 focus:border-emerald-600 font-bold font-mono text-xs text-slate-900 rounded py-0.5 px-1 focus:outline-none transition">
            </td>
            <td class="py-1 px-3 text-right font-mono border-r border-slate-200 font-bold text-slate-700">$${sellingPriceAudPcs.toFixed(2)}</td>
            <td class="py-1 px-3 text-right font-mono border-r border-slate-200 text-gold-800 font-bold">$${sellingPriceAudCtn.toFixed(2)}</td>
            <td class="py-1 px-3 text-right font-mono font-bold bg-slate-900 text-gold-400" id="master-profit-val-${p.id}">
                $${orderPriceTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} AUD
            </td>
        `;
        tbody.appendChild(tr);

        const qtyEl = tr.querySelector(`#input-qty-${p.id}`);
        if (qtyEl) qtyEl.value = qty;

        const ctnPriceEl = tr.querySelector(`#input-ctn-price-${p.id}`);
        if (ctnPriceEl) ctnPriceEl.value = p.ctnPriceUsd.toFixed(2);
    });

    recalculateMasterProfitTotal();
}

function recalculateMasterProfitTotal() {
    let rawTotalPrice = 0;
    let totalCartons = 0;
    let totalWeightKg = 0;
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const maxCtn = containerType === '40ft' ? 2000 : 1000;

    productsData.forEach(p => {
        const qty = p.orderQty || 0;
        totalCartons += qty;
        
        if (qty > 0) {
            const specStr = typeof p.spec === 'object' ? p.spec.en : p.spec;
            const pcsPerCtn = getPcsPerCtn(specStr);
            const ctnWeightKg = (p.weightG * pcsPerCtn) / 1000;
            totalWeightKg += (ctnWeightKg * qty);
        }

        if (p.lastCalculatedSellingPriceCtn) {
            rawTotalPrice += p.lastCalculatedSellingPriceCtn * qty;
        }
        const cell = document.getElementById(`master-profit-val-${p.id}`);
        if (cell) {
            const rowPrice = (p.lastCalculatedSellingPriceCtn || 0) * qty;
            cell.innerText = '$' + rowPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';
        }
    });

    const discountInput = document.getElementById('dash-discount-input');
    const discountPct = discountInput ? (parseFloat(discountInput.value) || 0) : 0;
    const totalSaved = rawTotalPrice * (discountPct / 100);
    const finalNetPrice = rawTotalPrice - totalSaved;

    if (document.getElementById('dash-discount-saved')) {
        document.getElementById('dash-discount-saved').innerText = '$' + totalSaved.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';
    }

    const formattedTotalPrice = '$' + finalNetPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' AUD';
    if (document.getElementById('master-profit-total-val')) document.getElementById('master-profit-total-val').innerText = formattedTotalPrice;
    if (document.getElementById('floating-total-profit')) document.getElementById('floating-total-profit').innerText = formattedTotalPrice;
    if (document.getElementById('dash-card-profit')) document.getElementById('dash-card-profit').innerText = formattedTotalPrice;

    const ctnPerPallet = parseFloat(document.getElementById('input-ctn-per-pallet')?.value) || 100;
    const totalPallets = (totalCartons / ctnPerPallet).toFixed(1);

    if (document.getElementById('master-profit-total-qty')) document.getElementById('master-profit-total-qty').innerText = `${totalCartons.toLocaleString()} CTN`;
    if (document.getElementById('dash-card-ctn-qty')) document.getElementById('dash-card-ctn-qty').innerText = `${totalCartons.toLocaleString()} CTN`;
    if (document.getElementById('dash-card-pallets')) document.getElementById('dash-card-pallets').innerText = `/ ${totalPallets} Pallets`;
    
    if (document.getElementById('dash-card-weight')) {
        document.getElementById('dash-card-weight').innerText = `${totalWeightKg.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} kg`;
    }

    const spacePct = Math.round((totalCartons / maxCtn) * 100);
    if (document.getElementById('floating-space-pct')) document.getElementById('floating-space-pct').innerText = `(${spacePct}%)`;
    if (document.getElementById('dash-card-ctn-pct')) document.getElementById('dash-card-ctn-pct').innerText = `${spacePct}%`;

    const spaceBar = document.getElementById('floating-space-bar');
    const dashBar = document.getElementById('dash-card-progress-bar');
    const barWidth = `${Math.min(spacePct, 100)}%`;

    if (spaceBar) {
        spaceBar.style.width = barWidth;
        spaceBar.className = spacePct > 100 
            ? 'bg-rose-600 h-full transition-all duration-300 animate-pulse' 
            : 'bg-gradient-to-r from-emerald-500 to-gold-400 h-full transition-all duration-300';
    }
    if (dashBar) {
        dashBar.style.width = barWidth;
        dashBar.className = spacePct > 100 ? 'bg-rose-600 h-full transition-all duration-300' : 'bg-gold-500 h-full transition-all duration-300';
    }
}

function setLanguage(lang) {
    currentLang = lang;
    ['en', 'km', 'fr', 'zh'].forEach(l => {
        const btn = document.getElementById(`lang-btn-${l}`);
        if (btn) {
            if (l === lang) {
                btn.className = "px-2 py-0.5 text-xs rounded transition bg-gold-500/20 border border-gold-500 text-gold-400 font-bold";
            } else {
                btn.className = "px-2 py-0.5 text-xs rounded transition opacity-60 hover:opacity-100 text-slate-300";
            }
        }
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = (translations[lang] && translations[lang][key]) || (translations.en && translations.en[key]);
        if (value) el.innerText = value;
    });

    renderTable();
}

async function exportPurchaseOrderPDF() {
    try {
        await ensurePdfLibraries();
    } catch (err) {
        alert('Could not load the PDF library. Check your connection and try again.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    const containerType = document.getElementById('input-container-type')?.value || '20ft';
    const now = new Date();
    const formattedDateOnly = now.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();

    doc.setFontSize(16);
    doc.text("CUSTOMER QUOTATION", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${formattedDateOnly}`, 14, 28);
    doc.text(`Container Type: ${containerType}`, 14, 34);

    doc.save(`Customer_Quotation_${formattedDateOnly}.pdf`);
}

// --- INITIAL AUTOMATIC TABLE LOAD & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initPasswordModalA11y();
    if (tpgaStaffSessionActive()) {
        tpgaApplyStaffUnlock();
        if (typeof updateOpExFromInputs === 'function') updateOpExFromInputs();
    }
    // 1. Populate saved customer options into header dropdown
    if (typeof populateCustomerDropdown === 'function') {
        populateCustomerDropdown();
    }
    
    // 2. Safe calculation update
    if (typeof updateOpExFromInputs === 'function') {
        try {
            updateOpExFromInputs();
        } catch (err) {
            console.warn("OpEx calculation warning:", err);
        }
    }

    // 3. Render the product table rows immediately on page load
    if (typeof renderTable === 'function') {
        renderTable();
    }
});

// Fallback execution if script loads after DOMContentLoaded event
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (typeof renderTable === 'function') {
        renderTable();
    }
}
