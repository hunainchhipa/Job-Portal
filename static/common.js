const getUserProfile = async () => {
    const profile = await axios({
        url: '/api/user-profile',
        method: "GET"
    })
    return profile.data
}

const getJobs = async () => {
    const jobs = await axios({
        url: '/api/jobs',
        method: "GET"
    })
    return jobs.data
}

const setAuthHeader = (auth) => {
   axios.defaults.headers.common["Authorization"] = auth
}