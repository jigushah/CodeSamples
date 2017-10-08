endCallAction() {
        this.callDisconnectHandler();
        // var navigator = this.props.navigator;
        // navigator.pop();
    }

    /*Init Twilio client methods and make call */
    InitTwilioClientMethods(){

        fetch("http://e55d19e0.ngrok.io/token").then((response) => response.json())
            .then((responseData) => {
                console.log(responseData.token);

                Twilio.initWithToken(responseData.token);
                
         Twilio.addEventListener('deviceReady',(res)=>{

         })
        Twilio.addEventListener('deviceDidStartListening', this.deviceDidStartListening);
        Twilio.addEventListener('deviceDidStopListening', this.deviceDidStopListening);
        Twilio.addEventListener('deviceDidReceiveIncoming', this.deviceDidReceiveIncoming);
        Twilio.addEventListener('connectionDidStartConnecting',(res)=>{

         this.setState({ statusMessage: 'Connecting...' });
        });
        Twilio.addEventListener('connectionDidConnect', ()=>{
            
            this.setState({ statusMessage: 'Connected' });
        });
        Twilio.addEventListener('connectionDidDisconnect', ()=>{
            
            this.setState({ statusMessage: 'DisConnected' });
        });
        Twilio.addEventListener('connectionDidFail', (res)=>{
                        this.setState({ statusMessage: 'Connection Failed'+ JSON.stringify(res)});
        });

        
        setTimeout(() => {
            this.setState({ statusMessage: 'Connecting...' });
                        Twilio.connect({To: this.state.phno});
        }, 6000);
            }).done()
    }
    deviceReady(){
        console.log('device is ready')
    }