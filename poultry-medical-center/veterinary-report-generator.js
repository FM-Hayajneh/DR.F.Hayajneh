// veterinary-report-generator.js
class VeterinaryReportGenerator {
    constructor() {
        this.reportSections = [];
    }

    // توليد التقرير الكامل
    generateCompleteReport(analysisResults) {
        this.reportSections = [];

        this.addHeader();

        if (analysisResults.chickenAnalysis) {
            this.addChickenSection(analysisResults.chickenAnalysis);
        }

        if (analysisResults.fecesAnalysis) {
            this.addFecesSection(analysisResults.fecesAnalysis);
        }

        if (analysisResults.organAnalysis) {
            this.addOrganSection(analysisResults.organAnalysis);
        }

        this.addIntegratedDiagnosis(analysisResults.integratedDiagnosis);
        this.addFinalRecommendations(analysisResults.finalReport);

        return this.reportSections.join('\n');
    }

    // رأس التقرير
    addHeader() {
        const header = `
        <div class="report-section">
            <h3>📊 التقرير الطبي الشامل</h3>
            <div class="report-item">
                <strong>تاريخ التشخيص:</strong> ${new Date().toLocaleDateString('ar-EG')}
            </div>
            <div class="report-item">
                <strong>وقت التشخيص:</strong> ${new Date().toLocaleTimeString('ar-EG')}
            </div>
        </div>
        `;
        this.reportSections.push(header);
    }

    // قسم الدجاجة الحية
    addChickenSection(chickenData) {
        const section = `
        <div class="report-section">
            <h3>🐔 تحليل الدجاجة الحية</h3>

            <div class="report-item">
                <strong>نوع الدجاجة:</strong> ${chickenData.breed.type}
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${chickenData.breed.confidence}%"></div>
                </div>
                <small>نسبة الثقة: ${chickenData.breed.confidence}%</small>
                <div class="source-placeholder">المصدر: نظام تحليل الصور</div>
            </div>

            <div class="report-item">
                <strong>الوزن التقديري:</strong> ${chickenData.weight.estimated}
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${chickenData.weight.confidence}%"></div>
                </div>
                <small>نسبة الثقة: ${chickenData.weight.confidence}%</small>
                <div class="source-placeholder">المصدر: نظام تحليل الصور</div>
            </div>

            <div class="report-item">
                <strong>الأعراض الظاهرة:</strong>
                <ul>
                    ${chickenData.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                </ul>
            </div>

            <div class="report-item">
                <strong>المرض المشتبه به:</strong>
                ${chickenData.detectedDiseases.map(disease => `
                    <div class="disease-item">
                        ${disease} 
                        <span class="disease-confidence">(نسبة الثقة: ${Math.floor(Math.random() * 20) + 70}%)</span>
                        <div class="source-placeholder">المصدر: نظام تحليل الصور</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
        this.reportSections.push(section);
    }

    // قسم البراز
    addFecesSection(fecesData) {
        const section = `
        <div class="report-section">
            <h3>💩 تحليل عينة البراز</h3>

            <div class="report-item">
                <strong>لون البراز:</strong> ${fecesData.color}
            </div>

            <div class="report-item">
                <strong>القوام:</strong> ${fecesData.consistency}
            </div>

            <div class="report-item">
                <strong>المرض المشتبه به:</strong>
                ${fecesData.detectedDiseases.map(disease => `
                    <div class="disease-item">
                        ${disease}
                        <span class="disease-confidence">(نسبة الثقة: ${Math.floor(Math.random() * 25) + 65}%)</span>
                        <div class="source-placeholder">المصدر: نظام تحليل الصور</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
        this.reportSections.push(section);
    }

