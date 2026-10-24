
"use strict";

/* =========================================
   1. بيانات الدورات والدروس
========================================= */

const courses = [
  {
    id: "english",
    title: "الإنجليزية من البداية",
    category: "اللغات",
    level: "مبتدئ",
    duration: "3 دروس قصيرة",
    emoji: "🔤",
    cover: "cover-blue",
    description: "تعرّف على التحيات والجمل اليومية الأساسية.",
    lessons: [
      {
        title: "التحيات والتعارف",
        body: "تُستخدم عبارة Hello للتحية، وGood morning في الصباح. للتعريف بنفسك قل: My name is Ahmed. وللسؤال عن الاسم: What is your name?",
        question: "ما معنى Good morning؟",
        options: ["مساء الخير", "صباح الخير", "إلى اللقاء"],
        answer: 1,
        explain: "Good morning تعني صباح الخير."
      },
      {
        title: "التعريف بالنفس",
        body: "My name is… تعني اسمي…، وI am from Sudan تعني أنا من السودان. حاول أن تقول الجمل بصوت مسموع لتتدرب على النطق.",
        question: "كيف تقول «أنا من السودان»؟",
        options: ["I am from Sudan", "You are Sudan", "I from is Sudan"],
        answer: 0,
        explain: "الصياغة الصحيحة هي I am from Sudan."
      },
      {
        title: "عبارات يومية",
        body: "Please تعني من فضلك، وThank you تعني شكراً، وExcuse me تعني عذراً أو لو سمحت حسب الموقف.",
        question: "ما العبارة المناسبة لشكر شخص؟",
        options: ["Thank you", "Good night", "Please"],
        answer: 0,
        explain: "Thank you هي عبارة الشكر."
      }
    ]
  },
  {
    id: "computer",
    title: "أساسيات الكمبيوتر",
    category: "التقنية",
    level: "مبتدئ",
    duration: "3 دروس قصيرة",
    emoji: "💻",
    cover: "cover-green",
    description: "تعرّف على مكونات الكمبيوتر والملفات ونظام التشغيل.",
    lessons: [
      {
        title: "مكونات الكمبيوتر",
        body: "يتكون الكمبيوتر من أجزاء مادية مثل الشاشة ولوحة المفاتيح والمعالج والذاكرة، وبرامج مثل نظام التشغيل والتطبيقات.",
        question: "أي مما يلي يُعد مكوناً مادياً؟",
        options: ["برنامج الرسام", "لوحة المفاتيح", "نظام التشغيل"],
        answer: 1,
        explain: "لوحة المفاتيح قطعة مادية يمكن لمسها."
      },
      {
        title: "الملفات والمجلدات",
        body: "الملف يحفظ بيانات مثل صورة أو مستند. المجلد يساعدك على تنظيم الملفات، ويمكن إنشاء مجلدات داخل مجلدات أخرى.",
        question: "ما فائدة المجلد؟",
        options: ["تنظيم الملفات", "زيادة سرعة الإنترنت دائماً", "شحن الكمبيوتر"],
        answer: 0,
        explain: "المجلدات تساعد في ترتيب الملفات والوصول إليها."
      },
      {
        title: "نظام التشغيل",
        body: "نظام التشغيل يدير موارد الجهاز ويتيح تشغيل التطبيقات. من أمثلته Windows وLinux وmacOS.",
        question: "أي مما يلي نظام تشغيل؟",
        options: ["Excel", "Windows", "لوحة المفاتيح"],
        answer: 1,
        explain: "Windows هو نظام تشغيل."
      }
    ]
  },
  {
    id: "programming",
    title: "مدخل إلى البرمجة",
    category: "التقنية",
    level: "مبتدئ",
    duration: "3 دروس قصيرة",
    emoji: "⌨️",
    cover: "cover-purple",
    description: "افهم فكرة البرمجة والمتغيرات والمنطق بطريقة مبسطة.",
    lessons: [
      {
        title: "ما هي البرمجة؟",
        body: "البرمجة هي كتابة تعليمات يفهمها الكمبيوتر لتنفيذ مهمة. تُستخدم لغات مثل Python وJavaScript لبناء البرامج والمواقع.",
        question: "ما المقصود بالبرمجة؟",
        options: ["كتابة تعليمات للكمبيوتر", "تنظيف الشاشة", "تغيير لون الجهاز فقط"],
        answer: 0,
        explain: "البرمجة تعني كتابة تعليمات لتنفيذ مهام."
      },
      {
        title: "المتغيرات",
        body: "المتغير اسم نستخدمه للاحتفاظ بقيمة. في Python يمكن كتابة: age = 20 لتخزين الرقم 20 في متغير اسمه age.",
        question: "في age = 20، ما القيمة المخزنة؟",
        options: ["age", "20", "="],
        answer: 1,
        explain: "القيمة المخزنة هي 20."
      },
      {
        title: "الشروط",
        body: "تسمح جملة if بتنفيذ تعليمات عندما يتحقق شرط. مثال: if score >= 50: ثم نعرض نتيجة النجاح.",
        question: "ما وظيفة if غالباً؟",
        options: ["تنفيذ تعليمات عند تحقق شرط", "حذف كل الملفات", "إغلاق الإنترنت"],
        answer: 0,
        explain: "if تختبر شرطاً وتحدد ما إذا كانت التعليمات ستنفذ."
      }
    ]
  },
  {
    id: "math",
    title: "الرياضيات اليومية",
    category: "المدرسة",
    level: "مبتدئ",
    duration: "3 دروس قصيرة",
    emoji: "➗",
    cover: "cover-orange",
    description: "راجع النسب المئوية والكسور والحسابات الأساسية.",
    lessons: [
      {
        title: "النسبة المئوية",
        body: "النسبة المئوية تعني جزءاً من مئة. لحساب 20% من 150، نحول 20% إلى 0.2 ثم نضرب: 150 × 0.2 = 30.",
        question: "كم تساوي 10% من 200؟",
        options: ["10", "20", "40"],
        answer: 1,
        explain: "10% من 200 تساوي 20."
      },
      {
        title: "الكسور",
        body: "الكسر يتكون من بسط ومقام. في الكسر 3/4، العدد 3 هو البسط والعدد 4 هو المقام.",
        question: "في الكسر 2/5، ما المقام؟",
        options: ["2", "5", "7"],
        answer: 1,
        explain: "المقام هو العدد السفلي، وهو 5."
      },
      {
        title: "المتوسط الحسابي",
        body: "لحساب المتوسط الحسابي، اجمع القيم ثم اقسم الناتج على عددها. متوسط 4 و6 و8 هو (4+6+8) ÷ 3 = 6.",
        question: "ما متوسط 2 و4 و6؟",
        options: ["3", "4", "6"],
        answer: 1,
        explain: "مجموع الأعداد 12، ونقسمه على 3 فيكون المتوسط 4."
      }
    ]
  },
  {
    id: "career",
    title: "الاستعداد لسوق العمل",
    category: "المهارات",
    level: "مبتدئ",
    duration: "3 دروس قصيرة",
    emoji: "🧭",
    cover: "cover-red",
    description: "تعلّم أساسيات السيرة الذاتية والمقابلات والتواصل المهني.",
    lessons: [
      {
        title: "السيرة الذاتية",
        body: "اجعل السيرة الذاتية واضحة ومختصرة، واذكر بيانات التواصل والتعليم والمهارات والخبرات ذات الصلة. لا تضف مهارات أو خبرات غير حقيقية.",
        question: "ما الأفضل في السيرة الذاتية؟",
        options: ["معلومات واضحة وصادقة", "إضافة خبرات غير حقيقية", "كتابة كل شيء دون ترتيب"],
        answer: 0,
        explain: "الوضوح والصدق والارتباط بالوظيفة عوامل مهمة."
      },
      {
        title: "التحضير للمقابلة",
        body: "اقرأ عن جهة العمل والوظيفة، حضّر أمثلة حقيقية من دراستك أو عملك، وتمرّن على تقديم نفسك بإيجاز.",
        question: "ماذا تفعل قبل المقابلة؟",
        options: ["تتجاهل وصف الوظيفة", "تبحث عن جهة العمل وتتمرن", "تصل دون استعداد"],
        answer: 1,
        explain: "الاستعداد يساعدك على تقديم إجابات أفضل."
      },
      {
        title: "التواصل المهني",
        body: "استخدم لغة محترمة وواضحة، استمع جيداً، واسأل أسئلة مرتبطة بالمهمة. أعد صياغة المطلوب إذا احتجت إلى التأكد من فهمه.",
        question: "ما الذي يساعد على التواصل الجيد؟",
        options: ["المقاطعة المستمرة", "الاستماع والتوضيح", "تجاهل التعليمات"],
        answer: 1,
        explain: "الاستماع وطرح الأسئلة المناسبة يحسنان التواصل."
      }
    ]
  },
  {
    id: "safety",
    title: "السلامة الرقمية",
    category: "التقنية",
    level: "مبتدئ",
    duration: "3 دروس قصيرة",
    emoji: "🔐",
    cover: "cover-teal",
    description: "تعلّم كلمات المرور القوية والتعرف على رسائل الاحتيال.",
    lessons: [
      {
        title: "كلمات المرور",
        body: "استخدم كلمة مرور طويلة وفريدة لكل حساب، ويفضل استخدام مدير كلمات مرور موثوق وتفعيل التحقق بخطوتين عند توفره.",
        question: "ما الخيار الأكثر أماناً؟",
        options: ["كلمة واحدة لكل الحسابات", "كلمة طويلة وفريدة لكل حساب", "كتابة كلمة المرور في منشور عام"],
        answer: 1,
        explain: "كلمات المرور الفريدة تقلل أثر اختراق حساب واحد."
      },
      {
        title: "رسائل الاحتيال",
        body: "احذر الرسائل التي تستعجلك أو تطلب بيانات سرية أو تضغط عليك لفتح رابط. تحقق من عنوان المرسل وافتح الموقع الرسمي بنفسك.",
        question: "وصلتك رسالة تطلب كلمة المرور عبر رابط، ماذا تفعل؟",
        options: ["تدخلها فوراً", "ترسلها لصديق", "لا تضغط وتتحقق من المصدر الرسمي"],
        answer: 2,
        explain: "لا تدخل بياناتك عبر رابط مشبوه؛ تحقق من المصدر الرسمي."
      },
      {
        title: "التحقق بخطوتين",
        body: "التحقق بخطوتين يضيف خطوة أخرى لتأكيد هويتك بجانب كلمة المرور، مثل تطبيق مصادقة أو مفتاح أمان.",
        question: "ما فائدة التحقق بخطوتين؟",
        options: ["طبقة حماية إضافية", "يجعل كلمة المرور عامة", "يلغي الحاجة إلى تحديث التطبيقات"],
        answer: 0,
        explain: "يضيف طبقة حماية إذا انكشفت كلمة المرور."
      }
    ]
  }
];

