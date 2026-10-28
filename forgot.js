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

  const form = document.getElementById("forgot-form");
  const email = document.getElementById("email");
  const button = document.getElementById("forgot-button");
  const message = document.getElementById("forgot-message");
  let busy = false;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy) return;

    const value = email.value.trim();
    if (!value) return;

    busy = true;
    button.disabled = true;

    try {
      const redirectTo = new URL("reset.html", window.location.href).href;
      const { error } = await getClient().auth.resetPasswordForEmail(value, { redirectTo });

      if (error && error.status === 429) {
        say(message, "محاولات كثيرة. انتظر دقيقة ثم حاول مرة أخرى.", false);
      } else {
        // رسالة موحّدة سواء كان البريد مسجّلًا أم لا، حتى لا نكشف الحسابات.
        say(message, "إن كان البريد مسجّلًا لدينا فستصلك رسالة بها رابط تعيين كلمة المرور.", true);
      }
    } catch (error) {
      console.error(error);
      say(message, "تعذّر إرسال الرابط. تحقق من الاتصال وحاول مرة أخرى.", false);
    } finally {
      busy = false;
      button.disabled = false;
    }
  });
})();
