import os
import re
import shutil
import glob

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

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
abs_moves = {
    normalize_path(os.path.join(BASE_DIR, k)): normalize_path(os.path.join(BASE_DIR, v))
    for k, v in MOVES.items()
}

# In a second pass, since the files are already moved, 
# old_path = new_path. So target_abs will be calculated from the old string in the import, 
# but we need to map the string in the import to the new location.
# Wait, if target_abs is calculated based on the file's current location,
# if the file says `import './core/error-handler.js'`, resolving it from `src/content/` gives `src/content/core/error-handler.js`.
# We need to map `src/content/core/error-handler.js` to `src/content/core/system/error-handler.js`.
# BUT, `abs_moves` maps old absolute path to new absolute path. So we just use `abs_moves.get(target_abs, target_abs)`!
# Yes!

def get_new_path(old_path):
    old_path = normalize_path(old_path)
    return abs_moves.get(old_path, old_path)

# Updated Regex to handle `import '...'` and `import { ... } from '...'`
import_regex = re.compile(r'((?:import|export)(?:\s+.*?from)?\s+[\'"])(.+?)([\'"])', re.MULTILINE)
dynamic_import_regex = re.compile(r'(import\s*\(\s*[\'"])(.+?)([\'"]\s*\))', re.MULTILINE)

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    # Files are already in their NEW locations because the first run moved them.
    # So `filepath` is the NEW location.
    # But wait, what if the first run moved them, but the imports weren't updated?
    # The imports still point to the OLD paths!
    # e.g., in `index.ts`, it says `import './core/error-handler.js'`.
    # `index.ts` was NOT moved. So `old_dir` = `new_dir` = `src/content`.
    # `target_abs` = `src/content/core/error-handler.js`.
    # `target_new` = `abs_moves.get(target_abs)`.
    # `new_rel_target` = `os.path.relpath(target_new, new_dir)`.
    # This works perfectly!
    
    # What if a file WAS moved? e.g., `src/content/features/base-feature.js` moved to `src/content/core/system/base-feature.js`.
    # In its content, it has `import { EventBus } from '../core/event-bus.js'`.
    # The first run DID update this because it had `from`.
    # But if there are any `import '../something.js'`, they weren't updated.
    # If we run again, `filepath` is `src/content/core/system/base-feature.js`.
    # The old `target_abs` WOULD have been calculated from `src/content/features/`!
    # If we calculate it from `src/content/core/system/` (the new dir), `../core/event-bus.js` points to `src/content/core/core/event-bus.js`, which is wrong!
    
    # So, we need to know the OLD location of the CURRENT file to calculate `target_abs` correctly!
    
    # Let's map new absolute paths BACK to old absolute paths.
    new_to_old = {v: k for k, v in abs_moves.items()}
    
    new_filepath = normalize_path(filepath)
    old_filepath = new_to_old.get(new_filepath, new_filepath)
    
    old_dir = os.path.dirname(old_filepath)
    new_dir = os.path.dirname(new_filepath)
    
    modified = False

    def replacer(match):
        nonlocal modified
        prefix = match.group(1)
        rel_target = match.group(2)
        suffix = match.group(3)
        
        if not rel_target.startswith('.'):
            return match.group(0)
            
        # Absolute path of the target file BEFORE moving
        target_abs = normalize_path(os.path.join(old_dir, rel_target))
        
        # What is the target's NEW path?
        target_new = get_new_path(target_abs)
        
        # Calculate new relative path from the current file's NEW location
        new_rel_target = os.path.relpath(target_new, new_dir)
        new_rel_target = normalize_path(new_rel_target)
        
        if not new_rel_target.startswith('.'):
            new_rel_target = './' + new_rel_target
            
        if rel_target != new_rel_target:
            modified = True
            return f"{prefix}{new_rel_target}{suffix}"
        
        return match.group(0)
        
    new_content = import_regex.sub(replacer, content)
    new_content = dynamic_import_regex.sub(replacer, new_content)
    
    if modified:
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

if __name__ == '__main__':
    main()
