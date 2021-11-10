<template>
    <div class="MdEditor d-flex flex-row">
        <v-textarea class="editor-area editor-block pa-3" v-model="contentRef"
            solo counter no-resize/>
        <MdRenderer class="preview-area editor-block" :title="title" :content="content" :small="small"  @rendered="HandleRendered" />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from '@vue/composition-api'

    import MdRenderer from '@/components/MdRenderer.vue'

    export default defineComponent({
        name: 'MdEditor',
        components:{
            MdRenderer
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
            const contentRef = computed({
                get: () => props.content,
                set: (value) => emit("update:content", value)
            })

            return {
                contentRef,
                HandleRendered: () => emit("rendered"),
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .editor-area{
        position: sticky;
        top: 48px;
    }

    .editor-block{
        width: 50%;
        height: 100%;
    }
</style>

<style lang="scss">
    .editor-area{
        .v-text-field__slot{
            margin-bottom: 12px;
            height: calc( 100vh - 48px - 12px * 2 - 30px );

            textarea{
                -webkit-overflow-scrolling: touch;
    
                &::-webkit-scrollbar
                {
                    width: 12px;
                    height: 8px;
                    background-color: #f5f5f5;
                    border-radius: 15px;
                }
            
                &::-webkit-scrollbar-thumb
                {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
                    background-color: #d8d8d8;
    
                    &:hover{
                        background-color: #ecebeb;
                    }
                }
            }
        }
    }
</style>