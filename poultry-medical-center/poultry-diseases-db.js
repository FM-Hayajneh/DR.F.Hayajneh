/**
 * poultry-diseases-db.js
 * قاعدة البيانات الطبية + نظام الفلترة (العزل المنطقي)
 */

// ============================================================
// 1. نظام الفلترة (CLASS_GROUPS) - الحارس الأمين
// هذا الجزء يحدد "ما هي الفئات المسموح باكتشافها" لكل نوع صورة
// ============================================================
const CLASS_GROUPS = {
    // 1. عند تحليل صورة الدجاجة: نسمح فقط باكتشاف الأمراض الظاهرية، السلالات، والأعمار
    CHICKEN: [
        "Healthy_Chicken", "Sick_Newcastle", "Sick_Flu", "Sick_Coccidia", // حالة صحية
        "Breed_Ross", "Breed_Cobb", "Breed_Hubbard", "Breed_AA",          // سلالات
        "Age_Chick", "Age_Adult"                                          // أعمار
    ],

    // 2. عند تحليل البراز: نسمح فقط بفئات البراز
    FECES: [
        "Stool_Normal", "Stool_Green", "Stool_Bloody", "Stool_White"
    ],

    // 3. عند تحليل الأعضاء: كل عضو له قائمته الخاصة (حسب اختيار القائمة المنسدلة)
    ORGANS: {
        "heart": ["Heart_Healthy", "Heart_Pericarditis"],
        "liver": ["Liver_Healthy", "Liver_Spots", "Liver_Swollen"],
        "intestine": ["Gut_Healthy", "Gut_Bloody", "Gut_Nodules"],
        "proventriculus": ["Prov_Healthy", "Prov_Bleeding"]
    }
};

