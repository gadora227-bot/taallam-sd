// الصفحة الرئيسية: تحمّل الدورات من قاعدة البيانات وتعرض تقدّم الطالب وسلسلته.
(() => {
  "use strict";

  const { el } = window.Taallam;
  const $ = id => document.getElementById(id);

  let courses = [];
  let doneIds = new Set();
  let saved = new Set();
  let user = null;
  let activeCategory = "الكل";
  let searchTerm = "";
  let loading = false;

  const normalize = text => String(text || "").toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").trim();

  function courseStats(course) {
    const total = course.lessons.length;
    const done = course.lessons.filter(lesson => doneIds.has(lesson.id)).length;
    return { total, done, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  async function toggleSave(course) {
    if (!user) {
      window.location.href = "login.html?returnTo=index.html";
      return;
    }

    const wasSaved = saved.has(course.slug);
    if (wasSaved) saved.delete(course.slug); else saved.add(course.slug);
    render();

    const table = window.taallamSupabase.from("saved_courses");
    const { error } = wasSaved
      ? await table.delete().eq("user_id", user.id).eq("course_id", course.slug)
      : await table.upsert({ user_id: user.id, course_id: course.slug }, { onConflict: "user_id,course_id" });

    if (error) {
      if (wasSaved) saved.add(course.slug); else saved.delete(course.slug);
      render();
      alert("تعذّر حفظ التغيير. حاول مرة أخرى.");
    }
  }

  function courseCard(course) {
    const s = courseStats(course);
    const isSaved = saved.has(course.slug);

    return el("article", { class: "course" },
      el("div", { class: `course-cover ${course.cover}` },
        el("span", { class: "emoji", text: course.emoji }),
        el("span", { class: "level", text: course.level })),
      el("div", { class: "course-body" },
        el("h3", { text: course.title }),
        el("p", { text: course.description }),
        el("div", { class: "meta" },
          el("span", { text: `${s.total} دروس` }),
          course.duration ? el("span", { text: course.duration }) : null,
          el("span", { text: `أنجزت ${s.done}` })),
        el("div", { class: "course-progress" },
          el("div", { class: "course-progress-info" },
            el("span", { text: "تقدمك في الدورة" }),
            el("strong", { text: s.percent + "%" })),
          el("div", { class: "progress-track" },
            el("div", { class: "progress-fill", style: `width:${s.percent}%` }))),
        el("div", { class: "course-actions" },
          el("a", { class: "btn btn-primary", href: "course.html?c=" + encodeURIComponent(course.slug),
            text: s.done > 0 && s.done < s.total ? "تابع الدورة" : "افتح الدورة" }),
          el("button", { class: "btn btn-light save" + (isSaved ? " is-saved" : ""),
            "aria-pressed": String(isSaved), text: isSaved ? "♥ محفوظة" : "♡ حفظ",
            onclick: () => toggleSave(course) }))));
  }

  function renderCategories() {
    const categories = ["الكل", ...new Set(courses.map(course => course.category))];
    $("categories").replaceChildren(...categories.map(category =>
      el("button", { class: "chip" + (category === activeCategory ? " active" : ""),
        "aria-pressed": String(category === activeCategory), text: category,
        onclick: () => { activeCategory = category; renderCategories(); render(); } })));
  }

  function renderDashboard() {
    const totalLessons = courses.reduce((sum, course) => sum + course.lessons.length, 0);
    const done = courses.reduce((sum, course) => sum + courseStats(course).done, 0);
    const percent = totalLessons ? Math.round((done / totalLessons) * 100) : 0;

    $("courseCount").textContent = courses.length;
    $("completedCount").textContent = done;
    $("dashboardCompleted").textContent = done;
    $("dashboardSaved").textContent = [...saved].filter(slug => courses.some(c => c.slug === slug)).length;
    $("dashboardPercent").textContent = percent;
    $("progressPercent").textContent = percent;

    const current = courses.find(course => {
      const s = courseStats(course);
      return s.done > 0 && s.done < s.total;
    });

    const text = $("progressText");
    if (current) {
      const s = courseStats(current);
      text.replaceChildren(`أنجزت ${s.done} من ${s.total} في «${current.title}». `,
        el("a", { href: "course.html?c=" + encodeURIComponent(current.slug), text: "تابع من حيث وصلت" }));
    } else {
      text.textContent = "ابدأ أول درس، وسيظهر تقدمك هنا.";
    }
  }

  function render() {
    const query = normalize(searchTerm);
    const list = courses.filter(course =>
      (activeCategory === "الكل" || course.category === activeCategory) &&
      normalize(`${course.title} ${course.category} ${course.description}`).includes(query));

    $("courseGrid").replaceChildren(...(list.length
      ? list.map(courseCard)
      : [el("div", { class: "empty", text: courses.length ? "لا توجد دورات مطابقة لبحثك." : "لا توجد دورات منشورة بعد." })]));

    const savedList = courses.filter(course => saved.has(course.slug));
    $("savedCoursesGrid").replaceChildren(...(savedList.length
      ? savedList.map(courseCard)
      : [el("div", { class: "empty", text: user ? "لم تحفظ أي دورة بعد." : "سجّل الدخول لحفظ الدورات." })]));

    renderDashboard();
  }

  async function load() {
    if (loading) return;
    loading = true;

    try {
      const client = window.taallamSupabase;
      user = await window.Taallam.user();

      const coursesQuery = client.from("courses")
        .select("id,slug,title,description,category,level,emoji,cover,duration,lessons(id)")
        .eq("published", true).order("sort").order("created_at");

      const [coursesResult, progressResult, savedResult] = await Promise.all([
        coursesQuery,
        user ? client.from("lesson_progress").select("lesson_id").eq("user_id", user.id) : null,
        user ? client.from("saved_courses").select("course_id").eq("user_id", user.id) : null
      ]);

      if (coursesResult.error) throw coursesResult.error;

      courses = coursesResult.data || [];
      doneIds = new Set(((progressResult && progressResult.data) || []).map(row => row.lesson_id));
      saved = new Set(((savedResult && savedResult.data) || []).map(row => row.course_id));

      renderCategories();
      render();

      if (user) {
        const stats = await window.Taallam.loadStats();
        if (stats) window.Taallam.renderStats(stats, user.id);
      } else {
        $("todayCard").hidden = true;
      }
    } catch (error) {
      console.error("تعذّر تحميل الدورات:", error);
      $("courseGrid").replaceChildren(el("div", { class: "empty", text: "تعذّر تحميل الدورات. تحقق من الاتصال ثم أعد تحميل الصفحة." }));
    } finally {
      loading = false;
    }
  }

  async function updateAccountNav() {
    const signedIn = Boolean(await window.Taallam.user());
    $("loginNav").style.display = signedIn ? "none" : "inline-flex";
    $("profileNav").style.display = signedIn ? "inline-flex" : "none";
  }

  // البحث
  let timer = null;
  $("searchInput").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { searchTerm = $("searchInput").value.trim(); render(); }, 200);
  });
  const goSearch = () => {
    searchTerm = $("searchInput").value.trim();
    render();
    $("courses").scrollIntoView({ behavior: "smooth" });
  };
  $("searchBtn").addEventListener("click", goSearch);
  $("searchInput").addEventListener("keydown", event => { if (event.key === "Enter") goSearch(); });
  $("startLearning").addEventListener("click", () => $("courses").scrollIntoView({ behavior: "smooth" }));

  load();
  updateAccountNav();

  try {
    window.taallamSupabase.auth.onAuthStateChange(event => {
      // لا نستدعي Supabase مباشرة داخل المستمع لتجنّب التعليق.
      setTimeout(() => {
        updateAccountNav();
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") load();
      }, 0);
    });
  } catch (error) {
    console.warn("تعذّر تهيئة اتصال الحساب:", error.message);
  }
})();