/* =========================================
   2. الحالة العامة
========================================= */

const categories = [
  "الكل",
  ...new Set(courses.map(course => course.category))
];

let activeCategory = "الكل";
let searchTerm = "";
let currentCourse = null;
let currentLessonIndex = 0;
let quizAnswered = false;
let quizCorrect = false;

const $ = id => document.getElementById(id);

// توحيد النص العربي للبحث: إزالة التشكيل والتطويل وتوحيد الهمزات.
function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

function getStudentName(user) {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.fullName ||
    user.email?.split("@")[0] ||
    "Student"
  );
}

let taallamClient = null;
let progressLoading = false;
let progressPromise = null;
/* =========================================
   3. الاتصال بـ Supabase
========================================= */

function getTaallamClient() {
  if (window.taallamSupabase) {
    return window.taallamSupabase;
  }

  if (
    typeof supabase === "undefined" ||
    typeof SUPABASE_URL !== "string" ||
    typeof SUPABASE_PUBLISHABLE_KEY !== "string" ||
    !SUPABASE_URL.startsWith("https://") ||
    !SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_")
  ) {
    throw new Error("تعذّر تحميل إعدادات Supabase. تحقق من config.js.");
  }

  taallamClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  window.taallamSupabase = taallamClient;
  return taallamClient;
}

