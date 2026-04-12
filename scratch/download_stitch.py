import json
import os
import requests
import re

def sanitize_filename(name):
    return re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')

def download():
    json_path = r'C:\Users\zewan\.gemini\antigravity\brain\521ccf8c-5673-4cfc-9ce6-846290497d25\.system_generated\steps\40\output.txt'
    output_dir = 'stitch'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    screens = data.get('screens', [])
    
    # Filter for named screens (excluding 'Untitled Prototype')
    named_screens = [s for s in screens if s.get('title') != 'Untitled Prototype']
    print(f"Found {len(named_screens)} named screens out of {len(screens)} total.")
    
    counts = {}
    
    for screen in named_screens:
        title = screen.get('title', 'Unknown')
        base_name = sanitize_filename(title)
        
        # Handle duplicates
        if base_name in counts:
            counts[base_name] += 1
            filename = f"{base_name}_{counts[base_name]}.html"
        else:
            counts[base_name] = 1
            filename = f"{base_name}.html"
            
        url = screen.get('htmlCode', {}).get('downloadUrl')
        
        if url:
            print(f"Downloading {title}...")
            try:
                response = requests.get(url)
                if response.status_code == 200:
                    with open(os.path.join(output_dir, filename), 'w', encoding='utf-8') as out:
                        out.write(response.text)
                    print(f"Saved to {filename}")
                else:
                    print(f"Failed to download {title}: Status {response.status_code}")
            except Exception as e:
                print(f"Error downloading {title}: {str(e)}")

if __name__ == "__main__":
    download()
