(function () {
  function pfBasePath() {
    var p = window.location.pathname || "";
    return p.indexOf("/prusafinance/") === 0 ? "/prusafinance" : "";
  }

  function resolveForm(event) {
    if (event.currentTarget && event.currentTarget.tagName === "FORM") {
      return event.currentTarget;
    }
    var t = event.target;
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
      btn.textContent = "Odesílám…";
    } else {
      btn.disabled = false;
      var prev = btn.getAttribute("data-pf-label");
      if (prev) btn.textContent = prev;
    }
  }

  window.pfLeadSubmit = function (event) {
    event.preventDefault();
    var form = resolveForm(event);
    if (!form || !form.getAttribute("data-pf-lead")) return false;

    var payload = readForm(form);
    if (!payload.tag) return false;

    setLoading(form, true);

    fetch("/api/prusafinance/lead", {
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
  };

  function bindForms() {
    var forms = document.querySelectorAll("form[data-pf-lead]");
    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      if (form.getAttribute("data-pf-bound") === "1") continue;
      form.setAttribute("data-pf-bound", "1");
      form.addEventListener("submit", function (e) {
        window.pfLeadSubmit(e);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindForms);
  } else {
    bindForms();
  }
})();
