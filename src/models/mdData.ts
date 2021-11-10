interface IMdData{
    idx: number;
    md: string;
    title: string;
    category: Array<string>;
}

interface IMdTree{
    id: number;
    name: string;
    mdData?: IMdData;
    children: Array<IMdTree>;
}

export {
    IMdData,
    IMdTree,
}