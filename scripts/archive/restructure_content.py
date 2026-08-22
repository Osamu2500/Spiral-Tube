import os
import re
import shutil
import glob

# Mapping of old paths (relative to repo root) to new paths
# Using forward slashes for cross-platform compatibility
MOVES = {
    'src/content/core/dom-api.js': 'src/content/core/dom/dom-api.js',
    'src/content/core/dom-observer.js': 'src/content/core/dom/dom-observer.js',
    'src/content/core/element-cache.js': 'src/content/core/dom/element-cache.js',
    
    'src/content/core/event-bus.js': 'src/content/core/events/event-bus.js',
    'src/content/core/event-delegator.js': 'src/content/core/events/event-delegator.js',
    
    'src/content/core/error-handler.js': 'src/content/core/system/error-handler.js',
    'src/content/core/lifecycle-manager.js': 'src/content/core/system/lifecycle-manager.js',
    'src/content/core/storage-manager.js': 'src/content/core/system/storage-manager.js',
    'src/content/core/feature-manager.js': 'src/content/core/system/feature-manager.js',
    
    'src/content/features/base-feature.js': 'src/content/core/system/base-feature.js',
    
    'src/content/ui/ui-manager.js': 'src/content/ui/managers/ui-manager.js'
}

def normalize_path(p):
    return os.path.normpath(p).replace('\\', '/')

# Convert MOVES to use absolute paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
abs_moves = {
    normalize_path(os.path.join(BASE_DIR, k)): normalize_path(os.path.join(BASE_DIR, v))
    for k, v in MOVES.items()
}

def get_new_path(old_path):
    old_path = normalize_path(old_path)
    return abs_moves.get(old_path, old_path)

# Regex to find ES6 imports/exports
import_regex = re.compile(r'((?:import|export)\s+.*?from\s+[\'"])(.+?)([\'"])', re.MULTILINE)
dynamic_import_regex = re.compile(r'(import\s*\(\s*[\'"])(.+?)([\'"]\s*\))', re.MULTILINE)

def process_file(filepath):
    # Read content
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    old_filepath = normalize_path(filepath)
    new_filepath = get_new_path(old_filepath)
    
    old_dir = os.path.dirname(old_filepath)
    new_dir = os.path.dirname(new_filepath)
    
    modified = False

    def replacer(match):
        nonlocal modified
        prefix = match.group(1)
        rel_target = match.group(2)
        suffix = match.group(3)
        
        # Only process relative imports
        if not rel_target.startswith('.'):
            return match.group(0)
            
        # Absolute path of the target file BEFORE moving
        target_abs = normalize_path(os.path.join(old_dir, rel_target))
        
        # What is the target's NEW path?
        target_new = get_new_path(target_abs)
        
        # Calculate new relative path from the current file's NEW location
        new_rel_target = os.path.relpath(target_new, new_dir)
        new_rel_target = normalize_path(new_rel_target)
        
        # Ensure it starts with ./ or ../
        if not new_rel_target.startswith('.'):
            new_rel_target = './' + new_rel_target
            
        if rel_target != new_rel_target:
            modified = True
            return f"{prefix}{new_rel_target}{suffix}"
        
        return match.group(0)
        
    new_content = import_regex.sub(replacer, content)
    new_content = dynamic_import_regex.sub(replacer, new_content)
    
    # Save the updated content
    # If the file is moving, save it to the new path and delete the old one
    if new_filepath != old_filepath:
        os.makedirs(new_dir, exist_ok=True)
        with open(new_filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        os.remove(old_filepath)
        print(f"Moved and updated: {os.path.relpath(old_filepath, BASE_DIR)} -> {os.path.relpath(new_filepath, BASE_DIR)}")
    elif modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated imports: {os.path.relpath(filepath, BASE_DIR)}")

def main():
    search_pattern = os.path.join(BASE_DIR, 'src', '**', '*.[jt]s')
    all_files = glob.glob(search_pattern, recursive=True)
    
    for f in all_files:
        if 'node_modules' in f or 'dist' in f:
            continue
        process_file(f)
        
    # Delete utils if empty
    utils_dir = os.path.join(BASE_DIR, 'src', 'content', 'utils')
    if os.path.exists(utils_dir) and not os.listdir(utils_dir):
        os.rmdir(utils_dir)
        print("Deleted empty directory: src/content/utils")

if __name__ == '__main__':
    main()
