import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ContactCorner, Cursor, Footer, Header, MobileDock, ToastHost } from "./components/Chrome.jsx";
import Home from "./pages/Home.jsx";
import Price from "./pages/Price.jsx";
import Privacy from "./pages/Privacy.jsx";

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let frame = 0;
    const scrollToTarget = () => {
      const node = document.getElementById(id);
      if (node) node.scrollIntoView({ block: "start" });
    };
    frame = requestAnimationFrame(() => {
      scrollToTarget();
      frame = requestAnimationFrame(scrollToTarget);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className="min-h-screen overflow-x-clip">
      <a href="#content" className="skip-link">
        Перейти до вмісту
      </a>
      <Cursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/price" element={<Price />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <Footer />
      <MobileDock />
      <ContactCorner />
      <ToastHost />
    </div>
  );
}
