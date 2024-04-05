(function () {
  const TABOOLA_API = 'https://api.taboola.com/1.0/json';

  const SCRIPTS_TO_APPEND = [
    { src: 'src/widget-wrapper.js' }
  ];
  const STYLESHEETS_TO_APPEND = [
    { src: 'src/widget.css' }
  ]

  /**
   * Create Taboola API URL generator
   * @param publisherId
   * @param appType
   * @param apiKey
   * @returns {function({sourceType: string, sourceId: string, sourceUrl: string, count: number}): string}
   */
  const createApiUrl = function (publisherId, appType, apiKey) {
    /**
     * Get Taboola API URL
     * @param urlOptions {Object} - URL options
     * @param urlOptions.sourceType {String} - Source type
     * @param urlOptions.sourceId {String} - Source ID
     * @param urlOptions.sourceUrl {String} - Source URL
     * @param urlOptions.count {Number} - Number of recommendations to fetch
     */
    return function (urlOptions) {
      const sourceType = urlOptions.sourceType || 'video';
      const sourceId = urlOptions.sourceId || '';
      const sourceUrl = urlOptions.sourceUrl || '';
      const count = urlOptions.count || 4;
      return TABOOLA_API + '/' + publisherId + '/recommendations.get' +
        '?app.type=' + appType + '&app.apikey=' + apiKey +
        '&source.type=' + sourceType + '&source.id=' + sourceId + '&source.url=' + sourceUrl
        + '&count=' + count;
    }
  };

  /**
   * Initialize Taboola API
   * @param options {Object} - Configuration options
   * @param options.publisherId {String} - Taboola publisher ID
   * @param options.appType {String} - Taboola app type
   * @param options.apiKey {String} - Taboola API key
   */
  function init(options) {
    if (!(options.publisherId && options.appType && options.apiKey)) {
      throw new Error('Taboola API requires publisherId, appType and apiKey');
    }

    SCRIPTS_TO_APPEND.forEach(function (script) {
      const scriptElement = document.createElement('script');
      scriptElement.setAttribute('src', '//localhost:8080/' + script.src);
      document.body.appendChild(scriptElement);
    });
    STYLESHEETS_TO_APPEND.forEach(function (stylesheet) {
      const linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.setAttribute('href', '//localhost:8080/' + stylesheet.src);
      document.head.appendChild(linkElement);
    });
    window.taboola.getApiUrl = createApiUrl(options.publisherId, options.appType, options.apiKey);
  }

  /**
   * Expose the api to the global scope
   * @type {{init: init, getApiUrl: function({sourceType: string, sourceId: string, sourceUrl: string}): string}}
   * @public
   */
  window.taboola = {
    init: init,
    getApiUrl: function () {
      throw new Error('Taboola API not initialized');
    }
  };
})();
