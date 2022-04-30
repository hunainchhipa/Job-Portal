const getUserProfile = async () => {
    const profile = await axios({
        url: '/api/user-profile',
        method: "GET"
    })
    return profile.data
}


window.addEventListener("load", (e) => {    
    axios.defaults.headers.common["Authorization"] = `Bearer ${window.localStorage.getItem("token")}`

    getUserProfile().then((res) => {

        const elUserSideName = document.querySelector(".profile-section .user-info .name")

        if(elUserSideName) {
            elUserSideName.innerHTML = res.data.firstname + " " + res.data.lastname
        }

        const elUserName = document.querySelector(".content .card .heading .user-name")

        if(elUserName) {
            elUserName.innerHTML = res.data.firstname + " " + res.data.lastname
        }

        const elUserType = document.querySelector(".profile-section .user-info .type")

        if(elUserType) {
            elUserType.innerHTML = res.data.usertype
        }
    })
})