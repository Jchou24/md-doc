import { IMdData, IMdTree } from "@/models/mdData";

const LoadMd = () => {
    const contents = [] as Array<IMdData>
    $('section.article').each((idx, element) => {
        contents.push({
            idx: idx,
            md: element.innerHTML,
            title: element.getAttribute("data-title") || `Doc-${idx+1}`,
            category: (element.getAttribute("data-category") || "").split("/"),
        })
    });

    if (contents.length === 0) {
        contents.push({
            idx: 0,
            md: "",
            title: "New Document",
            category: [""],
        })
    }
    return contents
}

const GetMdTree = (mdData: Array<IMdData>) => {
    interface ITree{
        [ key: string ]: ITreeNode;
    }

    interface ITreeNode{
        mdData: Array<IMdData>;
        children: ITree;
    }

    const GetCategoryTree = () => {
        const categoryTree = {} as ITree
        mdData.forEach( x => {
            let currentTree = categoryTree
            let currentTreeNode = undefined as ITreeNode | undefined
            x.category.forEach( category => {
                if(!currentTree[category]){
                    currentTree[category] = {
                        mdData: [],
                        children: {},
                    } as ITreeNode
                }
                currentTreeNode = currentTree[category]
                currentTree = currentTree[category].children
            });
            currentTreeNode?.mdData.push(x)
        })
        return categoryTree
    }

    const GetMdTree = (categoryTree: ITree) => {
        let nodeId = 0
        const BuildMdTree = (current: ITree, mdData: Array<IMdData>) => {
            let tmpMdTrees = [] as Array<IMdTree>
            if(mdData.length > 0){
                tmpMdTrees = [ ...tmpMdTrees, ...mdData.map(x => ({
                    id: nodeId++,
                    name: x.title,
                    mdData: x,
                    children: [],
                }) as IMdTree) ]
            }
            
            Object.keys(current).sort().forEach(currentKey => {
                const treeNode = current[currentKey]
                const tmp = [] as Array<IMdTree>
                const children = BuildMdTree(treeNode.children, treeNode.mdData)
                if (children.length > 0) {
                    tmp.push({
                        id: nodeId++,
                        name: currentKey,
                        mdData: undefined,
                        children,
                    })
                }
                tmpMdTrees = [ ...tmpMdTrees, ...tmp ]
            })

            return tmpMdTrees
        }

        return BuildMdTree(categoryTree, [])
    }
    const categoryTree = GetCategoryTree()
    const mdTree = GetMdTree(categoryTree)

    return mdTree
}

const GetMapperTreeId2MdId = (mdTree: IMdTree[], inverted = false) => {
    let mapper = {} as {[key: number]: number}
    const BuildMapper = (mdTree: IMdTree[]) => {
        mdTree.forEach(x => {
            if(x.mdData){
                mapper[x.id] = x.mdData?.idx
            }
            BuildMapper(x.children)
        })
    }

    BuildMapper(mdTree)
    if (inverted) {
        const tmp = {} as {[key: number]: number}
        Object.keys(mapper).forEach(k => {
            const key = parseInt(k)
            tmp[mapper[key]] = key
        })
        mapper = tmp
    }
    return mapper
}

export {
    LoadMd,
    GetMdTree,
    GetMapperTreeId2MdId,
}