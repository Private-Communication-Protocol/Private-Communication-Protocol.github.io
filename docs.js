
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

async function loadDocument() {

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
        error.hidden = false;
        error.textContent = "Document not found.";
        return;
    }

    try {
        const response = await fetch(documentData.file);

        if (!response.ok) {
            throw new Error("Document request failed");
        }

        const markdown = await response.text();

        const renderedHTML = marked.parse(markdown);

        content.innerHTML = DOMPurify.sanitize(renderedHTML);

        document.title = `${documentData.title} | PCP Documentation`;

        loading.hidden = true;
        content.hidden = false;

    } catch (err) {
        loading.hidden = true;
        content.hidden = true;
        error.hidden = false;
        error.textContent =
            "Unable to load documentation. Please try again later.";

        console.error("PCP documentation error:", err);
    }
}

loadDocument();
