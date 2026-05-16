const userLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
const isSpanish = userLang.startsWith('es');
const currentLang = isSpanish ? 'es' : 'en';

const i18n = {
    en: {
        // HTML
        'xtream_api': 'Xtream API',
        'm3u_playlist': 'M3U Playlist',
        'server_url': 'Server URL',
        'username': 'Username',
        'password': 'Password',
        'login': 'Login',
        'or_upload_m3u': 'Or upload local M3U file',
        'upload_file': 'Upload File',
        'saved_playlists': 'Saved Playlists',
        'live_tv': 'Live TV',
        'movies': 'Movies',
        'series': 'Series',
        'settings': 'Settings',
        'search_placeholder': 'Search channels, movies...',
        'data_mgmt': 'Data Management',
        'clear_data': 'Clear All Saved Data',
        'clear_data_desc': 'This will remove all saved credentials and playlists from this device.',
        'account_mgmt': 'Account Management (Active Xtream)',
        'display_name': 'Display Name',
        'update_account': 'Update Account',
        'player_settings': 'Content & Player Settings',
        'show_adult': 'Show Adult Content',
        'show_adult_desc': 'Allow 18+ / Adult categories to be displayed.',
        'use_hls': 'Use HLS.js (Recommended)',
        'use_hls_desc': "Disable to use the browser's native video player (useful on some Smart TVs or Safari).",
        'close': 'Close',
        
        // JS Strings
        'loading_series': 'Loading Series Info...',
        'failed_series': 'Failed to load series episodes',
        'm3u_vod_unsupported': 'M3U specific VOD/Series not supported in this view',
        'all_items': 'All Items',
        'fetching_movies': 'Fetching Movies...',
        'fetching_series': 'Fetching Series...',
        'failed_fetch': 'Failed to fetch',
        'failed_content': 'Failed to fetch content data.',
        'downloading_m3u': 'Downloading M3U...',
        'failed_m3u': 'Failed to load M3U file.',
        'invalid_m3u': 'Invalid M3U format or no channels found.',
        'failed_read': 'Failed to read file.',
        'authenticating': 'Authenticating...',
        'invalid_creds': 'Invalid credentials or server URL.',
        'account_updated': 'Account details updated successfully!',
        'tv': 'TV',
        'season': 'Season',
        'episode': 'Episode',
        'no_episodes': 'No episodes found for this season.',
        'app_install': 'App Installation',
        'install_app': 'Install App',
        'install_desc': 'Install Nova IPTV as a native app on your device for a better experience.'
    },
    es: {
        // HTML
        'xtream_api': 'Xtream API',
        'm3u_playlist': 'Lista M3U',
        'server_url': 'URL del Servidor',
        'username': 'Usuario',
        'password': 'Contraseña',
        'login': 'Iniciar Sesión',
        'or_upload_m3u': 'O subir archivo M3U local',
        'upload_file': 'Subir Archivo',
        'saved_playlists': 'Listas Guardadas',
        'live_tv': 'TV en Vivo',
        'movies': 'Películas',
        'series': 'Series',
        'settings': 'Ajustes',
        'search_placeholder': 'Buscar canales, películas...',
        'data_mgmt': 'Gestión de Datos',
        'clear_data': 'Borrar Todos los Datos',
        'clear_data_desc': 'Esto eliminará todas las credenciales y listas guardadas en este dispositivo.',
        'account_mgmt': 'Gestión de Cuenta (Xtream Activa)',
        'display_name': 'Nombre a Mostrar',
        'update_account': 'Actualizar Cuenta',
        'player_settings': 'Ajustes de Contenido y Reproductor',
        'show_adult': 'Mostrar Contenido para Adultos',
        'show_adult_desc': 'Permitir mostrar categorías para adultos / 18+.',
        'use_hls': 'Usar HLS.js (Recomendado)',
        'use_hls_desc': 'Desactivar para usar el reproductor de video nativo del navegador (útil en algunas Smart TV o Safari).',
        'close': 'Cerrar',
        
        // JS Strings
        'loading_series': 'Cargando información de serie...',
        'failed_series': 'Error al cargar los episodios de la serie',
        'm3u_vod_unsupported': 'Contenido VOD/Series de M3U no soportado en esta vista',
        'all_items': 'Todos',
        'fetching_movies': 'Obteniendo Películas...',
        'fetching_series': 'Obteniendo Series...',
        'failed_fetch': 'Error al obtener',
        'failed_content': 'Error al obtener datos de contenido.',
        'downloading_m3u': 'Descargando M3U...',
        'failed_m3u': 'Error al cargar el archivo M3U.',
        'invalid_m3u': 'Formato M3U inválido o sin canales.',
        'failed_read': 'Error al leer el archivo.',
        'authenticating': 'Autenticando...',
        'invalid_creds': 'Credenciales o URL del servidor inválidas.',
        'account_updated': '¡Detalles de la cuenta actualizados correctamente!',
        'tv': 'TV',
        'season': 'Temporada',
        'episode': 'Episodio',
        'no_episodes': 'No se encontraron episodios en esta temporada.',
        'app_install': 'Instalación de la App',
        'install_app': 'Instalar App',
        'install_desc': 'Instala Nova IPTV como una app nativa en tu dispositivo para una mejor experiencia.'
    }
};

