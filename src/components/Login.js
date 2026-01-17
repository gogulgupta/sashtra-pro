import { useState } from 'react';

export default function Login({setUser, setPanel}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const firebaseConfig = {
    apiKey: "AIzaSyDJGImQAhi5Iot4e9VbYabRCUH69E5qiH0",
    authDomain: "sasthra-6767c.firebaseapp.com",
    projectId: "sasthra-6767c",
    messagingSenderId: "840242086368",
    appId: "1:840242086368:web:86ef2c82e61a2ff58ceb85"
  };

  // Initialize Firebase only if it exists
  let auth = null;
  
  if (typeof window !== 'undefined' && window.firebase) {
    if (!window.firebase.apps || !window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
    auth = window.firebase.auth();
  }

  const loginEmail = async () => {
    if (!auth) {
      setError('Firebase not loaded. Please refresh the page.');
      return;
    }
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      setUser(result.user);
      setPanel("home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loginGoogle = async () => {
    if (!auth) {
      setError('Firebase not loaded. Please refresh the page.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      setUser(result.user);
      setPanel("home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!auth) {
      setError('Firebase not loaded. Please refresh the page.');
      return;
    }
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await auth.sendPasswordResetEmail(email);
      setError('✅ Password reset link sent to your email');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createAccount = async () => {
    if (!auth) {
      setError('Firebase not loaded. Please refresh the page.');
      return;
    }
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      setUser(result.user);
      setPanel("home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="login-bg-orb orb-1"></div>
      <div className="login-bg-orb orb-2"></div>
      <div className="login-bg-orb orb-3"></div>

      {/* Main Login Card */}
      <div className="login-card">
        
        {/* Header */}
        <div className="login-header">
          <div className="login-icon-wrapper">
            <div className="login-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="login-title">Hybrid Smart Shoes</h1>
          <p className="login-subtitle">Enter the future of footwear technology</p>
        </div>

        {/* Form */}
        <div className="login-form">
          
          {/* Email Input */}
          <div className="input-group">
            <div className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <div className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className={`login-message ${error.includes('✅') ? 'success' : 'error'}`}>
              {error}
            </div>
          )}

          {/* Email Login Button */}
          <button 
            onClick={loginEmail}
            disabled={isLoading}
            className="login-btn primary"
          >
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>or continue with</span>
          </div>

          {/* Google Login Button */}
          <button 
            onClick={loginGoogle}
            disabled={isLoading}
            className="login-btn secondary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          {/* Links */}
          <div className="login-links">
            <button onClick={forgotPassword} disabled={isLoading} className="link-btn">
              Forgot Password?
            </button>
            <button onClick={createAccount} disabled={isLoading} className="link-btn">
              Create Account
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Secured by Firebase Authentication</p>
          <div className="security-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"/>
            </svg>
            <span>256-bit Encryption</span>
          </div>
        </div>

      </div>

      <style>{`
        .login-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* Animated Background Orbs */
        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 10s ease-in-out infinite;
        }

        .orb-1 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #00fff9, #00d4ff);
          top: -50px;
          right: -50px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #ff006e, #ff4d94);
          bottom: -30px;
          left: -30px;
          animation-delay: 3s;
        }

        .orb-3 {
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
        }

        /* Main Card */
        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                      0 0 40px rgba(0, 255, 249, 0.1);
          position: relative;
          z-index: 1;
          overflow: hidden;
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00fff9, transparent);
        }

        /* Header */
        .login-header {
          text-align: center;
          padding: 40px 30px 30px;
        }

        .login-icon-wrapper {
          display: inline-block;
          margin-bottom: 20px;
        }

        .login-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #00fff9, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          box-shadow: 0 10px 30px rgba(0, 255, 249, 0.3);
          animation: iconPulse 3s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(0, 255, 249, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(0, 255, 249, 0.5);
          }
        }

        .login-title {
          font-size: 26px;
          font-weight: 800;
          background: linear-gradient(135deg, #00fff9, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          color: #666;
          font-size: 13px;
          font-weight: 500;
        }

        /* Form */
        .login-form {
          padding: 0 30px 30px;
        }

        .input-group {
          position: relative;
          margin-bottom: 16px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .login-input {
          width: 100%;
          padding: 14px 14px 14px 45px;
          background: rgba(30, 30, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }

        .login-input:focus {
          background: rgba(30, 30, 30, 0.8);
          border-color: #00fff9;
          box-shadow: 0 0 0 3px rgba(0, 255, 249, 0.1);
        }

        .login-input:focus + .input-icon {
          color: #00fff9;
        }

        .login-input::placeholder {
          color: #555;
        }

        .login-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Messages */
        .login-message {
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
        }

        .login-message.error {
          background: rgba(255, 0, 110, 0.1);
          border: 1px solid rgba(255, 0, 110, 0.3);
          color: #ff006e;
        }

        .login-message.success {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: #00ff88;
        }

        /* Buttons */
        .login-btn {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn.primary {
          background: linear-gradient(135deg, #00fff9, #8b5cf6);
          color: #000;
          box-shadow: 0 8px 24px rgba(0, 255, 249, 0.3);
        }

        .login-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 255, 249, 0.4);
        }

        .login-btn.primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ff006e, #8b5cf6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .login-btn.primary:hover:not(:disabled)::before {
          opacity: 1;
        }

        .login-btn.primary svg,
        .login-btn.primary span {
          position: relative;
          z-index: 1;
        }

        .login-btn.secondary {
          background: rgba(30, 30, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .login-btn.secondary:hover:not(:disabled) {
          background: rgba(40, 40, 40, 0.9);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Loader */
        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 16px;
          color: #555;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        }

        /* Links */
        .login-links {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 20px;
        }

        .link-btn {
          background: none;
          border: none;
          color: #00fff9;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .link-btn:hover:not(:disabled) {
          background: rgba(0, 255, 249, 0.1);
          color: #8b5cf6;
        }

        .link-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Footer */
        .login-footer {
          padding: 20px 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
        }

        .login-footer p {
          color: #555;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #00ff88;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          background: rgba(0, 255, 136, 0.1);
          border-radius: 20px;
        }

        @media (max-width: 480px) {
          .login-card {
            border-radius: 0;
            height: 100%;
            max-width: 100%;
          }

          .login-header {
            padding: 30px 20px 20px;
          }

          .login-form {
            padding: 0 20px 20px;
          }

          .login-footer {
            padding: 15px 20px;
          }
        }
      `}</style>
    </div>
  );
}