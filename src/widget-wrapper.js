(function () {
  const WIDGET_CONTAINER_CLASS = 'taboola-widget-container';

  const widgetHtml =
    "<h5 class=\"widget-title\">" +
      "Ad Content<span class=\"widget-title__badge\">By Taboola</span>" +
    "</h5>" +
    "<div class=\"widget-content\"></div>"
  ;

  // Add widgets to the DOM
  function addWidgets() {
    const widgetContainers = document.getElementsByClassName(WIDGET_CONTAINER_CLASS);
      const loadedClassName = WIDGET_CONTAINER_CLASS + "--loaded";
    Array.prototype.forEach.call(widgetContainers, function (container) {
      if (container.className.includes(loadedClassName)) {
        return;
      }
      container.innerHTML = widgetHtml.trim();
      container.className += " " + loadedClassName;
    });
  }

  // Listen to dynamically added DOM content eg React components...
  // Create a new observer instance
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      console.log('DOM content updated');
      addWidgets();
    });
  });

  // Configuration of the observer
  const config = { attributes: false, childList: true, subtree: true };

  observer.observe(document.body, config);

  // Expose the function to the global scope
  addWidgets();
})();
