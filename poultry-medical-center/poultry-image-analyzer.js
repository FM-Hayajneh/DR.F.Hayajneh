/**
 * poultry-image-analyzer.js
 * (نسخة محدثة تدعم الفلترة الصارمة Strict Filtering)
 */

class PoultryImageAnalyzer {
    constructor() {
        this.model = null;
        this.modelURL = ""; 
        this.isModelLoaded = false;
    }

    async init(url) {
        if (!url) return false;
        this.modelURL = url;
        try {
            // تحميل النموذج
            this.model = await tmImage.load(url + "model.json", url + "metadata.json");
            this.isModelLoaded = true;
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // ============================================================
    // دالة التحليل مع الفلترة (The Filter Logic)
    // ============================================================
    async analyzeBatch(imageElementsArray, allowedClasses = []) {
        if (!this.isModelLoaded || !imageElementsArray || imageElementsArray.length === 0) return null;

        let bestPrediction = null;
        let highestProb = -1;

        for (let img of imageElementsArray) {
            // 1. الحصول على جميع التوقعات من الموديل
            const allPredictions = await this.model.predict(img);
            
            // 2. فلترة النتائج: نأخذ فقط ما هو موجود في القائمة المسموحة
            const filteredPredictions = allPredictions.filter(p => allowedClasses.includes(p.className));

            // إذا لم يبق شيء بعد الفلترة (مثلاً صورة قلب ولا يوجد كلاس للقلب)، نتخطى
            if (filteredPredictions.length === 0) continue;

            // 3. ترتيب النتائج المفلترة
            filteredPredictions.sort((a, b) => b.probability - a.probability);
            const topResult = filteredPredictions[0];
            const prob = topResult.probability;

            // 4. المقارنة
            if (prob > highestProb) {
                highestProb = prob;
                bestPrediction = topResult;
            }
        }

        if (!bestPrediction) return null;

        return {
            aiClass: bestPrediction.className,
            probability: (highestProb * 100).toFixed(1),
            diseaseData: window.poultryDB.getDiseaseInfo(bestPrediction.className)
        };
    }

    // الدالة الرئيسية التي تستدعي التحليل لكل مجموعة بقائمتها الخاصة
    async comprehensiveAnalysis(chickenImgs, fecesImgs, organImgs, selectedOrganType) {
        let results = {
            chicken: null,
            feces: null,
            organ: null,
            finalDiagnosis: null
        };

        // 1. تحليل الدجاج (نرسل قائمة CHICKEN المسموحة)
        if (chickenImgs.length > 0) {
            const allowed = window.poultryDB.getAllowedClasses('CHICKEN');
            results.chicken = await this.analyzeBatch(chickenImgs, allowed);
        }
        
        // 2. تحليل البراز (نرسل قائمة FECES المسموحة)
        if (fecesImgs.length > 0) {
            const allowed = window.poultryDB.getAllowedClasses('FECES');
            results.feces = await this.analyzeBatch(fecesImgs, allowed);
        }
        
        // 3. تحليل العضو (نرسل قائمة العضو المحدد فقط)
        if (organImgs.length > 0 && selectedOrganType) {
            const allowed = window.poultryDB.getAllowedClasses('ORGANS', selectedOrganType);
            results.organ = await this.analyzeBatch(organImgs, allowed);
        }

        // منطق اتخاذ القرار النهائي
        let highestConfidence = 0;
        let finalDecision = null;

        [results.chicken, results.feces, results.organ].forEach(res => {
            if (res && parseFloat(res.probability) > highestConfidence) {
                highestConfidence = parseFloat(res.probability);
                finalDecision = res;
            }
        });

        results.finalDiagnosis = finalDecision;
        return results;
    }
}

window.imageAnalyzer = new PoultryImageAnalyzer();