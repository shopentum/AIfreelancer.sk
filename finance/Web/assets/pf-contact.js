(function () {
  var API = "/api/prusafinance/contact";

  function pfBasePath() {
    var p = window.location.pathname || "";
    return p.indexOf("/prusafinance/") === 0 ? "/prusafinance" : "";
  }

  function resolveForm(event) {
    if (event && event.currentTarget && event.currentTarget.tagName === "FORM") {
      return event.currentTarget;
    }
    var t = event && event.target;
    if (t && t.tagName === "FORM") return t;
    if (t && t.form) return t.form;
    if (t && t.closest) return t.closest("form");
    return null;
  }

  function readForm(form) {
    var fd = new FormData(form);
    var pills = form.querySelectorAll(".pill.on");
    var temata = [];
    for (var i = 0; i < pills.length; i++) {
      temata.push((pills[i].textContent || "").trim());
    }
    return {
      tag: form.getAttribute("data-pf-tag") || "",
      jmeno: (fd.get("jmeno") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      kontakt: (fd.get("kontakt") || "").toString().trim(),
      zprava: (fd.get("zprava") || "").toString().trim(),
      temata: temata.join(", "),
      placement: form.getAttribute("data-pf-placement") || "",
    };
  }

  function thankYouUrl(form) {
    var base = pfBasePath();
    var tag = form.getAttribute("data-pf-tag") || "";
    var q = "form=" + encodeURIComponent(tag);
    if (form.getAttribute("data-pf-pdf") === "1") q += "&pdf=1";
    var placement = form.getAttribute("data-pf-placement");
    if (placement) q += "&placement=" + encodeURIComponent(placement);
    return base + "/dekujeme.html?" + q;
  }

  function setLoading(form, on) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    if (on) {
      if (!btn.getAttribute("data-pf-label")) {
        btn.setAttribute("data-pf-label", btn.textContent || "");
      }
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      btn.textContent = "Odesílám…";
    } else {
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
      var prev = btn.getAttribute("data-pf-label");
      if (prev) btn.textContent = prev;
      form.removeAttribute("data-pf-sending");
    }
  }

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    var form = resolveForm(event);
    if (
      !form ||
      (!form.getAttribute("data-pf-form") && !form.getAttribute("data-pf-lead"))
    ) {
      return false;
    }
    if (form.getAttribute("data-pf-sending") === "1") return false;

    if (typeof form.reportValidity === "function" && !form.reportValidity()) {
      return false;
    }

    var payload = readForm(form);
    if (!payload.tag) return false;

    form.setAttribute("data-pf-sending", "1");
    setLoading(form, true);

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        return r.json().then(function (data) {
          return { ok: r.ok, data: data };
        });
      })
      .then(function (res) {
        if (res.ok && res.data && res.data.ok) {
          window.location.href = thankYouUrl(form);
          return;
        }
        var msg =
          (res.data && res.data.error) ||
          "Odeslání se nepodařilo. Zkuste to prosím znovu.";
        alert(msg);
        setLoading(form, false);
      })
      .catch(function () {
        alert("Odeslání se nepodařilo. Zkuste to prosím znovu.");
        setLoading(form, false);
      });

    return false;
  }

  window.pfFormSubmit = handleSubmit;

  function bindForms() {
    var forms = document.querySelectorAll("form[data-pf-form], form[data-pf-lead]");
    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      if (form.getAttribute("data-pf-bound") === "1") continue;
      form.setAttribute("data-pf-bound", "1");
      form.addEventListener("submit", handleSubmit);
      var btn = form.querySelector('[type="submit"]');
      if (btn) {
        btn.style.pointerEvents = "auto";
        btn.style.cursor = "pointer";
      }
    }
  }

  var style = document.createElement("style");
  style.textContent =
    "form[data-pf-form] [type=submit],form[data-pf-lead] [type=submit]{pointer-events:auto!important;cursor:pointer!important}" +
    "form[data-pf-form] [type=submit]:disabled,form[data-pf-lead] [type=submit]:disabled{opacity:.75;cursor:wait!important}";
  document.head.appendChild(style);

  bindForms();
  document.addEventListener("DOMContentLoaded", bindForms);
  window.addEventListener("pageshow", function () {
    document.querySelectorAll("form[data-pf-form], form[data-pf-lead]").forEach(function (form) {
      setLoading(form, false);
    });
  });
})();
