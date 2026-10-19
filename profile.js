
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
      
$("editName").value =
  profile?.full_name || user.user_metadata?.full_name || "";

$("editBirthDate").value = profile?.birth_date || "";

$("editGender").value =
  profile?.gender || "prefer_not_to_say";

$("editEmail").value = user.email || "";
$("currentEmail").textContent =
  "البريد الحالي: " + (user.email || "");

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

const profileForm = $("profileForm");

profileForm.addEventListener("submit", async event => {
  event.preventDefault();

  const saveButton = $("saveProfileBtn");
  const message = $("profileMessage");

  saveButton.disabled = true;
  message.textContent = "جارٍ حفظ التغييرات...";
  message.style.color = "#344054";

  try {
    const { data: sessionData, error: sessionError } =
      await client.auth.getSession();

    if (sessionError) throw sessionError;

    const user = sessionData.session?.user;

    if (!user) {
      window.location.replace("login.html");
      return;
    }

    const fullName = $("editName").value.trim();
    const birthDate = $("editBirthDate").value;
    const gender = $("editGender").value;
    const newEmail = $("editEmail").value.trim().toLowerCase();

    if (!fullName || !birthDate || !newEmail) {
      throw new Error("يرجى تعبئة جميع الحقول المطلوبة.");
    }

    if (fullName.length > 100) {
      throw new Error("الاسم يجب ألا يتجاوز 100 حرف.");
    }

    if (!["male", "female", "prefer_not_to_say"].includes(gender)) {
      throw new Error("اختر الجنس من الخيارات المتاحة.");
    }

    if (birthDate > new Date().toISOString().slice(0, 10)) {
      throw new Error("تاريخ الميلاد لا يمكن أن يكون في المستقبل.");
    }

    // تحديث الاسم وتاريخ الميلاد والجنس في جدول الملف الشخصي.
    const { error: profileError } = await client
      .from("profiles")
      .update({
        full_name: fullName,
        birth_date: birthDate,
        gender: gender
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    // تحديث بيانات الاسم في بيانات المصادقة أيضًا.
    const { error: metadataError } = await client.auth.updateUser({
      data: {
        ...user.user_metadata,
        full_name: fullName,
        birth_date: birthDate,
        gender: gender
      }
    });

    if (metadataError) throw metadataError;

    // لا نغيّر البريد إذا لم يتغير.
    if (newEmail !== (user.email || "").toLowerCase()) {
      const { error: emailError } = await client.auth.updateUser({
        email: newEmail
      });

      if (emailError) throw emailError;

      message.style.color = "#087f5b";
      message.textContent =
        "تم حفظ بيانات الملف الشخصي. أرسلنا طلب تأكيد تغيير البريد عبر Supabase؛ افحص بريدك واتبع رابط التأكيد لإكمال التغيير.";
    } else {
      message.style.color = "#087f5b";
      message.textContent = "تم حفظ بيانات الملف الشخصي بنجاح.";
    }

    $("fullName").textContent = fullName;
    $("birthDate").textContent = "تاريخ الميلاد: " + birthDate;

    const genderLabels = {
      male: "ذكر",
      female: "أنثى",
      prefer_not_to_say: "أفضل عدم الإفصاح"
    };

    $("gender").textContent = "الجنس: " + genderLabels[gender];

    $("currentEmail").textContent =
      "البريد الحالي: " + (user.email || "");

  } catch (error) {
    console.error("خطأ حفظ الملف الشخصي:", error);

    message.style.color = "#b42318";
    message.textContent =
      "تعذّر الحفظ: " + (error.message || "حدث خطأ غير متوقع.");
  } finally {
    saveButton.disabled = false;
  }
});
