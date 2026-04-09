document.querySelectorAll('time[datetime]').forEach(function(el) {
    el.textContent = new Date(el.getAttribute('datetime')).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
});
