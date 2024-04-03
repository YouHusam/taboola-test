(function () {
  const WIDGET_CONTAINER_CLASS = 'widget-container';

  // Add widgets to the DOM
  function addWidgets() {
    const widgetContainers = document.getElementsByClassName(WIDGET_CONTAINER_CLASS);
    Array.from(widgetContainers).forEach((container) => {
      if (container.className.includes('widget-container--loaded')) {
        return;
      }
      const widget = document.createElement('div');
      widget.innerHTML = 'Hello, World! from file';
      container.appendChild(widget);
      container.className += ' widget-container--loaded';
    });
  }

  // Listen to dynamically added DOM content eg React components...
  // Create a new observer instance
  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      console.log('DOM content updated');
      document._taboola.addWidgets();
    });
  });

  // Configuration of the observer
  let config = { attributes: false, childList: true, subtree: true };

  observer.observe(document.body, config);

  // Expose the function to the global scope
  document._taboola.addWidgets = addWidgets;
  addWidgets();
})();
