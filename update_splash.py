import os
import re

splash_html = """  <!-- Premium Splash Screen -->
  <div class="splash-screen" id="splash-screen">
    <div class="splash-content">
      <svg class="splash-logo" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <!-- Shield Outline -->
        <path class="draw-path shield-outline" d="M155,40 L345,40 L345,220 Q345,320 250,360 Q155,320 155,220 Z" fill="none" stroke="white" stroke-width="2"/>
        
        <!-- Gold Top Bar -->
        <rect class="fade-in-element gold-bar" x="155" y="40" width="190" height="12" fill="#C9A84C"/>
        
        <!-- Gold Borders -->
        <line class="fade-in-element gold-border" x1="155" y1="40" x2="155" y2="220" stroke="#C9A84C" stroke-width="2.5"/>
        <line class="fade-in-element gold-border" x1="345" y1="40" x2="345" y2="220" stroke="#C9A84C" stroke-width="2.5"/>

        <!-- T Letter -->
        <text class="fade-in-down-element letter-t" x="250" y="245" text-anchor="middle" fill="white" font-size="130" font-weight="700" font-family="'Playfair Display', serif">T</text>

        <!-- Gold Arc -->
        <path class="draw-path gold-arc" d="M178,278 Q250,308 322,278" stroke="#C9A84C" stroke-width="3" fill="none"/>

        <!-- TRESAS -->
        <text class="fade-in-element text-tresas" x="250" y="410" text-anchor="middle" fill="white" font-size="46" font-weight="700" font-family="'Playfair Display', serif" letter-spacing="6">TRESAS</text>

        <!-- Gold Lines beside TRESAS -->
        <line class="fade-in-element gold-line-side" x1="155" y1="418" x2="210" y2="418" stroke="#C9A84C" stroke-width="1.8"/>
        <line class="fade-in-element gold-line-side" x1="290" y1="418" x2="345" y2="418" stroke="#C9A84C" stroke-width="1.8"/>

        <!-- MATRICULATION SCHOOL -->
        <text class="fade-in-element text-school" x="250" y="438" text-anchor="middle" fill="white" font-size="13" font-weight="700" letter-spacing="4" font-family="'Montserrat', sans-serif">MATRICULATION</text>
        <text class="fade-in-element text-school" x="250" y="456" text-anchor="middle" fill="white" font-size="13" font-weight="700" letter-spacing="4" font-family="'Montserrat', sans-serif">SCHOOL</text>

        <!-- Location -->
        <text class="fade-in-element text-location" x="250" y="478" text-anchor="middle" fill="#C9A84C" font-size="12" font-family="'Montserrat', sans-serif" letter-spacing="1">Nagercoil · Tamil Nadu</text>
      </svg>
      
      <!-- Loading Bar -->
      <div class="loading-bar-container">
        <div class="loading-bar-progress"></div>
      </div>
    </div>
  </div>"""

splash_css = """
/* Cinematic Splash Screen */
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f2044;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s;
}

body.is-loaded .splash-screen {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.splash-content {
  text-align: center;
  width: 100%;
  max-width: 500px;
  padding: 40px;
}

.splash-logo {
  width: 100%;
  height: auto;
  max-width: 320px;
  margin-bottom: 35px;
  overflow: visible;
}

/* Logo Animations */
.draw-path {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawStroke 1.5s forwards cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}

.fade-in-element {
  opacity: 0;
  animation: fadeInElement 0.8s forwards ease-out;
}

@keyframes fadeInElement {
  to { opacity: 1; }
}

.fade-in-down-element {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDownElement 0.8s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes fadeInDownElement {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animation Delays */
.shield-outline { animation-delay: 0.1s; }
.gold-bar { animation-delay: 0.6s; }
.gold-border { animation-delay: 0.6s; }
.letter-t { animation-delay: 0.9s; }
.gold-arc { animation-delay: 1.1s; }
.text-tresas { animation-delay: 1.3s; }
.gold-line-side { animation-delay: 1.3s; }
.text-school { animation-delay: 1.5s; }
.text-location { animation-delay: 1.7s; }

/* Loading Bar */
.loading-bar-container {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 auto;
  overflow: hidden;
  border-radius: 4px;
}

.loading-bar-progress {
  width: 0%;
  height: 100%;
  background: #C9A84C;
  animation: fillBar 1.2s forwards cubic-bezier(0.645, 0.045, 0.355, 1);
  animation-delay: 1.8s;
}

@keyframes fillBar {
  to { width: 100%; }
}

/* Immediate load if already seen */
body.is-loaded-immediate .splash-screen {
  display: none !important;
  transition: none !important;
}
"""

def update_files():
    # Update HTML files
    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove old loader
            content = re.sub(r'<div class="page-loader".*?</div>', splash_html, content, flags=re.DOTALL)
            
            # Ensure it's inside body
            if 'splash-screen' not in content:
                 content = content.replace('<body>', '<body>\n' + splash_html)

            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename}")

    # Update CSS file
    with open('styles.css', 'a', encoding='utf-8') as f:
        f.write(splash_css)
    print("Updated styles.css")

if __name__ == "__main__":
    update_files()
