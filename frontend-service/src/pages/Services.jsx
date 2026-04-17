import React from "react";
import Navbar from "../components/GlobalComponent/Navbar";
import Footer from "../components/GlobalComponent/Footer";

function Services() {
  return (
    <section className="py-24">
      <Navbar />
      <div className="container mx-auto px-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Services
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          This section is coming soon. Add your offerings here (web apps, APIs,
          UI/UX, performance, etc.).
        </p>
      </div>
      <Footer />
    </section>
  );
}

export default Services;

