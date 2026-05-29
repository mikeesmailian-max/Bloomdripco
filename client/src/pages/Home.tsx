import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

// ── DATA ──────────────────────────────────────────────────────────────────
const DRIPS = [
  { cat: "wellness", badge: "bw", badgeLabel: "Wellness", name: "Myers Cocktail", tagline: "The gold standard of IV wellness", pills: ["Vitamin C","B-Complex","Magnesium","Calcium","Zinc"], detail: "The Myers Cocktail is the most celebrated IV formula in wellness medicine. This combination of essential vitamins and minerals supports immune function, boosts energy, reduces inflammation, and enhances mood. Ideal for overall vitality maintenance." },
  { cat: "anti-aging", badge: "ba", badgeLabel: "Anti-Aging", name: "NAD+ Infusion", tagline: "Cellular regeneration & longevity", pills: ["NAD+","B12","Amino Acids","Saline"], detail: "NAD+ is a coenzyme essential to cellular metabolism and DNA repair. Levels naturally decline with age. Our NAD+ infusion restores cellular energy, improves cognitive clarity, supports recovery, and promotes longevity at the molecular level." },
  { cat: "immunity", badge: "bi", badgeLabel: "Immunity", name: "Immunity Shield", tagline: "Fortress-level immune support", pills: ["High-Dose Vit C","Zinc","Glutathione","B12"], detail: "Supercharge your immune system with mega-dose Vitamin C paired with Zinc, Glutathione, and B12. Perfect before travel, during cold & flu season, or whenever you need your body's defenses at peak performance." },
  { cat: "recovery", badge: "br", badgeLabel: "Recovery", name: "Hangover Rescue", tagline: "From hazy to amazing in 45 minutes", pills: ["Saline","Zofran","Toradol","B-Complex","Electrolytes"], detail: "Rapid rehydration with anti-nausea (Zofran) and anti-inflammatory (Toradol) medications restore your body fast. B-Complex replenishes what alcohol depletes. Most clients feel dramatically better within 30 minutes of completion." },
  { cat: "beauty", badge: "bb", badgeLabel: "Beauty", name: "Bloom Beauty Glow", tagline: "Your skin's new favorite treatment", pills: ["Glutathione","Biotin","Vitamin C","Collagen Boost"], detail: "Our signature beauty formula: Glutathione for skin brightening, Biotin for hair & nail strength, Vitamin C for collagen synthesis, plus collagen peptide boost. Result: visibly radiant skin, stronger nails, lustrous hair — from the inside out." },
];

const BADGE_CLASSES: Record<string, string> = {
  bw: "bg-[rgba(61,139,122,.18)] text-[#68c4ae] border border-[rgba(61,139,122,.3)]",
  ba: "bg-[rgba(201,168,76,.14)] text-[#e5ca70] border border-[rgba(201,168,76,.28)]",
  bi: "bg-[rgba(168,104,120,.18)] text-[#d4a0af] border border-[rgba(168,104,120,.3)]",
  br: "bg-[rgba(122,106,184,.18)] text-[#b0a4e0] border border-[rgba(122,106,184,.3)]",
  bb: "bg-[rgba(168,104,120,.18)] text-[#e0b4c4] border border-[rgba(168,104,120,.24)]",
};