function t(key) {
    return i18n[currentLang][key] || i18n['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = t(key);
        } else {
            // Some elements might have inner HTML elements like icons, so we only replace text nodes if possible,
            // or we structure HTML to have span[data-i18n].
            el.textContent = t(key);
        }
    });
}

// State Management
const state = {
    activePlaylist: null, // Current loaded playlist data
    playlists: [], // Saved playlists from localStorage
    currentView: 'live', // live, movies, series, settings
    settings: {
        forceHls: true,
        showAdult: false
    },
    player: null // HLS instance
};

// DOM Elements
const els = {
    loginScreen: document.getElementById('login-screen'),
    mainScreen: document.getElementById('main-screen'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    toast: document.getElementById('toast'),
    
    // Login
    tabs: document.querySelectorAll('.tab-btn'),
    forms: document.querySelectorAll('.login-form'),
    xtreamForm: document.getElementById('xtream-form'),
    m3uForm: document.getElementById('m3u-form'),
    m3uFile: document.getElementById('m3u-file'),
    savedContainer: document.getElementById('saved-playlists-container'),
    savedList: document.getElementById('saved-playlists-list'),

    // App Navigation
    navLinks: document.querySelectorAll('.nav-links li'),
    viewContainer: document.getElementById('view-container'),
    settingsContainer: document.getElementById('settings-container'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Content
    categoryList: document.getElementById('category-list'),
    categoryBackdrop: document.getElementById('category-backdrop'),
    itemsGrid: document.getElementById('items-grid'),
    searchInput: document.getElementById('search-input'),
    mobileCatBtn: document.getElementById('mobile-cat-btn'),

    // Settings
    clearDataBtn: document.getElementById('clear-data-btn'),
    forceHlsToggle: document.getElementById('force-hls-toggle'),
    adultToggle: document.getElementById('adult-content-toggle'),
    accountGroup: document.getElementById('account-management-group'),
    editAccountForm: document.getElementById('edit-account-form'),
    editName: document.getElementById('edit-name'),
    editUrl: document.getElementById('edit-url'),
    editUser: document.getElementById('edit-user'),
    editPass: document.getElementById('edit-pass'),
    
    // PWA Install
    installContainer: document.getElementById('install-container'),
    installBtn: document.getElementById('install-btn'),

    // Player
    playerOverlay: document.getElementById('player-overlay'),
    videoPlayer: document.getElementById('video-player'),
    closePlayerBtn: document.getElementById('close-player'),
    nowPlayingTitle: document.getElementById('now-playing-title'),
    
    // Series Browser
    seriesModal: document.getElementById('series-modal'),
    closeSeriesBtn: document.getElementById('close-series-btn'),
    seriesPoster: document.getElementById('series-poster'),
    seriesTitle: document.getElementById('series-title'),
    seriesPlot: document.getElementById('series-plot'),
    seriesMeta: document.getElementById('series-meta'),
    seasonTabs: document.getElementById('season-tabs'),
    episodesList: document.getElementById('episodes-list')
};

// Initialize App
function init() {
    applyTranslations();
    loadSettings();
    loadSavedPlaylists();

    if (state.playlists.length > 0) {
        els.savedContainer.classList.remove('hidden');
        renderSavedPlaylists();
    }

    setupEventListeners();
}

function loadSettings() {
    const saved = localStorage.getItem('nova_settings');
    if (saved) {
        state.settings = { ...state.settings, ...JSON.parse(saved) };
        els.forceHlsToggle.checked = !!state.settings.forceHls;
        if (els.adultToggle) els.adultToggle.checked = !!state.settings.showAdult;
    }
}

function saveSettings() {
    localStorage.setItem('nova_settings', JSON.stringify(state.settings));
}

function loadSavedPlaylists() {
    const saved = localStorage.getItem('nova_playlists');
    if (saved) {
        state.playlists = JSON.parse(saved);
    }
}

function savePlaylists() {
    localStorage.setItem('nova_playlists', JSON.stringify(state.playlists));
}

function getInitials(name) {
    if (!name) return 'TV';
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
    return cleanName.length > 0 ? cleanName.substring(0, 2).toUpperCase() : 'TV';
}

// UI Helpers
function showToast(message, isError = false) {
    els.toast.textContent = message;
    els.toast.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => {
        els.toast.classList.remove('show');
    }, 3000);
}

function showLoading(text = 'Loading...') {
    els.loadingText.textContent = text;
    els.loadingOverlay.classList.remove('hidden');
    els.loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    els.loadingOverlay.classList.add('hidden');
    els.loadingOverlay.style.display = 'none';
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Event Listeners
function setupEventListeners() {
    // Login Tabs
    els.tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            console.log('Tab clicked:', e.currentTarget);
            els.tabs.forEach(t => t.classList.remove('active'));
            els.forms.forEach(f => f.classList.remove('active'));
            
            const targetId = e.currentTarget.getAttribute('data-target');
            e.currentTarget.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Xtream Form Submit
    els.xtreamForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('xtream-name').value;
        const url = document.getElementById('xtream-url').value;
        const user = document.getElementById('xtream-user').value;
        const pass = document.getElementById('xtream-pass').value;

        await loginXtream(name, url, user, pass);
    });

    // M3U Form Submit
    els.m3uForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('m3u-name').value;
        const url = document.getElementById('m3u-url').value;
        
        if (url) {
            await fetchAndParseM3U(name, url);
        } else if (els.m3uFile.files.length > 0) {
            await readM3UFile(name, els.m3uFile.files[0]);
        } else {
            showToast('Please provide a URL or upload a file', true);
        }
    });

    els.m3uFile.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            showToast(`File selected: ${e.target.files[0].name}`);
        }
    });

    // Navigation
    els.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            els.navLinks.forEach(l => l.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            
            const view = target.getAttribute('data-view');
            state.currentView = view;
            
            if (view === 'settings') {
                els.viewContainer.classList.add('hidden');
                els.settingsContainer.classList.remove('hidden');
                
                // Populate Account Management
                if (state.activePlaylist && state.activePlaylist.type === 'xtream') {
                    els.accountGroup.style.display = 'block';
                    els.editName.value = state.activePlaylist.name || '';
                    els.editUrl.value = state.activePlaylist.baseUrl || '';
                    els.editUser.value = state.activePlaylist.username || '';
                    els.editPass.value = state.activePlaylist.password || '';
                } else {
                    els.accountGroup.style.display = 'none';
                }
            } else {
                els.settingsContainer.classList.add('hidden');
                els.viewContainer.classList.remove('hidden');
                renderContent();
            }
        });
    });

    // Logout
    els.logoutBtn.addEventListener('click', () => {
        state.activePlaylist = null;
        switchScreen('login-screen');
        renderSavedPlaylists();
    });

    // Search
    els.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderItems(query);
    });

    // Player Close
    els.closePlayerBtn.addEventListener('click', closePlayer);
    
    // Series Browser Close
    if (els.closeSeriesBtn) {
        els.closeSeriesBtn.addEventListener('click', () => {
            els.seriesModal.classList.add('hidden');
        });
    }

    // Settings
    els.clearDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved playlists and settings?')) {
            localStorage.removeItem('nova_playlists');
            localStorage.removeItem('nova_settings');
            state.playlists = [];
            els.savedContainer.classList.add('hidden');
            showToast('All data cleared');
        }
    });

    els.forceHlsToggle.addEventListener('change', (e) => {
        state.settings.forceHls = e.target.checked;
        saveSettings();
    });

    if (els.adultToggle) {
        els.adultToggle.addEventListener('change', (e) => {
            state.settings.showAdult = e.target.checked;
            saveSettings();
            if (state.activePlaylist) renderContent();
        });
    }

    // PWA Install Logic
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if (els.installContainer) {
            els.installContainer.classList.remove('hidden');
        }
    });

    if (els.installBtn) {
        els.installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
                // Hide the button
                if (els.installContainer) els.installContainer.classList.add('hidden');
            }
        });
    }
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
        if (els.installContainer) els.installContainer.classList.add('hidden');
        showToast('App installed successfully!');
        deferredPrompt = null;
    });

    els.editAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!state.activePlaylist) return;
        
        state.activePlaylist.name = els.editName.value;
        state.activePlaylist.baseUrl = els.editUrl.value.replace(/\/$/, '');
        state.activePlaylist.username = els.editUser.value;
        state.activePlaylist.password = els.editPass.value;
        
        saveNewPlaylist(state.activePlaylist);
        showToast('Account details updated successfully!');
    });

    if (els.mobileCatBtn) {
        els.mobileCatBtn.addEventListener('click', () => {
            const isOpen = els.categoryList.classList.toggle('open');
            if (isOpen) {
                els.categoryBackdrop.classList.remove('hidden');
            } else {
                els.categoryBackdrop.classList.add('hidden');
            }
        });
    }

    if (els.categoryBackdrop) {
        els.categoryBackdrop.addEventListener('click', () => {
            els.categoryList.classList.remove('open');
            els.categoryBackdrop.classList.add('hidden');
        });
    }
}

