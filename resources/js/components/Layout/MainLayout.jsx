import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({
    children,
    currentPath = window.location.pathname + window.location.search,
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile toggle
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isCollapsed}
                currentPath={currentPath}
                toggleCollapse={toggleCollapse}
            />

            {/* Overlay para mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content Area */}
            <div
                className={`transition-all duration-300 ${
                    isCollapsed ? "lg:ml-20" : "lg:ml-64"
                }`}
            >
                {/* Header */}
                <Header
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    isCollapsed={isCollapsed}
                />

                {/* Page Content */}
                <main className="pt-16 min-h-screen">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