// ============================================================
// 2. بيانات الأمراض الطبية (DISEASE_DATA)
// ============================================================
const DISEASE_DATA = {
    // --- الأمراض الفيروسية ---
    "Newcastle": {
        name: "مرض النيوكاسل (Newcastle Disease)",
        scientificReason: [
            "نزيف نقطي على رؤوس حلمات المعدة الغدية (Proventriculus).",
            "إسهال أخضر مائي مميز (Greenish Diarrhea).",
            "علامات عصبية (التواء الرقبة) حال وجودها."
        ],
        description: "مرض فيروسي وبائي شديد العدوى يصيب الجهاز التنفسي والهضمي والعصبي.",
        riskLevel: "عالية جداً (High Risk)",
        symptoms: ["نزيف معدي", "التواء الرقبة", "إسهال أخضر"],
        confirmation: [
            "وجود النزيف المعدي هو العلامة التشريحية المميزة.",
            "اختبار تثبيط التلازن الدموي (HI Test)."
        ],
        treatment: [
            "لا يوجد علاج للفيروس.",
            "رفع المناعة (فيتامين E + سيلينيوم).",
            "مضادات حيوية لمنع العدوى الثانوية."
        ],
        prevention: ["برنامج تحصين صارم.", "الأمن الحيوي."]
    },
    "Flu": {
        name: "إنفلونزا الطيور (Avian Influenza)",
        scientificReason: [
            "احتقان وتضخم الكبد (Enlarged Liver) بلون داكن.",
            "زرقة شديدة في العرف والدليات (Cyanosis).",
            "تورم الوجه والرأس (Facial Edema)."
        ],
        description: "مرض وبائي خطير يسبب نفوقاً عالياً وأعراضاً تنفسية حادة.",
        riskLevel: "حرجة (Critical)",
        symptoms: ["تضخم الكبد", "زرقة العرف", "نفوق حاد"],
        confirmation: ["فحص PCR.", "اختبارات التلازن الدموي."],
        treatment: ["لا يوجد علاج (إعدام صحي في الحالات الوبائية)."],
        prevention: ["أمن حيوي صارم جداً.", "منع دخول الطيور البرية."]
    },

    // --- الأمراض البكتيرية ---
    "Colibacillosis": {
        name: "الإيكولاي / التهاب التامور (Colibacillosis)",
        scientificReason: [
            "التهاب التامور (Pericarditis): وجود غشاء أبيض (Fibrin) يغطي القلب.",
            "قد يصاحبه غشاء على الكبد (Perihepatitis)."
        ],
        description: "عدوى بكتيرية تسببها E. coli تؤدي لترسبات فبرينية على الأعضاء.",
        riskLevel: "متوسطة إلى عالية",
        symptoms: ["غشاء أبيض على القلب", "خمول"],
        confirmation: ["عزل البكتيريا على بيئة MacConkey."],
        treatment: ["المضادات الحيوية (دوكسيسيكلين، كوليستين).", "تحسين التهوية."],
        prevention: ["نظافة المياه (الكلورة).", "التهوية الجيدة."]
    },
    "Salmonella": {
        name: "السالمونيلا (Salmonella)",
        scientificReason: [
            "بقع نخرية بيضاء صغيرة على الكبد.",
            "إسهال أبيض طباشيري (Chalky White Stool)."
        ],
        description: "عدوى بكتيرية معوية تنتقل عمودياً وتسبب تأخراً في النمو.",
        riskLevel: "متوسطة",
        symptoms: ["بقع كبدية", "إسهال أبيض"],
        confirmation: ["العزل على بيئة SS Agar."],
        treatment: ["مضادات حيوية مناسبة (بعد اختبار الحساسية)."],
        prevention: ["نظافة البيض والفقاسات.", "مكافحة القوارض."]
    },

    // --- الأمراض الطفيلية ---
    "Coccidiosis": {
        name: "الكوكسيدايوزيس (Coccidiosis)",
        scientificReason: [
            "أمعاء منتفخة ومحتتقنة بدم (Bloody Gut).",
            "إسهال مدمم صريح (Bloody Droppings)."
        ],
        description: "مرض طفيلي يدمر خلايا الأمعاء ويسبب نزيفاً.",
        riskLevel: "عالية",
        symptoms: ["أمعاء دموية", "إسهال مدمم", "هزال"],
        confirmation: ["فحص مجهري (Oocysts).", "تشريح الأمعاء."],
        treatment: ["مضادات الكوكسيديا (تولترازوريل، أمبروليوم).", "فيتامين K3."],
        prevention: ["جفاف الفرشة.", "منع التكدس."]
    },
    "Tapeworms": {
        name: "الديدان الشريطية (Tapeworms)",
        scientificReason: [
            "وجود عقد (Nodules) بارزة على جدار الأمعاء.",
            "هزال عام رغم استهلاك العلف."
        ],
        description: "طفيليات معوية تسبب الهزال وتنتقل عبر الحشرات.",
        riskLevel: "متوسطة",
        symptoms: ["عقد معوية", "هزال"],
        confirmation: ["رؤية الديدان بالعين المجردة."],
        treatment: ["أدوية طاردة للديدان (ببرازين، ليفاميزول)."],
        prevention: ["مكافحة الحشرات (الخنافس) العائل الوسيط."]
    },

    // --- الحالة السليمة ---
    "Healthy": {
        name: "سليم / طبيعي (Healthy)",
        scientificReason: [
            "الأعضاء والمظهر العام في حالة طبيعية.",
            "عدم وجود آفات مرضية أو تغيرات في اللون."
        ],
        description: "الطائر بحالة صحية جيدة.",
        riskLevel: "آمن (Safe)",
        symptoms: ["نشاط", "لون طبيعي"],
        confirmation: ["متابعة الحالة العامة."],
        treatment: ["لا يوجد."],
        prevention: ["الاستمرار في الرعاية الجيدة."]
    },
    "Unknown": {
        name: "غير محدد",
        scientificReason: ["العلامات غير واضحة."],
        description: "---",
        riskLevel: "---",
        symptoms: [],
        confirmation: [],
        treatment: [],
        prevention: []
    }
};