// Xtream API Logic
async function loginXtream(name, baseUrl, username, password) {
    // Strip trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
        
    showLoading(t('authenticating'));
    try {
        const res = await fetch(`${baseUrl}/player_api.php?username=${username}&password=${password}`);
        const data = await res.json();
        
        if (data.user_info && data.user_info.auth === 1) {
            const playlist = {
                id: Date.now().toString(),
                name,
                type: 'xtream',
                baseUrl: baseUrl,
                username: username,
                password: password,
                data: null
            };
            
            saveNewPlaylist(playlist);
            await loadXtreamData(playlist);
        } else {
            throw new Error(t('invalid_creds'));
        }
    } catch (err) {
        console.error(err);
        showToast(t('login_failed'), true);
    } finally {
        hideLoading();
    }
}

async function loadXtreamData(playlist) {
    showLoading(t('fetching_live'));
    try {
        const baseUrl = playlist.baseUrl;
        const creds = `username=${playlist.username}&password=${playlist.password}`;
        
        // Fetch Live Categories and Channels
        const [catRes, chanRes] = await Promise.all([
            fetch(`${baseUrl}/player_api.php?${creds}&action=get_live_categories`),
            fetch(`${baseUrl}/player_api.php?${creds}&action=get_live_streams`)
        ]);

        const categories = await catRes.json();
        const channels = await chanRes.json();

        // Organize data
        playlist.data = {
            categories: categories.map(c => ({ id: c.category_id, name: c.category_name })),
            channels: channels.map(c => ({
                id: c.stream_id,
                name: c.name,
                logo: c.stream_icon,
                categoryId: c.category_id,
                url: `${baseUrl}/live/${playlist.username}/${playlist.password}/${c.stream_id}.m3u8`
            }))
        };

        state.activePlaylist = playlist;
        switchScreen('main-screen');
        renderContent();
        showToast(t('load_success'));
        
        // Update local storage with fetched data
        const idx = state.playlists.findIndex(p => p.id === playlist.id);
        if(idx !== -1) {
            state.playlists[idx].data = playlist.data;
            savePlaylists();
        }

    } catch (err) {
        console.error(err);
        showToast(t('failed_fetch'), true);
    } finally {
        hideLoading();
    }
}

