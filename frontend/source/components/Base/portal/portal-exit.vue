<!-- <template>
  <component
    v-for="(item, intex) in (array = incomers())"
    :is="item"
  />
</template> -->

<script>
export default {
  name:(name => name === 'index' ?(array => array[array.length-1])(__dirname.split(path.sep)) : name)(path.basename(__filename, path.extname(__filename))),

  /**/
  // abstract: true,

  props: {
    attributes: { type: Object },
    name: { type: String, required: true },
    slim: { type: Boolean, default: false },
    tag: { type: String, default: 'div' },
  },

  /**/
  data() {
    return {
      transports: require('./wormhole').default.transports,
    }
  },

  computed: {
    passengers() {
      return(this.transports[this.name] && this.transports[this.name].passengers) || []
    },

    children() {
      return this.passengers.length !== 0 ? this.passengers :(this.$slots.default || [])
    },

    renderSlim() {
      const children = this.children
      return children.length === 1 && !this.attributes && this.slim
    },
  },

  methods: {
    // incomers() {
    //   console.log('meth comer', this.children);
    //   return (this.children || []).reduce((previousItem, item, index, array) => {
    //     let
    //       component = this.constructor.component(
    //         // `cell${index + 1}`
    //         'cell'
    //         , {
    //         // extend: this.cell,
    //         render: createElement => {
    //           return item;
    //         },
    //       })
    //     ;
    //     return previousItem ? previousItem.concat(component) : [component];
    //   }, false);
    // },

    // updateAttributes() {
    //   if(this.attributes) {
    //     const attrs = this.attributes
    //     const el = this.$el
    //
    //     // special treatment for class
    //     if(attrs.class) {
    //       attrs.class.trim().split(' ').forEach((klass) => {
    //         el.classList.add(klass)
    //       })
    //       delete attrs.class
    //     }
    //
    //     const keys = Object.keys(attrs)
    //
    //     for(let i = 0; i < keys.length; i++) {
    //       el.setAttribute(keys[i], attrs[keys[i]])
    //     }
    //   }
    // },

    emitChange(newTransport, oldTransport) {
      this.$emit('change',
        { ...newTransport },
        { ...oldTransport }
      )
    },
  },

  /*BEFORE CREATE*/
  beforeCreate() {
    console.log('portal-exit beforeCreate');
  },

  /*MOUNTED*/
  mounted() {
    // console.log('mounted this.children:', this.children);
    if(!this.transports[this.name]) {
      this.$set(this.transports, this.name, undefined)
    }

    this.unwatch = this.$watch(function() {
      console.log('watch');
      return this.transports[this.name];
    }, this.emitChange)

    // this.updateAttributes()
  },

  /**/
  updated() {
    console.log('updated this.children:', this.children);
    // this.updateAttributes()
  },

  beforeDestroy() {
    this.unwatch();
    this.$el.innerHTML = '';
  },


  render(createElement) {
    console.log('portal-exit render this.renderSlim:', this.renderSlim, this.children);
    return this.children[0];
    // const
    //   children = this.children
    //   ,Tag = this.tag
    // ;
    // let component = this.constructor.component('comer', {
    //   render: createElement => {
    //     return children;
    //   },
    // });
    // if(this.renderSlim) {
    //   return children[0];
    // } else {
    //   return(<Tag class="portal-exit">{children}</Tag>);
    // }
  },
}

</script>
