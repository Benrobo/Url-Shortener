function log(val){
    return console.log(val)
}

async function ShortUrl(url, type="get", endpoint){
    let validTypes = ["get", "post", "delete"];
    if((url == "" && type == "post") || endpoint == ""){
        return {
            msg: "short parameters are empty"
        }
    }

    if(type.toLowerCase() == "put" || !validTypes.includes(type.toLowerCase())){
        return {
            msg: "Request http method not accepted"
        }
    }
    if(type.toLowerCase() == "get"){
        let data = await fetch(endpoint)
 
        let result = await data.json();
      
        return result
    }
    if(type.toLowerCase() == "post"){
        let data = await fetch(endpoint, {
           method: "post",
           headers: {
               "Content-Type" : "application/json"
           },
           body: JSON.stringify(url)
        })

       let result = await data.json();
     
       return result
    }
}

function _(el){
    return document.querySelector(el)
}
let alrcont = _(".alert-cont")
function sendReq(){
    let btn = _(".urlbtn");
    let form = _(".form");

    btn.onclick = async (e)=>{
        e.preventDefault();
        let formdata = new FormData(form);
        let url = Object.fromEntries(formdata)
        let send = await ShortUrl(url, "post", "/api")

        if(send.msg || send.error == 500){
            alrcont.innerHTML = ""
            alrcont.innerHTML = `
                <div class="alert alert-danger">
                    ${send.msg}
                </div>
            `
        }else{
            alrcont.innerHTML = ""
            appendData(send)
            location.reload()
        }
       
    }
}
setTimeout(()=>{
    alrcont.innerHTML = ""
}, 4000)
async function getUrls(){
    let data = await ShortUrl(null, "get", "/api/getUrl");
    appendData(data)
}



function appendData(data){
    let tbody = document.querySelector(".tbody");
    if(data.length == 0){
        tbody.innerHTML = "NO DATA AVAILABLE"
        tbody.style.color = "#fff"
    }
    data.forEach((el)=>{
        let tr = document.createElement("tr");
        tbody.innerHTML += `
            <tr>
                <td><a href="${el.longurl}" class="longurl">${el.longurl}</a></td>
                <td>
                    <a href="${el.baseurl}${el.shorturl}" target="_blank">${el.shorturl}</a>
                </td>
                <td>
                    <button data-id="${el.uuid}" class="btn btn-danger delbtn">
                        Del
                    </button>
                </td>
            </tr>
        `
    })
    delUrl()
}



function delUrl(){
    let btn = document.querySelectorAll(".delbtn")

    btn.forEach((dbtn)=>{
        dbtn.onclick = async (e)=>{
            e.preventDefault();
            let id = e.target.dataset.id;
            
            // make request
            let req = await ShortUrl(null, "get", `/api/shorturl/${id}`);
            
            location.reload()
        }
    })
}

addEventListener("load", ()=>{
    sendReq()
    // delUrl()
    getUrls()
})