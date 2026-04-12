import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/worksupport360-logo.png';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'client') return '/client';
    if (role === 'admin') return '/admin';
    return '/freelancer';
  };

  return (
    <footer className="bg-[#080E1A] text-white py-12 border-t border-slate-800">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="WorkSupport360" className="h-10 w-10 rounded-lg" />
              <span className="text-xl font-black tracking-tight italic">
                <span className="text-orange-500">Work</span>
                <span className="text-orange-400">Support</span>
                <span className="text-white">360</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm">
              360° IT solutions — connecting professionals with quality projects. Privacy-first freelancing platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to="/browse" className="hover:text-orange-400 transition-colors">Find Talent</Link></li>
              {isAuthenticated ? (
                <li><Link to={getDashboardPath()} className="hover:text-orange-400 transition-colors">My Works</Link></li>
              ) : (
                <>
                  <li><Link to="/register?role=FreeLancer" className="hover:text-orange-400 transition-colors">Become a Freelancer</Link></li>
                  <li><Link to="/register?role=Client" className="hover:text-orange-400 transition-colors">Need Work Support</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href="tel:9441363687" className="hover:text-orange-400 transition-colors">9441363687</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <a href="mailto:info@worksupport360.com" className="hover:text-orange-400 transition-colors">info@worksupport360.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>India</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              {!isAuthenticated && (
                <li><Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link></li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} WorkSupport360. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Developed by <span className="text-orange-500 font-semibold">Mahvenx IT Solutions Pvt Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
