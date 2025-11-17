// auto-save.js – runs automatically in every game
(() => {
    const BACKUP_KEY = "GLOBALWIDE_UNIVERSAL_BACKUP_v3";
    const CURRENT_DOMAIN = location.hostname;

    function exportAll() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('score') || key.includes('level') || key.includes('progress') || key.includes('save') || key.includes('game') || key.startsWith('globalwide') || key.startsWith('gwg_'))) {
                try { data[key] = localStorage.getItem(key); } catch(e) {}
            }
        }
        if (Object.keys(data).length === 0) return;

        const backup = { exportedAt: new Date().toISOString(), exportedFrom: CURRENT_DOMAIN, data };
        localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));

        if (!window.lastDownload || Date.now() - window.lastDownload > 120000) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'}));
            a.download = `My-Games-Backup-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            window.lastDownload = Date.now();
        }
    }

    function restoreIfNeeded() {
        try {
            const backup = JSON.parse(localStorage.getItem(BACKUP_KEY) || '{}');
            if (backup.exportedFrom && backup.exportedFrom !== CURRENT_DOMAIN && backup.data) {
                Object.entries(backup.data).forEach(([k, v]) => localStorage.setItem(k, v));
                if (!sessionStorage.getItem('gwg_restored')) {
                    setTimeout(() => alert("Your saves were automatically restored from the old site!"), 1000);
                    sessionStorage.setItem('gwg_restored', 'yes');
                }
            }
        } catch(e) {}
    }

    restoreIfNeeded();
    setInterval(exportAll, 15000);
    exportAll();
    window.addEventListener('pagehide', exportAll);
    window.addEventListener('beforeunload', exportAll);
})();
