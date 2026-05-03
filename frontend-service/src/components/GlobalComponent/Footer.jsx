import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const { adminData: admin } = useSelector((state) => state.user);

  const socialLinksList = useMemo(() => {
    if (!admin?.socialLinks) return [];
    return Object.entries(admin.socialLinks).map(([platform, url]) => ({
      platform,
      url,
      id: `${platform}-${url}`
    }));
  }, [admin?.socialLinks]);

  return (
    <>
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-12">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="font-display text-lg font-bold gradient-text mb-3">
                {admin?.firstName ? `${admin.firstName} ${admin.lastName || ''}`.trim() : "DevPortfolio"}
              </h3>

              <p className="text-muted-foreground text-sm max-w-md">
                Building premium digital experiences with modern technologies.
                Let's create something amazing together.
              </p>

              {/* Social Links */}
              {/* <div className="flex gap-4 mt-4">
                {socialLinksList.map(({ platform, url, id }) => (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors capitalise"
                    title={platform}
                  >
                    {platform.toLowerCase() === 'github' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                    ) : platform.toLowerCase() === 'linkedin' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    ) : (
                      <span className="text-xs uppercase">{platform.slice(0, 2)}</span>
                    )}
                  </a>
                ))}
              </div> */}
            </div>

            {/* Pages */}
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">
                Pages
              </h4>

              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Home
                </Link>

                <Link
                  to="/projects"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Projects
                </Link>

                <Link
                  to="/payment"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Payment
                </Link>

                <Link
                  to="/contact"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">
                Contact
              </h4>

              <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                {admin?.email ? <span>{admin.email}</span> : null}
                <span>{admin?.country || "Chandigarh, India"}</span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-border/50 mt-8 pt-6 text-center text-muted-foreground text-xs">
            © 2026 DevPortfolio. All rights reserved.
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;
