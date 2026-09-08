(function() {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const KEYS = {
        files: 'playground_files',
        activeFile: 'playground_activeFile',
        theme: 'playground_theme',
        preview: 'playground_preview'
    };

    const isPreview = window.location.pathname.includes('preview.html');

    // ---------- TEMA ----------
    function loadTheme() {
        const saved = localStorage.getItem(KEYS.theme) || 'codexeron';
        document.body.className = 'theme-' + saved;
        const sel = $('#themeSelector');
        if (sel) sel.value = saved;
    }
    function setTheme(theme) {
        document.body.className = 'theme-' + theme;
        localStorage.setItem(KEYS.theme, theme);
        const sel = $('#themeSelector');
        if (sel) sel.value = theme;
    }

    // ---------- DEBOUNCE ----------
    function debounce(fn, delay = 300) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ---------- INDEX ----------
    if (!isPreview) {
        // DOM refs
        const fileTreeList = $('#fileTreeList');
        const codeEditor = $('#codeEditor');
        const lineNumbers = document.querySelector('.line-numbers');
        const statusBar = $('#statusBar');
        const autoSaveStatus = $('#autoSaveStatus');
        const previewFrame = $('#previewFrame');
        const consoleOutput = $('#consoleOutput');
        const networkOutput = $('#networkOutput');
        const performanceOutput = $('#performanceOutput');
        const pickerOutput = $('#pickerOutput');
        const panelTabs = $$('.panel-tab');
        const panels = {
            console: $('#consolePanel'),
            network: $('#networkPanel'),
            performance: $('#performancePanel'),
            picker: $('#pickerPanel')
        };
        const pickerCopyBtn = $('#pickerCopyBtn');
        const inspectBtn = $('#inspectToggle');
        const themeSelector = $('#themeSelector');

        // ----- Dosya YÃ¶netimi -----
        let files = [];
        let activeFileId = null;

        function loadFiles() {
            const saved = localStorage.getItem(KEYS.files);
            if (saved) {
                files = JSON.parse(saved);
            } else {
                files = [
                    { id: '1', name: 'index.html', type: 'html', content: '<h1>Merhaba DÃ¼nya</h1>' },
                    { id: '2', name: 'style.css', type: 'css', content: 'body { font-family: sans-serif; }' },
                    { id: '3', name: 'app.js', type: 'js', content: 'console.log("Merhaba!");' }
                ];
            }
            const active = localStorage.getItem(KEYS.activeFile);
            if (active && files.some(f => f.id === active)) {
                activeFileId = active;
            } else if (files.length > 0) {
                activeFileId = files[0].id;
            }
            renderFileTree();
            loadActiveFile();
        }

        function saveFiles() {
            localStorage.setItem(KEYS.files, JSON.stringify(files));
        }

        function renderFileTree() {
            fileTreeList.innerHTML = files.map(f =>
                `<div class="file-tree-item ${f.id === activeFileId ? 'active' : ''}" data-id="${f.id}">
                    <span class="file-name">${f.name}</span>
                    <button class="file-delete" data-id="${f.id}" title="Sil">Ã—</button>
                </div>`
            ).join('');

            fileTreeList.querySelectorAll('.file-tree-item').forEach(el => {
                el.addEventListener('click', function(e) {
                    if (e.target.classList.contains('file-delete')) return;
                    setActiveFile(this.dataset.id);
                });
            });
            fileTreeList.querySelectorAll('.file-delete').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    deleteFile(this.dataset.id);
                });
            });
        }

        function setActiveFile(id) {
            activeFileId = id;
            localStorage.setItem(KEYS.activeFile, id);
            renderFileTree();
            loadActiveFile();
        }

        function loadActiveFile() {
            const file = files.find(f => f.id === activeFileId);
            if (!file) {
                codeEditor.value = '';
                lineNumbers.textContent = '1\n';
                return;
            }
            codeEditor.value = file.content;
            updateLineNumbers();
            statusBar.textContent = `ğŸ“„ ${file.name}`;
        }

        function saveCurrentFile() {
            const file = files.find(f => f.id === activeFileId);
            if (!file) return;
            file.content = codeEditor.value;
            saveFiles();
            autoSaveStatus.textContent = 'Auto Save â—';
            statusBar.textContent = 'Saved';
            setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
        }

        function addNewFile() {
            const name = prompt('Dosya adÄ± (Ã¶rn. main.js):');
            if (!name) return;
            const ext = name.split('.').pop().toLowerCase();
            const typeMap = { html: 'html', css: 'css', js: 'js', txt: 'text' };
            const type = typeMap[ext] || 'text';
            const newFile = {
                id: Date.now().toString(),
                name: name,
                type: type,
                content: type === 'html' ? '<h1>Yeni Dosya</h1>' :
                         type === 'css' ? '/* CSS */' :
                         type === 'js' ? '// JavaScript' : ''
            };
            files.push(newFile);
            saveFiles();
            setActiveFile(newFile.id);
        }

        function deleteFile(id) {
            if (files.length <= 1) {
                alert('En az bir dosya olmalÄ±.');
                return;
            }
            if (!confirm('Bu dosyayÄ± silmek istediÄŸinize emin misiniz?')) return;
            files = files.filter(f => f.id !== id);
            if (activeFileId === id) {
                activeFileId = files[0].id;
                localStorage.setItem(KEYS.activeFile, activeFileId);
            }
            saveFiles();
            renderFileTree();
            loadActiveFile();
        }

        // ----- Editor helpers -----
        function updateLineNumbers() {
            const lines = codeEditor.value.split('\n').length;
            let nums = '';
            for (let i = 1; i <= lines; i++) nums += i + '\n';
            lineNumbers.textContent = nums;
            lineNumbers.scrollTop = codeEditor.scrollTop;
        }

        codeEditor.addEventListener('scroll', function() {
            lineNumbers.scrollTop = this.scrollTop;
        });

        codeEditor.addEventListener('input', function() {
            updateLineNumbers();
            saveCurrentFile();
            debouncedUpdatePreview();
        });

        codeEditor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = start + 2;
                this.dispatchEvent(new Event('input'));
            }
        });

        // ----- Build Preview -----
        function buildFullDoc() {
            const htmlFile = files.find(f => f.name.endsWith('.html'));
            const cssFile = files.find(f => f.name.endsWith('.css'));
            const jsFile = files.find(f => f.name.endsWith('.js'));

            const html = htmlFile ? htmlFile.content : '';
            const css = cssFile ? cssFile.content : '';
            const js = jsFile ? jsFile.content : '';

            const script = `
            <script>
                (function() {
                    let pickerActive = false;

                    window.addEventListener('message', function(e) {
                        if (e.data && e.data.type === 'setPicker') {
                            pickerActive = e.data.value;
                        }
                    });

                    const originalLog = console.log;
                    const originalError = console.error;
                    const originalWarn = console.warn;
                    console.log = function(...args) {
                        originalLog.apply(console, args);
                        window.parent.postMessage({type: 'console', data: args}, '*');
                    };
                    console.error = function(...args) {
                        originalError.apply(console, args);
                        window.parent.postMessage({type: 'console', data: args}, '*');
                    };
                    console.warn = function(...args) {
                        originalWarn.apply(console, args);
                        window.parent.postMessage({type: 'console', data: args}, '*');
                    };
                    window.onerror = function(message, source, lineno, colno, error) {
                        window.parent.postMessage({type: 'console', data: ['Error: ' + message]}, '*');
                        return false;
                    };

                    document.addEventListener('click', function(e) {
                        if (pickerActive) {
                            const target = e.target;
                            const selector = getSelector(target);
                            const info = {
                                tag: target.tagName.toLowerCase(),
                                id: target.id || '',
                                classes: target.className || '',
                                selector: selector,
                                innerText: target.innerText?.substring(0, 100) || '',
                                outerHTML: target.outerHTML.substring(0, 300)
                            };
                            window.parent.postMessage({type: 'picker', data: info}, '*');
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }, true);

                    function getSelector(el) {
                        if (el.id) return '#' + el.id;
                        if (el.className && typeof el.className === 'string') {
                            const cls = el.className.split(' ').filter(c => c).join('.');
                            if (cls) return el.tagName.toLowerCase() + '.' + cls;
                        }
                        let path = [];
                        while (el && el.tagName) {
                            let selector = el.tagName.toLowerCase();
                            if (el.id) {
                                selector += '#' + el.id;
                                path.unshift(selector);
                                break;
                            }
                            if (el.className && typeof el.className === 'string') {
                                const cls = el.className.split(' ').filter(c => c).join('.');
                                if (cls) selector += '.' + cls;
                            }
                            path.unshift(selector);
                            el = el.parentNode;
                        }
                        return path.join(' > ');
                    }

                    const originalFetch = window.fetch;
                    window.fetch = function(...args) {
                        const start = performance.now();
                        return originalFetch.apply(this, args).then(res => {
                            const dur = Math.round(performance.now() - start);
                            const size = res.headers.get('content-length') || '?';
                            window.parent.postMessage({type: 'network', data: {
                                url: args[0],
                                method: 'GET',
                                status: res.status,
                                duration: dur,
                                size: size
                            }}, '*');
                            return res;
                        });
                    };

                    window.addEventListener('load', function() {
                        const perf = performance.getEntriesByType('navigation')[0];
                        if (perf) {
                            window.parent.postMessage({type: 'performance', data: {
                                domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
                                load: perf.loadEventEnd - perf.loadEventStart,
                                domInteractive: perf.domInteractive - perf.fetchStart,
                                total: perf.loadEventEnd - perf.fetchStart,
                                redirectCount: perf.redirectCount,
                                transferSize: perf.transferSize || '?'
                            }}, '*');
                        }
                    });
                })();
            <\/script>`;

            return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}<\/script>
    ${script}
