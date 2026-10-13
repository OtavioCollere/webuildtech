// Main app — Ramaro Men landing
const BOOKING_URL = "https://sites.appbarber.com.br/barbeariaramaro-u5az";
const INSTAGRAM_URL = "https://instagram.com/ramaro.men";

const SERVICES = [
  { num: "01", name: "Barba", desc: "Limpeza, modelagem e finalização com toalha quente.", price: "R$ 50", time: "30 min" },
  { num: "02", name: "Barba Express", desc: "Barba com máquina na altura desejada + alinhamento na maçã do rosto.", price: "R$ 30", time: "15 min" },
  { num: "03", name: "Camuflagem", desc: "Tonalização discreta no cabelo ou barba — realça a cor natural e disfarça os fios brancos.", price: "A partir R$ 70", time: "30 min" },
  { num: "04", name: "Consultoria Visagismo", desc: "Análise personalizada do formato do rosto e estilo de vida para definir o corte ideal.", price: "R$ 1.000", time: "120 min" },
  { num: "05", name: "Corte", desc: "Corte com máquina e tesoura, lavagem e finalização.", price: "R$ 50", time: "30 min" },
  { num: "06", name: "Corte e Barba", desc: "Corte completo + barba modelada + lavar e finalizar.", price: "R$ 100", time: "60 min" },
];

const REVIEWS = [
  {
    name: "DanDan",
    where: "Google · São José dos Pinhais",
    initials: "DD",
    text: "Tudo ótimo na primeira experiência na Barbearia. Atendimento no whats, atendimento presencial, ambiente, louvores no local!",
  },
  {
    name: "Cleimarcio Moreira",
    where: "Google · São José dos Pinhais",
    initials: "CM",
    text: "Atendimento excelente e totalmente personalizado. Desde a chegada fui muito bem atendido, com atenção aos detalhes e ao que eu realmente queria.",
  },
  {
    name: "Diogo Henrique",
    where: "Google · São José dos Pinhais",
    initials: "DH",
    text: "Melhor barbearia de sjp e região, atendimento diferenciado demais — primeiro corte ou recorrente, sempre dão atenção a todos.",
  },
];

// --- Header ---
function Header({ onOpenDrawer }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={"hdr " + (scrolled ? "scrolled" : "")}>
      <a className="hdr-logo" href="#top" aria-label="Ramaro Men">
        <Icon.LogoMark />
        <span className="word">RAMARO</span>
      </a>
      <nav className="hdr-nav">
        <a href="#sobre">Sobre</a>
        <a href="#servicos">Serviços</a>
        <a href="#avaliacoes">Avaliações</a>
        <a href="#contato">Contato</a>
      </nav>
      <a href={BOOKING_URL} target="_blank" rel="noopener" className="hdr-cta">
        Agendar
        <Icon.ArrowRight style={{ width: 14, height: 14 }} />
      </a>
      <button className="hdr-burger" onClick={onOpenDrawer} aria-label="Menu">
        <Icon.Menu style={{ width: 24, height: 24 }} />
      </button>
    </header>
  );
}

function Drawer({ open, onClose }) {
  return (
    <div className={"drawer " + (open ? "open" : "")}>
      <div className="drawer-top">
        <a className="hdr-logo" href="#top" onClick={onClose}>
          <Icon.LogoMark style={{ width: 22, height: 22 }} />
          <span className="word">RAMARO</span>
        </a>
        <button onClick={onClose} aria-label="Fechar"><Icon.Close style={{ width: 24, height: 24, color: 'var(--cream)' }}/></button>
      </div>
      <nav className="drawer-nav">
        <a href="#sobre" onClick={onClose}>Sobre</a>
        <a href="#ambiente" onClick={onClose}>Ambiente</a>
        <a href="#servicos" onClick={onClose}>Serviços</a>
        <a href="#avaliacoes" onClick={onClose}>Avaliações</a>
        <a href="#contato" onClick={onClose}>Contato</a>
      </nav>
      <a href={BOOKING_URL} target="_blank" rel="noopener" className="cta drawer-cta">
        Agendar horário <Icon.ArrowRight className="arrow" style={{ width: 16, height: 16 }} />
      </a>
    </div>
  );
}

