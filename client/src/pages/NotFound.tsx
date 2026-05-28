import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(6rem,20vw,10rem)", fontWeight: 700, color: "var(--gold)", lineHeight: 1, marginBottom: "1rem", opacity: 0.4 }}>404</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "var(--cream)", marginBottom: "1rem" }}>Page Not Found</h1>
        <p style={{ fontSize: ".95rem", color: "rgba(237,234,224,.55)", lineHeight: 1.7, marginBottom: "2rem" }}>
          Looks like this page took the day off. Let's get you back to the good stuff.
        </p>
        <Link href="/" style={{ display: "inline-block", padding: ".75rem 2rem", background: "linear-gradient(135deg,var(--gold),var(--gold-dk))", color: "#010a12", fontWeight: 700, fontSize: ".88rem", letterSpacing: ".07em", textTransform: "uppercase", borderRadius: 50, boxShadow: "0 6px 28px rgba(201,168,76,.35)", transition: "all .2s" }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
