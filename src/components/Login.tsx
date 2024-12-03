import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import { getUXImage } from '../services/airtable/uxImages';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mseLogo, setMseLogo] = useState<string | null>(null);
  const [splashLogo, setSplashLogo] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log('Starting to load images...');
        
        const mseLogoUrl = await getUXImage('logo_mse');
        console.log('MSE Logo URL:', mseLogoUrl);
        setMseLogo(mseLogoUrl);
        
        const splashLogoUrl = await getUXImage('logo_splashscreen');
        console.log('Splash Logo URL:', splashLogoUrl);
        setSplashLogo(splashLogoUrl);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    console.log('Current logo states:', { mseLogo, splashLogo });
  }, [mseLogo, splashLogo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials or inactive account');
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {mseLogo ? (
              <img
                src={mseLogo}
                alt="MSE Drivers Club"
                className="mx-auto h-32 w-auto" // Increased from h-24 to h-32
                onError={(e) => {
                  console.error('Error loading MSE logo:', e);
                  const img = e.target as HTMLImageElement;
                  console.log('Failed URL:', img.src);
                }}
              />
            ) : (
              <div className="h-32 flex items-center justify-center"> // Increased from h-24 to h-32
                <p className="text-gray-500">Loading logo...</p>
              </div>
            )}
            <h2 className="mt-6 text-3xl font-extrabold text-gray-100">
              MSE Drive Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 
                           placeholder-gray-500 text-gray-100 rounded-md bg-gray-800 
                           focus:outline-none focus:ring-lime-500 focus:border-lime-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-700 
                           placeholder-gray-500 text-gray-100 rounded-md bg-gray-800 
                           focus:outline-none focus:ring-lime-500 focus:border-lime-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 p-4 text-red-100">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                         text-sm font-medium rounded-md text-black bg-lime-500 hover:bg-lime-400 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-black" />
                </span>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="py-2 px-4 border-t border-gray-800">
        <div className="flex items-center justify-center space-x-2">
          {splashLogo ? (
            <img
              src={splashLogo}
              alt="Easylab AI"
              className="h-4 w-auto"
              onError={(e) => {
                console.error('Error loading splash logo:', e);
                const img = e.target as HTMLImageElement;
                console.log('Failed URL:', img.src);
              }}
            />
          ) : (
            <div className="h-4 w-8">
              <p className="text-gray-500 text-xs">Loading...</p>
            </div>
          )}
          <p className="text-sm text-gray-400">
            All rights reserved to Easylab AI © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}