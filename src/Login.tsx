import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const T = {
  dark:    "#04293A",
  navy:    "#021B2C",
  primary: "#064663",
  teal:    "#0D9488",
  mint:    "#02C39A",
  light:   "#ECF9F9",
  muted:   "#94A3B8",
  gray:    "#64748B",
  white:   "#FFFFFF",
  card:    "#0A3A52",
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    // Simulate a brief async call
    await new Promise(r => setTimeout(r, 600));
    const result = login(form);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body, #root { background:${T.navy}; font-family:'Outfit',sans-serif; min-height:100vh; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes blob-morph {
          0%,100%{ border-radius:60% 40% 55% 45%/55% 45% 60% 40%; }
          50%{ border-radius:40% 60% 60% 40%/50% 40% 60% 50%; }
        }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes shake { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-6px);} 40%,80%{transform:translateX(6px);} }

        .auth-root {
          min-height:100vh;
          display:grid;
          grid-template-columns:1fr 1fr;
          background:
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(2,195,154,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(13,148,136,0.09) 0%, transparent 50%),
            ${T.navy};
        }

        /* Left decorative panel */
        .auth-panel {
          display:flex; flex-direction:column; justify-content:center; align-items:center;
          padding:60px; position:relative; overflow:hidden;
          border-right:1px solid rgba(13,148,136,0.12);
        }
        .auth-panel-grid {
          position:absolute; inset:0;
          background-image: linear-gradient(rgba(2,195,154,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(2,195,154,0.04) 1px,transparent 1px);
          background-size:48px 48px;
        }
        .auth-blob {
          width:280px; height:280px;
          background:linear-gradient(135deg,rgba(13,148,136,0.35),rgba(2,195,154,0.15));
          animation:blob-morph 8s ease-in-out infinite;
          border:1.5px solid rgba(2,195,154,0.3);
          display:flex; align-items:center; justify-content:center;
          position:relative; z-index:1;
        }
        .auth-panel-copy {
          position:relative; z-index:1; text-align:center; margin-top:40px;
        }

        /* Right form panel */
        .auth-form-wrap {
          display:flex; flex-direction:column; justify-content:center; align-items:center; padding:60px 48px;
        }
        .auth-card {
          width:100%; max-width:420px;
          animation:fadeUp 0.5s ease both;
        }
        .auth-logo {
          font-family:'Syne',sans-serif; font-weight:800; font-size:22px; color:${T.white};
          margin-bottom:36px; cursor:pointer; display:inline-block;
        }
        .auth-logo span { color:${T.mint}; }
        .auth-title {
          font-family:'Syne',sans-serif; font-weight:800; font-size:30px; color:${T.white};
          margin-bottom:8px; letter-spacing:-0.5px;
        }
        .auth-sub {
          font-size:14px; color:${T.muted}; margin-bottom:32px; line-height:1.6;
        }

        .field { margin-bottom:18px; }
        .field-label {
          display:block; font-size:12px; font-family:'DM Mono',monospace;
          color:${T.muted}; letter-spacing:0.8px; text-transform:uppercase; margin-bottom:8px;
        }
        .field-wrap { position:relative; }
        .field-input {
          width:100%; padding:13px 16px; border-radius:10px;
          background:rgba(10,58,82,0.6); border:1.5px solid rgba(13,148,136,0.2);
          color:${T.white}; font-family:'Outfit',sans-serif; font-size:15px;
          outline:none; transition:border-color 0.2s, box-shadow 0.2s;
          -webkit-autofill-color: ${T.white};
        }
        .field-input::placeholder { color:${T.gray}; }
        .field-input:focus { border-color:rgba(2,195,154,0.5); box-shadow:0 0 0 3px rgba(2,195,154,0.08); }
        .field-input.error { border-color:rgba(239,68,68,0.5); animation:shake 0.35s ease; }
        .field-input-pr { padding-right:48px; }

        .eye-btn {
          position:absolute; right:14px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:${T.muted};
          font-size:16px; padding:4px; transition:color 0.2s;
        }
        .eye-btn:hover { color:${T.mint}; }

        .btn-submit {
          width:100%; padding:14px; border:none; border-radius:10px;
          background:linear-gradient(135deg,${T.mint},${T.teal});
          color:${T.dark}; font-family:'Syne',sans-serif; font-weight:700; font-size:15px;
          cursor:pointer; transition:opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          display:flex; align-items:center; justify-content:center; gap:10px;
          margin-top:8px; letter-spacing:0.3px;
        }
        .btn-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); box-shadow:0 6px 24px rgba(2,195,154,0.3); }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .spinner { width:16px; height:16px; border:2px solid ${T.dark}; border-top-color:transparent; border-radius:50%; animation:spin 0.7s linear infinite; }

        .error-box {
          background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3);
          border-radius:8px; padding:10px 14px; font-size:13px; color:#FCA5A5;
          margin-bottom:16px; display:flex; align-items:center; gap:8px;
        }

        .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
        .divider-line { flex:1; height:1px; background:rgba(13,148,136,0.15); }
        .divider-text { font-size:12px; color:${T.gray}; font-family:'DM Mono',monospace; }

        .oauth-btn {
          width:100%; padding:12px; border-radius:10px;
          background:rgba(10,58,82,0.5); border:1.5px solid rgba(13,148,136,0.2);
          color:${T.light}; font-family:'Outfit',sans-serif; font-size:14px;
          cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .oauth-btn:hover { border-color:rgba(2,195,154,0.35); background:rgba(10,58,82,0.8); }

        .auth-footer { margin-top:28px; text-align:center; font-size:14px; color:${T.muted}; }
        .auth-link { color:${T.mint}; text-decoration:none; font-weight:600; }
        .auth-link:hover { text-decoration:underline; }

        .shimmer-text { background:linear-gradient(90deg,${T.mint},${T.teal},#5EEAD4,${T.mint}); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s linear infinite; }

        .feature-list { list-style:none; margin-top:24px; display:flex; flex-direction:column; gap:12px; }
        .feature-item { display:flex; align-items:center; gap:12px; font-size:14px; color:${T.muted}; }
        .feature-check { width:20px; height:20px; border-radius:50%; background:rgba(2,195,154,0.15); border:1px solid rgba(2,195,154,0.3); display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }

        @media (max-width:768px) {
          .auth-root { grid-template-columns:1fr; }
          .auth-panel { display:none; }
          .auth-form-wrap { padding:40px 24px; }
        }
      `}</style>

      <div className="auth-root">
        {/* ── LEFT PANEL ── */}
        <div className="auth-panel">
          <div className="auth-panel-grid" />
          <div className="auth-blob">
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:T.mint, textAlign:"center", lineHeight:1.5 }}>
              CSV<br />
              <span style={{ fontSize:36 }}>→</span><br />
              Insight
            </div>
          </div>
          <div className="auth-panel-copy">
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, color:T.white, marginBottom:8 }}>
              Welcome back.
            </h2>
            <p style={{ color:T.muted, fontSize:14, maxWidth:320, lineHeight:1.7 }}>
              Your datasets and dashboards are waiting. Sign in to pick up where you left off.
            </p>
            <ul className="feature-list">
              {["Analyze unlimited CSV files","AI-powered insights","Secure local processing","Beautiful auto-generated charts"].map(f => (
                <li key={f} className="feature-item">
                  <span className="feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="auth-form-wrap">
          <div className="auth-card">
            <div className="auth-logo" onClick={() => navigate("/")}>Blob<span>lytics</span></div>
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-sub">Don't have an account? <a href="/signup" className="auth-link">Create one free →</a></p>

            {error && (
              <div className="error-box">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="field-label" htmlFor="email">Email address</label>
                <div className="field-wrap">
                  <input
                    id="email" name="email" type="email" autoComplete="email"
                    className={`field-input ${error ? "error" : ""}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <label className="field-label" htmlFor="password" style={{ margin:0 }}>Password</label>
                  <a href="#" className="auth-link" style={{ fontSize:12 }}>Forgot password?</a>
                </div>
                <div className="field-wrap">
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`field-input field-input-pr ${error ? "error" : ""}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Signing in…</> : "Sign in →"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or continue with</span>
              <div className="divider-line" />
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button className="oauth-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="oauth-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <div className="auth-footer">
              No account yet? <a href="/signup" className="auth-link">Sign up free</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}