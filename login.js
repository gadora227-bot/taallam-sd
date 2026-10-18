
(() => {
  "use strict";

  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const button = document.getElementById("login-button");

  function getClient() {
    if (window.taallamSupabase) {
      return window.taallamSupabase;
    }

    if (
      typeof supabase === "undefined" ||
      typeof SUPABASE_URL === "undefined" ||
      typeof SUPABASE_PUBLISHABLE_KEY === "undefined"
    ) {
      throw new Error("إعدادات الاتصال غير مكتملة. حدّث الصفحة.");
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    button.disabled = true;
    button.textContent = "جارٍ تسجيل الدخول...";

    try {
      const client = getClient();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("لم يتم إنشاء جلسة دخول. حاول مرة أخرى.");
      }

      message.textContent = "تم تسجيل الدخول بنجاح. جارٍ فتح المنصة...";
      message.style.color = "#087f5b";

      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo");

      if (returnTo === "index.html" || returnTo === "index.html#courses") {
        window.location.href = returnTo;
      } else {
window.location.href = "profile.html";      }
    } catch (error) {
      message.textContent =
        error.message === "Invalid login credentials"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : error.message;

      message.style.color = "#b54732";
      button.disabled = false;
      button.textContent = "تسجيل الدخول";
    }
  });
})();
