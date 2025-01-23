document.addEventListener("DOMContentLoaded", function () {
    function t(t, e) {
        const n = t.results,
            a = document.getElementById("results-container");
        if (((a.innerHTML = ""), 0 === n.length)) return void (a.innerHTML = "<p>Không tìm thấy kết quả nào.</p>");
        const r =
                '\n            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>',
            i = document.createElement("div");
        (i.className = "header"),
            (i.innerHTML = `\n            <h2>\n            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" /></svg> SevNSERP Extractor</h2>\n            <div class="btn-container">\n                <button class="btn copy-sites">${r} Sites</button>\n                <button class="btn copy-titles">${r} Title</button>\n                <button class="btn copy-urls">${r} Urls</button>\n            </div>\n        `),
            a.appendChild(i),
            document.querySelector(".btn.copy-sites").addEventListener("click", o),
            document.querySelector(".btn.copy-titles").addEventListener("click", c),
            document.querySelector(".btn.copy-urls").addEventListener("click", s);
        const l = document.createElement("div");
        l.className = "results-section";
        const d = new URLSearchParams(new URL(e).search),
            u = parseInt(d.get("start")) || 0;
        n.forEach((t, e) => {
            const n = (u > 0 ? u - 1 : u) + e + 1,
                o = document.createElement("div");
            (o.className = "result-item"),
                (o.innerHTML = `\n                <p><b>#${n}</b>: ${t.site}</p>\n                <a href="${t.url}" target="_blank" class="result-title">${t.title}</a>\n                <div class="result-url">${t.url}</div>\n            `),
                l.appendChild(o);
        }),
            a.appendChild(l);
    }
    function e(t) {
        const e = document.createElement("div");
        e.className = "pagination-container";
        const o = new URLSearchParams(new URL(t).search),
            c = parseInt(o.get("start")) || 0,
            s = Math.floor(c / 10) + 1,
            a = document.querySelector(".pagination-container");
        if ((a && a.remove(), s > 1)) {
            const o = document.createElement("button");
            (o.className = "btn-pagination prev"), (o.textContent = "Prev"), o.addEventListener("click", () => n(s - 1, t)), e.appendChild(o);
        }
        const r = document.createElement("button");
        (r.className = "btn-pagination next"),
            (r.textContent = "Next"),
            r.addEventListener("click", () => n(s + 1, t)),
            e.appendChild(r),
            document.getElementById("results-container").appendChild(e);
    }
    function n(n, o) {
        const c = new URL(o),
            s = new URLSearchParams(c.search);
        s.set("start", 10 * (n - 1)),
            (c.search = s.toString()),
            chrome.tabs.update({ url: c.toString() }, function (n) {
                chrome.tabs.onUpdated.addListener(function o(s, a) {
                    s === n.id &&
                        "complete" === a.status &&
                        (chrome.tabs.sendMessage(s, { action: "extractSERPResults" }, function (n) {
                            n
                                ? (t(n, c.toString()), e(c.toString()))
                                : (document.getElementById("results-container").innerHTML =
                                      '<div style="padding: 10px">Hãy đảm bảo bạn đang ở trang kết quả tìm kiếm.</div>');
                        }),
                        chrome.tabs.onUpdated.removeListener(o));
                });
            });
    }
    function o() {
        a(
            Array.from(document.querySelectorAll(".result-item p"))
                .map((t) => t.textContent.split(": ")[1].trim())
                .join("\n"),
            "Danh sách site"
        );
    }
    function c() {
        a(
            Array.from(document.querySelectorAll(".result-title"))
                .map((t) => t.textContent)
                .join("\n"),
            "Danh sách title"
        );
    }
    function s() {
        a(
            Array.from(document.querySelectorAll(".result-url"))
                .map((t) => t.textContent)
                .join("\n"),
            "Danh sách url"
        );
    }
    function a(t, e) {
        navigator.clipboard
            .writeText(t)
            .then(function () {
                r(`${e} đã được sao chép!`);
            })
            .catch(function (t) {
                r("Không thể sao chép vào clipboard: " + t);
            });
    }
    function r(t) {
        const e = document.createElement("div");
        (e.className = "toast"),
            (e.textContent = t),
            document.body.appendChild(e),
            setTimeout(() => {
                e.classList.add("show");
            }, 100),
            setTimeout(() => {
                e.classList.remove("show"), document.body.removeChild(e);
            }, 3e3);
    }
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (n) {
        chrome.tabs.sendMessage(n[0].id, { action: "extractSERPResults" }, function (o) {
            if (o) t(o, n[0].url), e(n[0].url);
            else {
                const t =
                    '\n                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>';
                (document.getElementById(
                    "results-container"
                ).innerHTML = `\n                <div>\n                    <h2 style="padding: 10px; background-color: var(--dark); color: var(--white)">Từ khoá tìm kiếm</h2>\n                    <div style="padding: 10px; display: flex; align-items: center; gap: 10px;">\n                        ${t} <input type="text" id="search-input" placeholder="Nhập từ khóa..." style="flex: 1; padding: 5px;"/>\n                        <button id="search-button" style="padding: 5px; cursor: pointer;">Search</button>\n                    </div>\n                    <div id="error-message" style="padding:0 10px 10px; color: var(--primary); display: none;"></div>\n                </div>\n            `),
                    document.getElementById("search-button").addEventListener("click", function () {
                        const t = document.getElementById("search-input").value.trim(),
                            e = document.getElementById("error-message");
                        if (t) {
                            e.style.display = "none";
                            const n = `https://www.google.com/search?q=${encodeURIComponent(t)}`;
                            chrome.tabs.create({ url: n });
                        } else (e.style.display = "block"), (e.textContent = "Hãy nhập từ khóa trước khi tìm kiếm!");
                    });
            }
        });
    });
});
