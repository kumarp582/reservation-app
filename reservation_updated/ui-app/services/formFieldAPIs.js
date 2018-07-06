var validations = {
    validateEmail: function(value) {
        var re = /^[a-zA-Z0-9\.\-_]+@[a-zA-Z0-9]{1,61}[\.][a-zA-Z0-9]{1,61}(?:\.[a-zA-Z0-9]+|)+$/;
        return re.test(value);
    },
    required: function (value) {
        if(typeof value === "string") {
            value = value.trim();
            return !!value;
        }
        if(Array.isArray(value)) {
            return !!value.length;
        }
        return validations.validateInteger(value) || validations.validateDouble(value) || !!value;
    },
    validPincode: function (value) {
        var re = /^\d{6}$/;
        return re.test(value);
    },
    validPhoneNumber: function (value) {
        var re = /^\d{10,14}$/;
        return re.test(value);
    },
    validateIntegerInRange: function (value, start, end) {
        // Conversion of string to numbers
        value = +value;
        start = +start;
        end = +end;
        return validations.validateInteger(value) && value >= start && value <= end;
    },
    validateInteger: function (value) {
        return /^\d+$/.test(value);
    },
    validateDoubleInRange: function (value, start, end) {
        value = +value;
        start = +start;
        end = +end;
        if(!validations.validateDouble(Number(value + ""))) {
            return false;
        }
        return value >= start && value <= end;
    },
    validateDouble: function (value) {
        return /^[\d]+(\.\d{1,2})?$/.test(value) && !isNaN(value);
    },
    validateContent: function (value) {
        var re = /^([A-Z0-9_\[\]{}\(\)&.*=?<>|+,% /\\-])*$/i;
        return re.test(value);
    },
    validatePattern: function(value, pattern) {
        var re = new RegExp('^'+ pattern + '$');
        return re.test(value);
    },
    greaterThan: function (value, min) {
        value = +value;
        min = +min;
        return value > min;
    },
    selectedCount: function (value, minCount, maxCount) {
        value = value || [];
        minCount = +minCount;
        maxCount = +maxCount;
        let elementsCount = value.length;
        return elementsCount >=minCount && elementsCount <= maxCount;
    },
    selected: function (value, optionNumber) {
        value = value || [];
        optionNumber = +optionNumber;
        return value.optionNumber === optionNumber;
    }
};

export default validations;