// --- Hero ---
function Hero() {
  return (
    <section className="hero" id="top">
      <Blob color="#2C5F2E" opacity={0.18} variant={2} style={{ width: 720, height: 720, top: -260, right: -200 }} />
      <Blob color="#C8A96E" opacity={0.05} variant={3} style={{ width: 480, height: 480, bottom: -180, left: -120 }} />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-text">
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                <span className="overline">Barbearia · São José dos Pinhais</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="hero-title">
                <span className="nowrap">O corte certo.</span><br/>
                <span className="nowrap"><em>No lugar</em> certo.</span>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="hero-sub">Um espaço pensado para o homem que valoriza cada detalhe — da conversa na cadeira ao último alinhamento na nuca.</p>
            </Reveal>
            <Reveal delay={3}>
              <div className="hero-actions">
                <a className="cta" href={BOOKING_URL} target="_blank" rel="noopener">
                  Agendar horário <Icon.ArrowRight className="arrow" style={{ width: 16, height: 16 }} />
                </a>
                <a className="ghost no-border" href="#servicos">
                  Ver serviços <Icon.ArrowDown style={{ width: 14, height: 14 }} />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2} className="hero-art">
            <HeroR />
          </Reveal>
        </div>
      </div>
      <a href="#manifesto" className="scroll-cue" aria-label="Continuar">
        <span style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase' }}>Role</span>
        <span className="dot-line"></span>
        <Icon.Chevron style={{ width: 16, height: 16 }} />
      </a>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 34, lineHeight: 1, color: 'var(--gold)' }}>{number}</div>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
    </div>
  );
}


// --- Hero window: photo in an organic shape echoing the logo (rounded top-right) ---
function HeroR() {
  const shape = '8px 120px 8px 8px';
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* offset gold outline echoing the shape */}
      <div style={{
        position: 'absolute', inset: '18px -16px -16px 18px',
        border: '1px solid rgba(200,169,110,0.38)',
        borderRadius: shape,
        pointerEvents: 'none',
      }}/>
      {/* framed photo */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: shape,
        overflow: 'hidden',
        boxShadow: '0 34px 80px rgba(0,0,0,0.42)',
      }}>
        <img
          src="assets/recepcao.png"
          alt="Recepção Ramaro Men"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(26,46,27,0.08), rgba(26,46,27,0.30))',
          pointerEvents: 'none',
        }}/>
      </div>
    </div>
  );
}

// --- Manifesto ---
function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <Blob color="#D46B3A" opacity={0.04} variant={1} style={{ width: 520, height: 520, bottom: -200, left: -180 }} />
      <Blob color="#2C5F2E" opacity={0.04} variant={3} style={{ width: 400, height: 400, top: -120, right: -100 }} />
      <div className="wrap">
        <div className="manifesto-grid">
          <div className="manifesto-text">
            <Reveal delay={1}>
              <p className="manifesto-line">Não confunda qualidade<br/>com <em>passar a máquina</em> sem falhas.</p>
            </Reveal>
            <div className="manifesto-spacer"></div>
            <Reveal delay={2}>
              <p className="manifesto-label">— Isso é o básico.</p>
            </Reveal>
            <div className="manifesto-spacer"></div>
            <Reveal delay={3}>
              <p className="manifesto-line" style={{ marginTop: 8 }}>
                Qualidade é entender seu <em>estilo</em>,<br/>
                valorizar sua <em>identidade</em><br/>
                e entregar um resultado único.
              </p>
            </Reveal>
            <div className="manifesto-spacer"></div>
            <Reveal delay={4}>
              <p className="manifesto-label" style={{ color: 'var(--moss)' }}>— Isso é RAMARO.</p>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <div className="manifesto-video">
              <video src="assets/ramaro.mp4" autoPlay muted loop playsInline></video>
              <div className="video-label">
                <span className="live-dot"></span>
                <span>Em movimento</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// --- Sobre ---
