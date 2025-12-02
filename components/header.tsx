"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Menu, X, Settings, FileText, Files, Bot, Home, LogOut, User, HelpCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/rillcod-logo.png" alt="RillCod Logo" width={32} height={32} className="rounded-sm" />
            <span className="hidden font-bold sm:inline-block">Student Progress Reports</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link
            href="/reports"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Reports
          </Link>
          <Link
            href="/templates"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Templates
          </Link>
          <Link
            href="/analytics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Analytics
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/images/rillcod-logo.png"
                      alt="RillCod Logo"
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span className="font-bold">Student Reports</span>
                  </Link>
                  <SheetClose className="rounded-full hover:bg-muted p-1">
                    <X className="h-4 w-4" />
                  </SheetClose>
                </div>

                <div className="space-y-4">
                  <div className="py-2">
                    <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Navigation</h3>
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/">
                          <Home className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/reports">
                          <FileText className="mr-2 h-4 w-4" />
                          Single Reports
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/batch">
                          <Files className="mr-2 h-4 w-4" />
                          Batch Reports
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/ai">
                          <Bot className="mr-2 h-4 w-4" />
                          AI Assistant
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="py-2">
                    <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Account</h3>
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                  <p className="text-xs text-muted-foreground">&copy; 2023 RillCod Education</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