</body>
</html>`;
        }

        // ----- Preview gÃ¼ncelleme -----
        let consoleMessages = [];
        let networkMessages = [];
        let performanceMetrics = null;
        let pickerData = null;
        let pickerMode = false;

        const updatePreview = function() {
            const doc = buildFullDoc();
            previewFrame.srcdoc = doc;
            localStorage.setItem(KEYS.preview, doc);
            consoleMessages = [];
            networkMessages = [];
            performanceMetrics = null;
            renderConsole();
            renderNetwork();
            renderPerformance();
        };
        const debouncedUpdatePreview = debounce(updatePreview, 300);

        // ----- PostMessage -----
        window.addEventListener('message', function(e) {
            const data = e.data;
            if (!data) return;

            if (data.type === 'console') {
                const args = data.data || [];
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
                consoleMessages.push({ type: 'log', msg });
                renderConsole();
            } else if (data.type === 'network') {
                networkMessages.push(data.data);
                renderNetwork();
            } else if (data.type === 'performance') {
                performanceMetrics = data.data;
                renderPerformance();
            } else if (data.type === 'picker') {
                pickerData = data.data;
                renderPicker();
                pickerCopyBtn.style.display = 'inline-block';
                navigateToElement(data.data);
            }
        });

        function renderConsole() {
            consoleOutput.innerHTML = consoleMessages.map(item =>
                `<div class="console-item ${item.type}">${item.msg}</div>`
            ).join('');
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }

        function renderNetwork() {
            networkOutput.innerHTML = networkMessages.map(item =>
                `<div class="network-item">
                    <span class="method">${item.method}</span>
                    <span class="url">${item.url}</span>
                    <span class="status ${item.status >= 200 && item.status < 400 ? 'success' : 'error'}">${item.status || '...'}</span>
                    <span class="duration">${item.duration || '?'}ms</span>
                    <span class="size">${item.size || '?'}B</span>
                </div>`
            ).join('');
            networkOutput.scrollTop = networkOutput.scrollHeight;
        }

        function renderPerformance() {
            if (!performanceMetrics) {
                performanceOutput.innerHTML = '<div class="performance-item"><span class="label">HenÃ¼z veri yok</span></div>';
                return;
            }
            const items = [
                { label: 'DOM Content Loaded', value: performanceMetrics.domContentLoaded + 'ms' },
                { label: 'Load Event', value: performanceMetrics.load + 'ms' },
                { label: 'DOM Interactive', value: performanceMetrics.domInteractive + 'ms' },
                { label: 'Toplam YÃ¼klenme', value: performanceMetrics.total + 'ms' },
                { label: 'YÃ¶nlendirme', value: performanceMetrics.redirectCount },
                { label: 'Transfer Boyutu', value: (performanceMetrics.transferSize / 1024).toFixed(2) + ' KB' }
            ];
            performanceOutput.innerHTML = items.map(item =>
                `<div class="performance-item">
                    <span class="label">${item.label}</span>
                    <span class="value">${item.value}</span>
                </div>`
            ).join('');
        }

        function renderPicker() {
            if (!pickerData) {
                pickerOutput.innerHTML = '<div class="picker-info">Bir Ã¶ÄŸe seÃ§mek iÃ§in Ã¶nizlemede tÄ±klayÄ±n.</div>';
                return;
            }
            pickerOutput.innerHTML = `
                <div class="picker-selector">${pickerData.selector}</div>
                <div class="picker-details">Tag: ${pickerData.tag} | ID: ${pickerData.id || '-'} | Class: ${pickerData.classes || '-'}</div>
                <div class="picker-details">Ä°Ã§erik: ${pickerData.innerText || '-'}</div>
            `;
        }

        // ----- Picker Navigasyon -----
        function navigateToElement(info) {
            const searchText = info.outerHTML || `<${info.tag}`;
            const htmlFile = files.find(f => f.name.endsWith('.html'));
            if (!htmlFile) {
                statusBar.textContent = 'HTML dosyasÄ± bulunamadÄ±';
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 2000);
                return;
            }
            const code = htmlFile.content;
            const lines = code.split('\n');
            let foundLine = -1;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(searchText.substring(0, 50))) {
                    foundLine = i + 1;
                    break;
                }
            }
            if (foundLine === -1) {
                const tagSearch = `<${info.tag}`;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes(tagSearch)) {
                        foundLine = i + 1;
                        break;
                    }
                }
            }
            if (foundLine > 0) {
                setActiveFile(htmlFile.id);
                const area = codeEditor;
                let pos = 0;
                for (let i = 0; i < foundLine - 1; i++) {
                    pos = code.indexOf('\n', pos) + 1;
                }
                area.focus();
                area.selectionStart = pos;
                area.selectionEnd = pos;
                const lineHeight = 18;
                area.scrollTop = (foundLine - 1) * lineHeight - 50;
                lineNumbers.scrollTop = area.scrollTop;
                statusBar.textContent = `SatÄ±r ${foundLine} (${htmlFile.name})`;
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 2000);
            } else {
                statusBar.textContent = 'Element kod iÃ§inde bulunamadÄ±';
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 2000);
            }
        }

        // ----- Picker Mode -----
        function togglePicker() {
            pickerMode = !pickerMode;
            inspectBtn.textContent = pickerMode ? 'ğŸ” Picker (AÃ§Ä±k)' : 'ğŸ” Picker';
            inspectBtn.style.background = pickerMode ? 'rgba(108,140,255,0.3)' : 'transparent';
            try {
                previewFrame.contentWindow.postMessage({ type: 'setPicker', value: pickerMode }, '*');
            } catch(e) {}
            if (!pickerMode) {
                pickerCopyBtn.style.display = 'none';
            }
        }
        inspectBtn.addEventListener('click', togglePicker);

        pickerCopyBtn.addEventListener('click', function() {
            if (pickerData && pickerData.selector) {
                navigator.clipboard.writeText(pickerData.selector).then(() => {
                    statusBar.textContent = 'Selector kopyalandÄ±!';
                    setTimeout(() => { statusBar.textContent = 'Ready'; }, 1500);
                }).catch(() => {
                    const area = document.createElement('textarea');
                    area.value = pickerData.selector;
                    document.body.appendChild(area);
                    area.select();
                    document.execCommand('copy');
                    document.body.removeChild(area);
                    statusBar.textContent = 'Selector kopyalandÄ±!';
                    setTimeout(() => { statusBar.textContent = 'Ready'; }, 1500);
                });
            }
        });

        // ----- Panel Tabs -----
        panelTabs.forEach(btn => {
            btn.addEventListener('click', function() {
                const panel = this.dataset.panel;
                panelTabs.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                Object.keys(panels).forEach(key => {
                    panels[key].style.display = (key === panel) ? 'block' : 'none';
                });
                if (panel === 'picker') renderPicker();
            });
        });

        // ----- Responsive (DÃœZELTÄ°LDÄ°) -----
        function setResponsive(size) {
            // Ã–nceki class'larÄ± temizle
            previewFrame.className = '';
            // Yeni class'Ä± ekle (CSS'deki stiller iÃ§in)
            previewFrame.classList.add(size);
            // DoÄŸrudan geniÅŸlik ayarla (CSS geÃ§ersiz olsa bile Ã§alÄ±ÅŸÄ±r)
            if (size === 'desktop') {
                previewFrame.style.width = '100%';
            } else if (size === 'tablet') {
                previewFrame.style.width = '768px';
            } else if (size === 'mobile') {
                previewFrame.style.width = '375px';
            }
        }
        $('#desktopBtn').addEventListener('click', () => setResponsive('desktop'));
        $('#tabletBtn').addEventListener('click', () => setResponsive('tablet'));
        $('#mobileBtn').addEventListener('click', () => setResponsive('mobile'));
        $('#refreshPreviewBtn').addEventListener('click', updatePreview);

        // ----- DiÄŸer Butonlar -----
        $('#addFileBtn').addEventListener('click', addNewFile);

        function openPreviewNewTab() {
            const doc = buildFullDoc();
            localStorage.setItem(KEYS.preview, doc);
            window.open('preview.html', '_blank');
            statusBar.textContent = 'Preview opened';
            setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
        }
        $('#previewBtn').addEventListener('click', openPreviewNewTab);
        $('#newTabBtn').addEventListener('click', openPreviewNewTab);

        $('#clearBtn').addEventListener('click', function() {
            if (confirm('TÃ¼m dosyalarÄ± temizlemek istediÄŸinize emin misiniz?')) {
                files = [
                    { id: '1', name: 'index.html', type: 'html', content: '<h1>Merhaba DÃ¼nya</h1>' },
                    { id: '2', name: 'style.css', type: 'css', content: 'body { font-family: sans-serif; }' },
                    { id: '3', name: 'app.js', type: 'js', content: 'console.log("Merhaba!");' }
                ];
                activeFileId = '1';
                saveFiles();
                localStorage.setItem(KEYS.activeFile, activeFileId);
                renderFileTree();
                loadActiveFile();
                updatePreview();
                statusBar.textContent = 'Temizlendi';
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
            }
        });

        $('#copyBtn').addEventListener('click', function() {
            const file = files.find(f => f.id === activeFileId);
            if (!file) return;
            navigator.clipboard.writeText(file.content).then(() => {
                statusBar.textContent = 'KopyalandÄ±!';
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
            }).catch(() => {
                codeEditor.select();
                document.execCommand('copy');
                statusBar.textContent = 'KopyalandÄ±!';
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
            });
        });

        $('#downloadBtn').addEventListener('click', function() {
            const full = buildFullDoc();
            const blob = new Blob([full], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'playground.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            statusBar.textContent = 'Ä°ndirildi!';
            setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
        });

        $('#fullscreenBtn').addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        // ----- Tema -----
        themeSelector.addEventListener('change', function() {
            setTheme(this.value);
        });

        // ----- Klavye -----
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                openPreviewNewTab();
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveCurrentFile();
                statusBar.textContent = 'Kaydedildi (Ctrl+S)';
                setTimeout(() => { statusBar.textContent = 'Ready'; }, 800);
            }
        });

        // ----- BaÅŸlat -----
        loadTheme();
        loadFiles();
        setTimeout(updatePreview, 200);
        window.addEventListener('beforeunload', saveCurrentFile);

        console.log('ğŸŸ¢ Web Playground (index) hazÄ±r.');
    }

    // ---------- PREVIEW (ayrÄ± sekme) ----------
    else {
        const frame = $('#previewFrame');
        const consoleOutput = $('#consoleOutput');
        const problemsOutput = $('#problemsOutput');
        const consoleContent = $('#consoleContent');
        const problemsContent = $('#problemsContent');
        const consoleTabs = $$('.console-tab');

        let consoleMessages = [];
        window.addEventListener('message', function(e) {
            const data = e.data;
            if (!data) return;
            if (data.type === 'console') {
                const args = data.data || [];
                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
                consoleMessages.push({ type: 'log', msg });
                consoleOutput.innerHTML = consoleMessages.map(item =>
                    `<div class="console-item ${item.type}">${item.msg}</div>`
                ).join('');
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            }
        });

        function loadPreview() {
            const code = localStorage.getItem(KEYS.preview);
            if (code) {
                frame.srcdoc = code;
            } else {
                frame.srcdoc = '<h1>Kod yok</h1>';
            }
        }

        loadPreview();

        function loadThemePreview() {
            const saved = localStorage.getItem(KEYS.theme) || 'codexeron';
            document.body.className = 'theme-' + saved;
        }
        loadThemePreview();

        // Butonlar
        $('#refreshBtn').addEventListener('click', loadPreview);
        $('#fullscreenBtn').addEventListener('click', function() {
            document.body.classList.toggle('preview-fullscreen');
            this.textContent = document.body.classList.contains('preview-fullscreen') ? 'â›¶ UI GÃ¶ster' : 'â›¶';
        });
        $('#themeToggle').addEventListener('click', function() {
            const themes = ['dark', 'light', 'dracula', 'monokai', 'solarized', 'codexeron'];
            const current = document.body.className.replace('theme-', '') || 'codexeron';
            const idx = themes.indexOf(current);
            const next = themes[(idx + 1) % themes.length];
            document.body.className = 'theme-' + next;
            localStorage.setItem(KEYS.theme, next);
        });

        // ----- Responsive Butonlar (DÃœZELTÄ°LDÄ°) -----
        const desktopBtn = $('#desktopBtn');
        const tabletBtn = $('#tabletBtn');
        const mobileBtn = $('#mobileBtn');

        function setPreviewSize(size) {
            // Ã–nceki class'larÄ± temizle
            frame.className = '';
            frame.classList.add(size);
            if (size === 'desktop') {
                frame.style.width = '100%';
            } else if (size === 'tablet') {
                frame.style.width = '768px';
            } else if (size === 'mobile') {
                frame.style.width = '375px';
            }
        }

        desktopBtn.addEventListener('click', () => setPreviewSize('desktop'));
        tabletBtn.addEventListener('click', () => setPreviewSize('tablet'));
        mobileBtn.addEventListener('click', () => setPreviewSize('mobile'));

        // ----- Console / Problems Sekmeleri -----
        consoleTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                consoleTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const target = this.dataset.consoletab;
                if (target === 'console') {
                    consoleContent.style.display = 'block';
                    problemsContent.style.display = 'none';
                } else if (target === 'problems') {
                    consoleContent.style.display = 'none';
                    problemsContent.style.display = 'block';
                }
            });
        });

        // Problems iÃ§in placeholder
        problemsOutput.innerHTML = '<div class="console-item log">HenÃ¼z problem yok.</div>';

        console.log('ğŸŸ¢ Web Playground (preview) hazÄ±r.');
    }

})();
