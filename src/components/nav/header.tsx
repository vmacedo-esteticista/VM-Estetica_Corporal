"use client";

import Image from "next/image";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { MenuIcon} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import SideMenu from "./side-menu";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  return (
    <Card className="border-none">
      <CardContent className="p-5 justify-between items-center flex flex-row">
        <Image
          src="https://utfs.io/f/mUywBsJr5TYLZdahQ3LjD4SzIUFKot062CavGcNhMbJfQPVX"
          width={95}
          height={22}
          alt="VM - Estética Corporal"
          className="border rounded-full"
          onClick={() => router.push("/")}
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"outline"}
              size={"icon"}
              className="border-none hover:bg-[#d2965d] hover:text-[#f5ede5]"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
        <SideMenu/>
          
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
