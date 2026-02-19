tsParticles.load("tsparticles", {
    background: { color: "transparent" },
    fpsLimit: 60,
    particles: {
        number: { value: 60 },
        color: { value: "#38bdf8" },
        shape: { type: "circle" },
        opacity: { value: 0.6 },
        size: { value: { min: 1, max: 3 } },
        links: {
            enable: true,
            distance: 130,
            color: "#38bdf8",
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            outModes: { default: "out" }
        }
    }
});
