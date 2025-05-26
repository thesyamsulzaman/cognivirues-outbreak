import React, { useEffect, useState } from "react";

const isMobileOrTablet = (): boolean => {
  if (typeof window === "undefined") return false;

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  const isMobileUA =
    /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  const screenWidth = window.innerWidth;
  const isSmallScreen = screenWidth < 1024; // Consider anything under 1024px as tablet/mobile

  return isMobileUA || isSmallScreen;
};

const MobileWarning: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-cyan-300 text-center px-4">
    <div className="bg-white border border-black rounded-md p-8 shadow-lg max-w-md w-full">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-500">
        Cognivirues <br /> <span className="text-red-500">Outbreak</span>
      </h1>
      <p className="text-gray-800 mb-4">
        Oh no! This game is not available on mobile or tablet browsers!
        <br />
        Please try on a Desktop computer.
      </p>
      <p className="text-sm text-gray-700 mb-1">
        Copyright ©2025 Team Cognivirues Outbreak.
      </p>
    </div>
  </div>
);

export const WithMobileBlocker: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    setIsBlocked(isMobileOrTablet());

    const handleResize = () => {
      setIsBlocked(isMobileOrTablet());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isBlocked) return <MobileWarning />;
  return <>{children}</>;
};
