export class NotePanel {
    constructor(parent) {
        this.parent = parent;
        this.notesPanel = null;
        this.notesList = null;
    }

    async injectNotePanel() {
        const existing = document.getElementById('ypp-study-notes');
        if (existing) {
            existing.remove();
        }

        this.notesPanel = document.createElement('div');
        this.notesPanel.id = 'ypp-study-notes';
        this.notesPanel.style.cssText = `
            position: sticky;
            top: 80px;
            height: calc(100vh - 120px);
            min-height: 500px;
            background: rgba(25, 25, 30, 0.7);
            backdrop-filter: blur(20px) saturate(150%);
            -webkit-backdrop-filter: blur(20px) saturate(150%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            z-index: 5000;
            display: flex;
            flex-direction: column;
            color: #fff;
            font-family: 'Inter', Roboto, sans-serif;
            transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.3s ease;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); border-radius: 16px 16px 0 0;';
        
        const title = document.createElement('div');
        title.innerHTML = '📝 <b>Study Notes</b>';
        title.style.fontSize = '15px';
        
        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export';
        exportBtn.style.cssText = 'background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s;';
        exportBtn.onmouseover = () => exportBtn.style.background = 'rgba(255,255,255,0.2)';
        exportBtn.onmouseout = () => exportBtn.style.background = 'rgba(255,255,255,0.1)';
        exportBtn.onclick = () => this.exportNotes();

        header.appendChild(title);
        header.appendChild(exportBtn);
        this.notesPanel.appendChild(header);

        this.notesList = document.createElement('div');
        this.notesList.style.cssText = 'flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; scroll-behavior: smooth;';
        this.notesPanel.appendChild(this.notesList);

        const lookupContainer = document.createElement('div');
        lookupContainer.style.cssText = 'padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.1); display: flex; gap: 8px;';
        
        const lookupInput = document.createElement('input');
        lookupInput.placeholder = 'Wikipedia Lookup...';
        lookupInput.style.cssText = 'flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; padding: 8px 12px; font-size: 13px; outline: none; transition: border-color 0.2s;';
        lookupInput.onfocus = () => lookupInput.style.borderColor = 'rgba(62,166,255,0.5)';
        lookupInput.onblur = () => lookupInput.style.borderColor = 'rgba(255,255,255,0.1)';
        
        const lookupResult = document.createElement('div');
        lookupResult.style.cssText = 'display: none; padding: 12px 16px; font-size: 13px; color: #ccc; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); max-height: 150px; overflow-y: auto; line-height: 1.5;';
        
        lookupInput.onkeydown = async (e) => {
            if (e.key === 'Enter') {
                const query = lookupInput.value.trim();
                if (!query) return;
                lookupResult.style.display = 'block';
                lookupResult.innerHTML = '<span style="color: #3ea6ff;">Searching...</span>';
                try {
                    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                    const data = await res.json();
                    if (data.extract) {
                        lookupResult.innerHTML = `<b>${data.title}</b><br/>${data.extract}`;
                    } else {
                        lookupResult.innerHTML = '<i>No exact match found.</i>';
                    }
                } catch (err) {
                    lookupResult.innerHTML = '<i>Error fetching lookup.</i>';
                }
            }
        };

        lookupContainer.appendChild(lookupInput);
        this.notesPanel.appendChild(lookupContainer);
        this.notesPanel.appendChild(lookupResult);

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'padding: 16px; border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); border-radius: 0 0 16px 16px;';
        
        const input = document.createElement('textarea');
        input.placeholder = 'Type a note and press Enter...';
        input.style.cssText = 'width: 100%; height: 60px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 10px; resize: none; font-family: inherit; font-size: 13px; outline: none; box-sizing: border-box; transition: border-color 0.2s;';
        input.onfocus = () => input.style.borderColor = 'rgba(62,166,255,0.5)';
        input.onblur = () => input.style.borderColor = 'rgba(255,255,255,0.1)';
        
        this.parent.addListener(input, 'keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const text = input.value.trim();
                if (text) {
                    this._addNote(text);
                    input.value = '';
                }
            }
        });

        inputContainer.appendChild(input);
        this.notesPanel.appendChild(inputContainer);

        try {
            const secondary = await this.parent.waitForElement('#secondary', 5000);
            if (secondary && secondary.parentNode) {
                secondary.parentNode.insertBefore(this.notesPanel, secondary.nextSibling);
            } else {
                throw new Error('Sidebar container not found');
            }
        } catch (error) {
            this.notesPanel.style.position = 'fixed';
            this.notesPanel.style.top = '80px';
            this.notesPanel.style.right = '24px';
            this.notesPanel.style.width = '340px';
            this.notesPanel.style.zIndex = '5000';
            document.body.appendChild(this.notesPanel);
        }

        this.loadNotes();
    }

    removeNotePanel() {
        if (this.notesPanel) {
            this.notesPanel.remove();
            this.notesPanel = null;
        }
    }

    async loadNotes() {
        if (!this.notesList) return;
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        this.notesList.innerHTML = '';
        try {
            const data = await window.YPP.StorageManager.get(`notes_${videoId}`);
            const notes = data || [];
            notes.forEach(note => this._renderNote(note));
        } catch (error) {
            this.parent.utils?.log('Failed to load notes', 'STUDY', 'error');
        }
    }

    async _addNote(text) {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        const video = document.querySelector('video');
        const timestamp = video ? Math.floor(video.currentTime) : 0;

        const note = {
            id: Date.now().toString(),
            text: text,
            timestamp: timestamp,
            formattedTime: this.parent.sessionTimerManager._formatTime(timestamp)
        };

        this._renderNote(note);

        try {
            const data = await window.YPP.StorageManager.get(`notes_${videoId}`);
            const notes = data || [];
            notes.push(note);
            await window.YPP.StorageManager.set(`notes_${videoId}`, notes);
        } catch (error) {
            this.parent.utils?.log('Failed to save note', 'STUDY', 'error');
        }
    }

    _renderNote(note) {
        if (!this.notesList) return;

        const el = document.createElement('div');
        el.style.cssText = 'background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border-left: 3px solid #3ea6ff; font-size: 13px; word-break: break-word;';
        
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 4px;';
        
        const timeBtn = document.createElement('button');
        timeBtn.textContent = note.formattedTime;
        timeBtn.style.cssText = 'background: rgba(62,166,255,0.1); border: none; color: #3ea6ff; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-family: inherit; font-size: 11px; font-weight: bold; transition: background 0.2s;';
        timeBtn.onmouseover = () => timeBtn.style.background = 'rgba(62,166,255,0.2)';
        timeBtn.onmouseout = () => timeBtn.style.background = 'rgba(62,166,255,0.1)';
        timeBtn.onclick = () => {
            const video = document.querySelector('video');
            if (video) video.currentTime = note.timestamp;
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = "Delete Note";
        deleteBtn.style.cssText = 'background: transparent; border: none; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; padding: 0;';
        deleteBtn.onmouseover = () => deleteBtn.style.opacity = '1';
        deleteBtn.onmouseout = () => deleteBtn.style.opacity = '0.5';
        deleteBtn.onclick = () => this._deleteNote(note.id, el);

        header.appendChild(timeBtn);
        header.appendChild(deleteBtn);
        
        const content = document.createElement('div');
        content.textContent = note.text;
        content.style.lineHeight = '1.4';
        content.style.marginTop = '4px';

        el.appendChild(header);
        el.appendChild(content);
        
        this.notesList.appendChild(el);
        this.notesList.scrollTop = this.notesList.scrollHeight;
    }

    async _deleteNote(id, element) {
        if (!confirm('Delete this note?')) return;
        
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        try {
            const data = await window.YPP.StorageManager.get(`notes_${videoId}`);
            if (data) {
                const notes = data.filter(n => n.id !== id);
                await window.YPP.StorageManager.set(`notes_${videoId}`, notes);
                element.remove();
            }
        } catch (error) {
            this.parent.utils?.log('Failed to delete note', 'STUDY', 'error');
        }
    }

    async exportNotes() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;
        try {
            const data = await window.YPP.StorageManager.get(`notes_${videoId}`);
            if (!data || data.length === 0) {
                this.parent.utils?.createToast('No notes to export.');
                return;
            }
            
            const title = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent.trim() || 'Video';
            let md = `# Study Notes: ${title}\nURL: https://youtube.com/watch?v=${videoId}\n\n`;
            
            data.forEach(note => {
                md += `## [${note.formattedTime}](https://youtube.com/watch?v=${videoId}&t=${note.timestamp}s)\n${note.text}\n\n`;
            });

            const blob = new Blob([md], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Study_Notes_${videoId}.md`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.parent.utils?.createToast('Notes exported successfully.');
        } catch (e) {
            this.parent.utils?.createToast('Error exporting notes.');
        }
    }
}
