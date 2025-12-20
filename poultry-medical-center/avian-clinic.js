/**
 * avian-clinic.js
 * المشغل الرئيسي لصفحة التشخيص (مصحح 100%)
 */

const MY_TEACHABLE_MACHINE_MODEL_URL = "https://teachablemachine.withgoogle.com/models/etlPTgo5t/"; 

document.addEventListener('DOMContentLoaded', async () => {
    
    // تعريف العناصر
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const analyzeText = document.getElementById('analyzeText');
    const resultsSection = document.getElementById('resultsSection');
    const comprehensiveResults = document.getElementById('comprehensiveResults');
    const overallConfidence = document.getElementById('overallConfidence');
    const overallConfidenceBar = document.getElementById('overallConfidenceBar');

    // إعداد معاينة الصور
    setupMultiImagePreview('chickenFileInput', 'chickenCard', 'chickenPreviewGrid', 'chickenUploadArea', 'chickenPreviewArea');
    setupMultiImagePreview('fecesFileInput', 'fecesCard', 'fecesPreviewGrid', 'fecesUploadArea', 'fecesPreviewArea');
    setupMultiImagePreview('organFileInput', 'organCard', 'organPreviewGrid', 'organUploadArea', 'organPreviewArea');

    // منطق خاص لرفع صور الأعضاء
    const organSelect = document.getElementById('organSelect');
    const organUploadArea = document.getElementById('organUploadArea');
    
    if(organUploadArea) {
        organUploadArea.addEventListener('click', function(e) {
            // منع النقر إذا لم يتم اختيار عضو، إلا إذا كان النقر على الزر نفسه
            if (organSelect.value === "") {
                e.preventDefault();
                e.stopPropagation();
                alert("⚠️ يرجى اختيار العضو من القائمة المنسدلة أولاً.");
                organSelect.focus();
            }
        });
    }

    // تهيئة النموذج
    if (window.imageAnalyzer) {
         if (MY_TEACHABLE_MACHINE_MODEL_URL.includes("YOUR_ID_HERE")) {
            console.warn("⚠️ تنبيه: الرابط وهمي.");
            analyzeText.textContent = "يرجى إضافة رابط النموذج";
        } else {
            analyzeText.textContent = "جاري تهيئة الذكاء الاصطناعي...";
            analyzeBtn.disabled = true;
            const loaded = await window.imageAnalyzer.init(MY_TEACHABLE_MACHINE_MODEL_URL);
            if (loaded) {
                analyzeText.textContent = "ابدأ التشخيص الشامل";
                analyzeBtn.disabled = false;
            } else {
                analyzeText.textContent = "فشل تحميل النظام";
            }
        }
    }

    // زر التحليل
    analyzeBtn.addEventListener('click', async () => {
        const chickenImages = getImagesFromGrid('chickenPreviewGrid');
        const fecesImages = getImagesFromGrid('fecesPreviewGrid');
        const organImages = getImagesFromGrid('organPreviewGrid');
        const selectedOrgan = document.getElementById('organSelect').value;

        if (chickenImages.length === 0 && fecesImages.length === 0 && organImages.length === 0) {
            alert("⚠️ عذراً، يجب رفع صورة واحدة على الأقل.");
            return;
        }

        setLoadingState(true);

        try {
            const results = await window.imageAnalyzer.comprehensiveAnalysis(
                chickenImages, 
                fecesImages,   
                organImages,
                selectedOrgan
            );
            displayResults(results);
        } catch (error) {
            console.error("Analysis Error:", error);
            alert("حدث خطأ أثناء المعالجة.");
        } finally {
            setLoadingState(false);
        }
    });


    // ============================================================
    // 🔴 دالة عرض النتائج المفصلة (The Split Display Logic)
    // ============================================================
    function displayResults(data) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        let html = '';
        const final = data.finalDiagnosis;

        // تحديث شريط الثقة بناءً على النتيجة النهائية الأقوى
        if(overallConfidence && final) {
            overallConfidence.textContent = final.probability + '%';
            overallConfidenceBar.style.width = final.probability + '%';
        }

        // ---------------------------------------------------------
        // القسم 1: نتائج الدجاجة الحية (يظهر فقط إذا تم رفع صور دجاج)
        // ---------------------------------------------------------
        if (data.chicken) {
            const chickResult = data.chicken; // النتيجة الخاصة بالدجاج فقط
            const chickDisease = chickResult.diseaseData;
            
            // استنتاج السلالة والعمر من نتيجة الدجاج
            let breedInfo = window.poultryDB.getBreedInfo(chickResult.aiClass);
            let ageInfo = window.poultryDB.getAgeInfo(chickResult.aiClass);
            
            if (breedInfo.name === "سلالة تجارية" || breedInfo.name === undefined) {
                const inferred = window.poultryDB.inferBreedAndAge(chickResult.aiClass);
                breedInfo = inferred.breed;
                ageInfo = inferred.age;
            }

            // فاصل القسم
            html += `
            <div class="results-divider divider-chicken">
                <i class="fas fa-dove"></i>
                <h3>نتائج تحليل الدجاجة الحية</h3>
            </div>`;

            // بطاقة السلالة
            html += createAccordionCard(
                'السلالة والعمر المقدر', 'fas fa-dna',
                `<div class="info-row"><strong style="color: #e65100;">${breedInfo.name}</strong></div>
                 <div style="padding: 5px 10px; color: #555; font-size: 0.9rem;">
                    مرحلة النمو: <strong>${ageInfo.stage}</strong> (${ageInfo.ageRange})
                 </div>`, 
                true
            );

            // بطاقة التشخيص المبدئي للدجاجة
            html += createAccordionCard(
                'التشخيص الظاهري (من شكل الدجاجة)', 'fas fa-search',
                `<div class="info-row" style="background: #fff3e0; border: 1px solid #ffe0b2;">
                    <strong>${chickDisease.name}</strong>
                    <span style="font-size:0.8rem; background:#e65100; color:#fff; padding:2px 6px; border-radius:4px;">${chickResult.probability}%</span>
                 </div>
                 <div style="padding: 10px; font-size: 0.9rem; color: #555;">
                    <p>الأعراض المرصودة: ${chickDisease.symptoms.join('، ')}</p>
                 </div>`
            );
        }

        // ---------------------------------------------------------
        // القسم 2: نتائج البراز (يظهر فقط إذا تم رفع صور براز)
        // ---------------------------------------------------------
        if (data.feces) {
            const fecesResult = data.feces;
            const fecesDisease = fecesResult.diseaseData;

            html += `
            <div class="results-divider divider-feces">
                <i class="fas fa-vial"></i>
                <h3>نتائج تحليل عينة البراز</h3>
            </div>`;

            html += createAccordionCard(
                'تحليل العينة', 'fas fa-flask',
                `<div class="info-row" style="background: #efebe9; border: 1px solid #d7ccc8;">
                    <strong style="color: #5d4037;">${fecesDisease.name}</strong>
                    <span style="font-size:0.8rem; background:#5d4037; color:#fff; padding:2px 6px; border-radius:4px;">${fecesResult.probability}%</span>
                 </div>
                 <div style="padding: 10px; font-size: 0.9rem; color: #555;">
                    <p>بناءً على اللون والقوام، يشير هذا إلى احتمال إصابة بـ: <strong>${fecesDisease.name}</strong></p>
                 </div>`,
                 true
            );
        }

        // ---------------------------------------------------------
        // القسم 3: نتائج الأعضاء (يظهر فقط إذا تم رفع صور أعضاء)
        // ---------------------------------------------------------
        if (data.organ) {
            const organResult = data.organ;
            const organDisease = organResult.diseaseData;
            // اسم العضو المختار (نأخذه من القائمة لتجميل العرض)
            const organNameDisplay = document.getElementById('organSelect').options[document.getElementById('organSelect').selectedIndex].text;

            html += `
            <div class="results-divider divider-organ">
                <i class="fas fa-heartbeat"></i>
                <h3>نتائج تشريح الأعضاء (${organNameDisplay})</h3>
            </div>`;

            html += createAccordionCard(
                'الآفات التشريحية المرصودة', 'fas fa-microscope',
                `<div class="info-row" style="background: #ffebee; border: 1px solid #ffcdd2;">
                    <strong style="color: #c62828;">${organDisease.name}</strong>
                    <span style="font-size:0.8rem; background:#c62828; color:#fff; padding:2px 6px; border-radius:4px;">${organResult.probability}%</span>
                 </div>
                 <div style="padding: 10px; font-size: 0.9rem; color: #555;">
                    <p>العلامات: ${organDisease.scientificReason.join('، ')}</p>
                 </div>`,
                 true
            );
        }

        // ---------------------------------------------------------
        // القسم 4: الخلاصة النهائية (Summary & Recommendations)
        // ---------------------------------------------------------
        if (final) {
            const finalDisease = final.diseaseData;
            
            html += `
            <div class="results-divider divider-summary">
                <i class="fas fa-clipboard-check"></i>
                <h3>الخلاصة والتوصيات العلاجية</h3>
            </div>`;

            // بطاقة التشخيص النهائي
            html += createAccordionCard(
                'التشخيص النهائي المرجح', 'fas fa-star',
                `<div class="info-row" style="background: #e8f5e9; border: 1px solid #c8e6c9;">
                    <strong style="color: #2e7d32; font-size: 1.2rem;">${finalDisease.name}</strong>
                 </div>
                 <div style="padding: 10px; color: #444; line-height: 1.6;">
                    <p>${finalDisease.description}</p>
                    <p style="margin-top:5px; font-size:0.85rem; color:#666;">تم بناء هذا القرار بناءً على أعلى نسبة تطابق (${final.probability}%) بين جميع الأدلة المرفقة.</p>
                 </div>`,
                 true
            );

            // بطاقة العلاج
            let treatHtml = Array.isArray(finalDisease.treatment) ? `<ol class="scientific-list">${finalDisease.treatment.map(i => `<li>${i}</li>`).join('')}</ol>` : `<p>${finalDisease.treatment}</p>`;
            html += createAccordionCard(
                'خطة العلاج المقترحة', 'fas fa-pills',
                `<div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-right: 4px solid #ff9800;">${treatHtml}</div>`
            );

            // بطاقة الوقاية
            let preventHtml = Array.isArray(finalDisease.prevention) ? `<ol class="scientific-list">${finalDisease.prevention.map(i => `<li>${i}</li>`).join('')}</ol>` : `<p>${finalDisease.prevention}</p>`;
            html += createAccordionCard(
                'إجراءات الوقاية', 'fas fa-shield-alt',
                `<div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-right: 4px solid #43a047;">${preventHtml}</div>`
            );

        } else {
            html = `<div class="alert alert-warning">عذراً، لم يتمكن النظام من تحديد المرض بدقة.</div>`;
        }

        comprehensiveResults.innerHTML = html;
        attachAccordionListeners();
    }


    // --- دوال مساعدة ---

    function createAccordionCard(title, iconClass, content, isOpen = false) {
        return `
        <div class="diagnosis-card ${isOpen ? 'active' : ''}">
            <div class="card-header">
                <div class="card-title"><i class="${iconClass}"></i> ${title}</div>
                <i class="fas fa-chevron-down toggle-icon"></i>
            </div>
            <div class="card-body">${content}</div>
        </div>`;
    }

    function attachAccordionListeners() {
        const headers = document.querySelectorAll('.card-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    }

    function setupMultiImagePreview(inputId, cardId, gridId, uploadAreaId, previewAreaId) {
        const input = document.getElementById(inputId);
        const card = document.getElementById(cardId);
        const grid = document.getElementById(gridId);
        const uploadArea = document.getElementById(uploadAreaId);
        const previewArea = document.getElementById(previewAreaId);

        if (!input || !grid) return;

        input.addEventListener('change', function(e) {
            if (e.target.files && e.target.files.length > 0) {
                card.classList.add('has-files');
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';

                Array.from(e.target.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.classList.add('preview-thumb');
                        img.title = "اضغط للحذف"; 
                        img.onclick = function() {
                            this.remove();
                            if (grid.children.length === 0) {
                                card.classList.remove('has-files');
                                uploadArea.style.display = 'block';
                                previewArea.style.display = 'none';
                            }
                        };
                        grid.appendChild(img);
                    }
                    reader.readAsDataURL(file);
                });
                if (analyzeBtn.textContent === "ابدأ التشخيص الشامل") analyzeBtn.disabled = false;
            }
        });
    }

    function getImagesFromGrid(gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return [];
        return Array.from(grid.getElementsByTagName('img'));
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            analyzeBtn.disabled = true;
            loadingSpinner.style.display = 'inline-block';
            analyzeText.style.display = 'none';
        } else {
            analyzeBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            analyzeText.style.display = 'inline-block';
        }
    }
});