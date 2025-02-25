import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<KindeProvider
			clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
			domain={import.meta.env.VITE_KINDE_DOMAIN}
			logoutUri={window.location.origin}
			redirectUri={window.location.origin}
			isDangerouslyUseLocalStorage={import.meta.env.DEV}
		>
			<App />
		</KindeProvider>
	</StrictMode>
);
