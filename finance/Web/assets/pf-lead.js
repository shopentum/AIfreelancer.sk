(function () {
  function pfBasePath() {
    var p = window.location.pathname || "";
    return p.indexOf("/prusafinance/") === 0 ? "/prusafinance" : "";
  }

  function readForm(form) {
    var fd = new FormData(form);
    return {
      tag: form.getAttribute("data-pf-tag") || "",
      jmeno: (fd.get("jmeno") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      kontakt: (fd.get("kontakt") || "").toString().trim(),
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
      btn.setAttribute("data-pf-label", btn.textContent || "");
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
    var form = event.target;
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
})();
