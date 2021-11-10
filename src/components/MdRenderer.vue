<template>
    <!-- <MdShowndown class="article pa-3" :content="content" :small="small" @rendered="HandleRendered" /> -->
    <MdIt class="article pa-3" :title="title" :content="content" :small="small" @rendered="HandleRendered" />
</template>

<script>
    import { defineComponent, onMounted, ref } from '@vue/composition-api'

    import MdShowndown from '@/components/MdShowndown.vue'
    import MdIt from '@/components/MdIt.vue'

    import Prism from 'prismjs';

    export default defineComponent({
        name: 'MdRenderer',
        components:{
            MdShowndown,
            MdIt,
        },
        props:{
            title:{
                type: String,
                default: ""
            },
            content:{
                type: String,
                default: ""
            },
            small:{
                type: Boolean,
                default: false,
            },
        },
        setup(props, {emit}){
            return {
                HandleRendered: () => emit("rendered")
            }
        }        
    })
</script>

<style lang="scss" scoped>

</style>