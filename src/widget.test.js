function addWidgetToDom(recommendationsType = 'sponsor') {
  const el = document.createElement('div');
  el.className = 'taboola-widget-container';
  el.setAttribute('data-recommendations-type', recommendationsType);
  el.setAttribute('data-source-type', 'video');
  el.setAttribute('data-source-id', '214321562187');
  el.setAttribute('data-source-url', 'http://www.site.com/videos/214321562187.html');
  el.setAttribute('data-count', 6);
  document.body.appendChild(el);
  return el;
}

function addWidgetJsToDom() {
  let resolver;
  const promise = new Promise((resolve) => {
    resolver = resolve;
  });
  const script = document.createElement('script');
  script.src = 'src/widget.js';
  document.head.appendChild(script);
  script.onload = function () {
    resolver(); // Indicate that the script has loaded and the tests can begin
  };

  return promise;
}

function getXhrMock() {
  return {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    readyState: 4,
    status: 200,
    responseText: JSON.stringify({
      list: [
        { thumbnail: 'http://www.site.com/thumbnail1.jpg', title: 'Title 1', branding: 'Branding 1' },
        { thumbnail: 'http://www.site.com/thumbnail2.jpg', title: 'Title 2', branding: 'Branding 2' },
        { thumbnail: 'http://www.site.com/thumbnail3.jpg', title: 'Title 3', branding: 'Branding 3' },
        { thumbnail: 'http://www.site.com/thumbnail4.jpg', title: 'Title 4', branding: 'Branding 4' },
        { thumbnail: 'http://www.site.com/thumbnail5.jpg', title: 'Title 5', branding: 'Branding 5' },
        { thumbnail: 'http://www.site.com/thumbnail6.jpg', title: 'Title 6', branding: 'Branding 6' }
      ]
    })
  };
}

describe('widget', () => {
  beforeAll(() => {
    window.taboola = {
      getApiUrl: jest.fn(opts => 'https://api.taboola.com/'),
    };
  });

  afterEach(() => {
    // Make sure mutations are not being observed
    window.dispatchEvent(new Event('beforeunload'));
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('adds widgets', async () => {
    addWidgetToDom();

    const el = document.getElementsByClassName('taboola-widget-container')[0];

    await addWidgetJsToDom();

    expect(el.className).toContain('taboola-widget-container--loaded');
    expect(el.innerHTML).toEqual('');
  });

  it('adds widgets based on type', async () => {
    const el = addWidgetToDom('organic');

    await addWidgetJsToDom();

    expect(el.className).toContain('taboola-widget-organic');
  });

  it('adds items from http request', async () => {
    const xhrMock = getXhrMock();
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock);

    const el = addWidgetToDom();

    await addWidgetJsToDom();

    expect(xhrMock.open).toBeCalledWith('GET', 'https://api.taboola.com/', true);
    xhrMock.onreadystatechange(new Event(''));

    expect(el.className).toContain('taboola-widget-container--loaded');
    expect(el.innerHTML).toContain('taboola-widget-content');
    expect(el.getElementsByClassName('taboola-widget-item').length).toEqual(6);
  });

  it("listens to mutations", async () => {
    let resolver;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });

    const xhrMock = getXhrMock();
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock);

    await addWidgetJsToDom();
    expect(document.getElementsByClassName('taboola-widget-container').length).toEqual(0);

    addWidgetToDom();

    setTimeout(() => {

      expect(xhrMock.open).toBeCalledWith('GET', 'https://api.taboola.com/', true);
      xhrMock.onreadystatechange(new Event(''));

      expect(document.getElementsByClassName('taboola-widget-container--loaded').length).toEqual(1);
      expect(document.getElementsByClassName('taboola-widget-item').length).toEqual(6);
      resolver();
    });
    return promise;
  });

  it('calls getApiUrl with correct options', async () => {
    const xhrMock = getXhrMock();
    jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock);

    const el = addWidgetToDom();

    await addWidgetJsToDom();

    expect(window.taboola.getApiUrl).toBeCalledWith({
      sourceType: 'video',
      sourceId: '214321562187',
      sourceUrl: 'http://www.site.com/videos/214321562187.html',
      count: "6"
    });
  });
});
