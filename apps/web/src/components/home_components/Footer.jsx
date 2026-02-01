import React from 'react';

const Footer = () => {
  const footerSections = {
    about: {
      title: 'About',
      links: ['Our Story', 'Careers', 'Press', 'Sustainability']
    },
    contact: {
      title: 'Contact',
      links: ['Help Center', 'Support', 'Live Chat', 'Call Us']
    },
    legal: {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer']
    }
  };

  return (
    <footer className="w-full bg-card border-t border-border">
      <div className="w-full mx-auto px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">QuickBuy</h3>
            <p className="text-sm text-muted-foreground">
              Premium quality products delivered to your doorstep with care and trust.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerSections.about.title}
            </h4>
            <ul className="space-y-2">
              {footerSections.about.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerSections.contact.title}
            </h4>
            <ul className="space-y-2">
              {footerSections.contact.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerSections.legal.title}
            </h4>
            <ul className="space-y-2">
              {footerSections.legal.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 YourStore. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-muted-foreground">
                <span className="text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-muted-foreground">
                <span className="text-sm font-bold">𝕏</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-muted-foreground">
                <span className="text-sm font-bold">in</span>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center text-muted-foreground">
                <span className="text-sm font-bold">IG</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;