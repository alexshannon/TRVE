let uat;

const Spotify = {
    getAccessToken(){
        if(uat){
            return uat;
        }
        //check for uat match
        const accessToken = window.location.href.match(/access_token=([^&]*)/)
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/)
        if(accessToken && expiryTime){
            uat = accessToken
            const expiresIn = Number(expiryTime[1])
            //clears params, grabs new token when expires
            window.setTimeout(() => uat = '', expiresIn * 1000)
            window.history.pushState('Access Token', null, '/')
            return uat;
        }
    }

}
export default Spotify;