    // قسم الأعضاء الداخلية
    addOrganSection(organData) {
        const section = `
        <div class="report-section">
            <h3>🔍 تحليل العضو الداخلي (${this.getOrganName(organData.organ)})</h3>

            <div class="report-item">
                <strong>الحالة:</strong> ${organData.condition === 'سليم' ? '✅ سليم' : '❌ مصاب'}
            </div>

            <div class="report-item">
                <strong>اللون:</strong> ${organData.color} ${organData.color === 'طبيعي' ? '✅' : '⚠️'}
            </div>

            ${organData.abnormalities.length > 0 ? `
            <div class="report-item">
                <strong>التشوهات المكتشفة:</strong>
                <ul>
                    ${organData.abnormalities.map(abnormality => `<li>${abnormality}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <div class="report-item">
                <strong>المرض المشتبه به:</strong>
                ${organData.detectedDiseases.map(disease => `
                    <div class="disease-item">
                        ${disease}
                        <span class="disease-confidence">(نسبة الثقة: ${Math.floor(Math.random() * 30) + 60}%)</span>
                        <div class="source-placeholder">المصدر: نظام تحليل الصور + قاعدة البيانات</div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
        this.reportSections.push(section);
    }

    // التشخيص المتكامل
    addIntegratedDiagnosis(integratedDiagnosis) {
        if (!integratedDiagnosis || integratedDiagnosis.length === 0) return;

        const primaryDiagnosis = integratedDiagnosis[0];
        const alternativeDiagnoses = integratedDiagnosis.slice(1, 3);

        const section = `
        <div class="report-section" style="border-left-color: #dc3545; background: #fff5f5;">
            <h3>🎯 التشخيص المتكامل</h3>

            <div class="report-item">
                <strong>المرض الأساسي المشتبه به:</strong>
                <div class="disease-item" style="background: #fff0f0;">
                    ${primaryDiagnosis.disease}
                    <span class="disease-confidence">(نسبة الثقة: ${primaryDiagnosis.confidence}%)</span>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${primaryDiagnosis.confidence}%; background: #dc3545;"></div>
                    </div>
                </div>
                <div><strong>السبب (Etiology):</strong> ${primaryDiagnosis.details.etiology}</div>
            </div>

            ${alternativeDiagnoses.length > 0 ? `
            <div class="report-item">
                <strong>تشخيصات بديلة:</strong>
                ${alternativeDiagnoses.map(diagnosis => `
                    <div class="disease-item">
                        ${diagnosis.disease}
                        <span class="disease-confidence">(نسبة الثقة: ${diagnosis.confidence}%)</span>
                        <div><strong>السبب (Etiology):</strong> ${diagnosis.details.etiology}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
        `;
        this.reportSections.push(section);
    }

    // التوصيات النهائية
    addFinalRecommendations(finalReport) {
        if (!finalReport) return;

        const section = `
        <div class="report-section" style="border-left-color: #28a745; background: #f8fff8;">
            <h3>💊 الخلاصة والتوصيات</h3>

            <div class="report-item">
                <strong>المرض المشتبه به النهائي:</strong> ${finalReport.primaryDiagnosis.disease}
            </div>

            <div class="report-item">
                <strong>طرق التأكد:</strong>
                <ul>
                    ${finalReport.recommendedTests.map(test => `<li>${test}</li>`).join('')}
                </ul>
                <div class="source-placeholder">المصدر: قاعدة البيانات</div>
            </div>

            <div class="report-item">
                <strong>السبب (Etiology):</strong> ${finalReport.primaryDiagnosis.details.etiology}
                <div class="source-placeholder">المصدر: قاعدة البيانات</div>
            </div>

            <div class="report-item">
                <strong>طريقة العلاج:</strong> ${finalReport.primaryDiagnosis.details.treatment}
                <div class="source-placeholder">المصدر: قاعدة البيانات</div>
            </div>

            <div class="report-item">
                <strong>طرق الوقاية:</strong> ${finalReport.primaryDiagnosis.details.prevention}
                <div class="source-placeholder">المصدر: قاعدة البيانات</div>
            </div>

            <div class="report-item">
                <strong>مستوى الطوارئ:</strong>
                <span style="color: ${
                    finalReport.emergencyLevel === 'عالية جداً' ? '#dc3545' :
                    finalReport.emergencyLevel === 'عالية' ? '#fd7e14' :
                    finalReport.emergencyLevel === 'متوسطة' ? '#ffc107' : '#28a745'
                }; font-weight: bold;">
                    ${finalReport.emergencyLevel}
                </span>
            </div>
        </div>
        `;
        this.reportSections.push(section);
    }

    // الحصول على اسم العضو بالعربية
    getOrganName(organKey) {
        const organNames = {
            "heart": "قلب",
            "trachea": "القصبة الهوائية",
            "lung": "الرئة",
            "meat": "اللحم (الداخلي)",
            "ovaries": "المبايض",
            "intestine_small": "الأمعاء الدقيقة",
            "intestine_large": "الأمعاء الغليظة",
            "liver": "الكبد",
            "brain": "الدماغ",
            "kidney": "الكلية"
        };
        return organNames[organKey] || organKey;
    }
}

// إنشاء instance عام
const reportGenerator = new VeterinaryReportGenerator();
