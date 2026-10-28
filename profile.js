"use strict";

  const client = window.taallamSupabase ||
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

  const message = document.getElementById("profileMessage");
  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const editPanel = document.getElementById("profileEditPanel");
const editButton = document.getElementById("editProfileBtn");
const cancelEditButton = document.getElementById("cancelEditBtn");
const displayName = document.getElementById("profileDisplayName");
const displayEmail = document.getElementById("profileDisplayEmail");

editButton.addEventListener("click", () => {
  editPanel.hidden = false;
  message.textContent = "";
  nameInput.focus();
});

cancelEditButton.addEventListener("click", () => {
  nameInput.value = displayName.textContent;
  message.textContent = "";
  editPanel.hidden = true;
});

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  // تُستبدل هذه القائمة بالدورات الفعلية من قاعدة البيانات عند تحميل الصفحة.
  let courseInfo = [
    { id: "english", title: "الإنجليزية من البداية", emoji: "🔤", category: "اللغات" },
    { id: "computer", title: "أساسيات الكمبيوتر", emoji: "💻", category: "التقنية" },
    { id: "programming", title: "مدخل إلى البرمجة", emoji: "⌨️", category: "التقنية" },
    { id: "math", title: "الرياضيات اليومية", emoji: "➗", category: "المدرسة" },
    { id: "career", title: "الاستعداد لسوق العمل", emoji: "🧭", category: "المهارات" },
    { id: "safety", title: "السلامة الرقمية", emoji: "🔐", category: "التقنية" }
  ];

  async function loadStats(userId) {
    const completedEl = document.getElementById("profileCompleted");
    const percentEl = document.getElementById("profilePercent");
    const savedEl = document.getElementById("profileSaved");

    try {
      const { data: rows, error } = await client
        .from("student_progress")
        .select("course_id, completed_lessons, is_completed")
        .eq("user_id", userId);

      if (error) throw error;

      const progressMap = new Map();

      (rows || []).forEach(row => {
        const previous = progressMap.get(row.course_id);
        if (!previous ||
            Number(row.completed_lessons) >
            Number(previous.completed_lessons)) {
          progressMap.set(row.course_id, row);
        }
      });

      let completedLessons = 0;

      progressMap.forEach(row => {
        completedLessons += Math.max(
          0,
          Math.min(3, Number(row.completed_lessons) || 0)
        );
      });

      const totalAll = courseInfo.reduce((sum, c) => sum + (c.lessons ? c.lessons.length : 3), 0) || 18;
      completedLessons = Math.min(totalAll, completedLessons);

      completedEl.textContent = completedLessons;
      percentEl.textContent =
        Math.round(completedLessons / (courseInfo.reduce((sum, c) => sum + (c.lessons ? c.lessons.length : 3), 0) || 18) * 100) + "%";

      // عدد المحفوظات يُحدَّث من قاعدة البيانات في loadSavedCourses.
    } catch (error) {
      console.error("تعذّر تحميل الإحصائيات:", error);
      completedEl.textContent = "—";
      percentEl.textContent = "—%";
      savedEl.textContent = "—";
    }
  }


