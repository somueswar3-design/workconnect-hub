import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, LogIn, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-blue-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-orange-100 mb-6">
          <AlertTriangle className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-3">404</h1>
        <p className="text-xl font-semibold text-gray-800 mb-2">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or the link has been modified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" /> Sign in
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
