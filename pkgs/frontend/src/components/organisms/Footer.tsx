import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 flex items-center justify-center">
                <Image
                  src="/assets/crossdonate_logo_black_type.png"
                  alt="CrossDonate Logo"
                  width={195}
                  height={21}
                  className="object-contain h-10"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Next-generation platform solving Web3 donation ecosystem fragmentation
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Developers</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors font-medium">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; 2025 CrossDonate. ETHGlobal Online 2025 Hackathon Project.
          </p>
        </div>
      </div>
    </footer>
  );
}
