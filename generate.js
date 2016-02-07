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
    BEMHTML = require(path.resolve('.', pathToBundle, bundleName + '.bemhtml')).BEMHTML,
    galleries = {
        implemented: {},
        projects: {}
    };

mkdirp.sync(path.join(outputFolder, 'i'));

fs.writeFileSync(path.join(outputFolder, 'CNAME'), 'tam-maslov.ru');

glob.sync(path.join(contentFolder, '{favicons,files}', '*')).forEach(function(iconPath) {
    fs.createReadStream(iconPath).pipe(fs.createWriteStream(path.join(outputFolder, iconPath.split('/').pop())));
});

glob.sync(path.join(contentFolder, 'portfolio', '{implemented,projects}', '*', '*')).forEach(function(imagePath) {
    var projectDir = path.dirname(imagePath),
        projectName = path.basename(projectDir),
        categoryName = path.basename(path.dirname(projectDir)),
        destImagePath = path.join('portfolio', categoryName, projectName, path.basename(imagePath));

    mkdirp.sync(path.join(outputFolder, 'portfolio', categoryName, projectName));
    galleries[categoryName][projectName] || (galleries[categoryName][projectName] = []);
    galleries[categoryName][projectName].push(destImagePath);

    fs.createReadStream(imagePath).pipe(fs.createWriteStream(path.join(outputFolder, destImagePath)));
});

['min.js', 'min.css'].forEach(function(ext) {
    fs.createReadStream(path.join(pathToBundle, bundleName + '.' + ext))
        .pipe(fs.createWriteStream(path.join(outputFolder, bundleName + '.' + ext)));
});

glob.sync(path.join(contentFolder, 'images', '*')).forEach(function(image) {
    fs.createReadStream(image).pipe(fs.createWriteStream(path.join(outputFolder, 'i', path.basename(image))));
});

model.forEach(function(page) {
    var html = '',
        pageFolder = path.join(outputFolder, page.url),
        pageFilename= path.join(pageFolder, 'index.html'),
        relPathToRoot = page.url ? '../' : '';

    mkdirp.sync(pageFolder);

    if (page.source.indexOf('.md') > -1) {
        var md = fs.readFileSync(path.join(contentFolder, page.source), 'utf8');
        html = marked(md);
    }

    html = html.replace(/%%%gallery:(\w+):(\w+)%%%/g, function(str, category, project) {
        var projectImages = galleries[category] && galleries[category][project];

        if (!projectImages || !projectImages.length) return '';

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
            content: projectImages.map(function(img) {
                return {
                    tag: 'img',
                    attrs: {
                        src: relPathToRoot + img,
                        'data-thumb': relPathToRoot + img
                    }
                };
            })
        })
    });

    fs.writeFileSync(pageFilename, BEMHTML.apply(BEMTREE.apply({
        block: 'root',
        data: {
            url: page.url,
            relPathToRoot: relPathToRoot,
            pages: model,
            content: html,
            galleries: galleries
        }
    })));
});

console.log('Site was generated at', path.resolve(outputFolder));
