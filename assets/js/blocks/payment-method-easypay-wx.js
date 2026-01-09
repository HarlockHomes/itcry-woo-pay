/**
 * ITCRY WOOPAY - Easypay WeChat Pay Block Payment Method
 */
console.log('ITCRY Blocks Debug: Script loaded');
console.log('ITCRY Blocks Debug: window.wp =', typeof window.wp);
console.log('ITCRY Blocks Debug: window.wc =', typeof window.wc);

const { __ } = window.wp.i18n;
const { decodeEntities } = window.wp.htmlEntities;
const { createElement } = window.wp.element;

// 使用 window.wc.wcSettings 获取设置（WooCommerce Blocks 的标准方式）
const getSetting = ( key, defaultValue ) => {
	if ( typeof window.wc !== 'undefined' && window.wc.wcSettings && window.wc.wcSettings.getSetting ) {
		return window.wc.wcSettings.getSetting( key, defaultValue );
	}
	console.warn( 'ITCRY Blocks Debug: window.wc.wcSettings is not available, returning default value' );
	return defaultValue;
};

const getPaymentMethodData = () => {
	const data = getSetting( 'paymentMethodData_itcry_woo_pay_easypay_wx', {} );
	console.log('ITCRY Blocks Debug: getSetting result =', data);
	return data;
};

const settings = getPaymentMethodData();
console.log('ITCRY Blocks Debug: Payment method data =', settings);
const label = decodeEntities( settings.title || __( '易支付 - 微信支付', 'itcry-woo-pay' ) );

// 确保 settings 不为空
const finalSettings = settings || {};
console.log('ITCRY Blocks Debug: Final settings =', finalSettings);

const Label = () => {
	const iconImg = finalSettings.icon
		? createElement('img', {
			src: finalSettings.icon,
			alt: label,
			style: { marginRight: '8px', height: '24px', maxWidth: '24px' }
		  })
		: null;

	return createElement('div', {
		style: { display: 'flex', alignItems: 'center', cursor: 'pointer' }
	}, iconImg, createElement('span', null, label));
};

const Content = () => {
	const description = createElement('p', {
		style: { margin: '0 0 1em 0' }
	}, decodeEntities( finalSettings.description || __( '使用易支付微信收款', 'itcry-woo-pay' ) ));

	let instructions = null;
	if ( finalSettings.instructions ) {
		instructions = createElement('div', {
			className: 'payment-instructions',
			style: {
				padding: '10px',
				background: '#f8f8f8',
				borderRadius: '4px',
				fontSize: '14px',
				color: '#666'
			}
		}, decodeEntities( finalSettings.instructions ));
	}

	return createElement('div', { className: 'wc-block-components-payment-method-content' },
		description, instructions
	);
};

const canMakePayment = () => {
	console.log('ITCRY Blocks Debug: canMakePayment called, enabled =', finalSettings.enabled);
	if ( finalSettings.enabled === false || finalSettings.enabled === 'no' ) {
		return false;
	}
	return true;
};

const paymentMethod = {
	name: 'itcry_woo_pay_easypay_wx',
	label: createElement( Label ),
	content: createElement( Content ),
	edit: createElement( Content ),
	canMakePayment: canMakePayment,
	ariaLabel: label,
	supports: {
		features: finalSettings.supports || [ 'products' ],
	},
};

console.log('ITCRY Blocks Debug: window.wc.wcBlocksRegistry =', typeof window.wc?.wcBlocksRegistry);

// 使用正确的注册方式
if ( typeof window.wc !== 'undefined' && window.wc.wcBlocksRegistry && typeof window.wc.wcBlocksRegistry.registerPaymentMethod === 'function' ) {
	console.log('ITCRY Blocks Debug: Registering payment method =', paymentMethod);
	window.wc.wcBlocksRegistry.registerPaymentMethod( paymentMethod );
	console.log('ITCRY Blocks Debug: Payment method registered successfully');
} else {
	console.error('ITCRY Blocks Debug: window.wc.wcBlocksRegistry.registerPaymentMethod is not available');
	console.log('ITCRY Blocks Debug: typeof window.wc =', typeof window.wc);
	console.log('ITCRY Blocks Debug: window.wc =', window.wc);
}
