import EarningCards from "@/components/creatorEarnings/EarningCards";
import EarningHero from "@/components/creatorEarnings/EarningHero";
import TransactionHistory from "@/components/creatorEarnings/TransactionHistory";

export default function page() {
  return (
    <>
      {/* Earning title and button */}
      <EarningHero />

      {/* Earning card submissions */}
      <EarningCards />

      {/* Trasaction Table */}
      <TransactionHistory />
    </>
  );
}
