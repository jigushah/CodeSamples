async scan() {
        try {
            setLicenseKey(Constant.licenseKey);
        }
        catch (e) {
            this.setState({licenseKeyErrorMessage: 'Please set Your Microblink license key'});
            this._showAlert(this.state.licenseKeyErrorMessage);
        }

       const result = await scan({
            // more detailed options not yet supported
            usdl: {} // or usdl: {} or eudl: {}
        });
        this.props.navigator.push({
            name: Constant.Views.CustomerForm,
            isFromDLScan: true,
            ScanResult: result,
        });
    }
