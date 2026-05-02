import { useEffect } from 'react';

const CodeProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const disableContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for dev tools
    const disableDevTools = (e) => {
      // Prevent F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+U (view source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+S (save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // Anti-debugging: detect dev tools opening
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || 
          window.outerHeight - window.innerHeight > threshold) {
        // Dev tools might be open
        console.clear();
        console.log('%c⚠️ Developer Tools Detected', 'color: red; font-size: 20px; font-weight: bold;');
      }
    };

    // Disable text selection
    const disableTextSelection = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable image dragging
    const disableImageDrag = (e) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableDevTools);
    window.addEventListener('resize', detectDevTools);
    document.addEventListener('selectstart', disableTextSelection);
    document.addEventListener('dragstart', disableImageDrag);

    // Set inline styles to disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    // Clear console periodically
    const consoleInterval = setInterval(() => {
      console.clear();
    }, 5000);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableDevTools);
      window.removeEventListener('resize', detectDevTools);
      document.removeEventListener('selectstart', disableTextSelection);
      document.removeEventListener('dragstart', disableImageDrag);
      clearInterval(consoleInterval);
    };
  }, []);

  return null;
};

export default CodeProtection;
