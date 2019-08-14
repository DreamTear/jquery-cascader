/**
 * jquery.cascader.js 级联菜单
 * @authors wangy (wangy@huilan.com)
 * @date    2019-07-19 17:03:00
 * @version 1.1.0
 */

+function($) {
	function Cascader (opt) {
		var def = {
			displayField: 'name',
			valueField: 'id',
			separator: '/',
			data: []
		};
		this.el = opt.el;
		this.$el = $(this.el);
		this.data = opt.data;
		this.option = $.extend(def, opt);
		this.checkeditems = [];
		this.inited = false;

		this.init();
	}
	Cascader.prototype.init = function() {
		this.wrapEl();
		this.creatDropdownEl();
		// var $menu = this.creatCascaderMenu(this.data);
		// this.$dropdownEl.append($menu);
		this.initValue();
		this.inited = true;
	};
	Cascader.prototype.wrapEl = function() {
		var me = this;
		var $showEl = $('<div class="input-group">'
		  + '<input type="text" class="form-control"/>'
		  + '<span class="input-group-addon"><i class="glyphicon glyphicon-chevron-down"></i></span>'
		+ '</div>');
		// var $warperEl = $('<div class="cascader-wrapper"></div>');
		me.$el.wrap('<div class="cascader-wrapper"></div>').hide();
		me.$el.after($showEl);
		me.$showInput = $('input', $showEl);
		me.$triggerEl = $('.input-group-addon', $showEl);

	}
	Cascader.prototype.creatDropdownEl = function() {
		// var position = this.$showInput.offset();
		// var elH = this.$showInput.outerHeight(true); // 计算input带边框的高度
		this.$dropdownEl = $('<div class="cascader-dropdown-container"></div>');
		// this.$dropdownEl.css({
		// 	left: position.left,
		// 	top: position.top + elH
		// });
		$('body').append(this.$dropdownEl);
		this.initEvent();
	};
	Cascader.prototype.computeDropdownElPosition = function() {
		var position = this.$showInput.offset();
		var elH = this.$showInput.outerHeight(true); // 计算input带边框的高度
		this.$dropdownEl.css({
			left: position.left,
			top: position.top + elH
		});
	};
	Cascader.prototype.creatCascaderMenu = function(data, selectItem) {
		var $menu = $('<ul class="cascader-menu"></ul>')
		$.each(data, function(index, item) {
			var $item = $('<li class="cascader-menu-item">' + item.name + '</li>');
			if (item.children) {
				$item.addClass('cascader-menu-item-expand')
				$item.append('<i class="glyphicon glyphicon-menu-right"></i>')
			}
			if(selectItem && item == selectItem) {
				$item.addClass('cascader-menu-item-active');
			}
			$item.data('cascader-data', item)
			$menu.append($item)
		})
		return $menu;
	};
	Cascader.prototype.initEvent = function() {
		var me = this;
		var timer;
		var newCheckeditems = [];
		me.$dropdownEl.on('click', 'li', function(event) {
			var $this = $(this);
			var data = $this.data('cascader-data');
			var $parent = $this.parent();
			var parentIndex = $parent.index();
			// var checkeditems = me.checkeditems;

			if (timer) {
				clearTimeout(timer);
			}

			if ($this.hasClass('cascader-menu-item-active')) {
				if(data.children) {
					return
				} else {
					me.hideDropdown();
				}
			}

			$this.addClass('cascader-menu-item-active').siblings().removeClass('cascader-menu-item-active');
			$parent.nextAll().remove();

			if(newCheckeditems.length > parentIndex) {
				newCheckeditems = newCheckeditems.slice(0, parentIndex);
			}
			newCheckeditems.push(data);

			if (data.children) {
				var $nextMenu = me.creatCascaderMenu(data.children);
				$parent.after($nextMenu);
			}else {
				me.checkeditems = newCheckeditems;
				me.setValue();
				me.hideDropdown();
			}
		});
		me.$showInput.on('focus', function(event) {
			event.stopPropagation();
			me.showDropdown();
		});
		// me.$showInput.on('blur', function(event) {
		// 	event.stopPropagation();
		// 	me.hideDropdown();
		// });
		me.$showInput.on('click', function(event) {
			event.stopPropagation();
		});
		me.$triggerEl.on('click', function(event) {
			event.stopPropagation();
			if(me.$dropdownEl.is(':visible')) {
				me.hideDropdown();
			} else {
				me.showDropdown();
			}
		});
		$(document).on('click', function(event) {
			var target = event.target;
			if ($(target).hasClass('cascader-menu-item')) {
				return;
			}
			timer = setTimeout(function() {
				me.hideDropdown();
			}, 2);
		})

	};
	Cascader.prototype.showDropdown = function() {
		this.computeDropdownElPosition();
		this.$dropdownEl.show();
	};
	Cascader.prototype.hideDropdown = function() {
		this.$dropdownEl.hide();
	};
	Cascader.prototype.setValue = function() {
		var me = this;
		var option = me.option;
		var showProp = option.displayField;
		var submitProp = option.valueField;
		var showValue = [];
		var len = me.checkeditems.length;
		var submitValue =  len > 0 ? me.checkeditems[len - 1][submitProp] : '';
		$.each(me.checkeditems, function(index, item) {
			showValue.push(item[showProp]);
		});
		me.$showInput.val(showValue.join(option.separator));
		// 不是初始化完成前调用setValue，不触发事件；
		if (!me.inited || me.oldSubmitValue == submitValue) {
			return;
		}
		me.oldSubmitValue = submitValue;
		me.$el.val(submitValue);
		me.$el.trigger('change.cascader', [submitValue, me.checkeditems]);
	};
	Cascader.prototype.clearValue = function() {
		var me = this;
		me.checkeditems = [];
		me.setValue();
	};
	Cascader.prototype.initValue = function() {
		var me = this;
		var option = me.option;
		var val = me.$el.val().trim();
		
		if(option.value) {
			val = option.value
		}

		var path = getPath(me.data, val, option.valueField);
		me.oldSubmitValue = val;
		me.checkeditems = path;
		me.initMenu(me.checkeditems);
		me.setValue();
	};
	Cascader.prototype.initMenu = function() {
		var me = this;
		var data = me.data;
		var $menu

		if (me.checkeditems.length === 0) {
			$menu = me.creatCascaderMenu(me.data);
			me.$dropdownEl.append($menu);
		}
		
		$.each(me.checkeditems, function(index, item) {
			$menu = me.creatCascaderMenu(data, item);
			me.$dropdownEl.append($menu);
			if(item.children) {
				data = item.children;
			}
			
		})
	};
	Cascader.prototype.val = function() {
		var me = this;
		if(arguments.length === 0) {
			rturn me.oldSubmitValue
		} else {
			var val = arguments[0];
			var path = getPath(me.data, val, me.option.valueField);
			me.checkeditems = path;
			me.setValue();
		}
	}

	function getPath(data, val, key) {
		var obj = [];
		for(var i = 0,l = data.length; i< l; i ++) {
			var item = data[i];
			if(item[key] == val) {
				obj.push(item);
				break;
			} else if(item.children) {
				var subPath = getPath(item.children, val, key);
				if (subPath.length > 0) {
					obj = obj.concat(item, subPath);
				}
			}
		}
		return obj;
	}


$.fn.cascader = function() {
	var args = Array.prototype.slice.call(arguments);
	var opt;
	var res;
	this.each(function() {
		var $this = $(this);
		var cascader = $this.data('cascader');
		if(cascader) {
			if(args.length > 0) {
				opt = args[0];
			}
			if($.type(opt) === 'string') {
				res = cascader[opt](args.slice(1));
				if(res !== undefined) {
					return false
				}
			}
		} else {
			if(args.length > 0) {
				opt = args[0]
			}
			if ($.isPlainObject(opt)) {
				var option = $.extend({el: this}, opt);
				$this.data('cascader', new Cascader(option));
			}
		}
		
	});
	if(res !== undefined) {
		return res;
	} else {
		return this;
	}
};

}(jQuery);