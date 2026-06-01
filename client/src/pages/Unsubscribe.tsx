import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * Public one-click unsubscribe page.
 * Accessed via /unsubscribe?token=<uuid> — the token is embedded in every
 * marketing email footer by the server.
 */
export default function Unsubscribe() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token") ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "manual">("idle");
  const [email, setEmail] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualMsg, setManualMsg] = useState("");

  const unsubByToken = trpc.email.unsubscribeByToken.useMutation();
  const unsubByEmail = trpc.email.unsubscribeEmail.useMutation();

  // Auto-process token on mount
  useEffect(() => {
    if (!token) { setStatus("manual"); return; }
    setStatus("loading");
    unsubByToken.mutate(
      { token },
      {
        onSuccess: (data) => {
          if (data.success) {
            setEmail(data.email ?? "");
            setStatus("success");
          } else {
            setStatus("error");
          }
        },
        onError: () => setStatus("error"),
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleManualUnsub = () => {
    if (!manualEmail.includes("@")) { setManualMsg("Please enter a valid email address."); return; }
    unsubByEmail.mutate(
      { email: manualEmail },
      {
        onSuccess: () => {
          setManualMsg(`✓ ${manualEmail} has been unsubscribed.`);
          setManualEmail("");
        },
        onError: () => setManualMsg("Something went wrong. Please try again."),
      }
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #020b14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "40px 20px",
    }}>
      <div style={{
        background: "var(--panel, #0a1a2a)",
        border: "1px solid rgba(201,168,76,.28)",
        borderRadius: 20,
        padding: "52px 48px",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
        boxShadow: "0 0 60px rgba(201,168,76,.06)",
      }}>
        {/* Logo */}
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#c9a84c", marginBottom: 6 }}>
          Bloom Drip Co.
        </div>
        <div style={{ fontSize: 11, color: "rgba(200,216,232,.5)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 36 }}>
          Email Preferences
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ color: "rgba(200,216,232,.6)", fontSize: 14 }}>Processing your request…</div>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#edeae0", marginBottom: 12 }}>
              You've been unsubscribed
            </h2>
            <p style={{ fontSize: 14, color: "rgba(200,216,232,.6)", lineHeight: 1.7, marginBottom: 28 }}>
              {email ? <><strong style={{ color: "#edeae0" }}>{email}</strong> has been removed from our marketing list.</> : "You've been removed from our marketing list."}
              {" "}You won't receive promotional emails from us anymore.
            </p>
            <p style={{ fontSize: 12, color: "rgba(200,216,232,.4)", marginBottom: 28, lineHeight: 1.6 }}>
              Note: You may still receive transactional emails related to your bookings and appointments.
            </p>
            <Link href="/" style={{ color: "#c9a84c", fontSize: 13, textDecoration: "none" }}>← Back to Bloom Drip Co.</Link>
          </>
        )}

        {/* Error (invalid/expired token) */}
        {status === "error" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#edeae0", marginBottom: 12 }}>
              Link expired or invalid
            </h2>
            <p style={{ fontSize: 14, color: "rgba(200,216,232,.6)", lineHeight: 1.7, marginBottom: 28 }}>
              This unsubscribe link has already been used or is no longer valid.
              You can enter your email below to unsubscribe manually.
            </p>
            <ManualUnsubForm
              email={manualEmail}
              setEmail={setManualEmail}
              onSubmit={handleManualUnsub}
              loading={unsubByEmail.isPending}
              message={manualMsg}
            />
          </>
        )}

        {/* Manual (no token in URL) */}
        {status === "manual" && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#edeae0", marginBottom: 12 }}>
              Unsubscribe from emails
            </h2>
            <p style={{ fontSize: 14, color: "rgba(200,216,232,.6)", lineHeight: 1.7, marginBottom: 28 }}>
              Enter your email address below and we'll remove you from our marketing list.
            </p>
            <ManualUnsubForm
              email={manualEmail}
              setEmail={setManualEmail}
              onSubmit={handleManualUnsub}
              loading={unsubByEmail.isPending}
              message={manualMsg}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ManualUnsubForm({
  email, setEmail, onSubmit, loading, message,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  message: string;
}) {
  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSubmit()}
        placeholder="your@email.com"
        style={{
          width: "100%",
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(201,168,76,.28)",
          borderRadius: 10,
          padding: "12px 16px",
          color: "#edeae0",
          fontSize: 14,
          outline: "none",
          fontFamily: "'Inter', sans-serif",
          marginBottom: 12,
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "13px 0",
          background: loading ? "rgba(201,168,76,.4)" : "linear-gradient(135deg,#c9a84c,#8f7630)",
          color: "#010a12",
          fontWeight: 700,
          fontSize: 14,
          border: "none",
          borderRadius: 10,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: ".05em",
          marginBottom: 12,
        }}
      >
        {loading ? "Processing…" : "Unsubscribe Me"}
      </button>
      {message && (
        <div style={{
          fontSize: 13,
          color: message.startsWith("✓") ? "#6ee0a8" : "#f08080",
          marginTop: 4,
        }}>
          {message}
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <Link href="/" style={{ color: "rgba(201,168,76,.6)", fontSize: 12, textDecoration: "none" }}>← Back to Bloom Drip Co.</Link>
      </div>
    </div>
  );
}
