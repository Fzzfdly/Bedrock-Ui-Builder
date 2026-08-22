/**
 * Bedrock JSON-UI Studio - Exporter & Toast Notification Utilities
 */

/**
 * Displays a non-intrusive toast message
 * @param {string} message 
 * @param {'success' | 'error' | 'info'} type 
 * @param {number} duration 
 */
export function showToast(message, type = 'success', duration = 2500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✅';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Copies text string to clipboard
 * @param {string} text 
 * @param {string} successMessage 
 */
export async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    showToast(successMessage, 'success');
  } catch (err) {
    showToast('Failed to copy to clipboard', 'error');
  }
}

/**
 * Triggers a browser download of a JSON file
 * @param {Object|string} content 
 * @param {string} filename 
 */
export function downloadJsonFile(content, filename = 'server_form.json') {
  const jsonStr = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`, 'success');
}
