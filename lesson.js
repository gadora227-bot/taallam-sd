// مشغّل الدرس: عرض الكتل، أسئلة متعددة، تصحيح من الخادم، تقدّم وسلسلة.
(() => {
  "use strict";

  const T = window.Taallam;
  const { el } = T;
  const view = document.getElementById("lessonView");
  const sideList = document.getElementById("sideList");

  let user = null;
  let course = null;
  let lessons = [];
  let done = new Set();

  const lessonUrl = lesson => `lesson.html?c=${encodeURIComponent(course.slug)}&l=${lesson.id}`;
  const returnTo = () => encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search);

  function toast(text) {
    const node = el("div", { class: "toast", role: "status", text });
    document.body.append(node);
    setTimeout(() => node.remove(), 5000);
  }

  function renderSide(currentId) {
    sideList.replaceChildren(...lessons.map((lesson, index) => {
      const isDone = done.has(lesson.id);
      const locked = !user && lesson.position > 0;
      return el("li", {}, el("a", {
        class: "lesson-row" + (isDone ? " done" : "") + (locked ? " locked" : "") + (lesson.id === currentId ? " current" : ""),
        href: lessonUrl(lesson), "aria-current": lesson.id === currentId ? "page" : false },
        el("span", { class: "lesson-num", text: isDone ? "✓" : String(index + 1) }),
        el("span", { class: "lesson-title", text: lesson.title })));
    }));
  }

  function gate(current) {
    view.replaceChildren(
      el("h1", { text: current.title }),
      el("div", { class: "gate" },
        el("h2", { text: "سجّل حسابًا مجانيًا لمتابعة التعلّم" }),
        el("p", { text: "الدرس الأول مجاني للجميع. أنشئ حسابًا لتفتح بقية الدروس ويُحفظ تقدّمك وسلسلتك." }),
        el("div", { class: "course-hero-actions", style: "justify-content:center" },
          el("a", { class: "btn btn-primary", href: "signup.html", text: "إنشاء حساب" }),
          el("a", { class: "btn btn-light", href: "login.html?returnTo=" + returnTo(), text: "لدي حساب" }))));
  }

  function buildQuiz(questions, current, index, content) {
    const form = el("form", { class: "quiz", novalidate: "" });
    const fieldsets = questions.map((question, qi) => {
      const set = el("fieldset", { class: "question" }, el("legend", { text: `${qi + 1}. ${question.q}` }));
      (question.options || []).forEach((option, oi) => set.append(
        el("label", { class: "option" },
          el("input", { type: "radio", name: "q" + qi, value: String(oi) }),
          el("span", { text: option }))));
      set.append(el("p", { class: "explain", hidden: "" }));
      form.append(set);
      return set;
    });

    const result = el("div", { role: "status", "aria-live": "polite" });
    const button = el("button", { class: "btn btn-primary", type: "submit",
      text: questions.length ? "تحقق من الإجابات" : "إكمال الدرس" });
    form.append(result, button);

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const answers = questions.map((_, qi) => {
        const checked = form.querySelector(`input[name="q${qi}"]:checked`);
        return checked ? Number(checked.value) : -1;
      });

      if (answers.includes(-1)) {
        result.replaceChildren(el("div", { class: "result info", text: "أجب عن كل الأسئلة أولاً." }));
        return;
      }

      button.disabled = true;

      try {
        const before = user ? await T.loadStats() : null;
        const { data, error } = await T.client().rpc("submit_lesson", { p_lesson: current.id, p_answers: answers });
        if (error) throw error;

        fieldsets.forEach((set, qi) => {
          set.classList.toggle("ok", Boolean(data.results[qi]));
          set.classList.toggle("bad", !data.results[qi]);
        });

        if (!data.passed) {
          result.replaceChildren(el("div", { class: "result fail",
            text: `${data.correct} من ${data.total} إجابات صحيحة. راجع الأسئلة المظلّلة بالأحمر وحاول مرة أخرى.` }));
          button.disabled = false;
          return;
        }

        // نجاح: نُظهر الإجابات الصحيحة والشرح ونقفل النموذج
        fieldsets.forEach((set, qi) => {
          set.querySelectorAll("input").forEach(input => { input.disabled = true; });
          const labels = set.querySelectorAll(".option");
          if (labels[data.answers[qi]]) labels[data.answers[qi]].classList.add("is-answer");
          const note = set.querySelector(".explain");
          if (data.explains && data.explains[qi]) { note.textContent = data.explains[qi]; note.hidden = false; }
        });
        button.remove();

        const nextLesson = lessons[index + 1];
        const nav = el("div", { class: "player-nav" });

        if (data.saved) {
          done.add(current.id);
          renderSide(current.id);
        }

        result.replaceChildren(el("div", { class: "result pass",
          text: questions.length ? "أحسنت! جميع إجاباتك صحيحة." : "تم إكمال الدرس." }));

        if (!user) {
          result.append(el("div", { class: "result info",
            text: "سجّل حسابًا مجانيًا ليُحفظ تقدّمك ويُفتح لك الدرس التالي." }));
          nav.append(el("a", { class: "btn btn-primary", href: "signup.html", text: "إنشاء حساب" }),
            el("a", { class: "btn btn-light", href: "login.html?returnTo=" + returnTo(), text: "تسجيل الدخول" }));
        } else {
          if (nextLesson) nav.append(el("a", { class: "btn btn-primary", href: lessonUrl(nextLesson), text: "الدرس التالي ←" }));
          if (data.course_done) {
            nav.append(el("button", { class: "btn btn-primary", type: "button", text: "عرض الشهادة",
              onclick: () => T.issueCertificate(course.slug, course.title) }));
            result.append(el("div", { class: "result pass", text: "مبروك! أكملت الدورة كاملة." }));
          }

          const after = await T.loadStats();
          if (after) {
            const { fresh } = T.earnedBadges(after, user.id);
            const names = T.BADGES.filter(badge => fresh.includes(badge.id)).map(badge => badge.name);
            if (data.new) toast(`سلسلتك الآن ${after.streak} يوم${names.length ? " · شارة جديدة: " + names.join("، ") : ""}`);
            else if (before) T.earnedBadges(after, user.id);
          }
        }

        nav.append(el("a", { class: "btn btn-light", href: "course.html?c=" + encodeURIComponent(course.slug), text: "قائمة الدروس" }));
        form.append(nav);
      } catch (error) {
        console.error(error);
        result.replaceChildren(el("div", { class: "result fail", text: "تعذّر التحقق الآن. تحقق من الاتصال وحاول مرة أخرى." }));
        button.disabled = false;
      }
    });

    return form;
  }

  async function init() {
    T.initNav();

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("c") || "";
    const wanted = params.get("l");
    const client = T.client();

    try {
      user = await T.user();

      const { data, error } = await client.from("courses")
        .select("id,slug,title,lessons(id,title,position)").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      if (!data) { view.replaceChildren(el("div", { class: "empty", text: "الدرس غير موجود." })); return; }

      course = data;
      lessons = [...course.lessons].sort((a, b) => a.position - b.position);
      document.getElementById("backToCourse").href = "course.html?c=" + encodeURIComponent(course.slug);
      document.getElementById("sideTitle").textContent = course.title;

      if (user) {
        const progress = await client.from("lesson_progress").select("lesson_id").eq("user_id", user.id);
        done = new Set((progress.data || []).map(row => row.lesson_id));
      }

      const index = Math.max(0, lessons.findIndex(lesson => lesson.id === wanted));
      const current = lessons[index];
      if (!current) { view.replaceChildren(el("div", { class: "empty", text: "لا توجد دروس في هذه الدورة بعد." })); return; }

      document.title = `${current.title} | ${course.title}`;
      renderSide(current.id);

      const { data: content, error: contentError } = await client.from("lesson_content")
        .select("blocks,questions").eq("lesson_id", current.id).maybeSingle();
      if (contentError) throw contentError;

      if (!content) {
        if (!user && current.position > 0) { gate(current); return; }
        throw new Error("no content");
      }

      const blocks = el("div");
      T.renderBlocks(blocks, content.blocks);

      view.replaceChildren(
        el("div", { class: "meta" },
          el("span", { text: `الدرس ${index + 1} من ${lessons.length}` }),
          el("span", { text: done.has(current.id) ? "✓ أكملت هذا الدرس" : "درس جديد" })),
        el("h1", { text: current.title }),
        blocks,
        buildQuiz(Array.isArray(content.questions) ? content.questions : [], current, index, content));
    } catch (error) {
      console.error(error);
      view.replaceChildren(el("div", { class: "empty", text: "تعذّر تحميل الدرس. تحقق من الاتصال وحاول مرة أخرى." }));
    }
  }

  init();
})();
