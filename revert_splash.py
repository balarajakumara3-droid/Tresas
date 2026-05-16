import os
import re

simple_loader_html = """  <div class="page-loader" aria-label="Loading Tresas Matriculation School">
    <img src="tresas_logo_option2_fixed.svg" alt="" aria-hidden="true">
    <span></span>
  </div>"""

simple_loader_css = """
/* Final polish: corrected navigation, logo sizing, landing page, loader */
.page-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  gap: 18px;
  align-content: center;
  background: #fffdf8;
  transition: opacity 500ms ease, visibility 500ms ease;
}

.page-loader img {
  width: 112px;
  height: 112px;
  object-fit: contain;
  animation: loaderRise 900ms ease both;
}

.page-loader span {
  width: 164px;
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: #eadfca;
}

.page-loader span::before {
  content: "";
  display: block;
  width: 44%;
  height: 100%;
  border-radius: inherit;
  background: var(--gold);
  animation: loaderTrack 1.1s ease-in-out infinite;
}

body.is-loaded .page-loader {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

body.is-loaded-immediate .page-loader {
  display: none !important;
  transition: none !important;
}

@keyframes loaderRise {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes loaderTrack {
  0% { transform: translateX(-110%); }
  100% { transform: translateX(260%); }
}
"""

def restore_loader():
    # Update HTML files
    for filename in ['index.html', 'about.html', 'contact.html']:
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove cinematic splash screen
            content = re.sub(r'<!-- Premium Splash Screen -->.*?</div>\s*</div>\s*</div>', simple_loader_html, content, flags=re.DOTALL)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Restored loader in {filename}")
        except Exception as e:
            print(f"Error in {filename}: {e}")

    # Update CSS file
    try:
        with open('styles.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        # Remove cinematic splash screen CSS
        # First, find where it starts
        if '/* Cinematic Splash Screen */' in css_content:
            css_content = re.sub(r'/\* Cinematic Splash Screen \*/.*?(?=/\* Mobile Header & Footer Optimizations \*/)', simple_loader_css + '\n\n', css_content, flags=re.DOTALL)
            # Also remove the other instance if it exists (from my sed command)
            css_content = re.sub(r'/\* Cinematic Splash Screen \*/.*?visibility 0\.8s;\s*}', '', css_content, flags=re.DOTALL)

        with open('styles.css', 'w', encoding='utf-8') as f:
            f.write(css_content)
        print("Restored loader CSS in styles.css")
    except Exception as e:
        print(f"Error in styles.css: {e}")

    # Restore script.js finishLoading timing
    try:
        with open('script.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        js_content = js_content.replace('}, 3000);', '}, 650);')
        
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("Restored timing in script.js")
    except Exception as e:
        print(f"Error in script.js: {e}")

if __name__ == "__main__":
    restore_loader()
