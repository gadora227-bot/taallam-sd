
"use strict";

const form = document.getElementById("signup-form");
const nameInput = document.getElementById("full-name");
const birthDateInput = document.getElementById("birth-date");
const genderInput = document.getElementById("gender");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const submitButton = document.getElementById("signup-button");
const message = document.getElementById("signup-message");

let submitting = false;
let signedUpSuccessfully = false;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#b42318" : "#087f5b";
}

function getSupabaseClient() {
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

  window.taallamSupabase = supabase.createClient(
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

  return window.taallamSupabase;
}

// منع اختيار تاريخ ميلاد في المستقبل
const today = new Date();
const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

birthDateInput.max = todayString;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (submitting) return;

  const fullName = nameInput.value.trim().replace(/\s+/g, " ");
  const birthDate = birthDateInput.value;
  const gender = genderInput.value;
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (fullName.length < 2 || fullName.length > 100) {
    showMessage("أدخل اسمك الكامل، بحد أقصى 100 حرف.", true);
    nameInput.focus();
    return;
  }

  if (!birthDate || birthDate > todayString) {
    showMessage("أدخل تاريخ ميلاد صحيحًا.", true);
    birthDateInput.focus();
    return;
  }

  if (!["male", "female", "prefer_not_to_say"].includes(gender)) {
    showMessage("يرجى اختيار الجنس أو تفضيل عدم الإفصاح.", true);
    genderInput.focus();
    return;
  }

  if (!emailInput.validity.valid) {
    showMessage("أدخل بريدًا إلكترونيًا صحيحًا.", true);
    emailInput.focus();
    return;
  }

  if (password.length < 8 || password.length > 72) {
    showMessage("يجب أن تكون كلمة المرور بين 8 و72 حرفًا.", true);
    passwordInput.focus();
    return;
  }

  if (password !== confirmPassword) {
    showMessage("كلمتا المرور غير متطابقتين.", true);
    confirmPasswordInput.focus();
    return;
  }

  submitting = true;
  submitButton.disabled = true;
  submitButton.textContent = "جارٍ إنشاء الحساب...";
  showMessage("");

  try {
    const client = getSupabaseClient();

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: new URL("index.html", window.location.href).href,
        data: {
          full_name: fullName,
          birth_date: birthDate,
          gender: gender
        }
      }
    });

    if (error) throw error;

    passwordInput.value = "";
    confirmPasswordInput.value = "";

    if (data.session) {
      signedUpSuccessfully = true;
      showMessage("تم إنشاء الحساب بنجاح. جارٍ الانتقال للصفحة الرئيسية.");

      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    } else {
      showMessage(
        "تم إرسال رسالة تفعيل إلى بريدك الإلكتروني. فعّل حسابك، ثم سجّل الدخول."
      );
    }
  } catch (error) {
    console.error("Signup error:", error);

    showMessage(
      error && error.message
        ? error.message
        : "تعذّر إنشاء الحساب. تحقق من الاتصال وحاول مرة أخرى.",
      true
    );
  } finally {
    // لا نعيد تفعيل الزر أثناء الانتقال بعد نجاح التسجيل.
    if (!signedUpSuccessfully) {
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "إنشاء الحساب";
    }
  }
});
