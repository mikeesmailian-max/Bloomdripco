import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

// ── TYPES ──────────────────────────────────────────────────────────────────
interface Client { id: number; first: string; last: string; email: string; phone: string; visits: number; points: number; type: string; joined: string; }
interface Booking { id: number; name: string; email: string; service: string; date: string; price: number; status: string; notes: string; }
interface MenuItem { id: number; name: string; desc: string; price: number; duration: number; ingredients: string[]; category: string; active: boolean; }
interface Campaign { id: number; subject: string; date: string; recipients: number; sent: number; failed: number; status: string; }
interface Promo { id: number; name: string; code: string; type: "percent" | "fixed"; value: number; active: boolean; expires: string; description: string; }

// ── DEFAULT DATA ───────────────────────────────────────────────────────────
const DEFAULT_CLIENTS: Client[] = [
  {id:1,first:"Sophia",last:"Chen",email:"sophia.c@email.com",phone:"(818) 555-0192",visits:12,points:1200,type:"member",joined:"Jan 2025"},
  {id:2,first:"Marcus",last:"Williams",email:"mwilliams@gmail.com",phone:"(818) 555-0341",visits:3,points:300,type:"new",joined:"Apr 2025"},
  {id:3,first:"Isabella",last:"Torres",email:"itc@outlook.com",phone:"(818) 555-0887",visits:8,points:800,type:"member",joined:"Feb 2025"},
  {id:4,first:"Derrick",last:"Johnson",email:"derrickj@email.com",phone:"(818) 555-0554",visits:1,points:100,type:"new",joined:"May 2025"},
  {id:5,first:"Natalie",last:"Park",email:"natpark@email.com",phone:"(818) 555-0219",visits:0,points:0,type:"inactive",joined:"Dec 2024"},
  {id:6,first:"Alexis",last:"Morgan",email:"alexism@gmail.com",phone:"(818) 555-0762",visits:15,points:1500,type:"member",joined:"Nov 2024"},
  {id:7,first:"Ryan",last:"Davis",email:"rdavis@email.com",phone:"(818) 555-0448",visits:2,points:200,type:"new",joined:"May 2025"},
  {id:8,first:"Priya",last:"Sharma",email:"priya.s@email.com",phone:"(818) 555-0993",visits:6,points:600,type:"member",joined:"Mar 2025"},
];
const DEFAULT_BOOKINGS: Booking[] = [
  {id:1,name:"Sophia Chen",email:"sophia.c@email.com",service:"Glow Drip",date:"May 30, 2026 2:00 PM",price:195,status:"Confirmed",notes:""},
  {id:2,name:"Marcus Williams",email:"mwilliams@gmail.com",service:"Recovery IV",date:"May 29, 2026 11:00 AM",price:175,status:"Completed",notes:""},
  {id:3,name:"Isabella Torres",email:"itc@outlook.com",service:"Energy Boost",date:"Jun 1, 2026 4:00 PM",price:165,status:"Confirmed",notes:""},
  {id:4,name:"Derrick Johnson",email:"derrickj@email.com",service:"Hydration Drip",date:"May 28, 2026 9:00 AM",price:149,status:"Completed",notes:""},
  {id:5,name:"Natalie Park",email:"natpark@email.com",service:"Immunity Blend",date:"May 27, 2026 1:00 PM",price:185,status:"Cancelled",notes:"No show"},
];
const DEFAULT_MENU: MenuItem[] = [
  {id:1,name:"Hydration Drip",desc:"Pure saline replenishment for deep cellular hydration.",price:149,duration:45,ingredients:["Saline","Electrolytes","Magnesium"],category:"Wellness",active:true},
  {id:2,name:"Glow Drip",desc:"Radiant skin from the inside out with high-dose Glutathione.",price:195,duration:60,ingredients:["Glutathione","Vitamin C","Biotin","B-Complex"],category:"Beauty",active:true},
  {id:3,name:"Energy Boost",desc:"Reignite your energy with a potent B-vitamin and amino acid blend.",price:165,duration:45,ingredients:["B12","B-Complex","Amino Acids","CoQ10"],category:"Energy",active:true},
  {id:4,name:"Recovery IV",desc:"Bounce back faster after intense activity or a long night.",price:175,duration:60,ingredients:["Saline","Toradol","Zofran","B-Complex"],category:"Recovery",active:true},
  {id:5,name:"Immunity Blend",desc:"Fortify your defenses with mega-dose Vitamin C and Zinc.",price:185,duration:50,ingredients:["Vitamin C","Zinc","B-Complex","Lysine"],category:"Immunity",active:true},
  {id:6,name:"Bloom Signature",desc:"Our flagship drip — the ultimate full-body reset.",price:225,duration:75,ingredients:["Glutathione","NAD+","Vitamin C","Myers Cocktail"],category:"Wellness",active:true},
  {id:7,name:"NAD+ Infusion",desc:"Cellular repair and anti-aging with pure NAD+.",price:350,duration:90,ingredients:["NAD+","Saline","Magnesium"],category:"Wellness",active:true},
  {id:8,name:"Myers Cocktail",desc:"The classic multi-vitamin IV for overall wellness.",price:155,duration:45,ingredients:["Magnesium","Calcium","B-Vitamins","Vitamin C"],category:"Wellness",active:true},
];
const DEFAULT_PROMOS: Promo[] = [
  {id:1,name:"Welcome Discount",code:"WELCOME15",type:"percent",value:15,active:true,expires:"2026-12-31",description:"15% off first appointment for new clients"},
  {id:2,name:"Flash Sale",code:"BLOOM20",type:"percent",value:20,active:false,expires:"2026-06-30",description:"24-hour flash sale — 20% off any drip"},
  {id:3,name:"VIP Credit",code:"VIP25",type:"fixed",value:25,active:true,expires:"2026-12-31",description:"$25 credit for VIP members"},
  {id:4,name:"Summer Glow",code:"SUMMER30",type:"percent",value:30,active:false,expires:"2026-08-31",description:"Summer season promotion — 30% off Glow Drip"},
];
const TEMPLATES = [
  {name:"Flash Sale",subject:"⚡ 24-Hour Flash Sale — Save 20%",body:"Hey {name},\n\nFor the next 24 hours only, enjoy 20% OFF any drip with code BLOOM20.\n\nBook now before spots are gone 💛\n\n— The Bloom Team"},
  {name:"Welcome",subject:"Welcome to Bloom Drip Co. ✨",body:"Hi {name},\n\nWe're so excited to have you join the Bloom family! Your wellness journey starts here.\n\nUse code WELCOME15 for 15% off your first appointment.\n\n— The Bloom Team"},
  {name:"Win-Back",subject:"We miss you, {name} 💛",body:"Hi {name},\n\nIt's been a while! Come back for a fresh reset — your body will thank you.\n\nUse code COMEBACK25 for $25 off your next drip.\n\n— The Bloom Team"},
  {name:"VIP Members",subject:"Exclusive VIP Offer Just for You",body:"Hey {name},\n\nAs a valued Bloom member, we're giving you early access to our new Signature Drip package.\n\nBook before it sells out!\n\n— The Bloom Team"},
  {name:"Seasonal",subject:"Summer Glow Season is Here ☀️",body:"Hi {name},\n\nSummer is here and your skin deserves to glow! Our Glow Drip is perfect for the season.\n\nBook this week and get a free Vitamin C add-on.\n\n— The Bloom Team"},
  {name:"Referral",subject:"Share Bloom & Earn 500 Points 🌸",body:"Hi {name},\n\nLove Bloom? Share us with a friend! When they book their first drip, you both earn 500 Bloom Points.\n\n— The Bloom Team"},
];

