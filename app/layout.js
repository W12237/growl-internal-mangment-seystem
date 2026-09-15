import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Toaster from '../components/Toaster'
import ClientLayoutWrapper from '../components/ClientLayoutWrapper'

export const metadata = {
  title: 'Growl — Business OS',
  description: 'CRM · Operations · Finance — Powered by Growl Group',
}

// Runs before React hydrates: applies saved theme AND locale (RTL/font) instantly.
const initScript = `(function(){
  try {
    // Theme
    var t = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.add('no-transition');
    setTimeout(function(){ document.documentElement.classList.remove('no-transition'); }, 1);
    // Locale / RTL
    var loc = localStorage.getItem('locale');
    if (!loc) {
      var m = document.cookie.match(/(?:^|;\\s*)locale=([^;]*)/);
      loc = m ? m[1] : 'en';
    }
    if (loc === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.classList.add('font-arabic');
    }
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();`

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}
