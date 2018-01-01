
//§§ Here we will ceate react component for generate form with validation.

//§ React componnet for input component
var MyInput = React.createClass({
    //§ 
    componenetDidMount: function () {
        if (this.props.onComponentDidMount) {
            this.props.oncomponentDidMount(this); // register this input in the form
        }
    },
    //§ onchange event
    handleChange: function(e) {
        this.props.onChange(e.target.value);
        var isValidField = this.isValid(e.target);
    },
    //§ validation function
    isValid: function (input) {
        //§ check required field
        if (input.getAttribute('required') != null && input.value === "") {
            input.classList.add('error'); // add 'error' class
            input.nextSibling.textContent = this.props.messageRequired; // show error message
            return false;
        }
        else
        {
            input.classList.remove('error');
            input.nextSibling.textContent = "";
        }

        //§ check data type // email validation // etc...
        if (input.getAttribute('type') == "email" && input.value != "") {
            if (!this.validateEmail(input.value)) {
                input.classList.add('error');
                input.nextSibling.textContent = this.props.messageEmail;
                return false;
            }
            else {
                input.classList.remove('error');
                input.nextSibling.textContent = "";
            }
        }

        return true;
    },
    // email validation function
    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);  
    },
    //§ render
    render: function () {
        var inputField;
        if (this.props.type == 'textarea') {
            inputField = <textarea value={this.props.value} ref={this.props.name} name={this.props.name}
                className='form-control' required={this.props.isrequired} onChange={this.handleChange} />
        }
        else {
            inputField = <input type={this.props.type} value={this.props.value} ref={this.props.name} name={this.props.name}
            className='form-control' required={this.props.isrequired} onChange={this.handleChange} />
        }

        return (
                <div className="form-group">
                    <label htmlFor={this.props.htmlFor}>{this.props.label}:</label>
                    {inputField}
                    <span className="error"></span>
                </div>
        );
    }
});

//§ React component for generate form
var ContactForm = React.createClass({
    //get initial state enent
    getInitialState : function(){
        return {
            Fullname : '',
            Email:'',
            Message : '',
            Fields : [],
            ServerMessage : ''
        }
    },
    // submit function
    handleSubmit : function(e){
        e.preventDefault();
        //Validate entire form here
        var validForm = true;
        this.state.Fields.forEach(function(field){
            if (typeof field.isValid === "function") {
                var validField = field.isValid(field.refs[field.props.name]);
                validForm = validForm && validField;
            }
        });
        //after validation complete post to server 
        if (validForm) {
            var d = {
                Fullname: this.state.Fullname,
                Email : this.state.Email,
                Message : this.state.Message
            }
 
            $.ajax({
                type:"POST",
                url : this.props.urlPost,
                data : d,
                success: function(data){
                    //Will clear form here
                    this.setState({
                        Fullname : '',
                        Email  : '',
                        Message : '',
                        ServerMessage: data.message
                    });
                }.bind(this),                
                error : function(e){
                    console.log(e);
                    alert('Error! Please try again');
                }
            });
        }
    },
    //handle change full name
    onChangeFullname : function(value){
        this.setState({
            Fullname : value
        });
    },
    //handle chnage email
    onChangeEmail : function(value){
        this.setState({
            Email : value
        });
    },
    //handle change message 
    onChangeMessage : function(value){
        this.setState({
            Message : value
        });
    },
    //register input controls
    register : function(field){
        var s = this.state.Fields;
        s.push(field);
        this.setState({
            Fields : s
        })
    },
    //render
    render : function(){
        //Render form 
        return(
            <form name="contactForm" noValidate onSubmit={this.handleSubmit}>
                <MyInput type={'text'} value={this.state.Fullname} label={'Full Name'} name={'Fullname'} htmlFor={'Fullname'} isrequired={true}
                    onChange={this.onChangeFullname} onComponentMounted={this.register} messageRequired={'FullName required'} />
                <MyInput type={'email'} value={this.state.Email} label={'Email'} name={'Email'} htmlFor={'Email'} isrequired={true}
                    onChange={this.onChangeEmail} onComponentMounted={this.register} messageRequired={'Email required'} messageEmail={'Invalid Email'} />
                <MyInput type={'textarea'} value={this.state.Message} label={'Message'} name={'Message'} htmlFor={'Message'} isrequired={true}
                    onChange={this.onChangeMessage} onComponentMounted={this.register} messageRequired={'Message required'} />
                <button type="submit" className="btn btn-default">Submit</button> 
                <p className="servermessage">{this.state.ServerMessage}</p>
            </form>
        );
    }
});

//Render react component into the page
ReactDOM.render(<ContactForm urlPost="/Simpleform/SaveContactData" />, document.getElementById('contactFormArea'));
