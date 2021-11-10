import $ from 'jquery'

interface IGenerateChapterOptions{
    target: string;
    chapterLength: number;
}

function GenerateChapter(config?: IGenerateChapterOptions){
    const _config = {...config}
    const target = _config.target || "article"
    const chapterLength = _config.chapterLength || 3
    const chapterList = [0,0,0,0,0,0]

    function GenChapterPrefix(chapterList: Array<number>, chapterLength: number){
        const chapterPrefix = []
        for (let i = 0; i<chapterLength; i++ ) {
            chapterPrefix.push(chapterList[i])
        }
        for (let i = chapterLength-1 ; i > 0; i--) {
            if(chapterPrefix[i] == 0){
                chapterPrefix.pop()
            }else{
                break
            }
        }
        return chapterPrefix.join(".")
    }
    
    let currentHeaderLevel = 0
    $(target+" :header").each(function(){
        const tagName = $(this).prop("tagName")
        const headerLevel = tagName.replace("H","") - 1
        if (headerLevel < chapterLength) {
            let headerString = $(this).text()

            if (currentHeaderLevel == headerLevel) {
                chapterList[currentHeaderLevel]++
            }else if( currentHeaderLevel < headerLevel ){
                currentHeaderLevel++
                chapterList[currentHeaderLevel] = 1
            }else{ // currentHeaderLevel > headerLevel
                for (let i = currentHeaderLevel; i > headerLevel; i--) {
                    chapterList[i] = 0
                }
                currentHeaderLevel = headerLevel
                chapterList[currentHeaderLevel]++
            }

            headerString = GenChapterPrefix(chapterList,chapterLength) + " " + headerString
            $(this).text(headerString)
        }        
    })
}

export {
    GenerateChapter,
    IGenerateChapterOptions,
}