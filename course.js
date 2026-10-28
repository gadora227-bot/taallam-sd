// صفحة الدورة: التعريف، التقدّم، وقائمة الدروس.
(() => {
  "use strict";

  const { el } = window.Taallam;
  const view = document.getElementById("courseView");

  async function init() {
    window.Taallam.initNav();

    const slug = new URLSearchParams(window.location.search).get("c") || "";
    const client = window.taallamSupabase;

    try {
      const user = await window.Taallam.user();
      const { data: course, error } = await client.from("courses")
        .select("id,slug,title,description,category,level,emoji,cover,duration,lessons(id,title,position)")
        .eq("slug", slug).eq("published", true).maybeSingle();

      if (error) throw error;
      if (!course) {
        view.replaceChildren(el("div", { class: "empty", text: "الدورة غير موجودة أو لم تُنشر بعد." }));
        return;
      }

      document.title = course.title + " | تعلّم";
      const lessons = [...course.lessons].sort((a, b) => a.position - b.position);

      let done = new Set();
      if (user) {
        const { data } = await client.from("lesson_progress").select("lesson_id").eq("user_id", user.id);
        done = new Set((data || []).map(row => row.lesson_id));
      }

      const doneCount = lessons.filter(lesson => done.has(lesson.id)).length;
      const percent = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
      const next = lessons.find(lesson => !done.has(lesson.id)) || lessons[0];
      const finished = lessons.length > 0 && doneCount === lessons.length;
      const lessonUrl = lesson => `lesson.html?c=${encodeURIComponent(course.slug)}&l=${lesson.id}`;

      const actions = el("div", { class: "course-hero-actions" });
      if (next) {
        actions.append(el("a", { class: "btn btn-primary", href: lessonUrl(next),
          text: finished ? "راجع الدورة" : doneCount > 0 ? "تابع التعلّم" : "ابدأ الدورة" }));
      }
      if (finished) {
        actions.append(el("button", { class: "btn btn-light", text: "عرض الشهادة",
          onclick: () => window.Taallam.issueCertificate(course.slug, course.title) }));
      }

      view.replaceChildren(
        el("section", { class: "course-hero" },
          el("div", { class: `course-cover ${course.cover}` },
            el("span", { class: "emoji", text: course.emoji }),
            el("span", { class: "level", text: course.level })),
          el("div", { class: "course-hero-body" },
            el("h1", { text: course.title }),
            el("p", { text: course.description }),
            el("div", { class: "meta" },
              el("span", { text: course.category }),
              el("span", { text: `${lessons.length} دروس` }),
              course.duration ? el("span", { text: course.duration }) : null),
            user ? el("div", { class: "course-progress" },
              el("div", { class: "course-progress-info" },
                el("span", { text: `أنجزت ${doneCount} من ${lessons.length}` }),
                el("strong", { text: percent + "%" })),
              el("div", { class: "progress-track" }, el("div", { class: "progress-fill", style: `width:${percent}%` })))
              : el("p", { class: "notice", text: "الدرس الأول مجاني للجميع، وبقية الدروس تتطلب حسابًا مجانيًا." }),
            actions)),
        el("h2", { text: "دروس الدورة" }),
        el("ol", { class: "lesson-list" }, lessons.map((lesson, index) => {
          const isDone = done.has(lesson.id);
          const locked = !user && lesson.position > 0;
          return el("li", {}, el("a", {
            class: "lesson-row" + (isDone ? " done" : "") + (locked ? " locked" : "") + (lesson === next && !isDone ? " current" : ""),
            href: lessonUrl(lesson) },
            el("span", { class: "lesson-num", text: isDone ? "✓" : String(index + 1) }),
            el("span", { class: "lesson-title", text: lesson.title }),
            el("span", { class: "lesson-state", text: isDone ? "مكتمل" : locked ? "يتطلب حسابًا" : "" })));
        })));
    } catch (error) {
      console.error(error);
      view.replaceChildren(el("div", { class: "empty", text: "تعذّر تحميل الدورة. تحقق من الاتصال وحاول مرة أخرى." }));
    }
  }

  init();
})();
