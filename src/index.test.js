describe('Taboola API', () => {
  beforeEach((done) => {
    const script = document.createElement('script');
    script.src = 'src/index.js';
    document.head.appendChild(script);
    script.onload = function () {
      done(); // Indicate that the script has loaded and the tests can begin
    };
  });

  afterEach(() => {
    // Make sure mutations are not being observed
    window.dispatchEvent(new Event('beforeunload'));
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('throws an error when not initialized', () => {
    expect(() => window.taboola.getApiUrl()).toThrow('Taboola API not initialized');
  });

  it('initializes with valid options', () => {
    const options = {
      publisherId: 'testPublisher',
      appType: 'testApp',
      apiKey: 'testKey',
      cdnUrl: '//localhost:8089/src'
    };
    expect(() => window.taboola.init(options)).not.toThrow();
  });

  it('throws an error when initialized with invalid options', () => {
    const options = {
      publisherId: 'testPublisher',
      appType: 'testApp'
      // Missing apiKey
    };
    expect(() => window.taboola.init(options)).toThrow('Taboola API requires publisherId, appType and apiKey');
  });

  it('generates correct API URL', () => {
    const options = {
      publisherId: 'testPublisher',
      appType: 'testApp',
      apiKey: 'testKey',
      cdnUrl: '//localhost:8089/src'
    };
    window.taboola.init(options);
    const urlOptions = {
      sourceType: 'video',
      sourceId: 'testSource',
      sourceUrl: 'testUrl',
      count: 4
    };
    const expectedUrl = 'https://api.taboola.com/1.0/json/testPublisher/recommendations.get?app.type=testApp&app.apikey=testKey&source.type=video&source.id=testSource&source.url=testUrl&count=4';
    expect(window.taboola.getApiUrl(urlOptions)).toBe(expectedUrl);
  });

  it('adds scripts and stylesheets to dom on init', () => {
    let scripts = document.querySelectorAll('script');
    const oldScriptsLength = scripts.length;
    const options = {
      publisherId: 'testPublisher',
      appType: 'testApp',
      apiKey: 'testKey',
      cdnUrl: '//localhost:8089/src'
    };
    window.taboola.init(options);
    scripts = document.querySelectorAll('script');
    expect(scripts.length).toBe(oldScriptsLength + 1);
    expect(scripts[scripts.length - 1].src).toBe('http://localhost:8089/src/widget.js');

    const stylesheets = document.querySelectorAll('link');
    expect(stylesheets.length).toBe(1);
    expect(stylesheets[0].href).toBe('http://localhost:8089/src/widget.css');
  });
});
