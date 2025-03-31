"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";
import { set } from "lodash";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const translations = {
  en: {
    // Navigation
    "nav.login": "Login",
    "nav.signup": "Sign Up",

    // Hero Section
    "hero.title1": "Intelligent",
    "hero.title2": "Plant Disease Diagnosis",
    "hero.description":
      "Leverage the power of AI to identify plant diseases, get treatment recommendations, and keep your plants healthy.",
    "hero.cta.getStarted": "Get Started",
    "hero.cta.learnMore": "Learn More",

    // Features Section
    "features.title1": "Powerful Features",
    "features.title2": "for Plant Lovers",
    "features.subtitle":
      "Everything you need to keep your plants healthy and thriving.",

    "features.imageAnalysis.title": "Image Analysis",
    "features.imageAnalysis.description":
      "Upload or capture images of your plants for instant AI-powered disease diagnosis.",

    "features.treatment.title": "Treatment Recommendations",
    "features.treatment.description":
      "Get detailed treatment plans and solutions to nurse your plants back to health.",

    "features.prevention.title": "Prevention Tips",
    "features.prevention.description":
      "Learn how to prevent diseases and maintain optimal growing conditions.",

    "features.history.title": "Health History",
    "features.history.description":
      "Track your plant's health over time and monitor treatment effectiveness.",

    "features.ai.title": "AI Powered",
    "features.ai.description":
      "Leveraging advanced AI technology for accurate plant disease identification.",

    "features.responsive.title": "Responsive Design",
    "features.responsive.description":
      "Access Plants Doc from any device - desktop, tablet, or mobile phone.",

    // CTA Section
    "cta.title": "Ready to diagnose your plants?",
    "cta.subtitle":
      "Sign up today and start keeping your plants healthy with AI-powered diagnosis.",
    "cta.button": "Get Started for Free",

    // Footer
    "footer.about": "About",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",

    // Login Page
    "login.title": "Welcome back",
    "login.subtitle": "Sign in to your Plants Doc account",
    "login.email": "Email",
    "login.password": "Password",
    "login.forgotPassword": "Forgot password?",
    "login.button": "Sign In",
    "login.loading": "Signing in...",
    "login.noAccount": "Don't have an account?",
    "login.signup": "Sign up",
    "login.googleButton": "Sign in with Google",
    "login.googleLoading": "Signing in with Google...",
    "login.orContinue": "or continue with",

    // Login errors and success
    "login.errors.userNotFound": "No account exists with this email address.",
    "login.errors.wrongPassword": "Incorrect password. Please try again.",
    "login.errors.invalidEmail": "Please enter a valid email address.",
    "login.errors.tooManyRequests":
      "Too many failed login attempts. Please try again later.",
    "login.errors.userDisabled": "This account has been disabled.",
    "login.errors.default": "An error occurred during login. Please try again.",
    "login.errors.missingFields": "Please fill in all fields",
    "login.errors.googleSignIn":
      "Could not sign in with Google. Please try again.",
    "login.success.title": "Login Successful",
    "login.success.description": "Welcome back to Plants Doc!",

    // Signup Page
    "signup.title": "Create an account",
    "signup.subtitle": "Sign up for Plants Doc to start diagnosing your plants",
    "signup.name": "Full Name",
    "signup.email": "Email",
    "signup.password": "Password",
    "signup.passwordHint": "Password must be at least 8 characters long",
    "signup.terms1": "I agree to the",
    "signup.termsLink": "terms of service",
    "signup.terms2": "and",
    "signup.privacyLink": "privacy policy",
    "signup.button": "Create Account",
    "signup.loading": "Creating account...",
    "signup.haveAccount": "Already have an account?",
    "signup.signin": "Sign in",
    "signup.googleButton": "Sign up with Google",
    "signup.googleLoading": "Signing up with Google...",
    "signup.orContinue": "or continue with",

    // Signup errors and success
    "signup.errors.emailInUse":
      "This email is already registered. Try logging in instead.",
    "signup.errors.invalidEmail": "Please enter a valid email address.",
    "signup.errors.weakPassword":
      "Password is too weak. It should be at least 6 characters.",
    "signup.errors.operationNotAllowed":
      "Account creation is currently disabled.",
    "signup.errors.default":
      "An error occurred during registration. Please try again.",
    "signup.errors.missingFields": "Please fill in all fields",
    "signup.errors.termsRequired": "Please agree to the terms and conditions",
    "signup.errors.googleSignUp":
      "Could not sign up with Google. Please try again.",
    "signup.success.title": "Registration Successful",
    "signup.success.description": "Welcome to Plants Doc!",

    // Dashboard
    "dashboard.title": "Plant Health Dashboard",
    "dashboard.tab.diagnose": "Diagnose Plant",
    "dashboard.tab.history": "History",

    "dashboard.diagnose.title": "Plant Disease Diagnosis",
    "dashboard.diagnose.subtitle":
      "Upload an image of your plant to get an AI-powered diagnosis",

    "dashboard.tips.title": "Tips for Better Diagnosis",
    "dashboard.tips.forBestResults": "For best results:",
    "dashboard.tips.tip1": "Take clear, well-lit photos of affected areas",
    "dashboard.tips.tip2":
      "Include both healthy and diseased parts for comparison",
    "dashboard.tips.tip3":
      "Take multiple photos from different angles if needed",
    "dashboard.tips.tip4": "Avoid shadows or glare on the plant",
    "dashboard.tips.tip5":
      "Focus on the specific symptoms (spots, wilting, etc.)",

    "dashboard.history.title": "Diagnosis History",
    "dashboard.history.subtitle":
      "View your previous plant diagnoses and treatments",
    "dashboard.history.empty.title": "No diagnosis history yet",
    "dashboard.history.empty.description":
      "Your plant diagnosis history will appear here once you've analyzed some plants.",

    // Image Uploader
    "uploader.dragDrop": "Drag and drop your image here, or",
    "uploader.browse": "browse",
    "uploader.formats": "Supports JPG, PNG, WEBP (max 10MB)",
    "uploader.upload": "Upload Image",
    "uploader.takePhoto": "Take Photo",
    "uploader.analyzing": "Analyzing Image...",
    "uploader.different": "Upload Different Image",
    "uploader.analysisComplete": "Analysis Complete",
    "uploader.diagnosisSuccessful":
      "Your plant has been diagnosed successfully.",
    "uploader.analysisFailed": "Analysis Failed",
    "uploader.errorAnalyzing": "There was an error analyzing your plant image.",

    // Diagnosis Result
    "result.back": "Back",
    "result.confidence": "Confidence:",
    "result.diagnosis": "Diagnosis:",
    "result.treatment.tab": "Treatment",
    "result.prevention.tab": "Prevention",
    "result.treatment.title": "Recommended Treatment",
    "result.prevention.title": "Prevention Tips",
    "result.saveButton": "Save to History & Start New Diagnosis",
    "result.treatment.empty": "No recommended treatment available.",
    "result.prevention.empty": "No prevention tips available.",

    // History List
    "history.viewDetails": "View Details",
    "history.confidence": "Confidence:",
    "history.saveSuccess": "Saved to History",
    "history.saveSuccessMessage": "Diagnosis has been saved to your history",
    "history.saveError": "Save Failed",
    "history.saveErrorMessage": "Could not save diagnosis to history",
    "history.loading": "Loading history...",
    "history.error": "Error loading history",
    "history.loginRequired": "Login Required",
    "history.loginToSave": "Please login to save diagnosis to history",
    "result.saving": "Saving...",

    // Language Switcher
    "language.english": "English",
    "language.arabic": "العربية",
  },
  ar: {
    // Navigation
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",

    // Hero Section
    "hero.title1": "تشخيص ذكي",
    "hero.title2": "لأمراض النباتات",
    "hero.description":
      "استفد من قوة الذكاء الاصطناعي لتحديد أمراض النباتات، والحصول على توصيات العلاج، والحفاظ على صحة نباتاتك.",
    "hero.cta.getStarted": "ابدأ الآن",
    "hero.cta.learnMore": "اعرف المزيد",

    // Features Section
    "features.title1": "ميزات قوية",
    "features.title2": "لمحبي النباتات",
    "features.subtitle": "كل ما تحتاجه للحفاظ على نباتاتك صحية ومزدهرة.",

    "features.imageAnalysis.title": "تحليل الصور",
    "features.imageAnalysis.description":
      "قم بتحميل أو التقاط صور لنباتاتك للحصول على تشخيص فوري للأمراض بواسطة الذكاء الاصطناعي.",

    "features.treatment.title": "توصيات العلاج",
    "features.treatment.description":
      "احصل على خطط علاج مفصلة وحلول لإعادة نباتاتك إلى صحتها.",

    "features.prevention.title": "نصائح الوقاية",
    "features.prevention.description":
      "تعلم كيفية منع الأمراض والحفاظ على ظروف النمو المثلى.",

    "features.history.title": "سجل الصحة",
    "features.history.description":
      "تتبع صحة نباتك على مر الزمن ومراقبة فعالية العلاج.",

    "features.ai.title": "مدعوم بالذكاء الاصطناعي",
    "features.ai.description":
      "الاستفادة من تقنية الذكاء الاصطناعي المتقدمة للتعرف الدقيق على أمراض النباتات.",

    "features.responsive.title": "تصميم متجاوب",
    "features.responsive.description":
      "الوصول إلى Plants Doc من أي جهاز - سطح المكتب أو الجهاز اللوحي أو الهاتف المحمول.",

    // CTA Section
    "cta.title": "هل أنت مستعد لتشخيص نباتاتك؟",
    "cta.subtitle":
      "سجل اليوم وابدأ في الحفاظ على صحة نباتاتك باستخدام التشخيص المدعوم بالذكاء الاصطناعي.",
    "cta.button": "ابدأ مجانًا",

    // Footer
    "footer.about": "عن التطبيق",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "footer.contact": "اتصل بنا",
    "footer.rights": "جميع الحقوق محفوظة.",

    // Login Page
    "login.title": "مرحبًا بعودتك",
    "login.subtitle": "قم بتسجيل الدخول إلى حساب Plants Doc الخاص بك",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.forgotPassword": "نسيت كلمة المرور؟",
    "login.button": "تسجيل الدخول",
    "login.loading": "جاري تسجيل الدخول...",
    "login.noAccount": "ليس لديك حساب؟",
    "login.signup": "إنشاء حساب",
    "login.googleButton": "تسجيل الدخول باستخدام جوجل",
    "login.googleLoading": "جاري تسجيل الدخول باستخدام جوجل...",
    "login.orContinue": "أو المتابعة باستخدام",

    // Login errors and success
    "login.errors.userNotFound": "لا يوجد حساب بهذا البريد الإلكتروني.",
    "login.errors.wrongPassword":
      "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
    "login.errors.invalidEmail": "يرجى إدخال بريد إلكتروني صالح.",
    "login.errors.tooManyRequests":
      "عدد كبير من محاولات تسجيل الدخول الفاشلة. يرجى المحاولة لاحقًا.",
    "login.errors.userDisabled": "تم تعطيل هذا الحساب.",
    "login.errors.default":
      "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
    "login.errors.missingFields": "يرجى ملء جميع الحقول",
    "login.errors.googleSignIn":
      "تعذر تسجيل الدخول باستخدام جوجل. يرجى المحاولة مرة أخرى.",
    "login.success.title": "تم تسجيل الدخول بنجاح",
    "login.success.description": "مرحبًا بك مجددًا في Plants Doc!",

    // Signup Page
    "signup.title": "إنشاء حساب",
    "signup.subtitle": "سجل في Plants Doc لبدء تشخيص نباتاتك",
    "signup.name": "الاسم الكامل",
    "signup.email": "البريد الإلكتروني",
    "signup.password": "كلمة المرور",
    "signup.passwordHint": "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
    "signup.terms1": "أوافق على",
    "signup.termsLink": "شروط الخدمة",
    "signup.terms2": "و",
    "signup.privacyLink": "سياسة الخصوصية",
    "signup.button": "إنشاء حساب",
    "signup.loading": "جاري إنشاء الحساب...",
    "signup.haveAccount": "لديك حساب بالفعل؟",
    "signup.signin": "تسجيل الدخول",
    "signup.googleButton": "التسجيل باستخدام جوجل",
    "signup.googleLoading": "جاري التسجيل باستخدام جوجل...",
    "signup.orContinue": "أو المتابعة باستخدام",

    // Signup errors and success
    "signup.errors.emailInUse":
      "هذا البريد الإلكتروني مسجل بالفعل. حاول تسجيل الدخول بدلاً من ذلك.",
    "signup.errors.invalidEmail": "يرجى إدخال بريد إلكتروني صالح.",
    "signup.errors.weakPassword":
      "كلمة المرور ضعيفة جدًا. يجب أن تتكون من 6 أحرف على الأقل.",
    "signup.errors.operationNotAllowed": "إنشاء الحساب معطل حاليًا.",
    "signup.errors.default": "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
    "signup.errors.missingFields": "يرجى ملء جميع الحقول",
    "signup.errors.termsRequired": "يرجى الموافقة على الشروط والأحكام",
    "signup.errors.googleSignUp":
      "تعذر التسجيل باستخدام جوجل. يرجى المحاولة مرة أخرى.",
    "signup.success.title": "تم التسجيل بنجاح",
    "signup.success.description": "مرحبًا بك في Plants Doc!",

    // Dashboard
    "dashboard.title": "لوحة تحكم صحة النبات",
    "dashboard.tab.diagnose": "تشخيص النبات",
    "dashboard.tab.history": "السجل",

    "dashboard.diagnose.title": "تشخيص أمراض النبات",
    "dashboard.diagnose.subtitle":
      "قم بتحميل صورة لنباتك للحصول على تشخيص بواسطة الذكاء الاصطناعي",

    "dashboard.tips.title": "نصائح للتشخيص الأفضل",
    "dashboard.tips.forBestResults": "للحصول على أفضل النتائج:",
    "dashboard.tips.tip1": "التقط صورًا واضحة وجيدة الإضاءة للمناطق المتضررة",
    "dashboard.tips.tip2": "قم بتضمين الأجزاء السليمة والمريضة للمقارنة",
    "dashboard.tips.tip3": "التقط صورًا متعددة من زوايا مختلفة إذا لزم الأمر",
    "dashboard.tips.tip4": "تجنب الظلال أو الوهج على النبات",
    "dashboard.tips.tip5": "ركز على الأعراض المحددة (البقع، الذبول، إلخ)",

    "dashboard.history.title": "سجل التشخيص",
    "dashboard.history.subtitle": "عرض تشخيصات النباتات السابقة والعلاجات",
    "dashboard.history.empty.title": "لا يوجد سجل تشخيص حتى الآن",
    "dashboard.history.empty.description":
      "سيظهر سجل تشخيص النبات هنا بمجرد تحليل بعض النباتات.",

    // Image Uploader
    "uploader.dragDrop": "اسحب وأفلت الصورة هنا، أو",
    "uploader.browse": "تصفح",
    "uploader.formats": "يدعم JPG، PNG، WEBP (بحد أقصى 10 ميجابايت)",
    "uploader.upload": "تحميل صورة",
    "uploader.takePhoto": "التقاط صورة",
    "uploader.analyzing": "جاري تحليل الصورة...",
    "uploader.different": "تحميل صورة مختلفة",
    "uploader.analysisComplete": "اكتمل التحليل",
    "uploader.diagnosisSuccessful": "تم تشخيص نباتك بنجاح.",
    "uploader.analysisFailed": "فشل التحليل",
    "uploader.errorAnalyzing": "حدث خطأ أثناء تحليل صورة النبات الخاصة بك.",

    // Diagnosis Result
    "result.back": "رجوع",
    "result.confidence": "الثقة:",
    "result.diagnosis": "التشخيص:",
    "result.treatment.tab": "العلاج",
    "result.prevention.tab": "الوقاية",
    "result.treatment.title": "العلاج الموصى به",
    "result.prevention.title": "نصائح الوقاية",
    "result.saveButton": "حفظ في السجل وبدء تشخيص جديد",
    "result.treatment.empty": "لا يوجد علاج موصى به متاح.",
    "result.prevention.empty": "لا توجد نصائح وقائية متاحة.",

    // History List
    "history.viewDetails": "عرض التفاصيل",
    "history.confidence": "الثقة:",
    "history.saveSuccess": "تم الحفظ في السجل",
    "history.saveSuccessMessage": "تم حفظ التشخيص في سجلك",
    "history.saveError": "فشل الحفظ",
    "history.saveErrorMessage": "تعذر حفظ التشخيص في السجل",
    "history.loading": "جاري تحميل السجل...",
    "history.error": "خطأ في تحميل السجل",
    "history.loginRequired": "تسجيل الدخول مطلوب",
    "history.loginToSave": "يرجى تسجيل الدخول لحفظ التشخيص في السجل",
    "result.saving": "جاري الحفظ...",

    // Language Switcher
    "language.english": "English",
    "language.arabic": "العربية",
  },
};

