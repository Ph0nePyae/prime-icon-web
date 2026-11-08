export function renderFooter() {
  const container = document.getElementById("footer-container");
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-gray-900 border-t-4 border-primary py-12">
    <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
            <!-- Brand -->
            <div>
                <a href="index.html"
                    class="font-display font-bold text-2xl text-blue-400 border-2 border-white px-3 py-1 inline-block mb-4">
                    Prime <span class="text-amber-500">Icon</span>
                </a>
                <p class="text-gray-400">Empowering communities and transforming lives through collective action.
                </p>
            </div>

            <!-- Quick Links -->
            <div>
                <h4 class="font-display font-bold text-white mb-4">Quick Links</h4>
                <ul class="space-y-2">
                    <li><a href="index.html" class="text-gray-400 hover:text-accent transition-colors">Home</a></li>
                    <li><a href="aboutus.html" class="text-gray-400 hover:text-accent transition-colors">About
                            Us</a></li>
                    <li><a href="event.html" class="text-gray-400 hover:text-accent transition-colors">Events</a></li>
                    <li><a href="activites.html"
                            class="text-gray-400 hover:text-accent transition-colors">Activities</a></li>
                    <li><a href="dpt.html" class="text-gray-400 hover:text-accent transition-colors">Departments</a>
                    </li>
                </ul>
            </div>

            <!-- Get Involved -->
            <div>
                <h4 class="font-display font-bold text-white mb-4">Get Involved</h4>
                <ul class="space-y-2">
                    <li><a href="contact.html" class="text-gray-400 hover:text-accent transition-colors">Donate</a>
                    </li>
                    <li><a href="contact.html" class="text-gray-400 hover:text-accent transition-colors">Volunteer</a>
                    </li>
                    <li><a href="contact.html" class="text-gray-400 hover:text-accent transition-colors">Partner
                            With Us</a>
                    </li>
                    <li><a href="contact.html" class="text-gray-400 hover:text-accent transition-colors">Contact</a>
                    </li>
                </ul>
            </div>

            <!-- Contact Info -->
            <div>
                <h4 class="font-display font-bold text-white mb-4">Contact</h4>
                <ul class="space-y-2 text-gray-400">
                    <li class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=primeicon01@gmail.com" 
                           target="_blank" 
                           class="text-gray-400 hover:text-accent transition-colors">
                                primeicon01@gmail.com
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-gray-500 text-sm">&copy; 2026 Prime Icon. All rights reserved.</p>
            <div class="flex gap-4">
                <!-- Facebook -->
                <a href="https://www.facebook.com/profile.php?id=615787135795200" target="_blank"
                    class="w-10 h-10 border-2 border-gray-700 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors"
                    aria-label="Facebook">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </a>
                <!-- Telegram -->
                <a href="https://t.me/primeiconofficial" target="_blank"
                    class="w-10 h-10 border-2 border-gray-700 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors"
                    aria-label="Telegram">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                </a>
                <!-- TikTok -->
                <a href="https://www.tiktok.com/@primeicon_pi" target="_blank rel="noopener noreferrer""
                    class="w-10 h-10 border-2 border-gray-700 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors"
                    aria-label="TikTok">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.242V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.836 4.836 0 01-1.003-.104z"/>
                    </svg>
                </a>
                <!-- YouTube -->
                <a href="https://www.youtube.com/@PiYouTubeChannel314" target="_blank"
                    class="w-10 h-10 border-2 border-gray-700 flex items-center justify-center text-gray-400 hover:border-accent hover:text-accent transition-colors"
                    aria-label="YouTube">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</footer>
  `;

  // Adjust links after rendering
  adjustFooterForCurrentPage();
}

function adjustFooterForCurrentPage() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  // Scope specifically to list links to prevent touching social icons
  const navLinks = document.querySelectorAll("#footer-container ul a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      const listItem = link.closest("li");
      if (listItem) {
        listItem.style.display = "none";
      }
    }
  });
}
