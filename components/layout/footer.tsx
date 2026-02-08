import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  faGithub,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/MohamedMouloudj/Feedoise",
    icon: faGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamed-mouloudj-547020247/",
    icon: faLinkedin,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/Mohamed_MJ01",
    icon: faXTwitter,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-2" responsive variant="dark" size="lg" />
            <p className="text-sm text-muted-foreground max-w-md">
              Multilingual feedback and ticketing platform. Collect feedback in
              any language, manage it in yours.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/organizations"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Organizations
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Feedoise. All rights reserved.
          </p>
          <div className="flex gap-6">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <FontAwesomeIcon icon={link.icon} width={20} height={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
