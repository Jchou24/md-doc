import $ from 'jquery'

interface IHeaderInfo{
    id: string;
    tag: string;
    level: number;
    title: string;
    chaptor: string;
}

class TOCTree{
    element: HTMLElement | null
    isSetId: boolean
    isTitleAddChaptor: boolean
    headerTags: Array<string>
    idCount = 0

    constructor(elementSelector: string, isSetId=false, isTitleAddChaptor=true, level=3){
        this.element = document.querySelector(elementSelector)
        this.isSetId = isSetId
        this.isTitleAddChaptor = isTitleAddChaptor
        this.headerTags = []
        for( let i = 1; i <= level; i++ ){
            this.headerTags.push( 'h'+i )
        }
    }

    _GetId = () => `toc-${this.idCount++}`

    _IsHeader(tag: HTMLElement){
        if( tag && tag.localName ){
            for( const h of this.headerTags ){
                if( tag.localName.includes(h) ){
                    return true
                }
            }
        }
        return false
    }

    _IterChild(parent: HTMLElement){
        const headerInfos = [] as Array<IHeaderInfo>
        if( parent ){
            if( this._IsHeader(parent) ){
                const tmpid = this._GetId()
                let id = (parent.getAttribute("id") ? parent.getAttribute("id"): tmpid) as string
                if( this.isSetId ){
                    id = tmpid
                }
                parent.id = id

                if( this.isSetId ){
                    parent.id = tmpid
                }
                headerInfos.push({
                    id: id,
                    tag: parent.localName,
                    level: parseInt( parent.localName.slice(-1) ),
                    title: $.trim(parent.textContent as string),
                    chaptor: "",
                })
            }
            for( const child of parent.childNodes ){
                headerInfos.push(...this._IterChild(child as HTMLElement))
            }
        }
        return headerInfos
    }

    _CountChaptor(toc: Array<IHeaderInfo>){
        const chapterList = [0,0,0,0,0,0]
        let previousLevel = 0;
        toc.forEach(t => {
            const level = t.level - 1
            chapterList[level] += 1
            if( previousLevel > level ){
                chapterList[previousLevel] = 0
            }
            
            const chaptor = [] as Array<number>
            for( let i = 0; i <= level; i++  ){
                chaptor.push(chapterList[i])
            }
            t.chaptor = chaptor.join(".")+"."
            previousLevel = level
        });
    }

    _RenameTitle(toc: Array<IHeaderInfo>){
        toc.forEach( x => {
            const el = document.getElementById(x.id) as HTMLElement
            el.innerText = `${x.chaptor} ${x.title}`
        })
    }

    Fit(){
        let toc = [] as IHeaderInfo[]
        if (this.element) {
            toc = this._IterChild(this.element)
        }
        this._CountChaptor(toc)

        if (this.isTitleAddChaptor) {
            this._RenameTitle(toc)
        }
        return toc
    }
}

export {
    TOCTree,
    IHeaderInfo,
}