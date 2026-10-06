// Dani Portilho: menu, filtros, assistente de presentes, formulário e métricas de clique.
(function () {
  var PHONE = '5511984181351';
  var BANDS = {
    'ate-50': 'https://www.natura.com.br/c/presentes-faixa-de-preco-agradecer?consultoria=danielaportilho',
    '50-100': 'https://www.natura.com.br/c/presentes-faixa-de-preco-encantar?consultoria=danielaportilho',
    '100-150': 'https://www.natura.com.br/c/presentes-faixa-de-preco-surpreender?consultoria=danielaportilho',
    '150': 'https://www.natura.com.br/c/presentes?consultoria=danielaportilho'
  };
  function openWa(msg) { window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg), '_blank', 'noopener'); }

  // Métricas (GA4/GTM via dataLayer, se instalado)
  function track(type, label) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: type, item_name: label || '', page: location.pathname });
      if (typeof window.gtag === 'function') window.gtag('event', type, { item_name: label || '' });
    } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    var label = a.dataset.product || a.textContent.trim().slice(0, 60);
    if (a.href.indexOf('natura.com') > -1) track('click_loja', label);
    if (a.href.indexOf('wa.me') > -1) track('click_whatsapp', label);
  });

  // Menu
  var menu = document.querySelector('.menu'), nav = document.getElementById('navlinks');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) menu.click(); });
  }

  // Filtro de ofertas
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-pressed', 'false'); });
      c.classList.add('is-on'); c.setAttribute('aria-pressed', 'true');
      var f = c.dataset.filter;
      document.querySelectorAll('.product').forEach(function (p) { p.hidden = !(f === 'all' || p.dataset.cat === f); });
    });
  });

  function check(form) {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var bad = !el.value.trim(); el.classList.toggle('invalid', bad); if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }

  // Assistente de presentes
  document.querySelectorAll('#giftWizard').forEach(function (form) {
    var alt = form.querySelector('.wizard-alt');
    form.faixa.addEventListener('change', function () {
      var url = BANDS[form.faixa.value];
      if (url) { alt.hidden = false; alt.querySelector('a').href = url; } else alt.hidden = true;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!check(form)) return;
      var faixa = form.faixa.options[form.faixa.selectedIndex].text;
      var msg = 'Oi Dani! Vim pelo seu site e quero ajuda com um presente.\n' +
        '• Para quem: ' + form.quem.value + '\n• Ocasião: ' + form.ocasiao.value +
        '\n• Quanto quero investir: ' + faixa + '\n• Tipo: ' + form.tipo.value;
      track('gift_wizard', form.quem.value + ' | ' + faixa);
      openWa(msg);
    });
  });

  // Formulário de contato
  var cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(cf)) return;
    track('contact_form', cf.assunto.value);
    openWa('Oi Dani! Meu nome é ' + cf.nome.value.trim() + '.\nAssunto: ' + cf.assunto.value + '\n' + cf.mensagem.value.trim());
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
