const components = require('prismjs/components');
const allLanguages = Object.keys(components.languages).filter((item) => item !== 'meta');

// console.log( allLanguages )

module.exports = {
    presets: [
       '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        ["prismjs", {
            "languages": allLanguages,
            "plugins": [
                "line-highlight",
                "line-numbers",
                "autolinker",
                "show-language",
                "inline-color",
                "previewers",
                "autoloader",
                "toolbar",
                "copy-to-clipboard",
                "match-braces",
                "treeview",
                "diff-highlight",
            ],
            "theme": "okaidia",
            "css": true
        }]
    ]
}
