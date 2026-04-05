<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

interface MyInterface {
    data: string;
    test: boolean;
}

export default defineComponent({
    name: "MyComponent",
    props: {
        /**
         * Prop description
         */
        myProp: {
            type: Boolean,
        },
        /**
         * Prop description
         */
        myComplexProp: {
            type: Object as PropType<MyInterface>,
            required: false,
            default: () => ({}),
        },
    },
    emits: ["change"],
    data() {
        return {
            value: null as number | null,
        };
    },
    computed: {
        myComputed(): boolean {
            return this.value && this.value > 10;
        },
    },
    methods: {
        onClick() {
            /**
             * Description of this event.
             *
             * @event change
             * @param value
             * @type {number}
             */
            this.$emit("change", this.value);
        },
    },
});
</script>

<template>
    <div v-if="myComputed">
        <!-- @slot Slot description -->
        <slot name="my-slot"></slot>
    </div>
    <div>
        <span v-if="myProp">{{ myComplexProp }}</span>
    </div>
</template>
