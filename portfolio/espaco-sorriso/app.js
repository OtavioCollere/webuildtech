/* ===== Espaço Sorriso — interactions & content ===== */
const WA = "https://wa.me/message/5QXDQ4NM6DM2B1";

/* ---- Lucide-style outline icons (stroke=currentColor) ---- */
const I = {
  smile:'<path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><circle cx="12" cy="12" r="10"/>',
  circleDot:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  layers:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  sparkles:'<path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
  align:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  feather:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>',
  baby:'<path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
  wind:'<path d="M9.59 4.59A2 2 0 1 1 11 8H2M12.59 19.41A2 2 0 1 0 14 16H2M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mapPin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  whatsapp:'<path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.595zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>'
};
function svg(name,extra=""){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${I[name]}</svg>`;}
function svgFill(name){return `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none">${I[name]}</svg>`;}

/* ---- Data ---- */
const treatments = [
  ['smile','Profilaxia','Remove tártaro e manchas, deixando os dentes mais lisos e polidos. Indicado para adultos e crianças.'],
  ['circleDot','Implantes','Repõe 1 ou mais dentes perdidos. Usamos implantes Neodent — do unitário ao protocolo total.'],
  ['sun','Clareamento Dentário','Para dentes amarelados e manchados. Opções de consultório, caseiro ou associado, com resultados incríveis.'],
  ['zap','Restaurações de Resina','Para dentes com cárie ou fraturas. Também substituímos restaurações antigas de amálgama.'],
  ['activity','Tratamento de Canal','Salva o dente com dor espontânea, necrose ou abscesso. Feito em 1 ou 2 sessões.'],
  ['layers','Próteses','Fixa ("jaqueta"), total ("dentadura"), parcial removível ou sobre implantes. Devolvemos função e estética.'],
  ['sparkles','Facetas','Resina ou porcelana para alterar formato, tamanho e cor. Tratamento conservador e previsível.'],
  ['scissors','Cirurgias','Extrações, sisos, implantes, enxertos ósseos e cirurgias gengivais, com todos os protocolos de segurança.'],
  ['align','Ortodontia','Braquetes metálicos, estéticos, autoligados ou alinhadores. Para crianças e adultos.'],
  ['feather','Harmonização Orofacial','Tratamentos estéticos faciais com resultado natural e sutil. A beleza está nos detalhes.'],
  ['baby','Atendimento Infantil','Desde os primeiros dentinhos, com acompanhamento do desenvolvimento facial e bucal.'],
  ['wind','Óxido Nitroso','Deixa o paciente relaxado durante o atendimento. Seguro e eficaz, indicado a partir dos 3 anos.']
];

const pros = [
  ['Dra. Janis Skoroski','Clínica Geral e Implantes','assets/dr-janis.png'],
  ['Dr. Kevin Pugas','Clínico Geral','assets/dr-kevin.png'],
  ['Dra. Fernanda Vian','Harmonização Orofacial','assets/dr-fernanda.png'],
  ['Dr. Maikon Becker','Ortodontia','assets/dr-maikon.png'],
  ['Fabiane Santana','Administração','assets/fabiane.png'],
  ['Isabela','Auxiliar Administrativa',null]
];

const testimonials = [
  ['Éber Blaskovi','Atendimento super humano. Tudo muito bem explicado. A doutora Janis é super atenciosa, recomendo.'],
  ['Verônica Mariano','Ótimo atendimento. Estou levando meu filho de 7 anos para tratamento. Obrigada a todos os colaboradores e profissionais que fazem nosso sorriso cada vez melhor.'],
  ['Norival Dias','Excelente Doutoras! Fui muito bem atendido, um ótimo atendimento e serviço.']
];

function initials(name){
  const p = name.replace(/^Dra?\.\s*/,'').trim().split(/\s+/);
  return ((p[0]||'')[0]||'') + ((p[1]||'')[0]||'');
}

/* ---- Render ---- */
function render(){
  // treatments
  document.getElementById('treat-grid').innerHTML = treatments.map(([ic,n,d])=>`
    <article class="treat-card reveal">
      <div class="treat-icon">${svg(ic)}</div>
      <h3>${n}</h3>
      <p>${d}</p>
      <a class="treat-link" href="${WA}" target="_blank" rel="noopener">Agendar →</a>
    </article>`).join('');

  // professionals
  document.getElementById('pro-grid').innerHTML = pros.map(([n,s,img])=>`
    <div class="pro-card reveal">
      ${img ? `<img class="pro-photo" src="${img}" alt="${n}">`
            : `<div class="pro-ph-initials">${initials(n).toUpperCase()}</div>`}
      <h4>${n}</h4>
      <span>${s}</span>
    </div>`).join('');

  // testimonials
  document.getElementById('test-grid').innerHTML = testimonials.map(([n,q])=>`
    <article class="test-card reveal">
      <div class="stars">${svgFill('star').repeat(5)}</div>
      <p class="test-quote">“${q}”</p>
      <div class="test-person">
        <div class="test-avatar">${initials(n).toUpperCase()}</div>
        <div><strong>${n}</strong><small>Paciente · Google</small></div>
      </div>
    </article>`).join('');
}

/* ---- Header scroll state + hero scale ---- */
function onScroll(){
  const header = document.querySelector('.header');
  header.classList.toggle('scrolled', window.scrollY > 60);

  const track = document.getElementById('hero-track');
  const frame = document.getElementById('hero-frame');
  if(track && frame){
    const rect = track.getBoundingClientRect();
    const maxScroll = track.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(scrolled / maxScroll, 1);
    const start = 0.34;
    const scale = start + progress * (1 - start);
    frame.style.transform = `scale(${scale.toFixed(4)})`;
    // text fades in as the image grows to fill the screen
    const content = document.getElementById('hero-content');
    if(content){
      const t = Math.max(0, Math.min(1, (progress - 0.42) / 0.4));
      content.style.opacity = t.toFixed(3);
      content.style.transform = `translateY(${((1-t)*22).toFixed(1)}px)`;
    }
    // fade scroll cue out as it grows
    const cue = document.getElementById('hero-cue');
    if(cue) cue.style.opacity = String(Math.max(0, 1 - progress*2.4));
  }
}

/* ---- Reveal on view ---- */
function initReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        e.target.style.transitionDelay = (Math.min(i,5)*0.08)+'s';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* ---- Mobile drawer ---- */
function initDrawer(){
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const open = ()=>{drawer.classList.add('open');overlay.classList.add('open');document.body.style.overflow='hidden';};
  const close = ()=>{drawer.classList.remove('open');overlay.classList.remove('open');document.body.style.overflow='';};
  document.getElementById('hamburger').addEventListener('click',open);
  document.getElementById('drawer-close').addEventListener('click',close);
  overlay.addEventListener('click',close);
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
}

document.addEventListener('DOMContentLoaded',()=>{
  render();
  initReveal();
  initDrawer();
  let ticking=false;
  window.addEventListener('scroll',()=>{
    if(!ticking){requestAnimationFrame(()=>{onScroll();ticking=false;});ticking=true;}
  },{passive:true});
  onScroll();
});
