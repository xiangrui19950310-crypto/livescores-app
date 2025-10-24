import * as React from "react";

export function Tabs({ children }) {
  return <div className="w-full">{children}</div>;
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex justify-center gap-3 mt-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({ children, value, onClick, activeTab }) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, activeTab }) {
  if (activeTab !== value) return null;
  return <div className="mt-4">{children}</div>;
}
