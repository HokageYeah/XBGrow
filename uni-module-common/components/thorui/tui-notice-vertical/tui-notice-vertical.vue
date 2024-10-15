<template>
	<view class="tui-notice-vertical"
		:style="{width:width?width+'rpx':'100%',height:scrollHeight+'px',background:background,padding:padding,borderRadius:radius+'rpx'}">
		<view :id="elId_box" class="tui-seamless__scroll-outer">
			<view :id="elId" class="tui-seamless__scroll-box"
				:style="{paddingTop:scrollHeight+'px', 'animationDuration': animationDuration,'-webkit-animationDuration': animationDuration,animationPlayState: webviewHide?'paused':animationPlayState,'-webkit-animationPlayState':webviewHide?'paused':animationPlayState, animationDelay: animationDelay, '-webkit-animationDelay':animationDelay}">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tui-notice-vertical",
		props: {
			//滚动容器宽度 rpx ，0 则使用屏幕宽度
			width: {
				type: [Number, String],
				default: 0
			},
			//滚动容器高度 rpx
			height: {
				type: [Number, String],
				default: 400
			},
			background: {
				type: String,
				default: 'transparent'
			},
			radius: {
				type: [Number, String],
				default: 0
			},
			padding: {
				type: String,
				default: '0'
			},
			//每秒滚动速度（距离） 默认 20px/s
			speed: {
				type: [Number, String],
				default: 20
			},
			//backwards: 动画从头开始播；forwards：动画从结束点开始播
			activeMode: {
				type: String,
				default: 'backwards'
			}
		},
		watch: {
			height(val) {
				this.scrollHeight = uni.upx2px(Number(val) || 600)
			}
		},
		data() {
			const elId = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			const elId_box = `tui_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				elId,
				elId_box,
				webviewHide: false,
				boxHeight: 0,
				contentHeight: 0,
				scrollHeight: 0,
				animationDuration: 'none',
				animationPlayState: 'paused',
				animationDelay: '0s'
			};
		},
		created() {
			this.scrollHeight = uni.upx2px(Number(this.height) || 600)
		},
		mounted() {
			// #ifdef APP-PLUS
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			let currentWebview = page.$getAppWebview();
			currentWebview.addEventListener('hide', () => {
				this.webviewHide = true
			})
			currentWebview.addEventListener('show', () => {
				this.webviewHide = false
			})
			// #endif
			this.$nextTick(() => {
				setTimeout(() => {
					this.initAnimation()
				}, 50)
			})
		},
		methods: {
			initAnimation() {
				let query = [],
					boxHeight = 0,
					contentHeight = 0;
				let noticeQuery = new Promise((resolve, reject) => {
					uni.createSelectorQuery()
						// #ifndef MP-ALIPAY
						.in(this)
						// #endif
						.select(`#${this.elId}`)
						.boundingClientRect()
						.exec(ret => {
							this.contentHeight = ret[0].height
							resolve()
						})
				})
				if (this.activeMode === 'forwards') {
					let boxQuery = new Promise((resolve, reject) => {
						uni.createSelectorQuery()
							// #ifndef MP-ALIPAY
							.in(this)
							// #endif
							.select(`#${this.elId_box}`)
							.boundingClientRect()
							.exec(ret => {
								this.boxHeight = ret[0].height
								resolve()
							})
					})
					query.push(boxQuery)
				}
				query.push(noticeQuery)
				Promise.all(query).then(() => {
					this.animationDuration = `${this.contentHeight /(Number(this.speed) || 20)}s`
					if (this.activeMode === 'forwards') {
						this.animationDelay = `-${this.boxHeight / (Number(this.speed) || 20)}s`
					}
					setTimeout(() => {
						this.animationPlayState = 'running'
					}, 1000)
				})

			}
		}
	}
</script>

<style scoped>
	.tui-notice-vertical {
		width: 100%;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		z-index: 2;
	}

	.tui-seamless__scroll-outer {
		width: 100%;
		flex: 1;
		overflow: hidden;
	}

	.tui-seamless__scroll-box {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		word-break: break-all;
		white-space: pre-wrap;
		animation: notice 10s 0s linear infinite both;
		animation-play-state: paused;
		-webkit-backface-visibility: hidden;
		-webkit-perspective: 1000;
	}

	@keyframes notice {
		100% {
			transform: translate3d(0, -100%, 0);
		}
	}
</style>