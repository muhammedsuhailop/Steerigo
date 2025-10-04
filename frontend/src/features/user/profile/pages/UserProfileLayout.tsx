import React from "react";
import { Header } from "@/features/public/components/Header";
import { Footer } from "@/features/public/components/Footer";
import UserProfilePage from "./UserProfilePage";

const UserProfileLayout: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <Header />
      <main>
        <UserProfilePage />
      </main>
      <Footer />
    </div>
  );
};

export default UserProfileLayout;
