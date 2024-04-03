(function () {
  const SCRIPTS_TO_APPEND = [
    { src: "src/html-wrapper.js" }
  ];

  document._taboola = {};

  document.addEventListener("DOMContentLoaded", function () {
    SCRIPTS_TO_APPEND.forEach(function (script) {
      var scriptElement = document.createElement("script");
      scriptElement.setAttribute("src", "//localhost:8080/" + script.src);
      document.body.appendChild(scriptElement);
    });
  });
})();