async function fetchXtreamVODs(playlist, type) {
    showLoading(t(type === 'vod' ? 'fetching_movies' : 'fetching_series'));
    try {
        const baseUrl = playlist.baseUrl;
        const creds = `username=${playlist.username}&password=${playlist.password}`;
        const actionStr = type === 'vod' ? 'get_vod_streams' : 'get_series';
        
        const [catRes, streamRes] = await Promise.all([
            fetch(`${baseUrl}/player_api.php?${creds}&action=get_${type}_categories`),
            fetch(`${baseUrl}/player_api.php?${creds}&action=${actionStr}`)
        ]);

        const categories = await catRes.json();
        const streams = await streamRes.json();

        if(!playlist.data) playlist.data = {};
        
        playlist.data[`${type}_categories`] = categories.map(c => ({ id: c.category_id, name: c.category_name }));
        
        if (type === 'vod') {
            playlist.data.vod_streams = streams.map(c => ({
                id: c.stream_id,
                name: c.name,
                logo: c.stream_icon,
                categoryId: c.category_id,
                url: `${baseUrl}/movie/${playlist.username}/${playlist.password}/${c.stream_id}.${c.container_extension || 'mp4'}`
            }));
        } else {
            playlist.data.series_streams = streams.map(c => ({
                id: c.series_id,
                name: c.name,
                logo: c.cover,
                categoryId: c.category_id,
                isSeries: true
            }));
        }
        
        // Save to cache
        const idx = state.playlists.findIndex(p => p.id === playlist.id);
        if(idx !== -1) {
            state.playlists[idx].data = playlist.data;
            savePlaylists();
        }
    } catch (err) {
        console.error(err);
        showToast(t('failed_fetch'), true);
    } finally {
        hideLoading();
    }
}

