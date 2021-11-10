import Prism from 'prismjs';
// (Prism as any).manual = true
import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism-coy.css'
// import 'prismjs/themes/prism-dark.css'
// import 'prismjs/themes/prism-funky.css'
// import 'prismjs/themes/prism-okaidia.css'
// import 'prismjs/themes/prism-solarizedlight.css'
// import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/themes/prism-twilight.css'
import loadLanguages from 'prismjs/components/'
// 當 babel.config.js 也有 import 時
// 會變成 force load all language
// console.log(Prism)
// console.log(loadLanguages)

const AddDataLine = (selectorRoot = "article.markdown-body") => {
    document.querySelectorAll(`${selectorRoot} code[class*=":line="]`).forEach( (el) => {
        let dataLineSetting = ""
        for (let idx = 0; idx < el.classList.length; idx++) {
            const className = el.classList[idx];
            const dataLineSettingMatches = className.match(/[^']+(?=(' ')|'$)/g);
            if (dataLineSettingMatches?.length && dataLineSettingMatches.length > 0) {
                dataLineSetting = dataLineSettingMatches[0]
                break
            }
        }

        const parent = el.parentElement
        if (dataLineSetting && parent && parent.tagName.toLowerCase() === 'pre') {
            parent.setAttribute("data-line", dataLineSetting)
        }
        // parent?.setAttribute("data-line", dataLineSetting)
    })
}

const ChangeLineNumberDomPosition = () => {
    const isRightTargetParent = (el: HTMLElement) => el.tagName.toLowerCase() === 'div' && el.classList.contains('code-toolbar')
    document.querySelectorAll("span.line-numbers-rows").forEach(el => {
        const targetParent = el.parentElement?.parentElement?.parentElement as HTMLElement
        if( !isRightTargetParent(targetParent) ){
            return
        }

        const newNode = el.cloneNode(true) as HTMLElement
        el.classList.add("reset-code-number")
        newNode.classList.add("code-line-numbers-rows")
        targetParent.appendChild(newNode)
        const backgroundNode = document.createElement('div')
        backgroundNode.classList.add("code-line-numbers-bg")
        targetParent.appendChild(backgroundNode)
    })

    document.querySelectorAll("div.line-highlight").forEach(el => {
        const targetParent = el.parentElement?.parentElement as HTMLElement
        if( !isRightTargetParent(targetParent) ){
            return
        }

        const newNode = el.cloneNode(true) as HTMLElement
        newNode.classList.add("code-line-highlight")
        targetParent.appendChild(newNode)
    })
}

export {
    Prism,
    AddDataLine,
    ChangeLineNumberDomPosition,
}