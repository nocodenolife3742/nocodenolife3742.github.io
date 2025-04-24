document.addEventListener('DOMContentLoaded', () => {
    const projectGrid = document.getElementById('projectGrid');

    if (!projectGrid) {
        console.error("Project grid container not found!");
        return;
    }

    // Clear any existing placeholder content (if you had any)
    projectGrid.innerHTML = '';

    // Loop through the project data and create HTML for each project
    projectsData.forEach(project => {
        // Create the main card element
        const card = document.createElement('div');
        card.classList.add('project-card');

        // Create and add the image
        const img = document.createElement('img');
        img.classList.add('project-image');
        img.src = project.image;
        img.alt = `${project.title} screenshot`; // Add descriptive alt text
        card.appendChild(img);

        // Create the content container
        const content = document.createElement('div');
        content.classList.add('project-content');

        // Create and add the title
        const title = document.createElement('h2');
        title.textContent = project.title;
        content.appendChild(title);

        // Create and add the GitHub link
        const githubLink = document.createElement('a');
        githubLink.classList.add('github-link');
        githubLink.href = project.githubLink;
        githubLink.textContent = 'View on GitHub'; // Or 'Project Repository' etc.
        // Optional: Add icon if using Font Awesome
        // githubLink.innerHTML = '<i class="fab fa-github"></i> View on GitHub';
        githubLink.target = '_blank'; // Open in new tab
        githubLink.rel = 'noopener noreferrer'; // Security best practice
        content.appendChild(githubLink);

        // Create and add the description
        const description = document.createElement('p');
        description.classList.add('project-description');
        description.textContent = project.description;
        content.appendChild(description);

        // Create the tech bubbles container
        const bubblesContainer = document.createElement('div');
        bubblesContainer.classList.add('tech-bubbles');

        // Create and add each technology bubble
        project.technologies.forEach(tech => {
            const bubble = document.createElement('span');
            bubble.classList.add('tech-bubble');
            bubble.textContent = tech;
            bubblesContainer.appendChild(bubble);
        });
        content.appendChild(bubblesContainer); // Add bubbles container to content

        // Add the content container to the card
        card.appendChild(content);

        // Add the completed card to the grid
        projectGrid.appendChild(card);
    });
});