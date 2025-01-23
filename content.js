function extractResultsForGoogleSearch() {
    const e = document.querySelectorAll("#res .g.tF2Cxc");
    const t = [];
    return (
        e.forEach((e) => {
            const o = e.querySelector("h3"),
                r = e.querySelector("a");
            if (o && r) {
                const e = r.href,
                    n = decodeURIComponent(e),
                    c = new URL(n).hostname;
                t.push({ site: c, title: o.textContent.trim(), url: n });
            }
        }),
        t
    );
}
chrome.runtime.onMessage.addListener(function (e, t, o) {
    if ("extractSERPResults" === e.action) {
        o({ results: extractResultsForGoogleSearch() });
    }
});
