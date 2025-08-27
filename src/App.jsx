import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuctionsPage from "./Pages/AuctionsPage";
import ProfilePage from "./Pages/ProfilePage";
import ListNFTPage from "./Pages/ListNFTPage";
import MarketplacePage from "./Pages/MarketplacePage";
import { AppKitProvider } from "./config/wagmi";


const App = () => {
  return (
    <AppKitProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/list" element={<ListNFTPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AppKitProvider>
  );
};

export default App;
