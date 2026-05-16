import os

footer_content = open('footer.html').read()
floating_btn = '<a href="index.html#learning" class="float-admission">\n    Admission<br>2026-2027\n  </a>'

files = ['index.html', 'about.html', 'contact.html']

for filename in files:
    with open(filename, 'r') as f:
        content = f.read()
    
    # Replace footer
    import re
    # Match from <footer to </footer>
    new_content = re.sub(r'<footer.*?</footer>', footer_content, content, flags=re.DOTALL)
    
    # Replace floating button
    new_content = re.sub(r'<a href="admission\.html" class="float-admission">.*?</a>', floating_btn, new_content, flags=re.DOTALL)
    
    # Replace other admission links
    new_content = new_content.replace('href="admission.html"', 'href="index.html#learning"')
    
    with open(filename, 'w') as f:
        f.write(new_content)

print("Done updating footers and links.")