async function getSignedInUser() {
  try {
    const client = getTaallamClient();
    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    return data.session?.user || null;
  } catch (error) {
    console.error("تعذّر التحقق من تسجيل الدخول:", error.message);
    return null;
  }
}

async function taallamHasSignedInUser() {
  return Boolean(await getSignedInUser());
}

/* =========================================
   4. الحفظ المحلي
========================================= */

function readSet(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(data) ? data : []);
  } catch (error) {
    return new Set();
  }
}

let completed = readSet("ts_completed");
let saved = readSet("ts_saved");

// نربط البيانات المحلية بصاحب الحساب حتى لا يرى مستخدمٌ تقدّم مستخدم آخر على نفس الجهاز.
function resetLocalLearningData() {
  completed = new Set();
  saved = new Set();

  try {
    localStorage.removeItem("ts_completed");
    localStorage.removeItem("ts_saved");
    localStorage.removeItem("ts_owner");
  } catch (error) {
    console.warn("تعذّر مسح البيانات المحلية.", error);
  }
}

function getLocalOwner() {
  try {
    return localStorage.getItem("ts_owner");
  } catch (error) {
    return null;
  }
}

function setLocalOwner(userId) {
  try {
    localStorage.setItem("ts_owner", userId);
  } catch (error) {
    console.warn("تعذّر حفظ مالك البيانات المحلية.", error);
  }
}

function getValidCompleted() {
  return [...completed].filter(key => {
    const separator = key.lastIndexOf("-");
    if (separator < 0) return false;

    const courseId = key.slice(0, separator);
    const lessonIndex = Number(key.slice(separator + 1));
    const course = courses.find(item => item.id === courseId);

    return Boolean(
      course &&
      Number.isInteger(lessonIndex) &&
      lessonIndex >= 0 &&
      lessonIndex < course.lessons.length
    );
  });
}

