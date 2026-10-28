// أدوات مشتركة بين صفحات المنصة (الدورة، الدرس، الإدارة، الرئيسية)
(() => {
  "use strict";

  const T = (window.Taallam = {});

  T.client = () => {
    if (!window.taallamSupabase) throw new Error("إعدادات الاتصال غير مكتملة.");
    return window.taallamSupabase;
  };

  T.user = async () => {
    const { data } = await T.client().auth.getSession();
    return data.session ? data.session.user : null;
  };

  // إنشاء عناصر DOM بأمان (textContent فقط، فلا حقن HTML من المحتوى)
  T.el = (tag, props = {}, ...kids) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value === false || value == null) continue;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value);
    }
    kids.flat().forEach(kid => { if (kid != null) node.append(kid); });
    return node;
  };

  T.httpsUrl = value => {
    try {
      const url = new URL(String(value).trim());
      return url.protocol === "https:" ? url.href : null;
    } catch (error) {
      return null;
    }
  };

  // يحوّل رابط فيديو إلى عنصر تضمين آمن (يوتيوب/فيميو/ملف مباشر)
  T.videoNode = value => {
    const href = T.httpsUrl(value);
    if (!href) return null;
    const url = new URL(href);
    let embed = null;

    if (/(^|\.)youtube\.com$/.test(url.hostname) && url.searchParams.get("v")) {
      embed = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(url.searchParams.get("v"));
    } else if (url.hostname === "youtu.be" && url.pathname.length > 1) {
      embed = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(url.pathname.slice(1));
    } else if (url.hostname === "vimeo.com" && /^\/\d+/.test(url.pathname)) {
      embed = "https://player.vimeo.com/video/" + url.pathname.slice(1).split("/")[0];
    }

    if (embed) {
      return T.el("iframe", {
        class: "video-frame", src: embed, title: "فيديو الدرس", loading: "lazy",
        allow: "fullscreen; picture-in-picture", referrerpolicy: "strict-origin-when-cross-origin"
      });
    }

    if (/\.(mp4|webm)(\?|$)/i.test(href)) {
      return T.el("video", { class: "video-frame", src: href, controls: "", preload: "metadata" });
    }

    return null;
  };

  // يرسم كتل الدرس: نص، صورة، فيديو، ملاحظة
  T.renderBlocks = (container, blocks) => {
    container.replaceChildren();

    (Array.isArray(blocks) ? blocks : []).forEach(block => {
      if (!block || typeof block !== "object") return;

      if (block.type === "text" || block.type === "note") {
        const parts = String(block.text || "").split(/\n{2,}/).filter(Boolean);
        const wrap = T.el("div", { class: block.type === "note" ? "block-note" : "block-text" });
        parts.forEach(part => wrap.append(T.el("p", { text: part })));
        container.append(wrap);
      } else if (block.type === "image") {
        const href = T.httpsUrl(block.url);
        if (!href) return;
        container.append(T.el("figure", { class: "block-image" },
          T.el("img", { src: href, alt: String(block.alt || ""), loading: "lazy" }),
          block.alt ? T.el("figcaption", { text: String(block.alt) }) : null));
      } else if (block.type === "video") {
        const node = T.videoNode(block.url);
        if (node) container.append(T.el("div", { class: "block-video" }, node));
      }
    });
  };

  // ---------- السلسلة والهدف اليومي والشارات ----------
  T.BADGES = [
    { id: "first", name: "الخطوة الأولى", hint: "أكمل درسك الأول", test: s => s.total_lessons >= 1 },
    { id: "five", name: "خمسة دروس", hint: "أكمل 5 دروس", test: s => s.total_lessons >= 5 },
    { id: "ten", name: "عشرة دروس", hint: "أكمل 10 دروس", test: s => s.total_lessons >= 10 },
    { id: "course", name: "خريج دورة", hint: "أكمل دورة كاملة", test: s => s.courses_done >= 1 },
    { id: "s3", name: "ثلاثة أيام", hint: "تعلّم 3 أيام متتالية", test: s => s.streak >= 3 },
    { id: "s7", name: "أسبوع كامل", hint: "تعلّم 7 أيام متتالية", test: s => s.streak >= 7 }
  ];

  T.loadStats = async () => {
    try {
      const { data, error } = await T.client().rpc("my_stats");
      if (error || !data) return null;
      return data;
    } catch (error) {
      return null;
    }
  };

  // يحفظ الشارات المكتسبة على الجهاز كي لا تختفي إن انقطعت السلسلة، ويعيد الجديد منها
  T.earnedBadges = (stats, userId) => {
    const key = "ts_badges_" + userId;
    let stored = [];
    try { stored = JSON.parse(localStorage.getItem(key) || "[]"); } catch (error) { stored = []; }

    const now = T.BADGES.filter(badge => badge.test(stats)).map(badge => badge.id);
    const all = Array.from(new Set([...stored, ...now]));
    const fresh = all.filter(id => !stored.includes(id));

    try { localStorage.setItem(key, JSON.stringify(all)); } catch (error) { /* تجاهل */ }
    return { all, fresh };
  };

  T.renderStats = (stats, userId) => {
    const card = document.getElementById("todayCard");
    if (!card || !stats) return { fresh: [] };

    card.hidden = false;
    const goal = Math.max(1, stats.goal || 1);
    const percent = Math.min(100, Math.round((stats.today / goal) * 100));

    document.getElementById("streakCount").textContent = stats.streak;
    document.getElementById("todayCount").textContent = `${stats.today} من ${goal}`;
    document.getElementById("goalBar").style.width = percent + "%";

    const { all, fresh } = T.earnedBadges(stats, userId);
    const list = document.getElementById("badgeList");
    list.replaceChildren(...T.BADGES.map(badge =>
      T.el("li", { class: "badge" + (all.includes(badge.id) ? " earned" : ""), title: badge.hint, text: badge.name })));

    return { fresh };
  };

  // إصدار الشهادة وفتحها (الخادم يتحقق من إكمال الدورة عبر سياسة RLS)
  T.issueCertificate = async (slug, title) => {
    const popup = window.open("about:blank", "_blank");

    try {
      const user = await T.user();
      if (!user) throw new Error("سجّل الدخول أولاً.");

      const meta = user.user_metadata || {};
      const name = meta.full_name || meta.name || (user.email || "").split("@")[0] || "Student";

      const { error } = await T.client().from("certificates").upsert(
        { user_id: user.id, course_id: slug, course_title: title, student_name: name },
        { onConflict: "user_id,course_id" });
      if (error) throw error;

      const url = new URL("certificate.html", window.location.href);
      url.searchParams.set("course", slug);
      if (popup) popup.location.href = url.href; else window.location.href = url.href;
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      alert("تعذّر إصدار الشهادة: " + (error.message || "خطأ غير معروف"));
    }
  };
})();

// إظهار زر الدخول أو الحساب في الترويسة
window.Taallam.initNav = async () => {
  const signedIn = Boolean(await window.Taallam.user());
  const login = document.getElementById("loginNav");
  const profile = document.getElementById("profileNav");
  if (login) login.style.display = signedIn ? "none" : "inline-flex";
  if (profile) profile.style.display = signedIn ? "inline-flex" : "none";
};
