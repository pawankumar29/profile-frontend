import React from "react";

function Hero() {
  return (
    <>
      <main className="flex-1 pt-16">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          
          {/* Background Blur Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              
              <span className="inline-block gradient-bg px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground mb-6">
                Available for Freelance
              </span>

              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
                I build{" "}
                <span className="gradient-text">
                  digital experiences
                </span>{" "}
                that matter.
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl mt-6 max-w-xl">
                Full-stack developer & designer crafting high-performance web
                applications, mobile apps, and scalable cloud solutions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                
                <a
                  href="/contact"
                  className="gradient-bg px-8 py-3.5 rounded-lg font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 glow"
                >
                  Hire Me
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>

                <a
                  href="/projects"
                  className="glass px-8 py-3.5 rounded-lg font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  View Work
                </a>

              </div>
            </div>
          </div>
        </section>


        {/* EXPERTISE SECTION */}
        <section className="py-24">
          <div className="container mx-auto px-6">

            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest gradient-text">
                Expertise
              </span>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                What I Do Best
              </h2>

              <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base">
                Combining technical mastery with creative thinking to deliver
                solutions that drive results.
              </p>
            </div>

            {/* Expertise Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1 */}
              <div className="glass rounded-xl p-6 hover:glow transition-shadow duration-300 group">
                <div className="gradient-bg w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary-foreground"
                  >
                    <path d="m18 16 4-4-4-4"></path>
                    <path d="m6 8-4 4 4 4"></path>
                    <path d="m14.5 4-5 16"></path>
                  </svg>

                </div>

                <h3 className="font-display font-semibold text-foreground mb-1">
                  Full-Stack Dev
                </h3>

                <p className="text-muted-foreground text-sm">
                  React, Node.js, TypeScript, Python
                </p>

              </div>

            </div>

          </div>
        </section>

      </main>
    </>
  );
}

export default Hero;