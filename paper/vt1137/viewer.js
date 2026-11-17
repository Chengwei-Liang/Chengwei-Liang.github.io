(function () {
  'use strict';

  var PDF_URL = '/files/papers/VT1137_Paper.pdf';
  var WORKER_URL = '/assets/js/pdfjs/pdf.worker.min.js';

  var canvas = document.getElementById('pdf-canvas');
  var ctx = canvas.getContext('2d', { alpha: false });
  var wrap = document.getElementById('canvas-wrap');
  var loading = document.getElementById('loading');
  var error = document.getElementById('error');
  var pageInfo = document.getElementById('page-info');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');

  if (!window.pdfjsLib) {
    loading.hidden = true;
    error.hidden = false;
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

  var pdfDoc = null;
  var pageNum = 1;
  var rendering = false;
  var queuedPage = null;

  function showError() {
    loading.hidden = true;
    error.hidden = false;
  }

  function availableWidth() {
    var style = getComputedStyle(wrap);
    var padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
    var border = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.borderRightWidth) || 0);
    return Math.max(240, wrap.clientWidth - padding - border);
  }

  function renderPage(num) {
    if (!pdfDoc) {
      return;
    }

    if (rendering) {
      queuedPage = num;
      return;
    }

    rendering = true;

    pdfDoc.getPage(num).then(function (page) {
      var dpr = window.devicePixelRatio || 1;
      var base = page.getViewport({ scale: 1 });
      var cssWidth = Math.min(availableWidth(), 1000);
      var cssScale = cssWidth / base.width;
      var viewport = page.getViewport({ scale: cssScale * dpr });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = Math.floor(viewport.width / dpr) + 'px';
      canvas.style.height = Math.floor(viewport.height / dpr) + 'px';

      return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
        pageNum = num;
        pageInfo.textContent = 'Page ' + num + ' / ' + pdfDoc.numPages;
        prev.disabled = num <= 1;
        next.disabled = num >= pdfDoc.numPages;
        canvas.style.display = 'block';
        loading.hidden = true;
        error.hidden = true;
      });
    }).catch(function (err) {
      console.error(err);
      showError();
    }).then(function () {
      rendering = false;
      if (queuedPage !== null) {
        var target = queuedPage;
        queuedPage = null;
        if (target !== pageNum) {
          renderPage(target);
        }
      }
    });
  }

  function go(delta) {
    if (!pdfDoc) {
      return;
    }
    var target = Math.min(Math.max(pageNum + delta, 1), pdfDoc.numPages);
    if (target !== pageNum) {
      renderPage(target);
    }
  }

  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });

  document.addEventListener('keydown', function (event) {
    var tag = event.target && event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
    }
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (pdfDoc) {
        renderPage(pageNum);
      }
    }, 150);
  });

  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });

  pdfjsLib.getDocument(PDF_URL).promise.then(function (doc) {
    pdfDoc = doc;
    pageInfo.textContent = 'Page 1 / ' + doc.numPages;
    renderPage(1);
  }).catch(function (err) {
    console.error(err);
    showError();
  });
})();
