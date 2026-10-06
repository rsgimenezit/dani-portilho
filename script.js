const LOJA='https://www.minhaloja.natura.com/consultoria/danielaportilho?marca=natura';

// ETAPA 3 — CAMPEÕES DE VENDA
// Seleção baseada na área "Mais vendidos" da Natura consultada em outubro/2026.
// Mantemos o preço fora do site porque campanhas e descontos mudam com frequência.
// Para atualizar a vitrine, altere somente esta lista.
const OFERTAS=[
  {selo:'MAIS VENDIDO • PERFUMARIA',titulo:'Kaiak 21K Masculino 100 ml',descricao:'Fragrância aromática fresca, com gengibre e âmbar. Uma escolha forte para a vitrine masculina.',linha:'Kaiak',tipo:'Masculino',imagem:'assets/beleza-botanica.png',posicao:'72% 22%'},
  {selo:'MAIS VENDIDO • PERFUMARIA',titulo:'Essencial Oud Masculino 100 ml',descricao:'Deo parfum marcante com oud e copaíba, pensado para quem procura uma fragrância mais intensa.',linha:'Essencial',tipo:'Masculino',imagem:'assets/beleza-botanica.png',posicao:'78% 22%'},
  {selo:'MAIS VENDIDO • CORPO',titulo:'Tododia Maçã Caramelada e Baunilha',descricao:'Creme nutritivo corporal de perfil adocicado, destaque atual entre os produtos Tododia.',linha:'Tododia',tipo:'Corpo & banho',imagem:'assets/beleza-botanica.png',posicao:'23% 74%'},
  {selo:'MAIS VENDIDO • PERFUMAÇÃO',titulo:'Body Splash Luna 200 ml',descricao:'Perfumação feminina leve e refrescante com a assinatura chipre da linha Luna.',linha:'Luna',tipo:'Feminino',imagem:'assets/beleza-botanica.png',posicao:'30% 23%'},
  {selo:'MAIS VENDIDO • CUIDADOS',titulo:'Ekos Castanha Hidratante Corporal',descricao:'Cuidado corporal com a conhecida linha Castanha de Ekos, ótima opção para rotina de hidratação.',linha:'Ekos',tipo:'Corpo & banho',imagem:'assets/beleza-botanica.png',posicao:'18% 75%'},
  {selo:'MAIS VENDIDO • PRESENTE',titulo:'Kit Ekos Castanha Creme para Mãos',descricao:'Kit com três unidades, uma opção prática para presentear ou manter o cuidado sempre por perto.',linha:'Ekos',tipo:'Presentes',imagem:'assets/beleza-botanica.png',posicao:'79% 76%'},
  {selo:'MAIS VENDIDO • ROSTO',titulo:'Chronos Derma FPS 70',descricao:'Multiprotetor facial com alta proteção solar e proposta clareadora para a rotina de cuidados.',linha:'Chronos Derma',tipo:'Rosto',imagem:'assets/beleza-botanica.png',posicao:'31% 22%'},
  {selo:'MAIS VENDIDO • FAMÍLIA',titulo:'Papai e Bebê Água de Colônia 50 ml',descricao:'Fragrância delicada da linha Papai e Bebê, entre os destaques atuais da seleção Natura.',linha:'Papai e Bebê',tipo:'Infantil',imagem:'assets/beleza-botanica.png',posicao:'70% 76%'}
];

const grid=document.getElementById('offerGrid');
if(grid){grid.innerHTML=OFERTAS.map(o=>`<article class="offer-card"><div class="offer-image"><img src="${o.imagem}" alt="Composição visual representando ${o.titulo}" loading="lazy" style="object-position:${o.posicao}"><span class="offer-tag">${o.selo}</span></div><div class="offer-body"><h3>${o.titulo}</h3><div class="product-meta"><span>${o.linha}</span><span>${o.tipo}</span></div><p>${o.descricao}</p><div class="product-proof">Preço e disponibilidade atualizados diretamente na loja.</div><a class="btn" target="_blank" rel="noopener" href="${LOJA}">Ver na loja da Dani →</a></div></article>`).join('')}

const menu=document.querySelector('.menu');const nav=document.querySelector('.navlinks');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.textContent=open?'✕':'☰'});document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(menu)menu.textContent='☰'}));document.getElementById('year').textContent=new Date().getFullYear();
