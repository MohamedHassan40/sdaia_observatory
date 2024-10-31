"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  Menu,
  Package2,
  HomeIcon,
  ShoppingCart,
  Package,
  Users,
  LineChart,
  Search,
  CircleUser,
  PanelLeft,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { navbarLinks } from "@/constants/navbar";
import { usePathname } from "next/navigation";

const MobileNavbar = () => {
  const pathname = usePathname();
  const paths = pathname?.split("/")?.filter((x) => x);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6 sm:pb-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            {navbarLinks.map((link) => (
              <Link
                key={link.id}
                href={link.link}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <link.icon className="h-5 w-5" />
                {link.title}
              </Link>
            ))}
          
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {/* Always show "Home" linking to the root */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {paths && paths?.length > 0 && <BreadcrumbSeparator />}
          {/* Generate breadcrumbs for other paths */}
          {paths?.map((path, index) => {
            const isLast = index === paths.length - 1;
            const href = "/" + paths.slice(0, index + 1).join("/");
            const displayPath = path
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()); // Replace dashes and capitalize words
            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{displayPath}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="relative ml-auto flex-1 md:grow-0">
        
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      
    </header>
  );
};

export default MobileNavbar;