function getCourseCompletedCount(course) {
  let count = 0;

  // نحسب الدروس المكتملة المتتالية فقط.
  while (
    count < course.lessons.length &&
    completed.has(`${course.id}-${count}`)
  ) {
    count++;
  }

  return count;
}

function store() {
  try {
    localStorage.setItem(
      "ts_completed",
      JSON.stringify(getValidCompleted())
    );

    localStorage.setItem(
      "ts_saved",
      JSON.stringify([...saved])
    );
  } catch (error) {
    console.warn("تعذّر حفظ البيانات في المتصفح.", error);
  }

  updateProgress();
}

/* =========================================
   5. حفظ التقدّم في Supabase
========================================= */

async function saveCourseProgress(course) {
  try {
    const client = getTaallamClient();
    const user = await getSignedInUser();

    // الزائر يحتفظ بتقدّمه محليًا.
    if (!user) return;

    const count = getCourseCompletedCount(course);

    const record = {
      user_id: user.id,
      course_id: course.id,
      completed_lessons: count,
      is_completed: count === course.lessons.length,
      updated_at: new Date().toISOString()
    };

    const { data: existing, error: findError } = await client
      .from("student_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .limit(1);

    if (findError) throw findError;

    if (existing && existing.length > 0) {
      const { error } = await client
        .from("student_progress")
        .update(record)
        .eq("id", existing[0].id)
        .eq("user_id", user.id);

      if (error) throw error;
    } else {
      const { error } = await client
        .from("student_progress")
        .insert(record);

      if (error) throw error;
    }
  } catch (error) {
    console.error(
      "تعذّر حفظ تقدّم الدورة في Supabase:",
      error.message
    );
  }
}

/* =========================================
   6. استعادة التقدّم عند تسجيل الدخول
========================================= */

function loadStudentProgress() {
  if (progressPromise) {
    return progressPromise;
  }

  progressPromise = loadStudentProgressInternal().finally(() => {
    progressPromise = null;
  });

  return progressPromise;
}

async function loadStudentProgressInternal() {
  progressLoading = true;

  try {
    const client = getTaallamClient();
    const user = await getSignedInUser();

    if (!user) {
      // زائر: لا نُبقي بيانات حساب سابق على الجهاز.
      if (getLocalOwner()) {
        resetLocalLearningData();
        renderCourses();
      }
      return;
    }

    // حساب مختلف عن صاحب البيانات المحلية: نبدأ نظيفين.
    const owner = getLocalOwner();
    if (owner && owner !== user.id) {
      resetLocalLearningData();
    }
    setLocalOwner(user.id);

    const [progressResult, savedResult] = await Promise.all([
      client
        .from("student_progress")
        .select("course_id, completed_lessons")
        .eq("user_id", user.id),
      client
        .from("saved_courses")
        .select("course_id")
        .eq("user_id", user.id)
    ]);

    if (progressResult.error) throw progressResult.error;

    // قد توجد أكثر من صف للدورة نفسها، فنأخذ الأكبر.
    const cloudCounts = new Map();
    (progressResult.data || []).forEach(row => {
      const value = Number(row.completed_lessons) || 0;
      cloudCounts.set(
        row.course_id,
        Math.max(cloudCounts.get(row.course_id) || 0, value)
      );
    });

    const coursesToPush = [];

    for (const course of courses) {
      const cloudCount = Math.max(
        0,
        Math.min(course.lessons.length, cloudCounts.get(course.id) || 0)
      );
      const localCount = getCourseCompletedCount(course);

      // لا نفقد التقدّم المحلي أو السحابي الأبعد.
      const count = Math.max(cloudCount, localCount);

      for (let i = 0; i < course.lessons.length; i++) {
        completed.delete(`${course.id}-${i}`);
        if (i < count) completed.add(`${course.id}-${i}`);
      }

      // نرسل للسحابة فقط ما تقدّم عليها.
      if (localCount > cloudCount) coursesToPush.push(course);
    }

    // الدورات المحفوظة: السحابة هي المرجع.
    if (!savedResult.error) {
      saved = new Set(
        (savedResult.data || [])
          .map(row => row.course_id)
          .filter(id => courses.some(course => course.id === id))
      );
    } else {
      console.warn("تعذّر تحميل الدورات المحفوظة:", savedResult.error.message);
    }

    store();
    renderCourses();

    await Promise.all(coursesToPush.map(saveCourseProgress));

    // استعادة الدرس المطلوب بعد التسجيل أو تسجيل الدخول.
    let pendingCourse = null;
    let pendingLesson = null;

    try {
      pendingCourse = localStorage.getItem("taallam_pending_course");
      pendingLesson = localStorage.getItem("taallam_pending_lesson");
    } catch (error) {
      console.warn("تعذّرت قراءة وجهة الدرس المحفوظة.");
    }

    if (pendingCourse && pendingLesson !== null) {
      const lessonIndex = Number(pendingLesson);
      const course = courses.find(item => item.id === pendingCourse);

      if (
        course &&
        Number.isInteger(lessonIndex) &&
        lessonIndex >= 0 &&
        lessonIndex < course.lessons.length
      ) {
        localStorage.removeItem("taallam_pending_course");
        localStorage.removeItem("taallam_pending_lesson");

        currentCourse = course;
        currentLessonIndex = lessonIndex;

        showLesson();

        $("lessonModal").classList.add("show");
        document.body.style.overflow = "hidden";
      }
    }
  } catch (error) {
    console.error("تعذّر تحميل تقدّم الطالب:", error.message);
  } finally {
    progressLoading = false;
  }
}

/* =========================================
   7. تحديث مؤشرات التقدّم
========================================= */

function updateProgress() {
  const total = courses.reduce(
    (count, course) => count + course.lessons.length,
    0
  );

  const validCompleted = getValidCompleted();
  const percent = total
    ? Math.round(validCompleted.length / total * 100)
    : 0;

  if ($("completedCount")) {
    $("completedCount").textContent = validCompleted.length;
  }

  if ($("progressPercent")) {
    $("progressPercent").textContent = percent;
  }

  if ($("progressText")) {
    $("progressText").textContent = validCompleted.length
      ? `أكملت ${validCompleted.length} من ${total} درساً. أحسنت، واصل التقدم!`
      : "ابدأ أول درس، وسيظهر تقدمك هنا.";
  }

  if ($("dashboardCompleted")) {
    $("dashboardCompleted").textContent = validCompleted.length;
  }

  if ($("dashboardSaved")) {
    $("dashboardSaved").textContent = saved.size;
  }

  if ($("dashboardPercent")) {
    $("dashboardPercent").textContent = percent;
  }
}

/* =========================================
   8. عرض التصنيفات
========================================= */

function renderCategories() {
  $("categories").innerHTML = categories.map(category =>
    `<button class="chip ${category === activeCategory ? "active" : ""}"
      aria-pressed="${category === activeCategory}"
      data-cat="${category}">${category}</button>`
  ).join("");

  $("categories").querySelectorAll("button").forEach(button => {
    button.onclick = () => {
      activeCategory = button.dataset.cat;
      renderCategories();
      renderCourses();
    };
  });
}

/* =========================================
   9. بطاقة الدورة
========================================= */

function courseCard(course) {
  const done = getCourseCompletedCount(course);

  const percent = Math.round(
    done / course.lessons.length * 100
  );

  const isSaved = saved.has(course.id);

  return `
    <article class="course">
      <div class="course-cover ${course.cover}">
        <span class="emoji">${course.emoji}</span>
        <span class="level">${course.level}</span>
      </div>

      <div class="course-body">
        <h3>${course.title}</h3>
        <p>${course.description}</p>

        <div class="meta">
          <span>📖 ${course.duration}</span>
          <span>✓ ${done}/${course.lessons.length} درس</span>
        </div>

        <div class="course-progress">
          <div class="course-progress-info">
            <span>تقدمك في الدورة</span>
            <strong>${percent}%</strong>
          </div>

          <div class="progress-track"
            role="progressbar"
            aria-label="نسبة إنجاز ${course.title}"
            aria-valuenow="${percent}"
            aria-valuemin="0"
            aria-valuemax="100">
            <div class="progress-fill"
              style="width:${percent}%"></div>
          </div>
        </div>

        <div class="course-actions">
          <button class="btn btn-primary"
            data-open="${course.id}">
            افتح الدورة
          </button>

          <button class="btn save ${isSaved ? "is-saved" : ""}"
            data-save="${course.id}"
            aria-pressed="${isSaved}">
            ${isSaved ? "♥ محفوظة" : "♡ حفظ"}
          </button>
        </div>
      </div>
    </article>
  `;
}


function bindCourseButtons(container) {
  container.querySelectorAll("[data-open]").forEach(button => {
    button.onclick = () => openCourse(button.dataset.open);
  });

  container.querySelectorAll("[data-save]").forEach(button => {
    button.onclick = async () => {
      const id = button.dataset.save;
      const wasSaved = saved.has(id);

      button.disabled = true;

      try {
        const client = getTaallamClient();

        // التحقق من تسجيل دخول المستخدم
        const { data, error: userError } =
          await client.auth.getUser();

        if (userError) throw userError;

        if (!data.user) {
          alert("سجّل الدخول أولاً لحفظ الدورات في حسابك.");
          window.location.href = "login.html";
          return;
        }

        const userId = data.user.id;

        if (wasSaved) {
          // إزالة الدورة من قاعدة البيانات
          const { error } = await client
            .from("saved_courses")
            .delete()
            .eq("user_id", userId)
            .eq("course_id", id);

          if (error) throw error;

          saved.delete(id);
        } else {
          // حفظ الدورة في قاعدة البيانات
          const { error } = await client
            .from("saved_courses")
            .upsert(
              {
                user_id: userId,
                course_id: id
              },
              {
                onConflict: "user_id,course_id"
              }
            );

          if (error) throw error;

          saved.add(id);
        }

        // تحديث التخزين المحلي وعرض الدورات
        store();
        renderCourses();

      } catch (error) {
        console.error("تفاصيل خطأ حفظ الدورة:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          status: error?.status
        });

        alert("تعذّر حفظ الدورة. تأكد من الاتصال وحاول مرة أخرى.");

      } finally {
        button.disabled = false;
      }
    };
  });
}

