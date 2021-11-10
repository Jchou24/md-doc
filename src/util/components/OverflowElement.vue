<template>
    <div class="OverflowElement" :class="{'child-overflow': isChildOverflow}"
        v-resize="HandleResize"
        v-click-outside="HandleClickOutside"
        @mouseenter="isHover = true"
        @mouseover="isHover = true"
        @mouseleave="isHover = false"
        @blur="isHover = false"
        >
        <div class="overflow-scroller" ref="OverflowElement">
            <div ref="Child">
                <slot></slot>
            </div>
        </div>
        <div class="overflow-append" :class="overflowAppendCls" v-if="isChildOverflow">       
            <v-btn class="overflow-append-btn arrow-btn" x-small depressed text plain
                @click="HandleScrollLeft"
                v-if="isReachScrollRightLimit"
                >
                <v-icon dense >mdi-arrow-left-bold</v-icon>
            </v-btn>
            <v-btn class="overflow-append-btn dots-btn" x-small depressed text plain
                @click="HandleScrollRight"
                v-else
                >
                <v-icon dense >mdi-dots-horizontal</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api'
    import Scrollbar from 'smooth-scrollbar';
    import { ObserveOverflow } from '../overflowHandler'
    export default defineComponent({
        name: 'OverflowElement',
        components:{
        },
        props:{
            overflowAppendCls:{
                type: String,
                default: "",
            }
        },
        setup(props, { refs, slots }){
            const isHover = ref(false)
            const GetContainerEle = () => (refs as any).OverflowElement
            const GetChildEle = () => (refs as any).Child
            // =================================================================
            let scrollbar: Scrollbar
            const scrollLeft = ref(0)
            const SetScrollLeft = () => scrollLeft.value = scrollbar?.scrollLeft || 0
            onMounted( () => {
                scrollbar = Scrollbar.init(GetContainerEle())
                scrollbar.addListener(SetScrollLeft)
            })
            onBeforeUnmount( () => {
                scrollbar.removeListener(SetScrollLeft)
                scrollbar.destroy()
            })
            const isReachScrollRightLimit = computed( () => scrollLeft.value == scrollbar?.limit.x)
            const HandleScrollRight = () => scrollbar.scrollTo(scrollbar.limit.x, undefined, 300)
            const HandleScrollLeft = () => scrollbar.scrollTo(0, undefined, 300)
            // =================================================================
            watch(isHover, () => {
                if(isHover.value){
                    scrollbar.track.xAxis.show()
                }else{
                    scrollbar.track.xAxis.hide()
                    HandleScrollLeft()
                }
            })
            // =================================================================
            const { isChildOverflow, observerContainer, observerChild } = ObserveOverflow(GetContainerEle, GetChildEle)
            onBeforeUnmount( () => {
                observerContainer.value?.unobserve(GetContainerEle())
                observerChild.value?.unobserve(GetChildEle())
            })
            // =================================================================            
            const HandleResize = () => {
                SetScrollLeft()
                isReachScrollRightLimit.value
            }
            onMounted(HandleResize)
            
            return {
                isHover,
                isChildOverflow,
                isReachScrollRightLimit,
                HandleScrollRight,
                HandleScrollLeft,
                HandleResize,
                HandleClickOutside: HandleScrollLeft,
            }
        }        
    })
</script>

<style lang="scss" scoped>
    .OverflowElement{
        display: grid;
        width: 100%;
        height: 100%;
    }
</style>

<style lang="scss">
    $height-scroll-bar: 4px;
    .OverflowElement .overflow-scroller{
        white-space: nowrap;
        height: 100%;
        .scroll-content{
            height: 100%;
            display: flex;
            align-items: center;
        }
    
        .scrollbar-track.scrollbar-track-x{
            border-radius: 100px;
            height: $height-scroll-bar;
            .scrollbar-thumb{
                height: $height-scroll-bar;
            }
        }
    }
    .OverflowElement.child-overflow{
        height: calc( 100% + 4px );
        padding-right: 22px;
        position: relative;
        margin-top: calc( #{$height-scroll-bar} * -1 );
        .scroll-content{
            padding-top: $height-scroll-bar;
        }
        .overflow-append{
            position: absolute;
            right: -4px;
            width: 24px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .overflow-append-btn{
                padding-right: 0px !important;
                padding-left: 0px !important;
                min-width: 24px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                .v-icon{
                    height: 100%;
                }
                &.dots-btn{
                    padding-top: 16px;
                }
                &.arrow-btn{
                    padding-top: 8px;
                }
            }
        }
    }
</style>