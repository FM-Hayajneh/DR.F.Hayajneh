/**
 * video-analyzer.js - محرك تحليل الفيديو المحسن
 * نظام تحليل متقدم للدجاج باستخدام الذكاء الاصطناعي مع تحسينات أداء متقدمة
 */

// ==========================================
// إعدادات الأداء القابلة للتخصيص
// ==========================================
const PERFORMANCE_CONFIG = {
    ANALYSIS_FPS: 5,                    // عدد الإطارات التي يتم تحليلها في الثانية
    MIN_CONFIDENCE: 0.6,               // الحد الأدنى للثقة لقبول النتيجة
    BATCH_SIZE: 1,                     // عدد الإطارات لكل دفعة تحليل
    USE_WORKER: false,                 // استخدام Web Workers (يتطلب إعداد إضافي)
    QUALITY: 'balanced',               // 'low', 'balanced', 'high'
    ENABLE_GPU: true,                  // تفعيل تسريع GPU
    MAX_ANALYSIS_TIME: 60,             // الحد الأقصى للتحليل (ثانية)
    ENABLE_CACHING: true               // تفعيل التخزين المؤقت
};

// ==========================================
// إعدادات النموذج
// ==========================================
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/etlPTgo5t/";

// ==========================================
// فئة محلل الفيديو الأساسية (معدلة للعمل مع الصفحة الرئيسية)
// ==========================================
class EnhancedVideoAnalyzer {
    constructor() {
        this.model = null;
        this.maxPredictions = 0;
        this.isAnalyzing = false;
        
        // إدارة الإطارات
        this.analysisFrameId = null;
        this.lastFrameTime = 0;
        
        // النتائج التراكمية
        this.cumulativePredictions = {};
        this.totalFramesAnalyzed = 0;
        
        // عناصر DOM من الصفحة الرئيسية
        this.videoElement = document.getElementById('previewVideo');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', {
            alpha: false,
            desynchronized: true
        });
        
        // التخزين المؤقت
        this.modelCache = null;
        this.cacheExpiry = 0;
        this.CACHE_DURATION = 30 * 60 * 1000; // 30 دقيقة
        
        // التحكم في الأداء
        this.analysisStartTime = 0;
        this.processingInterval = null;
        
        console.log('✅ محلل الفيديو المحسن جاهز');
    }
    
    // ==========================================
    // تحميل النموذج
    // ==========================================
    
    async loadModel() {
        // التحقق من التخزين المؤقت أولاً
        if (PERFORMANCE_CONFIG.ENABLE_CACHING && this.isModelCached()) {
            console.log('📦 استخدام النموذج من التخزين المؤقت');
            return this.loadFromCache();
        }
        
        console.log('🔄 تحميل النموذج من الخادم...');
        
        try {
            const loadStart = performance.now();
            
            this.model = await tmImage.load(
                MODEL_URL + "model.json", 
                MODEL_URL + "metadata.json"
            );
            
            const loadTime = performance.now() - loadStart;
            console.log(`✅ تم تحميل النموذج في ${loadTime.toFixed(0)} مللي ثانية`);
            
            this.maxPredictions = this.model.getTotalClasses();
            
            // تخزين النموذج في الكاش
            if (PERFORMANCE_CONFIG.ENABLE_CACHING) {
                this.cacheModel();
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ فشل تحميل النموذج:', error);
            
            // محاولة استخدام النسخة المخبأة
            if (this.modelCache) {
                console.log('🔄 المحاولة باستخدام النسخة المخبأة...');
                this.model = this.modelCache.model;
                this.maxPredictions = this.modelCache.maxPredictions;
                return true;
            }
            
            return false;
        }
    }
    
    isModelCached() {
        if (!this.modelCache) return false;
        return Date.now() < this.cacheExpiry;
    }
    
    cacheModel() {
        this.modelCache = {
            model: this.model,
            maxPredictions: this.maxPredictions,
            timestamp: Date.now()
        };
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
    }
    
    loadFromCache() {
        if (!this.modelCache) return false;
        
        this.model = this.modelCache.model;
        this.maxPredictions = this.modelCache.maxPredictions;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        return true;
    }
    
    // ==========================================
    // التحليل الرئيسي
    // ==========================================
    
    async startLiveAnalysis(stream) {
        if (!await this.loadModel()) {
            throw new Error('فشل تحميل النموذج');
        }
        
        // إعادة ضبط النتائج
        this.cumulativePredictions = {};
        this.totalFramesAnalyzed = 0;
        this.isAnalyzing = true;
        this.analysisStartTime = Date.now();
        
        // ضبط حجم canvas ليتناسب مع الفيديو
        this.canvas.width = this.videoElement.videoWidth || 640;
        this.canvas.height = this.videoElement.videoHeight || 480;
        
        console.log('▶️ بدء التحليل المباشر...');
        
        // بدء حلقة التحليل
        this.startAnalysisLoop();
        
        return true;
    }
    
    startAnalysisLoop() {
        const targetFrameTime = 1000 / PERFORMANCE_CONFIG.ANALYSIS_FPS;
        
        const processFrame = async (currentTime) => {
            if (!this.isAnalyzing) return;
            
            // التحقق مما إذا حان وقت تحليل الإطار التالي
            if (currentTime - this.lastFrameTime >= targetFrameTime) {
                await this.analyzeCurrentFrame();
                this.lastFrameTime = currentTime;
            }
            
            // الاستمرار في الحلقة
            this.analysisFrameId = requestAnimationFrame(processFrame);
        };
        
        this.analysisFrameId = requestAnimationFrame(processFrame);
    }
    
    async analyzeCurrentFrame() {
        if (!this.videoElement || !this.isAnalyzing) return;
        
        try {
            // ضبط حجم canvas إذا تغير
            if (this.canvas.width !== this.videoElement.videoWidth) {
                this.canvas.width = this.videoElement.videoWidth;
                this.canvas.height = this.videoElement.videoHeight;
            }
            
            // رسم الإطار الحالي
            this.ctx.drawImage(
                this.videoElement, 
                0, 0, 
                this.canvas.width, 
                this.canvas.height
            );
            
            // تحليل الصورة
            const predictions = await this.model.predict(this.canvas);
            
            // معالجة النتائج
            this.processFramePredictions(predictions);
            
            // تحديث واجهة المستخدم
            this.updateLiveIndicators();
            
        } catch (error) {
            console.warn('⚠️ خطأ في تحليل الإطار:', error);
        }
    }
    
    processFramePredictions(predictions) {
        let bestClass = null;
        let maxProb = 0;
        
        // البحث عن أفضل توقع
        for (let i = 0; i < predictions.length; i++) {
            if (predictions[i].probability > maxProb) {
                maxProb = predictions[i].probability;
                bestClass = predictions[i].className;
            }
        }
        
        // قبول النتيجة فقط إذا كانت فوق الحد الأدنى للثقة
        if (maxProb >= PERFORMANCE_CONFIG.MIN_CONFIDENCE) {
            this.cumulativePredictions[bestClass] = (this.cumulativePredictions[bestClass] || 0) + 1;
            this.totalFramesAnalyzed++;
        }
        
        // تحديث شريط التقدم في واجهة المستخدم
        this.updateProgressUI();
    }
    
    updateProgressUI() {
        const processingProgress = document.getElementById('processingProgress');
        const processingValue = document.getElementById('processingValue');
        
        if (processingProgress && processingValue) {
            const elapsed = Date.now() - this.analysisStartTime;
            const progress = Math.min(100, Math.round((elapsed / 30000) * 100)); // 30 ثانية كحد أقصى
            
            processingProgress.style.width = `${progress}%`;
            processingValue.textContent = `جاري التحليل... ${this.totalFramesAnalyzed} إطار`;
        }
    }
    
    updateLiveIndicators() {
        const indicatorsGrid = document.querySelector('.indicators-grid');
        if (!indicatorsGrid) return;
        
        // حساب النتيجة الحالية
        let currentClass = "Healthy_Chicken";
        let maxVotes = 0;
        
        for (const [className, votes] of Object.entries(this.cumulativePredictions)) {
            if (votes > maxVotes) {
                maxVotes = votes;
                currentClass = className;
            }
        }
        
        const confidence = this.totalFramesAnalyzed > 0 
            ? Math.round((maxVotes / this.totalFramesAnalyzed) * 100) 
            : 0;
        
        // تحديث المؤشرات الحية
        indicatorsGrid.innerHTML = `
            <div class="indicator-item">
                <div class="indicator-icon" style="background: ${confidence > 70 ? 'var(--gradient-success)' : 'var(--gradient-warning)'};">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="indicator-label">الحالة الحالية</div>
                <div class="indicator-value">${this.getDiseaseName(currentClass)}</div>
            </div>
            <div class="indicator-item">
                <div class="indicator-icon" style="background: var(--gradient-success);">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="indicator-label">ثقة التحليل</div>
                <div class="indicator-value">${confidence}%</div>
            </div>
            <div class="indicator-item">
                <div class="indicator-icon" style="background: var(--gradient-primary);">
                    <i class="fas fa-film"></i>
                </div>
                <div class="indicator-label">الإطارات المحللة</div>
                <div class="indicator-value">${this.totalFramesAnalyzed}</div>
            </div>
            <div class="indicator-item">
                <div class="indicator-icon" style="background: var(--gradient-secondary);">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="indicator-label">مدة التحليل</div>
                <div class="indicator-value">${Math.round((Date.now() - this.analysisStartTime) / 1000)}s</div>
            </div>
        `;
    }
    
    getDiseaseName(diseaseCode) {
        if (!window.poultryDB) return diseaseCode;
        
        try {
            const info = window.poultryDB.getDiseaseInfo(diseaseCode);
            return info.name || diseaseCode;
        } catch (error) {
            return diseaseCode;
        }
    }
    
    // ==========================================
    // إنهاء التحليل
    // ==========================================
    
    stopAnalysis() {
        this.isAnalyzing = false;
        
        if (this.analysisFrameId) {
            cancelAnimationFrame(this.analysisFrameId);
            this.analysisFrameId = null;
        }
        
        console.log('⏹️ إيقاف التحليل...');
        console.log('📊 النتائج التراكمية:', this.cumulativePredictions);
        console.log('🎞️ الإطارات المحللة:', this.totalFramesAnalyzed);
        
        return this.getFinalResults();
    }
    
    getFinalResults() {
        if (this.totalFramesAnalyzed === 0) {
            return {
                className: "Healthy_Chicken",
                confidence: 0,
                votes: 0,
                totalFrames: 0
            };
        }
        
        let winnerClass = "Healthy_Chicken";
        let maxVotes = 0;
        
        for (const [className, votes] of Object.entries(this.cumulativePredictions)) {
            if (votes > maxVotes) {
                maxVotes = votes;
                winnerClass = className;
            }
        }
        
        const confidence = Math.round((maxVotes / this.totalFramesAnalyzed) * 100);
        
        return {
            className: winnerClass,
            confidence: confidence,
            votes: maxVotes,
            totalFrames: this.totalFramesAnalyzed,
            allPredictions: this.cumulativePredictions
        };
    }
    
    // ==========================================
    // تنظيف الموارد
    // ==========================================
    
    cleanup() {
        this.isAnalyzing = false;
        
        if (this.analysisFrameId) {
            cancelAnimationFrame(this.analysisFrameId);
            this.analysisFrameId = null;
        }
        
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
        
        this.cumulativePredictions = {};
        this.totalFramesAnalyzed = 0;
        
        // تنظيف canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = 1;
        this.canvas.height = 1;
    }
}

// ==========================================
// التصدير والتوافق
// ==========================================

// إنشاء نسخة عامة
window.EnhancedVideoAnalyzer = EnhancedVideoAnalyzer;

// تهيئة تلقائية
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.enhancedVideoAnalyzer === 'undefined') {
        window.enhancedVideoAnalyzer = new EnhancedVideoAnalyzer();
        console.log('✅ Enhanced Video Analyzer initialized');
    }
});