/* =========================================
   10. عرض الدورات والدورات المحفوظة
========================================= */

function renderCourses() {
  const query = normalizeText(searchTerm);

  const list = courses.filter(course =>
    (
      activeCategory === "الكل" ||
      course.category === activeCategory
    ) &&
    normalizeText(
      `${course.title} ${course.category} ${course.description}`
    ).includes(query)
  );

  if ($("courseCount")) {
    $("courseCount").textContent = courses.length;
  }

  if (!list.length) {
    $("courseGrid").innerHTML =
      '<div class="empty">ما لقينا دورة مطابقة. جرّب كلمة بحث مختلفة.</div>';
  } else {
    $("courseGrid").innerHTML = list.map(courseCard).join("");
    bindCourseButtons($("courseGrid"));
  }

  renderSavedCourses();
  updateProgress();
}

function renderSavedCourses() {
  const savedCourses = courses.filter(course =>
    saved.has(course.id)
  );

  if (!$("savedCoursesGrid")) return;

  if (!savedCourses.length) {
    $("savedCoursesGrid").innerHTML =
      '<div class="empty">ما حفظت أي دورة لحد الآن. اضغط «حفظ» على الدورة التي تعجبك.</div>';
    return;
  }

  $("savedCoursesGrid").innerHTML =
    savedCourses.map(courseCard).join("");

  bindCourseButtons($("savedCoursesGrid"));
}