async function loadSavedCourses(userId) {
  const container = document.getElementById("savedCoursesList");
  if (!container) return;

  container.innerHTML = "<p>جارٍ تحميل المحفوظات...</p>";

  try {
    // قراءة المحفوظات المحلية القديمة
    const localSaved = JSON.parse(
      localStorage.getItem("ts_saved") || "[]"
    );

    if (!Array.isArray(localSaved)) {
      throw new Error("قائمة المحفوظات المحلية غير صحيحة.");
    }

    // نقل المحفوظات المحلية إلى Supabase مرة واحدة لكل حساب،
    // وفقط إذا كانت البيانات المحلية تعود لهذا الحساب (أو بلا مالك).
    const migrationKey = `ts_saved_migrated_${userId}`;
    const localOwner = localStorage.getItem("ts_owner");

    if (localOwner && localOwner !== userId) {
      localStorage.removeItem("ts_saved");
      localStorage.removeItem("ts_completed");
    } else if (localStorage.getItem(migrationKey) !== "yes") {
      const validIds = courseInfo
        .filter(course => localSaved.includes(course.id))
        .map(course => course.id);

      if (validIds.length > 0) {
        const records = validIds.map(courseId => ({
          user_id: userId,
          course_id: courseId
        }));

        const { error: migrationError } = await client
          .from("saved_courses")
          .upsert(records, {
            onConflict: "user_id,course_id",
            ignoreDuplicates: true
          });

        if (migrationError) throw migrationError;
      }

      localStorage.setItem(migrationKey, "yes");
    }

    localStorage.setItem("ts_owner", userId);

    // جلب المحفوظات من حساب الطالب
    const { data, error } = await client
      .from("saved_courses")
      .select("course_id")
      .eq("user_id", userId);

    if (error) throw error;

    const savedIds = (data || []).map(row => row.course_id);
    const validCourses = courseInfo.filter(course =>
      savedIds.includes(course.id)
    );

    // تحديث النسخة المحلية
    const validIds = validCourses.map(course => course.id);

    localStorage.setItem("ts_saved", JSON.stringify(validIds));

    const savedCount = document.getElementById("profileSaved");
    if (savedCount) savedCount.textContent = validIds.length;

    if (validCourses.length === 0) {
      container.innerHTML = `
        <div class="course-empty">
          <p>❤️ لم تحفظ أي دورة حتى الآن.</p>
          <a class="btn btn-primary" href="index.html#courses">
            اكتشف الدورات
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = validCourses.map(course => `
      <article class="my-course-card">
        <div class="my-course-heading">
          <span class="my-course-emoji">${course.emoji}</span>
          <div>
            <h3>${course.title}</h3>
            <p>${course.category}</p>
          </div>
        </div>

        <div class="my-course-footer" style="margin-top:16px">
          <a class="btn btn-primary"
             href="course.html?c=${encodeURIComponent(course.id)}">
            فتح الدورة
          </a>

          <button class="btn btn-light"
                  type="button"
                  data-unsave-course="${course.id}">
            إزالة من المحفوظات
          </button>
        </div>
      </article>
    `).join("");

    container.querySelectorAll("[data-unsave-course]").forEach(button => {
      button.addEventListener("click", async () => {
        const courseId = button.dataset.unsaveCourse;
        button.disabled = true;

        const { error: deleteError } = await client
          .from("saved_courses")
          .delete()
          .eq("user_id", userId)
          .eq("course_id", courseId);

        if (deleteError) {
          console.error(deleteError);
          message.textContent = "تعذّر إزالة الدورة. حاول مرة أخرى.";
          button.disabled = false;
          return;
        }

        const remainingIds = validIds.filter(id => id !== courseId);

        localStorage.setItem(
          "ts_saved",
          JSON.stringify(remainingIds)
        );

        if (savedCount) savedCount.textContent = remainingIds.length;

        await loadSavedCourses(userId);
      });
    });

  } catch (error) {
    console.error("خطأ في المحفوظات:", error);
    container.innerHTML = `
      <div class="course-empty">
        تعذّر تحميل المحفوظات من قاعدة البيانات.
        تحقق من الاتصال وصلاحيات الجدول.
      </div>
    `;
  }
}

  async function loadMyCourses(userId) {
    const container = document.getElementById("myCoursesList");

    try {
      const { data: rows, error } = await client
        .from("student_progress")
        .select("course_id, completed_lessons, is_completed")
        .eq("user_id", userId);

      if (error) throw error;

      const progressMap = new Map();

      (rows || []).forEach(row => {
        const previous = progressMap.get(row.course_id);
        if (!previous ||
            Number(row.completed_lessons) >
            Number(previous.completed_lessons)) {
          progressMap.set(row.course_id, row);
        }
      });

      const startedCourses = courseInfo.filter(course => {
        const row = progressMap.get(course.id);
        return row && (
          Number(row.completed_lessons) > 0 ||
          row.is_completed === true
        );
      });

      if (startedCourses.length === 0) {
        container.innerHTML = `
          <div class="course-empty">
            <p>🌱 لم تبدأ أي دورة بعد.</p>
            <a class="btn btn-primary" href="index.html#courses">
              اكتشف الدورات
            </a>
          </div>
        `;
        return;
      }

      container.innerHTML = startedCourses.map(course => {
        const row = progressMap.get(course.id);
        
const totalLessons = course.lessons
  ? course.lessons.length
  : 3;

const count = Math.max(
  0,
  Math.min(totalLessons, Number(row.completed_lessons) || 0)
);

const finished = row.is_completed === true || count >= totalLessons;
const percent = totalLessons > 0
  ? Math.round(count / totalLessons * 100)
  : 0;


        return `
          <article class="my-course-card">
            <div class="my-course-heading">
              <span class="my-course-emoji">${course.emoji}</span>
              <div>
                <h3>${course.title}</h3>
                <p>${course.category}</p>
              </div>
            </div>

            <div class="my-course-progress"
                 role="progressbar"
                 aria-valuenow="${percent}"
                 aria-valuemin="0"
                 aria-valuemax="100">
              <div class="my-course-progress-fill"
                   style="width:${percent}%"></div>
            </div>

            <div class="my-course-footer">
              <span>
                ${finished ? "✅ مكتملة" : `أنجزت ${count} من ${totalLessons} دروس`}
                · ${percent}%
              </span>
              

<a class="btn btn-primary"
   href="course.html?c=${encodeURIComponent(course.id)}">
  ${finished ? "مراجعة الدورة" : "متابعة التعلّم"}
</a>


            </div>
          </article>
        `;
      }).join("");

    } catch (error) {
      console.error("تعذّر تحميل الدورات:", error);
      container.innerHTML = `
        <div class="course-empty">
          تعذّر تحميل الدورات. تحقق من اتصال قاعدة البيانات.
        </div>
      `;
    }
  }
  async function loadCertificates(userId) {
  const container = document.getElementById("certificatesList");

  container.innerHTML = "<p>جارٍ تحميل الشهادات...</p>";

  try {
    const { data, error } = await client
      .from("certificates")
      .select("course_id, course_title, student_name, issued_at")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="course-empty">
          <p>🎓 لا توجد شهادات صادرة حتى الآن.</p>
          <a class="btn btn-primary" href="index.html#courses">
            استكشف الدورات
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = data.map(cert => {
      const url = new URL(
        "certificate.html",
        window.location.href
      );

      // صفحة الشهادة تقرأ بياناتها من قاعدة البيانات، فلا نمرّر الاسم في الرابط.
      url.searchParams.set("course", cert.course_id);

      const date = new Date(cert.issued_at)
        .toLocaleDateString("ar-SA");

      return `
        <article class="my-course-card">
          <div class="my-course-heading">
            <span class="my-course-emoji">🏆</span>
            <div>
              <h3>${escapeCertificateText(cert.course_title)}</h3>
              <p>تاريخ الإصدار: ${date}</p>
            </div>
          </div>

          <div class="my-course-footer" style="margin-top:16px">
            <a class="btn btn-primary"
               href="${escapeCertificateText(url.href)}"
               target="_blank"
               rel="noopener">
              عرض الشهادة
            </a>
          </div>
        </article>
      `;
    }).join("");

  } catch (error) {
    console.error("خطأ تحميل الشهادات:", error);

    container.innerHTML = `
      <div class="course-empty">
        تعذّر تحميل الشهادات: ${escapeCertificateText(error.message)}
      </div>
    `;
  }
}

function escapeCertificateText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

  async function loadProfile() {
    const { data, error } = await client.auth.getUser();

    if (error || !data.user) {
      window.location.replace("login.html");
      return;
    }

    const user = data.user;

   const savedName =
  user.user_metadata?.full_name ||
  user.user_metadata?.name ||
  "";

emailInput.value = user.email || "";
nameInput.value = savedName;

displayName.textContent = savedName || "لم يُضف الاسم بعد";
displayEmail.textContent = user.email || "غير متوفر";

editPanel.hidden = true;

    // الدورات الفعلية من قاعدة البيانات (عناوين وعدد دروس)
    const catalog = await client.from("courses")
      .select("slug,title,emoji,category,lessons(id)").eq("published", true);

    if (!catalog.error && catalog.data) {
      courseInfo = catalog.data.map(c => ({
        id: c.slug, title: esc(c.title), emoji: esc(c.emoji),
        category: esc(c.category), lessons: c.lessons
      }));
    }

    await Promise.all([
  loadStats(user.id),
  loadMyCourses(user.id)
]);

await Promise.all([
  loadSavedCourses(user.id),
  loadCertificates(user.id)
]);
  }

  document.getElementById("profileForm").addEventListener(
    "submit",
    async function(event) {
      event.preventDefault();

      const fullName = nameInput.value.trim();

      if (!fullName) {
        message.textContent = "يرجى إدخال الاسم.";
        return;
      }

      const { error } = await client.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) {
        message.textContent =
          "تعذّر حفظ التعديلات: " + error.message;
        return;
      }

displayName.textContent = fullName;
nameInput.value = fullName;

message.textContent = "تم حفظ الاسم بنجاح.";
editPanel.hidden = true;    }
  );

  document.getElementById("logoutBtn").addEventListener(
    "click",
    async function() {
      const { error } = await client.auth.signOut();

      if (error) {
        message.textContent = "تعذّر تسجيل الخروج.";
        return;
      }

      window.location.replace("index.html");
    }
  );

  loadProfile();

// الحرف الأول من الاسم داخل الصورة الرمزية.
(() => {
  const nameEl = document.getElementById("profileDisplayName");
  const avatar = document.querySelector(".profile-avatar");
  if (!nameEl || !avatar) return;

  new MutationObserver(() => {
    const text = nameEl.textContent.trim();
    if (text && !text.startsWith("جارٍ")) avatar.textContent = Array.from(text)[0];
  }).observe(nameEl, { childList: true, characterData: true, subtree: true });
})();

// السلسلة والهدف اليومي ورابط الإدارة للمشرفين.
(async () => {
  try {
    const T = window.Taallam;
    const user = await T.user();
    if (!user) return;

    const [admin, stats] = await Promise.all([T.client().rpc("is_admin"), T.loadStats()]);
    if (admin.data === true) document.getElementById("adminLink").hidden = false;
    if (stats) T.renderStats(stats, user.id);
  } catch (error) {
    console.warn(error);
  }
})();
