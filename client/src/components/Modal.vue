<template>
  <div>
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
		<div class="md-modal-inner">
		  <div class="md-top">
			<div class="md-title">提示信息</div>
			<button class="md-close">Close</button>
		  </div>
		  <div class="md-content">
			<div class="confirm-tips">
			  <slot name="message"></slot>
			</div>
			<div class="login-wrap">
			  <slot name="btnGroup"></slot>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="md-overlay" v-if="mdShow" @click="mdShow = false">
	  </div>
  </div>
</template>

<script>
export default {
  props:['mdShow'],

}
</script>
