
"use strict";

const client = window.taallamSupabase ||
  supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

window.taallamSupabase = client;

const $ = id => document.getElementById(id);

const courseNames = {
  english: "الإنجليزية من البداية",
  computer: "أساسيات الكمبيوتر",
  programming: "مدخل إلى البرمجة",
  math: "الرياضيات اليومية",
  career: "الاستعداد لسوق العمل",
  safety: "السلامة الرقمية"
};

const totalLessons = 18;

async function loadProfile() {
  const { data: sessionData, error: sessionError } =
    await client.auth.getSession();

  if (sessionError) throw sessionError;

  const user = sessionData.session?.user;

  if (!user) {
    window.location.replace("login.html");
    return;
  }

  $("email").textContent = user.email || "";

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("full_name, birth_date, gender")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  $("fullName").textContent =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "الطالب";

  if (profile?.birth_date) {
    $("birthDate").textContent =
      "تاريخ الميلاد: " + profile.birth_date;
  }

  const genders = {
    male: "ذكر",
    female: "أنثى",
    prefer_not_to_say: "أفضل عدم الإفصاح"
  };

  if (profile?.gender) {
    $("gender").textContent =
      "الجنس: " + (genders[profile.gender] || profile.gender);
  }

  const { data: rows, error: progressError } = await client
    .from("student_progress")
    .select("course_id, completed_lessons, is_completed")
    .eq("user_id", user.id);

  if (progressError) throw progressError;

  const progressRows = rows || [];
  const completed = progressRows.reduce(
    (sum, row) => sum + Math.max(
      0,
      Math.min(3, Number(row.completed_lessons) || 0)
    ),
    0
  );

  const finishedCourses = progressRows.filter(
    row => row.is_completed === true
  ).length;

  const percent = Math.round(completed / totalLessons * 100);

  $("completedCount").textContent = completed;
  $("coursesCompleted").textContent = finishedCourses;
  $("overallPercent").textContent = percent + "%";
  $("overallBar").style.width = percent + "%";

  $("courseProgress").innerHTML = Object.entries(courseNames)
    .map(([id, name]) => {
      const row = progressRows.find(item => item.course_id === id);
      const count = Math.max(
        0,
        Math.min(3, Number(row?.completed_lessons) || 0)
      );
      const coursePercent = Math.round(count / 3 * 100);

      return `
        <div class="course">
          <div class="course-title">${name}</div>
          <p class="muted">${count} من 3 دروس · ${coursePercent}%</p>
          <div class="progress">
            <div class="bar" style="width:${coursePercent}%"></div>
          </div>
        </div>
      `;
    }).join("");

  $("message").textContent = "";
}

$("logoutBtn").onclick = async () => {
  $("logoutBtn").disabled = true;

  const { error } = await client.auth.signOut();

  if (error) {
    $("message").textContent = "تعذّر تسجيل الخروج: " + error.message;
    $("logoutBtn").disabled = false;
    return;
  }

  window.location.replace("index.html");
};

loadProfile().catch(error => {
  console.error(error);
  $("message").textContent =
    "تعذّر تحميل بيانات الحساب. تحقق من إعدادات Supabase وسياسات الوصول.";
});
