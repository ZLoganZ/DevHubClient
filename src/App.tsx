import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";

import SignInPage from "@/pages/Sign-in";
import SignUpPage from "@/pages/Sign-up";
import NewsFeed from "@/pages/NewsFeed";
import MainLayout from "@/layouts/MainLayout";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route index element={<MainLayout Component={NewsFeed} />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
