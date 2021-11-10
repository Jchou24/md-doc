<template>
    <v-btn class="NavBtn" text :class="{
            active: isBtnActive,
            'small-btn': small,
        }" @click="HandleClick">
        <v-icon left v-if="icon">
        {{icon}}</v-icon>
        <slot>
        </slot>
        <span class="nav-btn-text" v-if="isShowBtnText && btnText">
            {{btnText}}
        </span>
    </v-btn>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed } from '@vue/composition-api'

    import { AppMode } from '@/models/appMode'

    export default defineComponent({
        name: 'NavBtn',
        components:{
            
        },
        props:{
            currentAppMode:{
                type: Number as PropType<AppMode>,
                required: true,
            },
            btnAppMode:{
                type: Number as PropType<AppMode>,
                required: true,
            },
            small:{
                type: Boolean,
                default: false,
            },
            smallHideText:{
                type: Boolean,
                default: false,
            },
            icon:{
                type: String,
                default: ""
            },
            btnText:{
                type: String,
                default: ""
            },
        },
        setup(props, { emit }){
            const isBtnActive = computed( () => props.currentAppMode === props.btnAppMode )
            const isShowBtnText = computed( () => {
                if (!props.small) {
                    return true
                }

                return !props.smallHideText
            })
            const HandleClick = () => emit('click')
            return {
                isBtnActive,
                isShowBtnText,
                HandleClick,
            }
        }        
    })
</script>

<style lang="scss">
    .NavBtn.v-btn.small-btn{
        padding-left: 4px !important;
        padding-right: 4px !important;
        min-width: 32px !important;
        i.v-icon{
            margin-left: 0px;
            margin-right: 0px;
        }
    }
</style>