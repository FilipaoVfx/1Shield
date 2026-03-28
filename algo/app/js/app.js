/**
 * Operación Defensa Web: TLS Analyzer Application Logic
 * Implements RF-UI and RNF-UI requirements from SRS.
 */

const app = {
    state: {
        targets: [],
        results: [],
        filteredResults: [],
        isAnalyzing: false,
        sortColumn: 'target',
        sortDirection: 'asc'
    },

    // Initialization
    init() {
        console.log('TLS Analyzer Initializing...');
        lucide.createIcons();
        this.cacheElements();
        this.bindEvents();
    },

    cacheElements() {
        this.els = {
            inputSection: document.getElementById('input-section'),
            progressSection: document.getElementById('progress-section'),
            resultsSection: document.getElementById('results-section'),
            btnAnalyze: document.getElementById('btn-analyze'),
            targetsInput: document.getElementById('targets'),
            validationError: document.getElementById('validation-error'),
            validationErrorText: document.getElementById('validation-error-text'),
            loadingMessage: document.getElementById('loading-message'),
            phases: [
                document.getElementById('phase-1'),
                document.getElementById('phase-2'),
                document.getElementById('phase-3')
            ],
            btnExport: document.getElementById('btn-export'),
            exportModal: document.getElementById('export-modal'),
            exportModalContent: document.getElementById('export-modal-content'),
            btnCloseModal: document.getElementById('btn-close-modal'),
            btnNewAnalysis: document.getElementById('btn-new-analysis'),
            tableBody: document.getElementById('table-body'),
            tableEmptyState: document.getElementById('table-empty-state'),
            searchInput: document.getElementById('search-input'),
            filterCriticality: document.getElementById('filter-criticality'),
            summaryIconContainer: document.getElementById('summary-icon-container'),
            summaryRiskTitle: document.getElementById('summary-risk-title'),
            summaryRiskDesc: document.getElementById('summary-risk-desc'),
            summaryTargetsCount: document.getElementById('summary-targets-count'),
            summaryFindingsCount: document.getElementById('summary-findings-count'),
            tlsVersionsContainer: document.getElementById('tls-versions-container')
        };
    },

    bindEvents() {
        this.els.btnAnalyze.addEventListener('click', () => this.handleAnalyze());
        this.els.btnNewAnalysis.addEventListener('click', () => this.resetApp());
        this.els.btnExport.addEventListener('click', () => this.toggleModal(true));
        this.els.btnCloseModal.addEventListener('click', () => this.toggleModal(false));
        this.els.exportModal.addEventListener('click', (e) => {
            if (e.target === this.els.exportModal) this.toggleModal(false);
        });
        this.els.searchInput.addEventListener('input', () => this.handleFilter());
        this.els.filterCriticality.addEventListener('change', () => this.handleFilter());
    },

    // UI State Transitions
    toggleModal(show) {
        if (show) {
            this.els.exportModal.classList.remove('hidden');
            this.els.exportModal.classList.add('flex');
            setTimeout(() => {
                this.els.exportModalContent.classList.remove('scale-95', 'opacity-0');
                this.els.exportModalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        } else {
            this.els.exportModalContent.classList.remove('scale-100', 'opacity-100');
            this.els.exportModalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                this.els.exportModal.classList.add('hidden');
                this.els.exportModal.classList.remove('flex');
            }, 300);
        }
    },

    resetApp() {
        this.state.targets = [];
        this.state.results = [];
        this.els.targetsInput.value = '';
        this.els.resultsSection.classList.add('hidden');
        this.els.inputSection.classList.remove('hidden');
        this.els.validationError.classList.add('hidden');
        this.els.searchInput.value = '';
        this.els.filterCriticality.value = 'all';
    },

    // Validation
    validateTargets(text) {
        const domains = text.split(/[\n,]+/).map(d => d.trim()).filter(d => d.length > 0);
        if (domains.length === 0) return { valid: false, message: 'Ingrese al menos un dominio o IP.' };

        // Simple regex for domains and IPv4
        const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/i;
        const invalid = domains.filter(d => !domainRegex.test(d));

        if (invalid.length > 0) {
            return { valid: false, message: `Formato inválido: ${invalid.slice(0, 2).join(', ')}${invalid.length > 2 ? '...' : ''}` };
        }

        return { valid: true, targets: domains };
    },

    // Analysis Logic (REAL INTEGRATION)
    async handleAnalyze() {
        const validation = this.validateTargets(this.els.targetsInput.value);
        if (!validation.valid) {
            this.els.validationErrorText.innerText = validation.message;
            this.els.validationError.classList.remove('hidden');
            return;
        }

        this.els.validationError.classList.add('hidden');
        this.state.targets = validation.targets;
        this.state.isAnalyzing = true;

        // Transition to progress
        this.els.inputSection.classList.add('hidden');
        this.els.progressSection.classList.remove('hidden');
        this.resetProgressPhases();

        try {
            // Initiate the real scan call
            const scanPromise = fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targets: this.state.targets })
            }).then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.json();
            });

            // Simulate UI phases while the scan happens
            await this.simulatePhases(scanPromise);
            
            this.state.results = await scanPromise;
            this.handleFilter(); // Initial filter and render
            
            // Success transition
            setTimeout(() => {
                this.els.progressSection.classList.add('hidden');
                this.els.resultsSection.classList.remove('hidden');
                this.renderDashboard();
                this.state.isAnalyzing = false;
            }, 300);

        } catch (error) {
            console.error('Error during analysis:', error);
            alert('Error de conexión con el motor TLS: ' + error.message);
            this.resetApp();
        }
    },

    resetProgressPhases() {
        this.els.phases.forEach(p => {
            p.classList.remove('active', 'completed');
            p.classList.add('opacity-50');
            const icon = p.querySelector('.phase-icon');
            icon.classList.remove('animate-pulse-slow');
            icon.innerHTML = this.getPhaseIcon(p.id);
        });
    },

    getPhaseIcon(id) {
        if (id === 'phase-1') return '<i data-lucide="database" class="w-5 h-5"></i>';
        if (id === 'phase-2') return '<i data-lucide="terminal-square" class="w-5 h-5"></i>';
        if (id === 'phase-3') return '<i data-lucide="cpu" class="w-5 h-5"></i>';
        return '';
    },

    async simulatePhases(dataWaitPromise) {
        const phaseSteps = [
            { id: 0, msg: 'Validando sintaxis e inicializando colas backend...', duration: 1000 },
            { id: 1, msg: 'Ejecutando motor de sockets TLS real (Motor TLS)...', duration: 1500 },
            { id: 2, msg: 'Aplicando motor de reglas y analizando vulnerabilidades...', duration: 1000 }
        ];

        for (const step of phaseSteps) {
            const phaseEl = this.els.phases[step.id];
            phaseEl.classList.remove('opacity-50');
            phaseEl.classList.add('active');
            phaseEl.querySelector('.phase-icon').classList.add('animate-pulse-slow');
            this.els.loadingMessage.innerText = step.msg;
            lucide.createIcons();

            // At the last phase, we also wait for the real data to be ready
            if (step.id === 2) {
                await Promise.all([new Promise(r => setTimeout(r, step.duration)), dataWaitPromise]);
            } else {
                await new Promise(r => setTimeout(r, step.duration));
            }

            phaseEl.classList.remove('active');
            phaseEl.classList.add('completed');
            phaseEl.querySelector('.phase-icon').classList.remove('animate-pulse-slow');
            phaseEl.querySelector('.phase-icon').innerHTML = '<i data-lucide="check" class="w-5 h-5"></i>';
            lucide.createIcons();
        }
    },

    renderDashboard() {
        const findings = this.state.results.length;
        const targetsCount = this.state.targets.length;
        this.els.summaryTargetsCount.innerText = targetsCount;
        this.els.summaryFindingsCount.innerText = findings;

        // General Risk Calculation
        const hasHigh = this.state.results.some(r => r.criticality === 'Alta');
        const hasMedium = this.state.results.some(r => r.criticality === 'Media');

        if (hasHigh) {
            this.els.summaryRiskTitle.innerText = 'Riesgo Alto';
            this.els.summaryRiskTitle.className = 'text-2xl font-bold text-red-500';
            this.els.summaryRiskDesc.innerText = 'Se detectaron vulnerabilidades críticas que requieren atención inmediata.';
            this.els.summaryIconContainer.className = 'w-12 h-12 rounded-full flex items-center justify-center bg-red-500/20 text-red-500 border border-red-500/30';
            this.els.summaryIconContainer.innerHTML = '<i data-lucide="shield-alert" class="w-6 h-6"></i>';
        } else if (hasMedium) {
            this.els.summaryRiskTitle.innerText = 'Riesgo Medio';
            this.els.summaryRiskTitle.className = 'text-2xl font-bold text-amber-500';
            this.els.summaryRiskDesc.innerText = 'Configuraciones obsoletas detectadas. Se recomienda endurecimiento.';
            this.els.summaryIconContainer.className = 'w-12 h-12 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-500 border border-amber-500/30';
            this.els.summaryIconContainer.innerHTML = '<i data-lucide="alert-triangle" class="w-6 h-6"></i>';
        } else {
            this.els.summaryRiskTitle.innerText = 'Óptimo';
            this.els.summaryRiskTitle.className = 'text-2xl font-bold text-brand-500';
            this.els.summaryRiskDesc.innerText = 'La configuración cumple con los estándares modernos de seguridad.';
            this.els.summaryIconContainer.className = 'w-12 h-12 rounded-full flex items-center justify-center bg-brand-500/20 text-brand-500 border border-brand-500/30';
            this.els.summaryIconContainer.innerHTML = '<i data-lucide="check-circle" class="w-6 h-6"></i>';
        }

        // TLS Versions Stats
        const versions = ['1.0', '1.1', '1.2', '1.3'];
        this.els.tlsVersionsContainer.innerHTML = versions.map(v => {
            const count = this.state.results.filter(r => r.tlsVersion === v && r.status === 'Habilitado').length;
            const isSecure = v === '1.2' || v === '1.3';
            return `
                <div class="bg-surface-950/50 p-4 rounded-lg border border-gray-800 flex flex-col items-center">
                    <span class="text-xs text-gray-500 font-mono mb-1">TLS ${v}</span>
                    <span class="${count > 0 ? (isSecure ? 'text-brand-500' : 'text-red-400') : 'text-gray-600'} text-lg font-bold">
                        ${count > 0 ? 'HABILITADO' : 'DESHABILITADO'}
                    </span>
                    <span class="text-[10px] text-gray-600 mt-1 uppercase tracking-tighter">${count} Hallazgos</span>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    },

    handleFilter() {
        const query = this.els.searchInput.value.toLowerCase();
        const criticality = this.els.filterCriticality.value.toLowerCase();

        this.state.filteredResults = this.state.results.filter(r => {
            const matchesSearch = r.target.toLowerCase().includes(query);
            const matchesCrit = criticality === 'all' || r.criticality.toLowerCase() === criticality;
            return matchesSearch && matchesCrit;
        });

        this.sortResults();
        this.renderTable();
    },

    sortData(column) {
        if (this.state.sortColumn === column) {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortColumn = column;
            this.state.sortDirection = 'asc';
        }
        this.handleFilter();
    },

    sortResults() {
        this.state.filteredResults.sort((a, b) => {
            let valA = a[this.state.sortColumn];
            let valB = b[this.state.sortColumn];

            // Order by criticality weight
            if (this.state.sortColumn === 'criticality') {
                const weights = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
                valA = weights[valA];
                valB = weights[valB];
            }

            if (valA < valB) return this.state.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    },

    renderTable() {
        if (this.state.filteredResults.length === 0) {
            this.els.tableBody.innerHTML = '';
            this.els.tableEmptyState.classList.remove('hidden');
            return;
        }

        this.els.tableEmptyState.classList.add('hidden');
        this.els.tableBody.innerHTML = this.state.filteredResults.map(r => `
            <tr class="transition-colors group" onclick="app.toggleRow(this)">
                <td class="px-6 py-4 whitespace-nowrap font-mono text-gray-300">${r.target}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-400">TLS ${r.tlsVersion}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="flex items-center gap-1.5 ${r.status === 'Habilitado' ? 'text-amber-400' : 'text-green-400'}">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        ${r.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge badge-${r.criticality.toLowerCase()}">${r.criticality}</span>
                </td>
                <td class="px-6 py-4 text-gray-400 leading-relaxed font-light">${r.riskDesc}</td>
                <td class="px-4 py-4 text-right">
                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-600 group-hover:text-white transition-transform"></i>
                </td>
            </tr>
            <tr class="hidden bg-surface-950/30 border-l-4 border-brand-500">
                <td colspan="6" class="px-6 py-6">
                    <div class="flex items-start gap-4">
                        <div class="bg-brand-500/10 p-3 rounded-lg text-brand-500">
                             <i data-lucide="lightbulb" class="w-6 h-6"></i>
                        </div>
                        <div>
                            <h5 class="text-white font-bold mb-2 uppercase tracking-wider text-xs">Recomendación de Mitigación</h5>
                            <p class="text-gray-300 max-w-2xl">${r.recommendation}</p>
                            <div class="mt-4 flex gap-4">
                                <span class="text-[10px] text-gray-500 flex items-center gap-1"><i data-lucide="book-open" class="w-3 h-3"></i> NIST SP 800-52 Rev. 2</span>
                                <span class="text-[10px] text-gray-500 flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> OWASP TLS Best Practices</span>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        lucide.createIcons();
    },

    toggleRow(el) {
        const nextTr = el.nextElementSibling;
        const icon = el.querySelector('[data-lucide="chevron-down"]');
        
        if (nextTr.classList.contains('hidden')) {
            nextTr.classList.remove('hidden');
            icon.classList.add('rotate-180', 'text-brand-500');
        } else {
            nextTr.classList.add('hidden');
            icon.classList.remove('rotate-180', 'text-brand-500');
        }
    },

    simulateExport(format) {
        this.toggleModal(false);
        const btn = this.els.btnExport;
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Generando ${format}...`;
        lucide.createIcons();

        setTimeout(() => {
            btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Listo!`;
            lucide.createIcons();
            
            // Generate a dummy download
            const blob = new Blob(['Mock TLS Analysis Report Content'], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TLS_Report_DefensaWeb.${format.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                lucide.createIcons();
            }, 2000);
        }, 1500);
    }
};

// Start application
document.addEventListener('DOMContentLoaded', () => app.init());
