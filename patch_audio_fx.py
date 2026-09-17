import sys

path = r"f:\Spiral Tube\src\content\pages\watch\player\media-effects\equaliser\modules\audio-fx.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace connectOut and add the master level balancer
target_search = """        this.fxInput.disconnect();
        this._cleanupFX();

        const connectOut = (lastNode) => {"""

replacement = """        this.fxInput.disconnect();
        this._cleanupFX();

        // --- MASTER LEVEL BALANCER ---
        const fxTarget = this.ctx.createGain();
        const effectGains = {
            'radio': 0.8,
            'demonic': 0.35,
            'vader': 0.45,
            'robot': 0.45,
            'astronaut': 0.4,
            'alien': 0.6,
            'dream': 0.6,
            'witness': 0.4,
            'telephone': 0.4,
            'ghost': 0.4,
            'bee': 0.5,
            'sulfux': 0.3,
            'deep': 0.5,
            'zombie': 0.4,
            'mask': 0.8,
            'helmet': 0.8,
            'child': 0.7,
            'ethereal': 0.7,
            'tv_static': 0.45,
            'walkie_talkie': 0.4,
            'autotune': 0.5,
            'cyberpunk': 0.4,
            'stadium': 0.7,
            'cathedral': 0.7,
            'empty_room': 0.8,
            'far_away': 0.8,
            'helium': 0.8,
            'chipmunk': 0.8,
            'whisper': 0.8,
            'adam': 0.8,
        };
        fxTarget.gain.value = effectGains[effectName] || 1.0;
        fxTarget.connect(this.fxOutput);
        this._fxNodes.push(fxTarget);

        const connectOut = (lastNode) => {"""

if target_search in content:
    content = content.replace(target_search, replacement)
else:
    print("Could not find target_search")
    sys.exit(1)

# Now replace all `this.fxOutput` with `fxTarget` ONLY within the if/else block (after connectBackground)
# We split the file into before the if block, and the if block
parts = content.split("        if (effectName === 'radio') {")
if len(parts) == 2:
    parts[1] = parts[1].replace("this.fxOutput", "fxTarget")
    content = parts[0] + "        if (effectName === 'radio') {" + parts[1]
else:
    print("Could not find radio block")
    sys.exit(1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Patched audio-fx.js")
