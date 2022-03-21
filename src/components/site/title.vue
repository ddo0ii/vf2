<template>
    <!-- template 안에는 하나만 넣어야 함 -->
    <v-toolbar-title>
        {{title}}
    </v-toolbar-title>
</template>
<script>
export default {
  props: ['title']
}
</script>
