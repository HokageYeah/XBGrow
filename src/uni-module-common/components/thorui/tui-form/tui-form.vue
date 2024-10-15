<template>
	<view class="tui-form__box" :style="{backgroundColor:backgroundColor,padding:padding,borderRadius:radius}">
		<slot></slot>
		<view class="tui-form__errmsg"
			:style="{top:tipTop+'px',padding:tipPadding,backgroundColor:getTipBgColor,borderRadius:tipRidus}"
			v-if="showMessage" :class="{'tui-message__show':errorMsg}"><text class="tui-form__text"
				:style="{fontSize:tipSize+'rpx',color:tipColor}">{{errorMsg}}</text></view>
		<view class="tui-form__mask" v-if="disabled"></view>
	</view>
</template>

<script>
	import form from "./tui-validation.js"
	export default {
		name: "tui-form",
		provide() {
			return {
				form: this
			}
		},
		props: {
			//表单数据对象
			model: {
				type: Object,
				default () {
					return {}
				}
			},
			//表单验证规则，即将废弃
			rules: {
				type: Array,
				default () {
					return []
				}
			},
			//表单背景颜色
			backgroundColor: {
				type: String,
				default: 'transparent'
			},
			//表单padding值
			padding: {
				type: String,
				default: '0'
			},
			//是否顶部弹出方式显示校验错误信息【为false时则可关联FormItem组件显示校验错误信息】
			showMessage: {
				type: Boolean,
				default: true
			},
			//表单圆角值
			radius: {
				type: String,
				default: '0'
			},
			//是否禁用该表单内的所有组件,透明遮罩层
			disabled: {
				type: Boolean,
				default: false
			},
			//提示框top值 px
			tipTop: {
				type: [Number, String],
				// #ifdef H5
				default: 44,
				// #endif
				// #ifndef H5
				default: 0
				// #endif
			},
			//错误提示框padding值
			tipPadding: {
				type: String,
				default: '20rpx'
			},
			//错误提示框背景色
			tipBackgroundColor: {
				type: String,
				default: ''
			},
			//错误提示字体大小
			tipSize: {
				type: [Number, String],
				default: 28
			},
			//错误提示字体颜色
			tipColor: {
				type: String,
				default: '#fff'
			},
			//错误提示框圆角值
			tipRidus: {
				type: String,
				default: '12rpx'
			},
			//错误消息显示时间 ms
			duration: {
				type: [Number, String],
				default: 0
			}
		},
		computed: {
			getTipBgColor() {
				return this.tipBackgroundColor || (uni && uni.$tui && uni.$tui.tuiForm.tipBackgroundColor) ||
					'#f74d54';
			}
		},
		watch: {
			showMessage(val) {
				if (this.children && this.children.length > 0) {
					this.children.forEach(item => {
						item.showError = val ? false : true
					})
				}
			}
		},
		data() {
			return {
				errorMsg: '',
				timer: null,
				formRules: [],
				isImmediate: false,
				concatRules: []
			};
		},
		created() {
			this.children = []
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.clearTimer()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.clearTimer()
		},
		// #endif
		methods: {
			clearTimer() {
				clearTimeout(this.timer)
				this.timer = null;
				this.children = null
			},
			getFormItemRules() {
				let rules = []
				if (this.children && this.children.length > 0) {
					this.children.forEach(child => {
						let rule = child.getRules()
						rule && rules.push(rule)
					})
				}
				return rules;
			},
			getMergeRules(rules) {
				if (this.concatRules.length === 0) return rules;
				let formRules = [...rules]
				//合并并替换当前rules数据
				this.concatRules.forEach(item => {
					const index = rules.findIndex(e => e.name === item.name)
					if (index === -1) {
						formRules.push(item)
					} else {
						formRules[index] = item;
					}
				})
				return formRules;
			},
			//{Object} model 表单数据对象，传null则使用属性中model值
			//{Array} rules 表单验证规则，传null则使用FormItem项内传入的rules值
			//{Boolean} checkAll 是否返回所有错误信息
			validate(model, rules, checkAll = false) {
				model = model || this.model
				rules = rules || this.rules || []
				return new Promise((resolve, reject) => {
					try {
						if (rules.length === 0) {
							rules = this.getFormItemRules()
						} else {
							rules = this.getMergeRules(rules)
						}
						let res = form.validation(model, rules, checkAll);
						if (!res.isPass) {
							let errors = res.errorMsg;
							if (this.showMessage) {
								this.clearTimer()
								if (checkAll) {
									errors = errors[0].msg
								}
								this.errorMsg = errors;
								const duration = this.duration || (uni && uni.$tui && uni.$tui.tuiForm.duration) ||
									2000
								this.timer = setTimeout(() => {
									this.errorMsg = ''
								}, Number(duration))
							} else {
								if (checkAll && this.children && this.children.length > 0) {
									//FormItem组件 显示提示
									this.children.forEach(item => {
										const index = errors.findIndex(err => err.name === item.prop)
										if (item.prop && item.prop !== true && ~index) {
											item.errorMsg = errors[index].msg
											item.itemValue = model[item.prop]
										}
									})
								}
							}
						}
						resolve(res)
					} catch (e) {
						//TODO handle the exception
						reject({
							isPass: false,
							errorMsg: '校验出错，请检查数据格式是否有误！'
						})
					}
				})
			},
			//结合FormItem组件进行校验时 是否开启即时校验
			immediateValidate(isOpen, rules = []) {
				this.isImmediate = isOpen;
				if (isOpen) {
					if (!rules || rules.length === 0) {
						rules = this.getFormItemRules()
					} else {
						rules = this.getMergeRules(rules)
					}
					this.formRules = rules || []
				}
				if (this.children && this.children.length > 0) {
					this.children.forEach(item => {
						item.immediateValidate(isOpen)
					})
				}
			},
			//校验
			immediateValidator(prop, model, rules) {
				return new Promise((resolve, reject) => {
					try {
						let res = form.validation(model || this.model, rules || this.formRules, true);
						if (!res.isPass) {
							//显示提示
							let errors = res.errorMsg;
							const index = errors.findIndex(err => err.name === prop)
							if (~index) {
								res.errorMsg = errors[index].msg
							} else {
								res.isPass = true
								res.errorMsg = ''
							}
						}
						resolve(res)
					} catch (e) {
						reject({
							isPass: false,
							errorMsg: '校验出错，请检查数据格式是否有误！'
						})
					}
				})
			},
			clearValidate(props = []) {
				let arr = props;
				arr = !arr ? [] : arr
				if (typeof props === 'string') {
					arr = [props]
				}
				if (this.children && this.children.length > 0) {
					//清除指定字段的表单验证信息
					if (arr && arr.length > 0) {
						this.children.forEach(item => {
							if (item.prop && ~arr.indexOf(item.prop)) {
								item.errorMsg = ''
							}
						})
					} else {
						//清除所有字段的表单验证信息
						this.children.forEach(item => {
							item.errorMsg = ''
						})
					}
				}
			},
			/**
			 * 验证具体的某个字段
			 * @param {Array<string> ｜ String} props 字段key
			 * @param {Array} rules 表单验证规则，当传null 或空数组时使用FormItem组件内rules
			 * @param {Object} model 表单数据对象，不传则使用属性中model值
			 */
			validateField(props, rules, model) {
				if (!rules || rules.length === 0) {
					rules = this.getFormItemRules()
				} else {
					rules = this.getMergeRules(rules)
				}
				const isString = typeof props === 'string';
				const formRules = rules.filter(item => props === item.name || (!isString && props
					.indexOf(item.name) !== -1));
				model = model || this.model
				return this.validate(model, formRules, true)
			},
			// 移除表单项
			uninstall(instance) {
				if (this.children && this.children.length > 0) {
					const index = this.children.findIndex(item => item === instance)
					if (index !== -1) {
						this.children.splice(index, 1)
					}
					const rules = instance.getRules() || {}
					const prop = instance.prop || rules.name || ''
					const idx = this.concatRules.findIndex(ru => ru.name === prop)
					if (idx !== -1) {
						this.concatRules.splice(idx, 1)
					}
				}
			}
		}
	}
</script>

<style scoped>
	.tui-form__box {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		/* #endif */
		flex: 1;
		position: relative;
	}

	.tui-form__errmsg {
		position: fixed;
		z-index: 900;
		text-align: center;
		left: 20rpx;
		right: 20rpx;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		display: flex;
		word-break: break-all;
		/* #endif */
		align-items: center;
		justify-content: center;
		padding: 24rpx;
		opacity: 0;
		transform: translateZ(0) translateY(-100%);
		transition-property: transform, opacity;
		transition-duration: 0.25s;
		transition-delay: 0s;
		transition-timing-function: ease-in-out;
	}

	.tui-form__text {
		text-align: center;
	}

	.tui-message__show {
		transform: translateY(0) translateZ(0);
		opacity: 1;
	}

	.tui-form__mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0);
		z-index: 99;
	}
</style>