const TYPEWRITER_WORDS = ["Bloom", "Glow", "Thrive", "Radiate", "Recover"];

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [openDrip, setOpenDrip] = useState<number | null>(null);
  const [twWord, setTwWord] = useState(0);
  const [sessions, setSessions] = useState(3);
  const [referrals, setReferrals] = useState(2);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const revealRefs = useRef<HTMLElement[]>([]);

  // Typewriter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTwWord(w => (w + 1) % TYPEWRITER_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll progress
  useEffect(() => {
    const bar = document.getElementById("progress");
    const onScroll = () => {
      if (!bar) return;
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom cursor
  useEffect(() => {
    const dot = document.getElementById("cur-dot");
    const ring = document.getElementById("cur-ring");
    let rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      if (dot) { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; }
      rx += (e.clientX - rx) * 0.12;
      ry += (e.clientY - ry) * 0.12;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
    };
    let raf: number;
    const loop = () => { raf = requestAnimationFrame(loop); };
    loop();
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Nav solid on scroll
  useEffect(() => {
    const nav = document.getElementById("main-nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 40) nav.classList.add("solid");
      else nav.classList.remove("solid");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const calcPoints = () => sessions * 150 + referrals * 250 + 100;

  const filteredDrips = filter === "all" ? DRIPS : DRIPS.filter(d => d.cat === filter);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPwd) { setLoginErr("Please fill in all fields."); return; }
    setLoginErr("Please visit /admin to log in to the admin dashboard.");
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--cream)", fontFamily: "'Inter', sans-serif", minHeight: "100vh", cursor: "none" }}>
      {/* Cursor */}
      <div id="cur-dot" />
      <div id="cur-ring" />
      {/* Progress */}
      <div id="progress" />

      {/* ── NAV ── */}
      <nav id="main-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, transition: "background 0.38s, backdrop-filter 0.38s, box-shadow 0.38s" }}>
        <style>{`
          nav#main-nav.solid { background: rgba(2,11,20,.94); backdrop-filter: blur(18px); box-shadow: 0 1px 0 rgba(201,168,76,.28); }
          .nav-links-ul { display: flex; gap: 2rem; list-style: none; }
          .nav-links-ul a { font-size: .8rem; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: rgba(237,234,224,.55); transition: color 0.38s; }
          .nav-links-ul a:hover { color: var(--gold); }
          .btn-signin-nav { display: flex; align-items: center; gap: .45rem; background: rgba(255,255,255,.024); border: 1px solid rgba(255,255,255,.07); color: rgba(237,234,224,.55); font-size: .78rem; font-weight: 500; padding: .5rem 1.1rem; border-radius: 50px; transition: all 0.38s; letter-spacing: .04em; white-space: nowrap; cursor: pointer; }
          .btn-signin-nav:hover { background: rgba(255,255,255,.046); border-color: rgba(201,168,76,.28); color: var(--cream); }
          .btn-nav-book { background: linear-gradient(135deg,var(--gold),var(--gold-lt)); color: #050300; font-size: .78rem; font-weight: 700; padding: .58rem 1.4rem; border-radius: 50px; letter-spacing: .06em; text-transform: uppercase; transition: all 0.38s; box-shadow: 0 4px 18px rgba(201,168,76,.32); white-space: nowrap; display: inline-block; }
          .btn-nav-book:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(201,168,76,.5); }
          @media(max-width:768px) { .nav-links-ul { display: none; } }
        `}</style>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.42rem", fontWeight: 600, letterSpacing: ".04em", color: "var(--cream)" }}>
          Bloom <span style={{ color: "var(--gold)" }}>Drip</span> Co.
        </div>
        <ul className="nav-links-ul">
          <li><a href="#howitworks">How It Works</a></li>
          <li><a href="#menu">IV Menu</a></li>
          <li><a href="#memberships">Memberships</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#testimonials">Reviews</a></li>

        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: ".9rem" }}>
          <button className="btn-signin-nav" onClick={() => setLoginOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            Sign In
          </button>
          <a href="#booking" className="btn-nav-book">Book Now</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "7rem 5% 5rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 55% at 50% 38%,rgba(201,168,76,.07) 0%,transparent 72%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 880 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "rgba(201,168,76,.09)", border: "1px solid rgba(201,168,76,.28)", padding: ".38rem 1rem", borderRadius: 50, fontSize: ".72rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold-lt)", marginBottom: "2rem" }}>
            <span style={{ width: 6, height: 6, background: "var(--gold)", borderRadius: "50%", animation: "blink 2s infinite", display: "inline-block" }} />
            ✦ Luxury Mobile IV Therapy · Los Angeles
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem,8vw,7.5rem)", fontWeight: 700, lineHeight: 1.04, letterSpacing: "-.025em", color: "var(--cream)", marginBottom: "1.5rem" }}>
            Arrive Ready<br />to <em style={{ fontStyle: "italic", color: "var(--gold)" }}>{TYPEWRITER_WORDS[twWord]}</em>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(237,234,224,.55)", maxWidth: 500, margin: "0 auto 2.5rem", fontWeight: 300, lineHeight: 1.8 }}>
            Elite IV wellness delivered to your door by certified Registered Nurses. Rejuvenate, recover, and radiate — on your schedule.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.1rem", flexWrap: "wrap", marginBottom: "4.5rem" }}>
            <a href="#booking" style={{ background: "linear-gradient(135deg,var(--gold),var(--gold-lt))", color: "#040200", fontSize: ".88rem", fontWeight: 700, padding: ".9rem 2.4rem", borderRadius: 50, letterSpacing: ".07em", textTransform: "uppercase", transition: "all 0.38s", boxShadow: "0 6px 28px rgba(201,168,76,.35)", display: "inline-block" }}>Book Your Session</a>
            <button onClick={() => setLoginOpen(true)} style={{ background: "transparent", border: "1.5px solid rgba(201,168,76,.28)", color: "var(--cream)", fontSize: ".88rem", fontWeight: 500, padding: ".88rem 2.2rem", borderRadius: 50, letterSpacing: ".05em", transition: "all 0.38s", cursor: "pointer" }}>Create Account</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
            {[["2,400+","Sessions Delivered"],["98%","Client Satisfaction"],["60 min","Avg Arrival Time"],["RN","Certified Nurses"]].map(([num,lbl]) => (
              <div key={lbl}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 600, color: "var(--gold)", display: "block" }}>{num}</span>
                <span style={{ fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(237,234,224,.28)" }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem", color: "rgba(237,234,224,.28)", fontSize: ".68rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
          Scroll
          <span style={{ width: 1, height: 46, background: "linear-gradient(to bottom,rgba(201,168,76,.28),transparent)", animation: "scrollAnim 2.2s ease-in-out infinite", display: "block" }} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="howitworks" style={{ background: "linear-gradient(to bottom,var(--bg),var(--bg2))", padding: "7rem 5%" }}>
        <div className="reveal s-head" style={{ marginBottom: "3.8rem" }}>
          <div className="s-tag">The Process</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>Luxury Wellness, <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Effortlessly</em></h2>
          <div className="gold-line" />
          <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", maxWidth: 460, lineHeight: 1.78, fontWeight: 300 }}>From booking to infusion — we make elite IV therapy seamlessly convenient.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "1.8rem", counterReset: "step" }}>
          {[
            { icon: "📱", title: "Book Online", text: "Schedule in minutes through our site or call (818) 515-8980. Choose your drip, time, and location.", delay: "d1" },
            { icon: "🏥", title: "RN Arrives", text: "A certified Registered Nurse arrives at your home, hotel, or office — professional, discreet, on-time.", delay: "d2" },
            { icon: "💧", title: "Infusion Begins", text: "Relax as your custom IV is administered. Sessions take 45–60 minutes. Unwind or enjoy your favorite show.", delay: "d3" },
            { icon: "✨", title: "Feel the Difference", text: "IV nutrients absorb at 100% bioavailability. Most clients feel results within hours — energy, clarity, glow.", delay: "d4" },
          ].map((s, i) => (
            <div key={i} className={`reveal ${s.delay}`} style={{ background: "var(--glass)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "2.4rem 2rem", position: "relative", overflow: "hidden", transition: "all 0.38s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--glass-h)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,.28)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--glass)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
              <div style={{ position: "absolute", top: "-.6rem", right: "1.2rem", fontFamily: "'Playfair Display', serif", fontSize: "5rem", fontWeight: 700, color: "rgba(201,168,76,.07)", lineHeight: 1 }}>{String(i+1).padStart(2,"0")}</div>
              <div style={{ width: 50, height: 50, background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: "1.4rem" }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.18rem", fontWeight: 600, color: "var(--cream)", marginBottom: ".5rem" }}>{s.title}</h3>
              <p style={{ fontSize: ".84rem", color: "rgba(237,234,224,.55)", lineHeight: 1.72 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IV MENU ── */}
      <section id="menu" style={{ background: "var(--bg2)", padding: "7rem 5%" }}>
        <div className="reveal s-head" style={{ marginBottom: "3.8rem" }}>
          <div className="s-tag">The Drip Menu</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>Curated <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Infusions</em></h2>
          <div className="gold-line" />
          <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", maxWidth: 460, lineHeight: 1.78, fontWeight: 300 }}>Our top five most-requested formulations — each crafted by medical experts for maximum efficacy.</p>
        </div>
        <div className="reveal" style={{ display: "flex", gap: ".55rem", flexWrap: "wrap", marginBottom: "2.8rem" }}>
          {["all","wellness","anti-aging","immunity","recovery","beauty"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "var(--gold)" : "var(--glass)", border: `1px solid ${filter === f ? "var(--gold)" : "var(--border-color)"}`, color: filter === f ? "#040200" : "rgba(237,234,224,.55)", fontSize: ".75rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "capitalize", padding: ".5rem 1.2rem", borderRadius: 50, transition: "all 0.38s", cursor: "pointer" }}>
              {f === "all" ? "All Drips" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(295px,1fr))", gap: "1.8rem" }}>
          {filteredDrips.map((drip, i) => (
            <div key={drip.name} className={`reveal d${(i%4)+1}`} style={{ background: "var(--glass)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "2rem", position: "relative", overflow: "hidden", transition: "all 0.4s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,.28)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 40px rgba(201,168,76,.13)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
              <span className={`${BADGE_CLASSES[drip.badge]}`} style={{ display: "inline-block", fontSize: ".66rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: ".28rem .75rem", borderRadius: 50, marginBottom: "1.1rem" }}>{drip.badgeLabel}</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--cream)", marginBottom: ".4rem" }}>{drip.name}</h3>
              <div style={{ fontSize: ".8rem", color: "rgba(237,234,224,.28)", marginBottom: "1rem", fontStyle: "italic" }}>{drip.tagline}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: "1.3rem" }}>
                {drip.pills.map(p => <span key={p} style={{ fontSize: ".68rem", padding: ".22rem .62rem", background: "rgba(237,234,224,.10)", borderRadius: 50, color: "rgba(237,234,224,.55)" }}>{p}</span>)}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.55rem", fontWeight: 600, color: "var(--gold)" }}>
                  <sup style={{ fontSize: ".85rem", position: "relative", top: "-.35em" }}>$</sup>Contact
                </div>
                <button onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })} style={{ fontSize: ".72rem", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", padding: ".5rem 1.1rem", borderRadius: 50, background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,.28)", color: "var(--gold-lt)", transition: "all 0.38s", cursor: "pointer" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold)"; (e.currentTarget as HTMLButtonElement).style.color = "#040200"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold-dim)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold-lt)"; }}>
                  Book Now
                </button>
              </div>
              <button onClick={() => setOpenDrip(openDrip === i ? null : i)} style={{ width: "100%", textAlign: "center", fontSize: ".72rem", color: "rgba(237,234,224,.28)", letterSpacing: ".06em", textTransform: "uppercase", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", marginTop: "1.1rem", transition: "color 0.38s", cursor: "pointer", background: "none" }}>
                {openDrip === i ? "▴ Close" : "▾ Learn More"}
              </button>
              {openDrip === i && (
                <div style={{ fontSize: ".82rem", color: "rgba(237,234,224,.55)", lineHeight: 1.72, padding: ".8rem 0 .2rem" }}>{drip.detail}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── MEMBERSHIPS ── */}
      <section id="memberships" style={{ background: "linear-gradient(to bottom,var(--bg2),var(--bg3))", padding: "7rem 5%" }}>
        <div className="reveal s-head" style={{ marginBottom: "3.8rem" }}>
          <div className="s-tag">Membership Plans</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>Invest in Your <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Wellness</em></h2>
          <div className="gold-line" />
          <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", maxWidth: 460, lineHeight: 1.78, fontWeight: 300 }}>Commit to your health with a monthly plan and enjoy exclusive pricing, priority scheduling, and premium benefits.</p>
        </div>
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(275px,1fr))", gap: "1.8rem", maxWidth: 980 }}>
          {[
            { tag: "Starter", name: "Bloom Starter", desc: "Begin your wellness journey", feats: ["1 IV session per month","100 Bloom Points per session","Email appointment reminders","Access to member events"], featured: false },
            { tag: "✦ Most Popular", name: "Bloom Glow", desc: "The complete wellness experience", feats: ["2 IV sessions per month","150 Bloom Points per session","1 complimentary add-on/month","Priority scheduling","Birthday drip discount","SMS reminders & rebooking"], featured: true },
            { tag: "Elite", name: "Bloom Elite", desc: "Unlimited luxury wellness", feats: ["4 IV sessions per month","200 Bloom Points per session","All add-ons included","Dedicated RN assignment","VIP event access","Concierge priority booking"], featured: false },
          ].map(plan => (
            <div key={plan.name} style={{ background: plan.featured ? "linear-gradient(135deg,rgba(201,168,76,.07),rgba(201,168,76,.025))" : "var(--glass)", border: `1px solid ${plan.featured ? "rgba(201,168,76,.28)" : "var(--border-color)"}`, borderRadius: 16, padding: "2.4rem", position: "relative", transition: "all 0.38s", boxShadow: plan.featured ? "0 0 40px rgba(201,168,76,.13)" : "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: ".66rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,.28)", padding: ".28rem .75rem", borderRadius: 50, display: "inline-block", marginBottom: "1.4rem" }}>{plan.tag}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", fontWeight: 600, color: "var(--cream)", marginBottom: ".4rem" }}>{plan.name}</h3>
              <div style={{ fontSize: ".8rem", color: "rgba(237,234,224,.55)", marginBottom: "1.4rem", fontStyle: "italic" }}>{plan.desc}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "rgba(237,234,224,.55)", marginBottom: "1.6rem" }}>Contact for Pricing</div>
              <ul style={{ listStyle: "none", marginBottom: "1.8rem", display: "flex", flexDirection: "column", gap: ".7rem" }}>
                {plan.feats.map(f => (
                  <li key={f} style={{ fontSize: ".83rem", color: "rgba(237,234,224,.55)", display: "flex", alignItems: "flex-start", gap: ".65rem", lineHeight: 1.52 }}>
                    <span style={{ color: "var(--gold)", fontSize: ".6rem", marginTop: ".22rem", flexShrink: 0 }}>✦</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setLoginOpen(true)} style={{ width: "100%", padding: ".82rem", borderRadius: 50, fontSize: ".8rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", transition: "all 0.38s", cursor: "pointer", background: plan.featured ? "linear-gradient(135deg,var(--gold),var(--gold-lt))" : "transparent", border: plan.featured ? "none" : "1.5px solid var(--border-color)", color: plan.featured ? "#040200" : "rgba(237,234,224,.55)", boxShadow: plan.featured ? "0 6px 22px rgba(201,168,76,.3)" : "none" }}>
                {plan.featured ? "Choose Glow" : plan.tag === "Starter" ? "Get Started" : "Choose Elite"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOYALTY ── */}
      <section id="loyalty" style={{ background: "var(--bg3)", padding: "7rem 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <div className="s-tag reveal">Bloom Rewards</div>
            <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>Earn With <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Every Drop</em></h2>
            <div className="gold-line reveal" />
            <p className="reveal" style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", maxWidth: 460, lineHeight: 1.78, fontWeight: 300, marginBottom: "1.8rem" }}>Every session earns toward exclusive rewards. Refer friends, book online, celebrate birthdays — every interaction counts.</p>
            <div className="reveal" style={{ background: "var(--glass)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "1.8rem" }}>
              <div style={{ fontWeight: 600, color: "var(--cream)", marginBottom: "1.1rem", fontFamily: "'Playfair Display', serif", fontSize: "1rem" }}>Points Calculator</div>
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={{ fontSize: ".75rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "flex", justifyContent: "space-between", marginBottom: ".45rem" }}>
                  Sessions / month <span style={{ color: "var(--gold)", fontWeight: 600 }}>{sessions}</span>
                </label>
                <input type="range" min={1} max={12} value={sessions} onChange={e => setSessions(+e.target.value)} style={{ width: "100%", accentColor: "var(--gold)" }} />
              </div>
              <div style={{ marginBottom: "1.1rem" }}>
                <label style={{ fontSize: ".75rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "flex", justifyContent: "space-between", marginBottom: ".45rem" }}>
                  Friends referred <span style={{ color: "var(--gold)", fontWeight: 600 }}>{referrals}</span>
                </label>
                <input type="range" min={0} max={10} value={referrals} onChange={e => setReferrals(+e.target.value)} style={{ width: "100%", accentColor: "var(--gold)" }} />
              </div>
              <div style={{ textAlign: "center", padding: ".9rem", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold)" }}>{calcPoints()} pts</div>
                <div style={{ fontSize: ".72rem", letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(237,234,224,.28)" }}>Est. Monthly Points</div>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div style={{ width: 210, height: 210, borderRadius: "50%", background: "conic-gradient(var(--gold) 0deg,var(--gold-lt) 90deg,var(--gold) 180deg,transparent 180deg)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", margin: "0 auto", boxShadow: "0 0 60px rgba(201,168,76,.2)" }}>
              <div style={{ position: "absolute", inset: 6, background: "var(--bg3)", borderRadius: "50%" }} />
              <div style={{ position: "relative", textAlign: "center" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", fontWeight: 700, color: "var(--gold)", display: "block" }}>650</span>
                <span style={{ fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(237,234,224,.28)" }}>Your Points</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "2.5rem" }}>
              {[["500","$25 Credit ✓",true],["1,000","Free Add-On",false],["1,500","Free Session",false],["2,500","VIP Access",false]].map(([pts,lbl,on]) => (
                <div key={lbl as string} style={{ background: on ? "var(--gold-dim)" : "var(--glass)", border: `1px solid ${on ? "rgba(201,168,76,.28)" : "var(--border-color)"}`, borderRadius: 8, padding: ".9rem", textAlign: "center", transition: "all 0.38s" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--gold)" }}>{pts}</div>
                  <div style={{ fontSize: ".7rem", color: "rgba(237,234,224,.28)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: ".2rem" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" style={{ background: "var(--bg2)", padding: "7rem 5%" }}>
        <div className="reveal s-head" style={{ marginBottom: "3.8rem" }}>
          <div className="s-tag">Group & Events</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>Wellness for <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Every Occasion</em></h2>
          <div className="gold-line" />
          <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", maxWidth: 460, lineHeight: 1.78, fontWeight: 300 }}>From bachelorette parties to corporate wellness days, we bring the drip bar to you.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.8rem" }}>
          {[
            { icon: "💍", title: "Bridal & Bachelorette", text: "Start the celebration right. Our RNs arrive with a mobile setup for the whole party — glow up before the big day.", detail: "Groups of 4–20 · Custom packages", delay: "d1" },
            { icon: "🏢", title: "Corporate Wellness", text: "Boost your team's productivity and morale with an on-site wellness day. A benefit employees truly love.", detail: "Office visits · Volume pricing", delay: "d2" },
            { icon: "🎉", title: "Special Occasions", text: "Birthdays, baby showers, milestone celebrations — make it unforgettable with a Bloom experience.", detail: "Any occasion · White-glove service", delay: "d3" },
            { icon: "🎬", title: "Film & Production", text: "Used by LA's entertainment industry — keep talent performing. On-set wellness is the new standard.", detail: "On-set availability · NDAs available", delay: "d1" },
          ].map(ev => (
            <div key={ev.title} className={`reveal ${ev.delay}`} style={{ background: "var(--glass)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "2rem", transition: "all 0.38s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,.28)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{ev.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.18rem", fontWeight: 600, color: "var(--cream)", marginBottom: ".5rem" }}>{ev.title}</h3>
              <p style={{ fontSize: ".84rem", color: "rgba(237,234,224,.55)", lineHeight: 1.72, marginBottom: "1rem" }}>{ev.text}</p>
              <div style={{ fontSize: ".75rem", color: "var(--gold)", letterSpacing: ".06em" }}>{ev.detail}</div>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: "center", marginTop: "2.8rem" }}>
          <a href="#booking" style={{ background: "linear-gradient(135deg,var(--gold),var(--gold-lt))", color: "#040200", fontSize: ".88rem", fontWeight: 700, padding: ".9rem 2.4rem", borderRadius: 50, letterSpacing: ".07em", textTransform: "uppercase", transition: "all 0.38s", boxShadow: "0 6px 28px rgba(201,168,76,.35)", display: "inline-block" }}>Inquire About Group Booking</a>
        </div>
      </section>

      {/* ── VIRTUAL CONSULT ── */}
      <section id="consult" style={{ background: "var(--bg3)", padding: "7rem 5%" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(201,168,76,.07),rgba(201,168,76,.025))", border: "1px solid rgba(201,168,76,.28)", borderRadius: 20, padding: "3rem 3.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, color: "var(--cream)" }}>
              Speak with a <span style={{ color: "var(--gold)" }}>Registered Nurse</span> Before You Book
            </h2>
            <p style={{ marginTop: ".9rem", fontSize: ".88rem", color: "rgba(237,234,224,.55)", lineHeight: 1.78 }}>Not sure which drip is right for you? Our RNs offer complimentary 15-minute virtual consultations — personalized recommendations based on your health goals.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="tel:8185158980" style={{ background: "linear-gradient(135deg,var(--gold),var(--gold-lt))", color: "#040200", fontSize: ".88rem", fontWeight: 700, padding: ".9rem 2rem", borderRadius: 50, letterSpacing: ".07em", textTransform: "uppercase", boxShadow: "0 6px 28px rgba(201,168,76,.35)", display: "inline-block" }}>📞 (818) 515-8980</a>
            <a href="mailto:info@bloomdripco.com" style={{ background: "transparent", border: "1.5px solid rgba(201,168,76,.28)", color: "var(--cream)", fontSize: ".88rem", fontWeight: 500, padding: ".88rem 2rem", borderRadius: 50, letterSpacing: ".05em", display: "inline-block" }}>Email Us</a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ background: "var(--bg)", padding: "7rem 5%" }}>
        <div className="reveal s-head" style={{ marginBottom: "3.8rem" }}>
          <div className="s-tag">Client Love</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>What Our Clients <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Say</em></h2>
          <div className="gold-line" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "1.8rem" }}>
          {[
            { stars: "★★★★★", quote: "I had the Hangover Rescue after my bachelorette and I was a new person within the hour. The nurse was so professional and sweet. 10/10 will book again!", name: "Sophia C.", role: "Bachelorette Recovery", delay: "d1" },
            { stars: "★★★★★", quote: "The NAD+ infusion changed my life. I've been doing it monthly for 6 months and my energy, focus, and skin have never been better. Worth every penny.", name: "Marcus W.", role: "NAD+ Monthly Member", delay: "d2" },
            { stars: "★★★★★", quote: "We booked Bloom for our office wellness day and it was the highlight of the quarter. Everyone loved it. We're making it a monthly thing.", name: "Isabella T.", role: "Corporate Wellness", delay: "d3" },
            { stars: "★★★★★", quote: "As a fitness competitor, recovery is everything. The Recovery IV after my last competition had me back training in 2 days instead of a week. Game changer.", name: "Derrick J.", role: "Athlete Recovery", delay: "d1" },
          ].map(t => (
            <div key={t.name} className={`reveal ${t.delay}`} style={{ background: "var(--glass)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "2rem", transition: "all 0.38s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,168,76,.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-color)"; }}>
              <div style={{ color: "var(--gold)", fontSize: "1rem", marginBottom: "1rem", letterSpacing: ".1em" }}>{t.stars}</div>
              <blockquote style={{ fontSize: ".88rem", color: "rgba(237,234,224,.55)", lineHeight: 1.78, fontStyle: "italic", marginBottom: "1.4rem" }}>"{t.quote}"</blockquote>
              <div style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--cream)" }}>{t.name}</div>
              <div style={{ fontSize: ".72rem", color: "var(--gold)", letterSpacing: ".06em", marginTop: ".2rem" }}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section id="booking" style={{ background: "linear-gradient(to bottom,var(--bg),var(--bg2))", padding: "7rem 5%" }}>
        <div className="reveal s-head" style={{ marginBottom: "3.8rem" }}>
          <div className="s-tag">Book Now</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4.5vw,3.4rem)", fontWeight: 700, lineHeight: 1.14, color: "var(--cream)", marginBottom: ".9rem" }}>Ready to <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Bloom?</em></h2>
          <div className="gold-line" />
          <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", maxWidth: 460, lineHeight: 1.78, fontWeight: 300 }}>Schedule your session in minutes. A certified RN will arrive at your location.</p>
        </div>
        <div className="reveal" style={{ maxWidth: 600, background: "var(--glass)", border: "1px solid var(--border-color)", borderRadius: 20, padding: "2.8rem" }}>
          <BookingForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--border-color)", padding: "3rem 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--cream)", marginBottom: ".3rem" }}>Bloom <span style={{ color: "var(--gold)" }}>Drip</span> Co.</div>
          <div style={{ fontSize: ".78rem", color: "rgba(237,234,224,.28)" }}>Luxury Mobile IV Infusion · Los Angeles, CA</div>
        </div>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <a href="#menu" style={{ fontSize: ".78rem", color: "rgba(237,234,224,.55)", transition: "color 0.38s" }}>IV Menu</a>
          <a href="#memberships" style={{ fontSize: ".78rem", color: "rgba(237,234,224,.55)", transition: "color 0.38s" }}>Memberships</a>

          <a href="tel:8185158980" style={{ fontSize: ".78rem", color: "rgba(237,234,224,.55)", transition: "color 0.38s" }}>(818) 515-8980</a>
          <Link href="/admin" style={{ fontSize: ".78rem", color: "rgba(201,168,76,.5)", transition: "color 0.38s" }}>Admin</Link>
        </div>
        <div style={{ fontSize: ".72rem", color: "rgba(237,234,224,.28)" }}>© 2026 Bloom Drip Co. All rights reserved.</div>
      </footer>

      {/* ── LOGIN MODAL ── */}
      {loginOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setLoginOpen(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--panel)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 20, padding: "52px 48px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 0 60px rgba(201,168,76,.08)" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "var(--gold)", marginBottom: 6 }}>Bloom Drip Co.</div>
            <div style={{ fontSize: 13, color: "rgba(200,216,232,.6)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 36 }}>Member Portal</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--cream)", marginBottom: 28 }}>Welcome back 💛</div>
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: 18 }}>
                <input type="email" placeholder="Email address" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10, padding: "13px 18px", color: "var(--cream)", fontSize: 14, outline: "none" }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <input type="password" placeholder="Password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10, padding: "13px 18px", color: "var(--cream)", fontSize: 14, outline: "none" }} />
              </div>
              {loginErr && <div style={{ color: "#e05555", fontSize: 13, marginBottom: 12 }}>{loginErr}</div>}
              <button type="submit" style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,var(--gold),var(--gold-dk))", color: "#010a12", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: ".06em", marginTop: 4 }}>Sign In</button>
            </form>
            <div style={{ marginTop: 16, fontSize: 13, color: "rgba(200,216,232,.6)" }}>
              Admin? <Link href="/admin" style={{ color: "var(--gold)" }} onClick={() => setLoginOpen(false)}>Go to Admin Panel →</Link>
            </div>
            <button onClick={() => setLoginOpen(false)} style={{ marginTop: 16, fontSize: 12, color: "rgba(200,216,232,.4)", background: "none", border: "none", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "Myers Cocktail", date: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");

  const buildNotifyHtml = (f: typeof form) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>New Booking Request — Bloom Drip Co.</title>
</head>
<body style="margin:0;padding:0;background:#020b14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#020b14;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a1a2a;border-radius:16px;border:1px solid rgba(201,168,76,0.3);overflow:hidden;">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#0a1a2a 0%,#0d2035 100%);padding:36px 40px;border-bottom:1px solid rgba(201,168,76,0.3);text-align:center;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:10px;">Bloom Drip Co. · Los Angeles</div>
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#edeae0;letter-spacing:-0.02em;">New Booking <span style="color:#c9a84c;font-style:italic;">Request</span></h1>
          <div style="margin-top:12px;display:inline-block;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.35);border-radius:20px;padding:5px 16px;font-size:12px;color:#e5ca70;letter-spacing:0.08em;">⚡ Action Required</div>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding:36px 40px;">
          <p style="margin:0 0 28px;font-size:14px;color:rgba(200,216,232,0.65);line-height:1.7;">A new appointment request has just come in. Review the details below and confirm within 2 hours.</p>
          <!-- Client Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td colspan="2" style="padding-bottom:12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.7);border-bottom:1px solid rgba(201,168,76,0.2);font-weight:600;">Client Information</td></tr>
            <tr>
              <td style="padding:14px 0 0;width:50%;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Full Name</div>
                <div style="font-size:15px;color:#edeae0;font-weight:600;">${f.name}</div>
              </td>
              <td style="padding:14px 0 0;width:50%;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Phone</div>
                <div style="font-size:15px;color:#edeae0;font-weight:600;">${f.phone || '—'}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0 0;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Email</div>
                <div style="font-size:15px;color:#c9a84c;">${f.email || '—'}</div>
              </td>
              <td style="padding:14px 0 0;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Preferred Date</div>
                <div style="font-size:15px;color:#edeae0;font-weight:600;">${f.date || '—'}</div>
              </td>
            </tr>
          </table>
          <!-- Service Highlight -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td colspan="2" style="padding-bottom:12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.7);border-bottom:1px solid rgba(201,168,76,0.2);font-weight:600;">Requested Service</td></tr>
            <tr>
              <td style="padding:16px 0 0;">
                <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 20px;">
                  <div style="font-family:Georgia,serif;font-size:20px;color:#c9a84c;font-weight:700;margin-bottom:4px;">${f.service}</div>
                  <div style="font-size:12px;color:rgba(200,216,232,0.5);">IV Therapy Session · Bloom Drip Co.</div>
                </div>
              </td>
            </tr>
          </table>
          ${f.notes ? `<!-- Notes -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="padding-bottom:12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.7);border-bottom:1px solid rgba(201,168,76,0.2);font-weight:600;">Notes / Location</td></tr>
            <tr><td style="padding:14px 0 0;font-size:14px;color:rgba(200,216,232,0.75);line-height:1.7;">${f.notes}</td></tr>
          </table>` : ''}
          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding-top:8px;">
                <a href="mailto:${f.email}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#8f7630);color:#010a12;font-weight:700;font-size:14px;letter-spacing:0.06em;text-transform:uppercase;padding:14px 36px;border-radius:50px;text-decoration:none;">Reply to Client</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background:#071828;padding:24px 40px;border-top:1px solid rgba(201,168,76,0.15);text-align:center;">
          <div style="font-family:Georgia,serif;font-size:14px;color:rgba(201,168,76,0.6);margin-bottom:6px;">Bloom Drip Co.</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.3);letter-spacing:0.06em;">Luxury Mobile IV Infusion · Los Angeles, CA · (818) 515-8980</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.2);margin-top:8px;">This notification was sent automatically from your booking form.</div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const buildClientHtml = (f: typeof form) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Booking Received — Bloom Drip Co.</title>
</head>
<body style="margin:0;padding:0;background:#020b14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#020b14;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a1a2a;border-radius:16px;border:1px solid rgba(201,168,76,0.3);overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg,#0a1a2a 0%,#0d2035 100%);padding:40px 40px 32px;border-bottom:1px solid rgba(201,168,76,0.3);text-align:center;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:10px;">Bloom Drip Co. · Los Angeles</div>
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#edeae0;">We've Got Your <span style="color:#c9a84c;font-style:italic;">Request!</span> 💛</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:15px;color:rgba(200,216,232,0.75);line-height:1.8;">Hi <strong style="color:#edeae0;">${f.name}</strong>,</p>
          <p style="margin:0 0 24px;font-size:14px;color:rgba(200,216,232,0.65);line-height:1.8;">Thank you for choosing Bloom Drip Co.! We've received your booking request and our team will confirm your appointment within <strong style="color:#c9a84c;">2 hours</strong>. A certified Registered Nurse will be in touch shortly.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:12px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.6);margin-bottom:14px;font-weight:600;">Your Booking Summary</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;font-size:13px;color:rgba(200,216,232,0.5);width:40%;">Service</td><td style="padding:6px 0;font-size:13px;color:#edeae0;font-weight:600;">${f.service}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:rgba(200,216,232,0.5);">Preferred Date</td><td style="padding:6px 0;font-size:13px;color:#edeae0;font-weight:600;">${f.date || 'To be confirmed'}</td></tr>
                ${f.notes ? `<tr><td style="padding:6px 0;font-size:13px;color:rgba(200,216,232,0.5);vertical-align:top;">Notes</td><td style="padding:6px 0;font-size:13px;color:#edeae0;">${f.notes}</td></tr>` : ''}
              </table>
            </td></tr>
          </table>
          <p style="margin:0 0 28px;font-size:13px;color:rgba(200,216,232,0.5);line-height:1.7;">Questions? Reply to this email or call us at <a href="tel:8185158980" style="color:#c9a84c;text-decoration:none;">(818) 515-8980</a>.</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="https://bloomdrip-fm7zlieb.manus.space" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#8f7630);color:#010a12;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;padding:13px 32px;border-radius:50px;text-decoration:none;">Visit Our Website</a>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#071828;padding:24px 40px;border-top:1px solid rgba(201,168,76,0.15);text-align:center;">
          <div style="font-family:Georgia,serif;font-size:14px;color:rgba(201,168,76,0.6);margin-bottom:6px;">Bloom Drip Co.</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.3);letter-spacing:0.06em;">Luxury Mobile IV Infusion · Los Angeles, CA</div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendErr("");
    const apiKey = localStorage.getItem("resend_key") || "";
    const submittedAt = new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
    const formWithTime = { ...form, submittedAt };
    try {
      // 1. Notify admin at info@bloomdripco.com
      if (apiKey) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Bloom Drip Co. Bookings <onboarding@resend.dev>",
            to: ["info@bloomdripco.com"],
            subject: `🌸 New Booking Request — ${form.name} · ${form.service}`,
            html: buildNotifyHtml(formWithTime),
          }),
        });
        // 2. Send confirmation to client (if they gave an email)
        if (form.email) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Bloom Drip Co. <onboarding@resend.dev>",
              to: [form.email],
              subject: "Your Bloom Drip Co. Booking Request is Confirmed 💛",
              html: buildClientHtml(form),
            }),
          });
        }
      }
    } catch (_) {
      // Silent fail — booking still shows success to user
    }
    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💛</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "var(--cream)", marginBottom: ".8rem" }}>Booking Request Received!</h3>
        <p style={{ color: "rgba(237,234,224,.55)", fontSize: ".9rem", lineHeight: 1.7 }}>Thank you, {form.name}! We'll confirm your appointment within 2 hours. A certified RN will be in touch shortly.</p>
        <button onClick={() => setSubmitted(false)} style={{ marginTop: "1.5rem", background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,.28)", color: "var(--gold-lt)", padding: ".6rem 1.4rem", borderRadius: 50, fontSize: ".8rem", cursor: "pointer" }}>Book Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ fontSize: ".72rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "block", marginBottom: ".4rem" }}>Full Name *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 8, padding: "10px 14px", color: "var(--cream)", fontSize: 13, outline: "none" }} />
        </div>
        <div>
          <label style={{ fontSize: ".72rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "block", marginBottom: ".4rem" }}>Phone *</label>
          <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 8, padding: "10px 14px", color: "var(--cream)", fontSize: 13, outline: "none" }} />
        </div>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: ".72rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "block", marginBottom: ".4rem" }}>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 8, padding: "10px 14px", color: "var(--cream)", fontSize: 13, outline: "none" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ fontSize: ".72rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "block", marginBottom: ".4rem" }}>Service *</label>
          <select value={form.service} onChange={e => setForm({...form, service: e.target.value})} style={{ width: "100%", background: "rgba(13,32,53,1)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 8, padding: "10px 14px", color: "var(--cream)", fontSize: 13, outline: "none" }}>
            {["Myers Cocktail","NAD+ Infusion","Immunity Shield","Hangover Rescue","Bloom Beauty Glow"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: ".72rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "block", marginBottom: ".4rem" }}>Preferred Date *</label>
          <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 8, padding: "10px 14px", color: "var(--cream)", fontSize: 13, outline: "none", colorScheme: "dark" }} />
        </div>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontSize: ".72rem", letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(237,234,224,.55)", display: "block", marginBottom: ".4rem" }}>Notes / Location</label>
        <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 8, padding: "10px 14px", color: "var(--cream)", fontSize: 13, outline: "none", resize: "vertical" }} />
      </div>
      {sendErr && <div style={{ color: "#e07070", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{sendErr}</div>}
      <button type="submit" disabled={sending} style={{ width: "100%", padding: ".9rem", background: sending ? "rgba(201,168,76,.4)" : "linear-gradient(135deg,var(--gold),var(--gold-lt))", color: "#040200", fontWeight: 700, fontSize: ".88rem", letterSpacing: ".07em", textTransform: "uppercase", borderRadius: 50, boxShadow: "0 6px 28px rgba(201,168,76,.35)", cursor: sending ? "not-allowed" : "pointer", border: "none", transition: "all .2s" }}>
        {sending ? "Sending…" : "Request Booking"}
      </button>
    </form>
  );
}
