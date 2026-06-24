import React from "react";

function Hero() {
  return (
    <>
      <main className="flex-1 pt-16 overflow-x-hidden">

        {/* HERO SECTION */}
        <section className="relative min-h-[auto] lg:min-h-[90vh] flex items-center overflow-hidden py-14 lg:py-0">

          {/* Background Blur Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-5 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div className="max-w-3xl text-center lg:text-left">
                <span className="inline-block gradient-bg px-3 py-1 rounded-full text-xs font-semibold text-primary-foreground mb-6">
                  5+ Years Experience • Available for Freelance
                </span>

                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
                  I build <span className="gradient-text">digital experiences</span>{" "}
                  that matter.
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg md:text-xl mt-6 max-w-xl mx-auto lg:mx-0">
                  Full‑Stack (MERN) Developer with strong Salesforce (LWC, Apex, SOQL)
                  and Blockchain (Web3.js, Ethers.js) experience—shipping production‑ready
                  apps with SQL/PostgreSQL, Docker, and third‑party API integrations.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
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

              <div className="flex justify-center lg:justify-end w-full">
                <div className="glass rounded-3xl p-3 sm:p-4 border border-border/40 w-full max-w-[min(100%,22rem)] sm:max-w-[420px] mx-auto lg:mx-0">
                  <img
                    src="https://pawan-portfolio-static-bucket.s3.us-east-2.amazonaws.com/static-image/pawan-portfolio-image.png"
                    alt="Profile"
                    className="w-full aspect-[4/5] object-cover object-center rounded-2xl"
                    loading="lazy"
                  />
                </div>
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
                  MERN, SQL/PostgreSQL, REST APIs, Docker
                </p>

              </div>

              {/* Card 2 */}
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
                    <path d="M3 12h18"></path>
                    <path d="M7 8h10"></path>
                    <path d="M7 16h10"></path>
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  Salesforce Dev
                </h3>
                <p className="text-muted-foreground text-sm">
                  LWC, Apex, SOQL, integrations (Knowbler ↔ Salesforce)
                </p>
              </div>

              {/* Card 3 */}
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
                    <path d="M12 2v20"></path>
                    <path d="M2 12h20"></path>
                    <path d="M7 7h10v10H7z"></path>
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  Blockchain Dev
                </h3>
                <p className="text-muted-foreground text-sm">
                  Web3.js, Ethers.js, wallet flows, on‑chain APIs
                </p>
              </div>

              {/* Card 4 */}
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
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  Integrations
                </h3>
                <p className="text-muted-foreground text-sm">
                  CoinMarketCap, HyperPay, payment & third‑party APIs
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
