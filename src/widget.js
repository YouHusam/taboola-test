(function () {
  const WIDGET_CONTAINER_CLASS = 'taboola-widget-container';
  const LOADED_WIDGET_CLASS_NAME = WIDGET_CONTAINER_CLASS + "--loaded";

  const recommendationsTypeMap = {
    organic: {
      title: 'More For You',
      hasBadge: false,
      className: "taboola-widget-organic",
      getItemHtml: function (_item) {
        return "Organic not handled"
      },
    },
    sponsor: {
      title: 'Ad Content',
      hasBadge: true,
      className: "taboola-widget-sponsor",
      getItemHtml: function (item) {
        return (
          '<a href="' + item.url + '" target="_blank" class="taboola-item-link">' +
          '<span class="taboola-item-thumbnail" ' +
          'style="background-image: url(' + item.thumbnail[0].url + ')" ' +
          'title="' + item.name + '"></span>' +
          '<span class="taboola-item-text">' +
          '<span class="taboola-item-name">' + item.name + '</span>' +
          '<span class="taboola-item-branding">' + item.branding + '</span>' +
          '</span>' +
          '</a>'
        );
      }
    }
  }

  function getItemsFromUrl(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200)
        callback(JSON.parse(xhr.responseText));
    };
    xhr.send();
  }

  /**
   * Get widget HTML
   * @param recommendationsType {'organic' | 'sponsor'} - Recommendations type
   * @param items {Array} - Recommendations items
   * @returns {string}
   */
  function getWidgetHtml(recommendationsType, items) {
    const widgetTitle = recommendationsTypeMap[recommendationsType].title +
      (recommendationsTypeMap[recommendationsType].hasBadge ? ' <span class="taboola-widget-title-badge">By Taboola</span>' : '');
    let widgetContent = '';

    items.forEach(function (item) {
      widgetContent += '<div class="taboola-widget-item">' + recommendationsTypeMap[recommendationsType].getItemHtml(item) + '</div>';
    });

    return (
      '<h5 class="taboola-widget-title">' +
      widgetTitle +
      '</h5>' +
      '<div class="taboola-widget-content">' + widgetContent + '</div>'
    );
  }

  /**
   * Add widget logic to an html element
   * @param element {HTMLElement} - HTML element
   */
  function addWidgetToElement(element) {
    if (element.className.includes(LOADED_WIDGET_CLASS_NAME)) {
      return;
    }

    // Get attributes from html
    const recommendationsType = element.getAttribute('data-recommendations-type') || 'sponsor';
    const sourceType = element.getAttribute('data-source-type') || 'video';
    const sourceId = element.getAttribute('data-source-id') || '';
    const sourceUrl = element.getAttribute('data-source-url') || '';
    const count = element.getAttribute('data-count') || 4;

    // Get API URL
    const apiUrl = window.taboola.getApiUrl({
      sourceType: sourceType,
      sourceId: sourceId,
      sourceUrl: sourceUrl,
      count: count
    });

    // Get items form url and populate DOM
    getItemsFromUrl(apiUrl, function (items) {
      element.innerHTML = getWidgetHtml(recommendationsType, items.list);
    });

    // Remove the original class to optimize performance
    element.className = LOADED_WIDGET_CLASS_NAME + ' ' + recommendationsTypeMap[recommendationsType].className;
  }

  /**
   * Add widgets to the page
   */
  function addWidgets() {
    // Find all elements with Taboola widget class
    const widgetContainers = document.getElementsByClassName(WIDGET_CONTAINER_CLASS);

    // Using this instead of Array.from() to support older browsers
    Array.prototype.forEach.call(widgetContainers, addWidgetToElement);
  }

  function setupAll() {
    // Listen to dynamically added DOM content e.g. React components...
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        addWidgets();
      });
    });

    observer.observe(document.body, { attributes: false, childList: true, subtree: true });

    // remove observer when document is unloaded
    window.addEventListener('beforeunload', function () {
      observer.disconnect();
    });

    addWidgets();
  }

  setupAll();
})();
