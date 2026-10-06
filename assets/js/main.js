// Dani Portilho: menu, filtros, testes interativos, formulários e métricas de clique.
(function () {
  document.documentElement.classList.add('js');
  var PHONE = '5511984181351';
  var C = '?consultoria=danielaportilho';
  var BANDS = {
    agradecer: 'https://www.natura.com.br/c/presentes-faixa-de-preco-agradecer' + C,
    encantar: 'https://www.natura.com.br/c/presentes-faixa-de-preco-encantar' + C,
    surpreender: 'https://www.natura.com.br/c/presentes-faixa-de-preco-surpreender' + C,
    todos: 'https://www.natura.com.br/c/presentes' + C
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

  // Menu principal e "Mais"
  var menu = document.querySelector('.menu'), nav = document.getElementById('navlinks');
  if (menu && nav) menu.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  var more = document.querySelector('.more'), moreBtn = document.querySelector('.more-btn');
  if (more && moreBtn) {
    moreBtn.addEventListener('click', function (e) { e.stopPropagation(); var o = more.classList.toggle('open'); moreBtn.setAttribute('aria-expanded', String(o)); });
    document.addEventListener('click', function (e) { if (!more.contains(e.target)) { more.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); } });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (more) { more.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); }
    if (nav && nav.classList.contains('open')) menu.click();
  });

  // Filtro de produtos
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
      if (el.type === 'radio') return;
      var bad = !el.value.trim(); el.classList.toggle('invalid', bad); if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  function val(form, name) { var el = form.querySelector('[name="' + name + '"]:checked'); return el ? el.value : ''; }

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
      track('gift_wizard', form.quem.value + ' | ' + faixa);
      openWa('Oi Dani! Vim pelo seu site e quero ajuda com um presente.\n• Para quem: ' + form.quem.value +
        '\n• Ocasião: ' + form.ocasiao.value + '\n• Tipo de presente: ' + faixa + '\n• Categoria: ' + form.tipo.value);
    });
  });

  // Motor dos testes em etapas
  function stepper(form, onDone) {
    var steps = [].slice.call(form.querySelectorAll('.q'));
    var bar = form.querySelector('.progress span'), prev = form.querySelector('[data-prev]'), next = form.querySelector('[data-next]');
    var navBox = form.querySelector('.quiz-nav'), result = form.querySelector('.result'), i = 0;
    function show() {
      steps.forEach(function (s, k) { s.classList.toggle('is-current', k === i); });
      bar.style.width = ((i + 1) / (steps.length + 1) * 100) + '%';
      prev.disabled = i === 0; next.textContent = i === steps.length - 1 ? 'Ver resultado' : 'Próxima';
    }
    function go() {
      if (!val(form, steps[i].querySelector('input').name)) { steps[i].querySelector('input').focus(); return; }
      if (i < steps.length - 1) { i++; show(); return; }
      steps.forEach(function (s) { s.classList.remove('is-current'); });
      navBox.hidden = true; result.hidden = false; bar.style.width = '100%';
      onDone(); result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    next.addEventListener('click', go);
    prev.addEventListener('click', function () { if (i > 0) { i--; show(); } });
    steps.forEach(function (s) { s.addEventListener('change', function () { setTimeout(go, 220); }); });
    form.querySelector('[data-restart]').addEventListener('click', function () { form.reset(); i = 0; result.hidden = true; navBox.hidden = false; show(); steps[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    show();
  }

  // Descubra seu perfume
  var pq = document.getElementById('perfumeQuiz');
  if (pq) {
    var PROF = {
      'Frutas cítricas e frescor': ['Fresco & cítrico', 'Você combina com perfumes leves, limpos e energizantes, com notas cítricas, verdes ou aquáticas. Ótimos para o calor e para usar todos os dias.'],
      'Flores': ['Floral', 'Você combina com perfumes florais, do delicado ao marcante. São românticos, femininos ou compartilháveis, e funcionam em qualquer ocasião.'],
      'Baunilha e doces': ['Adocicado e envolvente', 'Você combina com perfumes com baunilha, caramelo, frutas doces e notas cremosas. São aconchegantes e deixam um rastro gostoso.'],
      'Madeiras e especiarias': ['Amadeirado & especiado', 'Você combina com perfumes com madeiras, especiarias e notas quentes. Têm presença, elegância e costumam fixar bem.']
    };
    var INT = { 'Leve e discreto': ' Prefira versões mais leves, como colônias.', 'Equilibrado': ' Uma colônia ou deo colônia de boa fixação é um ótimo começo.', 'Intenso e marcante': ' Para mais intensidade, procure versões deo parfum.' };
    stepper(pq, function () {
      var p = PROF[val(pq, 'nota')];
      pq.querySelector('[data-title]').textContent = p[0];
      pq.querySelector('[data-text]').textContent = p[1] + (INT[val(pq, 'intensidade')] || '');
      track('perfume_quiz', p[0]);
    });
    pq.addEventListener('submit', function (e) {
      e.preventDefault();
      openWa('Oi Dani! Fiz o teste de perfume no seu site.\n• Resultado: ' + pq.querySelector('[data-title]').textContent +
        '\n• Para: ' + val(pq, 'para') + '\n• Uso: ' + val(pq, 'momento') + '\n• Intensidade: ' + val(pq, 'intensidade') +
        '\n• Gosto de: ' + val(pq, 'nota') + '\nQuais perfumes você me indica?');
    });
  }

  // Monte sua rotina
  var rf = document.getElementById('routineForm');
  if (rf) {
    var R = {
      'Corpo': [['Limpar', 'sabonete em barra ou líquido da fragrância que você gosta'], ['Hidratar', 'hidratante logo após o banho, com a pele ainda levemente úmida'], ['Perfumar', 'colônia ou body splash da mesma linha para o perfume durar mais']],
      'Cabelos': [['Lavar', 'shampoo indicado para o seu tipo de fio'], ['Condicionar', 'condicionador do meio para as pontas'], ['Tratar', 'máscara de tratamento uma vez por semana'], ['Finalizar', 'creme para pentear, leave-in ou óleo para proteger e dar acabamento']],
      'Rosto': [['Limpar', 'gel ou sabonete facial de manhã e à noite'], ['Tratar', 'sérum ou tratamento de acordo com a sua necessidade'], ['Hidratar', 'hidratante facial com textura adequada à sua pele'], ['Proteger', 'protetor solar todas as manhãs, mesmo em dias nublados']]
    };
    var TIPO = {
      'Seco': 'Para pele ou cabelo seco, prefira texturas mais nutritivas e cremosas.',
      'Oleoso ou misto': 'Para pele ou cabelo oleoso, prefira texturas leves, em gel ou loção.',
      'Sensível ou com química': 'Para pele sensível ou cabelo com química, a Dani indica opções mais suaves e de reconstrução. Faça sempre um teste antes de usar um produto novo.',
      'Normal': 'Para pele ou cabelo normal, você pode escolher pela textura e pelo perfume que mais gostar.'
    };
    stepper(rf, function () {
      var area = val(rf, 'area'), list = rf.querySelector('[data-steps]');
      rf.querySelector('[data-title]').textContent = 'Rotina de ' + area.toLowerCase() + ' · foco em ' + val(rf, 'necessidade').toLowerCase();
      list.innerHTML = '';
      R[area].forEach(function (s) { var li = document.createElement('li'); li.innerHTML = '<b>' + s[0] + ':</b> ' + s[1] + '.'; list.appendChild(li); });
      var tip = document.createElement('li'); tip.className = 'tip'; tip.textContent = TIPO[val(rf, 'tipo')] || ''; list.appendChild(tip);
      track('routine_builder', area);
    });
    rf.addEventListener('submit', function (e) {
      e.preventDefault();
      openWa('Oi Dani! Montei minha rotina no seu site e quero indicação dos produtos.\n• Área: ' + val(rf, 'area') +
        '\n• Foco: ' + val(rf, 'necessidade') + '\n• Tipo: ' + val(rf, 'tipo'));
    });
  }

  // Próxima data especial
  var nd = document.getElementById('nextDate');
  if (nd) {
    var occ = JSON.parse(nd.dataset.occasions), today = new Date(); today.setHours(0, 0, 0, 0);
    function dateFor(rule, y) {
      var p;
      if (rule.indexOf('fixed:') === 0) { p = rule.slice(6).split('-'); return new Date(y, +p[0] - 1, +p[1]); }
      if (rule.indexOf('nth:') === 0) { p = rule.slice(4).split('-'); var d = new Date(y, +p[0] - 1, 1); var off = (+p[1] - d.getDay() + 7) % 7; return new Date(y, +p[0] - 1, 1 + off + 7 * (+p[2] - 1)); }
      if (rule === 'bf') { var n = new Date(y, 10, 1); var th = 1 + ((4 - n.getDay() + 7) % 7) + 21; return new Date(y, 10, th + 1); }
    }
    var best = null;
    occ.forEach(function (o) {
      var y = today.getFullYear(), d = dateFor(o[2], y);
      if (d < today) d = dateFor(o[2], y + 1);
      if (!best || d < best.d) best = { id: o[0], name: o[1], d: d };
    });
    if (best) {
      var days = Math.round((best.d - today) / 864e5);
      nd.querySelector('[data-name]').textContent = best.name;
      nd.querySelector('[data-when]').innerHTML = best.d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) +
        ' <span class="count">' + (days === 0 ? 'é hoje!' : days === 1 ? 'é amanhã' : 'faltam ' + days + ' dias') + '</span>';
      var wa = nd.querySelector('a[href*="wa.me"]');
      if (wa) wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Oi Dani! Quero ideias de presente para o ' + best.name + '.');
      var card = document.querySelector('.date-card[data-id="' + best.id + '"]'); if (card) card.classList.add('is-next');
    }
  }

  // Lista VIP
  var vip = document.getElementById('vipForm');
  if (vip) vip.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(vip)) return;
    var ints = [].slice.call(vip.querySelectorAll('[name="interesse"]:checked')).map(function (x) { return x.value; });
    track('vip_signup', ints.join(', '));
    openWa('Oi Dani! Quero entrar na sua Lista VIP.\n• Nome: ' + vip.nome.value.trim() +
      (ints.length ? '\n• Gosto de: ' + ints.join(', ') : '') + (vip.data.value.trim() ? '\n• Data para lembrar: ' + vip.data.value.trim() : ''));
  });

  // Contato
  var cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!check(cf)) return;
    track('contact_form', cf.assunto.value);
    openWa('Oi Dani! Meu nome é ' + cf.nome.value.trim() + '.\nAssunto: ' + cf.assunto.value + '\n' + cf.mensagem.value.trim());
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
