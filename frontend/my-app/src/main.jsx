import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";
import { Log } from "oidc-client-ts";
import { WebStorageStateStore } from "oidc-client-ts";
import { BrowserRouter } from 'react-router-dom';

Log.level = Log.DEBUG;
Log.logger = console;

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: "code",
  scope: "email openid profile",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  nonceStore: new WebStorageStateStore({ store: window.localStorage }),
  monitorSession: false,
};

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>,
)