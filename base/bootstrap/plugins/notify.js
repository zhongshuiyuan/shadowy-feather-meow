var notify = window.notify || (function(document, $) {
	var that = {};

	that.show = function(message, type) {
		//为了修改他们默认的颜色又不影响bootstrap原始的样式
		if (type == 'error') {
			type = 'error-custom';
		} else if (type == 'success') {
			type='success-custom';
		} else if (type == undefined || type == '') {
			type='success-custom';
        }
		$.bootstrapGrowl(message, {
			ele: 'body',
			// which element to append to
			type: type || 'default',
			// (null, 'info', 'error', 'success')
			offset: {
				from: 'top',
				amount: 35
			},
			// 'top', or 'bottom'
			align: 'center',
			// ('left', 'right', or 'center')
			width: 400,
			// (integer, or 'auto')
			delay: 3000,
			allow_dismiss: true,
			stackup_spacing: 10 // spacing between consecutively stacked growls.
		});
	};

	return that;

} (document, window.jQuery));

window.notify = notify;