function ls<T>(key: string, def: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pwd, setPwd] = useState("");
  const [loginErr, setLoginErr] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [toast, setToast] = useState({ msg: "", err: false });
  const pwdRef = useRef<HTMLInputElement>(null);

  const [clients, setClients] = useState<Client[]>(() => ls("bloom_clients", DEFAULT_CLIENTS));
  const [bookings, setBookings] = useState<Booking[]>(() => ls("bloom_bookings", DEFAULT_BOOKINGS));
  const [menu, setMenu] = useState<MenuItem[]>(() => ls("bloom_menu", DEFAULT_MENU));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => ls("bloom_campaigns", []));
  const [promos, setPromos] = useState<Promo[]>(() => ls("bloom_promos", DEFAULT_PROMOS));
  const ADMIN_PWD = ls("bloom_pwd", "HarterLane2310");

  useEffect(() => { if (pwdRef.current) pwdRef.current.focus(); }, []);

  const showToast = (msg: string, err = false) => {
    setToast({ msg, err });
    setTimeout(() => setToast({ msg: "", err: false }), 3000);
  };

  const saveAll = (c = clients, b = bookings, m = menu, cp = campaigns, p = promos) => {
    lsSet("bloom_clients", c); lsSet("bloom_bookings", b); lsSet("bloom_menu", m);
    lsSet("bloom_campaigns", cp); lsSet("bloom_promos", p);
  };

  const doLogin = () => {
    if (pwd === ADMIN_PWD) { setLoggedIn(true); setLoginErr(false); }
    else { setLoginErr(true); setPwd(""); }
  };

  const doLogout = () => { setLoggedIn(false); setPwd(""); setPage("dashboard"); };

  const statusBadge = (s: string) => {
    if (s === "Confirmed") return "badge-gold";
    if (s === "Completed") return "badge-green";
    if (s === "Cancelled") return "badge-red";
    return "badge-gray";
  };

  if (!loggedIn) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
        <style>{`
          .login-input { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(201,168,76,.28); border-radius:10px; padding:13px 18px; color:var(--cream); font-size:14px; outline:none; transition:border-color .2s; font-family:'Inter',sans-serif; }
          .login-input:focus { border-color:var(--gold); }
        `}</style>
        <div style={{ background: "var(--panel)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 20, padding: "52px 48px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 0 60px rgba(201,168,76,.08)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "var(--gold)", marginBottom: 6 }}>Bloom Drip Co.</div>
          <div style={{ fontSize: 13, color: "rgba(200,216,232,.6)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 36 }}>Admin Dashboard</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "var(--cream)", marginBottom: 28 }}>Welcome back 💛</div>
          <div style={{ marginBottom: 18 }}>
            <input ref={pwdRef} type="password" className="login-input" placeholder="Enter password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
          </div>
          <button onClick={doLogin} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,var(--gold),var(--gold-dk))", color: "#010a12", fontWeight: 700, fontSize: 15, border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: ".06em", marginTop: 4 }}>Sign In</button>
          {loginErr && <div style={{ color: "#e05555", fontSize: 13, marginTop: 12 }}>Incorrect password. Please try again.</div>}
          <div style={{ marginTop: 20, fontSize: 12, color: "rgba(200,216,232,.4)" }}>
            <Link href="/" style={{ color: "rgba(201,168,76,.6)" }}>← Back to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "'Inter', sans-serif", color: "var(--text-c)" }}>
      <AdminStyles />

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div style={{ padding: "28px 24px 20px", fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--gold)", borderBottom: "1px solid rgba(201,168,76,.28)" }}>
          Bloom Drip Co.
          <span style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(200,216,232,.6)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 2 }}>Admin Panel</span>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {[
            { id: "dashboard", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>, label: "Dashboard" },
            { id: "bookings", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, label: "Bookings" },
            { id: "clients", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "Clients" },
            { id: "menu", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, label: "IV Menu & Pricing" },
            { id: "promos", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, label: "Promotions" },
            { id: "campaigns", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label: "Campaigns" },
            { id: "partnerships", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "Partnerships" },
            { id: "settings", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label: "Settings" },
          ].map(item => (
            <div key={item.id} className={`nav-item${page === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}>
              <span style={{ width: 17, height: 17, flexShrink: 0, display: "flex" }}>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 12px 24px", borderTop: "1px solid rgba(201,168,76,.28)" }}>
          <Link href="/" style={{ display: "block", textAlign: "center", fontSize: 12, color: "rgba(200,216,232,.4)", marginBottom: 8 }}>← Website</Link>
          <button onClick={doLogout} style={{ width: "100%", padding: 10, background: "transparent", border: "1px solid rgba(224,85,85,.35)", color: "#e07070", borderRadius: 8, cursor: "pointer", fontSize: 13, transition: "all .2s" }}>Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>

        {/* ── DASHBOARD ── */}
        {page === "dashboard" && (
          <DashboardPage bookings={bookings} clients={clients} statusBadge={statusBadge} promos={promos} />
        )}

        {/* ── BOOKINGS ── */}
        {page === "bookings" && (
          <BookingsPage bookings={bookings} setBookings={b => { setBookings(b); saveAll(clients, b, menu, campaigns, promos); }} menu={menu} showToast={showToast} statusBadge={statusBadge} />
        )}

        {/* ── CLIENTS ── */}
        {page === "clients" && (
          <ClientsPage clients={clients} setClients={c => { setClients(c); saveAll(c, bookings, menu, campaigns, promos); }} showToast={showToast} />
        )}

        {/* ── IV MENU & PRICING ── */}
        {page === "menu" && (
          <MenuPage menu={menu} setMenu={m => { setMenu(m); saveAll(clients, bookings, m, campaigns, promos); }} showToast={showToast} />
        )}

        {/* ── PROMOTIONS ── */}
        {page === "promos" && (
          <PromosPage promos={promos} setPromos={p => { setPromos(p); saveAll(clients, bookings, menu, campaigns, p); }} showToast={showToast} />
        )}

        {/* ── CAMPAIGNS ── */}
        {page === "campaigns" && (
          <CampaignsPage clients={clients} campaigns={campaigns} setCampaigns={cp => { setCampaigns(cp); saveAll(clients, bookings, menu, cp, promos); }} showToast={showToast} />
        )}

        {/* ── PARTNERSHIPS ── */}
        {page === "partnerships" && (
          <PartnershipsPage />
        )}

        {/* ── SETTINGS ── */}
        {page === "settings" && (
          <SettingsPage showToast={showToast} />
        )}

      </main>

      {/* Toast */}
      {toast.msg && (
        <div id="toast" className={`show${toast.err ? " err" : ""}`}>{toast.msg}</div>
      )}
    </div>
  );
}

// ── ADMIN STYLES ────────────────────────────────────────────────────────────
function AdminStyles() {
  return (
    <style>{`
      :root {
        --panel: #0a1a2a; --panel2: #0d2035;
        --text-c: #c8d8e8; --text2-c: rgba(200,216,232,.6);
        --red: #e05555; --green: #4caf82;
        --gold-dk: #8f7630;
      }
      .admin-sidebar { width:240px; min-height:100vh; background:var(--panel); border-right:1px solid rgba(201,168,76,.28); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto; }
      .nav-item { display:flex; align-items:center; gap:11px; padding:11px 14px; border-radius:10px; cursor:pointer; font-size:14px; color:var(--text2-c); transition:all .2s; margin-bottom:2px; }
      .nav-item:hover { background:rgba(201,168,76,.09); color:var(--cream); }
      .nav-item.active { background:rgba(201,168,76,.09); color:var(--gold); border:1px solid rgba(201,168,76,.28); }
      .admin-card { background:var(--panel); border:1px solid rgba(201,168,76,.28); border-radius:14px; padding:24px; margin-bottom:24px; }
      .admin-card-title { font-family:'Playfair Display',serif; font-size:17px; color:var(--cream); }
      .admin-table { width:100%; border-collapse:collapse; }
      .admin-table thead tr { border-bottom:1px solid rgba(201,168,76,.28); }
      .admin-table th { font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--text2-c); padding:10px 12px; text-align:left; font-weight:500; }
      .admin-table td { padding:12px 12px; font-size:13px; border-bottom:1px solid rgba(201,168,76,.07); color:var(--text-c); }
      .admin-table tr:last-child td { border-bottom:none; }
      .admin-table tr:hover td { background:rgba(201,168,76,.09); }
      .btn { padding:9px 18px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; border:none; letter-spacing:.04em; }
      .btn-gold { background:linear-gradient(135deg,var(--gold),var(--gold-dk)); color:#010a12; }
      .btn-gold:hover { opacity:.88; }
      .btn-outline { background:transparent; border:1px solid rgba(201,168,76,.28); color:var(--gold); }
      .btn-outline:hover { background:rgba(201,168,76,.09); }
      .btn-red { background:transparent; border:1px solid rgba(224,85,85,.4); color:var(--red); }
      .btn-red:hover { background:rgba(224,85,85,.12); }
      .btn-sm { padding:6px 12px; font-size:12px; }
      .btn-green { background:transparent; border:1px solid rgba(76,175,130,.4); color:#6ee0a8; }
      .btn-green:hover { background:rgba(76,175,130,.12); }
      .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
      .badge-gold { background:rgba(201,168,76,.15); color:var(--gold-lt); border:1px solid rgba(201,168,76,.3); }
      .badge-green { background:rgba(76,175,130,.15); color:#6ee0a8; border:1px solid rgba(76,175,130,.3); }
      .badge-red { background:rgba(224,85,85,.15); color:#f08080; border:1px solid rgba(224,85,85,.3); }
      .badge-gray { background:rgba(255,255,255,.06); color:var(--text2-c); border:1px solid rgba(255,255,255,.1); }
      .admin-input { background:rgba(255,255,255,.04); border:1px solid rgba(201,168,76,.28); border-radius:8px; padding:10px 14px; color:var(--cream); font-size:13px; outline:none; transition:border-color .2s; font-family:'Inter',sans-serif; width:100%; }
      .admin-input:focus { border-color:var(--gold); }
      .admin-select { background:#0d2035; border:1px solid rgba(201,168,76,.28); border-radius:8px; padding:10px 14px; color:var(--cream); font-size:13px; outline:none; font-family:'Inter',sans-serif; width:100%; }
      .admin-select option { background:#0d2035; }
      .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; }
      .modal { background:var(--panel); border:1px solid rgba(201,168,76,.28); border-radius:18px; padding:36px; max-width:560px; width:90%; max-height:90vh; overflow-y:auto; }
      .modal-title { font-family:'Playfair Display',serif; font-size:22px; color:var(--cream); margin-bottom:20px; }
      .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      .form-group { display:flex; flex-direction:column; gap:6px; }
      .form-group.full { grid-column:1/-1; }
      .form-label { font-size:12px; color:var(--text2-c); letter-spacing:.05em; text-transform:uppercase; }
      .price-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid rgba(201,168,76,.07); }
      .price-row:last-child { border-bottom:none; }
      .stat-card { background:var(--panel); border:1px solid rgba(201,168,76,.28); border-radius:14px; padding:22px 20px; }
      .stat-label { font-size:12px; color:var(--text2-c); text-transform:uppercase; letter-spacing:.07em; margin-bottom:8px; }
      .stat-val { font-family:'Playfair Display',serif; font-size:30px; color:var(--gold); }
      .stat-note { font-size:12px; color:#57b09f; margin-top:4px; }
      .seg-btn { padding:7px 16px; border-radius:20px; font-size:12px; cursor:pointer; background:transparent; border:1px solid rgba(201,168,76,.28); color:var(--text2-c); transition:all .2s; }
      .seg-btn.active { background:rgba(201,168,76,.09); color:var(--gold); border-color:var(--gold); }
      .template-card { border:1px solid rgba(201,168,76,.28); border-radius:10px; padding:14px; cursor:pointer; transition:all .2s; }
      .template-card:hover, .template-card.selected { background:rgba(201,168,76,.09); border-color:var(--gold); }
      .send-status { padding:14px; border-radius:10px; font-size:13px; margin-top:12px; }
      .send-success { background:rgba(76,175,130,.12); border:1px solid rgba(76,175,130,.3); color:#6ee0a8; }
      .send-error { background:rgba(224,85,85,.12); border:1px solid rgba(224,85,85,.3); color:#f08080; }
      #toast { position:fixed; bottom:28px; right:28px; background:var(--panel); border:1px solid rgba(201,168,76,.28); border-radius:10px; padding:14px 22px; font-size:13px; color:var(--cream); box-shadow:0 8px 32px rgba(0,0,0,.4); transform:translateY(20px); opacity:0; transition:all .3s; z-index:9999; }
      #toast.show { transform:translateY(0); opacity:1; }
      #toast.err { border-color:rgba(224,85,85,.5); color:var(--red); }
      .promo-card { background:var(--panel); border:1px solid rgba(201,168,76,.28); border-radius:14px; padding:20px; margin-bottom:16px; display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
      .promo-card.inactive { opacity:.6; }
      @media(max-width:720px) { .admin-sidebar { width:60px; } .nav-label { display:none; } }
    `}</style>
  );
}

// ── DASHBOARD PAGE ──────────────────────────────────────────────────────────
function DashboardPage({ bookings, clients, statusBadge, promos }: { bookings: Booking[]; clients: Client[]; statusBadge: (s: string) => string; promos: Promo[] }) {
  const revenue = bookings.filter(b => b.status === "Completed").reduce((s, b) => s + b.price, 0);
  const upcoming = bookings.filter(b => b.status === "Confirmed").length;
  const activePromos = promos.filter(p => p.active).length;
  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>Good to see you. Here's your overview.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Clients", val: clients.length, note: "All time" },
          { label: "Revenue (Completed)", val: "$" + revenue.toLocaleString(), note: "From bookings" },
          { label: "Upcoming Appts", val: upcoming, note: "Confirmed" },
          { label: "Active Members", val: clients.filter(c => c.type === "member").length, note: "Members" },
          { label: "Active Promos", val: activePromos, note: "Running now" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-note">{s.note}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">Recent Bookings</span>
        </div>
        <table className="admin-table">
          <thead><tr><th>Client</th><th>Service</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {[...bookings].reverse().slice(0, 5).map(b => (
              <tr key={b.id}>
                <td>{b.name}</td><td>{b.service}</td><td>{b.date}</td>
                <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {promos.filter(p => p.active).length > 0 && (
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span className="admin-card-title">Active Promotions</span>
          </div>
          <table className="admin-table">
            <thead><tr><th>Promo</th><th>Code</th><th>Discount</th><th>Expires</th></tr></thead>
            <tbody>
              {promos.filter(p => p.active).map(p => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td><span className="badge badge-gold">{p.code}</span></td>
                  <td>{p.type === "percent" ? `${p.value}% off` : `$${p.value} off`}</td>
                  <td>{p.expires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── BOOKINGS PAGE ────────────────────────────────────────────────────────────
function BookingsPage({ bookings, setBookings, menu, showToast, statusBadge }: { bookings: Booking[]; setBookings: (b: Booking[]) => void; menu: MenuItem[]; showToast: (m: string, e?: boolean) => void; statusBadge: (s: string) => string }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: menu[0]?.name || "", date: "", status: "Confirmed", notes: "" });

  const addBooking = () => {
    if (!form.name || !form.service || !form.date) { showToast("Please fill required fields", true); return; }
    const item = menu.find(m => m.name === form.service);
    const price = item ? item.price : 0;
    const newBookings = [...bookings, { id: Date.now(), ...form, price }];
    setBookings(newBookings);
    setModal(false);
    showToast("Booking added ✓");
    setForm({ name: "", email: "", service: menu[0]?.name || "", date: "", status: "Confirmed", notes: "" });
  };

  const deleteBooking = (id: number) => {
    setBookings(bookings.filter(b => b.id !== id));
    showToast("Booking deleted");
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Bookings</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>All appointments</p>
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">All Bookings</span>
          <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ New</button>
        </div>
        <table className="admin-table">
          <thead><tr><th>Client</th><th>Service</th><th>Date & Time</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.name}</td><td>{b.service}</td><td>{b.date}</td>
                <td>${b.price}</td>
                <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
                <td><button className="btn btn-red btn-sm" onClick={() => deleteBooking(b.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-title">New Booking</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Client Name</label><input className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Email</label><input type="email" className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Service</label>
                <select className="admin-select" value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                  {menu.map(m => <option key={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Date & Time</label><input className="admin-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="May 30, 2026 2:00 PM" /></div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="admin-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  {["Confirmed","Pending","Completed","Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><input className="admin-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addBooking}>Add Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CLIENTS PAGE ─────────────────────────────────────────────────────────────
function ClientsPage({ clients, setClients, showToast }: { clients: Client[]; setClients: (c: Client[]) => void; showToast: (m: string, e?: boolean) => void }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ id: number; name: string } | null>(null);
  const [form, setForm] = useState({ first: "", last: "", email: "", phone: "", type: "new" });

  const filtered = clients.filter(c => (c.first + " " + c.last + c.email).toLowerCase().includes(search.toLowerCase()));

  const addClient = () => {
    if (!form.first || !form.email) { showToast("Name and email required", true); return; }
    const now = new Date();
    const joined = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    setClients([...clients, { id: Date.now(), ...form, visits: 0, points: 0, joined }]);
    setModal(false);
    showToast("Client added ✓");
    setForm({ first: "", last: "", email: "", phone: "", type: "new" });
  };

  const deleteClient = (id: number) => {
    setClients(clients.filter(c => c.id !== id));
    setDeleteModal(null);
    showToast("Client deleted");
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Clients</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>Manage your client list</p>
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">All Clients</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="admin-input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ Add Client</button>
          </div>
        </div>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Visits</th><th>Points</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong>{c.first} {c.last}</strong></td>
                <td>{c.email}</td><td>{c.phone}</td>
                <td>{c.visits}</td><td>{c.points} pts</td><td>{c.joined}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <span className={`badge ${c.type === "member" ? "badge-gold" : c.type === "new" ? "badge-green" : "badge-gray"}`}>{c.type}</span>
                  <button className="btn btn-red btn-sm" onClick={() => setDeleteModal({ id: c.id, name: c.first + " " + c.last })}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-title">Add Client</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">First Name</label><input className="admin-input" value={form.first} onChange={e => setForm({...form, first: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Last Name</label><input className="admin-input" value={form.last} onChange={e => setForm({...form, last: e.target.value})} /></div>
              <div className="form-group full"><label className="form-label">Email</label><input type="email" className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="admin-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Type</label>
                <select className="admin-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="new">new</option><option value="member">member</option><option value="inactive">inactive</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addClient}>Add Client</button>
            </div>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setDeleteModal(null); }}>
          <div className="modal" style={{ maxWidth: 400, textAlign: "center" }}>
            <div className="modal-title" style={{ color: "var(--red)" }}>Delete Client</div>
            <p style={{ color: "var(--text2-c)", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              Are you sure you want to permanently delete <strong style={{ color: "var(--cream)" }}>{deleteModal.name}</strong>?<br />This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn btn-red" onClick={() => deleteClient(deleteModal.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MENU & PRICING PAGE ──────────────────────────────────────────────────────
function MenuPage({ menu, setMenu, showToast }: { menu: MenuItem[]; setMenu: (m: MenuItem[]) => void; showToast: (m: string, e?: boolean) => void }) {
  const [modal, setModal] = useState(false);
  const [prices, setPrices] = useState<Record<number, number>>(() => Object.fromEntries(menu.map(m => [m.id, m.price])));
  const [form, setForm] = useState({ name: "", desc: "", price: "", duration: "45", ingredients: "", category: "Wellness" });

  const savePrices = () => {
    const updated = menu.map(m => ({ ...m, price: prices[m.id] ?? m.price }));
    setMenu(updated);
    showToast("Prices saved ✓");
  };

  const deleteItem = (id: number) => {
    setMenu(menu.filter(m => m.id !== id));
    showToast("Item removed");
  };

  const addItem = () => {
    if (!form.name) { showToast("Item name required", true); return; }
    const newItem: MenuItem = {
      id: Date.now(), name: form.name, desc: form.desc,
      price: parseFloat(form.price) || 0, duration: parseInt(form.duration) || 45,
      ingredients: form.ingredients.split(",").map(s => s.trim()).filter(Boolean),
      category: form.category, active: true,
    };
    const updated = [...menu, newItem];
    setMenu(updated);
    setPrices(p => ({ ...p, [newItem.id]: newItem.price }));
    setModal(false);
    showToast("Menu item added ✓");
    setForm({ name: "", desc: "", price: "", duration: "45", ingredients: "", category: "Wellness" });
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>IV Menu & Pricing</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>Adjust prices and manage drip offerings</p>
      <div className="admin-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">Current Menu</span>
          <button className="btn btn-gold btn-sm" onClick={() => setModal(true)}>+ Add Item</button>
        </div>
        {menu.map(item => (
          <div key={item.id} className="price-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--cream)", fontWeight: 600 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: "var(--text2-c)" }}>{item.category} · {item.duration} min · {item.ingredients.join(", ")}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text2-c)" }}>$</span>
              <input type="number" className="admin-input" style={{ width: 110, textAlign: "right" }} value={prices[item.id] ?? item.price} onChange={e => setPrices(p => ({ ...p, [item.id]: parseFloat(e.target.value) || 0 }))} min={0} step={5} />
              <button className="btn btn-red btn-sm" onClick={() => deleteItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button className="btn btn-gold" onClick={savePrices}>Save All Prices</button>
        </div>
      </div>
      {modal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-title">Add IV Menu Item</div>
            <div className="form-grid">
              <div className="form-group full"><label className="form-label">Name</label><input className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Hydration Boost" /></div>
              <div className="form-group full"><label className="form-label">Description</label><textarea className="admin-input" rows={2} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Replenishes fluids..." style={{ resize: "vertical", minHeight: 60 }} /></div>
              <div className="form-group"><label className="form-label">Price ($)</label><input type="number" className="admin-input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} min={0} step={5} /></div>
              <div className="form-group"><label className="form-label">Duration (min)</label><input type="number" className="admin-input" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} min={30} step={15} /></div>
              <div className="form-group full"><label className="form-label">Key Ingredients (comma separated)</label><input className="admin-input" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} placeholder="Saline, Vitamin C, B12" /></div>
              <div className="form-group full"><label className="form-label">Category</label>
                <select className="admin-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {["Wellness","Beauty","Recovery","Energy","Immunity","Custom"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={addItem}>Add to Menu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROMOTIONS PAGE ──────────────────────────────────────────────────────────
function PromosPage({ promos, setPromos, showToast }: { promos: Promo[]; setPromos: (p: Promo[]) => void; showToast: (m: string, e?: boolean) => void }) {
  const [modal, setModal] = useState(false);
  const [editPromo, setEditPromo] = useState<Promo | null>(null);
  const [form, setForm] = useState<Omit<Promo, "id">>({ name: "", code: "", type: "percent", value: 10, active: true, expires: "", description: "" });

  const openAdd = () => { setEditPromo(null); setForm({ name: "", code: "", type: "percent", value: 10, active: true, expires: "", description: "" }); setModal(true); };
  const openEdit = (p: Promo) => { setEditPromo(p); setForm({ name: p.name, code: p.code, type: p.type, value: p.value, active: p.active, expires: p.expires, description: p.description }); setModal(true); };

  const savePromo = () => {
    if (!form.name || !form.code) { showToast("Name and code required", true); return; }
    if (editPromo) {
      setPromos(promos.map(p => p.id === editPromo.id ? { ...editPromo, ...form } : p));
      showToast("Promo updated ✓");
    } else {
      setPromos([...promos, { id: Date.now(), ...form }]);
      showToast("Promo created ✓");
    }
    setModal(false);
  };

  const togglePromo = (id: number) => {
    setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
    showToast("Promo updated ✓");
  };

  const deletePromo = (id: number) => {
    setPromos(promos.filter(p => p.id !== id));
    showToast("Promo deleted");
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Promotions</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>Manage discount codes and promotional add-ons</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-gold" onClick={openAdd}>+ Create Promo</button>
      </div>
      {promos.map(p => (
        <div key={p.id} className={`promo-card${p.active ? "" : " inactive"}`}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--cream)", fontWeight: 600 }}>{p.name}</span>
              <span className={`badge ${p.active ? "badge-green" : "badge-gray"}`}>{p.active ? "Active" : "Inactive"}</span>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
              <span className="badge badge-gold" style={{ fontSize: 12, letterSpacing: ".05em" }}>{p.code}</span>
              <span style={{ fontSize: 13, color: "var(--text2-c)" }}>{p.type === "percent" ? `${p.value}% off` : `$${p.value} off`}</span>
              <span style={{ fontSize: 13, color: "var(--text2-c)" }}>Expires: {p.expires}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text2-c)" }}>{p.description}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className={`btn btn-sm ${p.active ? "btn-outline" : "btn-green"}`} onClick={() => togglePromo(p.id)}>{p.active ? "Deactivate" : "Activate"}</button>
            <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
            <button className="btn btn-red btn-sm" onClick={() => deletePromo(p.id)}>Delete</button>
          </div>
        </div>
      ))}
      {modal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <div className="modal">
            <div className="modal-title">{editPromo ? "Edit Promo" : "Create Promotion"}</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Promo Name</label><input className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Summer Sale" /></div>
              <div className="form-group"><label className="form-label">Promo Code</label><input className="admin-input" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="SUMMER20" /></div>
              <div className="form-group"><label className="form-label">Discount Type</label>
                <select className="admin-select" value={form.type} onChange={e => setForm({...form, type: e.target.value as "percent" | "fixed"})}>
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Value ({form.type === "percent" ? "%" : "$"})</label><input type="number" className="admin-input" value={form.value} onChange={e => setForm({...form, value: parseFloat(e.target.value) || 0})} min={0} /></div>
              <div className="form-group"><label className="form-label">Expiry Date</label><input type="date" className="admin-input" value={form.expires} onChange={e => setForm({...form, expires: e.target.value})} style={{ colorScheme: "dark" }} /></div>
              <div className="form-group"><label className="form-label">Status</label>
                <select className="admin-select" value={form.active ? "active" : "inactive"} onChange={e => setForm({...form, active: e.target.value === "active"})}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group full"><label className="form-label">Description</label><input className="admin-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description of this promotion" /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={savePromo}>{editPromo ? "Update Promo" : "Create Promo"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CAMPAIGNS PAGE ────────────────────────────────────────────────────────────
function CampaignsPage({ clients, campaigns, setCampaigns, showToast }: { clients: Client[]; campaigns: Campaign[]; setCampaigns: (c: Campaign[]) => void; showToast: (m: string, e?: boolean) => void }) {
  const [segment, setSegment] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [fromName, setFromName] = useState("Bloom Drip Co.");
  const [fromEmail, setFromEmail] = useState("");
  const [body, setBody] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [previewModal, setPreviewModal] = useState(false);

  const filteredClients = segment === "all" ? clients : clients.filter(c => c.type === segment);

  const toggleClient = (email: string) => {
    const s = new Set(selected);
    if (s.has(email)) s.delete(email); else s.add(email);
    setSelected(s);
  };

  const selectAll = () => {
    if (selected.size === filteredClients.length) setSelected(new Set());
    else setSelected(new Set(filteredClients.map(c => c.email)));
  };

  const applyTemplate = (i: number) => {
    setSelectedTemplate(i);
    setSubject(TEMPLATES[i].subject);
    setBody(TEMPLATES[i].body);
  };

  const sendCampaign = async () => {
    if (!selected.size) { showToast("Select at least one recipient", true); return; }
    const apiKey = (document.getElementById("resendKey") as HTMLInputElement)?.value || localStorage.getItem("resend_key") || "";
    if (!apiKey) { showToast("Add your Resend API key in Settings first", true); return; }
    if (!subject || !body) { showToast("Subject and body required", true); return; }
    if (!fromEmail) { showToast("From email required", true); return; }

    setSending(true);
    setSendStatus(null);
    let sent = 0, failed = 0;

    const recipients = filteredClients.filter(c => selected.has(c.email));
    for (const r of recipients) {
      const personalBody = body.replace(/{name}/g, r.first);
      const htmlBody = personalBody.replace(/\n/g, "<br>");
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [r.email],
            subject: subject.replace("{name}", r.first),
            html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#fff;color:#333"><h2 style="color:#c9a84c;font-family:serif">${fromName}</h2><div style="margin:20px 0;line-height:1.7">${htmlBody}</div><hr style="border:none;border-top:1px solid #eee;margin:24px 0"/><p style="font-size:12px;color:#999">Bloom Drip Co. | You're receiving this because you're a valued client.</p></div>`,
          }),
        });
        if (res.ok) sent++; else failed++;
      } catch { failed++; }
    }

    setSending(false);
    const now = new Date();
    const newCampaign: Campaign = {
      id: Date.now(), subject,
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      recipients: recipients.length, sent, failed,
      status: failed === 0 ? "Sent" : sent === 0 ? "Failed" : "Partial",
    };
    setCampaigns([...campaigns, newCampaign]);

    if (sent > 0 && failed === 0) setSendStatus({ msg: `✓ Campaign sent to ${sent} recipient${sent > 1 ? "s" : ""}!`, type: "success" });
    else if (sent > 0) setSendStatus({ msg: `Sent to ${sent}, failed: ${failed}. Check your Resend dashboard.`, type: "success" });
    else setSendStatus({ msg: "Send failed. Check your Resend API key and 'From' email (must be verified in Resend).", type: "error" });
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Campaigns</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>Send promotions to your clients via email using Resend</p>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, alignItems: "start" }}>
        {/* Recipients */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="admin-card-title">Recipients</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {["all","member","new","inactive"].map(s => (
              <button key={s} className={`seg-btn${segment === s ? " active" : ""}`} onClick={() => { setSegment(s); setSelected(new Set()); }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text2-c)" }}>{selected.size} selected</span>
            <button className="btn btn-outline btn-sm" onClick={selectAll}>Select All</button>
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10, padding: 8 }}>
            {filteredClients.map(c => (
              <div key={c.email} onClick={() => toggleClient(c.email)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 6, cursor: "pointer", background: selected.has(c.email) ? "rgba(201,168,76,.09)" : "transparent" }}>
                <input type="checkbox" checked={selected.has(c.email)} onChange={() => toggleClient(c.email)} style={{ accentColor: "var(--gold)", width: 15, height: 15 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--cream)" }}>{c.first} {c.last}</div>
                  <div style={{ fontSize: 11, color: "var(--text2-c)" }}>{c.email}</div>
                </div>
                <span className={`badge ${c.type === "member" ? "badge-gold" : c.type === "new" ? "badge-green" : "badge-gray"}`} style={{ fontSize: 10 }}>{c.type}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Compose */}
        <div className="admin-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span className="admin-card-title">Compose</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text2-c)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".07em" }}>Quick Templates</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 16 }}>
            {TEMPLATES.map((t, i) => (
              <div key={t.name} className={`template-card${selectedTemplate === i ? " selected" : ""}`} onClick={() => applyTemplate(i)}>
                <div style={{ fontSize: 13, color: "var(--cream)", marginBottom: 4, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text2-c)", lineHeight: 1.5 }}>{t.subject.substring(0, 40)}...</div>
              </div>
            ))}
          </div>
          <div className="form-grid" style={{ marginTop: 4 }}>
            <div className="form-group full"><label className="form-label">Subject Line</label><input className="admin-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="✨ Exclusive offer just for you..." /></div>
            <div className="form-group full"><label className="form-label">From Name</label><input className="admin-input" value={fromName} onChange={e => setFromName(e.target.value)} /></div>
            <div className="form-group full"><label className="form-label">From Email (must be verified in Resend)</label><input type="email" className="admin-input" value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="hello@bloomdripco.com" /></div>
            <div className="form-group full"><label className="form-label">Message Body (supports HTML)</label><textarea className="admin-input" rows={7} value={body} onChange={e => setBody(e.target.value)} placeholder="Hey {name}, we have something special just for you..." style={{ resize: "vertical" }} /></div>
          </div>
          {sendStatus && (
            <div className={`send-status ${sendStatus.type === "success" ? "send-success" : "send-error"}`}>{sendStatus.msg}</div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
            <button className="btn btn-outline" onClick={() => setPreviewModal(true)}>Preview</button>
            <button className="btn btn-gold" onClick={sendCampaign} disabled={sending}>{sending ? "Sending…" : "Send Campaign"}</button>
          </div>
        </div>
      </div>
      {/* Campaign History */}
      <div className="admin-card" style={{ marginTop: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">Campaign History</span>
        </div>
        <table className="admin-table">
          <thead><tr><th>Campaign</th><th>Date</th><th>Recipients</th><th>Status</th></tr></thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text2-c)", padding: 24 }}>No campaigns sent yet</td></tr>
            ) : [...campaigns].reverse().map(c => (
              <tr key={c.id}>
                <td>{c.subject}</td><td>{c.date}</td><td>{c.recipients}</td>
                <td><span className={`badge ${c.status === "Sent" ? "badge-green" : c.status === "Failed" ? "badge-red" : "badge-gold"}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {previewModal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setPreviewModal(false); }}>
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-title">Email Preview</div>
            <div style={{ background: "#0a1528", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10, padding: 24, fontSize: 14, lineHeight: 1.7, color: "var(--cream)", marginBottom: 20, maxHeight: 380, overflowY: "auto" }}
              dangerouslySetInnerHTML={{ __html: `<strong>Subject:</strong> ${subject.replace("{name}", clients[0]?.first || "Friend")}<hr style="border-color:rgba(201,168,76,.2);margin:12px 0"/>${body.replace(/{name}/g, clients[0]?.first || "Friend").replace(/\n/g, "<br>")}` }} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-gold" onClick={() => setPreviewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage({ showToast }: { showToast: (m: string, e?: boolean) => void }) {
  const [bizName, setBizName] = useState("Bloom Drip Co.");
  const [bizPhone, setBizPhone] = useState("(818) 515-8980");
  const [bizAddr, setBizAddr] = useState("Pasadena, California");
  const [resendKey, setResendKey] = useState(() => localStorage.getItem("resend_key") || "");
  const [newPwd1, setNewPwd1] = useState("");
  const [newPwd2, setNewPwd2] = useState("");

  const saveSettings = () => {
    localStorage.setItem("resend_key", resendKey);
    showToast("Settings saved ✓");
  };

  const testResend = async () => {
    if (!resendKey) { showToast("Enter API key first", true); return; }
    try {
      const r = await fetch("https://api.resend.com/domains", { headers: { "Authorization": "Bearer " + resendKey } });
      if (r.ok) showToast("Resend connected ✓");
      else showToast("API key invalid — check Resend dashboard", true);
    } catch { showToast("Could not reach Resend (check your key)", true); }
  };

  const changePwd = () => {
    if (!newPwd1) { showToast("Enter a password", true); return; }
    if (newPwd1 !== newPwd2) { showToast("Passwords do not match", true); return; }
    localStorage.setItem("bloom_pwd", newPwd1);
    setNewPwd1(""); setNewPwd2("");
    showToast("Password updated ✓");
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Settings</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 28 }}>Configure your admin preferences</p>
      <div className="admin-card" style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">Business Info</span>
        </div>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Business Name</label><input className="admin-input" value={bizName} onChange={e => setBizName(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="admin-input" value={bizPhone} onChange={e => setBizPhone(e.target.value)} /></div>
          <div className="form-group full"><label className="form-label">Address</label><input className="admin-input" value={bizAddr} onChange={e => setBizAddr(e.target.value)} /></div>
        </div>
      </div>
      <div className="admin-card" style={{ maxWidth: 540, marginTop: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">Resend API Key</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 16, lineHeight: 1.6 }}>
          Enter your Resend API key to enable campaign emails. Get your key at <a href="https://resend.com" target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }}>resend.com</a>. Your key is stored locally in this browser only.
        </p>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">API Key</label>
          <input id="resendKey" type="password" className="admin-input" value={resendKey} onChange={e => setResendKey(e.target.value)} placeholder="re_xxxxxxxxxxxxxxxxxxxx" />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-gold" onClick={saveSettings}>Save Settings</button>
          <button className="btn btn-outline" onClick={testResend}>Test Connection</button>
        </div>
      </div>
      <div className="admin-card" style={{ maxWidth: 540, marginTop: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <span className="admin-card-title">Change Password</span>
        </div>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">New Password</label>
          <input type="password" className="admin-input" value={newPwd1} onChange={e => setNewPwd1(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Confirm Password</label>
          <input type="password" className="admin-input" value={newPwd2} onChange={e => setNewPwd2(e.target.value)} />
        </div>
        <button className="btn btn-gold" onClick={changePwd}>Update Password</button>
      </div>
    </div>
  );
}


// ── PARTNERSHIPS PAGE (Admin-only) ────────────────────────────────────────────
type PTabId = "corporate" | "bachelorette" | "hotel" | "gym";

function PartnershipsPage() {
  const [activeTab, setActiveTab] = useState<PTabId>("corporate");
  const [toast, setToast] = useState("");

  const showPToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  const copyEmail = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText)
      .then(() => showPToast("Email copied to clipboard ✓"))
      .catch(() => showPToast("Email copied ✓"));
  };

  return (
    <div>
      <style>{`
        .ptab { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; cursor: pointer; transition: all .2s; background: transparent; color: var(--text2-c); border: 1px solid transparent; }
        .ptab:hover { color: var(--cream); background: rgba(201,168,76,.09); }
        .ptab.on { background: rgba(201,168,76,.09); border-color: rgba(201,168,76,.28); color: var(--gold); }
        .pkg-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        .pkg-table th { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--text2-c); padding: 10px 14px; border-bottom: 1px solid rgba(201,168,76,.28); text-align: left; font-weight: 500; }
        .pkg-table td { padding: 13px 14px; font-size: 13px; border-bottom: 1px solid rgba(201,168,76,.07); color: var(--text2-c); }
        .pkg-table tr:last-child td { border-bottom: none; }
        .pkg-table tr:hover td { background: rgba(201,168,76,.09); color: var(--cream); }
        .pkg-table .pname { font-weight: 600; color: var(--cream); }
        .pprice { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--gold); }
        .pcopy-btn { font-size: 11px; font-weight: 600; color: var(--gold); background: rgba(201,168,76,.09); border: 1px solid rgba(201,168,76,.28); padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all .2s; }
        .pcopy-btn:hover { background: var(--gold); color: #010a12; }
        .pemail-body { padding: 20px 24px; font-size: 13px; line-height: 1.85; color: var(--text2-c); white-space: pre-wrap; }
        .ptips { background: rgba(61,139,122,.08); border: 1px solid rgba(61,139,122,.3); border-radius: 12px; padding: 18px 20px; margin-top: 16px; }
      `}</style>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--cream)", marginBottom: 6 }}>Partnerships</h1>
      <p style={{ fontSize: 13, color: "var(--text2-c)", marginBottom: 24 }}>Private partnership playbook — pitch scripts, packages, and email templates.</p>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {(["corporate","bachelorette","hotel","gym"] as PTabId[]).map(tab => (
          <button key={tab} className={`ptab${activeTab === tab ? " on" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab === "corporate" && "🏢 "}{tab === "bachelorette" && "🥂 "}{tab === "hotel" && "🏨 "}{tab === "gym" && "💪 "}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ── CORPORATE ── */}
      {activeTab === "corporate" && (
        <div>
          <PHeroBlock tag="💼 Partnership Pitch" title="Corporate Wellness Program" desc="Bring IV therapy directly to your clients' offices. One email or call is all it takes to land a recurring corporate account worth $1,500–$5,000+ per visit." chips={[["Target:","Law Firms · Real Estate · Tech Offices"],["Visit value:","$1,500–$5,000+"],["Recurring:","Monthly or Quarterly"]]} />
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button onClick={() => window.print()} className="btn btn-gold btn-sm">🖨 Print / Save PDF</button>
            <button onClick={() => copyEmail("corpEmail")} className="btn btn-outline btn-sm">Copy Email Template</button>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Suggested Packages</div>
            <table className="pkg-table">
              <thead><tr><th>Package</th><th>Includes</th><th>Sessions</th><th>Price Range</th></tr></thead>
              <tbody>
                <tr><td className="pname">Team Refresh</td><td>Hydration + Energy Drips, on-site setup</td><td>Up to 5 staff</td><td className="pprice">From $750</td></tr>
                <tr><td className="pname">Wellness Day</td><td>Choice of any drip, nurse on-site 3 hrs</td><td>Up to 10 staff</td><td className="pprice">From $1,500</td></tr>
                <tr><td className="pname">Monthly Partner</td><td>Bi-weekly visits, discounted rate, branded flyer</td><td>Unlimited</td><td className="pprice">Custom Quote</td></tr>
                <tr><td className="pname">Executive VIP</td><td>Private sessions for C-suite, premium drips</td><td>Up to 4 execs</td><td className="pprice">From $900</td></tr>
              </tbody>
            </table>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>How to Land the Account</div>
            <PChecklist items={[["Find the decision maker","HR Manager, Office Manager, or COO. LinkedIn is your best friend."],["Lead with ROI","Healthy employees = fewer sick days. Frame it as an investment, not a perk."],["Offer a pilot","Propose a free or discounted first visit for 5 people. Let the results sell themselves."],["Follow up twice","Email day 1, call day 4. Most deals close on the 2nd touchpoint."],["Get a champion inside","If one employee loves it, they'll push for it internally."]]} />
          </div>
          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: "var(--panel2)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text2-c)", letterSpacing: ".06em", textTransform: "uppercase" }}>📧 Cold Outreach Email</span>
              <button className="pcopy-btn" onClick={() => copyEmail("corpEmail")}>Copy</button>
            </div>
            <div id="corpEmail" className="pemail-body">{`Subject: Wellness perk your team will actually use — Bloom Drip Co.\n\nHi [First Name],\n\nI run Bloom Drip Co., a mobile IV therapy service based in Los Angeles. We come directly to offices and deliver IV drip sessions to employees on-site — no clinic visits, no downtime.\n\nCompanies like [similar company or industry] use us for monthly wellness days. Employees love it, and HR teams tell us it's become their most-requested perk.\n\nI'd love to offer [Company Name] a complimentary pilot session for 4–5 team members — no commitment, just a chance to experience it firsthand.\n\nWould you be open to a 10-minute call this week?\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`}</div>
          </div>
          <PTips tips={["Target companies with 20–200 employees — big enough to afford it, small enough for you to be special.","Pitch around Q1 (Jan) and Q3 (Jul) when wellness budgets reset.","Ask satisfied corporate clients for a Google review and a LinkedIn post.","Create a simple one-page PDF menu to attach to your email."]} />
        </div>
      )}

      {/* ── BACHELORETTE ── */}
      {activeTab === "bachelorette" && (
        <div>
          <PHeroBlock tag="🥂 Event Package" title="Bachelorette & Party Recovery" desc="The morning-after drip is one of the highest-demand IV services in LA. One package, one booking, multiple sessions. Perfect for parties of 4–10." chips={[["Avg group:","4–8 people"],["Per booking value:","$700–$1,600"],["Referral rate:","Very High"]]} />
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button onClick={() => window.print()} className="btn btn-gold btn-sm">🖨 Print / Save PDF</button>
            <button onClick={() => copyEmail("bachEmail")} className="btn btn-outline btn-sm">Copy Pitch Email</button>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Bachelorette Packages</div>
            <table className="pkg-table">
              <thead><tr><th>Package</th><th>What's Included</th><th>Group Size</th><th>Price Range</th></tr></thead>
              <tbody>
                <tr><td className="pname">The Bride Squad</td><td>Hydration Drips + vitamin boosters</td><td>4 guests</td><td className="pprice">From $600</td></tr>
                <tr><td className="pname">Glow & Go</td><td>Glow Drip + Recovery IV, champagne-style setup</td><td>6 guests</td><td className="pprice">From $950</td></tr>
                <tr><td className="pname">Bloom Bachelorette</td><td>Full menu choice, nurse stays 2 hrs, add-ons included</td><td>8 guests</td><td className="pprice">From $1,300</td></tr>
                <tr><td className="pname">VIP Bridal Package</td><td>Bride gets Signature Drip free, group full menu, extras</td><td>10 guests</td><td className="pprice">From $1,800</td></tr>
              </tbody>
            </table>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>How to Get Bachelorette Bookings</div>
            <PChecklist items={[["Partner with party planners","DM LA-based bachelorette and event planners on Instagram. Offer them a 10% referral fee per booking."],["Get on Airbnb host lists","Reach out to Superhost Airbnb properties in LA. Ask to be their recommended morning recovery service."],["Target Facebook & Reddit groups",'"LA Bachelorette Planning," "Girls Trip LA" — post genuinely helpful tips and mention Bloom.'],["Create TikTok content","Short videos of the setup, the drips, the experience. Bachelorette content goes viral."],["Add a Groups page to the website","A dedicated landing page makes it easy for maid-of-honors to book directly."]]} />
          </div>
          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: "var(--panel2)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text2-c)", letterSpacing: ".06em", textTransform: "uppercase" }}>📧 Planner Outreach Email</span>
              <button className="pcopy-btn" onClick={() => copyEmail("bachEmail")}>Copy</button>
            </div>
            <div id="bachEmail" className="pemail-body">{`Subject: Earn referral fees — luxury IV recovery for your bachelorette clients\n\nHi [First Name],\n\nI'm [Your Name] from Bloom Drip Co. — we're a mobile IV therapy service in Los Angeles that specializes in bachelorette and group recovery experiences.\n\nWe come directly to your clients' Airbnb, hotel, or venue, set up a premium in-room drip experience, and take care of everything. Most groups book us for the morning after their big night out.\n\nI'd love to partner with you. For every group booking you refer, I'll send you a 10% referral fee — no work on your end, just a recommendation.\n\nHappy to send you a digital menu and promo materials to share with your clients. Let me know if you're interested!\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`}</div>
          </div>
          <PTips tips={["The maid of honor books, not the bride. Make the booking process stupidly simple and fast.","Offer a \"bride drips free\" promo for groups of 6+ — the group pays for everyone else's session anyway.","Ask every group for a photo (with permission) to use on Instagram. These are your best ads.","Create a \"Bachelorette Recovery Kit\" add-on — face masks, electrolyte packets, etc. — to charge a premium."]} />
        </div>
      )}

      {/* ── HOTEL ── */}
      {activeTab === "hotel" && (
        <div>
          <PHeroBlock tag="🏨 Concierge Partnership" title="Hotel & Vacation Rental Program" desc="Become the go-to in-room wellness service for LA's hotels, boutique stays, and Airbnbs. Guests pay a premium for luxury that comes to them." chips={[["Target:","Boutique Hotels · Airbnb Superhosts · Resorts"],["Lead type:","Warm — already spending on wellness"],["Conversion:","High — captive vacation audience"]]} />
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button onClick={() => window.print()} className="btn btn-gold btn-sm">🖨 Print / Save PDF</button>
            <button onClick={() => copyEmail("hotelEmail")} className="btn btn-outline btn-sm">Copy Pitch Email</button>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>What to Offer Hotels</div>
            <PChecklist items={[["Concierge listing","A line in their \"In-Room Services\" menu: \"IV Wellness — Bloom Drip Co. | Book via QR code.\""],["QR code card","A small branded card placed in the room or at the front desk. Guest scans → lands on your booking page → books instantly."],["Commission model","Offer the hotel 10–15% of each booking they refer. Makes it a no-brainer for them to promote you."],["Co-branded experience","\"The [Hotel Name] Recovery Experience, powered by Bloom Drip Co.\" Exclusivity is a selling point."]]} />
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>How to Approach Hotels</div>
            <PChecklist items={[["Start with boutique hotels (20–80 rooms)","The GM or owner makes the decision directly. Big chains have 6-month procurement processes."],["Walk in with a package","Bring a printed one-pager, a QR code sample card, and a short menu. Looking professional closes deals."],["Airbnb Superhosts","Search \"LA Superhost\" on Airbnb, find their contact info, and email them. They're entrepreneurs who love partnerships."],["Wellness-focused properties","Yoga retreats, surf houses, fitness resorts — they already sell the wellness lifestyle. You're a natural add-on."]]} />
          </div>
          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: "var(--panel2)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text2-c)", letterSpacing: ".06em", textTransform: "uppercase" }}>📧 Hotel Outreach Email</span>
              <button className="pcopy-btn" onClick={() => copyEmail("hotelEmail")}>Copy</button>
            </div>
            <div id="hotelEmail" className="pemail-body">{`Subject: In-room IV wellness service for [Hotel Name] guests\n\nHi [First Name],\n\nI'm [Your Name], founder of Bloom Drip Co. — a luxury mobile IV therapy service in Los Angeles. We partner with hotels and properties to offer guests a premium in-room wellness experience without leaving the property.\n\nHere's how it works: we provide a co-branded QR code card for guest rooms. Guests scan, book, and we arrive at their room within a few hours. No setup required from your team.\n\nFor every booking we receive through [Hotel Name], we'd offer you a 12% referral commission — completely passive income for your property.\n\nGuests who experience in-room wellness rate their stay higher, and it's a unique amenity that sets you apart from the competition.\n\nWould you have 15 minutes this week to look at a quick proposal?\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`}</div>
          </div>
          <PTips tips={["Create a simple QR code (free at qr-code-generator.com) that links directly to your booking page.","Print 50–100 small branded cards (Canva + Vistaprint, ~$20) to leave at properties.","Follow up with a handwritten thank-you note after your first booking at a new property. It's memorable.","Track which properties send the most bookings and invest more time in those relationships."]} />
        </div>
      )}

      {/* ── GYM ── */}
      {activeTab === "gym" && (
        <div>
          <PHeroBlock tag="💪 Athlete Partnership" title="Gym & Athlete Recovery Program" desc="Athletes are your most loyal and vocal customers. Get into one gym and you'll have referrals for months. Recovery is a serious part of their training." chips={[["Target:","CrossFit · MMA Gyms · Marathon Groups"],["Visit value:","$800–$2,500"],["Loyalty:","Very High — repeat buyers"]]} />
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <button onClick={() => window.print()} className="btn btn-gold btn-sm">🖨 Print / Save PDF</button>
            <button onClick={() => copyEmail("gymEmail")} className="btn btn-outline btn-sm">Copy Pitch Email</button>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Recovery Packages for Athletes</div>
            <table className="pkg-table">
              <thead><tr><th>Package</th><th>Best For</th><th>Drips</th><th>Price Range</th></tr></thead>
              <tbody>
                <tr><td className="pname">Post-WOD Recovery</td><td>CrossFit athletes post-competition</td><td>Recovery IV + Hydration</td><td className="pprice">$175–$195</td></tr>
                <tr><td className="pname">Fight Night Recovery</td><td>MMA / combat sports</td><td>Recovery IV + Energy Boost</td><td className="pprice">$185–$210</td></tr>
                <tr><td className="pname">Race Day Package</td><td>Marathon / triathlon</td><td>Hydration + Myers Cocktail</td><td className="pprice">$155–$185</td></tr>
                <tr><td className="pname">Gym Recovery Day</td><td>Group gym visit (10+ members)</td><td>Full menu, on-site</td><td className="pprice">From $1,500</td></tr>
              </tbody>
            </table>
          </div>
          <div className="admin-card">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>How to Land Gym Partnerships</div>
            <PChecklist items={[["Walk in on a weekday morning","Gym owners are there early. Bring a one-pager and offer to do a free demo session for the owner or head coach."],["Sponsor a competition","Many CrossFit boxes host local throwdowns. Sponsor the event by offering free drips to top finishers."],["Set up a Recovery Tuesday","A weekly time slot where you come to the gym and members can book a drip on the spot."],["Target running groups and triathlon clubs","They train outdoors, they're extremely health-conscious, and they talk constantly in group chats."],["Give the head coach a free session","If the coach vouches for you, the whole gym follows. Best ROI move for gym partnerships."]]} />
          </div>
          <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ background: "var(--panel2)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--text2-c)", letterSpacing: ".06em", textTransform: "uppercase" }}>📧 Gym Partnership Email</span>
              <button className="pcopy-btn" onClick={() => copyEmail("gymEmail")}>Copy</button>
            </div>
            <div id="gymEmail" className="pemail-body">{`Subject: Recovery sessions for [Gym Name] members — want to partner?\n\nHey [First Name],\n\nI'm [Your Name], founder of Bloom Drip Co. — mobile IV therapy here in Los Angeles. We work with athletes and gyms to provide on-site recovery drips that help people bounce back faster, perform harder, and stay consistent.\n\nHere's what I'm proposing:\n— We come to [Gym Name] once a week for "Recovery Sessions"\n— Your members get a preferred member rate\n— You earn a referral fee for every booking\n\nI'd love to start by giving you a complimentary session so you can experience it firsthand — no strings attached.\n\nYou free for a quick call this week?\n\n— [Your Name]\nBloom Drip Co.\n[Phone] | bloomdripco.com`}</div>
          </div>
          <PTips tips={["Bring before/after recovery data if you have it — athletes are data-driven and respond to results.","Post-competition is your golden window. Reach out to event organizers 2 weeks before a local race or throwdown.","Build a \"Team Bloom\" athlete ambassador program — 2–3 local athletes who post about their drips in exchange for a monthly membership discount.","Partner with a sports physio or chiropractor — refer each other's clients. Zero cost, high trust."]} />
        </div>
      )}

      {/* Local toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "var(--panel)", border: "1px solid rgba(201,168,76,.28)", borderRadius: 10, padding: "12px 20px", fontSize: 13, color: "var(--cream)", boxShadow: "0 8px 30px rgba(0,0,0,.5)", zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function PHeroBlock({ tag, title, desc, chips }: { tag: string; title: string; desc: string; chips: string[][] }) {
  return (
    <div style={{ background: "linear-gradient(135deg,var(--panel),var(--panel2))", border: "1px solid rgba(201,168,76,.28)", borderRadius: 16, padding: "36px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,168,76,.07),transparent 70%)", pointerEvents: "none" }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,.09)", border: "1px solid rgba(201,168,76,.28)", padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{tag}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 700, color: "var(--cream)", lineHeight: 1.2, marginBottom: 10 }}>{title}</h2>
      <p style={{ fontSize: ".9rem", color: "var(--text2-c)", maxWidth: 520, lineHeight: 1.8, marginBottom: 18 }}>{desc}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chips.map(([label, val]) => (
          <div key={label} style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 50, padding: "5px 12px", fontSize: 12, color: "var(--text2-c)" }}>
            {label} <span style={{ color: "var(--gold)", fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PChecklist({ items }: { items: string[][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map(([title, text]) => (
        <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--text2-c)", lineHeight: 1.6 }}>
          <span style={{ color: "var(--gold)", fontSize: 10, marginTop: 3, flexShrink: 0 }}>✦</span>
          <div><strong style={{ color: "var(--cream)", fontWeight: 600 }}>{title}</strong> — {text}</div>
        </div>
      ))}
    </div>
  );
}

function PTips({ tips }: { tips: string[] }) {
  return (
    <div className="ptips">
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#57b09f", marginBottom: 10 }}>💡 Pro Tips</div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {tips.map(tip => (
          <li key={tip} style={{ fontSize: 13, color: "var(--text2-c)", paddingLeft: 16, position: "relative", lineHeight: 1.6 }}>
            <span style={{ position: "absolute", left: 0, color: "#57b09f", fontWeight: 600 }}>→</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
