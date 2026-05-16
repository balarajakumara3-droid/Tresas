import os

splash_html = """  <!-- Cinematic Splash Screen (Landing Page Only) -->
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

        <!-- MATRICULATION SCHOOL -->
        <text class="fade-in-element text-school" x="250" y="438" text-anchor="middle" fill="white" font-size="13" font-weight="700" letter-spacing="4" font-family="'Montserrat', sans-serif">MATRICULATION SCHOOL</text>

        <!-- Location -->
        <text class="fade-in-element text-location" x="250" y="468" text-anchor="middle" fill="#C9A84C" font-size="12" font-family="'Montserrat', sans-serif" letter-spacing="1">Nagercoil · Tamil Nadu</text>
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
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f2044 !important; /* Forces dark navy */
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), visibility 1s;
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

/* 1. Shield Outline - 0.5s */
.draw-path {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawStroke 0.5s forwards ease-in-out;
}

@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}

/* Basic fade element */
.fade-in-element {
  opacity: 0;
  animation: fadeInElement 0.5s forwards ease-out;
}

@keyframes fadeInElement {
  to { opacity: 1; }
}

/* 2. Gold Top Border - 0.8s */
.gold-bar { animation-delay: 0.8s; }
.gold-border { animation-delay: 0.8s; }

/* 3. T Letter - 1s */
.fade-in-down-element {
  opacity: 0;
  transform: translateY(-20px);
  animation: fadeInDownElement 0.5s forwards ease-out;
}

@keyframes fadeInDownElement {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.letter-t { animation-delay: 1.0s; }

/* 4. Gold Curved Line - 1.2s */
.gold-arc {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: drawStroke 0.5s forwards ease-in-out;
  animation-delay: 1.2s;
}

/* 5. TRESAS text - 1.4s */
.text-tresas { animation-delay: 1.4s; }

/* 6. MATRICULATION SCHOOL - 1.6s */
.text-school { animation-delay: 1.6s; }

/* 7. Nagercoil - 1.8s */
.text-location { animation-delay: 1.8s; }

/* 8. Gold loading bar - 2s */
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
  animation: fillBar 1.5s forwards ease-in-out;
  animation-delay: 2.0s;
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

def apply():
    # 1. Update index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    if '<div class="splash-screen"' not in html:
        # Insert right after <body>
        html = html.replace('<body>', f'<body>\n{splash_html}')
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
    # 2. Update styles.css
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
        
    if '.splash-screen {' not in css:
        with open('styles.css', 'a', encoding='utf-8') as f:
            f.write(f'\n{splash_css}\n')
            
    # 3. Update script.js for 3 second delay
    with open('script.js', 'r', encoding='utf-8') as f:
        js = f.read()
        
    js = js.replace('}, 650);', '}, 3500);') # 3.5s total to let the bar finish
    
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)

if __name__ == '__main__':
    apply()
