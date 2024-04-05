(function () {
  const WIDGET_CONTAINER_CLASS = 'taboola-widget-container';

  const widgetHtml = `
    <h5 class="widget-title">
      Ad Content <span class="widget-title__badge">By Taboola</span>
    </h5>
    <div class="widget-content">
    </div>
`;

  // Add widgets to the DOM
  function addWidgets() {
    const widgetContainers = document.getElementsByClassName(WIDGET_CONTAINER_CLASS);
    Array.from(widgetContainers).forEach((container) => {
      if (container.className.includes(`${ WIDGET_CONTAINER_CLASS }--loaded`)) {
        return;
      }
      container.innerHTML = widgetHtml.trim();
      container.className += ` ${ WIDGET_CONTAINER_CLASS }--loaded`;
    });
  }

  // Listen to dynamically added DOM content eg React components...
  // Create a new observer instance
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      console.log('DOM content updated');
      document._taboola.addWidgets();
    });
  });

  // Configuration of the observer
  const config = { attributes: false, childList: true, subtree: true };

  observer.observe(document.body, config);

  // Expose the function to the global scope
  document._taboola.addWidgets = addWidgets;
  addWidgets();
})();