// M3U Logic
async function fetchAndParseM3U(name, url) {
    showLoading(t('downloading_m3u'));
    try {
        const response = await fetch(url);
        const text = await response.text();
        parseM3UAndSave(name, url, text);
    } catch (err) {
        showToast(t('failed_m3u'), true);
        hideLoading();
    }
}

async function readM3UFile(name, file) {
    showLoading(t('parsing_file'));
    const reader = new FileReader();
    reader.onload = (e) => {
        parseM3UAndSave(name, 'local', e.target.result);
    };
    reader.onerror = () => {
        hideLoading();
        showToast(t('failed_read'), true);
    };
    reader.readAsText(file);
}

function parseM3UAndSave(name, sourceUrl, content) {
    try {
        const lines = content.split('\n');
        if (lines[0].indexOf('#EXTM3U') === -1) {
            hideLoading();
            showToast(t('invalid_m3u'), true);
            return;
        }

        const channels = [];
        const categories = new Set();
        
        let currentChannel = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.startsWith('#EXTINF:')) {
                currentChannel = { id: i };
                
                // Extract Name
                const commaIndex = line.lastIndexOf(',');
                currentChannel.name = commaIndex !== -1 ? line.substring(commaIndex + 1).trim() : 'Unknown';
                
                // Extract Logo
                const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
                if (tvgLogoMatch) currentChannel.logo = tvgLogoMatch[1];
                
                // Extract Group
                const groupMatch = line.match(/group-title="([^"]+)"/);
                const category = groupMatch ? groupMatch[1] : 'Uncategorized';
                currentChannel.categoryId = category;
                categories.add(category);
                
            } else if (!line.startsWith('#')) {
                currentChannel.url = line;
                if (currentChannel.name && currentChannel.url) {
                    channels.push({...currentChannel});
                }
                currentChannel = {};
            }
        }

        const playlist = {
            id: Date.now().toString(),
            name,
            type: 'm3u',
            sourceUrl,
            data: {
                categories: Array.from(categories).map(c => ({ id: c, name: c })),
                channels: channels
            }
        };

        saveNewPlaylist(playlist);
        state.activePlaylist = playlist;
        
        hideLoading();
        switchScreen('main-screen');
        renderContent();
        showToast('M3U Loaded Successfully');

    } catch (err) {
        console.error(err);
        showToast('Error parsing M3U file', true);
        hideLoading();
    }
}

