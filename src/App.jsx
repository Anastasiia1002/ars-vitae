import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Cursor, Footer, Header, MobileDock, ToastHost } from "./components/Chrome.jsx";
import Home from "./pages/Home.jsx";
import Price from "./pages/Price.jsx";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen overflow-x-clip">
      <Cursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/price" element={<Price />} />
      </Routes>
      <Footer />
      <MobileDock />
      <ToastHost />
    </div>
  );
}
