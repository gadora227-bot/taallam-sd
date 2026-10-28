(() => {
  "use strict";

  function getClient() {
    if (!window.taallamSupabase) throw new Error("إعدادات الاتصال غير مكتملة.");
    return window.taallamSupabase;
  }

  function say(el, text, ok) {
    el.textContent = text;
    el.style.color = ok ? "#087f5b" : "#b54732";
  }

  const form = document.getElementById("reset-form");
  const status = document.getElementById("reset-status");
  const message = document.getElementById("reset-message");
  const button = document.getElementById("reset-button");
  let ready = false;
  let busy = false;

  function showForm() {
    if (ready) return;
    ready = true;
    status.textContent = "اختر كلمة مرور جديدة لحسابك.";
    form.hidden = false;
  }

  const client = getClient();

  client.auth.onAuthStateChange(event => {
    if (event === "PASSWORD_RECOVERY") showForm();
  });

  // قد يكون الحدث سبق تحميل هذا السكربت، فنفحص الجلسة أيضًا.
  setTimeout(async () => {
    if (ready) return;
    const { data } = await client.auth.getSession();

    if (data.session) {
      showForm();
    } else {
      say(status, "الرابط غير صالح أو منتهي الصلاحية. اطلب رابطًا جديدًا.", false);
    }
  }, 1200);

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy) return;

    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password.length < 8 || password.length > 72) {
      say(message, "كلمة المرور يجب أن تكون بين 8 و72 حرفًا.", false);
      return;
    }

    if (password !== confirm) {
      say(message, "كلمتا المرور غير متطابقتين.", false);
      return;
    }

    busy = true;
    button.disabled = true;

    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;

      say(message, "تم تغيير كلمة المرور. سجّل الدخول بها الآن.", true);
      await client.auth.signOut();
      setTimeout(() => { window.location.href = "login.html"; }, 1500);
    } catch (error) {
      console.error(error);
      say(message, error.message || "تعذّر تغيير كلمة المرور.", false);
      busy = false;
      button.disabled = false;
    }
  });
})();
