/* RESONATE - Floating Toast Notification System */

export function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Create Toast Item DOM Node
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    
    // Check SVG Icon
    toast.innerHTML = `
        <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove element after animation runs (3 seconds total)
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
export default showToast;
