/* =========================================================
   THE BITTER TRUTH BEHIND SWEET TRADE — SCRIPT
   Vanilla JS only. All data below is illustrative.
   ========================================================= */
(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- HEADER SCROLL + MOBILE NAV ---------- */
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function(){
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive:true});

  var navToggle = document.getElementById('navToggle');
  navToggle.addEventListener('click', function(){
    var open = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.mobile-nav a').forEach(function(a){
    a.addEventListener('click', function(){ header.classList.remove('nav-open'); navToggle.setAttribute('aria-expanded','false'); });
  });

  document.getElementById('scrollCue').addEventListener('click', function(){
    document.getElementById('snapshots').scrollIntoView({behavior:'smooth'});
  });

  /* ---------- GENERIC SCROLL-REVEAL ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in-view'); }
    });
  }, {threshold:0.25});

  function observeAll(selector){
    document.querySelectorAll(selector).forEach(function(el){ io.observe(el); });
  }

  /* ---------- HERO PARTICLES (floating cocoa flecks) ---------- */
  (function particles(){
    var canvas = document.getElementById('particleCanvas');
    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var w,h,parts=[];
    function size(){
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    function init(){
      size();
      var count = reduceMotion ? 0 : Math.min(60, Math.floor(w/22));
      parts = [];
      for(var i=0;i<count;i++){
        parts.push({
          x: Math.random()*w, y: Math.random()*h,
          r: 1 + Math.random()*2.6,
          vy: 0.15 + Math.random()*0.35,
          vx: (Math.random()-0.5)*0.2,
          o: 0.15 + Math.random()*0.35
        });
      }
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      parts.forEach(function(p){
        p.y -= p.vy; p.x += p.vx;
        if(p.y < -10){ p.y = h+10; p.x = Math.random()*w; }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(212,165,93,'+p.o+')';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      if(!reduceMotion) requestAnimationFrame(draw);
    }
    window.addEventListener('resize', init, {passive:true});
    init();
    draw();
  })();

  /* ---------- 2. SNAPSHOT COUNTERS ---------- */
  var statCards = document.querySelectorAll('.stat-card');
  var statIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && !e.target.dataset.done){
        e.target.dataset.done = "1";
        e.target.classList.add('in-view');
        animateCount(e.target);
      }
    });
  }, {threshold:0.4});
  statCards.forEach(function(c){ statIO.observe(c); });

  function animateCount(card){
    var target = parseFloat(card.dataset.target);
    var decimals = parseInt(card.dataset.decimals || "0", 10);
    var prefix = card.dataset.prefix || "";
    var suffix = card.dataset.suffix || "";
    var el = card.querySelector('.stat-num');
    var start = 0;
    var duration = reduceMotion ? 0 : 1400;
    var startTime = null;
    function step(ts){
      if(startTime===null) startTime = ts;
      var progress = duration ? Math.min((ts-startTime)/duration, 1) : 1;
      var eased = 1 - Math.pow(1-progress, 3);
      var val = start + (target-start)*eased;
      el.textContent = prefix + val.toFixed(decimals) + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  /* ---------- 3. CHOCOLATE PASSPORT DATA + RENDER ---------- */
  var passportStops = [
    {name:"Cocoa Farm", country:"Côte d'Ivoire", value:"$0.006 / bar (illus.)", impact:"Land use, water for young trees", desc:"Smallholder farms cultivate Theobroma cacao under shade canopy, typically on 2–4 hectare plots.", icon:'<path d="M12 3c3 4 3 9 0 13-3-4-3-9 0-13Z" stroke="currentColor" stroke-width="1.4"/><path d="M12 16v5" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?cacao,tree,farm"},
    {name:"Harvest", country:"Ghana", value:"$0.01 / bar (illus.)", impact:"Manual labour intensive, seasonal", desc:"Ripe pods are cut by hand twice yearly and split open to remove the cocoa beans and pulp.", icon:'<path d="M4 12h16M12 4v16" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.2"/>', img:"https://source.unsplash.com/800x450/?cocoa,harvest,pods"},
    {name:"Fermentation", country:"Côte d'Ivoire", value:"$0.02 / bar (illus.)", impact:"Methane from organic breakdown", desc:"Beans ferment in wooden boxes or banana-leaf heaps for 5–7 days, developing chocolate flavour precursors.", icon:'<path d="M7 4h10l-1 6a5 5 0 0 1-8 0L7 4Z" stroke="currentColor" stroke-width="1.4"/><path d="M9 20h6M12 15v5" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?cocoa,beans,fermentation"},
    {name:"Drying", country:"Ghana", value:"$0.015 / bar (illus.)", impact:"Sun-dependent, low energy input", desc:"Beans are sun-dried on raised mats for 1–2 weeks, reducing moisture from ~60% to 7%.", icon:'<circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M4 20c1-4 5-6 8-6s7 2 8 6" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?cocoa,beans,drying,sun"},
    {name:"Export", country:"Abidjan / Tema Ports", value:"$0.04 / bar (illus.)", impact:"Freight emissions, packaging jute", desc:"Dried beans are bagged, graded and shipped in bulk containers toward processing hubs in Europe and North America.", icon:'<path d="M3 15h18l-2 5H5l-2-5Z" stroke="currentColor" stroke-width="1.4"/><path d="M6 15V8h12v7" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?shipping,port,containers"},
    {name:"Processing", country:"Netherlands", value:"$0.18 / bar (illus.)", impact:"High energy roasting &amp; grinding", desc:"Beans are roasted, winnowed and ground into cocoa liquor, then pressed into cocoa butter and cocoa powder.", icon:'<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.4"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?cocoa,roasting,factory"},
    {name:"Manufacturing", country:"Belgium", value:"$0.55 / bar (illus.)", impact:"Milk &amp; sugar sourcing footprint", desc:"Cocoa mass is blended with sugar, milk solids and cocoa butter, conched and tempered into finished chocolate.", icon:'<rect x="4" y="7" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?chocolate,factory,production"},
    {name:"Packaging", country:"Germany", value:"$0.12 / bar (illus.)", impact:"Foil &amp; plastic laminate waste", desc:"Bars are wrapped in foil and branded cartons, often multi-material laminates that hinder recycling.", icon:'<rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 10h14" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?chocolate,wrapper,packaging"},
    {name:"Shipping", country:"Transatlantic / EU Road", value:"$0.06 / bar (illus.)", impact:"Refrigerated transport emissions", desc:"Finished bars move by temperature-controlled sea and road freight to distribution centres worldwide.", icon:'<rect x="2" y="9" width="13" height="8" rx="1" stroke="currentColor" stroke-width="1.4"/><path d="M15 12h4l3 3v2h-7" stroke="currentColor" stroke-width="1.4"/><circle cx="7" cy="19" r="1.6" stroke="currentColor" stroke-width="1.4"/><circle cx="18" cy="19" r="1.6" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?cargo,truck,logistics"},
    {name:"Retail", country:"USA / EU / India", value:"$1.9 shelf price (illus.)", impact:"Store energy, cold-chain for some lines", desc:"Bars reach supermarkets, convenience stores and e-commerce warehouses for final sale to consumers.", icon:'<path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 8Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?supermarket,candy,aisle"},
    {name:"Consumer", country:"Global", value:"Final purchase", impact:"Personal choice point in the chain", desc:"The consumer unwraps and eats the bar — the single moment the entire trade chain was built to reach.", icon:'<path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9Z" stroke="currentColor" stroke-width="1.4"/>', img:"https://source.unsplash.com/800x450/?chocolate,bar,eating"},
    {name:"Recycling", country:"Waste Management Systems", value:"Recovery / disposal", impact:"Foil-paper laminate rarely recycled", desc:"Wrappers typically end up in landfill or incineration; only mono-material packaging enters formal recycling streams.", icon:'<path d="M7 7 3 12l4 5M17 7l4 5-4 5M14 4l-4 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>', img:"https://source.unsplash.com/800x450/?recycling,waste,plastic"}
  ];

  var track = document.getElementById('passportTrack');
  var fileBox = document.getElementById('passportFile');
  passportStops.forEach(function(stop, i){
    var btn = document.createElement('button');
    btn.className = 'pp-stop';
    btn.setAttribute('role','listitem');
    btn.setAttribute('aria-pressed','false');
    btn.innerHTML =
      '<span class="pp-num">STAMP ' + String(i+1).padStart(2,'0') + '</span>' +
      '<span class="pp-stamp"><svg viewBox="0 0 24 24" fill="none">'+stop.icon+'</svg></span>' +
      '<span class="pp-name">'+stop.name+'</span>';
    btn.addEventListener('click', function(){ selectStop(i); });
    track.appendChild(btn);
  });

  function selectStop(i){
    var stop = passportStops[i];
    track.querySelectorAll('.pp-stop').forEach(function(el,idx){
      el.classList.toggle('active', idx===i);
      el.setAttribute('aria-pressed', idx===i ? 'true':'false');
    });
    fileBox.innerHTML =
      '<div class="file-card">' +
        '<div class="file-photo-wrap">' +
          '<img class="file-photo" src="'+stop.img+'" alt="'+stop.name+' — illustrative photo" loading="lazy" ' +
            'onerror="this.closest(\'.file-photo-wrap\').innerHTML=\'<div class=&quot;file-placeholder-img&quot;>Image unavailable — photo of: '+stop.name.toLowerCase()+'</div>\'">' +
        '</div>' +
        '<h3>'+ (i+1) +'. '+ stop.name +'</h3>' +
        '<p class="file-desc">'+ stop.desc +'</p>' +
        '<div class="file-field"><span>Country / Region</span><strong>'+stop.country+'</strong></div>' +
        '<div class="file-field"><span>Trade Value Added</span><strong>'+stop.value+'</strong></div>' +
        '<div class="file-field"><span>Environmental Impact</span><strong>'+stop.impact+'</strong></div>' +
        '<div class="file-field"><span>Checkpoint Status</span><strong>Cleared &amp; Stamped</strong></div>' +
      '</div>';
  }
  selectStop(0);

  /* ---------- 4. WORLD MAP (simplified dot map, not geographically precise) ---------- */
  var countries = [
    {id:'ci', name:"Côte d'Ivoire", x:290, y:230, role:"Leading cocoa grower", exports:"Raw cocoa beans, semi-processed cocoa paste", env:"Deforestation pressure in cocoa belt regions", sig:"Supplies roughly two-fifths of world cocoan bean volume (illustrative)."},
    {id:'gh', name:"Ghana", x:305, y:235, role:"Second-largest cocoa grower", exports:"Raw cocoa beans, cocoa butter", env:"Land-use change, smallholder water use", sig:"Government-run marketing board sets a fixed farm-gate price each season."},
    {id:'be', name:"Belgium", x:430, y:130, role:"Premium manufacturing hub", exports:"Finished chocolate, pralines", env:"Energy-intensive conching &amp; tempering", sig:"Home to globally recognised heritage chocolate houses."},
    {id:'ch', name:"Switzerland", x:445, y:140, role:"Processing &amp; manufacturing", exports:"Couverture chocolate, branded bars", env:"High-precision, energy-heavy processing", sig:"Pioneered conching, shaping modern chocolate texture."},
    {id:'de', name:"Germany", x:440, y:118, role:"Processing &amp; packaging hub", exports:"Cocoa powder, packaged confectionery", env:"Packaging material volume, cold logistics", sig:"One of the largest cocoa bean import &amp; re-export markets."},
    {id:'us', name:"United States", x:150, y:160, role:"Major importer &amp; manufacturer", exports:"Confectionery re-exports to the Americas", env:"Long-haul cold-chain distribution", sig:"Single largest national consumer market for chocolate confectionery."},
    {id:'in', name:"India", x:600, y:220, role:"Fast-growing import market", exports:"Domestic manufacturing, re-exports to South Asia", env:"Rising cold-chain and packaging demand", sig:"Cocoa imports have grown quickly alongside urban demand."}
  ];

  var routes = [
    ['ci','be'], ['ci','ch'], ['gh','de'], ['gh','us'], ['be','us'], ['ch','in']
  ];

  (function renderMap(){
    var holder = document.getElementById('mapSvgHolder');
    var panel = document.getElementById('mapPanel');
    var byId = {};
    countries.forEach(function(c){ byId[c.id]=c; });

    var svg = '<svg viewBox="0 0 700 340" role="img" aria-label="Simplified schematic map of highlighted cocoa and chocolate trade countries">';
    svg += '<rect x="0" y="0" width="700" height="340" rx="14" fill="#F8F5F0"/>';
    svg += '<g opacity="0.35">';
    for(var gx=20; gx<700; gx+=40){ svg += '<line x1="'+gx+'" y1="0" x2="'+gx+'" y2="340" stroke="#D4A55D" stroke-width="0.4"/>'; }
    for(var gy=20; gy<340; gy+=40){ svg += '<line x1="0" y1="'+gy+'" x2="700" y2="'+gy+'" stroke="#D4A55D" stroke-width="0.4"/>'; }
    svg += '</g>';

    // routes
    svg += '<g>';
    routes.forEach(function(r){
      var a = byId[r[0]], b = byId[r[1]];
      var mx = (a.x+b.x)/2, my = Math.min(a.y,b.y)-40;
      svg += '<path class="route-line" d="M'+a.x+' '+a.y+' Q '+mx+' '+my+' '+b.x+' '+b.y+'"/>';
    });
    svg += '</g>';

    // country dots
    svg += '<g>';
    countries.forEach(function(c){
      svg += '<g tabindex="0" role="button" aria-label="'+c.name+'" class="country-dot-group" data-id="'+c.id+'">' +
        '<circle class="country-dot" data-id="'+c.id+'" cx="'+c.x+'" cy="'+c.y+'" r="9" fill="#7B4F2B"/>' +
        '<text x="'+c.x+'" y="'+(c.y-14)+'" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="#3B2417">'+c.name+'</text>' +
        '</g>';
    });
    svg += '</g></svg>';
    holder.innerHTML = svg;

    function showCountry(id){
      var c = byId[id];
      holder.querySelectorAll('.country-dot').forEach(function(d){ d.classList.toggle('active', d.dataset.id===id); });
      panel.innerHTML =
        '<h3>'+c.name+'</h3>' +
        '<span class="role-tag">'+c.role+'</span>' +
        '<dl>' +
          '<dt>Exports</dt><dd>'+c.exports+'</dd>' +
          '<dt>Environmental note</dt><dd>'+c.env+'</dd>' +
          '<dt>Trade significance</dt><dd>'+c.sig+'</dd>' +
        '</dl>';
    }

    holder.querySelectorAll('.country-dot-group').forEach(function(g){
      g.addEventListener('mouseenter', function(){ showCountry(g.dataset.id); });
      g.addEventListener('focus', function(){ showCountry(g.dataset.id); });
      g.addEventListener('click', function(){ showCountry(g.dataset.id); });
    });
  })();

  /* ---------- 5. INGREDIENT EXPLORER ---------- */
  var ingredients = [
    {name:"Cocoa", icon:'<path d="M12 3c4 4 4 10 0 14-4-4-4-10 0-14Z" stroke="currentColor" stroke-width="1.4"/>', origin:"West Africa, South America, SE Asia", producers:"Côte d'Ivoire, Ghana, Indonesia", footprint:"High land-use &amp; deforestation risk crop", trade:"Core commodity of the entire industry", fact:"Cocoa was once used as currency by the Aztecs."},
    {name:"Sugar", icon:'<path d="M6 6h12l3 12H3L6 6Z" stroke="currentColor" stroke-width="1.4"/><path d="M9 6 12 2l3 4" stroke="currentColor" stroke-width="1.4"/>', origin:"Tropical &amp; subtropical belts", producers:"Brazil, India, Thailand", footprint:"Water-intensive irrigation, land conversion", trade:"Second-largest ingredient by weight in milk chocolate", fact:"A standard milk bar can be roughly 40% sugar by weight (illustrative)."},
    {name:"Milk", icon:'<path d="M9 3h6l1 4-1 2v10a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9L8 7l1-4Z" stroke="currentColor" stroke-width="1.4"/>', origin:"Dairy regions of Europe &amp; Oceania", producers:"Germany, Netherlands, New Zealand", footprint:"Methane emissions from dairy herds", trade:"Drives milk-chocolate manufacturing hubs near dairy belts", fact:"Milk chocolate was commercialised in Switzerland in the 1870s."},
    {name:"Palm Oil", icon:'<path d="M12 21V9M12 9c-4-1-6-5-6-8 4 0 7 3 6 8ZM12 9c4-1 6-5 6-8-4 0-7 3-6 8Z" stroke="currentColor" stroke-width="1.4"/>', origin:"Tropical rainforest zones", producers:"Indonesia, Malaysia", footprint:"Linked to deforestation &amp; habitat loss", trade:"Used as a low-cost fat substitute in some confectionery", fact:"Certified sustainable palm oil schemes aim to curb rainforest conversion."},
    {name:"Cocoa Butter", icon:'<rect x="5" y="9" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="1.4"/>', origin:"Pressed from cocoa beans at processing stage", producers:"Netherlands, Côte d'Ivoire, Malaysia", footprint:"Energy-intensive pressing &amp; refining", trade:"High-value co-product traded separately from cocoa powder", fact:"It melts near body temperature — the source of chocolate's 'melt-in-mouth' feel."},
    {name:"Vanilla", icon:'<path d="M4 12c6-6 10-6 16 0-6 6-10 6-16 0Z" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/>', origin:"Tropical orchid-growing regions", producers:"Madagascar, Indonesia", footprint:"Labour-intensive hand-pollination", trade:"Among the most expensive spices by weight globally", fact:"Natural vanilla is often supplemented with synthetic vanillin in mass-market bars."},
    {name:"Packaging", icon:'<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M4 9h16" stroke="currentColor" stroke-width="1.4"/>', origin:"Manufactured near final production sites", producers:"Germany, USA, China", footprint:"Foil-paper laminates resist recycling", trade:"A growing regulatory focus for extended producer responsibility", fact:"Mono-material wrappers can cut end-of-life waste significantly versus laminates."}
  ];

  (function renderIngredients(){
    var grid = document.getElementById('ingredientGrid');
    ingredients.forEach(function(ing){
      var card = document.createElement('div');
      card.className = 'ing-card';
      card.innerHTML =
        '<div class="ing-card-inner">' +
          '<div class="ing-face ing-front" tabindex="0" role="button" aria-label="Flip card to see details for '+ing.name+'">' +
            '<span class="ing-icon"><svg viewBox="0 0 24 24" fill="none">'+ing.icon+'</svg></span>' +
            '<h3>'+ing.name+'</h3>' +
            '<span class="flip-hint">Tap to inspect</span>' +
          '</div>' +
          '<div class="ing-face ing-back" tabindex="0" role="button" aria-label="Flip card back">' +
            '<h4>'+ing.name+' — Trade File</h4>' +
            '<dl>' +
              '<dt>Origin</dt><dd>'+ing.origin+'</dd>' +
              '<dt>Largest producers</dt><dd>'+ing.producers+'</dd>' +
              '<dt>Environmental footprint</dt><dd>'+ing.footprint+'</dd>' +
              '<dt>Trade importance</dt><dd>'+ing.trade+'</dd>' +
            '</dl>' +
            '<p style="font-size:.78rem;color:rgba(255,255,255,0.75)">'+ing.fact+'</p>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);
      card.addEventListener('click', function(){ card.classList.toggle('flipped'); });
      card.addEventListener('keydown', function(ev){
        if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); card.classList.toggle('flipped'); }
      });
    });
  })();

  /* ---------- 6. SANKEY-STYLE VALUE CHAIN ---------- */
  var chainSteps = [
    {label:"Farmer", pct:6.5},
    {label:"Exporter", pct:9},
    {label:"Processor", pct:16},
    {label:"Manufacturer", pct:38},
    {label:"Retailer", pct:22},
    {label:"Logistics &amp; Tax", pct:8.5}
  ];
  (function renderSankey(){
    var wrap = document.getElementById('sankeyChart');
    chainSteps.forEach(function(step, i){
      var row = document.createElement('div');
      row.className = 'sankey-row';
      row.innerHTML =
        '<span class="sankey-label">'+step.label+'</span>' +
        '<span class="sankey-bar-track" style="--fill:'+step.pct+'%"><span class="sankey-bar-fill"></span></span>' +
        '<span class="sankey-pct">'+step.pct+'%</span>';
      wrap.appendChild(row);
      io.observe(row.querySelector('.sankey-bar-track'));
    });
  })();

  /* ---------- 7. FOOTPRINT DASHBOARD ---------- */
  var footprintData = [
    {label:"Water", pct:70, detail:"~1,700 L used per kg of chocolate across the cocoa growing stage (illustrative).", icon:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" stroke="currentColor" stroke-width="1.4"/>'},
    {label:"Electricity", pct:55, detail:"Roasting, grinding and conching are the most energy-intensive processing steps.", icon:'<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'},
    {label:"Fuel", pct:48, detail:"Diesel-powered freight moves beans from origin to processing hubs overseas.", icon:'<path d="M6 20V7a2 2 0 0 1 2-2h6l3 3v12" stroke="currentColor" stroke-width="1.4"/><path d="M6 12h11" stroke="currentColor" stroke-width="1.4"/>'},
    {label:"Packaging", pct:38, detail:"Foil-paper laminate wrappers are difficult to separate for recycling streams.", icon:'<rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/>'},
    {label:"Transport", pct:62, detail:"Sea freight plus refrigerated road transport dominates the distribution stage.", icon:'<rect x="2" y="10" width="12" height="7" rx="1" stroke="currentColor" stroke-width="1.4"/><path d="M14 12h4l3 3v2h-7" stroke="currentColor" stroke-width="1.4"/>'},
    {label:"Deforestation", pct:44, detail:"Cocoa farm expansion has historically encroached on protected forest margins.", icon:'<path d="M12 3v18M7 8c0 3 2 5 5 5s5-2 5-5c0-3-5-5-5-5s-5 2-5 5Z" stroke="currentColor" stroke-width="1.4"/>'},
    {label:"Waste", pct:33, detail:"Pod husks and shells are the largest by-product stream from processing.", icon:'<path d="M6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z" stroke="currentColor" stroke-width="1.4"/><path d="M9 7V5h6v2" stroke="currentColor" stroke-width="1.4"/>'}
  ];
  (function renderFootprint(){
    var grid = document.getElementById('footprintGrid');
    footprintData.forEach(function(fp){
      var circumference = 251;
      var offset = circumference - (fp.pct/100)*circumference;
      var card = document.createElement('div');
      card.className = 'fp-card';
      card.style.setProperty('--offset', offset);
      card.innerHTML =
        '<div class="fp-ring">' +
          '<svg viewBox="0 0 100 100" width="100" height="100">' +
            '<circle class="track" cx="50" cy="50" r="40"/>' +
            '<circle class="fill" cx="50" cy="50" r="40"/>' +
          '</svg>' +
          '<span class="fp-ring-label">'+fp.pct+'%</span>' +
        '</div>' +
        '<div class="fp-title">'+fp.label+'</div>' +
        '<button class="fp-toggle" aria-expanded="false">Details</button>' +
        '<div class="fp-detail">'+fp.detail+'</div>';
      grid.appendChild(card);
      io.observe(card);
      var btn = card.querySelector('.fp-toggle');
      btn.addEventListener('click', function(){
        var open = card.classList.toggle('expanded');
        btn.setAttribute('aria-expanded', open?'true':'false');
        btn.textContent = open ? 'Hide' : 'Details';
      });
    });
  })();

  /* ---------- 8. CARBON JOURNEY ---------- */
  var carbonStages = [
    {stage:"Farm", co2:"0.3 kg", water:"1,200 L", energy:"Low", transport:"N/A"},
    {stage:"Fermentation &amp; Drying", co2:"0.1 kg", water:"90 L", energy:"Low (solar)", transport:"Local cart / truck"},
    {stage:"Export Shipping", co2:"0.4 kg", water:"—", energy:"Diesel bunker fuel", transport:"Ocean freight"},
    {stage:"Processing", co2:"0.7 kg", water:"180 L", energy:"High (roasting/grinding)", transport:"Rail / truck"},
    {stage:"Manufacturing", co2:"0.9 kg", water:"140 L", energy:"High (conching/tempering)", transport:"Regional truck"},
    {stage:"Retail Distribution", co2:"0.5 kg", water:"—", energy:"Cold-chain electricity", transport:"Road freight"}
  ];
  (function renderCarbon(){
    var wrap = document.getElementById('carbonTimeline');
    carbonStages.forEach(function(s, i){
      var item = document.createElement('div');
      item.className = 'ct-item reveal';
      item.innerHTML =
        '<span class="ct-dot">'+(i+1)+'</span>' +
        '<h3>'+s.stage+'</h3>' +
        '<div class="ct-metrics">' +
          '<div>CO₂e<strong>'+s.co2+'</strong></div>' +
          '<div>Water<strong>'+s.water+'</strong></div>' +
          '<div>Energy<strong>'+s.energy+'</strong></div>' +
          '<div>Transport<strong>'+s.transport+'</strong></div>' +
        '</div>';
      wrap.appendChild(item);
      io.observe(item);
    });
  })();

  /* ---------- 9. WHO EARNS WHAT (stacked/grouped bars) ---------- */
  var earnings = [
    {label:"Farmer", pct:6.5, note:"Farm-gate cocoa price share"},
    {label:"Exporter", pct:9, note:"Aggregation, grading, port handling"},
    {label:"Processor", pct:16, note:"Roasting, grinding, pressing"},
    {label:"Manufacturer", pct:38, note:"Branding, R&amp;D, formulation"},
    {label:"Retailer", pct:30.5, note:"Shelf space, marketing, margin"}
  ];
  (function renderEarnings(){
    var wrap = document.getElementById('earningsChart');
    var maxH = 260;
    earnings.forEach(function(e){
      var col = document.createElement('div');
      col.className = 'eb-col';
      col.style.setProperty('--h', (e.pct/40*maxH)+'px');
      col.innerHTML =
        '<div class="eb-bar" tabindex="0">' +
          '<span class="eb-tooltip">'+e.note+' — '+e.pct+'%</span>' +
        '</div>' +
        '<span class="eb-label">'+e.label+'<br><strong style="font-family:var(--font-mono);font-weight:600">'+e.pct+'%</strong></span>';
      wrap.appendChild(col);
      io.observe(col);
    });
  })();

  /* ---------- 10. HIDDEN COSTS ---------- */
  var hiddenCosts = [
    {title:"Child Labour", icon:'<path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9Z" stroke="currentColor" stroke-width="1.4"/>', desc:"Informal labour practices remain a persistent risk in smallholder cocoa-growing regions with weak monitoring.", img:"https://source.unsplash.com/700x500/?farming,village,africa"},
    {title:"Deforestation", icon:'<path d="M12 3v18M7 8c0 3 2 5 5 5s5-2 5-5c0-3-5-5-5-5s-5 2-5 5Z" stroke="currentColor" stroke-width="1.4"/>', desc:"Cocoa expansion has historically driven forest-margin conversion in parts of West Africa's growing belt.", img:"https://source.unsplash.com/700x500/?deforestation,forest,cleared"},
    {title:"Climate Change", icon:'<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" stroke="currentColor" stroke-width="1.4"/>', desc:"Shifting rainfall patterns threaten long-term yield stability in traditional growing zones.", img:"https://source.unsplash.com/700x500/?drought,dry,cracked,land"},
    {title:"Plastic Waste", icon:'<path d="M7 7 3 12l4 5M17 7l4 5-4 5M14 4l-4 16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>', desc:"Multi-material foil wrappers are difficult to recycle and often end up in landfill or incineration.", img:"https://source.unsplash.com/700x500/?plastic,waste,pollution"},
    {title:"Farmer Poverty", icon:'<path d="M12 3v18M7 8h6.5a2.5 2.5 0 0 1 0 5H8a2.5 2.5 0 0 0 0 5H16" stroke="currentColor" stroke-width="1.4"/>', desc:"Many cocoa-farming households earn below a living-income benchmark despite rising global demand.", img:"https://source.unsplash.com/700x500/?farmer,field,rural,poverty"}
  ];
  (function renderHidden(){
    var grid = document.getElementById('hiddenGrid');
    hiddenCosts.forEach(function(h){
      var card = document.createElement('div');
      card.className = 'hc-card reveal';
      card.innerHTML =
        '<div class="hc-photo-wrap">' +
          '<img class="hc-photo" src="'+h.img+'" alt="" loading="lazy" ' +
            'onerror="this.style.display=\'none\'">' +
        '</div>' +
        '<span class="hc-icon"><svg viewBox="0 0 24 24" fill="none">'+h.icon+'</svg></span>' +
        '<h3>'+h.title+'</h3><p>'+h.desc+'</p>';
      grid.appendChild(card);
      io.observe(card);
    });
  })();

  /* ---------- 11. SUSTAINABLE FUTURE COMPARE SLIDER ---------- */
  (function compareSlider(){
    var container = document.getElementById('compareSlider');
    var sustainSide = container.querySelector('.compare-sustainable');
    var handle = document.getElementById('compareHandle');
    var dragging = false;

    function setPos(pct){
      pct = Math.max(6, Math.min(94, pct));
      sustainSide.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }
    setPos(50);

    function pctFromClientX(clientX){
      var rect = container.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }
    function onMove(clientX){ setPos(pctFromClientX(clientX)); }

    handle.addEventListener('pointerdown', function(e){ dragging = true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener('pointermove', function(e){ if(dragging) onMove(e.clientX); });
    window.addEventListener('pointerup', function(){ dragging = false; });

    handle.addEventListener('keydown', function(e){
      var current = parseFloat(handle.getAttribute('aria-valuenow'));
      if(e.key==='ArrowLeft'){ setPos(current-5); }
      if(e.key==='ArrowRight'){ setPos(current+5); }
    });
  })();

  /* ---------- reveal shared for hero-independent sections ---------- */
  observeAll('.reveal');

})();
