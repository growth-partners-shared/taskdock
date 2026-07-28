// LAYOUTS
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <UserMenu />
      </div>
    </header>
  );
}
