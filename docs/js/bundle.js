"use strict";
(() => {
  // docs/js/ui/theme-utils.js
  var ThemeUtils = {
    // Generate distinct vibrant colors for categories
    stringToColor(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const h = Math.abs(hash) % 360;
      return `hsl(${h}, 75%, 65%)`;
    },
    getShape(ext) {
      if (ext === ".css") return "round-rectangle";
      if (ext === ".html") return "diamond";
      return "ellipse";
    }
  };

  // docs/js/ui/details-panel.js
  var DetailsPanel = {
    open(id) {
      const DATA = window.ARCHITECTURE_DATA;
      const file = DATA.find((f) => f.path === id);
      if (!file) return;
      document.getElementById("d-title").innerText = file.path.split("/").pop();
      const content = `
      <div class="section">
        <div class="section-title"><i data-lucide="info"></i> Purpose</div>
        <div class="text-value">${file.purpose}</div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="hard-drive"></i> File Stats</div>
        <div class="pill-container">
          <span class="pill stat">${file.size}</span>
          <span class="pill stat">${file.loc} lines</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title"><i data-lucide="box"></i> Exports</div>
        <div class="pill-container">
          ${this.renderPills(file.exports, "export")}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="arrow-down-to-line"></i> Depends On</div>
        <div class="pill-container">
          ${this.renderLinks(file.depends)}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="arrow-up-to-line"></i> Depended By</div>
        <div class="pill-container">
          ${this.renderLinks(file.dependedBy)}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="mouse-pointer-2"></i> DOM Targets</div>
        <div class="pill-container">
          ${this.renderPills(file.targets, "target")}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="database"></i> Storage Keys</div>
        <div class="pill-container">
          ${this.renderPills(file.storage, "storage")}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title"><i data-lucide="eye"></i> Observers</div>
        <div class="pill-container">
          ${this.renderPills(file.observers, "observer")}
        </div>
      </div>
    `;
      document.getElementById("d-content").innerHTML = content;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById("details-panel").classList.add("open");
    },
    close() {
      document.getElementById("details-panel").classList.remove("open");
    },
    renderPills(str, typeClass = "") {
      if (!str || str === "none" || Array.isArray(str) && str.length === 0) {
        return '<span class="pill">none</span>';
      }
      const items = Array.isArray(str) ? str : str.split(",").map((s) => s.trim());
      return items.map((s) => `<span class="pill ${typeClass}">${s}</span>`).join("");
    },
    renderLinks(arr) {
      if (!arr || arr.length === 0) return '<span class="pill">none</span>';
      return arr.map((id) => `<span class="pill interactive" onclick="window.SidebarManager.onItemClick('${id}')">${id.split("/").pop()}</span>`).join("");
    }
  };

  // docs/js/ui/sidebar-manager.js
  var SidebarManager = {
    init() {
      const DATA = window.ARCHITECTURE_DATA;
      document.getElementById("fileCount").innerText = `${DATA.length} modules`;
      this.renderTree(DATA);
      this.bindSearch(DATA);
    },
    renderTree(DATA) {
      const container = document.getElementById("sidebar");
      const tree = {};
      DATA.forEach((file) => {
        const parts = file.path.split("/");
        let current = tree;
        parts.forEach((part, i) => {
          if (!current[part]) current[part] = { _files: [] };
          if (i === parts.length - 1) {
            current[part]._file = file;
          }
          current = current[part];
        });
      });
      function buildHTML(node, pathStr) {
        let html = "";
        for (const key in node) {
          if (key.startsWith("_")) continue;
          const hasFile = !!node[key]._file;
          const fullPath = pathStr ? `${pathStr}/${key}` : key;
          if (hasFile) {
            html += `<div class="tree-item file-item" data-id="${fullPath}" onclick="window.SidebarManager.onItemClick('${fullPath}')">
                     <i data-lucide="file-code"></i> <span>${key}</span>
                   </div>`;
          } else {
            html += `<div class="tree-folder">
                     <div class="tree-item folder-item" onclick="this.nextElementSibling.classList.toggle('open')">
                       <i data-lucide="folder" class="folder-icon"></i> <span>${key}</span>
                     </div>
                     <div class="tree-children open">${buildHTML(node[key], fullPath)}</div>
                   </div>`;
          }
        }
        return html;
      }
      container.innerHTML = buildHTML(tree, "");
      if (window.lucide) window.lucide.createIcons();
    },
    onItemClick(id) {
      this.setActive(id);
      if (window.GraphEngine) {
        window.GraphEngine.clearHighlights();
        if (window.GraphEngine.cy) {
          window.GraphEngine.cy.elements().addClass("locked");
        }
        window.GraphEngine.highlightNode(id, true);
      }
      if (window.DetailsPanel) {
        window.DetailsPanel.open(id);
      }
    },
    setActive(id) {
      document.querySelectorAll(".tree-item").forEach((el) => el.classList.remove("active"));
      const item = document.querySelector(`.file-item[data-id="${id}"]`);
      if (item) {
        item.classList.add("active");
        item.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    clearActive() {
      document.querySelectorAll(".tree-item").forEach((el) => el.classList.remove("active"));
    },
    bindSearch(DATA) {
      document.getElementById("search").addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll(".file-item").forEach((el) => {
          const id = el.getAttribute("data-id").toLowerCase();
          let match = id.includes(q);
          if (!match && q.length > 2) {
            const file = DATA.find((f) => f.path.toLowerCase() === id);
            if (file) {
              const fullText = `${file.purpose} ${file.exports} ${file.targets} ${file.storage}`.toLowerCase();
              match = fullText.includes(q);
            }
          }
          if (match) {
            el.classList.remove("search-hidden");
            let parent = el.parentElement;
            while (parent && parent.classList.contains("tree-children")) {
              parent.classList.add("open");
              parent = parent.parentElement.parentElement;
            }
          } else {
            el.classList.add("search-hidden");
          }
        });
      });
    }
  };

  // docs/js/graph/styles.js
  var GraphStyles = [
    // Basic File Node
    {
      selector: ".file-node",
      style: {
        "label": "data(label)",
        "background-color": "data(color)",
        "background-opacity": 0.9,
        "shape": "data(shape)",
        "color": "#f8fafc",
        "font-size": "10px",
        "font-family": '"Inter", sans-serif',
        "text-valign": "bottom",
        "text-halign": "center",
        "text-margin-y": 6,
        "text-outline-color": "#09090b",
        "text-outline-width": 2,
        "width": 24,
        "height": 24,
        "border-width": 1,
        "border-color": "#ffffff",
        "border-opacity": 0.3,
        "transition-property": "background-color, border-width",
        "transition-duration": 0.2
      }
    },
    // Edges
    {
      selector: ".dependency-edge",
      style: {
        "width": 1.5,
        "line-color": "#ffffff",
        "target-arrow-color": "#ffffff",
        "opacity": 0.15,
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        "arrow-scale": 1.2
      }
    },
    // Interaction States: Dimming
    {
      selector: "node.dim, edge.dim",
      style: {
        "opacity": 0.05
      }
    },
    // Interaction States: Focus Node
    {
      selector: ".file-node.highlight",
      style: {
        "border-color": "#fff",
        "border-width": 3,
        "underlay-color": "data(color)",
        "underlay-padding": 10,
        "underlay-opacity": 0.6,
        "underlay-shape": "ellipse",
        "opacity": 1
      }
    },
    // Interaction States: Focus Edges
    {
      selector: "edge.highlight-in",
      style: {
        "line-color": "#60A5FA",
        // Blue incoming
        "target-arrow-color": "#60A5FA",
        "width": 2.5,
        "opacity": 0.9,
        "z-index": 10
      }
    },
    {
      selector: "edge.highlight-out",
      style: {
        "line-color": "#F472B6",
        // Pink outgoing
        "target-arrow-color": "#F472B6",
        "width": 2.5,
        "opacity": 0.9,
        "line-style": "dashed",
        "line-dash-pattern": [6, 4],
        "z-index": 10
      }
    }
  ];

  // docs/js/graph/builder.js
  function buildElements(data, themeUtils) {
    const elements = [];
    data.forEach((f) => {
      const weight = (f.depends ? f.depends.length : 0) + (f.dependedBy ? f.dependedBy.length : 0);
      const ext = f.path.substring(f.path.lastIndexOf("."));
      elements.push({
        data: {
          id: f.path,
          label: f.path.split("/").pop(),
          color: themeUtils ? themeUtils.stringToColor(f.category) : "#60A5FA",
          shape: themeUtils ? themeUtils.getShape(ext) : "ellipse",
          weight
        },
        classes: "file-node"
      });
    });
    const dataPaths = new Set(data.map((f) => f.path));
    data.forEach((f) => {
      if (f.depends) {
        f.depends.forEach((dep) => {
          if (dataPaths.has(dep)) {
            elements.push({
              data: {
                id: `${f.path}->${dep}`,
                source: f.path,
                target: dep
              },
              classes: "dependency-edge"
            });
          }
        });
      }
    });
    return elements;
  }

  // docs/js/graph/events.js
  function bindGraphEvents(cy, sidebarManager, detailsPanel) {
    cy.on("mouseover", "node.file-node", (e) => {
      const node = e.target;
      document.getElementById("cy").style.cursor = "pointer";
      if (cy.elements().hasClass("locked")) return;
      highlightNode(cy, node.id(), false);
    });
    cy.on("mouseout", "node.file-node", (e) => {
      document.getElementById("cy").style.cursor = "default";
      if (cy.elements().hasClass("locked")) return;
      clearHighlights(cy);
    });
    cy.on("tap", "node.file-node", (e) => {
      const id = e.target.id();
      clearHighlights(cy);
      cy.elements().addClass("locked");
      highlightNode(cy, id, true);
      if (sidebarManager) sidebarManager.setActive(id);
      if (detailsPanel) detailsPanel.open(id);
    });
    cy.on("tap", (e) => {
      if (e.target === cy) {
        cy.elements().removeClass("locked");
        clearHighlights(cy);
        if (sidebarManager) sidebarManager.clearActive();
        if (detailsPanel) detailsPanel.close();
      }
    });
  }
  function highlightNode(cy, id, animateCam = false) {
    if (!cy) return;
    const node = cy.getElementById(id);
    if (node.length === 0) return;
    const inEdges = node.incomers("edge");
    const outEdges = node.outgoers("edge");
    const neighbors = node.neighborhood("node");
    cy.elements().removeClass("highlight dim highlight-in highlight-out").addClass("dim");
    node.removeClass("dim").addClass("highlight");
    neighbors.removeClass("dim");
    inEdges.removeClass("dim").addClass("highlight-in");
    outEdges.removeClass("dim").addClass("highlight-out");
    if (animateCam) {
      cy.animate({
        fit: {
          eles: cy.collection().add(node).add(neighbors),
          padding: 80
        },
        duration: 500,
        easing: "ease-out-cubic"
      });
    }
  }
  function clearHighlights(cy) {
    if (!cy) return;
    cy.elements().removeClass("highlight dim highlight-in highlight-out locked");
  }

  // docs/js/graph/engine.js
  var GraphEngine = {
    cy: null,
    init() {
      const DATA = window.ARCHITECTURE_DATA;
      if (DATA.length === 0) {
        document.getElementById("loader").innerHTML = "No data found. Run generator script.";
        return;
      }
      const elements = buildElements(DATA, window.ThemeUtils);
      this.cy = window.cytoscape({
        container: document.getElementById("cy"),
        elements,
        style: GraphStyles,
        layout: {
          name: "cose",
          idealEdgeLength: 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 50,
          randomize: true,
          componentSpacing: 100,
          nodeRepulsion: 4e5,
          edgeElasticity: 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1e3,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1
        },
        zoom: 1,
        minZoom: 0.1,
        maxZoom: 2.5
      });
      this.cy.on("layoutstop", () => {
        document.getElementById("loader").style.display = "none";
      });
      setTimeout(() => {
        document.getElementById("loader").style.display = "none";
      }, 500);
      bindGraphEvents(this.cy, window.SidebarManager, window.DetailsPanel);
    },
    // Expose these methods in case other modules need to trigger highlights programmatically
    highlightNode(id, animateCam = false) {
      highlightNode(this.cy, id, animateCam);
    },
    clearHighlights() {
      clearHighlights(this.cy);
    }
  };

  // docs/js/main.js
  window.ThemeUtils = ThemeUtils;
  window.DetailsPanel = DetailsPanel;
  window.SidebarManager = SidebarManager;
  window.GraphEngine = GraphEngine;
  window.addEventListener("DOMContentLoaded", () => {
    SidebarManager.init();
    GraphEngine.init();
    if (window.lucide) window.lucide.createIcons();
  });
})();
