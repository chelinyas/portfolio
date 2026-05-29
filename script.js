const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll(".site-nav a");
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);

  let current = "";
  document.querySelectorAll("main section[id]").forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("no-scroll", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});


// Minimal DAX + SQL typewriter animation
const logicCodeArea = document.getElementById("logicCodeArea");
const codePill = document.getElementById("codePill");
const dotDax = document.getElementById("dotDax");
const dotSql = document.getElementById("dotSql");

if (logicCodeArea && codePill && dotDax && dotSql) {
  const phases = [
    {
      type: "DAX",
      code: [
        { text: "Total Sales", cls: "logic-object" },
        { text: " =\n", cls: "" },
        { text: "SUMX", cls: "logic-function" },
        { text: "(\n    ", cls: "" },
        { text: "Sales", cls: "logic-object" },
        { text: ",\n    ", cls: "" },
        { text: "Sales", cls: "logic-object" },
        { text: "[Quantity] * ", cls: "" },
        { text: "Sales", cls: "logic-object" },
        { text: "[Unit Price]\n)", cls: "" }
      ]
    },
    {
      type: "SQL",
      code: [
        { text: "SELECT", cls: "logic-keyword" },
        { text: " TOP (100)\n    CustomerName,\n    ProductName,\n    SalesAmount\n", cls: "" },
        { text: "FROM", cls: "logic-keyword" },
        { text: " Sales\n", cls: "" },
        { text: "ORDER BY", cls: "logic-keyword" },
        { text: " SalesAmount DESC;", cls: "" }
      ]
    }
  ];

  let phaseIndex = 0;
  let segmentIndex = 0;
  let charIndex = 0;
  let output = "";

  function logicSpan(text, className) {
    if (!className) return text;
    return `<span class="${className}">${text}</span>`;
  }

  function setLogicPhase(phase) {
    codePill.textContent = phase.type;
    dotDax.classList.toggle("active", phase.type === "DAX");
    dotSql.classList.toggle("active", phase.type === "SQL");
  }

  function typeLogicPhase() {
    const phase = phases[phaseIndex];

    if (segmentIndex >= phase.code.length) {
      setTimeout(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        segmentIndex = 0;
        charIndex = 0;
        output = "";
        logicCodeArea.innerHTML = "";
        setLogicPhase(phases[phaseIndex]);
        typeLogicPhase();
      }, 2200);
      return;
    }

    const segment = phase.code[segmentIndex];
    const nextChar = segment.text[charIndex];

    if (nextChar !== undefined) {
      output += logicSpan(nextChar, segment.cls);
      logicCodeArea.innerHTML = output;
      charIndex++;
      setTimeout(typeLogicPhase, nextChar === "\n" ? 120 : 24);
    } else {
      segmentIndex++;
      charIndex = 0;
      setTimeout(typeLogicPhase, 80);
    }
  }

  setLogicPhase(phases[phaseIndex]);
  setTimeout(typeLogicPhase, 500);
}