// Playlist Management
function saveNewPlaylist(playlist) {
    // Only keep essential data to avoid filling up localStorage, except for M3U which needs it.
    // For large M3Us, consider IndexedDB, but localStorage works for basic ones.
    const toSave = {...playlist};
    if (toSave.type === 'xtream') {
        toSave.data = null; // Don't save full channel list to localStorage for Xtream, fetch on load
    }
    
    // Check if exists
    const existingIdx = state.playlists.findIndex(p => p.name === playlist.name && p.type === playlist.type);
    if(existingIdx !== -1) {
        state.playlists[existingIdx] = toSave;
    } else {
        state.playlists.push(toSave);
    }
    savePlaylists();
}

function renderSavedPlaylists() {
    els.savedList.innerHTML = '';
    state.playlists.forEach(p => {
        const li = document.createElement('li');
        li.className = 'saved-item';
        li.innerHTML = `
            <div class="saved-item-info">
                <span class="saved-item-name">${p.name}</span>
                <span class="saved-item-type">${p.type.toUpperCase()}</span>
            </div>
            <i class="fa-solid fa-chevron-right text-secondary"></i>
        `;
        li.addEventListener('click', () => {
            if (p.type === 'xtream') {
                loadXtreamData(p);
            } else {
                state.activePlaylist = p;
                switchScreen('main-screen');
                renderContent();
            }
        });
        els.savedList.appendChild(li);
    });
}

// Rendering Logic
let currentActiveCategory = null;

async function renderContent() {
    if (!state.activePlaylist) return;

    if (state.activePlaylist.type === 'xtream') {
        if (state.currentView === 'movies' && (!state.activePlaylist.data || !state.activePlaylist.data.vod_categories)) {
            await fetchXtreamVODs(state.activePlaylist, 'vod');
        } else if (state.currentView === 'series' && (!state.activePlaylist.data || !state.activePlaylist.data.series_categories)) {
            await fetchXtreamVODs(state.activePlaylist, 'series');
        }
    } else if (state.currentView !== 'live') {
        els.categoryList.innerHTML = '<div class="category-item">M3U specific VOD/Series not supported in this view</div>';
        els.itemsGrid.innerHTML = '';
        return;
    }

    if (!state.activePlaylist.data) return;

    let categories = [];
    if (state.currentView === 'live') categories = state.activePlaylist.data.categories || [];
    else if (state.currentView === 'movies') categories = state.activePlaylist.data.vod_categories || [];
    else if (state.currentView === 'series') categories = state.activePlaylist.data.series_categories || [];

    // Apply Adult Filter
    const adultKeywords = ['adult', 'xxx', '18+', 'porn', 'playboy', 'brazzers', 'for adults', 'adultos', 'hot', '❌❌❌'];
    if (!state.settings.showAdult) {
        categories = categories.filter(c => {
            const name = c.name ? c.name.toLowerCase() : '';
            return !adultKeywords.some(kw => name.includes(kw));
        });
    }

    els.categoryList.innerHTML = '';
    
    // Close button for mobile categories
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn icon-btn mobile-only';
    closeBtn.style.alignSelf = 'flex-end';
    closeBtn.style.marginBottom = '10px';
    closeBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    closeBtn.addEventListener('click', () => {
        els.categoryList.classList.remove('open');
        if (els.categoryBackdrop) els.categoryBackdrop.classList.add('hidden');
    });
    els.categoryList.appendChild(closeBtn);

    // All Category
    const allCat = document.createElement('div');
    allCat.className = 'category-item active';
    allCat.textContent = t('all_items');
    allCat.addEventListener('click', () => selectCategory(null, allCat));
    els.categoryList.appendChild(allCat);

    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.textContent = cat.name;
        div.addEventListener('click', () => selectCategory(cat.id, div));
        els.categoryList.appendChild(div);
    });

    currentActiveCategory = null;
    renderItems();
}