function Sobre() {
  return (
    <section className="sobre" id="sobre">
      <Blob color="#2C5F2E" opacity={0.22} variant={2} style={{ width: 800, height: 800, top: -300, right: -250 }} />
      <Blob color="#C8A96E" opacity={0.04} variant={1} style={{ width: 380, height: 380, bottom: -120, left: -120 }} />
      <div className="wrap">
        <div className="sobre-grid">
          <Reveal>
            <div className="sobre-photo">
              <div className="mask-host">
                <img src="assets/ramaro-perfil.png" alt="Ramaro, fundador da Ramaro Men" />
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
                <span className="overline">Quem está por trás de cada corte</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="sobre-title">Mais de uma década.<br/><em>Uma só</em> missão.</h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="body-text on-dark" style={{ marginTop: 32, maxWidth: 520 }}>
                Sou <strong style={{ color: 'var(--cream)', fontWeight: 500 }}>Ronaldo Ramalho</strong>, fundador da Ramaro Men. Comecei como barbeiro por paixão — e fui construindo um espaço onde cada cliente se sente único.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <p className="body-text on-dark" style={{ marginTop: 20, maxWidth: 520 }}>
                Aqui não existe atendimento padrão. Existe atenção, técnica e o cuidado que você merece — do primeiro corte ao último detalhe da barba.
              </p>
            </Reveal>
            <Reveal delay={4}>
              <p className="sobre-sig">— R. Ramalho</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Ambiente: floating parallax (desktop) / carousel (mobile) ---
function Ambiente() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 881px)').matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 881px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  }, []);
  const items = [
    { src: "assets/recepcao.png", depth: 1.4, style: { top: '8%', left: '6%', width: 220, height: 280 } },
    { src: "assets/salao.png",    depth: 0.8, style: { top: '14%', right: '8%', width: 280, height: 200 } },
    { src: "assets/fachada.png",  depth: 2.0, style: { bottom: '12%', left: '10%', width: 200, height: 260 } },
    { src: "assets/corte-1.png",  depth: 1.0, style: { top: '5%',  left: '40%', width: 160, height: 200 } },
    { src: "assets/corte-2.png",  depth: 2.6, style: { bottom: '8%', right: '12%', width: 220, height: 280 } },
    { src: "assets/corte-3.png",  depth: 1.6, style: { top: '38%', left: '2%',  width: 140, height: 180 } },
    { src: "assets/corte-4.png",  depth: 2.2, style: { bottom: '18%', left: '34%', width: 170, height: 210 } },
    { src: "assets/ronaldo.png",  depth: 0.6, style: { top: '32%', right: '2%', width: 150, height: 200 } },
  ];

  return (
    <section className="ambiente" id="ambiente">
      <Blob color="#2C5F2E" opacity={0.18} variant={1} style={{ width: 800, height: 800, top: '-25%', left: '-15%' }} />
      {isDesktop && (
        <div className="ambiente-stage">
          <Floating sensitivity={1.0} easing={0.045}>
            {items.map((it, i) => (
              <FloatingElement key={i} depth={it.depth} style={it.style}>
                <div className="float-img" style={{ width: '100%', height: '100%' }}>
                  <img src={it.src} alt="Ramaro ambiente" />
                </div>
              </FloatingElement>
            ))}
          </Floating>
        </div>
      )}
      <div className="ambiente-center">
        <Reveal>
          <span className="overline" style={{ color: 'var(--gold)' }}>Galeria do ambiente</span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="word"><em>ambiente.</em></h2>
        </Reveal>
        <Reveal delay={2}>
          <p className="sub">Um espaço que você não vai querer deixar.</p>
        </Reveal>
        <Reveal delay={3}>
          <a className="ghost" href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ marginTop: 26 }}>
            <Icon.Instagram style={{ width: 14, height: 14 }} />
            @ramaro.men
          </a>
        </Reveal>
      </div>
      {!isDesktop && (
        <div className="ambiente-carousel-mobile">
          {items.map((it, i) => (
            <div className="ambiente-slide" key={i}>
              <img src={it.src} alt="Ramaro ambiente" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// --- Servicos ---
function Servicos() {
  return (
    <section className="servicos" id="servicos">
      <Blob color="#2C5F2E" opacity={0.05} variant={2} style={{ width: 500, height: 500, top: -180, right: -180 }} />
      <Blob color="#C8A96E" opacity={0.06} variant={1} style={{ width: 380, height: 380, bottom: -160, left: -100 }} />
      <div className="wrap">
        <div className="servicos-head">
          <div>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span className="overline on-light">Nossos serviços</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="servicos-title">Do corte à navalha.<br/><em>Tudo</em> com precisão.</h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <p className="body-text" style={{ maxWidth: 420 }}>
              Cada serviço com tempo dedicado — sem pressa, sem padrão. Tabela completa de preços e duração, atualizada para 2026.
            </p>
          </Reveal>
        </div>

        <div className="servicos-grid">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) + 1} className="svc">
              <span className="svc-num">{s.num}</span>
              <h3 className="svc-name">{s.name}</h3>
              <p className="svc-desc">{s.desc}</p>
              <div className="svc-row">
                <span className="svc-price">{s.price}</span>
                <span className="svc-time"><Icon.Clock style={{ width: 12, height: 12 }} /> {s.time}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="servicos-foot">
          <Reveal>
            <p className="note">Atendimento por agendamento — chegue 5 min antes do horário para um café antes do corte.</p>
          </Reveal>
          <Reveal delay={1}>
            <a className="cta" href={BOOKING_URL} target="_blank" rel="noopener">
              Agendar agora <Icon.ArrowRight className="arrow" style={{ width: 16, height: 16 }} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// --- Trabalho ---
function Trabalho() {
  const items = [
    { src: "assets/corte-1.png", num: "01", label: "Curly Crop" },
    { src: "assets/espaco-kids.png", num: "02", label: "Espaço Kids" },
    { src: "assets/corte-3.png", num: "03", label: "JIT Fade" },
    { src: "assets/corte-4.png", num: "04", label: "Burst Fade" },
  ];
  return (
    <section className="trabalho">
      <div className="wrap">
        <div className="trabalho-head">
          <div>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span className="overline on-light">Nosso trabalho</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="trabalho-title">Cada frame, <em>um</em> resultado.</h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <a className="ghost no-border" href={INSTAGRAM_URL} target="_blank" rel="noopener" style={{ color: 'var(--moss)' }}>
              Ver mais no Instagram <Icon.ArrowRight style={{ width: 14, height: 14 }} />
            </a>
          </Reveal>
        </div>
        <div className="trabalho-grid">
          {items.map((it, i) => (
            <Reveal key={i} delay={(i % 4) + 1}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="trab">
                <img src={it.src} alt={it.label} />
                <div className="meta">
                  <span className="num">{it.num}</span>
                  {it.label}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Reviews ---
function Reviews() {
  return (
    <section className="reviews" id="avaliacoes">
      <Blob color="#2C5F2E" opacity={0.22} variant={2} style={{ width: 720, height: 720, top: -260, left: -240 }} />
      <Blob color="#C8A96E" opacity={0.04} variant={3} style={{ width: 380, height: 380, bottom: -120, right: -100 }} />
      <div className="wrap">
        <div className="reviews-head">
          <div>
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span className="overline">O que dizem nossos clientes</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="reviews-title">Reconhecidos por quem<br/><em>senta</em> na cadeira.</h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <div className="reviews-meta">
              <span>Avaliações reais no Google.<br/>Pessoas reais. Cortes reais.<br/>Atendimento personalizado.</span>
            </div>
          </Reveal>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <Reveal key={i} delay={i+1}>
              <div className="review">
                <div className="stars">
                  {[0,1,2,3,4].map(n => <Icon.Star key={n} style={{ width: 14, height: 14 }} />)}
                </div>
                <p className="quote">"{r.text}"</p>
                <div className="person">
                  <div className="avatar">{r.initials}</div>
                  <div>
                    <div className="who">{r.name}</div>
                    <div className="where">{r.where}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CTA Final ---
function CtaFinal() {
  return (
    <section className="cta-final" id="contato">
      <Blob color="#1A2E1B" opacity={0.4} variant={2} style={{ width: 900, height: 900, bottom: -500, right: -200 }} />
      <Blob color="#C8A96E" opacity={0.08} variant={1} style={{ width: 380, height: 380, top: -120, left: -100 }} />
      <div className="wrap">
        <div className="cta-final-inner">
          <div>
            <Reveal>
              <span className="overline" style={{ color: 'var(--cream)', opacity: 0.7 }}>Sua vez</span>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="cta-final-title" style={{ marginTop: 18 }}>
                Pronto para o<br/>seu <em>melhor</em> corte?
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="cta-final-sub">Agende agora. Seu estilo, no seu tempo — sem pressa, sem corte de série.</p>
            </Reveal>
            <Reveal delay={3}>
              <a className="cta large light" href={BOOKING_URL} target="_blank" rel="noopener" style={{ marginTop: 36 }}>
                Agendar horário
                <Icon.ArrowRight className="arrow" style={{ width: 18, height: 18 }} />
              </a>
            </Reveal>
          </div>

          <Reveal delay={2} className="cta-final-side">
            <div className="contact-block">
              <div className="contact-row">
                <Icon.Pin className="icon" style={{ width: 18, height: 18 }} />
                <div>
                  Rua Dona Izabel A. Redentora, 623<br/>
                  São Domingos · São José dos Pinhais — PR
                </div>
              </div>
              <div className="contact-row">
                <Icon.Instagram className="icon" style={{ width: 18, height: 18 }} />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener">@ramaro.men</a>
              </div>
              <div className="contact-row">
                <Icon.Clock className="icon" style={{ width: 18, height: 18 }} />
                <div>
                  Seg — Sex · 08h às 19h<br/>
                  Sábado · 08h às 17h
                </div>
              </div>
            </div>
            <div className="map-card">
              <iframe
                title="Localização Ramaro Men"
                src="https://www.google.com/maps?q=Rua%20Dona%20Izabel%20A.%20Redentora%2C%20623%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20-%20PR&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
              <a className="map-pin" href="https://www.google.com/maps?q=Rua%20Dona%20Izabel%20A.%20Redentora%2C%20623%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20-%20PR" target="_blank" rel="noopener">
                <Icon.Pin style={{ width: 13, height: 13 }} /> Como chegar
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <Icon.LogoMark className="ftr-mark" style={{ width: 38, height: 38 }} />
        <nav className="ftr-links">
          <a href="#sobre">Sobre</a>
          <a href="#servicos">Serviços</a>
          <a href={BOOKING_URL} target="_blank" rel="noopener">Agendar</a>
        </nav>
        <div className="ftr-social">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram"><Icon.Instagram style={{ width: 18, height: 18 }} /></a>
          <a href="#" aria-label="Facebook"><Icon.Facebook style={{ width: 18, height: 18 }} /></a>
          <a href="#" aria-label="WhatsApp"><Icon.Whats style={{ width: 18, height: 18 }} /></a>
        </div>
        <div className="ftr-copy">© 2026 Ramaro Men · São José dos Pinhais, PR · Todos os direitos reservados</div>
      </div>
    </footer>
  );
}

// --- App ---
function App() {
  const [drawer, setDrawer] = useState(false);
  return (
    <>
      <Header onOpenDrawer={() => setDrawer(true)} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} />
      <Hero />
      <Manifesto />
      <Sobre />
      <Ambiente />
      <Servicos />
      <Trabalho />
      <Reviews />
      <CtaFinal />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
