import { useState } from "react";
import { Link } from "wouter";

type TabId = "corporate" | "bachelorette" | "hotel" | "gym";

export default function Partnerships() {
  const [activeTab, setActiveTab] = useState<TabId>("corporate");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const copyEmail = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => showToast("Email copied to clipboard ✓")).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      showToast("Email copied ✓");
    });
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--cream)", fontFamily: "'Inter', sans-serif", minHeight: "100vh", lineHeight: 1.6 }}>
      <style>{`
        .htab { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; cursor: pointer; transition: all .2s; background: transparent; color: rgba(237,234,224,.62); border: 1px solid transparent; }
        .htab:hover { color: var(--cream); background: rgba(201,168,76,.09); }
        .htab.on { background: rgba(201,168,76,.09); border-color: rgba(201,168,76,.28); color: var(--gold); }
        .pkg-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        .pkg-table th { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: rgba(237,234,224,.62); padding: 10px 14px; border-bottom: 1px solid rgba(201,168,76,.28); text-align: left; font-weight: 500; }
        .pkg-table td { padding: 13px 14px; font-size: 13px; border-bottom: 1px solid rgba(201,168,76,.07); color: rgba(237,234,224,.62); }
        .pkg-table tr:last-child td { border-bottom: none; }
        .pkg-table tr:hover td { background: rgba(201,168,76,.09); color: var(--cream); }
        .pkg-table .name { font-weight: 600; color: var(--cream); }
        .price-cell { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--gold); }
        .copy-btn { font-size: 11px; font-weight: 600; color: var(--gold); background: rgba(201,168,76,.09); border: 1px solid rgba(201,168,76,.28); padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all .2s; }
        .copy-btn:hover { background: var(--gold); color: #010a12; }
        .email-body { padding: 24px 28px; font-size: 13.5px; line-height: 1.85; color: rgba(237,234,224,.62); white-space: pre-wrap; }
        .email-body strong { color: var(--cream); font-weight: 600; }
        @media(max-width:640px) { .htab span { display: none; } .htab { padding: 8px 12px; } }
      `}</style>

      {/* Header */}
      <header style={{ background: "var(--panel)", borderBottom: "1px solid rgba(201,168,76,.28)", padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, height: 66 }}>
        <Link href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "var(--gold)", whiteSpace: "nowrap" }}>Bloom Drip Co.</Link>
        <div style={{ display: "flex", gap: 4 }}>
          {(["corporate","bachelorette","hotel","gym"] as TabId[]).map(tab => (
            <button key={tab} className={`htab${activeTab === tab ? " on" : ""}`} onClick={() => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              {tab === "corporate" && "🏢"} {tab === "bachelorette" && "🥂"} {tab === "hotel" && "🏨"} {tab === "gym" && "💪"}
              {" "}<span>{tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === "bachelorette" ? "tte" : ""}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ── CORPORATE ── */}
      {activeTab === "corporate" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 5% 80px" }}>
          <HeroBlock tag="💼 Partnership Pitch" title={<>Corporate <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Wellness</em> Program</>} desc="Bring IV therapy directly to your clients' offices. One email or call is all it takes to land a recurring corporate account worth $1,500–$5,000+ per visit." chips={[["Target:","Law Firms · Real Estate · Tech Offices"],["Visit value:","$1,500–$5,000+"],["Recurring:","Monthly or Quarterly"]]} />
          <ActionBar onPrint={() => window.print()} onCopy={() => copyEmail("corpEmail")} copyLabel="Copy Email Template" />
          <Card label="Suggested Packages to Offer">
            <table className="pkg-table">
              <thead><tr><th>Package</th><th>Includes</th><th>Sessions</th><th>Price Range</th></tr></thead>
              <tbody>
                <tr><td className="name">Team Refresh</td><td>Hydration + Energy Drips, on-site setup</td><td>Up to 5 staff</td><td className="price-cell">From $750</td></tr>
                <tr><td className="name">Wellness Day</td><td>Choice of any drip, nurse on-site 3 hrs</td><td>Up to 10 staff</td><td className="price-cell">From $1,500</td></tr>
                <tr><td className="name">Monthly Partner</td><td>Bi-weekly visits, discounted rate, branded flyer</td><td>Unlimited</td><td className="price-cell">Custom Quote</td></tr>
                <tr><td className="name">Executive VIP</td><td>Private sessions for C-suite, premium drips</td><td>Up to 4 execs</td><td className="price-cell">From $900</td></tr>
              </tbody>
            </table>
          </Card>
          <Card label="How to Land the Account">
            <Checklist items={[
              ["Find the decision maker","HR Manager, Office Manager, or COO. LinkedIn is your best friend. Search \"[Company] HR Manager Los Angeles.\""],
              ["Lead with ROI","Healthy employees = fewer sick days. Frame it as an investment, not a perk."],
              ["Offer a pilot","Propose a free or discounted first visit for 5 people. Let the results sell themselves."],
              ["Follow up twice","Email day 1, call day 4. Most deals close on the 2nd touchpoint."],
              ["Get a champion inside","If one employee loves it, they'll push for it internally. Target wellness-focused people."],
            ]} />
          </Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", color: "var(--cream)", marginBottom: 6 }}>Cold Email Template</div>
          <div style={{ fontSize: 13, color: "rgba(237,234,224,.62)", marginBottom: 24, lineHeight: 1.7 }}>Personalize the [brackets]. Keep it short — executives don't read long emails.</div>
          <EmailBlock id="corpEmail" label="📧 Cold Outreach Email" onCopy={() => copyEmail("corpEmail")} content={`Subject: Wellness perk your team will actually use — Bloom Drip Co.\n\nHi [First Name],\n\nI run Bloom Drip Co., a mobile IV therapy service based in Los Angeles. We come directly to offices and deliver IV drip sessions to employees on-site — no clinic visits, no downtime.\n\nCompanies like [similar company or industry] use us for monthly wellness days. Employees love it, and HR teams tell us it's become their most-requested perk.\n\nI'd love to offer [Company Name] a complimentary pilot session for 4–5 team members — no commitment, just a chance to experience it firsthand.\n\nWould you be open to a 10-minute call this week?\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`} />
          <TipsBox tips={["Target companies with 20–200 employees — big enough to afford it, small enough for you to be special.","Pitch around Q1 (Jan) and Q3 (Jul) when wellness budgets reset.","Ask satisfied corporate clients for a Google review and a LinkedIn post — social proof is everything.","Create a simple one-page PDF menu to attach to your email. Use the admin panel to adjust prices first."]} />
        </div>
      )}

      {/* ── BACHELORETTE ── */}
      {activeTab === "bachelorette" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 5% 80px" }}>
          <HeroBlock tag="🥂 Event Package" title={<>Bachelorette & <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Party Recovery</em></>} desc="The morning-after drip is one of the highest-demand IV services in LA. One package, one booking, multiple sessions. Perfect for parties of 4–10." chips={[["Avg group:","4–8 people"],["Per booking value:","$700–$1,600"],["Referral rate:","Very High"]]} />
          <ActionBar onPrint={() => window.print()} onCopy={() => copyEmail("bachEmail")} copyLabel="Copy Pitch Email" />
          <Card label="Bachelorette Packages to Offer">
            <table className="pkg-table">
              <thead><tr><th>Package</th><th>What's Included</th><th>Group Size</th><th>Price Range</th></tr></thead>
              <tbody>
                <tr><td className="name">The Bride Squad</td><td>Hydration Drips for the whole group + vitamin boosters</td><td>4 guests</td><td className="price-cell">From $600</td></tr>
                <tr><td className="name">Glow & Go</td><td>Glow Drip + Recovery IV, champagne-style setup</td><td>6 guests</td><td className="price-cell">From $950</td></tr>
                <tr><td className="name">Bloom Bachelorette</td><td>Full menu choice, nurse stays 2 hrs, add-ons included</td><td>8 guests</td><td className="price-cell">From $1,300</td></tr>
                <tr><td className="name">VIP Bridal Package</td><td>Bride gets Signature Drip free, group full menu, extras</td><td>10 guests</td><td className="price-cell">From $1,800</td></tr>
              </tbody>
            </table>
          </Card>
          <Card label="How to Get Bachelorette Bookings">
            <Checklist items={[
              ["Partner with party planners","DM LA-based bachelorette and event planners on Instagram. Offer them a 10% referral fee per booking."],
              ["Get on Airbnb host lists","Reach out to Superhost Airbnb properties in LA. Ask to be their recommended morning recovery service."],
              ["Target Facebook & Reddit groups",'"LA Bachelorette Planning," "Girls Trip LA" — post genuinely helpful tips and mention Bloom.'],
              ["Create TikTok content","Short videos of the setup, the drips, the experience. Bachelorette content goes viral."],
              ["Add a \"Groups\" page to the website","A dedicated landing page makes it easy for maid-of-honors to book directly."],
            ]} />
          </Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", color: "var(--cream)", marginBottom: 6 }}>Pitch Email — Party Planners</div>
          <div style={{ fontSize: 13, color: "rgba(237,234,224,.62)", marginBottom: 24, lineHeight: 1.7 }}>Send this to LA-based event and bachelorette planners. Short, friendly, and clear on the referral benefit.</div>
          <EmailBlock id="bachEmail" label="📧 Planner Outreach Email" onCopy={() => copyEmail("bachEmail")} content={`Subject: Earn referral fees — luxury IV recovery for your bachelorette clients\n\nHi [First Name],\n\nI'm [Your Name] from Bloom Drip Co. — we're a mobile IV therapy service in Los Angeles that specializes in bachelorette and group recovery experiences.\n\nWe come directly to your clients' Airbnb, hotel, or venue, set up a premium in-room drip experience, and take care of everything. Most groups book us for the morning after their big night out.\n\nI'd love to partner with you. For every group booking you refer, I'll send you a 10% referral fee — no work on your end, just a recommendation.\n\nHappy to send you a digital menu and promo materials to share with your clients. Let me know if you're interested!\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`} />
          <TipsBox tips={["The maid of honor books, not the bride. Make the booking process stupidly simple and fast.","Offer a \"bride drips free\" promo for groups of 6+ — the group pays for everyone else's session anyway.","Ask every group for a photo (with permission) to use on Instagram. These are your best ads.","Create a \"Bachelorette Recovery Kit\" add-on — face masks, electrolyte packets, etc. — to charge a premium."]} />
        </div>
      )}

      {/* ── HOTEL ── */}
      {activeTab === "hotel" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 5% 80px" }}>
          <HeroBlock tag="🏨 Concierge Partnership" title={<>Hotel & <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Vacation Rental</em> Program</>} desc="Become the go-to in-room wellness service for LA's hotels, boutique stays, and Airbnbs. Guests pay a premium for luxury that comes to them — and hotels love offering it." chips={[["Target:","Boutique Hotels · Airbnb Superhosts · Resorts"],["Lead type:","Warm — already spending on wellness"],["Conversion:","High — captive vacation audience"]]} />
          <ActionBar onPrint={() => window.print()} onCopy={() => copyEmail("hotelEmail")} copyLabel="Copy Pitch Email" />
          <Card label="What to Offer Hotels">
            <Checklist items={[
              ["Concierge listing","A line in their \"In-Room Services\" menu: \"IV Wellness — Bloom Drip Co. | Book via QR code.\""],
              ["QR code card","A small branded card placed in the room or at the front desk. Guest scans → lands on your booking page → books instantly."],
              ["Commission model","Offer the hotel 10–15% of each booking they refer. Makes it a no-brainer for them to promote you."],
              ["Co-branded experience","\"The [Hotel Name] Recovery Experience, powered by Bloom Drip Co.\" Exclusivity is a selling point."],
            ]} />
          </Card>
          <Card label="How to Approach Hotels">
            <Checklist items={[
              ["Start with boutique hotels (20–80 rooms)","The GM or owner makes the decision directly. Big chains have 6-month procurement processes."],
              ["Walk in with a package","Bring a printed one-pager, a QR code sample card, and a short menu. Looking professional closes deals."],
              ["Airbnb Superhosts","Search \"LA Superhost\" on Airbnb, find their contact info, and email them. They're entrepreneurs who love partnerships."],
              ["Wellness-focused properties","Yoga retreats, surf houses, fitness resorts — they already sell the wellness lifestyle. You're a natural add-on."],
            ]} />
          </Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", color: "var(--cream)", marginBottom: 6 }}>Pitch Email — Hotel GM / Concierge Manager</div>
          <div style={{ fontSize: 13, color: "rgba(237,234,224,.62)", marginBottom: 24, lineHeight: 1.7 }}>Direct, professional, and focused on the value to their guests — not just to you.</div>
          <EmailBlock id="hotelEmail" label="📧 Hotel Outreach Email" onCopy={() => copyEmail("hotelEmail")} content={`Subject: In-room IV wellness service for [Hotel Name] guests\n\nHi [First Name],\n\nI'm [Your Name], founder of Bloom Drip Co. — a luxury mobile IV therapy service in Los Angeles. We partner with hotels and properties to offer guests a premium in-room wellness experience without leaving the property.\n\nHere's how it works: we provide a co-branded QR code card for guest rooms. Guests scan, book, and we arrive at their room within a few hours. No setup required from your team.\n\nFor every booking we receive through [Hotel Name], we'd offer you a 12% referral commission — completely passive income for your property.\n\nGuests who experience in-room wellness rate their stay higher, and it's a unique amenity that sets you apart from the competition.\n\nWould you have 15 minutes this week to look at a quick proposal?\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`} />
          <TipsBox tips={["Create a simple QR code (free at qr-code-generator.com) that links directly to your booking page.","Print 50–100 small branded cards (Canva + Vistaprint, ~$20) to leave at properties.","Follow up with a handwritten thank-you note after your first booking at a new property. It's memorable.","Track which properties send the most bookings and invest more time in those relationships."]} />
        </div>
      )}

      {/* ── GYM ── */}
      {activeTab === "gym" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 5% 80px" }}>
          <HeroBlock tag="💪 Athlete Partnership" title={<>Gym & <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Athlete Recovery</em> Program</>} desc="Athletes are your most loyal and vocal customers. Get into one gym and you'll have referrals for months. Recovery is a serious part of their training — make Bloom their go-to." chips={[["Target:","CrossFit · MMA Gyms · Marathon Groups"],["Visit value:","$800–$2,500"],["Loyalty:","Very High — repeat buyers"]]} />
          <ActionBar onPrint={() => window.print()} onCopy={() => copyEmail("gymEmail")} copyLabel="Copy Pitch Email" />
          <Card label="Recovery Packages for Athletes">
            <table className="pkg-table">
              <thead><tr><th>Package</th><th>Best For</th><th>Drips</th><th>Price Range</th></tr></thead>
              <tbody>
                <tr><td className="name">Post-WOD Recovery</td><td>CrossFit athletes post-competition</td><td>Recovery IV + Hydration</td><td className="price-cell">$175–$195</td></tr>
                <tr><td className="name">Fight Night Recovery</td><td>MMA / combat sports</td><td>Recovery IV + Energy Boost</td><td className="price-cell">$185–$210</td></tr>
                <tr><td className="name">Race Day Package</td><td>Marathon / triathlon</td><td>Hydration + Myers Cocktail</td><td className="price-cell">$155–$185</td></tr>
                <tr><td className="name">Gym Recovery Day</td><td>Group gym visit (10+ members)</td><td>Full menu, on-site</td><td className="price-cell">From $1,500</td></tr>
              </tbody>
            </table>
          </Card>
          <Card label="How to Land Gym Partnerships">
            <Checklist items={[
              ["Walk in on a weekday morning","Gym owners are there early. Bring a one-pager and offer to do a free demo session for the owner or head coach."],
              ["Sponsor a competition","Many CrossFit boxes host local throwdowns. Sponsor the event by offering free drips to top finishers. Everyone in the gym hears about it."],
              ["Set up a \"Recovery Tuesday\"","A weekly time slot where you come to the gym and members can book a drip on the spot. Recurring, predictable revenue."],
              ["Target running groups and triathlon clubs","They train outdoors, they're extremely health-conscious, and they talk constantly in group chats. One happy customer = 20 warm leads."],
              ["Give the head coach a free session","If the coach vouches for you, the whole gym follows. This is the single best ROI move for gym partnerships."],
            ]} />
          </Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem", color: "var(--cream)", marginBottom: 6 }}>Pitch Email — Gym Owner / Head Coach</div>
          <div style={{ fontSize: 13, color: "rgba(237,234,224,.62)", marginBottom: 24, lineHeight: 1.7 }}>Gym owners respond well to direct, peer-to-peer language. Skip the corporate tone — keep it real.</div>
          <EmailBlock id="gymEmail" label="📧 Gym Partnership Email" onCopy={() => copyEmail("gymEmail")} content={`Subject: Recovery sessions for [Gym Name] members — want to partner?\n\nHey [First Name],\n\nI'm [Your Name], founder of Bloom Drip Co. — mobile IV therapy here in Los Angeles. We work with athletes and gyms to provide on-site recovery drips that help people bounce back faster, perform harder, and stay consistent.\n\nI've been training [or: I follow your gym on IG / I've heard great things about your community] and think your members would genuinely love this.\n\nHere's what I'm proposing:\n— We come to [Gym Name] once a week for "Recovery Sessions"\n— Your members get a preferred member rate\n— You earn a referral fee for every booking\n\nI'd love to start by giving you a complimentary session so you can experience it firsthand — no strings attached.\n\nYou free for a quick call this week?\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`} />
          <TipsBox tips={["Bring before/after recovery data if you have it — athletes are data-driven and respond to results.","Post-competition is your golden window. Reach out to event organizers 2 weeks before a local race or throwdown.","Build a \"Team Bloom\" athlete ambassador program — 2–3 local athletes who post about their drips in exchange for a monthly membership discount.","Partner with a sports physio or chiropractor — refer each other's clients. Zero cost, high trust."]} />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "var(--panel)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10, padding: "12px 20px", fontSize: 13, color: "var(--cream)", boxShadow: "0 8px 30px rgba(0,0,0,.5)", zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function HeroBlock({ tag, title, desc, chips }: { tag: string; title: React.ReactNode; desc: string; chips: string[][] }) {
  return (
    <div style={{ background: "linear-gradient(135deg,var(--panel),var(--panel2))", border: "1px solid rgba(201,168,76,.28)", borderRadius: 20, padding: "48px 44px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,.08),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,.09)", border: "1px solid rgba(201,168,76,.28)", padding: "5px 14px", borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold-lt)", marginBottom: 18 }}>{tag}</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.9rem,4vw,2.8rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.15, marginBottom: 14 }}>{title}</h1>
      <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.62)", maxWidth: 560, lineHeight: 1.8, marginBottom: 24 }}>{desc}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {chips.map(([label, val]) => (
          <div key={label} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 50, padding: "6px 14px", fontSize: 12, color: "rgba(237,234,224,.62)" }}>
            {label} <span style={{ color: "var(--gold)", fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBar({ onPrint, onCopy, copyLabel }: { onPrint: () => void; onCopy: () => void; copyLabel: string }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
      <button onClick={onPrint} style={{ padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s", border: "none", letterSpacing: ".04em", background: "linear-gradient(135deg,var(--gold),var(--gold-dk))", color: "#010a12" }}>🖨 Print / Save PDF</button>
      <button onClick={onCopy} style={{ padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s", letterSpacing: ".04em", background: "transparent", border: "1px solid rgba(201,168,76,.28)", color: "var(--gold)" }}>{copyLabel}</button>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--panel)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 16, padding: "28px 30px", marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        {label}
        <span style={{ flex: 1, height: 1, background: "rgba(201,168,76,.28)", display: "block" }} />
      </div>
      {children}
    </div>
  );
}

function Checklist({ items }: { items: string[][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(([title, text]) => (
        <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "rgba(237,234,224,.62)", lineHeight: 1.6 }}>
          <span style={{ color: "var(--gold)", fontSize: 10, marginTop: 3, flexShrink: 0 }}>✦</span>
          <div><strong style={{ color: "var(--cream)", fontWeight: 600 }}>{title}</strong> — {text}</div>
        </div>
      ))}
    </div>
  );
}

function EmailBlock({ id, label, onCopy, content }: { id: string; label: string; onCopy: () => void; content: string }) {
  return (
    <div style={{ background: "#0a1528", border: "1px solid rgba(201,168,76,.28)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ background: "var(--panel2)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "rgba(237,234,224,.62)", letterSpacing: ".06em", textTransform: "uppercase" }}>{label}</span>
        <button className="copy-btn" onClick={onCopy}>Copy</button>
      </div>
      <div id={id} className="email-body">{content}</div>
    </div>
  );
}

function TipsBox({ tips }: { tips: string[] }) {
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(61,139,122,.08),rgba(61,139,122,.03))", border: "1px solid rgba(61,139,122,.3)", borderRadius: 12, padding: "20px 22px", marginTop: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#57b09f", marginBottom: 10 }}>💡 Pro Tips</div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {tips.map(tip => (
          <li key={tip} style={{ fontSize: 13, color: "rgba(237,234,224,.6)", paddingLeft: 16, position: "relative", lineHeight: 1.6 }}>
            <span style={{ position: "absolute", left: 0, color: "#57b09f", fontWeight: 600 }}>→</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
