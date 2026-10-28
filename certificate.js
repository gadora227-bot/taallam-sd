const params = new URLSearchParams(window.location.search);

    const courses = {
      programming: {
        title: "Introduction to Programming",
        art: `
          <path d="M110 70L55 125L110 180"/>
          <path d="M190 70L245 125L190 180"/>
          <path d="M165 55L135 195"/>
          <rect x="65" y="205" width="170" height="45" rx="8"/>
          <path d="M85 225h35m15 0h40m15 0h25"/>
        `
      },
      english: {
        title: "English from Scratch",
        art: `
          <rect x="55" y="45" width="190" height="150" rx="18"/>
          <path d="M90 85h115M90 115h90M90 145h65"/>
          <circle cx="210" cy="215" r="30"/>
          <path d="M195 215h30M210 200v30"/>
          <path d="M40 230h80"/>
        `
      },
      computer: {
        title: "Computer Fundamentals",
        art: `
          <rect x="45" y="55" width="210" height="135" rx="12"/>
          <path d="M150 190v35M110 225h80"/>
          <rect x="75" y="240" width="150" height="25" rx="5"/>
          <path d="M90 252h10m12 0h10m12 0h10m12 0h10"/>
        `
      },
      math: {
        title: "Everyday Mathematics",
        art: `
          <path d="M45 225L125 70L205 225Z"/>
          <circle cx="215" cy="95" r="35"/>
          <path d="M215 75v40M195 95h40"/>
          <path d="M65 250h160M150 45v25"/>
        `
      },
      career: {
        title: "Career Readiness",
        art: `
          <rect x="60" y="100" width="180" height="130" rx="12"/>
          <path d="M115 100V75h70v25M60 145h180"/>
          <path d="M95 180l20 20 45-45"/>
          <path d="M185 185h30"/>
        `
      },
      safety: {
        title: "Digital Safety",
        art: `
          <path d="M150 40L235 75V140Q225 205 150 250Q75 205 65 140V75Z"/>
          <rect x="120" y="115" width="60" height="50" rx="8"/>
          <path d="M132 115v-15a18 18 0 0136 0v15"/>
          <circle cx="150" cy="137" r="5"/>
          <path d="M150 142v10"/>
        `
      }
    };

    const courseId = params.get("course") || "programming";
    const known = courses[courseId];
    const course = known || { title: "", art: "" };

    const arabicTitles = {english: "الإنجليزية من البداية", computer: "أساسيات الكمبيوتر", programming: "مدخل إلى البرمجة", math: "الرياضيات اليومية", career: "الاستعداد لسوق العمل", safety: "السلامة الرقمية"};

    function showCertificateError(text) {
      document.body.innerHTML =
        '<p style="font-family:sans-serif;text-align:center;margin:20vh 20px;' +
        'font-size:1.1rem;line-height:1.8">' + text +
        '<br><a href="index.html">العودة إلى الموقع / Back to site</a></p>';
    }

    // الشهادة تُقرأ من قاعدة البيانات فقط، فلا يمكن تزويرها بتعديل الرابط.
    async function loadCertificate() {
      try {
        const client = window.taallamSupabase;
        if (!client) throw new Error("no client");

        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData.session?.user;

        if (!user) {
          window.location.replace("login.html");
          return;
        }

        const { data: rows, error } = await client
          .from("certificates")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId)
          .limit(1);

        if (error) throw error;

        const cert = rows && rows[0];

        if (!cert) {
          showCertificateError(
            "لم نجد شهادة لهذه الدورة في حسابك. أكمل الدورة أولاً.<br>" +
            "No certificate found for this course in your account."
          );
          return;
        }

        const issued = new Date(cert.issued_at || cert.created_at || Date.now());

        const date = issued.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });

        // رقم ثابت لا يتغير عند إعادة فتح الصفحة.
        const rawId = String(
          cert.certificate_id || cert.id ||
          (user.id.slice(0, 5) + courseId.slice(0, 3))
        );

        const certificateId =
          "TA-" + rawId.replace(/-/g, "").slice(0, 8).toUpperCase();

        document.getElementById("studentName").textContent =
          cert.student_name || "Student";
        document.getElementById("courseName").textContent = course.title;
        document.getElementById("courseNameAr").textContent = cert.course_title || arabicTitles[courseId] || "";
        document.getElementById("completionDate").textContent = date;
        document.getElementById("certificateId").textContent = certificateId;
        document.getElementById("courseArt").innerHTML = course.art;

        /*
          QR يحمل رقم الشهادة فقط في هذا النموذج.
          التحقق الحقيقي يحتاج صفحة verify.html وقاعدة بيانات.
        */
        const verifyUrl = new URL("verify.html", window.location.href);
        verifyUrl.searchParams.set("code", certificateId);

        const qr = new URL("https://api.qrserver.com/v1/create-qr-code/");
        qr.searchParams.set("size", "180x180");
        qr.searchParams.set("data", verifyUrl.href);
        document.getElementById("qrCode").src = qr.toString();
      } catch (error) {
        console.error("تعذّر تحميل الشهادة:", error);
        showCertificateError(
          "تعذّر تحميل الشهادة. تحقق من الاتصال ثم أعد المحاولة.<br>" +
          "Could not load the certificate."
        );
      }
    }

    loadCertificate();

document.getElementById("printBtn")?.addEventListener("click", () => window.print());
document.getElementById("closeBtn")?.addEventListener("click", () => window.close());
