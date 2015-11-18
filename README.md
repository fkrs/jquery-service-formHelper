```javascript
new FormHelper(formEl, function(status, data){
    //status options:
    //1. success: successfully posted to the URL the form's action attr, data is set
    //2. error: unsuccessfully posted to the URL the form's action attr, data is set
    //3. invalid: invalid form input
});
```
