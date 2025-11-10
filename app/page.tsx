import NavBar from "@/components/Reuse/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import DigitalLearning from "@/components/Home/DigitalLearning";
import AcademySteps from "@/components/Home/AcademySteps";
import CreatorsTestimony from "@/components/Reuse/CreatorsTestimony";
import Space from "@/components/Reuse/space";
import Footer from "@/components/Reuse/Footer";
import Empowering from "@/components/Home/Empowering";

function HomePage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <DigitalLearning/>
      <Empowering/>
      <AcademySteps />
      <CreatorsTestimony />
      <Space />
      <Footer />
    </>
  );
}

export default HomePage;
