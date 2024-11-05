'use client'
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
// import { Luclogo } from "./Luclogo";

export default function Navbar_header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    {name: 'Unidades', link:'/unidades'},
    {name: 'Fiscales', link:'/fiscales'},
    {name: 'Rutas', link:'/rutas'},
    {name: 'Horarios', link:'/horarios'}
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className=" grid grid-cols-2 bg-blue-950">
     
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          
          <Link href="/" className="font-bold text-white">BusQRCode</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link className="text-slate-100" href={item.link}>
            <p className="hover:text-blue-400">
                {item.name}
            </p>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={ "foreground"
              }
              className="w-full"
              href={item.link}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
