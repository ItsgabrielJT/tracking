const kpis = {
  active: [128, 131, 129, 134, 132],
  alerts: [4, 3, 5, 2, 4],
  deliveries: [312, 318, 326, 334, 329],
};

if (window.gsap) {
  gsap.registerPlugin(window.ScrollTrigger);

  const loadTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  loadTl
    .from(".topbar", { y: -24, opacity: 0, duration: 0.55 })
    .from(".hero-copy .eyebrow", { y: 28, opacity: 0, duration: 0.45 }, "-=0.2")
    .from(".hero-copy h1", { y: 34, opacity: 0, duration: 0.65 }, "-=0.2")
    .from(".hero-copy .lead", { y: 22, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(".hero-copy .hero-ctas .btn", { y: 16, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.3")
    .from(".hero-copy .hero-points li", { x: -14, opacity: 0, duration: 0.35, stagger: 0.08 }, "-=0.25")
    .from(".hero-panel", { y: 32, opacity: 0, scale: 0.98, duration: 0.75 }, "-=0.55")
    .from(".kpi-row article", { y: 18, opacity: 0, duration: 0.35, stagger: 0.1 }, "-=0.45");

  const sections = [
    ".impact-card",
    ".module-grid article",
    ".stitch-card",
    ".tour-panel",
    ".pricing-grid article",
    ".ecuador-grid article",
    ".cta h2",
    ".cta p",
    ".cta-form > *",
    "footer p",
  ];

  sections.forEach((selector) => {
    gsap.utils.toArray(selector).forEach((element) => {
      gsap.fromTo(
        element,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });
  });

  gsap.to(".bg-grid", {
    backgroundPosition: "40px 40px",
    duration: 14,
    ease: "none",
    repeat: -1,
  });
}

const activeEl = document.getElementById("kpi-active");
const alertsEl = document.getElementById("kpi-alerts");
const deliveriesEl = document.getElementById("kpi-deliveries");

let tick = 0;

setInterval(() => {
  tick = (tick + 1) % kpis.active.length;
  activeEl.textContent = String(kpis.active[tick]);
  alertsEl.textContent = String(kpis.alerts[tick]).padStart(2, "0");
  deliveriesEl.textContent = String(kpis.deliveries[tick]);
}, 2200);

const mapContainer = document.getElementById("live-map");
const mapCanvas = document.querySelector(".map-canvas");
const mapToken = typeof window.MAPBOX_PUBLIC_TOKEN === "string" ? window.MAPBOX_PUBLIC_TOKEN.trim() : "";

if (mapContainer && mapCanvas && window.mapboxgl && mapToken) {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "live-map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [-78.4874, -0.1815],
    zoom: 16.9,
    pitch: 68,
    bearing: 18,
    antialias: true,
    interactive: true,
  });

  map.on("style.load", () => {
    map.addLayer({
      id: "geopulse-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": "#d6d1c8",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
        "fill-extrusion-opacity": 0.72,
      },
    }, "waterway-label");

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
  });

  window.geopulseMap = map;

  map.on("idle", () => {
    mapCanvas.classList.add("map-ready");
  });

  map.on("error", () => {
    mapCanvas.classList.remove("map-ready");
  });
} else if (mapCanvas) {
  mapCanvas.classList.remove("map-ready");
}

