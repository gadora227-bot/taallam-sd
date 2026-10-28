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

  const form = document.getElementById("verify-form");
  const input = document.getElementById("code");
  const result = document.getElementById("verify-result");
  const button = document.getElementById("verify-button");
  const pattern = /^(TA-)?[0-9A-F]{8}$/;

  function show(lines, ok) {
    result.replaceChildren();
    lines.forEach(([label, value]) => {
      const p = document.createElement("p");
      if (label) {
        const strong = document.createElement("strong");
        strong.textContent = label + " ";
        p.append(strong);
      }
      p.append(document.createTextNode(value));
      p.style.color = ok ? "#087f5b" : "#b54732";
      result.append(p);
    });
  }

  async function verify() {
    const code = input.value.trim().toUpperCase();

    if (!pattern.test(code)) {
      show([[null, "رقم الشهادة غير صحيح. الصيغة: TA- ثم 8 أحرف أو أرقام."]], false);
      return;
    }

    button.disabled = true;

    try {
      const { data, error } = await getClient().rpc("verify_certificate", { p_code: code });
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;

      if (!row) {
        show([[null, "✗ لا توجد شهادة بهذا الرقم."]], false);
        return;
      }

      show([
        [null, "✓ شهادة صحيحة"],
        ["الاسم:", row.student_name],
        ["الدورة:", row.course_title],
        ["تاريخ الإصدار:", new Date(row.issued_at).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" })]
      ], true);
    } catch (error) {
      console.error(error);
      show([[null, "تعذّر التحقق الآن. حاول لاحقًا."]], false);
    } finally {
      button.disabled = false;
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    verify();
  });

  const fromUrl = new URLSearchParams(window.location.search).get("code");

  if (fromUrl) {
    input.value = fromUrl.slice(0, 12);
    verify();
  }
})();
