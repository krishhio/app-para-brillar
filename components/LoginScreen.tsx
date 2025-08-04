import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string, remember: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, remember);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[var(--brilla-bg-gradient-from)] via-[var(--brilla-bg-gradient-via)] to-[var(--brilla-bg-gradient-to)] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xs bg-white/80 rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <div className="flex flex-col items-center mb-2">
          <div className="w-20 h-20 rounded-full bg-[var(--brilla-primary)] flex items-center justify-center mb-2">
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
          </div>
        </div>
        <input
          type="email"
          className="rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--brilla-primary)] text-center text-[var(--brilla-primary)] placeholder-gray-400"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--brilla-primary)] text-center text-[var(--brilla-primary)] placeholder-gray-400"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="accent-[var(--brilla-primary)]"
          />
          <span className="text-[var(--brilla-primary)] text-sm">Recordarme</span>
        </label>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="rounded-full bg-[var(--brilla-primary)] text-white py-2 font-semibold shadow-md hover:bg-[var(--brilla-primary-dark)] transition"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
        <button
          type="button"
          className="text-xs text-[var(--brilla-primary)] hover:underline mt-1"
          tabIndex={-1}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
