<template>
	<view>
		<l-shrink ref="shrinkRef"></l-shrink>
		<button @click="onclick">压缩</button>
		<view v-if="images.after.url">
			<view>
				<text>之前:{{images.before.size}}</text>
			</view>
			<image class="img" mode="widthFix" :src="images.before.url"></image>
		</view>
		<view v-if="images.after.url">
			<view>
				<text>之后:{{images.after.size}}</text>
			</view>
			<image class="img" mode="widthFix" :src="images.after.url"></image>
		</view>
	</view>
</template>
<script>
import { defineComponent, ref , onMounted, reactive} from "../l-shrink/vue"
	export default defineComponent({
		setup() {
			const images = reactive({
				before: {
					url: '',
					size: 0
				},
				after: {
					url: '',
					size: 0
				}
			})
			const shrinkRef = ref(null)
			const imgBefore = ref(null)
			const img = ref(null)
			onMounted(() => {
				if(!shrinkRef.value) return
			})
			const fileToPath = (file) => {
				// #ifdef H5
				// h5 返回的是 file 文件
				let windowURL = window.URL || window.webkitURL;
				return windowURL.createObjectURL(new Blob([file], {type:file.type}));
				// #endif
				return file
			}
			const onclick = () => {
				uni.chooseImage({
					count: 1,
					sizeType: ['original ','compressed'],
					success: async (image) => {
						const {tempFiles, tempFilePaths} = image 
						let filePath = null
						// #ifdef H5
						// h5使用file文件更小
						filePath = tempFiles[0]
						// #endif
						// #ifndef H5
						filePath = tempFilePaths[0]
						// #endif
						uni.getImageInfo({
							src: tempFilePaths[0],
							success(res) {
								console.log('压缩前的宽高::', res)
							}
						})
						uni.getFileInfo({
							filePath: tempFilePaths[0],
							success(res) {
								images.before.url = tempFilePaths[0]
								images.before.size = res.size
								console.log('压缩前的大小::', res)
							}
						})
						
						// 支持数组
						// compressImage(file|file[], options:{quality: number})
						// quality: 0-100之间，默认80
						const res = await shrinkRef.value.compressImage(filePath);
						const url = fileToPath(res)
						uni.getImageInfo({
							src: url,
							success(res) {
								console.log('压缩后的宽高::', res)
							}
						})
						uni.getFileInfo({
							filePath: url,
							success(res) {
								images.after.url = url
								images.after.size = res.size
								console.log('压缩后的大小::', res)
								
							}
						})
					}
				})
			}
			return {
				shrinkRef,
				images,
				onclick
			}
		}
	})
</script>
<style>
	.img {
		width: 500rpx;
	}
</style>
