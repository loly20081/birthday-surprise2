
const $ = (selector) => document.querySelector(selector);

const intro = $("#intro");
const app = $("#app");
const modal = $("#modal");

const sections = [
  $("#cake-section"),
  $("#scrapbook-section"),
  $("#message-section")
];

let soundEnabled = false;
let complimentIndex = 0;
let confettiAnimation = null;

const compliments = [
  "وجودك لحاله يخلّي اليوم أحلى 🩷",
  "أتمنى ضحكتك ما تفارقك أبدًا ✨",
  "أنت تستاهل كل الأشياء الحلوة في الدنيا 🤍",
  "لا تنسى إنك شخص مميز بطريقتك الخاصة 🌷",
  "عسى سنتك الجديدة تكون أجمل من كل توقعاتك 🎂"
];

const messages = {
  letter: {
    emoji: "💌",
    title: "رسالة صغيرة لك",
    text: "حتى لو كانت الهدية بسيطة، أتمنى إنها ترسم ابتسامة على وجهك. كل عام وأنت بخير، وعسى أيامك كلها فرح."
  },
  gift: {
    emoji: "🎁",
    title: "مفاجأتك!",
    text: "هدية اليوم هي تذكير لك بأنك تستاهل الفرح واللحظات الجميلة. أتمنى لك سنة مليانة أشياء تحبها وأمنيات تتحقق."
  },
  compliment: {
    emoji: "🩷",
    title: "شيء لازم تعرفه",
    text: ""
  }
};

function showSection(section) {
  sections.forEach((item) => {
    item.hidden = item !== section;
  });

  section.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openModal({ emoji, title, text }) {
  $("#modal-emoji").textContent = emoji;
  $("#modal-title").textContent = title;
  $("#modal-text").textContent = text;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

function startSurprise() {
  intro.hidden = true;
  app.hidden = false;

  sections.forEach((section) => {
    section.hidden = true;
  });

  $("#section-greeting")?.scrollIntoView({ behavior: "smooth" });
  $(".greeting").scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#btn-start").addEventListener("click", startSurprise);

$("#btn-accept").addEventListener("click", () => {
  $("#cake-section").hidden = false;
  $("#cake-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

$("#btn-decline").addEventListener("click", () => {
  $("#decline-tease").hidden = false;

  const button = $("#btn-decline");
  button.textContent = "طيب أقبل! 😂";
  button.classList.remove("secondary");
  button.classList.add("primary");

  button.onclick = () => {
    $("#btn-accept").click();
  };
});

$("#btn-wish").addEventListener("click", () => {
  $("#wish-hint").hidden = false;
  $("#btn-blow").hidden = false;
  $("#btn-wish").textContent = "تمت الأمنية ✨";
  $("#btn-wish").disabled = true;
});

$("#btn-blow").addEventListener("click", () => {
  $("#wish-done").hidden = false;
  $("#btn-next").hidden = false;
  $("#btn-blow").hidden = true;
  $("#btn-wish").hidden = true;

  celebrate();
});

$("#btn-next").addEventListener("click", () => {
  showSection($("#scrapbook-section"));
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if (action === "message") {
      showSection($("#message-section"));
      return;
    }

    if (action === "letter" || action === "gift") {
      openModal(messages[action]);
      return;
    }

    if (action === "compliment") {
      complimentIndex = (complimentIndex + 1) % compliments.length;

      openModal({
        emoji: "💗",
        title: "قد إيش أنت مميز!",
        text: compliments[complimentIndex]
      });

      return;
    }
  });
});

$("#modal-close").addEventListener("click", closeModal);
$("#modal-ok").addEventListener("click", closeModal);

modal.querySelectorAll("[data-close]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

$("#btn-celebrate").addEventListener("click", celebrate);

$("#btn-restart").addEventListener("click", () => {
  closeModal();
  intro.hidden = false;
  app.hidden = true;

  sections.forEach((section) => {
    section.hidden = true;
  });

  $("#cake-section").hidden = true;
  $("#scrapbook-section").hidden = true;
  $("#message-section").hidden = true;

  $("#wish-hint").hidden = true;
  $("#wish-done").hidden = true;
  $("#btn-blow").hidden = true;
  $("#btn-next").hidden = true;
  $("#btn-wish").hidden = false;
  $("#btn-wish").disabled = false;
  $("#btn-wish").textContent = "تمنَّ أمنية ✨";
  $("#decline-tease").hidden = true;

  window.scrollTo({ top: 0, behavior: "smooth" });
});

function celebrate() {
  const canvas = $("#confetti-canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    burstHearts();
    return;
  }

  if (confettiAnimation) {
    cancelAnimationFrame(confettiAnimation);
  }

  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const colors = [
    "#f5a9c2",
    "#b0dbed",
    "#c7b4f6",
    "#f8d491",
    "#ef9393"
  ];

  const pieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -Math.random() * window.innerHeight,
    size: 4 + Math.random() * 7,
    speed: 2 + Math.random() * 4,
    drift: Math.random() * 2 - 1,
    rotation: Math.random() * 6,
    spin: Math.random() * 0.12 - 0.06,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let frames = 0;

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotation += piece.spin;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size * 1.5
      );
      ctx.restore();
    });

    frames += 1;

    if (frames < 180) {
      confettiAnimation = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      confettiAnimation = null;
    }
  }

  draw();
  burstHearts();
}

function burstHearts() {
  const layer = $("#burst-layer");
  const symbols = ["💗", "💖", "✨", "💕", "🌸"];

  for (let i = 0; i < 22; i += 1) {
    const heart = document.createElement("span");

    heart.className = "burst-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 95}%`;
    heart.style.top = `${45 + Math.random() * 45}%`;
    heart.style.fontSize = `${16 + Math.random() * 22}px`;

    layer.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }
}

$("#sound-toggle").addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  $("#sound-toggle").textContent = soundEnabled ? "🔔" : "🔇";

  openModal({
    emoji: soundEnabled ? "🔔" : "🔇",
    title: soundEnabled ? "الصوت مفعّل" : "الصوت مكتوم",
    text: soundEnabled
      ? "تم تفعيل حالة زر الصوت. هذه النسخة لا تحتوي على ملف موسيقى مرفق."
      : "تم كتم حالة زر الصوت."
  });
});


