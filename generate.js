var fs = require('fs'),
    path = require('path'),
    url = require('url'),
    marked = require('marked'),
    mkdirp = require('mkdirp'),
    glob = require('glob'),

    outputFolder = 'output',
    contentFolder = 'content',
    bundleName = 'index',
    pathToBundle = path.join('desktop.bundles', bundleName),

    model = require(path.resolve('.', contentFolder, 'model')),
    BEMTREE = require(path.resolve('.', pathToBundle, bundleName + '.bemtree')).BEMTREE,
    BEMHTML = require(path.resolve('.', pathToBundle, bundleName + '.bemhtml')).BEMHTML;

mkdirp.sync(path.join(outputFolder, 'i'));

fs.writeFileSync(path.join(outputFolder, 'CNAME'), 'tam-maslov.ru');
fs.writeFileSync(path.join(outputFolder, '.nojekyll'), '');

glob.sync(path.join(contentFolder, '{favicons,files}', '*')).forEach(function(iconPath) {
    fs.createReadStream(iconPath).pipe(fs.createWriteStream(path.join(outputFolder, iconPath.split('/').pop())));
});

['min.js', 'min.css'].forEach(function(ext) {
    fs.createReadStream(path.join(pathToBundle, bundleName + '.' + ext))
        .pipe(fs.createWriteStream(path.join(outputFolder, bundleName + '.' + ext)));
});

glob.sync(path.join(contentFolder, 'images', '*')).forEach(function(image) {
    fs.createReadStream(image).pipe(fs.createWriteStream(path.join(outputFolder, 'i', path.basename(image))));
});

// collect portfolio data and copy images
var galleries = {
    implemented: {},
    projects: {}
};

var portfolioImagesGlob = path.join(contentFolder, 'portfolio', '{' + Object.keys(galleries).join() + '}', '*', '*');

glob.sync(portfolioImagesGlob).forEach(function(imagePath) {
    var projectDir = path.dirname(imagePath),
        projectName = path.basename(projectDir),
        categoryName = path.basename(path.dirname(projectDir)),
        destImagePath = path.join('portfolio', categoryName, projectName, path.basename(imagePath));

    mkdirp.sync(path.join(outputFolder, 'portfolio', categoryName, projectName));
    galleries[categoryName][projectName] || (galleries[categoryName][projectName] = []);
    galleries[categoryName][projectName].push(destImagePath);

    fs.createReadStream(imagePath).pipe(fs.createWriteStream(path.join(outputFolder, destImagePath)));
});

// populate model with portfolio pages
Object.keys(galleries).forEach(function(categoryName) {
    var projects = galleries[categoryName];

    Object.keys(projects).forEach(function(projectName) {
        var images = galleries[categoryName][projectName];

        var pageUrl = ['portfolio', categoryName, projectName].join('/'),
            pageFolder = path.join(outputFolder, 'portfolio', categoryName, projectName),
            pageFilename= path.join(pageFolder, 'index.html');

        model.push({
            md: [
                '## ' + projectName,
                '%%%gallery:' + categoryName + ':' + projectName + '%%%'
            ].join('\n'),
            url: pageUrl,
            title: projectName
        });
    });
});

model.forEach(function(page) {
    var html = '',
        pageFolder = path.join(outputFolder, page.url),
        pageFilename= path.join(pageFolder, 'index.html'),
        relPathToRoot = page.url ? page.url.split('/').map(function() {
            return '../';
        }).join('') : '';

    mkdirp.sync(pageFolder);

    if (page.html) {
        html = page.html;
    } else if (page.md) {
        html = marked(page.md);
    } else if (page.source && page.source.indexOf('.md') > -1) {
        var md = fs.readFileSync(path.join(contentFolder, page.source), 'utf8');
        html = marked(md);
    }

    html = replaceGalleryTags(html, relPathToRoot);

    fs.writeFileSync(pageFilename, BEMHTML.apply(BEMTREE.apply({
        block: 'root',
        data: {
            url: page.url,
            relPathToRoot: relPathToRoot,
            pages: model,
            content: html
        }
    })));
});

function replaceGalleryTags(html, relPathToRoot) {
    return html.replace(/%%%gallery:(\w+):(\w+)%%%/g, function(str, category, project) {
        var projectImages = galleries[category] && galleries[category][project];

        return buildFotoramaHtml(category, project, projectImages, relPathToRoot);
    });
}

function buildFotoramaHtml(category, project, images, relPathToRoot) {
    if (!images || !images.length) return '';

    var captions = {};

    try {
        captions = require('./' + path.join('content', 'portfolio',  category, project));
    } catch(err) {}

    return BEMHTML.apply({
        block: 'fotorama',
        js: {
            nav: 'thumbs',
            allowfullscreen: true,
            width: '450px',
            maxheight: '450px',
            thumbwidth: 128,
            thumbheight: 128
        },
        content: images.map(function(img) {
            var imageName = img.split('/').pop().split('.')[0];

            return {
                tag: 'img',
                attrs: {
                    src: relPathToRoot + img,
                    'data-thumb': relPathToRoot + img,
                    'data-caption': captions[imageName]
                }
            };
        })
    });
}

console.log('Site was generated at', path.resolve(outputFolder));
