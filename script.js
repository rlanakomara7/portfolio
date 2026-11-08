(function () {
  var EMAIL = "rlanakomara7@gmail.com";
  var $ = function (s, r) { return (r || document).querySelector(s); };

  // Mobile nav
  var burger = $(".burger"), nav = $("nav");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
  }

  // Project filter
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
      var cat = btn.dataset.filter;
      document.querySelectorAll(".proj").forEach(function (p) {
        p.hidden = !(cat === "all" || p.dataset.cat === cat);
      });
    });
  });

  // Contact form
  var form = $("#contact-form");
  if (!form) return;
  var status = $("#form-status"), btn = $("#send-btn");
  var type = new URLSearchParams(location.search).get("type");
  if (type === "hire") $("#inquiry").value = "Job opportunity";

  function show(msg, ok) {
    status.hidden = false;
    status.className = "status " + (ok ? "ok" : "err");
    status.textContent = msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var d = new FormData(form);
    if (d.get("_honey")) return;
    var data = {
      name: d.get("name"), email: d.get("email"), phone: d.get("phone") || "-",
      inquiry: d.get("inquiry"), message: d.get("message"),
      _subject: "[Portfolio] " + d.get("inquiry") + " from " + d.get("name"),
      _replyto: d.get("email"), _template: "table", _captcha: "false"
    };
    btn.disabled = true; btn.textContent = "Sending…";
    fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r.success === "true" || r.success === true) {
          show("Message sent. Thanks, " + data.name + "! I will reply to " + data.email + " soon.", true);
          form.reset();
        } else { throw new Error(r.message || "failed"); }
      })
      .catch(function () {
        var body = data.message + "\n\n— " + data.name + " (" + data.email + ", " + data.phone + ")";
        location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
        show("The form service is unreachable, so your email app was opened with the message filled in. You can also write to " + EMAIL + " directly.", false);
      })
      .finally(function () { btn.disabled = false; btn.textContent = "Send message"; });
  });
})();
