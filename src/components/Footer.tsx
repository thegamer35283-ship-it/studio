
import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-lg">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="font-headline text-2xl font-bold">Benevolent Bonds</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm leading-relaxed">
              Strengthening the bonds of humanity through transparent, direct, and impactful charitable initiatives across the globe since 2026.
            </p>
          </div>
          
          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Impact Reports</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Transparency Hub</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-lg mb-6">Ways to Give</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li><Link href="#" className="hover:text-white transition-colors">Zakat Portal</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sadaqah Jariyah</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Monthly Giving</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Gift in Honor</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-primary-foreground/50">
          <p>© 2026 Benevolent Bonds. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
