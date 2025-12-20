// language-switcher.js - النسخة المحدثة
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'ar';
        this.translations = {
            ar: {
                // Analysis Results
                'chickenAnalysis': 'تحليل الدجاجة الحية',
                'chickenType': 'نوع الدجاجة',
                'confidenceRate': 'نسبة الثقة',
                'estimatedWeight': 'الوزن التقديري',
                'symptoms': 'الأعراض',
                'fecesAnalysis': 'تحليل عينة البراز',
                'fecesColor': 'لون البراز',
                'consistency': 'القوام',
                'organAnalysis': 'تحليل العضو الداخلي',
                'organ': 'العضو',
                'condition': 'الحالة',
                'color': 'اللون',
                'abnormalities': 'التشوهات',
                'integratedDiagnosis': 'التشخيص المتكامل',
                'primaryDisease': 'المرض الأساسي',
                'suggestedTreatment': 'العلاج المقترح',
                'prevention': 'الوقاية',
                'recommendedTests': 'الفحوصات الموصى بها',
                'emergencyLevel': 'مستوى الطوارئ',
                'suspectedDiseases': 'الأمراض المشتبه بها',

                // Diseases
                'مرض النيوكاسل': 'مرض النيوكاسل',
                'إنفلونزا الطيور': 'إنفلونزا الطيور',
                'مرض الماريك': 'مرض الماريك',
                'الجمبورو': 'الجمبورو',
                'البرونشيت المعدي': 'البرونشيت المعدي',
                'الكوكسيدايوزيس': 'الكوكسيدايوزيس',
                'مشاكل كبدية': 'مشاكل كبدية',
                'التهاب فيروسي': 'التهاب فيروسي',
                'عدوى بكتيرية': 'عدوى بكتيرية',
                'التهاب الكبد الفيروسي': 'التهاب الكبد الفيروسي',

                // Symptoms
                'التواء الرقبة': 'التواء الرقبة',
                'شلل الأجنحة': 'شلل الأجنحة',
                'تورم الرأس': 'تورم الرأس',
                'انتفاش الريش': 'انتفاش الريش',
                'خمول': 'خمول',
                'صعوبة التنفس': 'صعوبة التنفس',
                'إسهال أخضر': 'إسهال أخضر',
                'انخفاض إنتاج البيض': 'انخفاض إنتاج البيض',
                'شحوب العرف': 'شحوب العرف',
                'إسهال مائي': 'إسهال مائي',
                'رجفة': 'رجفة',
                'سعال': 'سعال',
                'إفرازات أنفية': 'إفرازات أنفية',
                'فقدان الشهية': 'فقدان الشهية',
                'إسهال دموي': 'إسهال دموي',

                // Organ Conditions
                'نزيف نقطي': 'نزيف نقطي',
                'تورم': 'تورم',
                'سليم': 'سليم',
                'تقرحات نزفية': 'تقرحات نزفية',
                'التهاب': 'التهاب',
                'تضخم': 'تضخم',
                'بقع نخرية': 'بقع نخرية'
            },
            en: {
                // Analysis Results
                'chickenAnalysis': 'Live Chicken Analysis',
                'chickenType': 'Chicken Type',
                'confidenceRate': 'Confidence Rate',
                'estimatedWeight': 'Estimated Weight',
                'symptoms': 'Symptoms',
                'fecesAnalysis': 'Feces Sample Analysis',
                'fecesColor': 'Feces Color',
                'consistency': 'Consistency',
                'organAnalysis': 'Internal Organ Analysis',
                'organ': 'Organ',
                'condition': 'Condition',
                'color': 'Color',
                'abnormalities': 'Abnormalities',
                'integratedDiagnosis': 'Integrated Diagnosis',
                'primaryDisease': 'Primary Disease',
                'suggestedTreatment': 'Suggested Treatment',
                'prevention': 'Prevention',
                'recommendedTests': 'Recommended Tests',
                'emergencyLevel': 'Emergency Level',
                'suspectedDiseases': 'Suspected Diseases',

                // Diseases
                'مرض النيوكاسل': 'Newcastle Disease',
                'إنفلونزا الطيور': 'Avian Influenza',
                'مرض الماريك': "Marek's Disease",
                'الجمبورو': 'Gumboro Disease',
                'البرونشيت المعدي': 'Infectious Bronchitis',
                'الكوكسيدايوزيس': 'Coccidiosis',
                'مشاكل كبدية': 'Liver Problems',
                'التهاب فيروسي': 'Viral Infection',
                'عدوى بكتيرية': 'Bacterial Infection',
                'التهاب الكبد الفيروسي': 'Viral Hepatitis',

                // Symptoms
                'التواء الرقبة': 'Neck Twisting',
                'شلل الأجنحة': 'Wing Paralysis',
                'تورم الرأس': 'Head Swelling',
                'انتفاش الريش': 'Feather Ruffling',
                'خمول': 'Lethargy',
                'صعوبة التنفس': 'Breathing Difficulty',
                'إسهال أخضر': 'Green Diarrhea',
                'انخفاض إنتاج البيض': 'Reduced Egg Production',
                'شحوب العرف': 'Pale Comb',
                'إسهال مائي': 'Watery Diarrhea',
                'رجفة': 'Tremors',
                'سعال': 'Coughing',
                'إفرازات أنفية': 'Nasal Discharge',
                'فقدان الشهية': 'Loss of Appetite',
                'إسهال دموي': 'Bloody Diarrhea',

                // Organ Conditions
                'نزيف نقطي': 'Pinpoint Bleeding',
                'تورم': 'Swelling',
                'سليم': 'Healthy',
                'تقرحات نزفية': 'Hemorrhagic Ulcers',
                'التهاب': 'Inflammation',
                'تضخم': 'Enlargement',
                'بقع نخرية': 'Necrotic Spots'
            }
        };
    }

    // ترجمة النتائج فقط
    translateResults(results) {
        if (this.currentLang === 'ar') return results;

        const translated = JSON.parse(JSON.stringify(results));

        // ترجمة أنواع الدجاج
        if (translated.chickenAnalysis) {
            translated.chickenAnalysis.breed.type = this.translateChickenBreed(translated.chickenAnalysis.breed.type);
            translated.chickenAnalysis.symptoms = translated.chickenAnalysis.symptoms.map(symptom =>
                this.translateSymptom(symptom)
            );
            translated.chickenAnalysis.detectedDiseases = translated.chickenAnalysis.detectedDiseases.map(disease =>
                this.translateDisease(disease)
            );
        }

        // ترجمة ألوان البراز
        if (translated.fecesAnalysis) {
            translated.fecesAnalysis.color = this.translateFecesColor(translated.fecesAnalysis.color);
            translated.fecesAnalysis.consistency = this.translateConsistency(translated.fecesAnalysis.consistency);
            translated.fecesAnalysis.detectedDiseases = translated.fecesAnalysis.detectedDiseases.map(disease =>
                this.translateDisease(disease)
            );
        }

        // ترجمة حالات الأعضاء
        if (translated.organAnalysis) {
            translated.organAnalysis.condition = this.translateOrganCondition(translated.organAnalysis.condition);
            translated.organAnalysis.color = this.translateColor(translated.organAnalysis.color);
            translated.organAnalysis.abnormalities = translated.organAnalysis.abnormalities.map(abnormality =>
                this.translateAbnormality(abnormality)
            );
            translated.organAnalysis.detectedDiseases = translated.organAnalysis.detectedDiseases.map(disease =>
                this.translateDisease(disease)
            );
        }

        // ترجمة التشخيص المتكامل
        if (translated.integratedDiagnosis) {
            translated.integratedDiagnosis = translated.integratedDiagnosis.map(diagnosis => ({
                ...diagnosis,
                disease: this.translateDisease(diagnosis.disease),
                details: {
                    ...diagnosis.details,
                    externalSymptoms: (diagnosis.details.externalSymptoms || []).map(symptom =>
                        this.translateSymptom(symptom)
                    ),
                    fecesColor: this.translateFecesColor(diagnosis.details.fecesColor),
                    treatment: this.translateTreatment(diagnosis.details.treatment),
                    prevention: this.translatePrevention(diagnosis.details.prevention),
                    etiology: diagnosis.details.etiology
                }
            }));
        }

        return translated;
    }


    translateInternalResults(results) {
        // إذا العربية لا حاجة للترجمة، أعد الكائن كما هو
        if (this.currentLang === 'ar' || !results) return results;

        // clone للحفاظ على الأصل
        const translated = JSON.parse(JSON.stringify(results));

        // ترجمة تحليل الدجاجة
        if (translated.chickenAnalysis) {
            // نوع السلالة
            if (translated.chickenAnalysis.breed && translated.chickenAnalysis.breed.type) {
                translated.chickenAnalysis.breed.type = this.translateChickenBreed(translated.chickenAnalysis.breed.type);
            }
            // أعراض خارجية
            if (Array.isArray(translated.chickenAnalysis.symptoms)) {
                translated.chickenAnalysis.symptoms = translated.chickenAnalysis.symptoms.map(s => this.translateSymptom(s));
            }
            // أمراض مكتشفة
            if (Array.isArray(translated.chickenAnalysis.detectedDiseases)) {
                translated.chickenAnalysis.detectedDiseases = translated.chickenAnalysis.detectedDiseases.map(d => this.translateDisease(d));
            }
            // وزن (قد يكون نص)
            if (translated.chickenAnalysis.weight && translated.chickenAnalysis.weight.estimated) {
                // لا توجد دالة عامة لتحويل الوحدات، لكن نترجم أي نص معروف
                translated.chickenAnalysis.weight.estimated = this.translations[this.currentLang][translated.chickenAnalysis.weight.estimated] || translated.chickenAnalysis.weight.estimated;
            }
        }

        // ترجمة تحليل البراز
        if (translated.fecesAnalysis) {
            if (translated.fecesAnalysis.color) {
                translated.fecesAnalysis.color = this.translateFecesColor(translated.fecesAnalysis.color);
            }
            if (translated.fecesAnalysis.consistency) {
                translated.fecesAnalysis.consistency = this.translateConsistency(translated.fecesAnalysis.consistency);
            }
            if (Array.isArray(translated.fecesAnalysis.detectedDiseases)) {
                translated.fecesAnalysis.detectedDiseases = translated.fecesAnalysis.detectedDiseases.map(d => this.translateDisease(d));
            }
        }

        // ترجمة تحليل العضو
        if (translated.organAnalysis) {
            if (translated.organAnalysis.condition) {
                translated.organAnalysis.condition = this.translateOrganCondition(translated.organAnalysis.condition);
            }
            if (translated.organAnalysis.color) {
                translated.organAnalysis.color = this.translateColor(translated.organAnalysis.color);
            }
            if (Array.isArray(translated.organAnalysis.abnormalities)) {
                translated.organAnalysis.abnormalities = translated.organAnalysis.abnormalities.map(a => this.translateAbnormality(a));
            }
            if (Array.isArray(translated.organAnalysis.detectedDiseases)) {
                translated.organAnalysis.detectedDiseases = translated.organAnalysis.detectedDiseases.map(d => this.translateDisease(d));
            }
        }

        if (Array.isArray(translated.integratedDiagnosis)) {
            translated.integratedDiagnosis = translated.integratedDiagnosis.map(diag => {
                const newDiag = JSON.parse(JSON.stringify(diag));
                if (newDiag.disease) newDiag.disease = this.translateDisease(newDiag.disease);
                if (Array.isArray(newDiag.reasons)) newDiag.reasons = newDiag.reasons.map(r => {
          
                    let rr = r;
                    rr = rr.replace(/اللون: (\S+)/, (m, g1) => `Color: ${this.translateFecesColor(g1)}`);
               
                    return this.translations[this.currentLang][rr] || rr;
                });
            
                if (newDiag.details) {
                    if (Array.isArray(newDiag.details.externalSymptoms)) {
                        newDiag.details.externalSymptoms = newDiag.details.externalSymptoms.map(s => this.translateSymptom(s));
                    }
                    if (newDiag.details.fecesColor) {
                        newDiag.details.fecesColor = this.translateFecesColor(newDiag.details.fecesColor);
                    }
                    if (newDiag.details.treatment) {
                        newDiag.details.treatment = this.translateTreatment(newDiag.details.treatment);
                    }
                    if (newDiag.details.prevention) {
                        newDiag.details.prevention = this.translatePrevention(newDiag.details.prevention);
                    }
          
                }
                return newDiag;
            });
        }

        if (translated.finalReport) {
            if (translated.finalReport.primaryDiagnosis && translated.finalReport.primaryDiagnosis.disease) {
                translated.finalReport.primaryDiagnosis.disease = this.translateDisease(translated.finalReport.primaryDiagnosis.disease);
            }
            if (Array.isArray(translated.finalReport.recommendedTests)) {

                translated.finalReport.recommendedTests = translated.finalReport.recommendedTests.map(t => this.translations[this.currentLang][t] || t);
            }
            if (translated.finalReport.emergencyLevel) {
           
                translated.finalReport.emergencyLevel = this.translations[this.currentLang][translated.finalReport.emergencyLevel] || translated.finalReport.emergencyLevel;
            }
        }

        return translated;
    }

    translateChickenBreed(breed) {
        const breeds = {
            'روس 306': 'Lohmann',
            'ساسو': 'Sasso',
            'أربيان': 'Arbian',
            'بلدية': 'Local Breed'
        };
        return breeds[breed] || breed;
    }

    translateSymptom(symptom) {
        return this.translations[this.currentLang][symptom] || symptom;
    }

    translateFecesColor(color) {
        const colors = {
            'أخضر': 'Green',
            'أبيض': 'White',
            'بني طبيعي': 'Normal Brown',
            'بني محمر': 'Reddish Brown',
            'أصفر': 'Yellow',
            'أخضر مائل إلى الأصفر': 'Greenish Yellow',
            'أبيض مائل إلى الأخضر': 'Whitish Green',
            'أخضر فاتح': 'Light Green'
        };
        return colors[color] || color;
    }

    translateConsistency(consistency) {
        const consistencies = {
            'مائي': 'Watery',
            'طبيعي': 'Normal',
            'صلب': 'Solid'
        };
        return consistencies[consistency] || consistency;
    }

    translateOrganCondition(condition) {
        return this.translations[this.currentLang][condition] || condition;
    }

    translateColor(color) {
        const colors = {
            'طبيعي': 'Normal',
            'شاحب': 'Pale',
            'أحمر': 'Red',
            'أصفر': 'Yellow'
        };
        return colors[color] || color;
    }

    translateAbnormality(abnormality) {
        const abnormalities = {
            'وذمة': 'Edema',
            'نزيف': 'Bleeding',
            'تضخم': 'Enlargement',
            'تنكرز': 'Necrosis',
            'التهاب': 'Inflammation',
            'إفرازات': 'Discharge',
            'احتقان': 'Congestion'
        };
        return abnormalities[abnormality] || abnormality;
    }

    translateDisease(disease) {
        return this.translations[this.currentLang][disease] || disease;
    }

    translateTreatment(treatment) {
        const treatments = {
            'لا يوجد علاج محدد - التطعيم الوقائي أساسي': 'No specific treatment - preventive vaccination is essential',
            'الإعدام والحرق للقطعان المصابة': 'Culling and burning of infected flocks',
            'لا يوجد علاج - الوقاية بالتطعيم': 'No treatment - prevention through vaccination',
            'دعم مناعي، مضادات حيوية لمنع العدوى الثانوية': 'Immune support, antibiotics to prevent secondary infections',
            'دعم تنفسي، تحسين التهوية': 'Respiratory support, improved ventilation',
            'مضادات الكوكسيديا (أمبروليوم، سالينوميسين)': 'Coccidiostats (Amprolium, Salinomycin)'
        };
        return treatments[treatment] || treatment;
    }

    translatePrevention(prevention) {
        const preventions = {
            'النظافة والتعقيم الدوري، العزل الصحي': 'Hygiene and periodic sterilization, quarantine',
            'منع اختلاط الطيور البرية، الرقابة البيطرية': 'Prevent contact with wild birds, veterinary supervision',
            'التطعيم عند الفقس، النظافة الشديدة': 'Vaccination at hatching, strict hygiene',
            'التطهير، التطعيم للأمهات': 'Disinfection, vaccination of breeders',
            'التطعيم، تحسين ظروف التربية': 'Vaccination, improved breeding conditions',
            'النظافة، استخدام الأقفاص الشبكية': 'Hygiene, use of wire cages'
        };
        return preventions[prevention] || prevention;
    }

    // تبديل لغة النتائج فقط
    toggleResultsLanguage() {
        this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
        return this.currentLang;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getTranslation(key) {
        return this.translations[this.currentLang][key] || key;
    }
}

// إنشاء instance عام
const languageSwitcher = new LanguageSwitcher();