```javascript
new FormHelper(formEl, function(status, data){
    //status options:
    //1. success: successfully posted to the form's action URL, data is set
    //2. error: unsuccessfully posted to the form's action URL, data is set
    //3. invalid: invalid form input, data is null
});
```
