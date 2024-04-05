(function () {
  const WIDGET_CONTAINER_CLASS = 'taboola-widget-container';

  const recommendationsTypeMap = {
    organic: {
      title: 'More For You',
      hasBadge: false,
      className: "taboola-widget-organic",
      getItemHtml: function (item) {
        return ""
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

  /**
   * Get widget HTML
   * @param recommendationsType {'organic' | 'sponsor'} - Recommendations type
   * @param sourceType {String} - Source type
   * @param sourceId {String} - Source ID
   * @param sourceUrl {String} - Source URL
   * @param count {Number} - Number of recommendations to fetch
   * @returns {string}
   */
  function getWidgetHtml(recommendationsType, sourceType, sourceId, sourceUrl, count) {
    const widgetTitle = recommendationsTypeMap[recommendationsType].title +
      (recommendationsTypeMap[recommendationsType].hasBadge ? ' <span class="taboola-widget-title-badge">By Taboola</span>' : '');
    let widgetContent = '';

    response.list.forEach(function (item) {
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
   * Add widgets to the page
   */
  function addWidgets() {
    const widgetContainers = document.getElementsByClassName(WIDGET_CONTAINER_CLASS);
    Array.prototype.forEach.call(widgetContainers, function (container) {
      const loadedClassName = WIDGET_CONTAINER_CLASS + "--loaded";
      if (container.className.includes(loadedClassName)) {
        return;
      }
      const recommendationsType = container.getAttribute('data-recommendations-type') || 'sponsor';
      const sourceType = container.getAttribute('data-source-type') || 'video';
      const sourceId = container.getAttribute('data-source-id') || '';
      const sourceUrl = container.getAttribute('data-source-url') || '';
      const count = container.getAttribute('data-count') || 4;
      container.innerHTML = getWidgetHtml(recommendationsType, sourceType, sourceId, sourceUrl, count);
      // Remove the original class to optimize performance
      container.className = loadedClassName + ' ' + recommendationsTypeMap[recommendationsType].className;
    });
  }

  // Listen to dynamically added DOM content e.g. React components...
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      addWidgets();
    });
  });

  observer.observe(document.body, { attributes: false, childList: true, subtree: true });

  // Expose the function to the global scope
  addWidgets();
})();
