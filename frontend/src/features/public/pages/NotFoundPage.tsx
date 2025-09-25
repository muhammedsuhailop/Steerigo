import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { Button } from "@/shared/components/ui";
import { Logo } from "@/shared/components/ui";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";

const NotFoundPage: React.FC = () => {
  const { user } = useAuth();

  const getRelevantLinks = () => {
    if (!user) {
      return [
        { path: "/", label: "Go Home", variant: "primary" as const },
        { path: "/login", label: "Sign In", variant: "outline" as const },
        { path: "/signup", label: "Sign Up", variant: "secondary" as const },
      ];
    }

    switch (user.role) {
      case "Admin":
        return [
          {
            path: "/admin/dashboard",
            label: "Admin Dashboard",
            variant: "primary" as const,
          },
        ];
      case "Driver":
        return [
          {
            path: "/driver/dashboard",
            label: "Driver Dashboard",
            variant: "primary" as const,
          },
        ];
      case "Rider":
        return [
          {
            path: "/dashboard",
            label: "Dashboard",
            variant: "primary" as const,
          },
        ];
      default:
        return [{ path: "/", label: "Go Home", variant: "primary" as const }];
    }
  };

  const relevantLinks = getRelevantLinks();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <Logo size="lg" variant="horizontal" className="mx-auto" />
          </div>

          <div className="mb-12">
            <h1 className="text-8xl md:text-9xl font-extrabold text-gray-100 mb-4 tracking-tight">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Oops! The page you're looking for seems to have taken a different
              route. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mb-8">
            {relevantLinks.map((link, index) => (
              <Button
                key={index}
                variant={link.variant}
                size="lg"
                className="min-w-[140px]"
              >
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            <p>
              Need help?{" "}
              <Link
                to="/contact"
                className="text-gray-700 hover:text-gray-900 underline font-medium"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
