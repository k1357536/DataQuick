const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*)/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

interface LoadData {
  name: string;
  address: string;
  source: string;
}

module.exports.translate = function(load: LoadData) {
  if (load.source.indexOf('moduleId') !== -1)
    return load;

  let url = document.createElement('a');
  url.href = load.address;

  let basePathParts = url.pathname.split('/');

  basePathParts.pop();
  let basePath = basePathParts.join('/');

  let baseHref = document.createElement('a');
  baseHref.href = this.baseURL;
  let baseHrefPath = baseHref.pathname;

  if (!baseHrefPath.startsWith('/base/')) // it is not karma
    basePath = basePath.replace(baseHrefPath, '');

  load.source = load.source.replace(templateUrlRegex, (match, quote, url) => {
    let resolvedUrl = url;

    if (url.startsWith('.'))
      resolvedUrl = basePath + url.substr(1);

    return 'templateUrl: "' + resolvedUrl + '"';
  }).replace(stylesRegex, (match: string, relativeUrls: string) => {
    let urls = [];
    let urlMatch = stringRegex.exec(relativeUrls);
    while (urlMatch !== null) {
      if (urlMatch[2].startsWith('.'))
        urls.push('"' + basePath + urlMatch[2].substr(1) + '"');
      else
        urls.push('"' + urlMatch[2] + '"');

      urlMatch = stringRegex.exec(relativeUrls);
    }

    return 'styleUrls: [' + urls.join(', ') + ']';
  });

  return load;
};
