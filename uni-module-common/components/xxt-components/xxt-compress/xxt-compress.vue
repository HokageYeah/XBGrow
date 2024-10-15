<template>
  <view class="compress__canvas">
    <!-- #ifndef H5 -->
    <canvas
      canvas-id="compress_canvas"
      :style="{ width: `${width}px`, height: `${height}px` }"
    ></canvas>
    <!-- #endif -->
  </view>
</template>

<!-- <script lang="ts">
import { defineComponent, getCurrentInstance, ref } from '@vue/runtime-core';
import compress from './compress';
/**
 * 使用方法
 * import WCompress from '@/components/w-compress/compress.js'
 * components: { WCompress }
 * <w-compress ref='wCompress' />
 * this.$refs.wCompress.start(res.tempFilePaths[0]).then().catch()
 * this.$refs.wCompress.start(res.tempFilePaths).then().catch()
 */
export default defineComponent({
  setup(_, { expose }) {
    const width = ref(0);
    const height = ref(0);
    console.log('进入方法了----');
    const context = getCurrentInstance();
    console.log('context----', context);
    const start = (imgUrl: string | any[], options = {}) => {
      console.log('开始了');

      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        console.log('this---', this);
        if (Array.isArray(imgUrl)) {
          try {
            const arr: any = [];
            for (let i = 0; i < imgUrl.length; i++) {
              const url = await compress(imgUrl[i], context, options);
              arr.push(url);
            }

            resolve(arr);
          } catch (e) {
            reject(e);
          }

          /* let arr = []
					arr = imgUrl.map(async c => {
						return await compress(c, this, options)
					})
					resolve(arr) */

          /* let arr = imgUrl.map(c => {
						return compress(c, this, options)
					})

					Promise.all(arr)
						.then(resolve)
						.catch(reject) */
        } else {
          compress(imgUrl, context, options).then(resolve).catch(reject);
        }
      });
    };
    expose({
      start
    });
    return {
      width,
      height
    };
  }
});
</script> -->

<script>
/**
 * 使用方法
 * import WCompress from '@/components/w-compress/compress.js'
 * components: { WCompress }
 * <w-compress ref='wCompress' />
 * this.$refs.wCompress.start(res.tempFilePaths[0]).then().catch()
 * this.$refs.wCompress.start(res.tempFilePaths).then().catch()
 */
import compress from './compress.ts';
export default {
  name: 'WCompress',
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  methods: {
    start(imgUrl, options = {}) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        if (Array.isArray(imgUrl)) {
          try {
            const arr = [];
            for (let i = 0; i < imgUrl.length; i++) {
              const url = await compress(imgUrl[i], this, options);
              arr.push(url);
            }

            resolve(arr);
          } catch (e) {
            reject(e);
          }

          /* let arr = []
					arr = imgUrl.map(async c => {
						return await compress(c, this, options)
					})
					resolve(arr) */

          /* let arr = imgUrl.map(c => {
						return compress(c, this, options)
					})

					Promise.all(arr)
						.then(resolve)
						.catch(reject) */
        } else {
          compress(imgUrl, this, options).then(resolve).catch(reject);
        }
      });
    }
  }
};
</script>

<style>
.compress__canvas {
  visibility: hidden;
  overflow: hidden;
  position: absolute;
  left: 10000px;
  height: 0;
}
</style>
