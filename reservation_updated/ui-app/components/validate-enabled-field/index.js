import React from 'react';
import Select from 'react-select';
import appValidations from '../../services/formFieldAPIs';
import appConstants from '../../services/constants';
import Moment from 'react-moment';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';

// Note: config options starting with '_' are not to be used by outer module
class ValidateEnabledField extends React.Component {
    constructor(props) {
        super(props);
        this.getOptions = this.getOptions.bind(this);
        this.state = this.getInitialState(this.props.config);
    }
    getInitialState(fieldConfig) {
        return Object.assign({
            isActive: true,
            inputType: null,
            validations: [],
            // Override this flag for firing validations immediately
            validationTime: null,
            isStaticControl: false,
            classList: '',
            labelName: null,
            isMandatory: false,
            fieldOptions: [],
            valueKey: 'value',
            labelKey: 'displayValue',
            searchConfig: {
                keyStrokeCount: 0
            },
            additionalConfig: {},
            // Override this property to provide react-select attributes
            dropdownConfig: {}
        }, fieldConfig, {
            // These properties are not supposed to be overridden by props
            validationResult: {
                status: true,
                validationMessage: null
            }
        });
    }
    getOptions(input, callback) {
        let { searchConfig } = this.state;
        input = input.trim();
        if(input.length >= searchConfig.keyStrokeCount) {
            callback('', {
                options: this.state.fieldOptions
            });
        } else {
            callback('', {
                options: []
            });
        }
    }
    render() {
        let componentContent = null,
            config = { ...this.state };
        if(config.isActive) {
            let fieldValue = config.fieldValue;
            let inputType = config.inputType;
            let labelName = config.labelName;
            let optionsMap = {};
            let labelKey = config.labelKey;
            let valueKey = config.valueKey;
            this.state.fieldOptions.forEach((option) => {
                optionsMap[option[valueKey]] = option[labelKey];
            });
            switch(inputType) {
                case 'DECIMAL':
                    config.inputType = 'NUMBER';
                case 'NUMBER':
                case 'TEXT':
                case 'PASSWORD':
                    if(config.isStaticControl) {
                        componentContent = fieldValue;
                    } else {
                        componentContent = (
                            <input type={config.inputType.toLowerCase()}
                                   readOnly={config.readOnly}
                                   ref={(input) => {
                                       this.input = input;
                                   }}
                                   defaultValue={fieldValue}
                                   onKeyDown={this._onInputEnter}
                                   onBlur={() => {
                                       this.updateValueToModel(this.input.value);
                                   }}
                                   onChange={() => {
                                       this.updateValueToModel(this.input.value);
                                   }}
                                   maxLength={config.maxLength}
                                   placeholder={config.placeholder}
                                   className={'fk-input ' + config.classList}/>
                        );
                    }
                    break;
                case 'TEXTAREA':
                    if(config.isStaticControl) {
                        componentContent = fieldValue;
                    } else {
                        componentContent = (
                            <textarea readOnly={config.readOnly}
                                      ref={(input) => {
                                          this.input = input;
                                      }}
                                      defaultValue={fieldValue}
                                      onKeyDown={this._onInputEnter}
                                      onBlur={() => {
                                          this.updateValueToModel(this.input.value);
                                      }}
                                      onChange={() => {
                                          this.updateValueToModel(this.input.value);
                                      }}
                                      maxLength={config.maxLength}
                                      placeholder={config.placeholder}
                                      className={'fk-textarea ' + config.classList}></textarea>
                        );
                    }
                    break;
                case 'DATE':
                    // If inputValue is string: typecast it to long
                    if(typeof fieldValue === 'string') {
                        componentContent = +fieldValue;
                        // If typecasting failed, set it to null
                        if(isNaN(fieldValue)) {
                            fieldValue = null;
                        }
                    }
                    if(config.isStaticControl) {
                        componentContent = fieldValue ? (
                            <Moment format={appConstants.momentDateFormat}>{fieldValue}</Moment>
                        ): null;
                    } else {
                        componentContent = (
                            <SingleDatePicker
                                ref={(input) => {
                                    this.input = input;
                                }}
                                numberOfMonths={1}
                                readOnly={true}
                                customInputIcon={<i className='icon icon-datepicker'></i>}
                                date={fieldValue ? moment(fieldValue): null} // momentPropTypes.momentObj or null
                                onDateChange={selectedDate => {
                                    selectedDate = selectedDate.valueOf();
                                    this.updateValueToModel(selectedDate);
                                }} // PropTypes.func.isRequired
                                focused={this.state.focused}
                                displayFormat={appConstants.momentDateFormat}
                                onFocusChange={({ focused }) => this.setState({ focused })} 
                                {...config.additionalConfig}/>
                        );
                    }
                    break;
                case 'DROPDOWN':
                    if(config.isStaticControl) {
                        if(fieldValue) {
                            if(config.multiSelect) {
                                componentContent = fieldValue.map(option => option[labelKey]).join(', ');
                            } else {
                                componentContent = fieldValue[labelKey];
                            }
                        }
                    } else {
                        componentContent = (
                            <Select.Async valueKey={valueKey}
                                          labelKey={labelKey}
                                          value={fieldValue}
                                          className="cp-react-select"
                                          ref={(input) => {
                                              this.input = input;
                                          }}
                                          onChange={(selectedField) => {
                                              this.updateValueToModel(selectedField);
                                          }}
                                          loadOptions={this.getOptions}
                                          autoload={false}
                                          {...config.dropdownConfig}
                            />
                        );
                    }
                    break;
                default:
                    console.error('Input Type not valid: ', config.inputType);
            }
            if(config.isStaticControl) {
                if ([null, undefined, ''].indexOf(componentContent) > -1) {
                    componentContent = '--';
                }
                componentContent = <div className='flat-content'>{componentContent}</div>;
            }
            // If labelName exists and is optional and is editable field
            // if(labelName && !config.isMandatory && !config.isStaticControl) {
            //     labelName += ' (Optional)';
            // }
            return (
                <div className='validate-field-container'>
                    {labelName ? (
                        <div className={'label ' + (config.isStaticControl ? 'flat-text': '')}>
                            {labelName}
                        </div>
                    ): null}
                    {componentContent}
                    {!this.state.validationResult.status && (
                        <div className='error-message'>{this.state.validationResult.validationMessage}</div>
                    )}
                </div>
            );
        } else {
            return null;
        }
    }
    componentWillReceiveProps(props) {
        let previousConfig = this.state;
        let newConfig = Object.assign({}, previousConfig, props.config);
        // New field initialization - as id or inputType has changed
        if(newConfig.id !== previousConfig.id || newConfig.inputType !== previousConfig.inputType) {
            newConfig._newInitialization = true;
            this.setState(this.getInitialState(newConfig));
            return;
        }
        // If validations are to be executed
        if(previousConfig.validationTime !== newConfig.validationTime) {
            let fieldValue;
            switch(newConfig.inputType) {
                case 'TEXTAREA':
                case 'TEXT':
                case 'NUMBER':
                case 'DECIMAL':
                case 'PASSWORD':
                case 'SWITCH':
                    fieldValue = props.config.fieldValue;
                    break;
                case 'DROPDOWN' :
                    fieldValue = props.config.fieldValue;
                    break;
                case "DATE":
                    fieldValue = props.config.fieldValue;
                    break;
            }
            newConfig.validationResult = this.executeValidations(fieldValue, newConfig);
            props.onValueChange({
                id: newConfig.id,
                selectedValue: fieldValue,
                validationStatus: newConfig.validationResult.status
            });
        }
        this.setState(newConfig);
    }
    componentDidUpdate() {
        let config = this.state;
        if(config._newInitialization) {
            // Clearing Input field value
            if(this.input) {
                this.input.value = '';
            }
            // Setting values from fieldConfig
            let ignorableValues = [undefined];
            if(ignorableValues.indexOf(config.fieldValue) > -1) {
                switch(this.inputType) {
                    case 'TEXTAREA':
                    case 'TEXT':
                    case 'NUMBER':
                    case 'DECIMAL':
                    case 'PASSWORD':
                        this.input.value = config.fieldValue;
                        break;

                }
            }
            this.setState({
                _newInitialization: false
            });
        }
    }
    updateValueToModel(selectedValue) {
        let config = this.state;
        let validationResult = this.executeValidations(selectedValue, config);
        // Update model only when local state has been updated
        this.setState({
            validationResult: validationResult
        }, () => {
            this.props.onValueChange({
                id: config.id,
                selectedValue,
                validationStatus: validationResult.status
            });
        });
    }
    executeValidations(fieldValue, config) {
        let validations = [...config.validations];
        // Integration of isMandatory flag with validations
        if(config.isMandatory) {
            // Inserting in the beginning
            validations.splice(0, 0, {
                validator: 'required',
                validationMessage: 'This field can not be left blank'
            });
        }
        let validationResult = {
            status: true
        };
        // isStaticControl: Display any static value won't require any validations to be fired
        // isActive: This flag indicates if the field is enabled
        if(config.isActive && !config.isStaticControl) {
            // Empty Field Value with non-mandatory should pass
            if(fieldValue === '' && !config.isMandatory) {
                return validationResult;
            }
            validations.some((validation) => {
                let validator, options = [];
                if(typeof validation.validator === "string") {
                    options = validation.validator.split(':');
                    validator = appValidations[options[0]];
                } else {
                    validator = validation.validator;
                }
                if(validator) {
                    let result = validator(fieldValue, ...options.slice(1, options.length));
                    if(!result) {
                        validationResult.status = false;
                        validationResult.validationMessage = validation.validationMessage;
                        return true;
                    }
                } else {
                    console.error('Validation not defined: ' + validation.validator);
                }
            });
        }
        return validationResult;
    }
}

export default ValidateEnabledField;
