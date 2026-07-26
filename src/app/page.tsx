import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <div className="bg-brand-950 text-white min-h-screen">
      <Hero />
      <Services />
      <About />
      <Contact />
    </div>
  );
}
