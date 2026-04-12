import json
import os
import sys

def extract():
    with open(r'C:\Users\zewan\.gemini\antigravity\brain\521ccf8c-5673-4cfc-9ce6-846290497d25\.system_generated\steps\40\output.txt', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    screens = data.get('screens', [])
    for i, screen in enumerate(screens):
        title = screen.get('title', f'screen_{i}')
        # Sanitize title for filename
        filename = "".join([c if c.isalnum() or c in (' ', '-', '_') else '_' for c in title]).strip()
        if not filename:
            filename = f"screen_{i}"
        
        html_code = screen.get('htmlCode', {})
        url = html_code.get('downloadUrl')
        
        if url:
            print(f"{filename}|{url}")

if __name__ == "__main__":
    extract()