/* =========================================
   11. تسجيل الدخول مطلوب للدروس التالية
========================================= */

function showRegistrationRequired() {
  $("modalContent").innerHTML = `
    <div class="lesson-content">
      <h3>واصل رحلتك التعليمية 🔐</h3>

      <p>
        يمكنك تجربة الدرس الأول مجانًا.
        لإنهاء بقية الدروس، أنشئ حسابًا أو سجّل الدخول.
      </p>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
        <a class="btn btn-primary" href="signup.html">
          إنشاء حساب جديد
        </a>

        <button class="btn btn-light"
          id="loginFromLesson"
          type="button">
          تسجيل الدخول
        </button>
      </div>
    </div>
  `;

  $("loginFromLesson").onclick = () => {
    window.location.href = "login.html";
  };
}

/* =========================================
   12. فتح الدورة
========================================= */

function openCourse(id) {
  currentCourse = courses.find(course => course.id === id);

  if (!currentCourse) return;

  // نفتح أول درس غير مكتمل متتالٍ، وإلا نبدأ من الأول.
  currentLessonIndex = getCourseCompletedCount(currentCourse);

  if (currentLessonIndex >= currentCourse.lessons.length) {
    currentLessonIndex = currentCourse.lessons.length - 1;
  }



  showLesson();

  $("lessonModal").classList.add("show");
  document.body.style.overflow = "hidden";
  $("closeModal").focus();
}

/* =========================================
   13. عرض الدرس والاختبار
========================================= */

function showQuizWarning(text) {
  const feedback = $("quizFeedback");
  if (!feedback) return;

  feedback.textContent = text;
  feedback.style.color = "#b54732";
}