// Create properly nested messages structure for next-intl
const createNestedMessages = () => {
  // Create empty objects for our nested structure
  const enMessages = { Index: {} };
  const arMessages = { Index: {} };

  // Convert flat keys to nested structure
  Object.entries(translations.en).forEach(([key, value]) => {
    set(enMessages.Index, key.split("."), value);
  });

  Object.entries(translations.ar || {}).forEach(([key, value]) => {
    set(arMessages.Index, key.split("."), value);
  });

  return {
    en: enMessages,
    ar: arMessages,
  };
};

// Get the properly structured messages
const nestedMessages = createNestedMessages();

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    // Split the key to navigate through the flat structure
    const keyParts = key.split(".");

    try {
      // Handle the flat structure of our translations
      // Find the direct translation using the full dot-notation key
      const translation =
        translations[language][
          key as keyof (typeof translations)[typeof language]
        ];

      if (typeof translation === "string") {
        return translation;
      }

      // If direct key lookup fails, try to navigate the nested structure
      // This is a fallback and may not be needed if all your keys are flat
      return key; // Return the key if no translation found
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key; // Return the key if anything goes wrong
    }
  };
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ t, direction, language, setLanguage }}>
      <NextIntlClientProvider
        locale={language}
        messages={nestedMessages[language]}
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
