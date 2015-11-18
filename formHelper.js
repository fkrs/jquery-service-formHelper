var FormHelper = function(el, callback){
	this._els = {
		form: el,
		inputs: el.getElementsByTagName('input'),
		textareas: el.getElementsByTagName('textarea')
	};
	this._callback = callback || function(){};
	this._bindEvents();
};

FormHelper.prototype._bindEvents = function(){
	var $form = $(this._els.form),
		self = this;

	//keyup
	$form.on('keyup', this._validate.bind(this));

	//submit
	$form.on('submit', function(e){
		e.preventDefault();
		if(self._validate.call(self)){
			//send form
			self._sendForm();
		} else {
			self._callback('invalid');
		}
	});
};

FormHelper.prototype._validate = function(){
	var $form = $(this._els.form),
		valid = true,
		self = this;

	this._loopEls(function(currEl){
		if(self._validateEl(currEl) === false){
			valid = false;
			currEl.classList.add('has-error');
		} else {
			currEl.classList.remove('has-error');
		}
	});

	if(valid){
		//valid
		$form.addClass('js-form--valid');
		return true;
	} else {
		$form.removeClass('js-form--valid');
		return false;
	}
};

FormHelper.prototype._loopEls = function(callback){
	var els = this._els,
		inputs = els.inputs,
		textareas = els.textareas,
		self = this;

	var completeArr = inputs;
	for(var i = textareas.length-1; i >= 0; i--){
		completeArr.push(textareas[i]);
	}

	for(var i = 0, l = completeArr.length; i < l; i++){
		callback(completeArr[i]);
	}
};

FormHelper.prototype._validateEl = function(el){
	if(el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA'){
		return null;
	}

	var val = el.value;

	if(el.hasAttribute('required') && el.getAttribute('type') !== 'submit'){

		//if el is required
		if(el.hasAttribute('data-pattern')){
			//if there is a custom pattern, use it
			var regex = el.getAttribute('data-pattern');
			return new RegExp(regex).test(val);
		} else {

			//check if we should check using a default pattern
			switch(el.getAttribute('type')){
				case 'email':
					return /.+\@.+\..+/.test(val);
					break;
			}
		}
	}

	return true;
};

FormHelper.prototype._sendForm = function(){
	var els = this._els,
		$form = $(els.form),
		url = els.form.action,
		self = this,
		data = '';

	$form.addClass('js-form--sending');

	this._loopEls(function(el){
		if(el.getAttribute('type') !== 'submit'){
			data += el.name+'='+el.value+'&';
		}
	});

	$.ajax({
		type: 'POST',
		url: url,
		data: data,
		success: function(data){
			$form.removeClass('js-form--sending');
			$form.removeClass('js-form--error');
			$form.addClass('js-form--success');

			self._loopEls(function(el){
				if(el.getAttribute('type') !== 'submit'){
					el.value = '';
				}
			});

			self._callback('success', data);
		},
		error: function(data){
			$form.removeClass('js-form--sending');
			$form.removeClass('js-form--success');
			$form.addClass('js-form--error');
			self._callback('error', data);
		}
	});
};
