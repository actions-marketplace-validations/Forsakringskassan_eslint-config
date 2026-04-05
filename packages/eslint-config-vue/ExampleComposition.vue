<script setup lang="ts">
import { onMounted } from "vue";

const count = defineModel<number>();

const { name } = defineProps<{
    name: string;
}>();

const emit = defineEmits<{
    change: [count: number];
}>();

defineSlots<{
    default(props: { count: number }): void;
}>();

defineOptions({ inheritAttrs: false });

defineExpose({ increment });

// functions that mutate state and trigger updates
function increment(): void {
    count.value++;
    emit("change", count.value);
}

// lifecycle hooks
onMounted(async () => {
    await Promise.resolve();

    /* eslint-disable-next-line no-console -- expected to log */
    console.log(`The initial count is ${String(count.value)}.`);
});
</script>

<template>
    <div><slot v-bind="{ count }">Hello</slot> {{ name }}!</div>
    <button @click="increment">Count is: {{ count }}</button>
</template>
