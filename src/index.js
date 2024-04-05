(function () {
  const SCRIPTS_TO_APPEND = [
    { src: "src/widget-wrapper.js" }
  ];
  const STYLESHEETS_TO_APPEND = [
    { src: "src/widget.css" }
  ];

  document._taboola = {};

  document.addEventListener("DOMContentLoaded", function () {
    SCRIPTS_TO_APPEND.forEach(function (script) {
      const scriptElement = document.createElement("script");
      scriptElement.setAttribute("src", "//localhost:8080/" + script.src);
      document.body.appendChild(scriptElement);
    });
    STYLESHEETS_TO_APPEND.forEach(function (stylesheet) {
      const linkElement = document.createElement("link");
      linkElement.setAttribute("rel", "stylesheet");
      linkElement.setAttribute("href", "//localhost:8080/" + stylesheet.src);
      document.head.appendChild(linkElement);
    });
  });
})();
