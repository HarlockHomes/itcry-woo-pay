<?php
/**
 * ITCRY WOOPAY - Easypay WeChat Block Payment Method
 *
 * 为 WooCommerce 区块结账提供易支付微信支付支持
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;

function itcry_blocks_log( $message ) {
	$log_dir = ITCRY_WOOPAY_PATH . 'logs/';
	if ( ! file_exists( $log_dir ) ) {
		wp_mkdir_p( $log_dir );
	}
	$log_file = $log_dir . 'blocks-debug.log';
	$time = date( 'Y-m-d H:i:s' );
	$log_message = "[{$time}] {$message}\n";
	file_put_contents( $log_file, $log_message, FILE_APPEND );
}

class ITCRY_WOOPAY_Easypay_WX_Block extends AbstractPaymentMethodType {

	protected $name = 'itcry_woo_pay_easypay_wx';

	public function initialize() {
		$this->settings = get_option( 'woocommerce_itcry_woo_pay_easypay_wx_settings', [] );
	}

	public function is_active() {
		$is_enabled = ! empty( $this->settings['enabled'] ) && 'yes' === $this->settings['enabled'];
		itcry_blocks_log( 'is_active = ' . ( $is_enabled ? 'true' : 'false' ) . ', settings = ' . json_encode( $this->settings ) );
		return $is_enabled;
	}

	public function get_payment_method_script_handles() {
		$script_url = ITCRY_WOOPAY_URL . 'assets/js/blocks/payment-method-easypay-wx.js';

		wp_register_script(
			'wc-itcry-woo-pay-easypay-wx-blocks',
			$script_url,
			array( 'wc-blocks-checkout', 'wc-settings', 'wp-i18n', 'wp-element' ),
			'1.0.0',
			true
		);

		$wp_plugin_dir = plugin_dir_path( ITCRY_WOOPAY_FILE );
		if ( defined( 'ITCRY_WOOPAY_FILE' ) ) {
			wp_set_script_translations(
				'wc-itcry-woo-pay-easypay-wx-blocks',
				'itcry-woo-pay',
				$wp_plugin_dir . 'languages/'
			);
		}

		itcry_blocks_log( 'Script handle = wc-itcry-woo-pay-easypay-wx-blocks' );

		return array( 'wc-itcry-woo-pay-easypay-wx-blocks' );
	}

	public function get_payment_method_data() {
		$title       = $this->settings['title'] ?? __( '易支付 - 微信支付', 'itcry-woo-pay' );
		$description = $this->settings['description'] ?? __( '使用易支付微信收款', 'itcry-woo-pay' );

		$data = array(
			'name'        => $this->name,
			'title'       => $title,
			'description' => $description,
			'icon'        => $this->settings['icon'] ?? '',
			'supports'    => array( 'products' ),
			'enabled'     => $this->settings['enabled'] ?? 'no',
		);

		itcry_blocks_log( 'get_payment_method_data = ' . json_encode( $data, JSON_UNESCAPED_UNICODE ) );

		return $data;
	}

	public function get_api_endpoint() {
		itcry_blocks_log( 'get_api_endpoint called' );
		return '';
	}

	public function get_supported_features() {
		return array( 'products' );
	}
}
