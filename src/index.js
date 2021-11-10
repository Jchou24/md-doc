import InitVue from './init'

const components = []

const install = function(vue, opts = {}) {  
    components.forEach(component => {
      vue.component(component.name, component);
    });
  
    InitVue(vue, opts)
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install
}

