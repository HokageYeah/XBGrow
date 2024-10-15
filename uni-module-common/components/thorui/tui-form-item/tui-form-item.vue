<template>
	<view class="tui-form__item-outer"
		:style="{marginTop:marginTop+'rpx',marginBottom:marginBottom+'rpx',borderRadius:getRadius,background:getBgColor}">
		<view class="tui-form__item-wrap" :class="{'tui-form__highlight':highlight}"
			:style="{padding:getPadding,background:getBgColor,borderRadius:getRadius}" @tap="handleClick">
			<!-- #ifdef APP-NVUE -->
			<view class="tui-form__asterisk" v-if="asterisk">
				<text :style="{color:getAsteriskColor}">*</text>
			</view>
			<!-- #endif -->
			<!-- #ifndef APP-NVUE -->
			<view class="tui-form__asterisk" v-if="asterisk" :style="{color:getAsteriskColor}">*</view>
			<!-- #endif -->
			<view class="tui-form__label" :style="getLabelStyl" v-if="label">{{label}}</view>
			<view class="tui-form__item-content">
				<slot></slot>
			</view>
			<slot name="right"></slot>
			<view v-if="bottomBorder" :style="{background:getBorderColor,left:left+'rpx',right:right+'rpx'}"
				class="tui-form__item-bottom"></view>
			<view class="tui-form__item-arrow" v-if="arrow" :style="{'border-color':getArrowColor}">
			</view>
		</view>
		<slot name="row"></slot>
		<view class="tui-form__item-error"
			:class="[absolute?'tui-form__error-absolute':'tui-form__error-relative',errorPosition==3?'tui-form__error-right':'',errorMsg && errorMsg!==true?'tui-form__error-active':'']"
			v-if="((!absolute && errorMsg && errorMsg!==true) || absolute) && prop"
			:style="{paddingLeft:getErrorLeft,paddingRight:getErrorRight}">
			<text class="tui-form__error-text" :class="{'tui-form__error-right':errorPosition==3}"
				:style="{color:getAsteriskColor}">{{errorMsg}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tui-form-item',
		emits: ['click'],
		inject: {
			form: {
				value: "form",
				default: null
			}
		},
		props: {
			padding: {
				type: String,
				default: ''
			},
			marginTop: {
				type: [Number, String],
				default: 0
			},
			marginBottom: {
				type: [Number, String],
				default: 0
			},
			label: {
				type: String,
				default: ''
			},
			labelSize: {
				type: [Number, String],
				default: 0
			},
			labelColor: {
				type: String,
				default: ''
			},
			//2.3.0+
			labelFontWeight: {
				type: [Number, String],
				default: 0
			},
			//v2.9.2+
			labelWidth: {
				type: [Number, String],
				default: 160
			},
			labelRight: {
				type: [Number, String],
				default: 16
			},
			asterisk: {
				type: Boolean,
				default: false
			},
			asteriskColor: {
				type: String,
				default: ''
			},
			background: {
				type: String,
				default: ''
			},
			highlight: {
				type: Boolean,
				default: false
			},
			arrow: {
				type: Boolean,
				default: false
			},
			arrowColor: {
				type: String,
				default: ''
			},
			bottomBorder: {
				type: Boolean,
				default: true
			},
			borderColor: {
				type: String,
				default: ''
			},
			left: {
				type: [Number, String],
				default: 30
			},
			right: {
				type: [Number, String],
				default: 0
			},
			radius: {
				type: String,
				default: ''
			},
			index: {
				type: [Number, String],
				default: 0
			},
			//表单域 model 字段，在使用校验时该属性是必填的
			prop: {
				type: String,
				default: ''
			},
			//错误提示信息布局方式是否使用绝对定位
			absolute: {
				type: Boolean,
				default: true
			},
			//错误提示位置：1-标题左对齐 2-内容左对齐 3-居右对齐
			position: {
				type: [Number, String],
				default: 0
			},
			//表单验证规则，如果平台不支持传入函数，则使用setRules方法传入
			rules: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		computed: {
			getPadding() {
				return this.padding || (uni && uni.$tui && uni.$tui.tuiFormItem.padding) || '28rpx 30rpx';
			},
			getBgColor() {
				return this.background || (uni && uni.$tui && uni.$tui.tuiFormItem.background) || '#fff';
			},
			getRadius() {
				return this.radius || (uni && uni.$tui && uni.$tui.tuiFormItem.radius) || '0';
			},
			getAsteriskColor() {
				return this.asteriskColor || (uni && uni.$tui && uni.$tui.tuiFormItem.asteriskColor) || '#EB0909';
			},
			getLabelStyl() {
				const labelSize = this.labelSize || (uni && uni.$tui && uni.$tui.tuiFormItem.labelSize) || 32;
				const labelColor = this.labelColor || (uni && uni.$tui && uni.$tui.tuiFormItem.labelColor) || '#333';
				const weight = this.labelFontWeight || (uni && uni.$tui && uni.$tui.tuiFormItem.labelFontWeight) || 400;
				return `width:${this.labelWidth}rpx;font-size:${labelSize}rpx;color:${labelColor};padding-right:${this.labelRight}rpx;font-weight:${weight};`
			},
			getArrowColor() {
				return this.arrowColor || (uni && uni.$tui && uni.$tui.tuiFormItem.arrowColor) || '#c0c0c0';
			},
			getBorderColor() {
				return this.borderColor || (uni && uni.$tui && uni.$tui.tuiFormItem.borderColor) || '#eaeef1';
			},
			errorPosition() {
				return this.position || (uni && uni.$tui && uni.$tui.tuiFormItem.position) || 2
			},
			getErrorRight() {
				//padding值不可为空，因为需要放置错误信息
				const padding = this.getPadding || '28rpx 30rpx'
				const arr = padding.split(' ')
				return arr[1] || arr[0] || '30rpx'
			},
			getErrorLeft() {
				const position = this.errorPosition
				let left = '30rpx'
				if (position == 2) {
					const pr = this.getErrorRight
					const pdr = pr ? pr.replace('rpx', '').replace('px', '') : 0;
					left = (Number(this.labelWidth) + Number(pdr)) + 'rpx'
				}
				return left;
			}
		},
		data() {
			return {
				errorMsg: '',
				showError: false,
				itemValue: '',
				watchKey: '',
				//是否即时校验
				isImmediate: false,
				//item项自己的rules
				formItemRules: null
			}
		},
		watch: {
			prop: {
				handler(val) {
					const key = `form.model.${val || 'prop_key_empty'}`
					if (val && val !== true && this.form && key != this.watchKey) {
						this.watchKey = key
						this.$watch(key, (val) => {
							if (this.isImmediate && this.prop && this.form) {
								this.form.immediateValidator(this.prop).then(res => {
									if (res.isPass) {
										this.errorMsg = ''
									} else {
										this.errorMsg = res.errorMsg
									}
								}).catch(err => {
								})
							} else {
								if (this.showError && val != this.itemValue) {
									this.errorMsg = ''
								}
							}
						})
					}
				},
				immediate: true
			}
		},
		// #ifndef VUE3
		beforeDestroy() {
			this.uninstall()
		},
		// #endif
		// #ifdef VUE3
		beforeUnmount() {
			this.uninstall()
		},
		// #endif
		created() {
			if (this.form) {
				this.form.children.push(this)
				//主要用于动态表单初始化值
				this.isImmediate = this.form.isImmediate;
				this.showError = this.form.showMessage ? false : true
			}
		},
		methods: {
			handleClick() {
				this.$emit('click', {
					index: this.index
				});
			},
			//设置校验规则
			setRules(rules) {
				this.formItemRules = rules
			},
			//设置校验规则，并合并或替换Form组件中该prop对应的rules【当页面调用Form组件校验方法传入rules时进行合并操作】
			//该方法作为备用方法，如果有需要再进行放开【仅当动态formItem组件，并且当前rules未设置在总rules数据里时使用】
			setRulesMerge(rules) {
				this.formItemRules = rules || this.rules
				if (this.form) {
					const index = this.form.concatRules.findIndex(e => e.name === rules.name || e.name === this.prop)
					const rule = this.getRules()
					if (!rule) return;
					if (index === -1) {
						this.form.concatRules.push(rule)
					} else {
						this.form.concatRules[index] = rule
					}
				}
			},
			//是否开启即时校验
			immediateValidate(isOpen) {
				this.isImmediate = isOpen;
			},
			// Form组件获取当前FormItem 项 rules数据
			getRules() {
				//优先使用setRules 方法传入的rules值
				const rules = this.formItemRules || this.rules
				if (!rules.name && (rules.rule || rules.validator)) {
					rules['name'] = this.prop
				}
				//当未传入prop则不进行校验
				return !rules.name ? null : rules
			},
			/**
			 * 验证方法
			 * @param {any} value 值，不传则使用Form组件model中值
			 */
			validate(value) {
				const rules = this.getRules()
				return new Promise((resolve, reject) => {
					if (this.form && rules) {
						const model = {}
						let val = value;
						if (val === undefined || val === null) {
							val = this.form.model[rules.name] || null
						}
						model[rules.name] = val;

						this.form.immediateValidator(rules.name, model, [rules]).then(res => {
							if (res.isPass) {
								this.errorMsg = ''
							} else {
								this.errorMsg = res.errorMsg
							}
							resolve(res)
						}).catch(err => {
							reject(err)
						})
					}else{
						reject({
							isPass: false,
							errorMsg: '未检测到Form组件或rules校验规则数据！'
						})
					}
				})
			},
			clearValidate() {
				this.errorMsg = ''
			},
			uninstall() {
				this.form && this.form.uninstall(this)
			}
		}
	}
</script>

<style scoped>
	.tui-form__item-outer {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		/* #endif */
		position: relative;
		flex-direction: column;
	}

	.tui-form__item-wrap {
		/* #ifndef APP-NVUE */
		width: 100%;
		box-sizing: border-box;
		display: flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		align-items: center;
		position: relative;
	}

	.tui-form__highlight:active {
		background-color: #f1f1f1 !important;
	}

	.tui-form__asterisk {
		position: absolute;
		left: 12rpx;
		/* #ifndef APP-NVUE */
		height: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		line-height: 1.15;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		align-items: center;
		justify-content: center;
		line-height: 1;
		/* #endif */
	}

	.tui-form__item-label {
		padding-right: 12rpx;
		/* #ifndef APP-NVUE */
		display: inline-block;
		flex-shrink: 0;
		/* #endif */
	}

	.tui-form__item-content {
		flex: 1;
	}

	.tui-form__item-bottom {
		position: absolute;
		bottom: 0;
		/* #ifdef APP-NVUE */
		height: 0.5px;
		z-index: -1;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 1px;
		-webkit-transform: scaleY(0.5) translateZ(0);
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 100%;
		z-index: 1;
		/* #endif */
	}

	.tui-form__item-arrow {
		height: 40rpx;
		width: 40rpx;
		border-width: 3px 3px 0 0;
		border-style: solid;
		transform: rotate(45deg) scale(0.5);
		/* #ifndef APP-NVUE */
		border-radius: 4rpx;
		flex-shrink: 0;
		margin-left: auto;
		box-sizing: border-box;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-top-right-radius: 3rpx;
		/* #endif */
		transform-origin: center center;
		margin-right: -5.8579rpx;
	}

	.tui-form__item-error {
		/* #ifndef APP-NVUE */
		width: 100%;
		z-index: 2;
		box-sizing: border-box;
		/* #endif */
		font-size: 24rpx;
		line-height: 32rpx;
	}

	.tui-form__error-relative {
		position: relative;
		padding-top: 4rpx;
		padding-bottom: 4rpx;
	}

	.tui-form__error-absolute {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		/* #ifndef APP-NVUE */
		transform: translateY(-100%);
		/* #endif */
		/* #ifdef APP-NVUE */
		transform: translateY(-24rpx);
		/* #endif */
		opacity: 0;
		transition-property: transform, opacity;
		transition-duration: 0.3s;
	}

	.tui-form__error-active {
		opacity: 1;
		transform: translateY(0);
	}

	.tui-form__error-text {
		font-size: 24rpx;
	}

	.tui-form__error-right {
		text-align: right;
	}

	.tui-form__label {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}
</style>
