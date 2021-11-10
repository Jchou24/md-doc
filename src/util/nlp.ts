import { IMdData, IMdTree } from "@/models/mdData";

const Search = (contents: Array<IMdData>, words: string) => {
    const GetTokens = () => words.split(" ").map( x => x.trim().toLowerCase() ).filter( x => x.length > 0 )
    const IsHit = (text: string, tokens: Array<string>) => tokens.filter( token => text.toLowerCase().search(token) >= 0 ).length > 0
    const matchIds = [] as Array<number>
    const tokens = GetTokens()

    contents.forEach( content => {
        // console.log( content, IsHit(content.title, tokens), IsHit(content.md, tokens) )
        const isHit = IsHit(content.title, tokens) || IsHit(content.md, tokens)
        if (isHit) {
            matchIds.push(content.idx)
        }
    })

    return matchIds
}

const FiltMdTreeByMdId = ( mdTree: Array<IMdTree>, mdIds: Array<number> ) => {
    const Filt = (currentMdTree: Array<IMdTree>) => {
        const tmp = [] as Array<IMdTree>
        currentMdTree.forEach( node => {
            if(node.mdData && mdIds.includes(node.mdData.idx)){
                tmp.push(node)
            }else{
                const filtedChildren = Filt(node.children)
                if (filtedChildren.length > 0) {
                    tmp.push({
                        ...node,
                        children: filtedChildren,
                    })
                }
            }
        })
        return tmp
    }

    return Filt(mdTree)
}

export {
    Search,
    FiltMdTreeByMdId,
}