function selectCategory(categoryId, element) {
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    currentActiveCategory = categoryId;
    renderItems();
    
    // Close mobile menu
    if (els.categoryList && els.categoryList.classList.contains('open')) {
        els.categoryList.classList.remove('open');
        if (els.categoryBackdrop) els.categoryBackdrop.classList.add('hidden');
    }
}

function renderItems(searchQuery = '') {
    if (!state.activePlaylist || !state.activePlaylist.data) return;
    
    let items = [];
    if (state.currentView === 'live') items = state.activePlaylist.data.channels || [];
    else if (state.currentView === 'movies') items = state.activePlaylist.data.vod_streams || [];
    else if (state.currentView === 'series') items = state.activePlaylist.data.series_streams || [];

    // Filter Adult Content from All Items
    const adultKeywords = ['adult', 'xxx', '18+', 'porn', 'playboy', 'brazzers', 'for adults', 'adultos', 'hot', '❌❌❌'];
    if (!state.settings.showAdult) {
        // Find allowed category IDs
        let categories = [];
        if (state.currentView === 'live') categories = state.activePlaylist.data.categories || [];
        else if (state.currentView === 'movies') categories = state.activePlaylist.data.vod_categories || [];
        else if (state.currentView === 'series') categories = state.activePlaylist.data.series_categories || [];
        
        const allowedCatIds = new Set(
            categories
                .filter(c => !adultKeywords.some(kw => (c.name || '').toLowerCase().includes(kw)))
                .map(c => String(c.id))
        );
        
        items = items.filter(i => {
            // Check if category is allowed
            if (!allowedCatIds.has(String(i.categoryId))) return false;
            // Also check item name itself
            const itemName = i.name ? i.name.toLowerCase() : '';
            if (adultKeywords.some(kw => itemName.includes(kw))) return false;
            return true;
        });
    }

    if (currentActiveCategory !== null) {
        items = items.filter(i => i.categoryId === currentActiveCategory);
    }

    if (searchQuery) {
        items = items.filter(i => i.name.toLowerCase().includes(searchQuery));
    }

    els.itemsGrid.innerHTML = '';
    
    // Limit rendering for performance (simple virtualization substitute)
    const limit = Math.min(items.length, 100);

    for(let i=0; i<limit; i++) {
        const item = items[i];
        const card = document.createElement('div');
        card.className = 'item-card';
        const initials = getInitials(item.name);
        
        card.innerHTML = `
            <div class="item-logo">
                ${item.logo ? `<img src="${item.logo}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
                <div class="item-initials" style="${item.logo ? 'display:none;' : 'display:flex;'}">${initials}</div>
            </div>
            <div class="item-info">
                <div class="item-title">${item.name}</div>
            </div>
        `;
        card.addEventListener('click', () => playVideo(item));
        els.itemsGrid.appendChild(card);
    }
}

// Player Logic
async function playVideo(item) {
    if (item.isSeries && !item.isEpisode) {
        openSeriesBrowser(item);
        return;
    }

    els.nowPlayingTitle.textContent = item.name;
    els.playerOverlay.classList.remove('hidden');
    
    const video = els.videoPlayer;
    const url = item.url;

    if (state.player) {
        state.player.destroy();
        state.player = null;
    }

    if (state.settings.forceHls && Hls.isSupported() && url.includes('.m3u')) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });
        state.player = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play().catch(e => console.log('Auto-play prevented'));
        });
        hls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                showToast('Stream Error: ' + data.type, true);
            }
        });
    } else {
        // Native playback (Safari, Smart TVs) or non-M3U8
        video.src = url;
        video.play().catch(e => console.log('Auto-play prevented'));
    }
}

function closePlayer() {
    els.playerOverlay.classList.add('hidden');
    els.videoPlayer.pause();
    els.videoPlayer.removeAttribute('src');
    if (state.player) {
        state.player.destroy();
        state.player = null;
    }
}

// Series Browser Logic
async function openSeriesBrowser(item) {
    showLoading(t('loading_series'));
    try {
        const p = state.activePlaylist;
        const res = await fetch(`${p.baseUrl}/player_api.php?username=${p.username}&password=${p.password}&action=get_series_info&series_id=${item.id}`);
        const data = await res.json();
        
        if (!data || !data.episodes) {
            throw new Error("No episodes found");
        }

        const info = data.info || {};
        els.seriesTitle.textContent = info.name || item.name;
        els.seriesPlot.textContent = info.plot || '';
        
        if (info.cover) {
            els.seriesPoster.style.backgroundImage = `url('${info.cover}')`;
        } else if (item.logo) {
            els.seriesPoster.style.backgroundImage = `url('${item.logo}')`;
        } else {
            els.seriesPoster.style.backgroundImage = `none`;
        }
        
        let metaHtml = '';
        if (info.genre) metaHtml += `<span>${info.genre}</span> • `;
        if (info.rating) metaHtml += `<span>⭐ ${info.rating}</span> • `;
        if (info.releaseDate) metaHtml += `<span>${info.releaseDate}</span>`;
        els.seriesMeta.innerHTML = metaHtml.replace(/ • $/, '');

        const seasons = Object.keys(data.episodes);
        if (seasons.length === 0) throw new Error("No seasons found");
        
        renderSeasonTabs(seasons, data.episodes, item);
        
        els.seriesModal.classList.remove('hidden');
    } catch(e) {
        console.error(e);
        showToast(t('failed_series'), true);
    } finally {
        hideLoading();
    }
}

function renderSeasonTabs(seasons, episodesObj, seriesItem) {
    els.seasonTabs.innerHTML = '';
    
    seasons.forEach((seasonNum, index) => {
        const btn = document.createElement('button');
        btn.className = `season-tab ${index === 0 ? 'active' : ''}`;
        btn.textContent = `${t('season')} ${seasonNum}`;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.season-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEpisodesList(episodesObj[seasonNum], seriesItem, seasonNum);
        });
        
        els.seasonTabs.appendChild(btn);
    });
    
    // Render first season by default
    renderEpisodesList(episodesObj[seasons[0]], seriesItem, seasons[0]);
}

function renderEpisodesList(episodes, seriesItem, seasonNum) {
    els.episodesList.innerHTML = '';
    
    if (!episodes || episodes.length === 0) {
        els.episodesList.innerHTML = `<div style="text-align:center; padding: 20px; color: #888;">${t('no_episodes')}</div>`;
        return;
    }
    
    const p = state.activePlaylist;
    
    episodes.forEach(ep => {
        const div = document.createElement('div');
        div.className = 'episode-item';
        
        const epTitle = ep.title || `${t('episode')} ${ep.episode_num}`;
        const duration = ep.info && ep.info.duration ? ep.info.duration : '';
        
        div.innerHTML = `
            <div class="ep-num">${ep.episode_num}</div>
            <div class="ep-details">
                <div class="ep-title">${epTitle}</div>
                ${duration ? `<div class="ep-meta">${duration}</div>` : ''}
            </div>
            <div class="ep-play-icon"><i class="fa-solid fa-play"></i></div>
        `;
        
        div.addEventListener('click', () => {
            const streamUrl = `${p.baseUrl}/series/${p.username}/${p.password}/${ep.id}.${ep.container_extension || 'mp4'}`;
            const episodeItemToPlay = {
                id: ep.id,
                name: `${seriesItem.name} - S${seasonNum}E${ep.episode_num}`,
                logo: ep.info && ep.info.movie_image ? ep.info.movie_image : seriesItem.logo,
                url: streamUrl,
                isSeries: true,
                isEpisode: true
            };
            playVideo(episodeItemToPlay);
        });
        
        els.episodesList.appendChild(div);
    });
}

// Run
document.addEventListener('DOMContentLoaded', init);
