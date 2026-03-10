import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const T = {
  dark:    "#04293A",
  navy:    "#021B2C",
  teal:    "#0D9488",
  mint:    "#02C39A",
  light:   "#ECF9F9",
  muted:   "#94A3B8",
  gray:    "#64748B",
  white:   "#FFFFFF",
};

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "#EF4444" };
  if (score <= 3) return { score, label: "Fair",   color: "#EAB308" };
  if (score === 4) return { score, label: "Good",   color: "#3B82F6" };
  return               { score, label: "Strong", color: T.mint };
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strength = passwordStrength(form.password);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(errs => ({ ...errs, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())              errs.name     = "Name is required.";
    if (!form.email.trim())             errs.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password)                 errs.password = "Password is required.";
    else if (form.password.length < 8) errs.password = "Must be at least 8 characters.";
    if (form.password !== form.confirm) errs.confirm  = "Passwords don't match.";
    if (!agreed)                        errs.agreed   = "You must accept the terms.";
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setGlobalError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = signup({ name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (result.error) setGlobalError(result.error);
    else navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body, #root { background:${T.navy}; font-family:'Outfit',sans-serif; min-height:100vh; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes blob-morph { 0%,100%{border-radius:60% 40% 55% 45%/55% 45% 60% 40%;} 50%{border-radius:40% 60% 60% 40%/50% 40% 60% 50%;} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes strength-fill { from{width:0;} to{width:var(--w);} }

        .auth-root {
          min-height:100vh; display:grid; grid-template-columns:1fr 1fr;
          background:
            radial-gradient(ellipse 80% 50% at 80% 20%, rgba(2,195,154,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 20% 80%, rgba(13,148,136,0.09) 0%, transparent 50%),
            ${T.navy};
        }
        .auth-form-wrap {
          display:flex; flex-direction:column; justify-content:center; align-items:center;
          padding:50px 48px; order:-1;
        }
        .auth-card { width:100%; max-width:440px; animation:fadeUp 0.5s ease both; }
        .auth-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:22px; color:${T.white}; margin-bottom:32px; cursor:pointer; display:inline-block; }
        .auth-logo span { color:${T.mint}; }
        .auth-title { font-family:'Syne',sans-serif; font-weight:800; font-size:30px; color:${T.white}; margin-bottom:8px; letter-spacing:-0.5px; }
        .auth-sub { font-size:14px; color:${T.muted}; margin-bottom:28px; line-height:1.6; }

        .fields-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .field { margin-bottom:16px; }
        .field-label { display:block; font-size:11px; font-family:'DM Mono',monospace; color:${T.muted}; letter-spacing:0.8px; text-transform:uppercase; margin-bottom:7px; }
        .field-wrap { position:relative; }
        .field-input {
          width:100%; padding:12px 16px; border-radius:10px;
          background:rgba(10,58,82,0.6); border:1.5px solid rgba(13,148,136,0.2);
          color:${T.white}; font-family:'Outfit',sans-serif; font-size:14px;
          outline:none; transition:border-color 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color:${T.gray}; }
        .field-input:focus { border-color:rgba(2,195,154,0.5); box-shadow:0 0 0 3px rgba(2,195,154,0.08); }
        .field-input.has-error { border-color:rgba(239,68,68,0.5); }
        .field-input.field-input-pr { padding-right:48px; }
        .field-error { font-size:12px; color:#FCA5A5; margin-top:5px; font-family:'DM Mono',monospace; }

        .eye-btn { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:${T.muted}; font-size:16px; padding:4px; transition:color 0.2s; }
        .eye-btn:hover { color:${T.mint}; }

        .strength-bars { display:flex; gap:4px; margin-top:8px; }
        .strength-bar { flex:1; height:3px; border-radius:2px; background:rgba(13,148,136,0.15); transition:background 0.3s; }

        .checkbox-wrap { display:flex; align-items:flex-start; gap:10px; margin-bottom:18px; cursor:pointer; }
        .checkbox-box { width:18px; height:18px; border-radius:5px; border:1.5px solid rgba(13,148,136,0.3); background:rgba(10,58,82,0.5); flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:1px; transition:all 0.2s; }
        .checkbox-box.checked { background:${T.mint}; border-color:${T.mint}; }
        .checkbox-label { font-size:13px; color:${T.muted}; line-height:1.5; }
        .checkbox-label a { color:${T.mint}; text-decoration:none; }
        .checkbox-label a:hover { text-decoration:underline; }

        .btn-submit {
          width:100%; padding:14px; border:none; border-radius:10px;
          background:linear-gradient(135deg,${T.mint},${T.teal});
          color:${T.dark}; font-family:'Syne',sans-serif; font-weight:700; font-size:15px;
          cursor:pointer; transition:opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          display:flex; align-items:center; justify-content:center; gap:10px; letter-spacing:0.3px;
        }
        .btn-submit:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); box-shadow:0 6px 24px rgba(2,195,154,0.3); }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .spinner { width:16px; height:16px; border:2px solid ${T.dark}; border-top-color:transparent; border-radius:50%; animation:spin 0.7s linear infinite; }

        .error-box { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:10px 14px; font-size:13px; color:#FCA5A5; margin-bottom:16px; display:flex; align-items:center; gap:8px; }

        .divider { display:flex; align-items:center; gap:12px; margin:18px 0; }
        .divider-line { flex:1; height:1px; background:rgba(13,148,136,0.15); }
        .divider-text { font-size:12px; color:${T.gray}; font-family:'DM Mono',monospace; }

        .oauth-btn {
          width:100%; padding:11px; border-radius:10px;
          background:rgba(10,58,82,0.5); border:1.5px solid rgba(13,148,136,0.2);
          color:${T.light}; font-family:'Outfit',sans-serif; font-size:14px;
          cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px;
        }
        .oauth-btn:hover { border-color:rgba(2,195,154,0.35); background:rgba(10,58,82,0.8); }

        .auth-footer { margin-top:24px; text-align:center; font-size:14px; color:${T.muted}; }
        .auth-link { color:${T.mint}; text-decoration:none; font-weight:600; }
        .auth-link:hover { text-decoration:underline; }

        /* Right decorative panel */
        .auth-panel {
          display:flex; flex-direction:column; justify-content:center; align-items:center;
          padding:60px; position:relative; overflow:hidden;
          border-left:1px solid rgba(13,148,136,0.12);
        }
        .auth-panel-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(2,195,154,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(2,195,154,0.04) 1px,transparent 1px); background-size:48px 48px; }
        .auth-blob { width:260px; height:260px; background:linear-gradient(135deg,rgba(13,148,136,0.35),rgba(2,195,154,0.15)); animation:blob-morph 8s ease-in-out infinite; border:1.5px solid rgba(2,195,154,0.3); display:flex; align-items:center; justify-content:center; position:relative; z-index:1; }

        .step-list { list-style:none; margin-top:36px; display:flex; flex-direction:column; gap:18px; position:relative; z-index:1; }
        .step-item { display:flex; align-items:flex-start; gap:14px; }
        .step-num { width:28px; height:28px; border-radius:50%; background:rgba(2,195,154,0.12); border:1px solid rgba(2,195,154,0.3); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:12px; color:${T.mint}; flex-shrink:0; }
        .step-copy h4 { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; color:${T.white}; margin-bottom:2px; }
        .step-copy p { font-size:12px; color:${T.muted}; line-height:1.5; }

        @media (max-width:768px) {
          .auth-root { grid-template-columns:1fr; }
          .auth-panel { display:none; }
          .auth-form-wrap { padding:40px 24px; order:0; }
          .fields-row { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="auth-root">
        {/* ── LEFT FORM ── */}
        <div className="auth-form-wrap">
          <div className="auth-card">
            <div className="auth-logo" onClick={() => navigate("/")}>Blob<span>lytics</span></div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Already have one? <a href="/login" className="auth-link">Sign in →</a></p>

            {globalError && (
              <div className="error-box"><span>⚠️</span> {globalError}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="fields-row">
                <div className="field">
                  <label className="field-label" htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" autoComplete="name"
                    className={`field-input ${errors.name ? "has-error" : ""}`}
                    placeholder="Ada Lovelace"
                    value={form.name} onChange={handleChange}
                  />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email"
                    className={`field-input ${errors.email ? "has-error" : ""}`}
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                  />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>
              </div>

              <div className="field">
                <label className="field-label" htmlFor="password">Password</label>
                <div className="field-wrap">
                  <input id="password" name="password" type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`field-input field-input-pr ${errors.password ? "has-error" : ""}`}
                    placeholder="Min 8 characters"
                    value={form.password} onChange={handleChange}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div>
                    <div className="strength-bars">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="strength-bar"
                          style={{ background: i <= strength.score ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:strength.color, marginTop:5 }}>
                      {strength.label} password
                    </div>
                  </div>
                )}
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="field">
                <label className="field-label" htmlFor="confirm">Confirm password</label>
                <input id="confirm" name="confirm" type="password" autoComplete="new-password"
                  className={`field-input ${errors.confirm ? "has-error" : ""}`}
                  placeholder="Repeat password"
                  value={form.confirm} onChange={handleChange}
                />
                {errors.confirm && <div className="field-error">{errors.confirm}</div>}
              </div>

              <div className="checkbox-wrap" onClick={() => setAgreed(a => !a)}>
                <div className={`checkbox-box ${agreed ? "checked" : ""}`}>
                  {agreed && <span style={{ fontSize:11, color:T.dark, fontWeight:800 }}>✓</span>}
                </div>
                <label className="checkbox-label">
                  I agree to the <a href="#" onClick={e => e.stopPropagation()}>Terms of Service</a> and <a href="#" onClick={e => e.stopPropagation()}>Privacy Policy</a>
                </label>
              </div>
              {errors.agreed && <div className="field-error" style={{ marginTop:-10, marginBottom:12 }}>{errors.agreed}</div>}

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? <><span className="spinner" /> Creating account…</> : "Create free account →"}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or sign up with</span>
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
              Already have an account? <a href="/login" className="auth-link">Sign in</a>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="auth-panel">
          <div className="auth-panel-grid" />
          <div className="auth-blob">
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:T.mint, textAlign:"center", lineHeight:1.5 }}>
              Get<br />started<br />
              <span style={{ fontSize:32 }}>🚀</span>
            </div>
          </div>
          <ul className="step-list">
            {[
              { n:"01", title:"Create your free account",   desc:"No credit card required. Up and running in 30 seconds." },
              { n:"02", title:"Upload your first CSV",       desc:"Drag & drop any dataset. We handle files up to 500 MB." },
              { n:"03", title:"Explore your insights",       desc:"Live charts, AI summaries, and export tools — instantly." },
            ].map(s => (
              <li key={s.n} className="step-item">
                <div className="step-num">{s.n}</div>
                <div className="step-copy">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}