// ============================================================
// 3. بيانات السلالات والأعمار (Breed & Age Data)
// ============================================================
const BREED_DATA = {
    "Ross": { name: "Ross 308", characteristics: ["صدر عريض وممتلئ.", "أرجل قوية."] },
    "Cobb": { name: "Cobb 500", characteristics: ["جسم كروي مكتنز.", "تحويل غذائي عالٍ."] },
    "Hubbard": { name: "Hubbard", characteristics: ["جسم متطاول.", "ريش كثيف."] },
    "AA": { name: "Arbor Acres", characteristics: ["نمو سريع.", "هيكل قوي."] },
    "Unknown": { name: "سلالة تجارية", characteristics: ["خصائص قياسية."] }
};

const AGE_DATA = {
    "Chick": { stage: "مرحلة الحضانة", ageRange: "1-10 أيام", weightRange: "40-200 جم", reasons: ["زغب أصفر.", "حجم صغير."] },
    "Adult": { stage: "مرحلة التسمين", ageRange: "30-45 يوم", weightRange: "1.8-2.8 كجم", reasons: ["ريش كامل.", "عرف أحمر."] },
    "Unknown": { stage: "--", ageRange: "--", weightRange: "--", reasons: ["غير محدد."] }
};

// ============================================================
// 4. خريطة الربط (Mapping) - ترجمة لغة الـ AI للغة الطب
// ============================================================
const AI_CLASS_MAP = {
    // --- الدجاج (أمراض + سلالات + عمر) ---
    "Healthy_Chicken": "Healthy",
    "Sick_Newcastle": "Newcastle",
    "Sick_Flu": "Flu",
    "Sick_Coccidia": "Coccidiosis",
    
    "Breed_Ross": "Ross", "Breed_Cobb": "Cobb", "Breed_Hubbard": "Hubbard", "Breed_AA": "AA",
    "Age_Chick": "Chick", "Age_Adult": "Adult",

    // --- البراز ---
    "Stool_Normal": "Healthy",
    "Stool_Green": "Newcastle",
    "Stool_Bloody": "Coccidiosis",
    "Stool_White": "Salmonella",

    // --- الأعضاء الداخلية (الأربعة المحددة) ---
    // القلب
    "Heart_Healthy": "Healthy",
    "Heart_Pericarditis": "Colibacillosis",
    // الكبد
    "Liver_Healthy": "Healthy",
    "Liver_Spots": "Salmonella",
    "Liver_Swollen": "Flu",
    // الأمعاء
    "Gut_Healthy": "Healthy",
    "Gut_Bloody": "Coccidiosis",
    "Gut_Nodules": "Tapeworms",
    // المعدة
    "Prov_Healthy": "Healthy",
    "Prov_Bleeding": "Newcastle"
};

// ============================================================
// 5. دوال التصدير (Export Functions)
// ============================================================
window.poultryDB = {
    // جلب معلومات المرض
    getDiseaseInfo: (aiLabel) => {
        const diseaseKey = AI_CLASS_MAP[aiLabel];
        return DISEASE_DATA[diseaseKey] || DISEASE_DATA["Unknown"];
    },
    
    // جلب معلومات السلالة
    getBreedInfo: (aiLabel) => {
        const key = AI_CLASS_MAP[aiLabel];
        return BREED_DATA[key] || BREED_DATA["Unknown"];
    },
    
    // جلب معلومات العمر
    getAgeInfo: (aiLabel) => {
        const key = AI_CLASS_MAP[aiLabel];
        return AGE_DATA[key] || AGE_DATA["Unknown"];
    },

    // (الأهم) دالة لجلب القائمة المسموحة بناءً على نوع الفحص
    getAllowedClasses: (type, organName = null) => {
        if (type === 'ORGANS' && organName) {
            // نستخدم organName (مثل heart, liver) للوصول للقائمة الفرعية
            return CLASS_GROUPS.ORGANS[organName] || [];
        }
        return CLASS_GROUPS[type] || [];
    },

    // دالة استنتاج السلالة/العمر (Fallback)
    inferBreedAndAge: (aiLabel) => {
        if (aiLabel.includes("Chick")) return { breed: BREED_DATA["Ross"], age: AGE_DATA["Chick"] };
        return { breed: BREED_DATA["Ross"], age: AGE_DATA["Adult"] };
    }
};  