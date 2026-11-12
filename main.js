(function () {
  "use strict";
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  fetch("./data/index.json")
    .then(function (r) { return r.json(); })
    .then(function (index) {
      var entries = (index && index.entries) || [];
      var tbody = document.getElementById("catalog-body");
      if (!tbody) return;
      var rows = entries.map(function (e) {
        var href = "./sites/" + encodeURIComponent(e.slug) + "/";
        var title = e.title || e.slug || "";
        var thumb = e.thumb || "";
        var img = thumb
          ? '<a href="' + href + '"><img class="thumb" src="' + esc(thumb) + '" alt="' + esc(title) + '" loading="lazy"></a>'
          : '<a href="' + href + '">Open</a>';
        return '<tr><td class="thumb-cell">' + img + '</td><td><a href="' + href + '">' + esc(title) + '</a></td></tr>';
      });
      tbody.innerHTML = rows.join("");
    })
    .catch(function (err) {
      var tbody = document.getElementById("catalog-body");
      if (tbody) tbody.innerHTML = '<tr><td colspan="2">Could not load catalog.</td></tr>';
      console.error(err);
    });
})();
