import {$} from "../utils/domUtils.js";
import {JSCarousel} from "../components/carousel.js";

function buildProject(){
    const id = getURLParams();
    getExtendedProjectById(id).then(project => {
        document.title = project.title;
        buildProjectPage(project);
        console.log(project);
    });
}

async function getProjectData(){
    const response = await fetch('data/projects.json');
    return await response.json();
}

async function getExtendedProjectById(id){
    const projects = await getProjectData();
    return projects['full-page-project'].find(project => project.id === id);
}

function getURLParams(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id? Number(id) : null;
}

function buildProjectPage(projectData){
    buildProjectPageBannerSection(projectData);
    buildProjectPageTechnologies(projectData);
    buildFeaturesSection(projectData);
}

function buildProjectPageBannerSection(projectData){
    buildProjectTitle(projectData);
    const projectDescription = $('.project__description');
    const projectImage = $('.project__image img');

    projectDescription.innerText = projectData['description'];
    projectImage.src = projectData['image'];
    projectImage.alt = projectData['title'];
}

function buildProjectTitle(projectData){
    const titleHeader = $('.project__title');
    const title = projectData['title'];
    title.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        if (char === ' ') {
            span.style.width = '0.5em';
        }
        span.style.animationDelay = `${index * 0.1}s`;
        titleHeader.appendChild(span);
    })
}

function buildProjectPageTechnologies(projectData) {
    const technologiesList = $('.technologies__list');
    const technologies = projectData['technologies'];
    technologies.forEach(technology => {
        const technologyItem = buildTechnology(technology);
        technologiesList.appendChild(technologyItem);
    });
}

function buildTechnology(technology){
    const technologyItem = document.createElement('li');
    const image = document.createElement('img');
    image.src = technology.icon;
    image.alt = technology.name;
    technologyItem.appendChild(image);
    return technologyItem;
}

function buildFeaturesSection(projectData){
    const featuresData = projectData['features'];
    buildFeaturesTitle(featuresData);
    buildFeaturesList(featuresData);
}

function buildFeaturesTitle(featuresData){
    const featuresTitle = $('.features__text h3');
    featuresTitle.innerText = featuresData.title;
}

function buildFeaturesList(featuresData){
    const featuresListItems = $('.features__list');
    const carousel = $('#carousel-1');
    featuresData.items.forEach(feature => {
        const featureItem = buildFeatureItem(feature);
        featuresListItems.appendChild(featureItem);
        const carouselItem = buildCarouselItem(feature);
        carousel.appendChild(carouselItem);
    });
    initCarousel();
}

function buildFeatureItem(feature){
    const featureItem = document.createElement('li');
    featureItem.innerText = feature.description;
    return featureItem;
}

function buildCarouselItem(feature){
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('slide');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-labelledby', 'carousel-1-slide-1-title');
    carouselItem.innerHTML = `
        <div class="slide-content">
            <div class="slide-caption">
                <h3 id="carousel-1-slide-1-title">${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
            <img class="slide-img" src="${feature.image}" alt="${feature.title}" width="800" height="350" />
        </div>
    `;
    return carouselItem;
}

function initCarousel(){
    const carousel = JSCarousel({
        carouselSelector: "#carousel-1",
        slideSelector: ".slide",
        enablePagination: true
    });
    carousel.create();
}

buildProject();