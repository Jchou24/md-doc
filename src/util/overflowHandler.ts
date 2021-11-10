import { computed, onMounted, ref } from "@vue/composition-api"
import throttle from "lodash.throttle"

const ObserveOverflow = ( GetContainerEle: () => HTMLElement, GetChildEle: () => HTMLElement, isObserveChild = true ) => {
    const widthContainer = ref(0)
    const widthChild = ref(0)
    const isChildOverflow = computed( () => widthChild.value > widthContainer.value )
    // =================================================================
    const HandleResize = () => {
        widthContainer.value = GetContainerEle()?.getBoundingClientRect().width || widthContainer.value
        widthChild.value = GetChildEle()?.getBoundingClientRect().width || widthChild.value
        // console.log(isChildOverflow.value, widthContainer.value, widthChild.value)
    }
    // =================================================================
    const Observe = (element: Element, Callback: () => void ) => {
        const observer = new ResizeObserver(throttle(Callback, 1000))
        observer.observe(element)
        // console.log("observe", element)
        return observer
    }
    // =================================================================
    const observerContainer = ref(undefined as ResizeObserver | undefined)
    const observerChild = ref(undefined as ResizeObserver | undefined)
    onMounted(() => {
        HandleResize()
        observerContainer.value = Observe(GetContainerEle(), HandleResize)
        if (isObserveChild) {
            observerChild.value = Observe(GetChildEle(), HandleResize)
        }
    })

    return {
        isChildOverflow,
        observerContainer,
        observerChild,
    }
}

export {
    ObserveOverflow
}