import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import store from "@/redux/configStore";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