function showLesson() {
  if (!currentCourse) return;

  const lesson = currentCourse.lessons[currentLessonIndex];
  if (!lesson) return;

  quizAnswered = false;
  quizCorrect = false;

  const course = currentCourse;
  const key = `${course.id}-${currentLessonIndex}`;
  const isDone = completed.has(key);

  $("modalTitle").textContent = course.title;

  $("modalContent").innerHTML = `
    <div class="meta">
      <span>
        الدرس ${currentLessonIndex + 1}
        من ${course.lessons.length}
      </span>
      <span>${isDone ? "✓ مكتمل" : "درس جديد"}</span>
    </div>

    <div class="lesson-content">
      <h3>${lesson.title}</h3>
      <p>${lesson.body}</p>
    </div>

    <h3>اختبر فهمك</h3>
    <p>${lesson.question}</p>

    <div id="quizOptions">
      ${lesson.options.map((option, index) => `
        <button class="quiz-option"
          data-answer="${index}">
          ${option}
        </button>
      `).join("")}
    </div>

    <p id="quizFeedback" aria-live="polite"></p>

    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:18px">
      <button class="btn btn-light" id="markDone">
        ${isDone ? "تم إكمال الدرس ✓" : "وضع علامة مكتمل"}
      </button>

      <button class="btn btn-primary" id="nextLesson">
        ${currentLessonIndex === course.lessons.length - 1
          ? "إنهاء الدورة"
          : "الدرس التالي ←"}
      </button>
    </div>
  `;

  $("quizOptions").querySelectorAll("button").forEach(button => {
    button.onclick = () => answerQuiz(Number(button.dataset.answer));
  });

  $("markDone").onclick = async () => {
    if (!quizCorrect && !completed.has(key)) {
      showQuizWarning("أجب عن الاختبار إجابة صحيحة أولاً لإكمال الدرس.");
      return;
    }

    $("markDone").disabled = true;

    completed.add(key);
    store();

    await saveCourseProgress(course);
    showLesson();
  };

  $("nextLesson").onclick = async () => {
    const nextIndex = currentLessonIndex + 1;
    const hasNext = nextIndex < course.lessons.length;

    // لا نسمح بتجاوز الاختبار، إلا إذا كان الدرس مكتملًا مسبقًا.
    if (!quizCorrect && !completed.has(key)) {
      showQuizWarning("أجب عن الاختبار إجابة صحيحة أولاً للمتابعة.");
      return;
    }

    $("nextLesson").disabled = true;

    // نسجّل الدرس الحالي أولاً (حتى للزائر)، فهو درس مجاني اجتازه.
    completed.add(key);
    store();

    // الدرس الأول مجاني، أما الدروس التالية فتتطلب تسجيل الدخول.
    if (hasNext) {
      const signedIn = await taallamHasSignedInUser();

      if (!signedIn) {
        try {
          localStorage.setItem("taallam_pending_course", course.id);
          localStorage.setItem("taallam_pending_lesson", String(nextIndex));
        } catch (error) {
          console.warn("تعذّر حفظ وجهة الدرس مؤقتًا.");
        }

        showRegistrationRequired();
        return;
      }
    }

    await saveCourseProgress(course);

    if (hasNext) {
      currentLessonIndex = nextIndex;
      showLesson();
      return;
    }

    showCourseCompleted(course);
  };
}

/* =========================================
   13-ب. إتمام الدورة وإصدار الشهادة
========================================= */

function showCourseCompleted(course) {
  $("modalContent").innerHTML = `
    <div style="text-align:center;padding:25px">
      <div style="font-size:48px">🎉</div>
      <h2>أحسنت! أكملت الدورة بنجاح</h2>
      <p>تهانينا على إتمام جميع دروس الدورة.</p>
      <p>يمكنك الآن عرض شهادتك وطباعتها أو حفظها PDF.</p>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
      <button class="btn btn-primary" id="printCertificate">
        عرض الشهادة
      </button>

      <button class="btn btn-light" id="backCourses">
        العودة إلى الدورات
      </button>
    </div>
  `;

  $("printCertificate").onclick = () => issueCertificate(course);
  $("backCourses").onclick = closeModal;
}

async function issueCertificate(course) {
  const button = $("printCertificate");
  let certificateWindow = null;

  if (button) button.disabled = true;

  try {
    // نفتح النافذة مباشرة حتى لا يمنعها المتصفح.
    certificateWindow = window.open("about:blank", "_blank");

    const client = getTaallamClient();
    const { data, error } = await client.auth.getUser();

    if (error) throw error;

    if (!data.user) {
      if (certificateWindow) certificateWindow.close();
      alert("يرجى تسجيل الدخول أولاً.");
      window.location.href = "login.html";
      return;
    }

    const allLessonsCompleted = course.lessons.every(
      (_, index) => completed.has(`${course.id}-${index}`)
    );

    if (!allLessonsCompleted) {
      if (certificateWindow) certificateWindow.close();
      alert("أكمل جميع دروس الدورة أولاً.");
      return;
    }

    const user = data.user;

    // نحفظ الشهادة في قاعدة البيانات؛ صفحة الشهادة تقرأها من هناك.
    const { error: saveError } = await client
      .from("certificates")
      .upsert(
        {
          user_id: user.id,
          course_id: course.id,
          course_title: course.title,
          student_name: getStudentName(user)
        },
        { onConflict: "user_id,course_id" }
      );

    if (saveError) throw saveError;

    const certificateUrl = new URL("certificate.html", window.location.href);
    certificateUrl.searchParams.set("course", course.id);

    if (certificateWindow) {
      certificateWindow.location.href = certificateUrl.href;
    } else {
      window.location.href = certificateUrl.href;
    }
  } catch (error) {
    console.error("خطأ إصدار الشهادة:", error);

    if (certificateWindow && !certificateWindow.closed) {
      certificateWindow.close();
    }

    alert(
      "تعذّر إصدار الشهادة وحفظها: " +
      (error.message || "خطأ غير معروف")
    );
  } finally {
    if (button) button.disabled = false;
  }
}

