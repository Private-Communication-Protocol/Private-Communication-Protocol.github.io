
const documents = {
    "introduction": {
        title: "Introduction",
        file: "docs/introduction.md"
    },
    "how-it-works": {
        title: "How PCP Works",
        file: "docs/how-it-works.md"
    },
    "system-architecture": {
        title: "System Architecture",
        file: "docs/system-architecture.md"
    },
    "responsibility-boundaries": {
        title: "Responsibility Boundaries",
        file: "docs/responsibility-boundaries.md"
    },
    "security-model": {
        title: "Security Model",
        file: "docs/security-model.md"
    },
    "roadmap": {
        title: "Development Roadmap",
        file: "docs/roadmap.md"
    }
};

const content = document.getElementById("markdown-content");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

let currentRequest = 0;

async function loadDocument() {
    const requestId = ++currentRequest;

    const params = new URLSearchParams(window.location.search);
    const requestedPage = params.get("page") || "introduction";

    const documentData = documents[requestedPage];

    document.querySelectorAll("[data-doc]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.doc === requestedPage
        );
    });

    if (!documentData) {
        loading.hidden = true;
        content.hidden = true;
        error.hidden = false;
        error.textContent = "Document not found.";
        return;
    }

    loading.hidden = false;
    content.hidden = true;
    error.hidden = true;

    try {
        const response = await fetch(documentData.file, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                `Failed to load ${documentData.file}: HTTP ${response.status}`
            );
        }

        const markdown = await response.text();

        // Render Markdown into HTML
        const renderedHTML = marked.parse(markdown);

        // Sanitize generated HTML
        const safeHTML = DOMPurify.sanitize(renderedHTML);

        // Ignore outdated requests
        if (requestId !== currentRequest) return;

        content.innerHTML = safeHTML;

        document.title =
            `${documentData.title} | PCP Documentation`;

        loading.hidden = true;
        content.hidden = false;

    } catch (err) {
        if (requestId !== currentRequest) return;

        console.error("PCP documentation error:", err);

        loading.hidden = true;
        content.hidden = true;
        error.hidden = false;

        error.textContent =
            "Unable to load documentation. Check the browser console.";
    }
}

loadDocument();
