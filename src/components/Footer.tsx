import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/worksupport360-logo.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="WorkSupport360" className="h-10 w-10 rounded-lg" />
              <span className="text-xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Work</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400">Support</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-300 to-blue-400">360</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm">
              360° IT solutions — connecting professionals with quality projects. Privacy-first freelancing platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/browse" className="hover:text-primary transition-colors">Find Talent</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Become a Freelancer</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-background/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:9441363687" className="hover:text-primary transition-colors">9441363687</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@worksupport360.com" className="hover:text-primary transition-colors">info@worksupport360.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>India</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-background/70 text-sm">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} WorkSupport360. All rights reserved.
          </p>
          <p className="text-background/50 text-xs mt-2">
            Developed by <span className="text-primary font-semibold">Mahvenx IT Solutions Pvt Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
