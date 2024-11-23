import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Server from "./pages/Server";
import ServerDetail from "./pages/ServerDetail";

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex min-h-[calc(100vh-calc(var(--spacing)*16))] flex-1 flex-col gap-4 bg-background p-4 md:p-10 md:pt-8">
          <Header />
          <Routes>
            <Route path="/" element={<Server />} />
            <Route path="/server/:id" element={<ServerDetail />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
};

export default App;