/* =========================================
   14. تصحيح الإجابة
========================================= */

function answerQuiz(index) {
  if (quizAnswered) return;

  const lesson = currentCourse.lessons[currentLessonIndex];
  const buttons = [...$("quizOptions").querySelectorAll("button")];

  if (index !== lesson.answer) {
    // إجابة خاطئة: نعطّل الخيار الخاطئ ونسمح بالمحاولة مرة أخرى.
    buttons[index].classList.add("wrong");
    buttons[index].disabled = true;

    $("quizFeedback").textContent =
      "ليست الإجابة الصحيحة. حاول مرة أخرى.";
    $("quizFeedback").style.color = "#b54732";
    return;
  }

  quizAnswered = true;
  quizCorrect = true;

  buttons.forEach((button, i) => {
    if (i === lesson.answer) button.classList.add("correct");
    button.disabled = true;
  });

  $("quizFeedback").textContent = "إجابة صحيحة! " + lesson.explain;
  $("quizFeedback").style.color = "#087f5b";
}

/* =========================================
   15. إغلاق نافذة الدرس
========================================= */

function closeModal() {
  $("lessonModal").classList.remove("show");
  document.body.style.overflow = "";

  renderCourses();
  updateProgress();
}

$("closeModal").onclick = closeModal;

$("lessonModal").onclick = event => {
  if (event.target === $("lessonModal")) {
    closeModal();
  }
};

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    $("lessonModal").classList.contains("show")
  ) {
    closeModal();
  }
});

/* =========================================
   16. البحث
========================================= */

function doSearch() {
  searchTerm = $("searchInput").value.trim();

  renderCourses();

  $("courses").scrollIntoView({
    behavior: "smooth"
  });
}

$("searchBtn").onclick = doSearch;

// بحث فوري أثناء الكتابة دون تمرير الصفحة.
let searchTimer = null;

$("searchInput").addEventListener("input", () => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    searchTerm = $("searchInput").value.trim();
    renderCourses();
  }, 200);
});

$("searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    doSearch();
  }
});

/* =========================================
   17. تشغيل الموقع
========================================= */

renderCategories();
renderCourses();
updateProgress();

// تحميل التقدّم المحفوظ للحساب الحالي.
loadStudentProgress();

async function updateAccountNav() {
  const loginButton = document.getElementById("loginNav");
  const profileButton = document.getElementById("profileNav");

  if (!loginButton || !profileButton) return;

  const signedIn = await taallamHasSignedInUser();

  loginButton.style.display = signedIn ? "none" : "inline-flex";
  profileButton.style.display = signedIn ? "inline-flex" : "none";
}

updateAccountNav();

// مستمع واحد لتغيّر حالة الحساب.
try {
  getTaallamClient().auth.onAuthStateChange(event => {
    // لا نستدعي Supabase مباشرة داخل المستمع، لتجنّب التعليق.
    setTimeout(() => {
      updateAccountNav();

      if (event === "SIGNED_IN") {
        loadStudentProgress();
      }

      if (event === "SIGNED_OUT") {
        resetLocalLearningData();
        renderCourses();
      }
    }, 0);
  });
} catch (error) {
  console.warn(
    "الموقع يعمل محليًا، لكن تعذّر تهيئة اتصال الحساب:",
    error.message
  );
}

/* فتح الدورة المطلوبة عند الانتقال من الملف الشخصي */

const pageParams = new URLSearchParams(window.location.search);
const requestedCourseId = pageParams.get("course");


if (requestedCourseId) {
  const courseExists = courses.some(
    course => course.id === requestedCourseId
  );

  if (courseExists && !$("lessonModal").classList.contains("show")) {
    loadStudentProgress().then(() => {
      if (!$("lessonModal").classList.contains("show")) {
        openCourse(requestedCourseId);
      }
    });
  }
}
