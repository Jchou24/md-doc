import { computed, onBeforeUnmount, ref, watch } from '@vue/composition-api'
import $ from 'jquery'
import 'jquery-ui/ui/effect.js'
import { throttle } from 'lodash'
import { useWindowSize } from 'vue-use-web'

function GetScrollingTime(scrollDistance: number){
    let scrollingTime = 0
    if( 0 <= scrollDistance && scrollDistance < 500 ){
        scrollingTime = 500
    }else if( 500 <= scrollDistance && scrollDistance < 1500 ){
        scrollingTime = 800
    }else if( 1500 <= scrollDistance && scrollDistance < 2500 ){
        scrollingTime = 1300
    }else{
        scrollingTime = 2000
    }
    
    return scrollingTime
}

function ScrollTop(){
    const top = 0
    const currentTop = $("html, body").scrollTop() || 1000
    const scrollingTime = GetScrollingTime( Math.abs( top - currentTop ) )

    $("html, body").stop()
    $("html, body").animate({
        scrollTop: top,
    }, scrollingTime, "easeOutExpo");
}

function ScrollTo(container: Element | string | Window, newPosition: number, currentPosition: number){
    const scrollingTime = GetScrollingTime( Math.abs( newPosition - currentPosition ) )

    // @ts-ignore
    $(container).stop()
    // @ts-ignore
    $(container).animate({
        scrollTop: newPosition,
    }, scrollingTime, "easeOutExpo");
}

function ScrollToHash( container: Element | string | Window, id: string, offset = 0 ){
    ScrollTo(container, 
        $(document.getElementById(id.replace("#", "")) as HTMLAnchorElement)?.offset()?.top as number - offset, 
        $("html, body")?.offset()?.top as number)
}

function StopScrollingWhenUserActive(){
    $('body,html').bind('mousedown wheel DOMMouseScroll mousewheel touchstart keyup', function(e){
        let isStop = false
        if(e.type == 'keyup'){
            if( e.which == 33        // page up 
                || e.which == 34     // page dn 
                || e.which == 32     // spacebar
                || e.which == 38     // up 
                || e.which == 40     // down 
                || (e.ctrlKey && e.which == 36)     // ctrl + home 
                || (e.ctrlKey && e.which == 35)     // ctrl + end 
            ){
                isStop = true
            }
        }else{
            isStop = true
        }

        if(isStop){
            $("html,body").stop()
        }
    })
}

const useWindowScrollDirection = (throttleTime = 100) => {
    const isScrollDownRef = ref(false)
    // =================================================================
    const GetScrollPosition = () => $(window).scrollTop() || 0

    let position = GetScrollPosition()

    const windowSize = useWindowSize()
    // =================================================================
    // Handle iphone scroll top/bottom bounce affect
    const bounceDistance = computed( () => windowSize.height.value * 0.1 )
    const IsBounceTop = () => {
        const currentTop = $("html, body").scrollTop() || 0
        // console.log( "IsBounceTop", currentTop, currentTop <= bounceDistance.value )
        return currentTop <= bounceDistance.value
    }

    const GetScrollHeight = () => $("html, body")[0].scrollHeight
    const IsBounceBottom = () => {
        const currentBottom = ( ($("html, body").scrollTop() || 0 ) + windowSize.height.value ) || windowSize.height.value
        return currentBottom >= (GetScrollHeight() - bounceDistance.value)
    }
    // =================================================================
    const HandleScroll = throttle(() => {
        // console.log( IsBounceTop() )
        if( IsBounceTop() ){
            // emit( "scrollDirection", false) 
            // console.log( "scrollDirection", false) 
            isScrollDownRef.value = false
            return
        }

        if( IsBounceTop() || IsBounceBottom() ){
            // emit( "scrollDirection", true) 
            // console.log( "scrollDirection", true) 
            isScrollDownRef.value = true
            return
        }

        const currentPosition = GetScrollPosition()

        const isScrollDown = currentPosition > position
        // emit( "scrollDirection", isScrollDown)
        // console.log( "scrollDirection", currentPosition, position, isScrollDown)
        isScrollDownRef.value = isScrollDown

        position = currentPosition
    }, throttleTime)

    window.addEventListener('scroll', HandleScroll)
    onBeforeUnmount( () => window.removeEventListener('scroll', HandleScroll))

    return isScrollDownRef
}

const HandleWindowScrollDirection = ( Callback: (isScrollDown: boolean) => void ) => {
    const windowScrollDirection = useWindowScrollDirection()
    watch(windowScrollDirection, () => {
        Callback(windowScrollDirection.value)
    })
}

export { 
    ScrollTop,
    ScrollTo,
    ScrollToHash,
    StopScrollingWhenUserActive,
    useWindowScrollDirection,
    HandleWindowScrollDirection,
}