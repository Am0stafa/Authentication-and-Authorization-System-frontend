import './socialMedia.css'

// this component is for the social media login
const SocialMedia = () => {
  return (
    <div className="container-fluid loginbg">
      <div className="col-md-offset-3 col-md-6 col-sm-offset-2 col-sm-8 col-xs-12 login-box">
        <div className="login-third-party-login">
          <p className="login-button-info-text login-info-text text-center">EASILY USING</p>
          <div className="login-button-container container-fluid">
            <div className="col-md-6 col-sm-6 col-xs-6">
              <button className="login-google login-button" id="gPlusLogin" onClick={()=> console.log('hi')}  >
                <span className="header-sprite login-gplus-logo" />
                    GOOGLE
              </button>
            </div>
          </div>
        </div>
        <p className="login-info-text text-center">- OR USING EMAIL -</p>
      </div>
    </div>
  )
}

export default SocialMedia