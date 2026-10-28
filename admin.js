// لوحة الإدارة: إضافة وتعديل الدورات والدروس بدون كود.
// الحماية الفعلية في قاعدة البيانات (RLS + is_admin)، وهذه الواجهة للراحة فقط.
(() => {
  "use strict";

  const T = window.Taallam;
  const { el } = T;
  const $ = id => document.getElementById(id);
  const db = () => T.client();

  const COVERS = [["cover-green", "أخضر"], ["cover-blue", "أزرق"], ["cover-purple", "بنفسجي"],
                  ["cover-orange", "برتقالي"], ["cover-red", "أحمر"], ["cover-teal", "فيروزي"]];
  const BLOCK_TYPES = [["text", "نص"], ["image", "صورة"], ["video", "فيديو"], ["note", "ملاحظة"]];

  let courses = [];
  let course = null;      // الدورة المحددة (صف قاعدة البيانات) أو null لدورة جديدة
  let lessons = [];       // دروس الدورة المحددة
  let draft = null;       // الدرس قيد التحرير

  function say(text, ok = true) {
    const node = $("adminStatus");
    node.textContent = text;
    node.style.color = ok ? "#087f5b" : "#b54732";
  }

  const field = (label, node, full) => el("div", { class: full ? "full" : "" }, el("label", { class: "lbl", text: label }), node);
  const input = (value, type = "text", attrs = {}) => el("input", { type, value: value ?? "", ...attrs });
  const select = (options, value) => {
    const node = el("select", {}, options.map(([v, label]) => el("option", { value: v, text: label })));
    node.value = value;
    return node;
  };

  // ---------- الدورات ----------
  async function loadCourses(selectId) {
    const { data, error } = await db().from("courses").select("id,slug,title,published,sort").order("sort").order("created_at");
    if (error) { say("تعذّر تحميل الدورات: " + error.message, false); return; }
    courses = data;

    $("courseList").replaceChildren(...courses.map(item => el("li", {},
      el("button", { class: "admin-item" + (course && course.id === item.id ? " active" : ""), type: "button",
        onclick: () => selectCourse(item.id) },
        el("span", { text: item.title }),
        el("small", { text: item.published ? "منشورة" : "مسودة" })))));

    if (selectId) await selectCourse(selectId);
  }

  async function selectCourse(id) {
    $("lessonPanel").hidden = true;
    draft = null;

    if (!id) { course = null; lessons = []; renderCoursePanel(); return; }

    const { data, error } = await db().from("courses").select("*").eq("id", id).single();
    if (error) { say("تعذّر فتح الدورة: " + error.message, false); return; }
    course = data;
    await loadLessons();
    renderCoursePanel();
    $("courseList").querySelectorAll(".admin-item").forEach((node, i) => node.classList.toggle("active", courses[i] && courses[i].id === id));
  }

  function renderCoursePanel() {
    const c = course || { slug: "", title: "", description: "", category: "عام", level: "مبتدئ", emoji: "📘", cover: "cover-green", duration: "", published: false, sort: courses.length };
    const f = {
      title: input(c.title, "text", { maxlength: 150 }),
      slug: input(c.slug, "text", { maxlength: 40, dir: "ltr", placeholder: "english-basics" }),
      description: el("textarea", { maxlength: 500, text: c.description }),
      category: input(c.category, "text", { maxlength: 40 }),
      level: input(c.level, "text", { maxlength: 30 }),
      emoji: input(c.emoji, "text", { maxlength: 4 }),
      duration: input(c.duration, "text", { maxlength: 60, placeholder: "مثال: ساعتان" }),
      cover: select(COVERS, c.cover),
      sort: input(c.sort, "number"),
      published: input("", "checkbox")
    };
    f.description.value = c.description;
    f.published.checked = c.published;

    const save = async () => {
      const payload = {
        title: f.title.value.trim(), slug: f.slug.value.trim().toLowerCase(), description: f.description.value.trim(),
        category: f.category.value.trim() || "عام", level: f.level.value.trim() || "مبتدئ",
        emoji: f.emoji.value.trim() || "📘", cover: f.cover.value, duration: f.duration.value.trim(),
        sort: Number(f.sort.value) || 0, published: f.published.checked
      };
      if (!payload.title) return say("اكتب عنوان الدورة.", false);
      if (!/^[a-z0-9_-]{1,40}$/.test(payload.slug)) return say("الرابط المختصر: حروف إنجليزية صغيرة وأرقام و - فقط.", false);

      const query = course ? db().from("courses").update(payload).eq("id", course.id).select("id").single()
                           : db().from("courses").insert(payload).select("id").single();
      const { data, error } = await query;
      if (error) return say("تعذّر الحفظ: " + (error.code === "23505" ? "هذا الرابط المختصر مستخدم." : error.message), false);
      say("تم حفظ الدورة.");
      await loadCourses(data.id);
    };

    const remove = async () => {
      if (!course || !confirm("حذف الدورة وكل دروسها؟ لا يمكن التراجع.")) return;
      const { error } = await db().from("courses").delete().eq("id", course.id);
      if (error) return say("تعذّر الحذف: " + error.message, false);
      course = null; lessons = [];
      say("تم حذف الدورة.");
      await loadCourses();
      renderCoursePanel();
    };

    $("coursePanel").replaceChildren(
      el("h2", { text: course ? "تعديل الدورة" : "دورة جديدة" }),
      el("div", { class: "form-grid" },
        field("عنوان الدورة", f.title, true), field("الرابط المختصر (slug)", f.slug), field("التصنيف", f.category),
        field("الوصف", f.description, true), field("المستوى", f.level), field("المدة", f.duration),
        field("الأيقونة (إيموجي)", f.emoji), field("لون الغلاف", f.cover), field("الترتيب", f.sort),
        el("label", { class: "check" }, f.published, "منشورة للزوار")),
      el("div", { class: "admin-row" },
        el("button", { class: "btn btn-primary", type: "button", text: "حفظ الدورة", onclick: save }),
        course ? el("button", { class: "btn btn-light", type: "button", text: "حذف الدورة", onclick: remove }) : null),
      course ? lessonsSection() : el("p", { class: "status", text: "احفظ الدورة أولاً ثم أضف الدروس." }));
  }

  // ---------- الدروس ----------
  async function loadLessons() {
    const { data, error } = await db().from("lessons").select("id,title,position").eq("course_id", course.id).order("position");
    if (error) { say("تعذّر تحميل الدروس: " + error.message, false); return; }
    lessons = data;
  }

  async function savePositions() {
    const rows = lessons.map((lesson, index) => ({ id: lesson.id, course_id: course.id, title: lesson.title, position: index }));
    if (rows.length) {
      const { error } = await db().from("lessons").upsert(rows, { onConflict: "id" });
      if (error) say("تعذّر ترتيب الدروس: " + error.message, false);
    }
    await loadLessons();
    renderCoursePanel();
  }

  function lessonsSection() {
    const move = async (index, step) => {
      const target = index + step;
      if (target < 0 || target >= lessons.length) return;
      [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
      await savePositions();
    };
    const remove = async lesson => {
      if (!confirm(`حذف الدرس «${lesson.title}»؟`)) return;
      const { error } = await db().from("lessons").delete().eq("id", lesson.id);
      if (error) return say("تعذّر الحذف: " + error.message, false);
      lessons = lessons.filter(item => item.id !== lesson.id);
      $("lessonPanel").hidden = true;
      await savePositions();
    };

    return el("div", {},
      el("h2", { text: `الدروس (${lessons.length})` }),
      el("p", { class: "status", text: "الدرس الأول (الأعلى) مفتوح للزوار، وبقية الدروس تتطلب حسابًا." }),
      el("ul", { class: "lesson-list" }, lessons.map((lesson, index) => el("li", { class: "lesson-row" },
        el("span", { class: "lesson-num", text: String(index + 1) }),
        el("span", { class: "lesson-title", text: lesson.title }),
        el("span", { class: "admin-row" },
          el("button", { class: "btn btn-light mini", type: "button", text: "↑", "aria-label": "أعلى", onclick: () => move(index, -1) }),
          el("button", { class: "btn btn-light mini", type: "button", text: "↓", "aria-label": "أسفل", onclick: () => move(index, 1) }),
          el("button", { class: "btn btn-primary mini", type: "button", text: "تحرير", onclick: () => editLesson(lesson) }),
          el("button", { class: "btn btn-light mini", type: "button", text: "حذف", onclick: () => remove(lesson) }))))),
      el("p", {}, el("button", { class: "btn btn-light", type: "button", text: "+ درس جديد", onclick: () => openDraft({ id: null, title: "", blocks: [{ type: "text", text: "" }], questions: [] }) })));
  }

  async function editLesson(lesson) {
    const [content, keys] = await Promise.all([
      db().from("lesson_content").select("blocks,questions").eq("lesson_id", lesson.id).maybeSingle(),
      db().from("lesson_keys").select("answers,explains").eq("lesson_id", lesson.id).maybeSingle()
    ]);
    const answers = (keys.data && keys.data.answers) || [];
    const explains = (keys.data && keys.data.explains) || [];
    openDraft({
      id: lesson.id, title: lesson.title,
      blocks: (content.data && content.data.blocks) || [],
      questions: ((content.data && content.data.questions) || []).map((q, i) => ({
        q: q.q || "", options: q.options || [], answer: Number(answers[i]) || 0, explain: explains[i] || "" }))
    });
  }

  function openDraft(value) {
    draft = value;
    renderLessonPanel();
    $("lessonPanel").hidden = false;
    $("lessonPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderLessonPanel() {
    const title = input(draft.title, "text", { maxlength: 150 });
    title.addEventListener("input", () => { draft.title = title.value; });

    const blocksBox = el("div");
    const questionsBox = el("div");

    const renderBlocks = () => blocksBox.replaceChildren(...draft.blocks.map((block, index) => {
      const type = select(BLOCK_TYPES, block.type);
      type.addEventListener("change", () => { block.type = type.value; renderBlocks(); });
      const main = (block.type === "text" || block.type === "note")
        ? el("textarea", { placeholder: "اكتب النص (اترك سطرًا فارغًا بين الفقرات)" })
        : input(block.url, "url", { dir: "ltr", placeholder: block.type === "video" ? "رابط يوتيوب أو فيميو أو ملف mp4 (https)" : "رابط الصورة (https)" });
      if (main.tagName === "TEXTAREA") main.value = block.text || "";
      main.addEventListener("input", () => { if (main.tagName === "TEXTAREA") block.text = main.value; else block.url = main.value; });
      const alt = block.type === "image" ? input(block.alt, "text", { placeholder: "وصف الصورة (يظهر كتعليق ويفيد القارئ الصوتي)" }) : null;
      if (alt) alt.addEventListener("input", () => { block.alt = alt.value; });

      return el("div", { class: "editor-block" },
        el("div", { class: "admin-row" }, type, el("span", { class: "grow" }),
          el("button", { class: "btn btn-light mini", type: "button", text: "↑", onclick: () => swap(draft.blocks, index, -1, renderBlocks) }),
          el("button", { class: "btn btn-light mini", type: "button", text: "↓", onclick: () => swap(draft.blocks, index, 1, renderBlocks) }),
          el("button", { class: "btn btn-light mini", type: "button", text: "حذف", onclick: () => { draft.blocks.splice(index, 1); renderBlocks(); } })),
        main, alt);
    }));

    const renderQuestions = () => questionsBox.replaceChildren(...draft.questions.map((question, index) => {
      const q = input(question.q, "text", { placeholder: "نص السؤال" });
      const options = el("textarea", { placeholder: "الخيارات، كل خيار في سطر (اثنان على الأقل)" });
      options.value = (question.options || []).join("\n");
      const answer = input(question.answer + 1, "number", { min: 1, max: 10 });
      const explain = input(question.explain, "text", { placeholder: "شرح الإجابة (يظهر بعد النجاح)" });
      q.addEventListener("input", () => { question.q = q.value; });
      options.addEventListener("input", () => { question.options = options.value.split("\n"); });
      answer.addEventListener("input", () => { question.answer = (Number(answer.value) || 1) - 1; });
      explain.addEventListener("input", () => { question.explain = explain.value; });

      return el("div", { class: "editor-block" },
        el("div", { class: "admin-row" }, el("strong", { text: `سؤال ${index + 1}` }), el("span", { class: "grow" }),
          el("button", { class: "btn btn-light mini", type: "button", text: "حذف", onclick: () => { draft.questions.splice(index, 1); renderQuestions(); } })),
        q, options, field("رقم الإجابة الصحيحة (1 = أول خيار)", answer), explain);
    }));

    renderBlocks();
    renderQuestions();

    $("lessonPanel").replaceChildren(
      el("h2", { text: draft.id ? "تحرير الدرس" : "درس جديد" }),
      field("عنوان الدرس", title),
      el("h2", { text: "محتوى الدرس" }), blocksBox,
      el("button", { class: "btn btn-light", type: "button", text: "+ إضافة كتلة", onclick: () => { draft.blocks.push({ type: "text", text: "" }); renderBlocks(); } }),
      el("h2", { text: "أسئلة الدرس" }), questionsBox,
      el("button", { class: "btn btn-light", type: "button", text: "+ إضافة سؤال", onclick: () => { draft.questions.push({ q: "", options: ["", ""], answer: 0, explain: "" }); renderQuestions(); } }),
      el("p", {}, el("button", { class: "btn btn-primary", type: "button", text: "حفظ الدرس", onclick: saveLesson })));
  }

  function swap(list, index, step, rerender) {
    const target = index + step;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    rerender();
  }

  async function saveLesson() {
    const title = draft.title.trim();
    if (!title) return say("اكتب عنوان الدرس.", false);

    const blocks = [];
    for (const block of draft.blocks) {
      if (block.type === "text" || block.type === "note") {
        if ((block.text || "").trim()) blocks.push({ type: block.type, text: block.text.trim() });
      } else {
        const url = T.httpsUrl(block.url || "");
        if (!block.url) continue;
        if (!url) return say("روابط الصور والفيديو يجب أن تبدأ بـ https://", false);
        if (block.type === "video" && !T.videoNode(url)) return say("رابط الفيديو غير مدعوم. استخدم يوتيوب أو فيميو أو ملف mp4/webm.", false);
        blocks.push(block.type === "image" ? { type: "image", url, alt: (block.alt || "").trim() } : { type: "video", url });
      }
    }

    const questions = [], answers = [], explains = [];
    for (const [i, question] of draft.questions.entries()) {
      const options = (question.options || []).map(item => item.trim()).filter(Boolean);
      if (!question.q.trim()) return say(`السؤال ${i + 1}: اكتب نص السؤال.`, false);
      if (options.length < 2) return say(`السؤال ${i + 1}: أضف خيارين على الأقل.`, false);
      if (question.answer < 0 || question.answer >= options.length) return say(`السؤال ${i + 1}: رقم الإجابة الصحيحة خارج الخيارات.`, false);
      questions.push({ q: question.q.trim(), options });
      answers.push(question.answer);
      explains.push((question.explain || "").trim());
    }

    try {
      let id = draft.id;
      if (id) {
        const { error } = await db().from("lessons").update({ title }).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await db().from("lessons").insert({ course_id: course.id, title, position: lessons.length }).select("id").single();
        if (error) throw error;
        id = data.id;
      }
      let result = await db().from("lesson_content").upsert({ lesson_id: id, blocks, questions }, { onConflict: "lesson_id" });
      if (result.error) throw result.error;
      result = await db().from("lesson_keys").upsert({ lesson_id: id, answers, explains }, { onConflict: "lesson_id" });
      if (result.error) throw result.error;

      draft.id = id;
      say("تم حفظ الدرس.");
      await loadLessons();
      renderCoursePanel();
    } catch (error) {
      say("تعذّر حفظ الدرس: " + error.message, false);
    }
  }

  async function init() {
    const gate = $("adminGate");
    try {
      const user = await T.user();
      if (!user) { window.location.replace("login.html?returnTo=index.html"); return; }

      const { data, error } = await db().rpc("is_admin");
      if (error || data !== true) {
        gate.textContent = "هذه الصفحة للمشرفين فقط.";
        return;
      }

      gate.hidden = true;
      $("adminApp").hidden = false;
      $("newCourse").addEventListener("click", () => selectCourse(null));
      await loadCourses();
      renderCoursePanel();
    } catch (error) {
      console.error(error);
      gate.textContent = "تعذّر تحميل لوحة الإدارة.";
    }
  }

  init();
})();
