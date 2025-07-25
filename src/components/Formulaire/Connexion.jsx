import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaFacebookF } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser } from '../../services/api';
import { API_URL } from '../../services/api';
import logo from '../../assets/logo/aeddi.png';
import { motion } from 'framer-motion';

const Connexion = ({ onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Vérifier les erreurs dans l'URL au chargement du composant
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_auth_failed') {
      setError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashbord');
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
              const response = await fetch(`${API_URL}/api/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await response.json();

      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashbord');
      } else {
        setError('Erreur lors de la connexion Google');
      }
    } catch (err) {
      setError('Erreur lors de la connexion Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-md w-full max-w-md flex flex-col items-center relative"
        style={{ boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.08)' }}
      >
        <img src={logo} alt="AEDDI" className="w-20 h-20 object-contain mb-4 drop-shadow-lg" />
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">Connexion à AEDDI</h1>
        <form className="space-y-4 w-full" onSubmit={handleSubmit} autoComplete="on">
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-center font-semibold animate-pulse">{error}</motion.p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                className="w-full p-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 shadow-sm transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 pl-10 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70 shadow-sm transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              </span>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label="Afficher/masquer le mot de passe"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <div className="flex justify-between items-center mt-4 text-sm w-full">
          <button
            onClick={onForgot}
            className="text-pink-500 hover:underline font-semibold"
          >
            Mot de passe oublié ?
          </button>
        </div>
        <div className="mt-6 w-full flex flex-col gap-3">
          <a
            href={`${API_URL}/api/auth/google/redirect`}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl shadow transition-all duration-150 active:scale-95"
            style={{ textDecoration: 'none' }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.91 2.36 30.28 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.36 13.09 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.99 37.09 46.1 31.27 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.01-2.9-1.01-6.01 0-8.91l-7.98-6.2C.99 17.09 0 20.45 0 24c0 3.55.99 6.91 2.69 9.82l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.28 0 11.91-2.09 15.91-5.73l-7.19-5.6c-2.01 1.35-4.59 2.13-8.72 2.13-6.26 0-11.64-3.59-13.33-8.82l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Se connecter avec Google
          </a>
          <button
            onClick={() => window.location.href = `${API_URL}/api/auth/facebook/redirect`}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow transition-all duration-150 active:scale-95"
          >
            <FaFacebookF size={18} />
            Se connecter avec Facebook
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Nouveau sur AEDDI ?</p>
          <p className="mt-2">
            Connectez-vous avec Google pour créer votre compte automatiquement !
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Connexion;
