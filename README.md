# Taboola Ads Widget Frontend

This is a widget that displays ads from Taboola. Written with vanilla JavaScript and CSS.

### Browser Compatibility

The code should work on all modern browsers. It has been tested on Chrome and Firefox.
But there isn't any modern JavaScript or CSS used in the code, so it should work on all browsers even IE11.

### Widget Usage

To use the widget, include the following code in the head of your HTML:

```html

<script type="text/javascript">
  const script = document.createElement('script');
  script.src = 'cdn-url/index.js';
  script.onload = function () {
    window.taboola.init({
      apiKey: 'your-api-key',
      publisherId: 'your-publisher-id',
      appType: 'desktop',
      cdnUrl: 'cdn-url'
    });
  };
  document.head.appendChild(script);
</script>
```

Where `your-api-key` and `your-publisher-id` are your Taboola API key and publisher ID respectively.
And `cdn-url` is the URL of the CDN where the Taboola widget code is hosted.

Then include the following code in the body of your HTML where you want the widget to appear:

```html

<div class="taboola-widget-container"
     data-recommendations-type="recommendation-type"
     data-source-type="source-type"
     data-source-id="source-id"
     data-source-url="source-url"
></div>
```

Where `recommendation-type` is the type of recommendations you want to display (e.g. "sponsor", "organic", "video",
etc...).

And `source-type`, `source-id`, and `source-url` are the type, ID, and URL of the source of the recommendations (e.g. "
article", "video", etc).

Please note that for now only "sponsor" recommendations are supported.

The widget will then display the recommendations based on the provided parameters.

### Development

In order to get the development environment up and running, you need to have Node.js installed on your machine.

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run serve-all` to start the development server
4. Open `http://localhost:8081` in your browser

The serve all command will start 2 dev servers that serve the js code and the test html page.

The HTML is served on port 8081 and the JS code is served on port 8080.

### Testing

The tests are written with Jest. To run the tests, run `npm run test`.

### Production

To build the production code, run `npm run build`. This will create a `dist` folder with the minified code.

To test production code, with the dev server running, open `http://localhost:8081/index-dist.html` in your browser.
