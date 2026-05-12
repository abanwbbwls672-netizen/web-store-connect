import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { WhyUs } from "@/components/WhyUs";
import { Projects } from "@/components/Projects";
import { Gallery } from "@/components/Gallery";
import { Skills } from "@/components/Skills";
import { TechStack } from "@/components/TechStack";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { RequestService } from "@/components/RequestService";
import { Footer } from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { Loader } from "@/components/Loader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Loader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhyUs />
        <Projects />
        <Gallery />
        <Skills />
        <TechStack />
        <Testimonials />
        <RequestService />
        <Contact />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Index;
