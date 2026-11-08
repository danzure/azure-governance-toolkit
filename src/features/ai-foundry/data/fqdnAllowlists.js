/**
 * Standard Outbound FQDN Rules for Azure AI Foundry Managed Virtual Networks
 * 
 * Microsoft Reference: https://learn.microsoft.com/azure/ai-studio/how-to/configure-managed-network#outbound-rules
 */
export const FQDN_CATEGORIES = [
    {
        id: 'pypi',
        label: 'Python Package Index (PyPI)',
        description: 'Required for pip installs, evaluation dependencies, and Prompt Flow runtimes.',
        endpoints: ['pypi.org', 'files.pythonhosted.org'],
        recommended: true
    },
    {
        id: 'huggingface',
        label: 'Hugging Face Model Hub',
        description: 'Required to download open-weights models (Llama 3, Mistral, Phi-3/4) and tokenizers.',
        endpoints: ['huggingface.co', '*.hf.co'],
        recommended: true
    },
    {
        id: 'github',
        label: 'GitHub & Raw Content',
        description: 'Required for Git repository clones, release packages, and CI/CD agent sync.',
        endpoints: ['github.com', '*.githubusercontent.com'],
        recommended: true
    },
    {
        id: 'conda',
        label: 'Anaconda / Conda-Forge',
        description: 'Required for Conda environment curation and scientific compute packages.',
        endpoints: ['anaconda.org', '*.anaconda.org', 'repo.anaconda.com'],
        recommended: false
    },
    {
        id: 'microsoft',
        label: 'Microsoft Learn & Entra Metadata',
        description: 'Documentation references, Entra ID discovery keys, and Microsoft telemetry endpoints.',
        endpoints: ['login.microsoftonline.com', 'management.azure.com', '*.msftauth.net'],
        recommended: true
    }
];

