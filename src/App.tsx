import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/Sign-in";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
