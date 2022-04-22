const getUserProfile = async () => {
    const profile = await axios({
        url: '/api/user-profile',
        method: "GET"
    })
    return profile.data
}

const setAuthHeader = (auth) => {
   axios.defaults.headers.common["Authorization"] = auth
}