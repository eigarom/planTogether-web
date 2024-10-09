<template>
	<div class="app-container">
		<SidebarNavigation class="sidebar"/>
		<router-view class="main-content"></router-view>
	</div>
</template>

<script>

import SidebarNavigation from './components/SidebarNavigation.vue';

export default {
	components: {
		SidebarNavigation
	}
}
</script>

<style>
* {
	box-sizing: border-box;
}

html, body, #app {
	height: 100%;
	margin: 0;
}

.app-container {
	display: flex;
	height: 100%;
}

.sidebar {
	width: 250px;
	height: 100%;
}

.main-content {
	flex-grow: 1;
	height: 100%;
}
</style>
