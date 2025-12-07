export type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

export type TokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

export type TokenClientConfig = {
  client_id: string;
  scope: string;
  prompt?: string;
  callback: (tokenResponse: TokenResponse) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
        };
      };
    };
  }
}

export type UseGoogleAuthReturn = {
  isAuthenticated: boolean;
  accessToken: string;
  status: string;
  error: string;
  scriptReady: boolean;
  handleLogin: () => void;
  clearSession: () => void;
};
