"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  hideSideBar?: boolean;
  title?: string;
  subTitle?: string;
}

const PageLayout: React.FC<Props> = ({
  children,
  className,
  hideHeader,
  hideSideBar,
  ...props
}: Props) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex">
          <Sidebar isOpen={sidebarOpen} />
          <div className={cn(`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'md:ml-64' : 'ml-0'
          } pt-6 px-4 md:px-6 pb-8`, className)}>
         
          {children}
        
            </div>
            </div>
       
      </div>
   
  );
};

export default PageLayout;
