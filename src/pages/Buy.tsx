
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BuyTokens } from "@/components/BuyTokens";

const Buy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <BuyTokens />
      </main>
      <Footer />
    </div>
  );
};

export default Buy;
