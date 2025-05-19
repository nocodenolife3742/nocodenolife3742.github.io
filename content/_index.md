---
title: "Home"
layout: "hextra-home"
---

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

:root {
    --terminal-primary-text:rgb(189, 200, 211);
    --terminal-secondary-text:rgb(93, 184, 101);
    --terminal-content-text:rgb(219, 231, 242);
    --terminal-cursor-color:rgb(98, 123, 148);
}

.intro-section {
    padding: 0 10px;
    text-align: left;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', 'Menlo', 'Courier New', Courier, monospace;
    word-break: break-all;
    overflow-wrap: break-all;
}

.intro-section .intro-heading {
    font-size: 2rem;
    font-weight: bold;
    color: var(--terminal-secondary-text);
    margin-bottom: 20px;
    line-height: 1.2;
    min-height: 1.2em;
    position: relative;
}

.intro-section .intro-heading::before {
    content: "eric@localhost:~$ ";
    color: var(--terminal-secondary-text);
}

.intro-section #typed-text {
    color: var(--terminal-primary-text);
    font-weight: bold;
}

.intro-section .cursor {
    display: inline-block;
    width: 7px;
    background-color: var(--terminal-cursor-color);
    animation: blink 1.0s infinite;
    margin-left: 3px;
    height: 1em;
    vertical-align: -0.12em;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

.intro-section .intro-paragraph,
#grid-container {
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--terminal-content-text);
    line-height: 1.65;
    margin-bottom: 20px;
    max-width: 100%;
    opacity: 0;
    transform: translateY(15px);
    transition: opacity 0.7s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform 0.7s 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.intro-section .intro-paragraph.visible,
#grid-container.visible {
    opacity: 1;
    transform: translateY(0);
}

@media (max-width: 500px) {
    .intro-section .intro-heading {
        font-size: 1.5rem;
    }
    .intro-section .intro-paragraph {
        line-height: 1.45rem;
        font-size: 1rem;
    }
    .intro-section .intro-heading::before {
        content: "";
    }
    .intro-section .cursor {
        width: 4px;
        height: 0.9em;
        margin-left: 2px;
    }
}

</style>

<div class="intro-section">
    <h1 class="intro-heading">
        <span id="typed-text"></span><span class="cursor"></span>
    </h1>
    <p class="intro-paragraph">
        I'm a software engineer who loves building elegant, user-focused digital experiences. I enjoy solving problems, writing clean code, and creating scalable solutions that make a real impact.
    </p>
</div>

<div id="grid-container">
{{< hextra/feature-grid cols="3" >}}
    {{< hextra/feature-card
        icon="briefcase"
        title="Portfolio"
        subtitle="Explore my projects and contributions in software development, creative problem solving, and building impactful digital experiences."
        link="/portfolio/"
    >}}
    {{< hextra/feature-card
        icon="user"
        title="About Me"
        subtitle="Learn about my background, interests, and journey as a developer, and discover what drives my passion for technology."
        link="/about/"
    >}}
    {{< hextra/feature-card
        icon="pencil"
        title="Blog"
        subtitle="Read my thoughts and insights on technology, design, and the digital landscape, reflecting my passion for learning."
        link="/blog/"
    >}}
{{< /hextra/feature-grid >}}
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
    const typedTextSpan = document.getElementById("typed-text");
    const introParagraph = document.querySelector(".intro-section .intro-paragraph");
    const introHeading = document.querySelector(".intro-section .intro-heading");
    const gridContainer = document.getElementById("grid-container");
    const roles = ["Chung-Yu, Cheng.", "a passionate developer.", "a creative thinker.", "a problem solver."];
    const typingDelay = 100;
    const erasingDelay = 70;
    const delayAfterTypingRole = 4000;
    const delayAfterErasing = 500;
    const smallScreenWidth = 1200;

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeString(element, str) {
        for (const char of str) {
            element.textContent += char;
            await delay(typingDelay);
        }
    }

    async function eraseString(element, keepStaticPartLength) {
        const currentText = element.textContent;
        for (let i = currentText.length; i > keepStaticPartLength; i--) {
            element.textContent = currentText.substring(0, i - 1);
            await delay(erasingDelay);
        }
    }

    async function waitForScreenResize() {
        while (window.innerWidth <= smallScreenWidth) {
            await delay(100);
        }
    }
    
    async function animateIntro() {
        if (!typedTextSpan || !introParagraph || !introHeading || !gridContainer) {
            console.error("Required elements for intro animation not found (typedTextSpan, introParagraph, introHeading, or gridContainer).");
            return;
        }
        const staticPrefix = "Hello, I'm ";
        await typeString(typedTextSpan, staticPrefix);
        let roleIndex = 0;
        await typeString(typedTextSpan, roles[roleIndex]);
        introParagraph.classList.add("visible");
        gridContainer.classList.add("visible");
        await waitForScreenResize();
        await delay(delayAfterTypingRole);
        while (true) {
            await eraseString(typedTextSpan, staticPrefix.length);
            await delay(delayAfterErasing);   
            roleIndex = (roleIndex + 1) % roles.length;
            await typeString(typedTextSpan, roles[roleIndex]);
            await delay(delayAfterTypingRole);
            await waitForScreenResize();
        }
    }

    animateIntro();
});
</script>