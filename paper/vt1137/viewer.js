(function () {
  'use strict';

  var PDF_URL = '/files/papers/VT1137_Paper.pdf';
  var WORKER_URL = '/assets/js/pdfjs/pdf.worker.min.js';

  var container = document.getElementById('pages');
  var loading = document.getElementById('loading');
  var error = document.getElementById('error');

  if (!window.pdfjsLib) {
    loading.hidden = true;
    error.hidden = false;
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

  function showError() {
    loading.hidden = true;
    error.hidden = false;
  }

  function pageWidth() {
    return Math.min(container.clientWidth || 1000, 1000);
  }

  pdfjsLib.getDocument(PDF_URL).promise.then(function (doc) {
    var pageCount = doc.numPages;
    var infos = [];
    var setupChain = Promise.resolve();

    // Reserve the full document height first so the page does not jump
    // while the pages are being rendered.
    for (var n = 1; n <= pageCount; n += 1) {
      (function (num) {
        setupChain = setupChain.then(function () {
          return doc.getPage(num).then(function (page) {
            var base = page.getViewport({ scale: 1 });
            var wrap = document.createElement('div');
            wrap.className = 'pdf-page';
            wrap.style.aspectRatio = base.width + ' / ' + base.height;

            var canvas = document.createElement('canvas');
            canvas.setAttribute('aria-label', 'Page ' + num + ' of ' + pageCount);
            canvas.style.visibility = 'hidden';
            wrap.appendChild(canvas);
            container.appendChild(wrap);

            infos.push({ page: page, base: base, canvas: canvas });
          });
        });
      })(n);
    }

    return setupChain.then(function () {
      var width = pageWidth();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var renderChain = Promise.resolve();

      infos.forEach(function (info, index) {
        renderChain = renderChain.then(function () {
          var scale = width / info.base.width;
          var viewport = info.page.getViewport({ scale: scale * dpr });
          var ctx = info.canvas.getContext('2d', { alpha: false });

          info.canvas.width = Math.floor(viewport.width);
          info.canvas.height = Math.floor(viewport.height);

          return info.page.render({
            canvasContext: ctx,
            viewport: viewport
          }).promise.then(function () {
            info.canvas.style.visibility = 'visible';
            if (index === 0) {
              loading.hidden = true;
            }
          });
        });
      });

      return renderChain;
    });
  }).catch(function (err) {
    console.error(err);
    showError();
  });

  container.addEventListener('contextmenu', function (event) {
    if (event.target && event.target.tagName === 'CANVAS') {
      event.preventDefault();
    }
  });

  container.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });
})();
